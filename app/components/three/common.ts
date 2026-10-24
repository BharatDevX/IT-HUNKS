import type { SceneContext, ThreeModule } from "./types";

export const PALETTE = {
  deep: 0x050a18,
  blue: 0x3b82f6,
  electric: 0x2f6bff,
  cyan: 0x22d3ee,
  purple: 0x8b5cf6,
  white: 0xdbeafe,
};

export function createRenderer(ctx: SceneContext, dprCap = 1.75) {
  const { THREE, canvas, width, height, lite } = ctx;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !lite,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(maxDprFor(lite, dprCap));
  renderer.setSize(width, height, false);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  return renderer;
}

/** Soft radial glow texture (generated, no network assets). */
export function glowTexture(THREE: ThreeModule, color = "#60a5fa") {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, color);
  grad.addColorStop(0.25, color + "88");
  grad.addColorStop(1, "#00000000");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function glowSprite(THREE: ThreeModule, tex: import("three").Texture, size: number, opacity = 1, color = 0xffffff) {
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending, color });
  const s = new THREE.Sprite(mat);
  s.scale.setScalar(size);
  return s;
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Deterministic PRNG so layouts are stable between renders. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Dispose every geometry/material/texture under an object. */
export function disposeTree(root: import("three").Object3D) {
  root.traverse((obj) => {
    const o = obj as import("three").Mesh;
    o.geometry?.dispose?.();
    const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
    mats.forEach((m) => {
      const mm = m as import("three").Material & { map?: import("three").Texture | null };
      mm.map?.dispose?.();
      mm.dispose();
    });
  });
}

export function maxDprFor(lite: boolean, cap: number) {
  return Math.min(window.devicePixelRatio || 1, lite ? 1.25 : cap);
}
