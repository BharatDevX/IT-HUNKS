"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, ExternalLink, Layers3 } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

type Project = {
  number: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  href: string;
  image?: string;
  bullets: string[];
};

const projects: Project[] = [
  {
    number: "01",
    title: "Shramik Mobile App",
    category: "Mobile Product · Workforce",
    description: "A job-finding mobile platform designed to connect workers with relevant opportunities through a simple, location-aware experience.",
    tags: ["React Native", "Mobile", "API", "Location"],
    href: "https://play.google.com/store/apps/details?id=com.shramiktect.shramikapp",
    image: "/portfolio/shramik-1.jpg",
    bullets: ["Worker and customer flows", "Job matching and acceptance", "Location-based operations", "Production mobile experience"],
  },
  {
    number: "02",
    title: "Namrata Creations",
    category: "E-commerce · Fashion",
    description: "A polished digital storefront built to present a fashion catalogue professionally and make browsing and buying feel effortless.",
    tags: ["E-commerce", "Responsive", "SEO", "UI/UX"],
    href: "https://www.namratacreations.in/",
    image: "/portfolio/namrata-poster.jpg",
    bullets: ["Product-focused storefront", "Responsive shopping experience", "Clear visual merchandising", "Business-ready web presence"],
  },
  {
    number: "03",
    title: "Shramik Brand Website",
    category: "Corporate Website · Brand Platform",
    description: "A company-facing web experience that communicates the product, mission and value proposition through structured content and modern interaction.",
    tags: ["Corporate", "Brand", "Web", "Motion"],
    href: "https://shramik-hnm7le866-bharats-projects-ce0030a6.vercel.app/",
    image: "/portfolio/shramik-about-poster.jpg",
    bullets: ["Brand storytelling", "Responsive presentation", "Conversion-focused sections", "Modern motion design"],
  },
  {
    number: "04",
    title: "VETRONIX ERP",
    category: "Enterprise · ERP · Admin Platform",
    description: "A business management platform bringing employee operations, attendance, field activities, tours, sales and reporting into a connected admin experience.",
    tags: ["ERP", "Admin Panel", "Sales", "Dashboards"],
    href: "https://vtronix-admin.vercel.app/",
    image: "/portfolio/vetronix-poster.jpg",
    bullets: ["Employee and attendance workflows", "Field visits and tour planning", "Sales and business reporting", "Admin-side operational visibility"],
  },
];

const capabilityRows = [
  ["Veterinary Pharma", "Business ERP", "Field force • Sales & orders • Distributor management • Expenses & visits • Inventory • Reports & dashboards"],
  ["Solar", "Business Management Platform", "Lead & sales • Quotation • Project tracking • Installation • Inventory • Payments • Dashboards"],
  ["Custom Technology", "Business Software & Integrations", "AI solutions • AI chatbots • Business dashboards • Web & mobile apps • CRM/ERP integration • Automation"],
];

export default function Portfolio() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="portfolio" className="section-shell relative py-24 sm:py-32 lg:py-40">
      <div className="section-orb -right-72 top-32 bg-blue-500/10" />
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Work & Solution Experience"
          title="Built for businesses,"
          accent="not just portfolios."
          description="Selected products and business systems from our work. We focus on solving operational problems, improving visibility and creating digital experiences that support growth."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:mt-20">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.65, delay: (index % 2) * 0.07 }}
              whileHover={reduceMotion ? undefined : { y: -6 }}
              className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0d11] shadow-[0_20px_70px_rgba(0,0,0,.16)]"
            >
              <div className="relative aspect-[1.75/1] overflow-hidden border-b border-white/[0.07] bg-[#08090c]">
                {project.image ? <Image src={project.image} alt={`${project.title} project preview`} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.045]" /> : null}
                <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-transparent to-transparent opacity-80" />
                <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-200 backdrop-blur-md">{project.category}</div>
                <a href={project.href} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`} className="absolute right-5 top-5 grid size-10 place-items-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur-md transition-all hover:border-blue-300/50 hover:bg-blue-500/30">
                  <ExternalLink className="size-4" />
                </a>
              </div>
              <div className="p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-blue-400">{project.number}</span>
                    <h3 className="mt-2 font-heading text-2xl font-medium tracking-[-0.035em] text-white">{project.title}</h3>
                  </div>
                  <ArrowUpRight className="mt-1 size-5 text-zinc-700 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-400" />
                </div>
                <p className="mt-4 text-sm leading-6 text-zinc-500">{project.description}</p>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {project.bullets.map((bullet) => <div key={bullet} className="flex items-start gap-2 text-xs text-zinc-300"><CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-blue-400" />{bullet}</div>)}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => <span key={tag} className="rounded-full border border-white/[0.08] px-3 py-1.5 text-[10px] text-zinc-500">{tag}</span>)}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-24 lg:mt-32">
          <div className="flex flex-col justify-between gap-5 border-b border-white/[0.08] pb-7 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-400">Solution capabilities</p>
              <h3 className="mt-3 max-w-2xl font-heading text-3xl font-medium tracking-[-0.04em] text-white sm:text-4xl">Industry-focused systems, custom technology and business impact.</h3>
            </div>
            <Layers3 className="size-9 text-zinc-700" />
          </div>
          <div className="mt-5 divide-y divide-white/[0.07] rounded-2xl border border-white/[0.07] bg-white/[0.02]">
            {capabilityRows.map(([industry, solution, features]) => (
              <div key={industry} className="grid gap-4 p-5 sm:grid-cols-[.24fr_.28fr_.48fr] sm:items-center sm:p-7">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-300">{industry}</span>
                <h4 className="font-heading text-lg font-medium text-white">{solution}</h4>
                <p className="text-sm leading-6 text-zinc-500">{features}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
