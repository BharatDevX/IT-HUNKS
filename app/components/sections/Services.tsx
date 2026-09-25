"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Bot,
  BriefcaseBusiness,
  Code2,
  Megaphone,
  Smartphone,
} from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

const services = [
  {
    icon: Code2,
    number: "01",
    title: "Custom Software",
    text: "Purpose-built business applications for workflows that standard software cannot handle cleanly.",
    features: ["Business applications", "Custom workflows", "Automation & integrations", "Scalable architecture"],
  },
  {
    icon: Smartphone,
    number: "02",
    title: "Web & Mobile App Development",
    text: "High-performance websites and mobile products designed around your customers, operations and growth goals.",
    features: ["Responsive web apps", "Android & iOS", "API & database integration", "Production deployment"],
  },
  {
    icon: BriefcaseBusiness,
    number: "03",
    title: "CRM & ERP",
    text: "Connected systems for sales, teams, inventory, field operations, distributors, expenses and reporting.",
    features: ["Sales & orders", "Field force & visits", "Inventory & operations", "Reports & dashboards"],
  },
  {
    icon: Bot,
    number: "04",
    title: "AI Solutions / AI Chatbots",
    text: "Practical AI systems that automate support, knowledge access and repetitive business processes.",
    features: ["GenAI & LLMs", "RAG knowledge assistants", "Customer chatbots", "AI automation"],
  },
  {
    icon: BarChart3,
    number: "05",
    title: "Business Dashboards",
    text: "Decision-ready dashboards that bring scattered business information into one clear operating view.",
    features: ["BI & analytics", "MIS dashboards", "Lead & sales tracking", "Performance reporting"],
  },
  {
    icon: Megaphone,
    number: "06",
    title: "Digital Marketing",
    text: "Search, paid campaigns and social systems built to improve visibility, qualified leads and measurable growth.",
    features: ["SEO & local SEO", "Google Business Profile", "Meta lead campaigns", "Content & social strategy"],
  },
];

export default function Services() {
  return (
    <section id="services" className="section-shell relative py-24 sm:py-32 lg:py-40">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="section-orb -right-64 top-1/3 bg-blue-500/10" />
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="What We Deliver"
          title="Technology that solves"
          accent="real business problems."
          description="From customer-facing products to internal business systems, we design, build and launch solutions around the way your business actually works."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {services.map(({ icon: Icon, number, title, text, features }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.65, delay: (index % 3) * 0.07 }}
              whileHover={{ y: -7 }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0d11] p-6 shadow-[0_20px_70px_rgba(0,0,0,.16)] sm:p-7"
            >
              <div className="absolute -right-16 -top-16 size-40 rounded-full bg-blue-500/10 blur-3xl transition-all duration-500 group-hover:bg-blue-500/20" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="grid size-12 place-items-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
                  <Icon className="size-5" />
                </div>
                <span className="text-xs font-semibold tracking-[0.2em] text-zinc-600">{number}</span>
              </div>
              <h3 className="relative mt-7 font-heading text-2xl font-medium tracking-[-0.035em] text-white">{title}</h3>
              <p className="relative mt-3 text-sm leading-6 text-zinc-500">{text}</p>
              <ul className="relative mt-6 space-y-2.5 border-t border-white/[0.07] pt-5">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <span className="size-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,.7)]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="relative mt-7 flex flex-wrap gap-2">
                <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-blue-200">Fast delivery</span>
                <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-emerald-200">1 month free maintenance</span>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          className="mt-6 flex flex-col items-start justify-between gap-5 rounded-2xl border border-blue-400/15 bg-gradient-to-r from-blue-500/[0.08] to-transparent p-6 sm:flex-row sm:items-center sm:p-7"
        >
          <div>
            <p className="text-sm font-semibold text-white">One delivery promise across every service.</p>
            <p className="mt-1 text-sm text-zinc-500">Fast execution, clear communication and one month of free post-launch maintenance.</p>
          </div>
          <a href="#contact" className="shrink-0 rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-400">Discuss your requirement</a>
        </motion.div>
      </div>
    </section>
  );
}
