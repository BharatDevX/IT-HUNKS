"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Boxes, Rocket, Wrench } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import { AssemblyScene } from "../three/Scenes";

const points = [
  { icon: Boxes, title: "Architecture first", text: "Every product starts with a clear structure, so it can grow with your business instead of being rebuilt." },
  { icon: Wrench, title: "Engineered, not templated", text: "Custom software, websites and apps built around your workflows and customers." },
  { icon: Rocket, title: "Idea to launch", text: "One team takes the requirement through design, development, integration and deployment." },
];

/** Scene 2 — blocks drift together into a structure as the section scrolls in (desktop: structure left, copy right). */
export default function IdeasToProducts() {
  return (
    <section id="engineering" className="section-shell relative min-h-[100svh] py-24 sm:py-32 lg:py-40">
      <AssemblyScene />
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">
        <div className="hidden lg:block" aria-hidden="true" />
        <div>
          <SectionHeading
            eyebrow="From Idea to Product"
            title="Great Ideas Deserve"
            accent="Great Engineering."
            description="IT HUNKS helps businesses transform ideas into scalable digital products, from the first requirement to a launched, maintained system."
          />
          <div className="mt-10 space-y-3">
            {points.map(({ icon: Icon, title, text }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.65, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card flex gap-4 p-5"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-300 ring-1 ring-blue-400/15"><Icon className="size-4.5" /></span>
                <div>
                  <h3 className="font-heading text-lg font-medium text-white">{title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-zinc-400">{text}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <a href="#services" className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white">See what we build <ArrowUpRight className="size-4 text-blue-400 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></a>
        </div>
      </div>
    </section>
  );
}
