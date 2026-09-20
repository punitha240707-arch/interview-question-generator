import React, { useState } from 'react';
import { Search, Sparkles, RefreshCw, SlidersHorizontal, CheckCircle2 } from 'lucide-react';

interface RoleInputBarProps {
  currentRole: string;
  currentLevel: string;
  onGenerate: (role: string, level: string, focus: string) => void;
  isLoading: boolean;
  onResetDefault: () => void;
}

const PRESET_ROLES = [
  'Java Developer',
  'Senior Java Architect',
  'Spring Boot Microservices Engineer',
  'Full Stack Java & React Developer',
  'Java Backend / Concurrency Specialist',
];

const EXPERIENCE_LEVELS = [
  'Junior (0-2 Yrs)',
  'Mid-Level (3-5 Yrs)',
  'Senior (6-9 Yrs)',
  'Lead / Principal (10+ Yrs)',
];

export const RoleInputBar: React.FC<RoleInputBarProps> = ({
  currentRole,
  currentLevel,
  onGenerate,
  isLoading,
  onResetDefault,
}) => {
  const [roleInput, setRoleInput] = useState(currentRole);
  const [levelSelect, setLevelSelect] = useState(currentLevel);
  const [focusArea, setFocusArea] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleInput.trim()) return;
    onGenerate(roleInput.trim(), levelSelect, focusArea.trim());
  };

  const handleSelectPreset = (preset: string) => {
    setRoleInput(preset);
    if (preset === 'Java Developer') {
      onResetDefault();
    } else {
      onGenerate(preset, levelSelect, focusArea.trim());
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <label htmlFor="role-input" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Target Job Role / Profile
            </label>
            <div className="relative">
              <input
                id="role-input"
                type="text"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                placeholder="e.g. Java Developer, Spring Boot Specialist..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all font-medium text-sm sm:text-base"
                required
              />
              <Search className="w-4 h-4 text-stone-700 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="w-full md:w-56">
            <label htmlFor="level-select" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Experience Level
            </label>
            <select
              id="level-select"
              value={levelSelect}
              onChange={(e) => setLevelSelect(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-stone-300 text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-sm font-medium"
            >
              {EXPERIENCE_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2 pt-2 md:pt-0">
            <button
              type="submit"
              id="generate-questions-btn"
              disabled={isLoading || !roleInput.trim()}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-white font-medium text-sm flex items-center justify-center space-x-2 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Generating Kit...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Generate Questions</span>
                </>
              )}
            </button>

            <button
              type="button"
              id="toggle-advanced-btn"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="p-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 transition-colors"
              title="Advanced focus options"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showAdvanced && (
          <div className="pt-2 border-t border-stone-100">
            <label htmlFor="focus-input" className="block text-xs font-medium text-stone-700 mb-1">
              Specific Technical Focus / Skills (Optional)
            </label>
            <input
              id="focus-input"
              type="text"
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              placeholder="e.g. JVM internals, Concurrency, Spring Cloud, Kafka, Docker & Kubernetes, Low-latency"
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-stone-900 bg-stone-50/50 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-stone-700 font-medium mr-1">Quick Select:</span>
          {PRESET_ROLES.map((preset) => {
            const isSelected = currentRole.toLowerCase() === preset.toLowerCase();
            return (
              <button
                key={preset}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                  isSelected
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 font-medium'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                }`}
              >
                {isSelected && <CheckCircle2 className="w-3 h-3 text-amber-700 mr-1 inline" />}
                <span>{preset}</span>
              </button>
            );
          })}
        </div>
      </form>
    </div>
  );
};
