"use client";

import { useState } from "react";
import { Wifi, Cable, Gauge, CalendarClock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card } from "@/components/ui/Card";
import { PlanFactChart } from "@/components/charts/PlanFactChart";
import { RegionProgressList } from "@/components/regions/RegionProgressList";
import { REGIONS, TOTAL_MIGRATED, TOTAL_REMAINING, OVERALL_HISTORY, MIGRATION_MONTHLY } from "@/lib/data/regions";
import { formatNumber } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const YEARS = [2024, 2025, 2026, 2027, 2028];
const AVG_TEMPO = REGIONS.reduce((s, r) => s + r.tempoPerMonth, 0);

export default function MigrationPage() {
  const [year, setYear] = useState(2026);
  const yearIndex = YEARS.indexOf(year);

  const items = REGIONS.map((r) => {
    const point = r.history[yearIndex];
    return { id: r.id, name: r.name, planPct: point.plan, factPct: point.fact ?? point.plan, meta: `${formatNumber(r.clientsTotal)} або` };
  });

  const monthsToFinish = Math.ceil(TOTAL_REMAINING / AVG_TEMPO);

  return (
    <div>
      <PageHeader title="Миграция абонентов" subtitle="Перевод абонентов с медной сети (ADSL/VDSL) на GPON по 8 ОДТ." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard index={0} icon={Wifi} label="Переведено" value={formatNumber(TOTAL_MIGRATED)} accent="success" />
        <KpiCard index={1} icon={Cable} label="Остаток медных" value={formatNumber(TOTAL_REMAINING)} accent="warning" />
        <KpiCard index={2} icon={Gauge} label="Текущий темп" value={`${formatNumber(AVG_TEMPO)}/мес`} accent="brand" />
        <KpiCard index={3} icon={CalendarClock} label="Прогноз завершения" value={`≈ ${monthsToFinish} мес`} sublabel="при текущем темпе" accent="brand" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card
          title="Прогресс по ОДТ"
          subtitle="Факт vs план по выбранному году"
          className="xl:col-span-2"
          actions={
            <div className="flex gap-1">
              {YEARS.map((y) => (
                <button
                  key={y}
                  onClick={() => setYear(y)}
                  className={`rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                    y === year ? "bg-brand text-white" : "text-muted hover:bg-surface-2"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          }
        >
          <RegionProgressList items={items} />
        </Card>

        <Card title="Накопительный план vs факт" subtitle="% переведённых абонентов, вся программа">
          <PlanFactChart data={OVERALL_HISTORY} height={230} />
        </Card>
      </div>

      <Card title="Помесячный темп переводов" subtitle="2026 год, план vs факт" className="mt-5">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={MIGRATION_MONTHLY} margin={{ left: -12 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={44} />
            <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12.5 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="plan" name="План" fill="var(--border)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="fact" name="Факт" fill="var(--brand)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
