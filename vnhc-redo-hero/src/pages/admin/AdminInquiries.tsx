import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Trash2, Mail, MailOpen, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AdminInquiries = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const { toast } = useToast();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await fetchApi("/api/contact/messages/", { method: "GET" });
      setMessages(data?.messages || []);
    } catch (err: any) {
      toast({ title: "Failed to fetch inquiries", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const markRead = async (msg: ContactMessage) => {
    if (msg.is_read) return;
    try {
      await fetchApi(`/api/contact/${msg.id}/read/`, { method: "PATCH" });
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, is_read: true } : m));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetchApi(`/api/contact/${id}/delete/`, { method: "DELETE" });
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
      toast({ title: "Deleted" });
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    }
  };

  const openMessage = (msg: ContactMessage) => {
    setSelected(msg);
    markRead(msg);
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl font-bold text-foreground">Inquiries</h2>
          {unreadCount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">{unreadCount} new</span>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No inquiries yet.</div>
          ) : (
            <div className="divide-y divide-border max-h-[70vh] overflow-y-auto">
              {messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => openMessage(msg)}
                  className={`w-full text-left p-4 hover:bg-muted/30 transition-colors ${
                    selected?.id === msg.id ? "bg-primary/5" : ""
                  } ${!msg.is_read ? "bg-primary/5" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {msg.is_read ? <MailOpen className="w-4 h-4 text-muted-foreground shrink-0" /> : <Mail className="w-4 h-4 text-primary shrink-0" />}
                    <span className={`text-sm font-medium truncate ${!msg.is_read ? "text-foreground" : "text-muted-foreground"}`}>{msg.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{msg.subject || msg.message}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">{new Date(msg.created_at).toLocaleDateString()}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key={selected.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">{selected.name}</h3>
                    <p className="text-sm text-muted-foreground">{selected.email}{selected.phone && ` · ${selected.phone}`}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">{new Date(selected.created_at).toLocaleString()}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(selected.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {selected.subject && <p className="text-sm font-semibold text-foreground mb-2">{selected.subject}</p>}
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </motion.div>
            ) : (
              <div className="bg-card rounded-xl border border-border p-12 text-center text-muted-foreground">
                <Eye className="w-8 h-8 mx-auto mb-3 opacity-40" />
                Select a message to view
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminInquiries;
