import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Home,
  MapPin,
  BedDouble,
  Bath,
  Building2,
} from "lucide-react";
import { API_BASE } from "@/lib/config";


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
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
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
function formatPKR(amount: number): string {
  if (!amount && amount !== 0) return "";
  return `PKR ${amount.toLocaleString("en-PK")}`;
}

const PropertiesListPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // SEO for /properties
  useEffect(() => {
    const title = "Properties for Sale & Rent | Wasi Estate & Builders";
    const desc =
      "Browse properties for sale, rent and projects offered by Wasi Estate & Builders in Lahore and beyond.";

    setDocumentTitle(title);
    upsertMeta("description", desc);
    upsertOg("og:title", title);
    upsertOg("og:description", desc);
    upsertOg("og:url", window.location.href);
  }, []);

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/properties`);
        if (!res.ok) throw new Error("Failed to load properties");
        const data = await res.json();
        const items: Property[] = data.items || data; // support both shapes
        setProperties(items);
      } catch (err) {
        console.error("Error loading properties:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-slate-500">Loading properties...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <main className="py-10 lg:py-14">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full w-fit">
              <Home className="w-4 h-4 text-green-600" />
              <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                All Properties
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900">
              Properties for Sale &amp; Rent
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl">
              Explore houses, apartments, plots and commercial properties
              curated by Wasi Estate &amp; Builders. For custom search, use the
              filters on the homepage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7 max-w-6xl">
            {properties.map((property) => (
              <article
                key={property._id}
                className="group rounded-xl bg-white border border-slate-200 hover:border-green-500/80 transition-colors shadow-sm hover:shadow-md overflow-hidden"
              >
                <div className="relative h-44 md:h-48 lg:h-52 overflow-hidden">
                  <img
                    src={
                      property.image ||
                      "https://images.unsplash.com/photo-1600607687920-4e2a534ab513?auto=format&fit=crop&w=1200&q=80"
                    }
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    {property.type}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-sm md:text-base font-semibold text-slate-900 mb-1.5 line-clamp-2">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-green-600" />
                    <span className="truncate">
                      {property.location}
                      {property.city ? `, ${property.city}` : ""}
                    </span>
                  </div>

                  <div className="h-px bg-slate-100 mb-3" />

                  <div className="flex items-baseline justify-between gap-3 mb-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500 font-semibold">
                        Demand
                      </p>
                      <p className="text-base md:text-lg font-extrabold text-green-700">
                        {formatPKR(property.price)}
                      </p>
                    </div>
                    {property.area && (
                      <div className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[11px] text-slate-700 font-medium">
                        {property.area}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-700 mb-3">
                    {property.beds && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
                        <BedDouble className="w-3.5 h-3.5" />
                        {property.beds} Beds
                      </span>
                    )}
                    {property.baths && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
                        <Bath className="w-3.5 h-3.5" />
                        {property.baths} Baths
                      </span>
                    )}
                  </div>

                  <Link to={`/properties/${property._id}`}>
                    <Button
                      variant="outline"
                      className="w-full h-9 text-xs md:text-sm font-semibold border-green-600 text-green-700 hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </article>
            ))}

            {properties.length === 0 && (
              <p className="text-sm text-slate-500">
                No properties found. Please check back later.
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertiesListPage;