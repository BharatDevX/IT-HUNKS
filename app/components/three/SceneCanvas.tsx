"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { SceneInstance, SceneLoader } from "./types";

type Props = {
  load: SceneLoader;
  /** "section": progress through the viewport. "leave": 0 at the top of the page, 1 once the section has scrolled away.
   *  "sticky": 0 when the (tall) host section's top reaches the viewport top, 1 when its bottom reaches the viewport bottom. */
  mode?: "section" | "leave" | "sticky";
  /** Shown while loading (and when WebGL fails, unless `failedFallback` is given). Should be a lightweight CSS visual. */
  fallback?: ReactNode;
  /** Shown instead of `fallback` once WebGL is unavailable or the scene failed / lost its context. */
  failedFallback?: ReactNode;
  className?: string;
  /** Max device pixel ratio (desktop). Mobile is always capped lower. */
  maxDpr?: number;
};

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Generic, lazy WebGL host. It:
 *  - only imports three.js + the scene chunk once the canvas is near the viewport
 *  - renders only while visible (IntersectionObserver) and while the tab is visible
 *  - reads scroll progress inside its own rAF loop (no React state, no re-renders)
 *  - clamps DPR, honours prefers-reduced-motion, and disposes everything on unmount
 */
export default function SceneCanvas({ load, mode = "section", fallback, failedFallback, className = "", maxDpr = 1.75 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"idle" | "ready" | "failed">("idle");

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    if (!hasWebGL()) {
      setStatus("failed");
      return;
    }

    const host = wrap.closest("section") ?? wrap;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lite = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;

    let disposed = false;
    let visible = false;
    let raf = 0;
    let instance: SceneInstance | null = null;
    let started = false;

    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let last = 0;
    let elapsed = 0;

    const onPointer = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const progress = () => {
      const r = host.getBoundingClientRect();
      const vh = window.innerHeight;
      if (mode === "leave") return Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh * 0.2)));
      if (mode === "sticky") return Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
      return Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    };

    const frame = (now: number) => {
      raf = 0;
      if (disposed || !visible || !instance) return;
      const delta = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      elapsed += reduced ? 0 : delta;
      pointer.x += (target.x - pointer.x) * 0.06;
      pointer.y += (target.y - pointer.y) * 0.06;
      instance.update({ time: elapsed, delta: reduced ? 0 : delta, progress: progress(), pointer });
      raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (!raf && visible && instance && !document.hidden) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    const start = async () => {
      if (started) return;
      started = true;
      try {
        const [THREE, mod] = await Promise.all([import("three"), load()]);
        if (disposed) return;
        const rect = wrap.getBoundingClientRect();
        const width = Math.max(1, Math.round(rect.width));
        const height = Math.max(1, Math.round(rect.height));
        instance = mod.default({ THREE, canvas, width, height, lite, reduced });
        // The factory owns the renderer; we only need to know it exists so a failed context shows the fallback.
        canvas.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          setStatus("failed");
        });
        setStatus("ready");
        kick();
      } catch (error) {
        console.error("[SceneCanvas] failed to start scene", error);
        setStatus("failed");
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          void start();
          kick();
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(wrap);

    const ro = new ResizeObserver(() => {
      const r = wrap.getBoundingClientRect();
      instance?.resize(Math.max(1, Math.round(r.width)), Math.max(1, Math.round(r.height)));
      // Reduced motion renders statically, so repaint after a resize.
      if (reduced && instance) instance.update({ time: 0, delta: 0, progress: progress(), pointer });
    });
    ro.observe(wrap);

    const onVisibility = () => (document.hidden ? raf && (cancelAnimationFrame(raf), (raf = 0)) : kick());
    document.addEventListener("visibilitychange", onVisibility);
    if (!lite && !reduced) window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      instance?.dispose();
      instance = null;
    };
    // `load` is a stable module-level function per usage site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={wrapRef} aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {status !== "ready" && <div className="absolute inset-0">{status === "failed" && failedFallback ? failedFallback : fallback}</div>}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 size-full transition-opacity duration-1000 ${status === "ready" ? "opacity-100" : "opacity-0"}`}
        style={{ display: status === "failed" ? "none" : "block" }}
      />
    </div>
  );
}
