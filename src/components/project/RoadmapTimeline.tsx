import { CheckCircle2, CircleDot, Circle, AlertTriangle } from "lucide-react";
import type { Milestone } from "@/lib/data/project";
import { cn } from "@/lib/utils";

const STATUS_META = {
  done: { icon: CheckCircle2, color: "text-success", line: "bg-success" },
  active: { icon: CircleDot, color: "text-brand-2 dark:text-brand", line: "bg-brand" },
  plan: { icon: Circle, color: "text-muted", line: "bg-border" },
  at_risk: { icon: AlertTriangle, color: "text-danger", line: "bg-danger" },
} as const;

export function RoadmapTimeline({ items }: { items: Milestone[] }) {
  return (
    <div className="flex overflow-x-auto gap-0 pb-2 -mx-1">
      {items.map((m, i) => {
        const meta = STATUS_META[m.status];
        const Icon = meta.icon;
        return (
          <div key={m.id} className="flex flex-col min-w-[190px] px-1 relative">
            <div className="flex items-center">
              <div className={cn("h-0.5 flex-1", i === 0 ? "bg-transparent" : meta.line)} />
              <Icon size={20} className={cn(meta.color, "shrink-0")} strokeWidth={2.2} />
              <div className={cn("h-0.5 flex-1", i === items.length - 1 ? "bg-transparent" : STATUS_META[items[i + 1]?.status ?? m.status].line)} />
            </div>
            <div className="mt-2.5">
              <div className="text-[11.5px] font-medium text-muted">{m.period}</div>
              <div className="text-[13px] font-semibold leading-snug mt-0.5">{m.title}</div>
              <div className="text-[12px] text-muted mt-1 leading-snug">{m.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
