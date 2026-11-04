"use client";

import { Reveal, SectionHeading } from "./section-bits";

const STEPS = [
  {
    n: "1",
    title: "PREPARE",
    body: "Clean dirt; fix cracks and leaks so the coating bonds well.",
    accent: "bg-pine text-cream",
  },
  {
    n: "2",
    title: "APPLY",
    body: "Roll or spray the reflective layer — often two coats for even coverage.",
    accent: "bg-ember text-cream",
  },
  {
    n: "3",
    title: "CURE",
    body: "Let it cure for a few dry days before full sun.",
    accent: "bg-ambery text-forest",
  },
  {
    n: "4",
    title: "MAINTAIN",
    body: "Dirt and algae cut reflectivity — wash occasionally.",
    accent: "bg-forest text-cream",
  },
];

const LAYERS = [
  "White acrylic / elastomeric coating",
  "Reflective paint or tiles",
  "White TPO / PVC membrane",
  "Reflective metal",
  "Foil — House B's roof",
];

export function HowTo() {
  return (
    <section id="howto" className="bg-sand scroll-mt-20 border-y border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <SectionHeading
          eyebrow="04 · HOW IT'S DONE IN PRACTICE"
          title={
            <>
              From our model to <span className="text-ember">your roof</span>
            </>
          }
          sub="The same logic that cooled House B by 10.8°C scales up to real buildings in four steps."
        />

        <div className="mt-10 md:mt-12 grid sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.07}>
              <div className="relative rounded-2xl bg-parchment border border-border p-6 h-full hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className={`grid place-items-center w-11 h-11 rounded-xl font-display font-extrabold text-xl ${s.accent}`}>{s.n}</div>
                <h3 className="mt-4 font-display font-extrabold text-forest tracking-wide">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            <span className="text-[12px] font-extrabold tracking-[0.14em] text-forest/80 mr-1">REFLECTIVE LAYERS:</span>
            {LAYERS.map((l) => (
              <span key={l} className="rounded-full bg-parchment border border-border text-ink/75 text-[12.5px] font-semibold px-3.5 py-1.5 hover:border-ember hover:text-ember transition-colors">
                {l}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
