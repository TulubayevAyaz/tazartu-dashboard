export type OrderStatus = "created" | "in_progress" | "done" | "stopped";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  created: "Создан",
  in_progress: "В работе",
  done: "Выполнен",
  stopped: "Остановлен",
};

export interface Contractor {
  id: string;
  name: string;
  regionId: string;
  ordersTotal: number;
  ordersDone: number;
  ordersStopped: number;
  completionPct: number;
  brigades: number;
}

export const CONTRACTORS: Contractor[] = [
  { id: "c1", name: "ТОО «ФиберЛайн Строй»", regionId: "almaty", ordersTotal: 4200, ordersDone: 3540, ordersStopped: 180, completionPct: 84.3, brigades: 22 },
  { id: "c2", name: "ТОО «ОптикСервис KZ»", regionId: "astana", ordersTotal: 3300, ordersDone: 2610, ordersStopped: 210, completionPct: 79.1, brigades: 17 },
  { id: "c3", name: "ТОО «Юг-Телеком Монтаж»", regionId: "shymkent", ordersTotal: 2400, ordersDone: 1660, ordersStopped: 260, completionPct: 69.2, brigades: 14 },
  { id: "c4", name: "ТОО «Карагандамонтажсвязь»", regionId: "karaganda", ordersTotal: 2700, ordersDone: 1980, ordersStopped: 190, completionPct: 73.3, brigades: 15 },
  { id: "c5", name: "ТОО «ЗападТелекомСтрой»", regionId: "aktobe", ordersTotal: 1500, ordersDone: 990, ordersStopped: 140, completionPct: 66.0, brigades: 9 },
  { id: "c6", name: "ТОО «КаспийОптик»", regionId: "atyrau", ordersTotal: 1350, ordersDone: 830, ordersStopped: 160, completionPct: 61.5, brigades: 8 },
  { id: "c7", name: "ТОО «МангистауСвязьМонтаж»", regionId: "mangistau", ordersTotal: 980, ordersDone: 420, ordersStopped: 260, completionPct: 42.9, brigades: 6 },
  { id: "c8", name: "ТОО «Прииртышье-Телеком»", regionId: "pavlodar", ordersTotal: 1400, ordersDone: 1040, ordersStopped: 110, completionPct: 74.3, brigades: 8 },
];

export const STOP_REASONS = [
  { reason: "Нет материала", count: 420, color: "var(--warning)" },
  { reason: "Нет доступа к абоненту", count: 610, color: "var(--brand-2)" },
  { reason: "Техпроблема OLT", count: 180, color: "var(--danger)" },
  { reason: "Отказ абонента", count: 340, color: "var(--muted)" },
  { reason: "Прочее", count: 160, color: "#a855f7" },
];

export const ORDERS_MONTHLY = [
  { month: "Янв", plan: 9200, fact: 8700 },
  { month: "Фев", plan: 9400, fact: 8850 },
  { month: "Мар", plan: 9600, fact: 9500 },
  { month: "Апр", plan: 9800, fact: 9100 },
  { month: "Май", plan: 10000, fact: 9700 },
  { month: "Июн", plan: 10200, fact: 9950 },
  { month: "Июл", plan: 10300, fact: 5100 },
];

export const ORDERS_BY_STATUS = {
  created: 1840,
  in_progress: 3260,
  done: 15070,
  stopped: 1530,
};
