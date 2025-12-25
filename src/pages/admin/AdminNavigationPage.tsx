// src/pages/admin/AdminNavigationPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_BASE } from "@/lib/config";


// ----- Types matching your NavigationConfig schema -----
interface SocialLink {
  icon: string;
  href: string;
  label: string;
}

interface TopBar {
  phoneLabel: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  location: string;
  socialLinks: SocialLink[];
}

interface LogoConfig {
  name: string;
  tagline: string;
  logoIcon: string;
  logoImage: string; // URL of the logo
  logoAlt: string;
}

interface DesktopActions {
  callLabel: string;
  callHref: string;
  ctaLabel: string;
  ctaHref: string;
}

interface MobileActions {
  callHref: string;
  whatsappHref: string;
}

interface NavLink {
  name: string;
  href: string;
  icon?: string;
  desc?: string;
}

interface MegaMenuItem {
  title?: string;
  isHighlight?: boolean;
  image?: string;
  titleText?: string;
  price?: string;
  items?: NavLink[];
}

interface NavItem {
  name: string;
  href: string;
  hasDropdown?: boolean;
  megaMenu?: MegaMenuItem[];
}

interface NavigationConfig {
  _id?: string;
  __v?: number;
  logo: LogoConfig;
  topBar: TopBar;
  desktopActions: DesktopActions;
  mobileActions: MobileActions;
  navItems: NavItem[];
}


const AdminNavigationPage: React.FC = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<NavigationConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Protect route: redirect if no token
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
  }, [navigate]);

  // Load current navigation config
  useEffect(() => {
    async function fetchConfig() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/navigation`);
        if (!res.ok) {
          throw new Error("Failed to load navigation config");
        }
        const data: NavigationConfig = await res.json();

        // Ensure arrays are at least empty arrays
        data.topBar.socialLinks = data.topBar.socialLinks || [];
        data.navItems = data.navItems || [];
        data.navItems.forEach((item) => {
          item.megaMenu = item.megaMenu || [];
          item.megaMenu.forEach((section) => {
            section.items = section.items || [];
          });
        });

        setConfig(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load navigation config");
      } finally {
        setLoading(false);
      }
    }

    fetchConfig();
  }, []);

  // ----- Handlers -----

  const handleLogoChange = (field: keyof LogoConfig, value: string) => {
    if (!config) return;
    setConfig({
      ...config,
      logo: {
        ...config.logo,
        [field]: value,
      },
    });
  };

  const handleTopBarChange = (field: keyof TopBar, value: string) => {
    if (!config) return;
    setConfig({
      ...config,
      topBar: {
        ...config.topBar,
        [field]: value,
      },
    });
  };

  // Social links
  const handleSocialLinkChange = (
    index: number,
    field: keyof SocialLink,
    value: string
  ) => {
    if (!config) return;
    const socialLinks = [...(config.topBar.socialLinks || [])];
    socialLinks[index] = {
      ...socialLinks[index],
      [field]: value,
    };
    setConfig({
      ...config,
      topBar: {
        ...config.topBar,
        socialLinks,
      },
    });
  };

  const handleAddSocialLink = () => {
    if (!config) return;
    const socialLinks = [...(config.topBar.socialLinks || [])];
    socialLinks.push({ icon: "", href: "", label: "" });
    setConfig({
      ...config,
      topBar: {
        ...config.topBar,
        socialLinks,
      },
    });
  };

  const handleRemoveSocialLink = (index: number) => {
    if (!config) return;
    const socialLinks = [...(config.topBar.socialLinks || [])];
    socialLinks.splice(index, 1);
    setConfig({
      ...config,
      topBar: {
        ...config.topBar,
        socialLinks,
      },
    });
  };

  // Nav items
  const handleNavItemChange = (
    navIndex: number,
    field: keyof NavItem,
    value: string | boolean
  ) => {
    if (!config) return;
    const navItems = [...config.navItems];
    navItems[navIndex] = {
      ...navItems[navIndex],
      [field]: value,
    };
    setConfig({ ...config, navItems });
  };

  const handleAddNavItem = () => {
    if (!config) return;
    setConfig({
      ...config,
      navItems: [
        ...config.navItems,
        { name: "", href: "", hasDropdown: false, megaMenu: [] },
      ],
    });
  };

  const handleRemoveNavItem = (index: number) => {
    if (!config) return;
    setConfig({
      ...config,
      navItems: config.navItems.filter((_, i) => i !== index),
    });
  };

  // Mega menu sections
  const handleAddMegaSection = (navIndex: number) => {
    if (!config) return;
    const navItems = [...config.navItems];
    const item = { ...navItems[navIndex] };
    item.megaMenu = item.megaMenu || [];
    item.megaMenu.push({
      title: "",
      isHighlight: false,
      items: [],
    });
    navItems[navIndex] = item;
    setConfig({ ...config, navItems });
  };

  const handleRemoveMegaSection = (navIndex: number, sectionIndex: number) => {
    if (!config) return;
    const navItems = [...config.navItems];
    const item = { ...navItems[navIndex] };
    item.megaMenu = item.megaMenu || [];
    item.megaMenu = item.megaMenu.filter((_, i) => i !== sectionIndex);
    navItems[navIndex] = item;
    setConfig({ ...config, navItems });
  };

  const handleMegaSectionChange = (
    navIndex: number,
    sectionIndex: number,
    field: keyof MegaMenuItem,
    value: string | boolean
  ) => {
    if (!config) return;
    const navItems = [...config.navItems];
    const item = { ...navItems[navIndex] };
    item.megaMenu = item.megaMenu || [];
    const section = { ...item.megaMenu[sectionIndex], [field]: value };
    item.megaMenu[sectionIndex] = section;
    navItems[navIndex] = item;
    setConfig({ ...config, navItems });
  };

  // Links inside mega menu sections
  const handleAddMegaItemLink = (navIndex: number, sectionIndex: number) => {
    if (!config) return;
    const navItems = [...config.navItems];
    const item = { ...navItems[navIndex] };
    item.megaMenu = item.megaMenu || [];
    const section = { ...item.megaMenu[sectionIndex] };
    section.items = section.items || [];
    section.items.push({ name: "", href: "", icon: "", desc: "" });
    item.megaMenu[sectionIndex] = section;
    navItems[navIndex] = item;
    setConfig({ ...config, navItems });
  };

  const handleRemoveMegaItemLink = (
    navIndex: number,
    sectionIndex: number,
    linkIndex: number
  ) => {
    if (!config) return;
    const navItems = [...config.navItems];
    const item = { ...navItems[navIndex] };
    item.megaMenu = item.megaMenu || [];
    const section = { ...item.megaMenu[sectionIndex] };
    section.items = section.items || [];
    section.items = section.items.filter((_, i) => i !== linkIndex);
    item.megaMenu[sectionIndex] = section;
    navItems[navIndex] = item;
    setConfig({ ...config, navItems });
  };

  const handleMegaItemLinkChange = (
    navIndex: number,
    sectionIndex: number,
    linkIndex: number,
    field: keyof NavLink,
    value: string
  ) => {
    if (!config) return;
    const navItems = [...config.navItems];
    const item = { ...navItems[navIndex] };
    item.megaMenu = item.megaMenu || [];
    const section = { ...item.megaMenu[sectionIndex] };
    section.items = section.items || [];
    const link = { ...section.items[linkIndex], [field]: value };
    section.items[linkIndex] = link;
    item.megaMenu[sectionIndex] = section;
    navItems[navIndex] = item;
    setConfig({ ...config, navItems });
  };

  // Save
  const handleSave = async () => {
    if (!config) return;
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const { _id, __v, ...payload } = config as NavigationConfig;

      const res = await fetch(`${API_BASE}/navigation`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to save navigation config");
      }

      const updated = await res.json();
      setConfig(updated);
      setSuccess("Navigation updated successfully");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save navigation config");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !config) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading navigation settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            Navigation Settings
          </h1>
          <p className="text-xs text-slate-500">
            Edit logo, top bar info, social links and navigation structure
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin")}
            className="text-xs"
          >
            Back to Dashboard
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="text-xs"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {error && (
            <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              {success}
            </div>
          )}

          {/* Logo Card */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">Logo</h2>
            <p className="text-[11px] text-slate-500">
              You can either use an icon-based logo (logoIcon) or an image URL
              (logoImage). For real file uploads, we can add an upload feature
              later.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Brand Name</Label>
                <Input
                  className="text-sm"
                  value={config.logo.name || ""}
                  onChange={(e) =>
                    handleLogoChange("name", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tagline</Label>
                <Input
                  className="text-sm"
                  value={config.logo.tagline || ""}
                  onChange={(e) =>
                    handleLogoChange("tagline", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Logo Icon (e.g. &quot;Home&quot;)</Label>
                <Input
                  className="text-sm"
                  value={config.logo.logoIcon || ""}
                  onChange={(e) =>
                    handleLogoChange("logoIcon", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Logo Image URL</Label>
                <Input
                  className="text-sm"
                  value={config.logo.logoImage || ""}
                  onChange={(e) =>
                    handleLogoChange("logoImage", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs">Logo Alt Text</Label>
                <Input
                  className="text-sm"
                  value={config.logo.logoAlt || ""}
                  onChange={(e) =>
                    handleLogoChange("logoAlt", e.target.value)
                  }
                />
              </div>
            </div>
          </section>

          {/* Top Bar Card */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Top Bar Information
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Phone Label</Label>
                <Input
                  className="text-sm"
                  value={config.topBar.phoneLabel || ""}
                  onChange={(e) =>
                    handleTopBarChange("phoneLabel", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Phone Href (tel:)</Label>
                <Input
                  className="text-sm"
                  value={config.topBar.phoneHref || ""}
                  onChange={(e) =>
                    handleTopBarChange("phoneHref", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Email</Label>
                <Input
                  className="text-sm"
                  value={config.topBar.email || ""}
                  onChange={(e) =>
                    handleTopBarChange("email", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Email Href (mailto:)</Label>
                <Input
                  className="text-sm"
                  value={config.topBar.emailHref || ""}
                  onChange={(e) =>
                    handleTopBarChange("emailHref", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs">Location Text</Label>
                <Input
                  className="text-sm"
                  value={config.topBar.location || ""}
                  onChange={(e) =>
                    handleTopBarChange("location", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Social links */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-medium text-slate-800">
                  Social Links
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[11px]"
                  onClick={handleAddSocialLink}
                >
                  Add Social Link
                </Button>
              </div>
              <div className="space-y-2">
                {(config.topBar.socialLinks || []).map((link, index) => (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-md p-2 grid gap-2 md:grid-cols-3"
                  >
                    <div className="space-y-1">
                      <Label className="text-[11px]">Label</Label>
                      <Input
                        className="text-xs"
                        value={link.label || ""}
                        onChange={(e) =>
                          handleSocialLinkChange(
                            index,
                            "label",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Icon Name</Label>
                      <Input
                        className="text-xs"
                        value={link.icon || ""}
                        onChange={(e) =>
                          handleSocialLinkChange(
                            index,
                            "icon",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">URL</Label>
                      <div className="flex gap-2">
                        <Input
                          className="text-xs"
                          value={link.href || ""}
                          onChange={(e) =>
                            handleSocialLinkChange(
                              index,
                              "href",
                              e.target.value
                            )
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveSocialLink(index)}
                        >
                          X
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {(!config.topBar.socialLinks ||
                  config.topBar.socialLinks.length === 0) && (
                  <p className="text-[11px] text-slate-500">
                    No social links yet. Click &quot;Add Social Link&quot; to
                    create one.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Nav Items Card */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Main Navigation Links & Mega Menu
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={handleAddNavItem}
              >
                Add Nav Item
              </Button>
            </div>

            <div className="space-y-3">
              {config.navItems.map((item, navIndex) => (
                <div
                  key={navIndex}
                  className="border border-slate-200 rounded-md p-3 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-700">
                      Item {navIndex + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveNavItem(navIndex)}
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="grid gap-2 md:grid-cols-3">
                    <div className="space-y-1">
                      <Label className="text-[11px]">Label</Label>
                      <Input
                        className="text-sm"
                        value={item.name || ""}
                        onChange={(e) =>
                          handleNavItemChange(
                            navIndex,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Href</Label>
                      <Input
                        className="text-sm"
                        value={item.href || ""}
                        onChange={(e) =>
                          handleNavItemChange(
                            navIndex,
                            "href",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Has Dropdown?</Label>
                      <select
                        className="border border-slate-300 rounded px-2 py-1 text-xs w-full"
                        value={item.hasDropdown ? "true" : "false"}
                        onChange={(e) =>
                          handleNavItemChange(
                            navIndex,
                            "hasDropdown",
                            e.target.value === "true"
                          )
                        }
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>
                  </div>

                  {/* Mega menu only if hasDropdown */}
                  {item.hasDropdown && (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[11px] font-semibold text-slate-800">
                          Mega Menu Sections
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[11px]"
                          onClick={() => handleAddMegaSection(navIndex)}
                        >
                          Add Section
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {(item.megaMenu || []).map(
                          (section, sectionIndex) => (
                            <div
                              key={sectionIndex}
                              className="border border-slate-200 rounded-md p-2 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-medium text-slate-700">
                                  Section {sectionIndex + 1}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() =>
                                    handleRemoveMegaSection(
                                      navIndex,
                                      sectionIndex
                                    )
                                  }
                                >
                                  Remove Section
                                </Button>
                              </div>

                              <div className="grid gap-2 md:grid-cols-2">
                                <div className="space-y-1">
                                  <Label className="text-[11px]">
                                    Section Title
                                  </Label>
                                  <Input
                                    className="text-xs"
                                    value={section.title || ""}
                                    onChange={(e) =>
                                      handleMegaSectionChange(
                                        navIndex,
                                        sectionIndex,
                                        "title",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-[11px]">
                                    Section Type
                                  </Label>
                                  <select
                                    className="border border-slate-300 rounded px-2 py-1 text-xs w-full"
                                    value={section.isHighlight ? "highlight" : "normal"}
                                    onChange={(e) =>
                                      handleMegaSectionChange(
                                        navIndex,
                                        sectionIndex,
                                        "isHighlight",
                                        e.target.value === "highlight"
                                      )
                                    }
                                  >
                                    <option value="normal">Normal List</option>
                                    <option value="highlight">
                                      Highlight Card
                                    </option>
                                  </select>
                                </div>
                              </div>

                              {/* Highlight section fields */}
                              {section.isHighlight && (
                                <div className="grid gap-2 md:grid-cols-3 mt-1">
                                  <div className="space-y-1">
                                    <Label className="text-[11px]">
                                      Image URL
                                    </Label>
                                    <Input
                                      className="text-xs"
                                      value={section.image || ""}
                                      onChange={(e) =>
                                        handleMegaSectionChange(
                                          navIndex,
                                          sectionIndex,
                                          "image",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-[11px]">
                                      Title Text
                                    </Label>
                                    <Input
                                      className="text-xs"
                                      value={section.titleText || ""}
                                      onChange={(e) =>
                                        handleMegaSectionChange(
                                          navIndex,
                                          sectionIndex,
                                          "titleText",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-[11px]">
                                      Price / Badge
                                    </Label>
                                    <Input
                                      className="text-xs"
                                      value={section.price || ""}
                                      onChange={(e) =>
                                        handleMegaSectionChange(
                                          navIndex,
                                          sectionIndex,
                                          "price",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Normal list items */}
                              {!section.isHighlight && (
                                <div className="space-y-1 mt-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-medium text-slate-700">
                                      Links
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-[11px]"
                                      onClick={() =>
                                        handleAddMegaItemLink(
                                          navIndex,
                                          sectionIndex
                                        )
                                      }
                                    >
                                      Add Link
                                    </Button>
                                  </div>
                                  <div className="space-y-1">
                                    {(section.items || []).map(
                                      (link, linkIndex) => (
                                        <div
                                          key={linkIndex}
                                          className="border border-slate-200 rounded-md p-2 grid gap-2 md:grid-cols-4"
                                        >
                                          <div className="space-y-1">
                                            <Label className="text-[11px]">
                                              Label
                                            </Label>
                                            <Input
                                              className="text-[11px]"
                                              value={link.name || ""}
                                              onChange={(e) =>
                                                handleMegaItemLinkChange(
                                                  navIndex,
                                                  sectionIndex,
                                                  linkIndex,
                                                  "name",
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-[11px]">
                                              Href
                                            </Label>
                                            <Input
                                              className="text-[11px]"
                                              value={link.href || ""}
                                              onChange={(e) =>
                                                handleMegaItemLinkChange(
                                                  navIndex,
                                                  sectionIndex,
                                                  linkIndex,
                                                  "href",
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-[11px]">
                                              Icon
                                            </Label>
                                            <Input
                                              className="text-[11px]"
                                              value={link.icon || ""}
                                              onChange={(e) =>
                                                handleMegaItemLinkChange(
                                                  navIndex,
                                                  sectionIndex,
                                                  linkIndex,
                                                  "icon",
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-[11px]">
                                              Description
                                            </Label>
                                            <div className="flex gap-2">
                                              <Input
                                                className="text-[11px]"
                                                value={link.desc || ""}
                                                onChange={(e) =>
                                                  handleMegaItemLinkChange(
                                                    navIndex,
                                                    sectionIndex,
                                                    linkIndex,
                                                    "desc",
                                                    e.target.value
                                                  )
                                                }
                                              />
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() =>
                                                  handleRemoveMegaItemLink(
                                                    navIndex,
                                                    sectionIndex,
                                                    linkIndex
                                                  )
                                                }
                                              >
                                                X
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    )}
                                    {(!section.items ||
                                      section.items.length === 0) && (
                                      <p className="text-[11px] text-slate-500">
                                        No links in this section yet.
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        )}
                        {(item.megaMenu || []).length === 0 && (
                          <p className="text-[11px] text-slate-500">
                            No sections yet. Click &quot;Add Section&quot; to
                            start building the dropdown.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {config.navItems.length === 0 && (
                <p className="text-xs text-slate-500">
                  No navigation items yet. Click &quot;Add Nav Item&quot; to
                  create one.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminNavigationPage;