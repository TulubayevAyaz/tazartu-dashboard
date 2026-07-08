"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Send } from "lucide-react";
import { useUIStore } from "@/lib/store";
import { answerQuestion, SUGGESTED_PROMPTS } from "@/lib/ai";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export function AiAssistant() {
  const open = useUIStore((s) => s.aiOpen);
  const setOpen = useUIStore((s) => s.setAiOpen);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Здравствуйте! Я AI-помощник программы «Тазарту». Спросите о прогрессе филиалов, материалах, сроках или проблемных зонах.",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function send(text: string) {
    const q = text.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", text: answerQuestion(q) }]);
    }, 350);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-black/25 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ x: 420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 420, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 z-50 h-screen w-full max-w-[420px] flex flex-col bg-surface border-l border-border shadow-2xl"
          >
            <div className="flex items-center justify-between h-16 px-4 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-white">
                  <Sparkles size={15} />
                </div>
                <div>
                  <div className="text-[13.5px] font-semibold leading-tight">AI-помощник</div>
                  <div className="text-[11px] text-muted leading-tight">По данным программы «Тазарту»</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-2 text-muted">
                <X size={16} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-[16px] px-3.5 py-2.5 text-[13.5px] leading-relaxed",
                      m.role === "user"
                        ? "bg-gradient-to-br from-brand to-brand-2 text-white rounded-br-[4px]"
                        : "bg-surface-2 text-foreground rounded-bl-[4px]",
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTED_PROMPTS.slice(0, 4).map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="rounded-full border border-border px-2.5 py-1 text-[11.5px] text-muted hover:border-brand hover:text-brand-2 transition"
                >
                  {p}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 p-3 border-t border-border shrink-0"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Спросите про прогресс, материалы, сроки..."
                className="flex-1 rounded-full border border-border bg-background px-3.5 py-2.5 text-[13px] outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition"
              />
              <button
                type="submit"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-white hover:opacity-90 transition"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
