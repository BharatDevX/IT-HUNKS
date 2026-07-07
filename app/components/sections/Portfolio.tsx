"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

type PhonePreviewData = {
  type: "phone";
  images: string[];
};

type BrowserPreviewData = {
  type: "browser";
  video: string;
};

type Project = {
  number: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  href: string;
  preview: PhonePreviewData | BrowserPreviewData;
};

const projects: Project[] = [
  {
    number: "01",
    title: "Shramik Mobile App",
    category: "Mobile Product · Workforce",
    description:
      "A focused employment experience connecting skilled workers with relevant opportunities through a fast, intuitive mobile flow.",
    tags: ["Mobile UX", "React", "API"],
    href: "https://play.google.com/store/apps/details?id=com.shramiktect.shramikapp",
    preview: {
      type: "phone",
      images: [
        "/portfolio/shramik-1.jpg",
        "/portfolio/shramik-2.jpg",
        "/portfolio/shramik-3.jpg",
        "/portfolio/shramik-4.jpg",
        "/portfolio/shramik-5.jpg",
        "/portfolio/shramik-6.jpg",
        "/portfolio/shramik-7.jpg",
      ],
    },
  },
  {
    number: "02",
    title: "Namrata Creation Website",
    category: "E-commerce · Fashion",
    description:
      "An elegant, editorial storefront designed to turn a distinctive fashion catalogue into a fluid online shopping experience.",
    tags: ["Commerce", "Responsive", "SEO"],
    href: "https://www.namratacreations.in/",
    preview: {
      type: "browser",
      video: "/portfolio/namrata.mp4",
    },
  },
  {
    number: "03",
    title: "Shramik About Website",
    category: "Brand Platform · Corporate",
    description:
      "A confident company story that communicates mission, impact, and trust through clear content and expressive interaction.",
    tags: ["Brand", "Web Design", "Motion"],
    href: "https://shramik-hnm7le866-bharats-projects-ce0030a6.vercel.app/",
    preview: {
      type: "browser",
      video: "/portfolio/shramik-about.mp4",
    },
  },
];

/* -------------------------------------------------------------------------- */
/*  PhonePreview — iPhone 16 Pro style mockup with looping screenshot fade    */
/* -------------------------------------------------------------------------- */

function PhonePreview({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <motion.div
      animate={reduceMotion ? undefined : { y: [-6, 6, -6] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="relative mx-auto w-[46%] min-w-[132px] max-w-[210px]"
    >
      {/* Ambient glow behind the device */}
      <div className="absolute inset-0 scale-90 rounded-[3rem] bg-blue-500/25 blur-3xl" />

      {/* Device shell */}
      <div className="relative aspect-[9/19.5] rounded-[2.4rem] border border-white/15 bg-gradient-to-b from-zinc-800 to-zinc-950 p-[3px] shadow-[0_35px_70px_-15px_rgba(0,0,0,0.75)]">
        <div className="relative h-full w-full overflow-hidden rounded-[2.15rem] border border-black/40 bg-black">
          {/* Screen content / screenshot carousel */}
          <div className="relative h-full w-full overflow-hidden">
            <AnimatePresence mode="sync">
              <motion.div
                key={images[index]}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={images[index]}
                  alt="Shramik app screenshot"
                  fill
                  sizes="(max-width: 768px) 40vw, 210px"
                  className="object-cover"
                  priority={index === 0}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dynamic Island */}
          <div className="absolute left-1/2 top-[1.6%] h-[3.6%] w-[34%] -translate-x-1/2 rounded-full bg-black" />

          {/* Glass reflection */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0)_28%,rgba(255,255,255,0)_72%,rgba(255,255,255,0.08)_100%)]" />
        </div>
      </div>

      {/* Side button details */}
      <div className="absolute -left-[2px] top-[20%] h-8 w-[3px] rounded-full bg-zinc-700" />
      <div className="absolute -left-[2px] top-[32%] h-12 w-[3px] rounded-full bg-zinc-700" />
      <div className="absolute -right-[2px] top-[24%] h-14 w-[3px] rounded-full bg-zinc-700" />
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  BrowserPreview — browser / MacBook style mockup with autoplaying video    */
/* -------------------------------------------------------------------------- */

function BrowserPreview({ video }: { video: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => undefined);
        } else {
          el.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#08090b] shadow-2xl transition-shadow duration-500 group-hover:shadow-[0_0_60px_-10px_rgba(59,130,246,0.45)]">
      <div className="flex h-8 items-center gap-1.5 border-b border-white/[0.07] bg-white/[0.035] px-3">
        <i className="size-2 rounded-full bg-red-400/70" />
        <i className="size-2 rounded-full bg-amber-300/70" />
        <i className="size-2 rounded-full bg-emerald-400/70" />
        <span className="mx-auto h-3 w-24 rounded-full bg-white/[0.055]" />
      </div>
      <div className="aspect-[1.55/1] overflow-hidden">
        <video
          ref={videoRef}
          src={video}
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover brightness-[0.92] transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.04] group-hover:brightness-105"
        />
      </div>
      {/* Reflection */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_30%)]" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Portfolio                                                                 */
/* -------------------------------------------------------------------------- */

export default function Portfolio() {
  const reduceMotion = useReducedMotion();

  const openProject = (href: string) => {
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="portfolio" className="section-shell relative py-24 sm:py-32 lg:py-40">
      <div className="section-orb -right-72 top-32 bg-blue-500/10" />
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Selected Work"
          title="Digital products with"
          accent="purpose and presence."
          description="A selection of product, commerce, and brand experiences shaped around clear business goals."
        />
        <div className="mt-14 space-y-6 lg:mt-20">
          {projects.map((project) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              whileHover={reduceMotion ? undefined : { y: -4 }}
              className="glass-card group grid overflow-hidden lg:grid-cols-[.42fr_.58fr]"
            >
              <div className="flex flex-col p-7 sm:p-10 lg:p-12">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-[0.2em] text-blue-400">
                    {project.number}
                  </span>
                  <button
                    type="button"
                    aria-label={`Open ${project.title}`}
                    onClick={() => openProject(project.href)}
                    className="cursor-pointer"
                  >
                    <ArrowUpRight className="size-5 text-zinc-600 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:rotate-45 group-hover:text-blue-400" />
                  </button>
                </div>
                <p className="mt-12 text-xs uppercase tracking-[0.16em] text-zinc-500">
                  {project.category}
                </p>
                <h3 className="mt-3 font-heading text-3xl font-medium tracking-[-0.045em] text-white sm:text-4xl">
                  {project.title}
                </h3>
                <p className="mt-5 max-w-lg text-sm leading-7 text-zinc-500">
                  {project.description}
                </p>
                <div className="mt-auto flex flex-wrap gap-2 pt-9">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/[0.08] px-3 py-1.5 text-[10px] text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <motion.div
                role="link"
                tabIndex={0}
                aria-label={`Open ${project.title}`}
                onClick={() => openProject(project.href)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") openProject(project.href);
                }}
                whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="relative min-h-[300px] cursor-pointer overflow-hidden border-t border-white/[0.07] bg-[#090a0d] p-5 sm:p-8 lg:border-l lg:border-t-0"
              >
                <div className="absolute inset-1/4 bg-blue-500/15 blur-[80px] transition-opacity duration-500 group-hover:opacity-80" />
                <div className="relative flex h-full items-center justify-center">
                  {project.preview.type === "phone" ? (
                    <PhonePreview images={project.preview.images} />
                  ) : (
                    <BrowserPreview video={project.preview.video} />
                  )}
                </div>
              </motion.div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}