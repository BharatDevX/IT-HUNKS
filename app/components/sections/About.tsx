"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Layers3, ShieldCheck, Zap } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

const pillars = [
  { icon: Zap, title: "Fast execution", text: "Lean delivery with clear milestones and direct communication." },
  { icon: Layers3, title: "Business-first systems", text: "We connect customer experience with the workflows behind the business." },
  { icon: ShieldCheck, title: "Post-launch care", text: "Every listed package includes one month of free maintenance for the included scope." },
];

export default function About() {
  return (
    <section id="about" className="section-shell relative py-24 sm:py-32 lg:py-40">
      <div className="section-orb -left-64 top-24 bg-blue-600/10" />
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-20 lg:px-12">
        <div>
          <SectionHeading eyebrow="Why IT HUNKS" title="Technology should make" accent="business simpler." />
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.7, delay: 0.12 }} className="mt-8 space-y-5 text-base leading-8 text-zinc-400">
            <p>IT HUNKS builds industry-focused software and custom technology around real business needs—not generic templates.</p>
            <p>From customer-facing websites and mobile apps to CRM, ERP, AI assistants and dashboards, our team can take a requirement from understanding to design, build, integration and launch.</p>
            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              {["Custom business workflows", "Scalable engineering", "Clear project communication", "Fast delivery + free maintenance"].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-zinc-300"><CheckCircle2 className="size-4 shrink-0 text-blue-400" />{item}</div>
              ))}
            </div>
            <a href="#services" className="group inline-flex items-center gap-2 pt-3 text-sm font-semibold text-white">Explore our services <ArrowUpRight className="size-4 text-blue-400 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></a>
          </motion.div>
        </div>
        <div className="grid gap-3">
          {pillars.map(({ icon: Icon, title, text }, index) => (
            <motion.div key={title} initial={{ opacity: 0, x: 25 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.6, delay: index * 0.08 }} whileHover={{ x: 5 }} className="glass-card group flex gap-5 p-6 sm:p-7">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-300 ring-1 ring-blue-400/15"><Icon className="size-5" /></span>
              <div><h3 className="font-heading text-xl font-medium text-white">{title}</h3><p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">{text}</p></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
