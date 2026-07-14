import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { parseSummarySheet, SwapParseError } from "@/lib/swap/parseSummarySheet";
import { saveSummary } from "@/lib/swap/storage";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const sheetName = formData.get("sheetName");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Файл не передан" }, { status: 400 });
    }
    if (typeof sheetName !== "string" || !sheetName) {
      return NextResponse.json({ ok: false, error: "Не выбран лист для загрузки" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
    const parsed = parseSummarySheet(workbook, sheetName);
    const dataset = await saveSummary(parsed, { sheetDateLabel: sheetName, sourceFileName: file.name });

    return NextResponse.json({ ok: true, meta: dataset.meta });
  } catch (err) {
    const message = err instanceof SwapParseError ? err.message : "Не удалось разобрать файл — проверьте, что это тот же формат экспорта, что и раньше";
    if (!(err instanceof SwapParseError)) console.error("swap upload error", err);
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
