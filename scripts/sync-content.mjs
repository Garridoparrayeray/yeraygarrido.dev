/**
 * ============================================================================
 * PORTFOLIO CONTENT & SEO SYNC SCRIPT (Zero Dependencies)
 * ============================================================================
 * Fuente única de verdad para publicaciones científicas: src/data/papers.json
 *
 * Al ejecutar `npm run sync` (o automáticamente antes de `npm run build`):
 *  1. Genera/actualiza cada ficha estática Google Scholar: public/papers/<slug>/index.html
 *  2. Genera/actualiza el índice académico:                public/papers/index.html
 *  3. Actualiza el sitemap indexable:                      public/sitemap.xml
 *  4. Sincroniza ScholarlyArticle JSON-LD y <noscript> en: index.html
 *
 * Así añadir un paper nuevo en el futuro = 1 objeto en src/data/papers.json + PDF en public/papers/.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SITE_URL = "https://yeraygarrido.dev";
const AUTHOR = {
  name: "Yeray Garrido",
  givenName: "Yeray",
  familyName: "Garrido",
  citationName: "Garrido, Yeray",
  orcid: "0009-0008-0459-0294",
  orcidUrl: "https://orcid.org/0009-0008-0459-0294",
  githubUrl: "https://github.com/Garridoparrayeray",
  linkedinUrl: "https://www.linkedin.com/in/yeray-garrido",
};

const SVG_LEFT =
  '<svg class="ico" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"><path d="M13.5 8H3M7.25 3.75L3 8L7.25 12.25"/></svg>';
const SVG_RIGHT =
  '<svg class="ico" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"><path d="M2.5 8H13M8.75 3.75L13 8L8.75 12.25"/></svg>';
const SVG_DOWN =
  '<svg class="ico" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"><path d="M8 2.5V13M3.75 8.75L8 13L12.25 8.75"/></svg>';
const SVG_UP_RIGHT =
  '<svg class="ico" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"><path d="M4.25 11.75L11.5 4.5M5.5 4.5H11.5V10.5"/></svg>';

const MONTHS_BIB = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

function escHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;");
}

function getCanonicalTitle(paper) {
  const lang = (paper.langBadge || "EN").toLowerCase();
  return paper.title[lang] || paper.title.en || paper.title.es;
}

function getLangCode(paper) {
  return (paper.langBadge || "EN").toLowerCase();
}

function formatSlashDate(isoDate) {
  return String(isoDate).replaceAll("-", "/");
}

function cleanVersionNumber(version) {
  return String(version || "1.0").replace(/^v/i, "");
}

function buildBibtex(paper) {
  const s = paper.scholar || {};
  const lang = getLangCode(paper);
  const title = getCanonicalTitle(paper);
  const parts = String(paper.date || `${paper.year}-01-01`).split("-");
  const monthIdx = Math.max(0, Math.min(11, (parseInt(parts[1], 10) || 1) - 1));
  const month = MONTHS_BIB[monthIdx];
  const entryType = s.bibtexType || "misc";
  const doiNum = String(paper.doi || paper.slug).replace(/[^a-zA-Z0-9]/g, "_").split("_").pop();
  const key = s.bibtexKey || `garrido_${paper.year}_${doiNum}`;
  const pubField = entryType === "techreport" ? "institution " : "publisher   ";
  const publisherName = (paper.venue || "Zenodo").split("·")[0].replace(/\(.*?\)/g, "").trim() || "Zenodo";

  const lines = [
    `@${entryType}{${key},`,
    `  author       = {${AUTHOR.citationName}},`,
    `  title        = {{${title}}},`,
    `  month        = ${month},`,
    `  year         = ${paper.year},`,
    `  ${pubField} = {${publisherName}},`,
    `  version      = {${cleanVersionNumber(paper.version)}},`,
  ];
  if (paper.doi) {
    lines.push(`  doi          = {${paper.doi}},`);
    lines.push(`  url          = {${paper.doiUrl || `https://doi.org/${paper.doi}`}}`);
  } else {
    lines.push(`  url          = {${SITE_URL}/papers/${paper.slug}/}`);
  }
  lines.push("}");
  return { bibtex: lines.join("\n"), lang };
}

function renderPaperLandingHtml(paper) {
  const lang = getLangCode(paper);
  const isEs = lang === "es";
  const s = paper.scholar || {};
  const title = getCanonicalTitle(paper);
  const canonicalUrl = `${SITE_URL}/papers/${paper.slug}/`;
  const pdfFullUrl = `${SITE_URL}${paper.pdfUrl}`;
  const doiUrl = paper.doiUrl || (paper.doi ? `https://doi.org/${paper.doi}` : canonicalUrl);
  const abstract = s.abstract || paper.tldr[lang] || paper.tldr.en || paper.tldr.es;
  const metaDesc = s.metaDescription || abstract.slice(0, 260);
  const ogDesc = s.ogDescription || metaDesc;
  const ogImage = s.ogImage || `${SITE_URL}/papers/og-papers.png`;
  const keywords = (s.keywords && s.keywords.length > 0
    ? s.keywords
    : [paper.topic.en || paper.topic.es, "Open Science", "Software Engineering"]
  ).join("; ");
  const publisher = (paper.venue || "Zenodo").split("·")[0].replace(/\(.*?\)/g, "").trim() || "Zenodo";
  const eyebrow =
    s.eyebrow ||
    `${paper.type[lang] || paper.type.en} ${paper.version} · ${paper.topic[lang] || paper.topic.en} · Open Access (CC BY 4.0)`;

  const keyStats =
    s.keyStats && s.keyStats.length > 0
      ? s.keyStats
      : (paper.metrics || []).slice(0, 2).map((m, i) => ({
          label: i === 0 ? (isEs ? "Resultado" : "Highlight") : isEs ? "Métrica" : "Metric",
          value: m[lang] || m.en || m.es,
        }));

  const ldObj = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "@id": `${canonicalUrl}#article`,
    headline: title,
    name: title,
    author: {
      "@type": "Person",
      name: AUTHOR.name,
      givenName: AUTHOR.givenName,
      familyName: AUTHOR.familyName,
      url: `${SITE_URL}/`,
      sameAs: AUTHOR.orcidUrl,
    },
    datePublished: paper.date,
    version: cleanVersionNumber(paper.version),
    ...(s.pages ? { numberOfPages: s.pages } : {}),
    inLanguage: lang,
    ...(paper.doi ? { identifier: doiUrl, sameAs: doiUrl } : {}),
    url: canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: publisher,
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    encoding: {
      "@type": "MediaObject",
      contentUrl: pdfFullUrl,
      encodingFormat: "application/pdf",
    },
    abstract,
  };

  const jsonLdIndented = JSON.stringify(ldObj, null, 2)
    .split("\n")
    .map((line) => "  " + line)
    .join("\n");

  const { bibtex } = buildBibtex(paper);

  const tagsHtml = (s.tags || (paper.metrics || []).map((m) => m[lang] || m.en || m.es))
    .map((tag) => {
      if (typeof tag === "object" && tag.href) {
        return `        <a class="tag" href="${escHtml(tag.href)}" target="_blank" rel="noopener">${escHtml(tag.label)}</a>`;
      }
      const label = typeof tag === "object" ? tag.label : tag;
      return `        <span class="tag">${escHtml(label)}</span>`;
    })
    .join("\n");

  const pdfBtnLabel =
    s.pdfButtonLabel ||
    (isEs ? `Descargar PDF (${paper.version})` : `Download Preprint PDF (${paper.version})`);
  const readingBtnHtml = paper.readingPdfUrl
    ? `\n      <a class="btn btn-secondary" href="${escHtml(paper.readingPdfUrl)}" download>${SVG_DOWN} ${
        isEs ? "Descargar PDF (Lectura)" : "Download Reading Version PDF"
      }</a>`
    : "";
  const repoBtnHtml = paper.repoUrl
    ? `\n      <a class="btn btn-secondary" href="${escHtml(paper.repoUrl)}" target="_blank" rel="noopener noreferrer">${escHtml(
        s.repoButtonLabel || (isEs ? "Código de Referencia (GitHub)" : "Reference Code (GitHub)")
      )} ${SVG_UP_RIGHT}</a>`
    : "";
  const doiBtnHtml = paper.doi
    ? `\n      <a class="btn btn-accent" href="${escHtml(doiUrl)}" target="_blank" rel="noopener noreferrer">${
        isEs ? "Ver en Zenodo" : "View on Zenodo"
      } ${SVG_UP_RIGHT}</a>`
    : "";

  const extraMetaCells = keyStats
    .map(
      (st) => `      <div class="meta-cell">
        <span class="meta-label">${escHtml(st.label)}</span>
        <span class="meta-val">${escHtml(st.value)}</span>
      </div>`
    )
    .join("\n");

  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(title)} — ${AUTHOR.name}</title>
  <meta name="description" content="${escHtml(metaDesc)}" />
  <meta name="author" content="${AUTHOR.name}" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
  <link rel="canonical" href="${canonicalUrl}" />
  <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
  <link rel="stylesheet" href="/papers/scholar.css" />

  <!-- Highwire Press / Google Scholar Metadata -->
  <meta name="citation_title" content="${escHtml(title)}" />
  <meta name="citation_author" content="${AUTHOR.citationName}" />
  <meta name="citation_author_orcid" content="${AUTHOR.orcid}" />
  <meta name="citation_publication_date" content="${formatSlashDate(paper.date)}" />
  <meta name="citation_online_date" content="${formatSlashDate(paper.date)}" />${
    paper.doi ? `\n  <meta name="citation_doi" content="${escHtml(paper.doi)}" />` : ""
  }
  <meta name="citation_publisher" content="${escHtml(publisher)}" />
  <meta name="citation_language" content="${lang}" />
  <meta name="citation_pdf_url" content="${pdfFullUrl}" />
  <meta name="citation_abstract_html_url" content="${canonicalUrl}" />
  <meta name="citation_keywords" content="${escHtml(keywords)}" />

  <!-- Dublin Core Metadata -->
  <meta name="DC.title" content="${escHtml(title)}" />
  <meta name="DC.creator" content="${AUTHOR.citationName}" />
  <meta name="DC.date" content="${escHtml(paper.date)}" />
  <meta name="DC.identifier" content="${escHtml(doiUrl)}" />
  <meta name="DC.language" content="${lang}" />
  <meta name="DC.publisher" content="${escHtml(publisher)}" />
  <meta name="DC.rights" content="Creative Commons Attribution 4.0 International (CC BY 4.0)" />

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:title" content="${escHtml(title)}" />
  <meta property="og:description" content="${escHtml(ogDesc)}" />
  <meta property="og:image" content="${escHtml(ogImage)}" />

  <script type="application/ld+json">
${jsonLdIndented}
  </script>
</head>
<body>
  <header class="topbar">
    <div class="topbar-inner">
      <a class="brand" href="/">
        <img src="/img/logo.webp" alt="${AUTHOR.name} Logo" />
        <span>${AUTHOR.name}</span>
      </a>
      <nav class="nav-links" aria-label="${isEs ? "Navegación" : "Navigation"}">
        <a href="/papers/">${SVG_LEFT} ${isEs ? "Todas las publicaciones" : "All Papers"}</a>
        <a href="/">Portfolio</a>${
          paper.doi
            ? `\n        <a href="${escHtml(doiUrl)}" target="_blank" rel="noopener noreferrer">Zenodo DOI ${SVG_UP_RIGHT}</a>`
            : ""
        }
      </nav>
    </div>
  </header>

  <main class="wrap">
    <p class="eyebrow">${escHtml(eyebrow)}</p>
    <h1>${escHtml(title)}</h1>
    <p class="lead">
      <strong>${AUTHOR.name}</strong> · ${
    isEs
      ? "Ingeniero de Software &amp; Investigador Independiente (Bilbao, España)"
      : "Independent Researcher &amp; Software Engineer (Bilbao, Spain)"
  } ·
      <a href="${AUTHOR.orcidUrl}" target="_blank" rel="noopener noreferrer">ORCID ${AUTHOR.orcid}</a>
    </p>

    <div class="meta-grid">
      <div class="meta-cell">
        <span class="meta-label">DOI</span>
        <span class="meta-val">${
          paper.doi
            ? `<a href="${escHtml(doiUrl)}" target="_blank" rel="noopener noreferrer">${escHtml(paper.doi)} ${SVG_UP_RIGHT}</a>`
            : "Open Access"
        }</span>
      </div>
      <div class="meta-cell">
        <span class="meta-label">${isEs ? "Publicación" : "Published"}</span>
        <span class="meta-val">${escHtml(paper.date)} (${escHtml(paper.version)} · ${escHtml(paper.langBadge)})</span>
      </div>
${extraMetaCells}
    </div>

    <div class="actions">
      <a class="btn btn-primary" href="${escHtml(paper.pdfUrl)}" download>${SVG_DOWN} ${escHtml(pdfBtnLabel)}</a>${readingBtnHtml}${doiBtnHtml}${repoBtnHtml}
    </div>

    <section class="panel">
      <h2>${isEs ? "Resumen" : "Abstract"}</h2>
      <p>
        ${escHtml(abstract)}
      </p>
      <div class="tag-row">
${tagsHtml}
      </div>
    </section>

    <section class="panel">
      <div class="bibtex-header">
        <h2 style="margin:0;">${isEs ? "Citación BibTeX" : "BibTeX Citation"}</h2>
        <button class="copy-btn" type="button" onclick="copyBibtex(this)">${isEs ? "Copiar BibTeX" : "Copy BibTeX"}</button>
      </div>
      <pre class="bibtex" id="bibtex-block">${escHtml(bibtex)}</pre>
    </section>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <span>${AUTHOR.name} · ORCID ${AUTHOR.orcid}</span>
      <span><a href="/papers/">${isEs ? "Todas las publicaciones" : "All Publications"}</a> · <a href="/">yeraygarrido.dev</a></span>
    </div>
  </footer>

  <script>
    function copyBibtex(btn) {
      var text = document.getElementById("bibtex-block").textContent;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = "${isEs ? "Copiado ✓" : "Copied ✓"}";
          setTimeout(function () { btn.textContent = "${isEs ? "Copiar BibTeX" : "Copy BibTeX"}"; }, 1800);
        });
      }
    }
  </script>
</body>
</html>
`;
}

function renderArchiveIndexHtml(papers) {
  const years = Array.from(new Set(papers.map((p) => p.year))).sort();
  const yearRange = years.length > 1 ? `${years[0]}–${years[years.length - 1]}` : years[0] || "2026";

  const ldObj = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/papers/#collection`,
    url: `${SITE_URL}/papers/`,
    name: `Research Publications — ${AUTHOR.name}`,
    description: `Open-access scientific publications, preprints, and technical monographs authored by ${AUTHOR.name}.`,
    author: {
      "@type": "Person",
      name: AUTHOR.name,
      url: `${SITE_URL}/`,
      sameAs: [AUTHOR.orcidUrl, AUTHOR.githubUrl, AUTHOR.linkedinUrl],
    },
    hasPart: papers.map((p) => ({
      "@type": "ScholarlyArticle",
      name: getCanonicalTitle(p),
      url: `${SITE_URL}/papers/${p.slug}/`,
      ...(p.doi ? { sameAs: p.doiUrl || `https://doi.org/${p.doi}` } : {}),
      datePublished: p.date,
      inLanguage: getLangCode(p),
    })),
  };

  const jsonLdIndented = JSON.stringify(ldObj, null, 2)
    .split("\n")
    .map((line) => "  " + line)
    .join("\n");

  const cardsHtml = papers
    .map((p, idx) => {
      const num = String(idx + 1).padStart(2, "0");
      const lang = getLangCode(p);
      const isEs = lang === "es";
      const s = p.scholar || {};
      const title = getCanonicalTitle(p);
      const badge = s.badgeArchive || `${p.type.en || p.type.es} (${p.version})`;
      const topic = p.topic.en || p.topic.es;
      const summary = s.archiveSummary || p.tldr[lang] || p.tldr.en || p.tldr.es;
      const pdfLabel = s.archivePdfLabel || (isEs ? "Descargar PDF" : "Preprint PDF");
      const readingLink = p.readingPdfUrl
        ? `\n        <a class="btn btn-secondary" href="${escHtml(p.readingPdfUrl)}" download>${SVG_DOWN} Reading PDF</a>`
        : "";
      const doiLink = p.doi
        ? `\n        <a class="btn btn-accent" href="${escHtml(p.doiUrl || `https://doi.org/${p.doi}`)}" target="_blank" rel="noopener noreferrer">Zenodo DOI ${SVG_UP_RIGHT}</a>`
        : "";

      return `    <article class="paper-card">
      <div class="paper-card-top">
        <span class="badge-solid">${num} / ${escHtml(badge)}</span>
        <span class="badge-topic">${escHtml(topic)}</span>
        <span>${escHtml(p.date)} · ${escHtml(p.langBadge)}${p.doi ? ` · DOI ${escHtml(p.doi)}` : ""}</span>
      </div>
      <h2>
        <a href="/papers/${escHtml(p.slug)}/">
          ${escHtml(title)}
        </a>
      </h2>
      <p>
        ${escHtml(summary)}
      </p>
      <div class="actions" style="margin: 20px 0 0;">
        <a class="btn btn-primary" href="/papers/${escHtml(p.slug)}/">${isEs ? "Ficha Completa &amp; Citación" : "Full Paper Page &amp; Citation"} ${SVG_RIGHT}</a>
        <a class="btn btn-secondary" href="${escHtml(p.pdfUrl)}" download>${SVG_DOWN} ${escHtml(pdfLabel)}</a>${readingLink}${doiLink}
      </div>
    </article>`;
    })
    .join("\n\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Research Publications — ${AUTHOR.name} (ORCID ${AUTHOR.orcid})</title>
  <meta name="description" content="Open-access preprints, empirical evaluations, and technical monographs by ${AUTHOR.name} (Bilbao, Spain) indexed with Zenodo DOIs and reproducible reference code." />
  <meta name="author" content="${AUTHOR.name}" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
  <link rel="canonical" href="${SITE_URL}/papers/" />
  <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
  <link rel="stylesheet" href="/papers/scholar.css" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="${SITE_URL}/papers/" />
  <meta property="og:title" content="Research Publications — ${AUTHOR.name}" />
  <meta property="og:description" content="Open-science publications, Zenodo DOIs, PDFs, and reproducible software systems by ${AUTHOR.name}." />
  <meta property="og:image" content="${SITE_URL}/papers/og-papers.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${SITE_URL}/papers/og-papers.png" />

  <script type="application/ld+json">
${jsonLdIndented}
  </script>
</head>
<body>
  <header class="topbar">
    <div class="topbar-inner">
      <a class="brand" href="/">
        <img src="/img/logo.webp" alt="${AUTHOR.name} Logo" />
        <span>${AUTHOR.name}</span>
      </a>
      <nav class="nav-links" aria-label="Navigation">
        <a href="/">${SVG_LEFT} Portfolio</a>
        <a href="${AUTHOR.orcidUrl}" target="_blank" rel="noopener noreferrer">ORCID ${SVG_UP_RIGHT}</a>
        <a href="${AUTHOR.githubUrl}" target="_blank" rel="noopener noreferrer">GitHub ${SVG_UP_RIGHT}</a>
      </nav>
    </div>
  </header>

  <main class="wrap">
    <p class="eyebrow">Open Science Archive · Google Scholar &amp; Zenodo Indexed</p>
    <h1>Research Publications</h1>
    <p class="lead">
      Peer-accessible preprints, empirical evaluations, and open-source technical monographs by
      <strong>${AUTHOR.name}</strong> (Bilbao, Spain). Each publication page provides full Highwire Press
      &amp; Dublin Core bibliographic metadata, direct PDF access, BibTeX citation, and Zenodo DOI records.
    </p>

    <div class="meta-grid">
      <div class="meta-cell">
        <span class="meta-label">Author</span>
        <span class="meta-val">${AUTHOR.name}</span>
      </div>
      <div class="meta-cell">
        <span class="meta-label">ORCID iD</span>
        <span class="meta-val"><a href="${AUTHOR.orcidUrl}" target="_blank" rel="noopener noreferrer">${AUTHOR.orcid} ${SVG_UP_RIGHT}</a></span>
      </div>
      <div class="meta-cell">
        <span class="meta-label">Repository</span>
        <span class="meta-val">Zenodo (CERN) · CC BY 4.0 &amp; MIT</span>
      </div>
      <div class="meta-cell">
        <span class="meta-label">Publications</span>
        <span class="meta-val">${papers.length} Open-Access Works (${yearRange})</span>
      </div>
    </div>

${cardsHtml}
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <span>${AUTHOR.name} · Bilbao, Bizkaia, Spain · ORCID ${AUTHOR.orcid}</span>
      <span><a href="/">yeraygarrido.dev</a> · <a href="/llms.txt">llms.txt</a> · <a href="/cv.json">cv.json</a></span>
    </div>
  </footer>
</body>
</html>
`;
}

function renderSitemapXml(papers, todayIso) {
  const paperPageUrls = papers
    .map(
      (p) => `  <url>
    <loc>${SITE_URL}/papers/${p.slug}/</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`
    )
    .join("\n\n");

  const pdfEntries = [];
  for (const p of papers) {
    if (p.pdfUrl) {
      pdfEntries.push(`  <url>
    <loc>${SITE_URL}${p.pdfUrl}</loc>
    <lastmod>${p.date}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.8</priority>
  </url>`);
    }
    if (p.readingPdfUrl) {
      pdfEntries.push(`  <url>
    <loc>${SITE_URL}${p.readingPdfUrl}</loc>
    <lastmod>${p.date}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>`);
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Academic Publications Archive & Google Scholar Landing Pages -->
  <url>
    <loc>${SITE_URL}/papers/</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

${paperPageUrls}

  <!-- Direct Open-Access PDFs (Zenodo Mirrors for Google Scholar) -->
${pdfEntries.join("\n\n")}

</urlset>
`;
}

function syncIndexHtml(papers) {
  const indexPath = path.join(ROOT, "index.html");
  let html = fs.readFileSync(indexPath, "utf8");

  // 1. Update ScholarlyArticle nodes inside JSON-LD @graph cleanly
  const ldRegex = /(<script type="application\/ld\+json">\s*)([\s\S]*?)(\s*<\/script>)/;
  const match = html.match(ldRegex);
  if (match) {
    const ldData = JSON.parse(match[2]);
    if (Array.isArray(ldData["@graph"])) {
      const nonPaperNodes = ldData["@graph"].filter((node) => node["@type"] !== "ScholarlyArticle");
      const paperNodes = papers.map((p) => {
        const publisher = (p.venue || "Zenodo").split("·")[0].replace(/\(.*?\)/g, "").trim() || "Zenodo";
        const doiUrl = p.doiUrl || (p.doi ? `https://doi.org/${p.doi}` : undefined);
        return {
          "@type": "ScholarlyArticle",
          "@id": `${SITE_URL}/papers/${p.slug}/#article`,
          headline: getCanonicalTitle(p),
          author: { "@id": `${SITE_URL}/#person` },
          datePublished: p.date,
          inLanguage: getLangCode(p),
          ...(doiUrl ? { identifier: doiUrl, sameAs: doiUrl } : {}),
          url: `${SITE_URL}/papers/${p.slug}/`,
          publisher: { "@type": "Organization", name: publisher },
          isAccessibleForFree: true,
        };
      });
      ldData["@graph"] = [...nonPaperNodes, ...paperNodes];
      const serialized = JSON.stringify(ldData, null, 2)
        .split("\n")
        .map((line) => "  " + line)
        .join("\n");
      html = html.replace(ldRegex, `<script type="application/ld+json">\n${serialized}\n  </script>`);
    }
  }

  // 2. Update <noscript> publication list between markers
  const nsRegex = /(<!-- AUTO-PAPERS-NOSCRIPT:START -->)[\s\S]*?(<!-- AUTO-PAPERS-NOSCRIPT:END -->)/;
  if (nsRegex.test(html)) {
    const listItems = papers
      .map((p) => {
        const title = getCanonicalTitle(p);
        const pagesNote = p.scholar?.pages ? ` (${p.scholar.pages} pp.)` : "";
        const doiNote = p.doi ? ` (DOI ${p.doi})` : "";
        return `        <li><a href="/papers/${escHtml(p.slug)}/" style="color:#D6C7B2;">${escHtml(title)}${pagesNote}</a>${escHtml(doiNote)}</li>`;
      })
      .join("\n");
    html = html.replace(
      nsRegex,
      `$1\n${listItems}\n        $2`
    );
  }

  fs.writeFileSync(indexPath, html, "utf8");
}

function main() {
  const papersPath = path.join(ROOT, "src", "data", "papers.json");
  const papers = JSON.parse(fs.readFileSync(papersPath, "utf8"));

  if (!Array.isArray(papers) || papers.length === 0) {
    throw new Error("src/data/papers.json debe contener al menos 1 publicación.");
  }

  const seenSlugs = new Set();
  const warnings = [];
  for (const p of papers) {
    if (!p.slug) throw new Error(`Paper "${p.id}" no tiene campo "slug".`);
    if (seenSlugs.has(p.slug)) throw new Error(`Slug duplicado en src/data/papers.json: "${p.slug}".`);
    seenSlugs.add(p.slug);

    if (p.pdfUrl) {
      const pdfDiskPath = path.join(ROOT, "public", p.pdfUrl.replace(/^\//, ""));
      if (!fs.existsSync(pdfDiskPath)) {
        warnings.push(`AVISO: No existe el PDF en disco: public${p.pdfUrl}`);
      }
    }
  }

  // Use latest paper date or current local date (YYYY-MM-DD) for sitemap lastmod
  const now = new Date();
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;

  // 1. Generate each /papers/<slug>/index.html
  for (const paper of papers) {
    const dir = path.join(ROOT, "public", "papers", paper.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), renderPaperLandingHtml(paper), "utf8");
  }

  // 2. Generate /papers/index.html
  fs.writeFileSync(path.join(ROOT, "public", "papers", "index.html"), renderArchiveIndexHtml(papers), "utf8");

  // 3. Generate /sitemap.xml
  fs.writeFileSync(path.join(ROOT, "public", "sitemap.xml"), renderSitemapXml(papers, todayIso), "utf8");

  // 4. Sync index.html JSON-LD & <noscript>
  syncIndexHtml(papers);

  console.log(
    `[sync-content] OK — ${papers.length} papers sincronizados -> /papers/*, /sitemap.xml, index.html`
  );
  for (const w of warnings) console.warn(`[sync-content] ${w}`);
}

main();
