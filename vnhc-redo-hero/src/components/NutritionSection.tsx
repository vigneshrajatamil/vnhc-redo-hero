import { motion } from "framer-motion";
import { Hand, Leaf, Flower2, Utensils, Sprout, GraduationCap } from "lucide-react";

const items = [
  { icon: Hand, title: "Acupressure" },
  { icon: Leaf, title: "Advanced Ayurveda" },
  { icon: Flower2, title: "Aroma Therapy" },
  { icon: Utensils, title: "Clinical Nutrition Consultant" },
  { icon: Sprout, title: "Medical Herbs & Culinary Therapy" },
  { icon: GraduationCap, title: "Our Training Programs" },
];

const NutritionSection = () => (
  <section id="training" className="py-24 bg-background">
    <div className="container text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="text-primary font-body text-sm uppercase tracking-[0.2em] font-semibold">Explore</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3">
          Training and Department
        </h2>
      </motion.div>

      <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group p-6 rounded-xl bg-herb-light hover:bg-primary transition-colors duration-300 shadow-card cursor-pointer"
          >
            <item.icon className="w-8 h-8 mx-auto text-primary group-hover:text-primary-foreground transition-colors" />
            <h3 className="mt-4 font-display text-base font-semibold text-foreground group-hover:text-primary-foreground transition-colors">
              {item.title}
            </h3>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default NutritionSection;
