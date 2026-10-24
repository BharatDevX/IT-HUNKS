"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import { SystemScene } from "../three/Scenes";

const highlights = [
  "Custom CRM Development",
  "ERP Development and Customization",
  "Business Process Automation",
  "Admin Panels and Dashboards",
  "API and Third-Party Integrations",
];

/** Scene 5 — connected hub nodes, workflow pulses and dashboard slabs behind a clean list. */
export default function SystemsScene() {
  return (
    <section id="systems" className="section-shell relative min-h-[110svh] py-24 sm:py-32 lg:py-40">
      <SystemScene />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-[5] bg-[linear-gradient(90deg,rgba(5,5,5,.8),rgba(5,5,5,.25)_55%,transparent)] max-lg:bg-[linear-gradient(180deg,rgba(5,5,5,.7),rgba(5,5,5,.45))]" />
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">
        <div className="lg:col-start-1">
          <SectionHeading
            eyebrow="CRM & ERP"
            title="Bring Your Entire Business into"
            accent="One Connected System."
            description="Sales, operations, inventory and reporting working from the same source of truth, instead of scattered tools and spreadsheets."
          />
          <ul className="mt-10 space-y-3">
            {highlights.map((item, i) => (
              <motion.li key={item} initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.7 }} transition={{ duration: 0.55, delay: i * 0.06 }} className="flex items-center gap-3 text-base text-zinc-200">
                <CheckCircle2 className="size-5 shrink-0 text-blue-400" />{item}
              </motion.li>
            ))}
          </ul>
          <a href="#pricing" className="mt-9 inline-flex rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-zinc-200 backdrop-blur-lg transition-colors hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-white">View CRM / ERP package</a>
        </div>
      </div>
    </section>
  );
}
