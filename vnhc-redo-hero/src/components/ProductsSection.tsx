import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import productFruits from "@/assets/product-fruits.jpg";
import productSpices from "@/assets/product-spices.jpg";
import productTea from "@/assets/product-tea.jpg";
import productOils from "@/assets/product-oils.jpg";
import productChocolates from "@/assets/product-chocolates.jpg";

const products = [
  { img: productFruits, title: "Natural Fruit Products", tag: "Organic" },
  { img: productSpices, title: "Spices & Herbs", tag: "Premium" },
  { img: productTea, title: "Value Added Green Tea", tag: "Wellness" },
  { img: productOils, title: "Essential & Aromatic Oils", tag: "Therapeutic" },
  { img: productChocolates, title: "Ooty Exotic Chocolates", tag: "Artisan" },
];

const ProductsSection = () => (
  <section id="products" className="py-24 bg-herb-light">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-primary font-body text-sm uppercase tracking-[0.2em] font-semibold">Shop</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3">Our Products</h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group rounded-2xl overflow-hidden bg-card shadow-card hover:shadow-elevated transition-shadow duration-300"
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={p.img}
                alt={p.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-semibold">
                {p.tag}
              </span>
            </div>
            <div className="p-5 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-card-foreground">{p.title}</h3>
              <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProductsSection;
