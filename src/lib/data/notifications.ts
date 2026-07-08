export type NotificationLevel = "critical" | "warning" | "info";

export interface Notification {
  id: string;
  level: NotificationLevel;
  title: string;
  detail: string;
  time: string;
  read: boolean;
}

export const NOTIFICATIONS: Notification[] = [
  { id: "n1", level: "critical", title: "Мангистау отстаёт от плана на 22 п.п.", detail: "Факт 34% при плане 56% — риск срыва контрольной точки Q2 2026.", time: "2026-07-08T08:00:00", read: false },
  { id: "n2", level: "critical", title: "Критический запас: Сплиттер PLC 1x32", detail: "Остаток на 5.4 дня при нормативе 30 дней.", time: "2026-07-08T07:40:00", read: false },
  { id: "n3", level: "warning", title: "Kafka: потеря соединения с шиной событий", detail: "Синхронизация приостановлена с 22:10 07.07.2026.", time: "2026-07-07T22:11:00", read: false },
  { id: "n4", level: "warning", title: "Рост остановленных заказов в Шымкенте", detail: "Доля «нет доступа к абоненту» выросла на 8% за неделю.", time: "2026-07-07T18:20:00", read: true },
  { id: "n5", level: "info", title: "Обновление данных по DSLAM завершено", detail: "Витрина TRACK/Smallworld синхронизирована.", time: "2026-07-08T06:00:00", read: true },
];

export const UNREAD_COUNT = NOTIFICATIONS.filter((n) => !n.read).length;
