"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardPlus, CheckCircle2, AlertTriangle, Activity } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card } from "@/components/ui/Card";
import { MONITORING_SEED, REGION_NAME_BY_ID, type MonitoringEvent, type MonitoringKind } from "@/lib/data/monitoring";
import { REGIONS } from "@/lib/data/regions";
import { cn } from "@/lib/utils";

const KIND_META: Record<MonitoringKind, { icon: typeof ClipboardPlus; color: string; bg: string; label: string }> = {
  new_order: { icon: ClipboardPlus, color: "text-brand-2 dark:text-brand", bg: "bg-brand/10", label: "Новая заявка" },
  completed: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Переключение выполнено" },
  incident: { icon: AlertTriangle, color: "text-danger", bg: "bg-danger/10", label: "Авария" },
};

const TEMPLATES: Record<MonitoringKind, (region: string, acc: string) => string> = {
  new_order: (region, acc) => `Новая заявка на переключение: ${acc}`,
  completed: (region, acc) => `Переключение выполнено: лиц. счёт ${acc}`,
  incident: (region) => `Инцидент на сети OLT в регионе ${region}, диагностика запущена`,
};

function randomEvent(seq: number): MonitoringEvent {
  const kinds: MonitoringKind[] = ["new_order", "completed", "completed", "new_order", "incident"];
  const kind = kinds[Math.floor(Math.random() * kinds.length)];
  const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];
  const acc = `${region.id.slice(0, 2).toUpperCase()}-${(100000 + Math.floor(Math.random() * 899999))}`;
  return {
    id: `live-${seq}`,
    kind,
    title: TEMPLATES[kind](region.name, acc),
    regionId: region.id,
    time: new Date().toISOString(),
  };
}

export default function MonitoringPage() {
  const [events, setEvents] = useState<MonitoringEvent[]>(MONITORING_SEED);
  const [seq, setSeq] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeq((s) => s + 1);
      setEvents((prev) => [randomEvent(Date.now()), ...prev].slice(0, 25));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const newToday = events.filter((e) => e.kind === "new_order").length;
  const completedToday = events.filter((e) => e.kind === "completed").length;
  const incidents = events.filter((e) => e.kind === "incident").length;

  return (
    <div>
      <PageHeader title="Мониторинг в реальном времени" subtitle="Поступление новых заявок, завершённые переключения и активные аварии по мере поступления." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard index={0} icon={Activity} label="Событий в ленте" value={String(events.length)} accent="brand" />
        <KpiCard index={1} icon={ClipboardPlus} label="Новых заявок" value={String(newToday)} accent="brand" />
        <KpiCard index={2} icon={CheckCircle2} label="Переключений выполнено" value={String(completedToday)} accent="success" />
        <KpiCard index={3} icon={AlertTriangle} label="Активных аварий" value={String(incidents)} accent="danger" />
      </div>

      <Card title="Живая лента событий" subtitle="Обновляется автоматически">
        <div className="space-y-1.5 max-h-[560px] overflow-y-auto">
          <AnimatePresence initial={false}>
            {events.map((e) => {
              const meta = KIND_META[e.kind];
              const Icon = meta.icon;
              return (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn("flex items-center gap-3 rounded-[12px] px-3 py-2.5", e.kind === "incident" ? "bg-danger/6" : "hover:bg-surface-2")}
                >
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", meta.bg, meta.color)}>
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium truncate">{e.title}</div>
                    <div className="text-[12px] text-muted mt-0.5">
                      {REGION_NAME_BY_ID[e.regionId]} · {new Date(e.time).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}
