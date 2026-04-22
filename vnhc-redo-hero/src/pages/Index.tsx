import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesBar from "@/components/FeaturesBar";
import AboutSection from "@/components/AboutSection";
import NutritionSection from "@/components/NutritionSection";
import ProductsSection from "@/components/ProductsSection";
import SnacksSection from "@/components/SnacksSection";
import TestimonialSection from "@/components/TestimonialSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <FeaturesBar />
    <AboutSection />
    <NutritionSection />
    <ProductsSection />
    <SnacksSection />
    <TestimonialSection />
    <Footer />
  </div>
);

export default Index;
