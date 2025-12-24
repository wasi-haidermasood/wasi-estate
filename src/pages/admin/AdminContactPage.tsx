// src/pages/admin/AdminContactPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const API_BASE = "http://localhost:5000/api";

interface PhoneNumberRow {
  icon: string;       // "Phone", "Headphones", etc.
  label: string;
  number: string;
  href: string;
}

interface BusinessHourRow {
  label: string;
  value: string;
}

interface HeaderConfig {
  badgeText?: string;
  title?: string;
  subtitle?: string;
}

interface OfficeConfig {
  title?: string;
  addressLines?: string[];
  mapsSearchUrl?: string;
}

interface BusinessHoursConfig {
  rows?: BusinessHourRow[];
}

interface MapConfig {
  title?: string;
  subtitle?: string;
  mapsSearchUrl?: string;
  embedSrc?: string;
}

interface BottomCtaConfig {
  title?: string;
  subtitle?: string;
  primaryPhoneLabel?: string;
  primaryPhoneHref?: string;
  whatsappLabel?: string;
  whatsappHref?: string;
}

interface ContactSettings {
  _id?: string;
  __v?: number;
  header?: HeaderConfig;
  phoneNumbers?: PhoneNumberRow[];
  office?: OfficeConfig;
  businessHours?: BusinessHoursConfig;
  benefits?: string[];
  map?: MapConfig;
  bottomCta?: BottomCtaConfig;
}

const AdminContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<ContactSettings | null>(null);
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

  // Load current contact settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/contact`);
        if (!res.ok) throw new Error("Failed to load contact settings");
        const data: ContactSettings = await res.json();

        data.header = data.header || {};
        data.phoneNumbers = data.phoneNumbers || [];
        data.office = data.office || {};
        data.office.addressLines = data.office.addressLines || [];
        data.businessHours = data.businessHours || {};
        data.businessHours.rows = data.businessHours.rows || [];
        data.benefits = data.benefits || [];
        data.map = data.map || {};
        data.bottomCta = data.bottomCta || {};

        setSettings(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load contact settings");
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  // ---- helpers ----
  const updateHeader = (field: keyof HeaderConfig, value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      header: {
        ...(settings.header || {}),
        [field]: value,
      },
    });
  };

  const updateOffice = (field: keyof OfficeConfig, value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      office: {
        ...(settings.office || {}),
        [field]: value,
      },
    });
  };

  const updateOfficeAddressLines = (value: string) => {
    if (!settings) return;
    const lines = value
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    setSettings({
      ...settings,
      office: {
        ...(settings.office || {}),
        addressLines: lines,
      },
    });
  };

  const updateBusinessHoursRow = (
    index: number,
    field: keyof BusinessHourRow,
    value: string
  ) => {
    if (!settings) return;
    const rows = [...(settings.businessHours?.rows || [])];
    rows[index] = {
      ...rows[index],
      [field]: value,
    };
    setSettings({
      ...settings,
      businessHours: {
        ...(settings.businessHours || {}),
        rows,
      },
    });
  };

  const addBusinessHoursRow = () => {
    if (!settings) return;
    const rows = [...(settings.businessHours?.rows || []), { label: "", value: "" }];
    setSettings({
      ...settings,
      businessHours: {
        ...(settings.businessHours || {}),
        rows,
      },
    });
  };

  const removeBusinessHoursRow = (index: number) => {
    if (!settings) return;
    const rows = (settings.businessHours?.rows || []).filter((_, i) => i !== index);
    setSettings({
      ...settings,
      businessHours: {
        ...(settings.businessHours || {}),
        rows,
      },
    });
  };

  const updatePhoneNumber = (
    index: number,
    field: keyof PhoneNumberRow,
    value: string
  ) => {
    if (!settings) return;
    const phoneNumbers = [...(settings.phoneNumbers || [])];
    phoneNumbers[index] = {
      ...phoneNumbers[index],
      [field]: value,
    };
    setSettings({ ...settings, phoneNumbers });
  };

  const addPhoneNumber = () => {
    if (!settings) return;
    const phoneNumbers = [
      ...(settings.phoneNumbers || []),
      { icon: "Phone", label: "", number: "", href: "" },
    ];
    setSettings({ ...settings, phoneNumbers });
  };

  const removePhoneNumber = (index: number) => {
    if (!settings) return;
    const phoneNumbers = (settings.phoneNumbers || []).filter((_, i) => i !== index);
    setSettings({ ...settings, phoneNumbers });
  };

  const updateBenefits = (value: string) => {
    if (!settings) return;
    const benefits = value
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean);
    setSettings({ ...settings, benefits });
  };

  const updateMap = (field: keyof MapConfig, value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      map: {
        ...(settings.map || {}),
        [field]: value,
      },
    });
  };

  const updateBottomCta = (field: keyof BottomCtaConfig, value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      bottomCta: {
        ...(settings.bottomCta || {}),
        [field]: value,
      },
    });
  };

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

      const res = await fetch(`${API_BASE}/contact`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to save contact settings");
      }

      const updated: ContactSettings = await res.json();
      setSettings(updated);
      setSuccess("Contact settings updated successfully");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save contact settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading contact settings...</p>
      </div>
    );
  }

  const officeAddressText = (settings.office?.addressLines || []).join("\n");
  const benefitsText = (settings.benefits || []).join("\n");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Contact Page Settings</h1>
          <p className="text-xs text-slate-500">
            Edit phone numbers, office info, business hours and map.
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
        <div className="max-w-5xl mx-auto space-y-6">
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

          {/* Header */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">Header</h2>
            <div className="grid md:grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Badge Text</Label>
                <Input
                  className="text-sm"
                  value={settings.header?.badgeText || ""}
                  onChange={(e) => updateHeader("badgeText", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Title</Label>
                <Input
                  className="text-sm"
                  value={settings.header?.title || ""}
                  onChange={(e) => updateHeader("title", e.target.value)}
                />
              </div>
              <div className="space-y-1 md:col-span-3">
                <Label className="text-xs">Subtitle</Label>
                <Textarea
                  className="text-sm"
                  rows={2}
                  value={settings.header?.subtitle || ""}
                  onChange={(e) => updateHeader("subtitle", e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Phone numbers */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Phone Numbers</h2>
              <Button
                variant="outline"
                size="sm"
                className="text-[11px]"
                onClick={addPhoneNumber}
              >
                Add Number
              </Button>
            </div>
            <p className="text-[11px] text-slate-500">
              Icon name must match what your frontend supports (e.g. &quot;Phone&quot;,
              &quot;Headphones&quot;).
            </p>
            <div className="space-y-2">
              {(settings.phoneNumbers || []).map((n, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-md p-2 grid gap-2 md:grid-cols-4"
                >
                  <div className="space-y-1">
                    <Label className="text-[11px]">Icon Name</Label>
                    <Input
                      className="text-xs"
                      value={n.icon || ""}
                      onChange={(e) =>
                        updatePhoneNumber(index, "icon", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Label</Label>
                    <Input
                      className="text-xs"
                      value={n.label || ""}
                      onChange={(e) =>
                        updatePhoneNumber(index, "label", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Number</Label>
                    <Input
                      className="text-xs"
                      value={n.number || ""}
                      onChange={(e) =>
                        updatePhoneNumber(index, "number", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Href (tel: or wa:)</Label>
                    <div className="flex gap-2">
                      <Input
                        className="text-xs"
                        value={n.href || ""}
                        onChange={(e) =>
                          updatePhoneNumber(index, "href", e.target.value)
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removePhoneNumber(index)}
                      >
                        X
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {(settings.phoneNumbers || []).length === 0 && (
                <p className="text-[11px] text-slate-500">No phone numbers yet.</p>
              )}
            </div>
          </section>

          {/* Office */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">Office</h2>
            <div className="space-y-1">
              <Label className="text-xs">Title</Label>
              <Input
                className="text-sm"
                value={settings.office?.title || ""}
                onChange={(e) => updateOffice("title", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Address Lines (one per line)</Label>
              <Textarea
                className="text-sm"
                rows={3}
                value={officeAddressText}
                onChange={(e) => updateOfficeAddressLines(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Google Maps Search URL</Label>
              <Input
                className="text-sm"
                value={settings.office?.mapsSearchUrl || ""}
                onChange={(e) =>
                  updateOffice("mapsSearchUrl", e.target.value)
                }
              />
            </div>
          </section>

          {/* Business hours */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Business Hours
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="text-[11px]"
                onClick={addBusinessHoursRow}
              >
                Add Row
              </Button>
            </div>
            <div className="space-y-2">
              {(settings.businessHours?.rows || []).map((row, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-md p-2 grid gap-2 md:grid-cols-3"
                >
                  <div className="space-y-1">
                    <Label className="text-[11px]">Label</Label>
                    <Input
                      className="text-xs"
                      value={row.label || ""}
                      onChange={(e) =>
                        updateBusinessHoursRow(index, "label", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label className="text-[11px]">Value</Label>
                    <div className="flex gap-2">
                      <Input
                        className="text-xs"
                        value={row.value || ""}
                        onChange={(e) =>
                          updateBusinessHoursRow(index, "value", e.target.value)
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeBusinessHoursRow(index)}
                      >
                        X
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {(settings.businessHours?.rows || []).length === 0 && (
                <p className="text-[11px] text-slate-500">No rows yet.</p>
              )}
            </div>
          </section>

          {/* Benefits */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Benefits List (Right Side Green Box)
            </h2>
            <div className="space-y-1">
              <Label className="text-xs">
                Benefits (one per line, e.g. &quot;Free Property Consultation&quot;)
              </Label>
              <Textarea
                className="text-sm"
                rows={4}
                value={benefitsText}
                onChange={(e) => updateBenefits(e.target.value)}
              />
            </div>
          </section>

          {/* Map */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Google Map Section
            </h2>
            <div className="grid md:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Title</Label>
                <Input
                  className="text-sm"
                  value={settings.map?.title || ""}
                  onChange={(e) => updateMap("title", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Subtitle</Label>
                <Input
                  className="text-sm"
                  value={settings.map?.subtitle || ""}
                  onChange={(e) => updateMap("subtitle", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Maps Search URL (for &quot;Open in Maps&quot;)</Label>
              <Input
                className="text-sm"
                value={settings.map?.mapsSearchUrl || ""}
                onChange={(e) => updateMap("mapsSearchUrl", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Embed Iframe Src</Label>
              <Textarea
                className="text-xs"
                rows={3}
                value={settings.map?.embedSrc || ""}
                onChange={(e) => updateMap("embedSrc", e.target.value)}
              />
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Bottom Call-to-Action
            </h2>
            <div className="space-y-1">
              <Label className="text-xs">Title</Label>
              <Input
                className="text-sm"
                value={settings.bottomCta?.title || ""}
                onChange={(e) => updateBottomCta("title", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Subtitle</Label>
              <Textarea
                className="text-sm"
                rows={2}
                value={settings.bottomCta?.subtitle || ""}
                onChange={(e) => updateBottomCta("subtitle", e.target.value)}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Primary Phone Label</Label>
                <Input
                  className="text-sm"
                  value={settings.bottomCta?.primaryPhoneLabel || ""}
                  onChange={(e) =>
                    updateBottomCta("primaryPhoneLabel", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Primary Phone Href (tel:)</Label>
                <Input
                  className="text-sm"
                  value={settings.bottomCta?.primaryPhoneHref || ""}
                  onChange={(e) =>
                    updateBottomCta("primaryPhoneHref", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">WhatsApp Label</Label>
                <Input
                  className="text-sm"
                  value={settings.bottomCta?.whatsappLabel || ""}
                  onChange={(e) =>
                    updateBottomCta("whatsappLabel", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">WhatsApp Href (https://wa.me/...)</Label>
                <Input
                  className="text-sm"
                  value={settings.bottomCta?.whatsappHref || ""}
                  onChange={(e) =>
                    updateBottomCta("whatsappHref", e.target.value)
                  }
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminContactPage;