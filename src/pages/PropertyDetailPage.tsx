import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { BedDouble, Bath, MapPin, Building2, Phone } from "lucide-react";
import { API_BASE } from "@/lib/config";

const res = await fetch(`${API_BASE}/posts`);

interface Property {
  _id: string;
  id?: string;
  title: string;
  city: string;
  location: string;
  type: string;
  transactionType: string;
  price: number;
  beds?: number;
  baths?: number;
  area?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;

  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
  descriptionHtml?: string;
}

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

function formatPKR(amount: number): string {
  if (!amount && amount !== 0) return "";
  return `PKR ${amount.toLocaleString("en-PK")}`;
}

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchProperty() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/properties/${id}`);
        if (res.status === 404) {
          setError("Property not found");
          setProperty(null);
          return;
        }
        if (!res.ok) throw new Error("Failed to load property");
        const data: Property = await res.json();
        setProperty(data);
        setError(null);
      } catch (err ) {
        console.error(err);
        setError(err.message || "Failed to load property");
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [id]);

  // SEO override + JSON-LD
  useEffect(() => {
    if (!property) return;

    const locationStr = property.location
      ? property.city
        ? `${property.location}, ${property.city}`
        : property.location
      : property.city || "";

    const baseSiteName = "Wasi Estate Properties";

    const pageTitle = property.seoTitle
      ? `${property.seoTitle} | ${baseSiteName}`
      : `${property.title} ${
          locationStr ? `in ${locationStr}` : ""
        } | ${baseSiteName}`;

    const desc =
      property.seoDescription ||
      `Explore this ${property.type} for ${
        property.transactionType === "rent" ? "rent" : "sale"
      }${locationStr ? ` in ${locationStr}` : ""}${
        property.area ? ` (${property.area})` : ""
      }. Contact Wasi Estate & Builders for details.`;

    const image = property.seoImage || property.image || "";
    const url = window.location.href;

    setDocumentTitle(pageTitle);
    upsertMeta("description", desc);
    upsertOg("og:title", pageTitle);
    upsertOg("og:description", desc);
    upsertOg("og:image", image);
    upsertOg("og:url", url);

    upsertMeta("twitter:title", pageTitle);
    upsertMeta("twitter:description", desc);
    upsertMeta("twitter:image", image);

    // JSON-LD: Product + Offer
    const propertyLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: property.title,
      description: desc,
      image: image ? [image] : undefined,
      url,
      offers: {
        "@type": "Offer",
        price: property.price,
        priceCurrency: "PKR",
        availability: "https://schema.org/InStock",
      },
    };

    setJsonLd("ld-property", propertyLd);
  }, [property]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-slate-500">Loading property...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="max-w-md bg-white rounded-lg border border-slate-200 p-4 space-y-2">
            <p className="text-sm font-semibold text-slate-900">
              {error || "Property not found"}
            </p>
            <Link
              to="/properties"
              className="text-xs text-blue-600 hover:underline"
            >
              Back to all properties
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const locationStr = property.location
    ? property.city
      ? `${property.location}, ${property.city}`
      : property.location
    : property.city || "";

  const createdDate = property.createdAt
    ? new Date(property.createdAt).toLocaleDateString()
    : null;

  const transactionLabel =
    property.transactionType === "rent"
      ? "For Rent"
      : property.transactionType === "projects"
      ? "Project"
      : "For Sale";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <main className="py-8 lg:py-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Link to="/" className="hover:text-slate-800">
                Home
              </Link>
              <span>/</span>
              <Link to="/properties" className="hover:text-slate-800">
                Properties
              </Link>
              <span>/</span>
              <span className="font-medium text-slate-700 line-clamp-1">
                {property.title}
              </span>
            </div>
          </div>

          <article className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            {property.image && (
              <div className="w-full h-56 md:h-72 lg:h-80 overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-4 md:p-6 space-y-4">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div className="space-y-1">
                  <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-slate-500">
                    <Building2 className="w-3.5 h-3.5 text-green-600" />
                    {property.type} · {transactionLabel}
                  </p>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                    {property.title}
                  </h1>
                  {locationStr && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-green-600" />
                      <span>{locationStr}</span>
                    </div>
                  )}
                  {createdDate && (
                    <p className="text-[11px] text-slate-400">
                      Listed on {createdDate}
                    </p>
                  )}
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500 font-semibold">
                    Demand
                  </p>
                  <p className="text-2xl font-extrabold text-green-700">
                    {formatPKR(property.price)}
                  </p>
                  {property.area && (
                    <p className="text-[11px] text-slate-500">
                      Area: <span className="font-medium">{property.area}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
                {property.beds !== undefined && (
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <BedDouble className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-[11px] text-slate-500">Bedrooms</p>
                      <p className="font-semibold">{property.beds || 0}</p>
                    </div>
                  </div>
                )}
                {property.baths !== undefined && (
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <Bath className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-[11px] text-slate-500">Bathrooms</p>
                      <p className="font-semibold">{property.baths || 0}</p>
                    </div>
                  </div>
                )}
                {property.area && (
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-semibold text-slate-700">
                      {property.area.split(" ")[0]}
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500">Area</p>
                      <p className="font-semibold">{property.area}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <Phone className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-[11px] text-slate-500">
                      Contact Wasi Estate
                    </p>
                    <p className="font-semibold">0321-4710692</p>
                  </div>
                </div>
              </div>

              {/* Description / CTA */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <p className="text-xs text-slate-600">
                  For more details or to schedule a viewing, please contact our
                  team. We&apos;ll guide you through the complete process,
                  including documentation and negotiation.
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="tel:03214710692"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call Now
                  </a>
                  <Link
                    to="/#contact"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Contact Form
                  </Link>
                </div>
              </div>

              {/* Long description from CMS */}
              {property.descriptionHtml && (
                <div className="pt-4 border-t border-slate-100">
                  <h2 className="text-sm font-semibold text-slate-900 mb-2">
                    Property Details &amp; Description
                  </h2>
                  <div
                    className="prose prose-xs sm:prose-sm max-w-none text-slate-800"
                    dangerouslySetInnerHTML={{
                      __html: property.descriptionHtml,
                    }}
                  />
                </div>
              )}
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetailPage;