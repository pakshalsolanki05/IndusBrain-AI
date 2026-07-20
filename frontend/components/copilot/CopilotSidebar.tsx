"use client";

import {
  FileText,
  Brain,
  GitBranch,
  Sparkles,
  Lightbulb,
} from "lucide-react";

interface CopilotSidebarProps {
  documentCount?: number;
  entityCount?: number;
  relationshipCount?: number;
  onPromptClick: (prompt: string) => void;
}

const prompts = [
  "Summarize all uploaded documents",
  "Compare maintenance manuals",
  "Find all financial risks",
  "List all organizations mentioned",
  "Explain the most important entities",
  "Which technologies appear most frequently?",
];

export default function CopilotSidebar({
  documentCount = 0,
  entityCount = 0,
  relationshipCount = 0,
  onPromptClick,
}: CopilotSidebarProps) {
  return (
    <div className="space-y-6">

      {/* Enterprise Insights */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">

        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold dark:text-white">
            Enterprise Insights
          </h2>
        </div>

        <div className="space-y-4">

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-500" />
              <span className="text-sm dark:text-slate-200">
                Documents
              </span>
            </div>

            <span className="font-bold text-blue-600">
              {documentCount}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-slate-500" />
              <span className="text-sm dark:text-slate-200">
                Entities
              </span>
            </div>

            <span className="font-bold text-blue-600">
              {entityCount}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-slate-500" />
              <span className="text-sm dark:text-slate-200">
                Relationships
              </span>
            </div>

            <span className="font-bold text-blue-600">
              {relationshipCount}
            </span>
          </div>

        </div>
      </div>

      {/* Suggested Prompts */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">

        <div className="mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-semibold dark:text-white">
            Suggested Prompts
          </h2>
        </div>

        <div className="space-y-3">

          {prompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onPromptClick(prompt)}
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                p-3
                text-left
                text-sm
                transition-all
                hover:border-blue-300
                hover:bg-blue-50
                dark:border-slate-700
                dark:bg-slate-800
                dark:hover:bg-slate-700
              "
            >
              {prompt}
            </button>
          ))}

        </div>

      </div>

      {/* AI Capabilities */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-600 to-indigo-600 p-5 text-white shadow-sm">

        <h2 className="mb-3 text-lg font-semibold">
          IndusBrain AI
        </h2>

        <ul className="space-y-2 text-sm opacity-90">
          <li>✓ Cross-document reasoning</li>
          <li>✓ Enterprise knowledge search</li>
          <li>✓ AI-powered document analysis</li>
          <li>✓ Knowledge graph exploration</li>
          <li>✓ Context-aware responses</li>
        </ul>

      </div>

    </div>
  );
}