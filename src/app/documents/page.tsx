"use client";

import { useMemo, useState } from "react";
import { FileText, Search, Download } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { DOCUMENTS, type ProjectDocument } from "@/lib/data/documents";

const CATEGORIES: ProjectDocument["category"][] = ["Регламент", "Инструкция", "Презентация", "Протокол"];
const CATEGORY_TONE: Record<ProjectDocument["category"], BadgeTone> = {
  "Регламент": "brand",
  "Инструкция": "success",
  "Презентация": "warning",
  "Протокол": "muted",
};

function formatSize(kb: number) {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} МБ` : `${kb} КБ`;
}

export default function DocumentsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProjectDocument["category"] | "all">("all");

  const filtered = useMemo(() => {
    return DOCUMENTS.filter((d) => {
      const matchesQuery = d.title.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "all" || d.category === category;
      return matchesQuery && matchesCategory;
    }).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  }, [query, category]);

  return (
    <div>
      <PageHeader title="Документы проекта" subtitle="Регламенты, инструкции, презентации и протоколы программы «Тазарту»." />

      <Card className="mb-5">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по названию документа..."
              className="w-full rounded-[12px] border border-border bg-background pl-10 pr-4 py-2.5 text-[13.5px] outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setCategory("all")}
              className={`rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors ${category === "all" ? "bg-brand text-white" : "text-muted hover:bg-surface-2"}`}
            >
              Все
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors ${category === c ? "bg-brand text-white" : "text-muted hover:bg-surface-2"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((d) => (
          <div key={d.id} className="card p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-brand/10 text-brand-2 dark:text-brand">
                <FileText size={18} />
              </div>
              <Badge tone={CATEGORY_TONE[d.category]}>{d.category}</Badge>
            </div>
            <div>
              <div className="text-[13.5px] font-semibold leading-snug">{d.title}</div>
              <div className="text-[12px] text-muted mt-1">{d.owner}</div>
            </div>
            <div className="flex items-center justify-between text-[12px] text-muted mt-auto pt-2 border-t border-border">
              <span>{d.updatedAt} · {formatSize(d.sizeKb)}</span>
              <button className="flex items-center gap-1 text-brand-2 dark:text-brand font-medium hover:underline">
                <Download size={13} /> Скачать
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-full text-center text-[13px] text-muted py-12">Документы не найдены</div>}
      </div>
    </div>
  );
}
