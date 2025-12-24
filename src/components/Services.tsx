import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { API_BASE } from "@/lib/config";
import {
  Home,
  Building2,
  Key,
  Hammer,
  PaintBucket,
  ClipboardCheck,
  Wallet,
  Shield,
  Users,
  ArrowRight,
  TrendingUp,
  FileText,
  Phone,
  Check,
  ChevronLeft,
  ChevronRight,
  Play,
  Star,
  Award,
  Clock,
  BadgeCheck,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";


// ===== ICON MAP FOR BACKEND STRINGS =====
const ICON_MAP: Record<string, React.ElementType> = {
  Home,
  Key,
  Building2,
  Hammer,
  PaintBucket,
  ClipboardCheck,
  Wallet,
  Shield,
  Users,
  FileText,
};

// ===== TYPE DEFINITIONS =====
interface ServiceFeature {
  text: string;
}

interface MainService {
  slug: string;
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  image: string;
  commission: string;
  color: string;
}

interface BeforeAfterProject {
  title: string;
  location: string;
  type: string;
  beforeImage: string;
  afterImage: string;
  duration: string;
  budget: string;
}

interface TransformationsHeader {
  badgeText: string;
  title: string;
  subtitle: string;
}

interface AdditionalService {
  slug: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

interface Stat {
  number: string;
  label: string;
  icon: React.ElementType;
}

// ===== DEFAULT / FALLBACK DATA =====
const DEFAULT_MAIN_SERVICES: MainService[] = [
  {
    slug: "property-sales",
    icon: Home,
    title: "Property Sales",
    description:
      "Buy your dream home with confidence. We offer verified residential properties, premium houses, and luxury estates across Pakistan's top locations.",
    features: [
      "Verified Listings",
      "Legal Documentation",
      "Best Market Prices",
      "Expert Negotiation",
    ],
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    commission: "Only 1% Commission",
    color: "from-blue-500 to-blue-600",
  },
  {
    slug: "property-rentals",
    icon: Key,
    title: "Property Rentals",
    description:
      "Find the perfect rental property for your needs. From apartments to commercial spaces, we connect you with quality rental options.",
    features: [
      "Tenant Screening",
      "Lease Management",
      "Property Inspection",
      "Rental Collection",
    ],
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    commission: "One Month Rent",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    slug: "property-management",
    icon: Building2,
    title: "Property Management",
    description:
      "Hassle-free property management services. We handle everything from maintenance to tenant relations, ensuring your investment is protected.",
    features: [
      "Maintenance Services",
      "Rent Collection",
      "Tenant Management",
      "Regular Inspections",
    ],
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    commission: "Custom Plans",
    color: "from-purple-500 to-purple-600",
  },
  {
    slug: "house-construction",
    icon: Hammer,
    title: "House Construction",
    description:
      "Build your dream home from the ground up. Our experienced team delivers quality construction with transparency and on-time completion.",
    features: [
      "Custom Designs",
      "Quality Materials",
      "Timely Completion",
      "Warranty Included",
    ],
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    commission: "Transparent Pricing",
    color: "from-orange-500 to-orange-600",
  },
  {
    slug: "renovation-remodeling",
    icon: PaintBucket,
    title: "Renovation & Remodeling",
    description:
      "Transform your existing space into your dream home. From kitchen upgrades to complete home makeovers, we deliver stunning results.",
    features: [
      "Modern Designs",
      "Quality Workmanship",
      "Budget Planning",
      "Project Management",
    ],
    image:
      "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    commission: "Competitive Rates",
    color: "from-pink-500 to-pink-600",
  },
  {
    slug: "property-valuation",
    icon: ClipboardCheck,
    title: "Property Valuation",
    description:
      "Get accurate property valuations from certified experts. Make informed decisions with professional assessment and market analysis.",
    features: [
      "Market Analysis",
      "Certified Reports",
      "Investment Advice",
      "Quick Turnaround",
    ],
    image:
      "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    commission: "Free Consultation",
    color: "from-teal-500 to-teal-600",
  },
];

const DEFAULT_BEFORE_AFTER_PROJECTS: BeforeAfterProject[] = [
  {
    title: "Modern Villa Renovation",
    location: "DHA Phase 6, Lahore",
    type: "Complete Renovation",
    beforeImage:
      "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    duration: "4 Months",
    budget: "PKR 45 Lacs",
  },
  {
    title: "Luxury Kitchen Remodel",
    location: "Bahria Town, Islamabad",
    type: "Kitchen Renovation",
    beforeImage:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    duration: "6 Weeks",
    budget: "PKR 12 Lacs",
  },
  {
    title: "Contemporary House Build",
    location: "Gulberg, Lahore",
    type: "New Construction",
    beforeImage:
      "https://images.unsplash.com/photo-1590496793907-4b0e49efd45b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    duration: "10 Months",
    budget: "PKR 1.2 Crore",
  },
  {
    title: "Office Space Transformation",
    location: "Clifton, Karachi",
    type: "Commercial Renovation",
    beforeImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    duration: "3 Months",
    budget: "PKR 28 Lacs",
  },
];

const DEFAULT_TRANSFORM_HEADER: TransformationsHeader = {
  badgeText: "Our Work",
  title: "Transformation Stories",
  subtitle:
    "Drag the slider to see the magic. Quality craftsmanship meets innovative design.",
};

const DEFAULT_ADDITIONAL_SERVICES: AdditionalService[] = [
  {
    slug: "mortgage-assistance",
    icon: Wallet,
    title: "Mortgage Assistance",
    description: "Help securing the best home loan rates from leading banks",
  },
  {
    slug: "legal-services",
    icon: Shield,
    title: "Legal Services",
    description: "Complete legal documentation and verification support",
  },
  {
    slug: "free-consultation",
    icon: Users,
    title: "Free Consultation",
    description: "Expert advice and personalized property guidance",
  },
  {
    slug: "investment-planning",
    icon: FileText,
    title: "Investment Planning",
    description: "Strategic investment opportunities with high ROI",
  },
];

const stats: Stat[] = [
  { number: "500+", label: "Projects Completed", icon: Award },
  { number: "98%", label: "Client Satisfaction", icon: Star },
  { number: "10+", label: "Years Experience", icon: Clock },
  { number: "50+", label: "Expert Team", icon: Users },
];

const Services = () => {
  const navigate = useNavigate();

  const [activeBeforeAfter, setActiveBeforeAfter] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Dynamic services state
  const [mainServices, setMainServices] =
    useState<MainService[]>(DEFAULT_MAIN_SERVICES);
  const [additionalServices, setAdditionalServices] =
    useState<AdditionalService[]>(DEFAULT_ADDITIONAL_SERVICES);

  const [servicesLoading, setServicesLoading] = useState<boolean>(true);
  const [servicesError, setServicesError] = useState<string | null>(null);

  // NEW: Transformation section state
  const [transformEnabled, setTransformEnabled] = useState<boolean>(true);
  const [transformHeader, setTransformHeader] =
    useState<TransformationsHeader>(DEFAULT_TRANSFORM_HEADER);
  const [projects, setProjects] = useState<BeforeAfterProject[]>(
    DEFAULT_BEFORE_AFTER_PROJECTS
  );

  // Navigation to detail page
  const openServiceDetail = (slug?: string) => {
    if (!slug) return;
    navigate(`/services/${slug}`);
  };

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setServicesLoading(true);
        setServicesError(null);

        const res = await fetch(`${API_BASE}/services`);
        const data = await res.json();

        // Map main services
        if (Array.isArray(data.main) && data.main.length > 0) {
          const mappedMain: MainService[] = data.main.map((s ) => ({
            slug: s.slug,
            icon: ICON_MAP[s.icon] || Home,
            title: s.title,
            description: s.shortDescription,
            features: s.features || [],
            image: s.image,
            commission: s.commission,
            color: s.color || "from-green-500 to-green-600",
          }));
          setMainServices(mappedMain);
        }

        // Map additional services
        if (Array.isArray(data.additional) && data.additional.length > 0) {
          const mappedAdditional: AdditionalService[] = data.additional.map(
            (s ) => ({
              slug: s.slug,
              icon: ICON_MAP[s.icon] || Users,
              title: s.title,
              description: s.shortDescription,
            })
          );
          setAdditionalServices(mappedAdditional);
        }
      } catch (err) {
        console.error("Failed to load services:", err);
        setServicesError("Failed to load services");
        // Keep defaults
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Fetch services settings (transformations)
  useEffect(() => {
    const fetchServicesSettings = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/services-settings`
        );
        if (!res.ok) throw new Error("Failed to load services settings");
        const data = await res.json();

        const t = data.transformations || {};

        if (typeof t.enabled === "boolean") {
          setTransformEnabled(t.enabled);
        }

        if (t.header) {
          setTransformHeader({
            badgeText:
              t.header.badgeText || DEFAULT_TRANSFORM_HEADER.badgeText,
            title: t.header.title || DEFAULT_TRANSFORM_HEADER.title,
            subtitle:
              t.header.subtitle || DEFAULT_TRANSFORM_HEADER.subtitle,
          });
        }

        if (Array.isArray(t.projects) && t.projects.length > 0) {
          setProjects(t.projects);
          setActiveBeforeAfter(0);
          setSliderPosition(50);
        }
      } catch (err) {
        console.error("Failed to load services settings:", err);
        // keep defaults
      }
    };

    fetchServicesSettings();
  }, []);

  // Slider drag handlers
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const nextProject = () => {
    if (!projects.length) return;
    setActiveBeforeAfter((prev) => (prev + 1) % projects.length);
    setSliderPosition(50);
  };

  const prevProject = () => {
    if (!projects.length) return;
    setActiveBeforeAfter(
      (prev) => (prev - 1 + projects.length) % projects.length
    );
    setSliderPosition(50);
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* ===== HEADER ===== */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-green-100 px-5 py-2 rounded-full mb-6">
            <BadgeCheck className="w-4 h-4 text-green-600" />
            <span className="text-sm font-bold text-green-800 uppercase tracking-wider">
              What We Offer
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900">
            Comprehensive{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Real Estate
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
              >
                <path
                  d="M2 10C50 4 150 4 198 10"
                  stroke="url(#paint0_linear)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1="2"
                    y1="10"
                    x2="198"
                    y2="10"
                  >
                    <stop stopColor="#16a34a" />
                    <stop offset="1" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
            </span>{" "}
            Solutions
          </h2>

          <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            From buying and selling to construction and renovation — your trusted
            partner for all property needs with transparent pricing and expert
            guidance.
          </p>
        </div>

        {/* ===== STATS BAR ===== */}
        <div
          className={`grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16 transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 text-center group hover:shadow-xl hover:border-green-200 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-green-600 group-hover:scale-110 transition-all duration-300">
                <stat.icon className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-1">
                {stat.number}
              </h3>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ===== MAIN SERVICES GRID ===== */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {mainServices.map((service, index) => (
            <Card
              key={index}
              onClick={() => openServiceDetail(service.slug)}
              className={`group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 overflow-hidden bg-white rounded-2xl cursor-pointer ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Service Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Commission Badge */}
                <div
                  className={`absolute top-4 right-4 bg-gradient-to-r ${service.color} text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg`}
                >
                  {service.commission}
                </div>

                {/* Icon Overlay */}
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <div className="w-14 h-14 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="h-7 w-7 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{service.title}</h3>
                </div>
              </div>

              <CardContent className="p-6">
                <p className="text-slate-600 mb-5 leading-relaxed text-sm">
                  {service.description}
                </p>

                <ul className="space-y-2.5 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-sm text-slate-700"
                    >
                      <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant="outline"
                  className="w-full h-12 rounded-xl border-2 border-slate-200 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-300 font-semibold group/btn"
                  onClick={(e) => {
                    e.stopPropagation(); // don’t navigate, only contact
                    scrollToContact();
                  }}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ===== BEFORE & AFTER SECTION ===== */}
        {transformEnabled && projects.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full mb-4">
                <Play className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-bold text-orange-800 uppercase tracking-wider">
                  {transformHeader.badgeText}
                </span>
              </div>
              <h3 className="text-3xl lg:text-5xl font-bold mb-4 text-slate-900">
                {transformHeader.title.split(" ").length > 1 ? (
                  <>
                    {transformHeader.title.split(" ").slice(0, -1).join(" ")}{" "}
                    <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                      {transformHeader.title.split(" ").slice(-1)[0]}
                    </span>
                  </>
                ) : (
                  <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                    {transformHeader.title}
                  </span>
                )}
              </h3>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                {transformHeader.subtitle}
              </p>
            </div>

            {/* Interactive Before/After Slider */}
            <div className="max-w-5xl mx-auto">
              <div
                ref={sliderRef}
                className="relative h-[400px] lg:h-[550px] rounded-3xl overflow-hidden shadow-2xl cursor-ew-resize select-none"
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchMove={handleTouchMove}
              >
                {/* After Image (Background) */}
                <img
                  src={projects[activeBeforeAfter].afterImage}
                  alt="After"
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />

                {/* Before Image (Clipped) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img
                    src={projects[activeBeforeAfter].beforeImage}
                    alt="Before"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      width:
                        sliderPosition > 0
                          ? `${(100 / sliderPosition) * 100}%`
                          : "100%",
                      maxWidth: "none",
                    }}
                    draggable={false}
                  />
                </div>

                {/* Slider Handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-20"
                  style={{
                    left: `${sliderPosition}%`,
                    transform: "translateX(-50%)",
                  }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
                    <div className="flex items-center gap-1">
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </div>
                  </div>
                </div>

                {/* Labels */}
                <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg z-10">
                  BEFORE
                </div>
                <div className="absolute top-6 right-6 bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg z-10">
                  AFTER
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevProject}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all z-30"
                  aria-label="Previous project"
                >
                  <ChevronLeft className="w-6 h-6 text-slate-700" />
                </button>
                <button
                  onClick={nextProject}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all z-30"
                  aria-label="Next project"
                >
                  <ChevronRight className="w-6 h-6 text-slate-700" />
                </button>
              </div>

              {/* Project Details Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mt-6 border border-slate-100">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h4 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                      {projects[activeBeforeAfter].title}
                    </h4>
                    <p className="text-slate-600 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-green-600" />
                      {projects[activeBeforeAfter].location}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-slate-100 px-4 py-2 rounded-lg text-center">
                      <Clock className="w-4 h-4 text-slate-500 mx-auto mb-1" />
                      <p className="text-xs text-slate-500">Duration</p>
                      <p className="text-sm font-bold text-slate-900">
                        {projects[activeBeforeAfter].duration}
                      </p>
                    </div>
                    <div className="bg-green-50 px-4 py-2 rounded-lg text-center">
                      <Wallet className="w-4 h-4 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-slate-500">Investment</p>
                      <p className="text-sm font-bold text-green-700">
                        {projects[activeBeforeAfter].budget}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Project Thumbnails */}
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {projects.map((project, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveBeforeAfter(index);
                        setSliderPosition(50);
                      }}
                      className={`flex-shrink-0 relative rounded-xl overflow-hidden transition-all duration-300 ${
                        activeBeforeAfter === index
                          ? "ring-4 ring-green-500 shadow-lg scale-105"
                          : "opacity-60 hover:opacity-100 hover:scale-105"
                      }`}
                    >
                      <img
                        src={project.afterImage}
                        alt={project.title}
                        className="w-20 h-20 lg:w-24 lg:h-24 object-cover"
                      />
                      {activeBeforeAfter === index && (
                        <div className="absolute inset-0 bg-green-600/20 flex items-center justify-center">
                          <Check className="w-6 h-6 text-white drop-shadow-lg" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== ADDITIONAL SERVICES ===== */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="text-2xl lg:text-4xl font-bold text-slate-900">
              Additional <span className="text-green-600">Services</span>
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {additionalServices.map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-green-500 group cursor-pointer"
                onClick={() => openServiceDetail(service.slug)}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-5 group-hover:from-green-500 group-hover:to-emerald-500 group-hover:scale-110 transition-all duration-300">
                  <service.icon className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <h4 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-green-600 transition-colors">
                  {service.title}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-4 flex items-center text-green-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== CTA SECTION ===== */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 lg:p-16 text-center text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-green-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>

            <h3 className="text-3xl lg:text-5xl font-bold mb-4">
              Ready to Start Your{" "}
              <span className="text-green-400">Project?</span>
            </h3>

            <p className="text-lg lg:text-xl mb-8 max-w-2xl mx-auto text-slate-300">
              Get a free consultation and quote for your property needs. Our
              experts are ready to bring your vision to life.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={scrollToContact}
                className="h-14 px-8 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-lg font-bold rounded-xl shadow-2xl hover:shadow-green-500/25 transition-all transform hover:scale-105"
              >
                Get Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 border-2 border-white/30 text-white bg-white/5 backdrop-blur-sm hover:bg-white hover:text-slate-900 text-lg font-bold rounded-xl transition-all"
                onClick={() => window.open("tel:03214710692")}
              >
                <Phone className="mr-2 h-5 w-5" />
                0321-4710692
              </Button>

              <Button
                size="lg"
                className="h-14 px-8 bg-green-600 hover:bg-green-700 text-white text-lg font-bold rounded-xl shadow-xl transition-all sm:hidden"
                onClick={() => window.open("https://wa.me/923214710692")}
              >
                <FaWhatsapp className="mr-2 h-5 w-5" />
                WhatsApp
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-green-500" />
                <span>Verified Experts</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-green-500" />
                <span>5-Star Rated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;