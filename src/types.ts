export type QuestionType = 'technical' | 'hr';

export type DifficultyLevel = 'Junior' | 'Mid-Level' | 'Senior' | 'Lead' | 'Easy' | 'Medium' | 'Hard';

export interface InterviewQuestion {
  id: string;
  number: number;
  type: QuestionType;
  question: string;
  difficulty: DifficultyLevel;
  category: string;
  sampleAnswer: string;
  followUpQuestions: string[];
  keyEvaluationPoints?: string[];
}

export interface InterviewPackage {
  role: string;
  experienceLevel?: string;
  focusArea?: string;
  totalTechnical: number;
  totalHR: number;
  summary: string;
  technicalQuestions: InterviewQuestion[];
  hrQuestions: InterviewQuestion[];
  generatedAt: string;
  isAiGenerated?: boolean;
}

export interface GenerationRequest {
  role: string;
  experienceLevel?: string;
  focusArea?: string;
}
