"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart3, BellRing, Blocks, CalendarCheck, LayoutDashboard, MapPin, ShoppingCart, Users, type LucideIcon } from "lucide-react";
import Image from "next/image";
import SectionHeading from "../ui/SectionHeading";
import MagneticLink from "../ui/MagneticLink";
import PanelPreview from "./PanelPreview";
import { TRACKZY_COPY, confirmedModules } from "./content";

const ICONS: Record<string, LucideIcon> = {
  overview: LayoutDashboard,
  team: Users,
  attendance: CalendarCheck,
  tracking: MapPin,
  sales: ShoppingCart,
  followups: BellRing,
  analytics: BarChart3,
  custom: Blocks,
};

/** Scene F — the 3D story gives way to a clean, readable product section with a clear call to action. */
export default function TrackzyProduct() {
  const modules = confirmedModules();
  return (
    <section id="trackzy" className="section-shell relative scroll-mt-20 py-24 sm:py-32 lg:py-36">
      <div aria-hidden="true" className="section-orb -right-40 top-10 bg-blue-600/15" />
      <div aria-hidden="true" className="section-orb -left-52 bottom-0 bg-teal-400/[0.07]" />
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <div className="mb-8 flex flex-wrap items-center gap-3 text-xs font-semibold tracking-[0.14em] text-zinc-400">
              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-3.5">
                <Image src="/trackzy-logo.png" alt="" width={24} height={24} className="size-6 rounded-md" />
                <span className="text-white">TRACKZY</span>
                <span className="text-zinc-500">ERP + CRM</span>
              </span>
              <span>a product by <span className="text-zinc-200">IT-HUNKS</span></span>
            </div>
            <SectionHeading
              eyebrow="Our flagship platform"
              title="One connected platform for"
              accent="your entire business."
              description={TRACKZY_COPY.description}
            />
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {modules.map((m, i) => {
                const Icon = ICONS[m.id] ?? Blocks;
                return (
                  <motion.li
                    key={m.id}
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5, delay: (i % 2) * 0.06 }}
                    className="glass-card flex gap-4 p-4"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10"><Icon className="size-5 text-blue-300" aria-hidden="true" /></span>
                    <span>
                      <span className="block text-sm font-semibold text-white">{m.title}</span>
                      <span className="mt-1 block text-[13px] leading-5 text-zinc-400">{m.description}</span>
                    </span>
                  </motion.li>
                );
              })}
            </ul>
            <div className="mt-10 rounded-2xl border border-teal-300/15 bg-teal-400/[0.04] p-5">
              <p className="font-heading text-lg font-semibold tracking-[-0.02em] text-white sm:text-xl">{TRACKZY_COPY.customizeLine}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">IT-HUNKS works with you to customize Trackzy’s modules and workflows around your business requirements — tell us how your team operates and we’ll shape it with you.</p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <MagneticLink href="#contact" className="group relative flex items-center gap-2.5 overflow-hidden rounded-full bg-blue-500 px-7 py-4 text-sm font-semibold text-white shadow-[0_0_35px_rgba(59,130,246,.36)] transition-shadow hover:shadow-[0_0_50px_rgba(59,130,246,.52)]">
                <span className="absolute inset-0 translate-y-full bg-blue-400 transition-transform duration-300 group-hover:translate-y-0" />
                <span className="relative">{TRACKZY_COPY.secondaryCta}</span>
                <ArrowRight className="relative size-4 transition-transform group-hover:translate-x-1" />
              </MagneticLink>
              <a href="#pricing" className="rounded-full border border-white/15 bg-white/[0.04] px-7 py-4 text-sm font-semibold text-zinc-200 backdrop-blur-lg transition-colors hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-white">View CRM / ERP package</a>
            </div>
          </div>

          {/* Static, readable previews of the admin dashboard and the employee mobile app. */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[760px] pb-16 sm:pb-20"
          >
            <div aria-hidden="true" className="absolute inset-[6%] rounded-full bg-blue-500/20 blur-[100px]" />
            <PanelPreview id="dash" label="Illustrative Trackzy admin dashboard showing sales, visits, attendance and team activity with sample data" className="relative drop-shadow-[0_30px_60px_rgba(0,0,0,.55)]" />
            <div className="absolute -bottom-2 right-[-2%] w-[28%] min-w-[110px] sm:right-[2%]">
              <PanelPreview id="phone" label="Illustrative Trackzy employee mobile app showing attendance, a route preview and visits" className="drop-shadow-[0_24px_50px_rgba(0,0,0,.6)]" />
            </div>
            <p className="absolute bottom-0 left-0 text-[11px] text-zinc-500">{TRACKZY_COPY.previewNote}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
