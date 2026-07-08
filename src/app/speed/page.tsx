"use client";

import { Gauge, Rocket, Target, Zap } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card } from "@/components/ui/Card";
import { RegionProgressList } from "@/components/regions/RegionProgressList";
import { REGIONS, AVG_SPEED } from "@/lib/data/regions";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";

const SPEED_BY_TECH = [
  { name: "ADSL", speed: 12 },
  { name: "VDSL", speed: 24 },
  { name: "GPON", speed: 142 },
  { name: "XGS-PON (пилот)", speed: 250 },
];

const SPEED_DYNAMICS = [
  { year: 2023, speed: 14 },
  { year: 2024, speed: 28 },
  { year: 2025, speed: 68 },
  { year: 2026, speed: Math.round(AVG_SPEED) },
  { year: 2027, speed: 165 },
  { year: 2028, speed: 210 },
];

export default function SpeedPage() {
  const items = REGIONS.map((r) => ({
    id: r.id,
    name: r.name,
    planPct: 65, // условная нормировка плана скорости 2025 (% от целевых 150 Мб/с)
    factPct: Math.round((r.avgSpeedMbps / 150) * 100),
    meta: `${r.avgSpeedMbps} Мб/с`,
  }));

  return (
    <div>
      <PageHeader title="Скорость интернета" subtitle="Динамика роста скорости при переходе с ADSL/VDSL на GPON и XGS-PON." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard index={0} icon={Gauge} label="ADSL было" value="12 Мб/с" accent="warning" />
        <KpiCard index={1} icon={Zap} label="GPON сейчас" value={`${AVG_SPEED.toFixed(0)} Мб/с`} accent="success" />
        <KpiCard index={2} icon={Target} label="Цель 2026" value="150 Мб/с" sublabel="после апгрейда OLT" accent="brand" />
        <KpiCard index={3} icon={Rocket} label="XGS-PON 2028" value="250 Мб/с" sublabel="следующее поколение сети" accent="brand" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        <Card title="Сравнение скоростей по технологиям">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={SPEED_BY_TECH} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} unit=" Мб/с" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12.5, fill: "var(--foreground)" }} axisLine={false} tickLine={false} width={110} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12.5 }} />
              <Bar dataKey="speed" name="Скорость" fill="var(--brand)" radius={[0, 8, 8, 0]} barSize={26} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Динамика средней скорости" subtitle="2023 – 2028, Мб/с">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={SPEED_DYNAMICS} margin={{ left: -12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12.5 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="speed" name="Средняя скорость" stroke="var(--brand-2)" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Средняя скорость по ОДТ" subtitle="Факт (нормировано к цели 150 Мб/с) vs план 2025">
        <RegionProgressList items={items} />
      </Card>
    </div>
  );
}
