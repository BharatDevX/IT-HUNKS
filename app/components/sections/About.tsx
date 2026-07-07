"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

const stats = [
  { value: "100%", label: "Client Satisfaction", note: "Every launch, fully supported" },
  { value: "3+", label: "Projects", note: "Purpose-built digital products" },
  { value: "24/7", label: "Support", note: "Here when your business needs us" },
];

export default function About() {
  return (
    <section id="about" className="section-shell relative py-24 sm:py-32 lg:py-40">
      <div className="section-orb -left-64 top-24 bg-blue-600/10" />
      <div className="mx-auto grid max-w-[1440px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[.95fr_1.05fr] lg:gap-20 lg:px-12">
        <div>
          <SectionHeading eyebrow="About IT HUNKS" title="We turn bold ideas into" accent="digital growth." />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mt-8 space-y-5 text-base leading-8 text-zinc-400"
          >
            <p>
              IT HUNKS is a product-minded software agency building fast, elegant,
              and dependable digital experiences for ambitious businesses.
            </p>
            <p>
              Strategy, design, engineering, launch, and long-term care all live
              under one roof—so your product feels coherent at every touchpoint.
            </p>
            <div className="grid gap-3 pt-3 sm:grid-cols-2">
              {["Business-first strategy", "Scalable engineering", "Conversion-led design", "Long-term partnership"].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <CheckCircle2 className="size-4 shrink-0 text-blue-400" />
                  {item}
                </div>
              ))}
            </div>
            <a href="#services" className="group inline-flex items-center gap-2 pt-3 text-sm font-semibold text-white">
              Explore our capabilities
              <ArrowUpRight className="size-4 text-blue-400 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </motion.div>
        </div>

        <div className="relative">
          <div className="absolute inset-1/4 rounded-full bg-blue-500/15 blur-[90px]" />
          <div className="relative grid gap-4 sm:grid-cols-2">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9, y: 24 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className={`glass-card group relative overflow-hidden p-7 sm:p-8 ${index === 0 ? "sm:col-span-2" : ""}`}
              >
                <div className="absolute -right-12 -top-12 size-36 rounded-full bg-blue-500/10 blur-2xl transition-colors group-hover:bg-blue-500/20" />
                <p className="relative font-heading text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl">
                  {stat.value}
                </p>
                <p className="relative mt-4 font-heading text-lg font-medium text-zinc-200">{stat.label}</p>
                <p className="relative mt-1 text-sm text-zinc-500">{stat.note}</p>
                <div className="relative mt-6 h-px overflow-hidden bg-white/[0.08]">
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.25 + index * 0.1 }}
                    className="block h-full origin-left bg-gradient-to-r from-blue-500 to-transparent"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
