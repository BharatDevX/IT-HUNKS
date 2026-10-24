"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Bot, Cable, Cpu, Workflow } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import { AiCoreScene } from "../three/Scenes";

const aiServices = [
  { icon: Bot, title: "AI Chatbots and Virtual Assistants" },
  { icon: Workflow, title: "Business Process Automation" },
  { icon: Cpu, title: "AI Integration and Custom AI Applications" },
  { icon: BarChart3, title: "Intelligent Data Analysis" },
  { icon: Cable, title: "AI-Powered Business Workflows" },
];

/** Scene 3 — luminous AI core (sticky WebGL backdrop) with the AI service list in front. */
export default function AiIntelligence() {
  return (
    <section id="ai-intelligence" className="section-shell relative min-h-[120svh] py-24 sm:py-32 lg:py-40">
      <AiCoreScene />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-[5] bg-[linear-gradient(90deg,rgba(5,5,5,.82),rgba(5,5,5,.3)_55%,transparent)] max-lg:bg-[linear-gradient(180deg,rgba(5,5,5,.7),rgba(5,5,5,.45))]" />
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="AI & Intelligent Automation"
          title="Make Intelligence Your"
          accent="Competitive Advantage."
          description="Practical AI that automates support, speeds up decisions and removes repetitive work, connected to your own business data and tools."
        />
        <ul className="mt-12 grid max-w-xl gap-3 lg:mt-16">
          {aiServices.map(({ icon: Icon, title }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card flex items-center gap-4 px-5 py-4"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-cyan-300 ring-1 ring-cyan-300/15"><Icon className="size-4.5" /></span>
              <span className="font-heading text-base font-medium text-white sm:text-lg">{title}</span>
            </motion.li>
          ))}
        </ul>
        <a href="#ai-solutions" className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-blue-400 transition-colors hover:text-blue-300">See AI solution examples <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></a>
      </div>
    </section>
  );
}
