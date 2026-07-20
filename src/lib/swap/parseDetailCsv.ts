import type { ContractorRow, DelayReasonCount, RegionSwitchRow } from "@/lib/types/swap";
import { SwapParseError } from "./parseSummarySheet";

const COL = {
  contractor: "Подрядчик (ДУП)",
  project: "Наименование проекта",
  region: "Область (ДРТР)",
  city: "Город (ДРТР)",
  plannedPorts: "Кол-во портов (ДРТР)",
  acceptedPorts: "Кол-во фактически принятых в эксплуатацию портов (ОДС)",
  reason: "Причина исключения/замена (ДРТР)",
};

export interface ParsedDetail {
  contractors: ContractorRow[];
  regions: RegionSwitchRow[];
  projects: string[];
  topDelayReasons: DelayReasonCount[];
  objectCount: number;
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  const n = text.length;
  while (i < n) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (c === "\r") {
      i++;
      continue;
    }
    if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
      continue;
    }
    field += c;
    i++;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function toNumber(v: string | undefined): number {
  if (!v) return 0;
  const cleaned = v.replace(/\s/g, "").replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export function parseDetailCsv(csvText: string): ParsedDetail {
  const records = parseCsv(csvText).filter((r) => !(r.length === 1 && r[0] === ""));
  if (records.length < 2) {
    throw new SwapParseError("Файл детализации по объектам пуст или не распознан");
  }

  const header = records[0].map((h) => h.trim());
  const idx = (name: string) => header.indexOf(name);

  const idxContractor = idx(COL.contractor);
  const idxProject = idx(COL.project);
  const idxRegion = idx(COL.region);
  const idxPlanned = idx(COL.plannedPorts);
  const idxAccepted = idx(COL.acceptedPorts);
  const idxReason = idx(COL.reason);
  const idxCity = idx(COL.city);

  const missing = ([[COL.contractor, idxContractor], [COL.region, idxRegion], [COL.plannedPorts, idxPlanned]] as const)
    .filter(([, i]) => i === -1)
    .map(([name]) => name);
  if (missing.length > 0) {
    throw new SwapParseError(`В файле детализации отсутствуют ожидаемые колонки: ${missing.join(", ")}`);
  }

  const dataRows = records.slice(1).filter((r) => (r[idxContractor] ?? "").trim() !== "");

  const contractorMap = new Map<
    string,
    {
      planned: number;
      accepted: number;
      count: number;
      reasons: Map<string, number>;
      projects: Set<string>;
      cities: Map<string, number>;
    }
  >();
  const regionMap = new Map<string, { planned: number; accepted: number }>();
  const projects = new Set<string>();
  const globalReasons = new Map<string, number>();

  for (const r of dataRows) {
    const contractor = (r[idxContractor] ?? "").trim() || "Не указан";
    const region = (r[idxRegion] ?? "").trim() || "Не указан";
    const planned = toNumber(r[idxPlanned]);
    const accepted = idxAccepted !== -1 ? toNumber(r[idxAccepted]) : 0;
    const reason = idxReason !== -1 ? (r[idxReason] ?? "").trim() : "";
    const project = idxProject !== -1 ? (r[idxProject] ?? "").trim() : "";
    const city = idxCity !== -1 ? (r[idxCity] ?? "").trim() : "";
    if (project) projects.add(project);

    if (!contractorMap.has(contractor)) {
      contractorMap.set(contractor, { planned: 0, accepted: 0, count: 0, reasons: new Map(), projects: new Set(), cities: new Map() });
    }
    const c = contractorMap.get(contractor)!;
    c.planned += planned;
    c.accepted += accepted;
    c.count += 1;
    if (reason) {
      c.reasons.set(reason, (c.reasons.get(reason) ?? 0) + 1);
      globalReasons.set(reason, (globalReasons.get(reason) ?? 0) + 1);
    }
    if (project) c.projects.add(project);
    if (city) c.cities.set(city, (c.cities.get(city) ?? 0) + 1);

    if (!regionMap.has(region)) regionMap.set(region, { planned: 0, accepted: 0 });
    const rg = regionMap.get(region)!;
    rg.planned += planned;
    rg.accepted += accepted;
  }

  const contractors: ContractorRow[] = [...contractorMap.entries()]
    .map(([contractor, v]) => ({
      contractor,
      plannedPorts: v.planned,
      acceptedPorts: v.accepted,
      remainingPorts: v.planned - v.accepted,
      progressPct: v.planned > 0 ? (v.accepted / v.planned) * 100 : 0,
      objectCount: v.count,
      topDelayReasons: [...v.reasons.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([reason, count]) => ({ reason, count })),
      projects: [...v.projects].sort(),
      cities: [...v.cities.entries()].sort((a, b) => b[1] - a[1]).map(([city]) => city),
    }))
    .sort((a, b) => b.plannedPorts - a.plannedPorts);

  const regions: RegionSwitchRow[] = [...regionMap.entries()]
    .map(([region, v]) => ({
      region,
      plannedPorts: v.planned,
      acceptedPorts: v.accepted,
      progressPct: v.planned > 0 ? (v.accepted / v.planned) * 100 : 0,
    }))
    .sort((a, b) => b.plannedPorts - a.plannedPorts);

  const topDelayReasons: DelayReasonCount[] = [...globalReasons.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([reason, count]) => ({ reason, count }));

  return { contractors, regions, projects: [...projects].sort(), topDelayReasons, objectCount: dataRows.length };
}
