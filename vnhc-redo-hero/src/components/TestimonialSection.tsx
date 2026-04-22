import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const TestimonialSection = () => (
  <section className="py-24 bg-background">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center"
      >
        <Quote className="w-10 h-10 text-primary mx-auto mb-6" />
        <blockquote className="font-display text-2xl md:text-3xl italic text-foreground leading-relaxed">
          "I love your tea. It is the best tasting tea I have ever had. I bought the samplers — and now I am ordering by the box."
        </blockquote>
        <p className="mt-6 font-body text-sm uppercase tracking-[0.2em] text-primary font-semibold">— Judy</p>
      </motion.div>
    </div>
  </section>
);

export default TestimonialSection;
