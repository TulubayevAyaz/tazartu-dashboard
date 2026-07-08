export interface RoleAccess {
  role: string;
  scope: string;
  sections: string[];
}

export const ROLE_ACCESS: RoleAccess[] = [
  { role: "Руководство дирекции", scope: "Все регионы", sections: ["Обзор", "Аналитика", "Экономика", "Проект", "Все разделы (только чтение)"] },
  { role: "Ответственный ОДТ", scope: "Свой регион", sections: ["Обзор региона", "Миграция", "DSLAM", "Заказы", "Материалы (свой регион)"] },
  { role: "Служба логистики", scope: "Все регионы", sections: ["Материалы", "Заказы (материалы)"] },
  { role: "Куратор подрядчиков", scope: "Свои подрядчики", sections: ["Заказы на переключение", "Персонал (бригады)"] },
  { role: "HR", scope: "Все регионы", sections: ["Персонал", "Экономика (ФОТ)"] },
];

export const AUDIT_LOG = [
  { id: "a1", user: "a.tulubaev@telecom.kz", action: "Экспорт отчёта «Экономика Q2 2026»", time: "2026-07-08T08:12:00" },
  { id: "a2", user: "odt.mangistau@telecom.kz", action: "Просмотр раздела «Заказы на переключение»", time: "2026-07-08T07:55:00" },
  { id: "a3", user: "logistics@telecom.kz", action: "Изменение норматива запаса: Сплиттер PLC 1x32", time: "2026-07-07T16:30:00" },
  { id: "a4", user: "hr.lead@telecom.kz", action: "Просмотр раздела «Персонал»", time: "2026-07-07T14:02:00" },
  { id: "a5", user: "admin@telecom.kz", action: "Вход в систему (SSO)", time: "2026-07-07T09:00:00" },
];

export const SECURITY_BADGES = ["RBAC", "JWT", "LDAP", "Active Directory", "Audit Log", "SSO", "HTTPS"];
