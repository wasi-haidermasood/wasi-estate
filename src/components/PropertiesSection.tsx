import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Home,
  MapPin,
  BedDouble,
  Bath,
  Building2,
} from "lucide-react";
import type { Property } from "@/types/property";

interface PropertiesSectionProps {
  properties?: Property[]; // passed from search, optional
}

const fallbackProperties: Property[] = [
  {
    _id: "fallback-1",
    id: 1,
    title: "1 Kanal Luxury House – Modern Elevation",
    location: "DHA Phase 6, Lahore",
    price: "PKR 9.50 Crore",
    beds: 5,
    baths: 6,
    area: "1 Kanal",
    type: "House",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a534ab513?auto=format&fit=crop&w=1200&q=80",
  },
  {
    _id: "fallback-2",
    id: 2,
    title: "10 Marla Brand New House – Ideal for Families",
    location: "Bahria Town, Lahore",
    price: "PKR 4.25 Crore",
    beds: 4,
    baths: 5,
    area: "10 Marla",
    type: "House",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a534ab513?auto=format&fit=crop&w=1200&q=80",
  },
  {
    _id: "fallback-3",
    id: 3,
    title: "Prime Commercial Office – Main Boulevard",
    location: "Gulberg, Lahore",
    price: "PKR 3.50 Lac / Month",
    area: "2,000 sq.ft",
    type: "Commercial",
    image:
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80",
  },
];

import { API_BASE } from "@/lib/config";

function formatPKR(amount: number): string {
  if (!amount && amount !== 0) return "";
  return `PKR ${amount.toLocaleString("en-PK")}`;
}

const PropertiesSection: React.FC<PropertiesSectionProps> = ({
  properties: searchResults,
}) => {
  const [loadedProperties, setLoadedProperties] = useState<Property[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  // Load from backend when no search results
  useEffect(() => {
    if (searchResults && searchResults.length > 0) return;

    async function fetchProperties() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/properties`);
        if (!res.ok) throw new Error("Failed to load properties");
        const data = await res.json();

        const mapped: Property[] = (data.items || []).map((p) => ({
          _id: p._id,
          id: p._id || p.id, // use Mongo _id for routing if available
          title: p.title,
          location: p.location
            ? p.city
              ? `${p.location}, ${p.city}`
              : p.location
            : p.city || "",
          price: formatPKR(p.price),
          beds: p.beds,
          baths: p.baths,
          area: p.area,
          type: p.type,
          image:
            p.image ||
            "https://images.unsplash.com/photo-1600607687920-4e2a534ab513?auto=format&fit=crop&w=1200&q=80",
        }));

        setLoadedProperties(mapped);
      } catch (err) {
        console.error("Failed to load properties from API:", err);
        // keep null -> use fallback
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [searchResults]);

  const propertiesToShow =
    searchResults && searchResults.length > 0
      ? searchResults
      : loadedProperties && loadedProperties.length > 0
      ? loadedProperties
      : fallbackProperties;

  return (
    <section id="properties" className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-10 lg:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 mb-4">
            <Home className="w-4 h-4 text-green-600" />
            <span className="text-xs font-semibold tracking-wide uppercase text-green-700">
              Wasi Estate & Adviser • Lahore
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
            Featured Properties
          </h2>

          <p className="text-sm md:text-base lg:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            A selection of residential and commercial properties in Lahore,
            carefully picked by{" "}
            <span className="font-semibold text-green-700">
              Wasi Estate & Adviser
            </span>{" "}
            for serious buyers and investors.
          </p>
        </div>
        

        {/* Properties Grid */}
        <div className="max-w-6xl mx-auto">
          {loading && !loadedProperties && !searchResults && (
            <p className="text-center text-xs text-slate-500 mb-4">
              Loading properties...
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
            {propertiesToShow.map((property) => {
              const detailId = (property._id ?? property.id)?.toString();
              const canViewDetails = !!detailId;

              return (
                <article
                  key={property._id || property.id}
                  className="group rounded-xl bg-white border border-slate-200 hover:border-green-500/80 transition-colors shadow-sm hover:shadow-md overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-44 md:h-48 lg:h-52 overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      {property.type}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-sm md:text-base font-semibold text-slate-900 mb-1.5 line-clamp-2">
                      {property.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-green-600" />
                      <span className="truncate">{property.location}</span>
                    </div>

                    <div className="h-px bg-slate-100 mb-3" />

                    <div className="flex items-baseline justify-between gap-3 mb-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500 font-semibold">
                          Demand
                        </p>
                        <p className="text-base md:text-lg font-extrabold text-green-700">
                          {property.price}
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

                    {canViewDetails ? (
                      <Link to={`/properties/${detailId}`}>
                        <Button
                          variant="outline"
                          className="w-full h-9 text-xs md:text-sm font-semibold border-green-600 text-green-700 hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors"
                        >
                          View Details
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant="outline"
                        disabled
                        className="w-full h-9 text-xs md:text-sm font-semibold border-slate-200 text-slate-400"
                      >
                        View Details
                      </Button>
                    )}
                  </div>
                </article>
              );
              
            })}
          </div>
        </div>
        <div className="mt-4 flex justify-center">
  <Link to="/properties">
    <Button
      variant="outline"
      className="h-9 text-xs md:text-sm font-semibold border-green-600 text-green-700 hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors"
    >
      View All Properties
    </Button>
  </Link>
</div>
      </div>
    </section>
  );
};

export default PropertiesSection;