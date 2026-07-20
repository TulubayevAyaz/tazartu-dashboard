import { NextResponse } from "next/server";
import { parseDetailCsv } from "@/lib/swap/parseDetailCsv";
import { computeConstructionSummary } from "@/lib/swap/computeConstructionSummary";
import { SwapParseError } from "@/lib/swap/parseSummarySheet";
import { readDataset, saveDetail, saveComputedSummary } from "@/lib/swap/storage";

const MIN_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export async function POST() {
  try {
    const current = await readDataset();
    if (current.detailMeta) {
      const age = Date.now() - new Date(current.detailMeta.fetchedAt).getTime();
      if (age < MIN_REFRESH_INTERVAL_MS) {
        return NextResponse.json({
          ok: true,
          cached: true,
          detailMeta: current.detailMeta,
          totals: current.totals,
          categories: current.categories,
        });
      }
    }

    const url = process.env.SWAP_DETAIL_CSV_URL;
    if (!url) {
      return NextResponse.json(
        { ok: false, error: "Не настроен адрес источника данных по подрядчикам (SWAP_DETAIL_CSV_URL) — обратитесь к администратору сайта" },
        { status: 500 },
      );
    }
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `Не удалось получить данные из Google Таблицы (HTTP ${res.status})` },
        { status: 502 },
      );
    }
    const csvText = await res.text();
    const parsed = parseDetailCsv(csvText);
    await saveDetail(parsed);

    const computed = computeConstructionSummary(csvText);
    const dataset = await saveComputedSummary(computed);

    return NextResponse.json({
      ok: true,
      cached: false,
      detailMeta: dataset.detailMeta,
      totals: dataset.totals,
      categories: dataset.categories,
    });
  } catch (err) {
    const message = err instanceof SwapParseError ? err.message : "Не удалось разобрать данные по подрядчикам";
    if (!(err instanceof SwapParseError)) console.error("swap refresh-detail error", err);
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
