/* ════════════════════════════════════════════════════════════════════
   SRS Diamonds — shared site behaviour (multi-page)
   Loaded on every page. Adapted from the original single-page script:
   - navigate()/navigateShape() now perform real URL navigation.
   - The page section present on each route is activated and its
     page-specific initialisers run.
   - Language choice persists across in-session link navigations but
     resets to English on a fresh visit or browser refresh.
   ════════════════════════════════════════════════════════════════════ */

// Map internal page keys / shape ids to the new public URLs.
var PAGE_URLS = {
  home: '/', about: '/our-story', team: '/our-team', csr: '/responsibility',
  sustainability: '/sustainability-compliance',
  diamonds: '/our-diamonds', process: '/process', guide: '/diamond-guide',
  events: '/exhibitions', news: '/news', faq: '/faq', contact: '/contact',
  privacy: '/privacy', terms: '/terms'
};
var SHAPE_SLUG = {
  rounds: 'round', pears: 'pear', marquise: 'marquise', ovals: 'oval',
  hearts: 'heart', emerald: 'emerald', baguettes: 'baguette'
};

// ═══════════════════════════════════════════
// SHAPE DATA
// ═══════════════════════════════════════════
const shapes = [
  {
    id: 'rounds', name: 'Round', tagline: 'The benchmark of brilliance', svgType: 'circle', image: '/diamond-shapes/round.png',
    description: 'The most sought-after diamond shape for over a century. 58 facets engineered for maximum light return. At SRS, every round is evaluated for exceptional cut grade, proportions, and finish quality.',
    uncert: '0.01ct and above', cert: '0.30ct and above', make: 'Excellent Cut only',
    why: ['Superior make quality that maximises brilliance across every size', 'Consistent grading across parcels for manufacturing reliability', 'Production-ready goods, precise measurements guaranteed']
  },
  {
    id: 'pears', name: 'Pear', tagline: 'Grace by design', svgType: 'pear', image: '/diamond-shapes/pear.png',
    description: 'First cut in the 1400s, the pear remains one of the most challenging shapes to perfect. There is no universal standard. Every pear is personal. At SRS, we precisely gauge, measure, and match to your exact ratio requirements.',
    uncert: '0.03ct to 0.90ct', cert: '0.50ct and above', make: 'Superior brilliance,<br>minimal bow-tie',
    why: ['Custom ratio matching: elongated, full, or balanced to your exact specification', 'Consistent make quality across all sizes', 'Precise measurements to your stated requirement']
  },
  {
    id: 'marquise', name: 'Marquise', tagline: 'Dramatic flair', svgType: 'marquise', image: '/diamond-shapes/marquise.png',
    description: 'Named after the Marquise de Pompadour, this shape delivers maximum presence and elongation. The perfect marquise requires matched shoulders and defined tips. At SRS, we source only those with exceptional symmetry and optimal ratios.',
    uncert: '0.03ct to 0.90ct', cert: '0.50ct and above', make: 'Matched shoulders, clean tips, superior brilliance',
    why: ['Exceptional symmetry and proportions — the hardest thing to find in this shape', 'Custom ratio requirements accommodated', 'Top make quality without exception']
  },
  {
    id: 'ovals', name: 'Oval', tagline: 'Modern elegance', svgType: 'oval', image: '/diamond-shapes/oval.png',
    description: 'The fastest-growing shape in modern jewellery — more finger coverage, more presence, all the fire of a brilliant cut. Most ovals suffer from bow-tie effect or poor proportions. At SRS, we reject those. What reaches you is the exception.',
    uncert: '0.10ct to 0.90ct', cert: '0.50ct and above', make: 'Minimal bow-tie, exceptional light performance',
    why: ['Superior make quality — ovals with visible bow-tie are rejected outright', 'Custom ratio matching (1.35 to 1.50 or as specified by you)', 'Consistent quality across the full size range']
  },
  {
    id: 'hearts', name: 'Heart', tagline: 'Perfected symmetry', svgType: 'heart', image: '/diamond-shapes/heart.png',
    description: 'One of the most challenging shapes to cut perfectly. Symmetry is everything — even lobes, a clean cleft, a sharp defined point. Most hearts on the market fail this test. At SRS, only those that pass reach our clients.',
    uncert: '0.10ct to 0.90ct', cert: '0.50ct and above', make: 'Perfect symmetry, balanced lobes, optimal brilliance',
    why: ['Exceptional symmetry — the standard that eliminates most of the market', 'Consistent quality and appearance across parcels', 'Top make with strong light performance throughout']
  },
  {
    id: 'emerald', name: 'Emerald Cut', tagline: 'Hall of mirrors', svgType: 'emerald', image: '/diamond-shapes/emerald-cut.png',
    description: 'Brilliant cuts sparkle. Emerald cuts glow. The step-cut facets create mirror-like flashes that reveal everything — making clarity and colour completely paramount. At SRS, we source emerald cuts with exceptional clarity and crisp step structure.',
    uncert: '0.10ct to 0.90ct', cert: '0.50ct and above', make: 'Clean corners, sharp geometry, superior step structure',
    why: ['High clarity standards — step cuts expose everything, we source accordingly', 'True symmetry and precise proportions in every stone', 'Top make quality — crisp geometry is non-negotiable']
  },
  {
    id: 'baguettes', name: 'Baguette', tagline: 'Architectural precision', svgType: 'baguette', image: '/diamond-shapes/baguette.png',
    description: 'Clean lines. Sharp edges. Understated elegance. Baguettes are the architectural element of fine jewellery — and they require precise cutting and exceptional clarity to achieve their signature look. At SRS, we supply baguettes with crisp structure and consistent dimensions.',
    uncert: '0.10ct to 0.90ct', cert: '0.50ct and above', make: 'Sharp corners, precise proportions, excellent finish',
    why: ['Consistent dimensions for setting ease — critical when used as side stones', 'High clarity standards for full step-cut transparency', 'Top make in every stone, every parcel']
  }
];

// ═══════════════════════════════════════════
// SVG SHAPE RENDERS
// ═══════════════════════════════════════════
function getShapeSVG(type, size, color) {
  color = color || '#D4B56A';
  size = size || 108;
  const sw = 1.1;
  const svgs = {
    circle: `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="${sw}" width="${size}" height="${size}"><circle cx="50" cy="50" r="36"/><circle cx="50" cy="50" r="25" stroke-opacity=".4"/><line x1="14" y1="50" x2="86" y2="50" stroke-opacity=".3"/><line x1="50" y1="14" x2="50" y2="86" stroke-opacity=".3"/><line x1="25" y1="25" x2="75" y2="75" stroke-opacity=".15"/><line x1="75" y1="25" x2="25" y2="75" stroke-opacity=".15"/></svg>`,
    pear: `<svg viewBox="0 0 80 120" fill="none" stroke="${color}" stroke-width="${sw}" width="${size*0.72}" height="${size}"><g transform="rotate(180,40,60)"><path d="M40,108 C40,108 10,78 10,52 C10,28 24,10 40,10 C56,10 70,28 70,52 C70,78 40,108 40,108Z"/><path d="M40,10 C52,16 62,32 62,52 C62,74 48,96 40,108" stroke-opacity=".35"/><line x1="40" y1="10" x2="40" y2="108" stroke-opacity=".25"/><line x1="10" y1="52" x2="70" y2="52" stroke-opacity=".25"/><ellipse cx="40" cy="34" rx="18" ry="16" stroke-opacity=".15"/></g></svg>`,
    marquise: `<svg viewBox="0 0 120 60" fill="none" stroke="${color}" stroke-width="${sw}" width="${size*1.35}" height="${size*0.6}"><path d="M60,6 C86,6 114,28 114,30 C114,32 86,54 60,54 C34,54 6,32 6,30 C6,28 34,6 60,6Z"/><line x1="6" y1="30" x2="114" y2="30" stroke-opacity=".25"/><line x1="60" y1="6" x2="60" y2="54" stroke-opacity=".25"/><path d="M60,6 C78,14 100,28 100,30" stroke-opacity=".3"/></svg>`,
    oval: `<svg viewBox="0 0 80 112" fill="none" stroke="${color}" stroke-width="${sw}" width="${size*0.72}" height="${size}"><ellipse cx="40" cy="56" rx="32" ry="50"/><ellipse cx="40" cy="56" rx="22" ry="36" stroke-opacity=".35"/><line x1="40" y1="6" x2="40" y2="106" stroke-opacity=".25"/><line x1="8" y1="56" x2="72" y2="56" stroke-opacity=".25"/></svg>`,
    emerald: `<svg viewBox="0 0 76 120" fill="none" stroke="${color}" stroke-width="${sw}" width="${size*0.68}" height="${size}"><path d="M16,8 L60,8 L74,24 L74,96 L60,112 L16,112 L2,96 L2,24Z"/><path d="M22,20 L54,20 L66,32 L66,88 L54,100 L22,100 L10,88 L10,32Z" stroke-opacity=".45"/><line x1="2" y1="60" x2="74" y2="60" stroke-opacity=".22"/><line x1="38" y1="8" x2="38" y2="112" stroke-opacity=".22"/></svg>`,
    heart: `<svg viewBox="0 0 100 96" fill="none" stroke="${color}" stroke-width="${sw}" width="${size}" height="${size*0.92}"><path d="M50,86 C50,86 8,58 8,30 C8,16 18,8 30,8 C39,8 47,14 50,21 C53,14 61,8 70,8 C82,8 92,16 92,30 C92,58 50,86 50,86Z"/><line x1="50" y1="21" x2="50" y2="86" stroke-opacity=".25"/><line x1="8" y1="30" x2="92" y2="30" stroke-opacity=".25"/></svg>`,
    baguette: `<svg viewBox="0 0 70 112" fill="none" stroke="${color}" stroke-width="${sw}" width="${size*0.62}" height="${size}"><rect x="6" y="6" width="58" height="100" rx="2"/><rect x="16" y="18" width="38" height="76" rx="1" stroke-opacity=".45"/><line x1="6" y1="56" x2="64" y2="56" stroke-opacity=".2"/><line x1="35" y1="6" x2="35" y2="106" stroke-opacity=".2"/></svg>`
  };
  return svgs[type] || svgs.circle;
}

// ═══════════════════════════════════════════
// RENDER SHAPE CARDS (links to /our-diamonds/<slug>)
// ═══════════════════════════════════════════
function renderShapeCards(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = shapes.map((s, i) => {
    return `<a class="shape-card reveal reveal-d${Math.min(i+1,6)}" data-shape="${s.id}" href="/our-diamonds/${SHAPE_SLUG[s.id] || ''}">
      <div class="shape-img">
        <img class="shape-photo" src="${s.image || ''}" alt="${s.name} diamond shape" loading="lazy" decoding="async">
      </div>
      <div class="shape-info">
        <h3>${s.name}</h3>
        <p>${s.tagline}</p>
        <span class="btn-text-link">View Details →</span>
      </div>
    </a>`;
  }).join('');
  initAnimations();
}

// ═══════════════════════════════════════════
// RENDER SHAPE DETAIL PAGE
// ═══════════════════════════════════════════
function renderShapeDetail(id) {
  const s = shapes.find(x => x.id === id);
  if (!s) return;
  const idx = shapes.indexOf(s);
  const prev = shapes[(idx - 1 + shapes.length) % shapes.length];
  const next = shapes[(idx + 1) % shapes.length];
  const content = document.getElementById('shape-detail-content');
  if (!content) return;
  content.innerHTML = `
    <div class="shape-hero-section">
      <div class="container">
        <div class="shape-hero-grid">
          <div class="shape-hero-text">
            <div class="overline">${idx+1} of ${shapes.length} shapes</div>
            <h1>${s.name}</h1>
            <div class="rule"></div>
            <p>${s.tagline}</p>
          </div>
          <div class="shape-hero-visual">
            <div class="shape-large-svg">${getShapeSVG(s.svgType, 220, '#C9A961')}</div>
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
              ${s.why.map(w => `<li>${w}</li>`).join('')}
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
            <a class="btn-text-link" href="/our-diamonds/${SHAPE_SLUG[prev.id]}">← ${prev.name}</a>
            <a class="btn-text-link" href="/our-diamonds/${SHAPE_SLUG[next.id]}">${next.name} →</a>
          </div>
        </div>
      </div>
    </section>
  `;
  initAnimations();
}

// ═══════════════════════════════════════════
// ROUTING — real navigation (kept for in-content buttons)
// ═══════════════════════════════════════════
function navigate(page) {
  location.assign(PAGE_URLS[page] || '/');
}
function navigateShape(id) {
  location.assign('/our-diamonds/' + (SHAPE_SLUG[id] || ''));
}

// Highlight the current nav item based on the URL.
function markActiveNav() {
  const path = location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a[href]').forEach(a => {
    const href = (a.getAttribute('href') || '').replace(/\/$/, '') || '/';
    a.classList.toggle('active-link', href === path);
  });
}

// ═══════════════════════════════════════════
// MOBILE MENU
// ═══════════════════════════════════════════
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  if (!menu) return;
  const isOpening = !menu.classList.contains('open');
  menu.classList.toggle('open', isOpening);
  document.body.style.overflow = isOpening ? 'hidden' : '';
  if (!isOpening) closeMobileSubmenus();
}
function closeMenu() {
  const menu = document.getElementById('mobileMenu');
  if (!menu) return;
  menu.classList.remove('open');
  document.body.style.overflow = '';
  closeMobileSubmenus();
}
function closeMobileSubmenus() {
  document.querySelectorAll('.mobile-item.has-children').forEach(item => {
    item.classList.remove('open');
  });
}
function toggleMobileSubmenu(menuKey) {
  const target = document.querySelector(`.mobile-item.has-children[data-menu="${menuKey}"]`);
  if (!target) return;
  const shouldOpen = !target.classList.contains('open');
  closeMobileSubmenus();
  if (shouldOpen) target.classList.add('open');
}

// ═══════════════════════════════════════════
// LANGUAGE SWITCHER (drives GTranslate)
// Behaviour for the multi-page site:
//  • Fresh visit or browser refresh always starts in English (the googtrans
//    cookie is cleared by an early inline script before GTranslate loads).
//  • Choosing a language stores it for the session (sessionStorage) and sets
//    the cookie, so it persists as the visitor clicks through to other pages.
//  • Choosing English clears it and reloads to restore the original page.
// ═══════════════════════════════════════════
const SUPPORTED_LANGS = ['en', 'fr', 'it', 'es', 'nl', 'ar'];

function googtransDomains() {
  const host = location.hostname;
  const list = [''];
  const parts = host.split('.');
  for (let i = 0; i < parts.length - 1; i++) list.push('.' + parts.slice(i).join('.'));
  return list;
}
function clearGoogTransCookie() {
  const past = 'Thu, 01 Jan 1970 00:00:00 UTC';
  googtransDomains().forEach(d => {
    const dom = d ? ';domain=' + d : '';
    document.cookie = 'googtrans=;expires=' + past + ';path=/' + dom;
  });
}
function setGoogTransCookie(code) {
  clearGoogTransCookie();
  if (code === 'en') return;
  const val = '/en/' + code;
  googtransDomains().forEach(d => {
    const dom = d ? ';domain=' + d : '';
    document.cookie = 'googtrans=' + val + ';path=/' + dom;
  });
}
function storeLang(code) {
  try {
    if (code === 'en') sessionStorage.removeItem('srsLang');
    else sessionStorage.setItem('srsLang', code);
  } catch (e) {}
}
function storedLang() {
  try {
    const v = sessionStorage.getItem('srsLang');
    return SUPPORTED_LANGS.includes(v) ? v : 'en';
  } catch (e) { return 'en'; }
}
function updateSwitcherLabel(code) {
  const label = document.querySelector('[data-lang-label]');
  if (label) label.textContent = code.toUpperCase();
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.classList.toggle('lang-active', el.getAttribute('data-lang') === code);
  });
}
function translateInPlace(code) {
  const combo = document.querySelector('select.goog-te-combo');
  if (!combo) return false;
  combo.value = code;
  combo.dispatchEvent(new Event('change'));
  return true;
}
function setLanguage(code) {
  if (!SUPPORTED_LANGS.includes(code)) code = 'en';
  closeMenu();
  if (code === 'en') {
    storeLang('en');
    clearGoogTransCookie();
    updateSwitcherLabel('en');
    location.reload();
    return;
  }
  storeLang(code);
  setGoogTransCookie(code);
  updateSwitcherLabel(code);
  if (!translateInPlace(code)) {
    let tries = 0;
    const timer = setInterval(() => {
      if (translateInPlace(code) || ++tries > 50) clearInterval(timer);
    }, 100);
  }
}
function initLanguageState() {
  const code = storedLang();
  updateSwitcherLabel(code);
  // The early inline script already set/cleared the cookie so GTranslate
  // auto-translates on load. Retry in-place as a fallback if needed.
  if (code !== 'en') {
    let tries = 0;
    const timer = setInterval(() => {
      if (translateInPlace(code) || ++tries > 50) clearInterval(timer);
    }, 100);
  }
}

// ═══════════════════════════════════════════
// CONTACT FORM — country select helper
// ═══════════════════════════════════════════
function initMobileCountrySelect() {
  const textInput = document.getElementById('f-country');
  const mobileSelect = document.getElementById('f-country-mobile');
  const list = document.getElementById('country-list');
  if (!textInput || !mobileSelect || !list) return;

  if (mobileSelect.options.length <= 1) {
    const values = Array.from(list.querySelectorAll('option'))
      .map(opt => opt.value.trim())
      .filter(Boolean);
    values.forEach(value => {
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = value;
      mobileSelect.appendChild(opt);
    });
  }
  mobileSelect.addEventListener('change', () => { textInput.value = mobileSelect.value; });
  textInput.addEventListener('input', () => {
    if (window.matchMedia('(max-width: 767px)').matches) mobileSelect.value = textInput.value;
  });
}

// ═══════════════════════════════════════════
// SCROLL ANIMATIONS (Intersection Observer)
// ═══════════════════════════════════════════
let observer = null;
function initAnimations() {
  if (observer) observer.disconnect();
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.page.active .reveal, .page.active .reveal-left, .page.active .reveal-right').forEach(el => {
    observer.observe(el);
  });
}

// ═══════════════════════════════════════════
// NAV — scroll shadow + adaptive frosted tint (Apple-style)
// ═══════════════════════════════════════════
(function initAdaptiveNav() {
  var nav = document.getElementById('mainNav');
  if (!nav) return;

  if (!nav.querySelector('.nav-backdrop')) {
    var inner = nav.querySelector('.nav-inner');
    var backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    if (inner) nav.insertBefore(backdrop, inner);
    else nav.appendChild(backdrop);
  }

  var NAV_TINT_CLASSES = {
    hero: [15, 21, 32],
    'page-hero': [245, 241, 235],
    'section-blend-cream': [253, 252, 250],
    'section-blend-navy': [22, 26, 44],
    'shapes-section': [250, 249, 247],
    'shape-card': [255, 255, 255],
    proposition: [255, 255, 255],
    'trust-strip': [22, 26, 44],
    statement: [22, 26, 44],
    'visual-block': [22, 26, 44],
    'shape-hero-section': [22, 26, 44],
    'contact-card': [22, 26, 44],
    footer: [240, 237, 230]
  };

  var NAV_ALPHA_REST = 0.97;
  var NAV_ALPHA_SCROLL = 1;
  var NAV_BLUR_REST = '0px';
  var NAV_BLUR_SCROLL = '20px';
  var NAV_MIN = 236;
  var BASE_TINT = { r: 255, g: 255, b: 255 };

  var current = { r: 255, g: 255, b: 255 };
  var target = { r: 255, g: 255, b: 255 };
  var rafId = null;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function parseRgb(str) {
    if (!str) return null;
    var m = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (!m) return null;
    return { r: +m[1], g: +m[2], b: +m[3] };
  }

  function luminance(rgb) {
    return 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
  }

  function tintFromClasses(el) {
    while (el && el !== document.documentElement) {
      if (el.classList) {
        for (var cls in NAV_TINT_CLASSES) {
          if (el.classList.contains(cls)) {
            var c = NAV_TINT_CLASSES[cls];
            return { r: c[0], g: c[1], b: c[2] };
          }
        }
      }
      var attr = el.getAttribute && el.getAttribute('data-nav-tint');
      if (attr) {
        var parsed = parseRgb(attr);
        if (parsed) return parsed;
      }
      el = el.parentElement;
    }
    return null;
  }

  function tintFromComputed(el) {
    while (el && el !== document.documentElement) {
      var fromClass = tintFromClasses(el);
      if (fromClass) return fromClass;
      var bg = getComputedStyle(el).backgroundColor;
      var parsed = parseRgb(bg);
      if (parsed) {
        var alphaMatch = bg.match(/rgba\([^)]+,\s*([\d.]+)\s*\)/);
        if (!alphaMatch || parseFloat(alphaMatch[1]) > 0.05) return parsed;
      }
      el = el.parentElement;
    }
    return { r: 255, g: 255, b: 255 };
  }

  function sampleBehindNav() {
    var h = nav.offsetHeight || 76;
    var y = Math.max(1, Math.floor(h * 0.55));
    var w = window.innerWidth;
    var xs = [w * 0.12, w * 0.32, w * 0.5, w * 0.68, w * 0.88];
    var r = 0, g = 0, b = 0, n = 0;
    var prevPointer = nav.style.pointerEvents;
    nav.style.pointerEvents = 'none';
    for (var i = 0; i < xs.length; i++) {
      var el = document.elementFromPoint(Math.floor(xs[i]), y);
      if (!el || nav.contains(el)) continue;
      var c = tintFromComputed(el);
      r += c.r; g += c.g; b += c.b; n++;
    }
    nav.style.pointerEvents = prevPointer;
    if (!n) return { r: 255, g: 255, b: 255 };
    return { r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n) };
  }

  function applyTint(rgb, scrolling) {
    nav.style.setProperty('--nav-tint-r', String(rgb.r));
    nav.style.setProperty('--nav-tint-g', String(rgb.g));
    nav.style.setProperty('--nav-tint-b', String(rgb.b));
    nav.style.setProperty('--nav-tint-a', String(scrolling ? NAV_ALPHA_SCROLL : NAV_ALPHA_REST));
    nav.style.setProperty('--nav-blur', scrolling ? NAV_BLUR_SCROLL : NAV_BLUR_REST);
    nav.classList.toggle('nav-adaptive', scrolling);
  }

  function frostedFromSample(sample) {
    var lum = luminance(sample);
    var hint = lum < 90 ? 0.17 : lum < 140 ? 0.21 : lum < 200 ? 0.25 : 0.29;
    return {
      r: Math.max(NAV_MIN, Math.round(255 * (1 - hint) + sample.r * hint)),
      g: Math.max(NAV_MIN, Math.round(255 * (1 - hint) + sample.g * hint)),
      b: Math.max(NAV_MIN, Math.round(255 * (1 - hint) + sample.b * hint))
    };
  }

  function tick() {
    var ease = reduceMotion ? 1 : 0.1;
    current.r += (target.r - current.r) * ease;
    current.g += (target.g - current.g) * ease;
    current.b += (target.b - current.b) * ease;
    applyTint(frostedFromSample({
      r: Math.round(current.r),
      g: Math.round(current.g),
      b: Math.round(current.b)
    }), true);
    var settled = Math.abs(current.r - target.r) < 0.5 &&
      Math.abs(current.g - target.g) < 0.5 &&
      Math.abs(current.b - target.b) < 0.5;
    if (!settled && !reduceMotion) rafId = requestAnimationFrame(tick);
    else rafId = null;
  }

  function updateNavTint() {
    var atRest = window.scrollY <= 20;
    nav.classList.toggle('scrolled', !atRest);
    if (atRest) {
      target = BASE_TINT;
      current = BASE_TINT;
      applyTint(BASE_TINT, false);
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      return;
    }
    target = sampleBehindNav();
    if (reduceMotion) {
      current = { r: target.r, g: target.g, b: target.b };
      applyTint(frostedFromSample(target), true);
      return;
    }
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  window.addEventListener('scroll', updateNavTint, { passive: true });
  window.addEventListener('resize', updateNavTint, { passive: true });
  window.addEventListener('load', updateNavTint);
  updateNavTint();
})();

// ═══════════════════════════════════════════
// PARALLAX — Hero background elements (home only)
// ═══════════════════════════════════════════
window.addEventListener('scroll', () => {
  const home = document.getElementById('page-home');
  if (!home || !home.classList.contains('active')) return;
  const scrollY = window.scrollY;
  const geo = document.getElementById('heroGeo');
  if (geo) geo.style.transform = `translateY(calc(-50% + ${scrollY * 0.18}px))`;
  const map = document.getElementById('heroMap');
  if (map) map.style.transform = `translateY(calc(-50% + ${scrollY * 0.1}px))`;
}, { passive: true });

// ═══════════════════════════════════════════
// PARTICLE CANVAS — ambient drifting diamond lights (home only)
// ═══════════════════════════════════════════
function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth  || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => {
    resize();
    particles.forEach(p => { p.x = Math.random() * canvas.width; p.y = Math.random() * canvas.height; });
  }, { passive: true });

  const count = window.innerWidth < 768 ? 55 : 110;
  const particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    size: Math.random() * 1.8 + 0.4,
    speedX: (Math.random() - 0.5) * 0.25, speedY: (Math.random() - 0.5) * 0.25,
    baseOpacity: Math.random() * 0.45 + 0.08,
    pulse: Math.random() * Math.PI * 2, pulseSpeed: Math.random() * 0.018 + 0.004,
    isStar: Math.random() > 0.72
  }));

  function animate() {
    const home = document.getElementById('page-home');
    if (!home || !home.classList.contains('active')) { requestAnimationFrame(animate); return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.pulse += p.pulseSpeed; p.x += p.speedX; p.y += p.speedY;
      if (p.x < -5) p.x = canvas.width + 5;
      if (p.x > canvas.width + 5) p.x = -5;
      if (p.y < -5) p.y = canvas.height + 5;
      if (p.y > canvas.height + 5) p.y = -5;
      const op = p.baseOpacity * (0.6 + 0.4 * Math.sin(p.pulse));
      ctx.fillStyle = `rgba(201,169,97,${op})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      if (p.isStar && p.size > 1.2) {
        const arm = p.size * 4; const glowOp = op * 0.35;
        ctx.strokeStyle = `rgba(201,169,97,${glowOp})`; ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(p.x - arm, p.y); ctx.lineTo(p.x + arm, p.y);
        ctx.moveTo(p.x, p.y - arm); ctx.lineTo(p.x, p.y + arm);
        ctx.stroke();
      }
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// ── CONTACT FORM VALIDATION ──
function scrollToHomeNextSection() {
  const target = document.getElementById('home-glance-section');
  if (!target) return;
  const startY = window.scrollY;
  const navH = (document.getElementById('mainNav')?.offsetHeight || 88);
  const targetY = target.getBoundingClientRect().top + window.scrollY - navH - 10;
  const duration = 1200;
  const start = performance.now();
  const easeInOutCubic = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + (targetY - startY) * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const CONTACT_FORM_ENDPOINT = '/api/contact';

async function validateForm(e) {
  e.preventDefault();
  const fields = ['f-name','f-company','f-email','f-phone','f-country','f-message'];
  const errEl = document.getElementById('form-error');
  const successEl = document.getElementById('form-success');
  const submitBtn = document.getElementById('form-submit-btn');
  let valid = true;
  if (successEl) successEl.style.display = 'none';
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (!el.value.trim()) { el.style.borderColor = '#C0392B'; valid = false; }
    else { el.style.borderColor = ''; }
  });
  const emailValue = document.getElementById('f-email').value.trim();
  const phoneValue = document.getElementById('f-phone').value.trim();
  const emailEl = document.getElementById('f-email');
  const phoneEl = document.getElementById('f-phone');

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailValue);
  if (!emailOk) { if (emailEl) emailEl.style.borderColor = '#C0392B'; valid = false; }

  const compactPhone = phoneValue.replace(/[\s\-()]/g, '');
  const phoneOk = /^\+\d{6,15}$/.test(compactPhone) || /^00\d{6,15}$/.test(compactPhone);
  if (!phoneOk) { if (phoneEl) phoneEl.style.borderColor = '#C0392B'; valid = false; }

  if (!valid) {
    const errMsg = errEl.querySelector('p');
    if (errMsg) errMsg.textContent = 'Please complete required fields correctly. Email must be valid and phone must include country code (+ or 00).';
    errEl.style.display = 'block';
    return false;
  }
  const errMsg = errEl.querySelector('p');
  if (errMsg) errMsg.textContent = 'Please fill in all required fields before submitting.';
  errEl.style.display = 'none';
  const name = document.getElementById('f-name').value.trim();
  const company = document.getElementById('f-company').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const phone = document.getElementById('f-phone').value.trim();
  const country = document.getElementById('f-country').value.trim();
  const message = document.getElementById('f-message').value.trim();
  const interests = [...document.querySelectorAll('input[name="interest"]:checked')].map(el => el.value);
  const shapeSel = [...document.querySelectorAll('input[name="shape"]:checked')].map(el => el.value);

  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }

  try {
    const gotcha = document.querySelector('#contactForm input[name="_gotcha"]');
    const res = await fetch(CONTACT_FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name, company, email, phone, country, message,
        interests, shapes: shapeSel,
        _gotcha: gotcha ? gotcha.value : '',
      }),
    });
    if (!res.ok) {
      let detail = 'Failed to submit enquiry';
      try {
        const data = await res.json();
        if (data?.error) detail = data.error;
      } catch (_) {}
      throw new Error(detail);
    }
    if (successEl) successEl.style.display = 'block';
    const formEl = document.getElementById('contactForm');
    if (formEl) formEl.reset();
    const mobileCountry = document.getElementById('f-country-mobile');
    if (mobileCountry) mobileCountry.value = '';
  } catch (err) {
    errEl.querySelector('p').textContent = 'We could not send your enquiry right now. Please try again in a moment.';
    errEl.style.display = 'block';
  } finally {
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Enquiry'; }
  }
  return false;
}

// ── NEWS FILTER ──
function filterNews(source) {
  const grid = document.getElementById('newsGrid');
  if (grid) {
    const cards = Array.from(grid.querySelectorAll('.news-card'));
    cards.sort((a, b) => {
      const ta = Date.parse(a.dataset.published || '') || 0;
      const tb = Date.parse(b.dataset.published || '') || 0;
      return tb - ta;
    });
    cards.forEach((c) => grid.appendChild(c));
  }
  document.querySelectorAll('.news-filter').forEach(btn => {
    btn.classList.toggle('active-filter', btn.dataset.filter === source);
  });
  document.querySelectorAll('.news-card').forEach(card => {
    if (source === 'all') card.style.display = '';
    else card.style.display = card.dataset.source === source ? '' : 'none';
  });
}

// ═══════════════════════════════════════════
// PAGE INIT
// ═══════════════════════════════════════════
function initPage() {
  // Make the single section on this route visible.
  const section = document.querySelector('.page');
  if (section) section.classList.add('active');
  const id = section ? section.id.replace('page-', '') : '';

  markActiveNav();
  initLanguageState();
  initMobileCountrySelect();

  if (id === 'home') { renderShapeCards('home-shapes-grid'); initParticles(); }
  else if (id === 'diamonds') { renderShapeCards('diamonds-shapes-grid'); }
  else if (id === 'shape') {
    // The detail markup is pre-rendered server-side; only build it client-side
    // as a fallback if the container is empty.
    const c = document.getElementById('shape-detail-content');
    if (c && !c.innerHTML.trim()) renderShapeDetail(section.getAttribute('data-shape-id'));
  }

  setTimeout(initAnimations, 100);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}

// ═══════════════════════════════════════════
// CURSOR RADIAL GLOW
// ═══════════════════════════════════════════
(function() {
  const glow = document.createElement('div');
  glow.style.cssText = [
    'position:fixed','top:0','left:0','width:360px','height:360px',
    'pointer-events:none','z-index:99996','border-radius:50%',
    'background:radial-gradient(circle at center,rgba(201,169,97,0.14) 0%,rgba(201,169,97,0.07) 35%,rgba(201,169,97,0.02) 62%,transparent 75%)',
    'transform:translate(-50%,-50%)','transition:opacity 0.45s ease','opacity:0','will-change:transform',
  ].join(';');
  document.body.appendChild(glow);

  let curX = -999, curY = -999, glowX = -999, glowY = -999, visible = false;
  function isExcluded(x, y) {
    const t = document.elementFromPoint(x, y);
    if (!t) return false;
    const tag = t.tagName.toLowerCase();
    if (['input','textarea','select'].includes(tag)) return true;
    if (t.closest('form') || t.closest('.contact-layout') || t.closest('.form-group')) return true;
    return false;
  }
  document.addEventListener('mousemove', function(e) {
    curX = e.clientX; curY = e.clientY;
    const excl = isExcluded(curX, curY);
    if (excl && visible)  { glow.style.opacity = '0'; visible = false; }
    if (!excl && !visible){ glow.style.opacity = '1'; visible = true;  }
  });
  document.addEventListener('mouseleave', function() { glow.style.opacity = '0'; visible = false; });
  function tick() {
    glowX += (curX - glowX) * 0.10;
    glowY += (curY - glowY) * 0.10;
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';
    requestAnimationFrame(tick);
  }
  tick();
})();
