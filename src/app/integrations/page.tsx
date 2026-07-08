"use client";

import { Plug, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card } from "@/components/ui/Card";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { INTEGRATIONS, type Integration } from "@/lib/data/integrations";

const STATUS_META: Record<Integration["status"], { label: string; tone: BadgeTone; icon: typeof CheckCircle2 }> = {
  online: { label: "Онлайн", tone: "success", icon: CheckCircle2 },
  degraded: { label: "Деградация", tone: "warning", icon: AlertTriangle },
  offline: { label: "Офлайн", tone: "danger", icon: XCircle },
};

export default function IntegrationsPage() {
  const online = INTEGRATIONS.filter((i) => i.status === "online").length;
  const degraded = INTEGRATIONS.filter((i) => i.status === "degraded").length;
  const offline = INTEGRATIONS.filter((i) => i.status === "offline").length;

  return (
    <div>
      <PageHeader title="Интеграции" subtitle="Единая точка доступа к корпоративным системам: CRM, GIS, ERP, шины данных и API." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard index={0} icon={Plug} label="Всего систем" value={String(INTEGRATIONS.length)} accent="brand" />
        <KpiCard index={1} icon={CheckCircle2} label="Онлайн" value={String(online)} accent="success" />
        <KpiCard index={2} icon={AlertTriangle} label="Деградация" value={String(degraded)} accent="warning" />
        <KpiCard index={3} icon={XCircle} label="Офлайн" value={String(offline)} accent="danger" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {INTEGRATIONS.map((i) => {
          const meta = STATUS_META[i.status];
          const Icon = meta.icon;
          return (
            <div key={i.id} className="card p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="text-[14px] font-semibold">{i.name}</div>
                  <div className="text-[11.5px] text-muted mt-0.5">{i.type}</div>
                </div>
                <Badge tone={meta.tone}>
                  <Icon size={12} /> {meta.label}
                </Badge>
              </div>
              <p className="text-[12.5px] text-muted leading-relaxed mb-3">{i.description}</p>
              <div className="flex items-center justify-between text-[12px] text-muted border-t border-border pt-2.5">
                <span>Latency: {i.status === "offline" ? "—" : `${i.latencyMs} мс`}</span>
                <span>Синхр.: {new Date(i.lastSync).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
