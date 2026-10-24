"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Globe2, LayoutDashboard, MonitorSmartphone, Smartphone } from "lucide-react";
import FloatingMockups from "../hero/FloatingMockups";
import SectionHeading from "../ui/SectionHeading";

const items = [
  { icon: Globe2, label: "Modern business websites" },
  { icon: Smartphone, label: "Mobile applications" },
  { icon: LayoutDashboard, label: "Interactive dashboards" },
  { icon: MonitorSmartphone, label: "Responsive interfaces" },
];

/** Abstract UI wireframe — shapes only, so there is never unreadable placeholder text. */
function Wire({ variant }: { variant: "site" | "stats" }) {
  return (
    <div className="h-full w-full rounded-2xl border border-white/12 bg-gradient-to-b from-[#0e1a38] to-[#070b17] p-3.5 shadow-[0_30px_80px_rgba(0,0,0,.6),0_0_40px_rgba(59,130,246,.2)]">
      <div className="mb-3 flex gap-1.5"><span className="size-1.5 rounded-full bg-white/25" /><span className="size-1.5 rounded-full bg-white/15" /><span className="size-1.5 rounded-full bg-white/15" /></div>
      {variant === "site" ? (
        <div className="space-y-2.5">
          <div className="h-16 rounded-lg bg-gradient-to-br from-blue-500/40 to-cyan-400/10" />
          <div className="h-2 w-3/4 rounded-full bg-white/20" />
          <div className="h-2 w-1/2 rounded-full bg-white/10" />
          <div className="grid grid-cols-3 gap-2 pt-1">{[0, 1, 2].map((i) => <div key={i} className="h-10 rounded-md border border-white/8 bg-white/[0.04]" />)}</div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex h-24 items-end gap-1.5">{[40, 62, 48, 80, 58, 92, 70].map((h, i) => <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-blue-600/50 to-cyan-300/70" style={{ height: `${h}%` }} />)}</div>
          <div className="h-2 w-2/3 rounded-full bg-white/15" />
          <div className="grid grid-cols-2 gap-2"><div className="h-8 rounded-md bg-white/[0.05]" /><div className="h-8 rounded-md bg-blue-500/20" /></div>
        </div>
      )}
    </div>
  );
}

/** Scene 4 — a CSS-3D workspace. Scroll drives rotation and depth; no WebGL needed, so it is light on every device. */
export default function WebMobile() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-22, 0, 16]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [16, 6, 2]);
  const leftZ = useTransform(scrollYProgress, [0, 0.5, 1], [-140, 20, -60]);
  const rightZ = useTransform(scrollYProgress, [0, 0.5, 1], [-60, 40, -140]);
  const leftY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const rightY = useTransform(scrollYProgress, [0, 1], [-30, 70]);

  return (
    <section id="web-mobile" className="section-shell relative py-24 sm:py-32 lg:py-40">
      <div className="section-orb left-1/2 top-1/4 -translate-x-1/2 bg-blue-600/15" />
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Websites & Mobile Apps"
          title="Beautiful Interfaces."
          accent="Powerful Engineering."
          description="Responsive websites, mobile applications and interactive dashboards, designed to look sharp and built to perform in production."
          align="center"
        />
        <div ref={ref} className="relative mt-14 [perspective:1600px] lg:mt-20">
          <motion.div style={reduce ? undefined : { rotateY, rotateX, transformStyle: "preserve-3d" }} className="relative mx-auto max-w-[760px]">
            <motion.div aria-hidden="true" style={reduce ? undefined : { z: leftZ, y: leftY }} className="absolute -left-4 top-[14%] z-0 hidden h-[220px] w-[210px] -rotate-6 lg:block xl:-left-28"><Wire variant="site" /></motion.div>
            <motion.div aria-hidden="true" style={reduce ? undefined : { z: rightZ, y: rightY }} className="absolute -right-4 top-[6%] z-0 hidden h-[220px] w-[210px] rotate-6 lg:block xl:-right-28"><Wire variant="stats" /></motion.div>
            <div className="relative z-10"><FloatingMockups /></div>
          </motion.div>
        </div>
        <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 lg:grid-cols-4">
          {items.map(({ icon: Icon, label }, i) => (
            <motion.li key={label} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.55, delay: i * 0.07 }} className="glass-card flex flex-col items-center gap-3 px-4 py-5 text-center">
              <span className="grid size-10 place-items-center rounded-xl bg-blue-500/10 text-blue-300 ring-1 ring-blue-400/15"><Icon className="size-4.5" /></span>
              <span className="text-sm text-zinc-300">{label}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
