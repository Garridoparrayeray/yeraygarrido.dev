import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useLanguage } from "../context/LanguageContext";
import otherProjectsData from "../data/otherProjects.json";

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  fork: boolean;
}

interface LocalizedText {
  es: string;
  en: string;
  eu: string;
}

interface FeaturedProject {
  id: string;
  title: LocalizedText;
  tech: string;
  desc: LocalizedText;
  link?: string;
  demoUrl?: string;
  role: LocalizedText;
  year: string;
  longDescChallenge: LocalizedText;
  longDescSolution: LocalizedText;
  imageUrl?: string; 
  images?: string[]; 
}

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const modalScrollRef = useRef<HTMLDivElement>(null);

  const { t, language } = useLanguage();
  const l = (text: LocalizedText) =>
    text[language as keyof LocalizedText] || text.es;

  const renderTitle = (title: string) => {
    if (!title.includes("+")) return title;
    const parts = title.split("+");
    let plusColor = "text-[#FF7A1A]";
    if (/bide/i.test(title)) {
      plusColor = "text-[#C8102E]";
    } else if (/gasolinera/i.test(title)) {
      plusColor = "text-[#FF7A1A]";
    }

    return (
      <>
        {parts.map((part, idx) => (
          <span key={idx}>
            {part}
            {idx < parts.length - 1 && (
              <span className={`inline-block animate-plus-spin origin-center ml-0.5 ${plusColor}`}>
                +
              </span>
            )}
          </span>
        ))}
      </>
    );
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'portfolio' | 'github'>('portfolio');
  const [activeProject, setActiveProject] = useState<FeaturedProject | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const containerWidthRef = useRef(0);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const galleryScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lightboxIndex !== null && galleryScrollRef.current) {
      const items = galleryScrollRef.current.children;
      if (items[lightboxIndex]) {
        (items[lightboxIndex] as HTMLElement).scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [lightboxIndex]);

  useEffect(() => {
    if (isModalOpen || activeProject || lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen, activeProject, lightboxIndex]);

  const uiTexts = {
    challenge: { es: "El Reto", en: "The Challenge", eu: "Erronka" },
    solution: { es: "La Solución", en: "The Solution", eu: "Soluzioa" },
    role: { es: "Rol", en: "Role", eu: "Rola" },
    year: { es: "Año", en: "Year", eu: "Urtea" },
    gallery: { es: "Galería", en: "Gallery", eu: "Galeria" },
    stack: { es: "Stack Tecnológico", en: "Tech Stack", eu: "Teknologia Stack-a" },
    live: { es: "Ver Proyecto en Vivo", en: "View Live Project", eu: "Ikusi Proiektua Zuzenean" },
    code: { es: "Código Fuente", en: "Source Code", eu: "Iturburu Kodea" },
    back: { es: "Volver", en: "Back", eu: "Itzuli" },
    tabPortfolio: { es: "Proyectos Completos", en: "Complete Projects", eu: "Proiektu Osoak" },
    tabGithub: { es: "GitHub", en: "GitHub", eu: "GitHub" },
    viewAll: { es: "Ver todos", en: "View all", eu: "Ikusi guztiak" },
    viewRepo: { es: "Ver repositorio", en: "View repository", eu: "Ikusi biltegia" },
  };

  const projects: FeaturedProject[] = [
    {
      id: "zalbi",
      title: { es: "Zalbi Aisia", en: "Zalbi Aisia", eu: "Zalbi Aisia" },
      tech: "PHP 8, WordPress (_s), CPTs, ACF, Vanilla JS, CSS Grid",
      desc: {
        es: "Plataforma corporativa desarrollada 100% a medida desde cero, fiel a la visión de negocio y el diseño exactos que buscaba el cliente.",
        en: "Corporate platform built 100% from scratch, true to the exact business vision and design the client wanted.",
        eu: "Bezeroak nahi zuen negozio-ikuspegi eta diseinu zehatzari jarraituz, hutsetik %100 pertsonalizatuta garatutako plataforma korporatiboa.",
      },
      link: "https://github.com/Garridoparrayeray/zalbi-theme",
      demoUrl: "https://zalbi.eu/",
      role: { es: "Full Stack (WP Custom Theme)", en: "Full Stack (WP Custom Theme)", eu: "Full Stack (WP Custom Theme)" },
      year: "2026",
      longDescChallenge: { 
        es: "El requisito principal era desarrollar una plataforma corporativa que el cliente pudiera gestionar de forma autónoma, sin constructores visuales ni plantillas comerciales. Se exigía una optimización extrema de Core Web Vitals con tiempos de carga inferiores a 1.5s. El cliente necesitaba una solución profesional sin dependencias de builders que penalizan el rendimiento.", 
        en: "The main requirement was to develop a corporate platform manageable autonomously by the client, strictly avoiding visual builders. Extreme Core Web Vitals optimization was required with sub-1.5s load times. The client needed a professional solution without dependencies that penalize performance.", 
        eu: "Bezeroak kudeaketa autonomoa behar zuen, eraikitzaile bisualik gabe. 1.5s-tik beherako karga denbora lortzea zen erronka nagusia. Bezeroak errendimendua txikitzen duten eraikitzaileen menpeko ez den konponbide profesionala behar zuen." 
      },
      longDescSolution: { 
        es: "Construí el tema desde cero sobre Underscores (_s), evitando cualquier constructor visual. El catálogo incorpora un filtro en Vanilla JS para evitar el 'layout thrashing' y mejorar la fluidez. Implementé CSS Grid para uniformidad de tarjetas y paletas de colores dinámicas generadas en PHP según la categoría del producto. Todo optimizado para carga diferida e imágenes WebP.", 
        en: "I built the theme from scratch using Underscores (_s), avoiding any visual builder. The catalog features a Vanilla JS filter to avoid layout thrashing and improve fluidity. I implemented CSS Grid for card uniformity and dynamic color palettes generated in PHP based on product category. Everything optimized for lazy loading and WebP images.", 
        eu: "Hutsetik eraikitako gaia Underscores (_s) erabiliz, eraikitzaile bisualik saihestuz. Iragazki sistema Vanilla JS-rekin egin nuen 'layout thrashing'-a saihesteko. CSS Grid erabili nuen txartelen uniformetarako eta kolore-paleta dinamikoak PHP-n sortzeko produktu-kategoriaren arabera." 
      },
      imageUrl: "/img/projects/zalbi_captura.webp",
      images: ["/img/projects/zalbi_captura.webp", "/img/projects/zalbi_mobile_img.webp", "/img/projects/zalbi_footer_img.webp"],
    },
    {
      id: "portfolio-arquitectura",
      title: { es: "yeraygarrido.dev", en: "yeraygarrido.dev", eu: "yeraygarrido.dev" },
      tech: "React 19, Vite, Tailwind CSS v4, GSAP, Lenis",
      desc: {
        es: "Arquitectura frontend (SPA) de alto rendimiento con animaciones complejas y 90+ Lighthouse",
        en: "High-performance frontend architecture (SPA) featuring complex animations and 90+ Lighthouse score.",
        eu: "Errendimendu handiko frontend arkitektura (SPA), animazio konplexuekin eta 90+ Lighthouse-rekin.",
      },
      link: "https://github.com/Garridoparrayeray/yeraygarrido.com.git",
      demoUrl: "https://yeraygarrido.dev",
      role: { es: "Frontend Engineer / WPO", en: "Frontend Engineer / WPO", eu: "Frontend Ingeniaria / WPO" },
      year: "2026",
      longDescChallenge: { 
        es: "El objetivo era crear un portfolio visualmente impactante sin sacrificar el rendimiento (WPO). Las librerías de animación tradicionales suelen arruinar los Core Web Vitals en móviles; el reto fue integrarlas de forma fluida sin causar Layout Thrashing ni penalizar el hilo principal de JavaScript.", 
        en: "The goal was to create a visually striking portfolio without sacrificing performance (WPO). Traditional animation libraries often ruin Core Web Vitals on mobile; the challenge was seamless integration without layout thrashing or penalizing the main JavaScript thread.", 
        eu: "Helburua errendimendua sacrificed gabe (WPO) portfolio ikusgarri bat sortzea zen. Animazio liburutegi tradizionalek Core Web Vitals arruinatu ohi dituzte mobilean; erronka integrazio arin bat izan zen, Layout Thrashing sortu gabe eta JavaScript hari nagusia karga gabe." 
      },
      longDescSolution: { 
        es: "Diseñé una arquitectura SPA con React 19 y Vite, priorizando una ruta de renderizado crítico sin bloqueos. Implementé un sistema i18n propio mediante Context API (ES/EN/EU) sin dependencias externas. Desarrollé las animaciones con GSAP y Lenis para scroll suave, sustituyendo ScrollTrigger por IntersectionObserver en componentes lazy, eliminando así los cuellos de botella de Style & Layout en el hilo principal.", 
        en: "I designed a SPA architecture with React 19 and Vite, prioritizing a zero-blocking critical rendering path. I implemented a custom i18n system via Context API (ES/EN/EU) without external dependencies. I built animations using GSAP and Lenis for smooth scrolling, replacing ScrollTrigger with IntersectionObserver in lazy components, eliminating Style & Layout bottlenecks on the main thread.", 
        eu: "React 19 eta Vite erabiliz SPA arkitektura diseinatu nuen, blokeorik gabeko renderizado-bide kritikoa lehenetsiz. I18n sistema pertsonalizatua egin nuen Context API bidez (ES/EN/EU) kanpo-menpekotasunik gabe. Animazioak GSAP eta Lenis erabiliz garatu nituen scroll leunetarako, ScrollTrigger IntersectionObserver-rekin ordezkatuz, Style & Layout bottleneck-ak elimiantuz." 
      },
      imageUrl: "/img/projects/portfolio_captura.webp",
      images: ["/img/projects/portfolio_captura.webp", "/img/projects/all_proyects_portfolio.webp", "/img/projects/mobile_stack_view_portfolio.webp"],
    },
    {
      id: "bideplus",
      title: { es: "Bide+", en: "Bide+", eu: "Bide+" },
      tech: "PHP 8, SQLite, Vanilla JS, GTFS, SIRI-VM/SIRI-SX, PWA, Vercel Serverless, GitHub Actions",
      desc: {
        es: "Plataforma web instalable (PWA) de transporte público de Euskadi (Bizkaibus+, Metro+, Euskotren+, Tranvía, Renfe) con horarios, llegadas en tiempo real calculadas por GPS y mapa interactivo.",
        en: "Installable web app (PWA) unifying Basque Country public transit (Bizkaibus+, Metro+, Euskotren+, Tram, Renfe) with timetables, live GPS-calculated arrivals, and interactive map.",
        eu: "Euskadiko garraio publikoa (Bizkaibus+, Metro+, Euskotren+, Tranbia, Renfe) batzen duen web aplikazio instalagarria (PWA), ordutegiekin, GPS bidez kalkulatutako etorrerak eta mapa biziarekin.",
      },
      link: "https://github.com/Garridoparrayeray/bizkaibus-renewed",
      demoUrl: "https://bideplus.vercel.app",
      role: { es: "Full Stack / Arquitectura de Datos", en: "Full Stack / Data Architecture", eu: "Full Stack / Datuen Arkitektura" },
      year: "2026",
      longDescChallenge: {
        es: "Empezó como una mejora personal para la app de Bizkaibus, lenta y poco intuitiva, y evolucionó hasta abarcar toda la red de movilidad de Euskadi (Bizkaibus+, Metro+, Euskotren+, Tranvías de Bilbao/Vitoria y Renfe Cercanías). El gran reto técnico fue el seguimiento en tiempo real: el feed SIRI-VM del operador no entrega una cuenta atrás lista para consumir, solo coordenadas y un retraso estimado genérico que a menudo no coincide con la realidad. Además, unificar datos multimodales heterogéneos sin saturar servidores ni penalizar el rendimiento en dispositivos móviles exigía replantear por completo la ingesta de datos.",
        en: "Started as a personal improvement for the official Bizkaibus app, unintuitive and slow, and evolved into a unified mobility hub for all Basque Country transit (Bizkaibus+, Metro+, Euskotren+, Bilbao/Vitoria Trams, and Renfe Cercanías). The major technical hurdle was live tracking: the SIRI-VM feed provides no ready countdown, only coordinates and a generic delay figure that often misleads passengers. Unifying multimodal feeds without server overload or mobile lag required rethinking data ingestion from the ground up.",
        eu: "Bizkaibus-en app ofiziala hobetzeko proiektu pertsonal gisa hasi zen, eta Euskadi osoko garraio publikoa (Bizkaibus+, Metroa, Euskotren+, Bilbo/Gasteizko Tranbiak eta Renfe Aldiriak) bateratzera eboluzionatu zuen. Erronka nagusia denbora errealeko jarraipena izan zen: SIRI-VM feed-ak ez du kontagailurik ematen, koordenatuak eta atzerapen generiko bat baino ez. Datu multimodal desberdinak bateratzeak, zerbitzaria kargatu gabe eta mugikorrean arintasuna mantenduz, datuen tratamendua goitik behera birpentsatzea eskatu zuen.",
      },
      longDescSolution: {
        es: "Backend PHP nativo con arquitectura limpia por capas (Controllers/Models/Services) que precompila diariamente las especificaciones oficiales GTFS a una base de datos SQLite embebida durante el build — cero latencia de base de datos externa, ideal para serverless (Vercel). Diseñé un algoritmo propio de ETA que sitúa la telemetría GPS del autobús directamente sobre el trazado geométrico de la línea y lo coteja parada a parada, reduciendo el margen de error típico de 5 minutos a menos de 1.5 minutos. Integra avisos de incidencias en vivo, soporte PWA sin conexión para consultas recientes, dos temas visuales completos y soporte bilingüe (ES/EU).",
        en: "Native PHP backend with clean layered architecture (Controllers/Models/Services) precompiling official GTFS feeds daily into an embedded SQLite database at build time — zero database server latency, optimal for Vercel serverless. Engineered a proprietary ETA algorithm projecting real-time bus GPS telemetry onto geometric route paths stop-by-stop, cutting arrival estimation error from ~5 minutes down to sub-1.5 minutes. Includes live service alerts, offline PWA caching for recent searches, two visual themes, and bilingual support (ES/EU).",
        eu: "PHP backend natiboa geruzatan antolatua (Controllers/Models/Services), egunero GTFS datu ofizialak build-ean txertatutako SQLite datu-base batera aurrekonpilatzen duena — kanpoko datu-basearen latentziarik gabe, Vercel serverless arkitekturarako ezin hobea. ETA algoritmo propioa garatu nuen: autobusaren GPS posizioa ibilbide geometrikoaren gainean kokatzen du geltokiz geltoki, errore-marjina 5 minututik 1.5 minutu baino gutxiagora murriztuz. Gertakarien abisuak denbora errealean, lineaz kanpoko PWA katxea, bi tema bisual eta elebitasuna (ES/EU) biltzen ditu.",
      },
      imageUrl: "/img/projects/bideplus_loading.gif",
      images: [
        "/img/projects/bideplus_loading.gif",
        "/img/projects/bideplus_desktop.webp",
        "/img/projects/bideplus_mobile.webp",
        "/img/projects/bideplus_bizkaibus_mobile.webp",
        "/img/projects/bideplus_bizkaibus_desktop.webp",
        "/img/projects/bideplus_metro_mobile.webp",
        "/img/projects/bideplus_euskotren_mobile.webp",
        "/img/projects/bideplus_renfe_mobile.webp",
        "/img/projects/bizkaibus_captura.png",
        "/img/projects/bizkaibus_mobile_view.png",
        "/img/projects/bizkaibus_miamor_theme.png"
      ],
    },
    {
      id: "gasolinera-plus",
      title: { es: "Gasolinera+", en: "Gasolinera+", eu: "Gasolinera+" },
      tech: "PHP 8 (API REST), HTML5, CSS3, Vanilla JS, Geolocation API, MITECO Open Data, Leaflet, Canvas",
      desc: {
        es: "Buscador y comparador en tiempo real de precios de combustible en España (MITECO), con gestor de vehículos y consumo, ordenador de viaje en vivo con velocímetro y mapa interactivo de calor.",
        en: "Real-time fuel price finder and comparator across Spain (MITECO), featuring vehicle telemetry & fuel logging, live trip computer with speedometer, and interactive price heatmap.",
        eu: "Espainia osoko erregai-prezioak denbora errealean bilatu eta alderatzeko tresna (MITECO), ibilgailuen kudeaketarekin, kontsumo-kontrolekin, denbora errealeko bidaia-ordenagailuarekin eta bero-maparekin.",
      },
      link: "https://github.com/Garridoparrayeray/gasolinera-plus",
      role: { es: "Full Stack (PHP + Vanilla JS)", en: "Full Stack (PHP + Vanilla JS)", eu: "Full Stack (PHP + Vanilla JS)" },
      year: "2025",
      longDescChallenge: {
        es: "Encontrar el combustible más económico en ruta suele depender de aplicaciones lentas, sobrecargadas de publicidad o con datos desfasados. Además, los conductores carecen de herramientas integradas para monitorizar el gasto real de su propio vehículo (depósito restante, coste por kilómetro, histórico de repostajes) y registrar sus trayectos sin depender de servicios de terceros que recopilan telemetría privada. El reto fue crear una suite de movilidad ultrarrápida, con identidad visual oscura y acento naranja (#FF7A1A), sin publicidad invasiva y con almacenamiento y geolocalización client-side respetuosos al 100% con la privacidad.",
        en: "Finding the cheapest fuel usually involves ad-heavy, sluggish apps or outdated information. Furthermore, drivers lack lightweight privacy-respecting tools to log personal vehicle metrics (tank levels, cost per km, fill-up history) and track live road trips without invasive cloud telematics. The challenge was building an ultra-fast, zero-ad mobility suite in a dark theme with vibrant orange branding (#FF7A1A), running entirely client-side for maximum speed and privacy.",
        eu: "Erregai merkeena aurkitzeak sarritan publizitatez betetako edo datu zaharrak dituzten aplikazio motelak erabiltzea eskatzen du. Gainera, gidariek ez dituzte ibilgailuaren gastu propioa kudeatzeko tresna arinak (gainerako erregaia, kilometroko kostua, birkargak) eta telemetria pribatua erregistratzeko aukerarik. Erronka mugikortasun-suite ultra-azkarra sortzea zen, estilo ilunarekin eta laranja biziarekin (#FF7A1A), publizitaterik gabe eta bezero-aldeko pribatutasun osoarekin."
      },
      longDescSolution: {
        es: "Arquitectura Full Stack sin dependencias pesadas: backend PHP nativo que consulta, normaliza y cachea los datos oficiales del Ministerio para más de 11.400 estaciones de servicio en todo el país (Gasóleo A, Gasolina 95, 98, GLP, etc.). En el cliente, una SPA ultrarrápida en Vanilla JS con: 1) Buscador geolocalizado y mapa interactivo con clusters y capas de mapa de calor de precios; 2) Módulo de Garaje/Coche para control de depósitos, histórico de repostajes, medias de consumo (L/100km) y exportación gráfica a imagen y PDF; y 3) Ordenador de a bordo para trayectos ('Grabando viaje') con velocímetro digital en tiempo real (km/h), cálculo de distancia, tiempo y velocidad media sin consumo excesivo de batería.",
        en: "Zero-dependency Full Stack architecture: native PHP backend querying, normalizing, and caching live official Ministry feeds for over 11,400 fuel stations across Spain (Gasóleo A, Gasoline 95, 98, LPG). On the frontend, a snappy vanilla JS SPA featuring: 1) Geolocation finder and interactive map with station clusters and price heatmap layers; 2) 'Coche' vehicle telemetry hub tracking fuel tank capacity, fill-ups, average L/100km consumption, and summary export to image/PDF; and 3) Live onboard trip computer with digital speedometer (km/h), elapsed time, distance, and average speed.",
        eu: "Menpekotasunik gabeko Full Stack irtenbidea: PHP natiboko backend-a Ministerioko 11.400 gasolindegiren datu ofizialak normalizatzeko eta katxeatzeko. Bezeroan, Vanilla JS SPA azkarra: 1) Geokokapen bidezko bilatzailea eta mapa interaktiboa bero-mapa geruzekin; 2) 'Coche' garaje-modulua depozituaren jarraipenerako, birkargak, batez besteko kontsumoa (L/100km) eta irudi/PDF esportazioa; eta 3) Denbora errealeko bidaia-ordenagailua abiadura-neurgailu digitalarekin (km/h), distantzia eta denbora kalkuluarekin."
      },
      imageUrl: "/img/projects/gasolinera_loading.gif",
      images: [
        "/img/projects/gasolinera_loading.gif",
        "/img/projects/gasolinera_desktop.webp",
        "/img/projects/gasolinera_coche_desktop.webp",
        "/img/projects/gasolinera_mobile.webp",
        "/img/projects/gasolinera_viaje_mobile.webp"
      ],
    },
    {
      id: "card-psa-tracker",
      title: { es: "Pokémon Card PSA Tracker", en: "Pokémon Card PSA Tracker", eu: "Pokémon Card PSA Tracker" },
      tech: "Vanilla JS, CSS3 Moderno, Animaciones Keyframes, Pokédex UI Design, Figma",
      desc: {
        es: "App de seguimiento y tasación de cartas coleccionables Pokémon graduadas por PSA, con interfaz temática Pokédex, animaciones dinámicas y panel analítico. Demo no completada con datos en vivo debido a que la API de mercado pasó a ser de pago.",
        en: "Graded Pokémon card tracking and valuation app with authentic Pokédex UI styling, custom keyframe animations, and portfolio analytics. Live market demo paused as the underlying pricing API switched to a paid subscription model.",
        eu: "PSA-k graduatutako Pokemon txartelen jarraipen eta balorazio aplikazioa, Pokédex interfazearekin, animazioekin eta analitika-panelarekin. Datu bizien demoa ez da osatu merkatuko APIa ordainpeko eredura igaro zelako."
      },
      link: "https://github.com/Garridoparrayeray/card_psa_tracker",
      demoUrl: "https://garridoparrayeray.github.io/card_psa_tracker/",
      role: { es: "UI/UX Designer & Frontend Developer", en: "UI/UX Designer & Frontend Developer", eu: "UI/UX Diseinatzailea & Frontend Garatzailea" },
      year: "2025",
      longDescChallenge: {
        es: "El sector del coleccionismo de cartas coleccionables Pokémon y su certificación profesional (PSA, BGS) carece de herramientas con una identidad visual atractiva. El objetivo fue diseñar una experiencia inmersiva basada en la Pokédex original (lente de zafiro superior, Pokéballs giratorias, temas de color Claro y Oscuro, estadísticas de colección y fluctuaciones de precio). Sin embargo, durante la fase de integración con proveedores de datos de mercado (precios históricos y tasaciones), las APIs de terceros eliminaron sus planes gratuitos y pasaron a modelos de suscripción de alto coste, imposibilitando mantener la demo interactiva en tiempo real en producción sin un coste recurrente elevado.",
        en: "Graded collectible card trading (PSA, BGS) often relies on generic, uninspired portals. The goal was to build a tailored collector hub reflecting the iconic Pokédex aesthetic (sapphire camera lens, animated spinning Pokéball loaders, Light/Dark theme switching, portfolio valuations, and price deltas). However, during external market integration, target card pricing APIs sunsetted their free developer tiers in favor of expensive commercial subscriptions, preventing a full free production rollout with real-time data.",
        eu: "Graduatutako Pokemon txartelen merkatuak nortasun gutxiko interfaze arruntak izaten ditu. Helburua Pokédex originalean oinarritutako esperientzia murgiltzaile bat sortzea zen (goiko zafiro-lentea, Pokéball birakariak, Gai Argi eta Ilunak, bildumaren balioa eta prezio-aldaketak). Hala ere, merkatuko prezioen datu-hornitzaileek doako sarbidea kendu eta ordainpeko harpidetza garestietara pasa ziren, produkzioko zuzeneko datuen demoa doan mantentzea galaraziz."
      },
      longDescSolution: {
        es: "A pesar de la barrera de costes de la API externa, se completó de manera íntegra el diseño visual y el prototipo funcional de la aplicación en HTML5, CSS3 modular y Vanilla JS. Incorpora animaciones CSS de alta precisión (giro de Pokéball, skeleton loaders), sistema de cambio de tema en caliente mediante variables CSS, selector de grados PSA (1 a 10), métricas de revalorización y diseño adaptable para móvil y escritorio. El prototipo interactivo se encuentra publicado y accesible en GitHub Pages como muestra de diseño UI/UX y maquetación avanzada, con capturas completas de la experiencia tanto en ordenador como en móvil.",
        en: "Despite external API paywalls, the full visual design system and functional UI prototype were fully implemented using modern HTML5, modular CSS3, and Vanilla JS. It features high-precision keyframe animations (spinning Pokéballs, skeleton loaders), dynamic runtime theme switching via CSS custom properties, PSA grade selectors (1-10), portfolio valuation breakdowns, and responsive mobile-first ergonomics. The interactive UI prototype is live on GitHub Pages, accompanied by comprehensive desktop and mobile visual captures showcasing the craft.",
        eu: "Kanpoko APIaren ordainpeko mugak gorabehera, aplikazioaren ikus-diseinu osoa eta prototipo funtzionala amaitu ziren HTML5, CSS3 eta Vanilla JS erabiliz. Doitasun handiko animazioak ditu (Pokéball birakaria, skeleton kargatzaileak), gai-aldaketa dinamikoa CSS aldagaiekin, PSA gradu-hautatzailea (1-10) eta mugikorretarako diseinu arduratsua. Prototipo interaktiboa GitHub Pages-en eskuragarri dago ordenagailu zein mugikorreko pantaila-argazki osoekin."
      },
      imageUrl: "/img/projects/pokemon_pokeball_loading.gif",
      images: [
        "/img/projects/pokemon_pokeball_loading.gif",
        "/img/projects/psa_card_fullscreen_desktop.webp",
        "/img/projects/psa_card_fullscreen_mobile.webp",
        "/img/projects/psa_dark_desktop.webp",
        "/img/projects/psa_dark_mobile.webp",
        "/img/projects/psa_admin_menu_desktop.webp",
        "/img/projects/psa_admin_menu_mobile.webp",
        "/img/projects/psa_admin_dark_desktop.webp",
        "/img/projects/psa_admin_light_desktop.webp",
        "/img/projects/psa_collection_desktop.webp",
        "/img/projects/psa_collection_mobile.webp",
        "/img/projects/psa_home_desktop.webp",
        "/img/projects/psa_stats_desktop.webp"
      ],
    }
  ];

  const allManualProjects = Array.from(
    new Map([...projects, ...(otherProjectsData as FeaturedProject[])].map(p => [p.id, p])).values()
  );

  const scrollToProject = (index: number) => {
    if (!scrollRef.current) return;
    const items = scrollRef.current.querySelectorAll('[data-project-card]');
    if (items[index]) {
      const item = items[index] as HTMLElement;
      const containerWidth = containerWidthRef.current || scrollRef.current.clientWidth;
      const itemLeft = item.offsetLeft;
      const itemWidth = item.offsetWidth;
      const targetScroll = itemLeft - (containerWidth - itemWidth) / 2;
      scrollRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  // FIX "esa barra lateral pequeña no funciona" (indicador de paginacion
  // abajo): asumia que cada tarjeta ocupa TODO el ancho visible
  // (scrollLeft/clientWidth), cierto en movil (w-[82vw], casi el ancho
  // entero) pero falso en escritorio (w-[45vw] con varias tarjetas
  // parcialmente visibles a la vez) -- el indice calculado no
  // correspondia con la tarjeta realmente centrada. Ahora se busca cual
  // [data-project-card] tiene su centro mas cerca del centro del
  // contenedor visible, igual de correcto sin importar cuantas tarjetas
  // quepan a la vez.
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    containerWidthRef.current = clientWidth;

    const items = scrollRef.current.querySelectorAll('[data-project-card]');
    const containerCenter = scrollLeft + clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;
    items.forEach((item, i) => {
      const el = item as HTMLElement;
      const itemCenter = el.offsetLeft + el.offsetWidth / 2;
      const distance = Math.abs(itemCenter - containerCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });
    setActiveIndex(closestIndex);
  };

  const openProjectsModal = () => { setModalTab('portfolio'); setIsModalOpen(true); setActiveIndex(projects.length); };

  const fetchRepos = async () => {
    if (repos.length > 0) return;
    setLoading(true);
    try {
      const response = await fetch("https://api.github.com/users/Garridoparrayeray/repos?sort=updated&per_page=100");
      if (!response.ok) throw new Error("Failed");
      setRepos(await response.json());
    } catch { setError(t("github.error")); }
    finally { setLoading(false); }
  };

  const handleTabGithub = () => { setModalTab('github'); fetchRepos(); };

  const handlePrevImage = (e: MouseEvent) => {
    e.stopPropagation();
    if (!activeProject || !activeProject.images || lightboxIndex === null) return;
    setLightboxIndex(prev => (prev === 0 ? activeProject.images!.length - 1 : prev! - 1));
  };

  const handleNextImage = (e: MouseEvent) => {
    e.stopPropagation();
    if (!activeProject || !activeProject.images || lightboxIndex === null) return;
    setLightboxIndex(prev => (prev === activeProject.images!.length - 1 ? 0 : prev! + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex !== null) {
        if (e.key === 'ArrowLeft') {
          setLightboxIndex(prev => (prev === 0 ? activeProject?.images!.length! - 1 : prev! - 1));
        } else if (e.key === 'ArrowRight') {
          setLightboxIndex(prev => (prev === activeProject?.images!.length! - 1 ? 0 : prev! + 1));
        } else if (e.key === 'Escape') {
          setLightboxIndex(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, activeProject]);

  return (
    <>
      <style>{`
        @keyframes modalEnter { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-modal { animation: modalEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .modal-scroll::-webkit-scrollbar { width: 4px; }
        .modal-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
        @keyframes plus-spin {
          0% { transform: rotate(0deg) scale(1); }
          60% { transform: rotate(360deg) scale(1.15); }
          100% { transform: rotate(360deg) scale(1); }
        }
        .animate-plus-spin {
          animation: plus-spin 0.8s ease-in-out infinite;
        }
      `}</style>

      <section ref={sectionRef} className="min-h-svh bg-black text-white flex flex-col relative z-10 border-t border-white/10 pb-8 md:pb-24 overflow-hidden">
        <div className="pt-6 md:pt-24 px-6 md:px-24 shrink-0 flex flex-col md:flex-row justify-between items-center md:items-end gap-3 md:gap-6">
          <h2 className="font-wide text-3xl md:text-5xl font-bold uppercase text-white">{t("projects.title")}</h2>
          <button onClick={openProjectsModal} className="hidden md:block font-sans text-xs tracking-widest uppercase border border-white/30 px-6 py-3 hover:bg-white hover:text-black transition-colors cursor-pointer">
            {t("projects.viewAll")}
          </button>
        </div>

        <div className="relative flex-1 flex flex-col justify-center mt-1 md:mt-12 px-6 md:px-24">
          <div ref={scrollRef} onScroll={handleScroll} className="flex items-stretch overflow-x-auto snap-x snap-mandatory hide-scrollbar py-6 md:py-8 scroll-smooth" style={{ scrollbarWidth: "none" }}>
            <div className="flex gap-6 md:gap-16 w-max items-stretch">
              {projects.map((p, i) => (
                <div key={p.id} data-project-card onClick={() => setActiveProject(p)} className="w-[82vw] md:w-[45vw] max-w-150 shrink-0 flex flex-col group snap-start cursor-pointer h-full">
                  <div className="aspect-video bg-[#050505] mb-4 md:mb-6 overflow-hidden relative border border-white/10 group-hover:border-white/40 transition-colors">
                    {p.imageUrl && <img src={p.imageUrl} alt={l(p.title)} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />}
                    <div className="absolute top-3 md:top-4 right-3 md:right-4 opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 border border-white/20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </div>
                    <span className="absolute bottom-3 md:bottom-4 left-3 md:left-4 font-sans text-[10px] md:text-[10px] tracking-widest uppercase text-white/70 bg-black/50 backdrop-blur-sm px-3 py-1.5 border border-white/10">{p.year}</span>
                  </div>
                  <h3 className="font-wide text-xl md:text-3xl mb-2 md:mb-3 uppercase font-bold">{renderTitle(l(p.title))}</h3>
                  <p className="font-sans text-sm md:text-sm text-white/50 line-clamp-3 leading-relaxed">{l(p.desc)}</p>
                </div>
              ))}
              <div data-project-card onClick={openProjectsModal} className="w-[82vw] md:w-[45vw] max-w-150 shrink-0 flex flex-col group snap-start cursor-pointer h-full">
                <div className="aspect-video border border-white/10 mb-4 md:mb-6 flex items-center justify-center group-hover:border-white/40 group-hover:bg-white/5 transition-all">
                  <div className="w-14 md:w-16 h-14 md:h-16 border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </div>
                </div>
                <h3 className="font-wide text-xl md:text-3xl uppercase font-bold text-white/50 group-hover:text-white transition-colors">{t("projects.viewAll")}</h3>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-2 mt-6">
            {[...projects, null].map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToProject(i)}
                className={`group p-2 cursor-pointer touch-manipulation`}
                aria-label={i < projects.length ? `Ir al proyecto ${i + 1}` : l(uiTexts.viewAll)}
              >
                <div className={`h-1 transition-all duration-300 ${
                  activeIndex === i ? 'w-6 bg-white' : 'w-1 bg-white/30 group-hover:bg-white/60'
                }`} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL PRINCIPAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 bg-black/95 backdrop-blur-md flex flex-col animate-modal" onClick={() => setIsModalOpen(false)}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 md:p-12 border-b border-white/10 shrink-0 gap-6 bg-black" onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-6">
              <button onClick={() => setModalTab('portfolio')} className={`pb-3 font-sans text-sm md:text-base uppercase tracking-wider transition-all relative cursor-pointer ${
                modalTab === 'portfolio' ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}>
                {l(uiTexts.tabPortfolio)}
                {modalTab === 'portfolio' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></span>}
              </button>
              <button onClick={handleTabGithub} className={`pb-3 font-sans text-sm md:text-base uppercase tracking-wider transition-all relative cursor-pointer ${
                modalTab === 'github' ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}>
                {l(uiTexts.tabGithub)}
                {modalTab === 'github' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></span>}
              </button>
            </div>
            <button onClick={() => setIsModalOpen(false)} aria-label="Cerrar modal" className="cursor-pointer w-12 h-12 md:w-14 md:h-14 border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div ref={modalScrollRef} className="flex-1 overflow-y-auto modal-scroll overscroll-contain" data-lenis-prevent="true" onClick={(e) => e.stopPropagation()}>
            {modalTab === 'portfolio' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 md:p-12 max-w-7xl mx-auto overflow-hidden">
                {allManualProjects.map((p) => (
                  <div key={p.id} onClick={() => setActiveProject(p)} className="bg-[#050505] border border-white/10 hover:border-white/30 group flex flex-col cursor-pointer overflow-hidden transition-all">
                    <div className="aspect-[4/3] bg-black relative overflow-hidden">
                      {p.imageUrl || (p.images && p.images[0]) ? (
                        <img src={p.imageUrl || (p.images && p.images[0])} alt={l(p.title)} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-wide text-4xl text-white/5 uppercase">{p.title.es?.charAt(0) || 'P'}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="font-sans text-xs uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-sm px-4 py-2 border border-white/20">+ Ver más</span>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6 flex flex-col flex-1">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-1">
                        <h3 className="font-wide text-base sm:text-lg text-white uppercase text-center sm:text-left w-full sm:w-auto">{renderTitle(l(p.title))}</h3>
                        <span className="font-sans text-xs text-white/30 shrink-0 w-full sm:w-auto text-center sm:text-right">{p.year}</span>
                      </div>
                      <p className="font-sans text-xs text-white/50 flex-1 line-clamp-3 leading-relaxed text-justify">{l(p.desc)}</p>
                      <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4 justify-center sm:justify-start">
                        {p.tech.split(", ").slice(0, 3).map((tag, j) => (
                          <span key={j} className="font-sans text-[8px] sm:text-[9px] tracking-widest uppercase text-white/60 bg-white/5 border border-white/10 px-1.5 sm:px-2 py-0.5 sm:py-1 truncate max-w-[80px] sm:max-w-none">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {modalTab === 'github' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6 md:p-12 max-w-7xl mx-auto">
                {loading ? (
                  <div className="col-span-full text-center py-20 font-sans text-white/30">Cargando repositorios...</div>
                ) : repos.map((repo) => (
                  <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer" className="bg-[#050505] border border-white/10 hover:border-white/30 p-5 transition-all flex flex-col group">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-wide text-base text-white truncate flex-1 group-hover:text-white/80 transition-colors">{repo.name}</h3>
                      {repo.language && (
                        <span className="shrink-0 font-sans text-[9px] tracking-widest uppercase text-white/40 bg-white/5 border border-white/10 px-2 py-1">
                          {repo.language}
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-xs text-white/40 flex-1 mb-4 line-clamp-2 leading-relaxed text-justify">{repo.description || 'Sin descripción disponible'}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 font-sans text-xs text-white/40">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                          {repo.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1.5 font-sans text-xs text-white/40">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><circle cx="18" cy="6" r="3"></circle><path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"></path><path d="M12 12v3"></path></svg>
                          {repo.forks_count}
                        </span>
                      </div>
                      <span className="font-sans text-[10px] tracking-wider uppercase text-white/50 group-hover:text-white transition-colors flex items-center gap-1">
                        {l(uiTexts.viewRepo)}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* DETALLE PROYECTO */}
      {activeProject && (
        <div className="fixed inset-0 z-200 bg-black animate-modal flex flex-col" onClick={() => setActiveProject(null)}>
          <div className="sticky top-0 w-full px-6 py-4 md:px-12 md:py-6 flex justify-between items-center bg-black/95 backdrop-blur-xl z-20 border-b border-white/20 shrink-0" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setActiveProject(null)} 
              className="cursor-pointer flex items-center gap-2.5 font-sans text-sm md:text-base font-bold tracking-widest uppercase text-white hover:text-white/70 transition-colors py-2 px-3.5 border border-white/20 hover:border-white bg-white/5 hover:bg-white/10"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              <span>{l(uiTexts.back)}</span>
            </button>
            <div className="flex items-center gap-4">
              <span className="font-wide text-sm md:text-lg font-bold uppercase text-white tracking-widest truncate max-w-[45vw] text-right">
                {renderTitle(l(activeProject.title))}
              </span>
              <button 
                onClick={() => setActiveProject(null)}
                aria-label={l(uiTexts.back)}
                className="cursor-pointer w-10 h-10 md:w-12 md:h-12 border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all bg-white/5 shrink-0"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto modal-scroll" data-lenis-prevent="true" onClick={(e) => e.stopPropagation()}>
            <div className="w-full h-[30vh] md:h-[55vh] bg-[#050505] border-b border-white/10 flex items-center justify-center relative overflow-hidden">
              {(activeProject.imageUrl || (activeProject.images && activeProject.images[0])) && (
                <>
                  <img src={activeProject.imageUrl || (activeProject.images && activeProject.images[0])} alt={l(activeProject.title)} className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                </>
              )}
              {!activeProject.imageUrl && !(activeProject.images && activeProject.images[0]) && <div className="font-display text-4xl md:text-8xl uppercase text-white/5">{renderTitle(l(activeProject.title))}</div>}
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-6 sm:pt-10 md:pt-20 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 md:gap-16 pb-16">
              <div className="lg:col-span-8 flex flex-col gap-8 md:gap-16">
                <div className="space-y-4 md:space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-3">
                    <h1 className="font-wide text-5xl sm:text-5xl md:text-5xl uppercase text-white leading-tight break-words">{renderTitle(l(activeProject.title))}</h1>
                    <span className="font-sans text-xs md:text-sm tracking-widest uppercase text-white/30 bg-white/5 border border-white/10 px-3 py-1.5 shrink-0">{activeProject.year}</span>
                  </div>
                  <p className="font-sans text-lg md:text-xl text-white/70 leading-relaxed">{l(activeProject.desc)}</p>
                </div>
                
                <div className="h-px w-full bg-white/10"></div>
                
                <div className="space-y-3 md:space-y-5">
                  <h3 className="font-sans text-sm md:text-xs tracking-widest uppercase text-white/40 font-bold">{l(uiTexts.challenge)}</h3>
                  <p className="font-sans text-base md:text-lg text-white/80 leading-relaxed whitespace-pre-line text-justify">{l(activeProject.longDescChallenge)}</p>
                </div>
                
                <div className="space-y-3 md:space-y-5">
                  <h3 className="font-sans text-sm md:text-xs tracking-widest uppercase text-white/40 font-bold">{l(uiTexts.solution)}</h3>
                  <p className="font-sans text-base md:text-lg text-white/80 leading-relaxed whitespace-pre-line text-justify">{l(activeProject.longDescSolution)}</p>
                </div>

                {activeProject.images && activeProject.images.length > 0 && (
                  <div className="pt-6 md:pt-8 border-t border-white/10">
                    <h3 className="font-sans text-sm md:text-xs tracking-widest uppercase text-white/40 font-bold mb-4 md:mb-6">{l(uiTexts.gallery)}</h3>
                    <div 
                      className="flex gap-3 md:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar scroll-smooth"
                      style={{ scrollbarWidth: "none" }}
                      ref={galleryScrollRef}
                    >
                      {activeProject.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setLightboxIndex(idx)}
                          className={`shrink-0 snap-start overflow-hidden border-2 transition-all cursor-pointer ${
                            lightboxIndex === idx ? 'border-white' : 'border-white/20 hover:border-white/50'
                          }`}
                        >
                          <img 
                            src={img} 
                            alt={`Captura ${idx + 1}`} 
                            className="w-48 sm:w-56 md:w-72 lg:w-80 h-auto aspect-video object-cover" 
                            loading="lazy" 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-4 flex flex-col gap-5 md:gap-8 lg:gap-10 lg:pl-8 xl:pl-12 border-t lg:border-t-0 lg:border-l border-white/10 pt-5 lg:pt-0">
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6 lg:gap-8">
                  <div className="space-y-1 md:space-y-2">
                    <h4 className="font-sans text-xs md:text-xs tracking-widest uppercase text-white/30">{l(uiTexts.role)}</h4>
                    <span className="font-sans text-sm md:text-sm text-white font-medium block">{l(activeProject.role)}</span>
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <h4 className="font-sans text-xs md:text-xs tracking-widest uppercase text-white/30">{l(uiTexts.year)}</h4>
                    <span className="font-sans text-sm md:text-sm text-white font-medium block">{activeProject.year}</span>
                  </div>
                </div>
                <div className="space-y-2 md:space-y-4">
                  <h4 className="font-sans text-xs md:text-xs tracking-widest uppercase text-white/30">{l(uiTexts.stack)}</h4>
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {activeProject.tech.split(", ").map((tag, j) => (
                      <span key={j} className="font-sans text-xs md:text-xs tracking-widest text-white/80 bg-white/5 border border-white/10 px-2 md:px-3 py-1 uppercase">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:gap-3 pt-4">
                  {activeProject.demoUrl && (
                    <a href={activeProject.demoUrl} target="_blank" rel="noreferrer" className="w-full text-center py-3 md:py-4 bg-white text-black hover:bg-white/80 transition-all font-sans text-sm md:text-sm uppercase tracking-widest font-bold">{l(uiTexts.live)}</a>
                  )}
                  {activeProject.link && (
                    <a href={activeProject.link} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 md:gap-3 py-3 md:py-4 border border-white/20 hover:bg-white/10 transition-all font-sans text-sm md:text-sm uppercase tracking-widest font-bold text-white">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                      {l(uiTexts.code)}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      {lightboxIndex !== null && activeProject?.images && (
        <div 
          className="fixed inset-0 z-300 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center animate-modal"
          onClick={() => setLightboxIndex(null)}
        >
          <button 
            className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 md:w-14 md:h-14 border border-white/30 bg-black/80 hover:bg-white hover:text-black flex items-center justify-center text-white transition-all z-20 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
            aria-label="Cerrar"
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="absolute top-8 left-1/2 -translate-x-1/2 font-sans text-xs tracking-widest uppercase text-white font-bold bg-black/80 border border-white/20 px-4 py-2">
            {lightboxIndex + 1} / {activeProject.images.length}
          </div>

          <div className="relative w-full h-full max-w-6xl p-4 md:p-12 flex items-center justify-center">
            <button 
              className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-black/70 hover:bg-white hover:text-black border border-white/20 flex items-center justify-center text-white transition-all z-10 cursor-pointer"
              onClick={handlePrevImage}
              aria-label="Anterior"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <img 
              src={activeProject.images[lightboxIndex]} 
              alt={`Vista ampliada ${lightboxIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain select-none shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            <button 
              className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-black/70 hover:bg-white hover:text-black border border-white/20 flex items-center justify-center text-white transition-all z-10 cursor-pointer"
              onClick={handleNextImage}
              aria-label="Siguiente"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
