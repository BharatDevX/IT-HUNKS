"use client";

import { motion, useReducedMotion } from "framer-motion";

const particles = [
  [8, 14, 9, 0], [16, 73, 12, 2], [23, 38, 11, 4], [31, 87, 14, 1],
  [39, 19, 10, 5], [46, 61, 13, 3], [54, 32, 9, 6], [61, 81, 15, 2],
  [68, 11, 12, 4], [75, 54, 10, 1], [82, 91, 13, 5], [89, 27, 11, 3],
  [94, 68, 14, 0], [12, 48, 16, 7], [58, 94, 10, 4], [72, 35, 15, 6],
];

export default function HeroBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={reduceMotion ? undefined : { x: [-40, 45, -40], y: [-15, 35, -15] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-56 top-0 size-[560px] rounded-full bg-blue-600/20 blur-[150px]"
      />
      <motion.div
        animate={reduceMotion ? undefined : { x: [35, -35, 35], y: [25, -25, 25] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-40 top-[18%] size-[520px] rounded-full bg-cyan-400/10 blur-[150px]"
      />
      <div className="absolute left-[42%] top-[36%] size-[360px] rounded-full bg-blue-500/[0.08] blur-[120px]" />
      <div className="hero-grid absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_0%,#050505_76%)]" />

      {particles.map(([left, top, duration, delay], index) => (
        <motion.span
          key={index}
          className="absolute size-1 rounded-full bg-blue-300/70 shadow-[0_0_8px_#60a5fa]"
          style={{ left: `${left}%`, top: `${top}%` }}
          animate={reduceMotion ? undefined : { y: [0, -42, 0], opacity: [0.15, 0.8, 0.15] }}
          transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}
