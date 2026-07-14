"use client";

import { useEffect, useRef } from "react";
import { animate } from "framer-motion";
import { formatNumber } from "@/lib/utils";

export function CountUpValue({
  value,
  formatter = formatNumber,
}: {
  value: number;
  formatter?: (n: number) => string;
}) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const prevValue = useRef(value);

  useEffect(() => {
    const from = prevValue.current;
    prevValue.current = value;
    const controls = animate(from, value, {
      duration: 0.9,
      ease: "easeOut",
      onUpdate: (v) => {
        if (spanRef.current) spanRef.current.textContent = formatter(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [value, formatter]);

  return <span ref={spanRef}>{formatter(value)}</span>;
}
