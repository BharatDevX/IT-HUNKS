"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Services", href: "#services" },
  { name: "Work", href: "#portfolio" },
  { name: "Process", href: "#process" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled || menuOpen
          ? "border-blue-400/15 bg-[#050505]/78 shadow-[0_8px_40px_rgba(0,0,0,.28)] backdrop-blur-2xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12"
      >
        <Link
          href="#home"
          aria-label="IT HUNKS home"
          className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <span className="relative size-11 overflow-hidden rounded-xl border border-white/10 bg-black shadow-[0_0_24px_rgba(59,130,246,.16)]">
            <Image
              src="/logo.png"
              alt=""
              fill
              sizes="44px"
              priority
              className="object-cover"
            />
          </span>
          <span className="font-heading text-lg font-semibold tracking-[0.12em] text-white">
            IT <span className="text-blue-400">HUNKS</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 xl:gap-8 lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="nav-link relative py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <Link
          href="#contact"
          className="magnetic-target group relative hidden items-center gap-2 overflow-hidden rounded-full border border-blue-400/30 bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,.25)] transition-transform hover:-translate-y-0.5 lg:flex"
        >
          <span className="absolute inset-0 translate-y-full bg-blue-400 transition-transform duration-300 group-hover:translate-y-0" />
          <span className="relative">Start a project</span>
          <ArrowUpRight className="relative size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-colors hover:border-blue-400/40 hover:bg-blue-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 lg:hidden"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100dvh - 76px)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/[0.06] bg-[#050505]/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex h-full flex-col px-6 pb-8 pt-6">
              {navLinks.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.045 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between border-b border-white/[0.07] py-5 font-heading text-2xl font-medium text-zinc-200"
                  >
                    {item.name}
                    <ArrowUpRight className="size-5 text-blue-400" />
                  </Link>
                </motion.div>
              ))}
              <Link
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-auto flex items-center justify-center gap-2 rounded-full bg-blue-500 py-4 font-semibold shadow-[0_0_35px_rgba(59,130,246,.3)]"
              >
                Start a project <ArrowUpRight className="size-5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
