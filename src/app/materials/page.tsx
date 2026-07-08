"use client";

import { PackageCheck, PackageMinus, AlertOctagon, Truck } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card } from "@/components/ui/Card";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { MATERIALS_WITH_STATUS, MATERIALS_SUMMARY, ONU_FORECAST_WEEKS, type MaterialStatus } from "@/lib/data/materials";
import { formatNumber } from "@/lib/utils";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";

const STATUS_LABEL: Record<MaterialStatus, string> = { ok: "В норме", low: "Низкий запас", critical: "Критично" };
const STATUS_TONE: Record<MaterialStatus, BadgeTone> = { ok: "success", low: "warning", critical: "danger" };

const ONU_SAFETY_CORRIDOR = ONU_FORECAST_WEEKS.map((w) => ({ ...w, min: 12000, target: 24000 }));

export default function MaterialsPage() {
  return (
    <div>
      <PageHeader title="Запас материала" subtitle="Складской учёт ключевых материалов монтажа GPON: остатки, дни запаса, прогноз, поставки." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard index={0} icon={PackageCheck} label="Позиций в норме" value={String(MATERIALS_SUMMARY.ok)} accent="success" />
        <KpiCard index={1} icon={PackageMinus} label="Низкий запас" value={String(MATERIALS_SUMMARY.low)} accent="warning" />
        <KpiCard index={2} icon={AlertOctagon} label="Критично" value={String(MATERIALS_SUMMARY.critical)} accent="danger" />
        <KpiCard index={3} icon={Truck} label="Ожидаемые поставки" value={String(MATERIALS_SUMMARY.incoming)} sublabel="позиций с плановой поставкой" accent="brand" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        <Card title="Прогноз расхода vs поступление" subtitle="ONU, 4 недели">
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={ONU_FORECAST_WEEKS} margin={{ left: -12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={48} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12.5 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="usage" name="Расход" fill="var(--danger)" radius={[6, 6, 0, 0]} barSize={22} />
              <Bar dataKey="incoming" name="Поступление" fill="var(--success)" radius={[6, 6, 0, 0]} barSize={22} />
              <Line type="monotone" dataKey="stockLevel" name="Остаток на конец недели" stroke="var(--brand-2)" strokeWidth={2.5} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Коридор безопасности запаса ONU" subtitle="Минимум 30 дн / цель 60 дн">
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={ONU_SAFETY_CORRIDOR} margin={{ left: -12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={48} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12.5 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <ReferenceLine y={12000} stroke="var(--danger)" strokeDasharray="4 4" />
              <ReferenceLine y={24000} stroke="var(--success)" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="stockLevel" name="Остаток ONU" stroke="var(--brand)" strokeWidth={2.5} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Остатки материалов" subtitle="Все позиции с нормативом ≥ 30 дней">
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-[13px] min-w-[820px]">
            <thead>
              <tr className="text-left text-muted border-b border-border">
                <th className="px-3 py-2 font-medium">Материал</th>
                <th className="px-3 py-2 font-medium">Категория</th>
                <th className="px-3 py-2 font-medium">Остаток</th>
                <th className="px-3 py-2 font-medium">Дней запаса</th>
                <th className="px-3 py-2 font-medium">ABC/XYZ</th>
                <th className="px-3 py-2 font-medium">Ближайшая поставка</th>
                <th className="px-3 py-2 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              {MATERIALS_WITH_STATUS.map((m) => (
                <tr key={m.id} className="border-b border-border/60 last:border-0 hover:bg-surface-2/60 transition-colors">
                  <td className="px-3 py-2.5 font-medium">{m.name}</td>
                  <td className="px-3 py-2.5 text-muted">{m.category}</td>
                  <td className="px-3 py-2.5">{formatNumber(m.stock)} {m.unit}</td>
                  <td className="px-3 py-2.5">{m.daysOfSupply === Infinity ? "—" : `${m.daysOfSupply} дн.`}</td>
                  <td className="px-3 py-2.5 text-muted">{m.abcXyz}</td>
                  <td className="px-3 py-2.5 text-muted">
                    {m.nextDelivery ? `${m.nextDelivery.date} · ${formatNumber(m.nextDelivery.qty)} ${m.unit}` : "—"}
                  </td>
                  <td className="px-3 py-2.5">
                    <Badge tone={STATUS_TONE[m.status]}>{STATUS_LABEL[m.status]}</Badge>
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
