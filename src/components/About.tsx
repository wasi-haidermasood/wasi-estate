// src/components/About.tsx
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Target,
  Lightbulb,
  Shield,
  Heart,
  Zap,
  Quote,
  Handshake,
  Building2,
  Award,
  Calendar,
  MapPin,
  CheckCircle,
  Star,
  Crown,
} from "lucide-react";

interface ValueItem {
  title: string;
  description: string;
}

interface Milestone {
  year: string;
  title: string;
  description: string;
}

interface PartnershipImage {
  image: string;
  caption: string;
  location: string;
}

interface Achievement {
  value: string;
  label: string;
}

interface WhyChooseItem {
  title: string;
  desc: string;
}

interface AboutConfig {
  header?: {
    badgeText?: string;
    titleMain?: string;
    titleHighlight?: string;
    subtitle?: string;
  };
  founder?: {
    image?: string;
    name?: string;
    roleLine?: string;
    sinceText?: string;
    experienceText?: string;
    partnersText?: string;
    presidentBadgeText?: string;
    highlightTitle?: string;
    highlightText?: string;
    messageTitle?: string;
    messageParagraphs?: string[];
  };
  achievements?: Achievement[];
  association?: {
    badgeText?: string;
    title?: string;
    description?: string;
    bulletPoints?: string[];
  };
  mission?: {
    title?: string;
    text?: string;
  };
  vision?: {
    title?: string;
    text?: string;
  };
  milestones?: Milestone[];
  values?: ValueItem[];
  partnership?: {
    badgeText?: string;
    title?: string;
    subtitle?: string;
    images?: PartnershipImage[];
  };
  whyChoose?: {
    title?: string;
    items?: WhyChooseItem[];
  };
}

const DEFAULT_VALUES: ValueItem[] = [
  {
    title: "Results-Driven",
    description:
      "Every deal we close is handled with precision, ensuring maximum value for our clients.",
  },
  {
    title: "Trust & Transparency",
    description:
      "Our 1% commission model reflects our commitment to honest, transparent dealings.",
  },
  {
    title: "Client-Centric",
    description:
      "Your property goals are our priority. We build lasting relationships based on trust.",
  },
  {
    title: "Expert Guidance",
    description:
      "17+ years of market expertise to guide you through every step of your property journey.",
  },
];

const DEFAULT_MILESTONES: Milestone[] = [
  {
    year: "2008",
    title: "Founded",
    description: "Muhammad Masood established Wasi Estate Advisers",
  },
  {
    year: "2012",
    title: "100+ Dealers",
    description: "Partnered with over 100 property dealers",
  },
  {
    year: "2016",
    title: "Construction Wing",
    description: "Launched Wasi Builders division",
  },
  {
    year: "2020",
    title: "200+ Network",
    description: "Expanded to 200+ dealer partnerships",
  },
  {
    year: "2024",
    title: "Market Leader",
    description: "Recognized as trusted name in Lahore real estate",
  },
];

const DEFAULT_PARTNERSHIP_IMAGES: PartnershipImage[] = [
  {
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    caption: "Annual Property Dealers Convention 2023",
    location: "Pearl Continental, Lahore",
  },
  {
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    caption: "Partnership Agreement Signing",
    location: "Wasi Estate Head Office",
  },
  {
    image:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    caption: "Real Estate Networking Event",
    location: "DHA Lahore",
  },
  {
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    caption: "Al-Faisal Town Dealers Association Meeting",
    location: "Gulberg Business Center",
  },
  {
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    caption: "Construction Project Launch",
    location: "Bahria Town, Lahore",
  },
  {
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    caption: "Team Strategy Session",
    location: "Wasi Estate Office",
  },
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { value: "500+", label: "Properties Sold" },
  { value: "200+", label: "Partner Dealers" },
  { value: "17+", label: "Years Experience" },
  { value: "98%", label: "Client Satisfaction" },
];

const DEFAULT_WHY_CHOOSE: WhyChooseItem[] = [
  { title: "17+ Years Experience", desc: "Trusted expertise since 2008" },
  { title: "Association President", desc: "Leading Al-Faisal Town Dealers" },
  { title: "Only 1% Commission", desc: "Transparent, fair pricing" },
  { title: "200+ Partner Network", desc: "Access to exclusive listings" },
  { title: "Construction Services", desc: "Complete building solutions" },
  { title: "98% Client Satisfaction", desc: "Results that speak" },
];

const About = () => {
  const [about, setAbout] = useState<AboutConfig | null>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/about");
        const data: AboutConfig = await res.json();
        setAbout(data);
      } catch (err) {
        console.error("Failed to load about config:", err);
        // keep null → fallbacks will be used
      }
    };

    fetchAbout();
  }, []);

  const header = about?.header;
  const founder = about?.founder;
  const achievements = about?.achievements ?? DEFAULT_ACHIEVEMENTS;
  const association = about?.association;
  const mission = about?.mission;
  const vision = about?.vision;
  const milestones = about?.milestones ?? DEFAULT_MILESTONES;
  const values = about?.values ?? DEFAULT_VALUES;
  const partnership = about?.partnership;
  const whyChoose = about?.whyChoose;

  return (
    <section
      id="about"
      className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50"
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
            <span className="text-xs sm:text-sm font-semibold text-green-800">
              {header?.badgeText ?? "Since 2008"}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
            {header?.titleMain ?? "About"}{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {header?.titleHighlight ?? "Us"}
            </span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            {header?.subtitle ??
              "Building trust and transforming dreams into reality for over 17 years"}
          </p>
        </div>

        {/* Founder Section */}
        <div className="mb-16 sm:mb-20">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Founder Image */}
              <div className="relative h-64 sm:h-80 lg:h-full min-h-[400px]">
                <img
                  src={
                    founder?.image ??
                    "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  }
                  alt={founder?.name ?? "Founder & CEO"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent lg:bg-gradient-to-r"></div>

                {/* President Badge */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                  <Badge className="bg-amber-500 text-white hover:bg-amber-500 text-xs sm:text-sm px-3 py-1.5 shadow-lg">
                    <Crown className="w-3.5 h-3.5 mr-1.5" />
                    {founder?.presidentBadgeText ??
                      "President - Al-Faisal Town Property Dealers Association"}
                  </Badge>
                </div>

                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 lg:hidden">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {founder?.name ?? "Muhammad Masood"}
                  </h3>
                  <p className="text-green-400 font-semibold text-sm sm:text-base">
                    {founder?.roleLine ??
                      "Founder & CEO - Wasi Estate Advisers & Builders"}
                  </p>
                </div>
              </div>

              {/* Founder Info */}
              <div className="p-6 sm:p-8 lg:p-10 xl:p-12">
                <div className="hidden lg:block mb-4">
                  <h3 className="text-2xl xl:text-3xl font-bold text-gray-900">
                    {founder?.name ?? "Muhammad Masood"}
                  </h3>
                  <p className="text-green-600 font-semibold">
                    {founder?.roleLine ??
                      "Founder & CEO - Wasi Estate Advisers & Builders"}
                  </p>
                </div>

                {/* Title & Position Badges */}
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 text-xs sm:text-sm px-2 sm:px-3 py-1 border border-amber-200">
                    <Crown className="w-3 h-3 mr-1" />
                    {founder?.presidentBadgeText ??
                      "President - Al-Faisal Town Dealers Association"}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs sm:text-sm px-2 sm:px-3 py-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    {founder?.sinceText ?? "Since 2008"}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs sm:text-sm px-2 sm:px-3 py-1">
                    <Award className="w-3 h-3 mr-1" />
                    {founder?.experienceText ?? "17+ Years Experience"}
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 text-xs sm:text-sm px-2 sm:px-3 py-1">
                    <Handshake className="w-3 h-3 mr-1" />
                    {founder?.partnersText ?? "200+ Partners"}
                  </Badge>
                </div>

                {/* President Highlight Card */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 mb-4 sm:mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Crown className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-900 text-sm sm:text-base mb-1">
                        {founder?.highlightTitle ??
                          "President - Al-Faisal Town Property Dealers Association"}
                      </h4>
                      <p className="text-amber-800 text-xs sm:text-sm leading-relaxed">
                        {founder?.highlightText ??
                          "Leading the largest property dealers association in Al-Faisal Town, representing 200+ registered dealers and setting industry standards for ethical real estate practices."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Founder Message */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 relative">
                  <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-green-300 absolute top-3 sm:top-4 left-3 sm:left-4" />
                  <div className="pl-6 sm:pl-8 pt-2">
                    <h4 className="text-base sm:text-lg font-bold text-green-800 mb-2 sm:mb-3">
                      {founder?.messageTitle ?? "Founder's Message"}
                    </h4>
                    {(founder?.messageParagraphs ??
                      [
                        "When I started Wasi Estate Advisers in 2008, I had one simple vision: to bring honesty and transparency to the real estate industry. After 17 years and over 500 successful transactions, that vision remains at the heart of everything we do.",
                        "As President of Al-Faisal Town Property Dealers Association, I'm committed to elevating industry standards and ensuring fair practices for all stakeholders.",
                        "Our 1% commission model isn't just a pricing strategy—it's our commitment to putting clients first. Today, with 200+ trusted partners, we're proud to be Lahore's most trusted name in real estate.",
                      ]
                    ).map((p, idx) => (
                      <p
                        key={idx}
                        className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 last:mb-0"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {achievements.map((stat, index) => (
                    <div
                      key={index}
                      className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl"
                    >
                      {index === 0 && (
                        <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mx-auto mb-1" />
                      )}
                      {index === 1 && (
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mx-auto mb-1" />
                      )}
                      {index === 2 && (
                        <Award className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mx-auto mb-1" />
                      )}
                      {index === 3 && (
                        <Star className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mx-auto mb-1" />
                      )}
                      <div className="text-lg sm:text-xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-600">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Association Leadership Section */}
        <div className="mb-16 sm:mb-20">
          <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 rounded-2xl sm:rounded-3xl p-1">
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Crown className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600" />
                </div>
                <div className="text-center lg:text-left flex-1">
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 mb-3">
                    {association?.badgeText ?? "Leadership Role"}
                  </Badge>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {association?.title ??
                      "Al-Faisal Town Property Dealers Association"}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                    {association?.description ??
                      "Muhammad Masood serves as the President of Al-Faisal Town Property Dealers Association, the premier body representing real estate professionals in the region. Under his leadership, the association has grown to include 200+ registered dealers committed to ethical practices and transparent dealings."}
                  </p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm">
                    {(association?.bulletPoints ?? [
                      "200+ Registered Members",
                      "Ethical Standards",
                      "Industry Leadership",
                    ]).map((bp, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{bp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-16 sm:mb-20">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-600 to-emerald-700 text-white overflow-hidden">
            <CardContent className="p-6 sm:p-8 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 sm:mb-5">
                  <Zap className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  {mission?.title ?? "Our Mission"}
                </h3>
                <p className="text-white/90 leading-relaxed text-sm sm:text-base">
                  {mission?.text ??
                    "To revolutionize Pakistan's real estate industry through transparent pricing, honest dealings, and exceptional service. We aim to make property transactions stress-free and profitable for every client, regardless of their budget or experience."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden">
            <CardContent className="p-6 sm:p-8 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 sm:mb-5">
                  <Target className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  {vision?.title ?? "Our Vision"}
                </h3>
                <p className="text-white/90 leading-relaxed text-sm sm:text-base">
                  {vision?.text ??
                    "To become Pakistan's most trusted real estate partner by 2030, known for integrity, innovation, and client success. We envision a real estate market where fair pricing is the standard, not the exception."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline / Milestones */}
        <div className="mb-16 sm:mb-20">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            Our{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Journey
            </span>
          </h3>

          {/* Mobile Timeline */}
          <div className="md:hidden space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                    {milestone.year}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-green-200 my-2"></div>
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <h4 className="font-bold text-gray-900 text-base">
                    {milestone.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Timeline */}
          <div className="hidden md:block relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-green-200 via-green-400 to-emerald-600 -translate-y-1/2 rounded-full"></div>
            <div className="grid grid-cols-5 gap-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg z-10 ${
                        index % 2 === 0 ? "mb-4" : "mt-4 order-2"
                      }`}
                    >
                      {milestone.year}
                    </div>
                    <div
                      className={`text-center ${
                        index % 2 === 0 ? "" : "order-1 mb-4"
                      }`}
                    >
                      <h4 className="font-bold text-gray-900 text-sm lg:text-base">
                        {milestone.title}
                      </h4>
                      <p className="text-gray-600 text-xs lg:text-sm">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16 sm:mb-20">
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            What Drives{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Us
            </span>
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 md:hover:-translate-y-2 border-0 bg-white text-center overflow-hidden"
              >
                <CardContent className="p-4 sm:p-5 lg:p-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    {index === 0 && (
                      <Target className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-green-600" />
                    )}
                    {index === 1 && (
                      <Shield className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-green-600" />
                    )}
                    {index === 2 && (
                      <Heart className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-green-600" />
                    )}
                    {index === 3 && (
                      <Lightbulb className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-green-600" />
                    )}
                  </div>
                  <h4 className="text-base sm:text-lg lg:text-xl font-bold mb-2 sm:mb-3 text-gray-900">
                    {value.title}
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Partnership Gallery */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
              <Handshake className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
              <span className="text-xs sm:text-sm font-semibold text-blue-800">
                {partnership?.badgeText ?? "Strong Network"}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">
              {partnership?.title ?? "Collaborating with 200+ Dealers"}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              {partnership?.subtitle ??
                "Building strong partnerships across Pakistan's real estate industry"}
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {(partnership?.images ?? DEFAULT_PARTNERSHIP_IMAGES).map(
              (item, index) => (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg ${
                    index === 0 || index === 5
                      ? "md:col-span-2 md:row-span-2"
                      : ""
                  }`}
                >
                  <div
                    className={`${
                      index === 0 || index === 5
                        ? "h-48 sm:h-64 md:h-80"
                        : "h-40 sm:h-48 md:h-56"
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.caption}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-white font-bold text-xs sm:text-sm mb-0.5 sm:mb-1 line-clamp-1">
                      {item.caption}
                    </h4>
                    <div className="flex items-center text-white/80 text-[10px] sm:text-xs">
                      <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                      <span className="line-clamp-1">{item.location}</span>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gradient-to-br from-green-600 via-green-600 to-emerald-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-white shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
          </div>

          <div className="relative">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-6 sm:mb-8">
              {whyChoose?.title ?? "Why Choose Wasi Estate?"}
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {(whyChoose?.items ?? DEFAULT_WHY_CHOOSE).map((item, index) => (
                <div key={index} className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base mb-0.5 sm:mb-1">
                      {item.title}
                    </h4>
                    <p className="text-white/80 text-xs sm:text-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;