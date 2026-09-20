import React from 'react';
import { Search, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
import { QuestionType } from '../types';

interface FilterAndTabsProps {
  activeTab: 'all' | QuestionType;
  onTabChange: (tab: 'all' | QuestionType) => void;
  techCount: number;
  hrCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  difficultyFilter: string;
  onDifficultyChange: (d: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

export const FilterAndTabs: React.FC<FilterAndTabsProps> = ({
  activeTab,
  onTabChange,
  techCount,
  hrCount,
  searchQuery,
  onSearchChange,
  difficultyFilter,
  onDifficultyChange,
  onExpandAll,
  onCollapseAll,
}) => {
  return (
    <div className="space-y-4">
      {/* Primary Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div className="flex items-center space-x-2 bg-stone-200/60 p-1 rounded-xl">
          <button
            onClick={() => onTabChange('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Questions ({techCount + hrCount})
          </button>
          <button
            onClick={() => onTabChange('technical')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'technical'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            10 Technical Questions
          </button>
          <button
            onClick={() => onTabChange('hr')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'hr'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            5 HR Questions
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onExpandAll}
            className="text-xs px-2.5 py-1 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 flex items-center space-x-1"
            title="Expand all answers"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            <span>Expand All</span>
          </button>
          <button
            onClick={onCollapseAll}
            className="text-xs px-2.5 py-1 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 flex items-center space-x-1"
            title="Collapse all answers"
          >
            <ChevronUp className="w-3.5 h-3.5" />
            <span>Collapse All</span>
          </button>
        </div>
      </div>

      {/* Search and Secondary Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter questions by topic, keyword, or concept (e.g. HashMap, JVM, STAR, conflict)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 bg-white text-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
          />
          <Search className="w-4 h-4 text-stone-700 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={difficultyFilter}
            onChange={(e) => onDifficultyChange(e.target.value)}
            className="w-full sm:w-44 py-2 px-3 rounded-xl border border-stone-200 bg-white text-stone-700 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Junior / Easy</option>
            <option value="medium">Mid-Level / Medium</option>
            <option value="hard">Senior / Hard</option>
          </select>
        </div>
      </div>

      {/* Quick Topic Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-xs text-stone-500 font-medium mr-1">Filter by Topic:</span>
        {[
          { label: 'All', value: '' },
          { label: 'Error Codes & Debugging', value: 'error' },
          { label: 'JVM & Memory', value: 'jvm' },
          { label: 'Concurrency & Threads', value: 'concurrency' },
          { label: 'Spring Boot', value: 'spring' },
          { label: 'STAR Behavioral', value: 'star' },
        ].map((chip) => {
          const isSelected = chip.value === '' ? searchQuery === '' : searchQuery.toLowerCase().includes(chip.value);
          return (
            <button
              key={chip.label}
              type="button"
              onClick={() => onSearchChange(chip.value)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                isSelected
                  ? 'bg-stone-900 text-white border-stone-900 font-semibold'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
