import type { SceneFactory } from "../types";
import { createRenderer, disposeTree, glowSprite, glowTexture, lerp, rng, smooth, PALETTE } from "../common";

/**
 * Scene 8 — Final payoff.
 * Hundreds of scattered lights converge into a luminous ring-and-sphere object as the CTA scrolls into view.
 */
const factory: SceneFactory = (ctx) => {
  const { THREE, lite, reduced } = ctx;
  const renderer = createRenderer(ctx, 1.5);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, ctx.width / ctx.height, 0.1, 100);
  const rand = rng(1234);
  const N = lite ? 520 : 1400;
  const start = new Float32Array(N * 3);
  const end = new Float32Array(N * 3);
  const cur = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  const c1 = new THREE.Color(PALETTE.cyan);
  const c2 = new THREE.Color(PALETTE.blue);
  const c3 = new THREE.Color(PALETTE.purple);
  for (let i = 0; i < N; i++) {
    // scattered start: wide shell
    const r0 = 5 + rand() * 7;
    const th0 = rand() * Math.PI * 2;
    const ph0 = Math.acos(2 * rand() - 1);
    start[i * 3] = r0 * Math.sin(ph0) * Math.cos(th0);
    start[i * 3 + 1] = r0 * Math.cos(ph0) * 0.7;
    start[i * 3 + 2] = r0 * Math.sin(ph0) * Math.sin(th0);
    // target: 55% sphere surface, 45% equatorial ring
    if (i < N * 0.55) {
      const r = 1.25;
      const th = rand() * Math.PI * 2;
      const ph = Math.acos(2 * rand() - 1);
      end[i * 3] = r * Math.sin(ph) * Math.cos(th);
      end[i * 3 + 1] = r * Math.cos(ph);
      end[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    } else {
      const a = rand() * Math.PI * 2;
      const r = 2.1 + (rand() - 0.5) * 0.12;
      end[i * 3] = Math.cos(a) * r;
      end[i * 3 + 1] = (rand() - 0.5) * 0.06;
      end[i * 3 + 2] = Math.sin(a) * r;
    }
    const col = i % 7 === 0 ? c3 : i % 2 ? c1 : c2;
    col.toArray(colors, i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(cur, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const tex = glowTexture(THREE, "#ffffff");
  const points = new THREE.Points(geo, new THREE.PointsMaterial({ size: lite ? 0.14 : 0.11, map: tex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  const group = new THREE.Group();
  group.add(points);
  scene.add(group);
  const core = glowSprite(THREE, tex, 5, 0, PALETTE.electric);
  scene.add(core);

  const update: ReturnType<SceneFactory>["update"] = ({ time, progress: p, pointer }) => {
    const t = smooth(0.2, 0.68, p);
    for (let i = 0; i < N * 3; i++) {
      // per-point stagger via index so convergence feels organic, not uniform
      const k = smooth((i % 97) / 400, 0.75 + (i % 97) / 400, t);
      cur[i] = lerp(start[i], end[i], k);
    }
    geo.attributes.position.needsUpdate = true;
    group.rotation.y = time * 0.12 + p * 1.2 + pointer.x * 0.2;
    group.rotation.x = 0.35 + pointer.y * 0.1;
    (core.material as import("three").SpriteMaterial).opacity = 0.55 * t;
    camera.position.set(0, 0.6, 9 - t * 1.5);
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  };
  if (reduced) update({ time: 0, delta: 0, progress: 0.8, pointer: { x: 0, y: 0 } });

  return {
    update,
    resize(w, h) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    },
    dispose() {
      tex.dispose();
      disposeTree(scene);
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
};

export default factory;
