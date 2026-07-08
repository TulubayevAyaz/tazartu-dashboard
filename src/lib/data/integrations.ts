export interface Integration {
  id: string;
  name: string;
  type: "CRM" | "GIS" | "Тикет-система" | "WFM" | "NMS" | "ERP" | "БД" | "Шина данных" | "API";
  status: "online" | "degraded" | "offline";
  latencyMs: number;
  lastSync: string;
  description: string;
}

export const INTEGRATIONS: Integration[] = [
  { id: "crm", name: "CRM/BSS", type: "CRM", status: "online", latencyMs: 120, lastSync: "2026-07-08T09:10:00", description: "Переключения FTTH/GPON, лицевые счета абонентов" },
  { id: "tracktrace", name: "Track&Trace / Smallworld", type: "GIS", status: "online", latencyMs: 210, lastSync: "2026-07-08T09:05:00", description: "ГИС-учёт сети, демонтаж DSLAM, монтажные работы" },
  { id: "remedy", name: "Remedy", type: "Тикет-система", status: "online", latencyMs: 340, lastSync: "2026-07-08T09:08:00", description: "Тикеты и наряды подрядчиков" },
  { id: "wfm", name: "WFM", type: "WFM", status: "degraded", latencyMs: 890, lastSync: "2026-07-08T08:40:00", description: "Планирование выездов бригад и монтёров" },
  { id: "nms", name: "NMS", type: "NMS", status: "online", latencyMs: 95, lastSync: "2026-07-08T09:12:00", description: "Мониторинг сети, скорость, аварии OLT" },
  { id: "sap", name: "SAP ERP", type: "ERP", status: "online", latencyMs: 460, lastSync: "2026-07-08T06:00:00", description: "CAPEX/OPEX, финансовый учёт" },
  { id: "oracle", name: "Oracle / Impala витрины", type: "БД", status: "online", latencyMs: 180, lastSync: "2026-07-08T09:00:00", description: "Аналитические витрины, квартальная отчётность" },
  { id: "postgres", name: "PostgreSQL", type: "БД", status: "online", latencyMs: 40, lastSync: "2026-07-08T09:14:00", description: "Конфигурация целевых показателей платформы" },
  { id: "kafka", name: "Kafka", type: "Шина данных", status: "offline", latencyMs: 0, lastSync: "2026-07-07T22:10:00", description: "Потоковая передача событий заказов и аварий" },
  { id: "restapi", name: "REST API «Тазарту»", type: "API", status: "online", latencyMs: 65, lastSync: "2026-07-08T09:15:00", description: "Единая точка доступа для внешних систем" },
];
