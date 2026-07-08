"use client";

import { Landmark, Wallet, TrendingUp, Percent, LineChart as LineChartIcon, CalendarClock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card } from "@/components/ui/Card";
import { ECONOMICS_KPI, BREAKEVEN_CURVE, OPEX_STRUCTURE, OPEX_BY_YEAR, FCF_FORECAST } from "@/lib/data/economics";
import { formatTenge } from "@/lib/utils";
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";

const COLORS = ["var(--brand)", "var(--brand-2)", "var(--warning)", "var(--muted)"];

export default function EconomicsPage() {
  return (
    <div>
      <PageHeader title="Экономика программы" subtitle="ROI, NPV, IRR, CAPEX/OPEX и структура экономического эффекта «Тазарту»." />

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KpiCard index={0} icon={Landmark} label="Эффект за 5 лет" value={formatTenge(ECONOMICS_KPI.totalEffect5y)} accent="success" />
        <KpiCard index={1} icon={Wallet} label="CAPEX" value={formatTenge(ECONOMICS_KPI.capex)} accent="warning" />
        <KpiCard index={2} icon={TrendingUp} label="Чистый NPV" value={formatTenge(ECONOMICS_KPI.npv)} accent="brand" />
        <KpiCard index={3} icon={Percent} label="IRR" value={`${ECONOMICS_KPI.irr}%`} accent="brand" />
        <KpiCard index={4} icon={LineChartIcon} label="Прирост ARPU" value={`+${ECONOMICS_KPI.arpuGrowthPct}%`} accent="success" />
        <KpiCard index={5} icon={CalendarClock} label="Payback" value={`${ECONOMICS_KPI.paybackYears} лет`} accent="brand" />
      </div>

      <Card title="Накопленная OPEX-экономия vs CAPEX" subtitle="Точка окупаемости программы, млрд ₸" className="mb-5">
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={BREAKEVEN_CURVE} margin={{ left: -12 }}>
            <defs>
              <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--success)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--success)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={40} unit=" млрд" />
            <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12.5 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="opexSavingsCum" name="Накопленная экономия OPEX" stroke="var(--success)" strokeWidth={2.5} fill="url(#savingsGrad)" />
            <Line type="monotone" dataKey="capexCum" name="CAPEX (порог)" stroke="var(--danger)" strokeDasharray="5 4" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        <Card title="Структура OPEX-экономии" subtitle="По статьям, млн ₸/год">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={OPEX_STRUCTURE} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                {OPEX_STRUCTURE.map((s, i) => (
                  <Cell key={s.name} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12.5 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Свободный денежный поток (FCF)" subtitle="млрд ₸, по годам программы">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={FCF_FORECAST} margin={{ left: -12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12.5 }} />
              <Bar dataKey="fcf" name="FCF">
                {FCF_FORECAST.map((f) => (
                  <Cell key={f.year} fill={f.fcf >= 0 ? "var(--success)" : "var(--danger)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="OPEX по статьям" subtitle="2023 – 2028, млн ₸ (стек по годам)">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={OPEX_BY_YEAR} margin={{ left: -12 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={44} />
            <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12.5 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="dslam" name="ТО DSLAM" stackId="a" fill="var(--brand)" />
            <Bar dataKey="power" name="Электропитание" stackId="a" fill="var(--brand-2)" />
            <Bar dataKey="emergency" name="Аварийные выезды" stackId="a" fill="var(--warning)" />
            <Bar dataKey="payroll" name="ФОТ" stackId="a" fill="var(--muted)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
