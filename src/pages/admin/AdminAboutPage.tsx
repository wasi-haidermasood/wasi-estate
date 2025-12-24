// src/pages/admin/AdminAboutPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE } from "@/lib/config";


interface Achievement {
  value: string;
  label: string;
}

interface Milestone {
  year: string;
  title: string;
  description: string;
}

interface ValueItem {
  title: string;
  description: string;
}

interface PartnershipImage {
  image: string;
  caption: string;
  location: string;
}

interface WhyChooseItem {
  title: string;
  desc: string;
}

interface HeaderConfig {
  badgeText?: string;
  titleMain?: string;
  titleHighlight?: string;
  subtitle?: string;
}

interface FounderConfig {
  image?: string;
  name?: string;
  roleLine?: string;
  sinceText?: string;
  experienceText?: string;
  partnersText?: string;
  presidentBadgeText?: string;
  highlightTitle?: string;
  highlightText?: string;
  messageTitle?: string;
  messageParagraphs?: string[];
}

interface AssociationConfig {
  badgeText?: string;
  title?: string;
  description?: string;
  bulletPoints?: string[];
}

interface MissionVisionConfig {
  title?: string;
  text?: string;
}

interface PartnershipConfig {
  badgeText?: string;
  title?: string;
  subtitle?: string;
  images?: PartnershipImage[];
}

interface WhyChooseConfig {
  title?: string;
  items?: WhyChooseItem[];
}

interface AboutSettings {
  _id?: string;
  __v?: number;
  header?: HeaderConfig;
  founder?: FounderConfig;
  achievements?: Achievement[];
  association?: AssociationConfig;
  mission?: MissionVisionConfig;
  vision?: MissionVisionConfig;
  milestones?: Milestone[];
  values?: ValueItem[];
  partnership?: PartnershipConfig;
  whyChoose?: WhyChooseConfig;
}

const AdminAboutPage: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<AboutSettings | null>(null);
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

  // Load about settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/about`);
        if (!res.ok) {
          throw new Error("Failed to load about settings");
        }
        const data: AboutSettings = await res.json();

        // Ensure arrays/objects exist
        data.header = data.header || {};
        data.founder = data.founder || {};
        data.achievements = data.achievements || [];
        data.association = data.association || {};
        data.mission = data.mission || {};
        data.vision = data.vision || {};
        data.milestones = data.milestones || [];
        data.values = data.values || [];
        data.partnership = data.partnership || {};
        data.partnership.images = data.partnership.images || [];
        data.whyChoose = data.whyChoose || {};
        data.whyChoose.items = data.whyChoose.items || [];

        setSettings(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load about settings");
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  // Helpers
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

  const updateFounder = (field: keyof FounderConfig, value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      founder: {
        ...(settings.founder || {}),
        [field]: value,
      },
    });
  };

  const updateFounderParagraphs = (value: string) => {
    if (!settings) return;
    const paragraphs = value
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);
    setSettings({
      ...settings,
      founder: {
        ...(settings.founder || {}),
        messageParagraphs: paragraphs,
      },
    });
  };

  const updateAssociation = (field: keyof AssociationConfig, value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      association: {
        ...(settings.association || {}),
        [field]: value,
      },
    });
  };

  const updateAssociationBulletPoints = (value: string) => {
    if (!settings) return;
    const points = value
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);
    setSettings({
      ...settings,
      association: {
        ...(settings.association || {}),
        bulletPoints: points,
      },
    });
  };

  const updateMission = (field: keyof MissionVisionConfig, value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      mission: {
        ...(settings.mission || {}),
        [field]: value,
      },
    });
  };

  const updateVision = (field: keyof MissionVisionConfig, value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      vision: {
        ...(settings.vision || {}),
        [field]: value,
      },
    });
  };

  const updatePartnership = (field: keyof PartnershipConfig, value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      partnership: {
        ...(settings.partnership || {}),
        [field]: value,
      },
    });
  };

  const updateWhyChoose = (field: keyof WhyChooseConfig, value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      whyChoose: {
        ...(settings.whyChoose || {}),
        [field]: value,
      },
    });
  };

  // Achievements
  const handleAchievementChange = (
    index: number,
    field: keyof Achievement,
    value: string
  ) => {
    if (!settings) return;
    const achievements = [...(settings.achievements || [])];
    achievements[index] = {
      ...achievements[index],
      [field]: value,
    };
    setSettings({ ...settings, achievements });
  };

  const handleAddAchievement = () => {
    if (!settings) return;
    const achievements = [...(settings.achievements || []), { value: "", label: "" }];
    setSettings({ ...settings, achievements });
  };

  const handleRemoveAchievement = (index: number) => {
    if (!settings) return;
    const achievements = (settings.achievements || []).filter((_, i) => i !== index);
    setSettings({ ...settings, achievements });
  };

  // Milestones
  const handleMilestoneChange = (
    index: number,
    field: keyof Milestone,
    value: string
  ) => {
    if (!settings) return;
    const milestones = [...(settings.milestones || [])];
    milestones[index] = {
      ...milestones[index],
      [field]: value,
    };
    setSettings({ ...settings, milestones });
  };

  const handleAddMilestone = () => {
    if (!settings) return;
    const milestones = [...(settings.milestones || []), { year: "", title: "", description: "" }];
    setSettings({ ...settings, milestones });
  };

  const handleRemoveMilestone = (index: number) => {
    if (!settings) return;
    const milestones = (settings.milestones || []).filter((_, i) => i !== index);
    setSettings({ ...settings, milestones });
  };

  // Values
  const handleValueChange = (
    index: number,
    field: keyof ValueItem,
    value: string
  ) => {
    if (!settings) return;
    const values = [...(settings.values || [])];
    values[index] = {
      ...values[index],
      [field]: value,
    };
    setSettings({ ...settings, values });
  };

  const handleAddValue = () => {
    if (!settings) return;
    const values = [...(settings.values || []), { title: "", description: "" }];
    setSettings({ ...settings, values });
  };

  const handleRemoveValue = (index: number) => {
    if (!settings) return;
    const values = (settings.values || []).filter((_, i) => i !== index);
    setSettings({ ...settings, values });
  };

  // Partnership images
  const handlePartnershipImageChange = (
    index: number,
    field: keyof PartnershipImage,
    value: string
  ) => {
    if (!settings) return;
    const images = [...(settings.partnership?.images || [])];
    images[index] = {
      ...images[index],
      [field]: value,
    };
    setSettings({
      ...settings,
      partnership: {
        ...(settings.partnership || {}),
        images,
      },
    });
  };

  const handleAddPartnershipImage = () => {
    if (!settings) return;
    const images = [...(settings.partnership?.images || []), { image: "", caption: "", location: "" }];
    setSettings({
      ...settings,
      partnership: {
        ...(settings.partnership || {}),
        images,
      },
    });
  };

  const handleRemovePartnershipImage = (index: number) => {
    if (!settings) return;
    const images = (settings.partnership?.images || []).filter((_, i) => i !== index);
    setSettings({
      ...settings,
      partnership: {
        ...(settings.partnership || {}),
        images,
      },
    });
  };

  // Why choose items
  const handleWhyChooseItemChange = (
    index: number,
    field: keyof WhyChooseItem,
    value: string
  ) => {
    if (!settings) return;
    const items = [...(settings.whyChoose?.items || [])];
    items[index] = {
      ...items[index],
      [field]: value,
    };
    setSettings({
      ...settings,
      whyChoose: {
        ...(settings.whyChoose || {}),
        items,
      },
    });
  };

  const handleAddWhyChooseItem = () => {
    if (!settings) return;
    const items = [...(settings.whyChoose?.items || []), { title: "", desc: "" }];
    setSettings({
      ...settings,
      whyChoose: {
        ...(settings.whyChoose || {}),
        items,
      },
    });
  };

  const handleRemoveWhyChooseItem = (index: number) => {
    if (!settings) return;
    const items = (settings.whyChoose?.items || []).filter((_, i) => i !== index);
    setSettings({
      ...settings,
      whyChoose: {
        ...(settings.whyChoose || {}),
        items,
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

      const { _id, __v, ...payload } = settings;

      const res = await fetch(`${API_BASE}/about`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to save about settings");
      }

      const updated: AboutSettings = await res.json();
      setSettings(updated);
      setSuccess("About settings updated successfully");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save about settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading about settings...</p>
      </div>
    );
  }

  const founderParagraphsText =
    (settings.founder?.messageParagraphs || []).join("\n");

  const associationBulletPointsText =
    (settings.association?.bulletPoints || []).join("\n");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            About Section Settings
          </h1>
          <p className="text-xs text-slate-500">
            Edit founder details, mission, values, timeline and more.
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

          {/* Header */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Main Header
            </h2>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Badge Text</Label>
                <Input
                  className="text-sm"
                  value={settings.header?.badgeText || ""}
                  onChange={(e) => updateHeader("badgeText", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Subtitle</Label>
                <Input
                  className="text-sm"
                  value={settings.header?.subtitle || ""}
                  onChange={(e) => updateHeader("subtitle", e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Title (Main)</Label>
                <Input
                  className="text-sm"
                  value={settings.header?.titleMain || ""}
                  onChange={(e) => updateHeader("titleMain", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Title (Highlight)</Label>
                <Input
                  className="text-sm"
                  value={settings.header?.titleHighlight || ""}
                  onChange={(e) =>
                    updateHeader("titleHighlight", e.target.value)
                  }
                />
              </div>
            </div>
          </section>

          {/* Founder */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Founder Section
            </h2>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Founder Name</Label>
                <Input
                  className="text-sm"
                  value={settings.founder?.name || ""}
                  onChange={(e) => updateFounder("name", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Role Line</Label>
                <Input
                  className="text-sm"
                  value={settings.founder?.roleLine || ""}
                  onChange={(e) => updateFounder("roleLine", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Since Text</Label>
                <Input
                  className="text-sm"
                  value={settings.founder?.sinceText || ""}
                  onChange={(e) => updateFounder("sinceText", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Experience Text</Label>
                <Input
                  className="text-sm"
                  value={settings.founder?.experienceText || ""}
                  onChange={(e) =>
                    updateFounder("experienceText", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Partners Text</Label>
                <Input
                  className="text-sm"
                  value={settings.founder?.partnersText || ""}
                  onChange={(e) =>
                    updateFounder("partnersText", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">President Badge Text</Label>
                <Input
                  className="text-sm"
                  value={settings.founder?.presidentBadgeText || ""}
                  onChange={(e) =>
                    updateFounder("presidentBadgeText", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs">Highlight Title</Label>
                <Input
                  className="text-sm"
                  value={settings.founder?.highlightTitle || ""}
                  onChange={(e) =>
                    updateFounder("highlightTitle", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs">Highlight Text</Label>
                <Textarea
                  className="text-sm"
                  rows={3}
                  value={settings.founder?.highlightText || ""}
                  onChange={(e) =>
                    updateFounder("highlightText", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs">Founder Image URL</Label>
                <Input
                  className="text-sm"
                  value={settings.founder?.image || ""}
                  onChange={(e) => updateFounder("image", e.target.value)}
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs">Message Title</Label>
                <Input
                  className="text-sm"
                  value={settings.founder?.messageTitle || ""}
                  onChange={(e) =>
                    updateFounder("messageTitle", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs">
                  Message Paragraphs (one per line)
                </Label>
                <Textarea
                  className="text-sm"
                  rows={5}
                  value={founderParagraphsText}
                  onChange={(e) => updateFounderParagraphs(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Achievements & Association */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Achievements */}
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-slate-900">
                  Achievements
                </h2>
                <p className="text-[11px] text-slate-500">
                  These stats appear as small cards (e.g. 500+ Properties Sold).
                </p>
                <div className="space-y-2">
                  {(settings.achievements || []).map((a, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 rounded-md p-2 grid gap-2 md:grid-cols-3"
                    >
                      <div className="space-y-1">
                        <Label className="text-[11px]">Value</Label>
                        <Input
                          className="text-xs"
                          value={a.value || ""}
                          onChange={(e) =>
                            handleAchievementChange(index, "value", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <Label className="text-[11px]">Label</Label>
                        <div className="flex gap-2">
                          <Input
                            className="text-xs"
                            value={a.label || ""}
                            onChange={(e) =>
                              handleAchievementChange(
                                index,
                                "label",
                                e.target.value
                              )
                            }
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveAchievement(index)}
                          >
                            X
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(settings.achievements || []).length === 0 && (
                    <p className="text-[11px] text-slate-500">
                      No achievements yet.
                    </p>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[11px]"
                    onClick={handleAddAchievement}
                  >
                    Add Achievement
                  </Button>
                </div>
              </div>

              {/* Association */}
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-slate-900">
                  Association Leadership
                </h2>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Badge Text</Label>
                    <Input
                      className="text-sm"
                      value={settings.association?.badgeText || ""}
                      onChange={(e) =>
                        updateAssociation("badgeText", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Title</Label>
                    <Input
                      className="text-sm"
                      value={settings.association?.title || ""}
                      onChange={(e) => updateAssociation("title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Description</Label>
                    <Textarea
                      className="text-sm"
                      rows={3}
                      value={settings.association?.description || ""}
                      onChange={(e) =>
                        updateAssociation("description", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">
                      Bullet Points (one per line)
                    </Label>
                    <Textarea
                      className="text-sm"
                      rows={3}
                      value={associationBulletPointsText}
                      onChange={(e) =>
                        updateAssociationBulletPoints(e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Mission & Vision
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Mission Title</Label>
                <Input
                  className="text-sm"
                  value={settings.mission?.title || ""}
                  onChange={(e) => updateMission("title", e.target.value)}
                />
                <Label className="text-xs">Mission Text</Label>
                <Textarea
                  className="text-sm"
                  rows={4}
                  value={settings.mission?.text || ""}
                  onChange={(e) => updateMission("text", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Vision Title</Label>
                <Input
                  className="text-sm"
                  value={settings.vision?.title || ""}
                  onChange={(e) => updateVision("title", e.target.value)}
                />
                <Label className="text-xs">Vision Text</Label>
                <Textarea
                  className="text-sm"
                  rows={4}
                  value={settings.vision?.text || ""}
                  onChange={(e) => updateVision("text", e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Milestones */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Milestones / Timeline
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="text-[11px]"
                onClick={handleAddMilestone}
              >
                Add Milestone
              </Button>
            </div>
            <div className="space-y-2">
              {(settings.milestones || []).map((m, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-md p-2 grid gap-2 md:grid-cols-4"
                >
                  <div className="space-y-1">
                    <Label className="text-[11px]">Year</Label>
                    <Input
                      className="text-xs"
                      value={m.year || ""}
                      onChange={(e) =>
                        handleMilestoneChange(index, "year", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label className="text-[11px]">Title</Label>
                    <Input
                      className="text-xs"
                      value={m.title || ""}
                      onChange={(e) =>
                        handleMilestoneChange(index, "title", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Description</Label>
                    <div className="flex gap-2">
                      <Input
                        className="text-xs"
                        value={m.description || ""}
                        onChange={(e) =>
                          handleMilestoneChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoveMilestone(index)}
                      >
                        X
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {(settings.milestones || []).length === 0 && (
                <p className="text-[11px] text-slate-500">
                  No milestones yet.
                </p>
              )}
            </div>
          </section>

          {/* Values */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Core Values
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="text-[11px]"
                onClick={handleAddValue}
              >
                Add Value
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              {(settings.values || []).map((v, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-md p-2 space-y-1"
                >
                  <Label className="text-[11px]">Title</Label>
                  <Input
                    className="text-xs"
                    value={v.title || ""}
                    onChange={(e) =>
                      handleValueChange(index, "title", e.target.value)
                    }
                  />
                  <Label className="text-[11px]">Description</Label>
                  <div className="flex gap-2">
                    <Textarea
                      className="text-xs"
                      rows={2}
                      value={v.description || ""}
                      onChange={(e) =>
                        handleValueChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveValue(index)}
                    >
                      X
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {(settings.values || []).length === 0 && (
              <p className="text-[11px] text-slate-500">
                No values yet.
              </p>
            )}
          </section>

          {/* Partnership */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Partnership & Network
            </h2>
            <div className="grid md:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Badge Text</Label>
                <Input
                  className="text-sm"
                  value={settings.partnership?.badgeText || ""}
                  onChange={(e) =>
                    updatePartnership("badgeText", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Title</Label>
                <Input
                  className="text-sm"
                  value={settings.partnership?.title || ""}
                  onChange={(e) => updatePartnership("title", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Subtitle</Label>
              <Input
                className="text-sm"
                value={settings.partnership?.subtitle || ""}
                onChange={(e) =>
                  updatePartnership("subtitle", e.target.value)
                }
              />
            </div>

            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700">
                  Gallery Images
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[11px]"
                  onClick={handleAddPartnershipImage}
                >
                  Add Image
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                {(settings.partnership?.images || []).map((img, index) => (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-md p-2 space-y-1"
                  >
                    <Label className="text-[11px]">Image URL</Label>
                    <Input
                      className="text-xs"
                      value={img.image || ""}
                      onChange={(e) =>
                        handlePartnershipImageChange(
                          index,
                          "image",
                          e.target.value
                        )
                      }
                    />
                    <Label className="text-[11px]">Caption</Label>
                    <Input
                      className="text-xs"
                      value={img.caption || ""}
                      onChange={(e) =>
                        handlePartnershipImageChange(
                          index,
                          "caption",
                          e.target.value
                        )
                      }
                    />
                    <Label className="text-[11px]">Location</Label>
                    <div className="flex gap-2">
                      <Input
                        className="text-xs"
                        value={img.location || ""}
                        onChange={(e) =>
                          handlePartnershipImageChange(
                            index,
                            "location",
                            e.target.value
                          )
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemovePartnershipImage(index)}
                      >
                        X
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {(settings.partnership?.images || []).length === 0 && (
                <p className="text-[11px] text-slate-500">
                  No images yet.
                </p>
              )}
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-slate-900">
                  Why Choose Us
                </h2>
                <Input
                  className="text-sm"
                  value={settings.whyChoose?.title || ""}
                  onChange={(e) => updateWhyChoose("title", e.target.value)}
                  placeholder="Section title (e.g. Why Choose Wasi Estate?)"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-[11px]"
                onClick={handleAddWhyChooseItem}
              >
                Add Item
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
              {(settings.whyChoose?.items || []).map((item, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-md p-2 space-y-1"
                >
                  <Label className="text-[11px]">Title</Label>
                  <Input
                    className="text-xs"
                    value={item.title || ""}
                    onChange={(e) =>
                      handleWhyChooseItemChange(
                        index,
                        "title",
                        e.target.value
                      )
                    }
                  />
                  <Label className="text-[11px]">Description</Label>
                  <div className="flex gap-2">
                    <Textarea
                      className="text-xs"
                      rows={2}
                      value={item.desc || ""}
                      onChange={(e) =>
                        handleWhyChooseItemChange(
                          index,
                          "desc",
                          e.target.value
                        )
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveWhyChooseItem(index)}
                    >
                      X
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {(settings.whyChoose?.items || []).length === 0 && (
              <p className="text-[11px] text-slate-500">
                No items yet.
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminAboutPage;