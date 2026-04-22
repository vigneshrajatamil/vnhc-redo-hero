import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import aboutImg from "@/assets/about-section.jpg";
import { Leaf, Award, Globe, Users, BookOpen, FlaskConical } from "lucide-react";

const values = [
  { icon: Leaf, title: "100% Natural", desc: "All products are crafted from pure, natural ingredients sourced responsibly." },
  { icon: Award, title: "Quality Assured", desc: "Stringent quality parameters at every stage from sourcing to packaging." },
  { icon: Globe, title: "Global Reach", desc: "Headquartered in Chennai with exports handled through our Dubai office." },
  { icon: Users, title: "Skill Training", desc: "Empowering students with hands-on training in health and natural culinary arts." },
  { icon: BookOpen, title: "Research Driven", desc: "Continuous R&D in herbal product development backed by scientific methods." },
  { icon: FlaskConical, title: "Lab Facilities", desc: "World-class labs and classrooms at our dedicated centre in Ooty, Nilgiri." },
];

const AboutUs = () => (
  <div className="min-h-screen">
    <Navbar />

    {/* Hero Banner */}
    <section className="relative pt-20 md:pt-24">
      <div className="relative h-[340px] md:h-[420px] overflow-hidden">
        <img src={aboutImg} alt="About Dr. Vini" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">About Us</h1>
            <p className="mt-4 text-primary-foreground/80 text-lg max-w-xl mx-auto">
              Bringing the harmony of science and nature to everyday wellness
            </p>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Story Section */}
    <section className="py-20 bg-background">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-primary font-body text-sm uppercase tracking-[0.2em] font-semibold">Our Story</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 leading-snug">
            A Natural Way of Living
          </h2>
          <div className="mt-8 space-y-5 text-muted-foreground leading-relaxed text-lg">
            <p>
              Our Brand 'LE LEAF' is committed to operating DR.VINI HERBOTIC NOURISHMENT CENTRE PRIVATE LIMITED, where we produce natural products based on herbs and other essential edible consumables with regulated guidelines. We produce the broadest selection of natural products, organic textile products, essential oils, and Nilgiri botanical teas. Through its 10 GMP-certified production facilities, our products are shipped all over the world. Le Leaf Research Foundation (LRF) is our firm, which carries out all the R&D work. We grow and get our herbs from the Nilgiri Mountains, where they are naturally cultivated. It builds ground-breaking, quality-driven manufacturing procedures and uses renowned research institutions to confirm its natural healing properties.
            </p>
            <p>
              Since its inception, we have also made significant progress in maintaining quality. Although the original, tried-and-true formulae are still used, the goods have gradually been enhanced to increase one's healthy life. Our Research Foundation works hard to collect and enrich the potency and purity of nature's gifts. Our herbs are naturally found in the Nilgiri Mountains, where we also grow them. It creates innovative, high-quality manufacturing processes and works with famous research institutions to verify its naturopathic therapeutic quality. Our products are very much useful in health and stamina restoration, and they are widely used for their vibrant healing abilities.
            </p>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Values Grid */}
    <section className="py-20 bg-earth-warm">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-primary font-body text-sm uppercase tracking-[0.2em] font-semibold">Why Choose Us</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3">Our Values</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-shadow"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">{item.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="py-20 bg-background">
      <div className="container max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-primary/5 rounded-2xl p-10 border border-primary/10"
          >
            <h3 className="font-display text-2xl font-bold text-foreground">Our Mission</h3>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              To develop and deliver premium herbal and natural wellness products that enhance everyday health, while empowering communities through skill training and sustainable sourcing practices.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-accent/5 rounded-2xl p-10 border border-accent/10"
          >
            <h3 className="font-display text-2xl font-bold text-foreground">Our Vision</h3>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              To be a globally recognized leader in herbal nourishment, inspiring a movement towards chemical-free living and setting the benchmark for quality in natural product innovation.
            </p>
          </motion.div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default AboutUs;
