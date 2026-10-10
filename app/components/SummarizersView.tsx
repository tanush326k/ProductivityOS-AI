"use client";

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Sparkles,
  FileText,
  Layers,
  Copy,
  Check,
  ListPlus,
  Mail,
  Send,
  ClipboardList
} from "lucide-react";
import toast from "react-hot-toast";
import { callAiApi } from "../lib/api";

export const SummarizersView: React.FC = () => {
  const { addTask, addLog, activeView } = useApp();
  
  // Set default tab based on whether user navigated to email, docs, or notes
  const [activeTab, setActiveTab] = useState<"meeting" | "document" | "email">(() => {
    if (activeView === "email") return "email";
    if (activeView === "docs") return "document";
    return "meeting";
  });

  // Meeting Notes States
  const [meetingNotes, setMeetingNotes] = useState("");
  const [loadingMeeting, setLoadingMeeting] = useState(false);
  const [meetingResult, setMeetingResult] = useState("");
  const [actionItemsParsed, setActionItemsParsed] = useState<string[]>([]);
  const [isSynced, setIsSynced] = useState(false);
  const [copiedMeeting, setCopiedMeeting] = useState(false);

  // Document Summarizer States
  const [docText, setDocText] = useState("");
  const [docFormat, setDocFormat] = useState<"summary" | "outline" | "flashcards">("summary");
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [docResult, setDocResult] = useState("");
  const [copiedDoc, setCopiedDoc] = useState(false);

  // Email States
  const [emailPrompt, setEmailPrompt] = useState("");
  const [emailRecipient, setEmailRecipient] = useState("");
  const [emailTone, setEmailTone] = useState("Professional");
  const [emailLength, setEmailLength] = useState("Medium");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);

  const mockNotes = `Weekly Standup & Strategy Sync
Date: 2026-10-11
Attendees: Alex Rivera, Sarah Lin, Marcus Vance

Key Updates:
1. Backend migration to Groq (openai/gpt-oss-120b) is now active and delivering lightning-fast inference.
2. Dashboard UI was refactored into a sleek, streamlined workspace without confusing clutter.
3. Need to run full verification on Task Autopilot and Schedule Optimizer before end of day.

Decisions:
- Maintain dark glassmorphic design as the primary theme.
- Package meeting notes, documents, and emails into a unified AI Studio.

Action Items:
- Alex Rivera: Finalize error boundaries and client API helpers.
- Sarah Lin: Update Kanban board swimlanes and priority indicators.
- Marcus Vance: Prepare executive release notes for client demo.`;

  const mockDoc = `Modern Engineering Architecture for Scalable Agentic Systems

Building reliable AI-powered workspace tools requires strict adherence to three architectural principles:
First: Graceful Fallbacks. Real-world LLM calls can encounter rate limits or network hiccups. Systems must use typed error handlers, robust parsers for structured JSON, and fallback models.
Second: Minimal Latency. High-speed inference engines like Groq allow users to execute agentic workflows in under a second, keeping interaction flow uninterrupted.
Third: Frictionless Ergonomics. Interfaces must avoid congested screens and instead present contextual tools that require minimal clicks to achieve maximum productivity.`;

  const emailPresets = [
    { label: "Sprint milestone update", prompt: "Inform team stakeholders that the sprint deliverables and AI enhancements have shipped ahead of schedule." },
    { label: "Request client feedback", prompt: "Ask the client for their feedback on the updated design wireframes and test build." },
    { label: "Follow up on contract", prompt: "Send a polite follow-up checking the status of the signed service agreement." },
  ];

  // Handler: Meeting Summarizer
  const handleSummarizeMeeting = async () => {
    if (!meetingNotes.trim()) return;
    setLoadingMeeting(true);
    setMeetingResult("");
    setIsSynced(false);
    setActionItemsParsed([]);
    addLog("Summarizing meeting notes with Groq...", "ai");
    const toastId = toast.loading("Analyzing meeting notes...");

    try {
      const result = await callAiApi<string>("meeting_summarize", { notes: meetingNotes });
      setMeetingResult(result);

      // Extract action items
      const lines = result.split("\n");
      const items: string[] = [];
      let inActionItems = false;

      for (const line of lines) {
        const cleaned = line.trim();
        if (cleaned.toLowerCase().includes("action item")) {
          inActionItems = true;
          continue;
        }
        if (inActionItems && (cleaned.startsWith("-") || cleaned.startsWith("*") || /^\d+\./.test(cleaned))) {
          const itemText = cleaned.replace(/^[-*\s\d.]+\s*/, "");
          if (itemText.length > 3) items.push(itemText);
        }
      }

      setActionItemsParsed(items);
      toast.success("Executive summary ready!", { id: toastId });
      addLog("Meeting notes summarized successfully.", "ai");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to summarize meeting notes.", { id: toastId });
      setMeetingResult(`Error: ${e.message || "Failed to summarize notes."}`);
      addLog("Failed to summarize meeting notes.", "ai");
    } finally {
      setLoadingMeeting(false);
    }
  };

  const handleSyncTasks = () => {
    if (actionItemsParsed.length === 0) return;
    actionItemsParsed.forEach((item) => {
      let owner = "Unassigned";
      let title = item;
      const splitIdx = item.indexOf(":");
      if (splitIdx > 0 && splitIdx < 25) {
        owner = item.slice(0, splitIdx).trim();
        title = item.slice(splitIdx + 1).trim();
      }

      addTask({
        title,
        description: `Synced from meeting notes. Assignee: ${owner}.`,
        status: "todo",
        priority: "medium",
        dueDate: new Date().toISOString().split("T")[0],
        assignee: owner,
        estimatedTime: 45,
      });
    });
    setIsSynced(true);
    toast.success(`Created ${actionItemsParsed.length} new tasks on your Kanban board!`);
    addLog(`Synced ${actionItemsParsed.length} meeting action items to task board.`, "user");
  };

  // Handler: Document Summarizer
  const handleSummarizeDoc = async () => {
    if (!docText.trim()) return;
    setLoadingDoc(true);
    setDocResult("");
    addLog(`Running document analysis (${docFormat})...`, "ai");
    const toastId = toast.loading(`Synthesizing document (${docFormat})...`);

    try {
      const result = await callAiApi<string>("doc_summarize", { text: docText, format: docFormat });
      setDocResult(result);
      toast.success("Document analyzed successfully!", { id: toastId });
      addLog("Document summarized successfully.", "ai");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to summarize document.", { id: toastId });
      setDocResult(`Error: ${e.message || "Document analysis failed."}`);
      addLog("Document summarization failed.", "ai");
    } finally {
      setLoadingDoc(false);
    }
  };

  // Handler: Email Generator
  const handleGenerateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailPrompt.trim()) return;
    setLoadingEmail(true);
    setEmailResult("");
    addLog("Generating AI email draft...", "ai");
    const toastId = toast.loading("Drafting professional email...");

    try {
      const result = await callAiApi<string>("email_generate", {
        prompt: emailPrompt,
        recipient: emailRecipient || "Stakeholder",
        tone: emailTone,
        length: emailLength,
      });
      setEmailResult(result);
      toast.success("Email drafted successfully!", { id: toastId });
      addLog("AI email draft generated successfully.", "ai");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to draft email.", { id: toastId });
      setEmailResult(`Error: ${e.message || "Failed to draft email."}`);
      addLog("Failed to generate email.", "ai");
    } finally {
      setLoadingEmail(false);
    }
  };

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-slide-up">
      {/* Studio Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-400" />
            AI Productivity Studio
          </h2>
          <p className="text-xs text-neutral-400">
            High-speed workspace generation powered by Groq & OpenAI gpt-oss-120b
          </p>
        </div>

        <div className="flex gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-2xl">
          <button
            onClick={() => setActiveTab("meeting")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "meeting"
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Meeting Notes
          </button>
          <button
            onClick={() => setActiveTab("document")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "document"
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Document Analyzer
          </button>
          <button
            onClick={() => setActiveTab("email")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "email"
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Email Drafter
          </button>
        </div>
      </div>

      {/* TAB 1: MEETING NOTES */}
      {activeTab === "meeting" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl glass-card space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-white">Meeting Transcript or Raw Notes</label>
                <button
                  onClick={() => setMeetingNotes(mockNotes)}
                  className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 font-medium cursor-pointer"
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  Load Sample Notes
                </button>
              </div>
              <textarea
                value={meetingNotes}
                onChange={(e) => setMeetingNotes(e.target.value)}
                placeholder="Paste your meeting transcript or raw notes here..."
                rows={14}
                className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-violet-500 transition-colors resize-none font-mono"
              />
            </div>
            <button
              onClick={handleSummarizeMeeting}
              disabled={loadingMeeting || !meetingNotes.trim()}
              className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 disabled:opacity-40 transition-all cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${loadingMeeting ? "animate-spin" : ""}`} />
              {loadingMeeting ? "Analyzing Notes..." : "Generate Executive Summary"}
            </button>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-4 flex flex-col justify-between min-h-[480px]">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h4 className="font-bold text-white text-sm">Executive Summary & Action Items</h4>
              {meetingResult && (
                <button
                  onClick={() => copyToClipboard(meetingResult, setCopiedMeeting)}
                  className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800"
                >
                  {copiedMeeting ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedMeeting ? "Copied" : "Copy"}
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto max-h-[380px] p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 text-sm text-neutral-300 leading-relaxed font-sans whitespace-pre-wrap">
              {meetingResult || (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500 text-xs text-center py-12">
                  <Layers className="w-8 h-8 mb-2 opacity-30 text-violet-400" />
                  Click "Generate Executive Summary" to extract decisions and actionable tasks.
                </div>
              )}
            </div>

            {actionItemsParsed.length > 0 && (
              <div className="pt-2">
                <button
                  onClick={handleSyncTasks}
                  disabled={isSynced}
                  className={`w-full py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    isSynced
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-white"
                  }`}
                >
                  <ListPlus className="w-4 h-4" />
                  {isSynced ? `Synced ${actionItemsParsed.length} tasks to board ✓` : `Add ${actionItemsParsed.length} Action Items to Task Board`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DOCUMENT ANALYZER */}
      {activeTab === "document" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl glass-card space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-white">Source Document / Text</label>
                <button
                  onClick={() => setDocText(mockDoc)}
                  className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 font-medium cursor-pointer"
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  Load Sample Document
                </button>
              </div>
              <textarea
                value={docText}
                onChange={(e) => setDocText(e.target.value)}
                placeholder="Paste articles, specifications, or documents here..."
                rows={11}
                className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-violet-500 transition-colors resize-none font-mono"
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-400">Synthesis Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["summary", "outline", "flashcards"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setDocFormat(fmt)}
                      className={`py-2 rounded-xl text-xs font-medium capitalize border transition-all cursor-pointer ${
                        docFormat === fmt
                          ? "bg-violet-600/20 border-violet-500 text-violet-300 font-bold"
                          : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSummarizeDoc}
              disabled={loadingDoc || !docText.trim()}
              className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 disabled:opacity-40 transition-all cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${loadingDoc ? "animate-spin" : ""}`} />
              {loadingDoc ? "Analyzing Document..." : "Synthesize Document"}
            </button>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-4 flex flex-col justify-between min-h-[480px]">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h4 className="font-bold text-white text-sm capitalize">{docFormat} Result</h4>
              {docResult && (
                <button
                  onClick={() => copyToClipboard(docResult, setCopiedDoc)}
                  className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800"
                >
                  {copiedDoc ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedDoc ? "Copied" : "Copy"}
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto max-h-[420px] p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 text-sm text-neutral-300 leading-relaxed font-sans whitespace-pre-wrap">
              {docResult || (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500 text-xs text-center py-12">
                  <FileText className="w-8 h-8 mb-2 opacity-30 text-violet-400" />
                  Select your preferred format and click "Synthesize Document".
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EMAIL DRAFTER */}
      {activeTab === "email" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handleGenerateEmail} className="p-6 rounded-2xl glass-card space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">What would you like to email?</label>
                <textarea
                  value={emailPrompt}
                  onChange={(e) => setEmailPrompt(e.target.value)}
                  placeholder="e.g., Thank the client for their feedback and inform them the sprint is ready..."
                  rows={4}
                  className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                />
              </div>

              {/* Presets */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-neutral-400">Quick Starters:</span>
                <div className="flex flex-wrap gap-2">
                  {emailPresets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEmailPrompt(p.prompt)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-neutral-300 transition-all cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient & Tone & Length */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-400">Recipient</label>
                  <input
                    type="text"
                    value={emailRecipient}
                    onChange={(e) => setEmailRecipient(e.target.value)}
                    placeholder="e.g. Client / Team"
                    className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-400">Tone</label>
                  <select
                    value={emailTone}
                    onChange={(e) => setEmailTone(e.target.value)}
                    className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-violet-500 cursor-pointer"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Friendly">Friendly</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Persuasive">Persuasive</option>
                    <option value="Casual">Casual</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-400">Length</label>
                  <select
                    value={emailLength}
                    onChange={(e) => setEmailLength(e.target.value)}
                    className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-violet-500 cursor-pointer"
                  >
                    <option value="Short">Short</option>
                    <option value="Medium">Medium</option>
                    <option value="Detailed">Detailed</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingEmail || !emailPrompt.trim()}
              className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 disabled:opacity-40 transition-all cursor-pointer"
            >
              <Send className={`w-4 h-4 ${loadingEmail ? "animate-spin" : ""}`} />
              {loadingEmail ? "Generating Draft..." : "Draft Professional Email"}
            </button>
          </form>

          <div className="p-6 rounded-2xl glass-card space-y-4 flex flex-col justify-between min-h-[480px]">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h4 className="font-bold text-white text-sm">Generated Email Draft</h4>
              {emailResult && (
                <button
                  onClick={() => copyToClipboard(emailResult, setCopiedEmail)}
                  className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedEmail ? "Copied" : "Copy"}
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto max-h-[420px] p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 text-sm text-neutral-300 leading-relaxed font-sans whitespace-pre-wrap">
              {emailResult || (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500 text-xs text-center py-12">
                  <Mail className="w-8 h-8 mb-2 opacity-30 text-violet-400" />
                  Enter your prompt and click "Draft Professional Email" to generate your message.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
