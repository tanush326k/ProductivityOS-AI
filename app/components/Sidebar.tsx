"use client";

import React from "react";
import { useApp } from "../context/AppContext";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Bot,
  Mail,
  FileText,
  Settings,
  Users,
  Sparkles,
  Layers
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView } = useApp();

  const menuItems = [
    { id: "dashboard", label: "Insights Dashboard", icon: LayoutDashboard },
    { id: "assistant", label: "AI Personal Assistant", icon: Bot },
    { id: "tasks", label: "AI Task Manager", icon: CheckSquare },
    { id: "planner", label: "Smart Daily Planner", icon: Calendar },
    { id: "notes", label: "Meeting Notes Sync", icon: Layers },
    { id: "email", label: "Email Generator", icon: Mail },
    { id: "docs", label: "Document Summary", icon: FileText },
    { id: "automations", label: "Workflow Automation", icon: Settings },
    { id: "team", label: "Team Workspace", icon: Users },
  ];

  return (
    <aside
      className="w-64 h-full flex flex-col glass-panel border-r border-neutral-800/80 text-neutral-300"
      aria-label="Workspace Navigation"
    >
      {/* Brand Heading */}
      <div className="p-6 border-b border-neutral-800/80 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="font-bold text-lg bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
            ProductivityOS
          </h1>
          <span className="text-[10px] text-violet-400 font-semibold uppercase tracking-wider">
            Enterprise AI
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group text-left ${
                isActive
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/10 scale-[1.02] border border-violet-500/30"
                  : "hover:bg-neutral-800/60 hover:text-white border border-transparent"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? "text-white" : "text-neutral-400 group-hover:text-violet-400"
                }`}
              />
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Profile / Hackathon Footer */}
      <div className="p-4 border-t border-neutral-800/80 bg-neutral-900/30">
        <div className="flex items-center gap-3 p-2 rounded-xl">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-500 to-emerald-500 flex items-center justify-center font-bold text-white text-sm shadow-md">
            HE
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white">Hackathon Admin</h4>
            <p className="text-[10px] text-emerald-400 font-medium">Demo Sandbox Active</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
