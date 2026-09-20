import React, { useState } from 'react';
import { X, Copy, Check, Download, Printer, FileText } from 'lucide-react';
import { InterviewPackage } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  interviewData: InterviewPackage;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  interviewData,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdown = () => {
    let md = `# Interview Preparation Kit: ${interviewData.role}\n`;
    md += `**Target Seniority:** ${interviewData.experienceLevel || 'Mid-Level'}\n`;
    md += `**Date:** ${new Date(interviewData.generatedAt).toLocaleDateString()}\n`;
    md += `\n---\n\n`;
    md += `## Part 1: 10 Technical Questions\n\n`;

    interviewData.technicalQuestions.forEach((q) => {
      md += `### #${q.number}. ${q.question}\n`;
      md += `**Difficulty:** ${q.difficulty} | **Category:** ${q.category}\n\n`;
      md += `#### Sample Answer:\n${q.sampleAnswer}\n\n`;
      md += `#### Follow-up Questions:\n`;
      q.followUpQuestions.forEach((f, idx) => {
        md += `${idx + 1}. ${f}\n`;
      });
      if (q.keyEvaluationPoints && q.keyEvaluationPoints.length > 0) {
        md += `\n#### Evaluation Criteria:\n`;
        q.keyEvaluationPoints.forEach((p) => {
          md += `- ${p}\n`;
        });
      }
      md += `\n---\n\n`;
    });

    md += `## Part 2: 5 HR & Behavioral Questions\n\n`;
    interviewData.hrQuestions.forEach((q) => {
      md += `### #${q.number}. ${q.question}\n`;
      md += `**Difficulty:** ${q.difficulty} | **Category:** ${q.category}\n\n`;
      md += `#### Sample Answer:\n${q.sampleAnswer}\n\n`;
      md += `#### Follow-up Questions:\n`;
      q.followUpQuestions.forEach((f, idx) => {
        md += `${idx + 1}. ${f}\n`;
      });
      if (q.keyEvaluationPoints && q.keyEvaluationPoints.length > 0) {
        md += `\n#### Evaluation Criteria:\n`;
        q.keyEvaluationPoints.forEach((p) => {
          md += `- ${p}\n`;
        });
      }
      md += `\n---\n\n`;
    });

    return md;
  };

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(generateMarkdown());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${interviewData.role.toLowerCase().replace(/\s+/g, '-')}-interview-questions.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Export Interview Prep Kit
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-100 text-stone-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-stone-600 mt-3 mb-6">
          Export all 10 Technical Questions and 5 HR Questions, complete with difficulty levels, sample answers, and follow-ups.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleCopyMarkdown}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-800 text-sm font-medium transition-colors"
          >
            <span className="flex items-center space-x-2">
              <Copy className="w-4 h-4 text-stone-500" />
              <span>Copy Full Markdown to Clipboard</span>
            </span>
            {copied ? (
              <span className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </span>
            ) : (
              <span className="text-xs text-stone-400">For Notion / Obsidian</span>
            )}
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-800 text-sm font-medium transition-colors"
          >
            <span className="flex items-center space-x-2">
              <Download className="w-4 h-4 text-stone-500" />
              <span>Download as .md File</span>
            </span>
            <span className="text-xs text-stone-400">File download</span>
          </button>

          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-800 text-sm font-medium transition-colors"
          >
            <span className="flex items-center space-x-2">
              <Printer className="w-4 h-4 text-stone-500" />
              <span>Print / Save as PDF</span>
            </span>
            <span className="text-xs text-stone-400">Print dialog</span>
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
