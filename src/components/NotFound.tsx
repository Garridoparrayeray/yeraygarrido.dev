import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

type LegalModalType = "legal" | "privacy" | "cookies" | null;

export default function NotFound() {
  const { language, setLanguage, t } = useLanguage();
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

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

  const legalContent = {
    es: {
      links: { legal: "Aviso Legal", privacy: "Privacidad", cookies: "Cookies" },
      modalContent: {
        legal: {
          title: "Aviso Legal",
          body: "Este sitio web es el portfolio profesional de Yeray Garrido. Su finalidad es estrictamente informativa, de exhibición de proyectos de ingeniería de software y difusión de publicaciones técnicas de acceso abierto.\n\nAl ser un sitio web personal que no realiza comercio electrónico directo, el acceso es público y gratuito. Los códigos fuente enlazados pertenecen a sus respectivos repositorios en GitHub bajo sus propias licencias abiertas (MIT / CC BY 4.0).",
        },
        privacy: {
          title: "Política de Privacidad",
          body: "Me tomo tu privacidad en serio. Esta web no incluye registro de cuentas ni bases de datos de usuarios.\n\nSi decides contactarme a través del correo electrónico, el formulario rápido de contacto o redes sociales, tus datos serán utilizados única y exclusivamente para responder a tu consulta, y no serán compartidos con terceros ni incluidos en listas de marketing.\n\nPara el análisis de rendimiento técnico, el alojamiento de esta web (Vercel) recopila métricas básicas y anónimas de velocidad de carga sin identificar al usuario.",
        },
        cookies: {
          title: "Política de Cookies",
          body: "Esta web utiliza las siguientes cookies:\n\n1. Cookies Técnicas (Estrictamente necesarias): Utilizadas para guardar tu preferencia de idioma (ES/EN/EU) y tu decisión sobre este aviso de cookies. No requieren consentimiento.\n\n2. Cookies Analíticas (Microsoft Clarity): Solo si das tu consentimiento expreso en el banner inicial, se activarán cookies analíticas anónimas para entender el uso de la interfaz y mejorar la experiencia.\n\nPuedes revocar tu consentimiento en cualquier momento borrando las cookies de tu navegador.",
        },
      },
    },
    en: {
      links: { legal: "Legal Notice", privacy: "Privacy", cookies: "Cookies" },
      modalContent: {
        legal: {
          title: "Legal Notice",
          body: "This website is the professional portfolio of Yeray Garrido. Its purpose is strictly informational, showcasing software engineering projects and open-access technical publications.\n\nAs a personal website with no direct e-commerce, access is public and free. Linked source codes belong to their respective GitHub repositories under their stated open licenses (MIT / CC BY 4.0).",
        },
        privacy: {
          title: "Privacy Policy",
          body: "I take your privacy seriously. This website does not include user accounts or user databases.\n\nIf you decide to contact me via email, the quick contact form, or social networks, your information will be used solely to respond to your inquiry and will never be shared with third parties or added to marketing lists.\n\nFor technical performance analysis, the hosting provider (Vercel) collects basic, anonymous load speed metrics without identifying the visitor.",
        },
        cookies: {
          title: "Cookie Policy",
          body: "This website uses the following cookies:\n\n1. Technical Cookies (Strictly necessary): Used to remember your language preference (ES/EN/EU) and your decision regarding this cookie notice. They do not require consent.\n\n2. Analytical Cookies (Microsoft Clarity): Only if you give express consent in the initial banner, anonymous analytical cookies are enabled to help improve the interface.\n\nYou can revoke your consent at any time by clearing your browser cookies.",
        },
      },
    },
    eu: {
      links: { legal: "Legezko Oharra", privacy: "Pribatutasuna", cookies: "Cookieak" },
      modalContent: {
        legal: {
          title: "Legezko Oharra",
          body: "Webgune hau Yeray Garridoren portfolio profesionala da. Helburua informazioa ematea, software ingeniaritzako proiektuak erakustea eta sarbide irekiko argitalpen teknikoak zabaltzea da.\n\nMerkataritza elektroniko zuzenik egiten ez duen webgune pertsonala denez, sarbidea publikoa eta doakoa da. Lotutako iturburu-kodeak GitHub-eko biltegienak dira, beren lizentziekin (MIT / CC BY 4.0).",
        },
        privacy: {
          title: "Pribatutasun Politika",
          body: "Zure pribatutasuna serio hartzen dut. Webgune honek ez du erregistro konturik edo erabiltzaileen datu-baserik.\n\nNirekin posta elektronikoz, kontaktu-formulario azkarraren bidez edo sare sozialen bidez harremanetan jartzea erabakitzen baduzu, zure datuak zure kontsultari erantzuteko soilik erabiliko dira, eta ez dira hirugarrenekin partekatuko.\n\nErrendimendu teknikoaren analisirako, webgune honen ostalariak (Vercel) karga-abiaduraren oinarrizko metrika anonimoak biltzen ditu.",
        },
        cookies: {
          title: "Cookie Politika",
          body: "Webgune honek cookie hauek erabiltzen ditu:\n\n1. Cookie Teknikoak (Beharrezkoak): Zure hizkuntza hobespena (ES/EN/EU) eta cookie-en abisu honi buruzko erabakia gordetzeko. Ez dute baimenik behar.\n\n2. Cookie Analitikoak (Microsoft Clarity): Hasierako banner-ean baimen esplizitua ematen baduzu soilik aktibatuko dira, interfazea hobetzen laguntzeko modu anonimoan.\n\nZure baimena edozein unetan ezezta dezakezu nabigatzaileko cookie-ak ezabatuz.",
        },
      },
    },
  };

  const currentLegal = legalContent[language as keyof typeof legalContent] || legalContent.es;

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
              href="/#work"
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

          {/* Right: Square Segmented Language Box + Primary Button + Mobile Button */}
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

            <button
              type="button"
              onClick={() => setMobileMenu((v) => !v)}
              className="lg:hidden w-11 h-11 border border-white/20 hover:border-[#D6C7B2] bg-[#09090B] flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Menú"
              aria-expanded={mobileMenu}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M3 6H17M3 14H17" strokeLinecap="round" />
              </svg>
            </button>
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
        <h1 className="select-none flex flex-col mb-6">
          <span className="block font-editorial font-semibold uppercase tracking-[-0.035em] leading-[0.86] text-[clamp(4.2rem,14vw,9.6rem)] text-[#F6F4EF]">
            404
          </span>
          <span className="block font-editorial italic font-normal tracking-[-0.035em] leading-[0.88] text-[clamp(3.2rem,9.5vw,6.8rem)] text-[#D6C7B2] -mt-[0.06em]">
            {t("404.title")}
          </span>
        </h1>

        <p className="text-[17px] sm:text-[19px] lg:text-[20px] text-[#F6F4EF]/85 max-w-[60ch] leading-[1.72] mb-8">
          {t("404.desc")}
        </p>

        {/* Path Inspection Callout */}
        <div className="bg-[#111114] border border-white/14 px-4 py-3 mb-8 flex flex-wrap items-center gap-3 w-fit max-w-full">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#D6C7B2] font-semibold">
            {t("404.pathLabel")}
          </span>
          <code className="font-mono text-xs sm:text-sm text-[#F6F4EF] break-all">
            {requestedPath}
          </code>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-12">
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-[#F6F4EF] text-[#09090B] hover:bg-[#D6C7B2] font-semibold text-base px-6 min-h-[48px] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M13.5 8H3M7.25 3.75L3 8L7.25 12.25" />
            </svg>
            <span>{t("404.backHome")}</span>
          </a>
          <a
            href="/#work"
            className="inline-flex items-center gap-2 bg-[#111114] border border-white/20 text-[#F6F4EF] hover:border-[#D6C7B2] hover:text-[#D6C7B2] font-medium text-base px-6 min-h-[48px] transition-colors"
          >
            <span>Ver Proyectos</span>
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M8 3V13M3.75 8.75L8 13L12.25 8.75" />
            </svg>
          </a>
          <a
            href="/papers/"
            className="inline-flex items-center gap-2 bg-[#111114] border border-white/20 text-[#F6F4EF] hover:border-[#D6C7B2] hover:text-[#D6C7B2] font-medium text-base px-6 min-h-[48px] transition-colors"
          >
            <span>Papers & Zenodo</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M4.25 11.75L11.5 4.5M5.5 4.5H11.5V10.5" />
            </svg>
          </a>
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 bg-[#111114] border border-white/20 text-[#F6F4EF] hover:border-[#D6C7B2] hover:text-[#D6C7B2] font-medium text-base px-6 min-h-[48px] transition-colors"
          >
            <span>Contacto</span>
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M8 3V13M3.75 8.75L8 13L12.25 8.75" />
            </svg>
          </a>
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
            className="group bg-[#111114] hover:bg-[#15151A] border border-white/14 hover:border-[#D6C7B2] p-6 flex flex-col justify-between min-h-[180px] transition-all duration-200"
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
            href="/#work"
            className="group bg-[#111114] hover:bg-[#15151A] border border-white/14 hover:border-[#D6C7B2] p-6 flex flex-col justify-between min-h-[180px] transition-all duration-200"
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
            className="group bg-[#111114] hover:bg-[#15151A] border border-white/14 hover:border-[#D6C7B2] p-6 flex flex-col justify-between min-h-[180px] transition-all duration-200"
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
            className="group bg-[#111114] hover:bg-[#15151A] border border-white/14 hover:border-[#D6C7B2] p-6 flex flex-col justify-between min-h-[180px] transition-all duration-200"
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
      </main>

      {/* Production 4-Column Footer — Exact Replica of PortfolioMain.tsx lines 3508-3684 */}
      <footer className="bg-[#09090B] text-[#F6F4EF]/75 py-16 px-5 sm:px-8 lg:px-14 border-t border-white/12 overflow-x-clip">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 sm:gap-12 pb-12 border-b border-white/12 text-base">
          {/* Col 1: Identity & ORCID */}
          <div className="col-span-2 md:col-span-1 space-y-4 min-w-0">
            <img
              src="/img/logo.webp"
              width={720}
              height={281}
              loading="lazy"
              alt="Yeray Garrido"
              className="h-8 w-auto"
            />
            <p className="text-sm sm:text-base text-[#F6F4EF]/65 leading-relaxed">
              Yeray Garrido · Ingeniero de Software &amp; Creador de Productos Digitales
            </p>
            <a
              href="https://orcid.org/0009-0008-0459-0294"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-[#D6C7B2]/85 hover:text-[#D6C7B2] transition-colors"
            >
              <span>ORCID 0009-0008-0459-0294</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.65">
                <path d="M4.25 11.75L11.5 4.5M5.5 4.5H11.5V10.5" />
              </svg>
            </a>
          </div>

          {/* Col 2: Portfolio Links */}
          <div className="space-y-2.5 min-w-0">
            <div className="text-[#F6F4EF] uppercase tracking-[0.08em] sm:tracking-[0.14em] font-semibold text-xs sm:text-sm break-words">
              Portfolio
            </div>
            <a href="/#work" className="block hover:text-white py-0.5 break-words">
              Bide+ &amp; Proyectos
            </a>
            <a href="/#research" className="block hover:text-white py-0.5 break-words">
              Investigación
            </a>
            <a href="/papers/" className="inline-flex items-center gap-1.5 text-[#F6F4EF]/75 hover:text-[#D6C7B2] py-0.5 break-words">
              <span>Papers &amp; Zenodo (CERN)</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.65">
                <path d="M4.25 11.75L11.5 4.5M5.5 4.5H11.5V10.5" />
              </svg>
            </a>
            <a href="/#experience" className="block hover:text-white py-0.5 break-words">
              Experiencia laboral
            </a>
          </div>

          {/* Col 3: APIs & Endpoints */}
          <div className="space-y-2.5 min-w-0">
            <div className="text-[#F6F4EF] uppercase tracking-[0.08em] sm:tracking-[0.14em] font-semibold text-xs sm:text-sm break-words">
              APIs &amp; Datos
            </div>
            <a href="/cv.xml" target="_blank" rel="noopener noreferrer" className="block hover:text-white py-0.5">
              cv.xml
            </a>
            <a href="/cv.json" target="_blank" rel="noopener noreferrer" className="block hover:text-white py-0.5">
              cv.json
            </a>
            <a href="/cv.txt" target="_blank" rel="noopener noreferrer" className="block hover:text-white py-0.5">
              cv.txt
            </a>
            <a href="/llms.txt" target="_blank" rel="noopener noreferrer" className="block hover:text-white py-0.5">
              llms.txt
            </a>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="block hover:text-white py-0.5">
              sitemap.xml
            </a>
          </div>

          {/* Col 4: Links & Social */}
          <div className="col-span-2 md:col-span-1 space-y-2.5 min-w-0">
            <div className="text-[#F6F4EF] uppercase tracking-[0.08em] sm:tracking-[0.14em] font-semibold text-xs sm:text-sm break-words">
              Enlaces &amp; Redes
            </div>
            <a
              href="https://www.bideplus.eus/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#D6C7B2] py-0.5 break-words"
            >
              <span>Bideplus (Bide+)</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.65">
                <path d="M4.25 11.75L11.5 4.5M5.5 4.5H11.5V10.5" />
              </svg>
            </a>
            <a
              href="https://gasolineraplus.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#D6C7B2] py-0.5 break-words"
            >
              <span>Gasolinera+ (App)</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.65">
                <path d="M4.25 11.75L11.5 4.5M5.5 4.5H11.5V10.5" />
              </svg>
            </a>
            <a
              href="https://github.com/Garridoparrayeray"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-white py-0.5"
            >
              <span>GitHub</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.65">
                <path d="M4.25 11.75L11.5 4.5M5.5 4.5H11.5V10.5" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/yeray-garrido"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-white py-0.5"
            >
              <span>LinkedIn</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.65">
                <path d="M4.25 11.75L11.5 4.5M5.5 4.5H11.5V10.5" />
              </svg>
            </a>
            <a
              href="https://ko-fi.com/ygarrido"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-white py-0.5"
            >
              <span>Ko-fi</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.65">
                <path d="M4.25 11.75L11.5 4.5M5.5 4.5H11.5V10.5" />
              </svg>
            </a>
            <a
              href="https://archive.yeraygarrido.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#D6C7B2] py-0.5"
            >
              <span>Archivo fotográfico</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.65">
                <path d="M4.25 11.75L11.5 4.5M5.5 4.5H11.5V10.5" />
              </svg>
            </a>
          </div>
        </div>

        {/* Sub-footer Bottom Line with Legal Modals */}
        <div className="max-w-[1440px] mx-auto pt-7 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#F6F4EF]/55 text-center md:text-left">
          <span>Desarrollado con código nativo · Yeray Garrido</span>
          <span>© {new Date().getFullYear()} Yeray Garrido · Todos los derechos reservados</span>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 font-mono text-xs uppercase tracking-wider">
            <button
              type="button"
              onClick={() => setLegalModal("legal")}
              className="hover:text-[#F6F4EF] transition-colors cursor-pointer min-h-[44px]"
            >
              {currentLegal.links.legal}
            </button>
            <button
              type="button"
              onClick={() => setLegalModal("privacy")}
              className="hover:text-[#F6F4EF] transition-colors cursor-pointer min-h-[44px]"
            >
              {currentLegal.links.privacy}
            </button>
            <button
              type="button"
              onClick={() => setLegalModal("cookies")}
              className="hover:text-[#F6F4EF] transition-colors cursor-pointer min-h-[44px]"
            >
              {currentLegal.links.cookies}
            </button>
          </div>
        </div>
      </footer>

      {/* Legal Modal Dialog */}
      {legalModal && (
        <div
          className="fixed inset-0 z-[160] flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={currentLegal.modalContent[legalModal].title}
        >
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
            onClick={() => setLegalModal(null)}
          />
          <div className="relative w-full max-w-2xl max-h-[82vh] bg-[#0C0C0F] text-[#F6F4EF] border border-white/18 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex justify-between items-center px-6 py-5 border-b border-white/12">
              <h2 className="font-grotesk text-xl sm:text-2xl font-bold tracking-tight">
                {currentLegal.modalContent[legalModal].title}
              </h2>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                aria-label="Cerrar"
                className="font-mono text-xs uppercase tracking-widest px-3.5 min-h-[44px] border border-white/20 hover:bg-[#F6F4EF] hover:text-[#09090B] transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>ESC</span>
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3L13 13M13 3L3 13" strokeLinecap="square" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <p className="font-sans text-[#F6F4EF]/80 text-sm sm:text-base leading-[1.75] whitespace-pre-line">
                {currentLegal.modalContent[legalModal].body}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
