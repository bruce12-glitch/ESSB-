"use client";

import { Reveal, SectionHeading } from "./section-bits";

const POINTS = [
  {
    title: "Sunlight has three parts",
    body: "Visible light, ultraviolet and infrared. A dark roof absorbs most of all three — and can reach 65–80°C on a hot day.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
      </svg>
    ),
  },
  {
    title: "That heat conducts through the roof",
    body: "It soaks into the attic and the rooms below — the air conditioner works harder, and the top floor suffers first.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 3v12m0 0l-4-4m4 4l4-4" />
        <path d="M4 21c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 4 0" />
      </svg>
    ),
  },
  {
    title: "Solar reflectance (albedo)",
    body: "A cool roof bounces back 60–90% of incoming sunlight; dark materials reflect just 5–25%.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 18L12 8l8 10" />
        <path d="M12 8l5-5m0 0h-4m4 0v4" />
      </svg>
    ),
  },
  {
    title: "Thermal emittance",
    body: "Absorbed heat should radiate back to the sky instead of being held. Bare metal reflects but emits poorly — it needs a coating.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 21V9m0 0l-4 4m4-4l4 4" />
        <path d="M4 3c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 4 0" />
      </svg>
    ),
  },
];

function ScienceDiagram() {
  return (
    <svg viewBox="0 0 640 400" className="w-full h-auto" role="img" aria-label="Diagram comparing a dark roof that absorbs and traps heat with a cool roof that reflects sunlight and radiates heat to the sky">
      <defs>
        <radialGradient id="sciSun">
          <stop offset="0%" stopColor="#ffe97a" />
          <stop offset="100%" stopColor="#ffb703" />
        </radialGradient>
        <linearGradient id="sciFoil" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f4f6f8" />
          <stop offset="100%" stopColor="#aeb6bd" />
        </linearGradient>
        <marker id="arrHot" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L7,4 L0,8 Z" fill="#e76f51" />
        </marker>
        <marker id="arrCool" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L7,4 L0,8 Z" fill="#40916c" />
        </marker>
      </defs>

      {/* sun */}
      <circle cx="90" cy="64" r="34" fill="url(#sciSun)" />
      <g stroke="#ffb703" strokeWidth="4" strokeLinecap="round">
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i * Math.PI) / 5 - Math.PI / 2 + 0.31;
          return <line key={i} x1={90 + Math.cos(a) * 44} y1={64 + Math.sin(a) * 44} x2={90 + Math.cos(a) * 56} y2={64 + Math.sin(a) * 56} />;
        })}
      </g>

      {/* incoming rays */}
      <g stroke="#ffb703" strokeWidth="4" strokeLinecap="round">
        <line x1="130" y1="106" x2="210" y2="196" markerEnd="none" className="sim-anim" style={{ animation: "foil-sparkle 2s ease-in-out infinite" }} />
        <line x1="140" y1="90" x2="330" y2="180" markerEnd="none" className="sim-anim" style={{ animation: "foil-sparkle 2s ease-in-out -1s infinite" }} />
      </g>

      {/* dark roof house */}
      <g>
        <rect x="130" y="240" width="200" height="110" fill="#f3ead2" stroke="#c9b98f" strokeWidth="2" />
        <polygon points="110,244 350,244 230,150" fill="#26221d" />
        {/* heat in */}
        <g stroke="#e76f51" strokeWidth="4" fill="none" strokeLinecap="round">
          <path d="M230 210 q8 14 0 28 q-8 14 0 28" markerEnd="url(#arrHot)" className="sim-anim" style={{ animation: "heat-wiggle 1.8s ease-in-out infinite", ["--heat-o" as string]: 0.9 }} />
          <path d="M196 226 q6 12 0 24 q-6 12 0 24" opacity="0.55" />
          <path d="M264 226 q6 12 0 24 q-6 12 0 24" opacity="0.55" />
        </g>
        <text x="230" y="300" textAnchor="middle" fontSize="13" fontWeight="700" fill="#8a5a30" letterSpacing="1">absorbs &amp; traps heat</text>
        <rect x="112" y="360" width="236" height="30" rx="15" fill="#26221d" />
        <text x="230" y="380" textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#ffb3a0" letterSpacing="0.5">DARK ROOF · 65–80°C</text>
      </g>

      {/* cool roof house */}
      <g>
        <rect x="380" y="240" width="200" height="110" fill="#f3ead2" stroke="#c9b98f" strokeWidth="2" />
        <polygon points="360,244 600,244 480,150" fill="url(#sciFoil)" stroke="#9aa2ab" strokeWidth="2" />
        {/* reflected ray */}
        <line x1="480" y1="196" x2="556" y2="112" stroke="#40916c" strokeWidth="4" strokeLinecap="round" markerEnd="url(#arrCool)" className="sim-anim" style={{ animation: "foil-sparkle 2.2s ease-in-out -0.5s infinite" }} />
        <text x="596" y="130" textAnchor="end" fontSize="13" fontWeight="700" fill="#2d6a4f">reflects</text>
        {/* radiate to sky */}
        <g stroke="#40916c" strokeWidth="3.4" fill="none" strokeLinecap="round">
          <path d="M402 232 q-8 -14 -2 -26" markerEnd="url(#arrCool)" opacity="0.8" />
          <path d="M388 214 q-8 -12 -3 -24" markerEnd="url(#arrCool)" opacity="0.55" />
        </g>
        <text x="480" y="300" textAnchor="middle" fontSize="13" fontWeight="700" fill="#8a5a30" letterSpacing="1">radiates heat to the sky</text>
        <rect x="344" y="360" width="272" height="30" rx="15" fill="#1b4332" />
        <text x="480" y="380" textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#95d5b2" letterSpacing="0.5">COOL ROOF · 20–30°C COOLER</text>
      </g>

      {/* ground */}
      <rect x="60" y="352" width="520" height="4" rx="2" fill="#d9c9a4" />
    </svg>
  );
}

export function Science() {
  return (
    <section id="science" className="bg-cream scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <SectionHeading
          eyebrow="01 · THE SCIENCE"
          title={
            <>
              Why roofs <span className="text-ember">overheat</span>
            </>
          }
          sub="Four things happen between the sun and your ceiling — understanding them is what makes a roof 'cool'."
        />

        <div className="mt-10 md:mt-12 grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="space-y-4">
            {POINTS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06}>
                <div className="flex gap-4 rounded-2xl bg-parchment border border-border p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="shrink-0 grid place-items-center w-10 h-10 rounded-xl bg-pine/10 text-pine">{p.icon}</div>
                  <div>
                    <h3 className="font-display font-bold text-forest text-[17px]">{p.title}</h3>
                    <p className="mt-1 text-sm md:text-[15px] leading-relaxed text-ink/70">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="rounded-3xl bg-gradient-to-b from-[#fff3d6] to-[#fde8bf] border border-border p-4 md:p-6 shadow-sm">
              <ScienceDiagram />
              <p className="text-center text-xs text-ink/50 mt-2 font-mono">same sun · two very different roofs</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="mt-8 rounded-2xl border-l-4 border-ambery bg-parchment border border-border p-6 md:p-7 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <div className="font-display font-extrabold text-2xl text-forest shrink-0">
                <span className="text-pine">REFLECT</span> <span className="text-ember">+</span> <span className="text-pine">INSULATE</span>
              </div>
              <p className="text-[15px] leading-relaxed text-ink/75">
                Two separate jobs, better together: <strong>reflection</strong> stops heat entering the roof surface at all, while <strong>insulation</strong> — mineral wool, foam and similar — slows
                whatever still gets through, and keeps warmth in during cold weather.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
