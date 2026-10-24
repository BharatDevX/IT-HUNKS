"use client";

import type { ReactNode } from "react";
import SceneCanvas from "./SceneCanvas";
import type { SceneLoader } from "./types";
import TrackzyFallback from "../trackzy/TrackzyFallback";

/* Module-level loaders keep each scene in its own lazy chunk (three.js itself is shared). */
const loadHero: SceneLoader = () => import("./scenes/trackzyHeroScene");
const loadTrackzyStory: SceneLoader = () => import("./scenes/trackzyStoryScene");
const loadAssembly: SceneLoader = () => import("./scenes/assemblyScene");
const loadAiCore: SceneLoader = () => import("./scenes/aiCoreScene");
const loadSystem: SceneLoader = () => import("./scenes/systemScene");
const loadConverge: SceneLoader = () => import("./scenes/convergeScene");

/** Lightweight CSS stand-in used while a scene loads, on devices without WebGL, and if a context is lost. */
function Fallback({ variant, side = true }: { variant: "globe" | "glow" | "network" | "trackzy"; side?: boolean }) {
  if (variant === "trackzy") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/2 size-[46vmin] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,.16),transparent_62%)] ${side ? "left-1/2 -translate-x-1/2 lg:left-[72%]" : "left-1/2 -translate-x-1/2"}`} />
      </div>
    );
  }
  if (variant === "globe") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[58%] aspect-square w-[130vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_50%_6%,rgba(96,165,250,.55),rgba(37,99,235,.18)_14%,rgba(5,10,24,0)_42%)] lg:left-[68%] lg:top-1/2 lg:w-[62vw] lg:-translate-y-1/2" />
        <div className="absolute left-1/2 top-[58%] aspect-square w-[130vw] -translate-x-1/2 rounded-full border border-blue-400/30 shadow-[0_-18px_90px_rgba(59,130,246,.35)] lg:left-[68%] lg:top-1/2 lg:w-[34vw] lg:-translate-y-1/2" />
      </div>
    );
  }
  if (variant === "network") {
    return (
      <div className="absolute inset-0">
        <div className="absolute right-[8%] top-1/2 size-[46vmin] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,.35),transparent_62%)]" />
        <div className="absolute right-[14%] top-1/2 size-[30vmin] -translate-y-1/2 rounded-full border border-blue-400/25" />
        <div className="absolute right-[20%] top-1/2 size-[18vmin] -translate-y-1/2 rounded-full border border-cyan-300/25" />
      </div>
    );
  }
  return <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,.22),transparent_55%)]" />;
}

/**
 * Sticky backdrop: the canvas stays in view while a tall section scrolls past (CSS sticky — no scroll hijacking),
 * and sits behind the content via -z-10 (sections using `.section-shell` create their own stacking context).
 */
function Sticky({ children }: { children: ReactNode }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="sticky top-0 h-[100svh] w-full">{children}</div>
    </div>
  );
}

/**
 * Hero: Trackzy product reveal. While the chunk loads we show only a dark glow (so the intro starts from darkness);
 * if WebGL is unavailable a static CSS composition of the product takes over.
 * `side` = wide layout (scene on the right of the copy); otherwise the scene is centred in its own block.
 */
export function HeroScene({ side = true }: { side?: boolean }) {
  return (
    <SceneCanvas
      load={loadHero}
      mode="leave"
      fallback={<Fallback variant="trackzy" side={side} />}
      failedFallback={<TrackzyFallback side={side} />}
    />
  );
}

/** Scroll story (scenes A–E) — sticky full-viewport backdrop whose camera is driven by the section's scroll progress. */
export function TrackzyStoryScene() {
  return (
    <Sticky>
      <SceneCanvas load={loadTrackzyStory} mode="sticky" fallback={<Fallback variant="trackzy" side />} failedFallback={<TrackzyFallback side />} />
    </Sticky>
  );
}

export function AssemblyScene() {
  return (
    <Sticky>
      <SceneCanvas load={loadAssembly} fallback={<Fallback variant="glow" />} />
    </Sticky>
  );
}

export function AiCoreScene() {
  return (
    <Sticky>
      <SceneCanvas load={loadAiCore} fallback={<Fallback variant="network" />} />
    </Sticky>
  );
}

export function SystemScene() {
  return (
    <Sticky>
      <SceneCanvas load={loadSystem} fallback={<Fallback variant="network" />} />
    </Sticky>
  );
}

export function ConvergeScene() {
  return <SceneCanvas load={loadConverge} fallback={<Fallback variant="glow" />} />;
}
