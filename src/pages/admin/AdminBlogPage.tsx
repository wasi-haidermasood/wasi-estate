import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const API_BASE = "http://localhost:5000/api";

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

type PostStatus = "draft" | "published";

interface Post {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string; // HTML
  coverImage: string;
  category: string;
  tags: string[];
  status: PostStatus;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;

  // NEW SEO FIELDS
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
}

const emptyPost: Post = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  coverImage: "",
  category: "",
  tags: [],
  status: "draft",
  seoTitle: "",
  seoDescription: "",
  seoImage: "",
};

const AdminBlogPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<Post>(emptyPost);
  const [tagsText, setTagsText] = useState<string>("");

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

  // Load posts
  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const token = localStorage.getItem("adminToken");
        if (!token) {
          navigate("/admin/login");
          return;
        }

        const res = await fetch(`${API_BASE}/posts/admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load posts");

        const data: Post[] = await res.json();
        setPosts(data);

        if (data.length > 0) {
          const first = data[0];
          setSelectedId(first._id || null);
          setForm({
            ...emptyPost,
            ...first,
          });
          setTagsText((first.tags || []).join(", "));
          setIsNew(false);
        } else {
          resetToNew();
        }
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [navigate]);

  const resetToNew = () => {
    setSelectedId(null);
    setForm(emptyPost);
    setTagsText("");
    setIsNew(true);
    setSuccess(null);
    setError(null);
  };

  const handleSelectPost = (post: Post) => {
    setSelectedId(post._id || null);
    setForm({
      ...emptyPost,
      ...post,
    });
    setTagsText((post.tags || []).join(", "));
    setIsNew(false);
    setSuccess(null);
    setError(null);
  };

  const updateField = (field: keyof Post, value: string) => {
    if (field === "status") {
      setForm({ ...form, status: value as PostStatus });
    } else {
      setForm({ ...form, [field]: value });
    }
  };

  const buildPayload = (): Post => {
    const tagsArray = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    return {
      ...form,
      tags: tagsArray,
    };
  };

  const reloadPosts = async (selectId?: string | null) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    const res = await fetch(`${API_BASE}/posts/admin`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data: Post[] = await res.json();
    setPosts(data);

    if (!data.length) {
      resetToNew();
      return;
    }

    if (selectId) {
      const found = data.find((p) => p._id === selectId);
      if (found) {
        handleSelectPost(found);
        return;
      }
    }

    handleSelectPost(data[0]);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const payload = buildPayload();

    if (!payload.title || !payload.slug) {
      setError("Title and slug are required");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      let res: Response;

      if (isNew || !selectedId) {
        res = await fetch(`${API_BASE}/posts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/posts/${selectedId}`, {
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
        throw new Error(text || "Failed to save post");
      }

      const saved = (await res.json()) as Post;
      setSuccess(
        isNew ? "Post created successfully" : "Post updated successfully"
      );
      await reloadPosts(saved._id || null);
      setIsNew(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token || !selectedId) return;

    if (!window.confirm("Delete this post?")) return;

    try {
      setDeleting(true);
      setError(null);
      setSuccess(null);

      const res = await fetch(`${API_BASE}/posts/${selectedId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to delete post");
      }

      setSuccess("Post deleted successfully");
      await reloadPosts();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading blog posts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Blog CMS</h1>
          <p className="text-xs text-slate-500">
            Write and manage articles for Wasi Estate blog.
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
            {saving ? "Saving..." : isNew ? "Create Post" : "Save Changes"}
          </Button>
        </div>
      </header>

      <main className="p-4">
        <div className="max-w-6xl mx-auto grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {/* Left: list */}
          <section className="bg-white rounded-lg border border-slate-200 p-3 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-900">
                All Posts
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={resetToNew}
              >
                + New Post
              </Button>
            </div>

            <div className="border border-slate-200 rounded-md divide-y divide-slate-200 max-h-[500px] overflow-auto">
              {posts.map((p) => {
                const date = p.publishedAt || p.createdAt;
                const labelDate = date
                  ? new Date(date).toLocaleDateString()
                  : "";

                return (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => handleSelectPost(p)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      selectedId === p._id ? "bg-slate-100" : "bg-white"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {p.title || "(No title)"}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        /blog/{p.slug} ·{" "}
                        {p.status === "published" ? "Published" : "Draft"}
                        {labelDate && ` · ${labelDate}`}
                      </p>
                    </div>
                  </button>
                );
              })}

              {posts.length === 0 && (
                <div className="px-3 py-2 text-xs text-slate-500">
                  No posts yet. Click &quot;New Post&quot; to create one.
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
                {isNew ? "Create New Post" : "Edit Post"}
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

            {/* Basic fields */}
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
                <Label className="text-xs">Slug (URL)</Label>
                <Input
                  className="text-sm"
                  value={form.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                />
                <p className="text-[11px] text-slate-500">
                  Example: &quot;islamabad-real-estate-trends&quot;.
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
              <div className="space-y-1">
                <Label className="text-xs">Category</Label>
                <Input
                  className="text-sm"
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Excerpt (short summary)</Label>
              <Textarea
                className="text-sm"
                rows={2}
                value={form.excerpt}
                onChange={(e) => updateField("excerpt", e.target.value)}
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Cover Image URL</Label>
                <Input
                  className="text-sm"
                  value={form.coverImage}
                  onChange={(e) =>
                    updateField("coverImage", e.target.value)
                  }
                />
                <p className="text-[11px] text-slate-500">
                  Shown at the top of the blog post.
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tags (comma separated)</Label>
                <Input
                  className="text-sm"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                />
                <p className="text-[11px] text-slate-500">
                  Example: &quot;Islamabad, Investment, DHA&quot;.
                </p>
              </div>
            </div>

            {/* NEW: SEO SETTINGS */}
            <div className="border border-slate-200 rounded-lg p-3 space-y-2 bg-slate-50/60">
              <h3 className="text-xs font-semibold text-slate-900">
                SEO Settings (Optional)
              </h3>
              <p className="text-[11px] text-slate-500">
                If left empty, the post will use the title, excerpt and cover
                image as SEO defaults.
              </p>
              <div className="space-y-1">
                <Label className="text-xs">SEO Title</Label>
                <Input
                  className="text-sm"
                  value={form.seoTitle || ""}
                  onChange={(e) => updateField("seoTitle", e.target.value)}
                  placeholder="Custom title for browser and search engines"
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
                  placeholder="Short description for search engine results."
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">SEO Image URL</Label>
                <Input
                  className="text-sm"
                  value={form.seoImage || ""}
                  onChange={(e) => updateField("seoImage", e.target.value)}
                  placeholder="Image for social sharing (og/twitter). Defaults to cover image."
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Body Content</Label>
              <div className="border border-slate-200 rounded-md">
                <ReactQuill
                  theme="snow"
                  value={form.body}
                  onChange={(content) => updateField("body", content)}
                  modules={quillModules}
                  formats={quillFormats}
                  className="text-sm"
                  style={{ minHeight: 200 }}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Use this like WordPress: headings, lists, images (by URL),
                links, etc. This HTML will render on the public blog page.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminBlogPage;