"use client";

import { AlertTriangle, Info, XCircle } from "lucide-react";
import { NOTIFICATIONS } from "@/lib/data/notifications";
import { cn } from "@/lib/utils";

const LEVEL_STYLES = {
  critical: { icon: XCircle, color: "text-danger", bg: "bg-danger/10" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
  info: { icon: Info, color: "text-brand-2", bg: "bg-brand/10" },
} as const;

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diffMs / 3_600_000);
  if (h < 1) return "только что";
  if (h < 24) return `${h} ч назад`;
  return `${Math.floor(h / 24)} дн назад`;
}

export function NotificationsPanel() {
  return (
    <div className="absolute right-0 top-11 w-[360px] max-h-[70vh] overflow-y-auto card shadow-xl z-40 p-2">
      <div className="px-2 py-2 text-[13px] font-semibold">Уведомления</div>
      <div className="space-y-1">
        {NOTIFICATIONS.map((n) => {
          const style = LEVEL_STYLES[n.level];
          const Icon = style.icon;
          return (
            <div
              key={n.id}
              className={cn(
                "flex gap-2.5 rounded-[12px] p-2.5 text-left transition-colors hover:bg-surface-2",
                !n.read && "bg-surface-2/60",
              )}
            >
              <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", style.bg, style.color)}>
                <Icon size={15} />
              </div>
              <div className="min-w-0">
                <div className="text-[12.5px] font-medium leading-snug">{n.title}</div>
                <div className="text-[12px] text-muted leading-snug mt-0.5">{n.detail}</div>
                <div className="text-[11px] text-muted/80 mt-1">{timeAgo(n.time)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
