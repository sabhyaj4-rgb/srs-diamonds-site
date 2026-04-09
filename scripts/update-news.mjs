import fs from "node:fs/promises";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";

const PROJECT_ROOT = process.cwd();
const HTML_PATH = path.join(PROJECT_ROOT, "public", "SRS_Diamonds_v16.html");
const START_MARKER = "<!-- NEWS_GRID_START (auto-managed by scripts/update-news.mjs) -->";
const END_MARKER = "<!-- NEWS_GRID_END -->";

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_AGE_DAYS = 21;
const MAX_CARDS = 12;

const CATEGORY_META = {
  mining: {
    badge: "Mining &amp; Rough",
    badgeStyle: "background:rgba(201,169,97,0.12); color:var(--gold-dark);",
  },
  market: {
    badge: "Market",
    badgeStyle: "background:rgba(26,26,46,0.07); color:var(--navy);",
  },
  jewellery: {
    badge: "Jewellery",
    badgeStyle: "background:rgba(201,169,97,0.12); color:var(--gold-dark);",
  },
  auctions: {
    badge: "Auctions &amp; Records",
    badgeStyle: "background:rgba(201,169,97,0.12); color:var(--gold-dark);",
  },
  rapaport: {
    badge: "Rapaport",
    badgeStyle: "background:rgba(26,26,46,0.07); color:var(--navy);",
  },
};

// Grid composition pattern keeps visual variety and category balance.
const SLOT_PATTERN = [
  "mining",
  "market",
  "market",
  "jewellery",
  "mining",
  "jewellery",
  "rapaport",
  "rapaport",
  "market",
  "auctions",
  "auctions",
  "market",
];

const FEEDS = {
  mining:
    "https://news.google.com/rss/search?q=diamond+mining+OR+rough+diamonds+when:21d&hl=en-US&gl=US&ceid=US:en",
  market:
    "https://news.google.com/rss/search?q=diamond+market+OR+natural+diamonds+industry+when:21d&hl=en-US&gl=US&ceid=US:en",
  jewellery:
    "https://news.google.com/rss/search?q=jewellery+OR+jewelry+diamond+industry+when:21d&hl=en-US&gl=US&ceid=US:en",
  auctions:
    "https://news.google.com/rss/search?q=christies+OR+sothebys+diamond+auction+when:21d&hl=en-US&gl=US&ceid=US:en",
  rapaport:
    "https://news.google.com/rss/search?q=site:rapaport.com+diamond+news+when:21d&hl=en-US&gl=US&ceid=US:en",
};

const TRUSTED_SOURCES = {
  mining: [
    "riotinto",
    "mining.com",
    "national jeweler",
    "jck",
    "rapaport",
    "diamond world",
    "diamondworld",
  ],
  market: [
    "rapaport",
    "national jeweler",
    "jck",
    "diamond world",
    "diamondworld",
    "natural diamond council",
  ],
  jewellery: [
    "jck",
    "national jeweler",
    "rapaport",
    "diamond world",
    "diamondworld",
    "instore",
  ],
  auctions: [
    "christie's",
    "christies",
    "sotheby's",
    "sothebys",
    "rapaport",
    "national jeweler",
    "jck",
  ],
  rapaport: ["rapaport"],
};

const parser = new XMLParser({
  ignoreAttributes: false,
  parseTagValue: true,
  trimValues: true,
});

function normalizeWhitespace(text) {
  return (text || "").replace(/\s+/g, " ").trim();
}

function decodeBasicEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parsePubDate(value) {
  const d = new Date(value || "");
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function formatDate(date) {
  return date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    })
    .replace(",", "");
}

function trimDescription(input) {
  const text = normalizeWhitespace(
    decodeBasicEntities((input || "").replace(/<[^>]+>/g, " "))
  );
  if (!text) return "Read the full industry update at the source.";
  if (text.length <= 210) return text;
  return `${text.slice(0, 207).trim()}...`;
}

function getSourceText(item) {
  if (!item.source) return "";
  if (typeof item.source === "string") return normalizeWhitespace(item.source).toLowerCase();
  return normalizeWhitespace(item.source["#text"] || "").toLowerCase();
}

function getSourceUrl(item) {
  if (!item.source || typeof item.source === "string") return "";
  return normalizeWhitespace(item.source["@_url"] || "").toLowerCase();
}

function stripTrailingPublisher(title) {
  return title
    .replace(/\s+-\s+[^-]{2,80}$/u, "")
    .replace(/\s+\|\s+[^|]{2,80}$/u, "")
    .trim();
}

function titleFromItem(item) {
  const raw = normalizeWhitespace(decodeBasicEntities(item.title || ""));
  return raw || "Industry Update";
}

function getLink(item) {
  return normalizeWhitespace(item.link || "");
}

function recencyScore(date) {
  if (!date) return Number.POSITIVE_INFINITY;
  return Math.floor((Date.now() - date.getTime()) / DAY_MS);
}

function isRecent(date) {
  if (!date) return false;
  return recencyScore(date) <= MAX_AGE_DAYS;
}

async function fetchFeed(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "srs-news-updater/1.0" },
  });
  if (!res.ok) {
    throw new Error(`Feed request failed (${res.status}) for ${url}`);
  }
  return res.text();
}

function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function parseFeedItems(xmlText) {
  const parsed = parser.parse(xmlText);
  const channel = parsed?.rss?.channel;
  return toArray(channel?.item);
}

function buildArticle(item, category) {
  const title = stripTrailingPublisher(titleFromItem(item));
  const link = getLink(item);
  const pubDate = parsePubDate(item.pubDate);
  const description = trimDescription(item.description || item["content:encoded"]);
  const sourceText = getSourceText(item);
  const sourceUrl = getSourceUrl(item);
  if (!title || !link || !pubDate || !isRecent(pubDate)) return null;

  return {
    title,
    link,
    pubDate,
    description,
    sourceText,
    sourceUrl,
    category,
  };
}

function isTrustedForCategory(article, category) {
  const trusted = TRUSTED_SOURCES[category] || [];
  const sourceBlob = `${article.sourceText} ${article.sourceUrl}`.toLowerCase();
  return trusted.some((keyword) => sourceBlob.includes(keyword));
}

function dedupeArticles(articles) {
  const seenLinks = new Set();
  return articles.filter((a) => {
    if (seenLinks.has(a.link)) return false;
    seenLinks.add(a.link);
    return true;
  });
}

function sortNewestFirst(articles) {
  return [...articles].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}

function pickArticlesByPattern(articlesByCategory, fallbackPool) {
  const chosen = [];
  const usedLinks = new Set();
  const revealCycle = ["reveal-d1", "reveal-d2", "reveal-d3"];

  for (let i = 0; i < SLOT_PATTERN.length && chosen.length < MAX_CARDS; i += 1) {
    const slotCategory = SLOT_PATTERN[i];
    const bucket = articlesByCategory[slotCategory] || [];
    let article = bucket.find((a) => !usedLinks.has(a.link));

    if (!article) {
      article = fallbackPool.find((a) => !usedLinks.has(a.link));
    }
    if (!article) continue;

    usedLinks.add(article.link);
    chosen.push({
      ...article,
      slotCategory,
      revealClass: revealCycle[i % 3],
    });
  }

  return chosen;
}

function buildCardHtml(article) {
  const meta = CATEGORY_META[article.slotCategory] || CATEGORY_META.market;
  const safeTitle = escapeHtml(article.title);
  const safeDesc = escapeHtml(article.description);
  const safeLink = escapeHtml(article.link);
  const dateText = formatDate(article.pubDate);

  return [
    `        <a class="news-card reveal ${article.revealClass}" data-source="${article.slotCategory}" href="${safeLink}" target="_blank" rel="noopener">`,
    "          <div class=\"news-card-inner\">",
    `            <div class="news-meta"><span class="news-source-badge" style="${meta.badgeStyle}">${meta.badge}</span><span class="news-date">${dateText}</span></div>`,
    `            <h3 class="news-title">${safeTitle}</h3>`,
    `            <p class="news-desc">${safeDesc}</p>`,
    "            <span class=\"news-read-more\">Read Article →</span>",
    "          </div>",
    "        </a>",
  ].join("\n");
}

function replaceNewsGrid(html, cardsHtml) {
  const startIdx = html.indexOf(START_MARKER);
  const endIdx = html.indexOf(END_MARKER);

  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
    throw new Error("Could not locate NEWS_GRID_START/NEWS_GRID_END markers in HTML file.");
  }

  const before = html.slice(0, startIdx + START_MARKER.length);
  const after = html.slice(endIdx);
  const block = `\n${cardsHtml}\n        `;
  return `${before}${block}${after}`;
}

async function main() {
  const html = await fs.readFile(HTML_PATH, "utf8");

  const categoryArticles = {};
  for (const [category, url] of Object.entries(FEEDS)) {
    const xml = await fetchFeed(url);
    const items = parseFeedItems(xml);
    let parsed = dedupeArticles(
      items
        .map((item) => buildArticle(item, category))
        .filter(Boolean)
    );
    const trustedOnly = parsed.filter((article) => isTrustedForCategory(article, category));
    if (trustedOnly.length >= 2) {
      parsed = trustedOnly;
    }
    categoryArticles[category] = sortNewestFirst(parsed);
  }

  const fallbackPool = sortNewestFirst(
    dedupeArticles(
      Object.values(categoryArticles)
        .flat()
        .filter((a) => isRecent(a.pubDate))
    )
  );

  const selected = pickArticlesByPattern(categoryArticles, fallbackPool);
  if (selected.length < 6) {
    throw new Error(
      `Not enough recent articles found to safely update grid (found ${selected.length}).`
    );
  }

  const cardsHtml = selected.map(buildCardHtml).join("\n\n");
  const updated = replaceNewsGrid(html, cardsHtml);

  await fs.writeFile(HTML_PATH, updated, "utf8");
  console.log(`Updated news grid with ${selected.length} articles (<= ${MAX_AGE_DAYS} days old).`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
