"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, X } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useRef, useState } from "react";
import SectionHeading from "../ui/SectionHeading";

type Solution = {
  id: string;
  title: string;
  summary: string;
  tagline: string;
  image: string;
  width: number;
  height: number;
  capabilities: string[];
};

const solutions: Solution[] = [
  {
    id: "assistant",
    title: "AI Business Assistant",
    summary: "An intelligent business assistant that helps teams analyze information, access insights and streamline everyday operations.",
    tagline: "A conversational assistant that gives your team quick access to business insights and everyday actions.",
    image: "/ai-showcase/01-ai-business-assistant.png",
    width: 1672,
    height: 941,
    capabilities: ["Ask questions in plain language", "Sales and performance insights", "Business report generation", "Pending task and approval views", "Quick actions for tasks and calendar", "Connects to your own business data"],
  },
  {
    id: "dashboard",
    title: "AI Business Dashboard",
    summary: "AI-powered dashboards that turn business data into clear insights, trends and actionable decisions.",
    tagline: "One clear operating view of revenue, sales, customers and orders, built around the numbers you track.",
    image: "/ai-showcase/02-ai-business-dashboard.png",
    width: 1672,
    height: 941,
    capabilities: ["Revenue and sales tracking", "Customer and order metrics", "Trend charts over any date range", "Sales breakdown by product", "Reports for your team", "KPIs tailored to your business"],
  },
  {
    id: "automation",
    title: "AI Automation & Workflows",
    summary: "Automate repetitive business processes with intelligent workflows that connect your systems and teams.",
    tagline: "Automate the work that slows your business down, from the first trigger to the final team notification.",
    image: "/ai-showcase/03-ai-automation-workflows.png",
    width: 1672,
    height: 941,
    capabilities: ["Trigger-based workflows", "AI lead qualification", "CRM updates and email actions", "Automatic team notifications", "Reusable workflow templates", "Run history and status tracking"],
  },
  {
    id: "support",
    title: "AI Customer Support",
    summary: "AI-powered customer support for faster responses, smarter ticket handling and consistent customer experiences.",
    tagline: "Deliver faster, smarter and more consistent customer experiences with AI.",
    image: "/ai-showcase/04-ai-customer-support.png",
    width: 1897,
    height: 829,
    capabilities: ["AI-powered responses", "Smart ticketing", "Customer sentiment analysis", "Knowledge-base integration", "Human handoff", "Support analytics"],
  },
  {
    id: "documents",
    title: "AI Document Intelligence",
    summary: "Extract, understand and organize information from invoices, documents and business files using AI.",
    tagline: "Turn invoices and business documents into structured, usable data without manual entry.",
    image: "/ai-showcase/05-ai-document-intelligence.png",
    width: 1672,
    height: 941,
    capabilities: ["Upload PDF, Word, Excel and image files", "Extraction of key fields such as invoice number, amount and vendor", "Live processing status", "Structured, organized output", "Document insights and analytics", "Templates for your document types"],
  },
  {
    id: "inventory",
    title: "AI Inventory & Forecasting",
    summary: "Use AI to forecast demand, monitor inventory and support smarter stock decisions.",
    tagline: "Predict demand, watch stock levels and act on reorder suggestions before shortages happen.",
    image: "/ai-showcase/06-ai-inventory-forecasting.png",
    width: 1672,
    height: 941,
    capabilities: ["Demand forecast against actuals", "Current stock monitoring", "Low-stock alerts", "Reorder suggestions", "Supplier and purchase order tracking", "Inventory reports"],
  },
];

// Matches the background of the supplied images so the wider one letterboxes invisibly.
const imageFrame = "relative aspect-video overflow-hidden bg-[#e5f2fe]";

export default function AiShowcase() {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const active = solutions.find((s) => s.id === activeId) ?? null;

  const open = (id: string, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setActiveId(id);
  };

  const close = useCallback(() => setActiveId(null), []);

  useEffect(() => {
    if (!activeId) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") return close();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [activeId, close]);

  // Card stack adapted from Skiper UI (skiper17): the stage pins, the current card scales and rotates away
  // while the next one slides up over it. Scrubbed, so scrolling back up reverses it.
  useGSAP(
    () => {
      if (reduceMotion) return;
      gsap.registerPlugin(ScrollTrigger);
      const cards = cardRefs.current.filter((card): card is HTMLElement => card !== null);
      if (!stageRef.current || cards.length < 2) return;

      gsap.set(cards, { yPercent: 100, scale: 1, rotation: 0 });
      gsap.set(cards[0], { yPercent: 0 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top 92px",
          end: () => `+=${window.innerHeight * (cards.length - 1)}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      cards.slice(0, -1).forEach((card, index) => {
        timeline.to(card, { scale: 0.7, rotation: 5, duration: 1, ease: "none" }, index);
        timeline.to(cards[index + 1], { yPercent: 0, duration: 1, ease: "none" }, index);
      });
    },
    { scope: stageRef, dependencies: [reduceMotion], revertOnUpdate: true },
  );

  return (
    <section id="ai-solutions" className="section-shell relative py-24 sm:py-32 lg:py-40">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="section-orb -left-72 top-1/4 bg-blue-500/10" />
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="AI Solutions"
          title="AI Solutions Built for"
          accent="Real Businesses."
          description="From intelligent assistants to automated workflows and business analytics, we build practical AI solutions around the way your business works."
        />
        <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-600">
          Example solution interfaces shown with sample data. Every system is scoped and built around your own requirements.
        </p>

        {/* Stacking panels: each one pins under the navbar and the next slides over it. Scrolling back up reverses it. */}
        <div className="mt-12 lg:mt-16">
          {/* Only the bottom edge is clipped, so the rotating cards can swing past the sides and top. */}
          <div
            ref={stageRef}
            className={reduceMotion ? "grid gap-6" : "relative h-[540px] [clip-path:inset(-20%_-8%_0_-8%)] sm:h-[720px] md:h-[440px] lg:h-[520px]"}
          >
            {solutions.map((solution, index) => (
              <article
                key={solution.id}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                style={{ zIndex: index + 1 }}
                className={`ai-showcase-card group flex flex-col overflow-hidden rounded-[1.75rem] border border-white/[0.1] bg-[#0b0d11] shadow-[0_-18px_60px_rgba(0,0,0,.45)] md:flex-row md:items-stretch ${reduceMotion ? "relative md:h-[440px] lg:h-[520px]" : "absolute inset-0"}`}
              >
                <button
                  type="button"
                  onClick={(event) => open(solution.id, event.currentTarget)}
                  aria-haspopup="dialog"
                  aria-label={`View ${solution.title} details`}
                  className="block w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400 md:order-2 md:w-[62%]"
                >
                  <span className={`${imageFrame} block md:aspect-auto md:h-full`}>
                    <Image
                      src={solution.image}
                      alt={`IT HUNKS ${solution.title}`}
                      width={solution.width}
                      height={solution.height}
                      sizes="(max-width: 768px) 100vw, 62vw"
                      className="absolute inset-0 size-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </span>
                </button>
                <div className="flex flex-1 flex-col justify-center p-6 sm:p-8 md:order-1 md:p-6 lg:p-10 xl:p-12">
                  <h3 className="font-heading text-3xl font-medium tracking-[-0.04em] text-white md:text-2xl lg:text-4xl">{solution.title}</h3>
                  <p className="mt-4 max-w-md text-sm leading-6 text-zinc-400 sm:text-base sm:leading-7 md:text-sm md:leading-6 lg:text-base lg:leading-7">{solution.summary}</p>
                  <button
                    type="button"
                    onClick={(event) => open(solution.id, event.currentTarget)}
                    aria-haspopup="dialog"
                    className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-blue-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0d11]"
                  >
                    Explore Solution
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
        <p className="mt-3 text-right text-[10px] text-zinc-600">Scroll interaction inspired by Skiper UI</p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          className="mt-12 flex flex-col items-start justify-between gap-5 rounded-2xl border border-blue-400/15 bg-gradient-to-r from-blue-500/[0.08] to-transparent p-6 sm:flex-row sm:items-center sm:p-7"
        >
          <div>
            <p className="text-sm font-semibold text-white">Have a different AI use case in mind?</p>
            <p className="mt-1 text-sm text-zinc-500">Tell us the problem. We will shape a custom AI system around your business.</p>
          </div>
          <a href="#contact" className="shrink-0 rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">
            Talk to Our Team
          </a>
        </motion.div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            key="ai-dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[90] flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={close}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="ai-dialog-title"
              data-lenis-prevent
              initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
              className="relative max-h-[94dvh] w-full max-w-5xl overflow-y-auto overscroll-contain rounded-t-2xl border border-white/10 bg-[#0b0d11] shadow-[0_30px_100px_rgba(0,0,0,.6)] sm:rounded-2xl"
            >
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close solution details"
                className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur-md transition-colors hover:border-blue-400/40 hover:bg-blue-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <X className="size-5" />
              </button>
              <div className={imageFrame}>
                <Image
                  src={active.image}
                  alt={`IT HUNKS ${active.title}`}
                  width={active.width}
                  height={active.height}
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="absolute inset-0 size-full object-contain"
                />
              </div>
              <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
                <div>
                  <h3 id="ai-dialog-title" className="font-heading text-3xl font-medium tracking-[-0.04em] text-white">{active.title}</h3>
                  <p className="mt-4 text-base leading-7 text-zinc-400">{active.tagline}</p>
                  <p className="mt-4 text-xs leading-5 text-zinc-600">Example interface with sample data. Final features are scoped around your requirements.</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Key capabilities</p>
                  <ul className="mt-4 grid gap-3">
                    {active.capabilities.map((capability) => (
                      <li key={capability} className="flex items-start gap-2.5 text-sm text-zinc-300">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-blue-400" />
                        {capability}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href="#contact"
                      onClick={close}
                      className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                    >
                      Discuss Your AI Requirement <ArrowRight className="size-4" />
                    </a>
                    <button
                      type="button"
                      onClick={close}
                      className="rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-zinc-200 transition-colors hover:border-blue-400/40 hover:bg-blue-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                      Back to solutions
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
