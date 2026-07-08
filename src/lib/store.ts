"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

export type Role =
  | "management"
  | "odt"
  | "logistics"
  | "dispatcher"
  | "hr";

export const ROLE_LABELS: Record<Role, string> = {
  management: "Руководство дирекции",
  odt: "Ответственный ОДТ",
  logistics: "Служба логистики",
  dispatcher: "Куратор подрядчиков",
  hr: "HR / персонал",
};

interface UIState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;

  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  mobileNavOpen: boolean;
  setMobileNavOpen: (v: boolean) => void;

  aiOpen: boolean;
  setAiOpen: (v: boolean) => void;

  notificationsOpen: boolean;
  setNotificationsOpen: (v: boolean) => void;

  role: Role;
  setRole: (r: Role) => void;

  activeRegionId: string | null;
  setActiveRegionId: (id: string | null) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: "light",
      toggleTheme: () => set({ theme: get().theme === "light" ? "dark" : "light" }),
      setTheme: (t) => set({ theme: t }),

      sidebarCollapsed: false,
      toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),

      mobileNavOpen: false,
      setMobileNavOpen: (v) => set({ mobileNavOpen: v }),

      aiOpen: false,
      setAiOpen: (v) => set({ aiOpen: v }),

      notificationsOpen: false,
      setNotificationsOpen: (v) => set({ notificationsOpen: v }),

      role: "management",
      setRole: (r) => set({ role: r }),

      activeRegionId: null,
      setActiveRegionId: (id) => set({ activeRegionId: id }),
    }),
    {
      name: "tazartu-ui",
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        role: state.role,
      }),
    },
  ),
);
