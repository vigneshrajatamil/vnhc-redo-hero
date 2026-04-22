import { motion } from "framer-motion";
import { Leaf, Shield, FlaskConical } from "lucide-react";

const features = [
  { icon: Leaf, title: "100% Natural Herbs", desc: "Pure botanical ingredients" },
  { icon: Shield, title: "Tested for Purity", desc: "No heavy metals or steroids" },
  { icon: FlaskConical, title: "Clinically Proven", desc: "Scientifically validated" },
];

const FeaturesBar = () => (
  <section className="relative z-10 -mt-16 pb-8">
    <div className="container">
      <div className="grid md:grid-cols-3 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="bg-card rounded-xl p-6 shadow-elevated flex items-center gap-4"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-herb-light flex items-center justify-center">
              <f.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-card-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesBar;
