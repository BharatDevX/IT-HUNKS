import Navbar from "@/app/components/layout/Navbar";
import Hero from "@/app/components/hero/Hero";
import CursorGlow from "@/app/components/effects/CursorGlow";
import SmoothScroll from "@/app/components/effects/SmoothScroll";
import ScrollProgress from "@/app/components/effects/ScrollProgress";
import About from "@/app/components/sections/About";
import Services from "@/app/components/sections/Services";
import WhyChooseUs from "@/app/components/sections/WhyChooseUs";
import Process from "@/app/components/sections/Process";
import Portfolio from "@/app/components/sections/Portfolio";
import Technologies from "@/app/components/sections/Technologies";
import Pricing from "@/app/components/sections/Pricing";
import FAQ from "@/app/components/sections/FAQ";
import FinalCTA from "@/app/components/sections/FinalCTA";
import Footer from "@/app/components/layout/Footer";

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <SmoothScroll />
      <ScrollProgress />
      <Navbar />
      <main id="main-content" className="overflow-hidden bg-[#050505] text-white">
        <Hero />
        <About />
        <Services />
        <WhyChooseUs />
        <Process />
        <Portfolio />
        <Technologies />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <CursorGlow />
    </>
  );
}
