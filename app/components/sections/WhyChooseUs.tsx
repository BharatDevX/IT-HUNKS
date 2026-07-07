"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Database,
  Gauge,
  LayoutTemplate,
  MonitorSmartphone,
  SearchCheck,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

const reasons = [
  { icon: Gauge, title: "Fast Delivery", text: "Lean execution and clear milestones keep momentum high." },
  { icon: LayoutTemplate, title: "Premium UI", text: "Distinctive visual systems crafted to earn attention and trust." },
  { icon: SearchCheck, title: "SEO Ready", text: "Semantic, fast, crawlable builds from the first commit." },
  { icon: Database, title: "Free Database Integration", text: "A reliable data foundation included with eligible projects." },
  { icon: Bot, title: "AI Powered", text: "Smart automation where it adds real speed and value." },
  { icon: MonitorSmartphone, title: "Fully Responsive", text: "Pixel-sharp experiences across phones, tablets, and desktops." },
  { icon: ShieldCheck, title: "Secure by Design", text: "Careful permissions, validation, and production best practices." },
  { icon: Wrench, title: "6 Months Free Maintenance", text: "Post-launch support to keep your product healthy and evolving." },
];

export default function WhyChooseUs() {
  return (
    <section className="section-shell relative py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Why IT HUNKS"
          title="A partner built for"
          accent="meaningful outcomes."
          description="Senior-level thinking, careful craftsmanship, and practical support—without agency drag."
          align="center"
        />
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {reasons.map(({ icon: Icon, title, text }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, scale: 0.94, y: 22 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, delay: (index % 4) * 0.065 }}
              whileHover={{ y: -6 }}
              className="glass-card group relative min-h-[215px] overflow-hidden p-6"
            >
              <div className="absolute -right-12 -top-12 size-32 rounded-full bg-blue-500/0 blur-2xl transition-colors duration-500 group-hover:bg-blue-500/15" />
              <span className="relative grid size-10 place-items-center rounded-xl bg-white/[0.05] text-blue-400 ring-1 ring-white/[0.08] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                <Icon className="size-5" />
              </span>
              <h3 className="relative mt-6 font-heading text-lg font-medium text-zinc-100">{title}</h3>
              <p className="relative mt-3 text-sm leading-6 text-zinc-500">{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
