"use client";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNav } from "./MobileNav";
import { AiAssistant } from "@/components/ai/AiAssistant";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <MobileNav />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1 min-w-0 px-4 md:px-6 py-6 max-w-[1600px] w-full mx-auto">{children}</main>
      </div>
      <AiAssistant />
    </div>
  );
}
