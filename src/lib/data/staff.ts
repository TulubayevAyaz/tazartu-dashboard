export interface Brigade {
  id: string;
  name: string;
  regionId: string;
  installers: number;
  ordersPerMonth: number;
  ratingPct: number; // производительность/качество
  load: "low" | "normal" | "high" | "overload";
}

export const BRIGADES: Brigade[] = [
  { id: "b1", name: "Бригада №1 «Алатау»", regionId: "almaty", installers: 6, ordersPerMonth: 210, ratingPct: 96, load: "high" },
  { id: "b2", name: "Бригада №2 «Медеу»", regionId: "almaty", installers: 5, ordersPerMonth: 178, ratingPct: 91, load: "normal" },
  { id: "b3", name: "Бригада №1 «Есиль»", regionId: "astana", installers: 6, ordersPerMonth: 195, ratingPct: 93, load: "high" },
  { id: "b4", name: "Бригада №2 «Сарыарка»", regionId: "astana", installers: 5, ordersPerMonth: 160, ratingPct: 88, load: "normal" },
  { id: "b5", name: "Бригада №1 «Оңтүстік»", regionId: "shymkent", installers: 5, ordersPerMonth: 140, ratingPct: 82, load: "overload" },
  { id: "b6", name: "Бригада №1 «Сарыарка-Кен»", regionId: "karaganda", installers: 5, ordersPerMonth: 150, ratingPct: 85, load: "normal" },
  { id: "b7", name: "Бригада №1 «Ақтөбе»", regionId: "aktobe", installers: 4, ordersPerMonth: 105, ratingPct: 80, load: "normal" },
  { id: "b8", name: "Бригада №1 «Атырау»", regionId: "atyrau", installers: 4, ordersPerMonth: 95, ratingPct: 78, load: "normal" },
  { id: "b9", name: "Бригада №1 «Маңғыстау»", regionId: "mangistau", installers: 3, ordersPerMonth: 58, ratingPct: 64, load: "overload" },
  { id: "b10", name: "Бригада №1 «Ертіс»", regionId: "pavlodar", installers: 4, ordersPerMonth: 110, ratingPct: 84, load: "normal" },
];

export const STAFF_STRUCTURE = [
  { name: "Монтаж GPON", value: 1240 },
  { name: "Обслуживание сети", value: 860 },
  { name: "Административный", value: 310 },
  { name: "ИТ и аналитика", value: 175 },
  { name: "Клиентский сервис", value: 420 },
];

export const STAFF_TOTAL = STAFF_STRUCTURE.reduce((s, x) => s + x.value, 0);

// переориентация персонала 2024-2028
export const STAFF_REALLOCATION = [
  { year: 2024, gpon: 640, service: 1180, retraining: 210, released: 20 },
  { year: 2025, gpon: 980, service: 980, retraining: 260, released: 90 },
  { year: 2026, gpon: 1240, service: 780, retraining: 190, released: 180 },
  { year: 2027, gpon: 1380, service: 520, retraining: 110, released: 320 },
  { year: 2028, gpon: 1420, service: 260, retraining: 40, released: 470 },
];

export const STAFF_KPI = {
  totalEmployees: STAFF_TOTAL,
  gponInstallers: 1240,
  releasedBy2028: 470,
  payrollSavingsPerYear: 1_380_000_000,
};
