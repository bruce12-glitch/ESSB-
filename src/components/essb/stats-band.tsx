"use client";

import { CountUp, Reveal } from "./section-bits";

const STATS = [
  {
    big: "60–90%",
    text: "of sunlight a good cool roof bounces back — dark materials manage only 5–25%.",
    accent: "text-ember",
  },
  {
    big: "20–30°C",
    text: "cooler roof surface than a dark roof under the same sun.",
    accent: "text-pine",
  },
  {
    big: null as null | number,
    suffix: "°C",
    text: "measured in our model — 42.6°C vs 31.8°C with foil + insulation.",
    accent: "text-ember",
  },
];

export function StatsBand() {
  return (
    <section className="bg-cream border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 grid sm:grid-cols-3 gap-6 md:gap-8">
        {STATS.map((s, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div className="relative rounded-2xl bg-parchment border border-border p-6 h-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="absolute top-0 left-6 right-6 h-1 rounded-b bg-gradient-to-r from-ambery via-ember to-pine/60" />
              <div className={`font-display text-4xl md:text-5xl font-extrabold ${s.accent} tabular-nums`}>
                {s.big ?? (
                  <>
                    <CountUp to={10.8} decimals={1} />°C
                  </>
                )}
              </div>
              <p className="mt-3 text-sm md:text-[15px] leading-relaxed text-ink/75">{s.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
