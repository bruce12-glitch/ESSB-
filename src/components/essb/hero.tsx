"use client";

import { motion } from "framer-motion";
import { ArrowDown, Play } from "lucide-react";
import { SimScene } from "./sim-scene";
import { MATERIALS } from "@/lib/sim-engine";

const fadeUp = {
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section id="top" className="relative bg-forest overflow-hidden">
      {/* warm glows */}
      <div className="pointer-events-none absolute -top-40 right-[-10%] w-[42rem] h-[42rem] rounded-full opacity-25" style={{ background: "radial-gradient(circle, rgba(255,183,3,0.55) 0%, rgba(255,183,3,0) 65%)" }} aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-[-30%] left-[-12%] w-[36rem] h-[36rem] rounded-full opacity-20" style={{ background: "radial-gradient(circle, rgba(149,213,178,0.5) 0%, rgba(149,213,178,0) 65%)" }} aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-28 md:pt-32 pb-10 md:pb-14 grid lg:grid-cols-2 gap-10 lg:gap-8 items-center">
        {/* copy */}
        <div>
          <motion.div {...fadeUp} transition={{ duration: 0.55 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-pine/40 px-3.5 py-1.5 text-[10.5px] font-bold tracking-[0.22em] text-mint">
              <span className="w-1.5 h-1.5 rounded-full bg-ambery animate-pulse" />
              COURSE PROJECT · ESSB · SRM IST KATTANKULATHUR
            </span>
          </motion.div>

          <motion.h1 {...fadeUp} transition={{ duration: 0.6, delay: 0.08 }} className="mt-5 font-display font-extrabold leading-[0.95] text-[3.4rem] sm:text-7xl md:text-[5.2rem]">
            <span className="text-cream">ROOF</span>
            <br />
            <span className="text-ambery">INSULATION</span>
          </motion.h1>

          <motion.p {...fadeUp} transition={{ duration: 0.6, delay: 0.16 }} className="mt-5 text-lg md:text-xl leading-relaxed text-cream/85 max-w-xl">
            Reflect sunlight <strong className="text-ambery font-bold">before</strong> it enters the building — insulate against the heat that{" "}
            <strong className="text-ambery font-bold">still</strong> gets through. Demonstrated with a working model — and now, a virtual one.
          </motion.p>

          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.24 }} className="mt-7 flex flex-wrap gap-3">
            <a
              href="#lab"
              className="inline-flex items-center gap-2 rounded-full bg-ambery hover:bg-sun text-forest font-bold px-6 py-3.5 transition-colors shadow-lg shadow-black/25"
            >
              <Play className="w-4.5 h-4.5" />
              Run the Virtual Lab
            </a>
            <a
              href="#test"
              className="inline-flex items-center gap-2 rounded-full border-2 border-cream/25 hover:border-ambery hover:text-ambery text-cream font-bold px-6 py-3.5 transition-colors"
            >
              Watch the real test
            </a>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.32 }} className="mt-8 flex flex-wrap gap-x-7 gap-y-3">
            {[
              ["60–90%", "of sunlight bounced back"],
              ["20–30°C", "cooler roof surface"],
              ["−10.8°C", "measured indoors"],
            ].map(([big, small]) => (
              <div key={big}>
                <div className="font-display text-2xl font-extrabold text-ambery tabular-nums">{big}</div>
                <div className="text-[11px] tracking-[0.14em] text-mint/75 font-semibold uppercase mt-0.5">{small}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* animated scene teaser — the lab running at the measured state */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="rounded-3xl border border-white/10 shadow-2xl shadow-black/40 overflow-hidden">
            <SimScene source="lamp" intensity={1} running materialB={MATERIALS.full} temps={{ aRoof: 72, aIn: 42.6, bRoof: 42.1, bIn: 31.8 }} />
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 rounded-full bg-cream text-forest text-xs font-bold px-4 py-2 shadow-lg">
            <ArrowDown className="w-3.5 h-3.5" />
            scroll to drive it yourself
          </div>
        </motion.div>
      </div>

      {/* marquee ribbon */}
      <div className="relative border-t border-forest/20 bg-ambery py-2.5 overflow-hidden" aria-hidden="true">
        <div className="flex w-max whitespace-nowrap" style={{ animation: "marquee-x 26s linear infinite" }}>
          {[0, 1].map((dup) => (
            <div key={dup} className="flex">
              {[
                "REFLECT BEFORE IT ENTERS",
                "INSULATE WHAT STILL GETS THROUGH",
                "60–90% BOUNCED BACK",
                "DARK ROOF · 65–80°C",
                "COOL ROOF · 20–30°C COOLER",
                "MEASURED Δ 10.8°C",
              ].map((t) => (
                <span key={t} className="mx-6 font-display font-extrabold text-forest text-sm tracking-[0.14em] flex items-center gap-6">
                  {t}
                  <span className="inline-block w-2 h-2 rotate-45 bg-forest/70" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
