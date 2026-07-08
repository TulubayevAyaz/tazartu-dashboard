"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Recycle, X } from "lucide-react";
import { useUIStore } from "@/lib/store";
import { SidebarNavContent } from "./SidebarNavContent";

export function MobileNav() {
  const open = useUIStore((s) => s.mobileNavOpen);
  const setOpen = useUIStore((s) => s.setMobileNavOpen);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px] md:hidden"
          />
          <motion.div
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed left-0 top-0 z-50 h-screen w-[264px] flex flex-col bg-surface border-r border-border shadow-2xl md:hidden"
          >
            <div className="flex items-center justify-between gap-2.5 h-16 px-4 border-b border-border shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-2 text-white shrink-0">
                  <Recycle size={18} strokeWidth={2.4} />
                </div>
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold leading-tight truncate">Тазарту</div>
                  <div className="text-[11px] text-muted leading-tight truncate">Казахтелеком</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-surface-2 text-muted">
                <X size={16} />
              </button>
            </div>
            <SidebarNavContent onNavigate={() => setOpen(false)} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
