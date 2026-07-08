export type MilestoneStatus = "done" | "active" | "plan" | "at_risk";

export interface Milestone {
  id: string;
  title: string;
  period: string;
  status: MilestoneStatus;
  description: string;
}

export const ROADMAP: Milestone[] = [
  { id: "m1", title: "Пилот GPON в 3 филиалах", period: "Q1 2024", status: "done", description: "Отработка процесса монтажа, обучение первых бригад." },
  { id: "m2", title: "Массовый запуск переключений", period: "Q3 2024", status: "done", description: "Тиражирование на все 8 ОДТ, старт демонтажа DSLAM." },
  { id: "m3", title: "50% абонентов переведено", period: "Q2 2026", status: "active", description: "Контрольная точка программы, промежуточная защита бюджета." },
  { id: "m4", title: "Апгрейд OLT до 150 Мб/с", period: "Q4 2026", status: "active", description: "Обновление активного оборудования для целевой скорости." },
  { id: "m5", title: "80% демонтажа DSLAM", period: "Q2 2027", status: "plan", description: "Завершение вывода основной массы медных станций." },
  { id: "m6", title: "Пилот XGS-PON 250 Мб/с", period: "Q1 2028", status: "plan", description: "Технологический пилот следующего поколения сети." },
  { id: "m7", title: "Завершение программы «Тазарту»", period: "Q4 2028", status: "plan", description: "100% перевод абонентов, полный демонтаж медной сети." },
];

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface Risk {
  id: string;
  title: string;
  category: "Материалы" | "Подрядчики" | "Персонал" | "Финансы" | "Технологии" | "Абоненты";
  probability: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  owner: string;
  status: "open" | "mitigating" | "closed";
  regionId?: string;
}

export const RISKS: Risk[] = [
  { id: "r1", title: "Дефицит сплиттеров PLC 1x32", category: "Материалы", probability: 4, impact: 4, owner: "Снабжение", status: "mitigating" },
  { id: "r2", title: "Срыв темпа в Мангистау из-за нехватки бригад", category: "Подрядчики", probability: 4, impact: 5, owner: "Куратор подрядчиков", status: "open", regionId: "mangistau" },
  { id: "r3", title: "Задержка апгрейда OLT поставщиком", category: "Технологии", probability: 3, impact: 4, owner: "Дирекция сети", status: "open" },
  { id: "r4", title: "Рост отказов абонентов от перехода", category: "Абоненты", probability: 3, impact: 3, owner: "Клиентский сервис", status: "mitigating" },
  { id: "r5", title: "Превышение CAPEX по монтажным работам", category: "Финансы", probability: 2, impact: 4, owner: "Финансовая дирекция", status: "open" },
  { id: "r6", title: "Недостаток переобученного персонала", category: "Персонал", probability: 2, impact: 3, owner: "HR", status: "mitigating" },
  { id: "r7", title: "Погодные ограничения на выезды (зима)", category: "Подрядчики", probability: 3, impact: 2, owner: "Куратор подрядчиков", status: "closed" },
  { id: "r8", title: "Рост цен на оптический кабель", category: "Финансы", probability: 2, impact: 3, owner: "Снабжение", status: "open" },
];

export function riskScore(r: Risk) {
  return r.probability * r.impact;
}
