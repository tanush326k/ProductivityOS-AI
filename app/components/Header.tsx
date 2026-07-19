"use client";

import React from "react";
import { useApp } from "../context/AppContext";
import { Sparkles, CheckCircle2, ShieldAlert, Cpu } from "lucide-react";

export const Header: React.FC = () => {
  const { activeView, tasks, automations } = useApp();

  const viewTitles: Record<string, string> = {
    dashboard: "Productivity Insights Dashboard",
    assistant: "AI Personal Assistant & Agent",
    tasks: "AI Task Manager & Board",
    planner: "Smart Daily Planner",
    notes: "Meeting Notes Summarizer & Sync",
    email: "Professional Email Generator",
    docs: "Document summarizer tool",
    automations: "Workflow Automation rules",
    team: "Collaborative Team Workspace",
  };

  const completedCount = tasks.filter((t) => t.status === "done").length;
  const activeAutosCount = automations.filter((a) => a.active).length;

  return (
    <header className="h-20 border-b border-neutral-800/80 px-8 flex items-center justify-between glass-panel sticky top-0 z-30">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white capitalize bg-gradient-to-r from-white via-neutral-100 to-neutral-300 bg-clip-text text-transparent">
          {viewTitles[activeView] || "Productivity Workspace"}
        </h2>
        <p className="text-xs text-neutral-400">
          Streamlining focus and task velocity using GenAI.
        </p>
      </div>

      {/* Metrics & Badges */}
      <div className="flex items-center gap-6 text-sm">
        {/* Active Rules Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800">
          <Cpu className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-xs text-neutral-400 font-medium">
            Automations: <strong className="text-violet-400">{activeAutosCount}</strong>
          </span>
        </div>

        {/* Task Metric */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs text-neutral-400 font-medium">
            Completed:{" "}
            <strong className="text-emerald-400">
              {completedCount}/{tasks.length}
            </strong>
          </span>
        </div>

        {/* Gemini Status Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Gemini 2.5 Active
          </span>
        </div>
      </div>
    </header>
  );
};
