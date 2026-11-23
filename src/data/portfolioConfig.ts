/**
 * ============================================================================
 * PORTFOLIO MASTER CONFIG — EDITA TODO EL CONTENIDO DESDE AQUÍ
 * ============================================================================
 * Archivo central para mantener y escalar el portfolio sin tocar React ni GSAP:
 *  1. SITE_IDENTITY      -> Nombre, ORCID, email, enlaces sociales, GitHub
 *  2. CONTACT_FORM       -> Mini-formulario desplegable (Web3Forms / Formspree / mailto)
 *  3. LATEST_RELEASE     -> Tarjeta "Último Lanzamiento" del Hero (móvil o 16:10)
 *  4. FLAGSHIP_PRODUCT   -> Producto Destacado principal (Sección 01: modo móvil 3-phones o web/desktop 16:10)
 *  5. ARCHIVE_PLATES     -> Proyectos Destacados elegidos (Sección 01.B — elige los IDs y orden que quieras)
 *  6. RESEARCH_PAPERS    -> Cargado automáticamente desde src/data/papers.json (+ `npm run sync` genera /papers/* y sitemap)
 *     FEATURED_PAPERS    -> Papers destacados en la portada (Sección 02 — elige los IDs y el orden; el resto, en /papers/)
 *  7. WORK_EXPERIENCE & EDUCATION_HISTORY -> Trayectoria laboral y formación (contadores automáticos)
 *  8. TECH_STACK_ITEMS & API_ENDPOINTS    -> Stack y endpoints públicos
 *
 * Guía paso a paso con plantillas copiar-pegar: CONTENT_GUIDE.md
 * Catálogo completo de proyectos:               src/data/otherProjects.json
 * Publicaciones científicas (fuente única):     src/data/papers.json
 */

import otherProjectsRaw from "./otherProjects.json";
import papersRaw from "./papers.json";

export type Lang = "es" | "en" | "eu";

export interface LocalizedText {
  es: string;
  en: string;
  eu: string;
}

export const loc = (obj: LocalizedText, lang: string): string =>
  obj[(lang as Lang) || "es"] || obj.es;

export interface ProjectItem {
  id: string;
  title: LocalizedText;
  tech: string;
  desc: LocalizedText;
  link?: string;
  demoUrl?: string;
  pdfUrl?: string;
  pdfFilename?: string;
  role: LocalizedText;
  year: string;
  longDescChallenge: LocalizedText;
  longDescSolution: LocalizedText;
  imageUrl?: string;
  images?: string[];
}

export interface LatestReleaseConfig {
  /** Pon false si alguna vez quieres ocultar la tarjeta del Hero */
  enabled: boolean;
  /** Etiqueta superior izquierda (ej. "ÚLTIMO LANZAMIENTO", "NOVEDAD", "DESTACADO") */
  eyebrow: LocalizedText;
  /** Texto superior derecho (ej. marca, dominio o año) */
  metaRight: string;
  /** Título principal de la tarjeta */
  title: LocalizedText;
  /** Subtítulo / dato clave bajo el título */
  subtitle: LocalizedText;
  /** Ruta de la imagen o GIF dentro de /public */
  image: string;
  /** Texto alternativo accesible */
  imageAlt: string;
  /**
   * "mobile" = muestra la imagen dentro del chasis realista de smartphone
   * "plain"  = muestra la imagen o GIF directamente en formato 16:10 (ideal para web, SaaS o paper)
   */
  frameType: "mobile" | "plain";
  /**
   * ID de sección a la que hace scroll al pulsar la imagen (ej. "flagship-product", "research"),
   * o null para abrir el modal de `projectId` (si se indica) o `ctaUrl`.
   */
  scrollTarget: string | null;
  /** Opcional: si scrollTarget es null y pones un id de otherProjects.json, abre su ficha modal */
  projectId?: string;
  /** Texto y destino del botón principal */
  ctaLabel: LocalizedText;
  ctaUrl: string;
}

export interface FlagshipScreen {
  id: string;
  name: string;
  operator: LocalizedText;
  image: string;
  caption: LocalizedText;
}

export interface FlagshipMetric {
  target: number;
  suffix: string;
  format: "int" | "thousands" | "decimal1";
  fallbackText: string;
  accent?: boolean;
  label: LocalizedText;
}

export interface FlagshipProductConfig {
  /** Pon false si prefieres ocultar el bloque destacado y mostrar solo los Proyectos Destacados (01.B) */
  enabled: boolean;
  /** Debe coincidir con un "id" de src/data/otherProjects.json (aporta descripción, tech stack y ficha modal) */
  projectId: string;
  /**
   * "mobile-trio"     = escaparate interactivo con 3 móviles (ideal para apps móviles / PWAs)
   * "desktop-gallery" = lienzo arquitectónico 16:10 con selector de pantallas (ideal para webs, SaaS, ERP, IA)
   */
  showcaseMode: "mobile-trio" | "desktop-gallery";
  eyebrow: LocalizedText;
  titleMain: string;
  titleAccent: LocalizedText;
  domainLabel: string;
  metaSubtitle: string;
  url: string;
  ctaLabel: LocalizedText;
  /** Botón secundario opcional (ej. bajar a #research o abrir repositorio). Si se omite, no se muestra. */
  secondaryCta?: {
    label: LocalizedText;
    href: string;
    isAnchor?: boolean;
  };
  defaultScreenIndex: number;
  screens: FlagshipScreen[];
  metrics: FlagshipMetric[];
}

export interface ArchivePlateConfig {
  /** Debe coincidir con un "id" de src/data/otherProjects.json */
  id: string;
  /** Opcional: imagen o GIF de portada (si se omite, usa automáticamente imageUrl o images[0] del proyecto) */
  imageOverride?: string;
  /** Etiqueta superior opcional */
  badge?: LocalizedText;
  /** Franja destacada opcional bajo la descripción */
  highlight?: LocalizedText;
}

export interface FeaturedPaperConfig {
  /** Debe coincidir con un "id" de src/data/papers.json */
  id: string;
  /** Etiqueta opcional junto al tipo del paper (por ejemplo "NUEVO" o "DESTACADO") */
  badge?: LocalizedText;
}

export type ResearchVisualPlate =
  | {
      kind: "benchmark";
      figureLabel: string;
      primaryLabel: string;
      primaryPercent: number;
      secondaryLabel: LocalizedText;
      secondaryPercent: number;
      statLeftValue: string;
      statLeftLabel: LocalizedText;
      statRightValue: string;
      statRightLabel: string;
    }
  | {
      kind: "pipeline";
      figureLabel: string;
      figureMeta: string;
      steps: Array<{
        code: string;
        title: LocalizedText;
        meta: LocalizedText;
      }>;
    }
  | {
      kind: "manuscript";
      figureLabel: string;
      frontPage: string;
      backPage: string;
    }
  | {
      /** Plantilla universal para cualquier futuro paper (IA, sistemas, seguridad, web, etc.) */
      kind: "card";
      figureLabel: string;
      highlightStat: string;
      highlightLabel: LocalizedText;
      footnote?: string;
      image?: string;
    };

export interface PaperSourceRecord {
  id: string;
  slug: string;
  year: string;
  date: string;
  version: string;
  langBadge: "EN" | "ES" | "EU";
  topic: LocalizedText;
  venue: string;
  title: LocalizedText;
  type: LocalizedText;
  tldr: LocalizedText;
  doi: string;
  doiUrl: string;
  repoUrl?: string;
  pdfUrl: string;
  pdfFilename: string;
  readingPdfUrl?: string;
  readingPdfFilename?: string;
  /** Material suplementario (PDF aparte). No va al sitemap y se sirve con noindex. */
  supplementPdfUrl?: string;
  supplementPdfFilename?: string;
  metrics: LocalizedText[];
  visual: ResearchVisualPlate;
}

export interface PaperRecord extends PaperSourceRecord {
  /** Generado automáticamente según el orden en src/data/papers.json ("01", "02", ...) */
  index: string;
  /** Generado automáticamente como "/papers/<slug>/" */
  scholarPageUrl: string;
}

export interface TimelineEntry {
  id: string;
  title: LocalizedText;
  company: LocalizedText;
  date: LocalizedText;
  desc: LocalizedText;
}

export interface ApiEndpoint {
  id: "xml" | "json" | "txt" | "llms";
  label: string;
  path: string;
  command: string;
  preview: string;
}

export const ALL_PROJECTS: ProjectItem[] = otherProjectsRaw as ProjectItem[];

// ============================================================================
// 1. IDENTIDAD, ENLACES Y REDES
// ============================================================================
export const SITE_IDENTITY = {
  brandName: "Yeray Garrido",
  heroFirstName: "YERAY",
  heroLastName: "Garrido",
  cityLabel: "BILBAO",
  timezone: "Europe/Madrid",
  email: "garridoparrayeraytx@gmail.com",
  orcid: "0009-0008-0459-0294",
  orcidUrl: "https://orcid.org/0009-0008-0459-0294",
  githubUsername: "Garridoparrayeray",
  githubUrl: "https://github.com/Garridoparrayeray",
  linkedinUrl: "https://www.linkedin.com/in/yeray-garrido",
  photographyUrl: "https://archive.yeraygarrido.dev",
  bideUrl: "https://www.bideplus.eus/",
  gasolineraUrl: "https://gasolineraplus.app",
  papersArchivePath: "/papers/",
  githubCalendarStartDate: "2025-10-01",
  githubFallbackStats: {
    publicRepos: 23,
    estimatedCommits: 1566,
    followers: 12,
  },
} as const;

// ============================================================================
// 2. MINI-FORMULARIO DE CONTACTO (OPCIÓN B)
//    - Si pegas tu clave gratuita de Web3Forms (https://web3forms.com) en
//      web3formsAccessKey, los mensajes se envían en segundo plano directo a tu Gmail.
//    - Si la dejas vacía (""), el formulario abre el cliente de correo con todo pre-rellenado.
// ============================================================================
export const CONTACT_FORM = {
  web3formsAccessKey: "",
  formspreeEndpoint: "",
} as const;

// ============================================================================
// 3. TARJETA "ÚLTIMO LANZAMIENTO" DEL HERO (CAMBIA DE PRODUCTO EN 10 SEGUNDOS)
//    - frameType: "mobile" (con marco de smartphone) o "plain" (captura/GIF 16:10)
//    - scrollTarget: "flagship-product", "research", "work", o null para abrir ctaUrl/projectId
// ============================================================================
export const LATEST_RELEASE: LatestReleaseConfig = {
  enabled: true,
  eyebrow: {
    es: "ÚLTIMO LANZAMIENTO",
    en: "LATEST RELEASE",
    eu: "AZKEN ARGITALPENA",
  },
  metaRight: "Bideplus (Bide+)",
  title: {
    es: "Bideplus (Bide+) · Movilidad en Euskal Herria",
    en: "Bideplus (Bide+) · Basque Country Mobility",
    eu: "Bideplus (Bide+) · Euskal Herriko Mugikortasuna",
  },
  subtitle: {
    es: "16 redes · Cómo llegar · 64% vs 39% ETA",
    en: "16 networks · Route planner · 64% vs 39% ETA",
    eu: "16 sare · Nola iritsi · %64 vs %39 ETA",
  },
  image: "/img/projects/bideplus_home_mobile.webp?v=2026",
  imageAlt: "Bideplus (Bide+) instalada en móvil",
  frameType: "mobile",
  scrollTarget: "flagship-product",
  ctaLabel: {
    es: "Bideplus ↗",
    en: "Bideplus ↗",
    eu: "Bideplus ↗",
  },
  ctaUrl: "https://www.bideplus.eus/",
};

// ============================================================================
// 4. PRODUCTO DESTACADO PRINCIPAL (SECCIÓN 01)
//    Cambia `projectId`, `showcaseMode` ("mobile-trio" o "desktop-gallery"),
//    `screens`, `metrics` y `ctaLabel` para destacar cualquier otro producto.
// ============================================================================
export const FLAGSHIP_PRODUCT: FlagshipProductConfig = {
  enabled: true,
  projectId: "bideplus",
  showcaseMode: "mobile-trio",
  eyebrow: {
    es: "01 / PRODUCTO DESTACADO — BIDEPLUS (BIDE+)",
    en: "01 / FEATURED PRODUCT — BIDEPLUS (BIDE+)",
    eu: "01 / PRODUKTU NABARMENDUA — BIDEPLUS (BIDE+)",
  },
  titleMain: "Bideplus (Bide+)",
  titleAccent: {
    es: "Movilidad en Euskal Herria",
    en: "Basque Country Mobility",
    eu: "Euskal Herriko Mugikortasuna",
  },
  domainLabel: "WWW.BIDEPLUS.EUS",
  metaSubtitle: "PWA · ES / EU · 2026",
  url: "https://www.bideplus.eus/",
  ctaLabel: {
    es: "Bideplus (Bide+) ↗",
    en: "Bideplus (Bide+) ↗",
    eu: "Bideplus (Bide+) ↗",
  },
  secondaryCta: {
    label: {
      es: "Leer {papersCount} papers ↓",
      en: "Read {papersCount} papers ↓",
      eu: "Irakurri {papersCount} paper ↓",
    },
    href: "research",
    isAnchor: true,
  },
  defaultScreenIndex: 1,
  screens: [
    {
      id: "bizkaibus",
      name: "Bizkaibus+",
      operator: { es: "Tiempo real GPS", en: "Real-time GPS", eu: "GPS denbora erreala" },
      image: "/img/projects/bideplus_bizkaibus_mobile.webp?v=2026",
      caption: {
        es: "Bizkaibus+ — Llegadas en tiempo real calculadas por GPS, avisos de incidencias y próximos autobuses.",
        en: "Bizkaibus+ — Live GPS-calculated arrival countdowns, service alerts, and upcoming departures.",
        eu: "Bizkaibus+ — GPS bidez kalkulatutako etorrerak denbora errealean, gertakarien abisuak eta hurrengo autobusak.",
      },
    },
    {
      id: "hub",
      name: "Bide+ Hub",
      operator: { es: "App instalada (PWA)", en: "Installed PWA", eu: "Instalatutako PWA" },
      image: "/img/projects/bideplus_home_mobile.webp?v=2026",
      caption: {
        es: "Bideplus Hub — App instalada en móvil con planificador de rutas «Cómo llegar» y acceso directo a las 16 redes de Euskal Herria.",
        en: "Bideplus Hub — Installed mobile app with the «Cómo llegar» multimodal route planner and direct access to all 16 Basque transit networks.",
        eu: "Bideplus Hub — Mugikorrean instalatutako app-a «Cómo llegar» / Nola iritsi ibilbide-planifikatzaile multimodalarekin eta Euskal Herriko 16 sareetara sarbidearekin.",
      },
    },
    {
      id: "metro",
      name: "Metro+",
      operator: { es: "Metro Bilbao", en: "Metro Bilbao", eu: "Metro Bilbao" },
      image: "/img/projects/bideplus_metro_mobile.webp?v=2026",
      caption: {
        es: "Metro+ — Trazado interactivo sobre mapa de Metro Bilbao y consulta inmediata de próximos trenes.",
        en: "Metro+ — Interactive Metro Bilbao route map with instant schedule and next-train lookup.",
        eu: "Metro+ — Metro Bilbaoren mapa interaktiboa eta hurrengo trenen ordutegien kontsulta berehalakoa.",
      },
    },
    {
      id: "estado",
      name: "Estado",
      operator: { es: "16 redes en directo", en: "16 networks live", eu: "16 sare zuzenean" },
      image: "/img/projects/bideplus_estado_mobile.webp?v=2026",
      caption: {
        es: "Estado de las redes — Monitorización en directo de vehículos activos y avisos oficiales en las 16 redes integradas.",
        en: "Network status — Real-time overview of active vehicles and operator alerts across all 16 integrated networks.",
        eu: "Sareen egoera — Zuzeneko ibilgailuen eta operadoreen abisuen jarraipena integratutako 16 sareetan.",
      },
    },
    {
      id: "mapa",
      name: "Mapa",
      operator: { es: "Red multimodal", en: "Multimodal map", eu: "Mapa multimodala" },
      image: "/img/projects/bideplus_mapa_mobile.webp?v=2026",
      caption: {
        es: "Mapa de la red — Todas las líneas, paradas y transbordos de Bizkaibus, Metro, Euskotren y Renfe sobre un mismo mapa.",
        en: "Network map — Every line, stop, and transfer across Bizkaibus, Metro, Euskotren, and Renfe in one unified map.",
        eu: "Sarearen mapa — Bizkaibus, Metro, Euskotren eta Renfe-ko linea, geltoki eta aldaketa guztiak mapa bakarrean.",
      },
    },
  ],
  metrics: [
    {
      target: 64,
      suffix: "%",
      format: "int",
      fallbackText: "64%",
      accent: true,
      label: {
        es: "Precisión vs 39% oficial",
        en: "Accuracy vs 39% official",
        eu: "Zehaztasuna vs %39 ofiziala",
      },
    },
    {
      target: 555744,
      suffix: "",
      format: "thousands",
      fallbackText: "555.744",
      label: {
        es: "Predicciones pareadas",
        en: "Paired GPS benchmarks",
        eu: "GPS benchmark parekatu",
      },
    },
    {
      target: 9.1,
      suffix: "M",
      format: "decimal1",
      fallbackText: "9,1M",
      label: {
        es: "Evaluaciones ETA reales",
        en: "Evaluated ETA records",
        eu: "Ebaluatutako ETA datuak",
      },
    },
    {
      target: 16,
      suffix: "",
      format: "int",
      fallbackText: "16",
      accent: true,
      label: {
        es: "Redes de Euskal Herria",
        en: "Integrated transit networks",
        eu: "Euskal Herriko garraio sareak",
      },
    },
  ],
};

// ============================================================================
// 5. PROYECTOS DESTACADOS (SECCIÓN 01.B — ELIGE LOS QUE QUIERAS Y EN EL ORDEN QUE QUIERAS)
//    Solo necesitas poner `{ id: "id-del-proyecto" }` (de src/data/otherProjects.json).
//    `imageOverride`, `badge` y `highlight` son totalmente opcionales.
// ============================================================================
export const ARCHIVE_PLATES: ArchivePlateConfig[] = [
  {
    id: "gasolinera-plus",
    imageOverride: "/img/projects/gasolinera_loading.gif",
    badge: {
      es: "GASOLINERAPLUS.APP · iOS & ANDROID",
      en: "GASOLINERAPLUS.APP · iOS & ANDROID",
      eu: "GASOLINERAPLUS.APP · iOS & ANDROID",
    },
    highlight: {
      es: "España, Portugal y Francia · Datos oficiales · Google Play e iPhone",
      en: "Spain, Portugal & France · Official data · Google Play & iPhone",
      eu: "Espainia, Portugal eta Frantzia · Datu ofizialak · Google Play eta iPhone",
    },
  },
  {
    id: "art-gallery",
    imageOverride: "/img/projects/archive2.webp",
  },
  {
    id: "gastroaccess",
    imageOverride: "/img/projects/gastroAccess.webp",
  },
  {
    id: "zalbi",
    imageOverride: "/img/projects/zalbi_captura.webp",
  },
];

// ============================================================================
// 6. PUBLICACIONES CIENTÍFICAS (CARGADAS AUTOMÁTICAMENTE DESDE src/data/papers.json)
//    Para añadir un paper nuevo:
//      1. Añade el objeto a src/data/papers.json y guarda el PDF en public/papers/
//      2. Ejecuta `npm run sync` (o `npm run build`) -> actualiza web, /papers/*, sitemap e index.html
// ============================================================================
export const RESEARCH_PAPERS: PaperRecord[] = (papersRaw as PaperSourceRecord[]).map(
  (paper, idx) => ({
    ...paper,
    index: String(idx + 1).padStart(2, "0"),
    scholarPageUrl: `/papers/${paper.slug}/`,
  })
);

// ============================================================================
// 6.B PAPERS DESTACADOS (SECCIÓN 02 — ELIGE LOS QUE QUIERAS Y EN EL ORDEN QUE QUIERAS)
//    Igual que ARCHIVE_PLATES: solo necesitas poner `{ id: "id-del-paper" }` (de src/data/papers.json).
//    `badge` es opcional. Todos los papers siguen en /papers/ y en Google Scholar; si dejas la
//    lista vacía, la portada enseña todos.
// ============================================================================
export const FEATURED_PAPERS: FeaturedPaperConfig[] = [
  {
    id: "paper-journey-planning",
    badge: { es: "NUEVO", en: "NEW", eu: "BERRIA" },
  },
  { id: "paper-paired" },
  { id: "paper-threelayer" },
];

export const FEATURED_RESEARCH: Array<PaperRecord & { badge?: LocalizedText }> = (() => {
  const picked = FEATURED_PAPERS.map((cfg) => {
    const paper = RESEARCH_PAPERS.find((p) => p.id === cfg.id);
    return paper ? { ...paper, badge: cfg.badge } : null;
  }).filter(Boolean) as Array<PaperRecord & { badge?: LocalizedText }>;
  return picked.length > 0 ? picked : RESEARCH_PAPERS;
})();

// ============================================================================
// 7. EXPERIENCIA LABORAL Y FORMACIÓN (SECCIÓN 04 — CONTADORES AUTOMÁTICOS)
//    Para añadir un nuevo puesto o titulación, pega un bloque arriba del array.
// ============================================================================
export const WORK_EXPERIENCE: TimelineEntry[] = [
  {
    id: "horion",
    title: {
      es: "Ingeniero de Software",
      en: "Software Engineer",
      eu: "Software Ingeniaria",
    },
    company: {
      es: "Horión Software Engineering",
      en: "Horión Software Engineering",
      eu: "Horión Software Engineering",
    },
    date: {
      es: "Jun 2026 - Presente",
      en: "Jun 2026 - Present",
      eu: "2026ko eka. - Gaur egun",
    },
    desc: {
      es: "Desarrollo de principio a fin de módulos clave para Horión Enterprise, un software de gestión empresarial (ERP) multiempresa en PHP. Creación del módulo completo de buzón de salida (historial de envíos, descarga directa de adjuntos y reenvío con nuevos archivos), enrutamiento propio y evolución de interfaces existentes.",
      en: "Developing core modules end-to-end for Horión Enterprise, a multi-company management platform (ERP) built in PHP. Built the complete email outbox system (sent history, direct attachment downloads, and resending with new files) along with custom routing and maintenance of existing client interfaces.",
      eu: "Horión Enterprise enpresa-kudeaketako plataformarako (ERP) modulu nagusien garapena hasieratik amaierara PHP-n. Irteera-postontziaren modulu osoa sortu dut (bidalketen historia, eranskinen deskarga zuzena eta birbidalketa) eta bezero-interfazeak hobetu ditut.",
    },
  },
  {
    id: "bermeo",
    title: {
      es: "Desarrollador Java (Freelance)",
      en: "Java Developer (Freelance)",
      eu: "Java Garatzaile (Freelance)",
    },
    company: {
      es: "Ayuntamiento de Bermeo",
      en: "Bermeo Town Hall (Ayuntamiento de Bermeo)",
      eu: "Bermeoko Udala",
    },
    date: {
      es: "May 2026 - Jun 2026",
      en: "May 2026 - Jun 2026",
      eu: "2026ko mai. - 2026ko eka.",
    },
    desc: {
      es: "Sistema completo de gestión de objetos perdidos entregado en un sprint de 15 días: aplicación de escritorio en Java para el personal de atención al público y portal web para que cualquier vecino pueda buscar y reclamar objetos, con doble copia de seguridad para que el servicio nunca se detenga.",
      en: "Delivered a complete Lost & Found platform in a 15-day sprint: a desktop application (Java Swing/JavaFX) for municipal staff and a public web portal for citizens to search and claim items, backed by automatic local and remote database backups so service never stops.",
      eu: "Galdutako objektuak kudeatzeko sistema osoa 15 eguneko sprint batean garatua: udal-langileentzako mahaigaineko aplikazioa (Java) eta herritarrek objektuak bilatzeko web ataria, zerbitzua inoiz ez eteteko babeskopia bikoitzarekin.",
    },
  },
  {
    id: "freelance",
    title: {
      es: "Desarrollador Full Stack Freelance",
      en: "Freelance Full Stack Developer",
      eu: "Full Stack Garatzaile Freelance",
    },
    company: {
      es: "Proyectos Independientes",
      en: "Independent Projects",
      eu: "Proiektu Independenteak",
    },
    date: {
      es: "Ene 2025 - Jun 2026",
      en: "Jan 2025 - Jun 2026",
      eu: "2025eko urt. - 2026ko eka.",
    },
    desc: {
      es: "Diseño y desarrollo de webs a medida y productos propios priorizando velocidad, claridad y facilidad de uso. Entre ellos Zalbi Aisia (gestor de contenidos a medida y filtros instantáneos), yeraygarrido.dev y archive.yeraygarrido.dev.",
      en: "Designed and shipped custom websites and digital products focused on speed, clarity, and reliability. Highlights include Zalbi Aisia (custom CMS and search filters), yeraygarrido.dev, and archive.yeraygarrido.dev.",
      eu: "Abiadura, argitasuna eta erabilgarritasuna lehenesten dituzten neurrirako webak eta produktu propioak. Besteak beste: Zalbi Aisia (neurrirako CMS eta berehalako iragazkiak), yeraygarrido.dev eta archive.yeraygarrido.dev.",
    },
  },
  {
    id: "glocalium",
    title: {
      es: "Administrador Web y Desarrollador de Plugins",
      en: "Web Administrator & Plugin Developer",
      eu: "Web Administratzaile eta Plugin Garatzaile",
    },
    company: {
      es: "Glocalium Services SL",
      en: "Glocalium Services SL",
      eu: "Glocalium Services SL",
    },
    date: {
      es: "Abr 2025 - Jun 2025",
      en: "Apr 2025 - Jun 2025",
      eu: "2025eko api. - 2025eko eka.",
    },
    desc: {
      es: "Creación desde cero de dos extensiones en PHP para exportar formularios a CSV y guardar cada solicitud de forma segura en base de datos MySQL con panel de consulta. También migraciones de servidor, copias de seguridad automáticas, auditorías de seguridad y prototipos en Figma.",
      en: "Created custom WordPress extensions in PHP to export client inquiries to CSV and store them securely in MySQL with a private management panel. Also handled server migrations, automated backups, security checks, and Figma prototypes.",
      eu: "PHP-n hutsetik sortutako bi hedapen formularioak CSV-ra esportatzeko eta MySQL datu-basean modu seguruan gordetzeko kudeaketa-panelarekin. Zerbitzari migrazioak, babeskopia automatikoak, segurtasun-ikuskaritzak eta Figma prototipoak.",
    },
  },
  {
    id: "reciclanet",
    title: {
      es: "Programador Web",
      en: "Web Developer",
      eu: "Web Programatzaile",
    },
    company: {
      es: "Asociación Educativa Reciclanet",
      en: "Asociación Educativa Reciclanet",
      eu: "Asociación Educativa Reciclanet",
    },
    date: {
      es: "Mar 2022 - Abr 2022",
      en: "Mar 2022 - Apr 2022",
      eu: "2022ko mar. - 2022ko api.",
    },
    desc: {
      es: "Mantenimiento y actualización de la web de la asociación, mejorando la claridad del contenido, su estructura y la visualización en distintos dispositivos.",
      en: "Maintained and updated the organization website, improving content clarity, structure, and accessibility.",
      eu: "Elkartearen webgunearen mantentze-lanak eta eguneratzea, edukiaren argitasuna, egitura eta gailu ezberdinetako bistaratzea hobetuz.",
    },
  },
];

export const EDUCATION_HISTORY: TimelineEntry[] = [
  {
    id: "daw",
    title: {
      es: "Grado Superior en Desarrollo de Aplicaciones Web (DAW)",
      en: "Higher Degree in Web Application Development (DAW)",
      eu: "Web Aplikazioen Garapeneko Goi Mailako Zikloa (DAW)",
    },
    company: {
      es: "CIFP Zornotza LHII",
      en: "CIFP Zornotza LHII",
      eu: "CIFP Zornotza LHII",
    },
    date: {
      es: "2024 - Presente",
      en: "2024 - Present",
      eu: "2024 - Gaur egun",
    },
    desc: {
      es: "Técnico Superior en Desarrollo de Aplicaciones Web en modalidad Dual, combinando formación académica con ingeniería real en empresa.",
      en: "Higher Technician Degree in Web Application Development (Dual Vocational Training combining classes with real industry engineering).",
      eu: "Web Aplikazioen Garapeneko Goi Mailako Teknikaria, Lanbide Heziketa Dualean prestakuntza eta enpresako benetako ingeniaritza uztartuz.",
    },
  },
  {
    id: "42urduliz",
    title: {
      es: "Campus de Ingeniería de Software",
      en: "Software Engineering Track",
      eu: "Software Ingeniaritzako Campusa",
    },
    company: {
      es: "42 Urduliz (Fundación Telefónica)",
      en: "42 Urduliz (Fundación Telefónica)",
      eu: "42 Urduliz (Fundación Telefónica)",
    },
    date: {
      es: "2022 - 2023",
      en: "2022 - 2023",
      eu: "2022 - 2023",
    },
    desc: {
      es: "Formación intensiva basada en proyectos y aprendizaje entre pares, centrada en programación en C, algoritmos, gestión de memoria y fundamentos de sistemas.",
      en: "Intensive peer-to-peer programming campus with no teachers, centered on C, algorithms, memory management, and how operating systems work underneath.",
      eu: "Proiektuetan eta parekoen arteko ikaskuntzan oinarritutako prestakuntza trinkoa, C programazioan, algoritmoetan, memoria-kudeaketan eta sistemen oinarrietan zentratua.",
    },
  },
  {
    id: "ede",
    title: {
      es: "Certificado de Profesionalidad en Desarrollo Web (Nivel 3)",
      en: "Level 3 Professional Certificate in Web Development",
      eu: "Web Garapeneko Profesionaltasun Ziurtagiria (3. Maila)",
    },
    company: {
      es: "Fundación EDE",
      en: "Fundación EDE",
      eu: "Fundación EDE",
    },
    date: {
      es: "2021 - 2022",
      en: "2021 - 2022",
      eu: "2021 - 2022",
    },
    desc: {
      es: "Formación oficial en desarrollo web completo (frontend, backend, bases de datos y publicación de aplicaciones). Nota media: 9/10.",
      en: "Official certification covering frontend and backend development, databases, and deploying live web applications. Final grade: 9/10.",
      eu: "Web garapen osoan prestakuntza ofiziala (frontend, backend, datu-baseak eta aplikazioen argitalpena). Batez besteko nota: 9/10.",
    },
  },
];

// ============================================================================
// 8. STACK TECNOLÓGICO, ENDPOINTS API PÚBLICA & MARQUEE
// ============================================================================
export const TECH_STACK_ITEMS = [
  { name: "C", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" },
  { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  { name: "PHP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
  { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "WordPress", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg" },
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { name: "Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
  { name: "Bash", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-plain.svg" },
  { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
  { name: "LaTeX", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/latex/latex-original.svg" },
];

/**
 * IA aplicada y automatización: segunda fila de "Herramientas y tecnologías".
 * Iconos en /public/img/tech/ (Simple Icons, CC0). `label` es opcional: si se omite, se muestra `name`.
 */
export const AI_TOOLS_ITEMS: Array<{ name: string; icon: string; label?: LocalizedText }> = [
  { name: "Claude", icon: "/img/tech/claude.svg" },
  { name: "Gemini", icon: "/img/tech/gemini.svg" },
  {
    name: "Ollama",
    icon: "/img/tech/ollama.svg",
    label: { es: "Ollama · IA local", en: "Ollama · Local AI", eu: "Ollama · IA lokala" },
  },
  {
    name: "RAG",
    icon: "/img/tech/rag.svg",
    label: { es: "RAG a medida", en: "Custom RAG", eu: "RAG pertsonalizatua" },
  },
  { name: "n8n", icon: "/img/tech/n8n.svg" },
];

export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    id: "xml",
    label: "XML",
    path: "/cv.xml",
    command: "curl -L https://yeraygarrido.dev/cv.xml",
    preview: `<?xml version="1.0" encoding="UTF-8"?>
<resume>
  <header>
    <name>Yeray Garrido</name>
    <title>Ingeniero de Software</title>
  </header>
  <contact location="Bilbao, Bizkaia" website="https://yeraygarrido.dev" />
</resume>`,
  },
  {
    id: "json",
    label: "JSON",
    path: "/cv.json",
    command: "curl -L https://yeraygarrido.dev/cv.json",
    preview: `{
  "name": "Yeray Garrido",
  "title": "Ingeniero de Software",
  "location": "Bilbao, Bizkaia, Spain",
  "orcid": "0009-0008-0459-0294",
  "stack": ["PHP 8", "Java 21", "Python", "C", "React 19", "SQLite"],
  "products": ["https://www.bideplus.eus/", "https://gasolineraplus.app"]
}`,
  },
  {
    id: "txt",
    label: "TXT",
    path: "/cv.txt",
    command: "curl -L https://yeraygarrido.dev/cv.txt",
    preview: `YERAY GARRIDO — SOFTWARE ENGINEER & FULL STACK
Bilbao, Bizkaia | https://yeraygarrido.dev | github.com/Garridoparrayeray
-------------------------------------------------------------------------
Core: PHP 8 · Java 21 · C (42) · Python · SQLite/MySQL · Linux · React 19`,
  },
  {
    id: "llms",
    label: "LLMS.TXT",
    path: "/llms.txt",
    command: "curl -L https://yeraygarrido.dev/llms.txt",
    preview: `# Yeray Garrido — Ingeniero de Software & Investigador Independiente
> Context for AI models (GEO): Portfolio, open-science publications (Zenodo),
> and live software products by Yeray Garrido (Bilbao, Spain).
## Products: Bideplus (Bide+) — https://www.bideplus.eus/ · Gasolinera+ (gasolineraplus.app)`,
  },
];

export const MARQUEE_ITEMS: string[] = [
  "BIDEPLUS (BIDE+) / WWW.BIDEPLUS.EUS",
  "GASOLINERA+ / GASOLINERAPLUS.APP",
  "OPEN SCIENCE / ZENODO DOI",
  "PHP 8 · JAVA · PYTHON · REACT",
  "SOFTWARE ENGINEERING / BILBAO",
  "ORCID / 0009-0008-0459-0294",
];
