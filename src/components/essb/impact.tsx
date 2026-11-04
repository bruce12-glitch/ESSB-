"use client";

import { Plus, Minus } from "lucide-react";
import { Reveal, SectionHeading } from "./section-bits";

const PROS = [
  { strong: "Cooler indoors", rest: " — biggest gain on the top floor" },
  { strong: "Lower cooling bills", rest: ", less strain on air conditioners" },
  { strong: "Longer roof life", rest: " — fewer thermal swings, less UV damage" },
  { strong: "Smaller urban heat-island", rest: " effect across cities" },
];

const CONS = [
  { strong: "Cold climates:", rest: " less winter sun absorbed — heating rises slightly" },
  { strong: "Dirt dulls the surface", rest: " and weakens the effect over time" },
  { strong: "Glare", rest: " can bother neighbours in dense settings" },
];

export function Impact() {
  return (
    <section id="impact" className="bg-cream scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <SectionHeading
          eyebrow="05 · BENEFITS & TRADE-OFFS"
          title={
            <>
              Why it&apos;s worth it — and <span className="text-ember">what to watch for</span>
            </>
          }
        />

        <div className="mt-10 md:mt-12 grid md:grid-cols-2 gap-6 md:gap-8">
          <Reveal>
            <div className="rounded-3xl bg-parchment border border-border border-t-4 border-t-pine p-6 md:p-8 h-full shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center w-10 h-10 rounded-full bg-pine text-cream">
                  <Plus className="w-5 h-5" />
                </span>
                <h3 className="font-display font-extrabold text-2xl text-forest">Why it&apos;s worth it</h3>
              </div>
              <ul className="mt-6 space-y-4">
                {PROS.map((p) => (
                  <li key={p.strong} className="flex gap-3 text-[15px] leading-relaxed text-ink/80">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-pine shrink-0" />
                    <span>
                      <strong className="text-forest">{p.strong}</strong>
                      {p.rest}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-3xl bg-parchment border border-border border-t-4 border-t-ember p-6 md:p-8 h-full shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center w-10 h-10 rounded-full bg-ember text-cream">
                  <Minus className="w-5 h-5" />
                </span>
                <h3 className="font-display font-extrabold text-2xl text-forest">What to watch for</h3>
              </div>
              <ul className="mt-6 space-y-4">
                {CONS.map((c) => (
                  <li key={c.strong} className="flex gap-3 text-[15px] leading-relaxed text-ink/80">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-ember shrink-0" />
                    <span>
                      <strong className="text-forest">{c.strong}</strong>
                      {c.rest}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
