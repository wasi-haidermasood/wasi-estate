import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  Headphones,
  Navigation,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Headphones,
  Navigation,
};

interface ContactNumber {
  icon: React.ElementType;
  label: string;
  number: string;
  href: string;
}

interface BusinessHourRow {
  label: string;
  value: string;
}

// Defaults
const DEFAULT_CONTACT_NUMBERS: ContactNumber[] = [
  {
    icon: Phone,
    label: "Primary Contact",
    number: "0321-4710692",
    href: "tel:03214710692",
  },
  {
    icon: Phone,
    label: "Secondary Contact",
    number: "0300-4710692",
    href: "tel:03004710692",
  },
  {
    icon: Headphones,
    label: "Marketing Team",
    number: "0328-5154250",
    href: "tel:03285154250",
  },
];

const DEFAULT_OFFICE_ADDRESS_LINES: string[] = [
  "HC34+583, Ahmad Hassan Rd,",
  "Mian Amiruddin Park,",
  "Lahore, Pakistan",
];

const DEFAULT_MAPS_SEARCH_URL =
  "https://www.google.com/maps/search/?api=1&query=HC34%2B583%2C+Ahmad+Hassan+Rd%2C+Mian+Amiruddin+Park+Lahore";

const DEFAULT_BUSINESS_HOURS: BusinessHourRow[] = [
  { label: "Monday - Saturday", value: "9:00 AM - 8:00 PM" },
  { label: "Sunday", value: "10:00 AM - 6:00 PM" },
];

const DEFAULT_BENEFITS: string[] = [
  "Free Property Consultation",
  "Only 1% Commission",
  "200+ Dealer Network",
  "Quick Response Time",
];

const DEFAULT_MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.5!2d74.2833!3d31.5167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391904e6c3b9c5e9%3A0x1c8d33e8c9f5b1a2!2sAhmad%20Hassan%20Rd%2C%20Mian%20Amiruddin%20Park%2C%20Lahore%2C%20Pakistan!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    propertyType: "",
    budget: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Dynamic content state
  const [headerBadge, setHeaderBadge] = useState("Get In Touch");
  const [headerTitle, setHeaderTitle] = useState("Contact Us");
  const [headerSubtitle, setHeaderSubtitle] = useState(
    "Ready to find your perfect property? Get in touch with our expert team today."
  );

  const [contactNumbers, setContactNumbers] = useState<ContactNumber[]>(
    DEFAULT_CONTACT_NUMBERS
  );

  const [officeTitle, setOfficeTitle] = useState("Our Office");
  const [officeAddressLines, setOfficeAddressLines] = useState<string[]>(
    DEFAULT_OFFICE_ADDRESS_LINES
  );
  const [officeMapsUrl, setOfficeMapsUrl] = useState(DEFAULT_MAPS_SEARCH_URL);

  const [businessHours, setBusinessHours] =
    useState<BusinessHourRow[]>(DEFAULT_BUSINESS_HOURS);

  const [benefits, setBenefits] = useState<string[]>(DEFAULT_BENEFITS);

  const [mapTitle, setMapTitle] = useState("Visit Our Office");
  const [mapSubtitle, setMapSubtitle] = useState(
    "HC34+583, Ahmad Hassan Rd, Mian Amiruddin Park, Lahore"
  );
  const [mapOpenUrl, setMapOpenUrl] = useState(DEFAULT_MAPS_SEARCH_URL);
  const [mapEmbedSrc, setMapEmbedSrc] = useState(DEFAULT_MAP_EMBED_SRC);

  const [bottomCtaTitle, setBottomCtaTitle] = useState(
    "Need Immediate Assistance?"
  );
  const [bottomCtaSubtitle, setBottomCtaSubtitle] = useState(
    "Our team is available to help you find your perfect property"
  );
  const [bottomCtaPhoneLabel, setBottomCtaPhoneLabel] = useState(
    "Call: 0321-4710692"
  );
  const [bottomCtaPhoneHref, setBottomCtaPhoneHref] = useState(
    "tel:03214710692"
  );
  const [bottomCtaWhatsappLabel, setBottomCtaWhatsappLabel] =
    useState("WhatsApp Us");
  const [bottomCtaWhatsappHref, setBottomCtaWhatsappHref] = useState(
    "https://wa.me/923214710692"
  );

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/contact");
        const data = await res.json();

        if (data?.header) {
          setHeaderBadge(data.header.badgeText || "Get In Touch");
          setHeaderTitle(data.header.title || "Contact Us");
          setHeaderSubtitle(
            data.header.subtitle ||
              "Ready to find your perfect property? Get in touch with our expert team today."
          );
        }

        if (Array.isArray(data?.phoneNumbers) && data.phoneNumbers.length > 0) {
          const mapped: ContactNumber[] = data.phoneNumbers.map((n) => ({
            icon: ICON_MAP?.[n?.icon] || Phone,
            label: n?.label ?? "",
            number: n?.number ?? "",
            href: n?.href ?? "",
          }));
          setContactNumbers(mapped);
        }

        if (data?.office) {
          setOfficeTitle(data.office.title || "Our Office");
          setOfficeAddressLines(
            Array.isArray(data.office.addressLines) &&
              data.office.addressLines.length > 0
              ? data.office.addressLines
              : DEFAULT_OFFICE_ADDRESS_LINES
          );
          setOfficeMapsUrl(data.office.mapsSearchUrl || DEFAULT_MAPS_SEARCH_URL);
        }

        if (
          data?.businessHours &&
          Array.isArray(data.businessHours.rows) &&
          data.businessHours.rows.length > 0
        ) {
          setBusinessHours(data.businessHours.rows);
        }

        if (Array.isArray(data?.benefits) && data.benefits.length > 0) {
          setBenefits(data.benefits);
        }

        if (data?.map) {
          setMapTitle(data.map.title || "Visit Our Office");
          setMapSubtitle(
            data.map.subtitle ||
              "HC34+583, Ahmad Hassan Rd, Mian Amiruddin Park, Lahore"
          );
          setMapOpenUrl(data.map.mapsSearchUrl || DEFAULT_MAPS_SEARCH_URL);
          setMapEmbedSrc(data.map.embedSrc || DEFAULT_MAP_EMBED_SRC);
        }

        if (data?.bottomCta) {
          setBottomCtaTitle(
            data.bottomCta.title || "Need Immediate Assistance?"
          );
          setBottomCtaSubtitle(
            data.bottomCta.subtitle ||
              "Our team is available to help you find your perfect property"
          );
          setBottomCtaPhoneLabel(
            data.bottomCta.primaryPhoneLabel || "Call: 0321-4710692"
          );
          setBottomCtaPhoneHref(
            data.bottomCta.primaryPhoneHref || "tel:03214710692"
          );
          setBottomCtaWhatsappLabel(
            data.bottomCta.whatsappLabel || "WhatsApp Us"
          );
          setBottomCtaWhatsappHref(
            data.bottomCta.whatsappHref || "https://wa.me/923214710692"
          );
        }
      } catch (err) {
        console.error("Failed to load contact config:", err);
      }
    };

    fetchContact();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to submit inquiry");
      }

      toast({
        title: "Inquiry Submitted Successfully!",
        description: "Our team will contact you within 2 hours.",
        duration: 5000,
      });

      setFormData({
        name: "",
        phone: "",
        propertyType: "",
        budget: "",
        message: "",
      });
    } catch (err) {
      console.error("Contact submit error:", err);
      toast({
        title: "Submission Failed",
        description: err?.message || "Please try again later.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <Badge className="bg-green-50 text-green-700 hover:bg-green-50 mb-3 text-xs font-medium">
            {headerBadge}
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            {headerTitle}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            {headerSubtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <Card className="border border-gray-100 shadow-sm">
              <CardContent className="p-5 sm:p-6 lg:p-8">
                <div className="flex items-center gap-2 mb-5">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-gray-900">Send Inquiry</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm text-gray-700">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1.5 h-11"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm text-gray-700">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="mt-1.5 h-11"
                        placeholder="03XX-XXXXXXX"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="propertyType"
                        className="text-sm text-gray-700"
                      >
                        Property Type
                      </Label>
                      <select
                        id="propertyType"
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleInputChange}
                        className="mt-1.5 w-full h-11 px-3 border border-gray-200 rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select type</option>
                        <option value="house">House</option>
                        <option value="plot">Plot</option>
                        <option value="apartment">Apartment</option>
                        <option value="commercial">Commercial</option>
                        <option value="farmhouse">Farmhouse</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="budget" className="text-sm text-gray-700">
                        Budget Range
                      </Label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="mt-1.5 w-full h-11 px-3 border border-gray-200 rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select budget</option>
                        <option value="under-50lac">Under 50 Lac</option>
                        <option value="50lac-1cr">50 Lac - 1 Crore</option>
                        <option value="1cr-3cr">1 - 3 Crore</option>
                        <option value="3cr-5cr">3 - 5 Crore</option>
                        <option value="above-5cr">Above 5 Crore</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm text-gray-700">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="mt-1.5 min-h-[100px] resize-none"
                      placeholder="Tell us about your requirements..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Submit Inquiry
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-2 space-y-4">
            {/* Phone Numbers */}
            <Card className="border border-gray-100 shadow-sm">
              <CardContent className="p-5">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-600" />
                  Call Us
                </h4>
                <div className="space-y-3">
                  {contactNumbers.map((contact, index) => (
                    <a
                      key={index}
                      href={contact.href}
                      className="flex items-center justify-between p-3 bg-gray-50 hover:bg-green-50 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                          <contact.icon className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">
                            {contact.label}
                          </p>
                          <p className="font-semibold text-gray-900">
                            {contact.number}
                          </p>
                        </div>
                      </div>
                      <Phone className="w-4 h-4 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card className="border border-gray-100 shadow-sm">
              <CardContent className="p-5">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  {officeTitle}
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    {officeAddressLines.map((line, idx) => (
                      <span key={idx}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                  <a
                    href={officeMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-green-600 text-sm font-medium hover:text-green-700 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Get Directions
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="border border-gray-100 shadow-sm">
              <CardContent className="p-5">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  Business Hours
                </h4>
                <div className="space-y-2 text-sm">
                  {businessHours.map((row, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-gray-600">{row.label}</span>
                      <span className="font-medium text-gray-900">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Benefits */}
            <Card className="border-0 bg-gradient-to-br from-green-600 to-emerald-600 text-white">
              <CardContent className="p-5">
                <h4 className="font-semibold mb-3">Why Contact Us?</h4>
                <ul className="space-y-2 text-sm">
                  {benefits.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-200 flex-shrink-0" />
                      <span className="text-white/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Google Map */}
        <div className="mt-8 sm:mt-12">
          <Card className="border border-gray-100 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              {/* Map Header */}
              <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {mapTitle}
                    </h4>
                    <p className="text-sm text-gray-500">{mapSubtitle}</p>
                  </div>
                </div>
                <a
                  href={mapOpenUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  Open in Maps
                </a>
              </div>

              {/* Map Embed */}
              <div className="aspect-[16/9] sm:aspect-[21/9] lg:aspect-[3/1] w-full bg-gray-100">
                <iframe
                  src={mapEmbedSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Wasi Estate Office Location"
                  className="w-full h-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 sm:mt-12 text-center">
          <div className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              {bottomCtaTitle}
            </h3>
            <p className="text-gray-600 text-sm mb-4">{bottomCtaSubtitle}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={bottomCtaPhoneHref}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-colors"
              >
                <Phone className="w-4 h-4" />
                {bottomCtaPhoneLabel}
              </a>
              <a
                href={bottomCtaWhatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-full transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                {bottomCtaWhatsappLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;