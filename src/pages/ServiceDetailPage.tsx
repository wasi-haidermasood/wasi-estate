import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { API_BASE } from "@/lib/config";

const res = await fetch(`${API_BASE}/posts`);
interface Service {
  _id?: string;
  slug: string;
  kind: "main" | "additional";
  icon: string;
  title: string;
  shortDescription: string;
  features: string[];
  image: string;
  commission: string;
  color: string;
  body: string;        // HTML (from editor) or Markdown
  createdAt?: string;
  updatedAt?: string;

  // NEW SEO FIELDS
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
}

// --- SEO helpers ---
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

/**
 * Upsert a JSON-LD <script> tag in <head> by id
 */
function setJsonLd(id: string, data: unknown) {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}
// -------------------

const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function fetchService() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/services/${slug}`);
        if (res.status === 404) {
          setError("Service not found");
          setService(null);
          return;
        }
        if (!res.ok) {
          throw new Error("Failed to load service");
        }
        const data: Service = await res.json();
        setService(data);
        setError(null);
      } catch (err ) {
        console.error(err);
        setError(err.message || "Failed to load service");
      } finally {
        setLoading(false);
      }
    }

    fetchService();
  }, [slug]);

  // --- SEO override + JSON-LD when service is loaded ---
  useEffect(() => {
    if (!service) return;

    const baseSiteName = "Wasi Estate Services";
    const pageTitle = service.seoTitle
      ? `${service.seoTitle} | ${baseSiteName}`
      : `${service.title} | ${baseSiteName}`;

    const description =
      service.seoDescription ||
      service.shortDescription ||
      "Learn more about this service offered by Wasi Estate & Builders.";

    const image = service.seoImage || service.image || "";
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

    // JSON-LD: Service
    const serviceLd = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title,
      description,
      areaServed: "Lahore, Pakistan",
      provider: {
        "@type": "Organization",
        name: "Wasi Estate & Builders",
      },
      url,
    };

    setJsonLd("ld-service", serviceLd);
  }, [service]);
  // -------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-slate-500">Loading service...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="max-w-md bg-white rounded-lg border border-slate-200 p-4 space-y-2">
            <p className="text-sm font-semibold text-slate-900">
              {error || "Service not found"}
            </p>
            <Link
              to="/services"
              className="text-xs text-blue-600 hover:underline"
            >
              Back to all services
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const createdDate = service.createdAt
    ? new Date(service.createdAt).toLocaleDateString()
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <main className="px-4 py-6 lg:py-10">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb / top meta */}
          <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Link to="/" className="hover:text-slate-800">
                Home
              </Link>
              <span>/</span>
              <Link to="/#services" className="hover:text-slate-800">
                Services
              </Link>
              <span>/</span>
              <span className="font-medium text-slate-700 line-clamp-1">
                {service.title}
              </span>
            </div>
            <Link
              to="/services"
              className="text-xs text-slate-500 hover:text-slate-900"
            >
              All Services
            </Link>
          </div>

          <article className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            {/* Hero image */}
            {service.image && (
              <div className="w-full h-56 md:h-72 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-4 md:p-6 space-y-4">
              {/* Title & meta */}
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  {service.kind === "main" ? "Main Service" : "Additional Service"}
                  {service.commission && ` · ${service.commission}`}
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  {service.title}
                </h1>
                {createdDate && (
                  <p className="text-[11px] text-slate-400">
                    Updated on {createdDate}
                  </p>
                )}
              </div>

              {/* Short description */}
              {service.shortDescription && (
                <p className="text-sm text-slate-600">
                  {service.shortDescription}
                </p>
              )}

              {/* Features */}
              {service.features && service.features.length > 0 && (
                <section className="border border-slate-100 rounded-lg p-3 space-y-1 bg-slate-50/60">
                  <h2 className="text-xs font-semibold text-slate-800">
                    Key Features
                  </h2>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                    {service.features.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Body content */}
              {service.body && (
                <section className="prose prose-sm max-w-none text-slate-800">
                  <div
                    dangerouslySetInnerHTML={{ __html: service.body }}
                  />
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

export default ServiceDetailPage;