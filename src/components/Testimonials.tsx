"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Star,
  Quote,
  MapPin,
  Building2,
  ChevronLeft,
  ChevronRight,
  Play,
  Award,
  ThumbsUp,
  MessageSquare,
  ExternalLink,
  BadgeCheck,
  Users,
} from "lucide-react";
import { useCounter } from "@/hooks/useCounter";
import { FaGoogle, FaWhatsapp } from "react-icons/fa";

// ===== TYPE DEFINITIONS =====
interface Testimonial {
  id: string | number;
  name: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  results: string;
  propertyType: string;
  image?: string;
  isVideo?: boolean;
  videoUrl?: string;
  featured?: boolean;
}

interface Stat {
  value: number;
  suffix: string;
  label: string;
  icon: React.ElementType;
}

// ===== DEFAULT TESTIMONIALS =====
const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Ahmed Khan",
    role: "Property Buyer",
    location: "DHA Phase 6, Lahore",
    avatar: "AK",
    rating: 5,
    text: "Wasi Estate made my dream home a reality! They helped me find the perfect 1 kanal house in DHA and handled everything from documentation to handover. Only 1% commission and zero hidden charges. Highly recommended!",
    results: "Dream Home Found",
    propertyType: "Residential Purchase",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    featured: true,
  },
  {
    id: 2,
    name: "Fatima Malik",
    role: "Property Seller",
    location: "Bahria Town, Islamabad",
    avatar: "FM",
    rating: 5,
    text: "Sold my property in just 3 weeks! The team was professional, transparent, and got me the best price. Their marketing strategy brought serious buyers quickly. Worth every penny of the 1% commission.",
    results: "Sold in 3 Weeks",
    propertyType: "Quick Sale",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    featured: true,
  },
  {
    id: 3,
    name: "Imran Siddiqui",
    role: "Construction Client",
    location: "Gulberg, Lahore",
    avatar: "IS",
    rating: 5,
    text: "Built my 10 marla house with Wasi Builders and couldn't be happier! Quality construction, transparent pricing, and completed on time. They handled everything from design to finishing. Excellent work!",
    results: "Perfect Home Built",
    propertyType: "House Construction",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    isVideo: true,
    videoUrl: "#",
    featured: true,
  },
  {
    id: 4,
    name: "Sarah Aziz",
    role: "Renovation Client",
    location: "Model Town, Lahore",
    avatar: "SA",
    rating: 5,
    text: "Amazing renovation work! They transformed my 30-year-old house into a modern masterpiece. Professional team, quality materials, and completed within the promised timeline. The value of my property increased significantly!",
    results: "Modern Transformation",
    propertyType: "Complete Renovation",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    featured: false,
  },
  {
    id: 5,
    name: "Ali Raza",
    role: "Commercial Buyer",
    location: "Main Boulevard, Gulberg",
    avatar: "AR",
    rating: 5,
    text: "Purchased a commercial plaza through Wasi Estate. Their market knowledge and negotiation skills saved me lakhs! Complete legal verification and smooth transaction. Best real estate consultants in Lahore.",
    results: "Best Deal Secured",
    propertyType: "Commercial Purchase",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    featured: false,
  },
  {
    id: 6,
    name: "Zainab Hassan",
    role: "Tenant",
    location: "E-11, Islamabad",
    avatar: "ZH",
    rating: 5,
    text: "Found my perfect apartment rental through Wasi Estate. They handled all the paperwork, verified the landlord, and ensured a smooth move-in. One month rent commission was totally worth the hassle-free experience!",
    results: "Perfect Rental Found",
    propertyType: "Apartment Rental",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    featured: false,
  },
];

const stats: Stat[] = [
  { value: 350, suffix: "+", label: "Happy Clients", icon: Users },
  { value: 500, suffix: "+", label: "Properties Sold", icon: Building2 },
  { value: 98, suffix: "%", label: "Satisfaction Rate", icon: ThumbsUp },
  { value: 10, suffix: "+", label: "Years Experience", icon: Award },
];

// ===== STAT CARD COMPONENT (hook called inside component) =====
const StatCard = ({ stat, isVisible }: { stat: Stat; isVisible: boolean }) => {
  const count = useCounter(stat.value, isVisible, 2000);

  return (
    <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-slate-100 text-center group hover:shadow-xl hover:border-green-200 hover:-translate-y-1 transition-all duration-300">
      <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-green-500 group-hover:to-emerald-500 group-hover:scale-110 transition-all duration-300">
        <stat.icon className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" />
      </div>
      <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-1">
        {count}
        {stat.suffix}
      </h3>
      <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
    </div>
  );
};

// ===== STAR RATING COMPONENT =====
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ))}
  </div>
);

// ===== MAIN TESTIMONIALS COMPONENT =====
const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Testimonials state
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(DEFAULT_TESTIMONIALS);

  // Add-review form state
  const [newReview, setNewReview] = useState({
    name: "",
    role: "",
    location: "",
    rating: 5,
    propertyType: "",
    text: "",
    image: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Featured vs all
  const featured = testimonials.filter((t) => t.featured);
  const featuredList = featured.length > 0 ? featured : testimonials;
  const featuredCount = featuredList.length;

  const activeTestimonial =
    featuredCount > 0 ? featuredList[activeIndex % featuredCount] : undefined;

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

  // Fetch testimonials from backend
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/testimonials");
        const data = await res.json();
        if (Array.isArray(data.items)) {
          setTestimonials(data.items);
        }
      } catch (err) {
        console.error("Failed to load testimonials:", err);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || featuredCount === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredCount);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredCount]);

  const nextTestimonial = () => {
    if (featuredCount === 0) return;
    setActiveIndex((prev) => (prev + 1) % featuredCount);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    if (featuredCount === 0) return;
    setActiveIndex((prev) => (prev - 1 + featuredCount) % featuredCount);
    setIsAutoPlaying(false);
  };

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!newReview.name || !newReview.text) {
      setSubmitError("Please enter your name and review.");
      return;
    }

    try {
      setSubmittingReview(true);

      const res = await fetch("http://localhost:5000/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newReview.name,
          role: newReview.role || undefined,
          location: newReview.location || undefined,
          rating: newReview.rating || 5,
          text: newReview.text,
          propertyType: newReview.propertyType || undefined,
          image: newReview.image || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit review");
      }

      await res.json(); // we don't append pending review to the public list

      setNewReview({
        name: "",
        role: "",
        location: "",
        rating: 5,
        propertyType: "",
        text: "",
        image: "",
      });

      setSubmitSuccess("Thank you for your review!");
      setShowReviewForm(false);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setSubmitError(errorMessage);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="py-16 lg:py-24 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden"
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* HEADER */}
        <div
          className={`text-center mb-12 lg:mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-amber-100 px-5 py-2 rounded-full mb-6 border border-yellow-200">
            <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
            <span className="text-sm font-bold text-yellow-800 uppercase tracking-wider">
              Client Stories
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900">
            Trusted by{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                350+ Families
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
              >
                <path
                  d="M2 10C50 4 150 4 198 10"
                  stroke="url(#underline)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="underline" x1="2" y1="10" x2="198" y2="10">
                    <stop stopColor="#16a34a" />
                    <stop offset="1" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h2>

          <p className="text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Real stories from real clients across Pakistan. See how we&apos;ve
            helped them achieve their property dreams with transparency and
            expertise.
          </p>
        </div>

        {/* STATS - Using StatCard component */}
        <div
          className={`grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16 transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} isVisible={isVisible} />
          ))}
        </div>

        {/* FEATURED TESTIMONIAL */}
        <div
          className={`mb-16 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div
            className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left */}
                <div className="text-white">
                  <Quote className="w-12 h-12 text-green-400 mb-6 opacity-50" />
                  <p className="text-xl lg:text-2xl font-medium leading-relaxed mb-8">
                    {activeTestimonial && `"${activeTestimonial.text}"`}
                  </p>

                  <div className="inline-flex items-center gap-3 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-full px-5 py-2 mb-8">
                    <BadgeCheck className="w-5 h-5 text-green-400" />
                    <span className="text-green-300 font-semibold">
                      {activeTestimonial?.results}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-400 text-sm">
                      {activeTestimonial?.propertyType}
                    </span>
                  </div>

                  {activeTestimonial && (
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14 ring-4 ring-green-500/30">
                        <AvatarImage
                          src={activeTestimonial.image}
                          alt={activeTestimonial.name}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-500 text-white font-bold text-lg">
                          {activeTestimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-lg font-bold text-white">
                          {activeTestimonial.name}
                        </h4>
                        <p className="text-slate-400 text-sm">
                          {activeTestimonial.role}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-slate-400 text-xs">
                          <MapPin className="w-3 h-3 text-green-400" />
                          {activeTestimonial.location}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StarRating rating={activeTestimonial?.rating || 5} />
                      <span className="text-white font-bold ml-2">
                        {activeTestimonial?.rating?.toFixed(1) ?? "5.0"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={prevTestimonial}
                        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                        aria-label="Previous testimonial"
                      >
                        <ChevronLeft className="w-5 h-5 text-white" />
                      </button>
                      <button
                        onClick={nextTestimonial}
                        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                        aria-label="Next testimonial"
                      >
                        <ChevronRight className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {featuredList.slice(0, 6).map((testimonial, index) => (
                      <button
                        key={testimonial.id}
                        onClick={() => {
                          setActiveIndex(index);
                          setIsAutoPlaying(false);
                        }}
                        className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
                          activeTestimonial?.id === testimonial.id
                            ? "ring-4 ring-green-500 scale-105 shadow-lg"
                            : "opacity-50 hover:opacity-80 hover:scale-105"
                        }`}
                      >
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full aspect-square object-cover"
                        />
                        {testimonial.isVideo && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Play className="w-6 h-6 text-white fill-white" />
                          </div>
                        )}
                        {activeTestimonial?.id === testimonial.id && (
                          <div className="absolute inset-0 bg-green-500/20" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {featuredList.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setActiveIndex(index);
                          setIsAutoPlaying(false);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          index === activeIndex % (featuredCount || 1)
                            ? "w-8 bg-green-500"
                            : "w-4 bg-white/30 hover:bg-white/50"
                        }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GRID OF ALL TESTIMONIALS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className={`group hover:-translate-y-2 transition-all duration-500 border-0 bg-white shadow-lg hover:shadow-2xl rounded-2xl overflow-hidden ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
              onMouseEnter={() => setHoveredCard(Number(testimonial.id))}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardContent className="p-6 lg:p-7 relative">
                <div className="absolute top-6 right-6">
                  <Quote
                    className={`h-10 w-10 transition-all duration-300 ${
                      hoveredCard === testimonial.id
                        ? "text-green-500 scale-110"
                        : "text-green-100"
                    }`}
                  />
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={testimonial.rating} />
                  <span className="text-sm font-bold text-slate-700">
                    {testimonial.rating}.0
                  </span>
                </div>

                <p className="text-slate-600 mb-5 leading-relaxed text-sm lg:text-base line-clamp-4 group-hover:line-clamp-none transition-all">
                  &quot;{testimonial.text}&quot;
                </p>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="w-5 h-5 text-green-600" />
                      <span className="text-green-800 font-bold text-sm">
                        {testimonial.results}
                      </span>
                    </div>
                    <span className="text-xs text-green-700 bg-white px-3 py-1 rounded-full font-medium border border-green-200">
                      {testimonial.propertyType}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <Avatar className="h-12 w-12 ring-2 ring-green-100 group-hover:ring-green-500 transition-all">
                    <AvatarImage
                      src={testimonial.image}
                      alt={testimonial.name}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-500 text-white font-bold">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {testimonial.role}
                    </div>
                  </div>
                  {testimonial.isVideo && (
                    <button className="w-10 h-10 bg-green-100 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors group/play">
                      <Play className="w-4 h-4 text-green-600 group-hover/play:text-white fill-current" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 mt-3 text-xs text-slate-500">
                  <MapPin className="w-3 h-3 text-green-500" />
                  {testimonial.location}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ADD YOUR REVIEW – COLLAPSIBLE */}
        <div
          className={`mb-16 transition-all duration-1000 delay-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {!showReviewForm ? (
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  setShowReviewForm(true);
                  setSubmitError(null);
                  setSubmitSuccess(null);
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg"
              >
                Add Review
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 lg:p-8 max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">
                  Share Your Experience
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewForm(false);
                    setSubmitError(null);
                    setSubmitSuccess(null);
                  }}
                  className="text-sm text-slate-500 hover:text-slate-700"
                >
                  Close
                </button>
              </div>
              <p className="text-slate-600 text-sm lg:text-base mb-6">
                Have you worked with Wasi Estate &amp; Builders? Leave a review
                and help others make confident property decisions.
              </p>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={newReview.name}
                      onChange={(e) =>
                        setNewReview((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Role (optional)
                    </label>
                    <input
                      type="text"
                      value={newReview.role}
                      onChange={(e) =>
                        setNewReview((prev) => ({
                          ...prev,
                          role: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g. Buyer, Seller"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Location (optional)
                    </label>
                    <input
                      type="text"
                      value={newReview.location}
                      onChange={(e) =>
                        setNewReview((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g. DHA Phase 6, Lahore"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Property Type (optional)
                    </label>
                    <input
                      type="text"
                      value={newReview.propertyType}
                      onChange={(e) =>
                        setNewReview((prev) => ({
                          ...prev,
                          propertyType: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g. House Purchase, Rental"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Rating (optional)
                    </label>
                    <select
                      value={newReview.rating}
                      onChange={(e) =>
                        setNewReview((prev) => ({
                          ...prev,
                          rating: Number(e.target.value),
                        }))
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>
                          {r} Stars
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Image URL (optional)
                    </label>
                    <input
                      type="url"
                      value={newReview.image}
                      onChange={(e) =>
                        setNewReview((prev) => ({
                          ...prev,
                          image: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Link to your photo (optional)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Your Review *
                  </label>
                  <textarea
                    value={newReview.text}
                    onChange={(e) =>
                      setNewReview((prev) => ({
                        ...prev,
                        text: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[100px]"
                    placeholder="Share your experience with Wasi Estate & Builders..."
                    required
                  />
                </div>

                {submitError && (
                  <p className="text-sm text-red-600">{submitError}</p>
                )}
                {submitSuccess && (
                  <p className="text-sm text-green-600">{submitSuccess}</p>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowReviewForm(false);
                      setSubmitError(null);
                      setSubmitSuccess(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* GOOGLE REVIEWS CTA */}
        <div
          className={`transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="grid lg:grid-cols-2">
              {/* Left: Google Rating */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-slate-100">
                    <FaGoogle className="w-8 h-8 text-[#4285f4]" />
                  </div>
                  <div>
                    <div className="text-3xl lg:text-4xl font-bold text-slate-900">
                      4.9/5
                    </div>
                    <div className="text-slate-500 text-sm">
                      Based on 200+ reviews
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-8 w-8 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-slate-600 mb-6 leading-relaxed">
                  We&apos;re proud to maintain a 5-star rating on Google. Your
                  satisfaction is our top priority, and these reviews reflect
                  our commitment to excellence.
                </p>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://g.page/r/YOUR_GOOGLE_REVIEW_LINK"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <Star className="w-5 h-5" />
                    Write a Review
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.google.com/maps/place/YOUR_BUSINESS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                  >
                    View All Reviews
                  </a>
                </div>
              </div>

              {/* Right: CTA */}
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-8 lg:p-12 text-white flex flex-col justify-center">
                <MessageSquare className="w-12 h-12 mb-4 opacity-80" />
                <h3 className="text-2xl lg:text-3xl font-bold mb-3">
                  Ready to Join Our Happy Clients?
                </h3>
                <p className="text-green-100 mb-6 leading-relaxed">
                  Let us help you find your dream property or sell your existing
                  one with our proven track record and transparent approach.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={scrollToContact}
                    className="bg-white text-green-700 hover:bg-slate-100 font-bold shadow-lg"
                  >
                    Get Free Consultation
                  </Button>
                  <a
                    href="https://wa.me/923214710692"
                    className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TRUST LOCATIONS */}
        <div className="mt-12 lg:mt-16 text-center">
          <p className="text-slate-500 mb-6 font-medium text-sm uppercase tracking-wider">
            Serving Premium Locations Across Pakistan
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3 lg:gap-4">
            {[
              "DHA Lahore",
              "Bahria Town",
              "Gulberg",
              "E-11 Islamabad",
              "Model Town",
              "Clifton Karachi",
              "F-10 Islamabad",
              "Johar Town",
            ].map((location, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 hover:border-green-500 hover:shadow-md hover:bg-green-50 transition-all cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-slate-700">
                  {location}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;