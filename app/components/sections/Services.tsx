"use client";

import { motion } from "framer-motion";
import {
  AppWindow,
  Bot,
  Braces,
  Database,
  Palette,
  Search,
  Smartphone,
  Wrench,
} from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import TiltCard from "../ui/TiltCard";

const services = [
  { icon: AppWindow, title: "Website Development", text: "High-converting, lightning-fast websites built for your brand and your next stage of growth.", tag: "Web" },
  { icon: Smartphone, title: "App Development", text: "Polished cross-platform mobile experiences that feel responsive, intuitive, and native.", tag: "Mobile" },
  { icon: Bot, title: "AI Integration", text: "Practical AI workflows, assistants, and automation designed around real business outcomes.", tag: "Intelligence" },
  { icon: Search, title: "SEO Optimization", text: "Technical foundations and search-focused experiences that help the right customers find you.", tag: "Growth" },
  { icon: Database, title: "Database Integration", text: "Secure, scalable data architecture that keeps your product reliable as usage grows.", tag: "Data" },
  { icon: Wrench, title: "Maintenance", text: "Proactive monitoring, upgrades, bug fixes, and ongoing improvements after launch.", tag: "Care" },
  { icon: Braces, title: "API Development", text: "Robust APIs and third-party integrations that make your systems work beautifully together.", tag: "Systems" },
  { icon: Palette, title: "UI/UX Design", text: "Research-led interfaces with premium aesthetics, clear hierarchy, and effortless interaction.", tag: "Design" },
];

export default function Services() {
  return (
    <section id="services" className="section-shell relative py-24 sm:py-32 lg:py-40">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="section-orb -right-64 top-1/3 bg-blue-500/10" />
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Our Services"
          title="Everything you need to"
          accent="build and scale."
          description="One focused team for the entire digital product journey—from first sketch to launch and continuous growth."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {services.map(({ icon: Icon, title, text, tag }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: (index % 4) * 0.07 }}
            >
              <TiltCard className="h-full min-h-[290px] p-6">
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-start justify-between">
                    <div className="grid size-12 place-items-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-300 shadow-[inset_0_1px_0_rgba(255,255,255,.06)]">
                      <Icon className="size-5" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">{tag}</span>
                  </div>
                  <h3 className="mt-8 font-heading text-xl font-medium tracking-[-0.025em] text-zinc-100">{title}</h3>
                  <p className="mt-4 text-sm leading-6 text-zinc-500 transition-colors group-hover:text-zinc-400">{text}</p>
                  <div className="mt-auto flex items-center gap-2 pt-8 text-xs font-medium text-blue-400 opacity-70">
                    <span className="h-px w-5 bg-blue-400" />
                    Built to perform
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
