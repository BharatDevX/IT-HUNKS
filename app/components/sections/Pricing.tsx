"use client";

import { motion } from "framer-motion";
import {
  Bug,
  Check,
  Database,
  Globe2,
  Headphones,
  Rocket,
  SearchCheck,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import MagneticLink from "../ui/MagneticLink";
import SectionHeading from "../ui/SectionHeading";

const plans = [
  { name: "Website Basic", price: "₹7,000", description: "A focused, professional web presence.", features: ["Responsive website", "SEO foundations", "Deployment", "Database integration"], popular: false },
  { name: "Website Premium", price: "₹15,000", description: "A distinctive website built to convert.", features: ["Premium UI/UX", "Advanced animations", "SEO optimization", "6 months Free maintenance"], popular: true },
  { name: "App Basic", price: "₹15,000", description: "A clean mobile product for a core idea.", features: ["Responsive app UI", "API integration", "Database setup", "Deployment support"], popular: false },
  { name: "App Premium", price: "₹25,000", description: "A refined app ready for serious growth.", features: ["Premium app experience", "Advanced integrations", "Smooth animations", "6 months maintenance"], popular: false },
];

const benefits = [
  { icon: Database, title: "Free Database", text: "Integration included" },
  { icon: SearchCheck, title: "Free SEO", text: "Technical foundations" },
  { icon: Rocket, title: "Free Deployment", text: "Launch handled" },
  { icon: Globe2, title: "Domain Connection", text: "Configured for free" },
  { icon: ShieldCheck, title: "Free SSL", text: "Secure by default" },
  { icon: Headphones, title: "Free Consultation", text: "Clarity before code" },
  { icon: Wrench, title: "6 Months Maintenance", text: "Post-launch care" },
  { icon: Bug, title: "Bug Fixes", text: "Covered after launch" },
];

export default function Pricing() {
  return (
    <section id="pricing" className="section-shell relative py-24 sm:py-32 lg:py-40">
      <div className="section-orb -left-72 top-40 bg-blue-500/10" />
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Simple Pricing"
          title="Clear scope."
          accent="Serious value."
          description="Straightforward starting packages with the essentials already included. Final scope is confirmed after a free consultation."
          align="center"
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {plans.map((plan, index) => (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.65, delay: index * 0.07 }}
              whileHover={{ y: -8 }}
              className={`pricing-card relative flex min-h-[510px] flex-col overflow-hidden rounded-2xl border p-6 ${
                plan.popular
                  ? "border-blue-400/40 bg-gradient-to-b from-blue-500/[0.13] to-[#0f0f12] shadow-[0_0_55px_rgba(59,130,246,.12)]"
                  : "border-white/[0.08] bg-[#0f0f12]/85"
              }`}
            >
              {plan.popular && (
                <div className="absolute right-0 top-0 rounded-bl-xl border-b border-l border-blue-400/20 bg-blue-500 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white">
                  Most Popular
                </div>
              )}
              <p className="text-sm font-medium text-zinc-300">{plan.name}</p>
              <p className="mt-8 font-heading text-4xl font-semibold tracking-[-0.055em] text-white">{plan.price}</p>
              <p className="mt-1 text-xs text-zinc-600">Starting price</p>
              <p className="mt-6 min-h-12 text-sm leading-6 text-zinc-500">{plan.description}</p>
              <div className="my-7 h-px bg-white/[0.08]" />
              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-zinc-400">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-blue-500/12 text-blue-400"><Check className="size-3" /></span>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <MagneticLink
                  href="#contact"
                  strength={0.12}
                  className={`flex w-full items-center justify-center rounded-full py-3.5 text-sm font-semibold transition-colors ${
                    plan.popular ? "bg-blue-500 text-white hover:bg-blue-400" : "border border-white/10 bg-white/[0.04] text-zinc-200 hover:border-blue-400/30 hover:bg-blue-500/10"
                  }`}
                >
                  Choose {plan.name}
                </MagneticLink>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-24 lg:mt-32">
          <SectionHeading eyebrow="Included Free" title="More launch." accent="Less overhead." align="center" />
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, title, text }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.5, delay: (index % 4) * 0.055 }}
                className="glass-card group flex items-center gap-4 p-5"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-400 transition-transform group-hover:scale-110"><Icon className="size-5" /></span>
                <div><h3 className="text-sm font-medium text-zinc-200">{title}</h3><p className="mt-1 text-xs text-zinc-600">{text}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
