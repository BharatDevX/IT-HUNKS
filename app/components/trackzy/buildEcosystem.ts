import type * as T from "three";
import type { SceneContext, SceneFrame, SceneInstance } from "../three/types";
import { createRenderer, disposeTree, glowSprite, glowTexture, rng } from "../three/common";
import {
  CONNECTIONS,
  PANEL_IDS,
  PANEL_SIZE,
  STAGES,
  blendStages,
  clamp01,
  easeOutCubic,
  fitCamera,
  layoutKind,
  smoothstep,
  type PanelId,
  type PoseId,
} from "./layout";
import { PANEL_SPECS } from "./panels";

export type EcosystemOptions = {
  /** "hero": plays the 5-second intro once, then scroll-leave progress nudges the camera.
   *  "story": no intro; progress (0..1) walks through every stage. */
  mode: "hero" | "story";
  /** Narrow layouts put the copy below the scene area (story captions) — lifts the scene up. */
  bottomCopy?: boolean;
};

/** Intro choreography (seconds). Total ≈ 5 s: arrive (0–1.2) → emblem (1.1–2.7) → panels (2.3–5) → alive. */
const ENTRY: Record<PanelId, { start: number; dur: number; from: [number, number, number] }> = {
  dash: { start: 2.3, dur: 1.5, from: [0, 0.4, -5] },
  phone: { start: 2.65, dur: 1.4, from: [2.6, -1.5, 4] },
  sales: { start: 2.95, dur: 1.3, from: [-3, -2, 3] },
  flow: { start: 3.25, dur: 1.3, from: [3, 2, -3] },
  map: { start: 3.5, dur: 1.3, from: [-3, 2, -3.5] },
  notif: { start: 3.75, dur: 1.2, from: [0, -2.5, 3] },
  v1: { start: 0, dur: 0.01, from: [0, 0, 0] },
  v2: { start: 0, dur: 0.01, from: [0, 0, 0] },
  v3: { start: 0, dur: 0.01, from: [0, 0, 0] },
};

const LOGO_W = 1.28;
const CURVE_N = 36;

export function createEcosystem(ctx: SceneContext, opts: EcosystemOptions): SceneInstance {
  const { THREE, lite, reduced } = ctx;
  const hero = opts.mode === "hero";
  const renderer = createRenderer(ctx, 1.75);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const root = new THREE.Group();
  scene.add(root);
  const camera = new THREE.PerspectiveCamera(32, ctx.width / ctx.height, 0.1, 120);
  const rand = rng(2026);

  /* ───────────── lights ───────────── */
  const ambient = new THREE.AmbientLight(0x8aa8ff, 0.55);
  const key = new THREE.DirectionalLight(0xdbe7ff, 2.4);
  key.position.set(3, 4, 6);
  const rim = new THREE.PointLight(0x3b82f6, 12, 18);
  rim.position.set(-3, 1, 3);
  const accent = new THREE.PointLight(0x22d3ee, 6, 16);
  accent.position.set(3, -1, 2.5);
  const sweep = new THREE.PointLight(0x7fb0ff, 4, 8);
  sweep.position.set(0, 0.5, 2.5);
  scene.add(ambient, key, rim, accent, sweep);

  /* ───────────── shared textures ───────────── */
  const texBlue = glowTexture(THREE, "#60a5fa");
  const texCyan = glowTexture(THREE, "#22d3ee");
  const texTeal = glowTexture(THREE, "#16c2a8");

  const shadowCanvas = document.createElement("canvas");
  shadowCanvas.width = shadowCanvas.height = 256;
  {
    const g = shadowCanvas.getContext("2d")!;
    g.shadowColor = "#3b82f6";
    g.shadowBlur = 44;
    g.fillStyle = "#3b82f6";
    g.beginPath();
    if (typeof g.roundRect === "function") g.roundRect(70, 70, 116, 116, 14);
    else g.rect(70, 70, 116, 116);
    g.fill();
  }
  const texPanelGlow = new THREE.CanvasTexture(shadowCanvas);
  texPanelGlow.colorSpace = THREE.SRGBColorSpace;

  /* ───────────── atmosphere: central glow + floor rings ───────────── */
  const glowBack = glowSprite(THREE, texBlue, 7.5, 0, 0x3b82f6);
  glowBack.position.set(0, 0.1, -1.2);
  root.add(glowBack);

  const rings = new THREE.Group();
  rings.position.y = -2.55;
  [2.3, 3.7, 5.4].forEach((r, i) => {
    const pts: T.Vector3[] = [];
    for (let k = 0; k <= 120; k++) {
      const a = (k / 120) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
    }
    const m = new THREE.LineBasicMaterial({ color: i === 0 ? 0x4f8dff : 0x2f6bff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    rings.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), m));
  });
  root.add(rings);

  /* ───────────── particles ───────────── */
  const PN = lite ? 170 : 520;
  const pPos = new Float32Array(PN * 3);
  const pSpeed = new Float32Array(PN);
  for (let i = 0; i < PN; i++) {
    pPos[i * 3] = (rand() - 0.5) * 15;
    pPos[i * 3 + 1] = (rand() - 0.5) * 8.5;
    pPos[i * 3 + 2] = -5 + rand() * 9.5;
    pSpeed[i] = 0.03 + rand() * 0.09;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0x9ec5ff, size: lite ? 0.1 : 0.085, map: texBlue, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
  const particles = new THREE.Points(pGeo, pMat);
  particles.renderOrder = 4;
  root.add(particles);

  /* ───────────── the Trackzy emblem (from the supplied logo geometry) ───────────── */
  const logo = new THREE.Group();
  const logoMats: T.Material[] = [];
  const track = <M extends T.Material>(m: M) => (logoMats.push(m), m);
  {
    const D = 0.16;
    const B = 0.03;
    const R = 0.3;
    const half = (LOGO_W - B * 2) / 2;
    const shape = new THREE.Shape();
    const x = -half;
    const y = -half;
    const s = half * 2;
    shape.moveTo(x + R, y);
    shape.lineTo(x + s - R, y);
    shape.absarc(x + s - R, y + R, R, -Math.PI / 2, 0, false);
    shape.lineTo(x + s, y + s - R);
    shape.absarc(x + s - R, y + s - R, R, 0, Math.PI / 2, false);
    shape.lineTo(x + R, y + s);
    shape.absarc(x + R, y + s - R, R, Math.PI / 2, Math.PI, false);
    shape.lineTo(x, y + R);
    shape.absarc(x + R, y + R, R, Math.PI, Math.PI * 1.5, false);

    const slabGeo = new THREE.ExtrudeGeometry(shape, { depth: D, bevelEnabled: true, bevelThickness: B, bevelSize: B, bevelSegments: lite ? 2 : 4, curveSegments: lite ? 10 : 22 });
    slabGeo.translate(0, 0, -D / 2);
    const slab = new THREE.Mesh(slabGeo, track(new THREE.MeshStandardMaterial({ color: 0x0c1830, metalness: 0.2, roughness: 0.5, emissive: 0x08142e, emissiveIntensity: 0.25 })));
    logo.add(slab);

    const front = D / 2 + B;
    // Fine rim light around the tile edge.
    const rimPts = shape.getPoints(20).map((p) => new THREE.Vector3(p.x, p.y, front + 0.004));
    const rimLine = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(rimPts), track(new THREE.LineBasicMaterial({ color: 0x5b97ff, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending })));
    logo.add(rimLine);

    // Stroke: 4-point polyline taken from the 512-px logo (rounded caps via spheres).
    const map = (px: number, py: number, z: number) => new THREE.Vector3(((px - 256) / 512) * LOGO_W, -((py - 256) / 512) * LOGO_W, z);
    const zc = front + 0.02;
    const pts = [map(150, 345, zc), map(226, 258, zc), map(308, 306, zc), map(387, 158, zc)];
    const r = 0.052;
    const strokeMat = track(new THREE.MeshStandardMaterial({ color: 0xf4f6fa, roughness: 0.32, metalness: 0.08, emissive: 0x8fa6c9, emissiveIntensity: 0.18 }));
    const up = new THREE.Vector3(0, 1, 0);
    for (let i = 0; i < pts.length - 1; i++) {
      const d = new THREE.Vector3().subVectors(pts[i + 1], pts[i]);
      const len = d.length();
      const seg = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, lite ? 14 : 28), strokeMat);
      seg.position.copy(pts[i]).addScaledVector(d, 0.5);
      seg.quaternion.setFromUnitVectors(up, d.normalize());
      logo.add(seg);
    }
    pts.slice(0, 3).forEach((p) => {
      const j = new THREE.Mesh(new THREE.SphereGeometry(r, lite ? 12 : 24, lite ? 10 : 18), strokeMat);
      j.position.copy(p);
      logo.add(j);
    });
    // Faint ring at the start of the stroke, as in the logo.
    const ringStart = new THREE.Mesh(new THREE.TorusGeometry(0.056, 0.008, 8, 28), track(new THREE.MeshBasicMaterial({ color: 0x6b7fb0, transparent: true, opacity: 0.8 })));
    ringStart.position.copy(map(135, 345, zc));
    logo.add(ringStart);
    // Teal destination dot.
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry((41 / 512) * LOGO_W, lite ? 16 : 32, lite ? 12 : 24),
      track(new THREE.MeshStandardMaterial({ color: 0x16c2a8, roughness: 0.3, metalness: 0.05, emissive: 0x16c2a8, emissiveIntensity: 0.4 })),
    );
    dot.position.copy(map(387, 155, zc + 0.03));
    logo.add(dot);
    const dotGlow = glowSprite(THREE, texTeal, 0.8, 0.28, 0xffffff);
    dotGlow.position.copy(dot.position).add(new THREE.Vector3(0, 0, 0.1));
    logo.add(dotGlow);
  }
  root.add(logo);

  /* ───────────── panels ───────────── */
  type PanelRt = {
    id: PanelId;
    pivot: T.Group;
    mat: T.MeshBasicMaterial;
    glowMat: T.MeshBasicMaterial;
    tex: T.CanvasTexture;
    cv: HTMLCanvasElement;
    g: CanvasRenderingContext2D;
    q: number;
    last: number;
    drawn: boolean;
    interval: number;
    revealStart: number;
    phase: number;
  };
  const quality = lite ? 0.55 : 1;
  const maxAniso = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  const panels = {} as Record<PanelId, PanelRt>;
  PANEL_IDS.forEach((id, i) => {
    const spec = PANEL_SPECS[id];
    const [w, h] = PANEL_SIZE[id];
    const cv = document.createElement("canvas");
    cv.width = Math.round(spec.w * quality);
    cv.height = Math.round(spec.h * quality);
    const g = cv.getContext("2d")!;
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = maxAniso;
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, depthWrite: false, toneMapped: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    mesh.renderOrder = 2;
    const glowMat = new THREE.MeshBasicMaterial({ map: texPanelGlow, color: 0x3b82f6, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(w * 1.34, h * 1.34), glowMat);
    glow.position.z = -0.04;
    glow.renderOrder = 0;
    const pivot = new THREE.Group();
    pivot.add(glow, mesh);
    pivot.visible = false;
    root.add(pivot);
    const isVariant = id.startsWith("v");
    panels[id] = {
      id, pivot, mat, glowMat, tex, cv, g, q: quality,
      last: -1, drawn: false,
      interval: 1 / (spec.fps * (lite ? 0.6 : 1)),
      revealStart: hero && !isVariant ? ENTRY[id].start + 0.5 : Infinity,
      phase: i * 1.7,
    };
  });

  /* ───────────── connections ───────────── */
  type ConnRt = {
    line: T.Line;
    mat: T.LineBasicMaterial;
    pos: Float32Array;
    pulse: T.Sprite;
    nodeB: T.Sprite;
    nodeA: T.Sprite | null;
    speed: number;
    offset: number;
    a: PoseId;
    b: PoseId;
    index: number;
  };
  const conns: ConnRt[] = CONNECTIONS.map((c, index) => {
    const pos = new Float32Array(CURVE_N * 3);
    const geo = new THREE.BufferGeometry();
    const attr = new THREE.BufferAttribute(pos, 3);
    attr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute("position", attr);
    const mat = new THREE.LineBasicMaterial({ color: 0x4f8dff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const line = new THREE.Line(geo, mat);
    line.renderOrder = 1;
    line.frustumCulled = false;
    const pulse = glowSprite(THREE, texCyan, 0.22, 0, 0xffffff);
    pulse.renderOrder = 1;
    const nodeB = glowSprite(THREE, texBlue, 0.3, 0, 0xffffff);
    nodeB.renderOrder = 1;
    const nodeA = c.a === "logo" ? null : glowSprite(THREE, texBlue, 0.3, 0, 0xffffff);
    if (nodeA) nodeA.renderOrder = 1;
    root.add(line, pulse, nodeB);
    if (nodeA) root.add(nodeA);
    return { line, mat, pos, pulse, nodeB, nodeA, speed: 0.16 + rand() * 0.12, offset: rand(), a: c.a, b: c.b, index };
  });

  /* ───────────── helpers ───────────── */
  const tmpA = new THREE.Vector3();
  const tmpB = new THREE.Vector3();
  const tmpC = new THREE.Vector3();
  const tmpM = new THREE.Vector3();

  function anchor(id: PoseId, towardX: number, out: T.Vector3) {
    if (id === "logo") return out.copy(logo.position);
    const p = panels[id as PanelId];
    const [w] = PANEL_SIZE[id as PanelId];
    const side = Math.max(-1, Math.min(1, (towardX - p.pivot.position.x) / 1.5));
    out.set(side * (w / 2), 0, 0.03);
    return p.pivot.localToWorld(out);
  }
  const entryGate = (id: PoseId, T_: number) => (id === "logo" || !hero ? 1 : smoothstep(ENTRY[id as PanelId].start + 0.6, ENTRY[id as PanelId].start + 1.7, T_));
  const pivotOf = (id: PoseId) => (id === "logo" ? logo : panels[id as PanelId].pivot);

  /* ───────────── camera fitting ───────────── */
  let width = ctx.width;
  let height = ctx.height;
  let fit = fitCamera(width / height, layoutKind(width / height), !!opts.bottomCopy);
  function applyFit() {
    const aspect = width / height;
    fit = fitCamera(aspect, layoutKind(aspect), !!opts.bottomCopy);
    camera.aspect = aspect;
    camera.setViewOffset(width, height, -fit.shiftX * width, fit.shiftY * height, width, height);
    camera.updateProjectionMatrix();
  }
  applyFit();

  /* ───────────── per-frame update ───────────── */
  const logoStart = 1.1;
  const camTarget = new THREE.Vector3();
  const update = (f: SceneFrame) => {
    const anim = reduced ? 0 : f.time; // drives wobble + texture animation
    const Tm = reduced ? 99 : f.time; // drives intro / one-shot reveals
    const dt = f.delta;
    const appear = hero ? 1 : smoothstep(0, 1.1, Tm);

    // Which stage are we in?
    // Reduced motion: no travelling camera — snap to the nearest stage instead of blending between them.
    const stageRaw = hero ? f.progress * 0.34 : f.progress * (STAGES.length - 1);
    const stageT = reduced ? Math.round(stageRaw) : stageRaw;
    const bl = blendStages(stageT, !hero);

    // — atmosphere
    const glowIn = hero ? smoothstep(0.2, 2.2, Tm) : appear;
    (glowBack.material as T.SpriteMaterial).opacity = 0.5 * glowIn;
    rings.children.forEach((c, i) => {
      ((c as T.Line).material as T.LineBasicMaterial).opacity = (0.16 - i * 0.04) * glowIn;
    });
    rings.rotation.y = anim * 0.025;
    const lightIn = hero ? smoothstep(0.5, 2.4, Tm) : appear;
    ambient.intensity = 0.55 * (0.25 + 0.75 * lightIn);
    key.intensity = 2.4 * lightIn;
    rim.intensity = 12 * lightIn;
    accent.intensity = 6 * lightIn;
    sweep.intensity = 4 * lightIn;
    sweep.position.x = Math.sin(anim * 0.45) * 2.6;

    // — particles
    pMat.opacity = (hero ? smoothstep(0, 2.5, Tm) : appear) * 0.75;
    pGeo.setDrawRange(0, hero ? Math.floor(8 + (PN - 8) * smoothstep(0, 3.2, Tm)) : PN);
    if (dt > 0) {
      for (let i = 0; i < PN; i++) {
        let y = pPos[i * 3 + 1] + pSpeed[i] * dt;
        if (y > 4.3) y = -4.3;
        pPos[i * 3 + 1] = y;
        pPos[i * 3] += Math.sin(anim * 0.25 + i) * 0.0007;
      }
      pGeo.attributes.position.needsUpdate = true;
    }

    // — emblem
    {
      const base = bl.poses.logo;
      const e = hero ? easeOutCubic((Tm - logoStart) / 1.7) : 1;
      const o = (hero ? smoothstep(logoStart, logoStart + 1.0, Tm) : appear) * base.o;
      logo.visible = o > 0.01;
      const sc = base.s * (hero ? 0.55 + 0.45 * e : 0.9 + 0.1 * appear);
      logo.scale.setScalar(sc);
      logo.position.set(base.x, base.y + Math.sin(anim * 0.7) * 0.035, base.z - (hero ? 2.6 * (1 - e) : 0));
      logo.rotation.set(base.rx + Math.sin(anim * 0.27) * 0.035, base.ry + Math.sin(anim * 0.35) * 0.15 + f.pointer.x * 0.12, base.rz);
      const solid = o >= 0.995;
      for (const m of logoMats) {
        m.transparent = !solid || m.type === "LineBasicMaterial" || m.type === "MeshBasicMaterial";
        m.opacity = m.type === "LineBasicMaterial" ? 0.55 * o : m.type === "MeshBasicMaterial" ? 0.8 * o : o;
      }
      glowBack.position.set(logo.position.x, logo.position.y, logo.position.z - 1.2);
    }

    // — panels
    PANEL_IDS.forEach((id) => {
      const p = panels[id];
      const base = bl.poses[id];
      const en = ENTRY[id];
      const isVariant = id.startsWith("v");
      const ep = hero && !isVariant ? easeOutCubic((Tm - en.start) / en.dur) : 1;
      const eo = hero && !isVariant ? smoothstep(en.start, en.start + 0.7, Tm) : appear;
      const o = base.o * eo;
      p.pivot.visible = o > 0.012;
      if (!p.pivot.visible) return;
      const k = 1 - ep;
      p.pivot.position.set(
        base.x + en.from[0] * k,
        base.y + en.from[1] * k + Math.sin(anim * 0.6 + p.phase) * 0.05,
        base.z + en.from[2] * k,
      );
      p.pivot.rotation.set(base.rx + Math.sin(anim * 0.4 + p.phase) * 0.012, base.ry + Math.sin(anim * 0.33 + p.phase) * 0.02 + f.pointer.x * 0.05, base.rz);
      p.pivot.scale.setScalar(base.s * (0.9 + 0.1 * Math.min(1, ep)));
      p.pivot.updateMatrixWorld(true);
      p.mat.opacity = o;
      p.glowMat.opacity = o * 0.4;

      // Redraw the UI texture at a throttled rate; hidden panels never draw.
      if (o > 0.03) {
        if (p.revealStart === Infinity) p.revealStart = Tm;
        if (!p.drawn || Tm - p.last >= p.interval || (reduced && !p.drawn)) {
          const reveal = clamp01((Tm - p.revealStart) / 1.8);
          const spec = PANEL_SPECS[id];
          p.g.setTransform(p.q, 0, 0, p.q, 0, 0);
          p.g.clearRect(0, 0, spec.w, spec.h);
          spec.draw(p.g, { t: anim, reveal });
          p.tex.needsUpdate = true;
          p.last = Tm;
          p.drawn = true;
        }
      }
    });
    logo.updateMatrixWorld(true);

    // — connections (curved light trails + pulsing nodes)
    for (const c of conns) {
      const ca = CONNECTIONS[c.index];
      const w = bl.weights(ca);
      const pa = pivotOf(c.a);
      const pb = pivotOf(c.b);
      const gate = Math.min(entryGate(c.a, Tm), entryGate(c.b, Tm), hero ? 1 : appear);
      const vis = w * gate;
      const show = vis > 0.02 && pa.visible && pb.visible;
      c.line.visible = c.pulse.visible = c.nodeB.visible = show;
      if (c.nodeA) c.nodeA.visible = show;
      if (!show) continue;

      anchor(c.a, pb.position.x, tmpA);
      anchor(c.b, pa.position.x, tmpB);
      tmpM.addVectors(tmpA, tmpB).multiplyScalar(0.5);
      const dist = tmpA.distanceTo(tmpB);
      tmpC.set(tmpM.x, tmpM.y + 0.35 + dist * 0.1, tmpM.z + 0.5);
      for (let i = 0; i < CURVE_N; i++) {
        const t = i / (CURVE_N - 1);
        const u = 1 - t;
        c.pos[i * 3] = u * u * tmpA.x + 2 * u * t * tmpC.x + t * t * tmpB.x;
        c.pos[i * 3 + 1] = u * u * tmpA.y + 2 * u * t * tmpC.y + t * t * tmpB.y;
        c.pos[i * 3 + 2] = u * u * tmpA.z + 2 * u * t * tmpC.z + t * t * tmpB.z;
      }
      c.line.geometry.attributes.position.needsUpdate = true;
      const drawFrac = hero ? smoothstep(0, 1, gate) : 1;
      c.line.geometry.setDrawRange(0, Math.max(2, Math.floor(CURVE_N * drawFrac)));
      c.mat.opacity = 0.5 * vis;

      const u = (anim * c.speed + c.offset) % 1;
      const uu = 1 - u;
      c.pulse.position.set(
        uu * uu * tmpA.x + 2 * uu * u * tmpC.x + u * u * tmpB.x,
        uu * uu * tmpA.y + 2 * uu * u * tmpC.y + u * u * tmpB.y,
        uu * uu * tmpA.z + 2 * uu * u * tmpC.z + u * u * tmpB.z,
      );
      (c.pulse.material as T.SpriteMaterial).opacity = vis * Math.sin(Math.PI * u) * (drawFrac >= 1 || u < drawFrac ? 1 : 0);
      c.nodeB.position.copy(tmpB);
      const beat = 0.7 + 0.3 * Math.sin(anim * 2.2 + c.index);
      (c.nodeB.material as T.SpriteMaterial).opacity = vis * beat * smoothstep(0.6, 1, drawFrac);
      c.nodeB.scale.setScalar(0.26 + 0.06 * beat);
      if (c.nodeA) {
        c.nodeA.position.copy(tmpA);
        (c.nodeA.material as T.SpriteMaterial).opacity = vis * beat;
        c.nodeA.scale.setScalar(0.26 + 0.06 * beat);
      }
    }

    // — camera
    const dolly = hero ? 1 + 0.14 * (1 - easeOutCubic(Tm / 5.2)) : 1;
    const cam = bl.cam;
    camTarget.set(cam.lx, cam.ly, cam.lz);
    const sx = (cam.x - cam.lx) * fit.factor * dolly;
    const sy = (cam.y - cam.ly) * fit.factor * dolly;
    const sz = (cam.z - cam.lz) * fit.factor * dolly;
    camera.position.set(cam.lx + sx + f.pointer.x * 0.3 * fit.factor, cam.ly + sy - f.pointer.y * 0.18 * fit.factor, cam.lz + sz);
    camera.lookAt(camTarget);

    renderer.render(scene, camera);
  };

  // Reduced motion renders a settled, static frame.
  if (reduced) update({ time: 0, delta: 0, progress: 0, pointer: { x: 0, y: 0 } });

  return {
    update,
    resize(w, h) {
      width = Math.max(1, w);
      height = Math.max(1, h);
      renderer.setSize(width, height, false);
      applyFit();
    },
    dispose() {
      texBlue.dispose();
      texCyan.dispose();
      texTeal.dispose();
      texPanelGlow.dispose();
      PANEL_IDS.forEach((id) => panels[id].tex.dispose());
      disposeTree(scene);
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
