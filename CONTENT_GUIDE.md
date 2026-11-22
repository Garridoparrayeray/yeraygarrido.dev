# Manual Completo del Portfolio — `yeraygarrido.dev`

> **Doble propósito:**
> 1. **Guía rápida para Yeray** para añadir papers, cambiar el producto destacado, el último lanzamiento, los proyectos o la experiencia sin tocar React ni HTML.
> 2. **Brief técnico y de invariantes para cualquier agente de IA** que vaya a trabajar en este repositorio, para que sepa exactamente dónde tocar y qué reglas no debe romper jamás.

---

## 1. Arquitectura y Stack

- **Frontend:** React 19 + TypeScript 5.8 + Vite 6 + Tailwind CSS v4 (`@tailwindcss/vite` + `vite-plugin-css-injected-by-js`).
- **Animación y scroll:** GSAP 3.14 (`ScrollTrigger`, `CustomEase`) + Lenis (solo escritorio `lg+`; en móvil usa scroll nativo para 0 lag).
- **Despliegue:** Vercel conectado a la rama `main` (`git push origin main` despliega automáticamente).
- **Backup del diseño anterior (v1):** preservado en rama `backup/portfolio-v1` y tag `v1-old-design` (`11ab901`).
- **Idiomas:** Español (`es`), Inglés (`en`) y Euskera (`eu`), gestionados en `src/context/LanguageContext.tsx` y `loc(obj, language)` de `src/data/portfolioConfig.ts`.
- **Páginas estáticas Google Scholar (`/papers/*`):** HTML estático puro en `public/papers/` servido directamente en producción por Vercel y en local mediante `staticSubdirIndexPlugin()` en `vite.config.ts` (antes del fallback SPA).

---

## 2. Mapa del Repositorio (Fuente de Verdad vs Archivos Autogenerados)

### Archivos que SÍ editas tú (Fuentes de Verdad)
| Ruta | Para qué sirve |
|---|---|
| `src/data/portfolioConfig.ts` | **Configuración maestra:** identidad, formulario, `LATEST_RELEASE` (Hero), `FLAGSHIP_PRODUCT` (Sección 01), `ARCHIVE_PLATES` (Sección 01.B), `WORK_EXPERIENCE`, `EDUCATION_HISTORY`, `TECH_STACK_ITEMS`, `API_ENDPOINTS`, `MARQUEE_ITEMS`. |
| `src/data/papers.json` | **Fuente única de verdad de publicaciones científicas.** De aquí beben la web React y el generador `scripts/sync-content.mjs`. |
| `src/data/otherProjects.json` | **Catálogo completo de proyectos** (`ALL_PROJECTS`): textos ES/EN/EU, tech stack, capturas y caso técnico modal. |
| `src/context/LanguageContext.tsx` | Textos generales de interfaz (hero bio, servicios, títulos de sección, contacto, meta tags dinámicos ES/EN/EU). |
| `public/llms.txt`, `public/cv.json`, `public/cv.xml`, `public/cv.txt` | Endpoints públicos legibles por máquinas, IA (GEO) y desarrolladores (`curl`). |
| `public/CV_YerayGarrido_{es,en,eu}.pdf` | CVs descargables en los 3 idiomas (fuentes LaTeX en `cv/`). |
| `public/img/brand/` | Assets de marca listos para compartir o imprimir (tarjetas freelance/empresas + tarjeta estilo *American Psycho* con QR real: `tarjeta-empresa.png`, `tarjeta-empresa-reverso.png`, `tarjeta-empresa-presentacion.png`). |
| `public/og-image.png` / `.webp` y `public/papers/og-papers.png` / `.webp` | Imágenes de previsualización Open Graph / Twitter / WhatsApp / LinkedIn (`1200×630`). |

### Archivos AUTOGENERADOS por `npm run sync` (NO editar a mano los papers aquí)
| Ruta | Qué sincroniza `scripts/sync-content.mjs` |
|---|---|
| `public/papers/<slug>/index.html` | Fichas individuales Google Scholar (`citation_*`, Dublin Core, JSON-LD `ScholarlyArticle`, BibTeX, botones de descarga). |
| `public/papers/index.html` | Archivo académico completo y contador de publicaciones (`CollectionPage` JSON-LD). |
| `public/sitemap.xml` | Sitemap XML limpio con solo URLs indexables (`/`, `/papers/`, fichas de papers y sus PDFs). |
| `index.html` *(solo nodos `ScholarlyArticle` y bloque `AUTO-PAPERS-NOSCRIPT`)* | Sincroniza el grafo JSON-LD y la lista `<noscript>` sin tocar el resto de `index.html`. |

### Componentes clave de UI (solo tocar si cambias diseño o lógica)
| Ruta | Responsabilidad |
|---|---|
| `src/components/PortfolioMain.tsx` | Página principal completa, header fijo, menú lateral móvil, hero, flagship, archive stack, research, servicios, experiencia, GitHub/API, contacto y footer. |
| `src/components/ProjectModal.tsx` | Modal de catálogo completo (Portfolio + Repos GitHub), modal de detalle de proyecto y lightbox de imágenes. |
| `src/components/IconGlyph.tsx` | Iconos SVG arquitectónicos (`IconGlyph` y `RichText`) para evitar emojis de iOS. |
| `src/components/Cookie-Banner.tsx` | Banner GDPR (`z-[70]`, Microsoft Clarity tras consentimiento). |
| `src/components/TearLink.tsx` | Enlace interactivo especial al portfolio de fotografía (**NO MODIFICAR**). |
| `src/index.css` | Fuentes locales `@font-face`, tokens Tailwind v4, escala tipográfica raíz al 90%, aura orbital `.aw-launch-frame`, hover sobrio `.aw-btn`. |
| `vercel.json` | Cabeceras de seguridad (CSP, HSTS, caché inmutable), rewrites de `/art-gallery` y `X-Robots-Tag: noindex` para PDFs secundarios. |

---

## 3. Reglas Estrictas e Invariantes (PARA AGENTES IA — NO ROMPER)

Si eres un agente trabajando en este proyecto, respeta siempre estas decisiones ya consolidadas por el propietario:

1. **Estética geométrica `0px`:** todo el diseño usa esquinas rectas (`border-radius: 0`), salvo el hardware del smartphone de `MobileHardwareFrame`.
2. **Paleta editorial fija:** fondo `#09090B`, tarjetas `#111114`, marfil `#F6F4EF`, acento champán `#D6C7B2` (sobre oscuro) y bronce `#7A6648` (sobre claro).
3. **Tipografía local obligatoria (`public/fonts/`):**
   - Display editorial: `"Newsreader"` (con `font-variation-settings: "opsz" 72` en `.font-editorial`). **Nunca** anteponer `"Times New Roman Condensed"` delante de `"Newsreader"` (en Windows provoca fuzzy-match y salta `Newsreader`).
   - Sans / Grotesk: `"Schibsted Grotesk"`.
   - Monospace: `"IBM Plex Mono"`.
   - Escala raíz al 90% en `src/index.css`: `14.5px` móvil, `15.5px` (`>=1280px`), `16.2px` (`>=1600px`).
4. **`TearLink.tsx` y fotografía:**
   - **NUNCA modificar `src/components/TearLink.tsx`**.
   - **NUNCA añadir enlaces de fotografía dentro de `#contact`** (solo viven en Hero y Footer).
5. **Cero flechas Unicode en el DOM (bug de emojis en iPhone/iOS):**
   - Nunca renderizar `↗`, `→`, `←`, `↑`, `↓`, `✓`, `✕` como texto plano en JSX o HTML.
   - En React usar `<IconGlyph name="..." />` o `<RichText text={...} />` (`SlotLabel` ya usa `RichText`).
   - En `/papers/*` usar `<svg class="ico" ...>` (ya integrado en `scripts/sync-content.mjs`).
6. **Navegación móvil sin saltos ni bugs de scroll:**
   - `<header>` debe permanecer `fixed top-0 left-0 right-0 z-[80]` (con `pt-16 sm:pt-20 lg:pt-24` en `<main>`). **No cambiar a `sticky`**, porque al abrir el menú móvil (`document.body.style.overflow = "hidden"`), `sticky` se despega y la `X` desaparece arriba.
   - `html` y `body` mantienen `overflow-x: clip` (nunca `overflow-x: hidden` en `html`).
   - Todas las secciones y `<footer>` llevan `overflow-x-clip`, y los grid items de `<footer>` llevan `min-w-0 break-words` para que palabras largas en euskera (`GARATZAILEENTZAKO`, `ESPERIENTZIA`) no ensanchen el viewport móvil ni muevan el menú.
   - `CookieBanner` debe estar en `z-[70]` (debajo del menú móvil `z-[75]` y del header `z-[80]`).
7. **Puntos de trayectoria centrados:** los nodos de `#experience` usan `left-[calc(-1.5rem+1px)] sm:left-[calc(-2.5rem+1px)] -translate-x-1/2` (en `rem`, nunca píxeles fijos) para quedar exactamente centrados sobre el eje `w-[2px]` a cualquier escala de fuente.
8. **Hover y Preloader:**
   - No reintroducir el botón flotante que sigue al ratón ni el dual-text roll en `.aw-btn`.
   - Mantener la cortina de carga solo en escritorio (`hidden lg:flex`) para evitar flashazos blancos en móvil.
9. **Identidad y SEO canónico:**
   - Nombre público unificado: **`Yeray Garrido`** (evitar `Yeray Garrido Parra` en web, metadatos, JSON-LD, endpoints y papers; mantener intactos el email `garridoparrayeraytx@gmail.com` y GitHub `Garridoparrayeray`).
   - Producto Bideplus: usar siempre marca **`Bideplus (Bide+)`** y URL canónica **`https://www.bideplus.eus/`** (con `www` y barra final), manteniendo `alternateName: ["Bideplus", "Bide Plus"]`, Wikidata `Q142213325` e Instagram `https://www.instagram.com/bideplus.eus/` en el JSON-LD de `index.html`.
   - En `index.html` (`ProfilePage`), `dateCreated` y `dateModified` deben llevar siempre **DateTime ISO-8601 completo con hora y zona horaria** (ej. `"2026-11-22T11:05:00+01:00"`), nunca fecha sin hora.

---

## 4. Tutorial Paso a Paso (Recetas Copiar y Pegar)

### Receta 1 — Añadir un paper nuevo (web + Google Scholar + sitemap en 1 paso)

1. Guarda el PDF en `public/papers/Nombre_Del_Paper.pdf`.
2. Abre `src/data/papers.json` y pega un bloque nuevo (arriba del array si quieres que sea el `01`; los índices `01, 02, 03...` y `/papers/<slug>/` se generan solos):

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
  "pdfUrl": "/papers/Nombre_Del_Paper.pdf",
  "pdfFilename": "Nombre_Del_Paper.pdf",
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
    "abstract": "Abstract académico completo (opcional: si lo omites, usa tldr).",
    "keywords": ["AI", "Software Engineering", "Open Science"]
  }
}
```

> **Plantillas visuales disponibles en `visual.kind`:**
> - `"card"` *(universal para cualquier tema: cifra grande + subtítulo + imagen opcional + pie)*.
> - `"benchmark"` *(barras comparativas de 2 porcentajes + 2 KPIs)*.
> - `"pipeline"` *(diagrama de capas L1/L2/L3 con línea vertical)*.
> - `"manuscript"` *(dos páginas superpuestas de portada e interior)*.

3. Ejecuta `npm run sync` (o `npm run build`). Automáticamente se actualizan:
   - `public/papers/mi-estudio-2027/index.html`
   - `public/papers/index.html`
   - `public/sitemap.xml`
   - `index.html` (JSON-LD y `<noscript>`)
4. Haz `git add . && git commit -m "feat(research): add mi-estudio-2027" && git push origin main`.
5. *(Opcional SEO)* En Google Search Console, solicita indexación de `https://yeraygarrido.dev/papers/mi-estudio-2027/` y reenvía el sitemap.

---

### Receta 2 — Cambiar el "Último Lanzamiento" (tarjeta del Hero)

Edita `LATEST_RELEASE` en `src/data/portfolioConfig.ts`:

```ts
export const LATEST_RELEASE: LatestReleaseConfig = {
  enabled: true, // pon false si quieres ocultarla
  eyebrow: { es: "ÚLTIMO LANZAMIENTO", en: "LATEST RELEASE", eu: "AZKEN ARGITALPENA" },
  metaRight: "Gasolinera+",
  title: {
    es: "Gasolinera+ · Precios en tiempo real",
    en: "Gasolinera+ · Live Fuel Prices",
    eu: "Gasolinera+ · Zuzeneko Prezioak",
  },
  subtitle: {
    es: "11.400+ estaciones · iOS & Android",
    en: "11,400+ stations · iOS & Android",
    eu: "11.400+ gasolindegi · iOS & Android",
  },
  image: "/img/projects/gasolinera_loading.gif",
  imageAlt: "Gasolinera+ en acción",
  frameType: "plain",        // "mobile" (con chasis de móvil) o "plain" (16:10)
  scrollTarget: null,        // "flagship-product", "research", "work" o null
  projectId: "gasolinera-plus", // opcional: abre su modal al pulsar la imagen si scrollTarget es null
  ctaLabel: { es: "Abrir app ↗", en: "Open app ↗", eu: "Ireki app ↗" },
  ctaUrl: "https://gasolineraplus.app",
};
```

---

### Receta 3 — Cambiar el "Producto Destacado" (Sección 01)

Edita `FLAGSHIP_PRODUCT` en `src/data/portfolioConfig.ts`:
- `enabled: false` si prefieres saltarte la Sección 01 e ir directo a la lista de Proyectos Destacados (`01.B`).
- `projectId`: cualquier `id` existente en `src/data/otherProjects.json` (toma su descripción, stack y modal).
- `showcaseMode`:
  - `"mobile-trio"` → carrusel de 3 teléfonos (se adapta solo si pones 1, 2, 3 o más pantallas).
  - `"desktop-gallery"` → visor editorial 16:10 con pestañas y flechas (ideal para webs, SaaS, ERP, apps de escritorio o IA).
- `secondaryCta`: botón secundario opcional; borra esta propiedad si no la necesitas. Si pones `isAnchor: true`, `href` es el `id` de la sección (ej. `"research"`) y puedes usar `{papersCount}` en el texto.
- `metrics`: pon 0 (`[]`), 2 o 4 métricas; si está vacío, el grid no se renderiza.

---

### Receta 4 — Añadir un proyecto nuevo y elegir los Proyectos Destacados (Sección 01.B)

1. Guarda tus capturas (`.webp` o `.gif`) en `public/img/projects/`.
2. Añade el proyecto a `src/data/otherProjects.json` (con `id` único, `title`, `tech`, `desc`, `role`, `year`, `longDescChallenge`, `longDescSolution`, `demoUrl`, `link`, `imageUrl`, `images`).
3. Para mostrarlo en la portada (Sección `01.B`) y controlar el orden exacto, edita `ARCHIVE_PLATES` en `src/data/portfolioConfig.ts`:

```ts
export const ARCHIVE_PLATES: ArchivePlateConfig[] = [
  { id: "mi-nuevo-proyecto" }, // usa automáticamente imageUrl o images[0] del JSON
  {
    id: "gasolinera-plus",
    imageOverride: "/img/projects/gasolinera_loading.gif", // opcional
    badge: { es: "DESTACADO", en: "FEATURED", eu: "NABARMENDUA" }, // opcional
    highlight: { es: "Dato clave", en: "Key fact", eu: "Datu nagusia" }, // opcional
  },
  { id: "art-gallery" },
  { id: "zalbi" },
];
```

Puedes poner los proyectos que quieras (2, 3, 4, 6…): la numeración (`01 / 04`) y el apilamiento sticky se ajustan automáticamente. Todos los proyectos de `otherProjects.json` aparecen además al pulsar **"Ver Todos los Proyectos"**.

---

### Receta 5 — Añadir experiencia laboral o formación

En `src/data/portfolioConfig.ts`, añade un bloque al principio de `WORK_EXPERIENCE` o `EDUCATION_HISTORY`:

```ts
{
  id: "nueva-empresa-2027",
  title: { es: "Senior Software Engineer", en: "Senior Software Engineer", eu: "Senior Software Ingeniaria" },
  company: { es: "Empresa SL", en: "Empresa SL", eu: "Empresa SL" },
  date: { es: "Ene 2027 - Presente", en: "Jan 2027 - Present", eu: "2027ko urt. - Gaur egun" },
  desc: {
    es: "Descripción clara de tu impacto.",
    en: "Clear summary of your impact.",
    eu: "Zure ekarpenaren laburpen argia.",
  },
}
```

Los contadores `Experiencia (N)` y `Formación (N)` se actualizan solos.

---

### Receta 6 — Activar el envío directo del formulario de contacto

En `src/data/portfolioConfig.ts` (`CONTACT_FORM`):
- **Opción recomendada (gratis):** crea una clave en [web3forms.com](https://web3forms.com) asociada a `garridoparrayeraytx@gmail.com` y pégala en `web3formsAccessKey`.
- **Alternativa:** pega tu endpoint en `formspreeEndpoint`.
- Ambas URLs (`https://api.web3forms.com` y `https://formspree.io`) **ya están autorizadas** en la política CSP de `vercel.json`.
- Si ambas están vacías (`""`), el formulario abre automáticamente el cliente de correo del visitante con asunto y mensaje pre-rellenados.

---

### Receta 7 — Actualizar CVs, endpoints públicos y tarjeta de empresa

- **CVs PDF:** sustituye `public/CV_YerayGarrido_es.pdf`, `public/CV_YerayGarrido_en.pdf` y `public/CV_YerayGarrido_eu.pdf` (respetando exactamente esos nombres).
- **Endpoints GEO / API:** si añades un puesto o producto importante, actualiza también `public/llms.txt`, `public/cv.json`, `public/cv.xml` y `public/cv.txt`.
- **Tarjeta de empresa estilo *American Psycho*:** los archivos finales a 600 DPI (`2100×1200`, `85×55mm`, con QR real a `https://yeraygarrido.dev`) están en `public/img/brand/tarjeta-empresa.png`, `tarjeta-empresa-reverso.png` y `tarjeta-empresa-presentacion.png`.

---

## 5. Comandos, Despliegue y Checklist de Verificación

### Comandos principales
```bash
npm run dev       # Servidor local en http://localhost:3000 (incluye /papers/*)
npm run sync      # Sincroniza papers.json -> /papers/*, sitemap.xml e index.html
npm run lint      # Comprobación estricta de TypeScript (tsc --noEmit)
npm run build     # Ejecuta automáticamente `npm run sync` (prebuild) + build de Vite
npm run preview   # Previsualiza dist/ en local (incluye /papers/*)
```

> **Nota para Windows local si `node` no está en `PATH`:** en este equipo Node también está disponible en `C:\Users\ygarrido\.lmstudio\.internal\utils\node.exe`.

### Despliegue a producción
```bash
npm run lint
npm run build
git status
git add .
git commit -m "descripción clara del cambio"
git push origin main
```
Vercel detecta el push a `main`, ejecuta `npm run build` (que corre `prebuild` → `sync-content.mjs` + `vite build`) y publica en `https://yeraygarrido.dev/` en ~30 segundos.

### Checklist rápida antes de cerrar cambios (especialmente para agentes IA)
- [ ] `npm run sync` (si cambió `src/data/papers.json`) sin avisos de PDFs faltantes.
- [ ] `npm run lint` (`tsc --noEmit`) sale con código `0`.
- [ ] `npm run build` sale con código `0`.
- [ ] `index.html` tiene JSON-LD válido (`JSON.parse`) y `ProfilePage.dateModified` en formato ISO-8601 con hora y zona horaria.
- [ ] `public/sitemap.xml` es XML válido y solo lista páginas HTML y PDFs indexables.
- [ ] Ninguna flecha Unicode suelta (`↗ → ← ↑ ↓ ✓ ✕`) en el DOM renderizado (usar `<IconGlyph />` / `<RichText />`).
- [ ] En móvil (`360px` / `375px`), cambiar entre `ES / EN / EU` produce `0px` de overflow horizontal (`documentElement.scrollWidth === innerWidth`) y la `X` del menú permanece fija arriba incluso haciendo scroll.

### Cómo recuperar el diseño anterior (v1) si algún día hace falta
```bash
git checkout backup/portfolio-v1   # o usar el tag v1-old-design
```
