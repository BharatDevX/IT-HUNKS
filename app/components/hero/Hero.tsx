"use client";

import { useGSAP } from "@gsap/react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ArrowDown, ArrowRight, CircleCheck } from "lucide-react";
import { useRef } from "react";
import Image from "next/image";
import MagneticLink from "../ui/MagneticLink";
import { HeroScene } from "../three/Scenes";
import HeroBackground from "./HeroBackground";
import { TRACKZY_COPY } from "../trackzy/content";

const techPills = ["Web & Mobile", "CRM / ERP", "AI Solutions", "Dashboards", "Digital Marketing"];

function ZohoBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      className="mx-auto mb-6 flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-2.5 shadow-[0_0_35px_rgba(59,130,246,.08)] backdrop-blur-xl lg:mx-0"
    >
      <span className="relative flex h-9 w-[92px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white px-2 py-1 shadow-[0_0_24px_rgba(255,255,255,.08)]" aria-label="ZOHO logo">
        <Image src="/zoho-logo.png" alt="ZOHO" width={82} height={38} className="h-auto w-full object-contain" priority />
      </span>
      <span className="text-xs font-semibold text-zinc-300 sm:text-sm">Authorized partner with <strong className="font-bold tracking-tight text-white">ZOHO</strong></span>
    </motion.div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useGSAP(() => {
    if (reduceMotion) {
      gsap.set(".hero-reveal", { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(".hero-reveal", { opacity: 0, y: 54 }, { opacity: 1, y: 0, duration: 1, stagger: 0.09, ease: "power3.out", delay: 0.15, clearProps: "transform" });
  }, { scope: sectionRef, dependencies: [reduceMotion] });

  return (
    <section id="home" ref={sectionRef} className="relative isolate min-h-[100svh] overflow-hidden pt-[76px]">
      {/* Static atmosphere underneath; the Trackzy WebGL scene renders above it and below the copy. */}
      <HeroBackground />
      <div className="absolute inset-0 hidden lg:block">
        <HeroScene />
      </div>
      {/* Readability scrim: keeps the headline crisp over the 3D scene. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] bg-[linear-gradient(90deg,rgba(5,5,5,.78)_0%,rgba(5,5,5,.38)_42%,transparent_68%)] max-lg:bg-[linear-gradient(180deg,rgba(5,5,5,.72)_0%,rgba(5,5,5,.25)_55%,transparent_80%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-40 bg-gradient-to-b from-transparent to-[#050505]" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-76px)] max-w-[1440px] items-center px-5 pb-10 pt-12 sm:px-8 sm:pt-16 lg:px-12 lg:pb-16 lg:pt-6">
        <div className="relative z-20 mx-auto max-w-[700px] text-center lg:mx-0 lg:max-w-[640px] lg:text-left">
          <ZohoBadge />
          <div className="hero-reveal inline-flex items-center gap-2.5 rounded-full border border-teal-300/25 bg-teal-400/[0.07] py-1.5 pl-1.5 pr-4 text-[11px] font-semibold tracking-[0.2em] text-teal-100 shadow-[inset_0_1px_0_rgba(255,255,255,.06),0_0_24px_rgba(22,194,168,.1)] sm:text-xs">
            <Image src="/trackzy-logo.png" alt="" width={24} height={24} className="size-6 rounded-md" />
            {TRACKZY_COPY.label}
            <motion.span aria-hidden="true" animate={reduceMotion ? undefined : { opacity: [0.35, 1, 0.35] }} transition={{ duration: 2.2, repeat: Infinity }} className="size-1.5 rounded-full bg-teal-300 shadow-[0_0_8px_#5eead4]" />
          </div>
          <h1 aria-label="We Build Digital Experiences That Move Businesses Forward." className="mt-6 font-heading text-[clamp(2.4rem,4.6vw,4.9rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-white">
            <span aria-hidden="true" className="block overflow-hidden pb-[0.08em]"><span className="hero-reveal block">We Build Digital</span></span>
            <span aria-hidden="true" className="block overflow-hidden pb-[0.08em]"><span className="hero-reveal hero-gradient-text block">Experiences That</span></span>
            <span aria-hidden="true" className="block overflow-hidden pb-[0.08em]"><span className="hero-reveal block">Move Businesses</span></span>
            <span aria-hidden="true" className="block overflow-hidden pb-[0.08em]"><span className="hero-reveal block text-[.58em] tracking-[-0.04em] text-zinc-300">Forward.</span></span>
          </h1>
          <p className="hero-reveal mx-auto mt-5 max-w-[580px] text-base leading-7 text-zinc-300/80 sm:text-lg sm:leading-8 lg:mx-0">From intelligent AI solutions to scalable websites, mobile applications, CRM, and ERP platforms, we turn ambitious ideas into powerful digital products.</p>
          <div className="hero-reveal mx-auto mt-6 max-w-[560px] rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-center shadow-[0_0_40px_rgba(59,130,246,.07)] backdrop-blur-xl lg:mx-0 lg:text-left">
            <p className="font-heading text-lg font-semibold tracking-[-0.02em] text-white sm:text-xl">One connected platform. <span className="text-teal-300">Your entire business.</span></p>
            <p className="mt-1.5 text-[13px] leading-6 text-zinc-400 sm:text-sm">{TRACKZY_COPY.description}</p>
          </div>
          <div className="hero-reveal mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:justify-start">
            <MagneticLink href="#trackzy" className="group relative flex items-center gap-2.5 overflow-hidden rounded-full bg-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_35px_rgba(59,130,246,.36)] transition-shadow hover:shadow-[0_0_50px_rgba(59,130,246,.52)] sm:px-7 sm:py-4"><span className="absolute inset-0 translate-y-full bg-blue-400 transition-transform duration-300 group-hover:translate-y-0" /><span className="relative">{TRACKZY_COPY.primaryCta}</span><ArrowDown className="relative size-4 transition-transform group-hover:translate-y-0.5" /></MagneticLink>
            <MagneticLink href="#contact" strength={0.14} className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-zinc-200 backdrop-blur-lg transition-colors hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-white sm:px-7 sm:py-4">{TRACKZY_COPY.secondaryCta}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></MagneticLink>
          </div>
          <div className="hero-reveal mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
            {techPills.map((item, index) => <motion.span key={item} whileHover={reduceMotion ? undefined : { y: -3, scale: 1.03 }} transition={{ type: "spring", stiffness: 350, damping: 20 }} className="flex items-center gap-1.5 rounded-full border border-white/[0.09] bg-white/[0.035] px-3 py-1.5 text-xs text-zinc-400 backdrop-blur-xl transition-colors hover:border-blue-400/30 hover:text-zinc-200 sm:px-3.5 sm:py-2"><CircleCheck className={`size-3 ${index < 2 ? "text-blue-400" : "text-zinc-600"}`} />{item}</motion.span>)}
          </div>
        </div>
      </div>
      {/* Narrow screens: the product scene gets its own block below the copy instead of sitting behind it. */}
      <div className="relative z-10 h-[400px] sm:h-[500px] lg:hidden">
        <HeroScene side={false} />
      </div>
      <motion.a href="#about" aria-label="Scroll to next section" animate={reduceMotion ? undefined : { y: [0, 7, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-5 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-2 text-[9px] font-medium uppercase tracking-[0.22em] text-zinc-500 transition-colors hover:text-blue-400 lg:flex">Scroll<span className="flex h-8 w-5 justify-center rounded-full border border-white/15 pt-1.5"><span className="h-1.5 w-0.5 rounded-full bg-blue-400" /></span></motion.a>
    </section>
  );
}
