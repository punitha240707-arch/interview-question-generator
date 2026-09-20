import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Volume2,
  VolumeX,
  HelpCircle,
  Award,
  Lightbulb,
  CheckCircle,
} from 'lucide-react';
import { InterviewQuestion } from '../types';

interface QuestionCardProps {
  question: InterviewQuestion;
  practiceMode: boolean;
  isExpandedDefault?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  practiceMode,
  isExpandedDefault = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(!practiceMode || isExpandedDefault);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMastered, setIsMastered] = useState(false);

  // Sync with practice mode changes
  React.useEffect(() => {
    if (practiceMode) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  }, [practiceMode]);

  const handleCopy = async () => {
    const textToCopy = `Question #${question.number} [${question.type.toUpperCase()}] (${question.difficulty}):
${question.question}

Category: ${question.category}

Sample Answer:
${question.sampleAnswer}

Follow-up Questions:
${question.followUpQuestions.map((q, idx) => `${idx + 1}. ${q}`).join('\n')}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const hasSpeech = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const handleToggleSpeak = () => {
    try {
      if (!hasSpeech) return;

      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      window.speechSynthesis.cancel();
      const text = isExpanded
        ? `${question.question}. Here is a sample answer: ${question.sampleAnswer.replace(/[`*#]/g, '')}`
        : question.question;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis unavailable:', err);
      setIsSpeaking(false);
    }
  };

  // Difficulty badge styling
  const getDifficultyBadge = (diff: string) => {
    const lower = diff.toLowerCase();
    if (lower.includes('easy') || lower.includes('junior')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (lower.includes('hard') || lower.includes('senior') || lower.includes('lead')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <div
      id={`question-${question.type}-${question.number}`}
      className={`border rounded-2xl transition-all duration-200 ${
        isMastered
          ? 'bg-stone-50/70 border-stone-200'
          : 'bg-white border-stone-200 shadow-2xs hover:border-stone-300'
      }`}
    >
      {/* Header Bar */}
      <div className="p-5 sm:p-6 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${
                question.type === 'technical'
                  ? 'bg-stone-900 text-white'
                  : 'bg-amber-700 text-white'
              }`}
            >
              #{question.number}
            </span>

            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                question.type === 'technical'
                  ? 'bg-stone-100 text-stone-700'
                  : 'bg-amber-100 text-amber-900'
              }`}
            >
              {question.type === 'technical' ? 'Technical' : 'HR & Behavioral'}
            </span>

            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-md border ${getDifficultyBadge(
                question.difficulty
              )}`}
            >
              Difficulty: {question.difficulty}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 text-stone-700">
            <button
              onClick={() => setIsMastered(!isMastered)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isMastered
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                  : 'hover:bg-stone-100 border-transparent text-stone-600'
              }`}
              title={isMastered ? 'Marked as Practiced' : 'Mark as Practiced'}
            >
              <CheckCircle className="w-4 h-4" />
            </button>

            {hasSpeech && (
              <button
                onClick={handleToggleSpeak}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isSpeaking
                    ? 'bg-amber-100 text-amber-700 border-amber-300'
                    : 'hover:bg-stone-100 border-transparent text-stone-600'
                }`}
                title={isSpeaking ? 'Stop speech' : 'Listen aloud'}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            )}

            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors text-stone-600 border border-transparent hover:border-stone-200"
              title="Copy Question & Sample Answer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Question Text */}
        <h3 className="text-base sm:text-lg font-semibold text-stone-900 leading-snug tracking-tight">
          {question.question}
        </h3>

        <div className="mt-2 flex items-center justify-between text-xs text-stone-700">
          <span className="font-medium bg-stone-100 px-2 py-0.5 rounded text-stone-700">
            Topic: {question.category}
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center space-x-1 text-stone-700 hover:text-stone-900 font-medium cursor-pointer"
          >
            <span>{isExpanded ? 'Hide Answer & Follow-ups' : 'Show Answer & Follow-ups'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Answer & Follow-up Details */}
      {isExpanded ? (
        <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-stone-100 space-y-4">
          {/* Sample Answer */}
          <div className="bg-stone-50 rounded-xl p-4 sm:p-5 border border-stone-200/80">
            <div className="flex items-center space-x-2 text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>Sample Model Answer</span>
            </div>
            <div className="text-sm text-stone-800 leading-relaxed whitespace-pre-line font-normal space-y-2">
              {question.sampleAnswer}
            </div>
          </div>

          {/* Follow-up Questions */}
          {question.followUpQuestions && question.followUpQuestions.length > 0 && (
            <div className="bg-amber-50/50 rounded-xl p-4 sm:p-5 border border-amber-200/70">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-900 uppercase tracking-wider mb-2.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                <span>Follow-Up Questions Expected in Interview</span>
              </div>
              <ul className="space-y-2 text-sm text-stone-800">
                {question.followUpQuestions.map((followUp, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="inline-block w-4 h-4 rounded-full bg-amber-200/70 text-amber-800 text-[10px] font-bold text-center leading-4 mt-0.5 shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{followUp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Evaluation Points */}
          {question.keyEvaluationPoints && question.keyEvaluationPoints.length > 0 && (
            <div className="bg-stone-100/70 rounded-xl p-3.5 sm:p-4 border border-stone-200 text-xs">
              <div className="flex items-center space-x-1.5 font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                <Award className="w-3.5 h-3.5 text-stone-500" />
                <span>Interviewer Evaluation Criteria</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {question.keyEvaluationPoints.map((point, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-1 rounded-md bg-white border border-stone-200 text-stone-700 text-xs font-medium"
                  >
                    ✓ {point}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : practiceMode ? (
        <div className="px-5 sm:px-6 pb-4 pt-1 border-t border-dashed border-stone-200">
          <div className="py-3 text-center">
            <p className="text-xs text-stone-700 italic mb-2">
              Practice Mode active: formulate your response mentally or on paper before revealing the answer.
            </p>
            <button
              onClick={() => setIsExpanded(true)}
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              Reveal Sample Answer & Follow-ups
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
