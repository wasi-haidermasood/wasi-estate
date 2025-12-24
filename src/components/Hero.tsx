import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  MapPin,
  Building2,
  Home,
  Phone,
  Mail,
  Briefcase,
  PlayCircle,
  Users,
  ChevronRight,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import type { Property } from "@/types/property";

// ===== TYPES FOR HERO CONFIG =====
type HeroSlide = {
  id: number | string;
  image: string;
  title: string;
  subtitle: string;
};

type HeroConfig = {
  slides: HeroSlide[];

  trustBadge: {
    text: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    dotColor: string;
  };

  header: {
    subtitleSuffix: string;
  };

  headerButtons: {
    viewListingsText: string;
    watchVideoText: string;
    watchVideoUrl?: string;
  };

  ctaCard: {
    title: string;
    subtitle: string;
    highlightText: string;
    primaryButtonText: string;

    whatsappNumber: string;
    whatsappText: string;

    secondaryButtonText: string;

    agentsCount: number;
    agentsLabel: string;
    verifyLabel: string;
  };
};

// Fallback static slides
const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    title: "Premium Commercial Spaces",
    subtitle: "Expand your business in the heart of the city",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    title: "Exclusive Residential Estates",
    subtitle: "Living redefined with world-class amenities",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    title: "Investment Opportunities",
    subtitle: "Secure high ROI with our verified projects",
  },
];

interface RealEstateHeroProps {
  onSearchResults?: (properties: Property[]) => void;
}

const RealEstateHero: React.FC<RealEstateHeroProps> = ({ onSearchResults }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("buy");

  // Search fields
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("All Types");
  const [priceRange, setPriceRange] = useState("Any Price");

  // Hero config from backend
  const [heroConfig, setHeroConfig] = useState<HeroConfig | null>(null);

  // Load hero config from backend
  useEffect(() => {
    const fetchHeroConfig = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/hero");
        const data: HeroConfig = await res.json();
        setHeroConfig(data);
      } catch (error) {
        console.error("Failed to load hero config:", error);
      }
    };

    fetchHeroConfig();
  }, []);

  // Choose slides: backend first, then fallback
  const slides: HeroSlide[] =
    heroConfig?.slides && heroConfig.slides.length > 0
      ? heroConfig.slides
      : HERO_SLIDES;

  const slideCount = slides.length;

  // Auto-slide using dynamic slides
  useEffect(() => {
    if (!slideCount) return;
    const timer = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % slideCount),
      6000
    );
    return () => clearInterval(timer);
  }, [slideCount]);

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToProperties = () => {
    document
      .querySelector("#properties")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Subtitle suffix from config
  const subtitleSuffix =
    heroConfig?.header?.subtitleSuffix ??
    "We connect you with the most prestigious properties.";

  // Trust badge config
  const trustBadge = heroConfig?.trustBadge;

  // Header buttons config
  const headerButtons = heroConfig?.headerButtons;

  const handleWatchVideo = () => {
    const url = headerButtons?.watchVideoUrl;
    if (url) {
      window.open(url, "_blank", "noopener");
    }
  };

  // CTA card config
  const cta = heroConfig?.ctaCard;

  const whatsappLink = cta?.whatsappNumber
    ? `https://wa.me/${cta.whatsappNumber}`
    : "https://wa.me/923214710692";

  // Search handler
  const handleSearch = async () => {
    try {
      const params = new URLSearchParams({
        transactionType: activeTab,
        location,
        propertyType,
        priceRange,
      });

      const res = await fetch(
        `http://localhost:5000/api/properties?${params.toString()}`
      );
      const data = await res.json();

      // Map API data to Property[] shape that PropertiesSection expects
      const mapped: Property[] = data.items.map((item) => ({
        id: item.id,
        title: item.title,
        location: `${item.location}, ${item.city}`,
        price: `PKR ${item.price.toLocaleString("en-PK")}`,
        beds: item.beds,
        baths: item.baths,
        area: item.area,
        type: item.type,
        image: item.image,
      }));

      if (onSearchResults) {
        onSearchResults(mapped);
      }

      scrollToProperties();
    } catch (error) {
      console.error("Error performing search:", error);
    }
  };

  return (
    <div className="relative w-full">
      {/* ===== BACKGROUND SLIDER ===== */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30 lg:from-slate-900 lg:via-slate-900/50 lg:to-slate-900/20" />
          </div>
        ))}
      </div>

      {/* ===== MAIN CONTENT WRAPPER ===== */}
      <div className="relative z-10 min-h-[100svh] lg:min-h-[95vh] flex flex-col">
        {/* ===== CONTENT AREA ===== */}
        <div className="flex-1 container mx-auto px-4 flex flex-col justify-center py-20 lg:py-0">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-center lg:items-end">
            {/* ----- LEFT: Headlines ----- */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4 lg:space-y-6 text-center lg:text-left">
              {/* Trust Badge (dynamic) */}
              <div className="flex justify-center lg:justify-start">
                <span
                  className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full backdrop-blur-sm font-bold tracking-wider uppercase text-[10px] lg:text-xs"
                  style={{
                    backgroundColor:
                      trustBadge?.bgColor ?? "rgba(234,179,8,0.2)",
                    border: `1px solid ${
                      trustBadge?.borderColor ?? "rgba(234,179,8,0.4)"
                    }`,
                    color: trustBadge?.textColor ?? "#facc15",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: trustBadge?.dotColor ?? "#facc15" }}
                  />
                  {trustBadge?.text ?? "Since 2013 • Trusted Partner"}
                </span>
              </div>

              {/* Title (dynamic slide) */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
                {slides[currentSlide]?.title}
              </h1>

              {/* Subtitle + suffix */}
              <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                {slides[currentSlide]?.subtitle}. {subtitleSuffix}
              </p>

              {/* Slide Indicators (dynamic) */}
              <div className="flex items-center justify-center lg:justify-start gap-2 pt-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentSlide
                        ? "w-8 bg-yellow-500"
                        : "w-3 bg-white/40 hover:bg-white/60"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Desktop Only Buttons (dynamic text + video link) */}
              <div className="hidden lg:flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={scrollToProperties}
                  className="border-2 border-white text-black hover:bg-white hover:text-slate-900 rounded-lg px-8 py-6 text-base font-bold transition-all"
                >
                  {headerButtons?.viewListingsText ?? "View Listings"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleWatchVideo}
                  className="text-white hover:bg-white/10 px-6 py-6 text-base gap-2 font-medium"
                >
                  <PlayCircle className="w-5 h-5" />{" "}
                  {headerButtons?.watchVideoText ?? "Watch Video"}
                </Button>
              </div>
            </div>

            {/* ----- RIGHT: CTA Card ----- */}
            <div className="lg:col-span-5 xl:col-span-4 w-full max-w-md mx-auto lg:mx-0 lg:max-w-none">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Card Header (dynamic) */}
                <div className="bg-slate-900 px-4 py-3 lg:px-6 lg:py-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base lg:text-xl font-bold text-white">
                      {cta?.title ?? "Buy or Sell Property?"}
                    </h3>
                    <p className="text-xs lg:text-sm text-gray-400">
                      {cta?.subtitle ?? "Free consultation available"}
                    </p>
                  </div>
                  <div className="bg-yellow-500 text-slate-900 px-2 py-1 rounded text-[10px] lg:text-xs font-bold">
                    {cta?.highlightText ?? "1% ONLY"}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 lg:p-6 space-y-3 lg:space-y-4">
                  {/* Primary CTA (dynamic text) */}
                  <Button
                    onClick={scrollToContact}
                    className="w-full bg-green-600 hover:bg-green-700 text-white h-11 lg:h-14 text-sm lg:text-base font-bold shadow-lg group"
                  >
                    <Phone className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                    {cta?.primaryButtonText ?? "Request Call Back"}
                  </Button>

                  {/* Secondary CTAs */}
                  <div className="grid grid-cols-2 gap-2 lg:gap-3">
                    <a
                      href={whatsappLink}
                      className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 h-10 lg:h-12 rounded-lg text-xs lg:text-sm font-bold transition-colors"
                    >
                      <FaWhatsapp className="w-4 h-4" />
                      {cta?.whatsappText ?? "WhatsApp"}
                    </a>
                    <Button
                      onClick={scrollToContact}
                      variant="outline"
                      className="h-10 lg:h-12 text-xs lg:text-sm font-bold border-slate-200"
                    >
                      <Mail className="w-3 h-3 lg:w-4 lg:h-4 mr-1.5" />
                      {cta?.secondaryButtonText ?? "List Property"}
                    </Button>
                  </div>

                  {/* Trust Indicators (dynamic counts/labels) */}
                  <div className="flex items-center justify-between pt-3 lg:pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[11, 12, 13].map((i) => (
                          <img
                            key={i}
                            src={`https://i.pravatar.cc/60?img=${i}`}
                            alt="Agent"
                            className="w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2 border-white"
                          />
                        ))}
                      </div>
                      <span className="text-[10px] lg:text-xs text-slate-600">
                        <strong className="text-slate-900">
                          {cta?.agentsCount ?? 12}+
                        </strong>{" "}
                        {cta?.agentsLabel ?? "Agents"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-[10px] lg:text-xs font-bold">
                      <Users className="w-3 h-3" />
                      {cta?.verifyLabel ?? "Verified"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== MOBILE: Bottom Search Bar ===== */}
        <div className="lg:hidden sticky bottom-0 left-0 right-0 z-40 bg-white border-t-4 border-yellow-500 shadow-[0_-10px_30px_rgba(0,0,0,0.15)]">
          <div className="px-4 py-3">
            {/* Tabs */}
            <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
              {[
                { id: "buy", label: "Buy", icon: Home },
                { id: "rent", label: "Rent", icon: Briefcase },
                { id: "projects", label: "Projects", icon: Building2 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <tab.icon className="w-3 h-3" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-100 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white transition-all"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="w-12 h-12 bg-yellow-500 hover:bg-yellow-600 text-slate-900 rounded-xl shrink-0 p-0 shadow-lg"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* ===== DESKTOP: Mega Search Bar (Overlapping) ===== */}
        <div className="hidden lg:block relative z-30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto -mb-16">
              <div className="bg-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] p-6">
                {/* Tabs */}
                <div className="flex gap-6 border-b border-gray-100 pb-4 mb-5">
                  {[
                    { id: "buy", label: "Buy Property", icon: Home },
                    { id: "rent", label: "Rent Property", icon: Briefcase },
                    { id: "projects", label: "New Projects", icon: Building2 },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wide pb-2 border-b-2 transition-all ${
                        activeTab === tab.id
                          ? "text-slate-900 border-yellow-500"
                          : "text-gray-400 border-transparent hover:text-slate-600"
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Location */}
                  <div className="col-span-4 border-r border-gray-200 pr-4">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Location
                    </label>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
                      <input
                        type="text"
                        placeholder="City, Neighborhood"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full font-semibold text-slate-800 placeholder-slate-400 outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Type */}
                  <div className="col-span-3 border-r border-gray-200 px-4">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Property Type
                    </label>
                    <div className="flex items-center">
                      <Building2 className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
                      <select
                        className="w-full font-semibold text-slate-800 bg-transparent outline-none cursor-pointer appearance-none"
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                      >
                        <option>All Types</option>
                        <option>House</option>
                        <option>Apartment</option>
                        <option>Commercial</option>
                        <option>Plot</option>
                      </select>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-3 px-4">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Price Range
                    </label>
                    <div className="flex items-center">
                      <span className="text-slate-400 font-bold mr-2">PKR</span>
                      <select
                        className="w-full font-semibold text-slate-800 bg-transparent outline-none cursor-pointer appearance-none"
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                      >
                        <option>Any Price</option>
                        <option>Up to 1 Crore</option>
                        <option>1 - 5 Crore</option>
                        <option>5 - 10 Crore</option>
                        <option>10 Crore+</option>
                      </select>
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="col-span-2">
                    <Button
                      onClick={handleSearch}
                      className="w-full h-14 bg-yellow-500 hover:bg-yellow-600 text-slate-900 text-lg font-bold rounded-xl shadow-lg transition-all hover:shadow-xl active:scale-95"
                    >
                      Search
                    </Button>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-400">
                    Popular:
                  </span>
                  {["DHA Lahore", "Bahria Town", "E-11 Islamabad", "Clifton"].map(
                    (loc) => (
                      <button
                        key={loc}
                        className="text-xs font-medium text-slate-600 hover:text-yellow-600 flex items-center gap-1 transition-colors"
                        onClick={() => setLocation(loc)}
                      >
                        {loc} <ChevronRight className="w-3 h-3" />
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== DESKTOP SPACER ===== */}
      <div className="hidden lg:block h-20 bg-white"></div>
    </div>
  );
};

export default RealEstateHero;