// src/pages/BlogPostPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const API_BASE = "http://localhost:5000/api";

interface Post {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string; // HTML
  coverImage: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;

  // SEO FIELDS
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
}

// --- SEO helpers ---
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

/**
 * Upsert a JSON-LD <script> tag in <head> by id
 */
function setJsonLd(id: string, data: unknown) {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}
// -------------------

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function fetchPost() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/posts/${slug}`);
        if (res.status === 404) {
          setError("Post not found");
          setPost(null);
          return;
        }
        if (!res.ok) throw new Error("Failed to load post");
        const data: Post = await res.json();
        setPost(data);
        setError(null);
      } catch (err ) {
        console.error(err);
        setError(err.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  // SEO override + JSON-LD when post is loaded
  useEffect(() => {
    if (!post) return;

    const baseSiteName = "Wasi Estate Blog";
    const pageTitle = post.seoTitle
      ? `${post.seoTitle} | ${baseSiteName}`
      : `${post.title} | ${baseSiteName}`;

    const description =
      post.seoDescription ||
      post.excerpt ||
      "Read this article from Wasi Estate & Builders real estate experts.";

    const image = post.seoImage || post.coverImage || "";
    const url = window.location.href;
    const datePublished = post.publishedAt || post.createdAt;
    const dateModified = post.updatedAt || post.publishedAt || post.createdAt;

    // Standard meta tags
    setDocumentTitle(pageTitle);
    upsertMeta("description", description);

    // Open Graph
    upsertOg("og:title", pageTitle);
    upsertOg("og:description", description);
    upsertOg("og:image", image);
    upsertOg("og:url", url);

    // Twitter
    upsertMeta("twitter:title", pageTitle);
    upsertMeta("twitter:description", description);
    upsertMeta("twitter:image", image);

    // JSON-LD: BlogPosting
    const articleLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description,
      image: image ? [image] : undefined,
      datePublished: datePublished || undefined,
      dateModified: dateModified || undefined,
      url,
      mainEntityOfPage: url,
      author: {
        "@type": "Organization",
        name: "Wasi Estate & Builders",
      },
      publisher: {
        "@type": "Organization",
        name: "Wasi Estate & Builders",
        logo: {
          "@type": "ImageObject",
          url: "YOUR_LOGO_URL_HERE",
        },
      },
    };

    setJsonLd("ld-blog-post", articleLd);
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-slate-500">Loading post...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="max-w-md bg-white rounded-lg border border-slate-200 p-4 space-y-2">
            <p className="text-sm font-semibold text-slate-900">
              {error || "Post not found"}
            </p>
            <Link
              to="/blog"
              className="text-xs text-blue-600 hover:underline"
            >
              Back to blog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString()
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <main className="px-4 py-6 lg:py-10">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Link to="/" className="hover:text-slate-800">
                Home
              </Link>
              <span>/</span>
              <Link to="/blog" className="hover:text-slate-800">
                Blog
              </Link>
              <span>/</span>
              <span className="font-medium text-slate-700 line-clamp-1">
                {post.title}
              </span>
            </div>
            <Link
              to="/blog"
              className="text-xs text-slate-500 hover:text-slate-900"
            >
              All Posts
            </Link>
          </div>

          <article className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            {post.coverImage && (
              <div className="w-full h-60 md:h-80 overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            <div className="p-4 md:p-6 space-y-4">
              <header className="space-y-2">
                {post.category && (
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">
                    {post.category}
                  </p>
                )}
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  {post.title}
                </h1>
                {publishedDate && (
                  <p className="text-[11px] text-slate-400">
                    Published on {publishedDate}
                  </p>
                )}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </header>

              {post.excerpt && (
                <p className="text-sm text-slate-600">{post.excerpt}</p>
              )}

              {post.body && (
                <section className="prose prose-sm max-w-none text-slate-800">
                  <div dangerouslySetInnerHTML={{ __html: post.body }} />
                </section>
              )}
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostPage;