// src/pages/admin/AdminTestimonialsPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, MapPin, BadgeCheck } from "lucide-react";

const API_BASE = "http://localhost:5000/api";

interface AdminTestimonial {
  _id: string;          // Mongo ID
  id?: string;          // custom id like t-1
  name: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  results: string;
  propertyType: string;
  image?: string;
  isVideo?: boolean;
  videoUrl?: string;
  featured?: boolean;
  status?: "pending" | "approved" | "draft";
  createdAt?: string;
}

const AdminTestimonialsPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<AdminTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "draft">("pending");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Require admin token
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
  }, [navigate]);

  // Load all testimonials (admin endpoint)
  useEffect(() => {
    async function fetchAdminTestimonials() {
      try {
        setLoading(true);
        const token = localStorage.getItem("adminToken");
        if (!token) {
          navigate("/admin/login");
          return;
        }

        const res = await fetch(`${API_BASE}/testimonials/admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load testimonials");
        }

        const data = await res.json();
        setItems(data.items || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load testimonials");
      } finally {
        setLoading(false);
      }
    }

    fetchAdminTestimonials();
  }, [navigate]);

  const filteredItems =
    filter === "all"
      ? items
      : items.filter((t) => (t.status || "approved") === filter);

  const updateTestimonial = async (
    id: string,
    changes: Partial<AdminTestimonial>
  ) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      setSavingId(id);
      setError(null);
      setSuccess(null);

      const res = await fetch(`${API_BASE}/testimonials/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(changes),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update testimonial");
      }

      const updated = await res.json();
      setItems((prev) => prev.map((t) => (t._id === id ? updated : t)));
      setSuccess("Changes saved");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update testimonial");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      setDeletingId(id);
      setError(null);
      setSuccess(null);

      const res = await fetch(`${API_BASE}/testimonials/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to delete testimonial");
      }

      setItems((prev) => prev.filter((t) => t._id !== id));
      setSuccess("Testimonial deleted");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete testimonial");
    } finally {
      setDeletingId(null);
    }
  };

  const badgeForStatus = (status?: string) => {
    const s = status || "approved";
    if (s === "pending") {
      return (
        <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-100 text-amber-800 border border-amber-200">
          Pending
        </span>
      );
    }
    if (s === "draft") {
      return (
        <span className="px-2 py-0.5 text-[10px] rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          Draft
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
        Approved
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading testimonials...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            Testimonials & Reviews
          </h1>
          <p className="text-xs text-slate-500">
            Approve, feature, draft or delete client reviews.
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
        </div>
      </header>

      {/* Content */}
      <main className="p-4">
        <div className="max-w-6xl mx-auto space-y-4">
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

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-600 font-medium">Filter:</span>
              {["all", "pending", "approved", "draft"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as typeof filter)}
                  className={`px-3 py-1 rounded-full border text-xs ${
                    filter === f
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-slate-600 border-slate-200 hover:border-green-300"
                  }`}
                >
                  {f[0].toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <div className="text-xs text-slate-500">
              Total: {items.length} • Showing: {filteredItems.length}
            </div>
          </div>

          {/* List */}
          <div className="space-y-3">
            {filteredItems.map((t) => (
              <div
                key={t._id}
                className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col md:flex-row gap-3"
              >
                <div className="w-full md:w-2/3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                        {t.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {t.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {t.role || "Client"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {badgeForStatus(t.status)}
                      {t.featured && (
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                          <BadgeCheck className="w-3 h-3" />
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin className="w-3 h-3 text-green-500" />
                    {t.location}
                    <span className="mx-1">•</span>
                    <span>{t.propertyType}</span>
                    {t.createdAt && (
                      <>
                        <span className="mx-1">•</span>
                        <span>
                          {new Date(t.createdAt).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < (t.rating || 5)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-[11px] text-slate-500 ml-1">
                      {t.rating?.toFixed(1) || "5.0"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px]">Review Text</Label>
                    <Textarea
                      className="text-xs min-h-[70px]"
                      value={t.text}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((it) =>
                            it._id === t._id ? { ...it, text: e.target.value } : it
                          )
                        )
                      }
                    />
                  </div>
                </div>

                {/* Right side / actions */}
                <div className="w-full md:w-1/3 flex flex-col justify-between gap-2">
                  {t.image && (
                    <div className="w-full h-24 rounded-md overflow-hidden bg-slate-100">
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {/* Approve */}
                    <Button
                      size="sm"
                      className="text-[11px]"
                      variant={
                        (t.status || "approved") === "approved"
                          ? "outline"
                          : "default"
                      }
                      onClick={() =>
                        updateTestimonial(t._id, { status: "approved" })
                      }
                      disabled={savingId === t._id}
                    >
                      {(t.status || "approved") === "approved"
                        ? "Approved"
                        : "Approve"}
                    </Button>

                    {/* Draft */}
                    <Button
                      size="sm"
                      className="text-[11px]"
                      variant="outline"
                      onClick={() =>
                        updateTestimonial(t._id, { status: "draft" })
                      }
                      disabled={savingId === t._id}
                    >
                      Move to Draft
                    </Button>

                    {/* Toggle Featured */}
                    <Button
                      size="sm"
                      className="text-[11px]"
                      variant={t.featured ? "outline" : "ghost"}
                      onClick={() =>
                        updateTestimonial(t._id, { featured: !t.featured })
                      }
                      disabled={savingId === t._id}
                    >
                      {t.featured ? "Unfeature" : "Feature"}
                    </Button>

                    {/* Delete */}
                    <Button
                      size="sm"
                      className="text-[11px] text-red-600 hover:text-red-700"
                      variant="ghost"
                      onClick={() => handleDelete(t._id)}
                      disabled={deletingId === t._id}
                    >
                      {deletingId === t._id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <p className="text-xs text-slate-500">
                No testimonials for this filter.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminTestimonialsPage;