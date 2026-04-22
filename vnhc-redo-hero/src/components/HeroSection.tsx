import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => (
  <section id="home" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0">
      <img src={heroBg} alt="Natural herbs" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/80" />
    </div>

    <div className="relative z-10 container text-center px-4 py-32">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-herb-medium font-body text-sm uppercase tracking-[0.3em] mb-6"
      >
        Dr. Vini Herbotic Nourishment Centre
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="font-display text-4xl sm:text-5xl md:text-7xl font-bold italic text-gradient-hero leading-tight max-w-4xl mx-auto"
      >
        Embrace the Harmony of Science &amp; Nature
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-6 text-herb-medium/80 font-body text-lg max-w-xl mx-auto"
      >
        100% natural herbal products — clinically proven, tested for purity
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-10 flex flex-wrap justify-center gap-4"
      >
        <a href="#products" className="px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
          Explore Products
        </a>
        <a href="#about" className="px-8 py-3.5 rounded-lg border border-herb-medium/30 text-herb-medium font-semibold hover:bg-herb-medium/10 transition-colors">
          Learn More
        </a>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
