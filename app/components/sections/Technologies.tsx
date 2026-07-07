"use client";

import { motion } from "framer-motion";
import { Braces, Code2, Database, Hexagon, Layers3, Sparkles, Wind, Workflow } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

const technologies = [
  { name: "Next.js", icon: Layers3 },
  { name: "React", icon: Hexagon },
  { name: "Node.js", icon: Workflow },
  { name: "MongoDB", icon: Database },
  { name: "Tailwind", icon: Wind },
  { name: "Framer Motion", icon: Sparkles },
  { name: "GSAP", icon: Code2 },
  { name: "TypeScript", icon: Braces },
  { name: "OpenAI", icon: Sparkles },
];

export default function Technologies() {
  const track = [...technologies, ...technologies];

  return (
    <section className="section-shell relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Technology"
          title="Modern tools."
          accent="Production discipline."
          description="We choose proven technologies that balance speed, maintainability, and a great user experience."
          align="center"
        />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="marquee-mask mt-14 overflow-hidden border-y border-white/[0.06] bg-white/[0.015] py-6 lg:mt-20"
      >
        <div className="marquee-track flex w-max items-center">
          {track.map(({ name, icon: Icon }, index) => (
            <div key={`${name}-${index}`} className="mx-3 flex items-center gap-3 rounded-full border border-white/[0.08] bg-[#0c0c0f] px-5 py-3 text-sm font-medium text-zinc-300">
              <Icon className="size-4 text-blue-400" />
              {name}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
