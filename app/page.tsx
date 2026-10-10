"use client";

import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { DashboardView } from "./components/DashboardView";
import { AssistantView } from "./components/AssistantView";
import { TaskBoard } from "./components/TaskBoard";
import { PlannerView } from "./components/PlannerView";
import { SummarizersView } from "./components/SummarizersView";

function MainContent() {
  const { activeView } = useApp();

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView />;
      case "assistant":
        return <AssistantView />;
      case "tasks":
        return <TaskBoard />;
      case "planner":
        return <PlannerView />;
      case "notes":
      case "docs":
      case "email":
      case "studio":
        return <SummarizersView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <main className="flex-1 overflow-y-auto bg-neutral-950/20" id="main-content">
      {renderView()}
    </main>
  );
}

export default function Workspace() {
  return (
    <AppProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-100 font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <MainContent />
        </div>
      </div>
    </AppProvider>
  );
}