// src/pages/admin/AdminPropertiesPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE } from "@/lib/config";

const res = await fetch(`${API_BASE}/posts`);

interface Property {
  _id?: string; // Mongo ID
  id?: string; // custom ID like "prop-1"
  title: string;
  city: string;
  location: string;
  type: string;
  transactionType: string;
  price: number;
  beds?: number;
  baths?: number;
  area?: string;
  image?: string;

  // NEW SEO fields
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;

  // NEW long description field
  descriptionHtml?: string;
}

type PropertiesResponse = {
  items: Property[];
};

const emptyProperty: Property = {
  title: "",
  city: "",
  location: "",
  type: "House",
  transactionType: "buy",
  price: 0,
  beds: 0,
  baths: 0,
  area: "",
  image: "",
  seoTitle: "",
  seoDescription: "",
  seoImage: "",
  descriptionHtml: "",
};

const AdminPropertiesPage: React.FC = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState<Property[]>([]);
  const [newProperty, setNewProperty] = useState<Property>(emptyProperty);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Guard route: require token
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
  }, [navigate]);

  // Load properties
  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/properties`);
        if (!res.ok) {
          throw new Error("Failed to load properties");
        }
        const data: PropertiesResponse = await res.json();

        // Merge with defaults so new fields aren’t undefined
        const items: Property[] = (data.items || []).map((p) => ({
          ...emptyProperty,
          ...p,
        }));

        setProperties(items);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load properties");
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  // ----- Handlers -----

  // New property form
  const handleNewChange = (field: keyof Property, value: string) => {
    setNewProperty((prev) => {
      if (field === "price" || field === "beds" || field === "baths") {
        const num = parseInt(value, 10);
        return { ...prev, [field]: isNaN(num) ? 0 : num } as Property;
      }
      return { ...prev, [field]: value } as Property;
    });
  };

  const handleCreate = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setCreating(true);
      setError(null);
      setSuccess(null);

      const payload: Property = { ...newProperty };
      // Backend will auto-generate "id" if not provided

      const res = await fetch(`${API_BASE}/properties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create property");
      }

      const created: Property = await res.json();
      // Merge created property with defaults too (to ensure new fields present)
      setProperties((prev) => [{ ...emptyProperty, ...created }, ...prev]);
      setNewProperty(emptyProperty);
      setSuccess("Property created successfully");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create property");
    } finally {
      setCreating(false);
    }
  };

  // Existing properties
  const handlePropertyChange = (
    index: number,
    field: keyof Property,
    value: string
  ) => {
    setProperties((prev) => {
      const next = [...prev];
      const prop = { ...next[index] };

      if (field === "price" || field === "beds" || field === "baths") {
        const num = parseInt(value, 10);
        (prop as Record<string, unknown>)[field] = isNaN(num) ? 0 : num;
      } else {
        (prop as Record<string, unknown>)[field] = value;
      }

      next[index] = prop;
      return next;
    });
  };

  const handleSaveProperty = async (index: number) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const prop = properties[index];
    if (!prop._id) {
      setError("Missing _id for property");
      return;
    }

    try {
      setSavingId(prop._id);
      setError(null);
      setSuccess(null);

      const { _id, ...payload } = prop;

      const res = await fetch(`${API_BASE}/properties/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to save property");
      }

      const updated: Property = await res.json();

      setProperties((prev) =>
        prev.map((p, i) => (i === index ? { ...emptyProperty, ...updated } : p))
      );
      setSuccess("Property updated successfully");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save property");
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteProperty = async (index: number) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const prop = properties[index];
    if (!prop._id) {
      setError("Missing _id for property");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }

    try {
      setDeletingId(prop._id);
      setError(null);
      setSuccess(null);

      const res = await fetch(`${API_BASE}/properties/${prop._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to delete property");
      }

      setProperties((prev) => prev.filter((_, i) => i !== index));
      setSuccess("Property deleted successfully");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete property");
    } finally {
      setDeletingId(null);
    }
  };

  // ----- Render -----

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            Properties Management
          </h1>
          <p className="text-xs text-slate-500">
            Add, edit and remove properties displayed on the site.
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

          {/* New Property Form */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Add New Property
            </h2>
            <p className="text-[11px] text-slate-500">
              Fill in the details and click &quot;Create Property&quot;. The
              custom ID will be generated automatically unless you provide one.
            </p>

            <div className="grid gap-2 md:grid-cols-3">
              <div className="space-y-1">
                <Label className="text-xs">Title</Label>
                <Input
                  className="text-sm"
                  value={newProperty.title}
                  onChange={(e) => handleNewChange("title", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">City</Label>
                <Input
                  className="text-sm"
                  value={newProperty.city}
                  onChange={(e) => handleNewChange("city", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Location (e.g. DHA Phase 6)</Label>
                <Input
                  className="text-sm"
                  value={newProperty.location}
                  onChange={(e) => handleNewChange("location", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2 md:grid-cols-4">
              <div className="space-y-1">
                <Label className="text-xs">Type</Label>
                <select
                  className="border border-slate-300 rounded px-2 py-1 text-xs w-full"
                  value={newProperty.type}
                  onChange={(e) => handleNewChange("type", e.target.value)}
                >
                  <option>House</option>
                  <option>Apartment</option>
                  <option>Commercial</option>
                  <option>Plot</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Transaction Type</Label>
                <select
                  className="border border-slate-300 rounded px-2 py-1 text-xs w-full"
                  value={newProperty.transactionType}
                  onChange={(e) =>
                    handleNewChange("transactionType", e.target.value)
                  }
                >
                  <option value="buy">Buy</option>
                  <option value="rent">Rent</option>
                  <option value="projects">Projects</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Price (PKR)</Label>
                <Input
                  type="number"
                  className="text-sm"
                  value={newProperty.price}
                  onChange={(e) => handleNewChange("price", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Image URL</Label>
                <Input
                  className="text-sm"
                  value={newProperty.image || ""}
                  onChange={(e) => handleNewChange("image", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2 md:grid-cols-3">
              <div className="space-y-1">
                <Label className="text-xs">Beds</Label>
                <Input
                  type="number"
                  className="text-sm"
                  value={newProperty.beds ?? 0}
                  onChange={(e) => handleNewChange("beds", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Baths</Label>
                <Input
                  type="number"
                  className="text-sm"
                  value={newProperty.baths ?? 0}
                  onChange={(e) => handleNewChange("baths", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Area (e.g. 1 Kanal)</Label>
                <Input
                  className="text-sm"
                  value={newProperty.area || ""}
                  onChange={(e) => handleNewChange("area", e.target.value)}
                />
              </div>
            </div>

            <Button
              size="sm"
              className="mt-2 text-xs"
              onClick={handleCreate}
              disabled={creating}
            >
              {creating ? "Creating..." : "Create Property"}
            </Button>
          </section>

          {/* Existing Properties */}
          <section className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Existing Properties
            </h2>
            <p className="text-[11px] text-slate-500 mb-2">
              Edit fields and click &quot;Save&quot; for each property. Use
              &quot;Delete&quot; to remove a listing.
            </p>

            <div className="space-y-3 max-h-[600px] overflow-auto pr-1">
              {properties.map((prop, index) => (
                <div
                  key={prop._id || prop.id || index}
                  className="border border-slate-200 rounded-md p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] text-slate-500">
                      ID: <span className="font-mono">{prop.id}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="text-[11px]"
                        onClick={() => handleSaveProperty(index)}
                        disabled={savingId === prop._id}
                      >
                        {savingId === prop._id ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-[11px] text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteProperty(index)}
                        disabled={deletingId === prop._id}
                      >
                        {deletingId === prop._id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-2 md:grid-cols-3">
                    <div className="space-y-1">
                      <Label className="text-[11px]">Title</Label>
                      <Input
                        className="text-xs"
                        value={prop.title}
                        onChange={(e) =>
                          handlePropertyChange(index, "title", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">City</Label>
                      <Input
                        className="text-xs"
                        value={prop.city}
                        onChange={(e) =>
                          handlePropertyChange(index, "city", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Location</Label>
                      <Input
                        className="text-xs"
                        value={prop.location}
                        onChange={(e) =>
                          handlePropertyChange(
                            index,
                            "location",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="grid gap-2 md:grid-cols-4">
                    <div className="space-y-1">
                      <Label className="text-[11px]">Type</Label>
                      <select
                        className="border border-slate-300 rounded px-2 py-1 text-[11px] w-full"
                        value={prop.type}
                        onChange={(e) =>
                          handlePropertyChange(index, "type", e.target.value)
                        }
                      >
                        <option>House</option>
                        <option>Apartment</option>
                        <option>Commercial</option>
                        <option>Plot</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Transaction Type</Label>
                      <select
                        className="border border-slate-300 rounded px-2 py-1 text-[11px] w-full"
                        value={prop.transactionType}
                        onChange={(e) =>
                          handlePropertyChange(
                            index,
                            "transactionType",
                            e.target.value
                          )
                        }
                      >
                        <option value="buy">Buy</option>
                        <option value="rent">Rent</option>
                        <option value="projects">Projects</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Price (PKR)</Label>
                      <Input
                        type="number"
                        className="text-xs"
                        value={prop.price}
                        onChange={(e) =>
                          handlePropertyChange(index, "price", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Image URL</Label>
                      <Input
                        className="text-xs"
                        value={prop.image || ""}
                        onChange={(e) =>
                          handlePropertyChange(index, "image", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid gap-2 md:grid-cols-3">
                    <div className="space-y-1">
                      <Label className="text-[11px]">Beds</Label>
                      <Input
                        type="number"
                        className="text-xs"
                        value={prop.beds ?? 0}
                        onChange={(e) =>
                          handlePropertyChange(index, "beds", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Baths</Label>
                      <Input
                        type="number"
                        className="text-xs"
                        value={prop.baths ?? 0}
                        onChange={(e) =>
                          handlePropertyChange(index, "baths", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Area</Label>
                      <Input
                        className="text-xs"
                        value={prop.area || ""}
                        onChange={(e) =>
                          handlePropertyChange(index, "area", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* SEO Settings */}
                  <section className="bg-slate-50/60 border border-slate-200 rounded-lg p-3 space-y-2 mt-2">
                    <h3 className="text-xs font-semibold text-slate-900">
                      SEO Settings (Optional)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      If left empty, this property page will use the title,
                      location and image as defaults.
                    </p>

                    <div className="space-y-1">
                      <Label className="text-xs">SEO Title</Label>
                      <Input
                        className="text-xs"
                        value={prop.seoTitle || ""}
                        onChange={(e) =>
                          handlePropertyChange(
                            index,
                            "seoTitle",
                            e.target.value
                          )
                        }
                        placeholder="Custom title for this property page"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">SEO Description</Label>
                      <Textarea
                        className="text-xs"
                        rows={2}
                        value={prop.seoDescription || ""}
                        onChange={(e) =>
                          handlePropertyChange(
                            index,
                            "seoDescription",
                            e.target.value
                          )
                        }
                        placeholder="Short description for Google search results."
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">SEO Image URL</Label>
                      <Input
                        className="text-xs"
                        value={prop.seoImage || ""}
                        onChange={(e) =>
                          handlePropertyChange(
                            index,
                            "seoImage",
                            e.target.value
                          )
                        }
                        placeholder="Image for social / OG sharing (defaults to main image)."
                      />
                    </div>
                  </section>

                  {/* Long Description */}
                  <section className="border border-slate-200 rounded-lg p-3 space-y-1 mt-2">
                    <Label className="text-xs">Long Description / Details</Label>
                    <Textarea
                      className="text-xs"
                      rows={4}
                      value={prop.descriptionHtml || ""}
                      onChange={(e) =>
                        handlePropertyChange(
                          index,
                          "descriptionHtml",
                          e.target.value
                        )
                      }
                      placeholder="Add a longer description of this property with important details and keywords."
                    />
                    <p className="text-[11px] text-slate-500">
                      This text will appear on the property details page. You
                      can include location highlights, amenities, investment
                      potential, etc.
                    </p>
                  </section>
                </div>
              ))}

              {properties.length === 0 && (
                <p className="text-xs text-slate-500">
                  No properties yet. Use the form above to add your first
                  property.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminPropertiesPage;