"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Target, GitBranch, Hammer, ClipboardCheck, AlertTriangle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
} from "recharts";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card } from "@/components/ui/Card";
import { SwapUploadPanel } from "@/components/swap/SwapUploadPanel";
import { SwapFilterBar } from "@/components/swap/SwapFilterBar";
import { ContractorTable } from "@/components/swap/ContractorTable";
import { DelayReasonsCard } from "@/components/swap/DelayReasonsCard";
import { RisksCard } from "@/components/swap/RisksCard";
import { useSwapData } from "@/lib/swap/useSwapData";
import { formatNumber, formatPercent } from "@/lib/utils";
import type { MetricSplit } from "@/lib/types/swap";

const tooltipStyle = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12.5 };

function pctOf(num: number, denom: number): string {
  return denom > 0 ? formatPercent((num / denom) * 100) : "—";
}

function ConstructionPageInner() {
  const { data: dataset, isLoading } = useSwapData();
  const searchParams = useSearchParams();

  const project = searchParams.get("project") ?? "";
  const category = searchParams.get("category") ?? "";
  const year = searchParams.get("year") ?? "";
  const month = searchParams.get("month") ?? "";
  const region = searchParams.get("region") ?? "";

  const years = useMemo(() => [...new Set((dataset?.monthly ?? []).map((m) => m.year))].sort(), [dataset]);
  const categoryLabels = useMemo(() => dataset?.categories.map((c) => c.label) ?? [], [dataset]);
  const regionNames = useMemo(() => dataset?.regions.map((r) => r.region) ?? [], [dataset]);

  const filteredCategories = useMemo(() => {
    const categories = dataset?.categories ?? [];
    return category ? categories.filter((c) => c.label === category) : categories;
  }, [dataset, category]);

  const filteredMonthly = useMemo(() => {
    const monthly = dataset?.monthly ?? [];
    return monthly
      .filter((m) => (!year || String(m.year) === year) && (!month || m.month === month))
      .map((m) => ({
        label: `${m.month} ${m.year}${m.method === "own" ? " · хоз" : ""}`,
        planDUP: m.planDUP.total,
        smr: m.smr.total,
        accepted: m.accepted.total,
      }));
  }, [dataset, year, month]);

  const filteredRegions = useMemo(() => {
    const regions = dataset?.regions ?? [];
    return (region ? regions.filter((r) => r.region === region) : regions).slice(0, 14);
  }, [dataset, region]);

  const filteredContractors = useMemo(() => {
    const contractors = dataset?.contractors ?? [];
    return project ? contractors.filter((c) => c.projects.includes(project)) : contractors;
  }, [dataset, project]);

  const kpiSource: { planBP: MetricSplit; planDUP: MetricSplit; smr: MetricSplit; accepted: MetricSplit; delta: MetricSplit } | null =
    useMemo(() => {
      if (!dataset?.totals) return null;
      if (category) {
        const cat = dataset.categories.find((c) => c.label === category);
        if (cat) return cat;
      }
      return dataset.totals;
    }, [dataset, category]);

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Строительство оптики" subtitle="Проект SWAP: строительство портов GPON и переключение клиентов на оптику." />
        <p className="text-[13px] text-muted">Загрузка…</p>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-[24px] bg-gradient-to-r from-brand/10 via-brand-2/5 to-transparent px-1 pt-1 -mx-1">
        <PageHeader
          title="Строительство оптики"
          subtitle="Проект SWAP: строительство портов GPON строительными организациями по плану БП / ДУП-ОДС, переключение клиентов на оптику."
        />
      </div>

      <SwapUploadPanel meta={dataset?.meta ?? null} detailMeta={dataset?.detailMeta ?? null} />

      {!kpiSource ? (
        <Card>
          <p className="text-[13.5px] text-muted py-8 text-center">
            Данные ещё не загружены. Загрузите файл экспорта из Google Таблицы в панели выше, чтобы увидеть дашборд.
          </p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <KpiCard
              index={0}
              icon={Target}
              label="План БП (утверждённый)"
              value={formatNumber(kpiSource.planBP.total)}
              numericValue={kpiSource.planBP.total}
              accent="brand"
            />
            <KpiCard
              index={1}
              icon={GitBranch}
              label="План ДУП + ОДС"
              value={formatNumber(kpiSource.planDUP.total)}
              numericValue={kpiSource.planDUP.total}
              sublabel="график строительства"
              accent="brand"
            />
            <KpiCard
              index={2}
              icon={Hammer}
              label="СМР завершено"
              value={formatNumber(kpiSource.smr.total)}
              numericValue={kpiSource.smr.total}
              sublabel={`${pctOf(kpiSource.smr.total, kpiSource.planDUP.total)} от плана ДУП/ОДС`}
              accent="warning"
            />
            <KpiCard
              index={3}
              icon={ClipboardCheck}
              label="Принято в эксплуатацию"
              value={formatNumber(kpiSource.accepted.total)}
              numericValue={kpiSource.accepted.total}
              sublabel={`${pctOf(kpiSource.accepted.total, kpiSource.planDUP.total)} от плана ДУП/ОДС`}
              accent="success"
            />
            <KpiCard
              index={4}
              icon={AlertTriangle}
              label="Приёмо-сдаточный этап"
              value={`${kpiSource.delta.total > 0 ? "+" : ""}${formatNumber(kpiSource.delta.total)}`}
              numericValue={kpiSource.delta.total}
              sublabel="СМР завершено, но не принято"
              accent={kpiSource.delta.total < 0 ? "danger" : "success"}
            />
          </div>

          <SwapFilterBar projects={dataset?.projects ?? []} categories={categoryLabels} years={years} regions={regionNames} />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <Card title="Разбивка План БП/ДУП по проектам" subtitle="План БП vs план ДУП/ОДС по категориям">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={filteredCategories} margin={{ left: -12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={48} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="planBP.total" name="План БП" fill="var(--border)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="planDUP.total" name="План ДУП/ОДС" fill="var(--brand)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card title="Переключение по областям" subtitle="Портов принято в эксплуатацию, по областям">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={filteredRegions} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="region" type="category" width={108} tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="plannedPorts" name="План" fill="var(--border)" radius={[0, 6, 6, 0]} />
                  <Bar dataKey="acceptedPorts" name="Принято" fill="var(--success)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card title="Ход строительства по месяцам" subtitle="План ДУП/ОДС vs СМР завершено vs принято в эксплуатацию" className="mt-5">
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={filteredMonthly} margin={{ left: -12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10.5, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={48} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="planDUP" name="План ДУП/ОДС" fill="var(--border)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="smr" name="СМР завершено" fill="var(--warning)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="accepted" name="Принято в экспл." fill="var(--success)" radius={[6, 6, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>

          <Card
            title="Риски — отставание от графика"
            subtitle="Подрядчики и регионы, которые выполнили меньше 50% плана ДУП/ОДС, с наибольшим остатком портов"
            className="mt-5"
          >
            <RisksCard contractors={dataset?.contractors ?? []} regions={dataset?.regions ?? []} />
          </Card>

          <Card
            title="Реестр подрядных организаций"
            subtitle="Сколько построено, сколько осталось, причина отставания от плана"
            className="mt-5"
          >
            <ContractorTable rows={filteredContractors} />
          </Card>

          <Card title="Топ причин отставания" subtitle="По всем подрядчикам и объектам" className="mt-5">
            <DelayReasonsCard reasons={dataset?.topDelayReasons ?? []} />
          </Card>

          <p className="text-[12.5px] text-muted mt-4">
            Сводка: снапшот «{dataset?.meta?.sheetDateLabel}»
            {dataset?.detailMeta
              ? ` · детализация по ${formatNumber(dataset.detailMeta.objectCount)} объектам обновлена ${new Date(dataset.detailMeta.fetchedAt).toLocaleDateString("ru-RU")}`
              : ""}
            .
          </p>
          {dataset?.warnings && dataset.warnings.length > 0 && (
            <p className="text-[12px] text-warning mt-1">{dataset.warnings.join(" · ")}</p>
          )}
        </>
      )}
    </div>
  );
}

export default function ConstructionPage() {
  return (
    <Suspense fallback={<p className="text-[13px] text-muted">Загрузка…</p>}>
      <ConstructionPageInner />
    </Suspense>
  );
}
