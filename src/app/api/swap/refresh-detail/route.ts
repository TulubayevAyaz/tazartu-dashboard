import { NextResponse } from "next/server";
import { parseDetailCsv } from "@/lib/swap/parseDetailCsv";
import { SwapParseError } from "@/lib/swap/parseSummarySheet";
import { saveDetail } from "@/lib/swap/storage";

export async function POST() {
  try {
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
    const dataset = await saveDetail(parsed);

    return NextResponse.json({ ok: true, detailMeta: dataset.detailMeta });
  } catch (err) {
    const message = err instanceof SwapParseError ? err.message : "Не удалось разобрать данные по подрядчикам";
    if (!(err instanceof SwapParseError)) console.error("swap refresh-detail error", err);
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
