"use client";

import React, { useState } from "react";
import { useApp, Task, Subtask } from "../context/AppContext";
import {
  Sparkles,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Tag,
  User,
  X,
  PlusSquare,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle,
  HelpCircle
} from "lucide-react";

export const TaskBoard: React.FC = () => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    aiAutopilot,
    generateSubtasks,
    addLog
  } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loadingSubtasks, setLoadingSubtasks] = useState(false);
  const [runningAutopilot, setRunningAutopilot] = useState(false);

  // New task form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [dueDate, setDueDate] = useState("");
  const [assignee, setAssignee] = useState("Unassigned");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({
      title,
      description,
      status: "todo",
      priority,
      dueDate: dueDate || new Date().toISOString().split("T")[0],
      assignee,
      estimatedTime: 60, // default
    });
    // Reset
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    setAssignee("Unassigned");
    setIsAddOpen(false);
  };

  const handleSubtaskToggle = (task: Task, subtaskId: string, completed: boolean) => {
    const updatedSubtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed } : st
    );
    updateTask(task.id, { subtasks: updatedSubtasks });
  };

  const triggerAIAutopilot = async () => {
    setRunningAutopilot(true);
    await aiAutopilot();
    setRunningAutopilot(false);
  };

  const triggerSubtasksGen = async (taskId: string) => {
    setLoadingSubtasks(true);
    await generateSubtasks(taskId);
    // Refresh selectedTask local state to show new subtasks
    const fresh = tasks.find((t) => t.id === taskId);
    if (fresh) setSelectedTask(fresh);
    setLoadingSubtasks(false);
  };

  // Columns layout
  const columns: Array<{ id: Task["status"]; label: string; bg: string }> = [
    { id: "todo", label: "To Do", bg: "border-t-slate-500" },
    { id: "in_progress", label: "In Progress", bg: "border-t-violet-500" },
    { id: "review", label: "Under Review", bg: "border-t-amber-500" },
    { id: "done", label: "Completed", bg: "border-t-emerald-500" },
  ];

  const getPriorityColor = (p: Task["priority"]) => {
    switch (p) {
      case "low":
        return "bg-neutral-800 text-neutral-400 border-neutral-700/50";
      case "medium":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "high":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "urgent":
        return "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse";
      default:
        return "bg-neutral-800 text-neutral-400 border-neutral-700/50";
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-slide-up">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">Task Board</h3>
          <p className="text-xs text-neutral-400">
            Click tasks to manage subtasks, add priorities, or run AI breakdowns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={triggerAIAutopilot}
            disabled={runningAutopilot || tasks.length === 0}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 flex items-center gap-2 text-sm font-semibold transition-all disabled:opacity-40"
          >
            <Sparkles className={`w-4 h-4 text-violet-400 ${runningAutopilot ? "animate-spin" : ""}`} />
            {runningAutopilot ? "Autopiloting..." : "AI Autopilot"}
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-2 text-sm font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-violet-500/10"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className={`flex flex-col bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-4 min-h-[500px] border-t-2 ${col.bg}`}
              aria-label={`${col.label} column`}
            >
              {/* Column Header */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  {col.label}
                  <span className="bg-neutral-800 text-neutral-400 text-xs px-2 py-0.5 rounded-full font-medium">
                    {colTasks.length}
                  </span>
                </span>
              </div>

              {/* Tasks List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar">
                {colTasks.length === 0 ? (
                  <div className="h-28 border border-dashed border-neutral-800/80 rounded-xl flex items-center justify-center text-xs text-neutral-600">
                    No tasks here
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const compSubtasks = task.subtasks.filter((s) => s.completed).length;
                    const totSubtasks = task.subtasks.length;
                    const percentSub = totSubtasks > 0 ? Math.round((compSubtasks / totSubtasks) * 100) : 0;

                    return (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="p-4 rounded-xl glass-card text-left space-y-3 cursor-pointer relative group"
                        role="button"
                        tabIndex={0}
                        aria-label={`Task: ${task.title}`}
                      >
                        {/* Title & Priority */}
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-semibold text-sm text-neutral-200 group-hover:text-white transition-colors line-clamp-2">
                            {task.title}
                          </h4>
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        {/* Description */}
                        {task.description && (
                          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        {/* Progress Bar (if subtasks exist) */}
                        {totSubtasks > 0 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-neutral-400">
                              <span>Checklist</span>
                              <span>
                                {compSubtasks}/{totSubtasks} ({percentSub}%)
                              </span>
                            </div>
                            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-violet-500 h-full rounded-full transition-all duration-300"
                                style={{ width: `${percentSub}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        {task.aiTags && task.aiTags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {task.aiTags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] text-neutral-400 bg-neutral-900 border border-neutral-800/80 px-2 py-0.5 rounded"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Metadata Footer */}
                        <div className="flex justify-between items-center text-[10px] text-neutral-500 pt-1 border-t border-neutral-900">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-neutral-500" />
                            {task.estimatedTime}m
                          </span>
                          <span className="flex items-center gap-1 font-medium text-neutral-400">
                            <User className="w-3 h-3 text-neutral-500" />
                            {task.assignee}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create Task */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl w-full max-w-lg shadow-2xl relative">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-lg font-bold text-white mb-4">Create New Task</h4>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl p-3 text-sm text-white bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-violet-500"
                  placeholder="Review Figma prototypes..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl p-3 text-sm text-white bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-violet-500 h-24"
                  placeholder="Detail the layout notes..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Task["priority"])}
                    className="w-full rounded-xl p-3 text-sm text-white bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-violet-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-xl p-3 text-sm text-white bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">
                  Assignee
                </label>
                <input
                  type="text"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full rounded-xl p-3 text-sm text-white bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-violet-500"
                  placeholder="Sarah Jenkins"
                />
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
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Task Detail & Subtasks Builder */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl w-full max-w-2xl shadow-2xl relative">
            <button
              onClick={() => {
                // sync references back
                setSelectedTask(null);
              }}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white"
              aria-label="Close details modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Task Info */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${getPriorityColor(
                    selectedTask.priority
                  )}`}
                >
                  {selectedTask.priority} Priority
                </span>
                <span className="text-xs text-neutral-400 bg-neutral-800 px-3 py-1 rounded-md border border-neutral-700/50">
                  Assignee: <strong>{selectedTask.assignee}</strong>
                </span>
                <span className="text-xs text-neutral-400 bg-neutral-800 px-3 py-1 rounded-md border border-neutral-700/50">
                  Due: <strong>{selectedTask.dueDate}</strong>
                </span>
              </div>

              <h4 className="text-xl font-bold text-white">{selectedTask.title}</h4>
              <p className="text-sm text-neutral-400 leading-relaxed bg-neutral-950 p-4 rounded-xl border border-neutral-800/80">
                {selectedTask.description || "No description provided."}
              </p>

              {/* Status Selector */}
              <div className="flex items-center gap-3">
                <label className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                  Update Status:
                </label>
                <div className="flex gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
                  {(["todo", "in_progress", "review", "done"] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        updateTask(selectedTask.id, { status: st });
                        setSelectedTask({ ...selectedTask, status: st });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                        selectedTask.status === st
                          ? "bg-violet-600 text-white"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      {st.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtasks Section */}
              <div className="border-t border-neutral-800 pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h5 className="font-bold text-white text-sm">Action Checklist</h5>
                  <button
                    onClick={() => triggerSubtasksGen(selectedTask.id)}
                    disabled={loadingSubtasks}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600/10 hover:bg-violet-600 text-violet-400 hover:text-white border border-violet-500/20 hover:border-violet-500 rounded-lg text-xs font-semibold disabled:opacity-40 transition-all"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${loadingSubtasks ? "animate-spin" : ""}`} />
                    {loadingSubtasks ? "Structuring steps..." : "Generate AI Checklist"}
                  </button>
                </div>

                {/* Subtask checkboxes */}
                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 scrollbar">
                  {selectedTask.subtasks.length === 0 ? (
                    <div className="text-center py-6 text-xs text-neutral-500 italic">
                      No steps drafted. Click "Generate AI Checklist" to let Groq AI break it down.
                    </div>
                  ) : (
                    selectedTask.subtasks.map((st) => (
                      <label
                        key={st.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950 hover:bg-neutral-800/50 border border-neutral-800/80 cursor-pointer text-sm text-neutral-300 hover:text-white"
                      >
                        <input
                          type="checkbox"
                          checked={st.completed}
                          onChange={(e) =>
                            handleSubtaskToggle(selectedTask, st.id, e.target.checked)
                          }
                          className="w-4 h-4 rounded border-neutral-700 text-violet-600 focus:ring-violet-500 focus:ring-offset-neutral-900 bg-neutral-950"
                        />
                        <span className={st.completed ? "line-through text-neutral-500" : ""}>
                          {st.title}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-between items-center border-t border-neutral-800 pt-4">
                <button
                  onClick={() => {
                    deleteTask(selectedTask.id);
                    setSelectedTask(null);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 flex items-center gap-1.5 text-xs font-semibold transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Task
                </button>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white text-xs font-semibold"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
