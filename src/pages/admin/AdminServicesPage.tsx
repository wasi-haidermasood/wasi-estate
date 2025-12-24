// src/pages/admin/AdminServicesPage.tsx
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // or a <textarea> if you don't have this

import { API_BASE } from "@/lib/config";


const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
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
  "image",
];

type ServiceKind = "main" | "additional";

interface Service {
  _id?: string;
  slug: string;
  kind: ServiceKind;
  icon: string;
  title: string;
  shortDescription: string;
  features: string[];
  image: string;
  commission: string;
  color: string;
  body: string;

  // NEW SEO FIELDS
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
}

interface ServicesResponse {
  main: Service[];
  additional: Service[];
}

const emptyService: Service = {
  slug: "",
  kind: "main",
  icon: "",
  title: "",
  shortDescription: "",
  features: [],
  image: "",
  commission: "",
  color: "",
  body: "",

  seoTitle: "",
  seoDescription: "",
  seoImage: "",
};
const AdminServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );
  const [form, setForm] = useState<Service>(emptyService);
  const [featuresText, setFeaturesText] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(true);

  // Protect route
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
  }, [navigate]);

  // Load services
  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/services`);
        if (!res.ok) throw new Error("Failed to load services");

        const data: ServicesResponse = await res.json();
        const all = [...data.main, ...data.additional];
        setServices(all);
        setError(null);

        if (all.length > 0) {
          // Select first by default
          const first = all[0];
          setSelectedServiceId(first._id || null);
          setForm(first);
          setFeaturesText((first.features || []).join("\n"));
          setIsCreatingNew(false);
        } else {
          // No services yet
          setSelectedServiceId(null);
          setForm(emptyService);
          setFeaturesText("");
          setIsCreatingNew(true);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load services");
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  const token = localStorage.getItem("adminToken");

  // ---- Helpers ----

  const resetFormToNew = () => {
  setSelectedServiceId(null);
  setForm(emptyService);
  setFeaturesText("");
  setIsCreatingNew(true);
  setSuccess(null);
  setError(null);
};

const handleSelectService = (service: Service) => {
  setSelectedServiceId(service._id || null);
  setForm({
    ...emptyService,
    ...service,
  });
  setFeaturesText((service.features || []).join("\n"));
  setIsCreatingNew(false);
  setSuccess(null);
  setError(null);
};

  const updateFormField = (field: keyof Service, value: string) => {
    if (field === "kind") {
      setForm({ ...form, [field]: value as ServiceKind });
    } else {
      setForm({ ...form, [field]: value });
    }
  };

  const buildPayload = (): Service => {
    const featuresArray = featuresText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    return {
      ...form,
      features: featuresArray,
    };
  };

  const reloadServices = async (selectId?: string | null) => {
    const res = await fetch(`${API_BASE}/services`);
    const data: ServicesResponse = await res.json();
    const all = [...data.main, ...data.additional];
    setServices(all);

    if (!all.length) {
      resetFormToNew();
      return;
    }

    if (selectId) {
      const found = all.find((s) => s._id === selectId);
      if (found) {
        handleSelectService(found);
        return;
      }
    }

    // default
    handleSelectService(all[0]);
  };

  // ---- Save (create or update) ----
  const handleSave = async () => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const payload = buildPayload();

    // Basic validation
    if (!payload.slug || !payload.title) {
      setError("Slug and Title are required");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      let res: Response;

      if (isCreatingNew || !selectedServiceId) {
        // Create
        res = await fetch(`${API_BASE}/services`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Update
        res = await fetch(`${API_BASE}/services/${selectedServiceId}`, {
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
        throw new Error(text || "Failed to save service");
      }

      const saved = (await res.json()) as Service;
      setSuccess(
        isCreatingNew
          ? "Service created successfully"
          : "Service updated successfully"
      );

      // Reload list, select updated/created
      await reloadServices(saved._id || null);
      setIsCreatingNew(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  // ---- Delete ----
  const handleDelete = async () => {
    if (!token || !selectedServiceId) {
      return;
    }

    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      setDeleting(true);
      setError(null);
      setSuccess(null);

      const res = await fetch(`${API_BASE}/services/${selectedServiceId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to delete service");
      }

      setSuccess("Service deleted successfully");
      await reloadServices();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete service");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading services...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            Services Management
          </h1>
          <p className="text-xs text-slate-500">
            Create, update and remove services for Wasi Estate & Builders.
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
            {saving
              ? "Saving..."
              : isCreatingNew
              ? "Create Service"
              : "Save Changes"}
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="p-4">
        <div className="max-w-6xl mx-auto grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {/* Left: list of services */}
          <section className="bg-white rounded-lg border border-slate-200 p-3 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-900">
                All Services
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={resetFormToNew}
              >
                + New Service
              </Button>
            </div>

            <div className="border border-slate-200 rounded-md divide-y divide-slate-200 max-h-[500px] overflow-auto">
              {services.map((svc) => (
                <button
                  key={svc._id}
                  type="button"
                  onClick={() => handleSelectService(svc)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                    selectedServiceId === svc._id
                      ? "bg-slate-100"
                      : "bg-white"
                  }`}
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {svc.title || "(No title)"}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      /{svc.slug} · {svc.kind === "main" ? "Main" : "Additional"}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {svc.icon}
                  </span>
                </button>
              ))}
              {services.length === 0 && (
                <div className="px-3 py-2 text-xs text-slate-500">
                  No services found. Click &quot;New Service&quot; to create
                  one.
                </div>
              )}
            </div>
          </section>

          {/* Right: form */}
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
                {isCreatingNew || !selectedServiceId
                  ? "Create New Service"
                  : "Edit Service"}
              </h2>
              {!isCreatingNew && selectedServiceId && (
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
                <Label className="text-xs">Slug (URL)</Label>
                <Input
                  className="text-sm"
                  value={form.slug}
                  onChange={(e) =>
                    updateFormField("slug", e.target.value)
                  }
                />
                <p className="text-[11px] text-slate-500">
                  Example: &quot;property-sales&quot;. Must be unique.
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Kind</Label>
                <select
                  className="border border-slate-300 rounded px-2 py-1 text-xs w-full"
                  value={form.kind}
                  onChange={(e) =>
                    updateFormField("kind", e.target.value)
                  }
                >
                  <option value="main">Main</option>
                  <option value="additional">Additional</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Icon Name</Label>
                <Input
                  className="text-sm"
                  value={form.icon}
                  onChange={(e) =>
                    updateFormField("icon", e.target.value)
                  }
                />
                <p className="text-[11px] text-slate-500">
                  Icon key used in your UI (e.g. &quot;Home&quot;,
                  &quot;Building2&quot;).
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Title</Label>
                <Input
                  className="text-sm"
                  value={form.title}
                  onChange={(e) =>
                    updateFormField("title", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Short Description</Label>
              <Textarea
                className="text-sm"
                rows={2}
                value={form.shortDescription}
                onChange={(e) =>
                  updateFormField("shortDescription", e.target.value)
                }
              />
              <p className="text-[11px] text-slate-500">
                Shown on service cards on the homepage.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs">Image URL</Label>
                <Input
                  className="text-sm"
                  value={form.image}
                  onChange={(e) =>
                    updateFormField("image", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Commission Text</Label>
                <Input
                  className="text-sm"
                  value={form.commission}
                  onChange={(e) =>
                    updateFormField("commission", e.target.value)
                  }
                />
                <p className="text-[11px] text-slate-500">
                  Example: &quot;Only 1% Commission&quot;.
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Color (Gradient / Tailwind)</Label>
              <Input
                className="text-sm"
                value={form.color}
                onChange={(e) =>
                  updateFormField("color", e.target.value)
                }
              />
              <p className="text-[11px] text-slate-500">
                Example: &quot;from-blue-500 to-blue-600&quot; for gradient
                background.
              </p>
            </div>
            {/* SEO Settings */}
<div className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50/60">
  <h3 className="text-xs font-semibold text-slate-900">
    SEO Settings (Optional)
  </h3>
  <p className="text-[11px] text-slate-500">
    If left empty, the service page will use the title, short description and
    image as defaults for search engines and social sharing.
  </p>

  <div className="space-y-1">
    <Label className="text-xs">SEO Title</Label>
    <Input
      className="text-sm"
      value={form.seoTitle || ""}
      onChange={(e) => updateFormField("seoTitle", e.target.value)}
      placeholder="Custom title for this service page"
    />
  </div>

  <div className="space-y-1">
    <Label className="text-xs">SEO Description</Label>
    <Textarea
      className="text-sm"
      rows={2}
      value={form.seoDescription || ""}
      onChange={(e) => updateFormField("seoDescription", e.target.value)}
      placeholder="Short description for search engine results."
    />
  </div>

  <div className="space-y-1">
    <Label className="text-xs">SEO Image URL</Label>
    <Input
      className="text-sm"
      value={form.seoImage || ""}
      onChange={(e) => updateFormField("seoImage", e.target.value)}
      placeholder="Image for social sharing. Defaults to the main image."
    />
  </div>
</div>

            <div className="space-y-1">
              <Label className="text-xs">Features (one per line)</Label>
              <Textarea
                className="text-sm"
                rows={4}
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
              />
              <p className="text-[11px] text-slate-500">
                Each line will become a bullet point on the service page.
              </p>
            </div>

            <div className="space-y-1">
  <Label className="text-xs">Full Body Content</Label>
  <div className="border border-slate-200 rounded-md">
    <ReactQuill
      theme="snow"
      value={form.body}
      onChange={(content) => updateFormField("body", content)}
      modules={quillModules}
      formats={quillFormats}
      className="text-sm"
      style={{ minHeight: 200 }}
    />
  </div>
  <p className="text-[11px] text-slate-500">
    Use this editor like a CMS: headings, lists, images (by URL), links, etc.
  </p>
</div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminServicesPage;