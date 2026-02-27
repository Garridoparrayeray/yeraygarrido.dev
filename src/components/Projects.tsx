import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

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

// NUEVO: Tipo para obligarnos a poner los 3 idiomas siempre
interface LocalizedText {
  es: string;
  en: string;
  eu: string;
}

interface FeaturedProject {
  id: string;
  title: LocalizedText;
  tech: string; // Las tecnologías suelen ser universales (React, PHP...), lo dejamos como string
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
  
  // Extraemos también "language" del contexto para saber en qué idioma estamos
  const { t, language } = useLanguage();
  
  // FUNCIÓN MÁGICA: Extrae el texto correcto según el idioma actual
  const l = (text: LocalizedText) => text[(language as keyof LocalizedText)] || text.es;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<FeaturedProject | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // TEXTOS ESTÁTICOS DE LA INTERFAZ TRADUCIDOS
  const uiTexts = {
    challenge: { es: 'El Reto', en: 'The Challenge', eu: 'Erronka' },
    solution: { es: 'La Solución', en: 'The Solution', eu: 'Soluzioa' },
    role: { es: 'Rol', en: 'Role', eu: 'Rola' },
    year: { es: 'Año', en: 'Year', eu: 'Urtea' },
    stack: { es: 'Stack Tecnológico', en: 'Tech Stack', eu: 'Teknologia Stack-a' },
    live: { es: 'Ver Proyecto en Vivo', en: 'View Live Project', eu: 'Ikusi Proiektua Zuzenean' },
    code: { es: 'Código Fuente', en: 'Source Code', eu: 'Iturburu Kodea' },
    back: { es: 'Volver', en: 'Back', eu: 'Itzuli' },
  };

const projects: FeaturedProject[] = [
    {
      id: "zalbi",
      title: { 
        es: "Zalbi Aisia", 
        en: "Zalbi Aisia", 
        eu: "Zalbi Aisia" 
      },
      tech: "PHP 8, WordPress (_s), CPTs, ACF, Vanilla JS, CSS Grid",
      desc: {
        es: "Desarrollo a medida de plataforma corporativa y catálogo interactivo sin constructores visuales.",
        en: "Custom-built corporate platform and interactive catalog without visual builders.",
        eu: "Neurrira garatutako plataforma korporatiboa eta katalogo interaktiboa, eraikitzaile bisualik gabe."
      },
      link: "https://github.com/Garridoparrayeray/zalbi-web-server",
      demoUrl: "https://dev-zalbi-aisia-eta-abentura.pantheonsite.io/", // En cuanto tengas el link de producción, lo pegas aquí
      role: {
        es: "Desarrollo Full Stack (WP Custom Theme)",
        en: "Full Stack Development (WP Custom Theme)",
        eu: "Full Stack Garapena (WP Custom Theme)"
      },
      year: "2026",
      longDescChallenge: {
        es: "El requisito principal era desarrollar una plataforma corporativa y catálogo interactivo que el cliente pudiera gestionar de forma autónoma, sin constructores visuales, plantillas comerciales ni dependencias de terceros. Se exigía una web 100% responsiva, multiidioma (Euskera/Castellano con Polylang) y una optimización extrema de Core Web Vitals con tiempos de carga inferiores a 1.5s. Todo planificado para entregarse en 40 horas a lo largo de 12 jornadas.",
        en: "The main requirement was to develop a corporate platform and interactive catalog manageable autonomously by the client, strictly avoiding visual builders, commercial templates, and third-party dependencies. It required a 100% responsive, multi-language site (Basque/Spanish via Polylang) and extreme Core Web Vitals optimization with sub-1.5s load times. The entire project was planned for delivery within a 40-hour timeframe across 12 days.",
        eu: "Baldintza nagusia bezeroak modu autonomoan kudeatu zezakeen plataforma korporatibo eta katalogo interaktibo bat garatzea zen, eraikitzaile bisual, txantiloi komertzial eta hirugarrenen mendekotasunik gabe. %100 webgune moldagarria, eleanitza (Euskara/Gaztelania Polylang bidez) eta Core Web Vitals-en muturreko optimizazioa (1.5s baino gutxiagoko kargarekin) eskatzen zen. Dena 40 orduko epean (12 egun) entregatzeko planifikatu zen."
      },
      longDescSolution: {
        es: "Construí el tema desde cero sobre Underscores (_s). La arquitectura de datos usa Custom Post Types y taxonomías registradas en functions.php. El catálogo incorpora un filtro en Vanilla JS (sin jQuery ni recargas), usando transiciones CSS sobre opacidad para evitar el 'layout thrashing'. Implementé CSS Grid para uniformidad de tarjetas y paletas de colores dinámicas en PHP. Los datos se gestionan vía ACF con una capa de traducción propia, y la configuración global se expuso a través de la WordPress Customizer API.",
        en: "I built the theme from scratch using Underscores (_s). The data architecture uses Custom Post Types and taxonomies registered in functions.php. The catalog features a Vanilla JS filter (no jQuery or page reloads), using CSS opacity transitions to avoid layout thrashing. I implemented CSS Grid for card uniformity and dynamic PHP color palettes. Data is managed via ACF with a custom translation layer, and global settings were exposed through the WordPress Customizer API.",
        eu: "Gaia hutsetik eraiki nuen Underscores (_s) erabiliz. Datuen arkitekturak Custom Post Types eta taxonomiak erabiltzen ditu, functions.php-n erregistratuta. Katalogoak Vanilla JS iragazki bat du (jQuery eta kargarik gabe), CSS opakutasun-trantsizioak erabiliz 'layout thrashing'-a saihesteko. CSS Grid eta PHP bidezko kolore-paleta dinamikoak inplementatu nituen. Datuak ACF bidez kudeatzen dira itzulpen-geruza propio batekin, eta ezarpen globalak WordPress Customizer API bidez integratu ziren."
      },
      imageUrl: "/img/projects/zalbi_captura.webp"
    },
    {
      id: "portfolio-arquitectura",
      title: { 
        es: "yeraygarrido.dev", 
        en: "yeraygarrido.dev", 
        eu: "yeraygarrido.dev" 
      },
      tech: "React 19, Vite, Tailwind CSS v4, GSAP, Lenis",
      desc: {
        es: "Arquitectura frontend de alto rendimiento (SPA) con animaciones complejas y 100/100 en Core Web Vitals.",
        en: "High-performance frontend architecture (SPA) featuring complex animations and 100/100 Core Web Vitals.",
        eu: "Errendimendu handiko frontend arkitektura (SPA), animazio konplexuekin eta 100/100 Core Web Vitals-ekin."
      },
      link: "https://github.com/Garridoparrayeray/yeraygarrido.com.git",
      demoUrl: "https://yeraygarrido.dev", 
      role: {
        es: "Frontend Engineer / WPO",
        en: "Frontend Engineer / WPO",
        eu: "Frontend Ingeniaria / WPO"
      },
      year: "2026",
      longDescChallenge: {
        es: "El objetivo era crear un portfolio visualmente impactante, con animaciones complejas, sin sacrificar el rendimiento web (WPO). Usar frameworks pesados como Next.js era excesivo para este caso de uso, y las librerías de animación tradicionales suelen disparar el layout thrashing y arruinar los Core Web Vitals en móviles.",
        en: "The goal was to create a visually striking portfolio with complex animations without sacrificing web performance (WPO). Using heavy frameworks like Next.js was overkill for this use case, and traditional animation libraries often trigger layout thrashing and ruin Core Web Vitals on mobile devices.",
        eu: "Helburua portfolio ikusgarri bat sortzea zen, animazio konplexuekin, baina web-errendimendua (WPO) kaltetu gabe. Next.js bezalako framework astunak erabiltzea gehiegizkoa zen kasu honetan, eta animazio-liburutegi tradizionalek Core Web Vitals-ak hondatu ohi dituzte gailu mugikorretan."
      },
      longDescSolution: {
        es: "Diseñé una arquitectura a medida (SPA) con React 19 y Vite, priorizando una ruta de renderizado crítico sin bloqueos y carga diferida (lazy loading). Implementé un sistema i18n propio mediante Context y desarrollé las animaciones estrictamente con GSAP y Lenis, logrando puntuaciones perfectas de 100/100 en Lighthouse.",
        en: "I designed a custom architecture (SPA) with React 19 and Vite, prioritizing a zero-blocking critical rendering path and lazy loading. I implemented a custom i18n system via Context and built the animations strictly using GSAP and Lenis, achieving perfect 100/100 Lighthouse scores on both Mobile and Desktop.",
        eu: "Neurrira egindako arkitektura (SPA) diseinatu nuen React 19 eta Vite erabiliz, blokeorik gabeko renderizatze-bide kritiko bat eta karga geroratua (lazy loading) lehenetsiz. Nire i18n sistema propioa inplementatu nuen Context bidez eta animazioak GSAP eta Lenis erabiliz soilik garatu nituen, Lighthouse-n 100/100 puntuazio perfektuak lortuz."
      },
      imageUrl: "/img/projects/portfolio_captura.webp" // Puedes hacer una captura de pantalla de tu web y ponerla aquí
    },
  ];

  const fetchRepos = async () => {
    setIsModalOpen(true);
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://api.github.com/users/Garridoparrayeray/repos?sort=updated&per_page=100');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      const excludedRepos = ['manfred', 'garridoparrayeray'];
      setRepos(data.filter((repo: Repo) => !excludedRepos.includes(repo.name.toLowerCase())));
    } catch (err) {
      setError(t('github.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section ref={sectionRef} className="min-h-[100svh] bg-black text-white flex flex-col relative z-10 border-t border-white/10 pb-24">
        <div className="pt-16 md:pt-24 px-8 md:px-24 shrink-0 flex justify-between items-end">
          <h2 className="font-wide text-3xl md:text-5xl font-bold uppercase text-white">{t('projects.title')}</h2>
          <div className="hidden md:block">
            <button 
              onClick={fetchRepos}
              className="font-sans text-xs tracking-widest uppercase border border-white/30 px-6 py-3 hover:bg-white hover:text-black transition-colors duration-300"
            >
              {t('projects.viewAll')}
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollRef} 
          className="flex-1 flex items-center mt-12 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-12 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex gap-8 md:gap-16 px-8 md:px-24 w-max items-center py-8">
            {projects.map((p, i) => (
              <div 
                key={p.id} 
                ref={el => { cardsRef.current[i] = el as HTMLDivElement; }} 
                onClick={() => setActiveProject(p)}
                className="w-[85vw] md:w-[45vw] max-w-[600px] shrink-0 flex flex-col group snap-center cursor-pointer"
              >
                <div className="aspect-[16/9] bg-[#050505] mb-6 overflow-hidden relative border border-white/10 group-hover:border-white/40 transition-colors duration-500 rounded-sm">
                  {p.imageUrl ? (
                    <img 
                      src={p.imageUrl} 
                      alt={l(p.title)} 
                      loading="lazy"
                      className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center font-display text-[20vw] md:text-[12vw] text-white/5 group-hover:text-white/10 transition-colors duration-700 -left-6 w-[calc(100%+50px)]">
                      0{i + 1}
                    </div>
                  )}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-10 h-10 border border-white/20 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="font-wide text-2xl md:text-3xl mb-3 uppercase font-bold text-white group-hover:text-white/80 transition-colors flex items-center gap-3">
                      {l(p.title)}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {p.tech.split(', ').map((t, j) => (
                        <span key={j} className="font-sans text-[10px] tracking-widest text-white bg-white/10 border border-white/10 px-2 py-1 uppercase font-bold rounded-sm">{t}</span>
                      ))}
                    </div>
                  </div>
                  <p className="font-sans text-white/50 leading-relaxed text-sm group-hover:text-white/70 transition-colors">{l(p.desc)}</p>
                </div>
              </div>
            ))}
            
            <div 
              onClick={fetchRepos}
              className="w-[85vw] md:w-[30vw] max-w-[400px] shrink-0 flex flex-col items-center justify-center snap-center h-full min-h-[400px] border border-white/10 rounded-sm hover:border-white/40 hover:bg-white/5 transition-colors cursor-pointer group bg-[#050505]"
            >
              <h3 className="font-wide text-2xl md:text-3xl uppercase font-bold group-hover:text-white text-white/50 transition-colors mb-6 text-center">
                {t('projects.viewAll').split(' ').map((word, idx) => (
                  <span key={idx}>{word}<br/></span>
                ))}
              </h3>
              <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden px-8 mt-4 flex justify-center">
          <button 
            onClick={fetchRepos}
            className="font-sans text-xs tracking-widest uppercase border border-white/30 px-6 py-4 hover:bg-white hover:text-black transition-colors duration-300 w-full text-center"
          >
            {t('projects.viewAll')}
          </button>
        </div>
      </section>

      <style>{`
        @keyframes modalEnter {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-modal {
          animation: modalEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .modal-scroll::-webkit-scrollbar { width: 12px; }
        .modal-scroll::-webkit-scrollbar-track { background: #050505; border-left: 1px solid rgba(255,255,255,0.05); }
        .modal-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; border: 3px solid #050505; }
        .modal-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
      `}</style>

      {/* PÁGINA DEL PROYECTO INDIVIDUAL */}
      {activeProject && (
        <div className="fixed inset-0 z-[200] bg-black animate-modal flex flex-col">
          <div className="sticky top-0 w-full px-6 py-6 md:px-12 flex justify-between items-center bg-black/80 backdrop-blur-xl z-10 border-b border-white/10 shrink-0">
            <button 
              onClick={() => setActiveProject(null)}
              className="flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-white/70 hover:text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              {l(uiTexts.back)}
            </button>
            <span className="font-wide text-xs uppercase text-white/40 tracking-widest truncate max-w-[50vw] text-right">{l(activeProject.title)}</span>
          </div>

          <div className="flex-1 overflow-y-auto w-full pb-24 modal-scroll overscroll-contain" data-lenis-prevent="true">
            <div className="w-full h-[40vh] md:h-[60vh] bg-[#050505] border-b border-white/10 flex items-center justify-center relative overflow-hidden group">
              {activeProject.imageUrl ? (
                <>
                  <img src={activeProject.imageUrl} alt={l(activeProject.title)} className="w-full h-full object-cover opacity-40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]"></div>
                  <span className="font-display text-4xl md:text-8xl uppercase text-white/5 select-none">{l(activeProject.title)}</span>
                </>
              )}
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-8 flex flex-col gap-12">
                <div>
                  <h1 className="font-wide text-4xl md:text-6xl uppercase text-white mb-6 leading-tight">
                    {l(activeProject.title)}
                  </h1>
                  <p className="font-sans text-xl text-white/70 leading-relaxed font-light">
                    {l(activeProject.desc)}
                  </p>
                </div>
                <div className="h-px w-full bg-white/10"></div>
                <div className="flex flex-col gap-6">
                  <h3 className="font-sans text-xs tracking-widest uppercase text-white/50 font-bold">{l(uiTexts.challenge)}</h3>
                  <p className="font-sans text-white/80 leading-relaxed text-base md:text-lg font-light whitespace-pre-line">
                    {l(activeProject.longDescChallenge)}
                  </p>
                </div>
                <div className="flex flex-col gap-6">
                  <h3 className="font-sans text-xs tracking-widest uppercase text-white/50 font-bold">{l(uiTexts.solution)}</h3>
                  <p className="font-sans text-white/80 leading-relaxed text-base md:text-lg font-light whitespace-pre-line">
                    {l(activeProject.longDescSolution)}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-12 lg:pl-12 lg:border-l border-white/10">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-sans text-[10px] tracking-widest uppercase text-white/40 mb-2">{l(uiTexts.role)}</h4>
                    <span className="font-sans text-sm text-white">{l(activeProject.role)}</span>
                  </div>
                  <div>
                    <h4 className="font-sans text-[10px] tracking-widest uppercase text-white/40 mb-2">{l(uiTexts.year)}</h4>
                    <span className="font-sans text-sm text-white">{activeProject.year}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-sans text-[10px] tracking-widest uppercase text-white/40 mb-4">{l(uiTexts.stack)}</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.tech.split(', ').map((t, j) => (
                      <span key={j} className="font-sans text-xs tracking-widest text-white/70 bg-white/5 border border-white/10 px-3 py-1.5 uppercase rounded-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4 mt-4">
                  {activeProject.demoUrl && (
                    <a href={activeProject.demoUrl} target="_blank" rel="noreferrer" className="w-full text-center py-4 bg-white text-black hover:bg-white/80 transition-colors font-sans text-xs uppercase tracking-widest font-bold">
                      {l(uiTexts.live)}
                    </a>
                  )}
                  {activeProject.link && (
                    <a href={activeProject.link} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-3 py-4 border border-white/20 hover:bg-white/10 transition-colors font-sans text-xs uppercase tracking-widest font-bold text-white">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                      {l(uiTexts.code)}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE GITHUB (VER TODOS LOS REPOSITORIOS) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col animate-modal">
          <div className="flex justify-between items-center p-6 md:p-12 border-b border-white/10 shrink-0">
            <h2 className="font-wide text-2xl md:text-4xl text-white uppercase">{t('github.allWorks')}</h2>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 hover:rotate-90"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 md:p-12 modal-scroll overscroll-contain" data-lenis-prevent="true">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-400 font-sans">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto pb-12">
                {repos.map(repo => (
                  <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer" className="bg-[#050505] border border-white/10 p-6 hover:border-white/40 hover:bg-white/5 transition-all duration-300 group flex flex-col h-full rounded-sm">
                    <h3 className="font-wide text-xl text-white mb-2 group-hover:text-white/90 truncate transition-colors">{repo.name}</h3>
                    <p className="font-sans text-sm text-white/50 mb-6 flex-1 line-clamp-3 group-hover:text-white/70 transition-colors">{repo.description || t('github.noDesc')}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10 group-hover:border-white/20 transition-colors">
                      <div className="flex gap-3 text-xs font-sans text-white/40 items-center">
                        {repo.language && <span className="bg-white/10 text-white/80 px-2.5 py-1 rounded-sm border border-white/5 font-bold uppercase tracking-wider text-[10px]">{repo.language}</span>}
                        <span className="flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                          {repo.stargazers_count}
                        </span>
                      </div>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/30 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
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