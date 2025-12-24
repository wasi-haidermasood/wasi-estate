// src/pages/admin/AdminServicesSettingsPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE } from "@/lib/config";


interface BeforeAfterProject {
  title: string;
  location: string;
  type: string;
  beforeImage: string;
  afterImage: string;
  duration: string;
  budget: string;
}

interface TransformationsHeader {
  badgeText: string;
  title: string;
  subtitle: string;
}

interface TransformationsConfig {
  enabled: boolean;
  header: TransformationsHeader;
  projects: BeforeAfterProject[];
}

interface ServicesSettings {
  _id?: string;
  __v?: number;
  transformations?: TransformationsConfig;
}

const defaultHeader: TransformationsHeader = {
  badgeText: "Our Work",
  title: "Transformation Stories",
  subtitle:
    "Drag the slider to see the magic. Quality craftsmanship meets innovative design.",
};

const AdminServicesSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<ServicesSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Protect route
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin/login");
  }, [navigate]);

  // Load settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/services-settings`);
        if (!res.ok) throw new Error("Failed to load services settings");
        const data: ServicesSettings = await res.json();

        const t: TransformationsConfig = {
          enabled: data.transformations?.enabled ?? true,
          header: {
            badgeText:
              data.transformations?.header?.badgeText ??
              defaultHeader.badgeText,
            title:
              data.transformations?.header?.title ?? defaultHeader.title,
            subtitle:
              data.transformations?.header?.subtitle ??
              defaultHeader.subtitle,
          },
          projects: data.transformations?.projects || [],
        };

        setSettings({
          ...data,
          transformations: t,
        });
        setError(null);
      } catch (err ) {
        console.error(err);
        setError(err.message || "Failed to load services settings");
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading services settings...</p>
      </div>
    );
  }

  const t = settings.transformations!;

  const updateTransformField = (
    field: keyof TransformationsConfig,
    value 
  ) => {
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            transformations: {
              ...prev.transformations!,
              [field]: value,
            },
          }
        : prev
    );
  };

  const updateHeaderField = (field: keyof TransformationsHeader, value: string) => {
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            transformations: {
              ...prev.transformations!,
              header: {
                ...prev.transformations!.header,
                [field]: value,
              },
            },
          }
        : prev
    );
  };

  const updateProject = (
    index: number,
    field: keyof BeforeAfterProject,
    value: string
  ) => {
    const projects = [...t.projects];
    projects[index] = {
      ...projects[index],
      [field]: value,
    };
    updateTransformField("projects", projects);
  };

  const addProject = () => {
    const projects = [
      ...t.projects,
      {
        title: "",
        location: "",
        type: "",
        beforeImage: "",
        afterImage: "",
        duration: "",
        budget: "",
      },
    ];
    updateTransformField("projects", projects);
  };

  const removeProject = (index: number) => {
    const projects = t.projects.filter((_, i) => i !== index);
    updateTransformField("projects", projects);
  };

  const handleSave = async () => {
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

      const res = await fetch(`${API_BASE}/services-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to save services settings");
      }

      const updated = await res.json();
      setSettings(updated);
      setSuccess("Transformation section settings updated successfully");
    } catch (err ) {
      console.error(err);
      setError(err.message || "Failed to save services settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            Services Section Settings
          </h1>
          <p className="text-xs text-slate-500">
            Control the &quot;Our Work / Transformation Stories&quot; section.
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
        <div className="max-w-5xl mx-auto space-y-4">
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

          {/* Enabled toggle */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Transformation Section Visibility
            </h2>
            <p className="text-[11px] text-slate-500">
              Turn this section on or off on the Services page.
            </p>
            <select
              className="border border-slate-300 rounded px-2 py-1 text-xs w-full max-w-xs"
              value={t.enabled ? "on" : "off"}
              onChange={(e) =>
                updateTransformField("enabled", e.target.value === "on")
              }
            >
              <option value="on">Show section</option>
              <option value="off">Hide section</option>
            </select>
          </section>

          {/* Header */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Section Heading
            </h2>
            <div className="space-y-1">
              <Label className="text-xs">Badge Text</Label>
              <Input
                className="text-sm"
                value={t.header.badgeText}
                onChange={(e) => updateHeaderField("badgeText", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Title</Label>
              <Input
                className="text-sm"
                value={t.header.title}
                onChange={(e) => updateHeaderField("title", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Subtitle</Label>
              <Textarea
                className="text-sm"
                rows={2}
                value={t.header.subtitle}
                onChange={(e) =>
                  updateHeaderField("subtitle", e.target.value)
                }
              />
            </div>
          </section>

          {/* Projects */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Before / After Projects
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="text-[11px]"
                onClick={addProject}
              >
                Add Project
              </Button>
            </div>
            <p className="text-[11px] text-slate-500">
              Each project shows in the slider. You can add multiple
              transformations with title, location, duration and budget.
            </p>

            <div className="space-y-3">
              {t.projects.map((p, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-md p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-700">
                      Project {index + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeProject(index)}
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[11px]">Title</Label>
                      <Input
                        className="text-xs"
                        value={p.title || ""}
                        onChange={(e) =>
                          updateProject(index, "title", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Location</Label>
                      <Input
                        className="text-xs"
                        value={p.location || ""}
                        onChange={(e) =>
                          updateProject(index, "location", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Type</Label>
                      <Input
                        className="text-xs"
                        value={p.type || ""}
                        onChange={(e) =>
                          updateProject(index, "type", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Duration</Label>
                      <Input
                        className="text-xs"
                        value={p.duration || ""}
                        onChange={(e) =>
                          updateProject(index, "duration", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Budget</Label>
                      <Input
                        className="text-xs"
                        value={p.budget || ""}
                        onChange={(e) =>
                          updateProject(index, "budget", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[11px]">Before Image URL</Label>
                      <Input
                        className="text-xs"
                        value={p.beforeImage || ""}
                        onChange={(e) =>
                          updateProject(index, "beforeImage", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">After Image URL</Label>
                      <Input
                        className="text-xs"
                        value={p.afterImage || ""}
                        onChange={(e) =>
                          updateProject(index, "afterImage", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}

              {t.projects.length === 0 && (
                <p className="text-[11px] text-slate-500">
                  No projects yet. Click &quot;Add Project&quot; to create one.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminServicesSettingsPage;