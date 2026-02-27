import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

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
}

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const { t, language } = useLanguage();
  const l = (text: LocalizedText) =>
    text[language as keyof LocalizedText] || text.es;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<FeaturedProject | null>(
    null,
  );
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const uiTexts = {
    challenge: { es: "El Reto", en: "The Challenge", eu: "Erronka" },
    solution: { es: "La Solución", en: "The Solution", eu: "Soluzioa" },
    role: { es: "Rol", en: "Role", eu: "Rola" },
    year: { es: "Año", en: "Year", eu: "Urtea" },
    stack: {
      es: "Stack Tecnológico",
      en: "Tech Stack",
      eu: "Teknologia Stack-a",
    },
    live: {
      es: "Ver Proyecto en Vivo",
      en: "View Live Project",
      eu: "Ikusi Proiektua Zuzenean",
    },
    code: { es: "Código Fuente", en: "Source Code", eu: "Iturburu Kodea" },
    back: { es: "Volver", en: "Back", eu: "Itzuli" },
  };

  const projects: FeaturedProject[] = [
    {
      id: "zalbi",
      title: { es: "Zalbi Aisia", en: "Zalbi Aisia", eu: "Zalbi Aisia" },
      tech: "PHP 8, WordPress (_s), CPTs, ACF, Vanilla JS, CSS Grid",
      desc: {
        es: "Plataforma korporatiboa eta katalogo interaktiboa, eraikitzaile bisualik edo txantiloirik gabe.",
        en: "Corporate platform and interactive catalog without visual builders or templates.",
        eu: "Plataforma korporatiboa eta katalogo interaktiboa, eraikitzaile bisualik edo txantiloirik gabe.",
      },
      link: "https://github.com/Garridoparrayeray/zalbi-web-server",
      demoUrl: "https://dev-zalbi-aisia-eta-abentura.pantheonsite.io/",
      role: {
        es: "Full Stack (WP Custom Theme)",
        en: "Full Stack (WP Custom Theme)",
        eu: "Full Stack (WP Custom Theme)",
      },
      year: "2026",
      longDescChallenge: {
        es: "Bezeroak kudeaketa autonomoa behar zuen, eraikitzaile bisualik gabe. 1.5s-tik beherako karga denbora lortzea zen erronka nagusia.",
        en: "The client needed autonomous management without visual builders. Sub-1.5s load time was the main challenge.",
        eu: "Bezeroak kudeaketa autonomoa behar zuen, eraikitzaile bisualik gabe. 1.5s-tik beherako karga denbora lortzea zen erronka nagusia.",
      },
      longDescSolution: {
        es: "Hutsetik eraikitako gaia Underscores (_s) erabiliz. Iragazki sistema Vanilla JS-rekin egin nuen 'layout thrashing'-a saihesteko.",
        en: "Built from scratch using Underscores (_s). Filtering system developed with Vanilla JS to avoid layout thrashing.",
        eu: "Hutsetik eraikitako gaia Underscores (_s) erabiliz. Iragazki sistema Vanilla JS-rekin egin nuen 'layout thrashing'-a saihesteko.",
      },
      imageUrl: "/img/projects/zalbi_captura.webp",
    },
    {
      id: "portfolio-arquitectura",
      title: {
        es: "yeraygarrido.dev",
        en: "yeraygarrido.dev",
        eu: "yeraygarrido.dev",
      },
      tech: "React 19, Vite, Tailwind CSS v4, GSAP, Lenis",
      desc: {
        es: "Errendimendu handiko frontend arkitektura (SPA), animazio konplexuekin eta 90+ Lighthouse-rekin.",
        en: "High-performance frontend architecture (SPA) featuring complex animations and 90+ Lighthouse score.",
        eu: "Errendimendu handiko frontend arkitektura (SPA), animazio konplexuekin eta 90+ Lighthouse-rekin.",
      },
      link: "https://github.com/Garridoparrayeray/yeraygarrido.com.git",
      demoUrl: "https://yeraygarrido.dev",
      role: {
        es: "Frontend Engineer / WPO",
        en: "Frontend Engineer / WPO",
        eu: "Frontend Ingeniaria / WPO",
      },
      year: "2026",
      longDescChallenge: {
        es: "Animazio konplexuak eta abiadura uztartzea. Erronka Layout Thrashing-a ezabatzea eta hari nagusia (main thread) ez kargatzea izan da.",
        en: "Combining complex animations with speed. The challenge was eliminating Layout Thrashing and not overloading the main thread.",
        eu: "Animazio konplexuak eta abiadura uztartzea. Erronka Layout Thrashing-a ezabatzea eta hari nagusia (main thread) ez kargatzea izan da.",
      },
      longDescSolution: {
        es: "React 19 eta Vite. I18n sistema propioa Context bidez. Animazioak GSAP eta Lenis-ekin, IntersectionObserver erabiliz performancea hobetzeko.",
        en: "React 19 and Vite. Custom i18n via Context. Animations with GSAP and Lenis, using IntersectionObserver to boost performance.",
        eu: "React 19 eta Vite. I18n sistema propioa Context bidez. Animazioak GSAP eta Lenis-ekin, IntersectionObserver erabiliz performancea hobetzeko.",
      },
      imageUrl: "/img/projects/portfolio_captura.webp",
    },
    {
      id: "glocalium",
      title: {
        es: "Glocalium Services",
        en: "Glocalium Services",
        eu: "Glocalium Services",
      },
      tech: "WordPress, PHP 8, MySQL, Google Sheets API, SEO Técnico",
      desc: {
        es: "Web korporatiboa bi PHP plugin propiorekin: datu-basearen iraunkortasuna eta Google Sheets-era esportazio automatikoa.",
        en: "Corporate website with two custom PHP plugins: database persistence and automatic export to Google Sheets.",
        eu: "Web korporatiboa bi PHP plugin propiorekin: datu-basearen iraunkortasuna eta Google Sheets-era esportazio automatikoa.",
      },
      link: "https://github.com/Garridoparrayeray/wp_custom_scripts",
      demoUrl: "https://glocalium.com/",
      role: {
        es: "Full Stack WordPress Developer",
        en: "Full Stack WordPress Developer",
        eu: "Full Stack WordPress Garatzailea",
      },
      year: "2025",
      longDescChallenge: {
        es: "El cliente necesitaba reemplazar su web antigua por una plataforma profesional y requería automatizar la gestión de leads a una hoja de cálculo externa sin usar herramientas de pago.",
        en: "The client needed to replace their old site with a professional platform and required lead management automation to an external spreadsheet without using paid tools.",
        eu: "Bezeroak web zaharra ordezkatu behar zuen plataforma profesional batekin eta lead-en kudeaketa automatizatzea behar zuen kanpoko kalkulu-orri batera, ordainpeko tresnarik erabili gabe.",
      },
      longDescSolution: {
        es: "Programé dos plugins desde cero: uno para persistencia MySQL de Contact Form 7 y otro para exportación vía CRON job a Google Sheets mediante AppScript (webhook).",
        en: "I programmed two plugins from scratch: one for MySQL persistence of Contact Form 7 and another for CRON job export to Google Sheets via AppScript (webhook).",
        eu: "Bi plugin programatu nituen hutsetik: bata Contact Form 7-ren MySQL iraunkortasunerako eta bestea CRON job bidezko Google Sheets-era esportaziorako AppScript (webhook) bidez.",
      },
      imageUrl: "/img/projects/glocalium_captura.webp",
    },
  ];

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const index = Math.round(scrollLeft / clientWidth);
    setActiveIndex(index);
  };

  const fetchRepos = async () => {
    setIsModalOpen(true);
    setLoading(true);
    setError("");
    try {
      // Cargamos TODO: Incluyendo Forks y sin filtros restrictivos
      const response = await fetch(
        "https://api.github.com/users/Garridoparrayeray/repos?sort=updated&per_page=100&type=all",
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setRepos(data); // Mostramos la lista completa tal cual viene de GitHub
    } catch {
      setError(t("github.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="min-h-svh bg-black text-white flex flex-col relative z-10 border-t border-white/10 pb-12 md:pb-24 overflow-hidden"
      >
        <div className="pt-16 md:pt-24 px-8 md:px-24 shrink-0 flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
          <h2 className="font-wide text-3xl md:text-5xl font-bold uppercase text-white text-center md:text-left">
            {t("projects.title")}
          </h2>
          <div className="hidden md:block">
            <button
              onClick={fetchRepos}
              className="font-sans text-xs tracking-widest uppercase border border-white/30 px-6 py-3 hover:bg-white hover:text-black transition-colors duration-300 rounded-full"
            >
              {t("projects.viewAll")}
            </button>
          </div>
        </div>

        <div className="relative flex-1 flex flex-col justify-center mt-4 md:mt-12">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex items-stretch overflow-x-auto snap-x snap-mandatory hide-scrollbar py-8 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex gap-8 md:gap-16 w-max items-stretch px-8 md:px-24">
              {projects.map((p, i) => (
                <div
                  key={p.id}
                  ref={(el) => {
                    cardsRef.current[i] = el as HTMLDivElement;
                  }}
                  onClick={() => setActiveProject(p)}
                  className="w-[82vw] md:w-[45vw] max-w-[600px] shrink-0 flex flex-col group snap-start cursor-pointer h-full"
                >
                  <div className="aspect-[16/9] bg-[#050505] mb-6 overflow-hidden relative border border-white/10 group-hover:border-white/40 transition-colors duration-500 rounded-lg">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={l(p.title)}
                        loading="lazy"
                        className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
                        <span className="font-display text-[15vw] md:text-[8vw] text-white/[0.04] uppercase">
                          0{i + 1}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-10 h-10 border border-white/20 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 text-center md:text-left flex-1">
                    <div>
                      <h3 className="font-wide text-xl md:text-3xl mb-3 uppercase font-bold text-white group-hover:text-white/80 transition-colors">
                        {l(p.title)}
                      </h3>
                      <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        {p.tech.split(", ").map((tag, j) => (
                          <span
                            key={j}
                            className="font-sans text-[9px] md:text-[10px] tracking-widest text-white bg-white/10 border border-white/10 px-2 py-1 uppercase font-bold rounded-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="font-sans text-white/50 leading-relaxed text-sm line-clamp-3 flex-1">
                      {l(p.desc)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Tarjeta View All - Tamaño idéntico a las de proyecto */}
              <div
                onClick={fetchRepos}
                className="w-[82vw] md:w-[45vw] max-w-[600px] shrink-0 flex flex-col group snap-start cursor-pointer h-full"
              >
                <div className="aspect-[16/9] border border-white/10 rounded-lg mb-6 flex items-center justify-center group-hover:border-white/40 group-hover:bg-white/5 transition-all duration-500">
                  <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col gap-4 text-center md:text-left">
                  <h3 className="font-wide text-xl md:text-3xl uppercase font-bold text-white/50 group-hover:text-white transition-colors">
                    {t("projects.viewAll")}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center gap-3 mt-4 md:hidden">
            {[...projects, { id: "all" }].map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${activeIndex === i ? "bg-white w-8 shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "bg-white/20 w-1.5"}`}
              />
            ))}
          </div>
        </div>

        <div className="md:hidden px-8 mt-12">
          <button
            onClick={fetchRepos}
            className="font-sans text-xs tracking-widest uppercase border border-white/30 px-6 py-4 hover:bg-white hover:text-black transition-colors w-full text-center rounded-full"
          >
            {t("projects.viewAll")}
          </button>
        </div>
      </section>

      {/* MODALES Y ESTILOS (Mantenidos igual que en tu versión funcional) */}
      <style>{`
        @keyframes modalEnter { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-modal { animation: modalEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .modal-scroll::-webkit-scrollbar { width: 4px; }
        .modal-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>

      {/* DETALLE PROYECTO */}
      {activeProject && (
        <div className="fixed inset-0 z-[200] bg-black animate-modal flex flex-col">
          <div className="sticky top-0 w-full px-6 py-4 md:px-12 md:py-6 flex justify-between items-center bg-black/80 backdrop-blur-xl z-20 border-b border-white/10 shrink-0">
            <button
              onClick={() => setActiveProject(null)}
              className="flex items-center gap-2 font-sans text-[10px] md:text-xs tracking-widest uppercase text-white/70 hover:text-white transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              {l(uiTexts.back)}
            </button>
            <span className="font-wide text-[9px] md:text-xs uppercase text-white/40 tracking-widest truncate max-w-[40vw] text-right">
              {l(activeProject.title)}
            </span>
          </div>
          <div
            className="flex-1 overflow-y-auto w-full pb-24 modal-scroll overscroll-contain"
            data-lenis-prevent="true"
          >
            <div className="w-full h-[30vh] md:h-[55vh] bg-[#050505] border-b border-white/10 flex items-center justify-center relative overflow-hidden">
              {activeProject.imageUrl ? (
                <>
                  <img
                    src={activeProject.imageUrl}
                    alt={l(activeProject.title)}
                    className="w-full h-full object-cover opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                </>
              ) : (
                <div className="font-display text-4xl md:text-8xl uppercase text-white/5">
                  {l(activeProject.title)}
                </div>
              )}
            </div>
            <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 md:pt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 pb-16">
              <div className="lg:col-span-8 flex flex-col gap-10 md:gap-16">
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="font-wide text-2xl md:text-5xl uppercase text-white leading-tight break-words">
                      {l(activeProject.title)}
                    </h1>
                    <span className="font-sans text-[10px] tracking-widest uppercase text-white/30 bg-white/5 border border-white/10 px-3 py-1.5 rounded-sm shrink-0">
                      {activeProject.year}
                    </span>
                  </div>
                  <p className="font-sans text-base md:text-xl text-white/70 leading-relaxed font-light">
                    {l(activeProject.desc)}
                  </p>
                </div>
                <div className="h-px w-full bg-white/10"></div>
                <div className="space-y-5">
                  <h3 className="font-sans text-[10px] md:text-xs tracking-widest uppercase text-white/40 font-bold">
                    {l(uiTexts.challenge)}
                  </h3>
                  <p className="font-sans text-white/80 leading-relaxed text-sm md:text-lg font-light whitespace-pre-line">
                    {l(activeProject.longDescChallenge)}
                  </p>
                </div>
                <div className="space-y-5">
                  <h3 className="font-sans text-[10px] md:text-xs tracking-widest uppercase text-white/40 font-bold">
                    {l(uiTexts.solution)}
                  </h3>
                  <p className="font-sans text-white/80 leading-relaxed text-sm md:text-lg font-light whitespace-pre-line">
                    {l(activeProject.longDescSolution)}
                  </p>
                </div>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-10 lg:pl-12 lg:border-l border-white/10 pt-10 border-t lg:pt-0 lg:border-t-0">
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-8">
                  <div className="space-y-2">
                    <h4 className="font-sans text-[9px] tracking-widest uppercase text-white/30">
                      {l(uiTexts.role)}
                    </h4>
                    <span className="font-sans text-xs md:text-sm text-white font-medium block">
                      {l(activeProject.role)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-sans text-[9px] tracking-widest uppercase text-white/30">
                      {l(uiTexts.year)}
                    </h4>
                    <span className="font-sans text-xs md:text-sm text-white font-medium block">
                      {activeProject.year}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-sans text-[9px] tracking-widest uppercase text-white/30">
                    {l(uiTexts.stack)}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.tech.split(", ").map((tag, j) => (
                      <span
                        key={j}
                        className="font-sans text-[10px] tracking-widest text-white/70 bg-white/5 border border-white/10 px-3 py-1.5 uppercase rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3 pt-4">
                  {activeProject.demoUrl && (
                    <a
                      href={activeProject.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full text-center py-4 bg-white text-black hover:bg-white/80 transition-all font-sans text-[10px] uppercase tracking-widest font-bold rounded-sm"
                    >
                      {l(uiTexts.live)}
                    </a>
                  )}
                  {activeProject.link && (
                    <a
                      href={activeProject.link}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-3 py-4 border border-white/20 hover:bg-white/10 transition-all font-sans text-[10px] uppercase tracking-widest font-bold text-white rounded-sm"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                      {l(uiTexts.code)}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL GITHUB - Muestra TODO (Forks incluidos no me salen todos) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 bg-black/95 backdrop-blur-md flex flex-col animate-modal">
          <div className="flex justify-between items-center p-6 md:p-12 border-b border-white/10 shrink-0">
            <h2 className="font-wide text-xl md:text-4xl text-white uppercase">
              {t("github.allWorks")}
            </h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div
            className="flex-1 overflow-y-auto p-6 md:p-12 modal-scroll overscroll-contain"
            data-lenis-prevent="true"
          >
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-400 font-sans">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto pb-12">
                {repos.map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#050505] border border-white/10 p-6 hover:border-white/40 hover:bg-white/5 transition-all duration-300 group flex flex-col h-full rounded-sm"
                  >
                    <h3 className="font-wide text-lg text-white mb-2 group-hover:text-white/90 truncate">
                      {repo.name}{" "}
                      {repo.fork && (
                        <span className="text-[9px] text-white/30 border border-white/10 px-1.5 py-0.5 rounded ml-2">
                          FORK
                        </span>
                      )}
                    </h3>
                    <p className="font-sans text-xs text-white/50 mb-6 flex-1 line-clamp-3">
                      {repo.description || t("github.noDesc")}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                      <div className="flex gap-3 text-[10px] font-sans text-white/40 items-center">
                        {repo.language && (
                          <span className="bg-white/10 text-white/80 px-2.5 py-1 rounded-sm border border-white/5 font-bold uppercase">
                            {repo.language}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                          {repo.stargazers_count}
                        </span>
                      </div>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white/30 group-hover:text-white transition-all"
                      >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
