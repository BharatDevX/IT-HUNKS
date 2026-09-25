"use client";

import { motion } from "framer-motion";
import { BarChart3, Bot, BriefcaseBusiness, Check, Globe2, Smartphone } from "lucide-react";
import MagneticLink from "../ui/MagneticLink";
import SectionHeading from "../ui/SectionHeading";

const plans = [
  {
    name: "Website Premium",
    price: "₹14,999",
    icon: Globe2,
    description: "A premium business website built to communicate value, earn trust and generate enquiries.",
    features: ["Premium UI/UX", "Responsive & SEO-ready", "Database integration", "Deployment support", "Fast delivery", "1 month free maintenance"],
    featured: true,
  },
  {
    name: "App Premium",
    price: "₹24,999",
    icon: Smartphone,
    description: "A polished mobile product for businesses that need customers or teams on the move.",
    features: ["Android / iOS app", "API & database integration", "Authentication & core flows", "Production build support", "Fast delivery", "1 month free maintenance"],
    featured: false,
  },
  {
    name: "CRM / ERP",
    price: "₹34,999",
    icon: BriefcaseBusiness,
    description: "A connected business platform for sales, field operations, inventory and management visibility.",
    features: ["Sales & order management", "Field force / visits", "Inventory & operations", "Expenses & follow-ups", "Reports & dashboards", "1 month free maintenance"],
    featured: false,
  },
  {
    name: "AI Solution / AI Chatbot",
    price: "₹24,999",
    icon: Bot,
    description: "A practical AI assistant or automation layer designed around a real customer or internal workflow.",
    features: ["GenAI / LLM integration", "AI chatbot or assistant", "RAG knowledge base", "Business automation", "API integrations", "1 month free maintenance"],
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="section-shell relative py-24 sm:py-32 lg:py-40">
      <div className="section-orb -left-72 top-40 bg-blue-500/10" />
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Starting Packages"
          title="Straightforward pricing."
          accent="Clear deliverables."
          description="These are starting packages. Final scope, integrations and delivery timeline are confirmed after understanding your business requirement."
          align="center"
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.article
                key={plan.name}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.65, delay: index * 0.07 }}
                whileHover={{ y: -8 }}
                className={`pricing-card relative flex min-h-[535px] flex-col overflow-hidden rounded-2xl border p-6 sm:p-7 ${plan.featured ? "border-blue-400/40 bg-gradient-to-b from-blue-500/[0.14] to-[#0f1117] shadow-[0_0_55px_rgba(59,130,246,.12)]" : "border-white/[0.08] bg-[#0f1117]/90"}`}
              >
                {plan.featured && <div className="absolute right-0 top-0 rounded-bl-xl border-b border-l border-blue-400/20 bg-blue-500 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white">Popular</div>}
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-xl bg-blue-500/10 text-blue-300"><Icon className="size-5" /></span>
                  <BarChart3 className="size-4 text-zinc-700" />
                </div>
                <h3 className="mt-7 font-heading text-xl font-medium text-zinc-100">{plan.name}</h3>
                <p className="mt-6 font-heading text-4xl font-semibold tracking-[-0.055em] text-white">{plan.price}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-zinc-600">Starting price</p>
                <p className="mt-5 min-h-16 text-sm leading-6 text-zinc-500">{plan.description}</p>
                <div className="my-6 h-px bg-white/[0.08]" />
                <ul className="space-y-3.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-blue-500/12 text-blue-400"><Check className="size-3" /></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-7">
                  <MagneticLink href="#contact" strength={0.1} className={`flex w-full items-center justify-center rounded-full py-3.5 text-sm font-semibold ${plan.featured ? "bg-blue-500 text-white hover:bg-blue-400" : "border border-white/10 bg-white/[0.04] text-zinc-200 hover:border-blue-400/30 hover:bg-blue-500/10"}`}>Get this package</MagneticLink>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {[
            ["01", "Scope first", "We confirm requirements before committing the final scope."],
            ["02", "Fast delivery", "Focused execution with milestones and clear communication."],
            ["03", "1 month care", "Free maintenance after launch for the included scope."],
          ].map(([number, title, text], index) => (
            <motion.div key={title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-5">
              <span className="text-[10px] font-bold tracking-[0.2em] text-blue-400">{number}</span>
              <h4 className="mt-2 text-sm font-semibold text-white">{title}</h4>
              <p className="mt-1 text-xs leading-5 text-zinc-500">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
