"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { cn, formatNumber, formatPercent } from "@/lib/utils";
import type { ContractorRow } from "@/lib/types/swap";

function barColor(pct: number): string {
  if (pct >= 90) return "bg-success";
  if (pct >= 60) return "bg-brand";
  if (pct >= 30) return "bg-warning";
  return "bg-danger";
}

export function ContractorTable({ rows }: { rows: ContractorRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="text-[13px] text-muted py-8 text-center">
        Нет данных по подрядчикам — нажмите «Обновить по подрядчикам» в панели выше.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-[13px] min-w-[880px]">
        <thead>
          <tr className="text-left text-muted border-b border-border">
            <th className="px-3 py-2 font-medium">Подрядчик</th>
            <th className="px-3 py-2 font-medium">Объектов</th>
            <th className="px-3 py-2 font-medium">План (портов)</th>
            <th className="px-3 py-2 font-medium">Принято</th>
            <th className="px-3 py-2 font-medium w-[160px]">Прогресс</th>
            <th className="px-3 py-2 font-medium">Осталось</th>
            <th className="px-3 py-2 font-medium">Причина отставания</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <motion.tr
              key={r.contractor}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i, 20) * 0.03 }}
              className="border-b border-border/60 last:border-0 hover:bg-surface-2/60 transition-colors"
            >
              <td className="px-3 py-2.5 font-medium">{r.contractor}</td>
              <td className="px-3 py-2.5 text-muted">{r.objectCount}</td>
              <td className="px-3 py-2.5">{formatNumber(r.plannedPorts)}</td>
              <td className="px-3 py-2.5">{formatNumber(r.acceptedPorts)}</td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="relative h-2 flex-1 rounded-full bg-surface-2 overflow-hidden">
                    <div
                      className={cn("absolute inset-y-0 left-0 rounded-full transition-all", barColor(r.progressPct))}
                      style={{ width: `${Math.min(r.progressPct, 100)}%` }}
                    />
                  </div>
                  <span className="text-[12px] text-muted w-9 text-right">{formatPercent(r.progressPct, 0)}</span>
                </div>
              </td>
              <td className={cn("px-3 py-2.5", r.remainingPorts > 0 ? "text-foreground" : "text-success")}>
                {formatNumber(r.remainingPorts)}
              </td>
              <td className="px-3 py-2.5 max-w-[260px]">
                {r.topDelayReasons[0] ? (
                  <Badge tone={r.remainingPorts > 0 ? "danger" : "muted"}>
                    <span className="truncate max-w-[220px] inline-block align-bottom" title={r.topDelayReasons[0].reason}>
                      {r.topDelayReasons[0].reason}
                    </span>
                  </Badge>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
