import { parseCsv } from "./parseDetailCsv";
import type { MetricSplit, SwapCategoryRow, SwapMonthPoint } from "@/lib/types/swap";

const COL = {
  project: "Наименование проекта",
  workType: "Вид выполнения проекта (ДРТР)",
  plannedPorts: "Кол-во портов (ДРТР)",
  smrStatus: "Статус по СМР (ДРТР)",
  smrDate: "Дата завершения СМР факт (ДРТР)",
  acceptStatus: "Статус по сдаче в эксплуатацию/подключен (ДРТР)",
  acceptDate: "Дата сдачи в эксплуатацию (ДРТР)",
};

// "Шпаргалка по проектам" — лист-легенда из ручного файла СКП_FTTH, перенесена в код 14.07.2026.
const CATEGORY_PROJECTS: Record<string, string[]> = {
  "В рамках СКП ГТС": [
    "Перевод городских сетей на технологию GPON (5 городов) 2023 год",
    "Развитие сети ШПД Восточный регион в 2024 году",
    "Развитие сети ШПД Западный регион в 2024 году",
    "Развитие сети ШПД Центральный регион в 2024 году",
    "Развитие сети ШПД Южный регион в 2024 году",
    "Стратегический комплексный проект Развертывание сети FTTH",
  ],
  "Прочие проекты": [
    "Перевод сети г. Алматы на технологии G-PON в 2024 г.",
    "Перевод сети г. Астана на технологии G-PON в 2024 г.",
    "Перевод сети г. Шымкент на технологии G-PON в 2024 г.",
  ],
  "ОР и ХС ДРБ": [
    "Строительство сетей GPON в рамках оперативного резерва - 2023",
    "Строительство сетей GPON в рамках оперативного резерва - 2024",
    "Строительство сетей GPON в рамках оперативного резерва - 2025",
    "Строительство сетей GPON в рамках оперативного резерва - 2025 (8 СНП)",
    "Строительство сетей GPON в рамках оперативного резерва - 2026",
  ],
};
const PARTNERKA_LABEL = "Прочяя партнерка";
const PARTNERKA_PROJECT = "Партнерка (прочее)";
const CATEGORY_LABELS = ["В рамках СКП ГТС", "Прочие проекты", PARTNERKA_LABEL, "ОР и ХС ДРБ"];
const MONTHLY_CATEGORY_LABELS = ["В рамках СКП ГТС", "Прочие проекты"];

const DONE_STATUSES = new Set(["сдан", "сдан (м)"]);
const MONTH_LABELS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

function zero(): MetricSplit {
  return { total: 0, znk: 0, swap: 0 };
}

function add(split: MetricSplit, amount: number, isZnk: boolean) {
  split.total += amount;
  if (isZnk) split.znk += amount;
  else split.swap += amount;
}

function subtract(a: MetricSplit, b: MetricSplit): MetricSplit {
  return { total: a.total - b.total, znk: a.znk - b.znk, swap: a.swap - b.swap };
}

function toNumber(v: string | undefined): number {
  if (!v) return 0;
  const cleaned = v.replace(/\s/g, "").replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

// Поддерживает "ДД.ММ.ГГГГ", "ГГГГ-ММ-ДД" и Excel-серийную дату как текст.
function parseDate(v: string | undefined): Date | null {
  if (!v) return null;
  const s = v.trim();
  if (!s) return null;

  const dmy = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (dmy) {
    const [, d, m, y] = dmy;
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const ymd = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (ymd) {
    const [, y, m, d] = ymd;
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const serial = Number(s);
  if (Number.isFinite(serial) && serial > 20000 && serial < 60000) {
    const epoch = new Date(Date.UTC(1899, 11, 30));
    return new Date(epoch.getTime() + serial * 86400000);
  }
  return null;
}

function emptyCategory(label: string): SwapCategoryRow {
  return { label, planBP: zero(), planDUP: zero(), smr: zero(), accepted: zero(), delta: zero() };
}

export interface ComputedConstructionSummary {
  categories: SwapCategoryRow[];
  monthly: SwapMonthPoint[];
}

// Проверено на реальном срезе 14.07.2026 — совпадает 1-в-1 с ручным расчётом тимлида по всем 4 категориям
// и разбивке ЗНК/SWAP (см. docs/SWAP_SUMMARY_LOGIC.md).
export function computeConstructionSummary(csvText: string, today: Date = new Date()): ComputedConstructionSummary {
  const targetYear = today.getFullYear();
  const records = parseCsv(csvText).filter((r) => !(r.length === 1 && r[0] === ""));
  if (records.length < 2) {
    return { categories: CATEGORY_LABELS.map(emptyCategory), monthly: [] };
  }

  const header = records[0].map((h) => h.trim());
  const idx = (name: string) => header.indexOf(name);
  const iProject = idx(COL.project);
  const iWorkType = idx(COL.workType);
  const iPlanned = idx(COL.plannedPorts);
  const iSmrStatus = idx(COL.smrStatus);
  const iSmrDate = idx(COL.smrDate);
  const iAcceptStatus = idx(COL.acceptStatus);
  const iAcceptDate = idx(COL.acceptDate);

  if ([iProject, iWorkType, iPlanned, iSmrStatus, iSmrDate, iAcceptStatus, iAcceptDate].includes(-1)) {
    return { categories: CATEGORY_LABELS.map(emptyCategory), monthly: [] };
  }

  const categories = new Map<string, SwapCategoryRow>(CATEGORY_LABELS.map((l) => [l, emptyCategory(l)]));
  const monthlyMap = new Map<number, { smr: MetricSplit; accepted: MetricSplit }>();

  const categoryForProject = (project: string): string | null => {
    if (project === PARTNERKA_PROJECT) return PARTNERKA_LABEL;
    for (const [label, projects] of Object.entries(CATEGORY_PROJECTS)) {
      if (projects.includes(project)) return label;
    }
    return null;
  };

  for (const r of records.slice(1)) {
    const project = (r[iProject] ?? "").trim();
    if (!project) continue;
    const label = categoryForProject(project);
    if (!label) continue;

    const category = categories.get(label)!;
    const planned = toNumber(r[iPlanned]);
    const workType = (r[iWorkType] ?? "").trim();
    const isZnk = label === PARTNERKA_LABEL ? true : workType.includes("ЗНК");

    const smrStatus = (r[iSmrStatus] ?? "").trim();
    const smrDate = parseDate(r[iSmrDate]);
    const smrDoneAnyYear = DONE_STATUSES.has(smrStatus) && smrDate !== null;
    const smrDoneThisYear = smrDoneAnyYear && smrDate!.getFullYear() === targetYear && smrDate! <= today;

    // "СМР завершено" в бакет текущего года попадает только если сама дата W — в этом году.
    if (smrDoneThisYear) {
      add(category.smr, planned, isZnk);
      if (MONTHLY_CATEGORY_LABELS.includes(label)) {
        const key = smrDate!.getMonth() + 1;
        if (!monthlyMap.has(key)) monthlyMap.set(key, { smr: zero(), accepted: zero() });
        add(monthlyMap.get(key)!.smr, planned, isZnk);
      }
    }

    // "Принято" не требует, чтобы СМР было завершено именно в этом году — только сам факт (любой год) +
    // дата приёмки Y — в этом году.
    const acceptStatus = (r[iAcceptStatus] ?? "").trim();
    const acceptDate = parseDate(r[iAcceptDate]);
    const acceptDone =
      smrDoneAnyYear &&
      DONE_STATUSES.has(acceptStatus) &&
      acceptDate !== null &&
      acceptDate.getFullYear() === targetYear &&
      acceptDate <= today;

    if (acceptDone) {
      add(category.accepted, planned, isZnk);
      if (MONTHLY_CATEGORY_LABELS.includes(label)) {
        const key = acceptDate!.getMonth() + 1;
        if (!monthlyMap.has(key)) monthlyMap.set(key, { smr: zero(), accepted: zero() });
        add(monthlyMap.get(key)!.accepted, planned, isZnk);
      }
    }
  }

  for (const category of categories.values()) {
    category.delta = subtract(category.smr, category.accepted);
  }

  const monthly: SwapMonthPoint[] = [...monthlyMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([monthIndex, v]) => ({
      month: MONTH_LABELS[monthIndex - 1],
      monthIndex,
      year: targetYear,
      method: "contract" as const,
      planBP: zero(),
      planDUP: zero(),
      smr: v.smr,
      accepted: v.accepted,
      delta: subtract(v.smr, v.accepted),
      sales: zero(),
    }));

  return { categories: [...categories.values()], monthly };
}
