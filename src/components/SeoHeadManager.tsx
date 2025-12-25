// src/components/SeoHeadManager.tsx
import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/config";


interface SeoMetaConfig {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  canonicalUrl?: string;
}

interface SeoOpenGraphConfig {
  ogType?: string;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

interface SeoTwitterConfig {
  card?: string;
  title?: string;
  description?: string;
  image?: string;
}

interface SeoSettings {
  meta?: SeoMetaConfig;
  openGraph?: SeoOpenGraphConfig;
  twitter?: SeoTwitterConfig;
  structuredData?: string;
}


function upsertMetaTag(name: string, content: string | undefined) {
  if (!content) return;
  let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertOgTag(property: string, content: string | undefined) {
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

function upsertLinkRel(rel: string, href: string | undefined) {
  if (!href) return;
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

const SeoHeadManager: React.FC = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchSeo = async () => {
      try {
        const res = await fetch(`${API_BASE}/seo`);
        if (!res.ok) throw new Error("Failed to load SEO settings");
        const data: SeoSettings = await res.json();

        // Meta
        if (data.meta) {
          if (data.meta.title) {
            document.title = data.meta.title;
          }
          upsertMetaTag("description", data.meta.description);
          upsertMetaTag("keywords", data.meta.keywords);
          upsertMetaTag("author", data.meta.author);
          upsertLinkRel("canonical", data.meta.canonicalUrl);
        }

        // Open Graph
        if (data.openGraph) {
  upsertOgTag("og:type", data.openGraph.ogType);
  upsertOgTag("og:title", data.openGraph.title || data.meta?.title);
  upsertOgTag(
    "og:description",
    data.openGraph.description || data.meta?.description
  );
  upsertOgTag("og:image", data.openGraph.image);
  upsertOgTag("og:url", data.openGraph.url || data.meta?.canonicalUrl);
}

        // Twitter
        if (data.twitter) {
          upsertMetaTag("twitter:card", data.twitter.card);
          upsertMetaTag(
            "twitter:title",
            data.twitter.title || data.meta?.title
          );
          upsertMetaTag(
            "twitter:description",
            data.twitter.description || data.meta?.description
          );
          upsertMetaTag("twitter:image", data.twitter.image);
        }

        // Structured Data
        if (data.structuredData) {
          let script = document.getElementById(
            "seo-structured-data"
          ) as HTMLScriptElement | null;
          if (!script) {
            script = document.createElement("script");
            script.id = "seo-structured-data";
            script.type = "application/ld+json";
            document.head.appendChild(script);
          }
          script.textContent = data.structuredData;
        }

        setLoaded(true);
      } catch (err) {
        console.error("Failed to apply SEO settings:", err);
        setLoaded(true);
      }
    };

    fetchSeo();
  }, []);

  // Nothing to render, this just mutates document.head
  return null;
};

export default SeoHeadManager;