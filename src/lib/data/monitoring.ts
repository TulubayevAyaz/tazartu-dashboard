export type MonitoringKind = "new_order" | "completed" | "incident";

export interface MonitoringEvent {
  id: string;
  kind: MonitoringKind;
  title: string;
  regionId: string;
  time: string; // ISO
}

export const MONITORING_SEED: MonitoringEvent[] = [
  { id: "e1", kind: "completed", title: "Переключение выполнено: лиц. счёт AL-0042118", regionId: "almaty", time: "2026-07-08T09:14:00" },
  { id: "e2", kind: "new_order", title: "Новая заявка на переключение: AS-0118872", regionId: "astana", time: "2026-07-08T09:11:00" },
  { id: "e3", kind: "incident", title: "Авария OLT-14, снижение скорости у 340 абонентов", regionId: "mangistau", time: "2026-07-08T08:55:00" },
  { id: "e4", kind: "completed", title: "Переключение выполнено: лиц. счёт KA-0055310", regionId: "karaganda", time: "2026-07-08T08:40:00" },
  { id: "e5", kind: "new_order", title: "Новая заявка на переключение: SH-0091223", regionId: "shymkent", time: "2026-07-08T08:22:00" },
  { id: "e6", kind: "incident", title: "Обрыв магистрального кабеля, участок Атырау-Юг", regionId: "atyrau", time: "2026-07-08T07:58:00" },
];

export const REGION_NAME_BY_ID: Record<string, string> = {
  almaty: "Алматы",
  astana: "Астана",
  shymkent: "Шымкент",
  karaganda: "Караганда",
  aktobe: "Актобе",
  atyrau: "Атырау",
  mangistau: "Мангистау (Актау)",
  pavlodar: "Павлодар",
};
