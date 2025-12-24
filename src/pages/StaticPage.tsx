// src/pages/StaticPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const API_BASE = "http://localhost:5000/api";

interface CmsPage {
  _id?: string;
  title: string;
  slug: string;
  body: string;
  status: "draft" | "published";
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
  createdAt?: string;
}

// SEO helpers
function setDocumentTitle(title?: string) {
  if (title) document.title = title;
}
function upsertMeta(name: string, content?: string) {
  if (!content) return;
  let tag = document.querySelector(
    `meta[name="${name}"]`
  ) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}
function upsertOg(property: string, content?: string) {
  if (!content) return;
  let tag = document.querySelector(
    `meta[property="${property}"]`
  ) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

const StaticPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<CmsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function fetchPage() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/pages/${slug}`);
        if (res.status === 404) {
          setError("Page not found");
          setPage(null);
          return;
        }
        if (!res.ok) throw new Error("Failed to load page");
        const data: CmsPage = await res.json();
        setPage(data);
        setError(null);
      } catch (err ) {
        console.error(err);
        setError(err.message || "Failed to load page");
      } finally {
        setLoading(false);
      }
    }

    fetchPage();
  }, [slug]);

  // SEO override when page loaded
  useEffect(() => {
    if (!page) return;

    const baseSiteName = "Wasi Estate";
    const pageTitle = page.seoTitle
      ? `${page.seoTitle} | ${baseSiteName}`
      : `${page.title} | ${baseSiteName}`;
    const description =
      page.seoDescription ||
      "Wasi Estate & Builders – privacy, terms, and important information.";

    const image = page.seoImage || "";
    const url = window.location.href;

    setDocumentTitle(pageTitle);
    upsertMeta("description", description);
    upsertOg("og:title", pageTitle);
    upsertOg("og:description", description);
    upsertOg("og:image", image);
    upsertOg("og:url", url);
    upsertMeta("twitter:title", pageTitle);
    upsertMeta("twitter:description", description);
    upsertMeta("twitter:image", image);
  }, [page]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-slate-500">Loading page...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="max-w-md bg-white rounded-lg border border-slate-200 p-4 space-y-2">
            <p className="text-sm font-semibold text-slate-900">
              {error || "Page not found"}
            </p>
            <Link to="/" className="text-xs text-blue-600 hover:underline">
              Back to home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const createdDate = page.createdAt
    ? new Date(page.createdAt).toLocaleDateString()
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <main className="px-4 py-6 lg:py-10">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Link to="/" className="hover:text-slate-800">
                Home
              </Link>
              <span>/</span>
              <span className="font-medium text-slate-700 line-clamp-1">
                {page.title}
              </span>
            </div>
          </div>

          <article className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 md:p-6 space-y-3">
              <header className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  {page.title}
                </h1>
                {createdDate && (
                  <p className="text-[11px] text-slate-400">
                    Last updated on {createdDate}
                  </p>
                )}
              </header>

              {page.body && (
                <section className="prose prose-sm max-w-none text-slate-800">
                  <div dangerouslySetInnerHTML={{ __html: page.body }} />
                </section>
              )}
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StaticPage;