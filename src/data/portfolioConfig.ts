/**
 * ============================================================================
 * PORTFOLIO MASTER CONFIG — EDITA TODO EL CONTENIDO DESDE AQUÍ
 * ============================================================================
 * Archivo único de configuración para editar el portfolio sin tocar React ni GSAP:
 *  1. SITE_IDENTITY      -> Nombre, ORCID, email, enlaces sociales, GitHub
 *  2. CONTACT_FORM       -> Configuración del mini-formulario desplegable (Web3Forms / Formspree / mailto)
 *  3. LATEST_RELEASE     -> Tarjeta destacada del Hero (puedes poner cualquier proyecto, app o paper)
 *  4. FLAGSHIP_PRODUCT   -> Escenario principal multi-móvil (Bide+)
 *  5. ARCHIVE_PLATES     -> Tarjetas del archivo destacado (Gasolinera+, YGArchive, etc.)
 *  6. RESEARCH_PAPERS    -> Publicaciones científicas (Bide+ o cualquier tema futuro)
 *  7. TECH_STACK_ITEMS   -> Iconos del stack tecnológico
 *  8. API_ENDPOINTS      -> Endpoints públicos (cv.xml, cv.json, cv.txt, llms.txt)
 *
 * Para fichas detalladas de todos los proyectos: src/data/otherProjects.json
 * Para textos generales multi-idioma (bio, experiencia, etc.): src/context/LanguageContext.tsx
 */

import otherProjectsRaw from "./otherProjects.json";

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
  /** Texto superior derecho (ej. dominio o año) */
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
   * "plain"  = muestra la imagen o GIF directamente en formato 16:10
   */
  frameType: "mobile" | "plain";
  /** ID de sección a la que hace scroll al pulsar la imagen (ej. "flagship-bide"), o null para abrir ctaUrl */
  scrollTarget: string | null;
  /** Etiqueta del cursor flotante en escritorio */
  cursorLabel: string;
  /** Texto y destino del botón */
  ctaLabel: LocalizedText;
  ctaUrl: string;
}

export interface FlagshipMobileScreen {
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

export interface ArchivePlateConfig {
  /** Debe coincidir con un "id" de src/data/otherProjects.json */
  id: string;
  /** Imagen o GIF de portada en la tarjeta apilada */
  imageOverride: string;
  /** Etiqueta superior opcional */
  badge?: LocalizedText;
  /** Franja destacada opcional bajo la descripción */
  highlight?: LocalizedText;
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
      /** Plantilla universal para cualquier futuro paper (de Bide+ o cualquier otro tema) */
      kind: "card";
      figureLabel: string;
      highlightStat: string;
      highlightLabel: LocalizedText;
      footnote?: string;
      image?: string;
    };

export interface PaperRecord {
  id: string;
  index: string;
  year: string;
  date: string;
  version: string;
  langBadge: "EN" | "ES" | "EU";
  /** Área o temática (editable para futuros papers fuera de transporte/Bide+) */
  topic: LocalizedText;
  venue: string;
  title: LocalizedText;
  type: LocalizedText;
  tldr: LocalizedText;
  doi: string;
  doiUrl: string;
  /** Página estática indexable por Google Scholar en /papers/... */
  scholarPageUrl?: string;
  repoUrl?: string;
  pdfUrl: string;
  pdfFilename: string;
  readingPdfUrl?: string;
  readingPdfFilename?: string;
  metrics: LocalizedText[];
  visual: ResearchVisualPlate;
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
//    - Si la dejas vacía (""), el formulario abre automáticamente el cliente de correo
//      del visitante con asunto y cuerpo pre-rellenados (nunca falla).
// ============================================================================
export const CONTACT_FORM = {
  web3formsAccessKey: "",
  formspreeEndpoint: "",
} as const;

// ============================================================================
// 3. TARJETA "ÚLTIMO LANZAMIENTO" DEL HERO (100% PERSONALIZABLE)
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
  scrollTarget: "flagship-bide",
  cursorLabel: "VER BIDEPLUS ↓",
  ctaLabel: {
    es: "Bideplus ↗",
    en: "Bideplus ↗",
    eu: "Bideplus ↗",
  },
  ctaUrl: "https://www.bideplus.eus/",
};

// ============================================================================
// 4. PRODUCTO ESTRELLA (SECCIÓN 01 — BIDE+)
// ============================================================================
export const FLAGSHIP_PRODUCT = {
  projectId: "bideplus",
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
  ] as FlagshipMobileScreen[],
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
  ] as FlagshipMetric[],
} as const;

// ============================================================================
// 5. TARJETAS DESTACADAS DEL ARCHIVO (SECCIÓN 01.B — STICKY DEPTH-STACK)
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
      es: "11.400+ estaciones MITECO · Instalable en iPhone y Android · Play Store próximamente",
      en: "11,400+ MITECO stations · Installable on iPhone & Android · Play Store coming soon",
      eu: "11.400+ MITECO gasolindegi · iPhone eta Android-en instalagarria · Laster Play Store-n",
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
// 6. PUBLICACIONES CIENTÍFICAS — EXTENSIBLE PARA CUALQUIER TEMA FUTURO
//    Para añadir un nuevo paper (de Bide+, IA, sistemas, seguridad, etc.),
//    duplica un bloque aquí con visual.kind: "card" (o "benchmark" / "pipeline" / "manuscript").
//    El contador de publicaciones se actualiza automáticamente en toda la web.
// ============================================================================
export const RESEARCH_PAPERS: PaperRecord[] = [
  {
    id: "paper-paired",
    index: "01",
    year: "2026",
    date: "2026-11-16",
    version: "v1.0",
    langBadge: "EN",
    topic: {
      es: "Transporte & Open Data · Bide+",
      en: "Transit & Open Data · Bide+",
      eu: "Garraioa & Open Data · Bide+",
    },
    venue: "Zenodo (CERN) · Preprint",
    title: {
      es: "Accuracy of open-data versus operator real-time bus arrival predictions: a paired evaluation of the Bide+ method in Biscay, Spain",
      en: "Accuracy of open-data versus operator real-time bus arrival predictions: a paired evaluation of the Bide+ method in Biscay, Spain",
      eu: "Accuracy of open-data versus operator real-time bus arrival predictions: a paired evaluation of the Bide+ method in Biscay, Spain",
    },
    type: {
      es: "Evaluación Empírica Pareada",
      en: "Empirical Paired Benchmark",
      eu: "Ebaluazio Enpiriko Parekatua",
    },
    tldr: {
      es: "Comparamos más de medio millón de llegadas reales de Bizkaibus (555.744 mediciones por GPS): nuestro sistema queda a ±2 min del paso real en el 64 % de los casos, frente al 39 % de la app oficial y el 16 % del horario; a partir de tres minutos, acierta más en 57 de las 59 paradas.",
      en: "We compared over half a million real Bizkaibus arrivals (555,744 GPS measurements): our open-data method is within ±2 min of the actual passage in 64% of cases, versus 39% for the official app and 16% for the timetable; from three minutes out, it is ahead at 57 of 59 stops.",
      eu: "Bizkaibus-eko milioi erdi baino gehiago iritsiera erreal alderatu ditugu (555.744 GPS neurketa): gure metodoa benetako igarotzetik ±2 minutura dago kasuen %64an, app ofizialaren %39aren eta ordutegiaren %16aren aurrean; hiru minututik aurrera, 59tik 57 geralekutan hobea da.",
    },
    doi: "10.5281/zenodo.24286027",
    doiUrl: "https://doi.org/10.5281/zenodo.24286027",
    scholarPageUrl: "/papers/paired-evaluation/",
    repoUrl: "https://github.com/Garridoparrayeray/bide-eta",
    pdfUrl: "/papers/Garrido_2026_Open-data_vs_operator_real-time_bus_predictions_preprint_v1.0.pdf",
    pdfFilename: "Garrido_2026_Open-data_vs_operator_real-time_bus_predictions_preprint_v1.0.pdf",
    readingPdfUrl: "/papers/Garrido_2026_Open-data_vs_operator_real-time_bus_predictions_reading-version_v1.0.pdf",
    readingPdfFilename: "Garrido_2026_Open-data_vs_operator_real-time_bus_predictions_reading-version_v1.0.pdf",
    metrics: [
      { es: "555.744 predicciones", en: "555,744 predictions", eu: "555.744 aurreikuspen" },
      { es: "64 % vs 39 % precisión", en: "64% vs 39% accuracy", eu: "%64 vs %39 zehaztasuna" },
      { es: "57 / 59 paradas (≥3 min)", en: "57 / 59 stops (≥3 min)", eu: "57 / 59 geraleku (≥3 min)" },
    ],
    visual: {
      kind: "benchmark",
      figureLabel: "FIG. 01 / PAIRED BENCHMARK",
      primaryLabel: "Bide+ (Open Data)",
      primaryPercent: 64,
      secondaryLabel: {
        es: "App Oficial Bizkaibus",
        en: "Official Operator App",
        eu: "Operadorearen App Ofiziala",
      },
      secondaryPercent: 39,
      statLeftValue: "57 / 59",
      statLeftLabel: { es: "Paradas ganadas (≥3 min)", en: "Stops won (≥3 min)", eu: "Geraleku irabazi (≥3 min)" },
      statRightValue: "+25 pp",
      statRightLabel: "n = 555.744 (±2 min)",
    },
  },
  {
    id: "paper-threelayer",
    index: "02",
    year: "2026",
    date: "2026-11-16",
    version: "v1.1",
    langBadge: "EN",
    topic: {
      es: "Algoritmia & Predicción · Bide+",
      en: "Algorithms & Prediction · Bide+",
      eu: "Algoritmia & Aurreikuspena · Bide+",
    },
    venue: "Zenodo (CERN) · Preprint",
    title: {
      es: "Predicting bus arrivals when the feed reports positions but not delays: a reproducible three-layer method with an open reference implementation",
      en: "Predicting bus arrivals when the feed reports positions but not delays: a reproducible three-layer method with an open reference implementation",
      eu: "Predicting bus arrivals when the feed reports positions but not delays: a reproducible three-layer method with an open reference implementation",
    },
    type: {
      es: "Especificación del Método",
      en: "Method Specification",
      eu: "Metodoaren Zehaztapena",
    },
    tldr: {
      es: "Cómo calcular cuándo llega un autobús usando solo su posición GPS cuando los datos públicos no indican el retraso. En 9,1 millones de predicciones, la llegada cae a ±2 min en el 92–96 % de los casos cuando el bus está a menos de tres minutos (67 % a 10–20 min, frente al 23–25 % del horario), con código abierto en Python.",
      en: "How to predict bus arrival times using only live GPS positions when public feeds omit delays. In 9.1 million predictions, the arrival shown is within ±2 min in 92–96% of cases when the bus is under three minutes away (67% at 10–20 min, vs 23–25% for the timetable), with open Python code.",
      eu: "Autobus bat noiz iritsiko den nola kalkulatu GPS posizioa soilik erabiliz datu publikoek atzerapenik ematen ez dutenean. 9,1 milioi aurreikuspenetan, iritsiera ±2 minututan dago kasuen %92–96an autobusa hiru minutu baino gutxiagora dagoenean (%67 10–20 minututan, ordutegiaren %23–25aren aurrean), Python kode irekiarekin.",
    },
    doi: "10.5281/zenodo.24286302",
    doiUrl: "https://doi.org/10.5281/zenodo.24286302",
    scholarPageUrl: "/papers/three-layer-method/",
    repoUrl: "https://github.com/Garridoparrayeray/bide-eta",
    pdfUrl: "/papers/Garrido_2026_Bus_arrival_prediction_three-layer_method_preprint_v1.1.pdf",
    pdfFilename: "Garrido_2026_Bus_arrival_prediction_three-layer_method_preprint_v1.1.pdf",
    metrics: [
      { es: "9,1M predicciones", en: "9.1M predictions", eu: "9,1M aurreikuspen" },
      { es: "92–96 % a ±2 min (<3 min)", en: "92–96% within ±2 min (<3 min)", eu: "%92–96 ±2 min-tan (<3 min)" },
      { es: "67 % vs 23–25 % horario (10–20 min)", en: "67% vs 23–25% timetable (10–20 min)", eu: "%67 vs %23–25 ordutegia (10–20 min)" },
    ],
    visual: {
      kind: "pipeline",
      figureLabel: "FIG. 02 / 3-LAYER ENGINE",
      figureMeta: "9,1M EVAL.",
      steps: [
        {
          code: "L1",
          title: {
            es: "Proyección Geométrica GPS",
            en: "Geometric GPS Projection",
            eu: "GPS Proiekzio Geometrikoa",
          },
          meta: { es: "SIRI-VM → GTFS Shape", en: "SIRI-VM → GTFS Shape", eu: "SIRI-VM → GTFS Shape" },
        },
        {
          code: "L2",
          title: {
            es: "Última Parada + Abstención",
            en: "Last Stop + Explicit Abstention",
            eu: "Azken Geralekua + Abstentzioa",
          },
          meta: {
            es: "Cero retrasos inventados",
            en: "Zero fabricated delays",
            eu: "Atzerapen faltsurik gabe",
          },
        },
        {
          code: "L3",
          title: {
            es: "Medianas Contraídas",
            en: "Learned Shrunk Medians",
            eu: "Ikasitako Medianak",
          },
          meta: {
            es: "±2 min: 92–96% (<3 min)",
            en: "±2 min: 92–96% (<3 min)",
            eu: "±2 min: %92–96 (<3 min)",
          },
        },
      ],
    },
  },
  {
    id: "paper-monograph",
    index: "03",
    year: "2026",
    date: "2026-11-07",
    version: "v2.1",
    langBadge: "ES",
    topic: {
      es: "Ingeniería & ML · Bide+",
      en: "Engineering & ML · Bide+",
      eu: "Ingeniaritza & ML · Bide+",
    },
    venue: "Zenodo (CERN) · Technical Monograph",
    title: {
      es: "Predicción de llegadas de autobuses con posiciones en tiempo real y horarios interpolados",
      en: "Bus arrival prediction from real-time positions and interpolated timetables",
      eu: "Autobusen iritsiera-aurreikuspena denbora errealeko posizioekin eta interpolatutako ordutegiekin",
    },
    type: {
      es: "Memoria de Referencia (200 pp.)",
      en: "Reference Monograph (200 pp.)",
      eu: "Erreferentziazko Memoria (200 orri)",
    },
    tldr: {
      es: "Libro técnico completo de 200 páginas donde se explica toda la ingeniería y matemáticas del motor predictivo (incluyendo filtrado de Kalman, red neuronal que reduce el error medio un 6–7 % y 407 pruebas verificables).",
      en: "Complete 200-page technical monograph documenting the full engineering and mathematics behind the prediction engine (including Kalman filtering, a neural network cutting mean error by 6–7%, and 407 verified tests).",
      eu: "200 orrialdeko memoria tekniko osoa, iragarpen-motorraren ingeniaritza eta matematika guztiak azaltzen dituena (Kalman iragazkia, batez besteko errorea %6–7 murrizten duen sare neuronala eta 407 proba egiaztagarri).",
    },
    doi: "10.5281/zenodo.24041572",
    doiUrl: "https://doi.org/10.5281/zenodo.24041572",
    scholarPageUrl: "/papers/memoria-bide-eta/",
    repoUrl: "https://github.com/Garridoparrayeray/bide-eta",
    pdfUrl: "/papers/Garrido_2026_Prediccion_llegadas_autobuses_memoria_v2.1.pdf",
    pdfFilename: "Garrido_2026_Prediccion_llegadas_autobuses_memoria_v2.1.pdf",
    metrics: [
      { es: "200 páginas", en: "200 pages", eu: "200 orrialde" },
      { es: "407 tests de prueba", en: "407 test vectors", eu: "407 proba-bektore" },
      { es: "Kalman + Red Neuronal", en: "Kalman + Neural Network", eu: "Kalman + Sare Neuronala" },
    ],
    visual: {
      kind: "manuscript",
      figureLabel: "FIG. 03 / 200 PP. MONOGRAPH",
      frontPage: "/img/projects/paper_eta_page1_portada.webp",
      backPage: "/img/projects/paper_eta_page22_arquitectura.webp",
    },
  },
];

// ============================================================================
// 7. STACK TECNOLÓGICO & ENDPOINTS API PÚBLICA
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
    <title>Software Engineer &amp; Full Stack Developer</title>
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
  "title": "Ingeniero de Software & Desarrollador Full Stack",
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

// ============================================================================
// 8. CINTA EDITORIAL CINÉTICA (MARQUEE)
// ============================================================================
export const MARQUEE_ITEMS: string[] = [
  "BIDEPLUS (BIDE+) / WWW.BIDEPLUS.EUS",
  "GASOLINERA+ / GASOLINERAPLUS.APP",
  "OPEN SCIENCE / ZENODO DOI",
  "PHP 8 · JAVA · PYTHON · REACT",
  "SOFTWARE ENGINEERING / BILBAO",
  "ORCID / 0009-0008-0459-0294",
];
