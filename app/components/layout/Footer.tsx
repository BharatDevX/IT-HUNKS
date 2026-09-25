import { ArrowUpRight, AtSign, Camera, Code2, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const quickLinks = [
  ["About", "#about"],
  ["Services", "#services"],
  ["Work", "#portfolio"],
  ["Process", "#process"],
  ["Pricing", "#pricing"],
  ["FAQs", "#faq"],
];

const services = [
  "Custom Software",
  "Web & Mobile App Development",
  "CRM & ERP",
  "AI Solutions / AI Chatbots",
  "Business Dashboards",
  "Digital Marketing",
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.07] bg-[#070708]">
      <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-16 sm:px-8 lg:px-12 lg:pt-20">
        <div className="grid gap-12 border-b border-white/[0.07] pb-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_.7fr_1fr_1fr] lg:gap-10">
          <div>
            <Link href="#home" className="inline-flex items-center gap-3" aria-label="IT HUNKS home">
              <span className="relative size-12 overflow-hidden rounded-xl border border-white/10">
                <Image src="/logo.png" alt="" fill sizes="48px" className="object-cover" />
              </span>
              <span className="font-heading text-xl font-semibold tracking-[0.12em]">IT <span className="text-blue-400">HUNKS</span></span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-zinc-500">
              Custom software, web and mobile apps, CRM/ERP, AI solutions, business dashboards and digital marketing built around real business needs.
            </p>
            <div className="mt-6 space-y-3">
              <a href="mailto:ithunks.in@gmail.com" className="group flex items-center gap-2 text-sm font-medium text-zinc-300 transition-colors hover:text-blue-300"><Mail className="size-4 text-blue-400" /> ithunks.in@gmail.com <ArrowUpRight className="size-3.5" /></a>
              <a href="tel:+919528681406" className="group flex items-center gap-2 text-sm font-medium text-zinc-300 transition-colors hover:text-blue-300"><span className="text-blue-400">☎</span> +91 9528681406</a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">Quick Links</h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map(([name, href]) => <li key={name}><Link href={href} className="text-sm text-zinc-500 transition-colors hover:text-blue-300">{name}</Link></li>)}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">Services</h3>
            <ul className="mt-5 space-y-3">
              {services.map((service) => <li key={service} className="text-sm text-zinc-500">{service}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">Connect</h3>
            <p className="mt-5 text-sm leading-6 text-zinc-500">Available for business projects. Tell us the problem, and we will help map the right technology solution.</p>
            <div className="mt-6 flex gap-2">
              {[
                { label: "LinkedIn", href: "https://www.linkedin.com", icon: AtSign },
                { label: "Instagram", href: "https://www.instagram.com", icon: Camera },
                { label: "GitHub", href: "https://github.com", icon: Code2 },
              ].map(({ label, href, icon: Icon }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid size-10 place-items-center rounded-full border border-white/[0.08] bg-white/[0.025] text-zinc-500 transition-all hover:-translate-y-1 hover:border-blue-400/30 hover:text-blue-300">
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-7 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} IT HUNKS. All rights reserved.</p>
          <p>Solutions that work. Experiences that last.</p>
        </div>
      </div>
    </footer>
  );
}
