"use client";

import { useEffect, useRef } from "react";
import { PANEL_SPECS, onShotsChange } from "./panels";
import type { PanelId } from "./story-layout";

/**
 * Crisp, static 2D rendering of one of the Trackzy interface previews (same artwork the 3D scene uses).
 * Drawn once, lazily, when it scrolls near the viewport. The box reserves its aspect ratio, so there is no layout shift.
 */
export default function PanelPreview({ id, label, className = "" }: { id: PanelId; label: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const spec = PANEL_SPECS[id];

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let drawn = false;
    const paint = () => {
      const g = canvas.getContext("2d");
      if (!g) return;
      g.clearRect(0, 0, spec.w, spec.h);
      spec.draw(g, { t: 0, reveal: 1 });
    };
    const draw = () => {
      if (drawn) return;
      drawn = true;
      paint();
    };
    // Screenshots load asynchronously: repaint once they arrive.
    const off = onShotsChange(() => drawn && paint());
    if (typeof IntersectionObserver === "undefined") {
      draw();
      return off;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        draw();
        io.disconnect();
      }
    }, { rootMargin: "300px 0px" });
    io.observe(canvas);
    return () => {
      io.disconnect();
      off();
    };
  }, [spec]);

  return (
    <canvas
      ref={ref}
      width={spec.w}
      height={spec.h}
      role="img"
      aria-label={label}
      className={`block h-auto w-full ${className}`}
      style={{ aspectRatio: `${spec.w} / ${spec.h}` }}
    />
  );
}
