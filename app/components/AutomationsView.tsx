"use client";

import React, { useState } from "react";
import { useApp, Automation } from "../context/AppContext";
import {
  Settings,
  Plus,
  Trash2,
  Cpu,
  Power,
  Play,
  Activity,
  Sparkles,
  X,
  Info
} from "lucide-react";

export const AutomationsView: React.FC = () => {
  const {
    automations,
    addAutomation,
    toggleAutomation,
    deleteAutomation,
    simulateTrigger
  } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loadingSim, setLoadingSim] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState<Automation["trigger"]>("task_completed");
  const [action, setAction] = useState<Automation["action"]>("draft_email");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addAutomation(name, trigger, action);
    setName("");
    setIsAddOpen(false);
  };

  const runSimulation = async (trig: Automation["trigger"], detail: string) => {
    setLoadingSim(trig);
    await simulateTrigger(trig, detail);
    setLoadingSim(null);
  };

  const getTriggerText = (trig: Automation["trigger"]) => {
    switch (trig) {
      case "task_created":
        return "When new task is created";
      case "task_completed":
        return "When task transitions to Done";
      case "meeting_summarized":
        return "When meeting notes are summarized";
      default:
        return trig;
    }
  };

  const getActionText = (act: Automation["action"]) => {
    switch (act) {
      case "draft_email":
        return "Auto-draft notification email copy";
      case "add_to_planner":
        return "Create 60m calendar blocking event";
      case "raise_priority":
        return "Escalate project priority to Urgent";
      default:
        return act;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-slide-up">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">Workflow Automation</h3>
          <p className="text-xs text-neutral-400">
            Define system recipes. Let background triggers kickstart email copywriting or planner scheduling.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-2 text-sm font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-violet-500/10"
        >
          <Plus className="w-4 h-4" />
          Create Rule
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rules index list */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="font-bold text-white text-base flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-violet-400" />
            Active Automation Rules
          </h4>

          {automations.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-neutral-800 rounded-2xl text-neutral-500 italic text-sm">
              No automation rules created yet.
            </div>
          ) : (
            automations.map((rule) => (
              <div
                key={rule.id}
                className="p-5 rounded-2xl glass-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-sm text-neutral-200">{rule.name}</span>
                    <span
                      className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider border ${
                        rule.active
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-neutral-800 text-neutral-500 border-neutral-700"
                      }`}
                    >
                      {rule.active ? "Active" : "Disabled"}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    <strong className="text-violet-400">Trigger:</strong> {getTriggerText(rule.trigger)}
                  </p>
                  <p className="text-xs text-neutral-400">
                    <strong className="text-emerald-400">Action:</strong> {getActionText(rule.action)}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <button
                    onClick={() => toggleAutomation(rule.id)}
                    className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all ${
                      rule.active
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                        : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                    }`}
                    aria-label={`Toggle rule ${rule.name}`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    {rule.active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => deleteAutomation(rule.id)}
                    className="p-2 rounded-xl bg-neutral-950 hover:bg-red-500/10 border border-neutral-800 hover:border-red-500/20 text-neutral-500 hover:text-red-400"
                    aria-label={`Delete rule ${rule.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Automation Sandbox Simulator */}
        <div className="p-6 rounded-2xl glass-card space-y-6">
          <div>
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-violet-400" />
              Developer Sandbox
            </h4>
            <p className="text-xs text-neutral-400">
              Simulate events to test automation logic locally.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => runSimulation("task_completed", "Design landing page wireframes")}
              disabled={!!loadingSim}
              className="w-full p-4 bg-neutral-950 hover:bg-neutral-850 border border-neutral-850 rounded-xl flex items-center justify-between text-left text-xs font-bold text-neutral-200 transition-all disabled:opacity-40"
            >
              <span className="space-y-0.5">
                <span>Simulate: Task Transitions to Done</span>
                <span className="block font-normal text-[10px] text-neutral-500">
                  Target: "Design landing page wireframes"
                </span>
              </span>
              <Play className={`w-4 h-4 text-violet-400 ${loadingSim === "task_completed" ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={() => runSimulation("task_created", "Write compliance test suites")}
              disabled={!!loadingSim}
              className="w-full p-4 bg-neutral-950 hover:bg-neutral-850 border border-neutral-850 rounded-xl flex items-center justify-between text-left text-xs font-bold text-neutral-200 transition-all disabled:opacity-40"
            >
              <span className="space-y-0.5">
                <span>Simulate: Task is Created</span>
                <span className="block font-normal text-[10px] text-neutral-500">
                  Target: "Write compliance test suites"
                </span>
              </span>
              <Play className={`w-4 h-4 text-violet-400 ${loadingSim === "task_created" ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Help box */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-900 flex gap-3 text-[10px] text-neutral-400 leading-normal select-none">
            <Info className="w-4 h-4 text-neutral-500 shrink-0" />
            <span>
              When simulation runs, look at the AI Assistant chat window or workspace logs to verify generated outputs.
            </span>
          </div>
        </div>
      </div>

      {/* Modal: Create Automation */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-lg font-bold text-white mb-4">Create Automation Rule</h4>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">
                  Rule Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl p-3 text-sm text-white bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-violet-500"
                  placeholder="Auto-notify teammates on launch..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">
                  If Trigger Occurs
                </label>
                <select
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value as Automation["trigger"])}
                  className="w-full rounded-xl p-3 text-sm text-white bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-violet-500"
                >
                  <option value="task_completed">When task is completed (Done)</option>
                  <option value="task_created">When task is created (To Do)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">
                  Then Perform Action
                </label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value as Automation["action"])}
                  className="w-full rounded-xl p-3 text-sm text-white bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-violet-500"
                >
                  <option value="draft_email">Auto-draft notification email copy</option>
                  <option value="add_to_planner">Create 60m calendar blocking event</option>
                  <option value="raise_priority">Escalate project priority to Urgent</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold shadow-lg shadow-violet-500/10"
                >
                  Create Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
