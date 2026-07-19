<div align="center">

<!-- Hero SVG Banner -->

# 🧠 ProductivityOS AI

### An AI-powered productivity workspace that helps individuals and teams plan, automate, summarize, collaborate, and accomplish more — using Generative AI.

<br />

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-10b981?style=flat-square)](LICENSE)

<br />

🌐 **Live App:** https://productivity-os-ai-l66g.vercel.app/

<br />

[🚀 Live Website](https://productivity-os-ai-l66g.vercel.app/) · [📖 Architecture](#-architecture) · [⚡ Quick Start](#-quick-start)

<br />

---

</div>

<br />

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [AI Workflow](#-ai-workflow)
- [Tech Stack](#-tech-stack)
- [Core Modules](#-core-modules)
- [Folder Structure](#-folder-structure)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Development](#-development)
- [Security](#-security)
- [Accessibility](#-accessibility)
- [Performance](#-performance)
- [Roadmap](#-roadmap)
- [License](#-license)

<br />

> **Dashboard** — AI Insights, Focus Time Velocity chart, real-time activity log, and AI Productivity Coach  
> **Task Board** — 4-column Kanban with AI Autopilot, AI Subtask generation, and priority badges  
> **AI Assistant** — Context-aware conversational agent with workspace state awareness  
> **Daily Planner** — Visual schedule board (09:00–18:00) with AI Schedule Optimizer  
> **Meeting Summarizer** — Paste notes → AI executive summary → Sync action items to Task Board  
> **Email Generator** — Configurable tone, length, and recipient with one-click copy  
> **Workflow Automation** — Trigger-action rules with developer sandbox simulator  
> **Team Workspace** — Collaborator cards with workload indicators and collaboration stream  

</details>

<br />

---

## ✨ Features

<table>
  <tr>
    <td align="center" width="25%">
      <br />
      <strong>🎯 AI Task Manager</strong><br />
      <sub>4-column Kanban board with AI Autopilot for auto-prioritization, AI-generated subtask checklists, priority badges, progress tracking, and estimated time</sub>
    </td>
    <td align="center" width="25%">
      <br />
      <strong>🤖 AI Personal Assistant</strong><br />
      <sub>Context-aware conversational agent with full workspace state — tasks, planner events, chat history — for intelligent planning guidance</sub>
    </td>
    <td align="center" width="25%">
      <br />
      <strong>📅 Smart Daily Planner</strong><br />
      <sub>Visual timeline schedule board (09:00–18:00) with AI Schedule Optimizer that balances workload, inserts breaks, and links tasks</sub>
    </td>
    <td align="center" width="25%">
      <br />
      <strong>📝 Meeting Summarizer</strong><br />
      <sub>Paste raw meeting notes → AI generates executive summary with key decisions and action items → one-click sync to Task Board</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="25%">
      <br />
      <strong>📄 Document Summarizer</strong><br />
      <sub>Condense long documents into summaries, hierarchical outlines, or Q&A flashcards with selectable output format</sub>
    </td>
    <td align="center" width="25%">
      <br />
      <strong>✉️ Email Generator</strong><br />
      <sub>AI-drafted professional emails with configurable tone (5 options), length (3 levels), recipient, and quick-use presets</sub>
    </td>
    <td align="center" width="25%">
      <br />
      <strong>⚡ Workflow Automation</strong><br />
      <sub>If/Then automation rules with triggers (task created/completed) and actions (draft email, add to planner, escalate priority)</sub>
    </td>
    <td align="center" width="25%">
      <br />
      <strong>👥 Team Workspace</strong><br />
      <sub>Collaborator status dashboard with role assignments, workload indicators, and real-time collaboration activity stream</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="25%">
      <br />
      <strong>📊 Insights Dashboard</strong><br />
      <sub>Workspace Focus Score, Total Focus Time, Task Completion Rate, AI Operations count, SVG velocity chart, and AI Coach</sub>
    </td>
    <td align="center" width="25%">
      <br />
      <strong>🎨 Premium Dark UI</strong><br />
      <sub>Glassmorphism cards, gradient borders, dot-matrix backgrounds, shimmer loaders, and smooth slide-up animations</sub>
    </td>
    <td align="center" width="25%">
      <br />
      <strong>💾 Persistent State</strong><br />
      <sub>All tasks, planner events, automations, chat history, and activity logs are persisted via LocalStorage across sessions</sub>
    </td>
    <td align="center" width="25%">
      <br />
      <strong>🔄 Real-Time Activity</strong><br />
      <sub>Workspace-wide activity log tracking user actions, AI operations, and automation triggers with timestamps</sub>
    </td>
  </tr>
</table>

<br />

---

## 🏗 Architecture

### High-Level Architecture

```mermaid
graph TD
    A["🌐 Browser Client"] --> B["⚛️ Next.js 15 App Router"]
    B --> C["🎨 React 19 Components"]
    C --> D["📦 AppContext Provider"]
    D --> E["💾 LocalStorage Persistence"]
    B --> F["🔌 API Route /api/gemini"]
    F --> G["🧠 Google Gemini 2.5 Flash"]
    C --> H["🖌️ Tailwind CSS 4 + Custom CSS"]

    style A fill:#1e1b4b,stroke:#8b5cf6,color:#fff
    style B fill:#0c0a09,stroke:#8b5cf6,color:#fff
    style C fill:#0c0a09,stroke:#8b5cf6,color:#fff
    style D fill:#0c0a09,stroke:#8b5cf6,color:#fff
    style E fill:#0c0a09,stroke:#10b981,color:#fff
    style F fill:#0c0a09,stroke:#8b5cf6,color:#fff
    style G fill:#1e3a5f,stroke:#4285f4,color:#fff
    style H fill:#0c0a09,stroke:#06b6d4,color:#fff
```

### Component Architecture

```mermaid
graph LR
    RootLayout["RootLayout"] --> AppProvider["AppProvider"]
    AppProvider --> Workspace["Workspace Page"]
    Workspace --> Sidebar["Sidebar"]
    Workspace --> Header["Header"]
    Workspace --> MainContent["MainContent Router"]

    MainContent --> DashboardView["DashboardView"]
    MainContent --> AssistantView["AssistantView"]
    MainContent --> TaskBoard["TaskBoard"]
    MainContent --> PlannerView["PlannerView"]
    MainContent --> SummarizersView["SummarizersView"]
    MainContent --> EmailView["EmailView"]
    MainContent --> AutomationsView["AutomationsView"]
    MainContent --> TeamView["TeamView"]

    style RootLayout fill:#0c0a09,stroke:#8b5cf6,color:#fff
    style AppProvider fill:#1e1b4b,stroke:#8b5cf6,color:#fff
    style Workspace fill:#0c0a09,stroke:#8b5cf6,color:#fff
    style Sidebar fill:#0c0a09,stroke:#a78bfa,color:#fff
    style Header fill:#0c0a09,stroke:#a78bfa,color:#fff
    style MainContent fill:#0c0a09,stroke:#a78bfa,color:#fff
    style DashboardView fill:#0c0a09,stroke:#10b981,color:#fff
    style AssistantView fill:#0c0a09,stroke:#10b981,color:#fff
    style TaskBoard fill:#0c0a09,stroke:#10b981,color:#fff
    style PlannerView fill:#0c0a09,stroke:#10b981,color:#fff
    style SummarizersView fill:#0c0a09,stroke:#10b981,color:#fff
    style EmailView fill:#0c0a09,stroke:#10b981,color:#fff
    style AutomationsView fill:#0c0a09,stroke:#10b981,color:#fff
    style TeamView fill:#0c0a09,stroke:#10b981,color:#fff
```

<br />

---

## 🤖 AI Workflow

### AI Request Flow

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant C as ⚛️ React Component
    participant CTX as 📦 AppContext
    participant API as 🔌 /api/gemini
    participant AI as 🧠 Gemini 2.5 Flash

    U->>C: Triggers AI action
    C->>CTX: Calls context method
    CTX->>API: POST with action + payload
    API->>API: Validate request & API key
    API->>AI: generateContent with structured prompt
    AI-->>API: JSON or Markdown response
    API-->>CTX: Parsed result
    CTX->>CTX: Update state & LocalStorage
    CTX-->>C: Re-render with new data
    C-->>U: Display AI output
```

### Application State Flow

```mermaid
stateDiagram-v2
    [*] --> Dashboard: App Launch
    Dashboard --> TaskBoard: Navigate
    Dashboard --> Assistant: Navigate
    Dashboard --> Planner: Navigate
    Dashboard --> Summarizers: Navigate
    Dashboard --> EmailGen: Navigate
    Dashboard --> Automations: Navigate
    Dashboard --> Team: Navigate

    TaskBoard --> AIAutopilot: Trigger AI
    AIAutopilot --> TaskBoard: Priorities Updated

    TaskBoard --> SubtaskGen: Generate Checklist
    SubtaskGen --> TaskBoard: Subtasks Added

    Planner --> ScheduleOptimizer: Optimize
    ScheduleOptimizer --> Planner: Schedule Rebuilt

    Summarizers --> MeetingSummary: Summarize Notes
    MeetingSummary --> TaskBoard: Sync Action Items

    Automations --> TriggerSim: Simulate
    TriggerSim --> Assistant: Auto-draft Email
    TriggerSim --> Planner: Auto-block Calendar
```

### AI Capabilities

| AI Action | Input | Output | Model Config |
|:----------|:------|:-------|:-------------|
| **Chat Assistant** | User query + workspace context | Context-aware markdown response | `text` output |
| **Task Autopilot** | All tasks (id, title, description) | Priority, estimated time, AI tags per task | `application/json` |
| **Subtask Breakdown** | Task title + description | 3–6 actionable subtask strings | `application/json` |
| **Schedule Optimizer** | Uncompleted tasks + current events | Optimized daily timeline (09:00–18:00) | `application/json` |
| **Meeting Summarizer** | Raw meeting notes text | Executive summary + decisions + action items | `text` (markdown) |
| **Email Generator** | Prompt, recipient, tone, length | Complete email draft (subject + body) | `text` output |
| **Document Summarizer** | Raw document text + format type | Summary, outline, or flashcards | `text` (markdown) |
| **Productivity Coach** | Completed/total tasks, focus hours, logs | Strengths, bottlenecks, 3 action tips | `text` (markdown) |

<br />

---

## 🛠 Tech Stack

| Layer | Technology | Version | Purpose |
|:------|:-----------|:--------|:--------|
| **Framework** | Next.js | 15 | App Router, API Routes, Server Components |
| **Language** | TypeScript | 5 | Strict type safety across the codebase |
| **UI Library** | React | 19 | Component architecture and state management |
| **Styling** | Tailwind CSS | 4 | Utility-first styling with custom design system |
| **AI Engine** | Google Gemini | 2.5 Flash | Generative AI for all intelligent features |
| **AI SDK** | @google/genai | 2.11+ | Official Google Gen AI JavaScript SDK |
| **Icons** | Lucide React | 1.25+ | Consistent, tree-shakeable SVG icon library |
| **Animation** | Framer Motion | 12 | Smooth page transitions and micro-animations |
| **Notifications** | React Hot Toast | 2.6 | Non-blocking toast notification system |
| **Skeletons** | React Loading Skeleton | 3.5 | Shimmer loading states for async operations |
| **Validation** | Zod | 4.4 | Runtime schema validation for data integrity |
| **State** | React Context API | — | Centralized application state management |
| **Persistence** | LocalStorage | — | Client-side data persistence across sessions |

<br />

---

## 📦 Core Modules

| Module | Component | Description |
|:-------|:----------|:------------|
| **Dashboard** | `DashboardView` | 4 metric cards (Focus Score, Focus Time, Completion Rate, AI Ops), SVG velocity chart, real-time activity log, AI Productivity Coach with on-demand analysis |
| **AI Assistant** | `AssistantView` | Chat interface with workspace context injection, suggested commands, loading dots animation, message history, and clear conversation |
| **Task Manager** | `TaskBoard` | 4-column Kanban (To Do → In Progress → Review → Done), task creation modal, task detail modal with status switcher, AI Autopilot, AI Subtask generation |
| **Daily Planner** | `PlannerView` | Agenda sidebar + visual schedule board (09:00–18:00 grid), event creation with task linking, AI Schedule Optimizer |
| **Meeting Notes** | `SummarizersView` (tab 1) | Raw notes input with sample preload, AI executive summary, action item extraction, one-click sync to Task Board |
| **Document AI** | `SummarizersView` (tab 2) | Document input with sample preload, 3 output formats (summary/outline/flashcards), clipboard copy |
| **Email Generator** | `EmailView` | 3 quick presets, configurable tone (5 options) and length (3 levels), recipient field, AI draft with clipboard copy |
| **Automations** | `AutomationsView` | If/Then rule builder, activation toggle, delete, developer sandbox with trigger simulation |
| **Team** | `TeamView` | Member cards with status indicators (online/meeting/offline), workload labels, add member form, collaboration activity stream |
| **Sidebar** | `Sidebar` | Navigation menu with active state indicators, brand header, profile footer |
| **Header** | `Header` | Dynamic view title, task completion badge, automation count, Gemini status indicator |
| **Context** | `AppContext` | Centralized state provider for tasks, planner, automations, chat, team, and activity logs with full CRUD + AI integrations |

<br />

---

## 📁 Folder Structure

```
ProductivityOS-AI/
├── app/
│   ├── api/
│   │   └── gemini/
│   │       └── route.ts            # Unified AI API endpoint (8 actions)
│   ├── components/
│   │   ├── AssistantView.tsx       # AI chat assistant interface
│   │   ├── AutomationsView.tsx     # Workflow automation rules engine
│   │   ├── DashboardView.tsx       # Insights dashboard with metrics & AI coach
│   │   ├── EmailView.tsx           # AI email generator with presets
│   │   ├── Header.tsx              # Dynamic header with live metrics
│   │   ├── PlannerView.tsx         # Smart daily planner with schedule board
│   │   ├── Sidebar.tsx             # Navigation sidebar with brand identity
│   │   ├── SummarizersView.tsx     # Meeting & document summarizer (tabbed)
│   │   ├── TaskBoard.tsx           # Kanban task board with AI features
│   │   └── TeamView.tsx            # Team collaboration workspace
│   ├── context/
│   │   └── AppContext.tsx          # Global state provider (685 lines)
│   ├── globals.css                 # Design system: glassmorphism, animations
│   ├── layout.tsx                  # Root layout with fonts & toast provider
│   └── page.tsx                    # Main workspace shell with view routing
├── public/                         # Static assets
├── .env.local                      # Environment variables (gitignored)
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

### Folder Structure Diagram

```mermaid
flowchart TB
    Root["📂 ProductivityOS-AI"] --> App["📂 app/"]
    Root --> Public["📂 public/"]
    Root --> Config["⚙️ Config Files"]

    App --> API["📂 api/gemini/"]
    App --> Components["📂 components/"]
    App --> Context["📂 context/"]
    App --> Styles["🎨 globals.css"]
    App --> Layout["📄 layout.tsx"]
    App --> Page["📄 page.tsx"]

    API --> Route["route.ts — Unified AI endpoint"]

    Components --> C1["DashboardView"]
    Components --> C2["AssistantView"]
    Components --> C3["TaskBoard"]
    Components --> C4["PlannerView"]
    Components --> C5["SummarizersView"]
    Components --> C6["EmailView"]
    Components --> C7["AutomationsView"]
    Components --> C8["TeamView"]
    Components --> C9["Sidebar + Header"]

    Context --> AppCtx["AppContext.tsx — State Provider"]

    style Root fill:#0c0a09,stroke:#8b5cf6,color:#fff
    style App fill:#0c0a09,stroke:#a78bfa,color:#fff
    style Components fill:#0c0a09,stroke:#10b981,color:#fff
    style Context fill:#0c0a09,stroke:#f59e0b,color:#fff
    style API fill:#0c0a09,stroke:#4285f4,color:#fff
```

<br />

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.18+ (recommended: 20+)
- **npm** 9+ or **pnpm**
- **Google Gemini API Key** — [Get one here](https://aistudio.google.com/app/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/tanush326k/ProductivityOS-AI.git
cd ProductivityOS-AI

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Add your Gemini API key to .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

<br />

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

| Variable | Required | Description |
|:---------|:---------|:------------|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API key for all AI features |

> **Note:** The `.env.local` file is gitignored by default. Never commit API keys to version control.

<br />

---

## 💻 Development

| Command | Description |
|:--------|:------------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality checks |

### Development Workflow

```bash
# Start dev server
npm run dev

# In another terminal, run linting
npm run lint

# Build for production
npm run build
```

<br />

---

## 🔒 Security

| Feature | Implementation |
|:--------|:---------------|
| **API Key Protection** | Gemini API key stored in `.env.local`, validated server-side before every request |
| **Server-Side AI Calls** | All Gemini API calls routed through `/api/gemini` — keys never exposed to the client |
| **Input Validation** | Request body validated for required `action` and `payload` fields before processing |
| **Error Boundaries** | Comprehensive try/catch error handling in all API routes with sanitized error messages |
| **Gitignored Secrets** | `.env*` files excluded from version control via `.gitignore` |
| **No Client Secrets** | Zero API keys, tokens, or secrets in client-side JavaScript bundles |

<br />

---

## ♿ Accessibility

| Feature | Implementation |
|:--------|:---------------|
| **ARIA Labels** | All interactive elements include descriptive `aria-label` attributes |
| **Semantic HTML** | `<header>`, `<nav>`, `<main>`, `<aside>`, `<button>`, `<form>` used throughout |
| **Keyboard Navigation** | `tabIndex`, `role="button"`, `aria-current="page"` for full keyboard operability |
| **Focus States** | Visible `focus:outline`, `focus:border`, `focus:ring` on all inputs and buttons |
| **Live Regions** | `aria-live="polite"` and `aria-live="assertive"` for dynamic content updates |
| **Color Contrast** | High-contrast text on dark backgrounds (WCAG AA compliant palette) |
| **Screen Reader Support** | Descriptive labels for icons, modals include close button labels |

<br />

---

## ⚡ Performance

| Feature | Implementation |
|:--------|:---------------|
| **Client Components** | `"use client"` directive only where interactivity is required |
| **Font Optimization** | `next/font/google` with Geist Sans + Geist Mono — zero layout shift |
| **CSS Performance** | Tailwind CSS 4 with PostCSS — tree-shaken, minimal output |
| **Lazy Loading** | View-based routing renders only the active module component |
| **Custom Animations** | CSS keyframes with `cubic-bezier` easing — no JavaScript animation overhead |
| **Lightweight Charts** | Hand-crafted SVG chart in Dashboard — no heavy charting library dependency |
| **Efficient Re-renders** | React Context with targeted state updates to minimize component re-renders |
| **Shimmer Loaders** | CSS-only shimmer animation for loading states — zero JavaScript cost |

<br />


---

## 🗺 Roadmap

| Phase | Feature | Status |
|:------|:--------|:-------|
| **v1.0** | AI Task Manager with Kanban Board | ✅ Shipped |
| **v1.0** | AI Personal Assistant with context awareness | ✅ Shipped |
| **v1.0** | Smart Daily Planner with AI optimizer | ✅ Shipped |
| **v1.0** | Meeting Notes Summarizer with task sync | ✅ Shipped |
| **v1.0** | Document Summarizer (3 formats) | ✅ Shipped |
| **v1.0** | Email Generator with tone/length control | ✅ Shipped |
| **v1.0** | Workflow Automation engine | ✅ Shipped |
| **v1.0** | Team Workspace | ✅ Shipped |
| **v1.0** | AI Insights Dashboard with Coach | ✅ Shipped |
| **v2.0** | Database persistence (PostgreSQL/Supabase) | 🔮 Planned |
| **v2.0** | Authentication & multi-user support | 🔮 Planned |
| **v2.0** | Drag-and-drop Kanban reordering | 🔮 Planned |
| **v2.0** | Real-time collaboration via WebSockets | 🔮 Planned |
| **v2.0** | Calendar integration (Google Calendar API) | 🔮 Planned |
| **v2.0** | Email sending via SMTP/SendGrid | 🔮 Planned |
| **v2.0** | File upload document parsing (PDF, DOCX) | 🔮 Planned |
| **v2.0** | AI streaming responses | 🔮 Planned |

<br />

---

### User Workflow

```mermaid
journey
    title A Day with ProductivityOS AI
    section Morning
      Open Dashboard: 5: User
      Review Focus Score: 4: User
      Run AI Autopilot: 5: AI
      Check prioritized tasks: 5: User
    section Midday
      AI optimize daily schedule: 5: AI
      Join meeting and take notes: 3: User
      Summarize meeting notes: 5: AI
      Sync action items to tasks: 5: AI
    section Afternoon
      Generate client follow-up email: 5: AI
      Complete tasks and trigger automation: 4: User
      Auto-draft completion notification: 5: AI
    section Evening
      Request AI Coach assessment: 5: AI
      Review productivity insights: 4: User
```

### Feature Relationships

```mermaid
mindmap
  root(("ProductivityOS AI"))
    AI Engine
      Gemini 2.5 Flash
      Structured Prompts
      JSON + Markdown Output
    Task Management
      Kanban Board
      AI Autopilot
      Subtask Generation
      Priority Prediction
    Planning
      Timeline Scheduler
      AI Optimizer
      Task Linking
    Summarization
      Meeting Notes
      Document AI
      Action Item Extraction
    Communication
      Email Generator
      Tone Control
      Quick Presets
    Automation
      Trigger-Action Rules
      Developer Sandbox
      Cross-module Workflows
    Collaboration
      Team Dashboard
      Workload Monitoring
      Activity Stream
    Analytics
      Focus Score
      Velocity Chart
      AI Coach
```

<br />

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<br />

---

## 🌟 Support

If this project helped you, please consider giving it a ⭐ on [GitHub](https://github.com/tanush326k/ProductivityOS-AI)!

```
⭐ Star this repository to show your support
🍴 Fork it to customize for your own workflows
🐛 Open issues for bug reports and feature requests
🤝 Pull requests are welcome
```

<br />

---

<div align="center">

**Built with ❤️ using Next.js 15, React 19, TypeScript, Tailwind CSS 4, and Google Gemini 2.5 Flash**

<sub>© 2026 ProductivityOS AI. All rights reserved.</sub>

</div>
