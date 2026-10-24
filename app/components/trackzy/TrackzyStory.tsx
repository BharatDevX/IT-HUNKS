"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { TrackzyStoryScene } from "../three/Scenes";
import { STORY_CAPTIONS, TRACKZY_COPY } from "./content";

const STEPS = STORY_CAPTIONS.length;

/** Fades caption `i` in around its stage anchor (progress i / (STEPS-1)) and out again; the ends stay fully visible. */

function Caption({
  i,
  progress,
  reduce,
}: {
  i: number;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  // Prevent division by zero when there is only one caption.
  const c = STEPS > 1 ? i / (STEPS - 1) : 0;

  const first = i === 0;
  const last = i === STEPS - 1;

  // Keep the interpolation offsets ordered and finite.
  const inputRange: [number, number, number, number] = [
    c - 0.14,
    c - 0.075,
    c + 0.075,
    c + 0.14,
  ];

  
  // Calculate animation values directly from scroll progress.
  // This avoids creating multi-keyframe interpolation ranges.
  const opacity = useTransform(progress, (p) => {
    const fadeInStart = c - 0.14;
    const fadeInEnd = c - 0.075;
    const fadeOutStart = c + 0.075;
    const fadeOutEnd = c + 0.14;

    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

    if (first) {
      return 1 - clamp01((p - fadeOutStart) / (fadeOutEnd - fadeOutStart));
    }

    if (last) {
      return clamp01((p - fadeInStart) / (fadeInEnd - fadeInStart));
    }

    if (p < fadeInEnd) {
      return clamp01((p - fadeInStart) / (fadeInEnd - fadeInStart));
    }

    if (p <= fadeOutStart) return 1;

    return 1 - clamp01((p - fadeOutStart) / (fadeOutEnd - fadeOutStart));
  });

  const y = useTransform(progress, (p) => {
    if (reduce) return 0;

    const fadeInStart = c - 0.14;
    const fadeInEnd = c - 0.075;
    const fadeOutStart = c + 0.075;
    const fadeOutEnd = c + 0.14;

    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

    if (first) {
      return -26 * clamp01(
        (p - fadeOutStart) / (fadeOutEnd - fadeOutStart)
      );
    }

    if (last) {
      return 26 * (1 - clamp01(
        (p - fadeInStart) / (fadeInEnd - fadeInStart)
      ));
    }

    if (p < fadeInEnd) {
      return 26 * (1 - clamp01(
        (p - fadeInStart) / (fadeInEnd - fadeInStart)
      ));
    }

    if (p <= fadeOutStart) return 0;

    return -26 * clamp01(
      (p - fadeOutStart) / (fadeOutEnd - fadeOutStart)
    );
  });


  const item = STORY_CAPTIONS[i];

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-x-0 bottom-0 max-lg:px-0 lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2"
    >
      <div className="max-w-[470px] rounded-2xl border border-white/[0.08] bg-[#050914]/70 p-5 backdrop-blur-xl sm:p-6 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <div className="mb-3 flex items-center gap-3">
          <span className="h-px w-8 bg-teal-300 shadow-[0_0_8px_#16c2a8]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-300 sm:text-xs">
            {item.eyebrow}
          </span>
          <span className="ml-auto font-heading text-xs tabular-nums text-zinc-500">
            {String(i + 1).padStart(2, "0")} /{" "}
            {String(STEPS).padStart(2, "0")}
          </span>
        </div>

        <h3 className="font-heading text-2xl font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-3xl lg:text-5xl">
          {item.title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-zinc-300/85 sm:text-base sm:leading-7 lg:mt-5">
          {item.body}
        </p>
      </div>
    </motion.div>
  );
}


/**
 * Scenes A–E: the 3D Trackzy ecosystem stays pinned (CSS sticky — normal scrolling, nothing is hijacked) while the
 * camera moves through it. Scene F — the clean product section — follows in <TrackzyProduct />.
 */
export default function TrackzyStory() {
  const ref = useRef<HTMLElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section ref={ref} id="trackzy-story" aria-labelledby="trackzy-story-title" className="section-shell relative h-[400svh] lg:h-[360svh]">
      <h2 id="trackzy-story-title" className="sr-only">How Trackzy connects your business</h2>
      <TrackzyStoryScene />

      {/* Readability scrim — pinned with the scene. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-[8]">
        <div className="sticky top-0 h-[100svh] bg-[linear-gradient(90deg,rgba(5,5,5,.82)_0%,rgba(5,5,5,.4)_36%,transparent_60%)] max-lg:bg-[linear-gradient(0deg,rgba(5,5,5,.88)_0%,rgba(5,5,5,.5)_32%,transparent_58%)]" />
      </div>
      {/* The scene emerges out of / dissolves into the page background at the section's edges. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-[5] h-[100svh] bg-gradient-to-b from-[#050505] via-[#050505]/80 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-[100svh] bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />

      {/* Captions, pinned alongside the scene. */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="sticky top-0 h-[100svh]">
          <div className="relative mx-auto h-full max-w-[1440px] px-5 pb-10 sm:px-8 lg:px-12 lg:pb-0">
            <div className="relative h-full">
              {STORY_CAPTIONS.map((_, i) => <Caption key={i} i={i} progress={scrollYProgress} reduce={reduce} />)}
            </div>
            <p className="absolute bottom-3 left-5 hidden text-[11px] text-zinc-500 sm:left-8 lg:bottom-6 lg:left-12 lg:block">{TRACKZY_COPY.previewNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
