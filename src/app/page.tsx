import HeaderSection from "@/components/homepage/headerSection";
import HeroSection from "@/components/homepage/heroSection";
import FeatureSection from "@/components/homepage/featureSection";
import CTASection from "@/components/homepage/ctaSection";
import Footer from "@/components/homepage/footer";

export default async function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-sky-50 via-white to-indigo-50 scroll-smooth">
      <HeaderSection />
      <HeroSection />
      <FeatureSection />
      <CTASection />
      <Footer />
    </main>
  );
}
