import type { MetadataRoute } from "next";
import { PAGES, SITE_URL } from "@/lib/seo";
import { SHAPES } from "@/lib/shapes";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = Object.values(PAGES).map((p) => ({
    url: `${SITE_URL}${p.path === "/" ? "" : p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency ?? "monthly",
    priority: p.priority ?? 0.5,
  }));

  const shapePages: MetadataRoute.Sitemap = SHAPES.map((s) => ({
    url: `${SITE_URL}/our-diamonds/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...pages, ...shapePages];
}
