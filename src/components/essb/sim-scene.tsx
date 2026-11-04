"use client";

import {
    Material,
    MEASURED_A,
    MEASURED_B,
    roomAirColor,
    T_AMB,
    thermoFraction,
} from "@/lib/sim-engine";
import { useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  Geometry constants (SVG user units, viewBox 1000 x 620)            */
/* ------------------------------------------------------------------ */

const A_TARGETS: [number, number][] = [
  [238, 336], [322, 318], [280, 302], [258, 328], [304, 312],
  [262, 344], [298, 334], [270, 320], [330, 326], [250, 310],
];
const B_TARGETS: [number, number][] = [
  [678, 336], [618, 318], [720, 302], [642, 328], [696, 312],
  [738, 344], [702, 334], [730, 320], [670, 326], [750, 310],
];
const SOURCE = { x: 500, y: 138 };

const SQUIGGLES_A = [232, 280, 328];
const SQUIGGLES_B = [672, 720, 768];

export interface SceneTemps {
  aRoof: number;
  aIn: number;
  bRoof: number;
  bIn: number;
}

interface SimSceneProps {
  source: "sun" | "lamp";
  intensity: number;
  running: boolean;
  materialB: Material;
  temps: SceneTemps;
}

function heatGlowOpacity(surfaceTemp: number): number {
  return Math.min(0.9, Math.max(0, (surfaceTemp - T_AMB - 1) / 42));
}

function squiggleOpacity(surfaceTemp: number): number {
  return Math.min(0.85, Math.max(0, (surfaceTemp - T_AMB) / 40));
}

function thermoColor(frac: number): string {
  const from = { r: 149, g: 213, b: 178 };
  const to = { r: 231, g: 111, b: 81 };
  const r = Math.round(from.r + (to.r - from.r) * frac);
  const g = Math.round(from.g + (to.g - from.g) * frac);
  const b = Math.round(from.b + (to.b - from.b) * frac);
  return `rgb(${r}, ${g}, ${b})`;
}

/* ------------------------------------------------------------------ */

export function SimScene({ source, intensity, running, materialB, temps }: SimSceneProps) {
  const playState = running ? "running" : "paused";
  const fallDur = 1.5 / (0.45 + 0.55 * intensity);
  const bounceDur = fallDur * 1.7;

  const glowA = heatGlowOpacity(temps.aRoof);
  const glowB = heatGlowOpacity(temps.bRoof);
  const squigA = squiggleOpacity(temps.aRoof);
  const squigB = squiggleOpacity(temps.bRoof);
  const bReflects = materialB.absorb < 0.5;

  const photonLayerOpacity = intensity <= 0.02 ? 0 : 0.25 + 0.75 * intensity;

  const photons = useMemo(() => {
    const mk = (
      targets: [number, number][],
      reflects: boolean,
      keyPrefix: string,
    ) =>
      targets.map(([tx, ty], i) => {
        const dx = tx - SOURCE.x;
        const dy = ty - SOURCE.y;
        const dur = (reflects ? bounceDur : fallDur) * (0.92 + 0.16 * ((i * 37) % 10) / 10);
        const style: React.CSSProperties & Record<string, string | number> = {
          "--dx": `${dx}px`,
          "--dy": `${dy}px`,
          "--rx": `${dx + (dx >= 0 ? 150 : -150)}px`,
          "--ry": `${-dy * 0.55 - 70}px`,
          animation: `${reflects ? "photon-bounce" : "photon-fall"} ${dur}s linear ${(i * -0.41).toFixed(2)}s infinite`,
          animationPlayState: playState,
        };
        return (
          <circle
            key={`${keyPrefix}-${i}`}
            className="sim-anim"
            cx={SOURCE.x}
            cy={SOURCE.y}
            r={i % 3 === 0 ? 7 : 5.5}
            fill={i % 2 === 0 ? "url(#photonGrad)" : "#ffd60a"}
            style={style}
          />
        );
      });
    return { a: mk(A_TARGETS, false, "a"), b: mk(B_TARGETS, bReflects, "b") };
  }, [fallDur, bounceDur, playState, bReflects]);

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 1000 620"
        className="block w-full h-auto rounded-2xl"
        role="img"
        aria-label="Animated simulation: two houses under a heat source. House A has a black roof and heats up, House B has a reflective insulated roof and stays cooler."
      >
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff3d6" />
            <stop offset="55%" stopColor="#fde8bf" />
            <stop offset="100%" stopColor="#f6d9a8" />
          </linearGradient>
          <radialGradient id="hazeGrad">
            <stop offset="0%" stopColor="rgba(247,127,0,0.28)" />
            <stop offset="100%" stopColor="rgba(247,127,0,0)" />
          </radialGradient>
          <radialGradient id="sunGlow">
            <stop offset="0%" stopColor="rgba(255,214,10,0.85)" />
            <stop offset="100%" stopColor="rgba(255,214,10,0)" />
          </radialGradient>
          <radialGradient id="heatGlow">
            <stop offset="0%" stopColor="rgba(231,111,81,0.8)" />
            <stop offset="100%" stopColor="rgba(231,111,81,0)" />
          </radialGradient>
          <linearGradient id="photonGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff7cc" />
            <stop offset="100%" stopColor="#ffb703" />
          </linearGradient>
          <linearGradient id="coneGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,214,10,0.5)" />
            <stop offset="100%" stopColor="rgba(255,214,10,0.04)" />
          </linearGradient>
          <linearGradient id="foilGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f4f6f8" />
            <stop offset="45%" stopColor="#c9ced4" />
            <stop offset="70%" stopColor="#eef1f3" />
            <stop offset="100%" stopColor="#aeb6bd" />
          </linearGradient>
          <linearGradient id="doubleFoilGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#d7dde3" />
            <stop offset="60%" stopColor="#f2f5f8" />
            <stop offset="100%" stopColor="#b8c0c8" />
          </linearGradient>
          <linearGradient id="thatchGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#dbb170" />
            <stop offset="55%" stopColor="#c9a05c" />
            <stop offset="100%" stopColor="#ab8347" />
          </linearGradient>
          <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#74c69d" />
            <stop offset="60%" stopColor="#5aa469" />
            <stop offset="100%" stopColor="#40916c" />
          </linearGradient>
          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#eedeb9" />
            <stop offset="100%" stopColor="#e2cd9e" />
          </linearGradient>
          <linearGradient id="boardGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b07a45" />
            <stop offset="100%" stopColor="#8f5c30" />
          </linearGradient>
        </defs>

        {/* sky + haze + ground */}
        <rect x="0" y="0" width="1000" height="620" rx="0" fill="url(#skyGrad)" />
        <rect x="0" y="0" width="1000" height="620" fill="url(#hazeGrad)" opacity={intensity} />
        <rect x="0" y="500" width="1000" height="120" fill="url(#groundGrad)" />
        <rect x="90" y="492" width="820" height="18" rx="7" fill="url(#boardGrad)" stroke="#7c4f27" strokeWidth="1.5" />

        {/* clouds (sun mode only) */}
        {source === "sun" && (
          <g opacity="0.85">
            <g className="sim-anim" style={{ animation: "float-y 7s ease-in-out infinite", animationPlayState: playState }}>
              <ellipse cx="172" cy="120" rx="52" ry="16" fill="#fffdf6" opacity="0.9" />
              <ellipse cx="205" cy="108" rx="34" ry="13" fill="#fffdf6" opacity="0.9" />
            </g>
            <g className="sim-anim" style={{ animation: "float-y 9s ease-in-out -3s infinite", animationPlayState: playState }}>
              <ellipse cx="836" cy="96" rx="44" ry="13" fill="#fffdf6" opacity="0.8" />
              <ellipse cx="866" cy="86" rx="26" ry="10" fill="#fffdf6" opacity="0.8" />
            </g>
          </g>
        )}

        {/* ---------- heat source ---------- */}
        {source === "sun" ? (
          <g>
            <circle cx="500" cy="122" r="118" fill="url(#sunGlow)" className="sim-anim" style={{ animation: "sun-breathe 3.2s ease-in-out infinite", animationPlayState: playState, transformOrigin: "center", transformBox: "fill-box" }} />
            <g className="sim-anim" style={{ animation: "sun-breathe 3.2s ease-in-out infinite", animationPlayState: playState, transformOrigin: "center", transformBox: "fill-box" }}>
              <g stroke="#ffb703" strokeWidth="5" strokeLinecap="round">
                {Array.from({ length: 12 }).map((_, i) => {
                  const ang = (i * Math.PI) / 6;
                  const x1 = 500 + Math.cos(ang) * 52;
                  const y1 = 122 + Math.sin(ang) * 52;
                  const x2 = 500 + Math.cos(ang) * 66;
                  const y2 = 122 + Math.sin(ang) * 66;
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
                })}
              </g>
              <circle cx="500" cy="122" r="40" fill="#ffd60a" stroke="#ffb703" strokeWidth="3" />
              <circle cx="500" cy="122" r="28" fill="#ffe97a" />
            </g>
          </g>
        ) : (
          <g>
            <line x1="500" y1="0" x2="500" y2="66" stroke="#4a4a44" strokeWidth="4" />
            <path d="M 442 112 A 58 46 0 0 1 558 112 Z" fill="#31403a" stroke="#22302a" strokeWidth="2" />
            <circle cx="500" cy="114" r="24" fill="url(#sunGlow)" />
            <circle cx="500" cy="114" r="11" fill="#ffd60a" stroke="#ffb703" strokeWidth="2" />
            <polygon points="500,120 248,560 752,560" fill="url(#coneGrad)" opacity={0.25 + 0.5 * intensity} />
          </g>
        )}

        {/* ---------- photons ---------- */}
        <g opacity={photonLayerOpacity}>
          {photons.a}
          {photons.b}
        </g>

        {/* ---------- House A (black roof) ---------- */}
        <g>
          <ellipse cx="280" cy="336" rx="150" ry="64" fill="url(#heatGlow)" opacity={glowA} style={{ transition: "opacity .5s" }} />
          <rect x="175" y="352" width="210" height="140" fill={roomAirColor(temps.aIn)} stroke="#c9b98f" strokeWidth="2" style={{ transition: "fill .5s" }} />
          <rect x="338" y="428" width="34" height="64" rx="3" fill="#d9c9a4" stroke="#c0ad84" strokeWidth="1.5" />
          <circle cx="346" cy="462" r="2.4" fill="#8a7a52" />
          <Thermometer x={238} frac={thermoFraction(temps.aIn)} />
          <polygon points="150,358 410,358 280,266" fill="#26221d" stroke="#191612" strokeWidth="2" />
          <polygon points="150,358 410,358 280,266" fill="url(#heatGlow)" opacity={glowA * 0.55} style={{ transition: "opacity .5s" }} />
          {SQUIGGLES_A.map((x, i) => (
            <g
              key={i}
              className="sim-anim"
              transform={`translate(${x}, 488)`}
              style={{
                ["--heat-o" as string]: squigA,
                animation: `heat-wiggle ${1.5 + i * 0.25}s ease-in-out ${(i * -0.5).toFixed(2)}s infinite`,
                animationPlayState: playState,
                opacity: squigA > 0.03 ? 1 : 0,
              }}
            >
              <path d="M0 0 C 9 -12, -9 -22, 0 -34 C 9 -46, -9 -56, 0 -68" fill="none" stroke="#e76f51" strokeWidth="5" strokeLinecap="round" />
            </g>
          ))}
          <RoofTag x={280} y={248} temp={temps.aRoof} tone="hot" />
          <Lcd x={280} temp={temps.aIn} label="HOUSE A · BLACK CARDBOARD" />
        </g>

        {/* ---------- House B (selectable roof) ---------- */}
        <g>
          <ellipse cx="720" cy="336" rx="150" ry="64" fill="url(#heatGlow)" opacity={glowB} style={{ transition: "opacity .5s" }} />
          <rect x="615" y="352" width="210" height="140" fill={roomAirColor(temps.bIn)} stroke="#c9b98f" strokeWidth="2" style={{ transition: "fill .5s" }} />
          <rect x="778" y="428" width="34" height="64" rx="3" fill="#d9c9a4" stroke="#c0ad84" strokeWidth="1.5" />
          <circle cx="786" cy="462" r="2.4" fill="#8a7a52" />
          <Thermometer x={678} frac={thermoFraction(temps.bIn)} />

          {materialB.insulated && (
            <g>
              <polygon points="192,354 280,296 368,354 352,354 280,308 208,354" fill="#f4e3ad" stroke="#dcc687" strokeWidth="1.5" transform="translate(440, 0)" />
              <g fill="#dcc687" transform="translate(440, 0)">
                <circle cx="244" cy="332" r="2.4" />
                <circle cx="262" cy="322" r="2.4" />
                <circle cx="282" cy="314" r="2.4" />
                <circle cx="300" cy="322" r="2.4" />
                <circle cx="318" cy="332" r="2.4" />
                <circle cx="272" cy="330" r="2.4" />
                <circle cx="290" cy="330" r="2.4" />
              </g>
            </g>
          )}

          <polygon
            points="590,358 850,358 720,266"
            fill={materialB.roofFill}
            stroke={materialB.roofStroke}
            strokeWidth="2"
          />
          {materialB.id === "thatch" && (
            <g stroke="#9c7435" strokeWidth="2.4" strokeLinecap="round" opacity="0.65">
              {[0.18, 0.32, 0.46, 0.6, 0.74, 0.86].map((f, i) => {
                const y = 358 - f * 88;
                const half = (1 - f) * 130;
                return <line key={i} x1={720 - half + 10} y1={y} x2={720 + half - 10} y2={y} strokeDasharray="14 10" />;
              })}
            </g>
          )}
          {materialB.id === "green" && (
            <g>
              {[
                [652, 344], [676, 328], [700, 312], [720, 300], [742, 313], [766, 330], [790, 346],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y - 6} r={i % 2 === 0 ? 6 : 4.5} fill="#95d5b2" opacity="0.9" />
              ))}
              <circle cx="720" cy="288" r="5" fill="#ffb703" />
            </g>
          )}
          {materialB.id === "double" && (
            <g stroke="#7c868f" strokeWidth="1.6" strokeDasharray="10 7" opacity="0.7">
              <line x1="604" y1="352" x2="836" y2="352" />
            </g>
          )}
          {(materialB.id === "foil" || materialB.id === "full" || materialB.id === "double") && (
            <g className="sim-anim" style={{ animation: "foil-sparkle 2.4s ease-in-out infinite", animationPlayState: playState, transformOrigin: "center", transformBox: "fill-box" }}>
              <line x1="636" y1="340" x2="668" y2="318" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
              <line x1="776" y1="316" x2="806" y2="338" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.65" />
            </g>
          )}
          {!bReflects &&
            SQUIGGLES_B.map((x, i) => (
              <g
                key={i}
                className="sim-anim"
                transform={`translate(${x}, 488)`}
                style={{
                  ["--heat-o" as string]: squigB,
                  animation: `heat-wiggle ${1.6 + i * 0.22}s ease-in-out ${(i * -0.55).toFixed(2)}s infinite`,
                  animationPlayState: playState,
                  opacity: squigB > 0.03 ? 1 : 0,
                }}
              >
                <path d="M0 0 C 9 -12, -9 -22, 0 -34 C 9 -46, -9 -56, 0 -68" fill="none" stroke="#e76f51" strokeWidth="5" strokeLinecap="round" />
              </g>
            ))}
          {bReflects && (
            <g>
              {[660, 720, 780].map((x, i) => (
                <circle
                  key={i}
                  className="sim-anim"
                  cx={x}
                  cy={318 - Math.abs(x - 720) * 0.28}
                  r="4"
                  fill="#fff7cc"
                  style={{
                    animation: `foil-sparkle ${1.3 + i * 0.35}s ease-in-out ${(i * -0.4).toFixed(2)}s infinite`,
                    animationPlayState: playState,
                    transformOrigin: "center",
                    transformBox: "fill-box",
                  }}
                />
              ))}
            </g>
          )}
          <RoofTag x={720} y={248} temp={temps.bRoof} tone={bReflects ? "cool" : "hot"} />
          <Lcd x={720} temp={temps.bIn} label={`HOUSE B · ${materialB.name.toUpperCase()}`} />
        </g>
      </svg>

      {/* floating ΔT chip */}
      <div className="absolute left-1/2 top-[59%] -translate-x-1/2 z-10">
        <div
          className={`rounded-2xl border-2 border-ambery/70 bg-forest/90 backdrop-blur px-5 py-3 text-center shadow-xl shadow-black/20 ${Math.abs(temps.aIn - temps.bIn) > 4 ? "sim-anim" : ""}`}
          style={Math.abs(temps.aIn - temps.bIn) > 4 ? { animation: "chip-pulse 1.6s ease-in-out infinite" } : undefined}
        >
          <div className="font-display text-2xl md:text-3xl font-extrabold text-ambery leading-none tabular-nums">
            −{(temps.aIn - temps.bIn).toFixed(1)}°C
          </div>
          <div className="text-[10px] md:text-xs tracking-[0.2em] text-mint mt-1">COOLER INSIDE</div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- sub components ---------------- */

function Thermometer({ x, frac }: { x: number; frac: number }) {
  const colH = 76;
  return (
    <g>
      <rect x={x - 7} y={382} width="14" height="82" rx="7" fill="#fffdf6" stroke="#d9cdb0" strokeWidth="1.6" />
      <rect x={x - 3.4} y={388} width="6.8" height={colH} rx="3.4" fill={thermoColor(frac)} opacity="0.35" />
      <rect
        x={x - 3.4}
        y={388}
        width="6.8"
        height={colH}
        rx="3.4"
        fill={thermoColor(frac)}
        style={{ transform: `scaleY(${frac})`, transformOrigin: "center bottom", transformBox: "fill-box", transition: "transform .3s linear" }}
      />
      <circle cx={x} cy={470} r="10" fill={thermoColor(frac)} stroke="#d9cdb0" strokeWidth="1.6" style={{ transition: "fill .3s" }} />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={x + 7} y1={398 + i * 18} x2={x + 11} y2={398 + i * 18} stroke="#c0b28f" strokeWidth="1.6" />
      ))}
    </g>
  );
}

function RoofTag({ x, y, temp, tone }: { x: number; y: number; temp: number; tone: "hot" | "cool" }) {
  return (
    <g>
      <rect x={x - 62} y={y - 17} width="124" height="30" rx="15" fill={tone === "hot" ? "rgba(23,40,31,0.85)" : "rgba(27,67,50,0.85)"} stroke={tone === "hot" ? "#e76f51" : "#95d5b2"} strokeWidth="1.4" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="15" fontWeight="700" fill={tone === "hot" ? "#ffb3a0" : "#c8f5dd"} style={{ fontVariantNumeric: "tabular-nums" }}>
        roof {temp.toFixed(1)}°C
      </text>
    </g>
  );
}

function Lcd({ x, temp, label }: { x: number; temp: number; label: string }) {
  return (
    <g>
      <rect x={x - 74} y={524} width="148" height="42" rx="8" fill="#16211b" stroke="#2e4034" strokeWidth="2" />
      <rect x={x - 66} y={531} width="132" height="28" rx="4" fill="#0d1512" />
      <text x={x} y={551} textAnchor="middle" fontSize="21" fontWeight="700" fill="#9bf6b9" style={{ fontFamily: "var(--font-geist-mono), monospace", fontVariantNumeric: "tabular-nums" }}>
        {temp.toFixed(1)}°C
      </text>
      <text x={x} y={586} textAnchor="middle" fontSize="12.5" fontWeight="700" letterSpacing="1.6" fill="#5c6f63">
        {label}
      </text>
    </g>
  );
}

export const SCENE_MEASURED = { a: MEASURED_A, b: MEASURED_B };
