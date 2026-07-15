export interface MetricSplit {
  total: number;
  znk: number;
  swap: number;
}

export interface SwapTotals {
  planBP: MetricSplit;
  planDUP: MetricSplit;
  smr: MetricSplit;
  accepted: MetricSplit;
  delta: MetricSplit;
  sales: MetricSplit;
}

export interface SwapCategoryRow {
  label: string;
  planBP: MetricSplit;
  planDUP: MetricSplit;
  smr: MetricSplit;
  accepted: MetricSplit;
  delta: MetricSplit;
}

export type SwapMethod = "contract" | "own";

export interface SwapMonthPoint {
  month: string;
  monthIndex: number;
  year: number;
  method: SwapMethod;
  planBP: MetricSplit;
  planDUP: MetricSplit;
  smr: MetricSplit;
  accepted: MetricSplit;
  delta: MetricSplit;
  sales: MetricSplit;
}

export interface SwapSnapshotMeta {
  sheetDateLabel: string;
  parsedAt: string;
  sourceFileName: string;
}

export interface DelayReasonCount {
  reason: string;
  count: number;
}

export interface ContractorRow {
  contractor: string;
  plannedPorts: number;
  acceptedPorts: number;
  remainingPorts: number;
  progressPct: number;
  objectCount: number;
  topDelayReasons: DelayReasonCount[];
  projects: string[];
  cities: string[];
}

export interface RegionSwitchRow {
  region: string;
  plannedPorts: number;
  acceptedPorts: number;
  progressPct: number;
}

export interface SwapFilters {
  project?: string;
  category?: string;
  year?: number;
  month?: number;
  region?: string;
  settlement?: string;
}

export interface SwapDetailMeta {
  fetchedAt: string;
  objectCount: number;
}

export interface SwapDataset {
  meta: SwapSnapshotMeta | null;
  detailMeta: SwapDetailMeta | null;
  totals: SwapTotals | null;
  categories: SwapCategoryRow[];
  monthly: SwapMonthPoint[];
  contractors: ContractorRow[];
  regions: RegionSwitchRow[];
  projects: string[];
  topDelayReasons: DelayReasonCount[];
  warnings: string[];
}

export const EMPTY_SWAP_DATASET: SwapDataset = {
  meta: null,
  detailMeta: null,
  totals: null,
  categories: [],
  monthly: [],
  contractors: [],
  regions: [],
  projects: [],
  topDelayReasons: [],
  warnings: [],
};
