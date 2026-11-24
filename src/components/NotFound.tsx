import { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function NotFound() {
  const { language, setLanguage, t } = useLanguage();
  const requestedPath =
    typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search}`
      : "/404";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const languages = [
    { code: "es", label: "ES" },
    { code: "en", label: "EN" },
    { code: "eu", label: "EU" },
  ] as const;

  return (
    <div className="min-h-screen bg-[#09090B] text-[#F6F4EF] font-sans flex flex-col selection:bg-[#D6C7B2] selection:text-[#09090B]">
      {/* Top Header — Identical to PortfolioMain Header */}
      <header className="sticky top-0 z-[80] bg-[#09090B]/95 backdrop-blur-md border-b border-white/14">
        <div className="max-w-[1533px] mx-auto px-5 sm:px-8 lg:px-12 h-16 sm:h-20 lg:h-24 flex items-center justify-between gap-4 xl:grid xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:gap-8">
          {/* Left: Logo only */}
          <a
            href="/"
            className="flex items-center min-h-[44px] shrink-0 xl:justify-self-start transition-opacity hover:opacity-80"
            aria-label={t("header.logoAlt")}
          >
            <img
              src="/img/logo.webp"
              alt="Yeray Garrido"
              width="720"
              height="281"
              className="h-6 sm:h-7 lg:h-8 w-auto shrink-0 object-contain"
            />
          </a>

          {/* Center: Desktop Navigation */}
          <nav
            aria-label="Navegación principal"
            className="hidden lg:flex items-center gap-1 xl:gap-2"
          >
            <a
              href="/#projects"
              className="px-3.5 xl:px-4 py-2.5 text-[15px] xl:text-base font-medium whitespace-nowrap text-[#F6F4EF]/78 hover:text-[#D6C7B2] transition-colors"
            >
              {language === "eu" ? "Proiektuak" : language === "en" ? "Projects" : "Proyectos"}
            </a>
            <a
              href="/#services"
              className="px-3.5 xl:px-4 py-2.5 text-[15px] xl:text-base font-medium whitespace-nowrap text-[#F6F4EF]/78 hover:text-[#D6C7B2] transition-colors"
            >
              {language === "eu" ? "Zerbitzuak" : language === "en" ? "Services" : "Servicios"}
            </a>
            <a
              href="/#experience"
              className="px-3.5 xl:px-4 py-2.5 text-[15px] xl:text-base font-medium whitespace-nowrap text-[#F6F4EF]/78 hover:text-[#D6C7B2] transition-colors"
            >
              {language === "eu" ? "Esperientzia" : language === "en" ? "Experience" : "Experiencia"}
            </a>
            <a
              href="/papers/"
              className="px-3.5 xl:px-4 py-2.5 text-[15px] xl:text-base font-medium whitespace-nowrap text-[#F6F4EF]/78 hover:text-[#D6C7B2] transition-colors"
            >
              {language === "eu" ? "Ikerketa" : language === "en" ? "Research" : "Investigación"}
            </a>
            <a
              href="/#contact"
              className="px-3.5 xl:px-4 py-2.5 text-[15px] xl:text-base font-medium whitespace-nowrap text-[#F6F4EF]/78 hover:text-[#D6C7B2] transition-colors"
            >
              {language === "eu" ? "Kontaktua" : language === "en" ? "Contact" : "Contacto"}
            </a>
          </nav>

          {/* Right: Square Segmented Language Box + Primary Button */}
          <div className="flex items-center gap-3.5 xl:gap-4 shrink-0 xl:justify-self-end">
            <div
              role="group"
              aria-label="Selector de idioma"
              className="grid grid-cols-3 border border-white/22 divide-x divide-white/22 bg-[#0E0E12]"
            >
              {languages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code)}
                  aria-pressed={language === l.code}
                  className={`font-mono text-sm uppercase tracking-[0.1em] min-w-[44px] min-h-[44px] px-2.5 cursor-pointer transition-colors ${
                    language === l.code
                      ? "bg-[#F6F4EF] text-[#09090B] font-bold"
                      : "text-[#F6F4EF]/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            <a
              href="/"
              className="inline-flex items-center gap-2 bg-[#F6F4EF] text-[#09090B] hover:bg-[#D6C7B2] font-semibold text-[15px] xl:text-base px-5 xl:px-6 min-h-[44px] sm:min-h-[46px] transition-colors"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="square"
                strokeLinejoin="miter"
                aria-hidden="true"
              >
                <path d="M13.5 8H3M7.25 3.75L3 8L7.25 12.25" />
              </svg>
              <span>{t("404.backHome")}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-14 lg:py-16 flex flex-col justify-center">
        {/* Meta Top Line */}
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-2 font-mono text-xs sm:text-sm uppercase tracking-[0.12em] text-[#D6C7B2] mb-6">
          <span>{t("404.badge")}</span>
          <span className="text-[#F6F4EF]/70">© {new Date().getFullYear()} PORTAFOLIO</span>
        </div>

        {/* Editorial Lockup: 404 + No Encontrado */}
        <h1 className="select-none flex flex-col mb-4">
          <span className="block font-editorial font-semibold uppercase tracking-[-0.035em] leading-[0.86] text-[clamp(4.5rem,14vw,9.6rem)] text-[#F6F4EF]">
            404
          </span>
          <span className="block font-editorial italic font-normal tracking-[-0.035em] leading-[0.88] text-[clamp(2.8rem,8.5vw,6.2rem)] text-[#D6C7B2] mt-1 sm:mt-2">
            {t("404.title")}
          </span>
        </h1>

        <p className="text-base sm:text-lg text-white/75 max-w-2xl leading-relaxed mb-8">
          {t("404.desc")}
        </p>

        {/* Path Inspection Callout */}
        <div className="bg-[#111114] border border-white/14 px-4 py-3 mb-10 flex flex-wrap items-center gap-3 w-fit max-w-full">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#D6C7B2] font-semibold">
            {t("404.pathLabel")}
          </span>
          <code className="font-mono text-xs sm:text-sm text-[#F6F4EF] break-all">
            {requestedPath}
          </code>
        </div>

        {/* Destination Cards */}
        <div className="font-mono text-xs uppercase tracking-[0.16em] text-[#D6C7B2] mb-4 flex items-center gap-3">
          <span>{t("404.destinations")}</span>
          <span className="flex-1 h-px bg-white/14" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {/* Card 1: Inicio */}
          <a
            href="/"
            className="group bg-[#111114] hover:bg-[#15151A] border border-white/14 hover:border-[#D6C7B2] p-6 flex flex-col justify-between min-h-[170px] transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-xs text-[#D6C7B2] pb-3 border-b border-white/10 mb-4">
                <span>[ 01 ]</span>
                <svg
                  className="w-4 h-4 text-white/40 group-hover:text-[#D6C7B2] group-hover:translate-x-1 transition-all"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.65"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  aria-hidden="true"
                >
                  <path d="M2.5 8H13M8.75 3.75L13 8L8.75 12.25" />
                </svg>
              </div>
              <h2 className="font-grotesk text-lg sm:text-xl font-semibold text-[#F6F4EF] mb-2">
                {t("404.c1Title")}
              </h2>
              <p className="text-xs sm:text-sm text-white/65 leading-relaxed m-0">
                {t("404.c1Desc")}
              </p>
            </div>
          </a>

          {/* Card 2: Proyectos */}
          <a
            href="/#projects"
            className="group bg-[#111114] hover:bg-[#15151A] border border-white/14 hover:border-[#D6C7B2] p-6 flex flex-col justify-between min-h-[170px] transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-xs text-[#D6C7B2] pb-3 border-b border-white/10 mb-4">
                <span>[ 02 ]</span>
                <svg
                  className="w-4 h-4 text-white/40 group-hover:text-[#D6C7B2] group-hover:translate-x-1 transition-all"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.65"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  aria-hidden="true"
                >
                  <path d="M2.5 8H13M8.75 3.75L13 8L8.75 12.25" />
                </svg>
              </div>
              <h2 className="font-grotesk text-lg sm:text-xl font-semibold text-[#F6F4EF] mb-2">
                {t("404.c2Title")}
              </h2>
              <p className="text-xs sm:text-sm text-white/65 leading-relaxed m-0">
                {t("404.c2Desc")}
              </p>
            </div>
          </a>

          {/* Card 3: Publicaciones */}
          <a
            href="/papers/"
            className="group bg-[#111114] hover:bg-[#15151A] border border-white/14 hover:border-[#D6C7B2] p-6 flex flex-col justify-between min-h-[170px] transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-xs text-[#D6C7B2] pb-3 border-b border-white/10 mb-4">
                <span>[ 03 ]</span>
                <svg
                  className="w-4 h-4 text-white/40 group-hover:text-[#D6C7B2] group-hover:translate-x-1 transition-all"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.65"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  aria-hidden="true"
                >
                  <path d="M2.5 8H13M8.75 3.75L13 8L8.75 12.25" />
                </svg>
              </div>
              <h2 className="font-grotesk text-lg sm:text-xl font-semibold text-[#F6F4EF] mb-2">
                {t("404.c3Title")}
              </h2>
              <p className="text-xs sm:text-sm text-white/65 leading-relaxed m-0">
                {t("404.c3Desc")}
              </p>
            </div>
          </a>

          {/* Card 4: Contacto */}
          <a
            href="/#contact"
            className="group bg-[#111114] hover:bg-[#15151A] border border-white/14 hover:border-[#D6C7B2] p-6 flex flex-col justify-between min-h-[170px] transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-xs text-[#D6C7B2] pb-3 border-b border-white/10 mb-4">
                <span>[ 04 ]</span>
                <svg
                  className="w-4 h-4 text-white/40 group-hover:text-[#D6C7B2] group-hover:translate-x-1 transition-all"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.65"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  aria-hidden="true"
                >
                  <path d="M2.5 8H13M8.75 3.75L13 8L8.75 12.25" />
                </svg>
              </div>
              <h2 className="font-grotesk text-lg sm:text-xl font-semibold text-[#F6F4EF] mb-2">
                {t("404.c4Title")}
              </h2>
              <p className="text-xs sm:text-sm text-white/65 leading-relaxed m-0">
                {t("404.c4Desc")}
              </p>
            </div>
          </a>
        </div>

        {/* Structured Endpoints Panel */}
        <div className="bg-[#111114] border border-white/14 p-5 sm:p-6 mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <span className="uppercase tracking-[0.16em] text-[#D6C7B2] font-semibold">
              Endpoints estructurados
            </span>
            <div className="flex flex-wrap gap-2">
              <a
                href="/cv.json"
                className="px-3 py-1.5 bg-[#09090B] border border-white/14 text-[#F6F4EF]/75 hover:border-[#D6C7B2] hover:text-[#D6C7B2] transition-colors"
              >
                cv.json
              </a>
              <a
                href="/cv.xml"
                className="px-3 py-1.5 bg-[#09090B] border border-white/14 text-[#F6F4EF]/75 hover:border-[#D6C7B2] hover:text-[#D6C7B2] transition-colors"
              >
                cv.xml
              </a>
              <a
                href="/llms.txt"
                className="px-3 py-1.5 bg-[#09090B] border border-white/14 text-[#F6F4EF]/75 hover:border-[#D6C7B2] hover:text-[#D6C7B2] transition-colors"
              >
                llms.txt
              </a>
              <a
                href="/sitemap.xml"
                className="px-3 py-1.5 bg-[#09090B] border border-white/14 text-[#F6F4EF]/75 hover:border-[#D6C7B2] hover:text-[#D6C7B2] transition-colors"
              >
                sitemap.xml
              </a>
              <a
                href="https://github.com/Garridoparrayeray"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#09090B] border border-white/14 text-[#F6F4EF]/75 hover:border-[#D6C7B2] hover:text-[#D6C7B2] transition-colors flex items-center gap-1.5"
              >
                <span>GitHub</span>
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.65"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  aria-hidden="true"
                >
                  <path d="M4.25 11.75L11.5 4.5M5.5 4.5H11.5V10.5" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Site Footer */}
      <footer className="border-t border-white/14 bg-[#09090B] font-mono text-xs text-[#F6F4EF]/60 py-6 sm:py-8 px-5 sm:px-8 lg:px-12">
        <div className="max-w-[1533px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <span>© {new Date().getFullYear()} Yeray Garrido</span>
            <span> · </span>
            <span>Ingeniero de Software</span>
          </div>
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <a
              href="https://github.com/Garridoparrayeray"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D6C7B2] transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/yeray-garrido"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D6C7B2] transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://orcid.org/0009-0008-0459-0294"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D6C7B2] transition-colors"
            >
              ORCID
            </a>
            <a
              href="mailto:garridoparrayeraytx@gmail.com"
              className="hover:text-[#D6C7B2] transition-colors"
            >
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
