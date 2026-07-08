"use client";

import { Fragment } from "react";

function colorFor(value: number): string {
  if (value >= 5) return "#16a34a";
  if (value >= 0) return "#5fc98a";
  if (value >= -5) return "#f59e0b";
  if (value >= -12) return "#f0883e";
  return "#dc2626";
}

export function HeatmapGrid({ rows, cols, values }: { rows: string[]; cols: string[]; values: number[][] }) {
  return (
    <div className="overflow-x-auto">
      <div className="inline-grid gap-1" style={{ gridTemplateColumns: `140px repeat(${cols.length}, 44px)` }}>
        <div />
        {cols.map((c) => (
          <div key={c} className="text-center text-[11px] text-muted pb-1">{c}</div>
        ))}
        {rows.map((r, ri) => (
          <Fragment key={r}>
            <div className="text-[12.5px] font-medium flex items-center pr-2 truncate">{r}</div>
            {values[ri].map((v, ci) => (
              <div
                key={ci}
                title={`${r} / ${cols[ci]}: ${v > 0 ? "+" : ""}${v.toFixed(1)} п.п.`}
                className="h-9 rounded-[8px] flex items-center justify-center text-[10.5px] font-medium text-white/95"
                style={{ background: colorFor(v) }}
              >
                {v > 0 ? "+" : ""}
                {v.toFixed(0)}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
