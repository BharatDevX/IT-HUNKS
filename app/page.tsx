import Navbar from "@/app/components/layout/Navbar";
import Hero from "@/app/components/hero/Hero";
import CursorGlow from "@/app/components/effects/CursorGlow";
import SmoothScroll from "@/app/components/effects/SmoothScroll";
import ScrollProgress from "@/app/components/effects/ScrollProgress";
import TrackzyStory from "@/app/components/trackzy/TrackzyStory";
import TrackzyProduct from "@/app/components/trackzy/TrackzyProduct";
import About from "@/app/components/sections/About";
import Services from "@/app/components/sections/Services";
import IdeasToProducts from "@/app/components/sections/IdeasToProducts";
import AiIntelligence from "@/app/components/sections/AiIntelligence";
import WebMobile from "@/app/components/sections/WebMobile";
import SystemsScene from "@/app/components/sections/SystemsScene";
import AiShowcase from "@/app/components/sections/AiShowcase";
import WhyChooseUs from "@/app/components/sections/WhyChooseUs";
import Process from "@/app/components/sections/Process";
import Portfolio from "@/app/components/sections/Portfolio";
import Technologies from "@/app/components/sections/Technologies";
import Pricing from "@/app/components/sections/Pricing";
import FAQ from "@/app/components/sections/FAQ";
import FinalCTA from "@/app/components/sections/FinalCTA";
import Footer from "@/app/components/layout/Footer";
import FloatingContact from "@/app/components/FloatingContact";
import Feedback from "@/app/components/Feedback";
import FeedbackWall from "@/app/components/sections/FeedbackWall";

export default function Home() {
  return (
    <>
      <a href="#main-content" className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0">Skip to content</a>
      <SmoothScroll />
      <ScrollProgress />
      <Navbar />
      <main id="main-content" className="overflow-x-clip bg-[#050505] text-white">
        <Hero />
        <TrackzyStory />
        <TrackzyProduct />
        <About />
        <IdeasToProducts />
        <Services />
        <AiIntelligence />
        <AiShowcase />
        <WebMobile />
        <SystemsScene />
        <WhyChooseUs />
        <Process />
        <Portfolio />
        <Technologies />
        <Pricing />
        <FAQ />
        <FeedbackWall />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingContact />
      <Feedback />
      <CursorGlow />
    </>
  );
}
