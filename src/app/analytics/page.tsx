"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { PlanFactChart } from "@/components/charts/PlanFactChart";
import { GanttChart } from "@/components/charts/GanttChart";
import { HeatmapGrid } from "@/components/charts/HeatmapGrid";
import { REGIONS, OVERALL_HISTORY, TOTAL_CLIENTS, TOTAL_MIGRATED } from "@/lib/data/regions";
import { ROADMAP } from "@/lib/data/project";
import { ORDERS_BY_STATUS } from "@/lib/data/orders";
import { ECONOMICS_KPI } from "@/lib/data/economics";
import { formatNumber } from "@/lib/utils";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  Treemap, Sankey, FunnelChart, Funnel, LabelList, BarChart, Bar, Cell,
} from "recharts";

// Burn down / burn up
const BURN_DATA = OVERALL_HISTORY.map((p) => ({
  year: p.year,
  remainingPlan: TOTAL_CLIENTS * (1 - p.planPct / 100),
  remainingFact: p.factPct === null ? null : TOTAL_CLIENTS * (1 - p.factPct / 100),
  migratedPlan: TOTAL_CLIENTS * (p.planPct / 100),
  migratedFact: p.factPct === null ? null : TOTAL_CLIENTS * (p.factPct / 100),
  scope: TOTAL_CLIENTS,
}));

// Heatmap: отклонение факта от плана по месяцам (2026) для 5 филиалов
const HEATMAP_ROWS = REGIONS.slice(0, 6).map((r) => r.name);
const HEATMAP_COLS = ["Фев", "Мар", "Апр", "Май", "Июн", "Июл"];
const HEATMAP_VALUES = [
  [1, 2, 1, 0, -1, 4],
  [0, 1, 2, 1, 2, 3],
  [-2, -3, -1, -4, -2, -2],
  [-1, 0, 1, -1, 0, -1],
  [-3, -4, -5, -4, -5, -3],
  [-6, -8, -10, -14, -18, -22],
];

// Treemap: регионы по числу абонентов, цвет по % выполнения
const TREEMAP_DATA = REGIONS.map((r) => ({ name: r.name, size: r.clientsTotal, pct: r.factPctToday }));
function treemapColor(pct: number) {
  if (pct >= 70) return "#16a34a";
  if (pct >= 55) return "#00a3e0";
  if (pct >= 40) return "#f59e0b";
  return "#dc2626";
}

// Sankey: поток абонентов
const inProgress = ORDERS_BY_STATUS.in_progress + ORDERS_BY_STATUS.created;
const remaining = TOTAL_CLIENTS - TOTAL_MIGRATED - inProgress;
const SANKEY_DATA = {
  nodes: [
    { name: "Абоненты на меди (старт), 900 000" },
    { name: "Переведено на GPON" },
    { name: "В процессе / заказ создан" },
    { name: "Ожидает перевода" },
  ],
  links: [
    { source: 0, target: 1, value: TOTAL_MIGRATED },
    { source: 0, target: 2, value: inProgress },
    { source: 0, target: 3, value: Math.max(remaining, 0) },
  ],
};

// Funnel: воронка заказов
const totalOrdersEver = Object.values(ORDERS_BY_STATUS).reduce((a, b) => a + b, 0);
const FUNNEL_DATA = [
  { name: "Заказ создан", value: totalOrdersEver, fill: "var(--muted)" },
  { name: "Взят в работу", value: totalOrdersEver - ORDERS_BY_STATUS.created, fill: "var(--brand)" },
  { name: "Монтаж выполнен", value: ORDERS_BY_STATUS.done, fill: "var(--brand-2)" },
  { name: "Активен на GPON", value: Math.round(ORDERS_BY_STATUS.done * 0.97), fill: "var(--success)" },
];

// Waterfall: экономический мост CAPEX -> NPV
const WATERFALL_STEPS = [
  { name: "CAPEX", delta: -ECONOMICS_KPI.capex / 1e9 },
  { name: "ТО DSLAM", delta: 21 },
  { name: "Электропитание", delta: 14 },
  { name: "Аварийные выезды", delta: 9.5 },
  { name: "ФОТ", delta: 6.9 },
];
let running = 0;
const WATERFALL_DATA = WATERFALL_STEPS.map((s) => {
  const start = running;
  running += s.delta;
  return { name: s.name, base: Math.min(start, running), value: Math.abs(s.delta), positive: s.delta >= 0 };
});
WATERFALL_DATA.push({ name: "Итог NPV", base: 0, value: running, positive: running >= 0 });

// Forecast: AI-прогноз против плана
const FORECAST_DATA = OVERALL_HISTORY.map((p, i) => ({
  year: p.year,
  plan: p.planPct,
  fact: p.factPct,
  aiForecast: p.factPct !== null ? null : Number((p.planPct * (0.9 + i * 0.01)).toFixed(1)),
}));
// bridge point so the dashed forecast line connects to the last actual value
const lastActualIdx = FORECAST_DATA.findIndex((d) => d.fact === null) - 1;
if (lastActualIdx >= 0) FORECAST_DATA[lastActualIdx].aiForecast = FORECAST_DATA[lastActualIdx].fact;

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader title="Аналитика" subtitle="Расширенная аналитика программы: план-факт, тренды, прогнозы и структура." />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        <Card title="План-Факт" subtitle="Накопительный % перевода абонентов">
          <PlanFactChart data={OVERALL_HISTORY} height={240} />
        </Card>

        <Card title="AI-прогноз" subtitle="Проекция факта при текущем темпе (пунктир)">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={FORECAST_DATA} margin={{ left: -12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={40} unit="%" />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12.5 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="plan" name="План" stroke="var(--muted)" strokeDasharray="4 4" dot={false} />
              <Line type="monotone" dataKey="fact" name="Факт" stroke="var(--brand)" strokeWidth={2.5} dot={{ r: 4 }} connectNulls />
              <Line type="monotone" dataKey="aiForecast" name="AI-прогноз" stroke="var(--success)" strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 3 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        <Card title="Burn Down" subtitle="Остаток абонентов на меди, план vs факт">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={BURN_DATA} margin={{ left: -6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={56} tickFormatter={(v) => formatNumber(v)} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12.5 }} formatter={(v) => formatNumber(Number(v))} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="remainingPlan" name="План (остаток)" stroke="var(--muted)" strokeDasharray="5 4" fill="transparent" />
              <Area type="monotone" dataKey="remainingFact" name="Факт (остаток)" stroke="var(--danger)" fill="var(--danger)" fillOpacity={0.15} strokeWidth={2.5} connectNulls />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Burn Up" subtitle="Переведено абонентов относительно общего охвата программы">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={BURN_DATA} margin={{ left: -6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={56} tickFormatter={(v) => formatNumber(v)} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12.5 }} formatter={(v) => formatNumber(Number(v))} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="scope" name="Весь охват" stroke="var(--muted)" strokeDasharray="4 4" dot={false} />
              <Area type="monotone" dataKey="migratedFact" name="Переведено (факт)" stroke="var(--success)" fill="var(--success)" fillOpacity={0.2} strokeWidth={2.5} connectNulls />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Gantt: контрольные точки программы" subtitle="2024 – 2028" className="mb-5">
        <GanttChart items={ROADMAP} />
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        <Card title="Heatmap отставания" subtitle="Отклонение факта от плана по месяцам 2026, п.п.">
          <HeatmapGrid rows={HEATMAP_ROWS} cols={HEATMAP_COLS} values={HEATMAP_VALUES} />
        </Card>

        <Card title="Treemap филиалов" subtitle="Размер — абонентская база, цвет — % выполнения">
          <ResponsiveContainer width="100%" height={260}>
            <Treemap data={TREEMAP_DATA} dataKey="size" stroke="var(--surface)" content={<TreemapCell />} />
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        <Card title="Sankey: поток абонентов" subtitle="Распределение базы по статусу перевода">
          <ResponsiveContainer width="100%" height={260}>
            <Sankey
              data={SANKEY_DATA}
              nodePadding={24}
              margin={{ left: 10, right: 100, top: 10, bottom: 10 }}
              link={{ stroke: "var(--brand)", strokeOpacity: 0.25 }}
              node={{ fill: "var(--brand-2)" }}
            >
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12.5 }} />
            </Sankey>
          </ResponsiveContainer>
        </Card>

        <Card title="Funnel заказов" subtitle="Воронка от создания до активации GPON">
          <ResponsiveContainer width="100%" height={260}>
            <FunnelChart>
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12.5 }} formatter={(v) => formatNumber(Number(v))} />
              <Funnel dataKey="value" data={FUNNEL_DATA} isAnimationActive>
                <LabelList position="right" dataKey="name" fill="var(--foreground)" stroke="none" fontSize={12} />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Waterfall: экономический мост CAPEX → NPV" subtitle="млрд ₸">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={WATERFALL_DATA} margin={{ left: -12 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11.5, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={40} />
            <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12.5 }} />
            <Bar dataKey="base" stackId="wf" fill="transparent" />
            <Bar dataKey="value" stackId="wf" radius={[6, 6, 6, 6]}>
              {WATERFALL_DATA.map((d, i) => (
                <Cell key={i} fill={d.positive ? "var(--success)" : "var(--danger)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function TreemapCell(props: any) {
  const { x, y, width, height, name, pct } = props;
  if (width < 2 || height < 2) return null;
  if (typeof pct !== "number") {
    return <rect x={x} y={y} width={width} height={height} fill="transparent" />;
  }
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={treemapColor(pct)} fillOpacity={0.85} stroke="var(--surface)" strokeWidth={2} rx={8} />
      {width > 60 && height > 30 && (
        <text x={x + 8} y={y + 20} fill="#fff" fontSize={12} fontWeight={600}>
          {name}
        </text>
      )}
      {width > 60 && height > 44 && (
        <text x={x + 8} y={y + 38} fill="#fff" fontSize={11} opacity={0.9}>
          {pct.toFixed(0)}%
        </text>
      )}
    </g>
  );
}
