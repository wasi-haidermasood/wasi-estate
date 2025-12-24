// src/pages/admin/AdminHeroPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// If you have a Textarea component, use it; otherwise, use <textarea>
import { Textarea } from "@/components/ui/textarea"; // or replace with a normal <textarea>

interface HeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
}

interface TrustBadge {
  text: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  dotColor: string;
}

interface HeroHeader {
  subtitleSuffix: string;
}

interface HeroHeaderButtons {
  viewListingsText: string;
  watchVideoText: string;
  watchVideoUrl: string;
}

interface HeroCtaCard {
  title: string;
  subtitle: string;
  highlightText: string;
  primaryButtonText: string;
  whatsappNumber: string;
  whatsappText: string;
  secondaryButtonText: string;
  agentsCount: number;
  agentsLabel: string;
  verifyLabel: string;
}

interface HeroSettings {
  _id?: string;
  __v?: number;
  slides: HeroSlide[];
  trustBadge: TrustBadge;
  header: HeroHeader;
  headerButtons: HeroHeaderButtons;
  ctaCard: HeroCtaCard;
}

const API_BASE = "http://localhost:5000/api";

const AdminHeroPage: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Require token
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
  }, [navigate]);

  // Load hero settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/hero`);
        if (!res.ok) throw new Error("Failed to load hero settings");
        const data: HeroSettings = await res.json();

        // Ensure arrays
        data.slides = data.slides || [];

        setSettings(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load hero settings");
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  // ----- Handlers -----

  // Slides
  const handleSlideChange = (
    index: number,
    field: keyof HeroSlide,
    value: string
  ) => {
    if (!settings) return;
    const slides = [...settings.slides];
    slides[index] = {
      ...slides[index],
      [field]: field === "id" ? Number(value) : value,
    } as HeroSlide;
    setSettings({ ...settings, slides });
  };

  const handleAddSlide = () => {
    if (!settings) return;
    const slides = [...settings.slides];
    const maxId = slides.length
      ? Math.max(...slides.map((s) => s.id || 0))
      : 0;
    slides.push({
      id: maxId + 1,
      image: "",
      title: "",
      subtitle: "",
    });
    setSettings({ ...settings, slides });
  };

  const handleRemoveSlide = (index: number) => {
    if (!settings) return;
    const slides = settings.slides.filter((_, i) => i !== index);
    setSettings({ ...settings, slides });
  };

  // Trust Badge
  const handleTrustBadgeChange = (
    field: keyof TrustBadge,
    value: string
  ) => {
    if (!settings) return;
    setSettings({
      ...settings,
      trustBadge: {
        ...settings.trustBadge,
        [field]: value,
      },
    });
  };

  // Header
  const handleHeaderChange = (value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      header: {
        ...settings.header,
        subtitleSuffix: value,
      },
    });
  };

  // Header Buttons
  const handleHeaderButtonsChange = (
    field: keyof HeroHeaderButtons,
    value: string
  ) => {
    if (!settings) return;
    setSettings({
      ...settings,
      headerButtons: {
        ...settings.headerButtons,
        [field]: value,
      },
    });
  };

  // CTA Card
  const handleCtaCardChange = (
    field: keyof HeroCtaCard,
    value: string
  ) => {
    if (!settings) return;
    setSettings({
      ...settings,
      ctaCard: {
        ...settings.ctaCard,
        [field]:
          field === "agentsCount" ? Number(value) || 0 : value,
      },
    });
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

      const { _id, __v, ...payload } = settings as HeroSettings;

      const res = await fetch(`${API_BASE}/hero`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to save hero settings");
      }

      const updated = await res.json();
      setSettings(updated);
      setSuccess("Hero settings updated successfully");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save hero settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading hero settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            Hero Section Settings
          </h1>
          <p className="text-xs text-slate-500">
            Edit hero slides, trust badge, header and CTA content
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

          {/* Slides */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Hero Slides
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={handleAddSlide}
              >
                Add Slide
              </Button>
            </div>
            <p className="text-[11px] text-slate-500">
              Each slide represents one hero image with title and subtitle.
              Use image URLs for now; we can add real uploads later.
            </p>

            <div className="space-y-3">
              {settings.slides.map((slide, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-md p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-700">
                      Slide {index + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveSlide(index)}
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="grid gap-2 md:grid-cols-4">
                    <div className="space-y-1">
                      <Label className="text-[11px]">ID</Label>
                      <Input
                        className="text-xs"
                        type="number"
                        value={slide.id ?? ""}
                        onChange={(e) =>
                          handleSlideChange(
                            index,
                            "id",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1 md:col-span-3">
                      <Label className="text-[11px]">Image URL</Label>
                      <Input
                        className="text-xs"
                        value={slide.image || ""}
                        onChange={(e) =>
                          handleSlideChange(
                            index,
                            "image",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Title</Label>
                    <Input
                      className="text-xs"
                      value={slide.title || ""}
                      onChange={(e) =>
                        handleSlideChange(
                          index,
                          "title",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Subtitle</Label>
                    <Textarea
                      className="text-xs"
                      rows={2}
                      value={slide.subtitle || ""}
                      onChange={(e) =>
                        handleSlideChange(
                          index,
                          "subtitle",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              ))}

              {settings.slides.length === 0 && (
                <p className="text-xs text-slate-500">
                  No slides yet. Click &quot;Add Slide&quot; to create one.
                </p>
              )}
            </div>
          </section>

          {/* Trust Badge */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Trust Badge
            </h2>
            <p className="text-[11px] text-slate-500">
              This appears above the hero title, usually a small badge like
              &quot;Wasi Estate & Builders Trusted Since 1998&quot; with
              custom colors.
            </p>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs">Text</Label>
                <Input
                  className="text-sm"
                  value={settings.trustBadge.text || ""}
                  onChange={(e) =>
                    handleTrustBadgeChange("text", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Background Color</Label>
                <Input
                  className="text-sm"
                  placeholder="#E5F6FF or tailwind class"
                  value={settings.trustBadge.bgColor || ""}
                  onChange={(e) =>
                    handleTrustBadgeChange("bgColor", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Border Color</Label>
                <Input
                  className="text-sm"
                  value={settings.trustBadge.borderColor || ""}
                  onChange={(e) =>
                    handleTrustBadgeChange(
                      "borderColor",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Text Color</Label>
                <Input
                  className="text-sm"
                  value={settings.trustBadge.textColor || ""}
                  onChange={(e) =>
                    handleTrustBadgeChange(
                      "textColor",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Dot Color</Label>
                <Input
                  className="text-sm"
                  value={settings.trustBadge.dotColor || ""}
                  onChange={(e) =>
                    handleTrustBadgeChange("dotColor", e.target.value)
                  }
                />
              </div>
            </div>
          </section>

          {/* Header & Buttons */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Header & Primary Actions
            </h2>

            <div className="space-y-1">
              <Label className="text-xs">Header Subtitle Suffix</Label>
              <Input
                className="text-sm"
                value={settings.header.subtitleSuffix || ""}
                onChange={(e) => handleHeaderChange(e.target.value)}
              />
              <p className="text-[11px] text-slate-500">
                Example: &quot;for Premium Real Estate in Islamabad&quot;.
              </p>
            </div>

            <div className="grid gap-2 md:grid-cols-3">
              <div className="space-y-1">
                <Label className="text-xs">View Listings Button Text</Label>
                <Input
                  className="text-sm"
                  value={settings.headerButtons.viewListingsText || ""}
                  onChange={(e) =>
                    handleHeaderButtonsChange(
                      "viewListingsText",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Watch Video Button Text</Label>
                <Input
                  className="text-sm"
                  value={settings.headerButtons.watchVideoText || ""}
                  onChange={(e) =>
                    handleHeaderButtonsChange(
                      "watchVideoText",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Watch Video URL</Label>
                <Input
                  className="text-sm"
                  value={settings.headerButtons.watchVideoUrl || ""}
                  onChange={(e) =>
                    handleHeaderButtonsChange(
                      "watchVideoUrl",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          </section>

          {/* CTA Card */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              CTA Card (Right Side Box)
            </h2>

            <div className="grid gap-2 md:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Title</Label>
                <Input
                  className="text-sm"
                  value={settings.ctaCard.title || ""}
                  onChange={(e) =>
                    handleCtaCardChange("title", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Subtitle</Label>
                <Input
                  className="text-sm"
                  value={settings.ctaCard.subtitle || ""}
                  onChange={(e) =>
                    handleCtaCardChange("subtitle", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Highlight Text</Label>
                <Input
                  className="text-sm"
                  value={settings.ctaCard.highlightText || ""}
                  onChange={(e) =>
                    handleCtaCardChange(
                      "highlightText",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Primary Button Text</Label>
                <Input
                  className="text-sm"
                  value={settings.ctaCard.primaryButtonText || ""}
                  onChange={(e) =>
                    handleCtaCardChange(
                      "primaryButtonText",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">WhatsApp Number</Label>
                <Input
                  className="text-sm"
                  value={settings.ctaCard.whatsappNumber || ""}
                  onChange={(e) =>
                    handleCtaCardChange(
                      "whatsappNumber",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">WhatsApp Text</Label>
                <Input
                  className="text-sm"
                  value={settings.ctaCard.whatsappText || ""}
                  onChange={(e) =>
                    handleCtaCardChange(
                      "whatsappText",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="grid gap-2 md:grid-cols-3">
              <div className="space-y-1">
                <Label className="text-xs">Secondary Button Text</Label>
                <Input
                  className="text-sm"
                  value={settings.ctaCard.secondaryButtonText || ""}
                  onChange={(e) =>
                    handleCtaCardChange(
                      "secondaryButtonText",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Agents Count</Label>
                <Input
                  className="text-sm"
                  type="number"
                  value={settings.ctaCard.agentsCount ?? 0}
                  onChange={(e) =>
                    handleCtaCardChange(
                      "agentsCount",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Agents Label</Label>
                <Input
                  className="text-sm"
                  value={settings.ctaCard.agentsLabel || ""}
                  onChange={(e) =>
                    handleCtaCardChange(
                      "agentsLabel",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
            <div className="space-y-1 md:w-1/2">
              <Label className="text-xs">Verify Label</Label>
              <Input
                className="text-sm"
                value={settings.ctaCard.verifyLabel || ""}
                onChange={(e) =>
                  handleCtaCardChange("verifyLabel", e.target.value)
                }
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminHeroPage;