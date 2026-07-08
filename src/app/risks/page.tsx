"use client";

import { ShieldAlert, ShieldCheck, ShieldQuestion, Siren } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card } from "@/components/ui/Card";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { RISKS, riskScore, type Risk } from "@/lib/data/project";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<Risk["status"], string> = { open: "Открыт", mitigating: "Митигация", closed: "Закрыт" };
const STATUS_TONE: Record<Risk["status"], BadgeTone> = { open: "danger", mitigating: "warning", closed: "success" };

function cellColor(score: number): string {
  if (score >= 16) return "bg-danger/70";
  if (score >= 9) return "bg-warning/60";
  if (score >= 4) return "bg-brand/35";
  return "bg-success/25";
}

export default function RisksPage() {
  const open = RISKS.filter((r) => r.status === "open").length;
  const mitigating = RISKS.filter((r) => r.status === "mitigating").length;
  const closed = RISKS.filter((r) => r.status === "closed").length;
  const critical = RISKS.filter((r) => riskScore(r) >= 16 && r.status !== "closed").length;

  return (
    <div>
      <PageHeader title="Управление рисками" subtitle="Матрица рисков программы: вероятность, влияние, ответственные." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard index={0} icon={Siren} label="Критических" value={String(critical)} accent="danger" />
        <KpiCard index={1} icon={ShieldAlert} label="Открытых" value={String(open)} accent="warning" />
        <KpiCard index={2} icon={ShieldQuestion} label="В митигации" value={String(mitigating)} accent="brand" />
        <KpiCard index={3} icon={ShieldCheck} label="Закрытых" value={String(closed)} accent="success" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card title="Матрица рисков" subtitle="Вероятность (Y) × Влияние (X)">
          <div className="flex">
            <div className="flex flex-col-reverse justify-between mr-2 py-1">
              {[1, 2, 3, 4, 5].map((p) => (
                <div key={p} className="h-[52px] flex items-center text-[11px] text-muted">{p}</div>
              ))}
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-5 gap-1.5">
                {[5, 4, 3, 2, 1].map((p) =>
                  [1, 2, 3, 4, 5].map((i) => {
                    const score = p * i;
                    const cellRisks = RISKS.filter((r) => r.probability === p && r.impact === i && r.status !== "closed");
                    return (
                      <div
                        key={`${p}-${i}`}
                        className={cn("relative h-[52px] rounded-[8px] flex items-center justify-center text-[11px] font-medium", cellColor(score))}
                        title={cellRisks.map((r) => r.title).join(", ")}
                      >
                        {cellRisks.length > 0 && (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground/85 text-background text-[11px] font-semibold">
                            {cellRisks.length}
                          </span>
                        )}
                      </div>
                    );
                  }),
                )}
              </div>
              <div className="flex justify-between mt-2 px-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="text-[11px] text-muted">{i}</div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Реестр рисков" subtitle="Отсортировано по (вероятность × влияние)" className="max-h-[420px] overflow-y-auto">
          <div className="space-y-2.5">
            {[...RISKS].sort((a, b) => riskScore(b) - riskScore(a)).map((r) => (
              <div key={r.id} className="rounded-[12px] border border-border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-[13px] font-medium">{r.title}</div>
                  <Badge tone={STATUS_TONE[r.status]}>{STATUS_LABEL[r.status]}</Badge>
                </div>
                <div className="flex items-center gap-3 text-[12px] text-muted mt-1.5">
                  <span>{r.category}</span>
                  <span>Score: {riskScore(r)}</span>
                  <span>Ответственный: {r.owner}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
