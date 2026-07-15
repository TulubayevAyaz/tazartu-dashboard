"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatNumber, formatPercent } from "@/lib/utils";
import type { ContractorRow, RegionSwitchRow } from "@/lib/types/swap";

const RISK_THRESHOLD_PCT = 50;

function RiskRow({
  label,
  sublabel,
  remaining,
  progressPct,
  index,
}: {
  label: string;
  sublabel?: string;
  remaining: number;
  progressPct: number;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="flex items-center gap-3 py-2.5 border-b border-border/60 last:border-0"
    >
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium truncate">{label}</div>
        {sublabel && (
          <div className="text-[11.5px] text-muted truncate" title={sublabel}>
            {sublabel}
          </div>
        )}
      </div>
      <Badge tone="danger">{formatPercent(progressPct, 0)}</Badge>
      <span className="text-[12.5px] text-muted w-28 text-right shrink-0">осталось {formatNumber(remaining)}</span>
    </motion.div>
  );
}

export function RisksCard({ contractors, regions }: { contractors: ContractorRow[]; regions: RegionSwitchRow[] }) {
  const riskyContractors = [...contractors]
    .filter((c) => c.progressPct < RISK_THRESHOLD_PCT && c.remainingPorts > 0)
    .sort((a, b) => b.remainingPorts - a.remainingPorts)
    .slice(0, 6);

  const riskyRegions = regions
    .map((r) => ({ ...r, remaining: r.plannedPorts - r.acceptedPorts }))
    .filter((r) => r.progressPct < RISK_THRESHOLD_PCT && r.remaining > 0)
    .sort((a, b) => b.remaining - a.remaining)
    .slice(0, 5);

  if (contractors.length === 0 && regions.length === 0) {
    return (
      <p className="text-[13px] text-muted py-8 text-center">
        Нет данных по подрядчикам — нажмите «Обновить по подрядчикам» в панели выше.
      </p>
    );
  }

  if (riskyContractors.length === 0 && riskyRegions.length === 0) {
    return (
      <p className="text-[13px] text-muted py-8 text-center">
        Существенных рисков не выявлено — все подрядчики и регионы выше {RISK_THRESHOLD_PCT}% выполнения плана.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
      <div>
        <div className="flex items-center gap-1.5 text-[12px] font-medium text-muted mb-1">
          <AlertTriangle size={13} className="text-danger" />
          Подрядчики — крупнейшее отставание
        </div>
        {riskyContractors.length === 0 ? (
          <p className="text-[12.5px] text-muted py-4">Нет подрядчиков с отставанием более {RISK_THRESHOLD_PCT}%.</p>
        ) : (
          riskyContractors.map((c, i) => (
            <RiskRow
              key={c.contractor}
              index={i}
              label={c.contractor}
              sublabel={c.topDelayReasons[0]?.reason}
              remaining={c.remainingPorts}
              progressPct={c.progressPct}
            />
          ))
        )}
      </div>

      <div className="mt-6 lg:mt-0">
        <div className="flex items-center gap-1.5 text-[12px] font-medium text-muted mb-1">
          <AlertTriangle size={13} className="text-danger" />
          Регионы — крупнейшее отставание
        </div>
        {riskyRegions.length === 0 ? (
          <p className="text-[12.5px] text-muted py-4">Нет регионов с отставанием более {RISK_THRESHOLD_PCT}%.</p>
        ) : (
          riskyRegions.map((r, i) => (
            <RiskRow key={r.region} index={i} label={r.region} remaining={r.remaining} progressPct={r.progressPct} />
          ))
        )}
      </div>
    </div>
  );
}
