"use client";

import { Users, HardHat, UserMinus, Wallet } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card } from "@/components/ui/Card";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { STAFF_STRUCTURE, STAFF_REALLOCATION, STAFF_KPI, BRIGADES, type Brigade } from "@/lib/data/staff";
import { REGION_NAME_BY_ID } from "@/lib/data/monitoring";
import { formatNumber, formatTenge } from "@/lib/utils";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["var(--brand)", "var(--brand-2)", "var(--muted)", "#a855f7", "var(--success)"];

const LOAD_TONE: Record<Brigade["load"], BadgeTone> = { low: "muted", normal: "brand", high: "warning", overload: "danger" };
const LOAD_LABEL: Record<Brigade["load"], string> = { low: "Низкая", normal: "Нормальная", high: "Высокая", overload: "Перегрузка" };

export default function StaffPage() {
  return (
    <div>
      <PageHeader title="Персонал" subtitle="Бригады монтажа GPON, нагрузка, выработка и переориентация персонала медной сети." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard index={0} icon={Users} label="Всего сотрудников" value={formatNumber(STAFF_KPI.totalEmployees)} accent="brand" />
        <KpiCard index={1} icon={HardHat} label="Монтаж GPON" value={formatNumber(STAFF_KPI.gponInstallers)} accent="brand" />
        <KpiCard index={2} icon={UserMinus} label="Высвобождается к 2028" value={formatNumber(STAFF_KPI.releasedBy2028)} accent="warning" />
        <KpiCard index={3} icon={Wallet} label="Экономия ФОТ" value={formatTenge(STAFF_KPI.payrollSavingsPerYear)} sublabel="в год" accent="success" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        <Card title="Структура штата">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={STAFF_STRUCTURE} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                {STAFF_STRUCTURE.map((s, i) => (
                  <Cell key={s.name} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12.5 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Переориентация персонала" subtitle="2024 – 2028">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={STAFF_REALLOCATION} margin={{ left: -12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12.5 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="gpon" name="Монтаж GPON" stackId="1" stroke="var(--brand)" fill="var(--brand)" fillOpacity={0.55} />
              <Area type="monotone" dataKey="service" name="Обслуживание" stackId="1" stroke="var(--brand-2)" fill="var(--brand-2)" fillOpacity={0.45} />
              <Area type="monotone" dataKey="retraining" name="Переобучение" stackId="1" stroke="var(--warning)" fill="var(--warning)" fillOpacity={0.45} />
              <Area type="monotone" dataKey="released" name="Высвобождено" stackId="1" stroke="var(--muted)" fill="var(--muted)" fillOpacity={0.35} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Бригады монтажа" subtitle="Нагрузка, выработка, рейтинг">
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-[13px] min-w-[720px]">
            <thead>
              <tr className="text-left text-muted border-b border-border">
                <th className="px-3 py-2 font-medium">Бригада</th>
                <th className="px-3 py-2 font-medium">ОДТ</th>
                <th className="px-3 py-2 font-medium">Монтёров</th>
                <th className="px-3 py-2 font-medium">Заказов/мес</th>
                <th className="px-3 py-2 font-medium">Рейтинг</th>
                <th className="px-3 py-2 font-medium">Нагрузка</th>
              </tr>
            </thead>
            <tbody>
              {BRIGADES.map((b) => (
                <tr key={b.id} className="border-b border-border/60 last:border-0 hover:bg-surface-2/60 transition-colors">
                  <td className="px-3 py-2.5 font-medium">{b.name}</td>
                  <td className="px-3 py-2.5 text-muted">{REGION_NAME_BY_ID[b.regionId]}</td>
                  <td className="px-3 py-2.5">{b.installers}</td>
                  <td className="px-3 py-2.5">{formatNumber(b.ordersPerMonth)}</td>
                  <td className="px-3 py-2.5">{b.ratingPct}%</td>
                  <td className="px-3 py-2.5">
                    <Badge tone={LOAD_TONE[b.load]}>{LOAD_LABEL[b.load]}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
