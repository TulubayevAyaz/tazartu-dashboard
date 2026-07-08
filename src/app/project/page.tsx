"use client";

import Link from "next/link";
import { CheckCircle2, CircleDot, Circle, ShieldAlert, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RoadmapTimeline } from "@/components/project/RoadmapTimeline";
import { GanttChart } from "@/components/charts/GanttChart";
import { ROADMAP, RISKS, riskScore } from "@/lib/data/project";

const doneCount = ROADMAP.filter((m) => m.status === "done").length;
const activeCount = ROADMAP.filter((m) => m.status === "active").length;
const planCount = ROADMAP.filter((m) => m.status === "plan").length;
const openRisks = RISKS.filter((r) => r.status !== "closed").sort((a, b) => riskScore(b) - riskScore(a));

export default function ProjectControlCenterPage() {
  return (
    <div>
      <PageHeader title="Центр управления проектом" subtitle="Дорожная карта, этапы, риски и контрольные точки программы «Тазарту»." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard index={0} icon={CheckCircle2} label="Этапов завершено" value={String(doneCount)} accent="success" />
        <KpiCard index={1} icon={CircleDot} label="В работе" value={String(activeCount)} accent="brand" />
        <KpiCard index={2} icon={Circle} label="В плане" value={String(planCount)} accent="brand" />
        <KpiCard index={3} icon={ShieldAlert} label="Открытых рисков" value={String(openRisks.length)} accent="danger" />
      </div>

      <Card title="Хронология проекта" className="mb-5">
        <RoadmapTimeline items={ROADMAP} />
      </Card>

      <Card title="Диаграмма Ганта" subtitle="Контрольные точки во времени" className="mb-5">
        <GanttChart items={ROADMAP} />
      </Card>

      <Card
        title="Топ рисков"
        subtitle="Открытые и в работе, отсортированы по (вероятность × влияние)"
        actions={
          <Link href="/risks" className="flex items-center gap-1 text-[12.5px] font-medium text-brand-2 dark:text-brand hover:underline">
            Все риски <ArrowRight size={13} />
          </Link>
        }
      >
        <div className="space-y-2.5">
          {openRisks.slice(0, 5).map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-[12px] bg-surface-2/60 px-3.5 py-2.5">
              <div className="min-w-0">
                <div className="text-[13px] font-medium truncate">{r.title}</div>
                <div className="text-[12px] text-muted mt-0.5">{r.category} · Ответственный: {r.owner}</div>
              </div>
              <Badge tone={riskScore(r) >= 16 ? "danger" : riskScore(r) >= 9 ? "warning" : "brand"}>
                Score {riskScore(r)}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
