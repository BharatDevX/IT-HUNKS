/**
 * Spatial layout of the Trackzy ecosystem: panel sizes, per-stage poses and camera paths.
 * Pure data + math (no three.js import) so it is shared by the WebGL scene and can be unit-checked in isolation.
 *
 * World units: the Trackzy emblem is 1.5 wide. +x right, +y up, +z towards the camera.
 */
export type PanelId = "dash" | "phone" | "sales" | "flow" | "map" | "notif" | "v1" | "v2" | "v3";
export type PoseId = PanelId | "logo";

export type Pose = { x: number; y: number; z: number; rx: number; ry: number; rz: number; s: number; o: number };
export type CamPose = { x: number; y: number; z: number; lx: number; ly: number; lz: number };
export type Stage = { name: string; cam: CamPose; poses: Record<PoseId, Pose> };

export const FOV = 32;
export const REF_DIST = 9.2; // camera distance of stage 0 before fitting
export const COMP_W = 7.4; // overall width of the stage-0 composition
export const COMP_H = 4.9;

export const PANEL_IDS: PanelId[] = ["dash", "phone", "sales", "flow", "map", "notif", "v1", "v2", "v3"];

/** World size of each panel plane [w, h]. Aspect ratios match the canvas "design" sizes in panels.ts. */
export const PANEL_SIZE: Record<PanelId, [number, number]> = {
  dash: [4.4, 2.13],
  phone: [1.05, 2.15],
  sales: [1.9, 0.915],
  flow: [2.3, 1.05],
  map: [1.8, 1.35],
  notif: [1.5, 0.62],
  v1: [2.1, 2.6],
  v2: [2.1, 2.6],
  v3: [2.1, 2.6],
};

const P = (x: number, y: number, z: number, ry = 0, s = 1, o = 1, rx = 0, rz = 0): Pose => ({ x, y, z, rx, ry, rz, s, o });
const C = (x: number, y: number, z: number, lx: number, ly: number, lz: number): CamPose => ({ x, y, z, lx, ly, lz });

// Hidden variant cards wait behind the emblem until the "customization" stage.
const hiddenV = { v1: P(-0.4, 0, -1.2, 0.2, 0.7, 0), v2: P(0, 0, -1.4, 0, 0.7, 0), v3: P(0.4, 0, -1.2, -0.2, 0.7, 0) };

export const STAGES: Stage[] = [
  {
    // A — one platform, connected operations
    name: "overview",
    cam: C(0.6, 0.35, 9.2, 0, 0.1, 0),
    poses: {
      logo: P(0, 0.1, 0.9, 0, 1.3),
      dash: P(-0.4, 0.55, -2.4, 0.14),
      phone: P(2.1, -0.55, 0.9, -0.28),
      sales: P(-2.6, -1.2, 0.5, 0.32),
      flow: P(2.55, 1.5, -0.4, -0.22),
      map: P(-2.75, 1.4, -0.2, 0.3),
      notif: P(0.7, -1.8, 1.3, -0.1),
      ...hiddenV,
    },
  },
  {
    // B — visibility and control: camera moves in on the admin dashboard
    name: "dashboard",
    cam: C(-0.35, 0.6, 4.3, -0.5, 0.55, -2.4),
    poses: {
      logo: P(-2.45, -1.5, -2.0, 0.12, 0.42),
      dash: P(-0.5, 0.55, -2.4, 0.04, 1),
      phone: P(3.4, -1.0, 0.2, -0.35, 1, 0.3),
      sales: P(-3.5, -1.7, -0.8, 0.35, 1, 0.3),
      flow: P(3.6, 1.8, -1.2, -0.3, 1, 0.3),
      map: P(-3.8, 1.9, -1.0, 0.35, 1, 0.3),
      notif: P(1.5, -2.3, 0.2, -0.1, 1, 0.3),
      ...hiddenV,
    },
  },
  {
    // C — business in motion: the mobile employee app, route and timeline
    name: "mobile",
    cam: C(0.4, 0.1, 6.5, 0.2, -0.1, 0.7),
    poses: {
      logo: P(-1.75, 1.7, -0.6, 0.15, 0.42),
      dash: P(-1.0, 0.95, -3.3, 0.1, 1, 0.35),
      phone: P(1.0, -0.1, 0.9, -0.14, 1.05),
      sales: P(-3.7, -1.7, -1.2, 0.35, 1, 0.25),
      flow: P(-1.05, -1.1, 0.25, 0.22, 0.9),
      map: P(-1.2, 0.55, 0.45, 0.24, 1.1),
      notif: P(1.95, -1.65, 0.4, -0.2),
      ...hiddenV,
    },
  },
  {
    // D — sales and workflows: panels line up into a left→right pipeline
    name: "workflow",
    cam: C(0.4, 0.25, 8.6, 0.4, 0, 0),
    poses: {
      logo: P(0.3, 1.85, -0.8, 0, 0.5),
      phone: P(-2.6, -0.05, 0.3, 0.25, 0.85),
      flow: P(-0.35, 0.1, 0.4, 0, 1.1),
      notif: P(0.2, -1.5, 0.5, 0, 0.9),
      sales: P(1.85, 1.5, -0.2, -0.2, 0.8),
      dash: P(2.6, -0.3, -0.8, -0.22, 0.62),
      map: P(-2.4, 1.6, -0.3, 0.3, 0.7, 0.55),
      ...hiddenV,
    },
  },
  {
    // E — customization: the interface reorganizes into configurable variants
    name: "custom",
    cam: C(0, 0.1, 9.0, 0, 0.1, 0),
    poses: {
      logo: P(0, 2.05, 0.6, 0, 0.5),
      v1: P(-2.3, 0, 0.4, 0.3, 0.95),
      v2: P(0, 0.1, 0.9, 0, 1),
      v3: P(2.3, 0, 0.4, -0.3, 0.95),
      dash: P(-0.5, 0.6, -3.4, 0.1, 1.1, 0.3),
      phone: P(3.1, -0.9, -1.6, -0.3, 1, 0.25),
      sales: P(-3.6, -1.5, -1.6, 0.35, 1, 0.2),
      flow: P(3.8, 1.9, -1.8, -0.3, 1, 0.2),
      map: P(-3.8, 1.9, -1.8, 0.3, 1, 0.2),
      notif: P(0.1, -2.1, -0.8, 0, 1, 0.25),
    },
  },
];

/** Connections drawn between nodes; `w` is the line visibility in each stage. */
export type Connection = { a: PoseId; b: PoseId; w: number[] };
export const CONNECTIONS: Connection[] = [
  { a: "logo", b: "dash", w: [1, 0.5, 0.3, 0.3, 0.2] },
  { a: "logo", b: "phone", w: [1, 0.2, 0.9, 0.6, 0.2] },
  { a: "logo", b: "sales", w: [1, 0.2, 0.1, 0.6, 0.2] },
  { a: "logo", b: "flow", w: [1, 0.2, 0.5, 0.6, 0.2] },
  { a: "logo", b: "map", w: [1, 0.2, 0.6, 0.3, 0.2] },
  { a: "logo", b: "notif", w: [1, 0.2, 0.5, 0.4, 0.2] },
  { a: "phone", b: "flow", w: [0, 0, 0.8, 1, 0] },
  { a: "flow", b: "dash", w: [0, 0, 0, 1, 0] },
  { a: "sales", b: "dash", w: [0, 0, 0, 1, 0] },
  { a: "logo", b: "v1", w: [0, 0, 0, 0, 1] },
  { a: "logo", b: "v2", w: [0, 0, 0, 0, 1] },
  { a: "logo", b: "v3", w: [0, 0, 0, 0, 1] },
];

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

const POSE_KEYS: (keyof Pose)[] = ["x", "y", "z", "rx", "ry", "rz", "s", "o"];
const CAM_KEYS: (keyof CamPose)[] = ["x", "y", "z", "lx", "ly", "lz"];

export function mixPose(a: Pose, b: Pose, t: number): Pose {
  const out = {} as Pose;
  for (const k of POSE_KEYS) out[k] = mix(a[k], b[k], t);
  return out;
}

/**
 * Pose of everything at a fractional stage position `t` (0 … STAGES.length-1).
 * `dwell` adds a plateau at each stage so the camera rests there while captions are read.
 */
export function blendStages(t: number, dwell: boolean) {
  const n = STAGES.length - 1;
  const tt = Math.min(n, Math.max(0, t));
  const i = Math.min(n - 1, Math.floor(tt));
  const f = tt - i;
  const e = dwell ? smoothstep(0.16, 0.84, f) : smoothstep(0, 1, f);
  const A = STAGES[i];
  const B = STAGES[i + 1];
  const cam = {} as CamPose;
  for (const k of CAM_KEYS) cam[k] = mix(A.cam[k], B.cam[k], e);
  const poses = {} as Record<PoseId, Pose>;
  (Object.keys(A.poses) as PoseId[]).forEach((id) => (poses[id] = mixPose(A.poses[id], B.poses[id], e)));
  const weights = (c: Connection) => mix(c.w[i], c.w[i + 1], e);
  return { cam, poses, weights };
}

export type LayoutKind = "side" | "center";
/** Wide canvases keep the copy on the left and the scene on the right; narrow ones stack. */
export const layoutKind = (aspect: number): LayoutKind => (aspect >= 1.2 ? "side" : "center");

/**
 * How far the stage-0 camera must move back so the composition fits.
 * Returns a multiplier of REF_DIST plus the screen-space shift (fractions of the canvas) of the scene centre.
 */
export function fitCamera(aspect: number, kind: LayoutKind, bottomCopy = false) {
  const half = Math.tan((FOV * Math.PI) / 360);
  const availW = kind === "side" ? 0.56 : 0.96;
  const availH = kind === "center" && bottomCopy ? 0.62 : 0.8;
  const dW = COMP_W / (availW * aspect * 2 * half);
  const dH = COMP_H / (availH * 2 * half);
  const factor = Math.max(dW, dH) / REF_DIST;
  const shiftX = kind === "side" ? 0.22 : 0;
  const shiftY = kind === "center" && bottomCopy ? 0.17 : 0; // positive moves the scene up
  return { factor: Math.max(0.85, factor), shiftX, shiftY };
}
