import Groq from "groq-sdk";

// Initialize Groq client with fallback support for both GROQ_API_KEY and GROK_API_KEY
export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || process.env.GROK_API_KEY || "",
});

export const DEFAULT_GROQ_MODEL = "openai/gpt-oss-120b";
