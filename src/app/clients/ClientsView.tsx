"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, User, Wifi, Wrench, FileClock, MapPin } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { CLIENTS, searchClients, type ClientRecord, type ClientStatus } from "@/lib/data/clients";
import { REGION_NAME_BY_ID } from "@/lib/data/monitoring";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<ClientStatus, string> = {
  migrated: "Переведён на GPON",
  scheduled: "Запланировано",
  in_progress: "В процессе",
  refused: "Отказ",
};
const STATUS_TONE: Record<ClientStatus, BadgeTone> = { migrated: "success", scheduled: "brand", in_progress: "warning", refused: "danger" };

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

export function ClientsView() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const regionFilter = params.get("region");

  const results: ClientRecord[] = useMemo(() => {
    if (query.trim()) return searchClients(query);
    if (regionFilter) return CLIENTS.filter((c) => c.regionId === regionFilter);
    return CLIENTS;
  }, [query, regionFilter]);

  const [selectedIin, setSelectedIin] = useState<string | null>(results[0]?.iin ?? null);
  const selected = CLIENTS.find((c) => c.iin === selectedIin) ?? results[0] ?? null;

  return (
    <div>
      <PageHeader title="Клиенты" subtitle="Поиск по ИИН, телефону, лицевому счёту, адресу, ONU или MAC-адресу." />

      <Card className="mb-5">
        <div className="relative">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Введите ИИН, телефон, лицевой счёт, адрес, ONU или MAC..."
            className="w-full rounded-[14px] border border-border bg-background pl-11 pr-4 py-3 text-[14px] outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <Card title={`Результаты (${results.length})`} className="xl:col-span-2 max-h-[640px] overflow-y-auto">
          <div className="space-y-1.5 -mx-1">
            {results.map((c) => (
              <button
                key={c.iin}
                onClick={() => setSelectedIin(c.iin)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-[12px] p-2.5 text-left transition-colors",
                  selected?.iin === c.iin ? "bg-brand/10" : "hover:bg-surface-2",
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-[12px] font-semibold text-white">
                  {initials(c.fullName)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium truncate">{c.fullName}</div>
                  <div className="text-[12px] text-muted truncate">{c.account} · {REGION_NAME_BY_ID[c.regionId]}</div>
                </div>
                <Badge tone={STATUS_TONE[c.status]}>{STATUS_LABEL[c.status]}</Badge>
              </button>
            ))}
            {results.length === 0 && <div className="text-[13px] text-muted px-2 py-6 text-center">Ничего не найдено. Попробуйте другой запрос.</div>}
          </div>
        </Card>

        <div className="xl:col-span-3">
          {selected ? (
            <Card>
              <div className="flex items-start gap-4 mb-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-[20px] font-semibold text-white">
                  {initials(selected.fullName)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[17px] font-semibold">{selected.fullName}</div>
                  <div className="text-[13px] text-muted mt-0.5 flex items-center gap-1.5">
                    <MapPin size={13} /> {selected.address}
                  </div>
                  <div className="text-[12.5px] text-muted mt-1">
                    ИИН {selected.iin} · {selected.phone} · Лиц. счёт {selected.account}
                  </div>
                </div>
                <Badge tone={STATUS_TONE[selected.status]}>{STATUS_LABEL[selected.status]}</Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                <div className="rounded-[12px] bg-surface-2 p-3">
                  <div className="text-[11px] text-muted mb-1 flex items-center gap-1"><Wifi size={12} /> Скорость до</div>
                  <div className="text-[13px] font-medium">{selected.speedBefore}</div>
                </div>
                <div className="rounded-[12px] bg-surface-2 p-3">
                  <div className="text-[11px] text-muted mb-1 flex items-center gap-1"><Wifi size={12} /> Скорость после</div>
                  <div className="text-[13px] font-medium">{selected.speedAfter ?? "—"}</div>
                </div>
                <div className="rounded-[12px] bg-surface-2 p-3">
                  <div className="text-[11px] text-muted mb-1">ONU</div>
                  <div className="text-[13px] font-medium">{selected.onu ?? "—"}</div>
                </div>
                <div className="rounded-[12px] bg-surface-2 p-3">
                  <div className="text-[11px] text-muted mb-1">MAC</div>
                  <div className="text-[13px] font-medium">{selected.mac ?? "—"}</div>
                </div>
              </div>

              <div className="mb-5">
                <div className="text-[12.5px] font-medium text-muted mb-2">Услуги</div>
                <div className="flex flex-wrap gap-1.5">
                  {selected.services.map((s) => (
                    <Badge key={s} tone="brand">{s}</Badge>
                  ))}
                </div>
              </div>

              {selected.installer && (
                <div className="mb-5 flex items-center gap-2 text-[13px]">
                  <Wrench size={14} className="text-muted" />
                  <span className="text-muted">Монтёр:</span> <span className="font-medium">{selected.installer}</span>
                </div>
              )}

              {selected.refusalReason && (
                <div className="mb-5 rounded-[12px] border border-danger/25 bg-danger/8 p-3 text-[13px] text-danger">
                  <span className="font-semibold">Причина отказа: </span>
                  {selected.refusalReason}
                </div>
              )}

              <div>
                <div className="text-[12.5px] font-medium text-muted mb-3 flex items-center gap-1.5">
                  <FileClock size={14} /> История переключения
                </div>
                <div className="space-y-3">
                  {selected.history.map((h, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-brand mt-1.5" />
                        {i < selected.history.length - 1 && <div className="w-px flex-1 bg-border" />}
                      </div>
                      <div className="pb-3 min-w-0">
                        <div className="text-[12.5px] text-muted">{h.date}</div>
                        <div className="text-[13px] font-medium">{h.event}</div>
                        <Badge tone="muted">{h.system}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="flex flex-col items-center justify-center py-16 text-muted">
                <User size={28} className="mb-2 opacity-50" />
                <div className="text-[13px]">Выберите клиента из списка слева</div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
