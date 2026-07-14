"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const MONTHS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

interface SwapFilterBarProps {
  projects: string[];
  categories: string[];
  years: number[];
  regions: string[];
}

export function SwapFilterBar({ projects, categories, years, regions }: SwapFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const project = searchParams.get("project") ?? "";
  const category = searchParams.get("category") ?? "";
  const year = searchParams.get("year") ?? "";
  const month = searchParams.get("month") ?? "";
  const region = searchParams.get("region") ?? "";
  const hasFilters = Boolean(project || category || year || month || region);

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <FilterSelect label="Проект" value={project} onChange={(v) => setParam("project", v)} options={projects} />
      <FilterSelect label="Категория" value={category} onChange={(v) => setParam("category", v)} options={categories} />
      <FilterSelect label="Год" value={year} onChange={(v) => setParam("year", v)} options={years.map(String)} />
      <FilterSelect label="Месяц" value={month} onChange={(v) => setParam("month", v)} options={MONTHS} />
      <FilterSelect label="Регион" value={region} onChange={(v) => setParam("region", v)} options={regions} />
      {hasFilters && (
        <button
          onClick={() => router.replace(pathname, { scroll: false })}
          className="text-[12.5px] text-muted hover:text-foreground underline underline-offset-2 ml-1"
        >
          Сбросить
        </button>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-full border border-border bg-surface px-3 py-1.5 text-[12.5px] max-w-[180px]"
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
