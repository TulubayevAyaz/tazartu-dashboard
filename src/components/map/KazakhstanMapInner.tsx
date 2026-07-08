"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { REGIONS, type Region } from "@/lib/data/regions";
import { useUIStore } from "@/lib/store";
import { formatNumber, formatPercent } from "@/lib/utils";

function colorForPct(pct: number): string {
  if (pct >= 70) return "#16a34a";
  if (pct >= 55) return "#00a3e0";
  if (pct >= 40) return "#f59e0b";
  return "#dc2626";
}

function ThemeAwareTiles() {
  const theme = useUIStore((s) => s.theme);
  const url =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  return (
    <TileLayer
      key={theme}
      url={url}
      attribution='&copy; OpenStreetMap, &copy; CARTO'
      subdomains="abcd"
    />
  );
}

function FlyToRegion({ region }: { region: Region | undefined }) {
  const map = useMap();
  useEffect(() => {
    if (region) map.flyTo([region.lat, region.lng], 6, { duration: 0.6 });
  }, [region, map]);
  return null;
}

export function KazakhstanMapInner({ onSelect }: { onSelect?: (id: string) => void }) {
  const activeRegionId = useUIStore((s) => s.activeRegionId);
  const active = REGIONS.find((r) => r.id === activeRegionId);

  return (
    <MapContainer
      center={[48.05, 66.9]}
      zoom={5}
      minZoom={4}
      maxZoom={8}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", borderRadius: "var(--radius-lg)" }}
    >
      <ThemeAwareTiles />
      <FlyToRegion region={active} />
      {REGIONS.map((r) => {
        const remaining = r.clientsTotal - r.migrated;
        const radius = 12 + (r.clientsTotal / 210000) * 14;
        return (
          <CircleMarker
            key={r.id}
            center={[r.lat, r.lng]}
            radius={radius}
            pathOptions={{
              color: colorForPct(r.factPctToday),
              fillColor: colorForPct(r.factPctToday),
              fillOpacity: 0.55,
              weight: 2,
            }}
            eventHandlers={{
              click: () => onSelect?.(r.id),
            }}
          >
            <Tooltip direction="top" offset={[0, -radius]} opacity={1} className="!rounded-xl !border-0 !shadow-lg">
              <div className="text-[12.5px] leading-relaxed min-w-[190px]">
                <div className="font-semibold text-[13px] mb-1">{r.name}</div>
                <div className="flex justify-between gap-4"><span className="text-muted">План</span><span>{formatPercent(r.planPctToday)}</span></div>
                <div className="flex justify-between gap-4"><span className="text-muted">Факт</span><span className="font-medium">{formatPercent(r.factPctToday)}</span></div>
                <div className="flex justify-between gap-4"><span className="text-muted">Клиентов</span><span>{formatNumber(r.clientsTotal)}</span></div>
                <div className="flex justify-between gap-4"><span className="text-muted">Осталось</span><span>{formatNumber(remaining)}</span></div>
                <div className="flex justify-between gap-4"><span className="text-muted">Скорость</span><span>{r.avgSpeedMbps} Мб/с</span></div>
                <div className="flex justify-between gap-4"><span className="text-muted">DSLAM</span><span>{r.dslamDemolished}/{r.dslamTotal}</span></div>
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
