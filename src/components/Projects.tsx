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
      id: "bizkaibus",
      title: { es: "BizkaiBus+", en: "BizkaiBus+", eu: "BizkaiBus+" },
      tech: "PHP 8, SQLite, Vanilla JS, GTFS, SIRI-VM/SIRI-SX, Vercel Serverless, GitHub Actions",
      desc: {
        es: "App no oficial de Bizkaibus con horarios y seguimiento en vivo, dos temas visuales sobre el mismo motor, y una ETA propia calculada cruzando la posición real del bus con el horario.",
        en: "Unofficial Bizkaibus app with timetables and live tracking, two visual themes on the same engine, and a custom ETA calculated by cross-referencing the bus's real position with the schedule.",
        eu: "Bizkaibus-en app ez-ofiziala, ordutegi eta jarraipen bizian, bi tema bisual motore beraren gainean, eta autobusaren posizio erreala ordutegiarekin gurutzatuz kalkulatutako ETA propioa.",
      },
      link: "https://github.com/Garridoparrayeray/bizkaibus-renewed",
      demoUrl: "https://bizkaibus-renewed.vercel.app",
      role: { es: "Full Stack (PHP + Vanilla JS)", en: "Full Stack (PHP + Vanilla JS)", eu: "Full Stack (PHP + Vanilla JS)" },
      year: "2026",
      longDescChallenge: {
        es: "Empezó como un favor: a mi mujer no le convencía la app oficial de Bizkaibus, poco intuitiva y lenta de usar. El reto real llegó al construir el seguimiento en vivo: el feed SIRI-VM del operador no da una cuenta atrás lista para usar, solo la posición confirmada del bus y un retraso genérico que no siempre coincide con la realidad. A mitad de proyecto descubrí además que la fuente de datos estática que usaba llevaba más de un año sin actualizarse, así que un desvío real de temporada de verano era invisible para la app.",
        en: "It started as a favor: my wife wasn't convinced by the official Bizkaibus app, unintuitive and slow to use. The real challenge came building live tracking: the operator's SIRI-VM feed doesn't give a ready-to-use countdown, only the bus's confirmed position and a generic delay figure that doesn't always match reality. Halfway through, I also found the static data source I was using hadn't been updated in over a year, so a real summer-season route detour was invisible to the app.",
        eu: "Mesede gisa hasi zen: nire emazteari ez zitzaion gustatzen Bizkaibus-en app ofiziala, ez intuitiboa eta erabiltzeko motela. Benetako erronka jarraipen bizia eraikitzean iritsi zen: operadorearen SIRI-VM feed-ak ez du kontagailu bat ematen zuzenean erabiltzeko, autobusaren posizio baieztatua eta atzerapen generiko bat baino ez, ez dena beti errealitatearekin bat. Proiektuaren erdian, gainera, erabiltzen nuen datu-iturri estatikoa urte batetik gora eguneratu gabe zegoela aurkitu nuen.",
      },
      longDescSolution: {
        es: "Backend PHP nativo separado por capas (Controllers/Models/Services) que precompila el horario oficial (GTFS) a un fichero SQLite en cada build — sin parseo en producción ni servidor de base de datos que mantener, ideal para serverless (Vercel). Para el seguimiento en vivo cruzo la posición confirmada del feed SIRI-VM con el horario parada a parada para calcular una ETA propia, en vez de fiarme de un único retraso plano para todo el trayecto. Migré la fuente estática de NeTEx (congelada) a GTFS (activamente mantenida) y automaticé la reconstrucción diaria vía GitHub Actions, con una comprobación que aborta el despliegue si el feed descargado indica que su propia temporada ya venció. Todo sobre dos temas visuales completos (uno personal, uno público) con el mismo HTML/JS, resueltos en el cliente antes del primer pintado.",
        en: "Native PHP backend split into layers (Controllers/Models/Services) that precompiles the official schedule (GTFS) into a SQLite file at build time — no parsing in production, no database server to maintain, ideal for serverless (Vercel). For live tracking I cross-reference the SIRI-VM feed's confirmed position with the stop-by-stop schedule to compute my own ETA instead of trusting a single flat delay for the whole trip. I migrated the static source from NeTEx (frozen) to GTFS (actively maintained) and automated a daily rebuild via GitHub Actions, with a check that aborts the deploy if the downloaded feed's own season has already expired. All running on two complete visual themes (one personal, one public) over the exact same HTML/JS, resolved client-side before first paint.",
        eu: "PHP backend natiboa, geruzatan banatuta (Controllers/Models/Services), ordutegi ofiziala (GTFS) SQLite fitxategi batean aurrekonpilatzen duena build bakoitzean — produkzioan parseorik gabe, mantendu beharreko datu-base zerbitzaririk gabe, serverless-erako aproposa (Vercel). Jarraipen bizirako, SIRI-VM feed-aren posizio baieztatua ordutegiarekin gurutzatzen dut geltoki-geltoki ETA propioa kalkulatzeko. NeTEx iturri estatikotik (izoztuta) GTFS-ra (aktiboki mantendua) migratu nuen, eta GitHub Actions bidez eguneroko berreraikitzea automatizatu nuen. Proiektu osoak bi tema bisual osatu ditu (pertsonala eta publikoa) HTML/JS berdinaren gainean.",
      },
      imageUrl: "/img/projects/bizkaibus_captura.png",
      images: ["/img/projects/bizkaibus_captura.png", "/img/projects/bizkaibus_mobile_view.png", "/img/projects/bizkaibus_miamor_theme.png"],
    }
  ];

  const allManualProjects = [...projects, ...(otherProjectsData as FeaturedProject[])];

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
        .modal-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>

      <section ref={sectionRef} className="min-h-svh bg-black text-white flex flex-col relative z-10 border-t border-white/10 pb-8 md:pb-24 overflow-hidden">
        <div className="pt-6 md:pt-24 px-6 md:px-24 shrink-0 flex flex-col md:flex-row justify-between items-center md:items-end gap-3 md:gap-6">
          <h2 className="font-wide text-3xl md:text-5xl font-bold uppercase text-white">{t("projects.title")}</h2>
          <button onClick={openProjectsModal} className="hidden md:block font-sans text-xs tracking-widest uppercase border border-white/30 px-6 py-3 hover:bg-white hover:text-black transition-colors rounded-full cursor-pointer">
            {t("projects.viewAll")}
          </button>
        </div>

        <div className="relative flex-1 flex flex-col justify-center mt-1 md:mt-12 px-6 md:px-24">
          <div ref={scrollRef} onScroll={handleScroll} className="flex items-stretch overflow-x-auto snap-x snap-mandatory hide-scrollbar py-6 md:py-8 scroll-smooth" style={{ scrollbarWidth: "none" }}>
            <div className="flex gap-6 md:gap-16 w-max items-stretch">
              {projects.map((p, i) => (
                <div key={p.id} data-project-card onClick={() => setActiveProject(p)} className="w-[82vw] md:w-[45vw] max-w-150 shrink-0 flex flex-col group snap-start cursor-pointer h-full">
                  <div className="aspect-video bg-[#050505] mb-4 md:mb-6 overflow-hidden relative border border-white/10 group-hover:border-white/40 transition-colors rounded-lg">
                    {p.imageUrl && <img src={p.imageUrl} alt={l(p.title)} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />}
                    <div className="absolute top-3 md:top-4 right-3 md:right-4 opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 border border-white/20 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </div>
                    <span className="absolute bottom-3 md:bottom-4 left-3 md:left-4 font-sans text-[10px] md:text-[10px] tracking-widest uppercase text-white/70 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">{p.year}</span>
                  </div>
                  <h3 className="font-wide text-xl md:text-3xl mb-2 md:mb-3 uppercase font-bold">{l(p.title)}</h3>
                  <p className="font-sans text-sm md:text-sm text-white/50 line-clamp-3 leading-relaxed">{l(p.desc)}</p>
                </div>
              ))}
              <div data-project-card onClick={openProjectsModal} className="w-[82vw] md:w-[45vw] max-w-150 shrink-0 flex flex-col group snap-start cursor-pointer h-full">
                <div className="aspect-video border border-white/10 rounded-lg mb-4 md:mb-6 flex items-center justify-center group-hover:border-white/40 group-hover:bg-white/5 transition-all">
                  <div className="w-14 md:w-16 h-14 md:h-16 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
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
                className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === i ? 'w-6 bg-white' : 'w-1 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={i < projects.length ? `Ir al proyecto ${i + 1}` : l(uiTexts.viewAll)}
              />
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
            <button onClick={() => setIsModalOpen(false)} className="cursor-pointer w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div ref={modalScrollRef} className="flex-1 overflow-y-auto modal-scroll overscroll-contain" data-lenis-prevent="true" onClick={(e) => e.stopPropagation()}>
            {modalTab === 'portfolio' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 md:p-12 max-w-7xl mx-auto overflow-hidden">
                {allManualProjects.map((p) => (
                  <div key={p.id} onClick={() => setActiveProject(p)} className="bg-[#050505] border border-white/10 hover:border-white/30 group flex flex-col cursor-pointer overflow-hidden transition-all rounded-lg">
                    <div className="aspect-[4/3] bg-black relative overflow-hidden">
                      {p.imageUrl || (p.images && p.images[0]) ? (
                        <img src={p.imageUrl || (p.images && p.images[0])} alt={l(p.title)} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-wide text-4xl text-white/5 uppercase">{p.title.es?.charAt(0) || 'P'}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="font-sans text-xs uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">Ver más</span>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6 flex flex-col flex-1">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-1">
                        <h3 className="font-wide text-base sm:text-lg text-white uppercase text-center sm:text-left w-full sm:w-auto">{l(p.title)}</h3>
                        <span className="font-sans text-xs text-white/30 shrink-0 w-full sm:w-auto text-center sm:text-right">{p.year}</span>
                      </div>
                      <p className="font-sans text-xs text-white/50 flex-1 line-clamp-3 leading-relaxed text-justify">{l(p.desc)}</p>
                      <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4 justify-center sm:justify-start">
                        {p.tech.split(", ").slice(0, 3).map((tag, j) => (
                          <span key={j} className="font-sans text-[8px] sm:text-[9px] tracking-widest uppercase text-white/60 bg-white/5 border border-white/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full truncate max-w-[80px] sm:max-w-none">{tag}</span>
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
                  <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer" className="bg-[#050505] border border-white/10 hover:border-white/30 p-5 transition-all rounded-lg flex flex-col group">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-wide text-base text-white truncate flex-1 group-hover:text-white/80 transition-colors">{repo.name}</h3>
                      {repo.language && (
                        <span className="shrink-0 font-sans text-[9px] tracking-widest uppercase text-white/40 bg-white/5 border border-white/10 px-2 py-1 rounded-full">
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
          <div className="sticky top-0 w-full px-6 py-5 md:px-12 md:py-6 flex justify-between items-center bg-black/90 backdrop-blur-xl z-20 border-b border-white/10 shrink-0" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setActiveProject(null)} className="cursor-pointer flex items-center gap-2 font-sans text-sm md:text-xs tracking-widest uppercase text-white/70 hover:text-white transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              {l(uiTexts.back)}
            </button>
            <span className="font-wide text-xs md:text-xs uppercase text-white/40 tracking-widest truncate max-w-[40vw] text-right">{l(activeProject.title)}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto modal-scroll" data-lenis-prevent="true" onClick={(e) => e.stopPropagation()}>
            <div className="w-full h-[30vh] md:h-[55vh] bg-[#050505] border-b border-white/10 flex items-center justify-center relative overflow-hidden">
              {(activeProject.imageUrl || (activeProject.images && activeProject.images[0])) && (
                <>
                  <img src={activeProject.imageUrl || (activeProject.images && activeProject.images[0])} alt={l(activeProject.title)} className="w-full h-full object-cover opacity-40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                </>
              )}
              {!activeProject.imageUrl && !(activeProject.images && activeProject.images[0]) && <div className="font-display text-4xl md:text-8xl uppercase text-white/5">{l(activeProject.title)}</div>}
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-6 sm:pt-10 md:pt-20 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 md:gap-16 pb-16">
              <div className="lg:col-span-8 flex flex-col gap-8 md:gap-16">
                <div className="space-y-4 md:space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-3">
                    <h1 className="font-wide text-5xl sm:text-5xl md:text-5xl uppercase text-white leading-tight break-words">{l(activeProject.title)}</h1>
                    <span className="font-sans text-xs md:text-sm tracking-widest uppercase text-white/30 bg-white/5 border border-white/10 px-3 py-1.5 rounded-sm shrink-0">{activeProject.year}</span>
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
                          className={`shrink-0 snap-start rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
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
                      <span key={j} className="font-sans text-xs md:text-xs tracking-widest text-white/80 bg-white/5 border border-white/10 px-2 md:px-3 py-1 uppercase rounded-sm">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:gap-3 pt-4">
                  {activeProject.demoUrl && (
                    <a href={activeProject.demoUrl} target="_blank" rel="noreferrer" className="w-full text-center py-3 md:py-4 bg-white text-black hover:bg-white/80 transition-all font-sans text-sm md:text-sm uppercase tracking-widest font-bold rounded-sm">{l(uiTexts.live)}</a>
                  )}
                  {activeProject.link && (
                    <a href={activeProject.link} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 md:gap-3 py-3 md:py-4 border border-white/20 hover:bg-white/10 transition-all font-sans text-sm md:text-sm uppercase tracking-widest font-bold text-white rounded-sm">
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
            className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="absolute top-8 left-1/2 -translate-x-1/2 font-sans text-xs tracking-widest uppercase text-white/50 bg-black/50 px-4 py-2 rounded-full">
            {lightboxIndex + 1} / {activeProject.images.length}
          </div>

          <div className="relative w-full h-full max-w-6xl p-4 md:p-12 flex items-center justify-center">
            <button 
              className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 rounded-full bg-black/50 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110 z-10 cursor-pointer"
              onClick={handlePrevImage}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <img 
              src={activeProject.images[lightboxIndex]} 
              alt={`Vista ampliada ${lightboxIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain select-none shadow-2xl rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            <button 
              className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 rounded-full bg-black/50 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110 z-10 cursor-pointer"
              onClick={handleNextImage}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
