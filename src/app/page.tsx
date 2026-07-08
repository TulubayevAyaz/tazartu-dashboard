"use client";

import { Users, Cable, Wifi, CalendarCheck2, Target, TrendingDown, Wallet, RadioTower, Gauge, Clock, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card } from "@/components/ui/Card";
import { KazakhstanMap } from "@/components/map/KazakhstanMap";
import { PlanFactChart } from "@/components/charts/PlanFactChart";
import { RoadmapTimeline } from "@/components/project/RoadmapTimeline";
import { useUIStore } from "@/lib/store";
import {
  TOTAL_CLIENTS,
  TOTAL_MIGRATED,
  TOTAL_REMAINING,
  OVERALL_PCT,
  TOTAL_DSLAM,
  TOTAL_DSLAM_DEMOLISHED,
  AVG_SPEED,
  OVERALL_HISTORY,
  REGIONS,
} from "@/lib/data/regions";
import { MATERIALS_WITH_STATUS } from "@/lib/data/materials";
import { ECONOMICS_KPI } from "@/lib/data/economics";
import { ROADMAP } from "@/lib/data/project";
import { formatNumber, formatPercent, formatTenge } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const DSLAM_BY_YEAR = [
  { year: 2024, demolished: 210, remaining: TOTAL_DSLAM - 210 },
  { year: 2025, demolished: 640, remaining: TOTAL_DSLAM - 640 },
  { year: 2026, demolished: TOTAL_DSLAM_DEMOLISHED, remaining: TOTAL_DSLAM - TOTAL_DSLAM_DEMOLISHED },
  { year: 2027, demolished: 2200, remaining: TOTAL_DSLAM - 2200 },
  { year: 2028, demolished: TOTAL_DSLAM, remaining: 0 },
];

export default function HeroDashboard() {
  const setActiveRegionId = useUIStore((s) => s.setActiveRegionId);
  const criticalMaterials = MATERIALS_WITH_STATUS.filter((m) => m.status === "critical");

  return (
    <div>
      <PageHeader
        title="Обзор программы «Тазарту»"
        subtitle="Мониторинг миграции абонентов медь → GPON и демонтажа DSLAM. АО «Казахтелеком», Дирекция производственной эффективности."
      />

      {criticalMaterials.length > 0 && (
        <div className="mb-6 flex items-start gap-3 rounded-[16px] border border-danger/25 bg-danger/8 px-4 py-3.5">
          <AlertTriangle size={18} className="text-danger shrink-0 mt-0.5" />
          <div className="text-[13px] leading-relaxed">
            <span className="font-semibold text-danger">Критический запас материалов: </span>
            {criticalMaterials.map((m) => `${m.name} (${m.daysOfSupply} дн.)`).join(", ")}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <KpiCard index={0} icon={Users} label="Всего абонентов на меди (старт)" value={formatNumber(TOTAL_CLIENTS)} accent="brand" />
        <KpiCard index={1} icon={Cable} label="Осталось на меди" value={formatNumber(TOTAL_REMAINING)} accent="warning" />
        <KpiCard index={2} icon={Wifi} label="Переведено на GPON" value={formatNumber(TOTAL_MIGRATED)} trend={{ value: `${formatPercent(OVERALL_PCT)}`, positive: true }} accent="success" />
        <KpiCard index={3} icon={CalendarCheck2} label="Переведено сегодня" value="1 240" sublabel="08.07.2026" accent="brand" />
        <KpiCard index={4} icon={Target} label="Факт / План" value={`${formatPercent(OVERALL_PCT)} / 62.0%`} sublabel="выполнение программы" accent="brand" />
        <KpiCard index={5} icon={TrendingDown} label="Экономический эффект" value={formatTenge(ECONOMICS_KPI.totalEffect5y)} sublabel="за 5 лет программы" accent="success" />
        <KpiCard index={6} icon={RadioTower} label="DSLAM демонтировано" value={`${formatNumber(TOTAL_DSLAM_DEMOLISHED)} / ${formatNumber(TOTAL_DSLAM)}`} accent="brand" />
        <KpiCard index={7} icon={Gauge} label="Средняя скорость" value={`${AVG_SPEED.toFixed(0)} Мб/с`} sublabel="по переведённым абонентам" accent="brand" />
        <KpiCard index={8} icon={Clock} label="Средний срок подключения" value="2.4 дня" sublabel="от заявки до монтажа" accent="brand" />
        <KpiCard index={9} icon={Wallet} label="CAPEX программы" value={formatTenge(ECONOMICS_KPI.capex)} sublabel={`NPV ${formatTenge(ECONOMICS_KPI.npv)}`} accent="warning" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
        <Card title="Карта прогресса по филиалам" subtitle="Наведите на регион для деталей, кликните для перехода к разделу «Миграция»" className="xl:col-span-2 h-[460px] flex flex-col">
          <div className="flex-1 min-h-0 rounded-[14px] overflow-hidden">
            <KazakhstanMap onSelect={setActiveRegionId} />
          </div>
        </Card>

        <Card title="План vs Факт" subtitle="Накопительный % перевода абонентов по годам">
          <PlanFactChart data={OVERALL_HISTORY} height={200} />
          <div className="mt-3 space-y-1.5">
            {[...REGIONS]
              .sort((a, b) => a.factPctToday - a.planPctToday - (b.factPctToday - b.planPctToday))
              .slice(0, 3)
              .map((r) => (
                <div key={r.id} className="flex items-center justify-between text-[12.5px]">
                  <span className="text-muted">{r.name}</span>
                  <span className={r.factPctToday < r.planPctToday ? "text-danger font-medium" : "text-success font-medium"}>
                    {r.factPctToday < r.planPctToday ? "−" : "+"}
                    {Math.abs(r.factPctToday - r.planPctToday).toFixed(1)} п.п.
                  </span>
                </div>
              ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
        <Card title="Хронология проекта" className="xl:col-span-2">
          <RoadmapTimeline items={ROADMAP} />
        </Card>

        <Card title="Демонтаж DSLAM по годам" subtitle="Нарастающим итогом">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={DSLAM_BY_YEAR} margin={{ left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={36} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12.5 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="demolished" name="Демонтировано" stackId="a" fill="var(--brand)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="remaining" name="Осталось" stackId="a" fill="var(--border)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
