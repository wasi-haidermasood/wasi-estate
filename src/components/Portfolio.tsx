// src/components/Portfolio.tsx
import {
  Phone,
  ArrowRight,
  Building2,
  Home,
  Users,
  CheckCircle2,
  MapPin,
  Shield,
  HandCoins,
  Star,          // <-- add this
} from "lucide-react";import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const Portfolio = () => {
  const scrollToContact = () => {
    const el = document.querySelector("#contact");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const goToWhatsapp = () => {
    window.open("https://wa.me/923214710692", "_blank");
  };

  return (
    <section
      id="portfolio"
      className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-white via-slate-50/60 to-white"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* HEADER */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-1.5 rounded-full mb-4 border border-green-200">
            <HandCoins className="w-4 h-4 text-green-600" />
            <span className="text-xs sm:text-sm font-semibold text-green-800 uppercase tracking-wide">
              For Buyers, Sellers & Owners
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight text-slate-900">
            Want to{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Sell or Buy
            </span>{" "}
            Property?
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-3xl mx-auto">
            Whether you&apos;re a serious buyer, a seller, or a property owner who
            wants to list with a trusted agency, Wasi Estate &amp; Builders gives
            you a complete, safe and transparent process from start to finish.
          </p>
        </div>

        {/* THREE MAIN CARDS: SELL / BUY / LIST */}
        <div className="grid gap-4 sm:gap-6 lg:gap-8 md:grid-cols-3 mb-12 sm:mb-16">
          {/* Sell Your Property */}
          <Card className="border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
            <CardContent className="p-5 sm:p-6 space-y-3">
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-red-100">
                <Building2 className="w-3.5 h-3.5" />
                Sell Your Property
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Owners who want to{" "}
                <span className="text-red-600">sell safely</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                You own a house, plot, commercial unit or farmhouse and want to
                sell it with maximum price, minimum headache and **legal safety**.
              </p>

              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 mt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Proper **property valuation** &amp; market pricing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Professional **listing &amp; marketing** of your property
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  **Screened buyers** – only serious &amp; verified clients
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  **Documentation &amp; transfer** handled end‑to‑end
                </li>
              </ul>

              <div className="mt-3">
                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] px-2 py-0.5">
                  Only 1% Commission · Transparent &amp; documented deal
                </Badge>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <Button
                  onClick={scrollToContact}
                  className="w-full h-9 text-xs sm:text-sm font-semibold bg-green-600 hover:bg-green-700 text-white rounded-full"
                >
                  I want to Sell My Property
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "tel:03214710692")}
                  className="w-full h-9 text-xs sm:text-sm font-semibold border-slate-300 text-slate-800 rounded-full"
                >
                  <Phone className="w-3.5 h-3.5 mr-1" />
                  Call Wasi Estate: 0321‑4710692
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Buy a Property */}
          <Card className="border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
            <CardContent className="p-5 sm:p-6 space-y-3">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-blue-100">
                <Home className="w-3.5 h-3.5" />
                Buy a Property
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Buyers looking for a{" "}
                <span className="text-blue-600">safe purchase</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                You want to buy a house, plot, apartment or commercial unit and
                want someone **on your side** to protect your money and guide you
                to the right option.
              </p>

              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 mt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  **Verified listings** – we avoid risky / disputed properties
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Options according to your **budget &amp; location**
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  **Negotiation** handled by experienced team
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Full **documentation &amp; transfer** support
                </li>
              </ul>

              <div className="mt-3">
                <Badge className="bg-slate-900 text-white border border-slate-800 text-[11px] px-2 py-0.5">
                  500+ Properties Sold · 350+ Happy Families
                </Badge>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <Button
                  onClick={scrollToContact}
                  className="w-full h-9 text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-full"
                >
                  I want to Buy a Property
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={goToWhatsapp}
                  className="w-full h-9 text-xs sm:text-sm font-semibold border-green-500 text-green-700 rounded-full"
                >
                  <FaWhatsapp className="w-3.5 h-3.5 mr-1" />
                  WhatsApp Your Requirement
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* List Your Property / For Dealers & Owners */}
          <Card className="border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
            <CardContent className="p-5 sm:p-6 space-y-3">
              <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-purple-100">
                <Users className="w-3.5 h-3.5" />
                List with Wasi Estate
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Property owners &amp; dealers who want{" "}
                <span className="text-purple-600">serious clients</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                You&apos;re a property owner, investor or dealer with inventory
                (plots, houses, commercials) and want to list your properties
                with a **professional, reputed** agency in Al‑Faisal Town /
                Lahore.
              </p>

              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 mt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Property listing with **photos, details and pricing**
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Access to **200+ partner dealers** network
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  We bring **serious buyers &amp; tenants** to you
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Fair, transparent **1% commission** policy
                </li>
              </ul>

              <div className="mt-3">
                <Badge className="bg-amber-50 text-amber-800 border border-amber-200 text-[11px] px-2 py-0.5">
                  President – Al‑Faisal Town Dealers Association
                </Badge>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <Button
                  onClick={scrollToContact}
                  className="w-full h-9 text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-full"
                >
                  I want to List My Property
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={goToWhatsapp}
                  className="w-full h-9 text-xs sm:text-sm font-semibold border-slate-300 text-slate-800 rounded-full"
                >
                  <FaWhatsapp className="w-3.5 h-3.5 mr-1" />
                  Send Property Details on WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TRUST / EXPLANATION STRIP */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 lg:p-7 shadow-sm mb-10 sm:mb-14">
          <div className="grid md:grid-cols-3 gap-4 md:gap-6 items-start">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
                Why work with Wasi Estate &amp; Builders?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                We understand that buying or selling property is not just a
                transaction – it&apos;s a major financial and emotional decision.
                That&apos;s why we focus on:
              </p>
            </div>
            <div className="space-y-1.5 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Honest guidance and transparent 1% commission policy</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <span>Deep local knowledge of Al‑Faisal Town, DHA, Bahria &amp; more</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" />
                <span>200+ partner dealers and 350+ happy clients served</span>
              </div>
            </div>
            <div className="space-y-1.5 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span>4.9/5 client satisfaction rating over 10+ years</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-green-600" />
                <span>Construction and renovation support under one roof</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Complete documentation &amp; transfer support</span>
              </div>
            </div>
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="text-center">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
            Tell us what you want to do –{" "}
            <span className="text-emerald-600">we&apos;ll take it from there.</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mb-4 max-w-xl mx-auto">
            Selling, buying or listing – just give us a few details, and a senior
            team member will call or WhatsApp you with the best possible plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={scrollToContact}
              className="h-10 px-5 text-xs sm:text-sm font-semibold bg-green-600 hover:bg-green-700 text-white rounded-full"
            >
              Open Contact Form
            </Button>
            <Button
              variant="outline"
              onClick={goToWhatsapp}
              className="h-10 px-5 text-xs sm:text-sm font-semibold border-green-500 text-green-700 rounded-full"
            >
              <FaWhatsapp className="w-4 h-4 mr-1" />
              WhatsApp Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;