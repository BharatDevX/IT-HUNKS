import type { SceneFactory } from "../types";
import { createRenderer, disposeTree, glowSprite, glowTexture, lerp, rng, smooth, PALETTE } from "../common";

/**
 * Scene 5 — Connected business systems (CRM / ERP).
 * A tilted lattice of hub nodes (cubes) linked by pulsing workflow lines, with flat "panel" slabs floating between them.
 */
const factory: SceneFactory = (ctx) => {
  const { THREE, lite, reduced } = ctx;
  const renderer = createRenderer(ctx, 1.5);
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x040814, 0.055);
  scene.add(new THREE.AmbientLight(0x6b8cff, 0.8));
  const key = new THREE.PointLight(0x60a5fa, 40, 30);
  key.position.set(3, 4, 6);
  scene.add(key);
  const camera = new THREE.PerspectiveCamera(40, ctx.width / ctx.height, 0.1, 100);
  const rand = rng(99);
  const group = new THREE.Group();
  scene.add(group);

  const hubs = [
    [0, 0, 0], [-2.6, 1.2, -0.6], [2.6, 1.0, -0.4], [-2.2, -1.3, 0.5], [2.4, -1.4, 0.6],
    [0, 2.2, -1.2], [0, -2.3, -0.8], [-4.2, 0, -1.4], [4.3, -0.1, -1.2],
  ].slice(0, lite ? 7 : 9).map(([x, y, z]) => new THREE.Vector3(x, y, z));

  const cubeGeo = new THREE.BoxGeometry(0.62, 0.62, 0.62);
  const edgeGeo = new THREE.EdgesGeometry(cubeGeo);
  const cubes = hubs.map((h, i) => {
    const m = new THREE.Mesh(
      cubeGeo,
      new THREE.MeshStandardMaterial({ color: 0x0b1530, emissive: i === 0 ? PALETTE.electric : 0x1d3b8a, emissiveIntensity: i === 0 ? 1.1 : 0.55, metalness: 0.6, roughness: 0.35 }),
    );
    m.position.copy(h);
    m.scale.setScalar(i === 0 ? 1.45 : 1);
    m.add(new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: i === 0 ? PALETTE.cyan : PALETTE.blue, transparent: true, opacity: 0.9 })));
    group.add(m);
    return m;
  });

  // Floating dashboard slabs.
  const slabGeo = new THREE.BoxGeometry(1.5, 0.95, 0.04);
  const slabs: import("three").Mesh[] = [];
  [[-1.4, 2.6, 0.8], [1.6, -2.7, 0.9], [-3.4, -1.9, 0.2], [3.5, 2.3, 0.1]].slice(0, lite ? 2 : 4).forEach(([x, y, z], i) => {
    const m = new THREE.Mesh(slabGeo, new THREE.MeshStandardMaterial({ color: 0x0c1a3d, emissive: 0x153a9e, emissiveIntensity: 0.35, transparent: true, opacity: 0.8, metalness: 0.3, roughness: 0.5 }));
    m.position.set(x, y, z);
    m.rotation.set(0.1 * (i % 2 ? 1 : -1), 0.3 * (i % 2 ? -1 : 1), 0);
    m.add(new THREE.LineSegments(new THREE.EdgesGeometry(slabGeo), new THREE.LineBasicMaterial({ color: PALETTE.blue, transparent: true, opacity: 0.55 })));
    // abstract bars (no text)
    for (let b = 0; b < 5; b++) {
      const h = 0.15 + rand() * 0.4;
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.1, h, 0.02), new THREE.MeshBasicMaterial({ color: b === 3 ? PALETTE.cyan : PALETTE.blue }));
      bar.position.set(-0.45 + b * 0.22, -0.3 + h / 2, 0.03);
      m.add(bar);
    }
    group.add(m);
    slabs.push(m);
  });

  // Links.
  const pairs: [number, number][] = [];
  hubs.forEach((_, i) => {
    if (i > 0) pairs.push([0, i]);
  });
  pairs.push([1, 5], [2, 5], [3, 6], [4, 6], [1, 3], [2, 4]);
  const valid = pairs.filter(([a, b]) => a < hubs.length && b < hubs.length);
  const lp = new Float32Array(valid.length * 6);
  valid.forEach(([a, b], i) => {
    hubs[a].toArray(lp, i * 6);
    hubs[b].toArray(lp, i * 6 + 3);
  });
  const lg = new THREE.BufferGeometry();
  lg.setAttribute("position", new THREE.BufferAttribute(lp, 3));
  group.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: PALETTE.blue, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false })));

  const tex = glowTexture(THREE, "#22d3ee");
  const pulseN = lite ? 14 : 30;
  const pulses = Array.from({ length: pulseN }, () => ({ e: Math.floor(rand() * valid.length), t: rand(), s: 0.2 + rand() * 0.4, r: rand() > 0.5 }));
  const parr = new Float32Array(pulseN * 3);
  const pg = new THREE.BufferGeometry();
  pg.setAttribute("position", new THREE.BufferAttribute(parr, 3));
  group.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: PALETTE.cyan, size: 0.2, map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));
  const tmp = new THREE.Vector3();

  let aspect = ctx.width / ctx.height;
  const update: ReturnType<SceneFactory>["update"] = ({ time, delta, progress: p, pointer }) => {
    pulses.forEach((o, i) => {
      o.t += delta * o.s;
      if (o.t > 1) {
        o.t = 0;
        o.e = Math.floor(rand() * valid.length);
        o.r = rand() > 0.5;
      }
      const [a, b] = valid[o.e];
      tmp.lerpVectors(o.r ? hubs[b] : hubs[a], o.r ? hubs[a] : hubs[b], o.t);
      tmp.toArray(parr, i * 3);
    });
    pg.attributes.position.needsUpdate = true;

    cubes.forEach((c, i) => {
      c.rotation.y = time * 0.25 + i;
      c.rotation.x = Math.sin(time * 0.4 + i) * 0.15;
      c.position.y = hubs[i].y + Math.sin(time * 0.8 + i * 1.7) * 0.08;
    });
    slabs.forEach((s, i) => (s.position.y += Math.sin(time * 0.7 + i) * 0.0015));

    const wide = aspect > 1.1;
    group.rotation.y = lerp(-0.5, 0.5, p) + pointer.x * 0.12;
    group.rotation.x = lerp(0.35, -0.1, p) + pointer.y * 0.08;
    group.position.x = wide ? 2.3 : 0;
    group.position.y = wide ? 0 : 1.6;
    const s = wide ? 1 : 0.7;
    group.scale.setScalar(s);
    camera.position.set(0, 0.6, lerp(13, 9.5, smooth(0, 0.6, p)) + (wide ? 0 : 1.5));
    camera.lookAt(wide ? 1.4 : 0, 0, 0);
    renderer.render(scene, camera);
  };
  if (reduced) update({ time: 0, delta: 0, progress: 0.5, pointer: { x: 0, y: 0 } });

  return {
    update,
    resize(w, h) {
      renderer.setSize(w, h, false);
      aspect = w / h;
      camera.aspect = aspect;
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
