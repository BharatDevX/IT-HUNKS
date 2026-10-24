import type { SceneFactory } from "../types";
import { createRenderer, disposeTree, glowSprite, glowTexture, lerp, rng, smooth, PALETTE } from "../common";

/**
 * Scene 1 — The Digital Universe.
 * A dotted globe with a fresnel atmosphere, orbiting data particles and a distant starfield.
 * Scroll progress (0 at top of page → 1 when the hero has left) rotates the globe,
 * pulls the camera back/up and fades the scene so the next section emerges cleanly.
 */
const factory: SceneFactory = (ctx) => {
  const { THREE, lite, reduced } = ctx;
  const renderer = createRenderer(ctx, 1.75);
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x040814, 0.045);

  const camera = new THREE.PerspectiveCamera(38, ctx.width / ctx.height, 0.1, 100);
  const root = new THREE.Group();
  scene.add(root);

  const R = 1.6;

  // Core body — dark so the dots and atmosphere read clearly.
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(R * 0.995, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0x050c1f }),
  );
  root.add(body);

  // Dotted surface (Fibonacci sphere).
  const dotCount = lite ? 1800 : 4200;
  const pos = new Float32Array(dotCount * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < dotCount; i++) {
    const y = 1 - (i / (dotCount - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = golden * i;
    pos[i * 3] = Math.cos(t) * r * R;
    pos[i * 3 + 1] = y * R;
    pos[i * 3 + 2] = Math.sin(t) * r * R;
  }
  const dotGeo = new THREE.BufferGeometry();
  dotGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const dots = new THREE.Points(
    dotGeo,
    new THREE.PointsMaterial({ color: 0x60a5fa, size: lite ? 0.02 : 0.016, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  root.add(dots);

  // Atmosphere: fresnel rim glow, rendered on the back faces of a slightly larger sphere.
  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.16, 64, 64),
    new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color(PALETTE.electric) }, uIntensity: { value: 1.0 } },
      vertexShader: `varying vec3 vN; varying vec3 vV;
        void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `varying vec3 vN; varying vec3 vV; uniform vec3 uColor; uniform float uIntensity;
        void main(){ float f = pow(0.72 - dot(vN, vV), 3.0); gl_FragColor = vec4(uColor, 1.0) * clamp(f, 0.0, 1.0) * uIntensity; }`,
    }),
  );
  scene.add(atmosphere);
  const atmosphereInner = new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.015, 64, 64),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color(PALETTE.cyan) } },
      vertexShader: `varying vec3 vN; varying vec3 vV;
        void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `varying vec3 vN; varying vec3 vV; uniform vec3 uColor;
        void main(){ float f = pow(1.0 - max(dot(vN, vV), 0.0), 3.2); gl_FragColor = vec4(uColor, 1.0) * f * 0.55; }`,
    }),
  );
  scene.add(atmosphereInner);

  // Orbit rings with travelling data particles.
  const rings: { group: import("three").Group; speed: number }[] = [];
  const rand = rng(7);
  const ringDefs = [
    { radius: R * 1.38, tilt: 0.45, count: lite ? 40 : 90, speed: 0.22, color: PALETTE.cyan },
    { radius: R * 1.62, tilt: -0.7, count: lite ? 30 : 70, speed: -0.14, color: PALETTE.blue },
    { radius: R * 1.85, tilt: 1.05, count: lite ? 18 : 46, speed: 0.09, color: PALETTE.purple },
  ];
  ringDefs.forEach(({ radius, tilt, count, speed, color }) => {
    const group = new THREE.Group();
    group.rotation.set(tilt, rand() * 3, 0.2);
    const line = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(
        Array.from({ length: 160 }, (_, i) => new THREE.Vector3(Math.cos((i / 160) * Math.PI * 2) * radius, 0, Math.sin((i / 160) * Math.PI * 2) * radius)),
      ),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.16 }),
    );
    group.add(line);
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2;
      p[i * 3] = Math.cos(a) * radius;
      p[i * 3 + 1] = (rand() - 0.5) * 0.04;
      p[i * 3 + 2] = Math.sin(a) * radius;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    group.add(new THREE.Points(g, new THREE.PointsMaterial({ color, size: 0.045, transparent: true, opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending })));
    scene.add(group);
    rings.push({ group, speed });
  });

  // Starfield.
  const starCount = lite ? 260 : 700;
  const sp = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const r = 12 + rand() * 30;
    const th = rand() * Math.PI * 2;
    const ph = Math.acos(2 * rand() - 1);
    sp[i * 3] = r * Math.sin(ph) * Math.cos(th);
    sp[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
    sp[i * 3 + 2] = -Math.abs(r * Math.cos(ph)) - 4;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xbfdbfe, size: 0.05, transparent: true, opacity: 0.6, depthWrite: false }));
  scene.add(stars);

  // Soft bloom-like halo behind the globe.
  const tex = glowTexture(THREE, "#3b82f6");
  const halo = glowSprite(THREE, tex, R * 5.2, 0.55);
  halo.position.z = -1;
  scene.add(halo);

  const state = { rotY: 0.6 };

  const layout = (w: number, h: number) => {
    const aspect = w / h;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    return aspect;
  };
  let aspect = layout(ctx.width, ctx.height);

  const update: ReturnType<SceneFactory>["update"] = ({ time, delta, progress, pointer }) => {
    const p = progress;
    state.rotY += delta * 0.07;
    root.rotation.y = state.rotY + p * 2.4 + pointer.x * 0.25;
    root.rotation.x = 0.28 + p * 0.5 + pointer.y * 0.12;
    rings.forEach((r, i) => (r.group.rotation.y += r.speed * delta * (1 + p * 2) + (i === 0 ? 0 : 0)));
    stars.rotation.y = time * 0.004 + p * 0.2;

    // Desktop: globe sits to the right of the headline; mobile: centred below it like a planetary horizon.
    const wide = aspect > 1.15;
    const baseX = wide ? 2.05 : 0;
    const baseY = wide ? -0.1 : -1.55;
    const dist = (wide ? 8.2 : 9.6) + p * 5.5;
    const x = lerp(baseX, wide ? 0.6 : 0, smooth(0, 1, p));
    const y = baseY + p * 2.1;
    root.position.set(x, y, 0);
    atmosphere.position.copy(root.position);
    atmosphereInner.position.copy(root.position);
    halo.position.set(x, y, -1);
    rings.forEach((r) => r.group.position.copy(root.position));
    camera.position.set(pointer.x * 0.35, 0.4 - p * 0.6 + pointer.y * -0.2, dist);
    camera.lookAt(x * 0.8, y * 0.8, 0);

    const fade = 1 - smooth(0.55, 1, p);
    (dots.material as import("three").PointsMaterial).opacity = 0.85 * fade;
    (halo.material as import("three").SpriteMaterial).opacity = 0.55 * fade;
    renderer.render(scene, camera);
  };

  if (reduced) update({ time: 0, delta: 0, progress: 0, pointer: { x: 0, y: 0 } });

  return {
    update,
    resize(w, h) {
      renderer.setSize(w, h, false);
      aspect = layout(w, h);
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
