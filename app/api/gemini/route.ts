import { NextResponse } from "next/server";
import { groq, DEFAULT_GROQ_MODEL } from "@/app/lib/groq";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini client as fallback if key exists
const geminiApiKey = process.env.GEMINI_API_KEY || "";
const geminiAi = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

// Clean and extract valid JSON objects or arrays from LLM response
function parseJsonFromText(rawText: string) {
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/```\s*$/, "").trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    if (match) {
      const parsed = JSON.parse(match[1]);
      if (Array.isArray(parsed)) return parsed;
      if (parsed.result && Array.isArray(parsed.result)) return parsed.result;
      if (parsed.tasks && Array.isArray(parsed.tasks)) return parsed.tasks;
      if (parsed.events && Array.isArray(parsed.events)) return parsed.events;
      if (parsed.subtasks && Array.isArray(parsed.subtasks)) return parsed.subtasks;
      return parsed;
    }
    throw new Error(`Failed to parse AI JSON response: ${rawText}`);
  }
}

// Unified AI generator that prioritizes Groq (openai/gpt-oss-120b) with fallback to Gemini
async function generateAIText(prompt: string, systemPrompt?: string): Promise<string> {
  const hasGroqKey = Boolean(process.env.GROQ_API_KEY || process.env.GROK_API_KEY);

  if (hasGroqKey) {
    const messages: Array<{ role: "system" | "user"; content: string }> = [];
    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }
    messages.push({ role: "user", content: prompt });

    const completion = await groq.chat.completions.create({
      model: DEFAULT_GROQ_MODEL,
      messages,
      temperature: 1,
      max_completion_tokens: 2048,
      top_p: 1,
      reasoning_effort: "medium",
    });

    return completion.choices[0]?.message?.content || "";
  }

  if (geminiAi) {
    const combined = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
    const response = await geminiAi.models.generateContent({
      model: "gemini-2.5-flash",
      contents: combined,
    });
    return response.text || "";
  }

  throw new Error(
    "No AI API key found. Please configure GROQ_API_KEY (or GEMINI_API_KEY) in .env.local"
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    const hasGroqKey = Boolean(process.env.GROQ_API_KEY || process.env.GROK_API_KEY);
    const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);

    if (!hasGroqKey && !hasGeminiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured on the server. Please check .env.local" },
        { status: 500 }
      );
    }

    if (!action || !payload) {
      return NextResponse.json(
        { error: "Missing action or payload in request body." },
        { status: 400 }
      );
    }

    let resultText = "";

    switch (action) {
      case "chat": {
        const { history, currentTasks, currentPlanner } = payload;

        const systemPrompt = `You are "ProductivityOS AI", a workspace companion powered by Groq and ${DEFAULT_GROQ_MODEL} integrated directly into the user's dashboard.
You help them manage tasks, plan schedules, write emails, and guide their daily workflow.

Current Workspace Context:
- Tasks list: ${JSON.stringify(currentTasks)}
- Active Planner Schedule: ${JSON.stringify(currentPlanner)}

Instructions:
1. Refer to their active tasks or schedule if they ask about planning, workload, or what they should do next.
2. Keep your answers brief, action-oriented, and formatted in clean markdown.
3. If they ask you to create a task, guide them to use the Task Manager or offer to draft the details.
4. Avoid verbose preambles. Be highly professional, crisp, and helpful.`;

        if (hasGroqKey) {
          const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
            { role: "system", content: systemPrompt },
          ];

          for (const m of history) {
            messages.push({
              role: m.role === "user" ? "user" : "assistant",
              content: m.content,
            });
          }

          const completion = await groq.chat.completions.create({
            model: DEFAULT_GROQ_MODEL,
            messages,
            temperature: 1,
            max_completion_tokens: 2048,
            top_p: 1,
            reasoning_effort: "medium",
          });

          resultText = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
          return NextResponse.json({ result: resultText, provider: "groq", model: DEFAULT_GROQ_MODEL });
        }

        if (geminiAi) {
          const chatPrompt = `${systemPrompt}\n\nChat History:\n${history
            .map((m: any) => `${m.role === "user" ? "User" : "AI"}: ${m.content}`)
            .join("\n")}\nAI:`;

          const response = await geminiAi.models.generateContent({
            model: "gemini-2.5-flash",
            contents: chatPrompt,
          });

          resultText = response.text || "I'm sorry, I couldn't generate a response.";
          return NextResponse.json({ result: resultText, provider: "gemini" });
        }

        break;
      }

      case "task_prioritize": {
        const { tasks } = payload;
        const prompt = `Analyze the following tasks:
${JSON.stringify(tasks)}

For each task, perform the following:
1. Estimate the effort required in minutes as a number (e.g., 30, 45, 60, 90, 120, 180, 240). Be realistic based on task difficulty.
2. Assign a priority: 'low', 'medium', 'high', or 'urgent'.
3. Generate 1 to 3 relevant, lowercase tag strings (e.g. 'design', 'frontend', 'backend', 'marketing', 'doc', 'testing').

Return the result STRICTLY as a JSON array of objects. Do not include markdown code blocks or explanations.
Format:
[
  {
    "id": "task-id",
    "priority": "low" | "medium" | "high" | "urgent",
    "estimatedTime": 90,
    "aiTags": ["tag1", "tag2"]
  }
]`;

        const raw = await generateAIText(prompt, "You are a precise task prioritization assistant. Output strictly valid JSON.");
        const parsed = parseJsonFromText(raw);
        return NextResponse.json({ result: parsed });
      }

      case "task_breakdown": {
        const { title, description } = payload;
        const prompt = `Break down the following task into a checklist of 3 to 6 logical, concrete, and highly actionable subtasks:
Task Title: "${title}"
Description: "${description || "No description provided."}"

Return the result STRICTLY as a JSON array of strings. Do not include extra text or markdown wrapping.
Format:
[
  "Subtask title 1",
  "Subtask title 2"
]`;

        const raw = await generateAIText(prompt, "You are an expert project manager. Output strictly a valid JSON array of subtask strings.");
        const parsed = parseJsonFromText(raw);
        return NextResponse.json({ result: parsed });
      }

      case "planner_optimize": {
        const { tasks, currentEvents } = payload;
        const prompt = `You are a Smart Scheduling Optimizer. Design a perfectly balanced daily timeline from 09:00 to 18:00.
Uncompleted Tasks list (with estimates and priority):
${JSON.stringify(tasks)}

Current Calendar Setup:
${JSON.stringify(currentEvents)}

Instructions:
1. Create a logical sequence of planner events.
2. Distribute high-priority/urgent tasks in the morning when focus is highest.
3. Ensure there is a 60m 'Lunch Break' at 12:00 or 13:00.
4. Keep the morning 'Morning Standup & Sync' (09:30 - 10:00) if it is in the current setup, or schedule it.
5. Insert 10-15 minute rest breaks ('Break') between long work periods.
6. The timeline MUST fit within 09:00 and 18:00.
7. Return the events STRICTLY as a JSON array of objects.

Format:
[
  {
    "title": "Event Name",
    "start": "HH:MM",
    "duration": 60,
    "type": "work" | "meeting" | "break" | "personal",
    "taskId": "task-id-if-linked"
  }
]`;

        const raw = await generateAIText(prompt, "You are a schedule optimization AI. Return strictly a JSON array of event objects.");
        const parsed = parseJsonFromText(raw);
        return NextResponse.json({ result: parsed });
      }

      case "meeting_summarize": {
        const { notes } = payload;
        const prompt = `Analyze the following raw meeting notes:
---
${notes}
---

Generate a premium, well-structured executive summary.
Your output must include:
1. **Executive Summary**: A concise paragraph of what was discussed.
2. **Key Decisions**: Bullet points of main decisions made.
3. **Action Items**: A clean checklist of action items, specifying the owner if mentioned.

Format everything in premium, readable markdown with bold text, clean lists, and dividers.`;

        resultText = await generateAIText(prompt, "You are an executive assistant specializing in meeting syntheses.");
        return NextResponse.json({ result: resultText });
      }

      case "email_generate": {
        const { prompt: emailPrompt, recipient, tone, length } = payload;
        const prompt = `Draft a premium email based on the following instructions:
- Prompt/Goal: ${emailPrompt}
- Intended Recipient: ${recipient}
- Tone: ${tone} (e.g. Professional, Friendly, Urgent, Persuasive, Casual)
- Length: ${length} (e.g. Short, Medium, Long)

Return ONLY the email draft text (Subject Line and Email Body). Do not include any conversational intro/outro, notes, or bracketed instructions (like [Your Name]). Fill in placeholders with plausible details or keep them clean.`;

        resultText = await generateAIText(prompt, "You are an executive communications specialist. Output only the email draft.");
        return NextResponse.json({ result: resultText });
      }

      case "doc_summarize": {
        const { text, format } = payload;
        const prompt = `Analyze the following document/text:
---
${text}
---

Generate a summary in the requested format: "${format}" (either "summary", "outline", or "flashcards").
- If "summary": Create a polished 2-3 sentence overview followed by 3 core bullet takeaways.
- If "outline": Write a detailed, hierarchical nested bullet outline of the key topics.
- If "flashcards": Return a list of 4 to 6 flashcards formatted as Q&A pairs (e.g., **Q: Question?** \\n **A: Answer**).

Keep the content crisp and format it beautifully in markdown.`;

        resultText = await generateAIText(prompt, "You are a document synthesis specialist.");
        return NextResponse.json({ result: resultText });
      }

      case "insights": {
        const { tasksCompleted, totalTasks, focusHours, history } = payload;
        const prompt = `You are the AI Executive Productivity Coach in ProductivityOS.
Analyze the user's performance metrics:
- Completed Tasks: ${tasksCompleted} / ${totalTasks}
- Total Focus Hours: ${focusHours} hours
- Activity log of recent actions: ${JSON.stringify(history)}

Provide a highly customized, premium productivity evaluation:
1. Highlight **1 Key Strength** you noticed in their completion pattern.
2. Identify **1 Potential Bottleneck** or area for improvement.
3. Recommend **3 Actionable Focus Tips** for their next week to help them optimize their focus time and workflow.

Format the output in clean, gorgeous markdown with small headings and a supportive, executive coaching tone.`;

        resultText = await generateAIText(prompt, "You are an executive productivity coach. Output in clean markdown.");
        return NextResponse.json({ result: resultText });
      }

      default:
        return NextResponse.json(
          { error: `Unsupported action: ${action}` },
          { status: 400 }
        );
    }
  } catch (e: any) {
    console.error("API Error in AI Route:", e);
    return NextResponse.json(
      { error: e.message || "An internal error occurred during the AI API call." },
      { status: 500 }
    );
  }
}
