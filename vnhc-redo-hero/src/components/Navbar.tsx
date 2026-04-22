import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const trainingItems = [
  { label: "Acupressure", href: "/training/acupressure" },
  { label: "Advanced Ayurveda", href: "/training/advanced-ayurveda" },
  { label: "Aroma Therapy", href: "/training/aroma-therapy" },
  { label: "Clinical Nutrition Consultant", href: "/training/clinical-nutrition" },
  { label: "Medical Herbs & Culinary Therapy", href: "/training/medical-herbs" },
  { label: "Our Training Programs", href: "/training/programs" },
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Training and Department", href: "#training", dropdown: trainingItems },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-20 md:h-24">
        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
          <img alt="Dr. Vini" className="h-16 md:h-20 w-auto object-contain" src="/uploads/e81b8a2e-8481-49b0-921a-ec8b6b3c082f.jpg" />
        </Link>

        <div className="hidden md:flex items-center gap-5 lg:gap-7">
          {navLinks.map((link) =>
            link.dropdown ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-sm lg:text-base font-semibold whitespace-nowrap">
                  {link.label}
                  <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-border py-2 z-50"
                    >
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.label}
                          to={item.href}
                          className="block px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="text-muted-foreground hover:text-primary transition-colors text-sm lg:text-base font-semibold whitespace-nowrap"
              >
                {link.label}
              </Link>
            )
          )}
          <Link
            to="/contact"
            className="ml-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm lg:text-base font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Book Now
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-background border-b border-border"
          >
            <div className="container py-4 flex flex-col gap-3">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <div key={link.label}>
                    <button
                      onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                      className="flex items-center gap-1 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors w-full"
                    >
                      {link.label}
                      <ChevronDown size={14} className={`transition-transform ${mobileDropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {mobileDropdownOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="pl-4 flex flex-col gap-1 overflow-hidden"
                        >
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.label}
                              to={item.href}
                              onClick={() => setOpen(false)}
                              className="py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setOpen(false)}
                    className="py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
              <Link
                to="/contact"
                className="mt-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold text-center"
              >
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;