import { NextResponse } from "next/server";
import { clearDataset } from "@/lib/swap/storage";

export async function POST() {
  try {
    await clearDataset();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("swap clear error", err);
    return NextResponse.json({ ok: false, error: "Не удалось очистить данные" }, { status: 500 });
  }
}
