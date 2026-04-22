import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Clock, ExternalLink, Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { fetchApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const GOOGLE_MAPS_LINK =
  "https://www.google.com/maps/search/No.132%2F2A,+Bharathiyar+Street,+Gandhi+Nagar,+Avadi,+Thiruvallur,+Tamil+Nadu+600054";

const GOOGLE_MAPS_EMBED =
  "https://www.google.com/maps?q=No.132/2A,+Bharathiyar+Street,+Gandhi+Nagar,+Avadi,+Thiruvallur,+Tamil+Nadu+600054&output=embed";

const ContactPage = () => {
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      await fetchApi("/api/contact/", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          subject: form.subject || null,
          message: form.message,
        }),
      });
      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: any) {
      toast({ title: "Failed to send", description: err.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
  <div className="min-h-screen">
    <Navbar />

    {/* Hero */}
    <section className="pt-20 md:pt-24 bg-primary">
      <div className="container py-16 md:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">
            Contact Us
          </h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-xl mx-auto">
            We'd love to hear from you. Reach out to us anytime.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Contact Info + Map */}
    <section className="py-20 bg-background">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-2xl p-8 shadow-card">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">Our Address</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    NO.132/2A, BHARATHIYAR STREET,<br />
                    GANDHI NAGAR, AVADI,<br />
                    THIRUVALLUR,<br />
                    TAMIL NADU, 600054
                  </p>
                  <a
                    href={GOOGLE_MAPS_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-primary font-semibold hover:opacity-80 transition-opacity"
                  >
                    View on Google Maps <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-card">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">Phone</h3>
                  <p className="mt-2 text-muted-foreground">+91 XXXXX XXXXX</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-card">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">Email</h3>
                  <p className="mt-2 text-muted-foreground">info@drvini.com</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-card">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">Working Hours</h3>
                  <p className="mt-2 text-muted-foreground">
                    Mon – Sat: 9:00 AM – 6:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden shadow-elevated h-[500px] lg:h-full min-h-[400px]"
          >
            <iframe
              src={GOOGLE_MAPS_EMBED}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Dr. Vini Location"
            />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Contact Form */}
    <section className="py-16 bg-card">
      <div className="container max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-foreground">Send Us a Message</h2>
          <p className="mt-2 text-muted-foreground">Fill the form below and we'll get back to you.</p>
        </motion.div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="mt-1.5" required /></div>
            <div><Label>Email *</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="mt-1.5" required /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" className="mt-1.5" /></div>
            <div><Label>Subject</Label><Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject" className="mt-1.5" /></div>
          </div>
          <div><Label>Message *</Label><Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Your message..." className="mt-1.5" rows={5} required /></div>
          <Button type="submit" disabled={sending} className="w-full gap-2">
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {sending ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </section>

    <Footer />
  </div>
  );
};

export default ContactPage;
