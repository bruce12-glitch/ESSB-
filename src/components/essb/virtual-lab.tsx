"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
    HistoryPoint,
    MATERIALS,
    MATERIAL_LIST,
    MaterialId,
    ROOF_RATE,
    SimState,
    T_AMB,
    indoorRate,
    indoorTarget,
    initialState,
    predictSteady,
    roofTemp,
    stepTemp,
} from "@/lib/sim-engine";
import { CloudSun, FlaskConical, Gauge, LampCeiling, Layers, Leaf, Pause, Play, RotateCcw, Sparkles, Sun } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SceneTemps, SimScene } from "./sim-scene";
import { TempChart } from "./temp-chart";

type Source = "sun" | "lamp";

interface UiTick {
  temps: SceneTemps;
  elapsed: number;
}

const initialUi: UiTick = {
  temps: { aRoof: T_AMB, aIn: T_AMB, bRoof: T_AMB, bIn: T_AMB },
  elapsed: 0,
};

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function VirtualLab() {
  const [source, setSource] = useState<Source>("lamp");
  const [intensity, setIntensity] = useState(1);
  const [materialB, setMaterialB] = useState<MaterialId>("full");
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [ui, setUi] = useState<UiTick>(initialUi);

  const speedRef = useRef(speed);
  speedRef.current = speed;

  const simRef = useRef<{ state: SimState; sincePush: number; sinceUi: number }>({
    state: initialState(),
    sincePush: 0,
    sinceUi: 0,
  });
  const historyRef = useRef<HistoryPoint[]>([]);

  const matB = MATERIALS[materialB];

  const reset = useCallback(() => {
    simRef.current.state = initialState();
    simRef.current.sincePush = 0;
    simRef.current.sinceUi = 0;
    historyRef.current = [];
    setUi(initialUi);
  }, []);

  /* ---------------- physics loop ---------------- */
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000) * speedRef.current;
      last = now;
      const sim = simRef.current;
      const s = sim.state;

      const roofA = roofTemp(MATERIALS.black, intensity);
      const inA = indoorTarget(MATERIALS.black, intensity);
      const roofB = roofTemp(matB, intensity);
      const inB = indoorTarget(matB, intensity);

      s.aRoof = stepTemp(s.aRoof, roofA, dt, ROOF_RATE);
      s.aIn = stepTemp(s.aIn, inA, dt, indoorRate(MATERIALS.black));
      s.bRoof = stepTemp(s.bRoof, roofB, dt, ROOF_RATE);
      s.bIn = stepTemp(s.bIn, inB, dt, indoorRate(matB));
      s.elapsed += dt;

      sim.sincePush += dt;
      if (sim.sincePush >= 0.5) {
        sim.sincePush = 0;
        const hist = historyRef.current;
        hist.push({ t: s.elapsed, a: s.aIn, b: s.bIn });
        if (hist.length > 800) hist.shift();
      }
      sim.sinceUi += dt;
      if (sim.sinceUi >= 0.12) {
        sim.sinceUi = 0;
        setUi({
          temps: { aRoof: s.aRoof, aIn: s.aIn, bRoof: s.bRoof, bIn: s.bIn },
          elapsed: s.elapsed,
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, intensity, matB]);

  const applyPreset = (p: { source: Source; intensity: number; material: MaterialId }) => {
    setSource(p.source);
    setIntensity(p.intensity);
    setMaterialB(p.material);
    reset();
    setRunning(true);
  };

  const dt = ui.temps.aIn - ui.temps.bIn;
  const steady = predictSteady(matB, intensity);
  const settled =
    ui.elapsed > 2 &&
    Math.abs(ui.temps.aIn - steady.a) < 0.25 &&
    Math.abs(ui.temps.bIn - steady.b) < 0.25;

  return (
    <div className="rounded-3xl bg-[#10231c] border border-white/10 shadow-2xl shadow-forest/40 overflow-hidden">
      {/* ---------- scene ---------- */}
      <div className="p-3 sm:p-5 pb-0">
        <SimScene source={source} intensity={intensity} running={running} materialB={matB} temps={ui.temps} />
      </div>

      {/* ---------- readouts ---------- */}
      <div className="px-3 sm:px-5 pt-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          <Readout
            label="HOUSE A · INSIDE"
            value={`${ui.temps.aIn.toFixed(1)}°C`}
            sub={`roof ${ui.temps.aRoof.toFixed(1)}°C`}
            tone="hot"
          />
          <Readout
            label="HOUSE B · INSIDE"
            value={`${ui.temps.bIn.toFixed(1)}°C`}
            sub={`roof ${ui.temps.bRoof.toFixed(1)}°C`}
            tone="cool"
          />
          <Readout label="DIFFERENCE" value={`−${dt.toFixed(1)}°C`} sub="House B vs House A" tone="amber" />
          <Readout
            label="ELAPSED"
            value={fmtTime(ui.elapsed)}
            sub={settled ? "✓ steady state reached" : running ? "heating up…" : "experiment clock"}
            tone={settled ? "cool" : "neutral"}
          />
        </div>
      </div>

      {/* ---------- controls ---------- */}
      <div className="p-3 sm:p-5 grid lg:grid-cols-5 gap-4">
        {/* heat source + power */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <div className="text-[11px] font-bold tracking-[0.18em] text-mint/80 mb-2">HEAT SOURCE</div>
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Heat source">
              <SourceButton active={source === "sun"} onClick={() => setSource("sun")} icon={<Sun className="w-4 h-4" />} title="Real sun" sub="a hot day outdoors" />
              <SourceButton active={source === "lamp"} onClick={() => setSource("lamp")} icon={<LampCeiling className="w-4 h-4" />} title="Heat lamp" sub="our bench test" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold tracking-[0.18em] text-mint/80">
                {source === "sun" ? "SUN INTENSITY" : "LAMP POWER"}
              </span>
              <span className="font-mono text-sm text-ambery font-bold tabular-nums">{Math.round(intensity * 100)}%</span>
            </div>
            <Slider
              value={[Math.round(intensity * 100)]}
              min={0}
              max={100}
              step={5}
              onValueChange={(v) => setIntensity((v[0] ?? 0) / 100)}
              aria-label={source === "sun" ? "Sun intensity" : "Lamp power"}
              className="[&_[role=slider]]:border-ambery [&_[role=slider]]:bg-ambery"
            />
            <div className="flex justify-between text-[10px] text-cream/40 mt-1.5 font-mono">
              <span>dim</span>
              <span>full power — the real test</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setRunning((r) => !r)}
              className="flex-1 min-w-28 bg-ambery hover:bg-sun text-forest font-bold transition-transform active:scale-95"
              aria-label={running ? "Pause simulation" : "Start simulation"}
            >
              {running ? <Pause className="w-4 h-4 mr-1.5" /> : <Play className="w-4 h-4 mr-1.5" />}
              {running ? "Pause" : "Start"}
            </Button>
            <Button onClick={reset} variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10 text-cream" aria-label="Reset simulation">
              <RotateCcw className="w-4 h-4 mr-1.5" /> Reset
            </Button>
          </div>

          <div>
            <div className="text-[11px] font-bold tracking-[0.18em] text-mint/80 mb-2 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5" /> TIME SPEED
            </div>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Simulation speed">
              {([1, 2, 4] as const).map((s) => (
                <button
                  key={s}
                  role="radio"
                  aria-checked={speed === s}
                  onClick={() => setSpeed(s)}
                  className={`rounded-xl border py-2 text-sm font-bold font-mono transition-all ${
                    speed === s
                      ? "border-ambery bg-pine/40 text-ambery ring-2 ring-ambery/60"
                      : "border-white/10 bg-white/[0.04] text-cream/70 hover:bg-white/[0.08]"
                  }`}
                >
                  {s}×
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold tracking-[0.18em] text-mint/80 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> TRY A PRESET
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              <PresetButton onClick={() => applyPreset({ source: "lamp", intensity: 1, material: "full" })} icon={<FlaskConical className="w-3.5 h-3.5" />} label="Our lab test" />
              <PresetButton onClick={() => applyPreset({ source: "sun", intensity: 1, material: "white" })} icon={<CloudSun className="w-3.5 h-3.5" />} label="White paint" />
              <PresetButton onClick={() => applyPreset({ source: "sun", intensity: 0.35, material: "full" })} icon={<CloudSun className="w-3.5 h-3.5" />} label="Cloudy noon" />
              <PresetButton onClick={() => applyPreset({ source: "sun", intensity: 1, material: "double" })} icon={<Layers className="w-3.5 h-3.5" />} label="Double foil" />
              <PresetButton onClick={() => applyPreset({ source: "sun", intensity: 1, material: "green" })} icon={<Leaf className="w-3.5 h-3.5" />} label="Green roof" />
            </div>
          </div>
        </div>

        {/* material selector */}
        <div className="lg:col-span-3">
          <div className="text-[11px] font-bold tracking-[0.18em] text-mint/80 mb-2">HOUSE B ROOF — PICK A MATERIAL</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2" role="radiogroup" aria-label="House B roof material">
            {MATERIAL_LIST.map((m) => {
              const active = m.id === materialB;
              return (
                <button
                  key={m.id}
                  role="radio"
                  aria-checked={active}
                  onClick={() => setMaterialB(m.id)}
                  className={`text-left rounded-xl border p-3 transition-all min-h-20 active:scale-[0.98] ${
                    active
                      ? "border-ambery bg-pine/40 ring-2 ring-ambery/60"
                      : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/25 hover:-translate-y-0.5"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-block w-7 h-7 rounded-lg border-2 shadow-inner" style={{ background: m.swatch, borderColor: m.id === "black" ? "#000" : "rgba(0,0,0,0.25)" }} />
                    {m.insulated && <span className="text-[8.5px] font-extrabold tracking-wider bg-ambery text-forest rounded-full px-1.5 py-0.5">REFLECT + INSULATE</span>}
                  </div>
                  <div className="text-[13px] font-bold text-cream leading-tight">{m.name}</div>
                  <div className="text-[10.5px] text-mint/80 mt-0.5">{m.reflectLabel}</div>
                  <div className="text-[10.5px] text-cream/45 leading-snug mt-0.5">{m.tag}</div>
                </button>
              );
            })}
          </div>
          <div className="mt-3 rounded-xl border border-ambery/30 bg-ambery/[0.07] p-3 text-[12px] leading-relaxed text-cream/80 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <span className="font-bold text-ambery">Prediction:</span> at {Math.round(intensity * 100)}% power, House B settles at{" "}
              <span className="font-mono font-bold text-mint">{steady.b.toFixed(1)}°C</span> —{" "}
              <span className="font-mono font-bold text-ambery">{steady.delta.toFixed(1)}°C cooler</span> than House A ({" "}
              <span className="font-mono">{steady.a.toFixed(1)}°C</span>).
            </div>
            {settled && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/15 border border-mint/40 text-mint text-[10.5px] font-bold tracking-wider px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" /> STEADY STATE
              </span>
            )}
          </div>
          <div className="mt-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[12px] leading-relaxed text-cream/70">
            <span className="font-bold text-mint">What to watch:</span> sunlight photons bounce off reflective roofs but sink into the black one — the roof surface climbs fast toward{" "}
            <span className="font-mono text-clay">{roofTemp(MATERIALS.black, intensity).toFixed(0)}°C</span>, and that heat leaks slowly into the room below. Insulation under the roof slows whatever still
            gets through even more. This simplified single-zone model is calibrated to reproduce our measured result —{" "}
            <span className="font-mono text-ambery">42.6°C vs 31.8°C at full power</span>.
          </div>
        </div>
      </div>

      {/* ---------- chart ---------- */}
      <div className="px-3 sm:px-5 pb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[11px] font-bold tracking-[0.18em] text-mint/80">LIVE TEMPERATURE TRACE</div>
          <div className="text-[10.5px] text-cream/40 font-mono">sliding 180 s window</div>
        </div>
        <TempChart historyRef={historyRef} />
      </div>
    </div>
  );
}

/* ---------------- small pieces ---------------- */

function Readout({ label, value, sub, tone }: { label: string; value: string; sub: string; tone: "hot" | "cool" | "amber" | "neutral" }) {
  const color =
    tone === "hot" ? "text-clay" : tone === "cool" ? "text-mint" : tone === "amber" ? "text-ambery" : "text-cream/80";
  const ring = tone === "hot" ? "border-clay/40" : tone === "cool" ? "border-mint/40" : tone === "amber" ? "border-ambery/40" : "border-white/10";
  return (
    <div className={`rounded-xl border ${ring} bg-[#16211b] px-3 py-2.5`}>
      <div className="text-[9.5px] font-bold tracking-[0.16em] text-cream/50">{label}</div>
      <div className={`font-display text-xl sm:text-2xl font-extrabold tabular-nums ${color} mt-0.5 leading-none`}>{value}</div>
      <div className="text-[10px] text-cream/40 mt-1 font-mono">{sub}</div>
    </div>
  );
}

function SourceButton({ active, onClick, icon, title, sub }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; sub: string }) {
  return (
    <button
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all ${
        active ? "border-ambery bg-pine/40 ring-2 ring-ambery/60" : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]"
      }`}
    >
      <span className={`grid place-items-center w-8 h-8 rounded-lg ${active ? "bg-ambery text-forest" : "bg-white/10 text-cream/70"}`}>{icon}</span>
      <span>
        <span className="block text-[13px] font-bold text-cream leading-none">{title}</span>
        <span className="block text-[10.5px] text-cream/50 mt-1">{sub}</span>
      </span>
    </button>
  );
}

function PresetButton({ onClick, icon, label }: { onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="sm"
      className="border-white/15 bg-white/[0.04] hover:bg-white/10 hover:border-ambery/50 text-cream/90 text-xs h-9"
    >
      {icon}
      <span className="ml-1.5">{label}</span>
    </Button>
  );
}
