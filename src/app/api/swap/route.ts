import { NextResponse } from "next/server";
import { readDataset } from "@/lib/swap/storage";

export async function GET() {
  const dataset = await readDataset();
  return NextResponse.json(dataset);
}
