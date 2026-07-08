"use client";

import Link from "next/link";
import { cn, formatPercent } from "@/lib/utils";

export interface RegionProgressItem {
  id: string;
  name: string;
  planPct: number;
  factPct: number;
  meta?: string;
}

function barColor(fact: number, plan: number): string {
  const gap = fact - plan;
  if (gap >= 0) return "bg-success";
  if (gap >= -4) return "bg-brand";
  if (gap >= -12) return "bg-warning";
  return "bg-danger";
}

export function RegionProgressList({ items }: { items: RegionProgressItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((r) => (
        <Link key={r.id} href={`/clients?region=${r.id}`} className="block group">
          <div className="flex items-center justify-between text-[13px] mb-1.5">
            <span className="font-medium group-hover:text-brand-2 dark:group-hover:text-brand transition-colors">{r.name}</span>
            <span className="text-muted">
              <span className={cn("font-semibold", r.factPct >= r.planPct ? "text-success" : "text-foreground")}>{formatPercent(r.factPct)}</span>
              {" "}/ план {formatPercent(r.planPct)}
              {r.meta && <span className="ml-2">{r.meta}</span>}
            </span>
          </div>
          <div className="relative h-2.5 w-full rounded-full bg-surface-2 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-border"
              style={{ width: `${Math.min(r.planPct, 100)}%` }}
            />
            <div
              className={cn("absolute inset-y-0 left-0 rounded-full transition-all", barColor(r.factPct, r.planPct))}
              style={{ width: `${Math.min(r.factPct, 100)}%` }}
            />
            <div
              className="absolute inset-y-0 w-[2px] bg-foreground/40"
              style={{ left: `${Math.min(r.planPct, 100)}%` }}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
