"use client";

import React, { useState } from "react";
import { useApp, PlannerEvent } from "../context/AppContext";
import {
  Sparkles,
  Plus,
  Trash2,
  Clock,
  Briefcase,
  Users,
  Coffee,
  User,
  X,
  CalendarDays,
  RefreshCw
} from "lucide-react";

export const PlannerView: React.FC = () => {
  const {
    plannerEvents,
    addPlannerEvent,
    deletePlannerEvent,
    aiOptimizePlanner,
    tasks,
    addLog
  } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loadingOptimize, setLoadingOptimize] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("09:00");
  const [duration, setDuration] = useState(60);
  const [type, setType] = useState<PlannerEvent["type"]>("work");
  const [linkedTaskId, setLinkedTaskId] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addPlannerEvent({
      title,
      start,
      duration: Number(duration),
      type,
      taskId: linkedTaskId || undefined,
    });
    // Reset
    setTitle("");
    setStart("09:00");
    setDuration(60);
    setType("work");
    setLinkedTaskId("");
    setIsAddOpen(false);
  };

  const triggerOptimize = async () => {
    setLoadingOptimize(true);
    await aiOptimizePlanner();
    setLoadingOptimize(false);
  };

  const getEventIcon = (t: PlannerEvent["type"]) => {
    switch (t) {
      case "work":
        return <Briefcase className="w-4 h-4 text-violet-400" />;
      case "meeting":
        return <Users className="w-4 h-4 text-blue-400" />;
      case "break":
        return <Coffee className="w-4 h-4 text-emerald-400" />;
      case "personal":
        return <User className="w-4 h-4 text-amber-400" />;
      default:
        return <Briefcase className="w-4 h-4 text-violet-400" />;
    }
  };

  const getEventTypeColor = (t: PlannerEvent["type"]) => {
    switch (t) {
      case "work":
        return "bg-violet-500/10 border-violet-500/20 text-violet-300";
      case "meeting":
        return "bg-blue-500/10 border-blue-500/20 text-blue-300";
      case "break":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-300";
      case "personal":
        return "bg-amber-500/10 border-amber-500/20 text-amber-300";
      default:
        return "bg-neutral-800 border-neutral-700 text-neutral-300";
    }
  };

  // Convert HH:MM to decimal hours for grid math
  const getEventPosition = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    // Base 09:00 is 0
    const decimal = hours + minutes / 60;
    const offset = Math.max(decimal - 9, 0); // hours since 9 AM
    return offset * 60; // 60px per hour
  };

  // Sorted list of events for the side view
  const sortedEvents = [...plannerEvents].sort((a, b) => a.start.localeCompare(b.start));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-slide-up">
      {/* View Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">Daily Planner</h3>
          <p className="text-xs text-neutral-400">
            Structure your day. Block out deep focus periods and integrate meetings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={triggerOptimize}
            disabled={loadingOptimize}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 flex items-center gap-2 text-sm font-semibold transition-all disabled:opacity-40"
          >
            <Sparkles className={`w-4 h-4 text-violet-400 ${loadingOptimize ? "animate-spin" : ""}`} />
            {loadingOptimize ? "Optimizing Workload..." : "AI Schedule Optimizer"}
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-2 text-sm font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-violet-500/10"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>
      </div>

      {/* Workspace Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline View */}
        <div className="p-6 rounded-2xl glass-card space-y-6">
          <h4 className="font-bold text-white text-base flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-violet-400" />
            Agenda Overview
          </h4>

          {sortedEvents.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-xs italic">
              Timeline is clear. Click "AI Schedule Optimizer" to map out tasks automatically.
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar">
              {sortedEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${getEventTypeColor(
                    event.type
                  )}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-950 flex items-center justify-center border border-neutral-800">
                      {getEventIcon(event.type)}
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm text-neutral-200 line-clamp-1">
                        {event.title}
                      </h5>
                      <span className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5 font-medium">
                        <Clock className="w-2.5 h-2.5 text-neutral-500" />
                        {event.start} ({event.duration} min)
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deletePlannerEvent(event.id)}
                    className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-neutral-900/60"
                    aria-label={`Delete event ${event.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Timeline Calendar Scale (09:00 - 18:00) */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-card flex flex-col h-[580px] overflow-y-auto scrollbar">
          <h4 className="font-bold text-white text-base mb-6">Schedule Board (09:00 - 18:00)</h4>

          {/* Hour Scaling container */}
          <div className="flex-1 relative pl-16 min-h-[540px]">
            {/* Hour Grid Lines */}
            {Array.from({ length: 10 }).map((_, hourIdx) => {
              const hourNum = 9 + hourIdx;
              const timeString = `${hourNum < 10 ? "0" : ""}${hourNum}:00`;
              return (
                <div
                  key={hourIdx}
                  className="absolute left-0 right-0 border-t border-neutral-800/60 flex items-start"
                  style={{ top: `${hourIdx * 60}px`, height: "60px" }}
                >
                  <span className="absolute -left-16 text-[10px] font-bold text-neutral-500 w-12 text-right">
                    {timeString}
                  </span>
                </div>
              );
            })}

            {/* Render events absolute blocks on grid */}
            {plannerEvents.map((event) => {
              const topOffset = getEventPosition(event.start);
              // Map minutes duration to height pixels (1 min = 1px)
              const heightPx = Math.max(event.duration, 35);

              return (
                <div
                  key={event.id}
                  className={`absolute left-2 right-4 rounded-xl border p-3 flex flex-col justify-between overflow-hidden shadow-lg transition-transform hover:scale-[1.005] select-none ${getEventTypeColor(
                    event.type
                  )}`}
                  style={{ top: `${topOffset}px`, height: `${heightPx}px` }}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h5 className="font-bold text-xs line-clamp-1">{event.title}</h5>
                      <span className="text-[9px] opacity-75 font-semibold">
                        {event.start} ({event.duration}m)
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePlannerEvent(event.id);
                      }}
                      className="opacity-40 hover:opacity-100 p-0.5 text-neutral-400 hover:text-white"
                      aria-label="Delete block"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal: Create Event */}
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

            <h4 className="text-lg font-bold text-white mb-4">Add Calendar Event</h4>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">
                  Event Name *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl p-3 text-sm text-white bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-violet-500"
                  placeholder="Sync with stakeholder teams..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="w-full rounded-xl p-3 text-sm text-white bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    required
                    min={10}
                    max={240}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full rounded-xl p-3 text-sm text-white bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">
                  Event Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as PlannerEvent["type"])}
                  className="w-full rounded-xl p-3 text-sm text-white bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-violet-500"
                >
                  <option value="work">Work Block</option>
                  <option value="meeting">Meeting</option>
                  <option value="break">Rest Break</option>
                  <option value="personal">Personal Time</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">
                  Link to Active Task (Optional)
                </label>
                <select
                  value={linkedTaskId}
                  onChange={(e) => setLinkedTaskId(e.target.value)}
                  className="w-full rounded-xl p-3 text-sm text-white bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-violet-500"
                >
                  <option value="">-- No Linked Task --</option>
                  {tasks
                    .filter((t) => t.status !== "done")
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
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
                  Add Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
