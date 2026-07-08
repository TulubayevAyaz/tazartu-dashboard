"use client";

import { RadioTower, CheckCircle2, Cable, Wallet } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card } from "@/components/ui/Card";
import { RegionProgressList } from "@/components/regions/RegionProgressList";
import { REGIONS, TOTAL_DSLAM, TOTAL_DSLAM_DEMOLISHED } from "@/lib/data/regions";
import { formatNumber, formatTenge } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const remaining = TOTAL_DSLAM - TOTAL_DSLAM_DEMOLISHED;
const freedPorts = TOTAL_DSLAM_DEMOLISHED * 384; // средняя ёмкость DSLAM-станции

const DSLAM_BY_YEAR = [
  { year: 2024, demolished: 210 },
  { year: 2025, demolished: 640 },
  { year: 2026, demolished: TOTAL_DSLAM_DEMOLISHED },
  { year: 2027, demolished: 2200 },
  { year: 2028, demolished: TOTAL_DSLAM },
].map((d, i, arr) => ({ ...d, addedThisYear: i === 0 ? d.demolished : d.demolished - arr[i - 1].demolished, remaining: TOTAL_DSLAM - d.demolished }));

export default function DslamPage() {
  const items = REGIONS.map((r) => ({
    id: r.id,
    name: r.name,
    planPct: 55, // план 2025 (единый ориентир по демонтажу)
    factPct: (r.dslamDemolished / r.dslamTotal) * 100,
    meta: `${r.dslamDemolished}/${r.dslamTotal} шт`,
  }));

  return (
    <div>
      <PageHeader title="Демонтаж DSLAM" subtitle="Вывод из эксплуатации медных DSLAM-станций по мере перевода абонентов на GPON." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard index={0} icon={RadioTower} label="Демонтировано" value={`${formatNumber(TOTAL_DSLAM_DEMOLISHED)} / ${formatNumber(TOTAL_DSLAM)}`} accent="success" />
        <KpiCard index={1} icon={Cable} label="Осталось" value={formatNumber(remaining)} accent="warning" />
        <KpiCard index={2} icon={CheckCircle2} label="Освобождено медных портов" value={formatNumber(freedPorts)} accent="brand" />
        <KpiCard index={3} icon={Wallet} label="Экономия на ТО" value={formatTenge(4_200_000_000)} sublabel="в год, по всем демонтированным" accent="success" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card title="Демонтаж по годам" subtitle="Нарастающим итогом: демонтировано / осталось">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={DSLAM_BY_YEAR} margin={{ left: -12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12.5 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="demolished" name="Демонтировано" stackId="a" fill="var(--brand)" />
              <Bar dataKey="remaining" name="Осталось" stackId="a" fill="var(--border)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Демонтаж по ОДТ" subtitle="Факт vs план 2025">
          <RegionProgressList items={items} />
        </Card>
      </div>
    </div>
  );
}
