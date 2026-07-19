"use client";

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Users, UserPlus, ShieldAlert, Circle, Activity } from "lucide-react";

export const TeamView: React.FC = () => {
  const { teamMembers, activityLog } = useApp();
  const [localTeam, setLocalTeam] = useState(teamMembers);
  const [name, setName] = useState("");
  const [role, setRole] = useState("Frontend Engineer");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMember = {
      id: `tm-${Date.now()}`,
      name,
      role,
      status: "online" as const,
      activeTasks: 0
    };

    setLocalTeam([...localTeam, newMember]);
    setName("");
    setIsAddOpen(false);
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "online":
        return <Circle className="w-2.5 h-2.5 text-emerald-500 fill-emerald-500" />;
      case "meeting":
        return <Circle className="w-2.5 h-2.5 text-blue-500 fill-blue-500" />;
      case "offline":
        return <Circle className="w-2.5 h-2.5 text-neutral-600 fill-neutral-600" />;
      default:
        return <Circle className="w-2.5 h-2.5 text-neutral-600" />;
    }
  };

  const getWorkloadLabel = (tasksCount: number) => {
    if (tasksCount >= 4) {
      return { text: "Overloaded", color: "bg-red-500/10 text-red-400 border-red-500/20" };
    } else if (tasksCount >= 2) {
      return { text: "Optimal", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
    } else {
      return { text: "Underutilized", color: "bg-neutral-800 text-neutral-400 border-neutral-700" };
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-slide-up">
      {/* View Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">Team Workspace</h3>
          <p className="text-xs text-neutral-400">
            Monitor real-time collaborator statuses, role assignments, and active focus workloads.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(!isAddOpen)}
          className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-2 text-sm font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-violet-500/10"
        >
          <UserPlus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {isAddOpen && (
        <form onSubmit={handleAddMember} className="p-5 rounded-2xl glass-card max-w-xl space-y-4 animate-slide-up">
          <h4 className="font-bold text-sm text-white">Add Team Member</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl p-3 text-sm text-white bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-violet-500"
                placeholder="Sarah Jenkins..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl p-3 text-sm text-white bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-violet-500"
              >
                <option value="AI Software Engineer">AI Software Engineer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="UI/UX Product Designer">UI/UX Product Designer</option>
                <option value="Growth Lead">Growth Lead</option>
                <option value="Product Manager">Product Manager</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-neutral-400 text-xs font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-violet-600 text-white text-xs font-semibold rounded-lg"
            >
              Confirm Member
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Team List Card */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="font-bold text-white text-base flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-violet-400" />
            Active Collaborators
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {localTeam.map((member) => {
              const workload = getWorkloadLabel(member.activeTasks);
              return (
                <div key={member.id} className="p-5 rounded-2xl glass-card space-y-4 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                        {member.name}
                        {getStatusDot(member.status)}
                      </h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{member.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-3 border-t border-neutral-900">
                    <span className="text-neutral-400">
                      Active Tasks: <strong className="text-white">{member.activeTasks}</strong>
                    </span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${workload.color}`}>
                      {workload.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Logs Specific to Syncs */}
        <div className="p-6 rounded-2xl glass-card flex flex-col h-[320px] overflow-hidden">
          <div className="mb-4">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-violet-400" />
              Collaboration Stream
            </h4>
            <p className="text-xs text-neutral-400">Collaborator task streams</p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar text-xs">
            {activityLog
              .filter((log) => log.type === "user")
              .slice(0, 10)
              .map((log) => (
                <div key={log.id} className="p-2 border-b border-neutral-900 flex gap-2 justify-between">
                  <span className="text-neutral-300 line-clamp-2">{log.content}</span>
                  <span className="text-[10px] text-neutral-500 font-mono shrink-0">{log.timestamp}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
