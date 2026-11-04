import { Nav } from "@/components/essb/nav";
import { Hero } from "@/components/essb/hero";
import { StatsBand } from "@/components/essb/stats-band";
import { Science } from "@/components/essb/science";
import { VirtualLab } from "@/components/essb/virtual-lab";
import { SectionHeading } from "@/components/essb/section-bits";
import { Experiment } from "@/components/essb/experiment";
import { HowTo } from "@/components/essb/how-to";
import { Impact } from "@/components/essb/impact";
import { Team, Footer } from "@/components/essb/team";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        <Hero />
        <StatsBand />
        <Science />

        {/* ---------------- Virtual Lab ---------------- */}
        <section id="lab" className="relative bg-gradient-to-b from-[#0d1f19] via-forest to-forest scroll-mt-20 border-y border-white/5 overflow-hidden">
          <div
            className="pointer-events-none absolute -top-52 left-1/2 -translate-x-1/2 w-[52rem] h-[52rem] rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, rgba(255,214,10,0.6) 0%, rgba(255,214,10,0) 60%)" }}
            aria-hidden="true"
          />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
            <SectionHeading
              dark
              align="center"
              eyebrow="02 · INTERACTIVE"
              title={
                <>
                  The <span className="text-ambery">Virtual Lab</span>
                </>
              }
              sub="Two houses. One heat source. The only difference is the roof — exactly like our bench test. Pick House B's roof, crank the power up, and watch the thermometers race."
            />
            <div className="mt-10 md:mt-12">
              <VirtualLab />
            </div>
            <p className="mt-4 text-center text-[12px] text-mint/60 font-mono">
              model: single-zone heat balance · calibrated to our measured 42.6°C vs 31.8°C — for classroom demonstration
            </p>
          </div>
        </section>

        <Experiment />
        <HowTo />
        <Impact />
        <Team />
      </main>
      <Footer />
    </div>
  );
}
