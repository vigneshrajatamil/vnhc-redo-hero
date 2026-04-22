import logo from "@/assets/logo.png";
import { Instagram, Facebook, Linkedin, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () =>
<footer id="contact" className="bg-primary text-primary-foreground py-16">
    <div className="container">
      <div className="grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex flex-col gap-3 mb-4">
            <img src="/uploads/e81b8a2e-8481-49b0-921a-ec8b6b3c082f.jpg" alt="Dr. Vini" className="h-28 w-auto object-contain object-left" />
            <span className="font-display text-xl font-bold">DR.VINI</span>
          </div>
          <p className="text-primary-foreground/60 text-base leading-relaxed">
            Dr. Vini Herbotic Nourishment Centre — bringing the harmony of science and nature to everyday wellness.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-base text-primary-foreground/60">
            {[
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about" },
          { label: "Products", href: "/products" },
          { label: "Training & Department", href: "/training/programs" },
          { label: "Gallery", href: "/gallery" },
          { label: "Contact", href: "/contact" }].
          map((l) =>
          <li key={l.label}>
                <Link to={l.href} className="hover:text-primary-foreground transition-colors">{l.label}</Link>
              </li>
          )}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg font-semibold mb-4">Connect</h4>
          <div className="flex gap-3">
            {[Instagram, Facebook, Linkedin, Youtube].map((Icon, i) =>
          <a
            key={i}
            href="#"
            className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
            
                <Icon className="w-4 h-4" />
              </a>
          )}
          </div>
          <p className="mt-6 text-primary-foreground/60 leading-relaxed text-lg">
            NO.132/2A, BHARATHIYAR STREET,<br />
            GANDHI NAGAR, AVADI,<br />
            THIRUVALLUR,<br />
            TAMIL NADU, 600054
          </p>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/40">
        © {new Date().getFullYear()} Dr. Vini Herbotic Nourishment Centre. All rights reserved.
      </div>
    </div>
  </footer>;


export default Footer;