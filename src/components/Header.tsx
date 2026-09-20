import React from 'react';
import { Sparkles, BookOpen, Layers, Award, Printer, Eye, EyeOff } from 'lucide-react';

interface HeaderProps {
  role: string;
  totalTech: number;
  totalHR: number;
  practiceMode: boolean;
  onTogglePracticeMode: () => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  totalTech,
  totalHR,
  practiceMode,
  onTogglePracticeMode,
  onPrint,
}) => {
  return (
    <header className="border-b border-stone-200 bg-stone-50/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-serif font-bold text-xl shadow-sm">
            Q
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight font-serif">
                Interview Prep Kit
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                <Sparkles className="w-3 h-3 mr-1" />
                {role}
              </span>
            </div>
            <p className="text-xs text-stone-700 hidden sm:block">
              {totalTech} Technical Questions · {totalHR} HR Questions · Difficulty Ratings · Model Answers · Follow-ups
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onTogglePracticeMode}
            id="toggle-practice-mode-btn"
            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              practiceMode
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
            }`}
            title="Hide answers by default to test your own knowledge first"
          >
            {practiceMode ? (
              <>
                <EyeOff className="w-3.5 h-3.5 mr-1.5" />
                Practice Mode ON
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 mr-1.5" />
                Study Mode
              </>
            )}
          </button>

          <button
            onClick={onPrint}
            id="print-sheet-btn"
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border border-stone-300 bg-white text-stone-700 hover:bg-stone-100 transition-colors"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            <span className="hidden sm:inline">Export / Print</span>
          </button>
        </div>
      </div>
    </header>
  );
};
