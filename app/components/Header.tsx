"use client";

import React from "react";
import { useApp } from "../context/AppContext";
import { Sparkles, CheckCircle2, Zap } from "lucide-react";

export const Header: React.FC = () => {
  const { activeView, tasks } = useApp();

  const viewTitles: Record<string, string> = {
    dashboard: "Productivity Insights Dashboard",
    assistant: "AI Workspace Assistant",
    tasks: "AI Task Board & Kanban",
    planner: "Smart Daily Planner",
    notes: "AI Productivity Studio",
    docs: "AI Productivity Studio",
    email: "AI Productivity Studio",
    studio: "AI Productivity Studio",
  };

  const completedCount = tasks.filter((t) => t.status === "done").length;

  return (
    <header className="h-20 border-b border-neutral-800/80 px-8 flex items-center justify-between glass-panel sticky top-0 z-30">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white capitalize bg-gradient-to-r from-white via-neutral-100 to-neutral-300 bg-clip-text text-transparent">
          {viewTitles[activeView] || "Productivity Workspace"}
        </h2>
        <p className="text-xs text-neutral-400">
          Accelerated focus & task velocity powered by Groq & OpenAI gpt-oss-120b.
        </p>
      </div>

      {/* Metrics & Badges */}
      <div className="flex items-center gap-4 text-sm">
        {/* Task Metric */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs text-neutral-400 font-medium">
            Done:{" "}
            <strong className="text-emerald-400">
              {completedCount}/{tasks.length}
            </strong>
          </span>
        </div>

        {/* AI Status Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Groq gpt-oss-120b Active
          </span>
        </div>
      </div>
    </header>
  );
};
