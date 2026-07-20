import { getDb } from "./db";
import { EMPTY_SWAP_DATASET, type SwapDataset, type SwapTotals, type MetricSplit } from "@/lib/types/swap";
import type { ParsedSummary } from "./parseSummarySheet";
import type { ParsedDetail } from "./parseDetailCsv";
import type { ComputedConstructionSummary } from "./computeConstructionSummary";

const ZERO: MetricSplit = { total: 0, znk: 0, swap: 0 };
const sumSplit = (a: MetricSplit, b: MetricSplit): MetricSplit => ({
  total: a.total + b.total,
  znk: a.znk + b.znk,
  swap: a.swap + b.swap,
});
const subSplit = (a: MetricSplit, b: MetricSplit): MetricSplit => ({
  total: a.total - b.total,
  znk: a.znk - b.znk,
  swap: a.swap - b.swap,
});

function splitFromRow(row: Record<string, unknown>, prefix: string): MetricSplit {
  return {
    total: (row[`${prefix}_total`] as number) ?? 0,
    znk: (row[`${prefix}_znk`] as number) ?? 0,
    swap: (row[`${prefix}_swap`] as number) ?? 0,
  };
}

function splitParams(prefix: string, split: MetricSplit | undefined): Record<string, number | null> {
  return {
    [`${prefix}_total`]: split?.total ?? null,
    [`${prefix}_znk`]: split?.znk ?? null,
    [`${prefix}_swap`]: split?.swap ?? null,
  };
}

const SPLIT_COLUMNS = ["planbp", "plandup", "smr", "accepted", "delta"] as const;
const SPLIT_COLUMNS_WITH_SALES = [...SPLIT_COLUMNS, "sales"] as const;

function splitColumnList(prefixes: readonly string[]): string {
  return prefixes.flatMap((p) => [`${p}_total`, `${p}_znk`, `${p}_swap`]).join(", ");
}

function splitParamList(prefixes: readonly string[]): string {
  return prefixes.flatMap((p) => [`@${p}_total`, `@${p}_znk`, `@${p}_swap`]).join(", ");
}

export async function readDataset(): Promise<SwapDataset> {
  const db = getDb();

  const row = db.prepare("SELECT * FROM dataset WHERE id = 1").get() as Record<string, unknown> | undefined;

  const meta = row?.sheet_date_label
    ? {
        sheetDateLabel: row.sheet_date_label as string,
        sourceFileName: row.source_file_name as string,
        parsedAt: row.parsed_at as string,
      }
    : null;

  const detailMeta = row?.detail_fetched_at
    ? { fetchedAt: row.detail_fetched_at as string, objectCount: (row.detail_object_count as number) ?? 0 }
    : null;

  const totals =
    row && row.planbp_total !== null && row.planbp_total !== undefined
      ? {
          planBP: splitFromRow(row, "planbp"),
          planDUP: splitFromRow(row, "plandup"),
          smr: splitFromRow(row, "smr"),
          accepted: splitFromRow(row, "accepted"),
          delta: splitFromRow(row, "delta"),
          sales: splitFromRow(row, "sales"),
        }
      : null;

  const categories = (db.prepare("SELECT * FROM categories ORDER BY id").all() as Record<string, unknown>[]).map((r) => ({
    label: r.label as string,
    planBP: splitFromRow(r, "planbp"),
    planDUP: splitFromRow(r, "plandup"),
    smr: splitFromRow(r, "smr"),
    accepted: splitFromRow(r, "accepted"),
    delta: splitFromRow(r, "delta"),
  }));

  const monthly = (db.prepare("SELECT * FROM monthly ORDER BY id").all() as Record<string, unknown>[]).map((r) => ({
    month: r.month as string,
    monthIndex: r.month_index as number,
    year: r.year as number,
    method: r.method as "contract" | "own",
    planBP: splitFromRow(r, "planbp"),
    planDUP: splitFromRow(r, "plandup"),
    smr: splitFromRow(r, "smr"),
    accepted: splitFromRow(r, "accepted"),
    delta: splitFromRow(r, "delta"),
    sales: splitFromRow(r, "sales"),
  }));

  const contractors = (
    db.prepare("SELECT * FROM contractors ORDER BY planned_ports DESC").all() as Record<string, unknown>[]
  ).map((r) => ({
    contractor: r.contractor as string,
    plannedPorts: r.planned_ports as number,
    acceptedPorts: r.accepted_ports as number,
    remainingPorts: r.remaining_ports as number,
    progressPct: r.progress_pct as number,
    objectCount: r.object_count as number,
    topDelayReasons: JSON.parse((r.top_delay_reasons_json as string) ?? "[]"),
    projects: JSON.parse((r.projects_json as string) ?? "[]"),
    cities: JSON.parse((r.cities_json as string) ?? "[]"),
  }));

  const regions = (db.prepare("SELECT * FROM regions ORDER BY planned_ports DESC").all() as Record<string, unknown>[]).map(
    (r) => ({
      region: r.region as string,
      plannedPorts: r.planned_ports as number,
      acceptedPorts: r.accepted_ports as number,
      progressPct: r.progress_pct as number,
    }),
  );

  const projects = (db.prepare("SELECT name FROM projects ORDER BY name").all() as Record<string, unknown>[]).map(
    (r) => r.name as string,
  );

  const topDelayReasons = (
    db.prepare("SELECT reason, count FROM top_delay_reasons ORDER BY rank").all() as Record<string, unknown>[]
  ).map((r) => ({ reason: r.reason as string, count: r.count as number }));

  const warnings = (db.prepare("SELECT message FROM warnings ORDER BY id").all() as Record<string, unknown>[]).map(
    (r) => r.message as string,
  );

  if (!row) return EMPTY_SWAP_DATASET;

  return { meta, detailMeta, totals, categories, monthly, contractors, regions, projects, topDelayReasons, warnings };
}

function upsertDataset(dataset: SwapDataset) {
  const db = getDb();
  db.prepare(
    `INSERT INTO dataset (
      id, sheet_date_label, source_file_name, parsed_at, detail_fetched_at, detail_object_count,
      ${splitColumnList(SPLIT_COLUMNS_WITH_SALES)}
    ) VALUES (
      1, @sheet_date_label, @source_file_name, @parsed_at, @detail_fetched_at, @detail_object_count,
      ${splitParamList(SPLIT_COLUMNS_WITH_SALES)}
    )
    ON CONFLICT(id) DO UPDATE SET
      sheet_date_label = excluded.sheet_date_label,
      source_file_name = excluded.source_file_name,
      parsed_at = excluded.parsed_at,
      detail_fetched_at = excluded.detail_fetched_at,
      detail_object_count = excluded.detail_object_count,
      ${SPLIT_COLUMNS_WITH_SALES.flatMap((p) => [
        `${p}_total = excluded.${p}_total`,
        `${p}_znk = excluded.${p}_znk`,
        `${p}_swap = excluded.${p}_swap`,
      ]).join(", ")}`,
  ).run({
    sheet_date_label: dataset.meta?.sheetDateLabel ?? null,
    source_file_name: dataset.meta?.sourceFileName ?? null,
    parsed_at: dataset.meta?.parsedAt ?? null,
    detail_fetched_at: dataset.detailMeta?.fetchedAt ?? null,
    detail_object_count: dataset.detailMeta?.objectCount ?? null,
    ...splitParams("planbp", dataset.totals?.planBP),
    ...splitParams("plandup", dataset.totals?.planDUP),
    ...splitParams("smr", dataset.totals?.smr),
    ...splitParams("accepted", dataset.totals?.accepted),
    ...splitParams("delta", dataset.totals?.delta),
    ...splitParams("sales", dataset.totals?.sales),
  });
}

function replaceCategories(categories: SwapDataset["categories"]) {
  const db = getDb();
  db.prepare("DELETE FROM categories").run();
  const insert = db.prepare(
    `INSERT INTO categories (label, ${splitColumnList(SPLIT_COLUMNS)}) VALUES (@label, ${splitParamList(SPLIT_COLUMNS)})`,
  );
  for (const c of categories) {
    insert.run({
      label: c.label,
      ...splitParams("planbp", c.planBP),
      ...splitParams("plandup", c.planDUP),
      ...splitParams("smr", c.smr),
      ...splitParams("accepted", c.accepted),
      ...splitParams("delta", c.delta),
    });
  }
}

function replaceMonthly(monthly: SwapDataset["monthly"]) {
  const db = getDb();
  db.prepare("DELETE FROM monthly").run();
  const insert = db.prepare(
    `INSERT INTO monthly (month, month_index, year, method, ${splitColumnList(SPLIT_COLUMNS_WITH_SALES)})
     VALUES (@month, @month_index, @year, @method, ${splitParamList(SPLIT_COLUMNS_WITH_SALES)})`,
  );
  for (const m of monthly) {
    insert.run({
      month: m.month,
      month_index: m.monthIndex,
      year: m.year,
      method: m.method,
      ...splitParams("planbp", m.planBP),
      ...splitParams("plandup", m.planDUP),
      ...splitParams("smr", m.smr),
      ...splitParams("accepted", m.accepted),
      ...splitParams("delta", m.delta),
      ...splitParams("sales", m.sales),
    });
  }
}

function replaceContractors(contractors: SwapDataset["contractors"]) {
  const db = getDb();
  db.prepare("DELETE FROM contractors").run();
  const insert = db.prepare(
    `INSERT INTO contractors (contractor, planned_ports, accepted_ports, remaining_ports, progress_pct, object_count, top_delay_reasons_json, projects_json, cities_json)
     VALUES (@contractor, @planned_ports, @accepted_ports, @remaining_ports, @progress_pct, @object_count, @top_delay_reasons_json, @projects_json, @cities_json)`,
  );
  for (const c of contractors) {
    insert.run({
      contractor: c.contractor,
      planned_ports: c.plannedPorts,
      accepted_ports: c.acceptedPorts,
      remaining_ports: c.remainingPorts,
      progress_pct: c.progressPct,
      object_count: c.objectCount,
      top_delay_reasons_json: JSON.stringify(c.topDelayReasons),
      projects_json: JSON.stringify(c.projects),
      cities_json: JSON.stringify(c.cities),
    });
  }
}

function replaceRegions(regions: SwapDataset["regions"]) {
  const db = getDb();
  db.prepare("DELETE FROM regions").run();
  const insert = db.prepare(
    "INSERT INTO regions (region, planned_ports, accepted_ports, progress_pct) VALUES (@region, @planned_ports, @accepted_ports, @progress_pct)",
  );
  for (const r of regions) {
    insert.run({ region: r.region, planned_ports: r.plannedPorts, accepted_ports: r.acceptedPorts, progress_pct: r.progressPct });
  }
}

function replaceProjects(projects: SwapDataset["projects"]) {
  const db = getDb();
  db.prepare("DELETE FROM projects").run();
  const insert = db.prepare("INSERT OR IGNORE INTO projects (name) VALUES (?)");
  for (const p of projects) insert.run(p);
}

function replaceTopDelayReasons(reasons: SwapDataset["topDelayReasons"]) {
  const db = getDb();
  db.prepare("DELETE FROM top_delay_reasons").run();
  const insert = db.prepare("INSERT INTO top_delay_reasons (reason, count, rank) VALUES (@reason, @count, @rank)");
  reasons.forEach((r, i) => insert.run({ reason: r.reason, count: r.count, rank: i }));
}

function replaceWarnings(warnings: SwapDataset["warnings"]) {
  const db = getDb();
  db.prepare("DELETE FROM warnings").run();
  const insert = db.prepare("INSERT INTO warnings (message) VALUES (?)");
  for (const w of warnings) insert.run(w);
}

async function persist(dataset: SwapDataset) {
  const db = getDb();
  const previous = await readDataset();

  const tx = db.transaction(() => {
    if (previous.meta || previous.detailMeta) {
      db.prepare("INSERT INTO snapshot_history (snapshot_json, created_at) VALUES (?, ?)").run(
        JSON.stringify(previous),
        new Date().toISOString(),
      );
    }
    upsertDataset(dataset);
    replaceCategories(dataset.categories);
    replaceMonthly(dataset.monthly);
    replaceContractors(dataset.contractors);
    replaceRegions(dataset.regions);
    replaceProjects(dataset.projects);
    replaceTopDelayReasons(dataset.topDelayReasons);
    replaceWarnings(dataset.warnings);
  });
  tx();
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
    topDelayReasons: parsed.topDelayReasons,
  };
  await persist(dataset);
  return dataset;
}

const ROLLUP_LABEL = "Стройка ДУП";
const ROLLUP_PARTS = ["В рамках СКП ГТС", "Прочие проекты"];

// Автоматически посчитанные СМР/Принято/Приёмо-сдаточный по категориям (см. computeConstructionSummary.ts)
// сливаются с уже сохранённым Планом БП/ДУП (он не выводится из detail-CSV, вводится отдельно xlsx-загрузкой)
// и с категорией "СКП СТС хоз.способ" (тоже не выводится из detail-CSV, остаётся ручной).
export async function saveComputedSummary(computed: ComputedConstructionSummary) {
  const current = await readDataset();

  const mergedCategories = [...current.categories];
  for (const cat of computed.categories) {
    const i = mergedCategories.findIndex((c) => c.label === cat.label);
    if (i === -1) {
      mergedCategories.push(cat);
    } else {
      mergedCategories[i] = { ...mergedCategories[i], smr: cat.smr, accepted: cat.accepted, delta: cat.delta };
    }
  }

  const rollupParts = ROLLUP_PARTS.map((label) => mergedCategories.find((c) => c.label === label));
  if (rollupParts.every(Boolean)) {
    const [a, b] = rollupParts as [(typeof mergedCategories)[number], (typeof mergedCategories)[number]];
    const rollup = {
      label: ROLLUP_LABEL,
      planBP: sumSplit(a.planBP, b.planBP),
      planDUP: sumSplit(a.planDUP, b.planDUP),
      smr: sumSplit(a.smr, b.smr),
      accepted: sumSplit(a.accepted, b.accepted),
      delta: sumSplit(a.delta, b.delta),
    };
    const i = mergedCategories.findIndex((c) => c.label === ROLLUP_LABEL);
    if (i === -1) mergedCategories.push(rollup);
    else mergedCategories[i] = rollup;
  }

  const hoz = mergedCategories.find((c) => c.label === "СКП СТС хоз.способ");
  const autoSmr = computed.categories.reduce((acc, c) => sumSplit(acc, c.smr), ZERO);
  const autoAccepted = computed.categories.reduce((acc, c) => sumSplit(acc, c.accepted), ZERO);
  const grandSmr = sumSplit(autoSmr, hoz?.smr ?? ZERO);
  const grandAccepted = sumSplit(autoAccepted, hoz?.accepted ?? ZERO);
  const grandDelta = subSplit(grandSmr, grandAccepted);

  const totals: SwapTotals = {
    planBP: current.totals?.planBP ?? ZERO,
    planDUP: current.totals?.planDUP ?? ZERO,
    sales: current.totals?.sales ?? ZERO,
    smr: grandSmr,
    accepted: grandAccepted,
    delta: grandDelta,
  };

  const mergedMonthly = [...current.monthly];
  for (const point of computed.monthly) {
    const i = mergedMonthly.findIndex(
      (m) => m.year === point.year && m.monthIndex === point.monthIndex && m.method === point.method,
    );
    if (i === -1) {
      mergedMonthly.push(point);
    } else {
      mergedMonthly[i] = { ...mergedMonthly[i], smr: point.smr, accepted: point.accepted, delta: point.delta };
    }
  }

  const dataset: SwapDataset = { ...current, totals, categories: mergedCategories, monthly: mergedMonthly };
  await persist(dataset);
  return dataset;
}

// "Стереть данные" чистит только то, что приходит из детализации/CSV (реестр подрядчиков, детализация,
// подкатегории СМР/Принято) — но НЕ трогает План БП/ДУП, потому что он берётся не из этой таблицы и
// меняется примерно раз в год. После очистки "Обновить по подрядчикам" сам восстановит СМР/Принято.
export async function clearDataset() {
  const current = await readDataset();
  const dataset: SwapDataset = {
    ...EMPTY_SWAP_DATASET,
    meta: current.meta,
    totals: current.totals ? { ...current.totals, smr: ZERO, accepted: ZERO, delta: ZERO } : null,
    categories: current.categories.map((c) => ({ ...c, smr: ZERO, accepted: ZERO, delta: ZERO })),
  };
  await persist(dataset);
  return dataset;
}
