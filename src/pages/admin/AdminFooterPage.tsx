// src/pages/admin/AdminFooterPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE } from "@/lib/config";


interface ServiceLink {
  name: string;
  href: string;
  icon: string; // icon name string (e.g. "Home")
}

interface CompanyLink {
  name: string;
  href: string;
}

interface SocialLink {
  icon: string;
  href: string;
  label: string;
  color?: string;
}

interface ContactInfoItem {
  icon: string;
  text: string;
  href: string;
  label?: string;
}

interface StatItem {
  value: string;
  label: string;
}

interface CompanyConfig {
  name?: string;
  tagline?: string;
  description?: string;
  logoImage?: string;
  logoAlt?: string;
  logoIcon?: string;
  presidentBadgeText?: string;
}

interface CtaConfig {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  buttonHref?: string;
  buttonIcon?: string;
}

interface BottomBarConfig {
  privacyText?: string;
  privacyHref?: string;
  termsText?: string;
  termsHref?: string;
  copyrightText?: string;
}

interface FooterSettings {
  _id?: string;
  __v?: number;
  company?: CompanyConfig;
  services?: ServiceLink[];
  companyLinks?: CompanyLink[];
  areas?: string[];
  socialLinks?: SocialLink[];
  contactInfo?: ContactInfoItem[];
  cta?: CtaConfig;
  stats?: StatItem[];
  bottomBar?: BottomBarConfig;
}

const AdminFooterPage: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<FooterSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Protect route
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
  }, [navigate]);

  // Load settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/footer`);
        if (!res.ok) throw new Error("Failed to load footer settings");
        const data: FooterSettings = await res.json();

        data.company = data.company || {};
        data.services = data.services || [];
        data.companyLinks = data.companyLinks || [];
        data.areas = data.areas || [];
        data.socialLinks = data.socialLinks || [];
        data.contactInfo = data.contactInfo || [];
        data.cta = data.cta || {};
        data.stats = data.stats || [];
        data.bottomBar = data.bottomBar || {};

        setSettings(data);
        setError(null);
      } catch (err ) {
        console.error(err);
        setError(err.message || "Failed to load footer settings");
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  // ---- helpers ----

  const updateCompany = (field: keyof CompanyConfig, value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      company: {
        ...(settings.company || {}),
        [field]: value,
      },
    });
  };

  const updateCta = (field: keyof CtaConfig, value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      cta: {
        ...(settings.cta || {}),
        [field]: value,
      },
    });
  };

  const updateBottomBar = (field: keyof BottomBarConfig, value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      bottomBar: {
        ...(settings.bottomBar || {}),
        [field]: value,
      },
    });
  };

  // Services
  const updateService = (
    index: number,
    field: keyof ServiceLink,
    value: string
  ) => {
    if (!settings) return;
    const services = [...(settings.services || [])];
    services[index] = {
      ...services[index],
      [field]: value,
    };
    setSettings({ ...settings, services });
  };

  const addService = () => {
    if (!settings) return;
    const services = [
      ...(settings.services || []),
      { name: "", href: "#services", icon: "Home" },
    ];
    setSettings({ ...settings, services });
  };

  const removeService = (index: number) => {
    if (!settings) return;
    const services = (settings.services || []).filter((_, i) => i !== index);
    setSettings({ ...settings, services });
  };

  // Company links
  const updateCompanyLink = (
    index: number,
    field: keyof CompanyLink,
    value: string
  ) => {
    if (!settings) return;
    const links = [...(settings.companyLinks || [])];
    links[index] = {
      ...links[index],
      [field]: value,
    };
    setSettings({ ...settings, companyLinks: links });
  };

  const addCompanyLink = () => {
    if (!settings) return;
    const links = [
      ...(settings.companyLinks || []),
      { name: "", href: "#" },
    ];
    setSettings({ ...settings, companyLinks: links });
  };

  const removeCompanyLink = (index: number) => {
    if (!settings) return;
    const links = (settings.companyLinks || []).filter((_, i) => i !== index);
    setSettings({ ...settings, companyLinks: links });
  };

  // Areas
  const updateArea = (index: number, value: string) => {
    if (!settings) return;
    const areas = [...(settings.areas || [])];
    areas[index] = value;
    setSettings({ ...settings, areas });
  };

  const addArea = () => {
    if (!settings) return;
    const areas = [...(settings.areas || []), ""];
    setSettings({ ...settings, areas });
  };

  const removeArea = (index: number) => {
    if (!settings) return;
    const areas = (settings.areas || []).filter((_, i) => i !== index);
    setSettings({ ...settings, areas });
  };

  // Social links
  const updateSocialLink = (
    index: number,
    field: keyof SocialLink,
    value: string
  ) => {
    if (!settings) return;
    const socialLinks = [...(settings.socialLinks || [])];
    socialLinks[index] = {
      ...socialLinks[index],
      [field]: value,
    };
    setSettings({ ...settings, socialLinks });
  };

  const addSocialLink = () => {
    if (!settings) return;
    const socialLinks = [
      ...(settings.socialLinks || []),
      { icon: "Facebook", href: "", label: "", color: "hover:bg-blue-600" },
    ];
    setSettings({ ...settings, socialLinks });
  };

  const removeSocialLink = (index: number) => {
    if (!settings) return;
    const socialLinks = (settings.socialLinks || []).filter((_, i) => i !== index);
    setSettings({ ...settings, socialLinks });
  };

  // Contact info
  const updateContactInfo = (
    index: number,
    field: keyof ContactInfoItem,
    value: string
  ) => {
    if (!settings) return;
    const contactInfo = [...(settings.contactInfo || [])];
    contactInfo[index] = {
      ...contactInfo[index],
      [field]: value,
    };
    setSettings({ ...settings, contactInfo });
  };

  const addContactInfo = () => {
    if (!settings) return;
    const contactInfo = [
      ...(settings.contactInfo || []),
      { icon: "Phone", text: "", href: "", label: "" },
    ];
    setSettings({ ...settings, contactInfo });
  };

  const removeContactInfo = (index: number) => {
    if (!settings) return;
    const contactInfo = (settings.contactInfo || []).filter((_, i) => i !== index);
    setSettings({ ...settings, contactInfo });
  };

  // Stats
  const updateStat = (
    index: number,
    field: keyof StatItem,
    value: string
  ) => {
    if (!settings) return;
    const stats = [...(settings.stats || [])];
    stats[index] = {
      ...stats[index],
      [field]: value,
    };
    setSettings({ ...settings, stats });
  };

  const addStat = () => {
    if (!settings) return;
    const stats = [...(settings.stats || []), { value: "", label: "" }];
    setSettings({ ...settings, stats });
  };

  const removeStat = (index: number) => {
    if (!settings) return;
    const stats = (settings.stats || []).filter((_, i) => i !== index);
    setSettings({ ...settings, stats });
  };

  // Save
  const handleSave = async () => {
    if (!settings) return;
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const { _id, __v, ...payload } = settings;

      const res = await fetch(`${API_BASE}/footer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to save footer settings");
      }

      const updated: FooterSettings = await res.json();
      setSettings(updated);
      setSuccess("Footer settings updated successfully");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save footer settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading footer settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            Footer Settings
          </h1>
          <p className="text-xs text-slate-500">
            Edit footer content, links, contact info and stats.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => navigate("/admin")}
          >
            Back to Dashboard
          </Button>
          <Button
            size="sm"
            className="text-xs"
            onClick={handleSave}
            disabled={saving}
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

          {/* Company */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Company Info & Branding
            </h2>
            <div className="grid md:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Company Name</Label>
                <Input
                  className="text-sm"
                  value={settings.company?.name || ""}
                  onChange={(e) => updateCompany("name", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tagline</Label>
                <Input
                  className="text-sm"
                  value={settings.company?.tagline || ""}
                  onChange={(e) => updateCompany("tagline", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Description</Label>
              <Textarea
                className="text-sm"
                rows={3}
                value={settings.company?.description || ""}
                onChange={(e) =>
                  updateCompany("description", e.target.value)
                }
              />
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Logo Image URL</Label>
                <Input
                  className="text-sm"
                  value={settings.company?.logoImage || ""}
                  onChange={(e) =>
                    updateCompany("logoImage", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Logo Alt Text</Label>
                <Input
                  className="text-sm"
                  value={settings.company?.logoAlt || ""}
                  onChange={(e) =>
                    updateCompany("logoAlt", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">
                  Logo Icon Name (e.g. &quot;Building2&quot;)
                </Label>
                <Input
                  className="text-sm"
                  value={settings.company?.logoIcon || ""}
                  onChange={(e) =>
                    updateCompany("logoIcon", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">President Badge Text</Label>
                <Input
                  className="text-sm"
                  value={settings.company?.presidentBadgeText || ""}
                  onChange={(e) =>
                    updateCompany("presidentBadgeText", e.target.value)
                  }
                />
              </div>
            </div>
          </section>

          {/* Services */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Services Links
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="text-[11px]"
                onClick={addService}
              >
                Add Service
              </Button>
            </div>
            <p className="text-[11px] text-slate-500">
              Icon name must match one of the icons in your footer ICON_MAP
              (e.g. &quot;Home&quot;, &quot;Hammer&quot;, &quot;Building2&quot;).
            </p>
            <div className="space-y-2">
              {(settings.services || []).map((s, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-md p-2 grid gap-2 md:grid-cols-4"
                >
                  <div className="space-y-1">
                    <Label className="text-[11px]">Name</Label>
                    <Input
                      className="text-xs"
                      value={s.name || ""}
                      onChange={(e) =>
                        updateService(index, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Href (section id)</Label>
                    <Input
                      className="text-xs"
                      value={s.href || ""}
                      onChange={(e) =>
                        updateService(index, "href", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Icon Name</Label>
                    <Input
                      className="text-xs"
                      value={s.icon || ""}
                      onChange={(e) =>
                        updateService(index, "icon", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Remove</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeService(index)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
              {(settings.services || []).length === 0 && (
                <p className="text-[11px] text-slate-500">
                  No services yet.
                </p>
              )}
            </div>
          </section>

          {/* Quick Links & Areas */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Quick Links */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Quick Links
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[11px]"
                    onClick={addCompanyLink}
                  >
                    Add Link
                  </Button>
                </div>
                <div className="space-y-2">
                  {(settings.companyLinks || []).map((l, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 rounded-md p-2 grid gap-2 md:grid-cols-3"
                    >
                      <div className="space-y-1">
                        <Label className="text-[11px]">Name</Label>
                        <Input
                          className="text-xs"
                          value={l.name || ""}
                          onChange={(e) =>
                            updateCompanyLink(index, "name", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px]">Href (section id)</Label>
                        <Input
                          className="text-xs"
                          value={l.href || ""}
                          onChange={(e) =>
                            updateCompanyLink(index, "href", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px]">Remove</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeCompanyLink(index)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                  {(settings.companyLinks || []).length === 0 && (
                    <p className="text-[11px] text-slate-500">
                      No links yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Areas */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Areas We Serve
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[11px]"
                    onClick={addArea}
                  >
                    Add Area
                  </Button>
                </div>
                <div className="space-y-2">
                  {(settings.areas || []).map((a, index) => (
                    <div
                      key={index}
                      className="flex gap-2 items-center border border-slate-200 rounded-md p-2"
                    >
                      <Input
                        className="text-xs"
                        value={a || ""}
                        onChange={(e) => updateArea(index, e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeArea(index)}
                      >
                        X
                      </Button>
                    </div>
                  ))}
                  {(settings.areas || []).length === 0 && (
                    <p className="text-[11px] text-slate-500">
                      No areas yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Social Links & Contact Info */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Social Links */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Social Links
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[11px]"
                    onClick={addSocialLink}
                  >
                    Add Social
                  </Button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Icon name must match ICON_MAP (e.g. &quot;Facebook&quot;, &quot;Instagram&quot;).
                </p>
                <div className="space-y-2">
                  {(settings.socialLinks || []).map((s, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 rounded-md p-2 grid gap-2 md:grid-cols-4"
                    >
                      <div className="space-y-1">
                        <Label className="text-[11px]">Icon</Label>
                        <Input
                          className="text-xs"
                          value={s.icon || ""}
                          onChange={(e) =>
                            updateSocialLink(index, "icon", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px]">Label</Label>
                        <Input
                          className="text-xs"
                          value={s.label || ""}
                          onChange={(e) =>
                            updateSocialLink(index, "label", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px]">Href</Label>
                        <Input
                          className="text-xs"
                          value={s.href || ""}
                          onChange={(e) =>
                            updateSocialLink(index, "href", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px]">Tailwind Color Class</Label>
                        <Input
                          className="text-xs"
                          value={s.color || ""}
                          onChange={(e) =>
                            updateSocialLink(index, "color", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))}
                  {(settings.socialLinks || []).length === 0 && (
                    <p className="text-[11px] text-slate-500">
                      No social links yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Contact Info
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[11px]"
                    onClick={addContactInfo}
                  >
                    Add Contact Row
                  </Button>
                </div>
                <div className="space-y-2">
                  {(settings.contactInfo || []).map((c, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 rounded-md p-2 grid gap-2 md:grid-cols-4"
                    >
                      <div className="space-y-1">
                        <Label className="text-[11px]">Icon</Label>
                        <Input
                          className="text-xs"
                          value={c.icon || ""}
                          onChange={(e) =>
                            updateContactInfo(index, "icon", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px]">Text</Label>
                        <Input
                          className="text-xs"
                          value={c.text || ""}
                          onChange={(e) =>
                            updateContactInfo(index, "text", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px]">Href</Label>
                        <Input
                          className="text-xs"
                          value={c.href || ""}
                          onChange={(e) =>
                            updateContactInfo(index, "href", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px]">Label (e.g. Marketing)</Label>
                        <Input
                          className="text-xs"
                          value={c.label || ""}
                          onChange={(e) =>
                            updateContactInfo(index, "label", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))}
                  {(settings.contactInfo || []).length === 0 && (
                    <p className="text-[11px] text-slate-500">
                      No contact rows yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* CTA & Stats */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* CTA */}
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-slate-900">
                  CTA Box (Need Help?)
                </h2>
                <div className="space-y-1">
                  <Label className="text-xs">Title</Label>
                  <Input
                    className="text-sm"
                    value={settings.cta?.title || ""}
                    onChange={(e) => updateCta("title", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Subtitle</Label>
                  <Textarea
                    className="text-sm"
                    rows={2}
                    value={settings.cta?.subtitle || ""}
                    onChange={(e) => updateCta("subtitle", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Button Label</Label>
                  <Input
                    className="text-sm"
                    value={settings.cta?.buttonLabel || ""}
                    onChange={(e) =>
                      updateCta("buttonLabel", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Button Href</Label>
                  <Input
                    className="text-sm"
                    value={settings.cta?.buttonHref || ""}
                    onChange={(e) =>
                      updateCta("buttonHref", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">
                    Button Icon Name (e.g. &quot;MessageSquare&quot;)
                  </Label>
                  <Input
                    className="text-sm"
                    value={settings.cta?.buttonIcon || ""}
                    onChange={(e) =>
                      updateCta("buttonIcon", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Stats Row
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[11px]"
                    onClick={addStat}
                  >
                    Add Stat
                  </Button>
                </div>
                <div className="space-y-2">
                  {(settings.stats || []).map((s, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 rounded-md p-2 grid gap-2 md:grid-cols-3"
                    >
                      <div className="space-y-1">
                        <Label className="text-[11px]">Value</Label>
                        <Input
                          className="text-xs"
                          value={s.value || ""}
                          onChange={(e) =>
                            updateStat(index, "value", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <Label className="text-[11px]">Label</Label>
                        <div className="flex gap-2">
                          <Input
                            className="text-xs"
                            value={s.label || ""}
                            onChange={(e) =>
                              updateStat(index, "label", e.target.value)
                            }
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeStat(index)}
                          >
                            X
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(settings.stats || []).length === 0 && (
                    <p className="text-[11px] text-slate-500">
                      No stats yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Bar */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Bottom Bar
            </h2>
            <div className="grid md:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Privacy Text</Label>
                <Input
                  className="text-sm"
                  value={settings.bottomBar?.privacyText || ""}
                  onChange={(e) =>
                    updateBottomBar("privacyText", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Privacy Href</Label>
                <Input
                  className="text-sm"
                  value={settings.bottomBar?.privacyHref || ""}
                  onChange={(e) =>
                    updateBottomBar("privacyHref", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Terms Text</Label>
                <Input
                  className="text-sm"
                  value={settings.bottomBar?.termsText || ""}
                  onChange={(e) =>
                    updateBottomBar("termsText", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Terms Href</Label>
                <Input
                  className="text-sm"
                  value={settings.bottomBar?.termsHref || ""}
                  onChange={(e) =>
                    updateBottomBar("termsHref", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Copyright Text</Label>
              <Textarea
                className="text-sm"
                rows={2}
                value={settings.bottomBar?.copyrightText || ""}
                onChange={(e) =>
                  updateBottomBar("copyrightText", e.target.value)
                }
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminFooterPage;