/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { defaultJavaInterviewData } from './data/defaultJavaData';
import { InterviewPackage, QuestionType, InterviewQuestion } from './types';
import { Header } from './components/Header';
import { RoleInputBar } from './components/RoleInputBar';
import { FilterAndTabs } from './components/FilterAndTabs';
import { QuestionCard } from './components/QuestionCard';
import { ExportModal } from './components/ExportModal';
import {
  Code2,
  Users,
  Sparkles,
  AlertCircle,
  HelpCircle,
  BookCheck,
  Zap,
} from 'lucide-react';

export default function App() {
  const [interviewData, setInterviewData] = useState<InterviewPackage>(defaultJavaInterviewData);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters & Practice Mode
  const [activeTab, setActiveTab] = useState<'all' | QuestionType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [practiceMode, setPracticeMode] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [forceExpandState, setForceExpandState] = useState<boolean | null>(null);

  // Reset to default Java Developer data
  const handleResetDefault = () => {
    setInterviewData(defaultJavaInterviewData);
    setErrorMessage(null);
  };

  // Generate new questions using Gemini API server endpoint
  const handleGenerate = async (role: string, experienceLevel: string, focusArea: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, experienceLevel, focusArea }),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || `Generation failed with status ${response.status}`);
      }

      const data: InterviewPackage = await response.json();
      setInterviewData(data);
    } catch (err: any) {
      console.error('Generation error:', err);
      let userFriendlyMsg = 'The AI model experienced high temporary demand. You can continue practicing with the curated Java Developer questions or retry in a moment.';
      if (typeof err.message === 'string') {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed?.error?.message) {
            userFriendlyMsg = parsed.error.message;
          }
        } catch {
          if (err.message && !err.message.includes('{"')) {
            userFriendlyMsg = err.message;
          }
        }
      }
      setErrorMessage(userFriendlyMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter questions
  const filterList = (questions: InterviewQuestion[]) => {
    return questions.filter((q) => {
      // Difficulty match
      if (difficultyFilter !== 'all') {
        const d = q.difficulty.toLowerCase();
        if (difficultyFilter === 'easy' && !d.includes('easy') && !d.includes('junior')) {
          return false;
        }
        if (difficultyFilter === 'medium' && !d.includes('medium') && !d.includes('mid')) {
          return false;
        }
        if (
          difficultyFilter === 'hard' &&
          !d.includes('hard') &&
          !d.includes('senior') &&
          !d.includes('lead')
        ) {
          return false;
        }
      }

      // Search match
      if (searchQuery.trim()) {
        const term = searchQuery.toLowerCase();
        const matchesQuestion = q.question.toLowerCase().includes(term);
        const matchesCategory = q.category.toLowerCase().includes(term);
        const matchesAnswer = q.sampleAnswer.toLowerCase().includes(term);
        const matchesFollowups = q.followUpQuestions.some((f) => f.toLowerCase().includes(term));

        if (!matchesQuestion && !matchesCategory && !matchesAnswer && !matchesFollowups) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredTechnical = useMemo(
    () => filterList(interviewData.technicalQuestions),
    [interviewData.technicalQuestions, difficultyFilter, searchQuery]
  );

  const filteredHR = useMemo(
    () => filterList(interviewData.hrQuestions),
    [interviewData.hrQuestions, difficultyFilter, searchQuery]
  );

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 font-sans antialiased selection:bg-amber-100 selection:text-amber-900 pb-16">
      {/* Top Header */}
      <Header
        role={interviewData.role}
        totalTech={interviewData.technicalQuestions.length}
        totalHR={interviewData.hrQuestions.length}
        practiceMode={practiceMode}
        onTogglePracticeMode={() => setPracticeMode(!practiceMode)}
        onPrint={() => setIsExportOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        {/* Role Input and Generation Bar */}
        <RoleInputBar
          currentRole={interviewData.role}
          currentLevel={interviewData.experienceLevel || 'Mid-Level'}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          onResetDefault={handleResetDefault}
        />

        {/* Error notification if API failed */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Notice</p>
                <p className="mt-0.5 text-amber-800">{errorMessage}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleResetDefault}
                className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 font-medium text-xs hover:bg-amber-100 transition-colors"
              >
                Reset to Java Developer Kit
              </button>
              <button
                onClick={() => setErrorMessage(null)}
                className="px-2.5 py-1.5 text-amber-700 hover:text-amber-900 text-xs font-semibold"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Summary Card / Role Overview */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                  Ready Interview Kit
                </span>
                {interviewData.isAiGenerated && (
                  <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200 flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Generated
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 mt-1.5">
                {interviewData.role} Interview Questions & Answers
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl">
                {interviewData.summary}
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center space-x-1 text-xs text-stone-500 mb-0.5">
                  <Code2 className="w-3.5 h-3.5 text-stone-700" />
                  <span>Technical</span>
                </div>
                <div className="text-lg sm:text-xl font-bold font-serif text-stone-900">
                  {interviewData.technicalQuestions.length}
                </div>
                <div className="text-[10px] text-stone-600">Questions</div>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center space-x-1 text-xs text-stone-500 mb-0.5">
                  <Users className="w-3.5 h-3.5 text-amber-700" />
                  <span>HR / Behavioral</span>
                </div>
                <div className="text-lg sm:text-xl font-bold font-serif text-stone-900">
                  {interviewData.hrQuestions.length}
                </div>
                <div className="text-[10px] text-stone-600">Questions</div>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center space-x-1 text-xs text-stone-500 mb-0.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Difficulty</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-stone-900 mt-1">
                  Tiered
                </div>
                <div className="text-[10px] text-stone-600">Easy / Med / Hard</div>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center space-x-1 text-xs text-stone-500 mb-0.5">
                  <BookCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Follow-ups</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-stone-900 mt-1">
                  2-3 Each
                </div>
                <div className="text-[10px] text-stone-600">Probing Drills</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Section Selector */}
        <FilterAndTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          techCount={interviewData.technicalQuestions.length}
          hrCount={interviewData.hrQuestions.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          difficultyFilter={difficultyFilter}
          onDifficultyChange={setDifficultyFilter}
          onExpandAll={() => {
            setPracticeMode(false);
            setForceExpandState(true);
          }}
          onCollapseAll={() => {
            setForceExpandState(false);
          }}
        />

        {/* Questions Display Grid / Sections */}
        <div className="space-y-8">
          {/* Technical Questions Section */}
          {(activeTab === 'all' || activeTab === 'technical') && (
            <section className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-stone-900 text-white flex items-center justify-center text-xs font-bold">
                    <Code2 className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900">
                    10 Technical Questions
                  </h3>
                  <span className="text-xs text-stone-500">
                    ({filteredTechnical.length} shown)
                  </span>
                </div>
                <span className="text-xs font-medium text-stone-500">
                  JVM, Collections, Concurrency, Spring Boot, Microservices
                </span>
              </div>

              {filteredTechnical.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-sm">
                  No technical questions matched your current filter criteria.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredTechnical.map((q) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      practiceMode={practiceMode}
                      isExpandedDefault={forceExpandState === true}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* HR Questions Section */}
          {(activeTab === 'all' || activeTab === 'hr') && (
            <section className="space-y-4 pt-2">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-700 text-white flex items-center justify-center text-xs font-bold">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900">
                    5 HR & Behavioral Questions
                  </h3>
                  <span className="text-xs text-stone-500">
                    ({filteredHR.length} shown)
                  </span>
                </div>
                <span className="text-xs font-medium text-amber-800">
                  STAR Method, Conflict, Outage Handling, Technical Debt
                </span>
              </div>

              {filteredHR.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-sm">
                  No HR questions matched your current filter criteria.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredHR.map((q) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      practiceMode={practiceMode}
                      isExpandedDefault={forceExpandState === true}
                    />
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      {/* Export / Print Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        interviewData={interviewData}
      />
    </div>
  );
}
