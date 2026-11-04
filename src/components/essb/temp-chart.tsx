"use client";

import { HISTORY_WINDOW_S, HistoryPoint, MEASURED_A, MEASURED_B, T_AMB } from "@/lib/sim-engine";
import { useEffect, useRef } from "react";

interface TempChartProps {
  historyRef: React.MutableRefObject<HistoryPoint[]>;
}

const COL_A = "#f77f00";
const COL_B = "#74c69d";
const GRID = "rgba(250,244,230,0.09)";
const TEXT = "rgba(250,244,230,0.6)";

const T_MIN = 26;
const T_MAX = 50;

export function TempChart({ historyRef }: TempChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let stop = false;

    const draw = () => {
      if (stop) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const padL = 34;
      const padR = 12;
      const padT = 12;
      const padB = 22;
      const iw = w - padL - padR;
      const ih = h - padT - padB;

      const hist = historyRef.current;
      const tNow = hist.length ? hist[hist.length - 1].t : 0;
      const t0 = Math.max(0, tNow - HISTORY_WINDOW_S);
      const xOf = (t: number) => padL + ((t - t0) / HISTORY_WINDOW_S) * iw;
      const yOf = (temp: number) => padT + (1 - (temp - T_MIN) / (T_MAX - T_MIN)) * ih;

      // grid
      ctx.strokeStyle = GRID;
      ctx.fillStyle = TEXT;
      ctx.lineWidth = 1;
      ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
      for (let t = 28; t <= 48; t += 4) {
        const y = yOf(t);
        ctx.beginPath();
        ctx.moveTo(padL, y);
        ctx.lineTo(w - padR, y);
        ctx.stroke();
        ctx.textAlign = "right";
        ctx.fillText(`${t}°`, padL - 5, y + 3);
      }

      // time ticks every 30 s
      ctx.textAlign = "center";
      const step = 30;
      const first = Math.ceil(t0 / step) * step;
      for (let t = first; t <= tNow; t += step) {
        const x = xOf(t);
        ctx.strokeStyle = GRID;
        ctx.beginPath();
        ctx.moveTo(x, padT);
        ctx.lineTo(x, padT + ih);
        ctx.stroke();
        ctx.fillText(`${t}s`, x, h - 7);
      }

      // reference lines
      const refLine = (temp: number, color: string, label: string, align: "left" | "right" = "left") => {
        const y = yOf(temp);
        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.75;
        ctx.beginPath();
        ctx.moveTo(padL, y);
        ctx.lineTo(w - padR, y);
        ctx.stroke();
        ctx.restore();
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.95;
        if (align === "left") {
          ctx.textAlign = "left";
          ctx.fillText(label, padL + 6, y - 4);
        } else {
          ctx.textAlign = "right";
          ctx.fillText(label, w - padR - 6, y + 13);
        }
        ctx.globalAlpha = 1;
      };
      refLine(T_AMB, "rgba(250,244,230,0.45)", "outdoor 30°C", "right");
      refLine(MEASURED_A, COL_A, "measured 42.6°C");
      refLine(MEASURED_B, COL_B, "measured 31.8°C");

      // data lines
      const line = (key: "a" | "b", color: string) => {
        if (!hist.length) return;
        const pts = hist.filter((p) => p.t >= t0);
        if (!pts.length) return;

        // soft gradient area under the curve
        const area = ctx.createLinearGradient(0, padT, 0, padT + ih);
        area.addColorStop(0, `${color}44`);
        area.addColorStop(1, `${color}00`);
        ctx.fillStyle = area;
        ctx.beginPath();
        ctx.moveTo(xOf(pts[0].t), padT + ih);
        for (const p of pts) ctx.lineTo(xOf(p.t), yOf(p[key]));
        ctx.lineTo(xOf(pts[pts.length - 1].t), padT + ih);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = color;
        ctx.lineWidth = 2.4;
        ctx.lineJoin = "round";
        ctx.beginPath();
        let started = false;
        for (const p of hist) {
          if (p.t < t0) continue;
          const x = xOf(p.t);
          const y = yOf(p[key]);
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        // glowing head dot
        const last = hist[hist.length - 1];
        const x = xOf(last.t);
        const y = yOf(last[key]);
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.font = "bold 11px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.textAlign = x > w - 60 ? "right" : "left";
        ctx.fillText(`${last[key].toFixed(1)}°C`, x + (x > w - 60 ? -8 : 8), y - 6);
        ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
      };
      line("a", COL_A);
      line("b", COL_B);

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      stop = true;
      cancelAnimationFrame(raf);
    };
  }, [historyRef]);

  return (
    <div className="relative w-full h-52 md:h-60 rounded-xl bg-[#0d1f19] border border-white/10 overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" aria-label="Live chart of indoor temperatures in both houses over time" />
      <div className="absolute top-2 right-3 flex items-center gap-4 text-[10px] md:text-xs">
        <span className="flex items-center gap-1.5 text-cream/80">
          <span className="inline-block w-3 h-[3px] rounded" style={{ background: COL_A }} /> House A
        </span>
        <span className="flex items-center gap-1.5 text-cream/80">
          <span className="inline-block w-3 h-[3px] rounded" style={{ background: COL_B }} /> House B
        </span>
      </div>
    </div>
  );
}
