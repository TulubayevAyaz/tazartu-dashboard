"use client";

import { motion } from "framer-motion";
import type { DelayReasonCount } from "@/lib/types/swap";

export function DelayReasonsCard({ reasons }: { reasons: DelayReasonCount[] }) {
  if (reasons.length === 0) {
    return (
      <p className="text-[13px] text-muted py-8 text-center">
        Нет данных по причинам отставания — нажмите «Обновить по подрядчикам» в панели выше.
      </p>
    );
  }

  const max = reasons[0].count;

  return (
    <div className="flex flex-col gap-4">
      {reasons.map((r, i) => (
        <motion.div
          key={r.reason}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="flex items-start gap-3"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger text-[12px] font-semibold">
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[13px] font-medium" title={r.reason}>
                {r.reason}
              </span>
              <span className="text-[12.5px] text-muted shrink-0">{r.count} объектов</span>
            </div>
            <div className="mt-1.5 h-1.5 rounded-full bg-surface-2 overflow-hidden">
              <div className="h-full rounded-full bg-danger/70" style={{ width: `${(r.count / max) * 100}%` }} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
