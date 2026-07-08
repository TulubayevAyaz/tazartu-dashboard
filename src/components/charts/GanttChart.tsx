"use client";

import type { Milestone } from "@/lib/data/project";
import { cn } from "@/lib/utils";

const QUARTER_LABELS = ["Q1", "Q2", "Q3", "Q4"];
const YEARS = [2024, 2025, 2026, 2027, 2028];
const TOTAL_QUARTERS = YEARS.length * 4;

function quarterIndex(period: string): number {
  const [q, y] = period.split(" ");
  const yearIdx = YEARS.indexOf(Number(y));
  const qIdx = QUARTER_LABELS.indexOf(q);
  return yearIdx * 4 + qIdx;
}

const STATUS_COLOR: Record<Milestone["status"], string> = {
  done: "bg-success",
  active: "bg-brand",
  plan: "bg-border",
  at_risk: "bg-danger",
};

const TODAY_QUARTER = quarterIndex("Q3 2026") + 0.3;

export function GanttChart({ items }: { items: Milestone[] }) {
  return (
    <div>
      <div className="flex text-[11px] text-muted mb-2 pl-[220px]">
        {YEARS.map((y) => (
          <div key={y} className="flex-1 text-center">{y}</div>
        ))}
      </div>
      <div className="relative space-y-2.5">
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-danger/70 z-10"
          style={{ left: `calc(220px + ${(TODAY_QUARTER / TOTAL_QUARTERS) * 100}%)` }}
        />
        {items.map((m) => {
          const start = quarterIndex(m.period);
          const widthQuarters = 2;
          return (
            <div key={m.id} className="flex items-center gap-3">
              <div className="w-[220px] shrink-0 text-[12.5px] font-medium truncate pr-2">{m.title}</div>
              <div className="relative h-6 flex-1 rounded-full bg-surface-2 overflow-hidden">
                <div
                  className={cn("absolute inset-y-0 rounded-full", STATUS_COLOR[m.status])}
                  style={{
                    left: `${(start / TOTAL_QUARTERS) * 100}%`,
                    width: `${(widthQuarters / TOTAL_QUARTERS) * 100}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-4 text-[11.5px] text-muted">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" />Готово</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-brand" />В работе</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-border" />План</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-[2px] bg-danger/70" />Сегодня</span>
      </div>
    </div>
  );
}
