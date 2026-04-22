import { motion } from "framer-motion";

const SnacksSection = () =>
<section className="py-24 bg-earth-warm">
    <div className="container">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}>
        
          <span className="text-primary font-body text-sm uppercase tracking-[0.2em] font-semibold">Health & Education</span>
          <h2 className="font-display text-3xl font-bold text-foreground mt-3 md:text-3xl">
            SNACKS - A Powerful School Health Management System 
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
            Naturopathy is a holistic approach to health and wellness. Teachers are the greatest role models for children — if naturopathy is taught in the classroom, children will develop a lifelong interest in self-care and natural well-being.
          </p>
          <a
          href="#"
          className="inline-block mt-8 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
          
            Read More
          </a>
        </motion.div>
      </div>
    </div>
  </section>;


export default SnacksSection;