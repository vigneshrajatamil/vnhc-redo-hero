import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, X, Play } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface GalleryImage {
  id: string;
  image_url: string;
  title: string | null;
  is_video: boolean;
  created_at: string;
}

const Gallery = () => {
  const { admin } = useAuth();
  const isAdmin = !!admin;
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<GalleryImage | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data } = await fetchApi("/api/gallery/", { method: "GET" });
      setImages(data?.images || []);
    } catch (err: any) {
      toast({ title: "Error loading gallery", description: err.message, variant: "destructive" });
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isAdmin) return;

    if (file.size > 50 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 50MB allowed.", variant: "destructive" });
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

      toast({ title: "Media uploaded!" });
      setUploadTitle("");
      fetchImages();
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (image: GalleryImage) => {
    try {
      await fetchApi(`/api/gallery/${image.id}/delete/`, { method: "DELETE" });
      toast({ title: "Media deleted" });
      setImages((prev) => prev.filter((img) => img.id !== image.id));
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="text-primary font-body text-sm uppercase tracking-[0.2em] font-semibold">
              Our Gallery
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3">
              Photo & Video Gallery
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
              Explore moments from our wellness journey and community events.
            </p>
          </motion.div>

          {images.length === 0 ? (
            <p className="text-center text-muted-foreground text-lg">No media yet.</p>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {images.map((image, i) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative group break-inside-avoid overflow-hidden rounded-xl"
                >
                  {image.is_video ? (
                    <div
                      className="relative cursor-pointer"
                      onClick={() => setSelectedMedia(image)}
                    >
                      <video
                        src={image.image_url}
                        className="w-full object-cover"
                        muted
                        preload="metadata"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Play className="w-12 h-12 text-white fill-white/80" />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={image.image_url}
                      alt={image.title || "Gallery image"}
                      className="w-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                      onClick={() => setSelectedMedia(image)}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end pointer-events-none">
                    <div className="p-3 w-full flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                      {image.title && (
                        <span className="text-white text-sm font-medium truncate">{image.title}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <button className="absolute top-6 right-6 text-white" onClick={() => setSelectedMedia(null)}>
            <X className="w-8 h-8" />
          </button>
          {selectedMedia.title && (
            <div className="absolute top-6 left-6 text-white text-lg font-semibold">
              {selectedMedia.title}
            </div>
          )}
          {selectedMedia.is_video ? (
            <video
              src={selectedMedia.image_url}
              controls
              autoPlay
              className="max-w-full max-h-[90vh] rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={selectedMedia.image_url}
              alt={selectedMedia.title || "Full view"}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          )}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;
