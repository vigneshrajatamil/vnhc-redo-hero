import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { GraduationCap, Hand, Leaf, Flower2, Utensils, Sprout } from "lucide-react";

const programs = [
  { icon: Hand, title: "Acupressure", href: "/training/acupressure", desc: "Ancient healing art using finger pressure on key points." },
  { icon: Leaf, title: "Advanced Ayurveda", href: "/training/advanced-ayurveda", desc: "Comprehensive training in traditional Indian medicine." },
  { icon: Flower2, title: "Aroma Therapy", href: "/training/aroma-therapy", desc: "Harness the healing power of essential oils." },
  { icon: Utensils, title: "Clinical Nutrition Consultant", href: "/training/clinical-nutrition", desc: "Evidence-based nutrition therapy certification." },
  { icon: Sprout, title: "Medical Herbs & Culinary Therapy", href: "/training/medical-herbs", desc: "Medicinal herbs and healing food integration." },
];

const TrainingPrograms = () => (
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
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <span className="text-primary font-body text-sm uppercase tracking-[0.2em] font-semibold">
            Explore
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-6">
            Our Training Programs
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Dr. Vini Herbotic Nourishment Centre offers a range of specialized training programs designed to empower you with knowledge in natural healing, holistic wellness, and traditional medicine practices.
          </p>
        </motion.div>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {programs.map((prog, i) => (
            <motion.a
              key={prog.title}
              href={prog.href}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="group p-6 rounded-xl bg-card shadow-card hover:shadow-elevated transition-shadow"
            >
              <prog.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                {prog.title}
              </h3>
              <p className="text-muted-foreground text-sm">{prog.desc}</p>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-16 text-center"
        >
          <a
            href="/contact"
            className="inline-block px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </section>
    <Footer />
  </div>
);

export default TrainingPrograms;
