export type ClientStatus = "migrated" | "scheduled" | "refused" | "in_progress";

export interface ClientHistoryEvent {
  date: string;
  event: string;
  system: "CRM" | "WFM" | "Track&Trace" | "Remedy";
}

export interface ClientRecord {
  iin: string;
  fullName: string;
  phone: string;
  account: string;
  address: string;
  regionId: string;
  services: string[];
  speedBefore: string;
  speedAfter: string | null;
  onu: string | null;
  mac: string | null;
  status: ClientStatus;
  refusalReason: string | null;
  installer: string | null;
  history: ClientHistoryEvent[];
}

export const CLIENTS: ClientRecord[] = [
  {
    iin: "890215300145",
    fullName: "Ахметов Ерлан Болатович",
    phone: "+7 701 234 5612",
    account: "AL-0042118",
    address: "г. Алматы, мкр. Аксай-3А, д. 12, кв. 45",
    regionId: "almaty",
    services: ["Интернет", "IPTV", "Городской телефон"],
    speedBefore: "24 Мбит/с (ADSL)",
    speedAfter: "150 Мбит/с (GPON)",
    onu: "ONU-88213377",
    mac: "AC:DE:48:11:22:33",
    status: "migrated",
    refusalReason: null,
    installer: "Бригада №1 «Алатау» — А. Серіков",
    history: [
      { date: "2026-03-02", event: "Заявка на переключение создана", system: "CRM" },
      { date: "2026-03-05", event: "Наряд назначен монтёру", system: "WFM" },
      { date: "2026-03-07", event: "Монтаж ONU выполнен, GPON активен", system: "Track&Trace" },
      { date: "2026-03-07", event: "Тикет закрыт", system: "Remedy" },
    ],
  },
  {
    iin: "751030401223",
    fullName: "Ибраева Салтанат Нурлановна",
    phone: "+7 707 555 8821",
    account: "AS-0118872",
    address: "г. Астана, пр. Туран, д. 55, кв. 12",
    regionId: "astana",
    services: ["Интернет", "IPTV"],
    speedBefore: "16 Мбит/с (ADSL)",
    speedAfter: null,
    onu: null,
    mac: null,
    status: "scheduled",
    refusalReason: null,
    installer: null,
    history: [
      { date: "2026-07-01", event: "Заявка на переключение создана", system: "CRM" },
      { date: "2026-07-03", event: "Наряд запланирован на 2026-07-11", system: "WFM" },
    ],
  },
  {
    iin: "820512350067",
    fullName: "Тулегенов Дамир Асхатович",
    phone: "+7 705 112 4470",
    account: "SH-0037765",
    address: "г. Шымкент, ул. Кабанбай батыра, д. 8",
    regionId: "shymkent",
    services: ["Интернет"],
    speedBefore: "8 Мбит/с (ADSL)",
    speedAfter: null,
    onu: null,
    mac: null,
    status: "refused",
    refusalReason: "Отказ абонента: не устраивает необходимость установки внешнего бокса",
    installer: "Бригада №1 «Оңтүстік» — Б. Қасымов",
    history: [
      { date: "2026-05-18", event: "Заявка на переключение создана", system: "CRM" },
      { date: "2026-05-22", event: "Выезд монтёра, отказ абонента на месте", system: "Track&Trace" },
      { date: "2026-05-22", event: "Тикет закрыт с причиной отказа", system: "Remedy" },
    ],
  },
  {
    iin: "930701250891",
    fullName: "Жумабекова Айгерим Серикбаевна",
    phone: "+7 700 998 1123",
    account: "MG-0009214",
    address: "г. Актау, 5 мкр., д. 21, кв. 3",
    regionId: "mangistau",
    services: ["Интернет", "IPTV", "Городской телефон"],
    speedBefore: "12 Мбит/с (ADSL)",
    speedAfter: null,
    onu: null,
    mac: null,
    status: "in_progress",
    refusalReason: null,
    installer: "Бригада №1 «Маңғыстау» — Н. Досанов",
    history: [
      { date: "2026-06-28", event: "Заявка на переключение создана", system: "CRM" },
      { date: "2026-07-02", event: "Наряд назначен монтёру", system: "WFM" },
      { date: "2026-07-06", event: "Монтаж перенесён: нет материала (сплиттер 1x32)", system: "Track&Trace" },
    ],
  },
  {
    iin: "880822400312",
    fullName: "Смагулов Тимур Ержанович",
    phone: "+7 747 334 9902",
    account: "KA-0055310",
    address: "г. Караганда, ул. Ерубаева, д. 44",
    regionId: "karaganda",
    services: ["Интернет", "IPTV"],
    speedBefore: "20 Мбит/с (VDSL)",
    speedAfter: "150 Мбит/с (GPON)",
    onu: "ONU-88220145",
    mac: "AC:DE:48:22:10:04",
    status: "migrated",
    refusalReason: null,
    installer: "Бригада №1 «Сарыарка-Кен» — Р. Ахметов",
    history: [
      { date: "2026-02-11", event: "Заявка на переключение создана", system: "CRM" },
      { date: "2026-02-14", event: "Монтаж ONU выполнен, GPON активен", system: "Track&Trace" },
      { date: "2026-02-14", event: "Тикет закрыт", system: "Remedy" },
    ],
  },
];

export function searchClients(query: string): ClientRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return CLIENTS.filter((c) =>
    [c.iin, c.phone, c.account, c.address, c.onu, c.mac, c.fullName]
      .filter(Boolean)
      .some((field) => (field as string).toLowerCase().includes(q)),
  );
}
