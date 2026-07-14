"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SwapDataset } from "@/lib/types/swap";

const QUERY_KEY = ["swap-dataset"];

async function fetchSwapDataset(): Promise<SwapDataset> {
  const res = await fetch("/api/swap");
  if (!res.ok) throw new Error("Не удалось загрузить данные SWAP");
  return res.json();
}

export function useSwapData() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: fetchSwapDataset, staleTime: 60_000 });
}

export function useUploadSwapFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, sheetName }: { file: File; sheetName: string }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("sheetName", sheetName);
      const res = await fetch("/api/swap/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Ошибка загрузки файла");
      return data as { ok: true; meta: SwapDataset["meta"] };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useRefreshSwapDetail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/swap/refresh-detail", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Ошибка обновления данных по подрядчикам");
      return data as { ok: true; detailMeta: SwapDataset["detailMeta"] };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
