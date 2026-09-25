"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import SectionHeading from "../ui/SectionHeading";

const faqs = [
  { question: "How long does a typical project take?", answer: "We prioritize fast delivery, but the exact timeline depends on scope, integrations and approvals. After discovery, you receive a clear timeline with milestones." },
  { question: "What do you need from me to get started?", answer: "We begin with your goals, audience, offer, and any existing brand material. If some pieces are missing, we help structure them during the planning phase." },
  { question: "Are database integration and maintenance really free?", answer: "Database integration is included where applicable, and the packages on this page include one month of free post-launch maintenance for the agreed scope. The exact coverage is documented clearly in your project scope." },
  { question: "Will my website be optimized for search engines?", answer: "Every build includes technical SEO foundations: semantic structure, metadata, performance, responsive behavior, and crawlability. Broader content strategy can be scoped separately." },
  { question: "Can you work with an existing product or codebase?", answer: "Absolutely. We can audit, redesign, extend, or stabilize an existing website or app. We first review the codebase so recommendations are grounded in its actual condition." },
  { question: "What happens after the product launches?", answer: "We monitor the release, resolve covered issues, and support ongoing improvements. Our listed packages include one month of free maintenance so launch is not simply a handoff." },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="section-shell relative py-24 sm:py-32 lg:py-40">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 sm:px-8 lg:grid-cols-[.42fr_.58fr] lg:gap-20 lg:px-12">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            eyebrow="FAQ"
            title="Good questions."
            accent="Clear answers."
            description="Everything you need to know before we begin building together."
          />
          <p className="mt-8 text-sm text-zinc-500">
            Still curious?{" "}
            <a href="mailto:ithunks.in@gmail.com" className="font-medium text-blue-400 transition-colors hover:text-blue-300">
              Talk directly with our team.
            </a>
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const open = openIndex === index;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: index * 0.045 }}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  open ? "border-blue-400/25 bg-blue-500/[0.055]" : "border-white/[0.08] bg-white/[0.025] hover:border-white/[0.14]"
                }`}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? -1 : index)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-5 p-5 text-left font-heading text-base font-medium text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400 sm:p-6 sm:text-lg"
                  >
                    {faq.question}
                    <span className={`grid size-8 shrink-0 place-items-center rounded-full border transition-colors ${open ? "border-blue-400/30 bg-blue-500/15 text-blue-300" : "border-white/10 text-zinc-500"}`}>
                      {open ? <Minus className="size-4" /> : <Plus className="size-4" />}
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ height: { duration: 0.32, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.2 } }}
                    >
                      <p className="px-5 pb-6 pr-16 text-sm leading-7 text-zinc-500 sm:px-6 sm:pr-20">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
