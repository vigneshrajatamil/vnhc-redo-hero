import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Pencil, Upload, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["Fruits", "Spices", "Tea", "Oils", "Chocolates"];
const stockOptions = [
  { value: "in_stock", label: "In Stock" },
  { value: "low_stock", label: "Low Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
];

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
  created_at: string;
}

const emptyForm = {
  title: "", description: "", category: "", tag: "", price: "", weight: "", sku: "", stock_status: "in_stock",
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await fetchApi("/api/products/", { method: "GET" });
      setProducts(data?.products || []);
    } catch (err: any) {
      toast({ title: "Failed to fetch products", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditId(p.id);
    setForm({
      title: p.title,
      description: p.description || "",
      category: p.category,
      tag: p.tag || "",
      price: p.price != null ? String(p.price) : "",
      weight: p.weight || "",
      sku: p.sku || "",
      stock_status: p.stock_status,
    });
    setImageFile(null);
    setImagePreview(p.image_url);
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.category) {
      toast({ title: "Title and category are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      if (form.description) formData.append("description", form.description);
      formData.append("category", form.category);
      if (form.tag) formData.append("tag", form.tag);
      if (form.price) formData.append("price", form.price);
      if (form.weight) formData.append("weight", form.weight);
      if (form.sku) formData.append("sku", form.sku);
      formData.append("stock_status", form.stock_status);
      
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (editId) {
        await fetchApi(`/api/products/${editId}/update/`, {
          method: "PUT",
          body: formData,
        });
        toast({ title: "Product updated!" });
      } else {
        await fetchApi("/api/products/create/", {
          method: "POST",
          body: formData,
        });
        toast({ title: "Product added!" });
      }

      setShowForm(false);
      fetchProducts();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetchApi(`/api/products/${id}/delete/`, { method: "DELETE" });
      toast({ title: "Product deleted" });
      fetchProducts();
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Products</h2>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Add Product</Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-semibold">{editId ? "Edit Product" : "New Product"}</h3>
                <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
              </div>
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>Image</Label>
                  <div className="mt-1.5 flex items-center gap-4">
                    {imagePreview && <img src={imagePreview} alt="" className="w-20 h-20 object-cover rounded-lg" />}
                    <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border cursor-pointer hover:bg-muted/50">
                      <Upload className="w-4 h-4 text-muted-foreground" /> Upload
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  </div>
                </div>
                <div>
                  <Label>Title *</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1.5" />
                </div>
                <div>
                  <Label>Category *</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1.5" rows={3} />
                </div>
                <div><Label>Tag</Label><Input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="mt-1.5" placeholder="e.g. Organic" /></div>
                <div><Label>Price (₹)</Label><Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-1.5" /></div>
                <div><Label>Weight / Qty</Label><Input value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className="mt-1.5" placeholder="e.g. 500g" /></div>
                <div><Label>SKU</Label><Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="mt-1.5" /></div>
                <div>
                  <Label>Stock Status</Label>
                  <Select value={form.stock_status} onValueChange={(v) => setForm({ ...form, stock_status: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{stockOptions.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" disabled={saving} className="gap-2 w-full md:w-auto">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {saving ? "Saving..." : editId ? "Update Product" : "Add Product"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No products yet. Add your first one!</div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-3 font-semibold text-foreground">Image</th>
                  <th className="text-left p-3 font-semibold text-foreground">Title</th>
                  <th className="text-left p-3 font-semibold text-foreground hidden md:table-cell">Category</th>
                  <th className="text-left p-3 font-semibold text-foreground hidden md:table-cell">Price</th>
                  <th className="text-left p-3 font-semibold text-foreground hidden lg:table-cell">Stock</th>
                  <th className="text-right p-3 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="p-3">
                      {p.image_url ? (
                        <img src={p.image_url} alt="" className="w-12 h-12 object-cover rounded-lg" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-xs">N/A</div>
                      )}
                    </td>
                    <td className="p-3 font-medium text-foreground">{p.title}</td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{p.category}</td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{p.price != null ? `₹${p.price}` : "—"}</td>
                    <td className="p-3 hidden lg:table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.stock_status === "in_stock" ? "bg-primary/10 text-primary" :
                        p.stock_status === "low_stock" ? "bg-accent/10 text-accent" :
                        "bg-destructive/10 text-destructive"
                      }`}>
                        {p.stock_status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
