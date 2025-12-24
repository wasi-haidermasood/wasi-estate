import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Building2,
  Home,
  Hammer,
  Key,
  FileText,
  Users,
  MessageSquare,
  Crown,
} from "lucide-react";

const API_BASE = "http://localhost:5000/api";

// ICON MAP
const ICON_MAP: Record<string, React.ElementType> = {
  Facebook,
  Instagram,
  Youtube,
  MessageSquare,
  Building2,
  Home,
  Hammer,
  Key,
  FileText,
  Phone,
  MapPin,
  Crown,
};

// TYPES
interface ServiceLink {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface CompanyLink {
  name: string;
  href: string;
}

interface SocialLink {
  icon: React.ElementType;
  href: string;
  label: string;
  color: string;
}

interface ContactItem {
  icon: React.ElementType;
  text: string;
  href: string;
  label?: string;
}

interface StatItem {
  value: string;
  label: string;
}

interface FooterPageLink {
  title: string;
  slug: string;
  footerLabel?: string;
  footerOrder?: number;
  showInFooter?: boolean;
}

interface FooterPagesResponse {
  pages?: {
    title: string;
    slug: string;
    showInFooter?: boolean;
    footerLabel?: string;
    footerOrder?: number;
  }[];
}

// DEFAULTS
const DEFAULT_SERVICES: ServiceLink[] = [
  { name: "Property Sale", href: "#services", icon: Home },
  { name: "Property Purchase", href: "#services", icon: Key },
  { name: "Rental Services", href: "#services", icon: Building2 },
  { name: "Construction", href: "#services", icon: Hammer },
  { name: "Renovation", href: "#services", icon: Hammer },
  { name: "Documentation", href: "#services", icon: FileText },
];

const DEFAULT_COMPANY_LINKS: CompanyLink[] = [
  { name: "About Us", href: "#about" },
  { name: "Our Portfolio", href: "#portfolio" },
  { name: "Services", href: "#services" },
  { name: "Contact Us", href: "#contact" },
  { name: "Free Consultation", href: "#contact" },
];

const DEFAULT_AREAS: string[] = [
  "Al-Faisal Town",
  "DHA Lahore",
  "Bahria Town",
  "Gulberg",
  "Model Town",
  "Johar Town",
];

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  {
    icon: Facebook,
    href: "https://facebook.com/wasiestate",
    label: "Facebook",
    color: "hover:bg-blue-600",
  },
  {
    icon: Instagram,
    href: "https://instagram.com/wasiestate",
    label: "Instagram",
    color: "hover:bg-pink-600",
  },
  {
    icon: Youtube,
    href: "https://youtube.com/@wasiestate",
    label: "YouTube",
    color: "hover:bg-red-600",
  },
  {
    icon: MessageSquare,
    href: "https://wa.me/923214710692",
    label: "WhatsApp",
    color: "hover:bg-green-600",
  },
];

const DEFAULT_CONTACT_INFO: ContactItem[] = [
  { icon: Phone, text: "0321-4710692", href: "tel:03214710692" },
  { icon: Phone, text: "0300-4710692", href: "tel:03004710692" },
  {
    icon: Phone,
    text: "0328-5154250",
    href: "tel:03285154250",
    label: "Marketing",
  },
  {
    icon: MapPin,
    text: "HC34+583, Ahmad Hassan Rd, Mian Amiruddin Park, Lahore",
    href: "#",
  },
];

const DEFAULT_STATS: StatItem[] = [
  { value: "17+", label: "Years Experience" },
  { value: "500+", label: "Properties Sold" },
  { value: "200+", label: "Partner Dealers" },
  { value: "1%", label: "Commission Only" },
];

const Footer = () => {
  // Dynamic lists
  const [services, setServices] = useState<ServiceLink[]>(DEFAULT_SERVICES);
  const [companyLinks, setCompanyLinks] =
    useState<CompanyLink[]>(DEFAULT_COMPANY_LINKS);
  const [areas, setAreas] = useState<string[]>(DEFAULT_AREAS);
  const [socialLinks, setSocialLinks] =
    useState<SocialLink[]>(DEFAULT_SOCIAL_LINKS);
  const [contactInfo, setContactInfo] =
    useState<ContactItem[]>(DEFAULT_CONTACT_INFO);
  const [stats, setStats] = useState<StatItem[]>(DEFAULT_STATS);

  // Company / branding
  const [companyName, setCompanyName] = useState("Wasi Estate");
  const [companyTagline, setCompanyTagline] = useState("Advisers & Builders");
  const [companyDescription, setCompanyDescription] = useState(
    "Lahore's trusted real estate partner since 2008. Transparent dealings with only 1% commission."
  );
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [logoAlt, setLogoAlt] = useState<string>("Wasi Estate logo");
  const [presidentBadgeText, setPresidentBadgeText] = useState<string>(
    "President - Al-Faisal Town Property Dealers Association"
  );
  const [logoIcon, setLogoIcon] = useState<React.ElementType>(Building2);

  // CTA
  const [ctaTitle, setCtaTitle] = useState("Need Help?");
  const [ctaSubtitle, setCtaSubtitle] = useState(
    "Get free property consultation"
  );
  const [ctaButtonLabel, setCtaButtonLabel] = useState("WhatsApp Us");
  const [ctaButtonHref, setCtaButtonHref] = useState(
    "https://wa.me/923214710692"
  );
  const [ctaButtonIcon, setCtaButtonIcon] =
    useState<React.ElementType>(MessageSquare);

  // Bottom bar
  const [privacyLabel, setPrivacyLabel] = useState("Privacy Policy");
  const [termsLabel, setTermsLabel] = useState("Terms of Service");
  const [copyrightText, setCopyrightText] = useState(
    "Wasi Estate Advisers & Builders. All rights reserved."
  );

  // Static pages for footer
  const [pageLinks, setPageLinks] = useState<FooterPageLink[]>([]);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await fetch(`${API_BASE}/footer`);
        if (!res.ok) throw new Error("Failed to load footer config");
        const data = await res.json();

        // Company info
        if (data.company) {
          setCompanyName(c => data.company.name || c);
          setCompanyTagline(c => data.company.tagline || c);
          setCompanyDescription(
            c => data.company.description || c
          );
          setLogoImage(data.company.logoImage || "");
          setLogoAlt(c => data.company.logoAlt || c);
          setPresidentBadgeText(
            c => data.company.presidentBadgeText || c
          );
          if (data.company.logoIcon && ICON_MAP[data.company.logoIcon]) {
            setLogoIcon(ICON_MAP[data.company.logoIcon]);
          }
        }

        // Services
        if (Array.isArray(data.services) && data.services.length > 0) {
          const mappedServices: ServiceLink[] = data.services.map(
            (s: { name: string; href: string; icon: string }) => ({
              name: s.name,
              href: s.href,
              icon: ICON_MAP[s.icon] || Home,
            })
          );
          setServices(mappedServices);
        }

        // Company links
        if (
          Array.isArray(data.companyLinks) &&
          data.companyLinks.length > 0
        ) {
          setCompanyLinks(data.companyLinks);
        }

        // Areas
        if (Array.isArray(data.areas) && data.areas.length > 0) {
          setAreas(data.areas);
        }

        // Social links
        if (
          Array.isArray(data.socialLinks) &&
          data.socialLinks.length > 0
        ) {
          const mappedSocial: SocialLink[] = data.socialLinks.map(
            (s: { icon: string; href: string; label: string; color?: string }) => ({
              icon: ICON_MAP[s.icon] || Facebook,
              href: s.href,
              label: s.label,
              color: s.color || "hover:bg-white/20",
            })
          );
          setSocialLinks(mappedSocial);
        }

        // Contact info
        if (
          Array.isArray(data.contactInfo) &&
          data.contactInfo.length > 0
        ) {
          const mappedContact: ContactItem[] = data.contactInfo.map(
            (c: { icon: string; text: string; href: string; label?: string }) => ({
              icon: ICON_MAP[c.icon] || Phone,
              text: c.text,
              href: c.href,
              label: c.label,
            })
          );
          setContactInfo(mappedContact);
        }

        // CTA
        if (data.cta) {
          setCtaTitle(c => data.cta.title || c);
          setCtaSubtitle(c => data.cta.subtitle || c);
          setCtaButtonLabel(c => data.cta.buttonLabel || c);
          setCtaButtonHref(c => data.cta.buttonHref || c);
          const btnIconName = data.cta.buttonIcon || "MessageSquare";
          setCtaButtonIcon(ICON_MAP[btnIconName] || MessageSquare);
        }

        // Stats
        if (Array.isArray(data.stats) && data.stats.length > 0) {
          setStats(data.stats);
        }

        // Bottom bar
        if (data.bottomBar) {
          setPrivacyLabel(c => data.bottomBar.privacyText || c);
          setTermsLabel(c => data.bottomBar.termsText || c);
          if (data.bottomBar.copyrightText) {
            setCopyrightText(data.bottomBar.copyrightText);
          }
        }
      } catch (err) {
        console.error("Failed to load footer config:", err);
        // keep defaults
      }
    };

    fetchFooter();
  }, []);

  // Fetch static pages for footer
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch(`${API_BASE}/pages/public`);
        if (!res.ok) return;
        const data: FooterPagesResponse = await res.json();
        const pages: FooterPageLink[] = (data.pages ?? []).map((p) => ({
          title: p.title,
          slug: p.slug,
          showInFooter: p.showInFooter,
          footerLabel: p.footerLabel,
          footerOrder: p.footerOrder,
        }));
        setPageLinks(pages);
      } catch (err) {
        console.error("Failed to load pages for footer:", err);
      }
    };

    fetchPages();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // Create component variables for rendering
  const LogoIconComponent = logoIcon;
  const CtaButtonIconComponent = ctaButtonIcon;

  const footerPages = pageLinks
    .filter((p) => p.showInFooter)
    .sort((a, b) => (a.footerOrder || 0) - (b.footerOrder || 0));

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              {logoImage ? (
                <img
                  src={logoImage}
                  alt={logoAlt || companyName}
                  className="w-10 h-10 rounded-lg object-contain bg-white"
                />
              ) : (
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <LogoIconComponent className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold">{companyName}</h3>
                <p className="text-xs text-gray-400">{companyTagline}</p>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              {companyDescription}
            </p>

            {/* President Badge */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-medium">
                <Crown className="w-4 h-4" />
                <span>{presidentBadgeText}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map((social, index) => {
                const SocialIconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center transition-all duration-200 ${social.color}`}
                    aria-label={social.label}
                  >
                    <SocialIconComponent className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h4 className="text-sm font-semibold mb-4 text-white">Services</h4>
            <ul className="space-y-2.5">
              {services.map((service, index) => {
                const ServiceIconComponent = service.icon;
                return (
                  <li key={index}>
                    <button
                      onClick={() => scrollToSection(service.href)}
                      className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200 text-left flex items-center gap-2"
                    >
                      <ServiceIconComponent className="w-3.5 h-3.5" />
                      {service.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Links & Areas */}
          <div className="col-span-1">
            <h4 className="text-sm font-semibold mb-4 text-white">
              Quick Links
            </h4>
            <ul className="space-y-2.5 mb-6">
              {companyLinks.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200 text-left"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>

            <h4 className="text-sm font-semibold mb-3 text-white">
              Areas We Serve
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {areas.map((area, index) => (
                <span
                  key={index}
                  className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Pages / Legal Section */}
          <div className="col-span-1">
            <h4 className="text-sm font-semibold mb-4 text-white">
              Pages &amp; Legal
            </h4>
            <ul className="space-y-2.5">
              {/* Important static routes */}
              <li>
                <Link
                  to="/properties"
                  className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200"
                >
                  Properties
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200"
                >
                  Blog
                </Link>
              </li>

              {/* Dynamic pages from CMS */}
              {footerPages.map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/pages/${p.slug}`}
                    className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200"
                  >
                    {p.footerLabel || p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <h4 className="text-sm font-semibold mb-4 text-white">
              Contact Us
            </h4>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => {
                const ContactIconComponent = item.icon;
                return (
                  <li key={index}>
                    <a
                      href={item.href}
                      className="flex items-start gap-3 text-sm text-gray-400 hover:text-green-400 transition-colors duration-200 group"
                    >
                      <ContactIconComponent className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                      <span className="leading-relaxed">
                        {item.text}
                        {item.label && (
                          <span className="text-xs text-gray-500 ml-1">
                            ({item.label})
                          </span>
                        )}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* CTA */}
            <div className="mt-6 p-4 bg-green-600/20 border border-green-600/30 rounded-lg">
              <p className="text-sm font-medium text-white mb-2">{ctaTitle}</p>
              <p className="text-xs text-gray-400 mb-3">{ctaSubtitle}</p>
              <a
                href={ctaButtonHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <CtaButtonIconComponent className="w-3.5 h-3.5" />
                {ctaButtonLabel}
              </a>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-500">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              © {new Date().getFullYear()} {copyrightText}
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <button className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200">
                {privacyLabel}
              </button>
              <button className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200">
                {termsLabel}
              </button>

              <Button
                size="sm"
                variant="ghost"
                onClick={scrollToTop}
                className="text-gray-400 hover:text-white hover:bg-white/10 h-8 px-3"
              >
                <ArrowUp className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">Top</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;