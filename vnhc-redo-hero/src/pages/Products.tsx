import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, IndianRupee } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminProductUpload from "@/components/AdminProductUpload";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { fetchApi } from "@/lib/api";
import productFruits from "@/assets/product-fruits.jpg";
import productSpices from "@/assets/product-spices.jpg";
import productTea from "@/assets/product-tea.jpg";
import productOils from "@/assets/product-oils.jpg";
import productChocolates from "@/assets/product-chocolates.jpg";

const categories = ["All", "Fruits", "Spices", "Tea", "Oils", "Chocolates"] as const;
type Category = (typeof categories)[number];

const fallbackImages: Record<string, string> = {
  Fruits: productFruits,
  Spices: productSpices,
  Tea: productTea,
  Oils: productOils,
  Chocolates: productChocolates,
};

interface Product {
  id: string;
  title: string;
  description: string | null;
  category: string;
  tag: string | null;
  price: number | null;
  weight: string | null;
  sku: string | null;
  stock_status: string;
  image_url: string | null;
}

const Products = () => {
  const [active, setActive] = useState<Category>("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await fetchApi("/api/products/", { method: "GET" });
      setProducts(data?.products || []);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = active === "All" ? products : products.filter((p) => p.category === active);

  const stockLabel = (status: string) => {
    if (status === "low_stock") return { text: "Low Stock", cls: "bg-accent/90 text-accent-foreground" };
    if (status === "out_of_stock") return { text: "Out of Stock", cls: "bg-destructive/90 text-destructive-foreground" };
    return null;
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-primary/10 via-background to-secondary/30 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-accent/20 blur-3xl" />
        </div>
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 text-primary font-body text-sm uppercase tracking-[0.2em] font-semibold mb-4">
              <Leaf className="w-4 h-4" />
              Nature's Finest
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Our Products
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Discover our range of natural, organic, and handcrafted products sourced from the hills and crafted with care.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs + Products Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          {/* Header row with filter + admin button */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    active === cat
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <AdminProductUpload onProductAdded={fetchProducts} />
          </div>

          {/* Loading state */}
          {loading && (
            <div className="text-center py-20 text-muted-foreground">Loading products...</div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No products found in this category.
            </div>
          )}

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((p, i) => {
              const stock = stockLabel(p.stock_status);
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="group rounded-2xl overflow-hidden bg-card shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={p.image_url || fallbackImages[p.category] || productFruits}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {p.tag && (
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-semibold">
                        {p.tag}
                      </span>
                    )}
                    {stock && (
                      <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${stock.cls}`}>
                        {stock.text}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold text-card-foreground mb-2">{p.title}</h3>
                    {p.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-2">{p.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      {p.price != null && (
                        <span className="flex items-center gap-0.5 text-foreground font-bold text-lg">
                          <IndianRupee className="w-4 h-4" />
                          {p.price.toFixed(2)}
                          {p.weight && <span className="text-xs text-muted-foreground font-normal ml-1">/ {p.weight}</span>}
                        </span>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="flex items-center text-primary font-semibold text-sm gap-1 group-hover:gap-2 transition-all ml-auto outline-none">
                            Learn More <ArrowRight className="w-4 h-4" />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>{p.title}</DialogTitle>
                          </DialogHeader>
                          <div className="mt-2">
                            <img src={p.image_url || fallbackImages[p.category] || productFruits} alt={p.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                            <p className="text-foreground text-base leading-relaxed whitespace-pre-wrap">{p.description || "No description available for this product."}</p>
                            {p.price != null && (
                              <div className="mt-4 inline-flex items-center gap-1 font-bold text-lg px-4 py-2 bg-secondary rounded-lg text-primary">
                                <IndianRupee className="w-4 h-4" />
                                {p.price.toFixed(2)}
                                {p.weight && <span className="text-sm font-normal text-muted-foreground ml-1">/ {p.weight}</span>}
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;
