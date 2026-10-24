import type { SceneFactory } from "../types";
import { createRenderer, disposeTree, glowSprite, glowTexture, lerp, rng, smooth, PALETTE } from "../common";

/**
 * Scene 2 — Ideas into products.
 * Scattered blocks drift into a lit, layered tower as the section scrolls into view.
 * Instanced mesh: one draw call regardless of block count.
 */
const factory: SceneFactory = (ctx) => {
  const { THREE, lite, reduced } = ctx;
  const renderer = createRenderer(ctx, 1.5);
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x040814, 0.05);
  scene.add(new THREE.AmbientLight(0x5578d6, 0.9));
  const key = new THREE.DirectionalLight(0x9ec5ff, 2.2);
  key.position.set(4, 6, 5);
  scene.add(key);
  const rim = new THREE.PointLight(PALETTE.purple, 25, 20);
  rim.position.set(-4, 2, -3);
  scene.add(rim);
  const camera = new THREE.PerspectiveCamera(36, ctx.width / ctx.height, 0.1, 100);
  const rand = rng(5);

  // Layered tower: wide base slabs narrowing toward the top.
  const targets: import("three").Vector3[] = [];
  const sizes: number[] = [];
  const layers = lite ? 5 : 7;
  for (let l = 0; l < layers; l++) {
    const span = Math.max(1, 4 - Math.floor(l * 0.6));
    for (let x = 0; x < span; x++) {
      for (let z = 0; z < span; z++) {
        targets.push(new THREE.Vector3((x - (span - 1) / 2) * 0.78, l * 0.62 - 1.6, (z - (span - 1) / 2) * 0.78));
        sizes.push(0.66);
      }
    }
  }
  const n = targets.length;
  const starts = targets.map(() => new THREE.Vector3((rand() - 0.5) * 12, (rand() - 0.2) * 9, (rand() - 0.5) * 8 - 1));
  const delays = targets.map((t) => clamp((t.y + 1.6) / 4.6 * 0.4 + rand() * 0.18));
  function clamp(v: number) {
    return Math.min(1, Math.max(0, v));
  }

  const mesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x0d1a3a, metalness: 0.75, roughness: 0.28, emissive: 0x1a3fa0, emissiveIntensity: 0.45 }),
    n,
  );
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const group = new THREE.Group();
  group.add(mesh);
  scene.add(group);

  // Glowing floor ring + beam for the "illuminated structure" feel.
  const tex = glowTexture(THREE, "#3b82f6");
  const floorGlow = glowSprite(THREE, tex, 9, 0.55);
  floorGlow.position.set(0, -1.9, 0);
  scene.add(floorGlow);
  const ring = new THREE.Mesh(new THREE.RingGeometry(2.6, 2.64, 96), new THREE.MeshBasicMaterial({ color: PALETTE.cyan, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = -1.95;
  scene.add(ring);

  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const pos = new THREE.Vector3();
  const sc = new THREE.Vector3();
  let aspect = ctx.width / ctx.height;

  const update: ReturnType<SceneFactory>["update"] = ({ time, progress: p, pointer }) => {
    const assemble = smooth(0.12, 0.62, p);
    for (let i = 0; i < n; i++) {
      const local = smooth(delays[i] * 0.6, delays[i] * 0.6 + 0.55, assemble);
      pos.lerpVectors(starts[i], targets[i], local);
      const spin = (1 - local) * (2 + i * 0.07);
      e.set(spin, spin * 0.7 + time * 0.05 * (1 - local), 0);
      q.setFromEuler(e);
      sc.setScalar(sizes[i] * (0.55 + local * 0.45));
      m.compose(pos, q, sc);
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
    (mesh.material as import("three").MeshStandardMaterial).emissiveIntensity = 0.3 + assemble * 0.6;
    group.rotation.y = lerp(-0.4, 0.9, p) + time * 0.05 + pointer.x * 0.2;
    ring.scale.setScalar(0.6 + assemble * 0.4);
    (ring.material as import("three").MeshBasicMaterial).opacity = 0.5 * assemble;
    (floorGlow.material as import("three").SpriteMaterial).opacity = 0.15 + assemble * 0.5;
    const wide = aspect > 1.1;
    group.position.x = ring.position.x = floorGlow.position.x = wide ? -2.4 : 0;
    group.position.y = wide ? 0 : 1.1;
    ring.position.y = wide ? -1.95 : -0.85;
    floorGlow.position.y = ring.position.y + 0.05;
    camera.position.set(0, 1.6 + pointer.y * -0.3, wide ? 11 : 14);
    camera.lookAt(wide ? -2.4 : 0, wide ? 0.2 : 1.1, 0);
    renderer.render(scene, camera);
  };
  if (reduced) update({ time: 0, delta: 0, progress: 0.7, pointer: { x: 0, y: 0 } });

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
      mesh.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
};

export default factory;
