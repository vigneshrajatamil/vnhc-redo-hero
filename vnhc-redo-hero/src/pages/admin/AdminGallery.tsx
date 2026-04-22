import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Loader2, Play } from "lucide-react";

interface GalleryImage {
  id: string;
  image_url: string;
  title: string | null;
  is_video: boolean;
  created_at: string;
}

const AdminGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const { toast } = useToast();

  const fetchImages = async () => {
    setLoading(true);
    try {
      const { data } = await fetchApi("/api/gallery/", { method: "GET" });
      setImages(data?.images || []);
    } catch (err: any) {
      toast({ title: "Failed to fetch gallery", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 50MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const title = uploadTitle.trim();
      if (title) formData.append("title", title);

      await fetchApi("/api/gallery/upload/", {
        method: "POST",
        body: formData,
      });

      toast({ title: "Uploaded!" });
      setUploadTitle("");
      fetchImages();
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (img: GalleryImage) => {
    try {
      await fetchApi(`/api/gallery/${img.id}/delete/`, { method: "DELETE" });
      toast({ title: "Deleted" });
      setImages((prev) => prev.filter((i) => i.id !== img.id));
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Gallery</h2>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Title..."
            value={uploadTitle}
            onChange={(e) => setUploadTitle(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm w-40 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <label className="cursor-pointer">
            <Button asChild disabled={uploading} className="gap-2">
              <span>
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? "Uploading..." : "Upload"}
              </span>
            </Button>
            <input type="file" accept="image/*,video/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No media yet.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden bg-card border border-border">
              {img.is_video ? (
                <div className="relative h-40">
                  <video src={img.image_url} className="w-full h-full object-cover" muted preload="metadata" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20"><Play className="w-8 h-8 text-white" /></div>
                </div>
              ) : (
                <img src={img.image_url} alt={img.title || ""} className="w-full h-40 object-cover" />
              )}
              <div className="p-3 flex items-center justify-between">
                <span className="text-sm text-foreground truncate">{img.title || "Untitled"}</span>
                <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => handleDelete(img)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminGallery;
