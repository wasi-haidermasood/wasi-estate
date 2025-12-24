import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Phone,
  Mail,
  ChevronDown,
  Home,
  Building2,
  Key,
  Briefcase,
  ArrowRight,
  MapPin,
  Hammer,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

import { API_BASE } from "@/lib/config";
// ===== TYPE DEFINITIONS =====
interface NavLink {
  name: string;
  href: string;
  icon?: React.ReactNode;
  desc?: string;
}

interface MenuSection {
  title: string;
  items: NavLink[];
}

interface HighlightSection {
  title: string;
  isHighlight: true;
  image: string;
  titleText: string;
  price: string;
}

type MegaMenuItem = MenuSection | HighlightSection;

interface NavItem {
  name: string;
  href: string;
  hasDropdown?: boolean;
  megaMenu?: MegaMenuItem[];
}

// Static page link for nav/footer
interface NavPageLink {
  title: string;
  slug: string;
  navLabel?: string;
  navOrder?: number;
  footerLabel?: string;
  footerOrder?: number;
  showInNav?: boolean;
  showInFooter?: boolean;
}

// API response types for navigation config
interface ApiSocialLink {
  href: string;
  label: string;
  icon: string;
}

interface ApiLogoConfig {
  name?: string;
  tagline?: string;
  logoImage?: string;
  logoAlt?: string;
  logoIcon?: string;
}

interface ApiTopBarConfig {
  phoneLabel?: string;
  phoneHref?: string;
  email?: string;
  emailHref?: string;
  location?: string;
  socialLinks?: ApiSocialLink[];
}

interface ApiDesktopActionsConfig {
  callLabel?: string;
  callHref?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

interface ApiMobileActionsConfig {
  callHref?: string;
  whatsappHref?: string;
}

interface ApiNavLinkConfig {
  name: string;
  href: string;
  icon?: string;
  desc?: string;
}

interface ApiMegaMenuSectionConfig {
  isHighlight?: boolean;
  title?: string;
  image?: string;
  titleText?: string;
  price?: string;
  items?: ApiNavLinkConfig[];
}

interface ApiNavItemConfig {
  name: string;
  href: string;
  hasDropdown?: boolean;
  megaMenu?: ApiMegaMenuSectionConfig[];
}

interface NavigationConfigResponse {
  logo?: ApiLogoConfig;
  topBar?: ApiTopBarConfig;
  desktopActions?: ApiDesktopActionsConfig;
  mobileActions?: ApiMobileActionsConfig;
  navItems?: ApiNavItemConfig[];
}

// Type guard
const isHighlightSection = (
  section: MegaMenuItem
): section is HighlightSection => {
  return "isHighlight" in section && section.isHighlight === true;
};

// Social Link Component
export interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const SocialLink = ({ href, icon, label }: SocialLinkProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-800 hover:bg-green-600 text-white transition-all duration-200 hover:scale-110"
  >
    {icon}
  </a>
);

// Icon maps for dynamic config
const MENU_ICON_MAP: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  Home,
  Building2,
  Key,
  Briefcase,
  MapPin,
  Hammer,
};

const SOCIAL_ICON_MAP: Record<string, JSX.Element> = {
  Facebook: <FaFacebookF size={10} />,
  Instagram: <FaInstagram size={10} />,
  YouTube: <FaYoutube size={10} />,
  Whatsapp: <FaWhatsapp size={10} />,
  LinkedIn: <FaLinkedinIn size={10} />,
};

// Default navbar items (fallback if API fails)
const DEFAULT_NAV_ITEMS: NavItem[] = [
  { name: "Home", href: "#home" },
  {
    name: "Buy",
    href: "#properties",
    hasDropdown: true,
    megaMenu: [
      {
        title: "Property Types",
        items: [
          {
            name: "Houses & Villas",
            href: "#houses",
            icon: <Home className="w-4 h-4" />,
            desc: "Luxury family homes",
          },
          {
            name: "Apartments",
            href: "#apartments",
            icon: <Building2 className="w-4 h-4" />,
            desc: "Modern living spaces",
          },
          {
            name: "Commercial",
            href: "#commercial",
            icon: <Briefcase className="w-4 h-4" />,
            desc: "Office & retail",
          },
          {
            name: "Plots & Land",
            href: "#plots",
            icon: <MapPin className="w-4 h-4" />,
            desc: "Investment plots",
          },
        ],
      },
      {
        title: "Top Locations",
        items: [
          { name: "DHA Lahore", href: "#dha" },
          { name: "Bahria Town", href: "#bahria" },
          { name: "Gulberg", href: "#gulberg" },
          { name: "Model Town", href: "#model-town" },
        ],
      },
      {
        title: "Featured Project",
        isHighlight: true,
        image:
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        titleText: "Smart City Apartments",
        price: "Starting 85 Lac",
      },
    ],
  },
  {
    name: "Rent",
    href: "#rent",
    hasDropdown: true,
    megaMenu: [
      {
        title: "Rental Options",
        items: [
          {
            name: "Houses for Rent",
            href: "#rent-house",
            icon: <Key className="w-4 h-4" />,
            desc: "Family homes",
          },
          {
            name: "Apartments for Rent",
            href: "#rent-flat",
            icon: <Building2 className="w-4 h-4" />,
            desc: "1-4 bed units",
          },
          {
            name: "Office Spaces",
            href: "#rent-office",
            icon: <Briefcase className="w-4 h-4" />,
            desc: "Commercial rental",
          },
        ],
      },
      {
        title: "Rental Services",
        items: [
          { name: "Property Management", href: "#management" },
          { name: "Tenant Screening", href: "#screening" },
          { name: "Lease Agreements", href: "#lease" },
        ],
      },
    ],
  },
  {
    name: "Services",
    href: "#services",
    hasDropdown: true,
    megaMenu: [
      {
        title: "Our Services",
        items: [
          {
            name: "Property Valuation",
            href: "#valuation",
            icon: <Building2 className="w-4 h-4" />,
          },
          {
            name: "Home Construction",
            href: "#construction",
            icon: <Hammer className="w-4 h-4" />,
          },
          {
            name: "Interior Design",
            href: "#interior",
            icon: <Home className="w-4 h-4" />,
          },
          {
            name: "Legal Consultation",
            href: "#legal",
            icon: <Briefcase className="w-4 h-4" />,
          },
        ],
      },
    ],
  },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

// Default social links for top bar
const DEFAULT_TOPBAR_SOCIALS: SocialLinkProps[] = [
  { href: "#", icon: <FaFacebookF size={10} />, label: "Facebook" },
  { href: "#", icon: <FaInstagram size={10} />, label: "Instagram" },
  { href: "#", icon: <FaYoutube size={10} />, label: "YouTube" },
  {
    href: "https://wa.me/923214710692",
    icon: <FaWhatsapp size={10} />,
    label: "WhatsApp",
  },
  { href: "#", icon: <FaLinkedinIn size={10} />, label: "LinkedIn" },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const navRef = useRef<HTMLElement>(null);

  // Dynamic state from API
  const [navItems, setNavItems] = useState<NavItem[]>(DEFAULT_NAV_ITEMS);

  const [logoName, setLogoName] = useState("WASI ESTATE");
  const [logoTagline, setLogoTagline] = useState("Premium Properties");
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [logoAlt, setLogoAlt] = useState("Wasi Estate logo");
  const [logoIcon, setLogoIcon] = useState<
    React.ComponentType<React.SVGProps<SVGSVGElement>>
  >(() => Building2);

  const [topBarPhoneLabel, setTopBarPhoneLabel] = useState("0321-4710692");
  const [topBarPhoneHref, setTopBarPhoneHref] =
    useState<string>("tel:03214710692");
  const [topBarEmail, setTopBarEmail] = useState("info@wasiestate.com");
  const [topBarEmailHref, setTopBarEmailHref] = useState(
    "mailto:info@wasiestate.com"
  );
  const [topBarLocation, setTopBarLocation] =
    useState<string>("Lahore, Pakistan");
  const [topBarSocialLinks, setTopBarSocialLinks] =
    useState<SocialLinkProps[]>(DEFAULT_TOPBAR_SOCIALS);

  const [desktopCallLabel, setDesktopCallLabel] =
    useState<string>("0321-4710692");
  const [desktopCallHref, setDesktopCallHref] =
    useState<string>("tel:03214710692");
  const [desktopCtaLabel, setDesktopCtaLabel] =
    useState<string>("List Property");
  const [desktopCtaHref, setDesktopCtaHref] = useState<string>("#contact");

  const [mobileCallHref, setMobileCallHref] =
    useState<string>("tel:03214710692");
  const [mobileWhatsappHref, setMobileWhatsappHref] = useState<string>(
    "https://wa.me/923214710692"
  );

  // Static pages for nav/footer
  const [pageLinks, setPageLinks] = useState<NavPageLink[]>([]);

  const navPages = pageLinks
    .filter((p) => p.showInNav)
    .sort((a, b) => (a.navOrder || 0) - (b.navOrder || 0));

  // Fetch navigation config
  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        const res = await fetch(`${API_BASE}/navigation`);
        if (!res.ok) return;
        const data: NavigationConfigResponse = await res.json();

        if (data.logo) {
          setLogoName((prev) => data.logo?.name || prev);
          setLogoTagline((prev) => data.logo?.tagline || prev);
          setLogoAlt((prev) => data.logo?.logoAlt || prev);
          if (data.logo.logoImage) {
            setLogoImage(data.logo.logoImage);
          }
          if (data.logo.logoIcon && MENU_ICON_MAP[data.logo.logoIcon]) {
            setLogoIcon(() => MENU_ICON_MAP[data.logo.logoIcon]);
          }
        }

        if (data.topBar) {
          setTopBarPhoneLabel((prev) => data.topBar?.phoneLabel || prev);
          setTopBarPhoneHref((prev) => data.topBar?.phoneHref || prev);
          setTopBarEmail((prev) => data.topBar?.email || prev);
          setTopBarEmailHref((prev) => data.topBar?.emailHref || prev);
          setTopBarLocation((prev) => data.topBar?.location || prev);

          if (
            Array.isArray(data.topBar.socialLinks) &&
            data.topBar.socialLinks.length > 0
          ) {
            const socials: SocialLinkProps[] = data.topBar.socialLinks.map(
              (s: ApiSocialLink) => ({
                href: s.href,
                label: s.label,
                icon:
                  SOCIAL_ICON_MAP[s.icon] ??
                  SOCIAL_ICON_MAP["Facebook"] ??
                  ( <FaFacebookF size={10} /> ),
              })
            );
            setTopBarSocialLinks(socials);
          }
        }

        if (data.desktopActions) {
          setDesktopCallLabel((prev) => data.desktopActions?.callLabel || prev);
          setDesktopCallHref((prev) => data.desktopActions?.callHref || prev);
          setDesktopCtaLabel((prev) => data.desktopActions?.ctaLabel || prev);
          setDesktopCtaHref((prev) => data.desktopActions?.ctaHref || prev);
        }

        if (data.mobileActions) {
          setMobileCallHref((prev) => data.mobileActions?.callHref || prev);
          setMobileWhatsappHref(
            (prev) => data.mobileActions?.whatsappHref || prev
          );
        }

        if (Array.isArray(data.navItems) && data.navItems.length > 0) {
          const mappedNav: NavItem[] = data.navItems.map(
            (item: ApiNavItemConfig) => {
              let megaMenu: MegaMenuItem[] | undefined;

              if (Array.isArray(item.megaMenu)) {
                megaMenu = item.megaMenu.map(
                  (section: ApiMegaMenuSectionConfig): MegaMenuItem => {
                    if (section.isHighlight) {
                      return {
                        title: section.title || "Featured Project",
                        isHighlight: true,
                        image: section.image || "",
                        titleText: section.titleText || "",
                        price: section.price || "",
                      };
                    } else {
                      const menuSection: MenuSection = {
                        title: section.title || "",
                        items: (section.items || []).map(
                          (link: ApiNavLinkConfig): NavLink => {
                            let iconNode: React.ReactNode | undefined;
                            if (link.icon && MENU_ICON_MAP[link.icon]) {
                              const IconComp = MENU_ICON_MAP[link.icon];
                              iconNode = <IconComp className="w-4 h-4" />;
                            }
                            return {
                              name: link.name,
                              href: link.href,
                              icon: iconNode,
                              desc: link.desc,
                            };
                          }
                        ),
                      };
                      return menuSection;
                    }
                  }
                );
              }

              return {
                name: item.name,
                href: item.href,
                hasDropdown: !!item.hasDropdown,
                megaMenu,
              };
            }
          );

          setNavItems(mappedNav);
        }
      } catch (err) {
        console.error("Failed to load navigation config:", err);
        // keep defaults
      }
    };

    fetchNavigation();
  }, []);

  // Fetch static pages for nav/footer
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch(`${API_BASE}/pages/public`);
        if (!res.ok) return;
        const data = await res.json();
        const pages: NavPageLink[] = (data.pages || []).map(
          (p: {
            title: string;
            slug: string;
            showInNav?: boolean;
            navLabel?: string;
            navOrder?: number;
            showInFooter?: boolean;
            footerLabel?: string;
            footerOrder?: number;
          }) => ({
            title: p.title,
            slug: p.slug,
            showInNav: p.showInNav,
            navLabel: p.navLabel,
            navOrder: p.navOrder,
            showInFooter: p.showInFooter,
            footerLabel: p.footerLabel,
            footerOrder: p.footerOrder,
          })
        );
        setPageLinks(pages);
      } catch (err) {
        console.error("Failed to load static pages for nav:", err);
      }
    };

    fetchPages();
  }, []);

  // Handle Scroll Effect & Progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      setIsScrolled(scrollY > 50);
      setScrollProgress(docHeight > 0 ? (scrollY / docHeight) * 100 : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock Body Scroll when Mobile Menu is Open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setActiveDropdown(null);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
    setActiveDropdown(null);
  };

  const getHighlightSection = (
    megaMenu: MegaMenuItem[] | undefined
  ): HighlightSection | undefined => {
    return megaMenu?.find(isHighlightSection);
  };

  const getRegularSections = (
    megaMenu: MegaMenuItem[] | undefined
  ): MenuSection[] => {
    return (
      megaMenu?.filter(
        (section): section is MenuSection => !isHighlightSection(section)
      ) || []
    );
  };

  const LogoIcon = logoIcon;

  return (
    <>
      {/* ===== FIXED HEADER ===== */}
      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-lg shadow-lg" : "bg-white"
        }`}
      >
        {/* Scroll Progress Bar */}
        <div
          className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />

        {/* ===== TOP BAR (Desktop Only) ===== */}
        <div
          className={`hidden lg:block bg-slate-900 text-white overflow-hidden transition-all duration-500 ease-out ${
            isScrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
          }`}
        >
          <div className="container mx-auto px-4 h-10 flex items-center justify-between text-xs font-medium">
            {/* Left: Contact */}
            <div className="flex items-center gap-6">
              <a
                href={topBarPhoneHref}
                className="flex items-center gap-2 hover:text-green-400 transition-colors group"
              >
                <span className="p-1 bg-green-600 rounded group-hover:bg-green-500 transition-colors">
                  <Phone className="w-2.5 h-2.5" />
                </span>
                {topBarPhoneLabel}
              </a>
              <a
                href={topBarEmailHref}
                className="flex items-center gap-2 hover:text-green-400 transition-colors"
              >
                <Mail className="w-3 h-3 text-gray-400" />
                {topBarEmail}
              </a>
              <span className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-3 h-3" />
                {topBarLocation}
              </span>
            </div>

            {/* Right: Social */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
                {topBarSocialLinks.map((s, idx) => (
                  <SocialLink
                    key={idx}
                    href={s.href}
                    icon={s.icon}
                    label={s.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===== MAIN NAVIGATION ===== */}
        <nav
          className={`transition-all duration-300 ${
            isScrolled ? "py-2" : "py-3 lg:py-4"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("#home");
                }}
                className="flex items-center gap-2.5 group z-50 relative"
              >
                <div
                  className={`${
                    isScrolled ? "w-9 h-9" : "w-10 h-10 lg:w-11 lg:h-11"
                  } bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-lg flex items-center justify-center shadow-lg group-hover:from-green-600 group-hover:to-green-700 transition-all duration-300`}
                >
                  {logoImage ? (
                    <img
                      src={logoImage}
                      alt={logoAlt}
                      className="w-7 h-7 object-contain"
                    />
                  ) : (
                    <LogoIcon
                      className={`${
                        isScrolled ? "w-5 h-5" : "w-5 h-5 lg:w-6 lg:h-6"
                      } transition-all`}
                    />
                  )}
                </div>
                <div className="leading-tight">
                  <h1
                    className={`${
                      isScrolled ? "text-base lg:text-lg" : "text-lg lg:text-xl"
                    } font-bold text-slate-900 tracking-tight transition-all`}
                  >
                    {logoName}
                  </h1>
                  <p className="text-[8px] lg:text-[9px] font-bold text-green-600 uppercase tracking-[0.2em]">
                    {logoTagline}
                  </p>
                </div>
              </a>

              {/* Desktop Menu */}
              <div className="hidden lg:flex items-center gap-0.5">
                {navItems.map((item) => {
                  const highlightSection = getHighlightSection(item.megaMenu);
                  const regularSections = getRegularSections(item.megaMenu);
                  const hasHighlight = !!highlightSection;

                  return (
                    <div
                      key={item.name}
                      className="relative"
                      onMouseEnter={() =>
                        item.hasDropdown && setActiveDropdown(item.name)
                      }
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button
                        onClick={() =>
                          !item.hasDropdown && scrollToSection(item.href)
                        }
                        className={`px-4 py-2.5 text-sm font-semibold flex items-center gap-1 transition-all rounded-lg ${
                          activeDropdown === item.name
                            ? "text-green-600 bg-green-50"
                            : "text-slate-700 hover:text-green-600 hover:bg-gray-50"
                        }`}
                      >
                        {item.name}
                        {item.hasDropdown && (
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              activeDropdown === item.name ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </button>

                      {/* Desktop Mega Menu */}
                      {item.hasDropdown &&
                        activeDropdown === item.name &&
                        item.megaMenu && (
                          <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                            <div className="absolute -top-2 left-0 w-full h-4" />
                            <div
                              className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                              style={{
                                minWidth: hasHighlight ? "700px" : "400px",
                              }}
                            >
                              <div
                                className={`grid ${
                                  hasHighlight ? "grid-cols-12" : "grid-cols-1"
                                }`}
                              >
                                {/* Menu Sections */}
                                <div
                                  className={`${
                                    hasHighlight ? "col-span-8" : "col-span-full"
                                  } p-6`}
                                >
                                  <div
                                    className={`grid ${
                                      regularSections.length > 1
                                        ? "grid-cols-2"
                                        : "grid-cols-1"
                                    } gap-8`}
                                  >
                                    {regularSections.map((section, idx) => (
                                      <div key={idx}>
                                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                          <span className="w-6 h-px bg-green-500"></span>
                                          {section.title}
                                        </h3>
                                        <ul className="space-y-2">
                                          {section.items.map(
                                            (link, lIdx) => (
                                              <li key={lIdx}>
                                                <a
                                                  href={link.href}
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    scrollToSection(link.href);
                                                  }}
                                                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                                                >
                                                  {link.icon && (
                                                    <span className="mt-0.5 p-1.5 bg-gray-100 rounded-lg text-slate-500 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                                                      {link.icon}
                                                    </span>
                                                  )}
                                                  <div>
                                                    <span className="text-sm font-semibold text-slate-700 group-hover:text-green-600 transition-colors">
                                                      {link.name}
                                                    </span>
                                                    {link.desc && (
                                                      <p className="text-xs text-slate-400 mt-0.5">
                                                        {link.desc}
                                                      </p>
                                                    )}
                                                  </div>
                                                </a>
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Featured Highlight */}
                                {highlightSection && (
                                  <div className="col-span-4 relative overflow-hidden group">
                                    <img
                                      src={highlightSection.image}
                                      alt="Featured"
                                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                    <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
                                      <span className="inline-block px-2 py-1 bg-green-600 text-[10px] font-bold uppercase rounded mb-2 w-fit">
                                        Featured
                                      </span>
                                      <h4 className="font-bold text-lg leading-tight">
                                        {highlightSection.titleText}
                                      </h4>
                                      <p className="text-sm text-gray-300 mt-1">
                                        {highlightSection.price}
                                      </p>
                                      <a
                                        href="#"
                                        className="mt-3 text-xs font-bold flex items-center gap-1 text-green-400 hover:gap-2 transition-all"
                                      >
                                        View Project
                                        <ArrowRight className="w-3 h-3" />
                                      </a>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                  );
                })}

                {/* Dynamic static pages in nav */}
                {navPages.map((page) => (
                  <Link
                    key={`page-${page.slug}`}
                    to={`/pages/${page.slug}`}
                    className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-green-600 hover:bg-gray-50 rounded-lg transition-all"
                  >
                    {page.navLabel || page.title}
                  </Link>
                ))}
              </div>

              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center gap-3">
                <a
                  href={desktopCallHref}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-green-600 transition-colors"
                >
                  <span className="p-2 bg-green-50 rounded-full text-green-600">
                    <Phone className="w-4 h-4" />
                  </span>
                  <span className="hidden xl:block">
                    {desktopCallLabel}
                  </span>
                </a>
                <Button
                  onClick={() => scrollToSection(desktopCtaHref)}
                  className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-green-600 hover:to-green-700 text-white font-bold px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {desktopCtaLabel}
                </Button>
              </div>

              {/* Mobile Actions */}
              <div className="lg:hidden flex items-center gap-2">
                <a
                  href={mobileCallHref}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-green-50 text-green-600 active:scale-95 transition-transform"
                  aria-label="Call us"
                >
                  <Phone className="w-5 h-5" />
                </a>
                <a
                  href={mobileWhatsappHref}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-green-50 text-green-600 active:scale-95 transition-transform"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp className="w-5 h-5" />
                </a>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 text-slate-900 active:scale-95 transition-transform"
                  aria-label="Toggle menu"
                  aria-expanded={isOpen}
                >
                  {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* ===== HEADER SPACER ===== */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled ? "h-14 lg:h-16" : "h-14 lg:h-[120px]"
        }`}
      />

      {/* ===== MOBILE MENU OVERLAY ===== */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-900">Menu</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full text-slate-600 hover:bg-gray-200 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="p-4 space-y-2">
                {/* Navigation Links */}
                {navItems.map((item) => {
                  const regularSections = getRegularSections(item.megaMenu);

                  return (
                    <div key={item.name} className="border-b border-gray-100 last:border-0">
                      <button
                        onClick={() => {
                          if (item.hasDropdown) {
                            setActiveDropdown(
                              activeDropdown === item.name ? null : item.name
                            );
                          } else {
                            scrollToSection(item.href);
                          }
                        }}
                        className="w-full flex items-center justify-between py-3.5 text-base font-semibold text-slate-800"
                      >
                        {item.name}
                        {item.hasDropdown && (
                          <span
                            className={`p-1 rounded-full transition-colors ${
                              activeDropdown === item.name
                                ? "bg-green-100"
                                : "bg-gray-100"
                            }`}
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                activeDropdown === item.name
                                  ? "rotate-180 text-green-600"
                                  : "text-slate-400"
                              }`}
                            />
                          </span>
                        )}
                      </button>

                      {/* Mobile Dropdown */}
                      {item.hasDropdown && (
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-out ${
                            activeDropdown === item.name
                              ? "max-h-[600px] opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="pb-4 space-y-4">
                            {regularSections.map((section, idx) => (
                              <div key={idx} className="bg-gray-50 rounded-xl p-4">
                                <h4 className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                  <span className="w-1.5 h-4 bg-green-500 rounded-full"></span>
                                  {section.title}
                                </h4>
                                <div className="space-y-2">
                                  {section.items.map((link, lIdx) => (
                                    <a
                                      key={lIdx}
                                      href={link.href}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection(link.href);
                                      }}
                                      className="flex items-center gap-3 p-2 rounded-lg active:bg-white transition-colors"
                                    >
                                      {link.icon && (
                                        <span className="p-1.5 bg-white rounded-lg text-slate-500 shadow-sm">
                                          {link.icon}
                                        </span>
                                      )}
                                      <span className="text-sm font-medium text-slate-700">
                                        {link.name}
                                      </span>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Dynamic static pages in mobile menu */}
                {navPages.length > 0 && (
                  <div className="mt-4 border-t border-gray-200 pt-3">
                    <p className="text-[11px] text-slate-400 mb-1 px-1">
                      More pages
                    </p>
                    {navPages.map((page) => (
                      <Link
                        key={`mobile-page-${page.slug}`}
                        to={`/pages/${page.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="block py-2 text-sm font-medium text-slate-700 hover:text-green-600"
                      >
                        {page.navLabel || page.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Bottom Actions */}
            <div className="p-4 bg-white border-t border-gray-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] space-y-3">
              <Button
                onClick={() => scrollToSection("#contact")}
                className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-green-600 hover:to-green-700 text-white font-bold h-12 text-base rounded-xl shadow-lg transition-all"
              >
                List Your Property
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={mobileCallHref}
                  className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 h-11 rounded-xl font-semibold text-sm active:scale-95 transition-transform"
                >
                  <Phone className="w-4 h-4" /> Call Now
                </a>
                <a
                  href={mobileWhatsappHref}
                  className="flex items-center justify-center gap-2 bg-green-100 text-green-700 h-11 rounded-xl font-semibold text-sm active:scale-95 transition-transform"
                >
                  <FaWhatsapp className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;