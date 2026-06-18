import type { Metadata } from "next";

export const SITE_URL = "https://srsdiamonds.com";
const OG_IMAGE = "/home/homepage-rough-polished.png";

type PageSeo = {
  slug: string; // fragment file name (without .html)
  path: string; // public URL path
  title: string;
  description: string;
  // When true, the title is used verbatim (no "| SRS Diamonds" suffix).
  absoluteTitle?: boolean;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
};

// Single source of truth for the site's pages — used by every route's
// metadata and by the sitemap.
export const PAGES: Record<string, PageSeo> = {
  home: {
    slug: "home",
    path: "/",
    title: "SRS Diamonds | Natural Polished Diamonds, Antwerp",
    description:
      "Family-run Antwerp diamond house since 2012. Natural, polished diamonds at one uncompromising standard. From calibrated parcels to GIA certified stones. Purpose in Every Stone.",
    absoluteTitle: true,
    changeFrequency: "weekly",
    priority: 1,
  },
  "our-story": {
    slug: "about",
    path: "/our-story",
    title: "Our Story",
    description:
      "The story of SRS Diamonds — a family-run Antwerp diamond house since 2012, built on one uncompromising standard for natural, polished diamonds.",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  "our-team": {
    slug: "team",
    path: "/our-team",
    title: "Our Team",
    description:
      "Meet the people behind SRS Diamonds — the Antwerp family and specialists who source, grade and supply natural polished diamonds with precision.",
    changeFrequency: "monthly",
    priority: 0.6,
  },
  responsibility: {
    slug: "csr",
    path: "/responsibility",
    title: "CSR & Responsibility",
    description:
      "SRS Diamonds' commitment to responsible sourcing, ethical practice and transparency across the natural diamond supply chain.",
    changeFrequency: "monthly",
    priority: 0.6,
  },
  "our-diamonds": {
    slug: "diamonds",
    path: "/our-diamonds",
    title: "Our Diamonds",
    description:
      "Explore SRS Diamonds' polished diamond shapes — round, pear, marquise, oval, heart, emerald and baguette — sourced to one uncompromising standard.",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  process: {
    slug: "process",
    path: "/process",
    title: "Our Process",
    description:
      "How SRS Diamonds sources, grades and supplies natural polished diamonds — from calibrated parcels to GIA certified stones.",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  "diamond-guide": {
    slug: "guide",
    path: "/diamond-guide",
    title: "Diamond Guide",
    description:
      "A practical guide to natural diamonds — the 4Cs, shapes, certification and what to look for when sourcing polished stones.",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  exhibitions: {
    slug: "events",
    path: "/exhibitions",
    title: "Exhibitions",
    description:
      "Where to meet SRS Diamonds — the international jewellery and diamond trade shows we exhibit at, with booth details.",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  news: {
    slug: "news",
    path: "/news",
    title: "News & Insights",
    description:
      "The latest natural diamond industry news and insights, curated by SRS Diamonds from trusted trade sources.",
    changeFrequency: "daily",
    priority: 0.7,
  },
  faq: {
    slug: "faq",
    path: "/faq",
    title: "FAQ",
    description:
      "Frequently asked questions about sourcing natural polished diamonds from SRS Diamonds in Antwerp.",
    changeFrequency: "monthly",
    priority: 0.5,
  },
  contact: {
    slug: "contact",
    path: "/contact",
    title: "Contact",
    description:
      "Contact SRS Diamonds in Antwerp to enquire about natural polished diamonds, calibrated parcels and GIA certified stones.",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  privacy: {
    slug: "privacy",
    path: "/privacy",
    title: "Privacy Policy",
    description: "How SRS Diamonds handles your data and privacy.",
    changeFrequency: "yearly",
    priority: 0.2,
  },
  terms: {
    slug: "terms",
    path: "/terms",
    title: "Terms",
    description: "Terms of use for the SRS Diamonds website.",
    changeFrequency: "yearly",
    priority: 0.2,
  },
};

export function buildMetadata(key: keyof typeof PAGES): Metadata {
  const p = PAGES[key];
  const title = p.absoluteTitle ? { absolute: p.title } : p.title;
  return {
    title,
    description: p.description,
    alternates: { canonical: p.path },
    openGraph: {
      type: "website",
      siteName: "SRS Diamonds",
      title: p.title,
      description: p.description,
      url: p.path,
      images: [OG_IMAGE],
      locale: "en_GB",
    },
    twitter: {
      card: "summary_large_image",
      title: p.title,
      description: p.description,
      images: [OG_IMAGE],
    },
  };
}
