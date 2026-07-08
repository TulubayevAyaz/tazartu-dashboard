"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_GROUPS } from "./nav";

export function SidebarNavContent({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4">
      {NAV_GROUPS.map((group, gi) => (
        <div key={gi}>
          {group.title && !collapsed && (
            <div className="px-2.5 mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted">
              {group.title}
            </div>
          )}
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-[10px] px-2.5 py-2 text-[13.5px] font-medium transition-colors",
                    active
                      ? "bg-brand/12 text-brand-2 dark:text-brand"
                      : "text-foreground/75 hover:bg-surface-2 hover:text-foreground",
                  )}
                >
                  <Icon size={17} strokeWidth={2} className="shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
