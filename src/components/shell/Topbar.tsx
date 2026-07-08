"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, Bell, Sun, Moon, Menu } from "lucide-react";
import { useUIStore, ROLE_LABELS } from "@/lib/store";
import { UNREAD_COUNT } from "@/lib/data/notifications";
import { NotificationsPanel } from "./NotificationsPanel";
import { ProfileMenu } from "./ProfileMenu";

export function Topbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const setAiOpen = useUIStore((s) => s.setAiOpen);
  const notificationsOpen = useUIStore((s) => s.notificationsOpen);
  const setNotificationsOpen = useUIStore((s) => s.setNotificationsOpen);
  const role = useUIStore((s) => s.role);
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/clients?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 backdrop-blur-xl px-4 md:px-6">
      <button
        onClick={() => setMobileNavOpen(true)}
        className="flex md:hidden h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-foreground transition"
      >
        <Menu size={19} />
      </button>
      <div className="flex items-center gap-2 md:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-2 text-white text-xs font-bold">Т</div>
      </div>

      <div className="hidden lg:flex items-center gap-2 text-[13px] text-muted mr-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 font-medium text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          Программа активна
        </span>
        <span className="hidden xl:inline">Обновлено: 08.07.2026, 09:15</span>
      </div>

      <form onSubmit={handleSearch} className="flex-1 max-w-xl ml-auto">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по ИИН, телефону, адресу, ONU, MAC..."
            className="w-full rounded-full border border-border bg-surface pl-9 pr-3 py-2 text-[13.5px] outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition"
          />
        </div>
      </form>

      <button
        onClick={() => setAiOpen(true)}
        className="hidden sm:flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand to-brand-2 px-3.5 py-2 text-[13px] font-medium text-white shadow-sm hover:opacity-90 transition"
      >
        <Sparkles size={15} />
        AI-помощник
      </button>

      <button
        onClick={toggleTheme}
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-foreground transition"
        title="Переключить тему"
      >
        {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
      </button>

      <div className="relative">
        <button
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-foreground transition"
        >
          <Bell size={17} />
          {UNREAD_COUNT > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger ring-2 ring-background" />
          )}
        </button>
        {notificationsOpen && (
          <>
            <button aria-label="Закрыть уведомления" onClick={() => setNotificationsOpen(false)} className="fixed inset-0 z-30 cursor-default" />
            <NotificationsPanel />
          </>
        )}
      </div>

      <ProfileMenu role={role} />
    </header>
  );
}
