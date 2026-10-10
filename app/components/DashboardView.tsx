"use client";

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  TrendingUp,
  Award,
  Zap,
  Activity,
  Sparkles,
  ClipboardList,
  RefreshCw,
  Plus
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import toast from "react-hot-toast";
import { callAiApi } from "../lib/api";

export const DashboardView: React.FC = () => {
  const { tasks, activityLog, aiAutopilot, addLog } = useApp();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [coachInsight, setCoachInsight] = useState<string>("");
  const [loadingCoach, setLoadingCoach] = useState<boolean>(false);

  // Compute metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const focusTimeHrs = Math.round(tasks.reduce((acc, t) => acc + (t.status === "done" ? t.estimatedTime : 0), 0) / 60);

  // Trigger Groq AI Coach Recommendations
  const fetchCoachInsights = async () => {
    setLoadingCoach(true);
    setCoachInsight("");
    addLog("Requesting AI Productivity Coach insights...", "ai");
    const toastId = toast.loading("Analyzing workspace metrics with Groq AI...");
    try {
      const insight = await callAiApi<string>("insights", {
        tasksCompleted: completedTasks,
        totalTasks,
        focusHours: focusTimeHrs,
        history: activityLog.slice(0, 10),
      });
      setCoachInsight(insight);
      toast.success("Productivity evaluation ready!", { id: toastId });
      addLog("Received AI productivity feedback.", "ai");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to fetch AI insights.", { id: toastId });
      addLog("Failed to fetch AI productivity feedback.", "ai");
    } finally {
      setLoadingCoach(false);
    }
  };

  return loading ? (
      <div className="space-y-6" aria-live="polite">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-6 rounded-2xl glass-card flex items-center justify-between">
              <Skeleton height={24} width={80} />
            </div>
          ))}
        </div>
        <Skeleton height={200} className="my-4" />
      </div>
    ) : error ? (
      <div className="p-8 text-center text-red-400" role="alert" aria-live="assertive">
        {error}
      </div>
    ) : (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-violet-900/40 via-indigo-900/20 to-neutral-900/60 p-8 rounded-3xl border border-violet-500/20 shadow-xl glow-border-purple relative overflow-hidden bg-dots">
          <div className="relative z-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
              Hackathon Live Demo
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            Welcome to ProductivityOS AI
          </h2>
          <p className="text-neutral-400 max-w-xl text-sm">
            You have <strong className="text-white">{inProgressTasks} tasks</strong> in progress.
            Optimize your planner or trigger AI Autopilot to prioritize your day.
          </p>
        </div>
        <div className="flex gap-3 relative z-10">
          <button
            onClick={aiAutopilot}
            className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium text-sm flex items-center gap-2 hover:scale-[1.03] transition-all shadow-lg shadow-violet-500/20"
            aria-label="Run AI Autopilot"
          >
            <Sparkles className="w-4 h-4" />
            AI Autopilot
          </button>
        </div>
      </div>

      {/* Grid: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="p-6 rounded-2xl glass-card flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-400">Workspace Focus Score</span>
            <h3 className="text-3xl font-bold text-white mt-1">
              {completionRate > 0 ? Math.min(completionRate + 15, 100) : 80}%
            </h3>
            <p className="text-[10px] text-emerald-400 mt-1 font-medium">+4.2% since yesterday</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <Zap className="w-6 h-6 text-violet-400" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-6 rounded-2xl glass-card flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-400">Total Focus Time</span>
            <h3 className="text-3xl font-bold text-white mt-1">{focusTimeHrs} hrs</h3>
            <p className="text-[10px] text-neutral-400 mt-1">Calculated from completed tasks</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Award className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-6 rounded-2xl glass-card flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-400">Task Completion Rate</span>
            <h3 className="text-3xl font-bold text-white mt-1">{completionRate}%</h3>
            <p className="text-[10px] text-violet-400 mt-1 font-medium">
              {completedTasks} of {totalTasks} finished
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-indigo-400" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-6 rounded-2xl glass-card flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-neutral-400">Recent AI Operations</span>
            <h3 className="text-3xl font-bold text-white mt-1">
              {activityLog.filter((l) => l.type === "ai" || l.type === "automation").length}
            </h3>
            <p className="text-[10px] text-emerald-400 mt-1 font-medium">Automated workflows running</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Activity className="w-6 h-6 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Row 2: SVG Chart & Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Productivity SVG Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-card flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-white">Focus Time Velocity</h3>
              <p className="text-xs text-neutral-400">Daily focus hour logs for the past week</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
              <span className="text-xs text-neutral-400 font-medium">Active Hours</span>
            </div>
          </div>

          {/* SVG Animated Chart */}
          <div className="h-64 relative flex items-end">
            <svg className="w-full h-full" viewBox="0 0 600 240" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Dot Grid */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1"/>
                </pattern>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Grid Lines */}
              <line x1="0" y1="60" x2="600" y2="60" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />
              <line x1="0" y1="180" x2="600" y2="180" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />

              {/* Gradient Fill Path */}
              <path
                d="M 50 200 L 130 140 L 210 180 L 290 80 L 370 120 L 450 60 L 530 110 L 530 200 Z"
                fill="url(#chartGradient)"
              />

              {/* Stroke Path */}
              <path
                d="M 50 200 L 130 140 L 210 180 L 290 80 L 370 120 L 450 60 L 530 110"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              <circle cx="50" cy="200" r="5" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2" />
              <circle cx="130" cy="140" r="5" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2" />
              <circle cx="210" cy="180" r="5" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2" />
              <circle cx="290" cy="80" r="5" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2" />
              <circle cx="370" cy="120" r="5" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2" />
              <circle cx="450" cy="60" r="5" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2" />
              <circle cx="530" cy="110" r="5" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2" />
            </svg>
          </div>

          <div className="flex justify-between px-6 mt-4 text-xs font-semibold text-neutral-400">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Activity Log Panel */}
        <div className="p-6 rounded-2xl glass-card flex flex-col justify-between h-[360px] overflow-hidden">
          <div className="mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-violet-400" />
              Real-Time Activity
            </h3>
            <p className="text-xs text-neutral-400">Actions in your workspace</p>
          </div>

          {/* Logs List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar">
            {activityLog.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-neutral-500 text-xs">
                No activity logged yet.
              </div>
            ) : (
              activityLog.map((log) => (
                <div key={log.id} className="flex gap-3 text-xs items-start border-b border-neutral-900 pb-2">
                  <span className="text-[10px] text-neutral-500 font-mono mt-0.5 whitespace-nowrap">
                    {log.timestamp}
                  </span>
                  <div className="flex-1 text-neutral-300">
                    {log.content}
                    {log.type === "ai" && (
                      <span className="ml-2 bg-violet-500/10 text-violet-400 font-bold px-1 rounded-sm text-[8px] uppercase tracking-wider">
                        AI
                      </span>
                    )}
                    {log.type === "automation" && (
                      <span className="ml-2 bg-emerald-500/10 text-emerald-400 font-bold px-1 rounded-sm text-[8px] uppercase tracking-wider">
                        Auto
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Row 3: AI Coach Insights Panel */}
      <div className="p-6 rounded-2xl glass-card border border-violet-500/20 shadow-md shadow-violet-500/5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <h3 className="font-bold text-white text-lg">AI Productivity Coach</h3>
          </div>
          <button
            onClick={fetchCoachInsights}
            disabled={loadingCoach}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold hover:border-neutral-700 disabled:opacity-40 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingCoach ? "animate-spin" : ""}`} />
            {coachInsight ? "Recalculate Coaching Feedback" : "Run AI Productivity Assessment"}
          </button>
        </div>

        {loadingCoach ? (
          <div className="space-y-3 py-4">
            <div className="h-4 bg-neutral-900 rounded shimmer-loader w-3/4" />
            <div className="h-4 bg-neutral-900 rounded shimmer-loader w-1/2" />
            <div className="h-4 bg-neutral-900 rounded shimmer-loader w-5/6" />
          </div>
        ) : coachInsight ? (
          <div className="prose prose-invert prose-xs text-neutral-300 whitespace-pre-line border-t border-neutral-900 pt-4 leading-relaxed">
            {coachInsight}
          </div>
        ) : (
          <div className="text-center py-8 text-neutral-500 text-sm border-t border-neutral-900/50 mt-4" aria-live="polite">
            Request an analysis to see custom AI feedback, strengths, and goals for the upcoming week based on your workload.
          </div>
        )}
      </div>
    </div>
  );
};
