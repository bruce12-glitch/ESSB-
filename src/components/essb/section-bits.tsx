"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";

export function Reveal({
  children,
  delay = 0,
  className,
  y = 26,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 0.61, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  dark = false,
  align = "left",
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  dark?: boolean;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={align === "center" ? "text-center" : ""}>
      <div className={`text-[11px] font-extrabold tracking-[0.28em] ${dark ? "text-ambery" : "text-ember"}`}>{eyebrow}</div>
      <h2 className={`font-display text-3xl md:text-[2.6rem] leading-[1.08] font-extrabold mt-3 ${dark ? "text-cream" : "text-forest"}`}>{title}</h2>
      {sub && <p className={`mt-4 text-base md:text-lg leading-relaxed max-w-2xl ${dark ? "text-mint/85" : "text-ink/70"} ${align === "center" ? "mx-auto" : ""}`}>{sub}</p>}
    </Reveal>
  );
}

export function CountUp({ to, decimals = 0, duration = 1.5, className }: { to: number; decimals?: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {val.toFixed(decimals)}
    </span>
  );
}
