# Guía de Mantenimiento Rápido — `yeraygarrido.dev`

Todo el contenido del portfolio está separado de React, GSAP y el HTML de SEO. Para añadir o cambiar cualquier bloque solo necesitas editar archivos de datos y (si añades un paper) ejecutar `npm run sync` (también se ejecuta solo en `npm run build` / Vercel).

| Qué quieres hacer | Archivo a editar | Comando |
|---|---|---|
| **Añadir un paper nuevo** (+ ficha Google Scholar + sitemap + JSON-LD) | `src/data/papers.json` + PDF en `public/papers/` | `npm run sync` |
| **Cambiar el Último Lanzamiento (Hero)** | `LATEST_RELEASE` en `src/data/portfolioConfig.ts` | ninguno |
| **Cambiar el Producto Destacado (Sección 01)** | `FLAGSHIP_PRODUCT` en `src/data/portfolioConfig.ts` | ninguno |
| **Elegir / reordenar Proyectos Destacados (Sección 01.B)** | `ARCHIVE_PLATES` en `src/data/portfolioConfig.ts` | ninguno |
| **Añadir un proyecto nuevo al catálogo** | `src/data/otherProjects.json` | ninguno |
| **Añadir experiencia o formación** | `WORK_EXPERIENCE` / `EDUCATION_HISTORY` en `src/data/portfolioConfig.ts` | ninguno |

---

## 1. Añadir un paper nuevo (100% automático para web + Google Scholar + sitemap)

1. Copia el PDF en `public/papers/Mi_Paper_2027.pdf`.
2. Añade un objeto nuevo en **`src/data/papers.json`** (al principio del array si quieres que sea el `01`, la numeración se recalcula sola):

```json
{
  "id": "paper-mi-estudio",
  "slug": "mi-estudio-2027",
  "year": "2027",
  "date": "2027-03-15",
  "version": "v1.0",
  "langBadge": "EN",
  "topic": {
    "es": "IA Aplicada & Sistemas",
    "en": "Applied AI & Systems",
    "eu": "AA Aplikatua & Sistemak"
  },
  "venue": "Zenodo (CERN) · Preprint",
  "title": {
    "es": "Título del paper",
    "en": "Paper title",
    "eu": "Paperaren izenburua"
  },
  "type": {
    "es": "Preprint",
    "en": "Preprint",
    "eu": "Preprint-a"
  },
  "tldr": {
    "es": "Resumen claro de 2-3 líneas para cualquier visitante.",
    "en": "Clear 2-3 line summary for every visitor.",
    "eu": "Edozein bisitarirentzat 2-3 lerroko laburpen argia."
  },
  "doi": "10.5281/zenodo.XXXXXXXX",
  "doiUrl": "https://doi.org/10.5281/zenodo.XXXXXXXX",
  "repoUrl": "https://github.com/Garridoparrayeray/mi-repo",
  "pdfUrl": "/papers/Mi_Paper_2027.pdf",
  "pdfFilename": "Mi_Paper_2027.pdf",
  "metrics": [
    { "es": "Métrica 1", "en": "Metric 1", "eu": "Metrika 1" },
    { "es": "Métrica 2", "en": "Metric 2", "eu": "Metrika 2" }
  ],
  "visual": {
    "kind": "card",
    "figureLabel": "FIG. 04 / KEY RESULT",
    "highlightStat": "94%",
    "highlightLabel": {
      "es": "Precisión en producción",
      "en": "Production accuracy",
      "eu": "Zehaztasuna produkzioan"
    },
    "footnote": "n = 100.000 muestras · Código MIT",
    "image": "/img/projects/captura-opcional.webp"
  },
  "scholar": {
    "abstract": "Abstract académico completo (si lo omites, usa el tldr automáticamente).",
    "keywords": ["AI", "Software Engineering", "Open Science"]
  }
}
```

3. Ejecuta **`npm run sync`** (o directamente `npm run build`). El script `scripts/sync-content.mjs` genera y sincroniza solo:
   - `public/papers/mi-estudio-2027/index.html` (con etiquetas `citation_*` para Google Scholar, Dublin Core, JSON-LD y BibTeX)
   - `public/papers/index.html` (índice y contador)
   - `public/sitemap.xml` (nueva ficha + PDF + fecha `lastmod`)
   - `index.html` (nodos `ScholarlyArticle` del JSON-LD y lista `<noscript>`)

---

## 2. Cambiar el "Último Lanzamiento" del Hero

Edita `LATEST_RELEASE` en **`src/data/portfolioConfig.ts`**:
- `enabled: false` si alguna vez prefieres ocultar la tarjeta del Hero.
- `frameType: "mobile"` (muestra la captura dentro de un smartphone) o `frameType: "plain"` (muestra cualquier captura web/GIF en 16:10).
- `scrollTarget`: `"flagship-product"`, `"research"`, `"work"` o `null`.
- Si pones `scrollTarget: null` y añades `projectId: "id-del-proyecto"`, al pulsar la imagen se abre su ficha modal; si no pones `projectId`, abre `ctaUrl`.

---

## 3. Cambiar el "Producto Destacado" (Sección 01)

Edita `FLAGSHIP_PRODUCT` en **`src/data/portfolioConfig.ts`**:
- `enabled: false` si prefieres mostrar directamente la sección de Proyectos Destacados (`01.B`).
- `projectId`: ID del proyecto en `src/data/otherProjects.json` (de ahí toma la descripción, stack y modal).
- `showcaseMode`:
  - `"mobile-trio"` → carrusel de 3 móviles (apps móviles / PWAs; funciona con 1 o más pantallas).
  - `"desktop-gallery"` → lienzo editorial 16:10 con selector de pestañas (ideal para webs, SaaS, ERP, herramientas de escritorio o IA).
- `ctaLabel` / `url`: texto y enlace del botón principal.
- `secondaryCta`: botón secundario opcional (borra el campo si no lo necesitas; admite `{papersCount}` si apunta a `"research"`).
- `metrics`: pon 0, 2 o 4 KPIs (si lo dejas `[]`, el bloque de métricas se oculta limpio).

---

## 4. Elegir los Proyectos Destacados (Sección 01.B) y añadir proyectos nuevos

1. *(Si es un proyecto nuevo)* Añádelo a **`src/data/otherProjects.json`** con su `id` único, textos `es`/`en`/`eu` y capturas en `public/img/projects/`.
2. En **`ARCHIVE_PLATES`** dentro de **`src/data/portfolioConfig.ts`**, pon los `id` que quieras destacar **en el orden exacto** en que quieres que aparezcan:

```ts
export const ARCHIVE_PLATES: ArchivePlateConfig[] = [
  { id: "gasolinera-plus", imageOverride: "/img/projects/gasolinera_loading.gif" },
  { id: "nuevo-proyecto" }, // usa automáticamente imageUrl o images[0] del JSON
  { id: "art-gallery" },
];
```

Puedes poner 2, 3, 4 o los que quieras; la numeración (`01 / 04`) y el apilamiento sticky se adaptan solos.

---

## 5. Añadir experiencia laboral o formación

En **`src/data/portfolioConfig.ts`**, añade un bloque al principio de `WORK_EXPERIENCE` o `EDUCATION_HISTORY`. Los contadores de las pestañas (`Experiencia (5)` / `Formación (3)`) se actualizan automáticamente.
