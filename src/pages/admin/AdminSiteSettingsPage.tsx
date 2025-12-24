// src/pages/admin/AdminSiteSettingsPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const API_BASE = "http://localhost:5000/api";

interface SiteSettings {
  _id?: string;
  baseUrl: string;
  sitemapEnabled: boolean;
  robotsContent: string;
  createdAt?: string;
  updatedAt?: string;
}

const AdminSiteSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
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
        const token = localStorage.getItem("adminToken");
        if (!token) {
          navigate("/admin/login");
          return;
        }

        const res = await fetch(`${API_BASE}/site-settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to load site settings");

        const data: SiteSettings = await res.json();
        setSettings(data);
        setError(null);
      } catch (err ) {
        console.error(err);
        setError(err.message || "Failed to load site settings");
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, [navigate]);

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

      const { _id, ...payload } = settings;

      const res = await fetch(`${API_BASE}/site-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to save site settings");
      }

      const updated = await res.json();
      setSettings(updated);
      setSuccess("Site settings updated successfully");
    } catch (err ) {
      console.error(err);
      setError(err.message || "Failed to save site settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading site settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            Site &amp; SEO Settings
          </h1>
          <p className="text-xs text-slate-500">
            Control sitemap.xml and robots.txt from here.
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
        <div className="max-w-4xl mx-auto space-y-4">
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

          {/* Base URL */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Public Site URL
            </h2>
            <p className="text-[11px] text-slate-500">
              This is used in sitemap.xml links (e.g. https://yourdomain.com).
              For localhost, you can keep it as http://localhost:8080. When you
              buy a domain and go live, update it here.
            </p>
            <div className="space-y-1">
              <Label className="text-xs">Base URL</Label>
              <Input
                className="text-sm"
                value={settings.baseUrl}
                onChange={(e) =>
                  setSettings({ ...settings, baseUrl: e.target.value })
                }
              />
            </div>
          </section>

          {/* Sitemap */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Sitemap (sitemap.xml)
            </h2>
            <p className="text-[11px] text-slate-500">
              Enable when you are live and want search engines to discover your
              pages. If disabled or base URL is empty, /sitemap.xml will return
              404.
            </p>
            <div className="space-y-1">
              <Label className="text-xs">Sitemap Enabled</Label>
              <select
                className="border border-slate-300 rounded px-2 py-1 text-xs w-full max-w-xs"
                value={settings.sitemapEnabled ? "yes" : "no"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    sitemapEnabled: e.target.value === "yes",
                  })
                }
              >
                <option value="no">No (disabled)</option>
                <option value="yes">Yes (enabled)</option>
              </select>
            </div>
          </section>

          {/* Robots.txt */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-2">
            <h2 className="text-sm font-semibold text-slate-900">
              robots.txt
            </h2>
            <p className="text-[11px] text-slate-500">
              This file tells search engines what they are allowed to crawl.
              Default right now is <code>Disallow: /</code> (block everything).
              When you go live, you can change it to allow indexing and include
              your sitemap URL.
            </p>
            <div className="space-y-1">
              <Label className="text-xs">robots.txt Content</Label>
              <Textarea
                className="text-xs font-mono"
                rows={8}
                value={settings.robotsContent}
                onChange={(e) =>
                  setSettings({ ...settings, robotsContent: e.target.value })
                }
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Example for live site:
              <br />
              <code>
                User-agent: *{"\n"}
                Disallow:{"\n"}
                {"\n"}
                Sitemap: https://yourdomain.com/sitemap.xml
              </code>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminSiteSettingsPage;