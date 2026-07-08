import { cn } from "@/lib/utils";

export type BadgeTone = "brand" | "success" | "warning" | "danger" | "muted";

const TONES: Record<BadgeTone, string> = {
  brand: "bg-brand/12 text-brand-2 dark:text-brand",
  success: "bg-success/12 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/12 text-danger",
  muted: "bg-surface-2 text-muted",
};

export function Badge({ tone = "muted", children }: { tone?: BadgeTone; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-medium whitespace-nowrap", TONES[tone])}>
      {children}
    </span>
  );
}
