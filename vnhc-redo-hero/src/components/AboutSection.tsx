import { motion } from "framer-motion";
import aboutImg from "@/assets/about-section.jpg";

const AboutSection = () => (
  <section id="about" className="py-24 bg-earth-warm">
    <div className="container">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-elevated">
            <img src={aboutImg} alt="Natural herbal products" className="w-full h-[420px] object-cover" />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-foreground/40 to-transparent" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-primary font-body text-sm uppercase tracking-[0.2em] font-semibold">About Us</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 leading-snug">
            A Natural Way of Living
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Leleaf products are developed by Dr. Vini Herbotic Nourishment Centre, headquartered in Chennai with a learning centre in Nilgiri. Our core focus is herbal product development and training.
            </p>
            <p>
              We impart skill training to students on health and natural culinary products. Our dedicated centre in Ooty features world-class facilities including classrooms, labs, and our own herbal farm and estates.
            </p>
            <p>
              With an overseas office in Dubai, UAE, we handle product exports globally while sourcing raw materials from local farmers under stringent quality parameters.
            </p>
          </div>
          <a
            href="#"
            className="inline-block mt-8 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            Read More
          </a>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
