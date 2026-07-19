"use client";

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Sparkles, Mail, Copy, Check, Info, FileText } from "lucide-react";

export const EmailView: React.FC = () => {
  const { addLog } = useApp();

  const [prompt, setPrompt] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const presets = [
    { label: "Request meeting availability", prompt: "Ask the client for their meeting schedule next week to review final design wireframes." },
    { label: "Apologize for delayed launch", prompt: "Write an apology email to stakeholders explaining that our beta sandbox launch will be delayed by 2 days for compliance testing." },
    { label: "Follow up on invoice", prompt: "Follow up politely on the outstanding project milestone invoice that was due last Friday." }
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResult("");
    addLog("Requesting AI email copy draft...", "ai");

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "email_generate",
          payload: {
            prompt,
            recipient: recipient || "Stakeholder",
            tone,
            length
          }
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setResult(data.result);
      addLog("AI email draft generated successfully.", "ai");
    } catch (e: any) {
      console.error(e);
      setResult("Error: Failed to generate email. Check Gemini configuration.");
      addLog("Failed to generate email.", "ai");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-slide-up">
      {/* Description */}
      <div>
        <h3 className="text-2xl font-bold text-white">Email Generator</h3>
        <p className="text-xs text-neutral-400">
          Create executive-level email drafts instantly with targeted audience, length, and tone options.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Inputs */}
        <div className="p-6 rounded-2xl glass-card space-y-6">
          <h4 className="font-bold text-white text-base flex items-center gap-2">
            <Mail className="w-4 h-4 text-violet-400" />
            Email Parameters
          </h4>

          {/* Quick presets */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-400">
              Quick Preset Prompts
            </label>
            <div className="flex flex-col gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPrompt(preset.prompt);
                    if (preset.label.includes("invoice")) setRecipient("Accounts Team");
                    else if (preset.label.includes("meeting")) setRecipient("Client / Partner");
                    else setRecipient("Stakeholders");
                  }}
                  className="w-full text-left p-3 rounded-xl bg-neutral-950 hover:bg-neutral-800/60 border border-neutral-800/80 text-xs text-neutral-300 hover:text-white transition-all line-clamp-1 font-medium"
                >
                  💡 {preset.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                Context / Goal *
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                rows={4}
                className="w-full rounded-xl p-3 text-sm text-white bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-violet-500 leading-relaxed resize-none"
                placeholder="What is the goal of the email? (e.g. Ask for feedback, schedule review...)"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">
                  Recipient
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full rounded-xl p-3 text-sm text-white bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-violet-500"
                  placeholder="e.g. Client, Team"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full rounded-xl p-3 text-sm text-white bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-violet-500"
                >
                  <option value="Professional">Professional</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Persuasive">Persuasive</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Casual">Casual</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">
                  Length
                </label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full rounded-xl p-3 text-sm text-white bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-violet-500"
                >
                  <option value="Short">Short</option>
                  <option value="Medium">Medium</option>
                  <option value="Long">Long</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-violet-500/10 disabled:opacity-40"
            >
              <Sparkles className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Drafting Email..." : "Generate Email Draft"}
            </button>
          </form>
        </div>

        {/* Output Display */}
        <div className="p-6 rounded-2xl glass-card flex flex-col justify-between min-h-[480px]">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-white text-base">Generated Copy</h4>
            {result && (
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white flex items-center gap-1.5 text-xs font-semibold"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Draft
                  </>
                )}
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex-1 flex flex-col justify-center space-y-4 py-8">
              <div className="h-4 bg-neutral-900 rounded shimmer-loader w-1/4" />
              <div className="h-4 bg-neutral-900 rounded shimmer-loader w-5/6" />
              <div className="h-4 bg-neutral-900 rounded shimmer-loader w-4/5" />
              <div className="h-4 bg-neutral-900 rounded shimmer-loader w-2/3" />
              <div className="h-4 bg-neutral-900 rounded shimmer-loader w-1/2" />
            </div>
          ) : result ? (
            <div className="flex-1 overflow-y-auto bg-neutral-950 p-6 rounded-xl border border-neutral-850 max-h-[400px] leading-relaxed text-sm text-neutral-300 font-mono whitespace-pre-wrap select-text">
              {result}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-600 py-12 text-sm italic">
              AI-generated draft copy will display here. Configure fields and hit generate.
            </div>
          )}

          {/* Quick Disclaimer */}
          <div className="mt-4 flex gap-2.5 items-start bg-neutral-900/40 p-3 rounded-lg border border-neutral-800/80 text-[10px] text-neutral-400 leading-normal">
            <Info className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
            <span>
              Always verify AI generated communications prior to client delivery. Custom fields inside brackets can be modified on clipboard.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
