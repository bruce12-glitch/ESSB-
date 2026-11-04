/**
 * ESSB Roof Insulation — Virtual Lab physics engine.
 *
 * A deliberately simple, transparent single-zone model:
 *
 *   Roof surface equilibrium :  T_roof = T_amb + absorb × I × K_ROOF
 *   Indoor equilibrium       :  T_in  = (u × T_roof + v × T_amb) / (u + v)
 *   Dynamics                 :  dT/dt = k × (T_target − T)
 *
 * The coefficients are calibrated so that, at full power (I = 1),
 * House A (black cardboard, uninsulated) settles at ≈ 42.6 °C and
 * House B (aluminium foil over foam / cotton) at ≈ 31.8 °C — exactly
 * the temperatures the team measured under the heat lamp.
 */

export type MaterialId = "black" | "white" | "foil" | "full";

export interface Material {
  id: MaterialId;
  name: string;
  tag: string;
  /** solar absorptance (fraction of incoming energy kept) */
  absorb: number;
  /** conduction factor from roof surface into the room */
  u: number;
  /** visual roof fill for the SVG scene */
  swatch: string;
  reflectLabel: string;
  insulated: boolean;
}

export const MATERIALS: Record<MaterialId, Material> = {
  black: {
    id: "black",
    name: "Black cardboard",
    tag: "uninsulated — the baseline",
    absorb: 0.9,
    u: 0.3,
    swatch: "#26221d",
    reflectLabel: "reflects ~10%",
    insulated: false,
  },
  white: {
    id: "white",
    name: "White reflective paint",
    tag: "cool-roof coating",
    absorb: 0.35,
    u: 0.3,
    swatch: "#f2ede1",
    reflectLabel: "reflects ~65%",
    insulated: false,
  },
  foil: {
    id: "foil",
    name: "Aluminium foil",
    tag: "reflective sheet only",
    absorb: 0.26,
    u: 0.3,
    swatch: "#c9ced4",
    reflectLabel: "reflects ~74%",
    insulated: false,
  },
  full: {
    id: "full",
    name: "Foil over foam / cotton",
    tag: "reflect + insulate — House B",
    absorb: 0.26,
    u: 0.12,
    swatch: "#dfe4e9",
    reflectLabel: "reflects ~74%",
    insulated: true,
  },
};

export const MATERIAL_LIST: Material[] = [
  MATERIALS.black,
  MATERIALS.white,
  MATERIALS.foil,
  MATERIALS.full,
];

export const T_AMB = 30; // °C, a hot day in the lab
export const K_ROOF = 46.7; // surface heating coefficient at I = 1
export const V_LOSS = 0.7; // room heat-loss coefficient to ambient
export const K_RATE = 0.055; // per-second relaxation rate
export const HISTORY_WINDOW_S = 180; // seconds of history kept

export function roofTemp(mat: Material, intensity: number): number {
  return T_AMB + mat.absorb * intensity * K_ROOF;
}

export function indoorTarget(mat: Material, intensity: number): number {
  const tr = roofTemp(mat, intensity);
  return (mat.u * tr + V_LOSS * T_AMB) / (mat.u + V_LOSS);
}

/** Advance one temperature toward its equilibrium (exact exponential step). */
export function stepTemp(temp: number, target: number, dt: number): number {
  return temp + (target - temp) * (1 - Math.exp(-K_RATE * dt));
}

export interface SimState {
  aRoof: number;
  aIn: number;
  bRoof: number;
  bIn: number;
  elapsed: number;
}

export interface HistoryPoint {
  t: number;
  a: number;
  b: number;
}

export function initialState(): SimState {
  return { aRoof: T_AMB, aIn: T_AMB, bRoof: T_AMB, bIn: T_AMB, elapsed: 0 };
}

export const MEASURED_A = 42.6;
export const MEASURED_B = 31.8;
export const MEASURED_DT = 10.8;

/** Interpolate a warm "room air" colour between cool and hot. */
export function roomAirColor(temp: number): string {
  const t = Math.min(1, Math.max(0, (temp - T_AMB) / 14));
  const from = { r: 251, g: 243, b: 228 };
  const to = { r: 246, g: 187, b: 143 };
  const r = Math.round(from.r + (to.r - from.r) * t);
  const g = Math.round(from.g + (to.g - from.g) * t);
  const b = Math.round(from.b + (to.b - from.b) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

/** Height (0–1) of the thermometer column for a temperature. */
export function thermoFraction(temp: number): number {
  return Math.min(1, Math.max(0.04, (temp - 26) / (48 - 26)));
}
