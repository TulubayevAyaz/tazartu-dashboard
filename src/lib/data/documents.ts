export interface ProjectDocument {
  id: string;
  title: string;
  category: "Регламент" | "Инструкция" | "Презентация" | "Протокол";
  updatedAt: string;
  owner: string;
  sizeKb: number;
}

export const DOCUMENTS: ProjectDocument[] = [
  { id: "d1", title: "Регламент миграции абонентов медь → GPON", category: "Регламент", updatedAt: "2026-05-14", owner: "Проектный офис", sizeKb: 812 },
  { id: "d2", title: "Инструкция по монтажу ONU для подрядчиков", category: "Инструкция", updatedAt: "2026-06-02", owner: "Дирекция сети", sizeKb: 2340 },
  { id: "d3", title: "Протокол защиты бюджета Q2 2026", category: "Протокол", updatedAt: "2026-06-30", owner: "Финансовая дирекция", sizeKb: 540 },
  { id: "d4", title: "Презентация статуса программы для СД", category: "Презентация", updatedAt: "2026-07-05", owner: "Big Data / Дирекция произв. эффективности", sizeKb: 6100 },
  { id: "d5", title: "Регламент демонтажа DSLAM-станций", category: "Регламент", updatedAt: "2026-04-22", owner: "Дирекция сети", sizeKb: 690 },
  { id: "d6", title: "Инструкция по работе с Track&Trace для монтёров", category: "Инструкция", updatedAt: "2026-03-11", owner: "ИТ", sizeKb: 1180 },
  { id: "d7", title: "Протокол совещания по рискам Мангистау", category: "Протокол", updatedAt: "2026-07-02", owner: "Проектный офис", sizeKb: 230 },
  { id: "d8", title: "Презентация экономического эффекта программы", category: "Презентация", updatedAt: "2026-06-18", owner: "Big Data / Дирекция произв. эффективности", sizeKb: 4800 },
  { id: "d9", title: "Норматив запасов материалов (30/60 дней)", category: "Регламент", updatedAt: "2026-05-30", owner: "Служба логистики", sizeKb: 410 },
];
