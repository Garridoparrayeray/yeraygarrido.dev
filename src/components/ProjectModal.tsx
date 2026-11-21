import { useEffect, useState } from "react";
import {
  ALL_PROJECTS,
  SITE_IDENTITY,
  loc,
  type ProjectItem,
} from "../data/portfolioConfig";

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
}

interface Props {
  language: string;
  activeProject: ProjectItem | null;
  onCloseProject: () => void;
  onSelectProject: (p: ProjectItem) => void;
  isCatalogOpen: boolean;
  onCloseCatalog: () => void;
}

export default function ProjectModal({
  language,
  activeProject,
  onCloseProject,
  onSelectProject,
  isCatalogOpen,
  onCloseCatalog,
}: Props) {
  const [catalogTab, setCatalogTab] = useState<"portfolio" | "github">("portfolio");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const labels = {
    challenge: { es: "El Reto", en: "The Challenge", eu: "Erronka" },
    solution: {
      es: "Arquitectura & Solución",
      en: "Architecture & Solution",
      eu: "Arkitektura & Soluzioa",
    },
    role: { es: "Rol", en: "Role", eu: "Rola" },
    year: { es: "Año", en: "Year", eu: "Urtea" },
    stack: { es: "Tecnologías", en: "Tech Stack", eu: "Teknologiak" },
    gallery: { es: "Capturas", en: "Gallery", eu: "Galeria" },
    live: { es: "Ver Proyecto en Vivo", en: "Open Live Project", eu: "Ikusi Zuzenean" },
    paper: { es: "Ver en Zenodo (DOI)", en: "View on Zenodo (DOI)", eu: "Ikusi Zenodon (DOI)" },
    downloadPdf: { es: "Descargar PDF", en: "Download PDF", eu: "PDF Deskargatu" },
    code: { es: "Código Fuente", en: "Source Code", eu: "Iturburu Kodea" },
    back: { es: "Cerrar", en: "Close", eu: "Itxi" },
    allProjects: { es: "Archivo Completo", en: "Complete Archive", eu: "Artxibo Osoa" },
    githubTab: { es: "Repositorios GitHub", en: "GitHub Repositories", eu: "GitHub Biltegiak" },
    loading: {
      es: "Cargando repositorios...",
      en: "Loading repositories...",
      eu: "Biltegiak kargatzen...",
    },
  };

  useEffect(() => {
    setLightboxIdx(null);
  }, [activeProject]);

  useEffect(() => {
    const locked = Boolean(activeProject || isCatalogOpen || lightboxIdx !== null);
    if (locked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    window.dispatchEvent(new CustomEvent("lenis-lock", { detail: locked }));
    return () => {
      document.body.style.overflow = "";
      window.dispatchEvent(new CustomEvent("lenis-lock", { detail: false }));
    };
  }, [activeProject, isCatalogOpen, lightboxIdx]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxIdx !== null) setLightboxIdx(null);
        else if (activeProject) onCloseProject();
        else if (isCatalogOpen) onCloseCatalog();
      } else if (lightboxIdx !== null && activeProject?.images) {
        if (e.key === "ArrowLeft") {
          setLightboxIdx((p) => (p === 0 ? activeProject.images!.length - 1 : p! - 1));
        } else if (e.key === "ArrowRight") {
          setLightboxIdx((p) => (p === activeProject.images!.length - 1 ? 0 : p! + 1));
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx, activeProject, isCatalogOpen, onCloseProject, onCloseCatalog]);

  const loadRepos = async () => {
    setCatalogTab("github");
    if (repos.length > 0) return;
    setLoadingRepos(true);
    try {
      const res = await fetch(
        `https://api.github.com/users/${SITE_IDENTITY.githubUsername}/repos?sort=updated&per_page=100`
      );
      if (res.ok) setRepos(await res.json());
    } finally {
      setLoadingRepos(false);
    }
  };

  return (
    <>
      {/* COMPLETE ARCHIVE / GITHUB CATALOG MODAL */}
      {isCatalogOpen && !activeProject && (
        <div
          className="fixed inset-0 z-[120] bg-[#09090B] text-[#F6F4EF] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={loc(labels.allProjects, language)}
        >
          <div className="px-5 sm:px-8 md:px-12 py-4 sm:py-5 border-b border-white/12 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setCatalogTab("portfolio")}
                className={`font-mono text-xs sm:text-sm uppercase tracking-widest pb-1.5 min-h-[44px] border-b-2 transition-colors cursor-pointer ${
                  catalogTab === "portfolio"
                    ? "border-[#D6C7B2] text-[#F6F4EF] font-bold"
                    : "border-transparent text-[#F6F4EF]/65 hover:text-[#F6F4EF]"
                }`}
              >
                {loc(labels.allProjects, language)} ({ALL_PROJECTS.length})
              </button>
              <button
                type="button"
                onClick={loadRepos}
                className={`font-mono text-xs sm:text-sm uppercase tracking-widest pb-1.5 min-h-[44px] border-b-2 transition-colors cursor-pointer ${
                  catalogTab === "github"
                    ? "border-[#D6C7B2] text-[#F6F4EF] font-bold"
                    : "border-transparent text-[#F6F4EF]/65 hover:text-[#F6F4EF]"
                }`}
              >
                {loc(labels.githubTab, language)}
              </button>
            </div>
            <button
              type="button"
              onClick={onCloseCatalog}
              aria-label={loc(labels.back, language)}
              className="font-mono text-xs sm:text-sm uppercase tracking-widest px-4 min-h-[44px] border border-white/20 hover:bg-[#F6F4EF] hover:text-[#09090B] transition-colors cursor-pointer"
            >
              ESC ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 sm:p-8 md:p-12" data-lenis-prevent="true">
            {catalogTab === "portfolio" ? (
              <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {ALL_PROJECTS.map((p, idx) => {
                  const thumb = p.imageUrl || p.images?.[0] || "";
                  const isWhiteThumb = /(bideplus_og|bideplus_static)/i.test(thumb);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onSelectProject(p)}
                      className="text-left border border-white/12 bg-[#131317] overflow-hidden group transition-colors hover:border-[#D6C7B2]/50 cursor-pointer flex flex-col"
                    >
                      <div
                        className={`aspect-[16/10] overflow-hidden relative ${
                          isWhiteThumb ? "bg-white p-3" : "bg-[#0B0B0D]"
                        }`}
                      >
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={loc(p.title, language)}
                            loading="lazy"
                            className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
                              isWhiteThumb ? "object-contain" : "object-cover object-top"
                            }`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-mono text-3xl text-white/15">
                            {String(idx + 1).padStart(2, "0")}
                          </div>
                        )}
                        <span className="absolute top-3 left-3 font-mono text-xs tracking-widest bg-[#09090B]/88 text-[#F6F4EF] px-2.5 py-0.5 border border-white/15">
                          {p.year}
                        </span>
                      </div>
                      <div className="p-5 flex flex-col flex-1 gap-2.5">
                        <h3 className="font-grotesk text-lg font-semibold leading-snug text-[#F6F4EF]">
                          {loc(p.title, language)}
                        </h3>
                        <p className="font-sans text-sm leading-relaxed line-clamp-3 text-[#F6F4EF]/70">
                          {loc(p.desc, language)}
                        </p>
                        <div className="mt-auto pt-3 flex flex-wrap gap-1.5">
                          {p.tech
                            .split(", ")
                            .slice(0, 3)
                            .map((tag) => (
                              <span
                                key={tag}
                                className="font-mono text-xs px-2 py-0.5 border border-white/12 text-[#F6F4EF]/70"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loadingRepos ? (
                  <p className="col-span-full py-16 text-center font-mono text-sm text-[#F6F4EF]/65">
                    {loc(labels.loading, language)}
                  </p>
                ) : (
                  repos.map((r) => (
                    <a
                      key={r.id}
                      href={r.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-white/12 bg-[#131317] p-5 flex flex-col gap-3 hover:border-[#D6C7B2]/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-sm font-bold text-[#F6F4EF] truncate">
                          {r.name}
                        </span>
                        {r.language && (
                          <span className="font-mono text-xs px-2 py-0.5 border border-white/15 text-[#F6F4EF]/75 shrink-0">
                            {r.language}
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed line-clamp-2 flex-1 text-[#F6F4EF]/70">
                        {r.description || "—"}
                      </p>
                      <div className="flex items-center justify-between pt-2.5 border-t border-white/12 font-mono text-xs text-[#F6F4EF]/65">
                        <span>
                          ★ {r.stargazers_count} · ⑂ {r.forks_count}
                        </span>
                        <span className="text-[#D6C7B2]">GitHub ↗</span>
                      </div>
                    </a>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PROJECT CASE STUDY DETAIL MODAL */}
      {activeProject && (
        <div
          className="fixed inset-0 z-[150] bg-[#09090B] text-[#F6F4EF] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={loc(activeProject.title, language)}
        >
          <div className="px-5 sm:px-8 md:px-12 py-4 border-b border-white/12 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <span className="font-mono text-sm uppercase tracking-widest text-[#D6C7B2]">
                {activeProject.year}
              </span>
              <span className="text-[#F6F4EF]/45">/</span>
              <span className="font-grotesk text-base sm:text-lg font-semibold truncate">
                {loc(activeProject.title, language)}
              </span>
            </div>
            <button
              type="button"
              onClick={onCloseProject}
              className="font-mono text-xs sm:text-sm uppercase tracking-widest px-4 min-h-[44px] border border-white/20 hover:bg-[#F6F4EF] hover:text-[#09090B] transition-colors cursor-pointer shrink-0"
            >
              {loc(labels.back, language)} ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto" data-lenis-prevent="true">
            {(() => {
              const heroSrc = activeProject.images?.[0] || activeProject.imageUrl;
              if (!heroSrc) return null;
              const isWhiteBanner = /(bideplus_og|bideplus_static)/i.test(heroSrc);
              const isDarkBanner =
                /(gasolinera_loading|gasolinera_static|paper_eta_cover|pokemon_static|pokemon_pokeball_loading|logo-archive-yg|archive_loading)/i.test(
                  heroSrc
                );
              if (isWhiteBanner || isDarkBanner) {
                return (
                  <div
                    className={`w-full border-b border-white/12 relative ${
                      isWhiteBanner ? "bg-white" : "bg-[#111111]"
                    }`}
                  >
                    <div className="max-w-5xl mx-auto px-6 sm:px-10 md:px-12 py-6 sm:py-9 flex items-center justify-center">
                      <img
                        src={heroSrc}
                        alt={loc(activeProject.title, language)}
                        className="w-full max-h-[240px] sm:max-h-[340px] lg:max-h-[400px] object-contain"
                      />
                    </div>
                  </div>
                );
              }
              return (
                <div className="w-full h-[30vh] sm:h-[42vh] bg-black overflow-hidden border-b border-white/12 relative">
                  <img
                    src={heroSrc}
                    alt={loc(activeProject.title, language)}
                    className="w-full h-full object-cover object-top opacity-95"
                  />
                </div>
              );
            })()}

            <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-10 md:py-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
              <div className="lg:col-span-8 space-y-8">
                <div>
                  <h2 className="font-grotesk text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    {loc(activeProject.title, language)}
                  </h2>
                  <p className="text-base sm:text-lg leading-[1.72] text-[#F6F4EF]/75 text-editorial">
                    {loc(activeProject.desc, language)}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/12 space-y-3">
                  <h3 className="font-mono text-sm uppercase tracking-widest font-semibold text-[#D6C7B2]">
                    01 // {loc(labels.challenge, language)}
                  </h3>
                  <p className="text-base leading-[1.75] text-[#F6F4EF]/85 text-editorial">
                    {loc(activeProject.longDescChallenge, language)}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/12 space-y-3">
                  <h3 className="font-mono text-sm uppercase tracking-widest font-semibold text-[#D6C7B2]">
                    02 // {loc(labels.solution, language)}
                  </h3>
                  <p className="text-base leading-[1.75] text-[#F6F4EF]/85 text-editorial">
                    {loc(activeProject.longDescSolution, language)}
                  </p>
                </div>

                {activeProject.images && activeProject.images.length > 0 && (
                  <div className="pt-6 border-t border-white/12 space-y-4">
                    <h3 className="font-mono text-sm uppercase tracking-widest font-semibold text-[#F6F4EF]/70">
                      03 // {loc(labels.gallery, language)} ({activeProject.images.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {activeProject.images.map((img, i) => (
                        <button
                          key={img + i}
                          type="button"
                          onClick={() => setLightboxIdx(i)}
                          className="aspect-video overflow-hidden border border-white/15 bg-black cursor-pointer group"
                        >
                          <img
                            src={img}
                            alt={`${loc(activeProject.title, language)} ${i + 1}`}
                            loading="lazy"
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <aside className="lg:col-span-4 lg:border-l border-white/12 lg:pl-10 space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest block mb-1 text-[#F6F4EF]/60">
                      {loc(labels.role, language)}
                    </span>
                    <span className="font-sans text-base font-medium">
                      {loc(activeProject.role, language)}
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest block mb-1 text-[#F6F4EF]/60">
                      {loc(labels.year, language)}
                    </span>
                    <span className="font-mono text-base font-semibold">{activeProject.year}</span>
                  </div>
                </div>

                <div>
                  <span className="font-mono text-xs uppercase tracking-widest block mb-2.5 text-[#F6F4EF]/60">
                    {loc(labels.stack, language)}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProject.tech.split(", ").map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-xs px-2.5 py-1 border border-white/15 text-[#F6F4EF]/85"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 pt-2">
                  {activeProject.pdfUrl && (
                    <a
                      href={activeProject.pdfUrl}
                      download={activeProject.pdfFilename || true}
                      className="w-full py-3.5 px-5 min-h-[48px] inline-flex items-center justify-center font-mono text-sm uppercase tracking-widest font-semibold bg-[#F6F4EF] text-[#09090B] hover:bg-[#D6C7B2] transition-colors"
                    >
                      ↓ {loc(labels.downloadPdf, language)}
                    </a>
                  )}
                  {activeProject.demoUrl && (
                    <a
                      href={activeProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-3.5 px-5 min-h-[48px] inline-flex items-center justify-center font-mono text-sm uppercase tracking-widest font-semibold transition-colors ${
                        activeProject.pdfUrl
                          ? "border border-white/25 text-[#F6F4EF] hover:bg-white/10"
                          : "bg-[#F6F4EF] text-[#09090B] hover:bg-[#D6C7B2]"
                      }`}
                    >
                      {activeProject.id === "bide-eta"
                        ? loc(labels.paper, language)
                        : loc(labels.live, language)}{" "}
                      ↗
                    </a>
                  )}
                  {activeProject.link && (
                    <a
                      href={activeProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-5 min-h-[48px] inline-flex items-center justify-center font-mono text-sm uppercase tracking-widest font-semibold border border-white/25 text-[#F6F4EF] hover:bg-white/10 transition-colors"
                    >
                      {loc(labels.code, language)} ↗
                    </a>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE LIGHTBOX */}
      {lightboxIdx !== null && activeProject?.images && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIdx(null)}
            aria-label={loc(labels.back, language)}
            className="absolute top-5 right-5 font-mono text-sm text-white border border-white/30 px-4 min-h-[44px] hover:bg-white hover:text-black cursor-pointer"
          >
            ✕
          </button>
          <span className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-sm text-white/75 tabular-nums">
            {lightboxIdx + 1} / {activeProject.images.length}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx((p) => (p === 0 ? activeProject.images!.length - 1 : p! - 1));
            }}
            className="absolute left-3 sm:left-6 font-mono text-white border border-white/25 w-11 h-11 hover:bg-white hover:text-black cursor-pointer"
            aria-label="Anterior"
          >
            ←
          </button>
          <img
            src={activeProject.images[lightboxIdx]}
            alt={`${loc(activeProject.title, language)} ${lightboxIdx + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[84vh] object-contain"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx((p) => (p === activeProject.images!.length - 1 ? 0 : p! + 1));
            }}
            className="absolute right-3 sm:right-6 font-mono text-white border border-white/25 w-11 h-11 hover:bg-white hover:text-black cursor-pointer"
            aria-label="Siguiente"
          >
            →
          </button>
        </div>
      )}
    </>
  );
}
