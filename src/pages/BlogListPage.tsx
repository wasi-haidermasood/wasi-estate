// src/pages/BlogListPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { API_BASE } from "@/lib/config";

interface Post {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
  publishedAt?: string;
  createdAt?: string;
}

// --- SEO helpers (local) ---
function setDocumentTitle(title: string | undefined) {
  if (title) document.title = title;
}

function upsertMeta(name: string, content?: string) {
  if (!content) return;
  let tag = document.querySelector(
    `meta[name="${name}"]`
  ) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertOg(property: string, content?: string) {
  if (!content) return;
  let tag = document.querySelector(
    `meta[property="${property}"]`
  ) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}
// ---------------------------

const BlogListPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // SEO for blog list
  useEffect(() => {
    const title = "Wasi Estate Blog - Insights & Property Guides";
    const desc =
      "Read articles, guides and market insights from Wasi Estate & Builders about buying, selling, and investing in property.";

    setDocumentTitle(title);
    upsertMeta("description", desc);
    upsertOg("og:title", title);
    upsertOg("og:description", desc);
    upsertOg("og:url", window.location.href);
  }, []);

  // Fetch posts
  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/posts`);
        const data: Post[] = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-slate-500">Loading blog...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <main className="py-8 lg:py-10">
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <header className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-600 font-semibold">
                  Blog &amp; Insights
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                  Wasi Estate Blog
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md">
                  Articles and guides on buying, selling, investing and building
                  properties in Pakistan.
                </p>
              </div>
              <Link
                to="/"
                className="text-xs text-slate-500 hover:text-slate-900"
              >
                Back to Home
              </Link>
            </div>
          </header>

          {/* Posts grid */}
          <section className="grid gap-4 md:grid-cols-2">
            {posts.map((post) => {
              const date = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString()
                : null;

              return (
                <article
                  key={post._id}
                  className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow"
                >
                  {post.coverImage && (
                    <div className="h-36 w-full overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-3 space-y-2 flex flex-col flex-1">
                    <div className="space-y-1">
                      {post.category && (
                        <p className="text-[11px] uppercase tracking-wide text-slate-500">
                          {post.category}
                        </p>
                      )}
                      <Link
                        to={`/blog/${post.slug}`}
                        className="block text-sm font-semibold text-slate-900 hover:underline"
                      >
                        {post.title}
                      </Link>
                      {date && (
                        <p className="text-[11px] text-slate-400">
                          Published on {date}
                        </p>
                      )}
                    </div>
                    {post.excerpt && (
                      <p className="text-xs text-slate-600 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-auto pt-2 flex items-center justify-between">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-[11px] text-blue-600 hover:underline"
                      >
                        Read more
                      </Link>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-600"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}

            {posts.length === 0 && (
              <p className="text-sm text-slate-500">
                No blog posts yet. Check back soon.
              </p>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogListPage;