import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { useLanguage } from "../context/LanguageContext";
import TearLink from "./TearLink";
import { IconGlyph, RichText } from "./IconGlyph";
import {
  API_ENDPOINTS,
  SITE_IDENTITY,
  loc,
} from "../data/portfolioConfig";

gsap.registerPlugin(ScrollTrigger, CustomEase);
ScrollTrigger.config({ ignoreMobileResize: true });
CustomEase.create("aw-curtain", "0.76, 0, 0.24, 1");
CustomEase.create("aw-out", "0.22, 1, 0.36, 1");

type LegalModalType = "legal" | "privacy" | "cookies" | null;

function SlotLabel({ text }: { text: string }) {
  return (
    <span>
      <RichText text={text} />
    </span>
  );
}

export default function NotFound() {
  const { language, setLanguage, t } = useLanguage();
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const drawerClockRef = useRef<HTMLSpanElement>(null);

  const [legalModal, setLegalModal] = useState<LegalModalType>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  const requestedPath =
    typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search}`
      : "/404";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Listen for CookieBanner "Política de Cookies" link event
  useEffect(() => {
    const handleOpenCookies = () => setLegalModal("cookies");
    window.addEventListener("open-cookies-modal", handleOpenCookies);
    return () => window.removeEventListener("open-cookies-modal", handleOpenCookies);
  }, []);

  // Lock body scroll & Escape handling for mobile drawer and legal modal
  useEffect(() => {
    const locked = mobileMenu || Boolean(legalModal);
    if (locked) {
      document.body.style.overflow = "hidden";
      window.dispatchEvent(new CustomEvent("lenis-lock", { detail: true }));
    } else {
      document.body.style.overflow = "";
      window.dispatchEvent(new CustomEvent("lenis-lock", { detail: false }));
    }
    if (!locked) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (legalModal) setLegalModal(null);
        else if (mobileMenu) setMobileMenu(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.dispatchEvent(new CustomEvent("lenis-lock", { detail: false }));
    };
  }, [mobileMenu, legalModal]);

  // Live Bilbao CET clock in mobile drawer via DOM ref (zero React re-renders)
  useEffect(() => {
    const updateClock = () => {
      let compactText: string = SITE_IDENTITY.cityLabel;
      try {
        const short = new Intl.DateTimeFormat("es-ES", {
          timeZone: SITE_IDENTITY.timezone,
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date());
        compactText = `${SITE_IDENTITY.cityLabel} · ${short}`;
      } catch {
        // fallback already set
      }
      if (drawerClockRef.current) drawerClockRef.current.textContent = compactText;
    };
    updateClock();
    const id = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Lenis desktop smooth scroll + GSAP Hero & Scroll Choreography (matches PortfolioMain.tsx)
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const isLargeDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const useSmoothDesktop = !reduced && finePointer && isLargeDesktop;

    let lenis: Lenis | null = null;
    let rafFn: ((time: number) => void) | null = null;
    let nativeScrollListener: (() => void) | null = null;

    if (useSmoothDesktop) {
      lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        autoResize: true,
      });

      lenis.on("scroll", (e: Lenis) => {
        ScrollTrigger.update();
        if (progressRef.current) {
          const p = Number.isFinite(e.progress) ? Math.max(0, Math.min(1, e.progress)) : 0;
          progressRef.current.style.transform = `scaleX(${p})`;
        }
      });

      rafFn = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(rafFn);
      gsap.ticker.lagSmoothing(0);
    } else {
      let ticking = false;
      nativeScrollListener = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          if (!progressRef.current) return;
          const max = document.documentElement.scrollHeight - window.innerHeight;
          const p = max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0;
          progressRef.current.style.transform = `scaleX(${p})`;
        });
      };
      window.addEventListener("scroll", nativeScrollListener, { passive: true });
    }

    const handleLenisLock = (e: Event) => {
      const locked = Boolean((e as CustomEvent<boolean>).detail);
      if (!lenis) return;
      if (locked) lenis.stop();
      else lenis.start();
    };
    window.addEventListener("lenis-lock", handleLenisLock);

    const ctx = gsap.context(() => {
      if (reduced) return;

      const heroLines = root.querySelectorAll<HTMLElement>("[data-aw-hero-line]");
      const heroFades = root.querySelectorAll<HTMLElement>("[data-aw-hero-fade]");
      const heroHairline = root.querySelector<HTMLElement>("[data-aw-hero-hairline]");
      const heroCard = root.querySelector<HTMLElement>("[data-aw-hero-card]");
      const destLine = root.querySelector<HTMLElement>("[data-aw-line]");
      const destCards = root.querySelectorAll<HTMLElement>("[data-aw-dest-card]");

      if (isLargeDesktop) {
        gsap.set(heroLines, { yPercent: 112 });
        gsap.set(heroFades, { y: 16, autoAlpha: 0 });
        if (heroHairline) {
          gsap.set(heroHairline, { scaleX: 0, transformOrigin: "left center" });
        }
        if (heroCard) {
          gsap.set(heroCard, { y: 20, autoAlpha: 0 });
        }
        if (destLine) {
          gsap.set(destLine, { scaleX: 0, transformOrigin: "left center" });
        }
        if (destCards.length > 0) {
          gsap.set(destCards, { y: 18, autoAlpha: 0 });
        }

        const tl = gsap.timeline({ defaults: { ease: "aw-out" } });

        tl.to(
          heroLines,
          {
            yPercent: 0,
            duration: 0.7,
            stagger: 0.06,
            clearProps: "transform",
          },
          0.05
        );

        if (heroCard) {
          tl.to(
            heroCard,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.6,
              clearProps: "transform,opacity,visibility",
            },
            0.12
          );
        }

        if (heroHairline) {
          tl.to(
            heroHairline,
            {
              scaleX: 1,
              duration: 0.55,
              clearProps: "transform",
            },
            0.16
          );
        }

        tl.to(
          heroFades,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.55,
            stagger: 0.05,
            clearProps: "transform,opacity,visibility",
          },
          0.18
        );

        if (destLine) {
          tl.to(
            destLine,
            {
              scaleX: 1,
              duration: 0.65,
              clearProps: "transform",
            },
            0.26
          );
        }

        if (destCards.length > 0) {
          tl.to(
            destCards,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.55,
              stagger: 0.055,
              clearProps: "transform,opacity,visibility",
            },
            0.3
          );
        }
      }
    }, root);

    return () => {
      if (nativeScrollListener) window.removeEventListener("scroll", nativeScrollListener);
      window.removeEventListener("lenis-lock", handleLenisLock);
      ctx.revert();
      if (rafFn) gsap.ticker.remove(rafFn);
      lenis?.destroy();
    };
  }, []);

  const navItems = [
    { id: "work", href: "/#work", num: "01", label: { es: "Proyectos", en: "Projects", eu: "Proiektuak" } },
    { id: "about", href: "/#about", num: "02", label: { es: "Servicios", en: "Services", eu: "Zerbitzuak" } },
    { id: "experience", href: "/#experience", num: "03", label: { es: "Experiencia", en: "Experience", eu: "Esperientzia" } },
    { id: "research", href: "/#research", num: "04", label: { es: "Investigación", en: "Research", eu: "Ikerketa" } },
    { id: "api", href: "/#api", num: "05", label: { es: "GitHub & API", en: "GitHub & API", eu: "GitHub & API" } },
    { id: "contact", href: "/#contact", num: "06", label: { es: "Contacto", en: "Contact", eu: "Kontaktua" } },
  ];

  const ui = {
    menuTitle: { es: "NAVEGACIÓN", en: "NAVIGATION", eu: "NABIGAZIOA" },
    languageLabel: { es: "Idioma", en: "Language", eu: "Hizkuntza" },
    researchTitle: { es: "Investigación", en: "Research", eu: "Ikerketa" },
    researchArchiveCta: {
      es: "Archivo académico · Scholar ↗",
      en: "Academic Archive · Scholar ↗",
      eu: "Artxibo akademikoa · Scholar ↗",
    },
    footerLinksTitle: { es: "Enlaces", en: "Links", eu: "Estekak" },
    diagnosticEyebrow: {
      es: "DIAGNÓSTICO HTTP",
      en: "HTTP DIAGNOSTIC",
      eu: "HTTP DIAGNOSTIKOA",
    },
    statusMeta: "STATUS 404 · NOT FOUND",
    endpointsLabel: {
      es: "ENDPOINTS ESTRUCTURADOS",
      en: "STRUCTURED ENDPOINTS",
      eu: "ENDPOINT EGITURATUAK",
    },
    diagnosticSubtitle: {
      es: "Enlace movido o ruta inexistente",
      en: "Moved link or non-existent route",
      eu: "Esteka mugitua edo bide baliogabea",
    },
    viewProjects: {
      es: "Ver proyectos →",
      en: "View projects →",
      eu: "Ikusi proiektuak →",
    },
    papersCta: {
      es: "Papers & Zenodo ↗",
      en: "Papers & Zenodo ↗",
      eu: "Papers & Zenodo ↗",
    },
  };

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

  const btnDarkOnIvory = {
    "--aw-btn-fill": "#D6C7B2",
    "--aw-btn-hover-text": "#09090B",
  } as CSSProperties;

  const btnOutlineOnDark = {
    "--aw-btn-fill": "#F6F4EF",
    "--aw-btn-hover-text": "#09090B",
  } as CSSProperties;

  const destinationCards = [
    { num: "01", href: "/", title: t("404.c1Title"), desc: t("404.c1Desc") },
    { num: "02", href: "/#work", title: t("404.c2Title"), desc: t("404.c2Desc") },
    { num: "03", href: SITE_IDENTITY.papersArchivePath, title: t("404.c3Title"), desc: t("404.c3Desc") },
    { num: "04", href: "/#contact", title: t("404.c4Title"), desc: t("404.c4Desc") },
  ];

  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-[#09090B] text-[#F6F4EF] font-sans antialiased flex flex-col selection:bg-[#D6C7B2] selection:text-[#09090B]"
    >
      {/* Subtle Film Grain — Desktop ONLY (identical to PortfolioMain.tsx) */}
      <div
        aria-hidden="true"
        className="hidden lg:block fixed inset-0 z-[70] pointer-events-none opacity-[0.024]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Top Hairline Scroll Progress */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-white/10 z-[90] pointer-events-none">
        <div ref={progressRef} className="h-full bg-[#D6C7B2] origin-left scale-x-0" />
      </div>

      {/* =====================================================================
          HEADER — FIXED TOP BAR IDENTICAL TO PORTFOLIOMAIN.TSX
         ===================================================================== */}
      <header className="fixed top-0 left-0 right-0 z-[80] bg-[#09090B]/95 backdrop-blur-md border-b border-white/14">
        <div className="max-w-[1533px] mx-auto px-5 sm:px-8 lg:px-12 h-16 sm:h-20 lg:h-24 flex items-center justify-between gap-4 xl:grid xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:gap-8">
          {/* Left: Logo */}
          <a
            href="/"
            className="flex items-center min-h-[44px] shrink-0 xl:justify-self-start transition-opacity hover:opacity-80"
            aria-label={t("header.home")}
          >
            <img
              src="/img/logo.webp"
              width={720}
              height={281}
              alt={t("header.logoAlt")}
              className="h-6 sm:h-7 lg:h-8 w-auto shrink-0 object-contain aspect-[720/281]"
            />
          </a>

          {/* Center: Desktop Navigation with .aw-nav-link Champagne Underline */}
          <nav
            aria-label="Navegación principal"
            className="hidden lg:flex items-center gap-1 xl:gap-2"
          >
            {navItems
              .filter((n) => n.id !== "api")
              .map((n) => (
                <a
                  key={n.id}
                  href={n.href}
                  data-active="false"
                  className="aw-nav-link px-3.5 xl:px-4 py-2.5 text-[15px] xl:text-base font-medium whitespace-nowrap text-[#F6F4EF]/78 hover:text-[#F6F4EF]"
                >
                  {loc(n.label, language)}
                </a>
              ))}
          </nav>

          {/* Right: Desktop Language Switcher + Download CV | Mobile Morphing Hamburger ↔ X */}
          <div className="flex items-center gap-3.5 xl:gap-4 shrink-0 xl:justify-self-end">
            <div
              role="group"
              aria-label={loc(ui.languageLabel, language)}
              className="hidden lg:grid grid-cols-3 border border-white/22 divide-x divide-white/22 bg-[#0E0E12]"
            >
              {(["es", "en", "eu"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    if (language !== code) setLanguage(code);
                  }}
                  aria-pressed={language === code}
                  className={`font-mono text-sm uppercase tracking-[0.1em] min-w-[44px] min-h-[44px] px-2.5 cursor-pointer transition-colors ${
                    language === code
                      ? "bg-[#F6F4EF] text-[#09090B] font-bold"
                      : "text-[#F6F4EF]/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>

            <a
              href={`/CV_YerayGarrido_${language}.pdf`}
              download={`CV_YerayGarrido_${language.toUpperCase()}.pdf`}
              style={btnDarkOnIvory}
              className="aw-btn hidden lg:inline-flex items-center bg-[#F6F4EF] text-[#09090B] font-semibold text-[15px] xl:text-base px-5 xl:px-6 min-h-[46px]"
            >
              <SlotLabel text={`↓ ${t("hero.downloadCv")}`} />
            </a>

            {/* Mobile Animated Square Hamburger ↔ Morphing X Button */}
            <button
              type="button"
              onClick={() => setMobileMenu((v) => !v)}
              className="lg:hidden relative w-11 h-11 border border-white/30 hover:border-[#D6C7B2] bg-[#09090B] flex items-center justify-center cursor-pointer transition-colors"
              aria-label={mobileMenu ? t("projects.close") : "Menú"}
              aria-expanded={mobileMenu}
              aria-controls="mobile-nav-drawer"
            >
              <span className="relative w-5 h-5 flex items-center justify-center">
                <span
                  className={`absolute block w-5 h-[1.5px] bg-[#F6F4EF] transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                    mobileMenu
                      ? "translate-y-0 rotate-45 bg-[#D6C7B2]"
                      : "-translate-y-[4.5px] rotate-0"
                  }`}
                />
                <span
                  className={`absolute block w-5 h-[1.5px] bg-[#F6F4EF] transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                    mobileMenu
                      ? "translate-y-0 -rotate-45 bg-[#D6C7B2]"
                      : "translate-y-[4.5px] rotate-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
          MOBILE RIGHT-SIDE ARCHITECTURAL SLIDE-OVER DRAWER (<lg)
         ===================================================================== */}
      <div
        id="mobile-nav-drawer"
        aria-hidden={!mobileMenu}
        className={`lg:hidden fixed inset-0 z-[75] transition-visibility ${
          mobileMenu ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          onClick={() => setMobileMenu(false)}
          className={`fixed inset-0 bg-black/75 transition-opacity duration-300 ${
            mobileMenu ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          role="dialog"
          aria-modal={mobileMenu}
          aria-label={loc(ui.menuTitle, language)}
          className={`fixed top-0 right-0 bottom-0 w-[86%] max-w-[400px] bg-[#0C0C0F] border-l border-white/15 overflow-y-auto overscroll-contain transition-transform duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] ${
            mobileMenu ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="min-h-full pt-20 sm:pt-24 pb-8 px-6 sm:px-8 flex flex-col justify-between gap-6">
            <div className="space-y-6 shrink-0">
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-white/12 font-mono text-xs uppercase tracking-[0.16em] text-[#D6C7B2]">
                <span className="whitespace-nowrap">{loc(ui.menuTitle, language)}</span>
                <span ref={drawerClockRef} className="text-[#F6F4EF]/55 whitespace-nowrap tabular-nums">
                  {SITE_IDENTITY.cityLabel}
                </span>
              </div>

              <nav className="flex flex-col divide-y divide-white/10">
                {navItems.map((n, idx) => (
                  <a
                    key={n.id}
                    href={n.href}
                    onClick={() => setMobileMenu(false)}
                    style={{
                      transitionDelay: mobileMenu ? `${60 + idx * 35}ms` : "0ms",
                    }}
                    className={`group flex items-center justify-between gap-3 py-4 min-h-[54px] transition-[opacity,transform,color] duration-300 ${
                      mobileMenu ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                    }`}
                  >
                    <span className="flex items-baseline gap-4 min-w-0">
                      <span className="font-mono text-xs text-[#D6C7B2] shrink-0">{n.num}</span>
                      <span className="font-grotesk font-semibold text-2xl tracking-tight text-[#F6F4EF] group-hover:text-[#D6C7B2] transition-colors truncate">
                        {loc(n.label, language)}
                      </span>
                    </span>
                    <span className="font-mono text-base text-[#F6F4EF]/45 group-hover:text-[#D6C7B2] transition-colors shrink-0">
                      <IconGlyph name="right" />
                    </span>
                  </a>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-white/12 space-y-5 shrink-0">
              <div className="space-y-2">
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-[#F6F4EF]/55">
                  {loc(ui.languageLabel, language)}
                </div>
                <div className="grid grid-cols-3 border border-white/20 divide-x divide-white/20">
                  {(["es", "en", "eu"] as const).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        if (language !== code) setLanguage(code);
                      }}
                      aria-pressed={language === code}
                      className={`font-mono text-sm uppercase min-h-[44px] cursor-pointer transition-colors ${
                        language === code
                          ? "bg-[#F6F4EF] text-[#09090B] font-bold"
                          : "text-[#F6F4EF]/75 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>

              <a
                href={`/CV_YerayGarrido_${language}.pdf`}
                download={`CV_YerayGarrido_${language.toUpperCase()}.pdf`}
                onClick={() => setMobileMenu(false)}
                className="w-full bg-[#F6F4EF] text-[#09090B] hover:bg-[#D6C7B2] font-semibold text-base min-h-[50px] flex items-center justify-center gap-2 transition-colors"
              >
                <IconGlyph name="down" />
                <span>{t("hero.downloadCv")}</span>
              </a>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <a
                  href={SITE_IDENTITY.bideUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 min-h-[50px] border border-[#D6C7B2]/45 bg-[#D6C7B2]/[0.08] text-[#D6C7B2] hover:bg-[#D6C7B2] hover:text-[#09090B] font-grotesk font-semibold text-[15px] transition-colors"
                >
                  <span>Bideplus</span>
                  <span className="font-mono text-sm">
                    <IconGlyph name="up-right" />
                  </span>
                </a>
                <a
                  href={SITE_IDENTITY.papersArchivePath}
                  className="flex items-center justify-between px-4 min-h-[50px] border border-white/18 bg-white/[0.03] text-[#F6F4EF] hover:border-[#D6C7B2] hover:text-[#D6C7B2] font-grotesk font-medium text-[15px] transition-colors"
                >
                  <span>Papers</span>
                  <span className="font-mono text-sm">
                    <IconGlyph name="up-right" />
                  </span>
                </a>
                <a
                  href={SITE_IDENTITY.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 min-h-[50px] border border-white/18 bg-white/[0.03] text-[#F6F4EF] hover:border-white/50 hover:bg-white/[0.08] font-grotesk font-medium text-[15px] transition-colors"
                >
                  <span>GitHub</span>
                  <span className="font-mono text-sm">
                    <IconGlyph name="up-right" />
                  </span>
                </a>
                <a
                  href={SITE_IDENTITY.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 min-h-[50px] border border-white/18 bg-white/[0.03] text-[#F6F4EF] hover:border-white/50 hover:bg-white/[0.08] font-grotesk font-medium text-[15px] transition-colors"
                >
                  <span>LinkedIn</span>
                  <span className="font-mono text-sm">
                    <IconGlyph name="up-right" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MAIN 404 ARCHITECTURAL HERO (Mirrors PortfolioMain.tsx Hero 1:1)
         ===================================================================== */}
      <main className="flex-1 pt-16 sm:pt-20 lg:pt-24">
        <section className="relative overflow-hidden px-5 sm:px-8 lg:px-12 pt-8 sm:pt-12 lg:pt-12 pb-16 sm:pb-24">
          <div className="relative z-10 max-w-[1440px] mx-auto w-full flex flex-col gap-8 lg:gap-10">
            {/* Meta Top Line */}
            <div
              data-aw-hero-fade
              className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-between gap-2 sm:gap-3 text-center lg:text-left font-mono text-sm sm:text-base uppercase tracking-[0.12em] text-[#D6C7B2]"
            >
              <span>{t("404.badge")}</span>
              <span className="text-[#F6F4EF]/70">
                {t("hero.portfolio", { year: new Date().getFullYear().toString() })}
              </span>
            </div>

            {/* Editorial Lockup + Orbital Champagne Beam Diagnostic Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
              <div className="lg:col-span-7 text-center lg:text-left">
                <h1 className="select-none">
                  <span className="block overflow-hidden py-1 -my-1">
                    <span
                      data-aw-hero-line
                      className="block font-editorial font-semibold uppercase tracking-[-0.035em] leading-[0.86] text-[clamp(4.4rem,14vw,9.6rem)] text-[#F6F4EF]"
                    >
                      404
                    </span>
                  </span>
                  <span className="block overflow-hidden py-3 -my-3 px-2 -mx-2 -mt-[0.06em] lg:pl-[0.06em]">
                    <span
                      data-aw-hero-line
                      className="block font-editorial italic font-normal tracking-[-0.035em] leading-[0.92] text-[clamp(2.8rem,8.5vw,6.4rem)] text-[#D6C7B2]"
                    >
                      {t("404.title")}
                    </span>
                  </span>
                </h1>
              </div>

              {/* Orbital Champagne Frame Card (.aw-launch-frame from src/index.css) */}
              <aside
                data-aw-hero-card
                className="lg:col-span-5 aw-launch-frame bg-[#111114] p-6 flex flex-col gap-5"
              >
                <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-white/14 font-mono text-xs sm:text-sm uppercase tracking-[0.14em]">
                  <span className="text-[#D6C7B2] font-semibold">
                    {loc(ui.diagnosticEyebrow, language)}
                  </span>
                  <span className="text-[#F6F4EF]/70">{ui.statusMeta}</span>
                </div>

                {/* Requested Path Inspector */}
                <div className="bg-[#0B0B0D] border border-white/10 p-4 space-y-2">
                  <div className="font-mono text-xs uppercase tracking-[0.14em] text-[#D6C7B2]">
                    {t("404.pathLabel")}
                  </div>
                  <code className="block font-mono text-sm text-[#F6F4EF] break-all leading-relaxed">
                    {requestedPath}
                  </code>
                </div>

                {/* Structured Public Endpoints Strip */}
                <div className="space-y-2.5">
                  <div className="font-mono text-xs uppercase tracking-[0.14em] text-[#F6F4EF]/55">
                    {loc(ui.endpointsLabel, language)}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {API_ENDPOINTS.map((ep) => (
                      <a
                        key={ep.id}
                        href={ep.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs px-2.5 py-1.5 bg-[#0B0B0D] border border-white/14 text-[#F6F4EF]/80 hover:border-[#D6C7B2] hover:text-[#D6C7B2] transition-colors"
                      >
                        {ep.label}
                      </a>
                    ))}
                    <a
                      href="/sitemap.xml"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs px-2.5 py-1.5 bg-[#0B0B0D] border border-white/14 text-[#F6F4EF]/80 hover:border-[#D6C7B2] hover:text-[#D6C7B2] transition-colors"
                    >
                      sitemap.xml
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-2 border-t border-white/10">
                  <div className="min-w-0">
                    <div className="font-grotesk font-semibold text-base sm:text-lg leading-tight text-[#F6F4EF] truncate">
                      {SITE_IDENTITY.brandName}
                    </div>
                    <div className="font-mono text-xs sm:text-sm text-[#D6C7B2] mt-1 truncate">
                      {loc(ui.diagnosticSubtitle, language)}
                    </div>
                  </div>
                  <a
                    href="/"
                    style={btnDarkOnIvory}
                    className="aw-btn shrink-0 bg-[#F6F4EF] text-[#09090B] font-semibold text-sm sm:text-base px-4 sm:px-5 min-h-[46px] inline-flex items-center"
                  >
                    <SlotLabel text={`← ${t("404.c1Title")}`} />
                  </a>
                </div>
              </aside>
            </div>

            {/* Editorial Bottom Row: Description + 2x2 .aw-btn Action Grid */}
            <div className="relative pt-8">
              <div
                data-aw-hero-hairline
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-px bg-white/15"
              />
              <div
                data-aw-hero-fade
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end text-center lg:text-left"
              >
                <p className="lg:col-span-6 text-editorial text-[17px] sm:text-[19px] lg:text-[20px] text-[#F6F4EF]/85 leading-[1.72] max-w-[60ch] mx-auto lg:mx-0 text-center lg:text-left">
                  {t("404.desc")}
                </p>
                <div className="lg:col-span-5 lg:col-start-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full sm:max-w-[640px] mx-auto lg:max-w-none lg:mx-0 lg:ml-[9px] lg:w-[calc(100%-9px)]">
                  <a
                    href="/"
                    style={btnDarkOnIvory}
                    className="aw-btn bg-[#F6F4EF] text-[#09090B] font-semibold text-base px-6 sm:px-7 py-4 min-h-[54px] lg:min-h-[64px] lg:text-[17px] inline-flex items-center justify-center"
                  >
                    <SlotLabel text={`← ${t("404.backHome")}`} />
                  </a>
                  <a
                    href="/#work"
                    style={btnOutlineOnDark}
                    className="aw-btn border border-white/30 text-[#F6F4EF] font-medium text-base px-6 sm:px-7 py-4 min-h-[54px] lg:min-h-[64px] lg:text-[17px] inline-flex items-center justify-center"
                  >
                    <SlotLabel text={loc(ui.viewProjects, language)} />
                  </a>
                  <TearLink
                    href={SITE_IDENTITY.photographyUrl}
                    ariaLabel={t("hero.photographyProfile")}
                    className="aw-btn border border-[#D6C7B2]/45 text-[#D6C7B2] font-medium text-base px-6 sm:px-7 py-4 min-h-[54px] lg:min-h-[64px] lg:text-[17px] inline-flex items-center justify-center"
                  >
                    <SlotLabel text={`${t("hero.photographyProfile")} ↗`} />
                  </TearLink>
                  <a
                    href={SITE_IDENTITY.papersArchivePath}
                    style={btnOutlineOnDark}
                    className="aw-btn border border-white/30 text-[#F6F4EF] font-medium text-base px-6 sm:px-7 py-4 min-h-[54px] lg:min-h-[64px] lg:text-[17px] inline-flex items-center justify-center"
                  >
                    <SlotLabel text={loc(ui.papersCta, language)} />
                  </a>
                </div>
              </div>
            </div>

            {/* Destination Cards Section */}
            <div className="pt-6 lg:pt-8 space-y-5">
              <div className="flex items-center gap-4 font-mono text-xs sm:text-sm uppercase tracking-[0.16em] text-[#D6C7B2]">
                <span className="shrink-0">{t("404.destinations")}</span>
                <span
                  data-aw-line
                  aria-hidden="true"
                  className="flex-1 h-px bg-white/14"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {destinationCards.map((card) => (
                  <a
                    key={card.num}
                    href={card.href}
                    data-aw-dest-card
                    className="group bg-[#111114] hover:bg-[#17171C] border border-white/14 hover:border-[#D6C7B2] p-6 flex flex-col justify-between min-h-[184px] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[3px] hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.75)]"
                  >
                    <div>
                      <div className="flex items-center justify-between font-mono text-xs text-[#D6C7B2] pb-3.5 border-b border-white/10 mb-4">
                        <span>[ {card.num} ]</span>
                        <span className="text-[#F6F4EF]/45 group-hover:text-[#D6C7B2] group-hover:translate-x-1 transition-all duration-200">
                          <IconGlyph name="right" />
                        </span>
                      </div>
                      <h2 className="font-grotesk text-lg sm:text-xl font-semibold text-[#F6F4EF] group-hover:text-[#D6C7B2] transition-colors mb-2">
                        {card.title}
                      </h2>
                      <p className="text-sm text-[#F6F4EF]/70 leading-relaxed m-0">
                        {card.desc}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          STRUCTURED PRODUCTION FOOTER — 1:1 REPLICA OF PORTFOLIOMAIN.TSX
         ===================================================================== */}
      <footer className="bg-[#09090B] text-[#F6F4EF]/75 py-16 px-5 sm:px-8 lg:px-14 border-t border-white/12 overflow-x-clip">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 sm:gap-12 pb-12 border-b border-white/12 text-base">
          {/* Col 1: Identity & ORCID */}
          <div className="col-span-2 md:col-span-1 space-y-4 min-w-0">
            <img
              src="/img/logo.webp"
              width={720}
              height={281}
              loading="lazy"
              alt={t("header.logoAlt")}
              className="h-8 w-auto object-contain aspect-[720/281]"
            />
            <p className="text-sm sm:text-base text-[#F6F4EF]/65 leading-relaxed">
              {SITE_IDENTITY.brandName} · {t("hero.role")}
            </p>
            <a
              href={SITE_IDENTITY.orcidUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono text-xs text-[#D6C7B2]/85 hover:text-[#D6C7B2] transition-colors"
            >
              ORCID {SITE_IDENTITY.orcid} <IconGlyph name="up-right" />
            </a>
          </div>

          {/* Col 2: Portfolio Links */}
          <div className="space-y-2.5 min-w-0">
            <div className="text-[#F6F4EF] uppercase tracking-[0.08em] sm:tracking-[0.14em] font-semibold text-xs sm:text-sm break-words">
              Portfolio
            </div>
            <a href="/#work" className="block hover:text-white py-0.5 break-words">
              Bide+ &amp; {t("projects.title")}
            </a>
            <a href="/#research" className="block hover:text-white py-0.5 break-words">
              {loc(ui.researchTitle, language)}
            </a>
            <a
              href={SITE_IDENTITY.papersArchivePath}
              className="block hover:text-[#D6C7B2] py-0.5 break-words"
            >
              <RichText text={loc(ui.researchArchiveCta, language)} />
            </a>
            <a href="/#experience" className="block hover:text-white py-0.5 break-words">
              {t("exp.title")}
            </a>
          </div>

          {/* Col 3: APIs & Endpoints */}
          <div className="space-y-2.5 min-w-0">
            <div className="text-[#F6F4EF] uppercase tracking-[0.08em] sm:tracking-[0.14em] font-semibold text-xs sm:text-sm break-words">
              {t("api.title")}
            </div>
            <a
              href="/cv.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-white py-0.5"
            >
              cv.xml
            </a>
            <a
              href="/cv.json"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-white py-0.5"
            >
              cv.json
            </a>
            <a
              href="/cv.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-white py-0.5"
            >
              cv.txt
            </a>
            <a
              href="/llms.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-white py-0.5"
            >
              llms.txt
            </a>
          </div>

          {/* Col 4: Links & Social */}
          <div className="col-span-2 md:col-span-1 space-y-2.5 min-w-0">
            <div className="text-[#F6F4EF] uppercase tracking-[0.08em] sm:tracking-[0.14em] font-semibold text-xs sm:text-sm break-words">
              {loc(ui.footerLinksTitle, language)}
            </div>
            <a
              href={SITE_IDENTITY.bideUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-[#D6C7B2] py-0.5 break-words"
            >
              Bideplus (Bide+) <IconGlyph name="up-right" />
            </a>
            <a
              href={SITE_IDENTITY.gasolineraUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-[#D6C7B2] py-0.5 break-words"
            >
              Gasolinera+ (gasolineraplus.app) <IconGlyph name="up-right" />
            </a>
            <a
              href={SITE_IDENTITY.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-white py-0.5"
            >
              GitHub <IconGlyph name="up-right" />
            </a>
            <a
              href={SITE_IDENTITY.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-white py-0.5"
            >
              LinkedIn <IconGlyph name="up-right" />
            </a>
            <a
              href="https://ko-fi.com/ygarrido"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-white py-0.5"
            >
              Ko-fi <IconGlyph name="up-right" />
            </a>
            <TearLink
              href={SITE_IDENTITY.photographyUrl}
              ariaLabel={t("hero.photographyProfile")}
              className="block hover:text-[#D6C7B2] py-0.5"
            >
              {t("hero.photographyProfile")} <IconGlyph name="up-right" />
            </TearLink>
          </div>
        </div>

        {/* Sub-footer Bottom Line with Legal Modals */}
        <div className="max-w-[1440px] mx-auto pt-7 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#F6F4EF]/55 text-center md:text-left">
          <span>
            {t("contact.footer.madeWith")} {SITE_IDENTITY.brandName}
          </span>
          <span>
            {t("contact.footer.copyright", { year: new Date().getFullYear().toString() })}
          </span>
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

      {/* =====================================================================
          LEGAL / PRIVACY / COOKIES MODAL (Identical to PortfolioMain.tsx)
         ===================================================================== */}
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
                aria-label={t("projects.close")}
                className="font-mono text-xs uppercase tracking-widest px-3.5 min-h-[44px] border border-white/20 hover:bg-[#F6F4EF] hover:text-[#09090B] transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>ESC</span>
                <IconGlyph name="close" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto" data-lenis-prevent="true">
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
