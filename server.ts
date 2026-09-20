import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI client
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Candidate models in order of latency and availability
const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
  'gemini-flash-latest',
];

// Generate Interview Questions API
app.post('/api/generate-interview', async (req, res) => {
  const { role = 'Java Developer', experienceLevel = 'Mid-Level', focusArea = '' } = req.body;
  const ai = getGenAI();

  if (!ai) {
    return res.status(503).json({
      error: 'API key is not configured. Please verify your GEMINI_API_KEY.',
    });
  }

  const prompt = `You are a Principal Tech Lead and Senior Technical Hiring Manager specializing in software engineering interviews.
Generate a comprehensive, professional interview question package for the role: "${role}".
Target Seniority / Experience Level: "${experienceLevel}".
${focusArea ? `Focus Areas / Specialization: "${focusArea}".` : ''}

Strict requirements:
1. Exactly 10 Technical Questions:
   - Must be rigorous, realistic, and highly relevant to modern engineering for this role.
   - Include questions on core architecture, memory/concurrency, frameworks, plus real-world code snippet debugging, runtime exceptions, and error code troubleshooting (e.g., diagnosing NullPointerException, ConcurrentModificationException, OutOfMemoryError, database connection timeouts, and HTTP status codes).
   - Each technical question must specify a Difficulty Level ("Junior", "Mid-Level", "Senior", or "Lead").
   - Each question must include a comprehensive, in-depth Sample Answer (with code snippets or architecture concepts where applicable).
   - Each question must include 2 to 3 realistic probing Follow-Up Questions that an interviewer would ask next.
   - Include 2 to 3 Key Evaluation Points that distinguish strong candidates from weak ones.

2. Exactly 5 HR / Behavioral Questions:
   - Must focus on real-world engineering teamwork, conflict resolution, production incident & outage handling, prioritizing technical debt under deadlines, and career growth.
   - Each HR question must specify a Difficulty Level ("Easy", "Medium", or "Hard").
   - Each question must include an exemplary Sample Answer formulated using the STAR method (Situation, Task, Action, Result).
   - Each question must include 2 realistic probing Follow-Up Questions.
   - Include 2 to 3 Key Evaluation Points for behavioral evaluation.`;

  const schemaConfig = {
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        role: { type: Type.STRING },
        experienceLevel: { type: Type.STRING },
        focusArea: { type: Type.STRING },
        summary: { type: Type.STRING },
        technicalQuestions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              number: { type: Type.INTEGER },
              difficulty: { type: Type.STRING },
              category: { type: Type.STRING },
              question: { type: Type.STRING },
              sampleAnswer: { type: Type.STRING },
              followUpQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              keyEvaluationPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['number', 'difficulty', 'category', 'question', 'sampleAnswer', 'followUpQuestions'],
          },
        },
        hrQuestions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              number: { type: Type.INTEGER },
              difficulty: { type: Type.STRING },
              category: { type: Type.STRING },
              question: { type: Type.STRING },
              sampleAnswer: { type: Type.STRING },
              followUpQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              keyEvaluationPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['number', 'difficulty', 'category', 'question', 'sampleAnswer', 'followUpQuestions'],
          },
        },
      },
      required: ['role', 'summary', 'technicalQuestions', 'hrQuestions'],
    },
  };

  let lastError: any = null;
  let parsedData: any = null;

  // Try candidate models in order of resilience
  for (const model of CANDIDATE_MODELS) {
    try {
      console.log(`Attempting generation with model: ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: schemaConfig,
      });

      const text = response.text?.trim() || '{}';
      parsedData = JSON.parse(text);
      if (parsedData?.technicalQuestions?.length && parsedData?.hrQuestions?.length) {
        console.log(`Successfully generated using ${model}`);
        break;
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed:`, err.message || err);
      lastError = err;
      // Continue to next fallback model
    }
  }

  // If AI generation succeeded
  if (parsedData && parsedData.technicalQuestions) {
    const technicalQuestions = (parsedData.technicalQuestions || []).map((q: any, index: number) => ({
      ...q,
      id: `tech-${index + 1}`,
      number: index + 1,
      type: 'technical',
      difficulty: q.difficulty || 'Medium',
      followUpQuestions: q.followUpQuestions || [],
      keyEvaluationPoints: q.keyEvaluationPoints || [],
    }));

    const hrQuestions = (parsedData.hrQuestions || []).map((q: any, index: number) => ({
      ...q,
      id: `hr-${index + 1}`,
      number: index + 1,
      type: 'hr',
      difficulty: q.difficulty || 'Medium',
      followUpQuestions: q.followUpQuestions || [],
      keyEvaluationPoints: q.keyEvaluationPoints || [],
    }));

    return res.json({
      role: parsedData.role || role,
      experienceLevel: parsedData.experienceLevel || experienceLevel,
      focusArea: parsedData.focusArea || focusArea,
      totalTechnical: technicalQuestions.length,
      totalHR: hrQuestions.length,
      summary: parsedData.summary || `Generated ${technicalQuestions.length} Technical Questions and ${hrQuestions.length} HR Questions for ${role}.`,
      technicalQuestions,
      hrQuestions,
      generatedAt: new Date().toISOString(),
      isAiGenerated: true,
    });
  }

  // Parse error message cleanly if available
  let friendlyErrorMessage = 'Generation service is temporarily unavailable. Please try again.';
  if (lastError?.message) {
    try {
      const parsedErr = JSON.parse(lastError.message);
      if (parsedErr?.error?.message) {
        friendlyErrorMessage = parsedErr.error.message;
      }
    } catch {
      friendlyErrorMessage = lastError.message;
    }
  }

  console.error('All Gemini models failed:', lastError);
  return res.status(503).json({
    error: friendlyErrorMessage,
  });
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
