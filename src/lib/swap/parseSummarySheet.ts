import * as XLSX from "xlsx";
import type { MetricSplit, SwapCategoryRow, SwapMethod, SwapMonthPoint, SwapTotals } from "@/lib/types/swap";

export class SwapParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SwapParseError";
  }
}

type Cell = string | number | Date | null;
type Row = Cell[];

const MONTH_LABELS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

function num(v: Cell | undefined): number {
  return typeof v === "number" ? v : 0;
}

function readSplit(row: Row, startCol: number): MetricSplit {
  return { total: num(row[startCol]), znk: num(row[startCol + 1]), swap: num(row[startCol + 2]) };
}

function rowToTotals(row: Row): SwapTotals {
  return {
    planBP: readSplit(row, 1),
    planDUP: readSplit(row, 4),
    smr: readSplit(row, 7),
    accepted: readSplit(row, 10),
    delta: readSplit(row, 13),
    sales: readSplit(row, 17),
  };
}

function rowToCategory(row: Row): SwapCategoryRow {
  return {
    label: String(row[0] ?? "").trim(),
    planBP: readSplit(row, 1),
    planDUP: readSplit(row, 4),
    smr: readSplit(row, 7),
    accepted: readSplit(row, 10),
    delta: readSplit(row, 13),
  };
}

function isDateCell(v: Cell): v is Date {
  return v instanceof Date;
}

function isBlankRow(row: Row | undefined): boolean {
  if (!row) return true;
  return row.every((c) => c === null || c === undefined || c === "");
}

export interface ParsedSummary {
  totals: SwapTotals;
  categories: SwapCategoryRow[];
  monthly: SwapMonthPoint[];
}

export function listSheetNames(workbook: XLSX.WorkBook): string[] {
  return workbook.SheetNames;
}

export function isLikelySummarySheet(name: string): boolean {
  return /^\d{2}\.\d{2}\.\d{4}/.test(name.trim());
}

export function parseSummarySheet(workbook: XLSX.WorkBook, sheetName: string): ParsedSummary {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) throw new SwapParseError(`Лист "${sheetName}" не найден в файле`);

  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true, defval: null }) as Row[];

  // The date-label row ("на ДД.ММ.ГГГГ") is only present when a sheet stacks multiple
  // snapshot blocks (older exports start straight at the "ФАКТ" header, no label row).
  const dateLabelIdx = rows.findIndex((r) => typeof r[0] === "string" && /^на\s+\d{2}\.\d{2}\.\d{4}/.test(r[0] as string));
  const headerRowIdx = dateLabelIdx !== -1 ? dateLabelIdx + 1 : rows.findIndex((r) => r[0] === "ФАКТ");
  if (headerRowIdx === -1 || rows[headerRowIdx]?.[0] !== "ФАКТ") {
    throw new SwapParseError('Не найдена строка-заголовок "ФАКТ" — структура листа не распознана');
  }

  const dataStartIdx = headerRowIdx + 3;

  // Seen spelled both "месяцев" and "месяцов" across real exports — match the stable prefix.
  const monthsSectionIdx = rows.findIndex((r) => typeof r[0] === "string" && /^в разрезе месяц/.test(r[0] as string));
  const nextSnapshotIdx = rows.findIndex(
    (r, i) => i > headerRowIdx && typeof r[0] === "string" && /^на\s+\d{2}\.\d{2}\.\d{4}/.test(r[0] as string),
  );
  const blockEndCandidates = [monthsSectionIdx, nextSnapshotIdx, rows.length].filter((v) => v !== -1);
  const blockEnd = Math.min(...blockEndCandidates);

  const yearRows: { idx: number; year: number }[] = [];
  for (let i = dataStartIdx; i < blockEnd; i++) {
    const cell = rows[i]?.[0];
    if (typeof cell === "string") {
      const m = cell.match(/^(\d{4})\s*год$/);
      if (m) yearRows.push({ idx: i, year: Number(m[1]) });
    }
  }
  if (yearRows.length === 0) {
    throw new SwapParseError('Не найдена итоговая строка года (например "2026 год") после заголовка таблицы');
  }
  const latestYear = yearRows.reduce((a, b) => (b.year > a.year ? b : a));
  const totals = rowToTotals(rows[latestYear.idx]);

  const nextYearIdx = yearRows.find((y) => y.idx > latestYear.idx)?.idx ?? blockEnd;
  const categories: SwapCategoryRow[] = [];
  for (let i = latestYear.idx + 1; i < Math.min(nextYearIdx, blockEnd); i++) {
    const row = rows[i];
    if (isBlankRow(row)) break;
    categories.push(rowToCategory(row));
  }

  let monthly: SwapMonthPoint[] = [];
  if (monthsSectionIdx !== -1) {
    const contractIdx = rows.findIndex((r, i) => i > monthsSectionIdx && r[0] === "Подрядный способ");
    const ownIdx = rows.findIndex((r, i) => i > monthsSectionIdx && r[0] === "Хоз.Способ");
    if (contractIdx === -1) {
      throw new SwapParseError('Не найден подраздел "Подрядный способ" в разделе "в разрезе месяцев"');
    }

    const parseMonthlyBlock = (startIdx: number, method: SwapMethod, endIdx: number): SwapMonthPoint[] => {
      const points: SwapMonthPoint[] = [];
      for (let i = startIdx + 2; i < endIdx; i++) {
        const row = rows[i];
        if (isBlankRow(row) || !isDateCell(row[0])) continue;
        const d = row[0] as Date;
        points.push({
          month: MONTH_LABELS[d.getMonth()],
          monthIndex: d.getMonth() + 1,
          year: d.getFullYear(),
          method,
          planBP: readSplit(row, 1),
          planDUP: readSplit(row, 4),
          smr: readSplit(row, 7),
          accepted: readSplit(row, 10),
          delta: readSplit(row, 13),
          sales: readSplit(row, 17),
        });
      }
      return points;
    };

    const contractEnd = ownIdx !== -1 ? ownIdx : rows.length;
    monthly = [...parseMonthlyBlock(contractIdx, "contract", contractEnd)];
    if (ownIdx !== -1) monthly.push(...parseMonthlyBlock(ownIdx, "own", rows.length));
  }

  return { totals, categories, monthly };
}
