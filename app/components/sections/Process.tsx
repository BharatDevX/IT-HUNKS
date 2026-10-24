"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Code2, FlaskConical, Palette, Rocket, Search } from "lucide-react";
import { useRef } from "react";
import SectionHeading from "../ui/SectionHeading";

const steps = [
  { icon: Search, title: "Discover", text: "Understand the business and requirements." },
  { icon: Palette, title: "Design", text: "Plan the experience and system architecture." },
  { icon: Code2, title: "Develop", text: "Build the product." },
  { icon: FlaskConical, title: "Test", text: "Validate quality and functionality." },
  { icon: Rocket, title: "Launch", text: "Deploy and support the solution." },
];

/** Scene 6 — a clean, connected five-step process. Horizontal on desktop, vertical on mobile; the line fills with scroll. */
export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section id="process" className="section-shell relative py-24 sm:py-32 lg:py-40">
      <div className="section-orb -left-64 bottom-20 bg-cyan-500/[0.07]" />
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Development Process"
          title="From first thought to"
          accent="confident launch."
          description="A transparent, collaborative process that keeps decisions sharp and surprises out."
          align="center"
        />
        <div ref={ref} className="relative mt-16 lg:mt-24">
          {/* connector line */}
          <div aria-hidden="true" className="absolute bottom-6 left-[21px] top-6 w-px bg-white/[0.08] lg:bottom-auto lg:left-[10%] lg:right-[10%] lg:top-[22px] lg:h-px lg:w-auto">
            <motion.div style={reduce ? undefined : { scaleY: fill }} className="h-full origin-top bg-gradient-to-b from-blue-300 via-blue-500 to-blue-700 shadow-[0_0_14px_rgba(59,130,246,.7)] lg:hidden" />
            <motion.div style={reduce ? undefined : { scaleX: fill }} className="hidden h-full origin-left bg-gradient-to-r from-blue-300 via-blue-500 to-cyan-400 shadow-[0_0_14px_rgba(59,130,246,.7)] lg:block" />
          </div>
          <ol className="grid gap-8 lg:grid-cols-5 lg:gap-4">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <motion.li
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex gap-5 lg:flex-col lg:items-center lg:gap-6 lg:text-center"
              >
                <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full border border-blue-400/40 bg-[#0b1220] text-blue-300 shadow-[0_0_30px_rgba(59,130,246,.25)]"><Icon className="size-[18px]" /></span>
                <div className="glass-card w-full p-5 lg:min-h-[150px]">
                  <span className="text-xs font-semibold tracking-[0.18em] text-blue-400">0{index + 1}</span>
                  <h3 className="mt-2 font-heading text-xl font-medium text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
