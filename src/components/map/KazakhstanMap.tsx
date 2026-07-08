"use client";

import dynamic from "next/dynamic";

export const KazakhstanMap = dynamic(() => import("./KazakhstanMapInner").then((m) => m.KazakhstanMapInner), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-[13px] text-muted">
      Загрузка карты...
    </div>
  ),
});
