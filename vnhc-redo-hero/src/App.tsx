import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth.tsx";
import { initCsrfToken } from "@/lib/api";
import { useEffect } from "react";
import Index from "./pages/Index.tsx";
import AboutUs from "./pages/AboutUs.tsx";
import Contact from "./pages/Contact.tsx";
import Gallery from "./pages/Gallery.tsx";
import Products from "./pages/Products.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminProducts from "./pages/admin/AdminProducts.tsx";
import AdminGallery from "./pages/admin/AdminGallery.tsx";
import AdminInquiries from "./pages/admin/AdminInquiries.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import Acupressure from "./pages/training/Acupressure.tsx";
import AdvancedAyurveda from "./pages/training/AdvancedAyurveda.tsx";
import AromaTherapy from "./pages/training/AromaTherapy.tsx";
import ClinicalNutrition from "./pages/training/ClinicalNutrition.tsx";
import MedicalHerbs from "./pages/training/MedicalHerbs.tsx";
import TrainingPrograms from "./pages/training/TrainingPrograms.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const AppContent = () => {
  useEffect(() => {
    initCsrfToken();
  }, []);

  return (
    <>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/gallery" element={<Gallery />} />
          
          {/* Public Training Setup */}
          <Route path="/training/acupressure" element={<Acupressure />} />
          <Route path="/training/advanced-ayurveda" element={<AdvancedAyurveda />} />
          <Route path="/training/aroma-therapy" element={<AromaTherapy />} />
          <Route path="/training/clinical-nutrition" element={<ClinicalNutrition />} />
          <Route path="/training/medical-herbs" element={<MedicalHerbs />} />
          <Route path="/training/programs" element={<TrainingPrograms />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/gallery" element={<AdminGallery />} />
          <Route path="/admin/inquiries" element={<AdminInquiries />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
