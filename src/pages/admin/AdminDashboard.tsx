// src/pages/admin/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Menu,
  Image,
  Wrench,
  Home,
  Quote,
  Info,
  PhoneCall,
  PanelsTopLeft,
  FileText,
  LogOut,
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
}

interface AdminModule {
  key: string;
  title: string;
  description: string;
  path: string;
  icon: React.ElementType;
  accent?: string;
}

interface DashboardStats {
  propertiesTotal: number;
  testimonialsTotal: number;
  testimonialsPending: number;
  contactMessagesTotal: number;
  blogPostsTotal: number;
}

const MODULES: AdminModule[] = [
  {
    key: "navigation",
    title: "Navigation",
    description: "Edit top bar contact info and main navigation links.",
    path: "/admin/navigation",
    icon: Menu,
    accent: "from-sky-500/10 to-sky-500/0",
  },
  {
    key: "hero",
    title: "Hero Section",
    description: "Manage hero slides, trust badge and call-to-action content.",
    path: "/admin/hero",
    icon: Image,
    accent: "from-violet-500/10 to-violet-500/0",
  },
  {
    key: "services",
    title: "Services",
    description:
      "Manage services, features, and detailed descriptions shown on the site.",
    path: "/admin/services",
    icon: Wrench,
    accent: "from-emerald-500/10 to-emerald-500/0",
  },
  {
    key: "properties",
    title: "Properties",
    description: "Add, edit, and remove properties that appear on the website.",
    path: "/admin/properties",
    icon: Home,
    accent: "from-amber-500/10 to-amber-500/0",
  },
  {
    key: "testimonials",
    title: "Testimonials",
    description:
      "Approve, feature, draft or remove client reviews and success stories.",
    path: "/admin/testimonials",
    icon: Quote,
    accent: "from-fuchsia-500/10 to-fuchsia-500/0",
  },
  {
    key: "about",
    title: "About Section",
    description:
      "Manage founder details, association role, mission, values and timeline.",
    path: "/admin/about",
    icon: Info,
    accent: "from-indigo-500/10 to-indigo-500/0",
  },
  {
    key: "contact",
    title: "Contact Page",
    description:
      "Edit phone numbers, office address, business hours, map and CTA.",
    path: "/admin/contact",
    icon: PhoneCall,
    accent: "from-green-500/10 to-green-500/0",
  },
  {
    key: "footer",
    title: "Footer",
    description:
      "Edit footer links, contact info, social links, stats and legal text.",
    path: "/admin/footer",
    icon: PanelsTopLeft,
    accent: "from-slate-500/10 to-slate-500/0",
  },
  {
    key: "blog",
    title: "Blog / Articles",
    description: "Write and manage blog posts, like a mini CMS.",
    path: "/admin/blog",
    icon: FileText,
    accent: "from-rose-500/10 to-rose-500/0",
  },
  {
    key: "seo",
    title: "SEO & Meta",
    description:
      "Control site-wide title, descriptions, Open Graph, Twitter and schema.",
    path: "/admin/seo",
    icon: FileText,
    accent: "from-emerald-500/10 to-emerald-500/0",
  },
];

import { API_BASE } from "@/lib/config";


const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);

  // Auth / user
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const userStr = localStorage.getItem("adminUser");

    if (!token || !userStr) {
      navigate("/admin/login");
      return;
    }

    try {
      const parsed = JSON.parse(userStr);
      setAdminUser(parsed);
    } catch {
      setAdminUser(null);
      navigate("/admin/login");
    }
  }, [navigate]);

  // Quick stats
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    const fetchStats = async () => {
      try {
        setStatsLoading(true);

        const [propsRes, testRes, contactRes, postsRes] =
          await Promise.allSettled([
            fetch(`${API_BASE}/properties`),
            fetch(`${API_BASE}/testimonials/admin`, { headers }),
            fetch(`${API_BASE}/contact/messages`, { headers }),
            fetch(`${API_BASE}/posts`),
          ]);

        let propertiesTotal = 0;
        if (propsRes.status === "fulfilled" && propsRes.value.ok) {
          const data = await propsRes.value.json();
          if (typeof data.total === "number") propertiesTotal = data.total;
          else if (Array.isArray(data.items)) propertiesTotal = data.items.length;
        }

        let testimonialsTotal = 0;
        let testimonialsPending = 0;
        if (testRes.status === "fulfilled" && testRes.value.ok) {
          const data = await testRes.value.json();
          const items = Array.isArray(data.items) ? data.items : [];
          testimonialsTotal = items.length;
          testimonialsPending = items.filter(
            (t) => (t.status || "approved") === "pending"
          ).length;
        }

        let contactMessagesTotal = 0;
        if (contactRes.status === "fulfilled" && contactRes.value.ok) {
          const data = await contactRes.value.json();
          const items = Array.isArray(data.items) ? data.items : [];
          contactMessagesTotal = items.length;
        }

        let blogPostsTotal = 0;
        if (postsRes.status === "fulfilled" && postsRes.value.ok) {
          const data = await postsRes.value.json();
          if (Array.isArray(data)) blogPostsTotal = data.length;
          else if (Array.isArray(data.items)) blogPostsTotal = data.items.length;
        }

        setStats({
          propertiesTotal,
          testimonialsTotal,
          testimonialsPending,
          contactMessagesTotal,
          blogPostsTotal,
        });
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
        setStats(null);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-xs text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-white">
      {/* Top bar */}
      <header className="bg-white/80 backdrop-blur border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-semibold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="text-[11px] text-slate-500">
              Logged in as{" "}
              <span className="font-medium">{adminUser.name}</span>{" "}
              <span className="hidden sm:inline">({adminUser.email})</span>
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="text-xs flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </Button>
      </header>

      <main className="p-4 sm:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Intro card */}
          <section className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500 rounded-full blur-3xl" />
              <div className="absolute -left-10 bottom-0 w-48 h-48 bg-sky-500 rounded-full blur-3xl" />
            </div>
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-300 font-semibold mb-1">
                  Content Management
                </p>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                  Control your website without a developer
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
                  Use the cards below to update navigation, hero, services,
                  properties, testimonials, about, contact, footer and blog
                  content in real time.
                </p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-3">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-white/5 rounded-lg px-3 py-2 text-center">
                    <div className="text-emerald-300 font-bold">
                      {MODULES.length}
                    </div>
                    <div className="text-[10px] text-slate-200">
                      Sections
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg px-3 py-2 text-center">
                    <div className="text-emerald-300 font-bold">1</div>
                    <div className="text-[10px] text-slate-200">
                      Admin User
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg px-3 py-2 text-center">
                    <div className="text-emerald-300 font-bold">Live</div>
                    <div className="text-[10px] text-slate-200">
                      Site Status
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/40 text-white bg-transparent hover:bg-white/20 hover:text-white"
                  onClick={() => navigate("/")}
                >
                  View Public Site
                </Button>
              </div>
            </div>
          </section>

          {/* Quick stats row */}
          {stats && (
            <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              <div className="bg-white rounded-xl border border-slate-200 px-3 py-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Properties</span>
                  <Home className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="mt-1 text-lg sm:text-xl font-semibold text-slate-900">
                  {stats.propertiesTotal}
                </div>
                <div className="text-[10px] text-slate-400">
                  Total listings
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 px-3 py-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Testimonials
                  </span>
                  <Quote className="w-4 h-4 text-amber-600" />
                </div>
                <div className="mt-1 text-lg sm:text-xl font-semibold text-slate-900">
                  {stats.testimonialsTotal}
                </div>
                <div className="text-[10px] text-slate-400">
                  {stats.testimonialsPending} pending approval
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 px-3 py-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Contact Forms
                  </span>
                  <PhoneCall className="w-4 h-4 text-sky-600" />
                </div>
                <div className="mt-1 text-lg sm:text-xl font-semibold text-slate-900">
                  {stats.contactMessagesTotal}
                </div>
                <div className="text-[10px] text-slate-400">
                  Total inquiries
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 px-3 py-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Blog Posts</span>
                  <FileText className="w-4 h-4 text-rose-600" />
                </div>
                <div className="mt-1 text-lg sm:text-xl font-semibold text-slate-900">
                  {stats.blogPostsTotal}
                </div>
                <div className="text-[10px] text-slate-400">
                  Published articles
                </div>
              </div>
              <div className="hidden lg:flex bg-white rounded-xl border border-slate-200 px-3 py-3 flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Modules</span>
                  <LayoutDashboard className="w-4 h-4 text-slate-600" />
                </div>
                <div className="mt-1 text-lg sm:text-xl font-semibold text-slate-900">
                  {MODULES.length}
                </div>
                <div className="text-[10px] text-slate-400">
                  Editable sections
                </div>
              </div>
            </section>
          )}
          {!stats && !statsLoading && (
            <section>
              <p className="text-[11px] text-slate-400">
                Could not load quick stats (optional). You can still use all
                editors.
              </p>
            </section>
          )}

          {/* Modules grid */}
          <section>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-2">
              Manage Website Content
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Click on any card to open the editor for that section.
            </p>

            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MODULES.map((mod) => {
                const Icon = mod.icon;
                return (
                  <button
                    key={mod.key}
                    type="button"
                    onClick={() => navigate(mod.path)}
                    className="group relative text-left bg-white rounded-xl border border-slate-200 hover:border-emerald-500/70 hover:shadow-md transition-all duration-200 p-3 sm:p-4 flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 w-9 h-9 rounded-lg bg-gradient-to-br ${
                          mod.accent || "from-slate-200/60 to-slate-50"
                        } flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-0.5">
                          {mod.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                          {mod.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-emerald-700 group-hover:text-emerald-800">
                        Open {mod.title}
                      </span>
                      <span className="text-[11px] text-slate-400 group-hover:text-emerald-600">
                        Manage →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick links row */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {/* Services Transformations Settings */}
              <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Services Section (Our Work)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Control the Transformation Stories slider and its visibility.
                  </p>
                </div>
                <div className="mt-3">
                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={() => navigate("/admin/services-settings")}
                  >
                    Manage Services Section
                  </Button>
                </div>
              </div>

              {/* Static Pages Builder */}
              <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Static Pages (Legal / Info)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Create pages like Privacy Policy, Terms of Service, FAQ,
                    etc.
                  </p>
                </div>
                <div className="mt-3">
                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={() => navigate("/admin/pages")}
                  >
                    Open Page Builder
                  </Button>
                </div>
              </div>

              {/* Site & SEO Settings */}
              <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Site &amp; SEO Settings
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Control sitemap.xml, robots.txt and base URL when you go
                    live.
                  </p>
                </div>
                <div className="mt-3">
                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={() => navigate("/admin/site")}
                  >
                    Open Site Settings
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;