"use client";

import { useState } from "react";
import { ChevronDown, LogOut, UserCircle } from "lucide-react";
import { useUIStore, ROLE_LABELS, type Role } from "@/lib/store";

export function ProfileMenu({ role }: { role: Role }) {
  const [open, setOpen] = useState(false);
  const setRole = useUIStore((s) => s.setRole);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full pl-1.5 pr-2.5 py-1.5 hover:bg-surface-2 transition"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-[11px] font-semibold text-white">
          AT
        </div>
        <span className="hidden lg:block text-[12.5px] font-medium max-w-[130px] truncate">
          {ROLE_LABELS[role]}
        </span>
        <ChevronDown size={14} className="text-muted" />
      </button>

      {open && (
        <>
        <button aria-label="Закрыть меню профиля" onClick={() => setOpen(false)} className="fixed inset-0 z-30 cursor-default" />
        <div className="absolute right-0 top-11 w-[280px] card shadow-xl z-40 p-2">
          <div className="px-2.5 py-2 border-b border-border mb-1">
            <div className="text-[13px] font-semibold">Ayaz T.</div>
            <div className="text-[12px] text-muted">Team Lead Data Analyst, Big Data</div>
          </div>
          <div className="px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wide text-muted">
            Демо-режим: просмотр от лица роли
          </div>
          {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => {
                setRole(r);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-[10px] px-2.5 py-2 text-[13px] text-left transition-colors ${
                r === role ? "bg-brand/12 text-brand-2 dark:text-brand font-medium" : "hover:bg-surface-2"
              }`}
            >
              <UserCircle size={15} />
              {ROLE_LABELS[r]}
            </button>
          ))}
          <div className="mt-1 pt-1 border-t border-border">
            <button className="flex w-full items-center gap-2 rounded-[10px] px-2.5 py-2 text-[13px] text-danger hover:bg-danger/10 transition-colors">
              <LogOut size={15} />
              Выйти
            </button>
          </div>
        </div>
        </>
      )}
    </div>
  );
}
