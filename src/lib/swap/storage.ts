import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { EMPTY_SWAP_DATASET, type SwapDataset } from "@/lib/types/swap";
import type { ParsedSummary } from "./parseSummarySheet";
import type { ParsedDetail } from "./parseDetailCsv";

const DATA_DIR = path.join(process.cwd(), "data");
const LATEST_PATH = path.join(DATA_DIR, "swap-latest.json");
const HISTORY_DIR = path.join(DATA_DIR, "swap-history");

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

export async function readDataset(): Promise<SwapDataset> {
  try {
    const raw = await readFile(LATEST_PATH, "utf-8");
    return { ...EMPTY_SWAP_DATASET, ...(JSON.parse(raw) as SwapDataset) };
  } catch {
    return EMPTY_SWAP_DATASET;
  }
}

async function persist(dataset: SwapDataset) {
  await ensureDataDir();
  const existing = await readFile(LATEST_PATH, "utf-8").catch(() => null);
  if (existing) {
    await mkdir(HISTORY_DIR, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    await writeFile(path.join(HISTORY_DIR, `${stamp}.json`), existing, "utf-8");
  }
  await writeFile(LATEST_PATH, JSON.stringify(dataset, null, 2), "utf-8");
}

export async function saveSummary(parsed: ParsedSummary, meta: { sheetDateLabel: string; sourceFileName: string }) {
  const current = await readDataset();
  const dataset: SwapDataset = {
    ...current,
    meta: {
      sheetDateLabel: meta.sheetDateLabel,
      sourceFileName: meta.sourceFileName,
      parsedAt: new Date().toISOString(),
    },
    totals: parsed.totals,
    categories: parsed.categories,
    monthly: parsed.monthly,
    warnings: [],
  };
  await persist(dataset);
  return dataset;
}

export async function saveDetail(parsed: ParsedDetail) {
  const current = await readDataset();
  const dataset: SwapDataset = {
    ...current,
    detailMeta: { fetchedAt: new Date().toISOString(), objectCount: parsed.objectCount },
    contractors: parsed.contractors,
    regions: parsed.regions,
    projects: parsed.projects,
  };
  await persist(dataset);
  return dataset;
}

export async function clearDataset() {
  await persist(EMPTY_SWAP_DATASET);
  return EMPTY_SWAP_DATASET;
}
