"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  sublabel?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  accent?: "brand" | "success" | "warning" | "danger";
  index?: number;
}

const ACCENTS = {
  brand: "from-brand/15 to-brand-2/5 text-brand-2 dark:text-brand",
  success: "from-success/15 to-success/5 text-success",
  warning: "from-warning/15 to-warning/5 text-warning",
  danger: "from-danger/15 to-danger/5 text-danger",
};

export function KpiCard({ label, value, sublabel, icon: Icon, trend, accent = "brand", index = 0 }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className="card p-5 flex flex-col gap-3 min-w-0"
    >
      <div className="flex items-center justify-between">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-[12px] bg-gradient-to-br", ACCENTS[accent])}>
          <Icon size={19} strokeWidth={2.1} />
        </div>
        {trend && (
          <span className={cn("text-[12px] font-medium", trend.positive ? "text-success" : "text-danger")}>
            {trend.value}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <div className="text-[26px] font-semibold tracking-tight leading-tight truncate">{value}</div>
        <div className="text-[13px] text-muted mt-0.5 truncate">{label}</div>
        {sublabel && <div className="text-[11.5px] text-muted/80 mt-1 truncate">{sublabel}</div>}
      </div>
    </motion.div>
  );
}
