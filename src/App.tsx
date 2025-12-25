import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminNavigationPage from "@/pages/admin/AdminNavigationPage";
import AdminHeroPage from "@/pages/admin/AdminHeroPage";
import AdminServicesPage from "@/pages/admin/AdminServicesPage";
import ServiceDetailPage from "@/pages/ServiceDetailPage";
import BlogListPage from "@/pages/BlogListPage";
import BlogPostPage from "@/pages/BlogPostPage";
import AdminBlogPage from "@/pages/admin/AdminBlogPage";
import AdminPropertiesPage from "@/pages/admin/AdminPropertiesPage";
import AdminTestimonialsPage from "@/pages/admin/AdminTestimonialsPage";
import AdminAboutPage from "@/pages/admin/AdminAboutPage";
import AdminContactPage from "@/pages/admin/AdminContactPage";
import AdminFooterPage from "@/pages/admin/AdminFooterPage";
import SeoHeadManager from "@/components/SeoHeadManager";
import AdminSeoPage from "@/pages/admin/AdminSeoPage";
import PropertiesListPage from "@/pages/PropertiesListPage";
import PropertyDetailPage from "@/pages/PropertyDetailPage";
import AdminServicesSettingsPage from "@/pages/admin/AdminServicesSettingsPage";
import AdminPagesPage from "@/pages/admin/AdminPagesPage";
import StaticPage from "@/pages/StaticPage";
import AdminSiteSettingsPage from "@/pages/admin/AdminSiteSettingsPage";
import { SpeedInsights } from "@vercel/speed-insights/react";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        {/* MUST be inside BrowserRouter */}
        <ScrollToTop />

        <SpeedInsights />
        <Toaster />
        <Sonner />
        <SeoHeadManager />

        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/navigation" element={<AdminNavigationPage />} />
          <Route path="/admin/hero" element={<AdminHeroPage />} />
          <Route path="/admin/services" element={<AdminServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/admin/blog" element={<AdminBlogPage />} />
          <Route path="/admin/properties" element={<AdminPropertiesPage />} />
          <Route path="/admin/testimonials" element={<AdminTestimonialsPage />} />
          <Route path="/admin/about" element={<AdminAboutPage />} />
          <Route path="/admin/contact" element={<AdminContactPage />} />
          <Route path="/admin/footer" element={<AdminFooterPage />} />
          <Route path="/admin/seo" element={<AdminSeoPage />} />
          <Route path="/properties" element={<PropertiesListPage />} />
          <Route path="/properties/:id" element={<PropertyDetailPage />} />
          <Route path="/admin/services-settings" element={<AdminServicesSettingsPage />} />
          <Route path="/admin/pages" element={<AdminPagesPage />} />
          <Route path="/admin/site" element={<AdminSiteSettingsPage />} />
          <Route path="/:slug" element={<StaticPage />} />

          {/* keep catch-all last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;