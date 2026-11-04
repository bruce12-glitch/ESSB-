"use client";

import { Github, GraduationCap } from "lucide-react";
import { Reveal, SectionHeading } from "./section-bits";

const TEAM = [
  { name: "Inbasekaran S", initials: "IS" },
  { name: "Jayaprakash", initials: "JP" },
  { name: "Rayaan", initials: "RY" },
  { name: "Harthik", initials: "HK" },
];

export function Team() {
  return (
    <section id="team" className="bg-forest scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <SectionHeading
          dark
          eyebrow="PROJECT TEAM"
          title={
            <>
              Built by students, <span className="text-ambery">for a cooler planet</span>
            </>
          }
          sub="A course project for ESSB — Energy Systems in Sustainable Buildings — at SRM Institute of Science & Technology, Kattankulathur (KTR campus)."
        />

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.06}>
              <div className="rounded-2xl border border-white/10 bg-pine/25 p-5 text-center hover:bg-pine/40 hover:-translate-y-1 transition-all">
                <div className="mx-auto grid place-items-center w-14 h-14 rounded-full bg-gradient-to-br from-ambery to-ember text-forest font-display font-extrabold text-lg shadow-lg shadow-black/25">
                  {m.initials}
                </div>
                <div className="mt-3 font-display font-bold text-cream">{m.name}</div>
                <div className="text-[10.5px] tracking-[0.18em] text-mint/70 mt-1">PROJECT TEAM</div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-6 rounded-2xl border border-ambery/30 bg-ambery/10 p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
            <span className="grid place-items-center w-12 h-12 rounded-full bg-ambery text-forest shrink-0">
              <GraduationCap className="w-6 h-6" />
            </span>
            <div className="text-center sm:text-left">
              <div className="text-[10.5px] font-bold tracking-[0.22em] text-ambery">GUIDED BY</div>
              <div className="font-display font-extrabold text-cream text-xl mt-0.5">Dr. Rajasekar</div>
              <div className="text-[12.5px] text-mint/80 mt-0.5">Faculty Guide · ESSB</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto bg-[#122e24] border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="font-display font-extrabold text-cream tracking-wide">ESSB · ROOF INSULATION</div>
          <div className="text-[12px] text-mint/70 mt-1">SRM IST · KATTANKULATHUR — Energy Systems in Sustainable Buildings</div>
        </div>
        <div className="flex flex-col sm:items-end gap-2">
          <a
            href="https://github.com/bruce12-glitch/ESSB-"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-cream/80 hover:text-ambery transition-colors"
          >
            <Github className="w-4 h-4" />
            github.com/bruce12-glitch/ESSB-
          </a>
          <div className="text-[11px] text-cream/40">Interactive showcase · virtual lab calibrated to the working model&apos;s measured results</div>
        </div>
      </div>
    </footer>
  );
}
