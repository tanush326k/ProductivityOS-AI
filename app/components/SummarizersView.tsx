"use client";

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Sparkles,
  FileText,
  Layers,
  Copy,
  Check,
  RotateCcw,
  ListPlus,
  BookOpen,
  ClipboardList
} from "lucide-react";

export const SummarizersView: React.FC = () => {
  const { addTask, addLog } = useApp();
  const [activeTab, setActiveTab] = useState<"meeting" | "document">("meeting");

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

  const mockNotes = `Sync Meeting - ProductivityOS Team
Date: 2026-07-19
Attendees: Alex, Tanisha, Marcus

Discussion:
1. Alex finished setting up the core Next.js 15 structure and workspace context. He highlighted that the Gemini API is fully integrated but we need to check environmental loading keys.
2. Tanisha presented the initial CSS layout drafts, using custom glassmorphic cards. Everyone agreed it looks extremely premium.
3. Marcus reviewed the hackathon timeline. Submissions are due in 2 days, so we need to test all core operations and ensure keyboard focus states are accessible.

Decisions:
- Deploy the demo build onto Vercel sandbox for judges.
- Focus primary design aesthetics on default Dark Theme mode.

Action Items:
- Alex Rivera: Refactor backend API variables and test connection.
- Tanisha Patel: Add ARIA tags to sidebar menu navigation.
- Marcus Chen: Write final pitch deck copy and check slides.`;

  const mockDocText = `Generative Artificial Intelligence is transforming software development workflows at an unprecedented rate. Rather than merely acting as static autocomplete engines, modern AI coding assistants are capable of understanding repository context, creating structured files, and executing terminal commands on behalf of the developer. This paradigm shift requires a transition from basic prompt-response paradigms to advanced, agentic workflows where models autonomously iterate on code correctness, run lint checks, and self-correct errors. 
To build successful GenAI applications, software architects must address several challenges. First, reliability is critical. LLMs are probabilistic, meaning they can produce hallucinations or syntax errors. Guardrails, robust type safety, and automated unit testing suites are essential layers. Second, performance. Streaming responses and lazy-loading heavy UI structures ensure applications remain responsive under compute-heavy cycles. Third, developer user experience. A premium UX provides context-sensitive assistance, intuitive dashboard visualisations, and clear micro-interactions to build trust. When these components align, agentic tools can multiply engineering velocity tenfold.`;

  const handleSummarizeMeeting = async () => {
    if (!meetingNotes.trim()) return;
    setLoadingMeeting(true);
    setMeetingResult("");
    setIsSynced(false);
    setActionItemsParsed([]);
    addLog("Summarizing meeting notes...", "ai");
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "meeting_summarize",
          payload: { notes: meetingNotes }
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMeetingResult(data.result);

      // Extract bullet action items using a simple parser to allow Task creation
      // We search for bullets starting with "-", "*" or numbered list, specifically after 'Action' header
      const lines = data.result.split("\n");
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
          if (itemText.length > 3) {
            items.push(itemText);
          }
        }
      }

      setActionItemsParsed(items);
      addLog("Meeting notes summarized successfully.", "ai");
    } catch (e: any) {
      console.error(e);
      setMeetingResult("Error: Failed to summarize meeting notes. Please check Gemini settings.");
      addLog("Failed to summarize meeting notes.", "ai");
    } finally {
      setLoadingMeeting(false);
    }
  };

  const handleSyncTasks = () => {
    if (actionItemsParsed.length === 0) return;
    actionItemsParsed.forEach((item) => {
      // Extract owner if exists (e.g. "Alex Rivera: Refactor code")
      let owner = "Unassigned";
      let title = item;
      const splitIdx = item.indexOf(":");
      if (splitIdx > 0 && splitIdx < 20) {
        owner = item.substring(0, splitIdx).trim();
        title = item.substring(splitIdx + 1).trim();
      }

      addTask({
        title,
        description: `Synced from meeting notes. Task assigned to ${owner}.`,
        status: "todo",
        priority: "medium",
        dueDate: new Date().toISOString().split("T")[0],
        assignee: owner,
        estimatedTime: 60
      });
    });
    setIsSynced(true);
    addLog(`Synced ${actionItemsParsed.length} meeting action items to task board.`, "user");
  };

  const handleSummarizeDoc = async () => {
    if (!docText.trim()) return;
    setLoadingDoc(true);
    setDocResult("");
    addLog(`Running document summarization format: ${docFormat}...`, "ai");
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "doc_summarize",
          payload: { text: docText, format: docFormat }
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setDocResult(data.result);
      addLog("Document summarized successfully.", "ai");
    } catch (e: any) {
      console.error(e);
      setDocResult("Error: Failed to generate summary.");
      addLog("Document summarization failed.", "ai");
    } finally {
      setLoadingDoc(false);
    }
  };

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-slide-up">
      {/* Tab Selectors */}
      <div className="flex gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab("meeting")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "meeting"
              ? "bg-violet-600 text-white"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          Meeting Sync Manager
        </button>
        <button
          onClick={() => setActiveTab("document")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "document"
              ? "bg-violet-600 text-white"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          AI Document Summarizer
        </button>
      </div>

      {/* Tab 1: Meeting Sync */}
      {activeTab === "meeting" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notes Input */}
          <div className="p-6 rounded-2xl glass-card space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <h4 className="font-bold text-white text-base">Paste Raw Notes</h4>
              <p className="text-xs text-neutral-400">
                Pasted transcript notes will be analyzed by Gemini to extract structural checklists.
              </p>
            </div>

            <textarea
              value={meetingNotes}
              onChange={(e) => setMeetingNotes(e.target.value)}
              placeholder="Start typing or copy meeting notes here..."
              className="w-full h-72 rounded-xl p-4 text-sm text-white bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-violet-500 font-mono leading-relaxed flex-1 mt-4 resize-none"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setMeetingNotes(mockNotes)}
                className="px-4 py-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 text-sm font-semibold flex items-center gap-1.5"
              >
                <ClipboardList className="w-4 h-4" />
                Pre-load Sample notes
              </button>
              <button
                onClick={handleSummarizeMeeting}
                disabled={loadingMeeting || !meetingNotes.trim()}
                className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <Sparkles className={`w-4 h-4 ${loadingMeeting ? "animate-spin" : ""}`} />
                {loadingMeeting ? "Analyzing Notes..." : "Summarize with Gemini"}
              </button>
            </div>
          </div>

          {/* Notes Output Summary */}
          <div className="p-6 rounded-2xl glass-card space-y-4 flex flex-col justify-between min-h-[480px]">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-white text-base">AI Executive Executive Report</h4>
              {meetingResult && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(meetingResult, setCopiedMeeting)}
                    className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white"
                    title="Copy to clipboard"
                  >
                    {copiedMeeting ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>

            {loadingMeeting ? (
              <div className="flex-1 flex flex-col justify-center space-y-4 py-8">
                <div className="h-6 bg-neutral-900 rounded shimmer-loader w-1/3" />
                <div className="h-4 bg-neutral-900 rounded shimmer-loader w-5/6" />
                <div className="h-4 bg-neutral-900 rounded shimmer-loader w-4/5" />
                <div className="h-6 bg-neutral-900 rounded shimmer-loader w-1/4 mt-4" />
                <div className="h-4 bg-neutral-900 rounded shimmer-loader w-1/2" />
                <div className="h-4 bg-neutral-900 rounded shimmer-loader w-2/3" />
              </div>
            ) : meetingResult ? (
              <div className="flex-1 overflow-y-auto prose prose-invert max-h-96 pr-2 leading-relaxed text-sm text-neutral-300 font-sans border-t border-neutral-900 pt-4 whitespace-pre-wrap">
                {meetingResult}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-600 py-12 text-sm italic">
                Output summary will appear here. Paste meeting minutes and hit summarize.
              </div>
            )}

            {/* Sync Checklist action */}
            {actionItemsParsed.length > 0 && (
              <div className="border-t border-neutral-800/80 pt-4 mt-4 flex items-center justify-between gap-4">
                <div className="text-left">
                  <h5 className="font-semibold text-xs text-white">Extracted Action Items</h5>
                  <p className="text-[10px] text-neutral-400">
                    We detected {actionItemsParsed.length} tasks ready to import.
                  </p>
                </div>
                <button
                  onClick={handleSyncTasks}
                  disabled={isSynced}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:border-neutral-700/50 border border-transparent shadow-lg shadow-emerald-500/10"
                >
                  <ListPlus className="w-4 h-4" />
                  {isSynced ? "Synced to Board" : "Sync Action items to Tasks"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Document Summarizer */}
      {activeTab === "document" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Doc Input */}
          <div className="p-6 rounded-2xl glass-card space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <h4 className="font-bold text-white text-base">Paste Document</h4>
              <p className="text-xs text-neutral-400">
                Paste long reports, research, or documents to condense.
              </p>
            </div>

            <textarea
              value={docText}
              onChange={(e) => setDocText(e.target.value)}
              placeholder="Paste raw text/markdown here..."
              className="w-full h-64 rounded-xl p-4 text-sm text-white bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-violet-500 leading-relaxed flex-1 mt-4 resize-none"
            />

            {/* Format Selection */}
            <div className="grid grid-cols-3 gap-2 mt-4 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
              {(["summary", "outline", "flashcards"] as const).map((format) => (
                <button
                  key={format}
                  type="button"
                  onClick={() => setDocFormat(format)}
                  className={`py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                    docFormat === format ? "bg-violet-600 text-white" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setDocText(mockDocText)}
                className="px-4 py-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 text-sm font-semibold flex items-center gap-1.5"
              >
                <ClipboardList className="w-4 h-4" />
                Pre-load Sample Doc
              </button>
              <button
                onClick={handleSummarizeDoc}
                disabled={loadingDoc || !docText.trim()}
                className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <Sparkles className={`w-4 h-4 ${loadingDoc ? "animate-spin" : ""}`} />
                {loadingDoc ? "Summarizing..." : "Summarize Document"}
              </button>
            </div>
          </div>

          {/* Doc Output */}
          <div className="p-6 rounded-2xl glass-card space-y-4 flex flex-col justify-between min-h-[480px]">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-white text-base">Condensed Summary Output</h4>
              {docResult && (
                <button
                  onClick={() => copyToClipboard(docResult, setCopiedDoc)}
                  className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white"
                  title="Copy output"
                >
                  {copiedDoc ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>

            {loadingDoc ? (
              <div className="flex-1 flex flex-col justify-center space-y-4 py-8">
                <div className="h-4 bg-neutral-900 rounded shimmer-loader w-5/6" />
                <div className="h-4 bg-neutral-900 rounded shimmer-loader w-3/4" />
                <div className="h-4 bg-neutral-900 rounded shimmer-loader w-2/3" />
                <div className="h-4 bg-neutral-900 rounded shimmer-loader w-4/5" />
              </div>
            ) : docResult ? (
              <div className="flex-1 overflow-y-auto prose prose-invert max-h-96 pr-2 leading-relaxed text-sm text-neutral-300 font-sans border-t border-neutral-900 pt-4 whitespace-pre-wrap">
                {docResult}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-600 py-12 text-sm italic">
                Output summary will appear here. Choose a format and summarize.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
