export type MaterialStatus = "ok" | "low" | "critical";
export type AbcXyz = "AX" | "AY" | "AZ" | "BX" | "BY" | "BZ" | "CX" | "CY" | "CZ";

export interface Material {
  id: string;
  name: string;
  category: "ONU" | "Кабель" | "Муфты" | "Сплиттеры" | "ODF" | "Коннекторы" | "Кроссы" | "Патчкорды";
  unit: string;
  stock: number;
  dailyUsage: number;
  norm: number; // норматив дней запаса
  abcXyz: AbcXyz;
  nextDelivery: { date: string; qty: number } | null;
}

function daysOfSupply(stock: number, dailyUsage: number): number {
  return dailyUsage > 0 ? Math.round(stock / dailyUsage) : Infinity;
}

export function materialStatus(days: number, norm: number): MaterialStatus {
  if (days < norm * 0.4) return "critical";
  if (days < norm) return "low";
  return "ok";
}

export const MATERIALS: Material[] = [
  { id: "onu-hg8010h", name: "ONU HG8010H (GPON)", category: "ONU", unit: "шт", stock: 18400, dailyUsage: 420, norm: 30, abcXyz: "AX", nextDelivery: { date: "2026-07-14", qty: 8000 } },
  { id: "onu-hg8245", name: "ONU HG8245H5 (Wi-Fi)", category: "ONU", unit: "шт", stock: 6200, dailyUsage: 260, norm: 30, abcXyz: "AY", nextDelivery: { date: "2026-07-20", qty: 5000 } },
  { id: "onu-xgspon", name: "ONU XGS-PON (пилот)", category: "ONU", unit: "шт", stock: 340, dailyUsage: 45, norm: 30, abcXyz: "BZ", nextDelivery: { date: "2026-08-05", qty: 1000 } },
  { id: "cable-drop", name: "Абонентский кабель (drop-cable)", category: "Кабель", unit: "м", stock: 182000, dailyUsage: 6100, norm: 30, abcXyz: "AX", nextDelivery: { date: "2026-07-16", qty: 60000 } },
  { id: "cable-96", name: "Магистральный ОК 96 волокон", category: "Кабель", unit: "м", stock: 24500, dailyUsage: 980, norm: 30, abcXyz: "AY", nextDelivery: { date: "2026-07-25", qty: 15000 } },
  { id: "muft-tup", name: "Муфта тупиковая 1x8", category: "Муфты", unit: "шт", stock: 2100, dailyUsage: 95, norm: 30, abcXyz: "BY", nextDelivery: { date: "2026-07-18", qty: 1200 } },
  { id: "muft-proh", name: "Муфта проходная 1x16", category: "Муфты", unit: "шт", stock: 640, dailyUsage: 52, norm: 30, abcXyz: "BX", nextDelivery: null },
  { id: "splitter-1-8", name: "Сплиттер PLC 1x8", category: "Сплиттеры", unit: "шт", stock: 5400, dailyUsage: 210, norm: 30, abcXyz: "AX", nextDelivery: { date: "2026-07-15", qty: 4000 } },
  { id: "splitter-1-16", name: "Сплиттер PLC 1x16", category: "Сплиттеры", unit: "шт", stock: 1180, dailyUsage: 140, norm: 30, abcXyz: "AY", nextDelivery: { date: "2026-07-13", qty: 3000 } },
  { id: "splitter-1-32", name: "Сплиттер PLC 1x32", category: "Сплиттеры", unit: "шт", stock: 260, dailyUsage: 48, norm: 30, abcXyz: "AZ", nextDelivery: { date: "2026-07-30", qty: 2000 } },
  { id: "odf-24", name: "ODF 24 порта", category: "ODF", unit: "шт", stock: 310, dailyUsage: 9, norm: 30, abcXyz: "CY", nextDelivery: null },
  { id: "odf-48", name: "ODF 48 портов", category: "ODF", unit: "шт", stock: 145, dailyUsage: 7, norm: 30, abcXyz: "CY", nextDelivery: { date: "2026-08-01", qty: 100 } },
  { id: "connector-sc", name: "Коннектор SC/APC", category: "Коннекторы", unit: "шт", stock: 41000, dailyUsage: 1450, norm: 30, abcXyz: "AX", nextDelivery: { date: "2026-07-12", qty: 20000 } },
  { id: "connector-lc", name: "Коннектор LC/APC", category: "Коннекторы", unit: "шт", stock: 8600, dailyUsage: 610, norm: 30, abcXyz: "AY", nextDelivery: { date: "2026-07-14", qty: 6000 } },
  { id: "cross-optic", name: "Оптический кросс настенный", category: "Кроссы", unit: "шт", stock: 520, dailyUsage: 18, norm: 30, abcXyz: "BY", nextDelivery: null },
  { id: "patchcord-3", name: "Патчкорд SC/APC-SC/APC 3м", category: "Патчкорды", unit: "шт", stock: 12400, dailyUsage: 640, norm: 30, abcXyz: "AX", nextDelivery: { date: "2026-07-13", qty: 8000 } },
  { id: "patchcord-10", name: "Патчкорд SC/APC-LC/APC 10м", category: "Патчкорды", unit: "шт", stock: 1900, dailyUsage: 210, norm: 30, abcXyz: "AZ", nextDelivery: { date: "2026-07-17", qty: 2000 } },
];

export const MATERIALS_WITH_STATUS = MATERIALS.map((m) => {
  const days = daysOfSupply(m.stock, m.dailyUsage);
  return { ...m, daysOfSupply: days, status: materialStatus(days, m.norm) };
});

export const MATERIALS_SUMMARY = {
  ok: MATERIALS_WITH_STATUS.filter((m) => m.status === "ok").length,
  low: MATERIALS_WITH_STATUS.filter((m) => m.status === "low").length,
  critical: MATERIALS_WITH_STATUS.filter((m) => m.status === "critical").length,
  incoming: MATERIALS_WITH_STATUS.filter((m) => m.nextDelivery).length,
};

// прогноз расхода vs поступление на 4 недели (агрегировано, ONU шт)
export const ONU_FORECAST_WEEKS = [
  { week: "Нед. 1", usage: 4800, incoming: 8000, stockLevel: 24600 },
  { week: "Нед. 2", usage: 5100, incoming: 0, stockLevel: 19500 },
  { week: "Нед. 3", usage: 4950, incoming: 5000, stockLevel: 19550 },
  { week: "Нед. 4", usage: 5200, incoming: 1000, stockLevel: 15350 },
];
