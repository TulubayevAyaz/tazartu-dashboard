"use client";

import { ChevronsLeft, Recycle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/store";
import { SidebarNavContent } from "./SidebarNavContent";

export function Sidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col shrink-0 border-r border-border bg-surface/60 backdrop-blur-xl transition-[width] duration-200 sticky top-0 h-screen",
        collapsed ? "w-[76px]" : "w-[264px]",
      )}
    >
      <div className="flex items-center gap-2.5 h-16 px-4 border-b border-border shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-2 text-white shrink-0">
          <Recycle size={18} strokeWidth={2.4} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-[14px] font-semibold leading-tight truncate">Тазарту</div>
            <div className="text-[11px] text-muted leading-tight truncate">Казахтелеком</div>
          </div>
        )}
      </div>

      <SidebarNavContent collapsed={collapsed} />

      <button
        onClick={toggleSidebar}
        className="flex items-center gap-2 m-2.5 rounded-[10px] px-2.5 py-2 text-[12.5px] font-medium text-muted hover:bg-surface-2 hover:text-foreground transition-colors"
      >
        <ChevronsLeft size={16} className={cn("transition-transform", collapsed && "rotate-180")} />
        {!collapsed && "Свернуть"}
      </button>
    </aside>
  );
}
