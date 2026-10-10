"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { callAiApi } from "../lib/api";

// Types
export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: string;
  assignee: string;
  estimatedTime: number; // in minutes
  aiTags: string[];
  subtasks: Subtask[];
}

export interface PlannerEvent {
  id: string;
  title: string;
  start: string; // "HH:MM"
  duration: number; // in minutes
  type: "work" | "meeting" | "break" | "personal";
  taskId?: string;
}

export interface Automation {
  id: string;
  name: string;
  trigger: "task_created" | "task_completed" | "meeting_summarized";
  action: "draft_email" | "add_to_planner" | "raise_priority";
  active: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: "online" | "meeting" | "offline";
  activeTasks: number;
}

export interface ActivityLog {
  id: string;
  content: string;
  timestamp: string;
  type: "user" | "ai" | "automation";
}

interface AppContextType {
  tasks: Task[];
  plannerEvents: PlannerEvent[];
  automations: Automation[];
  messages: ChatMessage[];
  teamMembers: TeamMember[];
  activityLog: ActivityLog[];
  activeView: string;
  setActiveView: (view: string) => void;
  
  // Tasks Actions
  addTask: (task: Omit<Task, "id" | "aiTags" | "subtasks">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  aiAutopilot: () => Promise<void>;
  generateSubtasks: (taskId: string) => Promise<void>;
  
  // Planner Actions
  addPlannerEvent: (event: Omit<PlannerEvent, "id">) => void;
  updatePlannerEvent: (id: string, updates: Partial<PlannerEvent>) => void;
  deletePlannerEvent: (id: string) => void;
  aiOptimizePlanner: () => Promise<void>;
  
  // Automations Actions
  addAutomation: (name: string, trigger: Automation["trigger"], action: Automation["action"]) => void;
  toggleAutomation: (id: string) => void;
  deleteAutomation: (id: string) => void;
  simulateTrigger: (trigger: Automation["trigger"], detail?: string) => Promise<void>;
  
  // Assistant Actions
  sendChatMessage: (text: string) => Promise<void>;
  clearChat: () => void;
  
  // Logs
  addLog: (content: string, type: ActivityLog["type"]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Mock Data
const defaultTasks: Task[] = [
  {
    id: "task-1",
    title: "Design main workspace interface",
    description: "Create glassmorphic UI layout with dark gradients and smooth transitions.",
    status: "done",
    priority: "high",
    dueDate: "2026-07-20",
    assignee: "Tanisha Patel",
    estimatedTime: 120,
    aiTags: ["design", "ui/ux"],
    subtasks: [
      { id: "sub-1-1", title: "Select harmonious color palette", completed: true },
      { id: "sub-1-2", title: "Implement sidebar navigation layout", completed: true },
      { id: "sub-1-3", title: "Add focus state keyboard listeners", completed: true }
    ]
  },
  {
    id: "task-2",
    title: "Integrate Gemini AI endpoint",
    description: "Connect `@google/genai` to handle context-aware operations and chatbot support.",
    status: "in_progress",
    priority: "urgent",
    dueDate: "2026-07-20",
    assignee: "Alex Rivera",
    estimatedTime: 180,
    aiTags: ["backend", "ai-sdk"],
    subtasks: [
      { id: "sub-2-1", title: "Verify process.env variables loading", completed: true },
      { id: "sub-2-2", title: "Construct unified route.ts handler", completed: false },
      { id: "sub-2-3", title: "Format streaming text replies", completed: false }
    ]
  },
  {
    id: "task-3",
    title: "Write documentation review",
    description: "Write the README summary, setup instructions, and hackathon project overview.",
    status: "todo",
    priority: "medium",
    dueDate: "2026-07-22",
    assignee: "Marcus Chen",
    estimatedTime: 90,
    aiTags: ["documentation"],
    subtasks: []
  },
  {
    id: "task-4",
    title: "Test responsive grid alignment",
    description: "Run layout adjustments on small/medium mobile screen sizes.",
    status: "todo",
    priority: "low",
    dueDate: "2026-07-25",
    assignee: "Sarah Jenkins",
    estimatedTime: 45,
    aiTags: ["testing", "responsive"],
    subtasks: []
  }
];

const defaultEvents: PlannerEvent[] = [
  { id: "e-1", title: "Morning Standup & Sync", start: "09:30", duration: 30, type: "meeting" },
  { id: "e-2", title: "Deep Work: AI Endpoint Refactor", start: "10:00", duration: 120, type: "work", taskId: "task-2" },
  { id: "e-3", title: "Lunch Break", start: "12:00", duration: 60, type: "break" },
  { id: "e-4", title: "Design Feedback Review", start: "14:00", duration: 60, type: "meeting", taskId: "task-1" },
  { id: "e-5", title: "Team Progress Review", start: "16:30", duration: 45, type: "meeting" }
];

const defaultAutomations: Automation[] = [
  { id: "auto-1", name: "Auto-Draft Client Follow-up", trigger: "task_completed", action: "draft_email", active: true },
  { id: "auto-2", name: "Sync to Calendar Plan", trigger: "task_created", action: "add_to_planner", active: false }
];

const defaultTeam: TeamMember[] = [
  { id: "tm-1", name: "Alex Rivera", role: "AI Software Engineer", status: "online", activeTasks: 2 },
  { id: "tm-2", name: "Tanisha Patel", role: "UI/UX Product Designer", status: "meeting", activeTasks: 1 },
  { id: "tm-3", name: "Marcus Chen", role: "Product Manager", status: "offline", activeTasks: 1 },
  { id: "tm-4", name: "Sarah Jenkins", role: "Frontend Developer", status: "online", activeTasks: 3 }
];

const defaultLog: ActivityLog[] = [
  { id: "log-1", content: "Project workspace initialized successfully.", timestamp: "16:00", type: "user" },
  { id: "log-2", content: "Tanisha Patel updated task 'Design main workspace interface' to Done.", timestamp: "15:42", type: "user" },
  { id: "log-3", content: "Automation 'Auto-Draft Client Follow-up' triggered automatically.", timestamp: "15:42", type: "automation" }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [plannerEvents, setPlannerEvents] = useState<PlannerEvent[]>(defaultEvents);
  const [automations, setAutomations] = useState<Automation[]>(defaultAutomations);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "model",
      content: "Hello! I am your ProductivityOS AI Assistant. I can help you prioritize tasks, create subtasks, schedule your day, draft professional emails, summarize documents, or execute triggers. Ask me anything!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [teamMembers] = useState<TeamMember[]>(defaultTeam);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>(defaultLog);
  const [activeView, setActiveView] = useState("dashboard");

  // Load from LocalStorage
  useEffect(() => {
    const localTasks = localStorage.getItem("p_tasks");
    const localEvents = localStorage.getItem("p_events");
    const localAutos = localStorage.getItem("p_autos");
    const localMessages = localStorage.getItem("p_messages");
    const localLogs = localStorage.getItem("p_logs");

    if (localTasks) setTasks(JSON.parse(localTasks));
    if (localEvents) setPlannerEvents(JSON.parse(localEvents));
    if (localAutos) setAutomations(JSON.parse(localAutos));
    if (localMessages) setMessages(JSON.parse(localMessages));
    if (localLogs) setActivityLog(JSON.parse(localLogs));
  }, []);

  // Save to LocalStorage helper
  const saveToLocal = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const addLog = (content: string, type: ActivityLog["type"]) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type
    };
    setActivityLog(prev => {
      const updated = [newLog, ...prev.slice(0, 49)];
      saveToLocal("p_logs", updated);
      return updated;
    });
  };

  // Task Handlers
  const addTask = (task: Omit<Task, "id" | "aiTags" | "subtasks">) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      aiTags: [],
      subtasks: []
    };
    setTasks(prev => {
      const updated = [...prev, newTask];
      saveToLocal("p_tasks", updated);
      return updated;
    });
    addLog(`Task created: "${task.title}"`, "user");
    simulateTrigger("task_created", task.title);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id === id) {
          // If status transitions to 'done', trigger task_completed automation
          if (updates.status === "done" && t.status !== "done") {
            setTimeout(() => simulateTrigger("task_completed", t.title), 500);
          }
          return { ...t, ...updates };
        }
        return t;
      });
      saveToLocal("p_tasks", updated);
      return updated;
    });

    const taskTitle = tasks.find(t => t.id === id)?.title || "Task";
    if (updates.status) {
      addLog(`Updated "${taskTitle}" status to ${updates.status}`, "user");
    } else {
      addLog(`Updated task details for "${taskTitle}"`, "user");
    }
  };

  const deleteTask = (id: string) => {
    const taskTitle = tasks.find(t => t.id === id)?.title || "Task";
    setTasks(prev => {
      const updated = prev.filter(t => t.id !== id);
      saveToLocal("p_tasks", updated);
      return updated;
    });
    addLog(`Deleted task "${taskTitle}"`, "user");
  };

  // AI Autopilot: Auto-prioritize, tag, and estimate time for all tasks
  const aiAutopilot = async () => {
    addLog("Initiating AI Task Autopilot...", "ai");
    const toastId = toast.loading("Analyzing tasks with Groq AI...");
    try {
      interface AIResult {
        id: string;
        priority: Task["priority"];
        estimatedTime: number;
        aiTags: string[];
      }

      const predictions = await callAiApi<AIResult[]>("task_prioritize", {
        tasks: tasks.map(t => ({ id: t.id, title: t.title, description: t.description }))
      });

      setTasks(prev => {
        const updated = prev.map(t => {
          const pred = predictions.find(p => p.id === t.id);
          if (pred) {
            return {
              ...t,
              priority: pred.priority || t.priority,
              estimatedTime: pred.estimatedTime || t.estimatedTime,
              aiTags: pred.aiTags || t.aiTags
            };
          }
          return t;
        });
        saveToLocal("p_tasks", updated);
        return updated;
      });
      toast.success("Tasks prioritized & estimated by AI!", { id: toastId });
      addLog("AI Task Autopilot completed: tasks prioritized, tagged, and estimated.", "ai");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Autopilot failed", { id: toastId });
      addLog(`AI Task Autopilot failed: ${e.message || "Unknown error"}`, "ai");
    }
  };

  // AI Subtasks Generator
  const generateSubtasks = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    addLog(`AI generating subtasks for "${task.title}"...`, "ai");
    const toastId = toast.loading(`Drafting subtasks for "${task.title}"...`);
    try {
      const items = await callAiApi<string[]>("task_breakdown", {
        title: task.title,
        description: task.description
      });

      const generatedSubtasks: Subtask[] = items.map((title, i) => ({
        id: `sub-${taskId}-${Date.now()}-${i}`,
        title,
        completed: false
      }));

      setTasks(prev => {
        const updated = prev.map(t => {
          if (t.id === taskId) {
            return { ...t, subtasks: [...t.subtasks, ...generatedSubtasks] };
          }
          return t;
        });
        saveToLocal("p_tasks", updated);
        return updated;
      });
      toast.success(`Generated ${generatedSubtasks.length} subtasks!`, { id: toastId });
      addLog(`AI successfully generated ${generatedSubtasks.length} subtasks for "${task.title}".`, "ai");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Checklist generation failed", { id: toastId });
      addLog(`Subtask generation failed: ${e.message || "Unknown error"}`, "ai");
    }
  };

  // Planner Handlers
  const addPlannerEvent = (event: Omit<PlannerEvent, "id">) => {
    const newEvent: PlannerEvent = {
      ...event,
      id: `e-${Date.now()}`
    };
    setPlannerEvents(prev => {
      const updated = [...prev, newEvent];
      saveToLocal("p_events", updated);
      return updated;
    });
    addLog(`Added calendar event "${event.title}"`, "user");
  };

  const updatePlannerEvent = (id: string, updates: Partial<PlannerEvent>) => {
    setPlannerEvents(prev => {
      const updated = prev.map(e => (e.id === id ? { ...e, ...updates } : e));
      saveToLocal("p_events", updated);
      return updated;
    });
    const title = plannerEvents.find(e => e.id === id)?.title || "Event";
    addLog(`Updated calendar event "${title}"`, "user");
  };

  const deletePlannerEvent = (id: string) => {
    const title = plannerEvents.find(e => e.id === id)?.title || "Event";
    setPlannerEvents(prev => {
      const updated = prev.filter(e => e.id !== id);
      saveToLocal("p_events", updated);
      return updated;
    });
    addLog(`Deleted calendar event "${title}"`, "user");
  };

  // AI Schedule Optimizer
  const aiOptimizePlanner = async () => {
    addLog("Requesting AI Planner Optimization...", "ai");
    const toastId = toast.loading("Optimizing your daily timeline...");
    try {
      const result = await callAiApi<any[]>("planner_optimize", {
        tasks: tasks.filter(t => t.status !== "done").map(t => ({ id: t.id, title: t.title, priority: t.priority, estimatedTime: t.estimatedTime })),
        currentEvents: plannerEvents
      });

      const optimizedEvents: PlannerEvent[] = result.map((e: any, idx: number) => ({
        id: `e-opt-${Date.now()}-${idx}`,
        title: e.title,
        start: e.start,
        duration: e.duration,
        type: e.type,
        taskId: e.taskId
      }));

      setPlannerEvents(optimizedEvents);
      saveToLocal("p_events", optimizedEvents);
      toast.success("Schedule optimized with focus & break blocks!", { id: toastId });
      addLog("Planner schedule optimized: workloads balanced & rest breaks inserted.", "ai");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Schedule optimization failed", { id: toastId });
      addLog(`Planner optimization failed: ${e.message || "Unknown error"}`, "ai");
    }
  };

  // Automations
  const addAutomation = (name: string, trigger: Automation["trigger"], action: Automation["action"]) => {
    const newAuto: Automation = {
      id: `auto-${Date.now()}`,
      name,
      trigger,
      action,
      active: true
    };
    setAutomations(prev => {
      const updated = [...prev, newAuto];
      saveToLocal("p_autos", updated);
      return updated;
    });
    addLog(`Automation workspace rule added: "${name}"`, "user");
  };

  const toggleAutomation = (id: string) => {
    setAutomations(prev => {
      const updated = prev.map(a => (a.id === id ? { ...a, active: !a.active } : a));
      saveToLocal("p_autos", updated);
      return updated;
    });
    const auto = automations.find(a => a.id === id);
    if (auto) {
      addLog(`Automation "${auto.name}" turned ${!auto.active ? "ON" : "OFF"}`, "user");
    }
  };

  const deleteAutomation = (id: string) => {
    const autoName = automations.find(a => a.id === id)?.name || "Rule";
    setAutomations(prev => {
      const updated = prev.filter(a => a.id !== id);
      saveToLocal("p_autos", updated);
      return updated;
    });
    addLog(`Automation rule "${autoName}" deleted`, "user");
  };

  // Simulate triggers & fire associated automated workflows
  const simulateTrigger = async (trigger: Automation["trigger"], detail?: string) => {
    const activeRules = automations.filter(a => a.trigger === trigger && a.active);
    if (activeRules.length === 0) return;

    for (const rule of activeRules) {
      addLog(`Trigger matched: Running automation rule "${rule.name}"...`, "automation");
      
      if (rule.action === "draft_email") {
        // AI draft automatic follow up email
        try {
          const response = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "email_generate",
              payload: {
                prompt: `Draft follow-up email confirming completion of task: "${detail || "project milestones"}"`,
                recipient: "Client",
                tone: "Professional",
                length: "Short"
              }
            })
          });
          const data = await response.json();
          if (data.error) throw new Error(data.error);

          // Place inside chat assistant or simulate draft saved
          addLog(`Automation: Auto-drafted email notification for completed task.`, "automation");
          
          // Let's add it to the assistant's context
          setMessages(prev => {
            const newMsg: ChatMessage = {
              id: `auto-msg-${Date.now()}`,
              role: "model",
              content: `✨ **[AUTOMATION RULE FIRED: ${rule.name}]**\nAn email draft has been generated for completion of **"${detail}"**:\n\n\`\`\`text\n${data.result}\n\`\`\`\n*(Draft copied to clipboard)*`,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            };
            const list = [...prev, newMsg];
            saveToLocal("p_messages", list);
            return list;
          });
        } catch (e) {
          console.error(e);
          addLog(`Automation: Email drafting failed.`, "automation");
        }
      } else if (rule.action === "add_to_planner") {
        // Automatically add task to calendar
        const title = `Block: ${detail || "New Task Work"}`;
        addPlannerEvent({
          title,
          start: "11:00",
          duration: 60,
          type: "work"
        });
        addLog(`Automation: Added 60m focus block to planner: "${title}"`, "automation");
      } else if (rule.action === "raise_priority") {
        // Find tasks matching detail and raise priority to Urgent
        setTasks(prev => {
          const updated = prev.map(t => {
            if (t.title === detail) {
              return { ...t, priority: "urgent" as const };
            }
            return t;
          });
          saveToLocal("p_tasks", updated);
          return updated;
        });
        addLog(`Automation: Escalated priority of "${detail}" to Urgent.`, "automation");
      }
    }
  };

  // AI Assistant Chat Handler
  const sendChatMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}-user`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const tempAssistantMsg: ChatMessage = {
      id: `chat-${Date.now()}-assistant-temp`,
      role: "model",
      content: "", // streaming placeholder
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => {
      const list = [...prev, userMsg, tempAssistantMsg];
      saveToLocal("p_messages", list);
      return list;
    });

    try {
      const chatHistory = messages
        .filter(m => m.id !== "init")
        .map(m => ({ role: m.role, content: m.content }));
      chatHistory.push({ role: "user", content: text });

      const reply = await callAiApi<string>("chat", {
        history: chatHistory,
        currentTasks: tasks.map(t => `[${t.status}] ${t.title} (${t.priority} priority)`),
        currentPlanner: plannerEvents.map(e => `${e.start} for ${e.duration}m: ${e.title}`)
      });

      setMessages(prev => {
        const list = prev.map(m => {
          if (m.id === tempAssistantMsg.id) {
            return { ...m, content: reply };
          }
          return m;
        });
        saveToLocal("p_messages", list);
        return list;
      });
      addLog("Received response from AI Chat Assistant.", "ai");
    } catch (e: any) {
      console.error(e);
      setMessages(prev => {
        const list = prev.map(m => {
          if (m.id === tempAssistantMsg.id) {
            return { ...m, content: `Error: ${e.message || "Unable to reach AI assistant."}` };
          }
          return m;
        });
        saveToLocal("p_messages", list);
        return list;
      });
      addLog("AI Chat Assistant call failed.", "ai");
    }
  };

  const clearChat = () => {
    const list: ChatMessage[] = [
      {
        id: "init",
        role: "model",
        content: "Hello! History cleared. I'm ready for new tasks or planning questions.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setMessages(list);
    saveToLocal("p_messages", list);
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        plannerEvents,
        automations,
        messages,
        teamMembers,
        activityLog,
        activeView,
        setActiveView,
        addTask,
        updateTask,
        deleteTask,
        aiAutopilot,
        generateSubtasks,
        addPlannerEvent,
        updatePlannerEvent,
        deletePlannerEvent,
        aiOptimizePlanner,
        addAutomation,
        toggleAutomation,
        deleteAutomation,
        simulateTrigger,
        sendChatMessage,
        clearChat,
        addLog
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside an AppProvider");
  return context;
};
