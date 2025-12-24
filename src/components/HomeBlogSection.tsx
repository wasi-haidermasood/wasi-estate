// src/components/HomeBlogSection.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowRight, Clock } from "lucide-react";

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

const HomeBlogSection: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/posts`);
        if (!res.ok) throw new Error("Failed to load posts");
        const data: Post[] = await res.json();
        // Show only latest 3
        setPosts(data.slice(0, 3));
      } catch (err) {
        console.error("Error loading blog posts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading && posts.length === 0) {
    return (
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <p className="text-xs text-slate-500 text-center">
            Loading latest blog posts...
          </p>
        </div>
      </section>
    );
  }

  if (!posts.length) {
    // No posts yet – you can hide this section or show a simple message
    return null;
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-slate-50/60 to-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1.5 rounded-full mb-2 border border-blue-200">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wide">
                From Our Blog
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
              Latest Insights &amp; Guides
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-1">
              Tips, market updates and guides from Wasi Estate &amp; Builders to
              help you make better property decisions.
            </p>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View all posts
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Posts grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {posts.map((post) => {
            const date = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString()
              : null;

            return (
              <Card
                key={post._id}
                className="border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden bg-white"
              >
                {post.coverImage && (
                  <div className="h-32 w-full overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <CardContent className="p-3 sm:p-4 flex flex-col flex-1 space-y-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      {post.category && (
                        <Badge className="bg-slate-900 text-white text-[10px] px-2 py-0.5">
                          {post.category}
                        </Badge>
                      )}
                      {date && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                          <Clock className="w-3 h-3" />
                          {date}
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="block text-sm font-semibold text-slate-900 hover:underline line-clamp-2"
                    >
                      {post.title}
                    </Link>
                  </div>

                  {post.excerpt && (
                    <p className="text-xs text-slate-600 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-[11px] text-blue-600 hover:underline font-medium"
                    >
                      Read article
                    </Link>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
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
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeBlogSection;