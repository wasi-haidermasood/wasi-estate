"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { API_BASE } from "@/lib/config";
import { TimelineContent } from "@/components/ui/timeline-animation"; 
import { useCounter } from "@/hooks/useCounter";
import { FaGoogle, FaWhatsapp } from "react-icons/fa";
import {
  Users,
  Building2,
  ThumbsUp,
  Award,
  Loader2,
  Plus,
  X,
  MapPin,
  Star
} from "lucide-react";

// ===== TYPE DEFINITIONS =====
interface Testimonial {
  id: string | number;
  name: string;
  role: string;
  location: string;
  rating: number;
  text: string;
  image?: string;
}

interface Stat {
  value: number;
  suffix: string;
  label: string;
  icon: React.ElementType;
}

// ===== DATA =====
const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 1, name: "Ahmed Khan", role: "Property Buyer", location: "DHA Lahore", rating: 5,
    text: "Wasi Estate made my dream home a reality! They helped me find the perfect 1 kanal house in DHA and handled everything from documentation to handover.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 2, name: "Fatima Malik", role: "Seller", location: "Bahria Town", rating: 5,
    text: "Sold my property in just 3 weeks! The team was professional, transparent, and got me the best price.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 3, name: "Imran Siddiqui", role: "Construction", location: "Gulberg", rating: 5,
    text: "Built my 10 marla house with Wasi Builders. Quality construction, transparent pricing, and completed on time.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 4, name: "Sarah Aziz", role: "Renovation", location: "Model Town", rating: 5,
    text: "Amazing renovation work! They transformed my 30-year-old house into a modern masterpiece.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 5, name: "Ali Raza", role: "Commercial", location: "Gulberg", rating: 5,
    text: "Purchased a commercial plaza through Wasi Estate. Their market knowledge saved me lakhs!",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 6, name: "Zainab Hassan", role: "Tenant", location: "Islamabad", rating: 5,
    text: "Found my perfect apartment rental. They handled all the paperwork and ensured a smooth move-in.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=687&q=80",
  },
  {
    id: 7, name: "Usman Ghani", role: "Investor", location: "DHA Phase 8", rating: 5,
    text: "Their investment advice is gold. I have seen 30% appreciation in my portfolio in just one year.",
    image: "https://images.unsplash.com/photo-1563237023-b1e970526dcb?auto=format&fit=crop&w=687&q=80",
  },
];

const statsData: Stat[] = [
  { value: 350, suffix: "+", label: "Happy Clients", icon: Users },
  { value: 500, suffix: "+", label: "Properties Sold", icon: Building2 },
  { value: 98, suffix: "%", label: "Satisfaction", icon: ThumbsUp },
  { value: 20, suffix: "+", label: "Years Experience", icon: Award },
];

const LOCATIONS = ["DHA Lahore", "Bahria Town", "Gulberg", "Model Town", "Johar Town", "Islamabad", "Karachi"];

// ===== STAT COMPONENT =====
const StatItem = ({ stat }: { stat: Stat }) => {
  const count = useCounter(stat.value, true, 1500);
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-1.5 mb-1">
        <stat.icon className="w-5 h-5 text-green-600" />
        <span className="text-2xl font-bold text-slate-900">
          {count}
          {stat.suffix}
        </span>
      </div>
      <p className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-slate-400">
        {stat.label}
      </p>
    </div>
  );
};

export default function Testimonials() {
  const testimonialRef = useRef<HTMLDivElement>(null);
  
  // State
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [newReview, setNewReview] = useState({
    name: "", role: "", location: "", rating: 5, text: "", image: "", propertyType: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/testimonials`);
        const data = await res.json();
        if (Array.isArray(data.items) && data.items.length > 0) {
          // Merge API data with defaults to ensure we fill the grid
          const combined = [...data.items, ...DEFAULT_TESTIMONIALS];
          // Simple dedup
          const unique = combined.filter((v,i,a)=>a.findIndex(v2=>(v2.text===v.text))===i);
          setTestimonials(unique);
        }
      } catch (err) {
        console.error("Using defaults", err);
      }
    };
    fetchData();
  }, []);

  // Submit Logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (!newReview.name || !newReview.text) {
      setMsg({ type: 'error', text: "Name and Review are required." });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });

      if (!res.ok) throw new Error("Failed");
      
      setMsg({ type: 'success', text: "Review submitted successfully!" });
      setNewReview({ name: "", role: "", location: "", rating: 5, text: "", image: "", propertyType: "" });
      setTimeout(() => setShowForm(false), 2000);
    } catch (err) {
      setMsg({ type: 'error', text: "Something went wrong. Try again." });
    } finally {
      setSubmitting(false);
    }
  };

  // Animation Variants
  const revealVariants = {
    visible: (i: number) => ({
      y: 0, opacity: 1, filter: "blur(0px)",
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
    hidden: { filter: "blur(10px)", y: 20, opacity: 0 },
  };

  const getTestimonial = (index: number) => testimonials[index] || DEFAULT_TESTIMONIALS[index % DEFAULT_TESTIMONIALS.length];

  return (
    <main className="w-full bg-white text-slate-900 overflow-hidden" id="testimonials">
      <section 
        className="relative h-full container mx-auto rounded-lg py-16 lg:py-24 px-4" 
        ref={testimonialRef}
      >
        {/* HEADER */}
        <article className="max-w-screen-md mx-auto text-center space-y-4 mb-16">
          <TimelineContent as="h2" className="text-xs font-bold tracking-[0.2em] text-green-600 uppercase" animationNum={0} customVariants={revealVariants} timelineRef={testimonialRef}>
            Client Feedback
          </TimelineContent>
          <TimelineContent as="h1" className="xl:text-5xl text-3xl font-bold tracking-tight text-slate-900" animationNum={0} customVariants={revealVariants} timelineRef={testimonialRef}>
            Trusted by families & investors across Lahore
          </TimelineContent>
          <TimelineContent as="div" className="flex flex-wrap justify-center gap-6 lg:gap-12 pt-6 border-t border-slate-100 mt-8" animationNum={1} customVariants={revealVariants} timelineRef={testimonialRef}>
             {statsData.map((stat, i) => <StatItem key={i} stat={stat} />)}
          </TimelineContent>
        </article>

        {/* BENTO GRID */}
        <div className="lg:grid lg:grid-cols-3 gap-3 flex flex-col w-full pb-8">
          
          {/* COLUMN 1 */}
          <div className="md:flex lg:flex-col lg:space-y-3 h-full lg:gap-0 gap-3">
            {/* Card 0: Large Light */}
            <TimelineContent animationNum={0} customVariants={revealVariants} timelineRef={testimonialRef} className="lg:flex-[7] flex-[6] flex flex-col justify-between relative bg-slate-50 overflow-hidden rounded-2xl border border-slate-200 p-6 lg:p-8 hover:border-green-200 transition-colors">
              <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
              <article className="mt-auto relative z-10">
                <div className="flex gap-1 mb-2">
                   {[...Array(5)].map((_,i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-lg lg:text-xl font-medium text-slate-700 leading-relaxed">"{getTestimonial(0).text}"</p>
                <div className="flex justify-between items-center pt-6">
                  <div>
                    <h2 className="font-bold text-slate-900">{getTestimonial(0).name}</h2>
                    <p className="text-xs text-slate-500">{getTestimonial(0).role}, {getTestimonial(0).location}</p>
                  </div>
                  <img src={getTestimonial(0).image} alt="user" className="w-12 h-12 rounded-xl object-cover bg-slate-200" />
                </div>
              </article>
            </TimelineContent>
            
            {/* Card 1: Small Green (Colored Card) */}
            <TimelineContent animationNum={1} customVariants={revealVariants} timelineRef={testimonialRef} className="lg:flex-[3] flex-[4] flex flex-col justify-between relative bg-green-600 text-white overflow-hidden rounded-2xl border border-green-500 p-6">
              <article className="mt-auto">
                <p className="text-green-50 font-medium">"{getTestimonial(1).text}"</p>
                <div className="flex justify-between items-center pt-4">
                  <div>
                    <h2 className="font-bold text-white text-sm">{getTestimonial(1).name}</h2>
                    <p className="text-xs text-green-200">{getTestimonial(1).role}</p>
                  </div>
                  <img src={getTestimonial(1).image} alt="user" className="w-10 h-10 rounded-xl object-cover bg-green-700" />
                </div>
              </article>
            </TimelineContent>
          </div>

          {/* COLUMN 2 (Middle, Dark Cards) */}
          <div className="lg:h-full md:flex lg:flex-col h-fit lg:space-y-3 lg:gap-0 gap-3">
             {[2, 3, 4].map((idx, i) => (
                <TimelineContent 
                  key={idx} 
                  animationNum={2 + i} 
                  customVariants={revealVariants} 
                  timelineRef={testimonialRef} 
                  className="flex flex-col justify-between relative bg-[#111] text-gray-200 overflow-hidden rounded-2xl border border-gray-800 p-6 hover:border-gray-600 transition-colors"
                >
                  <article className="mt-auto">
                    <p className="text-sm lg:text-base text-gray-300 leading-relaxed">"{getTestimonial(idx).text}"</p>
                    <div className="flex justify-between items-center pt-5">
                      <div>
                        <h2 className="font-semibold text-white">{getTestimonial(idx).name}</h2>
                        <p className="text-xs text-gray-500">{getTestimonial(idx).role}</p>
                      </div>
                      <img src={getTestimonial(idx).image} alt="user" className="w-10 h-10 rounded-xl object-cover bg-gray-800" />
                    </div>
                  </article>
                </TimelineContent>
             ))}
          </div>

          {/* COLUMN 3 */}
          <div className="h-full md:flex lg:flex-col lg:space-y-3 lg:gap-0 gap-3">
            {/* Card 5: Small Green (Colored Card) */}
            <TimelineContent animationNum={5} customVariants={revealVariants} timelineRef={testimonialRef} className="lg:flex-[3] flex-[4] flex flex-col justify-between relative bg-green-600 text-white overflow-hidden rounded-2xl border border-green-500 p-6">
              <article className="mt-auto">
                <p className="text-green-50 font-medium">"{getTestimonial(5).text}"</p>
                <div className="flex justify-between items-center pt-4">
                  <div>
                    <h2 className="font-bold text-white text-sm">{getTestimonial(5).name}</h2>
                    <p className="text-xs text-green-200">{getTestimonial(5).role}</p>
                  </div>
                  <img src={getTestimonial(5).image} alt="user" className="w-10 h-10 rounded-xl object-cover bg-green-700" />
                </div>
              </article>
            </TimelineContent>

            {/* Card 6: Large Light */}
            <TimelineContent animationNum={6} customVariants={revealVariants} timelineRef={testimonialRef} className="lg:flex-[7] flex-[6] flex flex-col justify-between relative bg-slate-50 overflow-hidden rounded-2xl border border-slate-200 p-6 lg:p-8 hover:border-green-200 transition-colors">
              <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
              <article className="mt-auto relative z-10">
                <div className="flex gap-1 mb-2">
                   {[...Array(5)].map((_,i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-lg lg:text-xl font-medium text-slate-700 leading-relaxed">"{getTestimonial(6).text}"</p>
                <div className="flex justify-between items-center pt-6">
                  <div>
                    <h2 className="font-bold text-slate-900">{getTestimonial(6).name}</h2>
                    <p className="text-sm text-slate-500">{getTestimonial(6).role}, {getTestimonial(6).location}</p>
                  </div>
                  <img src={getTestimonial(6).image} alt="user" className="w-12 h-12 rounded-xl object-cover bg-slate-200" />
                </div>
              </article>
            </TimelineContent>
          </div>
        </div>

        {/* CTA SECTION (GOOGLE / WHATSAPP / ADD REVIEW) */}
        <div className="mt-12 bg-slate-900 rounded-[2rem] p-6 lg:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
                <div className="space-y-4 max-w-xl">
                    <h2 className="text-3xl font-bold">Your property journey matters.</h2>
                    <p className="text-slate-400">Share your experience working with Wasi Estate, or check out our verified reviews on Google.</p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-3 items-center">
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                            <FaGoogle className="text-white" />
                            <span className="text-sm font-semibold">4.9/5 Rating</span>
                        </div>
                        <span className="text-xs text-slate-500">Based on 200+ reviews</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Button 
                        onClick={() => setShowForm(true)}
                        className="bg-white text-slate-900 hover:bg-slate-100 font-bold h-12 px-6 rounded-xl"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Write a Review
                    </Button>
                    <a
                        href="https://wa.me/923214710692"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold h-12 px-6 rounded-xl transition-colors"
                    >
                        <FaWhatsapp className="w-5 h-5 mr-2" /> WhatsApp
                    </a>
                </div>
            </div>
        </div>

        {/* LOCATION PILLS */}
        <div className="mt-12 text-center">
           <p className="text-slate-400 text-[10px] lg:text-xs font-bold uppercase tracking-widest mb-4">Active in Premium Locations</p>
           <div className="flex flex-wrap justify-center gap-2">
              {LOCATIONS.map((loc, i) => (
                 <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-xs text-slate-600 hover:border-green-500 hover:text-green-600 cursor-default transition-colors bg-white">
                    <MapPin className="w-3 h-3" /> {loc}
                 </span>
              ))}
           </div>
        </div>

        {/* ADD REVIEW MODAL */}
        {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center p-6 border-b border-gray-100">
                        <h3 className="text-xl font-bold text-slate-900">Write a Review</h3>
                        <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-slate-500">Name *</label>
                                <input required className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-green-500 bg-slate-50" 
                                    value={newReview.name} onChange={e => setNewReview({...newReview, name: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-slate-500">Role</label>
                                <input className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-green-500 bg-slate-50" 
                                    placeholder="Buyer / Seller"
                                    value={newReview.role} onChange={e => setNewReview({...newReview, role: e.target.value})} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-slate-500">Location</label>
                                <input className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-green-500 bg-slate-50" 
                                    placeholder="e.g. DHA"
                                    value={newReview.location} onChange={e => setNewReview({...newReview, location: e.target.value})} />
                            </div>
                             <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-slate-500">Photo URL</label>
                                <input className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-green-500 bg-slate-50" 
                                    placeholder="https://..."
                                    value={newReview.image} onChange={e => setNewReview({...newReview, image: e.target.value})} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase text-slate-500">Review *</label>
                            <textarea required className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-green-500 bg-slate-50 min-h-[100px]" 
                                value={newReview.text} onChange={e => setNewReview({...newReview, text: e.target.value})} />
                        </div>
                        
                        {msg && (
                            <div className={`text-sm p-3 rounded-lg ${msg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                {msg.text}
                            </div>
                        )}

                        <Button type="submit" disabled={submitting} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold h-12">
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Review"}
                        </Button>
                    </form>
                </div>
            </div>
        )}
      </section>
    </main>
  );
}