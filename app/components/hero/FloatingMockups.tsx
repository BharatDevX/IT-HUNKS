"use client";

import {
  Bot,
  Check,
  Database,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import type { PointerEvent } from "react";

const floatingCards = [
  { title: "AI Integration", icon: Bot, className: "-left-2 top-8", delay: 0 },
  { title: "SEO Ready", icon: SearchCheck, className: "right-0 top-20", delay: 0.7 },
  { title: "Free Database", icon: Database, className: "-left-8 bottom-20", delay: 1.2 },
  { title: "6 Months Free Maintenance", icon: ShieldCheck, className: "right-2 bottom-6", delay: 0.35 },
];

export default function FloatingMockups() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 80, damping: 18 });
  const smoothY = useSpring(pointerY, { stiffness: 80, damping: 18 });
  const laptopX = useTransform(smoothX, [-0.5, 0.5], [-14, 14]);
  const laptopY = useTransform(smoothY, [-0.5, 0.5], [-10, 10]);
  const phoneX = useTransform(smoothX, [-0.5, 0.5], [18, -18]);
  const phoneY = useTransform(smoothY, [-0.5, 0.5], [12, -12]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
      className="relative mx-auto h-[460px] w-full max-w-[650px] sm:h-[560px] lg:h-[650px]"
    >
      <div className="absolute left-1/2 top-1/2 size-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-[100px]" />
      <div className="absolute inset-[8%] rounded-full border border-blue-400/10 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="absolute inset-[18%] rounded-full border border-white/[0.06]" />

      <motion.div
        style={reduceMotion ? undefined : { x: laptopX, y: laptopY }}
        animate={reduceMotion ? undefined : { translateY: [-8, 8, -8], rotateZ: [-0.8, 0.8, -0.8] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[4%] top-[20%] z-10 w-[82%] will-change-transform"
      >
        <div className="rounded-[18px] border border-white/15 bg-gradient-to-b from-zinc-700 to-zinc-950 p-[5px] shadow-[0_45px_100px_rgba(0,0,0,.65),0_0_70px_rgba(59,130,246,.18)]">
          <div className="overflow-hidden rounded-[13px] border border-white/[0.07] bg-[#08090b]">
            <div className="flex h-8 items-center gap-1.5 border-b border-white/[0.06] bg-white/[0.03] px-3">
              <span className="size-2 rounded-full bg-red-400/70" />
              <span className="size-2 rounded-full bg-amber-300/70" />
              <span className="size-2 rounded-full bg-emerald-400/70" />
              <span className="mx-auto h-3.5 w-28 rounded-full bg-white/[0.05]" />
            </div>
            <div className="grid aspect-[1.72/1] grid-cols-[.34fr_1fr]">
              <div className="border-r border-white/[0.06] p-3">
                <div className="mb-5 flex items-center gap-1.5 text-[8px] font-semibold text-white">
                  <Sparkles className="size-3 text-blue-400" /> HUNKS OS
                </div>
                <div className="space-y-2">
                  {[78, 56, 68, 48].map((width, index) => (
                    <div key={width} className={`h-2 rounded-full ${index === 0 ? "bg-blue-500/35" : "bg-white/[0.06]"}`} style={{ width: `${width}%` }} />
                  ))}
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[8px] text-zinc-500 sm:text-[10px]">Business growth</p>
                    <p className="mt-0.5 text-sm font-semibold sm:text-lg">Performance overview</p>
                  </div>
                  <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-2 py-1 text-[7px] text-blue-300 sm:text-[9px]">Live</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["Revenue", "Visitors", "Growth"].map((label, index) => (
                    <div key={label} className="rounded-lg border border-white/[0.07] bg-white/[0.025] p-2 sm:p-3">
                      <p className="text-[7px] text-zinc-500 sm:text-[9px]">{label}</p>
                      <p className="mt-1 text-[10px] font-semibold sm:text-sm">{["₹2.4L", "48.2K", "+38%"][index]}</p>
                    </div>
                  ))}
                </div>
                <div className="relative mt-3 h-20 overflow-hidden rounded-lg border border-white/[0.06] bg-gradient-to-b from-blue-500/[0.08] to-transparent sm:h-28">
                  <svg viewBox="0 0 420 120" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                    <defs>
                      <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity=".32" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0 103 C45 92 56 68 91 79 S145 91 170 57 S215 66 248 43 S305 55 330 28 S380 31 420 9 V120 H0Z" fill="url(#chart-fill)" />
                    <path d="M0 103 C45 92 56 68 91 79 S145 91 170 57 S215 66 248 43 S305 55 330 28 S380 31 420 9" fill="none" stroke="#60a5fa" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto h-3 w-[108%] -translate-x-[4%] rounded-b-[50%] border-t border-white/20 bg-gradient-to-b from-zinc-500 to-zinc-800 shadow-xl" />
      </motion.div>

      <motion.div
        style={reduceMotion ? undefined : { x: phoneX, y: phoneY }}
        animate={reduceMotion ? undefined : { translateY: [8, -10, 8], rotateZ: [2, -1, 2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[5%] right-[3%] z-20 w-[26%] min-w-[118px] max-w-[158px] will-change-transform"
      >
        <div className="rounded-[28px] border border-white/20 bg-gradient-to-b from-zinc-600 to-zinc-950 p-[5px] shadow-[0_30px_80px_rgba(0,0,0,.75),0_0_50px_rgba(59,130,246,.28)]">
          <div className="relative aspect-[.5/1] overflow-hidden rounded-[23px] bg-[#090a0d] p-3">
            <div className="absolute left-1/2 top-1.5 h-3 w-12 -translate-x-1/2 rounded-full bg-black" />
            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-[7px] text-zinc-500">Welcome back</p>
                <p className="text-[10px] font-semibold">Shramik</p>
              </div>
              <div className="grid size-6 place-items-center rounded-full bg-blue-500/15">
                <Sparkles className="size-3 text-blue-400" />
              </div>
            </div>
            <div className="mt-3 rounded-xl border border-blue-400/20 bg-gradient-to-br from-blue-500/25 to-blue-700/5 p-3">
              <p className="text-[7px] text-blue-200">Jobs matched</p>
              <p className="mt-1 text-xl font-semibold">24</p>
              <div className="mt-2 flex items-center gap-1 text-[7px] text-emerald-300">
                <TrendingUp className="size-2.5" /> 12% this week
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {[["UI Designer", "Remote"], ["React Developer", "Pune"]].map(([role, place]) => (
                <div key={role} className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-2">
                  <div className="flex items-center gap-1.5">
                    <span className="grid size-5 place-items-center rounded-md bg-blue-500/15">
                      <Check className="size-2.5 text-blue-300" />
                    </span>
                    <div>
                      <p className="text-[7px] font-medium">{role}</p>
                      <p className="text-[6px] text-zinc-500">{place}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {floatingCards.map(({ title, icon: Icon, className, delay }, index) => (
        <motion.div
          key={title}
          animate={reduceMotion ? undefined : { y: [-7, 8, -7] }}
          transition={{ duration: 4.6 + index * 0.6, delay, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute z-30 ${className} hidden items-center gap-2.5 rounded-xl border border-white/10 bg-[#0c0d10]/75 px-3.5 py-2.5 text-xs font-medium text-zinc-200 shadow-[0_12px_35px_rgba(0,0,0,.4),0_0_24px_rgba(59,130,246,.12)] backdrop-blur-xl sm:flex`}
        >
          <span className="grid size-7 place-items-center rounded-lg bg-blue-500/15 text-blue-300">
            <Icon className="size-3.5" />
          </span>
          {title}
        </motion.div>
      ))}
    </div>
  );
}
