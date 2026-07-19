"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Sparkles, Send, Trash2, Bot, User, CornerDownLeft } from "lucide-react";

export const AssistantView: React.FC = () => {
  const { messages, sendChatMessage, clearChat } = useApp();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const query = input;
    setInput("");
    setLoading(true);
    await sendChatMessage(query);
    setLoading(false);
  };

  const handleSuggestion = async (suggestion: string) => {
    if (loading) return;
    setLoading(true);
    await sendChatMessage(suggestion);
    setLoading(false);
  };

  const suggestions = [
    "What tasks do I have in progress?",
    "Generate a new task to write compliance test suites",
    "What are my scheduled meetings for today?",
    "Summarize my daily workload context"
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col justify-between animate-slide-up">
      {/* Header Info */}
      <div className="flex justify-between items-center pb-4 border-b border-neutral-800/80">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-violet-400" />
            AI Assistant
          </h3>
          <p className="text-xs text-neutral-400">
            A GenAI workspace agent capable of parsing tasks, schedule metrics, and helping you write copy.
          </p>
        </div>

        <button
          onClick={clearChat}
          className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 flex items-center gap-1.5 text-xs font-semibold transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Conversation
        </button>
      </div>

      {/* Main chat viewport */}
      <div className="flex-1 overflow-y-auto my-6 space-y-4 pr-2 scrollbar select-text">
        {messages.map((msg) => {
          const isAI = msg.role === "model";
          return (
            <div
              key={msg.id}
              className={`flex gap-4 p-4 rounded-2xl max-w-3xl ${
                isAI
                  ? "bg-neutral-900/40 border border-neutral-800/60 self-start"
                  : "bg-violet-600/10 border border-violet-500/20 text-white ml-auto"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                  isAI
                    ? "bg-violet-600 text-white border-violet-500"
                    : "bg-neutral-950 text-neutral-400 border-neutral-800"
                }`}
              >
                {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Content */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-200">
                    {isAI ? "ProductivityOS Agent" : "You"}
                  </span>
                  <span className="text-[9px] text-neutral-500">{msg.timestamp}</span>
                </div>

                {msg.content === "" ? (
                  // Streaming loading dots
                  <div className="flex gap-1 py-2 items-center" aria-label="AI thinking">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                ) : (
                  <div className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap font-sans prose prose-invert">
                    {msg.content}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Footer Area: Suggestions and Input Form */}
      <div className="space-y-4">
        {/* Suggestion Chips */}
        {messages.length <= 1 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
              Suggested Agent Commands:
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestion(s)}
                  disabled={loading}
                  className="px-3.5 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 text-xs text-neutral-300 hover:text-white hover:scale-[1.01] transition-all disabled:opacity-40"
                >
                  ⚡ {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input box form */}
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="w-full rounded-2xl pl-4 pr-16 py-4 text-sm text-white bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/25"
            placeholder={loading ? "AI Agent is compiling thoughts..." : "Type query to chat with your tasks context..."}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-3 p-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-40 flex items-center justify-center transition-all"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
