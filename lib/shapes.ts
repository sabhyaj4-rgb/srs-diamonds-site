// Server-side port of the diamond-shape data and detail markup (mirrors
// /public/site.js) so each /our-diamonds/[shape] page is fully pre-rendered
// and indexable, instead of relying on client JS.

export type Shape = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  svgType: string;
  image: string;
  description: string;
  uncert: string;
  cert: string;
  make: string;
  why: string[];
};

export const SHAPES: Shape[] = [
  {
    id: "rounds", slug: "round", name: "Round", tagline: "The benchmark of brilliance", svgType: "circle", image: "/diamond-shapes/round.png",
    description: "The most sought-after diamond shape for over a century. 58 facets engineered for maximum light return. At SRS, every round is evaluated for exceptional cut grade, proportions, and finish quality.",
    uncert: "0.01ct and above", cert: "0.30ct and above", make: "Excellent Cut only",
    why: ["Superior make quality that maximises brilliance across every size", "Consistent grading across parcels for manufacturing reliability", "Production-ready goods, precise measurements guaranteed"],
  },
  {
    id: "pears", slug: "pear", name: "Pear", tagline: "Grace by design", svgType: "pear", image: "/diamond-shapes/pear.png",
    description: "First cut in the 1400s, the pear remains one of the most challenging shapes to perfect. There is no universal standard. Every pear is personal. At SRS, we precisely gauge, measure, and match to your exact ratio requirements.",
    uncert: "0.03ct to 0.90ct", cert: "0.50ct and above", make: "Superior brilliance,<br>minimal bow-tie",
    why: ["Custom ratio matching: elongated, full, or balanced to your exact specification", "Consistent make quality across all sizes", "Precise measurements to your stated requirement"],
  },
  {
    id: "marquise", slug: "marquise", name: "Marquise", tagline: "Dramatic flair", svgType: "marquise", image: "/diamond-shapes/marquise.png",
    description: "Named after the Marquise de Pompadour, this shape delivers maximum presence and elongation. The perfect marquise requires matched shoulders and defined tips. At SRS, we source only those with exceptional symmetry and optimal ratios.",
    uncert: "0.03ct to 0.90ct", cert: "0.50ct and above", make: "Matched shoulders, clean tips, superior brilliance",
    why: ["Exceptional symmetry and proportions — the hardest thing to find in this shape", "Custom ratio requirements accommodated", "Top make quality without exception"],
  },
  {
    id: "ovals", slug: "oval", name: "Oval", tagline: "Modern elegance", svgType: "oval", image: "/diamond-shapes/oval.png",
    description: "The fastest-growing shape in modern jewellery — more finger coverage, more presence, all the fire of a brilliant cut. Most ovals suffer from bow-tie effect or poor proportions. At SRS, we reject those. What reaches you is the exception.",
    uncert: "0.10ct to 0.90ct", cert: "0.50ct and above", make: "Minimal bow-tie, exceptional light performance",
    why: ["Superior make quality — ovals with visible bow-tie are rejected outright", "Custom ratio matching (1.35 to 1.50 or as specified by you)", "Consistent quality across the full size range"],
  },
  {
    id: "hearts", slug: "heart", name: "Heart", tagline: "Perfected symmetry", svgType: "heart", image: "/diamond-shapes/heart.png",
    description: "One of the most challenging shapes to cut perfectly. Symmetry is everything — even lobes, a clean cleft, a sharp defined point. Most hearts on the market fail this test. At SRS, only those that pass reach our clients.",
    uncert: "0.10ct to 0.90ct", cert: "0.50ct and above", make: "Perfect symmetry, balanced lobes, optimal brilliance",
    why: ["Exceptional symmetry — the standard that eliminates most of the market", "Consistent quality and appearance across parcels", "Top make with strong light performance throughout"],
  },
  {
    id: "emerald", slug: "emerald", name: "Emerald Cut", tagline: "Hall of mirrors", svgType: "emerald", image: "/diamond-shapes/emerald-cut.png",
    description: "Brilliant cuts sparkle. Emerald cuts glow. The step-cut facets create mirror-like flashes that reveal everything — making clarity and colour completely paramount. At SRS, we source emerald cuts with exceptional clarity and crisp step structure.",
    uncert: "0.10ct to 0.90ct", cert: "0.50ct and above", make: "Clean corners, sharp geometry, superior step structure",
    why: ["High clarity standards — step cuts expose everything, we source accordingly", "True symmetry and precise proportions in every stone", "Top make quality — crisp geometry is non-negotiable"],
  },
  {
    id: "baguettes", slug: "baguette", name: "Baguette", tagline: "Architectural precision", svgType: "baguette", image: "/diamond-shapes/baguette.png",
    description: "Clean lines. Sharp edges. Understated elegance. Baguettes are the architectural element of fine jewellery — and they require precise cutting and exceptional clarity to achieve their signature look. At SRS, we supply baguettes with crisp structure and consistent dimensions.",
    uncert: "0.10ct to 0.90ct", cert: "0.50ct and above", make: "Sharp corners, precise proportions, excellent finish",
    why: ["Consistent dimensions for setting ease — critical when used as side stones", "High clarity standards for full step-cut transparency", "Top make in every stone, every parcel"],
  },
];

export function shapeBySlug(slug: string): Shape | undefined {
  return SHAPES.find((s) => s.slug === slug);
}

function shapeSvg(type: string, size: number, color: string): string {
  const sw = 1.1;
  const svgs: Record<string, string> = {
    circle: `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="${sw}" width="${size}" height="${size}"><circle cx="50" cy="50" r="36"/><circle cx="50" cy="50" r="25" stroke-opacity=".4"/><line x1="14" y1="50" x2="86" y2="50" stroke-opacity=".3"/><line x1="50" y1="14" x2="50" y2="86" stroke-opacity=".3"/><line x1="25" y1="25" x2="75" y2="75" stroke-opacity=".15"/><line x1="75" y1="25" x2="25" y2="75" stroke-opacity=".15"/></svg>`,
    pear: `<svg viewBox="0 0 80 120" fill="none" stroke="${color}" stroke-width="${sw}" width="${size * 0.72}" height="${size}"><g transform="rotate(180,40,60)"><path d="M40,108 C40,108 10,78 10,52 C10,28 24,10 40,10 C56,10 70,28 70,52 C70,78 40,108 40,108Z"/><path d="M40,10 C52,16 62,32 62,52 C62,74 48,96 40,108" stroke-opacity=".35"/><line x1="40" y1="10" x2="40" y2="108" stroke-opacity=".25"/><line x1="10" y1="52" x2="70" y2="52" stroke-opacity=".25"/><ellipse cx="40" cy="34" rx="18" ry="16" stroke-opacity=".15"/></g></svg>`,
    marquise: `<svg viewBox="0 0 120 60" fill="none" stroke="${color}" stroke-width="${sw}" width="${size * 1.35}" height="${size * 0.6}"><path d="M60,6 C86,6 114,28 114,30 C114,32 86,54 60,54 C34,54 6,32 6,30 C6,28 34,6 60,6Z"/><line x1="6" y1="30" x2="114" y2="30" stroke-opacity=".25"/><line x1="60" y1="6" x2="60" y2="54" stroke-opacity=".25"/><path d="M60,6 C78,14 100,28 100,30" stroke-opacity=".3"/></svg>`,
    oval: `<svg viewBox="0 0 80 112" fill="none" stroke="${color}" stroke-width="${sw}" width="${size * 0.72}" height="${size}"><ellipse cx="40" cy="56" rx="32" ry="50"/><ellipse cx="40" cy="56" rx="22" ry="36" stroke-opacity=".35"/><line x1="40" y1="6" x2="40" y2="106" stroke-opacity=".25"/><line x1="8" y1="56" x2="72" y2="56" stroke-opacity=".25"/></svg>`,
    emerald: `<svg viewBox="0 0 76 120" fill="none" stroke="${color}" stroke-width="${sw}" width="${size * 0.68}" height="${size}"><path d="M16,8 L60,8 L74,24 L74,96 L60,112 L16,112 L2,96 L2,24Z"/><path d="M22,20 L54,20 L66,32 L66,88 L54,100 L22,100 L10,88 L10,32Z" stroke-opacity=".45"/><line x1="2" y1="60" x2="74" y2="60" stroke-opacity=".22"/><line x1="38" y1="8" x2="38" y2="112" stroke-opacity=".22"/></svg>`,
    heart: `<svg viewBox="0 0 100 96" fill="none" stroke="${color}" stroke-width="${sw}" width="${size}" height="${size * 0.92}"><path d="M50,86 C50,86 8,58 8,30 C8,16 18,8 30,8 C39,8 47,14 50,21 C53,14 61,8 70,8 C82,8 92,16 92,30 C92,58 50,86 50,86Z"/><line x1="50" y1="21" x2="50" y2="86" stroke-opacity=".25"/><line x1="8" y1="30" x2="92" y2="30" stroke-opacity=".25"/></svg>`,
    baguette: `<svg viewBox="0 0 70 112" fill="none" stroke="${color}" stroke-width="${sw}" width="${size * 0.62}" height="${size}"><rect x="6" y="6" width="58" height="100" rx="2"/><rect x="16" y="18" width="38" height="76" rx="1" stroke-opacity=".45"/><line x1="6" y1="56" x2="64" y2="56" stroke-opacity=".2"/><line x1="35" y1="6" x2="35" y2="106" stroke-opacity=".2"/></svg>`,
  };
  return svgs[type] || svgs.circle;
}

// Pre-renders the shape detail markup that the original site built client-side.
export function renderShapeDetailHtml(slug: string): string {
  const s = shapeBySlug(slug);
  if (!s) return "";
  const idx = SHAPES.indexOf(s);
  const prev = SHAPES[(idx - 1 + SHAPES.length) % SHAPES.length];
  const next = SHAPES[(idx + 1) % SHAPES.length];
  return `
    <div class="shape-hero-section">
      <div class="container">
        <div class="shape-hero-grid">
          <div class="shape-hero-text">
            <div class="overline">${idx + 1} of ${SHAPES.length} shapes</div>
            <h1>${s.name}</h1>
            <div class="rule"></div>
            <p>${s.tagline}</p>
          </div>
          <div class="shape-hero-visual">
            <div class="shape-large-svg">${shapeSvg(s.svgType, 220, "#C9A961")}</div>
          </div>
        </div>
      </div>
    </div>
    <section class="section-pad" style="background:var(--white);">
      <div class="container">
        <div class="two-col gap-lg" style="align-items:start;">
          <div class="reveal-left">
            <div class="overline">About This Shape</div>
            <h2>${s.name}</h2>
            <div class="rule"></div>
            <p style="margin-top:20px; font-size:1.02rem;">${s.description}</p>
          </div>
          <div class="why-box reveal-right">
            <h3>Why Clients Choose SRS for ${s.name}</h3>
            <ul class="why-list">
              ${s.why.map((w) => `<li>${w}</li>`).join("")}
            </ul>
          </div>
        </div>
        <div class="spec-bar reveal">
          <div class="spec-item">
            <div class="spec-label">Non-Certified Range</div>
            <div class="spec-value">${s.uncert}</div>
          </div>
          <div class="spec-item">
            <div class="spec-label">GIA Certified From</div>
            <div class="spec-value">${s.cert}</div>
          </div>
          <div class="spec-item">
            <div class="spec-label">Make Standard</div>
            <div class="spec-value">${s.make}</div>
          </div>
        </div>
        <div class="options-row reveal">
          <div class="option-tile">
            <h3>Non-Certified</h3>
            <p>${s.uncert} for manufacturing and production. Same SRS quality, greater flexibility.</p>
          </div>
          <div class="option-tile">
            <h3>GIA Certified</h3>
            <p>${s.cert} with independent certification. For clients who require third-party verification.</p>
          </div>
          <div class="option-tile">
            <h3>Parcel Supply</h3>
            <p>Matched ${s.name.toLowerCase()} parcels with consistent proportions and quality throughout.</p>
          </div>
        </div>
        <div style="display:flex; gap:16px; flex-wrap:wrap; align-items:center; margin-top:20px;" class="reveal">
          <a class="btn btn-navy" href="/contact">Enquire About ${s.name}</a>
          <a class="btn btn-outline-navy" href="/our-diamonds">← All Shapes</a>
          <div style="margin-left:auto; display:flex; gap:16px;">
            <a class="btn-text-link" href="/our-diamonds/${prev.slug}">← ${prev.name}</a>
            <a class="btn-text-link" href="/our-diamonds/${next.slug}">${next.name} →</a>
          </div>
        </div>
      </div>
    </section>
  `;
}
