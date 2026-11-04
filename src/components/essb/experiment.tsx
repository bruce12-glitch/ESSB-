"use client";

import { CountUp, Reveal, SectionHeading } from "./section-bits";

export function Experiment() {
  return (
    <section id="test" className="bg-cream scroll-mt-20 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <SectionHeading
          eyebrow="03 · OUR WORKING MODEL"
          title={
            <>
              Tested under a <span className="text-ember">heat lamp</span>
            </>
          }
          sub="Two identical cardboard houses under the same heat lamp, a thermometer inside each — the only difference is the roof."
        />

        <div className="mt-10 md:mt-12 grid lg:grid-cols-5 gap-8 items-start">
          {/* video */}
          <Reveal className="lg:col-span-3">
            <div className="rounded-3xl overflow-hidden border border-border shadow-xl shadow-forest/10 bg-ink">
              <video
                controls
                preload="metadata"
                poster={`${process.env.NEXT_PUBLIC_BASE_PATH}/media/experiment-poster.jpg`}
                className="block w-full aspect-video bg-ink"
                aria-label="Video of the working model experiment: two cardboard houses under a heat lamp with thermometers showing 42.6°C and 31.8°C"
              >
                <source src={`${process.env.NEXT_PUBLIC_BASE_PATH}/media/experiment.mp4`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Heat lamp", "Thermometer 1 · House A", "Thermometer 2 · House B", "1 min 31 s"].map((chip) => (
                <span key={chip} className="text-[11px] font-bold tracking-wide rounded-full bg-sand border border-border text-ink/70 px-3 py-1.5">
                  {chip}
                </span>
              ))}
            </div>
          </Reveal>

          {/* results */}
          <Reveal delay={0.1} className="lg:col-span-2">
            <div className="rounded-3xl bg-forest text-cream p-6 md:p-7 shadow-xl shadow-forest/25">
              <div className="flex items-end gap-4">
                <div>
                  <div className="font-display text-4xl md:text-5xl font-extrabold text-clay tabular-nums leading-none">42.6°C</div>
                  <div className="mt-2 text-[10.5px] font-bold tracking-[0.14em] text-cream/60 leading-snug">
                    HOUSE A · BLACK CARDBOARD
                    <br />
                    ROOF — UNINSULATED
                  </div>
                </div>
                <div className="pb-6 font-display font-extrabold text-cream/40 text-lg">vs</div>
                <div>
                  <div className="font-display text-4xl md:text-5xl font-extrabold text-mint tabular-nums leading-none">31.8°C</div>
                  <div className="mt-2 text-[10.5px] font-bold tracking-[0.14em] text-cream/60 leading-snug">
                    HOUSE B · ALUMINIUM FOIL
                    <br />
                    OVER FOAM / COTTON
                  </div>
                </div>
              </div>

              {/* bars */}
              <div className="mt-6 space-y-3" role="img" aria-label="Bar comparison: House A 42.6 degrees, House B 31.8 degrees">
                <div>
                  <div className="h-4 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-clay to-ember" style={{ width: "85.2%" }} />
                  </div>
                  <div className="text-[10px] font-mono text-cream/50 mt-1">0°C ————————— 50°C scale</div>
                </div>
                <div className="h-4 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-pine to-mint" style={{ width: "63.6%" }} />
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-ambery text-forest px-4 py-3.5 flex items-center gap-3">
                <span className="font-display text-3xl font-extrabold tabular-nums leading-none">
                  −<CountUp to={10.8} decimals={1} />°C
                </span>
                <span className="text-[13px] font-bold leading-tight">
                  cooler just by fixing the roof
                  <span className="block font-semibold text-forest/70 text-[11.5px] mt-0.5">Typical range: 42–45°C uninsulated vs 30–34°C insulated</span>
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
