"use client";

import { useGSAP } from "@gsap/react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ArrowDown, ArrowRight, CircleCheck, Sparkles } from "lucide-react";
import { useRef } from "react";
import MagneticLink from "../ui/MagneticLink";
import FloatingMockups from "./FloatingMockups";
import HeroBackground from "./HeroBackground";

const techPills = ["React", "Next.js", "AI", "SEO", "Database", "Mobile Apps"];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reduceMotion) {
        gsap.set(".hero-reveal", { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        ".hero-reveal",
        { opacity: 0, y: 54 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.09,
          ease: "power3.out",
          delay: 0.15,
          clearProps: "transform",
        },
      );
    },
    { scope: sectionRef, dependencies: [reduceMotion] },
  );

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative isolate min-h-[100svh] overflow-hidden pt-[76px]"
    >
      <HeroBackground />

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-76px)] max-w-[1440px] items-center gap-6 px-5 pb-16 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[.84fr_1.16fr] lg:gap-4 lg:px-12 lg:pb-10 lg:pt-6">
        <div className="relative z-20 mx-auto max-w-[690px] text-center lg:mx-0 lg:text-left">
          <div className="hero-reveal inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/[0.09] px-4 py-2 text-xs font-medium text-blue-200 shadow-[inset_0_1px_0_rgba(255,255,255,.06),0_0_24px_rgba(59,130,246,.08)] sm:text-sm">
            <motion.span
              animate={reduceMotion ? undefined : { rotate: [0, 12, -8, 0], scale: [1, 1.12, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1 }}
            >
              <Sparkles className="size-4 text-blue-400" />
            </motion.span>
            Trusted by growing businesses
          </div>

          <h1 className="mt-7 font-heading text-[clamp(2.85rem,6.2vw,6.2rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-white">
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="hero-reveal block">Building Powerful</span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="hero-reveal hero-gradient-text block">Websites &amp;</span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="hero-reveal block">Mobile Apps</span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="hero-reveal block text-[.66em] tracking-[-0.04em] text-zinc-300">
                That Grow Businesses.
              </span>
            </span>
          </h1>

          <p className="hero-reveal mx-auto mt-6 max-w-[590px] text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8 lg:mx-0">
            We design and build high-performance digital products—from premium
            websites to scalable mobile apps, AI integrations, and search-ready
            experiences.
          </p>

          <div className="hero-reveal mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:justify-start">
            <MagneticLink
              href="#contact"
              className="group relative flex items-center gap-2.5 overflow-hidden rounded-full bg-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_35px_rgba(59,130,246,.36)] transition-shadow hover:shadow-[0_0_50px_rgba(59,130,246,.52)] sm:px-7 sm:py-4"
            >
              <span className="absolute inset-0 translate-y-full bg-blue-400 transition-transform duration-300 group-hover:translate-y-0" />
              <span className="relative">Start Your Project</span>
              <ArrowRight className="relative size-4 transition-transform group-hover:translate-x-1" />
            </MagneticLink>
            <MagneticLink
              href="#portfolio"
              strength={0.14}
              className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-zinc-200 backdrop-blur-lg transition-colors hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-white sm:px-7 sm:py-4"
            >
              View Portfolio
              <ArrowDown className="size-4 transition-transform group-hover:translate-y-1" />
            </MagneticLink>
          </div>

          <div className="hero-reveal mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
            {techPills.map((item, index) => (
              <motion.span
                key={item}
                whileHover={reduceMotion ? undefined : { y: -3, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="flex items-center gap-1.5 rounded-full border border-white/[0.09] bg-white/[0.035] px-3 py-1.5 text-xs text-zinc-400 backdrop-blur-xl transition-colors hover:border-blue-400/30 hover:text-zinc-200 sm:px-3.5 sm:py-2"
              >
                <CircleCheck className={`size-3 ${index < 2 ? "text-blue-400" : "text-zinc-600"}`} />
                {item}
              </motion.span>
            ))}
          </div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.1, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 -mx-3 mt-2 sm:mx-0 lg:mt-0"
        >
          <FloatingMockups />
        </motion.div>
      </div>

      <motion.a
        href="#services"
        aria-label="Scroll to services"
        animate={reduceMotion ? undefined : { y: [0, 7, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-5 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-2 text-[9px] font-medium uppercase tracking-[0.22em] text-zinc-600 transition-colors hover:text-blue-400 lg:flex"
      >
        Scroll
        <span className="flex h-8 w-5 justify-center rounded-full border border-white/15 pt-1.5">
          <span className="h-1.5 w-0.5 rounded-full bg-blue-400" />
        </span>
      </motion.a>
    </section>
  );
}
