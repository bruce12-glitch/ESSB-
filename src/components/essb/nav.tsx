"use client";

import { useEffect, useState } from "react";
import { FlaskConical } from "lucide-react";

const LINKS = [
  { href: "#science", label: "The Science" },
  { href: "#lab", label: "Virtual Lab" },
  { href: "#test", label: "The Real Test" },
  { href: "#howto", label: "How-To" },
  { href: "#impact", label: "Impact" },
  { href: "#team", label: "Team" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-forest/95 backdrop-blur border-b border-white/10 shadow-lg shadow-black/20" : "bg-transparent"}`}>
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4" aria-label="Main navigation">
        <a href="#top" className="flex items-center gap-2.5 group">
          {/* mini logo: sun over cool roof */}
          <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
            <g stroke="#ffd60a" strokeWidth="2.6" strokeLinecap="round">
              <line x1="20" y1="3" x2="20" y2="7.5" />
              <line x1="7" y1="11" x2="10" y2="13.4" />
              <line x1="33" y1="11" x2="30" y2="13.4" />
            </g>
            <circle cx="20" cy="14" r="5" fill="#ffb703" />
            <path d="M4 30 L20 18.5 L36 30 Z" fill="#26221d" />
            <path d="M4 30 L20 18.5 L24 21.4 L24 25 L21.5 25 L21.5 23 L18 25.4 L15 23 L15 28 L12 30 Z" fill="#f2ede1" />
            <rect x="6" y="31.5" width="28" height="5.5" rx="1.5" fill="#95d5b2" />
          </svg>
          <span className="leading-tight">
            <span className="block font-display font-extrabold text-cream text-sm tracking-wide">ROOF INSULATION</span>
            <span className="block text-[9.5px] tracking-[0.22em] text-mint/80">ESSB · SRM IST KTR</span>
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-6">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-[13px] font-semibold text-cream/75 hover:text-ambery transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="#lab"
          className="inline-flex items-center gap-1.5 rounded-full bg-ambery hover:bg-sun text-forest text-[13px] font-bold px-4 py-2 transition-colors shadow-md shadow-black/20"
        >
          <FlaskConical className="w-4 h-4" />
          Run the Lab
        </a>
      </nav>
    </header>
  );
}
