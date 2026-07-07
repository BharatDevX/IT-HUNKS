"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { Code2, FlaskConical, Lightbulb, Palette, Rocket, ScrollText } from "lucide-react";
import { useRef } from "react";
import SectionHeading from "../ui/SectionHeading";

const steps = [
  { icon: Lightbulb, title: "Idea", text: "We unpack the problem, audience, goals, and opportunity." },
  { icon: ScrollText, title: "Planning", text: "Scope, priorities, architecture, and milestones become crystal clear." },
  { icon: Palette, title: "Design", text: "We shape the experience, visual language, and interaction system." },
  { icon: Code2, title: "Development", text: "Clean, scalable code turns the approved direction into a real product." },
  { icon: FlaskConical, title: "Testing", text: "Every flow is checked across devices for quality, speed, and accessibility." },
  { icon: Rocket, title: "Launch", text: "We deploy, monitor, optimize, and stay close after release." },
];

export default function Process() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 55%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section id="process" className="section-shell relative py-24 sm:py-32 lg:py-40">
      <div className="section-orb -left-64 bottom-20 bg-cyan-500/[0.07]" />
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Development Process"
          title="From first thought to"
          accent="confident launch."
          description="A transparent, collaborative process that keeps decisions sharp and surprises out."
          align="center"
        />

        <div ref={timelineRef} className="relative mt-16 lg:mt-24">
          <div className="absolute bottom-0 left-[21px] top-0 w-px bg-white/[0.08] sm:left-1/2">
            <motion.div style={{ scaleY }} className="h-full origin-top bg-gradient-to-b from-blue-300 via-blue-500 to-blue-700 shadow-[0_0_14px_rgba(59,130,246,.7)]" />
          </div>
          <div className="space-y-8 sm:space-y-4">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className={`relative grid pl-16 sm:grid-cols-2 sm:pl-0 ${index % 2 ? "" : ""}`}
              >
                <div className={`sm:px-12 ${index % 2 === 0 ? "sm:col-start-1 sm:text-right" : "sm:col-start-2"}`}>
                  <div className={`glass-card inline-block w-full max-w-md p-6 ${index % 2 === 0 ? "sm:ml-auto" : ""}`}>
                    <span className="text-xs font-semibold tracking-[0.18em] text-blue-400">0{index + 1}</span>
                    <h3 className="mt-3 font-heading text-2xl font-medium text-white">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-500">{text}</p>
                  </div>
                </div>
                <motion.div
                  whileInView={{ scale: [0.7, 1.12, 1] }}
                  viewport={{ once: true }}
                  className="absolute left-0 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-blue-400/40 bg-[#0b1220] text-blue-300 shadow-[0_0_30px_rgba(59,130,246,.25)] sm:left-1/2 sm:-translate-x-1/2"
                >
                  <Icon className="size-4.5" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
