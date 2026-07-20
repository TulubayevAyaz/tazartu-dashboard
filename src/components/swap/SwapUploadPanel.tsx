"use client";

import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, CheckCircle2, XCircle, RefreshCw, FileSpreadsheet, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useUploadSwapFile, useRefreshSwapDetail, useClearSwapData } from "@/lib/swap/useSwapData";
import { isLikelySummarySheet } from "@/lib/swap/parseSummarySheet";
import type { SwapDetailMeta, SwapSnapshotMeta } from "@/lib/types/swap";

type Status = "idle" | "picked" | "uploading" | "success" | "error";

export function SwapUploadPanel({ meta, detailMeta }: { meta: SwapSnapshotMeta | null; detailMeta: SwapDetailMeta | null }) {
  const [file, setFile] = useState<File | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [sheetName, setSheetName] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useUploadSwapFile();
  const refreshDetail = useRefreshSwapDetail();
  const clearData = useClearSwapData();

  function handleClearClick() {
    if (!confirmingClear) {
      setConfirmingClear(true);
      setTimeout(() => setConfirmingClear(false), 4000);
      return;
    }
    setConfirmingClear(false);
    clearData.mutate();
  }

  async function handleFile(f: File) {
    setError(null);
    if (!f.name.toLowerCase().endsWith(".xlsx")) {
      setStatus("error");
      setError("Ожидается файл .xlsx");
      return;
    }
    setFile(f);
    setStatus("picked");
    try {
      const buf = await f.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array", bookSheets: true });
      const names = wb.SheetNames;
      setSheetNames(names);
      const preferred = [...names].reverse().find(isLikelySummarySheet);
      setSheetName(preferred ?? names[0] ?? "");
    } catch {
      setStatus("error");
      setError("Не удалось прочитать файл — убедитесь, что это корректный .xlsx");
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }

  async function onSubmit() {
    if (!file || !sheetName) return;
    setStatus("uploading");
    setError(null);
    try {
      await upload.mutateAsync({ file, sheetName });
      setStatus("success");
      setFile(null);
      setSheetNames([]);
      setSheetName("");
      if (inputRef.current) inputRef.current.value = "";
      setTimeout(() => setStatus((s) => (s === "success" ? "idle" : s)), 3500);
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Ошибка загрузки файла");
    }
  }

  return (
    <Card
      className="mb-6"
      title="Обновление данных"
      subtitle={
        meta
          ? `План БП/ДУП — из файла «${meta.sourceFileName}» (лист «${meta.sheetDateLabel}»), загружено ${new Date(meta.parsedAt).toLocaleString("ru-RU")}`
          : "План БП/ДУП ещё не загружен — загрузите экспорт из Google Таблицы вручную (эти цифры автоматически не приходят)"
      }
      actions={
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={() => refreshDetail.mutate()}
            disabled={refreshDetail.isPending}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[12.5px] font-medium hover:bg-surface-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={refreshDetail.isPending ? "animate-spin" : ""} />
            Обновить по подрядчикам
          </button>
          {detailMeta && (
            <span className="text-[11px] text-muted text-right max-w-[220px]">
              СМР/Принято/реестр — автоматически из Google Таблицы · {detailMeta.objectCount} объектов с подрядчиком · сервер забрал
              данные {new Date(detailMeta.fetchedAt).toLocaleString("ru-RU")}
            </span>
          )}
          {refreshDetail.isError && <span className="text-[11px] text-danger">{(refreshDetail.error as Error).message}</span>}
        </div>
      }
    >
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`rounded-[14px] border-2 border-dashed p-5 flex flex-col sm:flex-row items-center gap-4 transition-colors ${
          dragOver ? "border-brand bg-brand/5" : "border-border"
        }`}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br from-brand/15 to-brand-2/5 text-brand-2 dark:text-brand">
          {file ? <FileSpreadsheet size={20} /> : <UploadCloud size={20} />}
        </div>

        <div className="flex-1 min-w-0 text-center sm:text-left">
          {file ? (
            <>
              <div className="text-[13.5px] font-medium truncate">{file.name}</div>
              <div className="text-[12px] text-muted">{(file.size / 1024).toFixed(0)} КБ</div>
            </>
          ) : (
            <>
              <div className="text-[13.5px] font-medium">Перетащите файл .xlsx сюда или выберите вручную</div>
              <div className="text-[12px] text-muted">Экспорт сводного листа из Google Таблицы (например, «01.06.2026»)</div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {sheetNames.length > 0 && (
            <select
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              className="rounded-full border border-border bg-surface px-3 py-1.5 text-[12.5px]"
            >
              {sheetNames.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
          <label className="cursor-pointer rounded-full border border-border px-3 py-1.5 text-[12.5px] font-medium hover:bg-surface-2 transition-colors">
            Выбрать файл
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </label>
          <button
            onClick={handleClearClick}
            disabled={(!meta && !detailMeta) || clearData.isPending}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors disabled:opacity-50 ${
              confirmingClear
                ? "border-danger bg-danger/10 text-danger hover:bg-danger/20"
                : "border-border hover:bg-surface-2"
            }`}
          >
            <Trash2 size={13} className={clearData.isPending ? "animate-pulse" : ""} />
            {clearData.isPending ? "Стираю…" : confirmingClear ? "Точно стереть?" : "Стереть данные"}
          </button>
          {file && (
            <button
              onClick={onSubmit}
              disabled={status === "uploading" || !sheetName}
              className="rounded-full bg-brand text-white px-4 py-1.5 text-[12.5px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {status === "uploading" ? "Загрузка…" : "Загрузить"}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0, scale: [0.9, 1.05, 1] }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-3 flex items-center gap-2 text-[13px] text-success font-medium"
          >
            <CheckCircle2 size={16} />
            Данные обновлены
          </motion.div>
        )}
        {status === "error" && error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-3 flex items-center gap-2 text-[13px] text-danger font-medium"
          >
            <XCircle size={16} />
            {error}
          </motion.div>
        )}
        {clearData.isError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-3 flex items-center gap-2 text-[13px] text-danger font-medium"
          >
            <XCircle size={16} />
            {(clearData.error as Error).message}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
