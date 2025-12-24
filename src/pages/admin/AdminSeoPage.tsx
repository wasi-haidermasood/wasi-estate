// src/pages/admin/AdminSeoPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE } from "@/lib/config";

const res = await fetch(`${API_BASE}/posts`);
interface MetaConfig {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  canonicalUrl?: string;
}

interface OpenGraphConfig {
  ogType?: string;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

interface TwitterConfig {
  card?: string;
  title?: string;
  description?: string;
  image?: string;
}

interface SeoSettings {
  _id?: string;
  __v?: number;
  meta?: MetaConfig;
  openGraph?: OpenGraphConfig;
  twitter?: TwitterConfig;
  structuredData?: string;
}

const AdminSeoPage: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SeoSettings | null>(null);
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

  // Load SEO settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/seo`);
        if (!res.ok) throw new Error("Failed to load SEO settings");
        const data: SeoSettings = await res.json();

        data.meta = data.meta || {};
        data.openGraph = data.openGraph || {};
        data.twitter = data.twitter || {};
        data.structuredData = data.structuredData || "";

        setSettings(data);
        setError(null);
      } catch (err ) {
        console.error(err);
        setError(err.message || "Failed to load SEO settings");
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const updateMeta = (field: keyof MetaConfig, value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      meta: {
        ...(settings.meta || {}),
        [field]: value,
      },
    });
  };

  const updateOG = (field: keyof OpenGraphConfig, value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      openGraph: {
        ...(settings.openGraph || {}),
        [field]: value,
      },
    });
  };

  const updateTwitter = (field: keyof TwitterConfig, value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      twitter: {
        ...(settings.twitter || {}),
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

      const res = await fetch(`${API_BASE}/seo`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to save SEO settings");
      }

      const updated: SeoSettings = await res.json();
      setSettings(updated);
      setSuccess("SEO settings updated successfully");
    } catch (err ) {
      console.error(err);
      setError(err.message || "Failed to save SEO settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading SEO settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            SEO & Meta Settings
          </h1>
          <p className="text-xs text-slate-500">
            Edit global meta tags, Open Graph, Twitter cards and structured
            data.
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

          {/* Meta */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Basic Meta Tags
            </h2>
            <div className="space-y-1">
              <Label className="text-xs">Title (&lt;title&gt;)</Label>
              <Input
                className="text-sm"
                value={settings.meta?.title || ""}
                onChange={(e) => updateMeta("title", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Description</Label>
              <Textarea
                className="text-sm"
                rows={3}
                value={settings.meta?.description || ""}
                onChange={(e) => updateMeta("description", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Keywords (comma-separated)</Label>
              <Input
                className="text-sm"
                value={settings.meta?.keywords || ""}
                onChange={(e) => updateMeta("keywords", e.target.value)}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Author</Label>
                <Input
                  className="text-sm"
                  value={settings.meta?.author || ""}
                  onChange={(e) => updateMeta("author", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Canonical URL</Label>
                <Input
                  className="text-sm"
                  value={settings.meta?.canonicalUrl || ""}
                  onChange={(e) =>
                    updateMeta("canonicalUrl", e.target.value)
                  }
                />
              </div>
            </div>
          </section>

          {/* Open Graph */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Open Graph (Facebook / Social Sharing)
            </h2>
            <div className="grid md:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">og:type</Label>
                <div className="space-y-1">
  <Label className="text-xs">og:type</Label>
  <Input
    className="text-sm"
    value={settings.openGraph?.ogType || ""}
    onChange={(e) => updateOG("ogType", e.target.value)}
    placeholder="website"
  />
</div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">og:url</Label>
                <Input
                  className="text-sm"
                  value={settings.openGraph?.url || ""}
                  onChange={(e) => updateOG("url", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">og:title</Label>
              <Input
                className="text-sm"
                value={settings.openGraph?.title || ""}
                onChange={(e) => updateOG("title", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">og:description</Label>
              <Textarea
                className="text-sm"
                rows={3}
                value={settings.openGraph?.description || ""}
                onChange={(e) => updateOG("description", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">og:image</Label>
              <Input
                className="text-sm"
                value={settings.openGraph?.image || ""}
                onChange={(e) => updateOG("image", e.target.value)}
                placeholder="https://example.com/og-image.jpg"
              />
            </div>
          </section>

          {/* Twitter */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Twitter Card
            </h2>
            <div className="space-y-1">
              <Label className="text-xs">twitter:card</Label>
              <Input
                className="text-sm"
                value={settings.twitter?.card || ""}
                onChange={(e) => updateTwitter("card", e.target.value)}
                placeholder="summary_large_image"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">twitter:title</Label>
              <Input
                className="text-sm"
                value={settings.twitter?.title || ""}
                onChange={(e) => updateTwitter("title", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">twitter:description</Label>
              <Textarea
                className="text-sm"
                rows={3}
                value={settings.twitter?.description || ""}
                onChange={(e) =>
                  updateTwitter("description", e.target.value)
                }
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">twitter:image</Label>
              <Input
                className="text-sm"
                value={settings.twitter?.image || ""}
                onChange={(e) => updateTwitter("image", e.target.value)}
              />
            </div>
          </section>

          {/* Structured Data */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Structured Data (JSON-LD)
            </h2>
            <p className="text-[11px] text-slate-500 mb-1">
              Paste valid JSON-LD here. It will be injected into{" "}
              {`<script type="application/ld+json">`} in the &lt;head&gt;.
            </p>
            <Textarea
              className="text-xs font-mono"
              rows={12}
              value={settings.structuredData || ""}
              onChange={(e) =>
                setSettings((prev) =>
                  prev ? { ...prev, structuredData: e.target.value } : prev
                )
              }
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminSeoPage;