import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Sprout, CheckCircle } from "lucide-react";

const highlights = [
  "Identification and cultivation of medicinal herbs",
  "Herbal preparation and extraction methods",
  "Culinary therapy for health and healing",
  "Traditional and modern herbal medicine integration",
  "Safety, dosage, and quality control",
  "Practical workshops with field training",
];

const MedicalHerbs = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="pt-28 pb-20 bg-gradient-to-b from-herb-light to-background">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Sprout className="w-8 h-8 text-primary" />
          </div>
          <span className="text-primary font-body text-sm uppercase tracking-[0.2em] font-semibold">
            Training Program
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-6">
            Medical Herbs & Culinary Therapy
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Explore the world of medicinal herbs and culinary therapy. This program teaches you how to identify, prepare, and use herbs for therapeutic purposes while integrating healing foods into daily nutrition for holistic wellness.
          </p>
        </motion.div>

        <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {highlights.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-card shadow-card"
            >
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-foreground font-medium">{item}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <a
            href="/contact"
            className="inline-block px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            Enquire Now
          </a>
        </motion.div>
      </div>
    </section>
    <Footer />
  </div>
);

export default MedicalHerbs;
