// src/pages/admin/AdminPagesPage.tsx
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE } from "@/lib/config";


const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
];

type PageStatus = "draft" | "published";

interface CmsPage {
  _id?: string;
  title: string;
  slug: string;
  body: string;
  status: PageStatus;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
  createdAt?: string;
  updatedAt?: string;

  // NEW: nav/footer controls
  showInNav?: boolean;
  navLabel?: string;
  navOrder?: number;

  showInFooter?: boolean;
  footerLabel?: string;
  footerOrder?: number;
}

const emptyPage: CmsPage = {
  title: "",
  slug: "",
  body: "",
  status: "draft",
  seoTitle: "",
  seoDescription: "",
  seoImage: "",
  showInNav: false,
  navLabel: "",
  navOrder: 0,
  showInFooter: false,
  footerLabel: "",
  footerOrder: 0,
};

const AdminPagesPage: React.FC = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<CmsPage>(emptyPage);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [isNew, setIsNew] = useState(true);
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

  // Load pages
  useEffect(() => {
    async function fetchPages() {
      try {
        setLoading(true);
        const token = localStorage.getItem("adminToken");
        if (!token) {
          navigate("/admin/login");
          return;
        }

        const res = await fetch(`${API_BASE}/pages/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to load pages");

        const data: CmsPage[] = await res.json();
        setPages(data);

        if (data.length > 0) {
          const first = data[0];
          setSelectedId(first._id || null);
          // merge with defaults so new fields aren’t undefined
          setForm({ ...emptyPage, ...first });
          setIsNew(false);
        } else {
          resetToNew();
        }

        setError(null);
      } catch (err ) {
        console.error(err);
        setError(err.message || "Failed to load pages");
      } finally {
        setLoading(false);
      }
    }

    fetchPages();
  }, [navigate]);

  const resetToNew = () => {
    setSelectedId(null);
    setForm(emptyPage);
    setIsNew(true);
    setSuccess(null);
    setError(null);
  };

  const handleSelectPage = (page: CmsPage) => {
    setSelectedId(page._id || null);
    setForm({ ...emptyPage, ...page });
    setIsNew(false);
    setSuccess(null);
    setError(null);
  };

  const updateField = (field: keyof CmsPage, value: string) => {
    if (field === "status") {
      setForm({ ...form, status: value as PageStatus });
    } else if (field === "showInNav") {
      setForm({ ...form, showInNav: value === "true" });
    } else if (field === "showInFooter") {
      setForm({ ...form, showInFooter: value === "true" });
    } else if (field === "navOrder") {
      setForm({ ...form, navOrder: parseInt(value || "0", 10) });
    } else if (field === "footerOrder") {
      setForm({ ...form, footerOrder: parseInt(value || "0", 10) });
    } else {
      setForm({ ...form, [field]: value } as CmsPage);
    }
  };

  const reloadPages = async (selectId?: string | null) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    const res = await fetch(`${API_BASE}/pages/admin`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data: CmsPage[] = await res.json();
    setPages(data);

    if (!data.length) {
      resetToNew();
      return;
    }

    if (selectId) {
      const found = data.find((p) => p._id === selectId);
      if (found) {
        handleSelectPage(found);
        return;
      }
    }

    handleSelectPage(data[0]);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    if (!form.title || !form.slug) {
      setError("Title and slug are required");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const payload = { ...form };

      let res: Response;
      if (isNew || !selectedId) {
        res = await fetch(`${API_BASE}/pages/admin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/pages/admin/${selectedId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to save page");
      }

      const saved = (await res.json()) as CmsPage;
      setSuccess(isNew ? "Page created successfully" : "Page updated successfully");
      await reloadPages(saved._id || null);
      setIsNew(false);
    } catch (err ) {
      console.error(err);
      setError(err.message || "Failed to save page");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token || !selectedId) return;

    if (!window.confirm("Delete this page?")) return;

    try {
      setDeleting(true);
      setError(null);
      setSuccess(null);

      const res = await fetch(`${API_BASE}/pages/admin/${selectedId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to delete page");
      }

      setSuccess("Page deleted successfully");
      await reloadPages();
    } catch (err ) {
      console.error(err);
      setError(err.message || "Failed to delete page");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading pages...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Page Builder</h1>
          <p className="text-xs text-slate-500">
            Create and manage static pages like Privacy Policy, Terms of
            Service, etc.
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
            {saving ? "Saving..." : isNew ? "Create Page" : "Save Changes"}
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="p-4">
        <div className="max-w-6xl mx-auto grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {/* Left: list of pages */}
          <section className="bg-white rounded-lg border border-slate-200 p-3 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-900">
                All Pages
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={resetToNew}
              >
                + New Page
              </Button>
            </div>

            <div className="border border-slate-200 rounded-md divide-y divide-slate-200 max-h-[500px] overflow-auto">
              {pages.map((p) => {
                const date = p.updatedAt || p.createdAt;
                const labelDate = date
                  ? new Date(date).toLocaleDateString()
                  : "";

                return (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => handleSelectPage(p)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      selectedId === p._id ? "bg-slate-100" : "bg-white"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {p.title || "(No title)"}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        /pages/{p.slug} ·{" "}
                        {p.status === "published" ? "Published" : "Draft"}
                        {labelDate && ` · ${labelDate}`}
                      </p>
                    </div>
                  </button>
                );
              })}

              {pages.length === 0 && (
                <div className="px-3 py-2 text-xs text-slate-500">
                  No pages yet. Click &quot;New Page&quot; to create one.
                </div>
              )}
            </div>
          </section>

          {/* Right: editor */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
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

            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                {isNew ? "Create New Page" : "Edit Page"}
              </h2>
              {!isNew && selectedId && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Title</Label>
                <Input
                  className="text-sm"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Slug (URL part)</Label>
                <Input
                  className="text-sm"
                  value={form.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                />
                <p className="text-[11px] text-slate-500">
                  Example: &quot;privacy-policy&quot; → /pages/privacy-policy
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Status</Label>
                <select
                  className="border border-slate-300 rounded px-2 py-1 text-xs w-full"
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* SEO */}
            <div className="border border-slate-200 rounded-md p-3 space-y-2 bg-slate-50/60">
              <h3 className="text-xs font-semibold text-slate-900">
                SEO Settings (Optional)
              </h3>
              <div className="space-y-1">
                <Label className="text-xs">SEO Title</Label>
                <Input
                  className="text-sm"
                  value={form.seoTitle || ""}
                  onChange={(e) => updateField("seoTitle", e.target.value)}
                  placeholder="Custom <title> text for this page"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">SEO Description</Label>
                <Textarea
                  className="text-sm"
                  rows={2}
                  value={form.seoDescription || ""}
                  onChange={(e) =>
                    updateField("seoDescription", e.target.value)
                  }
                  placeholder="Short description for search engines."
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">SEO Image URL</Label>
                <Input
                  className="text-sm"
                  value={form.seoImage || ""}
                  onChange={(e) => updateField("seoImage", e.target.value)}
                  placeholder="Image for OG/Twitter cards (optional)"
                />
              </div>
            </div>

            {/* Navigation & Footer visibility */}
            <div className="border border-slate-200 rounded-md p-3 space-y-3 bg-slate-50/60">
              <h3 className="text-xs font-semibold text-slate-900">
                Navigation &amp; Footer Links
              </h3>

              {/* Navbar */}
              <div className="space-y-1">
                <Label className="text-xs">Show in Navbar</Label>
                <select
                  className="border border-slate-300 rounded px-2 py-1 text-xs w-full max-w-xs"
                  value={form.showInNav ? "yes" : "no"}
                  onChange={(e) =>
                    updateField(
                      "showInNav",
                      e.target.value === "yes" ? "true" : "false"
                    )
                  }
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Navbar Label</Label>
                  <Input
                    className="text-sm"
                    value={form.navLabel || ""}
                    onChange={(e) => updateField("navLabel", e.target.value)}
                    placeholder="e.g. Privacy Policy"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Navbar Order</Label>
                  <Input
                    className="text-sm"
                    type="number"
                    value={form.navOrder ?? 0}
                    onChange={(e) =>
                      updateField(
                        "navOrder",
                        String(parseInt(e.target.value || "0", 10))
                      )
                    }
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="space-y-1 pt-2 border-t border-slate-200">
                <Label className="text-xs">Show in Footer</Label>
                <select
                  className="border border-slate-300 rounded px-2 py-1 text-xs w-full max-w-xs"
                  value={form.showInFooter ? "yes" : "no"}
                  onChange={(e) =>
                    updateField(
                      "showInFooter",
                      e.target.value === "yes" ? "true" : "false"
                    )
                  }
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Footer Label</Label>
                  <Input
                    className="text-sm"
                    value={form.footerLabel || ""}
                    onChange={(e) =>
                      updateField("footerLabel", e.target.value)
                    }
                    placeholder="e.g. Terms of Service"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Footer Order</Label>
                  <Input
                    className="text-sm"
                    type="number"
                    value={form.footerOrder ?? 0}
                    onChange={(e) =>
                      updateField(
                        "footerOrder",
                        String(parseInt(e.target.value || "0", 10))
                      )
                    }
                  />
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="space-y-1">
              <Label className="text-xs">Page Content</Label>
              <div className="border border-slate-200 rounded-md">
                <ReactQuill
                  theme="snow"
                  value={form.body}
                  onChange={(content) => updateField("body", content)}
                  modules={quillModules}
                  formats={quillFormats}
                  className="text-sm"
                  style={{ minHeight: 220 }}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Use this editor to write your Privacy Policy, Terms of Service,
                FAQ, etc.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminPagesPage;