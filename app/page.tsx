import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PopularJobsSection } from "@/components/landing/PopularJobsSection";
import { AIMatchSection } from "@/components/landing/AIMatchSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { Footer } from "@/components/layout/Footer";
import { InternshipsSection } from "@/components/landing/InternshipsSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <PopularJobsSection />
      <InternshipsSection />
      <AIMatchSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
