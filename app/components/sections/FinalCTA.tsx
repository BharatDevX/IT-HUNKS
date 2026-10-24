"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarDays, Sparkles } from "lucide-react";
import MagneticLink from "../ui/MagneticLink";
import { ConvergeScene } from "../three/Scenes";

export default function FinalCTA() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="contact" className="relative px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto max-w-[1340px] overflow-hidden rounded-[28px] border border-blue-400/20 bg-[#090c13] px-6 py-20 text-center shadow-[0_0_100px_rgba(59,130,246,.1)] sm:px-12 sm:py-28"
      >
        <div className="hero-grid absolute inset-0 opacity-40" />
        <ConvergeScene />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(9,12,19,.82)_0%,rgba(9,12,19,.55)_38%,transparent_70%)]" />
        <motion.div
          animate={reduceMotion ? undefined : { scale: [1, 1.16, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/25 blur-[120px]"
        />
        <div className="relative">
          <div className="mx-auto mb-7 flex w-fit items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs text-blue-200">
            <Sparkles className="size-3.5 text-blue-400" /> Your next chapter starts here
          </div>
          <h2 className="mx-auto max-w-4xl font-heading text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
            Have an Idea? <span className="hero-gradient-text">Let’s Build Something Extraordinary.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
            Tell us what you want to build. We’ll help turn it into a practical digital solution.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticLink
              href="mailto:ithunks.in@gmail.com?subject=IT%20HUNKS%20Project%20Consultation"
              className="group flex items-center gap-2.5 rounded-full bg-blue-500 px-7 py-4 text-sm font-semibold text-white shadow-[0_0_40px_rgba(59,130,246,.35)] transition-colors hover:bg-blue-400"
            >
              <CalendarDays className="size-4" /> Let’s Talk About Your Project
            </MagneticLink>
            <MagneticLink
              href="https://wa.me/919528681406?text=Hi%20IT%20HUNKS%2C%20I%20want%20to%20discuss%20a%20project."
              strength={0.14}
              className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-7 py-4 text-sm font-semibold text-zinc-200 backdrop-blur-xl transition-colors hover:border-blue-400/35 hover:bg-blue-500/10"
            >
              WhatsApp Us <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </MagneticLink>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
