import type { SceneFactory } from "../types";
import { createRenderer, disposeTree, glowSprite, glowTexture, lerp, rng, smooth, PALETTE } from "../common";

/**
 * Scene 3 — AI core.
 * A luminous core inside a shell of connected nodes, with data pulses travelling along the connections.
 * Scroll orbits and dollies the camera; the network "wakes up" (pulses + brightness) as the section enters.
 */
const factory: SceneFactory = (ctx) => {
  const { THREE, lite, reduced } = ctx;
  const renderer = createRenderer(ctx, 1.5);
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x040814, 0.05);
  const camera = new THREE.PerspectiveCamera(42, ctx.width / ctx.height, 0.1, 100);
  const rand = rng(21);
  const group = new THREE.Group();
  scene.add(group);

  // Core.
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.62, 2),
    new THREE.MeshBasicMaterial({ color: PALETTE.electric, wireframe: true, transparent: true, opacity: 0.55 }),
  );
  const coreSolid = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), new THREE.MeshBasicMaterial({ color: 0x9ec5ff }));
  group.add(core, coreSolid);
  const tex = glowTexture(THREE, "#3b82f6");
  const coreGlow = glowSprite(THREE, tex, 4.2, 0.9);
  group.add(coreGlow);

  // Nodes on two shells.
  const nodeCount = lite ? 34 : 64;
  const nodes: import("three").Vector3[] = [];
  for (let i = 0; i < nodeCount; i++) {
    const r = i % 3 === 0 ? 1.6 + rand() * 0.4 : 2.4 + rand() * 1.0;
    const th = rand() * Math.PI * 2;
    const ph = Math.acos(2 * rand() - 1);
    nodes.push(new THREE.Vector3(r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph) * 0.8, r * Math.sin(ph) * Math.sin(th)));
  }
  const nodePos = new Float32Array(nodeCount * 3);
  nodes.forEach((n, i) => n.toArray(nodePos, i * 3));
  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePos, 3));
  const nodePoints = new THREE.Points(nodeGeo, new THREE.PointsMaterial({ color: PALETTE.white, size: lite ? 0.11 : 0.09, transparent: true, opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending }));
  group.add(nodePoints);

  // Edges: connect each node to its 2 nearest neighbours, plus the first ring to the core.
  const edges: [import("three").Vector3, import("three").Vector3][] = [];
  nodes.forEach((a, i) => {
    const near = nodes
      .map((b, j) => ({ j, d: a.distanceTo(b) }))
      .filter((o) => o.j !== i)
      .sort((x, y) => x.d - y.d)
      .slice(0, 2);
    near.forEach(({ j }) => edges.push([a, nodes[j]]));
    if (i % 3 === 0) edges.push([new THREE.Vector3(0, 0, 0), a]);
  });
  const linePos = new Float32Array(edges.length * 6);
  edges.forEach(([a, b], i) => {
    a.toArray(linePos, i * 6);
    b.toArray(linePos, i * 6 + 3);
  });
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
  const lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: PALETTE.blue, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false }));
  group.add(lines);

  // Data pulses travelling along edges.
  const pulseCount = lite ? 24 : 56;
  const pulses = Array.from({ length: pulseCount }, () => ({ edge: Math.floor(rand() * edges.length), t: rand(), speed: 0.25 + rand() * 0.5, rev: rand() > 0.5 }));
  const pulseArr = new Float32Array(pulseCount * 3);
  const pulseGeo = new THREE.BufferGeometry();
  pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulseArr, 3));
  const pulsePoints = new THREE.Points(pulseGeo, new THREE.PointsMaterial({ color: PALETTE.cyan, size: 0.16, transparent: true, opacity: 1, depthWrite: false, blending: THREE.AdditiveBlending, map: tex }));
  group.add(pulsePoints);

  const tmp = new THREE.Vector3();
  const writePulses = (delta: number) => {
    pulses.forEach((p, i) => {
      p.t += delta * p.speed;
      if (p.t > 1) {
        p.t = 0;
        p.edge = Math.floor(rand() * edges.length);
        p.rev = rand() > 0.5;
      }
      const [a, b] = edges[p.edge];
      tmp.lerpVectors(p.rev ? b : a, p.rev ? a : b, p.t);
      tmp.toArray(pulseArr, i * 3);
    });
    pulseGeo.attributes.position.needsUpdate = true;
  };

  let aspect = ctx.width / ctx.height;
  const update: ReturnType<SceneFactory>["update"] = ({ time, delta, progress: p, pointer }) => {
    const wake = smooth(0.0, 0.3, p);
    group.rotation.y = time * 0.08 + p * 3.2 + pointer.x * 0.2;
    group.rotation.x = Math.sin(p * Math.PI) * 0.35 + pointer.y * 0.1;
    core.rotation.y = -time * 0.3;
    const pulse = 1 + Math.sin(time * 1.8) * 0.06;
    coreSolid.scale.setScalar(pulse);
    coreGlow.scale.setScalar(4.2 * pulse * (0.6 + wake * 0.4));
    (coreGlow.material as import("three").SpriteMaterial).opacity = 0.9 * wake;
    lines.material.opacity = 0.22 * wake;
    nodePoints.material.opacity = 0.95 * wake;
    pulsePoints.material.opacity = wake;
    writePulses(delta);

    const wide = aspect > 1.1;
    group.position.x = wide ? lerp(2.2, 1.6, p) : 0;
    group.position.y = wide ? 0 : 1.2;
    camera.position.set(Math.sin(p * 2) * 1.2, 0.8 - p * 0.8, lerp(10.5, 7.6, smooth(0, 0.7, p)) + (wide ? 0 : 2));
    camera.lookAt(wide ? 1.2 : 0, 0, 0);
    renderer.render(scene, camera);
  };
  if (reduced) update({ time: 0, delta: 0, progress: 0.4, pointer: { x: 0, y: 0 } });

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
