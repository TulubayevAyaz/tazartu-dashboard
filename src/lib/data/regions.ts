export interface YearPoint {
  year: number;
  plan: number;
  fact: number | null; // null = будущий период (ещё не наступил)
}

export interface Region {
  id: string;
  name: string;
  lat: number;
  lng: number;
  clientsTotal: number; // абонентов на меди на старте программы (2024)
  migrated: number; // переведено на сегодня
  planPctToday: number; // план % на текущую дату
  factPctToday: number; // факт % на текущую дату
  tempoPerMonth: number; // темп переводов, або в месяц
  avgSpeedMbps: number;
  dslamTotal: number;
  dslamDemolished: number;
  history: YearPoint[]; // накопительный % по годам
  status: "ahead" | "on-track" | "behind" | "critical";
}

function pct(fact: number, plan: number): Region["status"] {
  const gap = fact - plan;
  if (gap >= 0) return "ahead";
  if (gap >= -4) return "on-track";
  if (gap >= -12) return "behind";
  return "critical";
}

function buildHistory(planCurve: number[], factCurve: (number | null)[]): YearPoint[] {
  const years = [2024, 2025, 2026, 2027, 2028];
  return years.map((year, i) => ({ year, plan: planCurve[i], fact: factCurve[i] }));
}

export const REGIONS: Region[] = [
  {
    id: "almaty",
    name: "Алматы",
    lat: 43.238949,
    lng: 76.889709,
    clientsTotal: 210000,
    migrated: 155400,
    planPctToday: 70,
    factPctToday: 74,
    tempoPerMonth: 3400,
    avgSpeedMbps: 142,
    dslamTotal: 480,
    dslamDemolished: 338,
    history: buildHistory([15, 38, 62, 85, 100], [17, 41, 74, null, null]),
    status: pct(74, 70),
  },
  {
    id: "astana",
    name: "Астана",
    lat: 51.169392,
    lng: 71.449074,
    clientsTotal: 165000,
    migrated: 113850,
    planPctToday: 66,
    factPctToday: 69,
    tempoPerMonth: 2600,
    avgSpeedMbps: 138,
    dslamTotal: 360,
    dslamDemolished: 246,
    history: buildHistory([14, 36, 60, 84, 100], [15, 39, 69, null, null]),
    status: pct(69, 66),
  },
  {
    id: "shymkent",
    name: "Шымкент",
    lat: 42.317606,
    lng: 69.586235,
    clientsTotal: 120000,
    migrated: 69600,
    planPctToday: 60,
    factPctToday: 58,
    tempoPerMonth: 1650,
    avgSpeedMbps: 121,
    dslamTotal: 260,
    dslamDemolished: 148,
    history: buildHistory([12, 34, 58, 82, 100], [11, 30, 58, null, null]),
    status: pct(58, 60),
  },
  {
    id: "karaganda",
    name: "Караганда",
    lat: 49.806198,
    lng: 73.086914,
    clientsTotal: 140000,
    migrated: 85400,
    planPctToday: 62,
    factPctToday: 61,
    tempoPerMonth: 1900,
    avgSpeedMbps: 126,
    dslamTotal: 300,
    dslamDemolished: 179,
    history: buildHistory([13, 35, 59, 83, 100], [12, 33, 61, null, null]),
    status: pct(61, 62),
  },
  {
    id: "aktobe",
    name: "Актобе",
    lat: 50.283933,
    lng: 57.166978,
    clientsTotal: 75000,
    migrated: 41250,
    planPctToday: 58,
    factPctToday: 55,
    tempoPerMonth: 950,
    avgSpeedMbps: 118,
    dslamTotal: 165,
    dslamDemolished: 88,
    history: buildHistory([11, 32, 56, 81, 100], [10, 28, 55, null, null]),
    status: pct(55, 58),
  },
  {
    id: "atyrau",
    name: "Атырау",
    lat: 47.106804,
    lng: 51.923203,
    clientsTotal: 68000,
    migrated: 34000,
    planPctToday: 55,
    factPctToday: 50,
    tempoPerMonth: 780,
    avgSpeedMbps: 112,
    dslamTotal: 150,
    dslamDemolished: 72,
    history: buildHistory([10, 30, 54, 80, 100], [9, 24, 50, null, null]),
    status: pct(50, 55),
  },
  {
    id: "mangistau",
    name: "Мангистау (Актау)",
    lat: 43.651082,
    lng: 51.212868,
    clientsTotal: 52000,
    migrated: 17680,
    planPctToday: 56,
    factPctToday: 34,
    tempoPerMonth: 320,
    avgSpeedMbps: 96,
    dslamTotal: 120,
    dslamDemolished: 38,
    history: buildHistory([10, 30, 55, 81, 100], [8, 19, 34, null, null]),
    status: pct(34, 56),
  },
  {
    id: "pavlodar",
    name: "Павлодар",
    lat: 52.285462,
    lng: 76.941598,
    clientsTotal: 70000,
    migrated: 44100,
    planPctToday: 61,
    factPctToday: 63,
    tempoPerMonth: 980,
    avgSpeedMbps: 124,
    dslamTotal: 155,
    dslamDemolished: 96,
    history: buildHistory([12, 33, 57, 82, 100], [13, 35, 63, null, null]),
    status: pct(63, 61),
  },
];

export const TOTAL_CLIENTS = REGIONS.reduce((s, r) => s + r.clientsTotal, 0);
export const TOTAL_MIGRATED = REGIONS.reduce((s, r) => s + r.migrated, 0);
export const TOTAL_REMAINING = TOTAL_CLIENTS - TOTAL_MIGRATED;
export const OVERALL_PCT = (TOTAL_MIGRATED / TOTAL_CLIENTS) * 100;

export const TOTAL_DSLAM = REGIONS.reduce((s, r) => s + r.dslamTotal, 0);
export const TOTAL_DSLAM_DEMOLISHED = REGIONS.reduce((s, r) => s + r.dslamDemolished, 0);

export const AVG_SPEED = REGIONS.reduce((s, r) => s + r.avgSpeedMbps * r.migrated, 0) / TOTAL_MIGRATED;

export function regionById(id: string): Region | undefined {
  return REGIONS.find((r) => r.id === id);
}

export interface OverallYearPoint {
  year: number;
  planPct: number;
  factPct: number | null;
}

export const OVERALL_HISTORY: OverallYearPoint[] = [2024, 2025, 2026, 2027, 2028].map((year, i) => {
  let planWeighted = 0;
  let factWeighted = 0;
  let hasFact = true;
  for (const r of REGIONS) {
    const point = r.history[i];
    planWeighted += (point.plan / 100) * r.clientsTotal;
    if (point.fact === null) hasFact = false;
    else factWeighted += (point.fact / 100) * r.clientsTotal;
  }
  return {
    year,
    planPct: (planWeighted / TOTAL_CLIENTS) * 100,
    factPct: hasFact ? (factWeighted / TOTAL_CLIENTS) * 100 : null,
  };
});

export const MIGRATION_MONTHLY = [
  { month: "Янв", plan: 11500, fact: 10800 },
  { month: "Фев", plan: 11800, fact: 11100 },
  { month: "Мар", plan: 12000, fact: 11950 },
  { month: "Апр", plan: 12200, fact: 11400 },
  { month: "Май", plan: 12500, fact: 12100 },
  { month: "Июн", plan: 12700, fact: 12400 },
  { month: "Июл", plan: 12900, fact: 6200 },
];

export const LAGGING_REGIONS = [...REGIONS]
  .sort((a, b) => a.factPctToday - a.planPctToday - (b.factPctToday - b.planPctToday))
  .slice(0, 3);
