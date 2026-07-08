"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Point {
  year: number;
  planPct: number;
  factPct: number | null;
}

export function PlanFactChart({ data, height = 260 }: { data: Point[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="planGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--muted)" stopOpacity={0.25} />
            <stop offset="100%" stopColor="var(--muted)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="factGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="year" tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} unit="%" width={40} />
        <Tooltip
          contentStyle={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            fontSize: 12.5,
          }}
          formatter={(v) => `${Number(v).toFixed(1)}%`}
        />
        <Area type="monotone" dataKey="planPct" name="План" stroke="var(--muted)" strokeWidth={2} fill="url(#planGrad)" strokeDasharray="5 4" connectNulls />
        <Area type="monotone" dataKey="factPct" name="Факт" stroke="var(--brand)" strokeWidth={2.5} fill="url(#factGrad)" connectNulls />
      </AreaChart>
    </ResponsiveContainer>
  );
}
