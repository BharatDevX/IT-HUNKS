"use client";

import { motion } from "framer-motion";
import { Bot, Gauge, Headphones, LockKeyhole, MonitorSmartphone, SearchCheck } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

const reasons = [
  { icon: Gauge, title: "Fast Delivery", text: "Focused execution, clear milestones and fewer unnecessary layers between you and the team." },
  { icon: MonitorSmartphone, title: "Responsive by Default", text: "Customer-facing experiences built to work across phones, tablets and desktops." },
  { icon: SearchCheck, title: "Search Ready", text: "Technical SEO foundations and performance considered from the start." },
  { icon: Bot, title: "AI Where It Helps", text: "AI assistants and automation connected to real customer or internal workflows." },
  { icon: LockKeyhole, title: "Production Mindset", text: "Validation, permissions, integrations and deployment are treated as part of the product." },
  { icon: Headphones, title: "1 Month Free Maintenance", text: "We stay involved after launch to handle included bugs and small maintenance needs." },
];

export default function WhyChooseUs() {
  return (
    <section className="section-shell relative py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="The IT HUNKS Difference" title="Built to deliver business" accent="outcomes." description="A small, focused team combining product thinking, design, engineering and practical business-system experience." align="center" />
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {reasons.map(({ icon: Icon, title, text }, index) => (
            <motion.article key={title} initial={{ opacity: 0, scale: 0.94, y: 22 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.55, delay: (index % 3) * 0.065 }} whileHover={{ y: -6 }} className="glass-card group relative min-h-[190px] overflow-hidden p-6">
              <span className="relative grid size-10 place-items-center rounded-xl bg-white/[0.05] text-blue-400 ring-1 ring-white/[0.08] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"><Icon className="size-5" /></span>
              <h3 className="relative mt-5 font-heading text-lg font-medium text-zinc-100">{title}</h3>
              <p className="relative mt-2.5 text-sm leading-6 text-zinc-500">{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
