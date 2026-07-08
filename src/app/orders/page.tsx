"use client";

import { ClipboardList, CircleCheck, Ban, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CONTRACTORS, STOP_REASONS, ORDERS_MONTHLY, ORDERS_BY_STATUS } from "@/lib/data/orders";
import { REGION_NAME_BY_ID } from "@/lib/data/monitoring";
import { formatNumber, formatPercent } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";

const totalOrders = Object.values(ORDERS_BY_STATUS).reduce((a, b) => a + b, 0);

const STATUS_PIE = [
  { name: "Создан", value: ORDERS_BY_STATUS.created, color: "var(--muted)" },
  { name: "В работе", value: ORDERS_BY_STATUS.in_progress, color: "var(--brand)" },
  { name: "Выполнен", value: ORDERS_BY_STATUS.done, color: "var(--success)" },
  { name: "Остановлен", value: ORDERS_BY_STATUS.stopped, color: "var(--danger)" },
];

export default function OrdersPage() {
  return (
    <div>
      <PageHeader title="Заказы на переключение" subtitle="Статусы нарядов, исполнители-подрядчики и причины остановки монтажа." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard index={0} icon={ClipboardList} label="Создано" value={formatNumber(ORDERS_BY_STATUS.created)} accent="brand" />
        <KpiCard index={1} icon={Loader2} label="В работе" value={formatNumber(ORDERS_BY_STATUS.in_progress)} accent="brand" />
        <KpiCard index={2} icon={CircleCheck} label="Выполнено" value={formatNumber(ORDERS_BY_STATUS.done)} trend={{ value: formatPercent((ORDERS_BY_STATUS.done / totalOrders) * 100), positive: true }} accent="success" />
        <KpiCard index={3} icon={Ban} label="Остановлено" value={formatNumber(ORDERS_BY_STATUS.stopped)} accent="danger" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
        <Card title="Динамика заказов" subtitle="План переключений vs факт, 2026" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={ORDERS_MONTHLY} margin={{ left: -12 }}>
              <defs>
                <linearGradient id="ordersFact" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={44} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12.5 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="plan" name="План" stroke="var(--muted)" strokeDasharray="5 4" fill="transparent" />
              <Area type="monotone" dataKey="fact" name="Факт" stroke="var(--brand)" strokeWidth={2.5} fill="url(#ordersFact)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Статусы заказов">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={STATUS_PIE} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                {STATUS_PIE.map((s) => (
                  <Cell key={s.name} fill={s.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12.5 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        <Card title="Причины остановки заказов">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={STOP_REASONS} layout="vertical" margin={{ left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="reason" tick={{ fontSize: 12, fill: "var(--foreground)" }} axisLine={false} tickLine={false} width={150} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12.5 }} />
              <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={22}>
                {STOP_REASONS.map((s) => (
                  <Cell key={s.reason} fill={s.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Производительность исполнителей" subtitle="% выполнения по монтажным подрядчикам">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={CONTRACTORS} layout="vertical" margin={{ left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "var(--foreground)" }} axisLine={false} tickLine={false} width={160} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12.5 }} />
              <Bar dataKey="completionPct" name="% выполнения" fill="var(--brand-2)" radius={[0, 8, 8, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Исполнители по ОДТ" subtitle="Заказы, выполнение, остановки">
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-[13px] min-w-[720px]">
            <thead>
              <tr className="text-left text-muted border-b border-border">
                <th className="px-3 py-2 font-medium">Исполнитель</th>
                <th className="px-3 py-2 font-medium">ОДТ</th>
                <th className="px-3 py-2 font-medium">Бригад</th>
                <th className="px-3 py-2 font-medium">Заказов всего</th>
                <th className="px-3 py-2 font-medium">Выполнено</th>
                <th className="px-3 py-2 font-medium">Остановлено</th>
                <th className="px-3 py-2 font-medium">% выполнения</th>
              </tr>
            </thead>
            <tbody>
              {CONTRACTORS.map((c) => (
                <tr key={c.id} className="border-b border-border/60 last:border-0 hover:bg-surface-2/60 transition-colors">
                  <td className="px-3 py-2.5 font-medium">{c.name}</td>
                  <td className="px-3 py-2.5 text-muted">{REGION_NAME_BY_ID[c.regionId]}</td>
                  <td className="px-3 py-2.5">{c.brigades}</td>
                  <td className="px-3 py-2.5">{formatNumber(c.ordersTotal)}</td>
                  <td className="px-3 py-2.5">{formatNumber(c.ordersDone)}</td>
                  <td className="px-3 py-2.5 text-danger">{formatNumber(c.ordersStopped)}</td>
                  <td className="px-3 py-2.5">
                    <Badge tone={c.completionPct >= 75 ? "success" : c.completionPct >= 55 ? "warning" : "danger"}>
                      {formatPercent(c.completionPct)}
                    </Badge>
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
