import {
  Fragment,
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { useLanguage } from "../context/LanguageContext";
import TearLink from "./TearLink";
import { IconGlyph, RichText } from "./IconGlyph";

const ProjectModal = lazy(() => import("./ProjectModal"));
const GitHubCalendar = lazy(() =>
  import("react-github-calendar").then((m) => ({ default: m.GitHubCalendar }))
);
import {
  ALL_PROJECTS,
  API_ENDPOINTS,
  ARCHIVE_PLATES,
  CONTACT_FORM,
  EDUCATION_HISTORY,
  FLAGSHIP_PRODUCT,
  LATEST_RELEASE,
  MARQUEE_ITEMS,
  RESEARCH_PAPERS,
  FEATURED_RESEARCH,
  SITE_IDENTITY,
  TECH_STACK_ITEMS,
  AI_TOOLS_ITEMS,
  WORK_EXPERIENCE,
  loc,
  type ProjectItem,
} from "../data/portfolioConfig";

gsap.registerPlugin(ScrollTrigger, CustomEase);
ScrollTrigger.config({ ignoreMobileResize: true });
CustomEase.create("aw-curtain", "0.76, 0, 0.24, 1");
CustomEase.create("aw-out", "0.22, 1, 0.36, 1");

const SECTION_IDS = ["top", "work", "projects", "about", "experience", "research", "api", "contact"] as const;

type LegalModalType = "legal" | "privacy" | "cookies" | null;
type FormStatus = "idle" | "submitting" | "sent" | "mailto" | "error";

/** Clean Label for .aw-btn buttons (calm hover + crisp SVG arrows that never turn into iOS emojis) */
function SlotLabel({ text }: { text: string }) {
  return (
    <span>
      <RichText text={text} />
    </span>
  );
}

/** Realistic Minimal Smartphone Hardware Frame showcasing an installed mobile PWA */
function MobileHardwareFrame({
  src,
  alt,
  size = "hero",
  priority = false,
}: {
  src: string;
  alt: string;
  size?: "hero" | "flank" | "compact";
  priority?: boolean;
}) {
  const isCompact = size === "compact";
  const isEager = priority;
  const responsiveSrcSet = src.includes("_mobile.webp")
    ? `${src.replace("_mobile.webp", "_mobile-390w.webp")} 390w, ${src} 780w`
    : undefined;
  const responsiveSizes = "165px";
  return (
    <div
      className={`relative bg-[#17171C] border border-white/20 shadow-[0_28px_80px_rgba(0,0,0,0.85)] select-none ${
        isCompact ? "p-1.5 rounded-[24px]" : "p-2 rounded-[34px]"
      }`}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 border border-white/10 ${
          isCompact ? "rounded-[24px]" : "rounded-[34px]"
        }`}
      />
      <div
        className={`relative overflow-hidden bg-white ${
          isCompact ? "rounded-[19px]" : "rounded-[26px]"
        }`}
      >
        <div
          aria-hidden="true"
          className={`flex items-center justify-between bg-white text-[#09090B] font-mono font-semibold ${
            isCompact ? "px-3.5 pt-1.5 pb-1 text-[9px]" : "px-5 pt-2.5 pb-1.5 text-[11px]"
          }`}
        >
          <span>9:41</span>
          <span
            className={`bg-[#09090B] rounded-full ${
              isCompact ? "w-11 h-2.5" : "w-16 h-3.5"
            }`}
          />
          <span className="inline-flex items-center gap-1">
            <span className="inline-block w-3.5 h-2 border border-[#09090B]/80 p-[1px]">
              <span className="block w-full h-full bg-[#09090B]" />
            </span>
          </span>
        </div>

        <div className="relative aspect-[9/17.6] overflow-hidden bg-[#F8F9FA]">
          <img
            src={src}
            srcSet={responsiveSrcSet}
            sizes={responsiveSrcSet ? responsiveSizes : undefined}
            width={390}
            height={844}
            alt={alt}
            loading={isEager ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : isEager ? "auto" : "low"}
            decoding={priority ? "sync" : "async"}
            className="w-full h-full object-cover object-top"
          />
        </div>

        <div aria-hidden="true" className="bg-white py-1.5 flex justify-center">
          <span
            className={`bg-[#09090B]/25 rounded-full ${isCompact ? "w-14 h-0.5" : "w-24 h-1"}`}
          />
        </div>
      </div>
    </div>
  );
}

export default function PortfolioMain() {
  const { language, setLanguage, t } = useLanguage();

  const rootRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const curtainInnerRef = useRef<HTMLDivElement>(null);
  const curtainCounterRef = useRef<HTMLSpanElement>(null);
  const curtainBarRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const drawerClockRef = useRef<HTMLSpanElement>(null);
  const bideCenterPhoneRef = useRef<HTMLDivElement>(null);
  const expListRef = useRef<HTMLDivElement>(null);
  const dockLinkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const lenisRef = useRef<Lenis | null>(null);
  const hasMountedBideRef = useRef(false);
  const hasMountedExpRef = useRef(false);
  const hasMountedMetaRef = useRef(false);
  const refreshTimerRef = useRef<number | null>(null);
  const copyTimerRef = useRef<number | null>(null);
  const emailCopyTimerRef = useRef<number | null>(null);

  const scheduleScrollRefresh = useCallback(() => {
    if (refreshTimerRef.current !== null) {
      window.clearTimeout(refreshTimerRef.current);
    }
    refreshTimerRef.current = window.setTimeout(() => {
      refreshTimerRef.current = null;
      ScrollTrigger.refresh();
    }, 100);
  }, []);

  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);
  const [bideScreenIdx, setBideScreenIdx] = useState<number>(FLAGSHIP_PRODUCT.defaultScreenIndex);
  const [expTab, setExpTab] = useState<"work" | "education">("work");
  const [apiTab, setApiTab] = useState<"xml" | "json" | "txt" | "llms">("xml");
  const [copied, setCopied] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  // Option B: Optional expandable contact form state
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formBotcheck, setFormBotcheck] = useState("");
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [showGhCalendar, setShowGhCalendar] = useState(false);
  const ghCalendarWrapRef = useRef<HTMLDivElement>(null);

  // Live GitHub KPI stats (instant sensible fallback = zero layout shift)
  const [ghStats, setGhStats] = useState<{
    publicRepos: number;
    estimatedCommits: number;
    followers: number;
  }>({
    publicRepos: SITE_IDENTITY.githubFallbackStats.publicRepos,
    estimatedCommits: SITE_IDENTITY.githubFallbackStats.estimatedCommits,
    followers: SITE_IDENTITY.githubFallbackStats.followers,
  });

  const isAnyModalOpen = Boolean(activeProject || isCatalogOpen || legalModal);
  const flagshipProject =
    ALL_PROJECTS.find((p) => p.id === FLAGSHIP_PRODUCT.projectId) || ALL_PROJECTS[0];
  const latestReleaseProject = LATEST_RELEASE.projectId
    ? ALL_PROJECTS.find((p) => p.id === LATEST_RELEASE.projectId) || null
    : null;
  const archivePlates = ARCHIVE_PLATES.map((cfg) => {
    const item = ALL_PROJECTS.find((p) => p.id === cfg.id);
    return item ? { ...cfg, project: item } : null;
  }).filter(Boolean) as Array<(typeof ARCHIVE_PLATES)[number] & { project: ProjectItem }>;

  const flagshipScreens = FLAGSHIP_PRODUCT.screens;
  const totalFlagshipScreens = flagshipScreens.length;
  const safeFlagshipIdx =
    totalFlagshipScreens > 0 ? Math.min(bideScreenIdx, totalFlagshipScreens - 1) : 0;
  const activeFlagshipScreen = flagshipScreens[safeFlagshipIdx] || flagshipScreens[0];
  const leftFlagshipIdx =
    totalFlagshipScreens > 0
      ? (safeFlagshipIdx - 1 + totalFlagshipScreens) % totalFlagshipScreens
      : 0;
  const rightFlagshipIdx =
    totalFlagshipScreens > 0 ? (safeFlagshipIdx + 1) % totalFlagshipScreens : 0;
  const leftFlagshipScreen = flagshipScreens[leftFlagshipIdx];
  const rightFlagshipScreen = flagshipScreens[rightFlagshipIdx];

  // Defer GitHubCalendar chunk & SVG rendering until user scrolls near Section 05
  useEffect(() => {
    const el = ghCalendarWrapRef.current;
    if (!el || showGhCalendar) return;
    if (typeof IntersectionObserver === "undefined") {
      setShowGhCalendar(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShowGhCalendar(true);
          io.disconnect();
        }
      },
      { rootMargin: "450px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [showGhCalendar]);

  // Listen for CookieBanner "Política de Cookies" link event
  useEffect(() => {
    const handleOpenCookies = () => setLegalModal("cookies");
    window.addEventListener("open-cookies-modal", handleOpenCookies);
    return () => window.removeEventListener("open-cookies-modal", handleOpenCookies);
  }, []);

  // Fetch real-time GitHub profile metrics once on mount
  useEffect(() => {
    let active = true;
    fetch(`https://api.github.com/users/${SITE_IDENTITY.githubUsername}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!active || !data || typeof data.public_repos !== "number") return;
        const createdYear = data.created_at
          ? new Date(data.created_at).getFullYear()
          : new Date().getFullYear();
        const years = Math.max(1, new Date().getFullYear() - createdYear + 1);
        setGhStats({
          publicRepos: data.public_repos,
          estimatedCommits: data.public_repos * 42 + years * 120,
          followers:
            typeof data.followers === "number"
              ? data.followers
              : SITE_IDENTITY.githubFallbackStats.followers,
        });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Lock body scroll & Escape handling for mobile drawer and legal modal
  useEffect(() => {
    const locked = mobileMenu || Boolean(legalModal);
    if (locked) {
      document.body.style.overflow = "hidden";
      window.dispatchEvent(new CustomEvent("lenis-lock", { detail: true }));
    } else if (!activeProject && !isCatalogOpen) {
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
      if (!activeProject && !isCatalogOpen) {
        document.body.style.overflow = "";
        window.dispatchEvent(new CustomEvent("lenis-lock", { detail: false }));
      }
    };
  }, [mobileMenu, legalModal, activeProject, isCatalogOpen]);

  // Clear pending timers on unmount
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current !== null) window.clearTimeout(refreshTimerRef.current);
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
      if (emailCopyTimerRef.current !== null) window.clearTimeout(emailCopyTimerRef.current);
    };
  }, []);

  // Smooth anchor navigation (Lenis on desktop, native smooth scroll with sticky header offset on mobile)
  const scrollToSection = useCallback((e: ReactMouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    setMobileMenu(false);
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const offset = id === "top" ? 0 : isDesktop ? -96 : -72;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset,
        duration: 1.0,
      });
    } else {
      const top = target.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
  }, []);

  // Crisp non-stacking transition on the center Bide+ phone when switching operator screen
  useEffect(() => {
    if (!hasMountedBideRef.current) {
      hasMountedBideRef.current = true;
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = bideCenterPhoneRef.current;
    if (reduced || !el) return;
    gsap.killTweensOf(el);
    const tween = gsap.fromTo(
      el,
      { y: 10, opacity: 0.78 },
      {
        y: 0,
        opacity: 1,
        duration: 0.34,
        ease: "aw-out",
        overwrite: true,
        clearProps: "transform,opacity",
      }
    );
    return () => {
      tween.kill();
    };
  }, [bideScreenIdx]);

  // Live Bilbao CET clock via DOM refs (zero React re-renders)
  useEffect(() => {
    const updateClock = () => {
      let desktopText = `${SITE_IDENTITY.cityLabel} / ES`;
      let compactText: string = SITE_IDENTITY.cityLabel;
      try {
        const now = new Date();
        const full = new Intl.DateTimeFormat("es-ES", {
          timeZone: SITE_IDENTITY.timezone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(now);
        const short = new Intl.DateTimeFormat("es-ES", {
          timeZone: SITE_IDENTITY.timezone,
          hour: "2-digit",
          minute: "2-digit",
        }).format(now);
        desktopText = `${SITE_IDENTITY.cityLabel} / ${full} CET`;
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

  // Main mount-only choreography: Desktop Lenis + Cursor Follower + Mobile-Optimized GSAP ScrollTrigger
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let isMounted = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const isLargeDesktop = window.matchMedia("(min-width: 1024px)").matches;
    // CRITICAL MOBILE PERF: Only run Lenis on desktop fine-pointer devices; mobile uses native 60/120Hz OS scroll
    const useSmoothDesktop = !reduced && finePointer && isLargeDesktop;

    let lenis: Lenis | null = null;
    let rafFn: ((time: number) => void) | null = null;
    let nativeScrollListener: (() => void) | null = null;
    let marqueeTween: gsap.core.Tween | null = null;

    // --- 1. Desktop Smooth Scroll (Lenis) OR Lightweight Native Scroll Progress (Mobile) ---
    let targetMarqueeScale = 1;
    let currentMarqueeScale = 1;

    if (useSmoothDesktop) {
      lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        autoResize: true,
      });
      lenisRef.current = lenis;

      lenis.on("scroll", (e: Lenis) => {
        ScrollTrigger.update();
        if (progressRef.current) {
          const p = Number.isFinite(e.progress) ? Math.max(0, Math.min(1, e.progress)) : 0;
          progressRef.current.style.transform = `scaleX(${p})`;
        }
        if (marqueeTween && !marqueeTween.paused()) {
          targetMarqueeScale = 1 + Math.min(3.2, Math.abs(e.velocity) * 0.14);
        }
      });

      rafFn = (time: number) => {
        lenis?.raf(time * 1000);
        if (marqueeTween && !marqueeTween.paused()) {
          currentMarqueeScale += (targetMarqueeScale - currentMarqueeScale) * 0.1;
          targetMarqueeScale += (1 - targetMarqueeScale) * 0.08;
          if (
            Math.abs(currentMarqueeScale - 1) > 0.004 ||
            Math.abs(targetMarqueeScale - 1) > 0.004
          ) {
            marqueeTween.timeScale(currentMarqueeScale);
          } else if (currentMarqueeScale !== 1) {
            currentMarqueeScale = 1;
            targetMarqueeScale = 1;
            marqueeTween.timeScale(1);
          }
        }
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

    // --- 3. GSAP Context + MatchMedia Choreography ---
    // Bide+ (#work) y Proyectos destacados (#projects) comparten la entrada «Proyectos» del menú.
    const dockLinkFor: Record<string, string> = { projects: "work" };
    const setActiveDock = (activeId: string) => {
      const target = dockLinkFor[activeId] ?? activeId;
      SECTION_IDS.forEach((id) => {
        const link = dockLinkRefs.current[id];
        if (link) {
          link.dataset.active = id === target ? "true" : "false";
        }
      });
    };

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      if (isLargeDesktop) {
        setActiveDock("top");
        SECTION_IDS.forEach((id) => {
          const el = document.getElementById(id);
          if (!el) return;
          ScrollTrigger.create({
            trigger: el,
            start: "top 48%",
            end: "bottom 48%",
            onEnter: () => setActiveDock(id),
            onEnterBack: () => setActiveDock(id),
          });
        });
      }

      if (reduced) {
        if (curtainRef.current) {
          gsap.set(curtainRef.current, { autoAlpha: 0 });
        }
        return;
      }

      // A. Architectural Shutter Preloader (Desktop lg+ deliberate cadence; Mobile renders Hero immediately for sub-1s LCP)
      const heroLines = root.querySelectorAll<HTMLElement>("[data-aw-hero-line]");
      const heroFades = root.querySelectorAll<HTMLElement>("[data-aw-hero-fade]");
      const heroHairline = root.querySelector<HTMLElement>("[data-aw-hero-hairline]");
      const heroFeatureCard = root.querySelector<HTMLElement>("[data-aw-hero-card]");

      if (isLargeDesktop) {
        gsap.set(heroLines, { yPercent: 112 });
        gsap.set(heroFades, { y: 16, autoAlpha: 0 });
        if (heroHairline) {
          gsap.set(heroHairline, { scaleX: 0, transformOrigin: "left center" });
        }
        if (heroFeatureCard) {
          gsap.set(heroFeatureCard, { y: 20, autoAlpha: 0 });
        }

        const introTl = gsap.timeline({ defaults: { ease: "aw-out" } });
        const heroStart = 0.42;

        if (curtainBarRef.current) {
          gsap.set(curtainBarRef.current, { scaleX: 0, transformOrigin: "left center" });
        }
        const counterDuration = 0.34;
        const liftStart = 0.36;
        const liftDuration = 0.44;
        const counterObj = { val: 0 };

        if (curtainCounterRef.current) {
          introTl.to(
            counterObj,
            {
              val: 100,
              duration: counterDuration,
              ease: "power2.inOut",
              onUpdate: () => {
                if (curtainCounterRef.current) {
                  curtainCounterRef.current.textContent = String(
                    Math.round(counterObj.val)
                  ).padStart(2, "0");
                }
              },
            },
            0
          );
        }

        if (curtainBarRef.current) {
          introTl.to(
            curtainBarRef.current,
            {
              scaleX: 1,
              duration: counterDuration,
              ease: "power2.inOut",
            },
            0
          );
        }

        if (curtainInnerRef.current) {
          introTl.to(
            curtainInnerRef.current,
            {
              y: -14,
              autoAlpha: 0,
              duration: 0.18,
              ease: "power2.in",
            },
            liftStart - 0.08
          );
        }

        if (curtainRef.current) {
          introTl
            .to(
              curtainRef.current,
              {
                yPercent: -100,
                duration: liftDuration,
                ease: "aw-curtain",
              },
              liftStart
            )
            .set(curtainRef.current, { autoAlpha: 0 });
        }

        introTl.to(
          heroLines,
          {
            yPercent: 0,
            duration: 0.65,
            stagger: 0.05,
            clearProps: "transform",
          },
          heroStart
        );

        if (heroFeatureCard) {
          introTl.to(
            heroFeatureCard,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.55,
              clearProps: "transform,opacity,visibility",
            },
            heroStart + 0.06
          );
        }

        if (heroHairline) {
          introTl.to(
            heroHairline,
            {
              scaleX: 1,
              duration: 0.55,
              clearProps: "transform",
            },
            heroStart + 0.08
          );
        }

        introTl.to(
          heroFades,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.5,
            stagger: 0.04,
            clearProps: "transform,opacity,visibility",
          },
          heroStart + 0.1
        );
      } else if (curtainRef.current) {
        gsap.set(curtainRef.current, { autoAlpha: 0 });
      }

      // B. Kinetic Infinite Editorial Marquee — auto-pauses off-screen (0% idle CPU/GPU)
      const marqueeWrap = root.querySelector<HTMLElement>("[data-aw-marquee-wrap]");
      const marqueeTrack = root.querySelector<HTMLElement>("[data-aw-marquee-track]");
      if (marqueeWrap && marqueeTrack) {
        marqueeTween = gsap.to(marqueeTrack, {
          xPercent: -50,
          duration: 28,
          ease: "none",
          repeat: -1,
          paused: true,
        });
        ScrollTrigger.create({
          trigger: marqueeWrap,
          start: "top bottom",
          end: "bottom top",
          onEnter: () => marqueeTween?.play(),
          onEnterBack: () => marqueeTween?.play(),
          onLeave: () => marqueeTween?.pause(),
          onLeaveBack: () => marqueeTween?.pause(),
        });
      }

      // C. Animated Numeric Telemetry Counters (Bide+ Stage)
      root.querySelectorAll<HTMLElement>("[data-aw-count]").forEach((el) => {
        const target = Number(el.dataset.target || "0");
        const suffix = el.dataset.suffix || "";
        const format = el.dataset.format || "int";
        const obj = { val: 0 };

        const formatValue = (v: number) => {
          if (format === "decimal1") return `${v.toFixed(1).replace(".", ",")}${suffix}`;
          if (format === "thousands") return `${Math.round(v).toLocaleString("es-ES")}${suffix}`;
          return `${Math.round(v)}${suffix}`;
        };

        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.to(obj, {
              val: target,
              duration: 1.2,
              ease: "power3.out",
              onUpdate: () => {
                el.textContent = formatValue(obj.val);
              },
            });
          },
        });
      });

      // D. Research Benchmark Cards (generic for any number of benchmark papers)
      gsap.utils.toArray<HTMLElement>("[data-aw-benchmark-card]", root).forEach(
        (benchmarkCard) => {
          const bars = benchmarkCard.querySelectorAll<HTMLElement>("[data-aw-bar]");
          gsap.fromTo(
            bars,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.05,
              stagger: 0.14,
              ease: "aw-out",
              transformOrigin: "left center",
              clearProps: "transform",
              scrollTrigger: {
                trigger: benchmarkCard,
                start: "top 86%",
                once: true,
              },
            }
          );
        }
      );

      // E. Research Pipeline Cards (generic for any number of pipeline papers)
      gsap.utils.toArray<HTMLElement>("[data-aw-pipeline-card]", root).forEach(
        (pipelineCard) => {
          const svgPath = pipelineCard.querySelector<SVGPathElement>("[data-aw-svg-line]");
          const nodes = pipelineCard.querySelectorAll<HTMLElement>("[data-aw-pipeline-node]");
        const pipeTl = gsap.timeline({
          scrollTrigger: {
            trigger: pipelineCard,
            start: "top 86%",
            once: true,
          },
        });
        if (svgPath) {
          const len = svgPath.getTotalLength();
          gsap.set(svgPath, { strokeDasharray: len, strokeDashoffset: len });
          pipeTl.to(svgPath, { strokeDashoffset: 0, duration: 0.95, ease: "aw-out" }, 0);
        }
        pipeTl.fromTo(
          nodes,
          { x: -14, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: "aw-out",
            clearProps: "transform,opacity,visibility",
          },
          0.1
        );
      });

      // F. Desktop-only (lg+) Heavy Scrub Choreography
      mm.add("(min-width: 1024px)", () => {
        root.querySelectorAll<HTMLElement>("[data-aw-clip]").forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: "inset(10% 0% 10% 0%)", scale: 1.02 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              scale: 1,
              duration: 0.95,
              ease: "aw-out",
              clearProps: "clipPath,transform",
              scrollTrigger: {
                trigger: el,
                start: "top 86%",
                once: true,
              },
            }
          );
        });

        const topSection = document.getElementById("top");
        const driftLeft = root.querySelector<HTMLElement>("[data-aw-drift-left]");
        const driftRight = root.querySelector<HTMLElement>("[data-aw-drift-right]");
        if (topSection && driftLeft && driftRight) {
          gsap.to(driftLeft, {
            xPercent: -3.5,
            opacity: 0.42,
            ease: "none",
            scrollTrigger: {
              trigger: topSection,
              start: "top top",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
          gsap.to(driftRight, {
            xPercent: 3.5,
            opacity: 0.42,
            ease: "none",
            scrollTrigger: {
              trigger: topSection,
              start: "top top",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }

        // Bide+ 3-Phone Studio Fan-Out & Counter-Parallax
        const bideStage = root.querySelector<HTMLElement>("[data-aw-bide-stage]");
        const phoneLeft = root.querySelector<HTMLElement>("[data-aw-phone-left]");
        const phoneMain = root.querySelector<HTMLElement>("[data-aw-phone-main]");
        const phoneRight = root.querySelector<HTMLElement>("[data-aw-phone-right]");
        if (bideStage && phoneLeft && phoneMain && phoneRight) {
          const phoneTl = gsap.timeline({
            scrollTrigger: {
              trigger: bideStage,
              start: "top 90%",
              end: "bottom 15%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
          phoneTl
            .fromTo(phoneMain, { y: 20 }, { y: -16, ease: "none" }, 0)
            .fromTo(
              phoneLeft,
              { x: 26, y: 54, rotate: -2 },
              { x: -16, y: -22, rotate: -5.5, ease: "none" },
              0
            )
            .fromTo(
              phoneRight,
              { x: -26, y: 66, rotate: 2 },
              { x: 16, y: -28, rotate: 5.5, ease: "none" },
              0
            );
        }

        // Sticky Depth-Stacking Archive Deck
        const sentinels = gsap.utils.toArray<HTMLElement>("[data-aw-stack-sentinel]", root);
        const inners = gsap.utils.toArray<HTMLElement>("[data-aw-card-inner]", root);
        const scrims = gsap.utils.toArray<HTMLElement>("[data-aw-card-scrim]", root);
        const imgWraps = gsap.utils.toArray<HTMLElement>("[data-aw-card-img-wrap]", root);
        const total = inners.length;
        const lastSentinel = sentinels[total - 1];
        const finalStickyTop = 24 + Math.max(0, total - 1) * 18;

        inners.forEach((inner, i) => {
          const imgWrap = imgWraps[i];
          if (imgWrap && sentinels[i]) {
            gsap.fromTo(
              imgWrap,
              { scale: 1.07 },
              {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: sentinels[i],
                  start: "top bottom",
                  end: `top ${24 + i * 18}px`,
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              }
            );
          }

          const nextSentinel = sentinels[i + 1];
          if (!nextSentinel || !lastSentinel) return;

          const depthSteps = total - 1 - i;
          const targetScale = 1 - depthSteps * 0.032;
          const targetScrim = Math.min(0.55, 0.24 + depthSteps * 0.1);

          const cardTl = gsap.timeline({
            scrollTrigger: {
              trigger: nextSentinel,
              start: "top 92%",
              endTrigger: lastSentinel,
              end: `top ${finalStickyTop + 8}px`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          cardTl.to(
            inner,
            {
              scale: targetScale,
              y: -depthSteps * 4,
              transformOrigin: "50% 0%",
              ease: "none",
            },
            0
          );

          if (scrims[i]) {
            cardTl.to(
              scrims[i],
              {
                opacity: targetScrim,
                ease: "none",
              },
              0
            );
          }
        });

        // Research Manuscript Spreads (generic for any manuscript visual)
        gsap.utils.toArray<HTMLElement>("[data-aw-book-stage]", root).forEach(
          (bookStage) => {
            const pageFront = bookStage.querySelector<HTMLElement>("[data-aw-page-front]");
            const pageBack = bookStage.querySelector<HTMLElement>("[data-aw-page-back]");
          if (pageFront && pageBack) {
            const bookTl = gsap.timeline({
              scrollTrigger: {
                trigger: bookStage,
                start: "top 88%",
                end: "bottom 25%",
                scrub: true,
                invalidateOnRefresh: true,
              },
            });
            bookTl
              .fromTo(pageFront, { x: 0, rotate: 0 }, { x: -16, rotate: -3.5, ease: "none" }, 0)
              .fromTo(pageBack, { x: 8, rotate: 2 }, { x: 34, rotate: 7.5, ease: "none" }, 0);
          }
        });

        // Experience Vertical Scroll-Driven Champagne Progress Beam
        const expBeam = root.querySelector<HTMLElement>("[data-aw-exp-beam]");
        if (expBeam && expListRef.current) {
          gsap.fromTo(
            expBeam,
            { scaleY: 0 },
            {
              scaleY: 1,
              transformOrigin: "top center",
              ease: "none",
              scrollTrigger: {
                trigger: expListRef.current,
                start: "top 72%",
                end: "bottom 75%",
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          );
        }
      });

      // Tablet & Mobile (<1024px): static editorial cards & spreads (ZERO ScrollTrigger instances on mobile = 0ms forced reflow & TBT)
      mm.add("(max-width: 1023px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-aw-book-stage]", root).forEach(
          (bookStage) => {
            const pageFront = bookStage.querySelector<HTMLElement>("[data-aw-page-front]");
            const pageBack = bookStage.querySelector<HTMLElement>("[data-aw-page-back]");
            if (pageFront && pageBack) {
              gsap.set(pageFront, { x: -10, rotate: -2.5 });
              gsap.set(pageBack, { x: 20, rotate: 5.5 });
            }
          }
        );
      });

      if (isLargeDesktop) {
        // G. Architectural hairline draws (Desktop only)
        root.querySelectorAll<HTMLElement>("[data-aw-line]").forEach((line) => {
          gsap.fromTo(
            line,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.85,
              ease: "aw-out",
              transformOrigin: "left center",
              clearProps: "transform",
              scrollTrigger: {
                trigger: line,
                start: "top 92%",
                once: true,
              },
            }
          );
        });

        // H. Calm one-shot editorial reveals (Desktop only)
        root.querySelectorAll<HTMLElement>("[data-aw-reveal]").forEach((el) => {
          gsap.fromTo(
            el,
            { y: 20, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.7,
              ease: "aw-out",
              clearProps: "transform,opacity,visibility",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                once: true,
              },
            }
          );
        });

        // I. Staggered tech stack grid cells (Desktop only)
        const stackGrid = root.querySelector<HTMLElement>("[data-aw-stack-grid]");
        if (stackGrid) {
          const tiles = stackGrid.querySelectorAll<HTMLElement>("[data-aw-stack-tile]");
          gsap.fromTo(
            tiles,
            { y: 14, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.5,
              stagger: 0.025,
              ease: "aw-out",
              clearProps: "transform,opacity,visibility",
              scrollTrigger: {
                trigger: stackGrid,
                start: "top 90%",
                once: true,
              },
            }
          );
        }

        // J. Contact Finale masked display + vertical hairline stem (Desktop only)
        const contactTitle = root.querySelector<HTMLElement>("[data-aw-contact-title]");
        if (contactTitle) {
          const contactLines = contactTitle.querySelectorAll<HTMLElement>("[data-aw-contact-line]");
          gsap.fromTo(
            contactLines,
            { yPercent: 108 },
            {
              yPercent: 0,
              duration: 0.85,
              stagger: 0.08,
              ease: "aw-out",
              clearProps: "transform",
              scrollTrigger: {
                trigger: contactTitle,
                start: "top 86%",
                once: true,
              },
            }
          );
        }

        const contactStem = root.querySelector<HTMLElement>("[data-aw-contact-stem]");
        if (contactStem) {
          gsap.fromTo(
            contactStem,
            { scaleY: 0 },
            {
              scaleY: 1,
              duration: 0.85,
              transformOrigin: "top center",
              ease: "aw-out",
              clearProps: "transform",
              scrollTrigger: {
                trigger: contactStem,
                start: "top 88%",
                once: true,
              },
            }
          );
        }
      }
    }, root);

    // --- 4. Auto-Calibrating ResizeObserver (Desktop only) ---
    let refreshTimer: number | null = null;
    const scheduleRefresh = () => {
      if (refreshTimer !== null) window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        if (!isMounted) return;
        ScrollTrigger.refresh();
      }, 180);
    };

    let resizeObserver: ResizeObserver | null = null;
    if (isLargeDesktop && typeof ResizeObserver !== "undefined") {
      let lastHeight = 0;
      resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        const nextHeight = entry?.contentRect?.height ?? 0;
        if (lastHeight > 0 && Math.abs(nextHeight - lastHeight) > 8) {
          scheduleRefresh();
        }
        lastHeight = nextHeight;
      });
      resizeObserver.observe(root);
    }

    if (isLargeDesktop) {
      document.fonts?.ready.then(() => {
        if (isMounted) {
          requestAnimationFrame(() => ScrollTrigger.refresh());
        }
      });
    }

    return () => {
      isMounted = false;
      resizeObserver?.disconnect();
      if (refreshTimer !== null) window.clearTimeout(refreshTimer);
      if (nativeScrollListener) window.removeEventListener("scroll", nativeScrollListener);
      window.removeEventListener("lenis-lock", handleLenisLock);
      marqueeTween?.kill();
      marqueeTween = null;
      mm.revert();
      ctx.revert();
      if (rafFn) gsap.ticker.remove(rafFn);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Non-stacking transition on Experience / Education switch
  useEffect(() => {
    if (!hasMountedExpRef.current) {
      hasMountedExpRef.current = true;
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const container = expListRef.current;
    let tween: gsap.core.Tween | null = null;
    if (!reduced && container) {
      const rows = container.querySelectorAll<HTMLElement>("[data-aw-exp-row]");
      gsap.killTweensOf(rows);
      tween = gsap.fromTo(
        rows,
        { y: 10, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.35,
          stagger: 0.035,
          ease: "aw-out",
          overwrite: true,
          clearProps: "transform,opacity,visibility",
        }
      );
    }
    scheduleScrollRefresh();
    return () => {
      tween?.kill();
    };
  }, [expTab, scheduleScrollRefresh]);

  // Debounced ScrollTrigger recalibration on API tab, contact form toggle, or language change
  useEffect(() => {
    if (!hasMountedMetaRef.current) {
      hasMountedMetaRef.current = true;
      return;
    }
    scheduleScrollRefresh();
  }, [apiTab, language, contactFormOpen, scheduleScrollRefresh]);

  const activeApi = API_ENDPOINTS.find((a) => a.id === apiTab) || API_ENDPOINTS[0];
  const copyCommand = () => {
    navigator.clipboard?.writeText(activeApi.command);
    setCopied(true);
    if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
    copyTimerRef.current = window.setTimeout(() => {
      copyTimerRef.current = null;
      setCopied(false);
    }, 1800);
  };
  const copyEmail = () => {
    navigator.clipboard?.writeText(SITE_IDENTITY.email);
    setEmailCopied(true);
    if (emailCopyTimerRef.current !== null) window.clearTimeout(emailCopyTimerRef.current);
    emailCopyTimerRef.current = window.setTimeout(() => {
      emailCopyTimerRef.current = null;
      setEmailCopied(false);
    }, 2000);
  };

  // Option B quick-message form submit handler (Web3Forms → Formspree → safe mailto fallback)
  const handleContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formBotcheck.trim().length > 0) {
      setFormStatus("sent");
      return;
    }
    const cleanName = formName.trim();
    const cleanEmail = formEmail.trim();
    const cleanMsg = formMessage.trim();
    if (!cleanName || !cleanEmail || !cleanMsg) return;

    if (CONTACT_FORM.web3formsAccessKey) {
      setFormStatus("submitting");
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: CONTACT_FORM.web3formsAccessKey,
            subject: `[yeraygarrido.dev] Mensaje de ${cleanName}`,
            from_name: cleanName,
            email: cleanEmail,
            message: cleanMsg,
          }),
        });
        if (res.ok) {
          setFormStatus("sent");
          setFormName("");
          setFormEmail("");
          setFormMessage("");
        } else {
          setFormStatus("error");
        }
      } catch {
        setFormStatus("error");
      }
      return;
    }

    if (CONTACT_FORM.formspreeEndpoint) {
      setFormStatus("submitting");
      try {
        const res = await fetch(CONTACT_FORM.formspreeEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ name: cleanName, email: cleanEmail, message: cleanMsg }),
        });
        if (res.ok) {
          setFormStatus("sent");
          setFormName("");
          setFormEmail("");
          setFormMessage("");
        } else {
          setFormStatus("error");
        }
      } catch {
        setFormStatus("error");
      }
      return;
    }

    // Zero-backend clean fallback: opens user's email client with pre-filled subject & body
    const subject = encodeURIComponent(`Contacto desde yeraygarrido.dev — ${cleanName}`);
    const body = encodeURIComponent(
      `Nombre: ${cleanName}\nEmail: ${cleanEmail}\n\n${cleanMsg}`
    );
    window.location.href = `mailto:${SITE_IDENTITY.email}?subject=${subject}&body=${body}`;
    setFormStatus("mailto");
  };

  const navItems = [
    { id: "work", num: "01", label: { es: "Proyectos", en: "Projects", eu: "Proiektuak" } },
    { id: "about", num: "02", label: { es: "Servicios", en: "Services", eu: "Zerbitzuak" } },
    { id: "experience", num: "03", label: { es: "Experiencia", en: "Experience", eu: "Esperientzia" } },
    { id: "research", num: "04", label: { es: "Investigación", en: "Research", eu: "Ikerketa" } },
    { id: "api", num: "05", label: { es: "GitHub & API", en: "GitHub & API", eu: "GitHub & API" } },
    { id: "contact", num: "06", label: { es: "Contacto", en: "Contact", eu: "Kontaktua" } },
  ];

  const introFeatures = [
    { num: "01", title: t("intro.feat1.title"), desc: t("intro.feat1.desc") },
    { num: "02", title: t("intro.feat2.title"), desc: t("intro.feat2.desc") },
    { num: "03", title: t("intro.feat3.title"), desc: t("intro.feat3.desc") },
    { num: "04", title: t("intro.feat4.title"), desc: t("intro.feat4.desc") },
  ];

  const workJobs = WORK_EXPERIENCE.map((item) => ({
    id: item.id,
    title: loc(item.title, language),
    company: loc(item.company, language),
    date: loc(item.date, language),
    desc: loc(item.desc, language),
  }));

  const eduItems = EDUCATION_HISTORY.map((item) => ({
    id: item.id,
    title: loc(item.title, language),
    company: loc(item.company, language),
    date: loc(item.date, language),
    desc: loc(item.desc, language),
  }));

  const shownTimeline = expTab === "work" ? workJobs : eduItems;

  const ui = {
    openBide: { es: "Bideplus (Bide+) ↗", en: "Bideplus (Bide+) ↗", eu: "Bideplus (Bide+) ↗" },
    fullCase: { es: "Caso técnico →", en: "Technical case →", eu: "Kasu teknikoa →" },
    readPapers: {
      es: `Leer ${RESEARCH_PAPERS.length} papers ↓`,
      en: `Read ${RESEARCH_PAPERS.length} papers ↓`,
      eu: `Irakurri ${RESEARCH_PAPERS.length} paper ↓`,
    },
    researchBadge: {
      es: "Publicaciones Científicas · Open Science",
      en: "Scientific Publications · Open Science",
      eu: "Argitalpen Zientifikoak · Open Science",
    },
    researchTitle: { es: "Investigación", en: "Research", eu: "Ikerketa" },
    researchArchiveCta: {
      es: "Archivo académico · Scholar ↗",
      en: "Academic Archive · Scholar ↗",
      eu: "Artxibo akademikoa · Scholar ↗",
    },
    scholarPage: { es: "Ficha académica ↗", en: "Paper page ↗", eu: "Fitxa akademikoa ↗" },
    summary: { es: "Resumen:", en: "Summary:", eu: "Laburpena:" },
    downloadPdf: { es: "Descargar PDF", en: "Download PDF", eu: "PDF Deskargatu" },
    readingPdf: { es: "PDF (Lectura)", en: "PDF (Reading)", eu: "PDF (Irakurketa)" },
    supplementPdf: { es: "Material suplementario", en: "Supplementary material", eu: "Material osagarria" },
    code: { es: "Código (GitHub)", en: "Code (GitHub)", eu: "Kodea (GitHub)" },
    archiveEyebrow: {
      es: "02 / PROYECTOS DESTACADOS",
      en: "02 / FEATURED PROJECTS",
      eu: "02 / PROIEKTU NABARMENDUAK",
    },
    timelineEyebrow: {
      es: "04 / TRAYECTORIA",
      en: "04 / TIMELINE",
      eu: "04 / IBILBIDEA",
    },
    devEyebrow: {
      es: "06 / PARA DESARROLLADORES",
      en: "06 / FOR DEVELOPERS",
      eu: "06 / GARATZAILEENTZAT",
    },
    supportTitle: {
      es: "¿Te ha servido alguno de mis servicios gratuitos?",
      en: "Has one of my free services been useful to you?",
      eu: "Lagungarri izan zaizu nire doako zerbitzuren bat?",
    },
    supportText: {
      es: "Gasolinera+ y Bide+ son gratuitos. Puedes contribuir invitándome a un café.",
      en: "Gasolinera+ and Bide+ are free. You can contribute by buying me a coffee.",
      eu: "Gasolinera+ eta Bide+ doakoak dira. Lagun dezakezu kafe batera gonbidatuz.",
    },
    supportKofi: {
      es: "INVITAR A UN CAFÉ ↗",
      en: "BUY ME A COFFEE ↗",
      eu: "GONBIDATU KAFE BAT ↗",
    },
    contactEyebrow: {
      es: "07 / CONTACTO",
      en: "07 / CONTACT",
      eu: "07 / KONTAKTUA",
    },
    footerLinksTitle: {
      es: "Enlaces",
      en: "Links",
      eu: "Estekak",
    },
    openCase: { es: "EXPLORAR ↗", en: "EXPLORE ↗", eu: "IKUSI ↗" },
    menuTitle: { es: "NAVEGACIÓN", en: "NAVIGATION", eu: "NABIGAZIOA" },
    languageLabel: { es: "Idioma", en: "Language", eu: "Hizkuntza" },
    writeHere: {
      es: "Escribir mensaje aquí",
      en: "Write a message here",
      eu: "Idatzi mezua hemen",
    },
    closeForm: {
      es: "Ocultar formulario",
      en: "Hide form",
      eu: "Ezkutatu formularioa",
    },
    formName: { es: "Nombre", en: "Name", eu: "Izena" },
    formNamePlaceholder: { es: "Tu nombre o empresa", en: "Your name or company", eu: "Zure izena edo enpresa" },
    formEmail: { es: "Email", en: "Email", eu: "Posta elektronikoa" },
    formEmailPlaceholder: { es: "nombre@empresa.com", en: "name@company.com", eu: "izena@enpresa.com" },
    formMsg: { es: "Mensaje", en: "Message", eu: "Mezua" },
    formMsgPlaceholder: {
      es: "Cuéntame brevemente el proyecto, puesto o consulta...",
      en: "Briefly describe your project, role, or inquiry...",
      eu: "Kontatu laburki zure proiektua, lanpostua edo kontsulta...",
    },
    formSend: { es: "Enviar mensaje →", en: "Send message →", eu: "Bidali mezua →" },
    formSending: { es: "Enviando...", en: "Sending...", eu: "Bidaltzen..." },
    formSent: {
      es: "Mensaje enviado correctamente. Te responderé lo antes posible.",
      en: "Message sent successfully. I will reply as soon as possible.",
      eu: "Mezua behar bezala bidali da. Ahalik eta lasterren erantzungo dizut.",
    },
    formMailtoNotice: {
      es: "Se ha preparado el mensaje en tu cliente de correo. Si no se abrió, copia mi dirección arriba.",
      en: "Your email client has been opened with the message ready to send. If it didn't open, copy my address above.",
      eu: "Mezua zure posta bezeroan prestatu da. Ireki ez bada, kopiatu nire helbidea goian.",
    },
    formError: {
      es: "No se pudo enviar automáticamente. Escríbeme directamente a garridoparrayeraytx@gmail.com.",
      en: "Could not send automatically. Please email garridoparrayeraytx@gmail.com directly.",
      eu: "Ezin izan da automatikoki bidali. Idatzi zuzenean garridoparrayeraytx@gmail.com helbidera.",
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

  const btnChampagneOutline = {
    "--aw-btn-fill": "#D6C7B2",
    "--aw-btn-hover-text": "#09090B",
  } as CSSProperties;

  const btnPrimaryOnLight = {
    "--aw-btn-fill": "#7A6648",
    "--aw-btn-hover-text": "#F6F4EF",
  } as CSSProperties;

  const handleCardKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>, project: ProjectItem) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveProject(project);
    }
  };

  const githubKpiStrip = [
    { value: String(ghStats.publicRepos), suffix: "+", label: t("stats.repos") },
    { value: String(ghStats.estimatedCommits), suffix: "+", label: t("stats.commits") },
    { value: String(RESEARCH_PAPERS.length), suffix: "", label: t("stats.papers") },
    { value: String(ghStats.followers), suffix: "", label: t("stats.followers") },
  ];

  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-[#09090B] text-[#F6F4EF] font-sans antialiased selection:bg-[#D6C7B2] selection:text-[#09090B]"
    >
      {/* Subtle Film Grain — Desktop ONLY (0% mobile GPU cost) */}
      <div
        aria-hidden="true"
        className="hidden lg:block fixed inset-0 z-[70] pointer-events-none opacity-[0.024]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Architectural Opening Curtain with 00→100 Counter (Desktop lg+ only — zero flash on mobile) */}
      <div
        ref={curtainRef}
        aria-hidden="true"
        className="hidden lg:flex fixed inset-0 z-[100] bg-[#F6F4EF] text-[#09090B] items-center justify-center pointer-events-none px-6"
      >
        <div ref={curtainInnerRef} className="w-full max-w-md space-y-5">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="font-editorial italic font-normal text-4xl sm:text-5xl tracking-[-0.03em] leading-none text-[#09090B]">
                {SITE_IDENTITY.brandName}
              </div>
              <div className="font-mono text-sm uppercase tracking-[0.22em] text-[#09090B]/60 mt-2">
                {SITE_IDENTITY.cityLabel} / {new Date().getFullYear()}
              </div>
            </div>
            <span
              ref={curtainCounterRef}
              className="font-mono text-3xl sm:text-4xl font-semibold tabular-nums text-[#09090B]"
            >
              00
            </span>
          </div>
          <div className="h-[2px] w-full bg-[#09090B]/15 overflow-hidden">
            <div ref={curtainBarRef} className="h-full w-full bg-[#09090B]" />
          </div>
        </div>
      </div>

      {/* Top Hairline Scroll Progress */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-white/10 z-[90] pointer-events-none">
        <div ref={progressRef} className="h-full bg-[#D6C7B2] origin-left scale-x-0" />
      </div>

      {/* =====================================================================
          HEADER — FIXED TOP BAR ON BOTH DESKTOP & MOBILE (ALWAYS VISIBLE, NEVER BREAKS ON BODY LOCK)
         ===================================================================== */}
      <header className="fixed top-0 left-0 right-0 z-[80] bg-[#09090B]/95 backdrop-blur-md border-b border-white/14">
        <div className="max-w-[1520px] mx-auto px-5 sm:px-8 lg:px-12 h-16 sm:h-20 lg:h-24 flex items-center justify-between gap-4 xl:gap-8">
          {/* Left: Logo + Name */}
          <a
            href="#top"
            onClick={(e) => scrollToSection(e, "top")}
            className="flex items-center gap-4 sm:gap-5 min-h-[44px] shrink-0"
            aria-label={t("header.home")}
          >
            <img
              src="/img/logo.webp"
              width={720}
              height={281}
              alt={t("header.logoAlt")}
              className="h-6 sm:h-7 lg:h-8 w-auto shrink-0"
            />
            <span className="font-grotesk font-semibold text-base sm:text-lg tracking-[0.1em] uppercase text-[#F6F4EF] whitespace-nowrap">
              {SITE_IDENTITY.brandName}
            </span>
          </a>

          {/* Center: Clear Desktop Main Navigation (always accessible, zero floating bottom dock overlap) */}
          <nav
            aria-label="Navegación principal"
            className="hidden lg:flex items-center gap-1 xl:gap-2"
          >
            {navItems
              .filter((n) => n.id !== "api")
              .map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  ref={(el) => {
                    dockLinkRefs.current[n.id] = el;
                  }}
                  data-active="false"
                  onClick={(e) => scrollToSection(e, n.id)}
                  className="aw-nav-link px-3.5 xl:px-4 py-2.5 text-[15px] xl:text-base font-medium whitespace-nowrap text-[#F6F4EF]/78 hover:text-[#F6F4EF] data-[active=true]:text-[#D6C7B2]"
                >
                  {loc(n.label, language)}
                </a>
              ))}
          </nav>

          {/* Right: Desktop Square Segmented Language Box + CV | Mobile Animated Hamburger→X */}
          <div className="flex items-center gap-3.5 xl:gap-4 shrink-0">
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
                  href={`#${n.id}`}
                  onClick={(e) => scrollToSection(e, n.id)}
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
          00 · ARCHITECTURAL HERO (Clear Above-the-Fold UX, Zero Overlapping Dock)
         ===================================================================== */}
      <main className="pt-16 sm:pt-20 lg:pt-24">
        <section
          id="top"
          className="relative overflow-hidden px-5 sm:px-8 lg:px-12 pt-8 sm:pt-12 lg:pt-12 pb-16 sm:pb-24"
        >
          <div className="relative z-10 max-w-[1520px] mx-auto w-full flex flex-col gap-8 lg:gap-10">
            {/* Meta Top Line — Centered on mobile, split on desktop */}
            <div
              data-aw-hero-fade
              className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-between gap-2 sm:gap-3 text-center lg:text-left font-mono text-sm sm:text-base uppercase tracking-[0.12em] text-[#D6C7B2]"
            >
              <span>{t("hero.role")}</span>
              <span className="text-[#F6F4EF]/70">
                {t("hero.portfolio", { year: new Date().getFullYear().toString() })}
              </span>
            </div>

            {/* Editorial Lockup + Substantial Latest Release Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
              <div
                className={`${
                  LATEST_RELEASE.enabled ? "lg:col-span-7" : "lg:col-span-12"
                } text-center lg:text-left`}
              >
                <h1 className="select-none">
                  <span data-aw-drift-left className="block">
                    <span className="block overflow-hidden py-1 -my-1">
                      <span
                        data-aw-hero-line
                        className="block font-editorial font-semibold uppercase tracking-[-0.035em] leading-[0.86] text-[clamp(4.2rem,14vw,9.6rem)] text-[#F6F4EF]"
                      >
                        {SITE_IDENTITY.heroFirstName}
                      </span>
                    </span>
                  </span>
                  <span data-aw-drift-right className="block">
                    <span className="block overflow-hidden py-3 -my-3 px-2 -mx-2 -mt-[0.06em] lg:pl-[0.12em]">
                      <span
                        data-aw-hero-line
                        className="block font-editorial italic font-normal tracking-[-0.035em] leading-[0.88] text-[clamp(4.4rem,14.5vw,10rem)] text-[#D6C7B2]"
                      >
                        {SITE_IDENTITY.heroLastName}
                      </span>
                    </span>
                  </span>
                </h1>
              </div>

              {LATEST_RELEASE.enabled && (
                <aside
                  data-aw-hero-card
                  className="lg:col-span-5 aw-launch-frame bg-[#111114] p-6 flex flex-col gap-5"
                >
                  <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-white/14 font-mono text-sm uppercase tracking-[0.14em]">
                    <span className="text-[#D6C7B2] font-semibold">
                      {loc(LATEST_RELEASE.eyebrow, language)}
                    </span>
                    <span className="text-[#F6F4EF]/70">{LATEST_RELEASE.metaRight}</span>
                  </div>

                  {(() => {
                    const releaseMedia =
                      LATEST_RELEASE.frameType === "mobile" ? (
                        <div className="pt-5 px-6 flex justify-center h-[235px]">
                          <div className="w-[172px] transition-transform duration-500 ease-out group-hover:-translate-y-2">
                            <MobileHardwareFrame
                              src={LATEST_RELEASE.image}
                              alt={LATEST_RELEASE.imageAlt}
                              size="compact"
                              priority={true}
                            />
                          </div>
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#0B0B0D] to-transparent"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[16/10] w-full">
                          <img
                            src={LATEST_RELEASE.image}
                            alt={LATEST_RELEASE.imageAlt}
                            className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                          />
                        </div>
                      );

                    if (LATEST_RELEASE.scrollTarget) {
                      return (
                        <a
                          href={`#${LATEST_RELEASE.scrollTarget}`}
                          onClick={(e) => scrollToSection(e, LATEST_RELEASE.scrollTarget!)}
                          className="relative bg-[#0B0B0D] border border-white/10 overflow-hidden group block"
                        >
                          {releaseMedia}
                        </a>
                      );
                    }
                    if (latestReleaseProject) {
                      return (
                        <button
                          type="button"
                          onClick={() => setActiveProject(latestReleaseProject)}
                          className="relative w-full text-left bg-[#0B0B0D] border border-white/10 overflow-hidden group block cursor-pointer"
                        >
                          {releaseMedia}
                        </button>
                      );
                    }
                    return (
                      <a
                        href={LATEST_RELEASE.ctaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative bg-[#0B0B0D] border border-white/10 overflow-hidden group block"
                      >
                        {releaseMedia}
                      </a>
                    );
                  })()}

                  <div className="flex items-center justify-between gap-4 pt-1">
                    <div>
                      <div className="font-grotesk font-semibold text-lg sm:text-xl leading-tight text-[#F6F4EF]">
                        {loc(LATEST_RELEASE.title, language)}
                      </div>
                      <div className="font-mono text-sm sm:text-base text-[#D6C7B2] mt-1">
                        {loc(LATEST_RELEASE.subtitle, language)}
                      </div>
                    </div>
                    <a
                      href={LATEST_RELEASE.ctaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={btnDarkOnIvory}
                      className="aw-btn shrink-0 bg-[#F6F4EF] text-[#09090B] font-semibold text-base px-5 min-h-[48px] inline-flex items-center"
                    >
                      <SlotLabel text={loc(LATEST_RELEASE.ctaLabel, language)} />
                    </a>
                  </div>
                </aside>
              )}
            </div>

            {/* Editorial Bottom Row: Bio + Sharp Ink-Wipe Slot-Roll CTAs */}
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
                <p className="lg:col-span-6 text-[17px] sm:text-[19px] lg:text-[20px] text-[#F6F4EF]/85 leading-[1.72] max-w-[60ch] mx-auto lg:mx-0 text-center lg:text-justify hyphens-auto">
                  {t("intro.desc1")}
                </p>
                <div className="lg:col-span-6 flex flex-wrap justify-center lg:justify-end gap-3">
                  <a
                    href={`/CV_YerayGarrido_${language}.pdf`}
                    download={`CV_YerayGarrido_${language.toUpperCase()}.pdf`}
                    style={btnDarkOnIvory}
                    className="aw-btn bg-[#F6F4EF] text-[#09090B] font-semibold text-base px-7 sm:px-8 py-4 min-h-[54px] inline-flex items-center"
                  >
                    <SlotLabel text={`↓ ${t("hero.downloadCv")}`} />
                  </a>
                  <a
                    href={SITE_IDENTITY.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={btnOutlineOnDark}
                    className="aw-btn border border-white/30 text-[#F6F4EF] font-medium text-base px-6 sm:px-7 py-4 min-h-[54px] inline-flex items-center"
                  >
                    <SlotLabel text={`${t("hero.githubProfile")} ↗`} />
                  </a>
                  <TearLink
                    href={SITE_IDENTITY.photographyUrl}
                    ariaLabel={t("hero.photographyProfile")}
                    className="aw-btn border border-[#D6C7B2]/45 text-[#D6C7B2] font-medium text-base px-6 sm:px-7 py-4 min-h-[54px] inline-flex items-center"
                  >
                    <SlotLabel text={`${t("hero.photographyProfile")} ↗`} />
                  </TearLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            01 · FLAGSHIP PRODUCT STAGE (Configurado 100% en FLAGSHIP_PRODUCT)
           ===================================================================== */}
        <section id="work" className="bg-[#09090B] border-t border-white/12 overflow-x-clip">
          {FLAGSHIP_PRODUCT.enabled && activeFlagshipScreen && (
          <div id="flagship-product" className="py-16 sm:py-24 lg:py-28 px-5 sm:px-8 lg:px-16">
            <div className="max-w-[1440px] mx-auto space-y-12 lg:space-y-16">
              <div
                data-aw-reveal
                className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/12"
              >
                <div>
                  <span className="font-mono text-sm uppercase tracking-[0.2em] text-[#D6C7B2] block mb-3">
                    {loc(FLAGSHIP_PRODUCT.eyebrow, language)}
                  </span>
                  <h2 className="font-editorial font-semibold text-5xl sm:text-6xl lg:text-7xl tracking-[-0.03em] leading-[1.0]">
                    {FLAGSHIP_PRODUCT.titleMain}{" "}
                    <span className="font-editorial italic font-normal text-[#D6C7B2]">
                      {loc(FLAGSHIP_PRODUCT.titleAccent, language)}
                    </span>
                  </h2>
                </div>

                <div className="font-mono text-sm uppercase tracking-[0.16em] text-[#F6F4EF]/65 lg:text-right">
                  <div>{FLAGSHIP_PRODUCT.domainLabel}</div>
                  <div className="text-[#D6C7B2] mt-1">{FLAGSHIP_PRODUCT.metaSubtitle}</div>
                </div>
              </div>

              <div
                data-aw-bide-stage
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
              >
                <div className="lg:col-span-7 space-y-5">
                  <div
                    data-aw-clip
                    className="relative bg-[#0E0E12] border border-white/12 px-4 sm:px-8 pt-8 sm:pt-10 pb-7 overflow-hidden"
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-[0.06]"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #F6F4EF 1px, transparent 1px), linear-gradient(to bottom, #F6F4EF 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                      }}
                    />

                    {FLAGSHIP_PRODUCT.showcaseMode === "desktop-gallery" ? (
                      <div className="relative z-10">
                        <div ref={bideCenterPhoneRef}>
                          <a
                            href={FLAGSHIP_PRODUCT.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block aspect-[16/10] overflow-hidden border border-white/15 bg-[#09090B] shadow-[0_24px_70px_rgba(0,0,0,0.75)]"
                          >
                            <img
                              src={activeFlagshipScreen.image}
                              alt={`${FLAGSHIP_PRODUCT.titleMain} — ${activeFlagshipScreen.name}`}
                              className="w-full h-full object-cover object-top"
                            />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="relative z-10 flex items-center justify-center min-h-[410px] sm:min-h-[490px]">
                        {totalFlagshipScreens > 1 && leftFlagshipScreen && (
                          <button
                            type="button"
                            data-aw-phone-left
                            onClick={() => setBideScreenIdx(leftFlagshipIdx)}
                            aria-label={`Ver ${leftFlagshipScreen.name}`}
                            className="hidden sm:block w-[165px] xl:w-[190px] -mr-8 xl:-mr-10 opacity-75 hover:opacity-100 transition-opacity duration-300 cursor-pointer z-10 text-left"
                          >
                            <MobileHardwareFrame
                              src={leftFlagshipScreen.image}
                              alt={leftFlagshipScreen.name}
                              size="flank"
                            />
                          </button>
                        )}

                        <div
                          data-aw-phone-main
                          className="relative z-20 w-[235px] sm:w-[248px] xl:w-[272px]"
                        >
                          <div ref={bideCenterPhoneRef}>
                            <a
                              href={FLAGSHIP_PRODUCT.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <MobileHardwareFrame
                                src={activeFlagshipScreen.image}
                                alt={`${FLAGSHIP_PRODUCT.titleMain} — ${activeFlagshipScreen.name}`}
                                size="hero"
                              />
                            </a>
                          </div>
                        </div>

                        {totalFlagshipScreens > 1 && rightFlagshipScreen && (
                          <button
                            type="button"
                            data-aw-phone-right
                            onClick={() => setBideScreenIdx(rightFlagshipIdx)}
                            aria-label={`Ver ${rightFlagshipScreen.name}`}
                            className="hidden sm:block w-[165px] xl:w-[190px] -ml-8 xl:-ml-10 opacity-75 hover:opacity-100 transition-opacity duration-300 cursor-pointer z-10 text-left"
                          >
                            <MobileHardwareFrame
                              src={rightFlagshipScreen.image}
                              alt={rightFlagshipScreen.name}
                              size="flank"
                            />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Interactive Screen Index Bar (shown automatically when there are multiple screens) */}
                    {totalFlagshipScreens > 1 && (
                      <div className="relative z-20 mt-6 pt-5 border-t border-white/12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-1">
                          {flagshipScreens.map((screen, idx) => (
                            <button
                              key={screen.id}
                              type="button"
                              onClick={() => {
                                if (idx !== safeFlagshipIdx) setBideScreenIdx(idx);
                              }}
                              className={`font-mono text-xs sm:text-sm px-3 py-2 min-h-[42px] border cursor-pointer transition-colors ${
                                safeFlagshipIdx === idx
                                  ? "bg-[#F6F4EF] text-[#09090B] border-[#F6F4EF] font-bold"
                                  : "bg-transparent text-[#F6F4EF]/75 border-white/15 hover:border-white/45 hover:text-white"
                              }`}
                            >
                              {screen.name}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setBideScreenIdx(leftFlagshipIdx)}
                            aria-label="Pantalla anterior"
                            className="w-10 h-10 border border-white/20 hover:bg-[#F6F4EF] hover:text-[#09090B] font-mono text-base flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <IconGlyph name="left" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setBideScreenIdx(rightFlagshipIdx)}
                            aria-label="Siguiente pantalla"
                            className="w-10 h-10 border border-white/20 hover:bg-[#F6F4EF] hover:text-[#09090B] font-mono text-base flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <IconGlyph name="right" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="font-mono text-sm sm:text-base text-[#F6F4EF]/75 leading-relaxed">
                    {loc(activeFlagshipScreen.caption, language)}
                  </p>
                </div>

                {/* Right 5 cols: Description + Telemetry Matrix + CTAs */}
                <div data-aw-reveal className="lg:col-span-5 space-y-7">
                  <p className="text-[17px] sm:text-[19px] lg:text-[20px] text-[#F6F4EF]/88 leading-[1.72] text-editorial">
                    {loc(flagshipProject.desc, language)}
                  </p>

                  {FLAGSHIP_PRODUCT.metrics.length > 0 && (
                    <div className="grid grid-cols-2 border-t border-l border-white/15">
                      {FLAGSHIP_PRODUCT.metrics.map((metric, idx) => (
                        <div key={idx} className="bg-[#111114] border-r border-b border-white/15 p-5 text-center">
                          <div
                            data-aw-count
                            data-target={metric.target}
                            data-suffix={metric.suffix}
                            data-format={metric.format}
                            className={`font-grotesk font-bold text-3xl sm:text-4xl tabular-nums ${
                              metric.accent ? "text-[#D6C7B2]" : "text-[#F6F4EF]"
                            }`}
                          >
                            {metric.fallbackText}
                          </div>
                          <div className="text-sm text-[#F6F4EF]/75 mt-1 leading-snug">
                            {loc(metric.label, language)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {flagshipProject.tech
                      .split(", ")
                      .slice(0, 6)
                      .map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-sm bg-white/[0.04] border border-white/15 px-3 py-1 text-[#F6F4EF]/85"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <a
                      href={FLAGSHIP_PRODUCT.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={btnDarkOnIvory}
                      className="aw-btn bg-[#F6F4EF] text-[#09090B] font-semibold text-base px-7 py-4 min-h-[52px] inline-flex items-center"
                    >
                      <SlotLabel text={loc(FLAGSHIP_PRODUCT.ctaLabel, language)} />
                    </a>
                    <button
                      type="button"
                      onClick={() => setActiveProject(flagshipProject)}
                      style={btnOutlineOnDark}
                      className="aw-btn border border-white/30 text-[#F6F4EF] font-medium text-base px-6 py-4 min-h-[52px] inline-flex items-center cursor-pointer"
                    >
                      <SlotLabel text={loc(ui.fullCase, language)} />
                    </button>
                    {FLAGSHIP_PRODUCT.secondaryCta && (
                      <a
                        href={
                          FLAGSHIP_PRODUCT.secondaryCta.isAnchor
                            ? `#${FLAGSHIP_PRODUCT.secondaryCta.href}`
                            : FLAGSHIP_PRODUCT.secondaryCta.href
                        }
                        onClick={
                          FLAGSHIP_PRODUCT.secondaryCta.isAnchor
                            ? (e) => scrollToSection(e, FLAGSHIP_PRODUCT.secondaryCta!.href)
                            : undefined
                        }
                        target={FLAGSHIP_PRODUCT.secondaryCta.isAnchor ? undefined : "_blank"}
                        rel={FLAGSHIP_PRODUCT.secondaryCta.isAnchor ? undefined : "noopener noreferrer"}
                        style={btnChampagneOutline}
                        className="aw-btn border border-[#D6C7B2]/45 text-[#D6C7B2] font-medium text-base px-5 py-4 min-h-[52px] inline-flex items-center"
                      >
                        <SlotLabel
                          text={loc(FLAGSHIP_PRODUCT.secondaryCta.label, language).replace(
                            "{papersCount}",
                            String(RESEARCH_PAPERS.length)
                          )}
                        />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* VELOCITY-REACTIVE EDITORIAL MARQUEE RIBBON (auto-pauses off-screen) */}
          <div
            data-aw-marquee-wrap
            aria-hidden="true"
            className="border-y border-white/12 bg-[#0E0E12] py-5 overflow-hidden select-none"
          >
            <div data-aw-marquee-track className="flex w-max items-center">
              {[0, 1].map((dup) => (
                <div key={dup} className="flex items-center shrink-0">
                  {MARQUEE_ITEMS.map((item, idx) => (
                    <span key={`${dup}-${idx}`} className="inline-flex items-center gap-8 px-6">
                      <span className="font-mono text-sm uppercase tracking-[0.22em] text-[#F6F4EF]/75">
                        {item}
                      </span>
                      <span className="font-mono text-sm text-[#D6C7B2]">/</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================================
            02 · PROYECTOS DESTACADOS (ARCHIVE_PLATES)
           ===================================================================== */}
        <section id="projects" className="bg-[#09090B] border-t border-white/12 overflow-x-clip">
          {/* =====================================================================
              02 · SELECTED ARCHIVE — SHARP SQUARE STICKY DEPTH-STACK
             ===================================================================== */}
          <div className="py-16 sm:py-24 lg:py-28 px-4 sm:px-8 lg:px-16">
            <div className="max-w-[1440px] mx-auto">
              <div
                data-aw-reveal
                className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-18 px-1 sm:px-2"
              >
                <div>
                  <span className="font-mono text-sm uppercase tracking-[0.2em] text-[#D6C7B2] block mb-3">
                    {loc(ui.archiveEyebrow, language)}
                  </span>
                  <h2 className="font-editorial font-bold text-5xl sm:text-6xl lg:text-7xl tracking-[-0.02em] leading-[1.0]">
                    {t("projects.title")}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCatalogOpen(true)}
                  style={btnOutlineOnDark}
                  className="aw-btn self-start md:self-auto border border-white/30 text-[#F6F4EF] text-base font-medium px-7 py-3.5 min-h-[50px] cursor-pointer"
                >
                  <SlotLabel text={`${t("projects.viewAll")} (${ALL_PROJECTS.length}) +`} />
                </button>
              </div>

              <div className="relative">
                {archivePlates.map(({ project, imageOverride, badge, highlight }, idx) => (
                  <Fragment key={project.id}>
                    <div
                      data-aw-stack-sentinel
                      className="h-0 pointer-events-none"
                      aria-hidden="true"
                    />
                    <article
                      style={{ top: `${24 + Math.min(idx, 5) * 18}px`, zIndex: idx + 1 }}
                      className="lg:sticky mb-8 sm:mb-10 lg:mb-16 last:mb-0"
                    >
                      <div
                        role="button"
                        tabIndex={0}
                        data-aw-card-inner
                        onClick={() => setActiveProject(project)}
                        onKeyDown={(e) => handleCardKeyDown(e, project)}
                        className="relative origin-top bg-[#111114] border border-white/15 overflow-hidden cursor-pointer group shadow-[0_24px_70px_rgba(0,0,0,0.72)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6C7B2]"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px] lg:h-[min(580px,calc(100svh-190px))]">
                          <div className="lg:col-span-7 relative bg-[#0B0B0D] overflow-hidden min-h-[240px] sm:min-h-[340px] lg:h-full border-b lg:border-b-0 lg:border-r border-white/12">
                            <div data-aw-card-img-wrap className="w-full h-full">
                              <img
                                src={imageOverride || project.imageUrl || project.images?.[0]}
                                alt={loc(project.title, language)}
                                loading="lazy"
                                className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] ${
                                  (imageOverride || project.imageUrl || "").endsWith(".gif")
                                    ? "object-center"
                                    : "object-top"
                                }`}
                              />
                            </div>
                            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                              <span className="bg-[#09090B]/94 lg:backdrop-blur-md border border-white/20 px-3.5 py-1.5 font-mono text-xs sm:text-sm text-[#F6F4EF]">
                                {String(idx + 1).padStart(2, "0")} / {String(archivePlates.length).padStart(2, "0")} · {project.year}
                              </span>
                              {badge && (
                                <span className="bg-[#09090B]/95 lg:backdrop-blur-md border border-[#D6C7B2]/50 px-3.5 py-1.5 font-mono text-xs sm:text-sm uppercase tracking-wider font-semibold text-[#D6C7B2]">
                                  {loc(badge, language)}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="lg:col-span-5 p-6 sm:p-10 lg:p-11 flex flex-col justify-between gap-6">
                            <div className="space-y-4">
                              <span className="font-mono text-sm uppercase tracking-wider text-[#D6C7B2] block">
                                {loc(project.role, language)}
                              </span>
                              <h3 className="font-grotesk font-bold text-3xl sm:text-4xl xl:text-5xl tracking-[-0.025em] leading-[1.04] text-[#F6F4EF]">
                                {loc(project.title, language)}
                              </h3>
                              <p className="text-base sm:text-lg text-[#F6F4EF]/85 leading-[1.68] line-clamp-4 text-left text-pretty">
                                {loc(project.desc, language)}
                              </p>
                              {highlight && (
                                <div className="bg-white/[0.04] border-l-2 border-[#D6C7B2] px-4 py-2.5 font-mono text-sm text-[#F6F4EF]/90">
                                  {loc(highlight, language)}
                                </div>
                              )}
                              <div className="flex flex-wrap gap-2 pt-1">
                                {project.tech
                                  .split(", ")
                                  .slice(0, 5)
                                  .map((tag) => (
                                    <span
                                      key={tag}
                                      className="font-mono text-sm bg-white/[0.04] border border-white/15 px-3 py-1 text-[#F6F4EF]/85"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                              </div>
                            </div>

                            <div className="pt-5 border-t border-white/12 flex flex-wrap items-center justify-between gap-3 text-lg sm:text-xl font-semibold">
                              <span className="text-[#F6F4EF] group-hover:text-[#D6C7B2] transition-colors inline-flex items-center gap-2">
                                <span>
                                  {language === "en"
                                    ? "Open case study"
                                    : language === "eu"
                                      ? "Ikusi kasua"
                                      : "Abrir caso completo"}
                                </span>
                                <IconGlyph name="right" />
                              </span>
                              {project.demoUrl ? (
                                <a
                                  href={project.demoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="font-mono text-base sm:text-lg font-medium text-[#D6C7B2] hover:text-white underline underline-offset-4 decoration-[#D6C7B2]/50 transition-colors inline-flex items-center gap-1.5 min-h-[44px] py-2 px-1"
                                >
                                  <span>
                                    {project.demoUrl
                                      .replace(/^https?:\/\/(www\.)?/, "")
                                      .replace(/\/$/, "")}
                                  </span>
                                  <IconGlyph name="up-right" />
                                </a>
                              ) : (
                                <span className="font-mono text-base sm:text-lg text-[#F6F4EF]/55">
                                  {project.year}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div
                          data-aw-card-scrim
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-[#09090B] opacity-0"
                        />
                      </div>
                    </article>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            03 · INTRO, TECHNICAL EXPERTISE & STACK (Pure White #FFFFFF)
           ===================================================================== */}
        <section
          id="about"
          className="bg-white text-[#09090B] py-20 sm:py-32 lg:py-36 px-5 sm:px-8 lg:px-16 border-t border-[#09090B]/12 overflow-x-clip"
        >
          <div className="max-w-[1400px] mx-auto space-y-20 sm:space-y-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              <div data-aw-reveal className="lg:col-span-5 space-y-6">
                <span className="font-mono text-sm uppercase tracking-[0.2em] text-[#7A6648] font-semibold block">
                  03 / {t("intro.expertise1")} {t("intro.expertise2")}
                </span>
                <h2 className="font-editorial font-semibold text-5xl sm:text-6xl lg:text-7xl tracking-[-0.03em] leading-[0.98] uppercase">
                  {t("intro.title1")} <br />
                  <span className="font-editorial italic font-normal normal-case text-[#7A6648] tracking-[-0.025em]">
                    {t("intro.title2")}
                  </span>
                </h2>
                <p className="text-lg sm:text-xl text-[#09090B]/85 leading-[1.72] text-left text-pretty">
                  {t("intro.desc1")}
                </p>
                <div className="pt-6 space-y-3 border-t border-[#09090B]/15">
                  <h3 className="font-editorial font-bold text-3xl sm:text-4xl uppercase tracking-[-0.015em]">
                    {t("intro.subtitle1")} {t("intro.subtitle2")}
                  </h3>
                  <p className="text-lg sm:text-xl text-[#09090B]/85 leading-[1.72] text-left text-pretty">
                    {t("intro.desc2")}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7 divide-y divide-[#09090B]/15 border-t border-[#09090B]/15">
                {introFeatures.map((feat) => (
                  <div
                    key={feat.num}
                    data-aw-reveal
                    className="py-8 sm:py-9 grid grid-cols-1 sm:grid-cols-12 gap-5 items-start"
                  >
                    <div className="sm:col-span-5">
                      <span className="font-editorial italic font-normal text-4xl text-[#7A6648] block leading-none mb-2">
                        {feat.num}.
                      </span>
                      <h3 className="font-grotesk font-bold text-2xl sm:text-3xl tracking-tight">
                        {feat.title}
                      </h3>
                    </div>
                    <div className="sm:col-span-7">
                      <p className="text-lg sm:text-xl text-[#09090B]/85 leading-[1.72] text-left text-pretty">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-14 sm:pt-16 relative">
              <div
                data-aw-line
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-px bg-[#09090B]/15"
              />
              <h3
                data-aw-reveal
                className="font-grotesk font-bold text-3xl sm:text-4xl uppercase tracking-tight mb-10"
              >
                {t("stack.title")}
              </h3>
              <div
                data-aw-stack-grid
                className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 border-t border-l border-[#09090B]/12"
              >
                {TECH_STACK_ITEMS.map((tech) => (
                  <div
                    key={tech.name}
                    data-aw-stack-tile
                    className="bg-[#F6F4EF] hover:bg-[#EAE6DC] border-r border-b border-[#09090B]/12 p-6 flex flex-col items-center gap-3.5 transition-colors duration-300"
                  >
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      loading="lazy"
                      className="w-11 h-11 object-contain"
                    />
                    <span className="font-mono text-sm font-medium text-[#09090B]/85">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>

              <h4
                data-aw-reveal
                className="font-mono text-sm uppercase tracking-[0.2em] text-[#7A6648] font-semibold mt-12 mb-5"
              >
                {language === "en"
                  ? "Applied AI & Automation"
                  : language === "eu"
                    ? "IA aplikatua eta automatizazioa"
                    : "IA aplicada y automatización"}
              </h4>
              <div
                data-aw-stack-grid
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 border-t border-l border-[#09090B]/12"
              >
                {AI_TOOLS_ITEMS.map((tool) => (
                  <div
                    key={tool.name}
                    data-aw-stack-tile
                    className="bg-[#F6F4EF] hover:bg-[#EAE6DC] border-r border-b border-[#09090B]/12 p-6 flex flex-col items-center gap-3.5 transition-colors duration-300"
                  >
                    <img
                      src={tool.icon}
                      alt={tool.name}
                      loading="lazy"
                      className="w-11 h-11 object-contain"
                    />
                    <span className="font-mono text-sm font-medium text-[#09090B]/85 text-center">
                      {tool.label ? loc(tool.label, language) : tool.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            04 · EXPERIENCE & EDUCATION (#F6F4EF) — Horión desde Jun 2026
           ===================================================================== */}
        <section
          id="experience"
          className="bg-[#F6F4EF] text-[#09090B] py-20 sm:py-32 lg:py-36 px-5 sm:px-8 lg:px-16 border-t border-[#09090B]/12 overflow-x-clip"
        >
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div data-aw-reveal className="lg:col-span-4 space-y-8 min-w-0">
              <span className="font-mono text-sm uppercase tracking-[0.2em] text-[#7A6648] font-semibold block">
                {loc(ui.timelineEyebrow, language)}
              </span>
              <h2 className="font-editorial font-bold text-4xl sm:text-5xl lg:text-[clamp(2.2rem,3.1vw,3.35rem)] tracking-[-0.025em] leading-[1.02]">
                {t("exp.title")}
              </h2>

              <div className="inline-flex border border-[#09090B]/20 bg-[#EAE6DC] p-1 text-base">
                <button
                  type="button"
                  onClick={() => {
                    if (expTab !== "work") setExpTab("work");
                  }}
                  className={`px-5 sm:px-6 py-2.5 min-h-[46px] cursor-pointer transition-colors ${
                    expTab === "work"
                      ? "bg-[#09090B] text-[#F6F4EF] font-semibold"
                      : "text-[#09090B]/70 hover:text-[#09090B]"
                  }`}
                >
                  {language === "en"
                    ? `Work (${WORK_EXPERIENCE.length})`
                    : language === "eu"
                      ? `Lana (${WORK_EXPERIENCE.length})`
                      : `Experiencia (${WORK_EXPERIENCE.length})`}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (expTab !== "education") setExpTab("education");
                  }}
                  className={`px-5 sm:px-6 py-2.5 min-h-[46px] cursor-pointer transition-colors ${
                    expTab === "education"
                      ? "bg-[#09090B] text-[#F6F4EF] font-semibold"
                      : "text-[#09090B]/70 hover:text-[#09090B]"
                  }`}
                >
                  {language === "en"
                    ? `Education (${EDUCATION_HISTORY.length})`
                    : language === "eu"
                      ? `Hezkuntza (${EDUCATION_HISTORY.length})`
                      : `Formación (${EDUCATION_HISTORY.length})`}
                </button>
              </div>
            </div>

            <div ref={expListRef} className="lg:col-span-8 relative pl-6 sm:pl-10">
              <div aria-hidden="true" className="absolute left-0 top-2 bottom-2 w-[2px] bg-[#09090B]/12">
                <div data-aw-exp-beam className="w-full h-full bg-[#7A6648] origin-top" />
              </div>

              <div className="divide-y divide-[#09090B]/15 border-t border-[#09090B]/15">
                {shownTimeline.map((item, idx) => (
                  <div
                    key={`${expTab}-${idx}`}
                    data-aw-exp-row
                    className="py-8 sm:py-9 grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-8 relative"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute left-[calc(-1.5rem+1px)] sm:left-[calc(-2.5rem+1px)] -translate-x-1/2 top-10 sm:top-11 w-2.5 h-2.5 bg-[#F6F4EF] border-2 border-[#7A6648]"
                    />
                    <div className="sm:col-span-4 text-sm sm:text-base text-[#09090B]/75 space-y-1.5">
                      <div className="font-mono text-[#09090B] font-semibold">{item.date}</div>
                      <div className="font-medium">{item.company}</div>
                    </div>
                    <div className="sm:col-span-8 space-y-3">
                      <div className="font-grotesk font-bold text-2xl sm:text-3xl tracking-tight">
                        {item.title}
                      </div>
                      <p className="text-[17px] sm:text-[19px] lg:text-[20px] text-[#09090B]/85 leading-[1.72] text-editorial">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            05 · RESEARCH — TOPIC-AGNOSTIC & EXTENSIBLE (MUSEUM IVORY #F6F4EF)
           ===================================================================== */}
        <section
          id="research"
          className="bg-[#F6F4EF] text-[#09090B] py-20 sm:py-32 lg:py-36 px-5 sm:px-8 lg:px-16 border-t border-[#09090B]/12 overflow-x-clip"
        >
          <div className="max-w-[1400px] mx-auto">
            <div
              data-aw-reveal
              className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 sm:pb-12 mb-12 relative"
            >
              <div>
                <span className="font-mono text-sm uppercase tracking-[0.2em] text-[#7A6648] font-semibold block mb-3">
                  05 / {loc(ui.researchBadge, language)}
                </span>
                <h2 className="font-editorial font-semibold text-5xl sm:text-6xl lg:text-7xl tracking-[-0.03em]">
                  {loc(ui.researchTitle, language)}{" "}
                  <span className="font-editorial italic font-normal text-[#7A6648]">Open Science</span>
                </h2>
                <p className="text-[17px] sm:text-[19px] lg:text-[20px] text-[#09090B]/80 leading-[1.72] max-w-[64ch] mt-4 text-editorial">
                  {t("research.lead")}
                </p>
              </div>
              <a
                href={SITE_IDENTITY.papersArchivePath}
                style={{ "--aw-btn-fill": "#09090B", "--aw-btn-hover-text": "#F6F4EF" } as CSSProperties}
                className="aw-btn self-start md:self-auto border border-[#09090B]/35 text-[#09090B] text-base font-medium px-7 py-3.5 min-h-[50px] inline-flex items-center"
              >
                <SlotLabel text={loc(ui.researchArchiveCta, language)} />
              </a>
              <div
                data-aw-line
                aria-hidden="true"
                className="absolute bottom-0 left-0 right-0 h-px bg-[#09090B]/15"
              />
            </div>

            {/* Topic-Agnostic Summary Strip (future-proof for papers beyond Bide+) */}
            <div
              data-aw-reveal
              className="grid grid-cols-1 sm:grid-cols-3 border border-[#09090B]/15 divide-y sm:divide-y-0 sm:divide-x divide-[#09090B]/15 bg-[#EAE6DC]/65 mb-14 sm:mb-16 text-center"
            >
              <div className="p-6">
                <div className="font-mono text-sm uppercase tracking-wider text-[#7A6648] font-semibold">
                  Zenodo (CERN) · DOI
                </div>
                <div className="font-grotesk font-bold text-3xl text-[#09090B] mt-1">
                  {language === "en"
                    ? `${RESEARCH_PAPERS.length} Publications`
                    : language === "eu"
                      ? `${RESEARCH_PAPERS.length} Argitalpen`
                      : `${RESEARCH_PAPERS.length} Publicaciones`}
                </div>
                <a
                  href={SITE_IDENTITY.orcidUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-mono text-sm text-[#09090B]/75 hover:text-[#7A6648] underline underline-offset-4 decoration-[#09090B]/25 mt-1"
                >
                  ORCID {SITE_IDENTITY.orcid} <IconGlyph name="up-right" />
                </a>
              </div>
              <div className="p-6">
                <div className="font-mono text-sm uppercase tracking-wider text-[#7A6648] font-semibold">
                  {language === "en"
                    ? "Open Access"
                    : language === "eu"
                      ? "Sarbide Irekia"
                      : "Acceso Abierto"}
                </div>
                <div className="font-grotesk font-bold text-3xl text-[#09090B] mt-1">
                  CC BY 4.0 &amp; MIT
                </div>
                <div className="text-sm text-[#09090B]/75 mt-1">
                  {language === "en"
                    ? "Preprints, technical monographs & code"
                    : language === "eu"
                      ? "Preprint-ak, memoria teknikoak eta kodea"
                      : "Preprints, memorias técnicas y código abierto"}
                </div>
              </div>
              <div className="p-6">
                <div className="font-mono text-sm uppercase tracking-wider text-[#7A6648] font-semibold">
                  {language === "en"
                    ? "Research Lines"
                    : language === "eu"
                      ? "Ikerketa Lerroak"
                      : "Líneas de Investigación"}
                </div>
                <div className="font-grotesk font-bold text-2xl sm:text-3xl text-[#09090B] mt-1 break-words">
                  {language === "en"
                    ? "Reproducible Systems"
                    : language === "eu"
                      ? "Sistema Erreproduzigarriak"
                      : "Sistemas Reproducibles"}
                </div>
                <div className="text-sm text-[#09090B]/75 mt-1">
                  {language === "en"
                    ? "Open data, prediction, software engineering & AI"
                    : language === "eu"
                      ? "Datu irekiak, iragarpena, softwarea eta AA"
                      : "Open data, predicción, ingeniería de software e IA"}
                </div>
              </div>
            </div>

            {/* Generic Visual-Plate Paper List */}
            <div className="space-y-16 sm:space-y-24">
              {FEATURED_RESEARCH.map((paper) => (
                <article
                  key={paper.id}
                  data-aw-reveal
                  className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pb-16 sm:pb-24 border-b border-[#09090B]/15 last:border-b-0 last:pb-0"
                >
                  <div className="lg:col-span-5">
                    {paper.visual.kind === "benchmark" && (
                      <div
                        data-aw-benchmark-card
                        className="bg-[#111114] text-[#F6F4EF] p-6 sm:p-9 shadow-[0_24px_60px_rgba(9,9,11,0.16)] border border-[#09090B]/15 space-y-7"
                      >
                        <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/12 font-mono text-xs sm:text-sm uppercase tracking-[0.16em] text-[#D6C7B2]">
                          <span>{paper.visual.figureLabel}</span>
                          <span className="text-[#F6F4EF]/55">{paper.version}</span>
                        </div>

                        <div className="space-y-6">
                          <div className="space-y-2.5">
                            <div className="flex items-baseline justify-between gap-2">
                              <span className="font-grotesk font-semibold text-base sm:text-lg text-[#F6F4EF]">
                                {paper.visual.primaryLabel}
                              </span>
                              <span className="font-mono text-2xl sm:text-3xl font-bold text-[#D6C7B2] tabular-nums">
                                {paper.visual.primaryPercent}%
                              </span>
                            </div>
                            <div className="h-3.5 w-full bg-white/10 overflow-hidden">
                              <div
                                data-aw-bar
                                style={{ width: `${paper.visual.primaryPercent}%` }}
                                className="h-full bg-[#D6C7B2]"
                              />
                            </div>
                          </div>

                          <div className="space-y-2.5">
                            <div className="flex items-baseline justify-between gap-2">
                              <span className="font-grotesk font-medium text-base sm:text-lg text-[#F6F4EF]/75">
                                {loc(paper.visual.secondaryLabel, language)}
                              </span>
                              <span className="font-mono text-2xl sm:text-3xl font-semibold text-[#F6F4EF]/65 tabular-nums">
                                {paper.visual.secondaryPercent}%
                              </span>
                            </div>
                            <div className="h-3.5 w-full bg-white/10 overflow-hidden">
                              <div
                                data-aw-bar
                                style={{ width: `${paper.visual.secondaryPercent}%` }}
                                className="h-full bg-white/35"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-5 border-t border-white/12 grid grid-cols-2 gap-4 font-mono text-sm">
                          <div>
                            <div className="text-[#D6C7B2] font-bold text-xl">
                              {paper.visual.statLeftValue}
                            </div>
                            <div className="text-[#F6F4EF]/65 text-xs sm:text-sm mt-0.5">
                              {loc(paper.visual.statLeftLabel, language)}
                            </div>
                          </div>
                          <div>
                            <div className="text-[#F6F4EF] font-bold text-xl">
                              {paper.visual.statRightValue}
                            </div>
                            <div className="text-[#F6F4EF]/65 text-xs sm:text-sm mt-0.5">
                              {paper.visual.statRightLabel}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {paper.visual.kind === "pipeline" && (
                      <div
                        data-aw-pipeline-card
                        className="bg-[#111114] text-[#F6F4EF] p-6 sm:p-9 shadow-[0_24px_60px_rgba(9,9,11,0.16)] border border-[#09090B]/15 space-y-6"
                      >
                        <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/12 font-mono text-xs sm:text-sm uppercase tracking-[0.16em] text-[#D6C7B2]">
                          <span>{paper.visual.figureLabel}</span>
                          <span className="text-[#F6F4EF]/55">{paper.visual.figureMeta}</span>
                        </div>

                        <div className="relative pl-10 space-y-4">
                          <svg
                            aria-hidden="true"
                            className="absolute left-3.5 top-3 bottom-3 w-3 h-[calc(100%-24px)] overflow-visible"
                            viewBox="0 0 12 200"
                            preserveAspectRatio="none"
                          >
                            <path
                              data-aw-svg-line
                              d="M 6 0 L 6 200"
                              fill="none"
                              stroke="#D6C7B2"
                              strokeWidth="2"
                            />
                          </svg>

                          {paper.visual.steps.map((layer) => (
                            <div
                              key={layer.code}
                              data-aw-pipeline-node
                              className="relative bg-white/[0.04] border border-white/12 px-4 py-3.5"
                            >
                              <span className="absolute -left-[35px] top-1/2 -translate-y-1/2 w-7 h-7 bg-[#111114] border border-[#D6C7B2] text-[#D6C7B2] font-mono text-xs font-bold flex items-center justify-center">
                                {layer.code}
                              </span>
                              <div className="font-grotesk font-semibold text-base text-[#F6F4EF]">
                                {loc(layer.title, language)}
                              </div>
                              <div className="font-mono text-xs sm:text-sm text-[#D6C7B2]/90 mt-0.5">
                                <RichText text={loc(layer.meta, language)} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {paper.visual.kind === "manuscript" && (
                      <a
                        href={paper.pdfUrl}
                        download={paper.pdfFilename}
                        data-aw-book-stage
                        className="block bg-[#E6E1D6] p-8 sm:p-12 relative overflow-hidden group border border-[#09090B]/15"
                      >
                        <span className="absolute top-4 left-6 font-mono text-xs sm:text-sm uppercase tracking-[0.16em] text-[#7A6648] font-semibold">
                          {paper.visual.figureLabel}
                        </span>
                        <div className="relative h-[280px] sm:h-[340px] flex items-center justify-center pt-5">
                          <div
                            data-aw-page-back
                            className="absolute w-44 sm:w-56 aspect-[210/297] overflow-hidden bg-white shadow-[0_18px_45px_rgba(9,9,11,0.18)] border border-[#09090B]/15"
                          >
                            <img
                              src={paper.visual.backPage}
                              alt="Página interior de la publicación"
                              loading="lazy"
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                          <div
                            data-aw-page-front
                            className="relative z-10 w-44 sm:w-56 aspect-[210/297] overflow-hidden bg-white shadow-[0_26px_65px_rgba(9,9,11,0.26)] border border-[#09090B]/15"
                          >
                            <img
                              src={paper.visual.frontPage}
                              alt="Portada oficial de la publicación"
                              loading="lazy"
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                        </div>
                      </a>
                    )}

                    {paper.visual.kind === "card" && (
                      <div className="bg-[#111114] text-[#F6F4EF] p-6 sm:p-9 shadow-[0_24px_60px_rgba(9,9,11,0.16)] border border-[#09090B]/15 space-y-6">
                        <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/12 font-mono text-xs sm:text-sm uppercase tracking-[0.16em] text-[#D6C7B2]">
                          <span>{paper.visual.figureLabel}</span>
                          <span className="text-[#F6F4EF]/55">{paper.version}</span>
                        </div>
                        {paper.visual.image ? (
                          <div className="aspect-[16/10] overflow-hidden border border-white/10 bg-[#0B0B0D]">
                            <img
                              src={paper.visual.image}
                              alt={loc(paper.title, language)}
                              loading="lazy"
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                        ) : null}
                        <div className="py-4">
                          <div className="font-grotesk font-bold text-5xl sm:text-6xl text-[#D6C7B2] tracking-[-0.03em]">
                            {paper.visual.highlightStat}
                          </div>
                          <div className="font-sans text-base sm:text-lg text-[#F6F4EF]/85 mt-2">
                            {loc(paper.visual.highlightLabel, language)}
                          </div>
                        </div>
                        {paper.visual.footnote && (
                          <div className="pt-4 border-t border-white/12 font-mono text-xs sm:text-sm text-[#F6F4EF]/60">
                            {paper.visual.footnote}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs sm:text-sm uppercase text-[#09090B]/70">
                      <span className="bg-[#09090B] text-[#F6F4EF] px-3.5 py-1 font-semibold">
                        {paper.index} / {loc(paper.type, language)}
                      </span>
                      {paper.badge && (
                        <span className="border border-[#7A6648] text-[#7A6648] px-3 py-1 font-semibold">
                          {loc(paper.badge, language)}
                        </span>
                      )}
                      <span className="border border-[#09090B]/25 bg-[#EAE6DC] text-[#09090B] px-3 py-1 font-medium">
                        {loc(paper.topic, language)}
                      </span>
                      <span>
                        {paper.year} · DOI {paper.doi}
                      </span>
                    </div>

                    <h3 className="font-grotesk font-bold text-2xl sm:text-4xl leading-snug tracking-[-0.025em]">
                      <a
                        href={paper.scholarPageUrl || paper.doiUrl}
                        className="hover:text-[#7A6648] transition-colors"
                      >
                        {loc(paper.title, language)}
                      </a>
                    </h3>

                    <p className="text-[17px] sm:text-[19px] lg:text-[20px] text-[#09090B]/85 leading-[1.72] max-w-[66ch] text-editorial">
                      <strong className="font-semibold text-[#09090B]">
                        {loc(ui.summary, language)}{" "}
                      </strong>
                      {loc(paper.tldr, language)}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {paper.metrics.map((m, i) => (
                        <span
                          key={i}
                          className="font-mono text-sm bg-[#EAE6DC] border border-[#09090B]/15 px-3.5 py-1.5 text-[#09090B]"
                        >
                          {loc(m, language)}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <a
                        href={paper.pdfUrl}
                        download={paper.pdfFilename}
                        style={btnPrimaryOnLight}
                        className="aw-btn bg-[#09090B] text-[#F6F4EF] font-semibold text-base px-7 py-4 min-h-[52px] inline-flex items-center"
                      >
                        <SlotLabel text={`↓ ${loc(ui.downloadPdf, language)}`} />
                      </a>
                      {paper.readingPdfUrl && (
                        <a
                          href={paper.readingPdfUrl}
                          download={paper.readingPdfFilename}
                          className="border border-[#09090B] text-[#09090B] hover:bg-[#09090B] hover:text-[#F6F4EF] font-medium text-base px-6 py-4 min-h-[52px] inline-flex items-center gap-1.5 transition-colors"
                        >
                          <IconGlyph name="down" />
                          <span>{loc(ui.readingPdf, language)}</span>
                        </a>
                      )}
                      {paper.supplementPdfUrl && (
                        <a
                          href={paper.supplementPdfUrl}
                          download={paper.supplementPdfFilename}
                          className="border border-[#09090B] text-[#09090B] hover:bg-[#09090B] hover:text-[#F6F4EF] font-medium text-base px-6 py-4 min-h-[52px] inline-flex items-center gap-1.5 transition-colors"
                        >
                          <IconGlyph name="down" />
                          <span>{loc(ui.supplementPdf, language)}</span>
                        </a>
                      )}
                      {paper.scholarPageUrl && (
                        <a
                          href={paper.scholarPageUrl}
                          className="border border-[#7A6648] text-[#7A6648] hover:bg-[#7A6648] hover:text-[#F6F4EF] font-medium text-base px-5 py-4 min-h-[52px] inline-flex items-center transition-colors"
                        >
                          <RichText text={loc(ui.scholarPage, language)} />
                        </a>
                      )}
                      <a
                        href={paper.doiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-[#09090B]/30 hover:border-[#09090B] text-[#09090B] text-base px-5 py-4 min-h-[52px] inline-flex items-center gap-1.5 transition-colors"
                      >
                        <span>Zenodo (DOI)</span>
                        <IconGlyph name="up-right" />
                      </a>
                      {paper.repoUrl && (
                        <a
                          href={paper.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border border-[#09090B]/30 hover:border-[#09090B] text-[#09090B] text-base px-5 py-4 min-h-[52px] inline-flex items-center gap-1.5 transition-colors"
                        >
                          <span>{loc(ui.code, language)}</span>
                          <IconGlyph name="up-right" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {FEATURED_RESEARCH.length < RESEARCH_PAPERS.length && (
              <div data-aw-reveal className="mt-16 sm:mt-20 pt-10 border-t border-[#09090B]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <p className="text-[17px] sm:text-[19px] text-[#09090B]/80 leading-[1.6] max-w-[60ch]">
                  {language === "en"
                    ? `${RESEARCH_PAPERS.length - FEATURED_RESEARCH.length} more in the academic archive, with full citation and PDF.`
                    : language === "eu"
                      ? `Beste ${RESEARCH_PAPERS.length - FEATURED_RESEARCH.length} artxibo akademikoan, aipamen osoarekin eta PDFarekin.`
                      : `${RESEARCH_PAPERS.length - FEATURED_RESEARCH.length} más en el archivo académico, con cita completa y PDF.`}
                </p>
                <a
                  href={SITE_IDENTITY.papersArchivePath}
                  style={{ "--aw-btn-fill": "#09090B", "--aw-btn-hover-text": "#F6F4EF" } as CSSProperties}
                  className="aw-btn self-start sm:self-auto bg-[#09090B] text-[#F6F4EF] text-base font-semibold px-7 py-4 min-h-[52px] inline-flex items-center"
                >
                  <SlotLabel
                    text={
                      language === "en"
                        ? `See all ${RESEARCH_PAPERS.length} papers`
                        : language === "eu"
                          ? `Ikusi ${RESEARCH_PAPERS.length} paperak`
                          : `Ver los ${RESEARCH_PAPERS.length} papers`
                    }
                  />
                </a>
              </div>
            )}
          </div>
        </section>

        {/* =====================================================================
            06 · GITHUB ACTIVITY & METRICS FIRST (FOR EVERYONE) + DEVELOPER API BELOW
           ===================================================================== */}
        <section
          id="api"
          className="bg-[#09090B] text-[#F6F4EF] py-20 sm:py-28 lg:py-32 px-5 sm:px-8 lg:px-14 border-t border-white/12 overflow-x-clip"
        >
          <div className="max-w-[1440px] mx-auto space-y-16 sm:space-y-20">
            {/* 1. Clear Live Metrics & GitHub Activity (understood by every visitor) */}
            <div className="space-y-10">
              <div data-aw-reveal className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="font-mono text-sm uppercase tracking-[0.2em] text-[#D6C7B2] block mb-3">
                    06 / {t("contact.github")}
                  </span>
                  <h2 className="font-editorial font-semibold text-5xl sm:text-6xl tracking-[-0.025em]">
                    {t("contact.github")}
                  </h2>
                </div>
                <a
                  href={SITE_IDENTITY.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-base text-[#D6C7B2] hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>@{SITE_IDENTITY.githubUsername}</span>
                  <IconGlyph name="up-right" />
                </a>
              </div>

              <div
                data-aw-reveal
                className="grid grid-cols-2 lg:grid-cols-4 border-t border-l border-white/15 bg-[#111114]"
              >
                {githubKpiStrip.map((stat, idx) => (
                  <div
                    key={idx}
                    className="border-r border-b border-white/15 px-6 py-8 sm:py-10 text-center group hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="font-grotesk font-bold text-4xl sm:text-5xl lg:text-6xl tracking-[-0.03em] text-[#F6F4EF] tabular-nums">
                      {stat.value}
                      {stat.suffix && <span className="text-[#D6C7B2]">{stat.suffix}</span>}
                    </div>
                    <div className="font-mono text-sm uppercase tracking-[0.12em] text-[#F6F4EF]/70 group-hover:text-[#F6F4EF] mt-3 transition-colors">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <div
                ref={ghCalendarWrapRef}
                className="bg-[#111114] border border-white/15 p-5 sm:p-8 lg:p-10 aw-gh-calendar min-h-[195px]"
              >
                {showGhCalendar ? (
                  <Suspense
                    fallback={
                      <div className="h-[151px] w-full flex items-center justify-center font-mono text-xs uppercase tracking-widest text-[#F6F4EF]/75">
                        GitHub Activity...
                      </div>
                    }
                  >
                    <GitHubCalendar
                      username={SITE_IDENTITY.githubUsername}
                      colorScheme="dark"
                      fontSize={14}
                      blockSize={15}
                      blockMargin={4}
                      blockRadius={0}
                      style={{ width: "100%", maxWidth: "100%" }}
                      transformData={(contributions) => {
                        const start = new Date(SITE_IDENTITY.githubCalendarStartDate).getTime();
                        return contributions.filter((d) => new Date(d.date).getTime() >= start);
                      }}
                    />
                  </Suspense>
                ) : (
                  <div className="h-[151px] w-full flex items-center justify-center font-mono text-xs uppercase tracking-widest text-[#F6F4EF]/75">
                    GitHub Activity...
                  </div>
                )}
              </div>
            </div>

            {/* 2. Developer Public API (secondary block below for technical teams & AI tools) */}
            <div className="pt-14 relative">
              <div
                data-aw-line
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-px bg-white/12"
              />
              <div data-aw-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <span className="font-mono text-sm uppercase tracking-[0.2em] text-[#D6C7B2] block">
                    {loc(ui.devEyebrow, language)}
                  </span>
                  <h3 className="font-editorial font-semibold text-4xl sm:text-5xl lg:text-[clamp(2.1rem,3vw,3.1rem)] tracking-[-0.02em]">
                    {t("api.title")}
                  </h3>
                  <p className="text-lg text-[#F6F4EF]/82 leading-[1.7] text-left text-pretty">
                    {t("api.desc")}
                  </p>
                </div>

                <div className="lg:col-span-7 bg-[#111114] border border-white/15 overflow-hidden">
                  <div className="px-4 sm:px-5 py-3.5 border-b border-white/12 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      {API_ENDPOINTS.map((ep) => (
                        <button
                          key={ep.id}
                          type="button"
                          onClick={() => {
                            if (apiTab !== ep.id) setApiTab(ep.id);
                          }}
                          className={`font-mono text-sm px-4 py-2 min-h-[44px] cursor-pointer transition-colors ${
                            apiTab === ep.id
                              ? "bg-[#F6F4EF] text-[#09090B] font-bold"
                              : "text-white/75 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {ep.label}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={copyCommand}
                      className="font-mono text-sm uppercase tracking-wider text-[#D6C7B2] hover:text-white min-h-[44px] px-3 cursor-pointer inline-flex items-center gap-1.5"
                    >
                      {copied ? (
                        <>
                          <span>Copied</span>
                          <IconGlyph name="check" />
                        </>
                      ) : (
                        "Copy curl"
                      )}
                    </button>
                  </div>
                  <div className="px-5 sm:px-6 py-5 border-b border-white/10 font-mono text-sm sm:text-base text-[#F6F4EF] break-all">
                    <span className="text-[#D6C7B2]">$ </span>
                    {activeApi.command}
                  </div>
                  <pre className="p-5 sm:p-6 font-mono text-sm text-[#F6F4EF]/82 overflow-x-auto leading-relaxed">
                    {activeApi.preview}
                  </pre>
                </div>
              </div>
            </div>
            {/* Apoyo a los servicios gratuitos */}
            <div
              data-aw-reveal
              className="border border-white/15 bg-[#111114] px-6 sm:px-10 py-8 sm:py-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="max-w-2xl space-y-2">
                <h3 className="font-editorial font-semibold text-2xl sm:text-3xl tracking-[-0.02em]">
                  {loc(ui.supportTitle, language)}
                </h3>
                <p className="text-base sm:text-lg text-[#F6F4EF]/75 leading-[1.6]">
                  {loc(ui.supportText, language)}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href="https://ko-fi.com/ygarrido"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center min-h-[44px] px-6 bg-[#F6F4EF] text-[#09090B] font-mono text-sm tracking-[0.12em] hover:opacity-85 transition-opacity"
                >
                  {loc(ui.supportKofi, language)}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            07 · CONTACT FINALE — OPCIÓN B (EMAIL + LINKEDIN + FORMULARIO DESPLEGABLE)
           ===================================================================== */}
        <section
          id="contact"
          className="relative overflow-hidden bg-[#09090B] text-[#F6F4EF] py-24 sm:py-36 px-5 sm:px-8 lg:px-16 border-t border-white/12"
        >
          <div className="relative z-10 max-w-[1100px] mx-auto text-center space-y-11">
            <div className="flex flex-col items-center gap-6">
              <div data-aw-contact-stem aria-hidden="true" className="w-px h-14 bg-[#D6C7B2]/60" />
              <span
                data-aw-reveal
                className="font-mono text-sm uppercase tracking-[0.22em] text-[#D6C7B2] block"
              >
                {loc(ui.contactEyebrow, language)}
              </span>
            </div>

            <h2 data-aw-contact-title className="leading-[0.88]">
              <span className="block overflow-hidden py-1 -my-1">
                <span
                  data-aw-contact-line
                  className="block font-editorial font-semibold uppercase tracking-[-0.035em] text-[clamp(2.9rem,11vw,9.2rem)] text-[#F6F4EF]"
                >
                  {t("contact.title1")}
                </span>
              </span>
              <span className="block overflow-hidden py-3 -my-3 px-2 -mx-2 -mt-[0.06em]">
                <span
                  data-aw-contact-line
                  className="block font-editorial italic font-normal uppercase tracking-[-0.03em] text-[clamp(2.9rem,11vw,9.2rem)] leading-[0.9] text-[#D6C7B2]"
                >
                  {t("contact.title2")}
                </span>
              </span>
            </h2>

            <p
              data-aw-reveal
              className="max-w-[54ch] mx-auto text-center text-[17px] sm:text-[19px] lg:text-[20px] text-[#F6F4EF]/82 leading-[1.72]"
            >
              {t("contact.subtitle")}
            </p>

            <div data-aw-reveal className="flex flex-col items-center gap-5 pt-2">
              <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
                <a
                  href={`mailto:${SITE_IDENTITY.email}`}
                  style={btnDarkOnIvory}
                  className="aw-btn bg-[#F6F4EF] text-[#09090B] font-semibold text-base sm:text-lg px-8 sm:px-10 py-5 min-h-[60px] inline-flex items-center"
                >
                  <SlotLabel text={`${t("contact.email")} ↗`} />
                </a>
                <a
                  href={SITE_IDENTITY.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={btnOutlineOnDark}
                  className="aw-btn border border-white/35 text-[#F6F4EF] font-semibold text-base sm:text-lg px-8 sm:px-10 py-5 min-h-[60px] inline-flex items-center"
                >
                  <SlotLabel text={`${t("contact.linkedin")} ↗`} />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setContactFormOpen((open) => !open);
                    if (formStatus !== "idle") setFormStatus("idle");
                  }}
                  aria-expanded={contactFormOpen}
                  aria-controls="quick-contact-form"
                  style={btnChampagneOutline}
                  className="aw-btn border border-[#D6C7B2]/55 text-[#D6C7B2] font-semibold text-base sm:text-lg px-8 py-5 min-h-[60px] inline-flex items-center cursor-pointer"
                >
                  <SlotLabel
                    text={
                      contactFormOpen
                        ? `${loc(ui.closeForm, language)} ↑`
                        : `${loc(ui.writeHere, language)} ↓`
                    }
                  />
                </button>
              </div>

              <button
                type="button"
                onClick={copyEmail}
                className="font-mono text-sm text-[#F6F4EF]/70 hover:text-[#D6C7B2] border-b border-white/20 hover:border-[#D6C7B2] pb-1 min-h-[44px] inline-flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <span>{SITE_IDENTITY.email}</span>
                <span className="text-[#D6C7B2] uppercase text-xs tracking-wider inline-flex items-center gap-1">
                  {emailCopied ? (
                    <>
                      <span>
                        {language === "en"
                          ? "Copied"
                          : language === "eu"
                            ? "Kopiatuta"
                            : "Copiado"}
                      </span>
                      <IconGlyph name="check" />
                    </>
                  ) : language === "en" ? (
                    "[ Copy ]"
                  ) : language === "eu" ? (
                    "[ Kopiatu ]"
                  ) : (
                    "[ Copiar ]"
                  )}
                </span>
              </button>
            </div>

            {/* Option B Architectural Expandable 3-Field Quick-Message Form (Smooth Grid Accordion) */}
            <div
              id="quick-contact-form"
              aria-hidden={!contactFormOpen}
              className={`grid transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                contactFormOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0 pointer-events-none"
              }`}
            >
              <div className="overflow-hidden">
                <div className="max-w-2xl mx-auto text-left bg-[#111114] border border-white/15 p-5 sm:p-9 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 pb-4 border-b border-white/12 font-mono text-xs sm:text-sm uppercase tracking-[0.12em]">
                    <span className="text-[#D6C7B2] font-semibold">
                      {loc(ui.writeHere, language)}
                    </span>
                    <span className="text-[#F6F4EF]/60 break-all">{SITE_IDENTITY.email}</span>
                  </div>

                  <form onSubmit={handleContactSubmit} className="space-y-5">
                    {/* Anti-spam honeypot */}
                    <input
                      type="text"
                      name="_botcheck"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formBotcheck}
                      onChange={(e) => setFormBotcheck(e.target.value)}
                      className="hidden"
                      aria-hidden="true"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="block space-y-2">
                        <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#F6F4EF]/75 block">
                          {loc(ui.formName, language)} *
                        </span>
                        <input
                          type="text"
                          required
                          tabIndex={contactFormOpen ? 0 : -1}
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder={loc(ui.formNamePlaceholder, language)}
                          className="w-full bg-[#09090B] border border-white/20 focus:border-[#D6C7B2] focus:outline-none px-4 py-3.5 min-h-[48px] text-base text-[#F6F4EF] placeholder:text-[#F6F4EF]/35 transition-colors"
                        />
                      </label>

                      <label className="block space-y-2">
                        <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#F6F4EF]/75 block">
                          {loc(ui.formEmail, language)} *
                        </span>
                        <input
                          type="email"
                          required
                          tabIndex={contactFormOpen ? 0 : -1}
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                          placeholder={loc(ui.formEmailPlaceholder, language)}
                          className="w-full bg-[#09090B] border border-white/20 focus:border-[#D6C7B2] focus:outline-none px-4 py-3.5 min-h-[48px] text-base text-[#F6F4EF] placeholder:text-[#F6F4EF]/35 transition-colors"
                        />
                      </label>
                    </div>

                    <label className="block space-y-2">
                      <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#F6F4EF]/75 block">
                        {loc(ui.formMsg, language)} *
                      </span>
                      <textarea
                        required
                        rows={4}
                        tabIndex={contactFormOpen ? 0 : -1}
                        value={formMessage}
                        onChange={(e) => setFormMessage(e.target.value)}
                        placeholder={loc(ui.formMsgPlaceholder, language)}
                        className="w-full bg-[#09090B] border border-white/20 focus:border-[#D6C7B2] focus:outline-none px-4 py-3.5 text-base text-[#F6F4EF] placeholder:text-[#F6F4EF]/35 transition-colors resize-y"
                      />
                    </label>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                      <button
                        type="submit"
                        tabIndex={contactFormOpen ? 0 : -1}
                        disabled={formStatus === "submitting"}
                        style={btnDarkOnIvory}
                        className="aw-btn bg-[#F6F4EF] text-[#09090B] font-semibold text-base px-8 py-4 min-h-[52px] inline-flex items-center justify-center cursor-pointer disabled:opacity-50"
                      >
                        <SlotLabel
                          text={
                            formStatus === "submitting"
                              ? loc(ui.formSending, language)
                              : loc(ui.formSend, language)
                          }
                        />
                      </button>

                      {formStatus === "sent" && (
                        <p className="font-mono text-xs sm:text-sm text-[#D6C7B2]">
                          {loc(ui.formSent, language)}
                        </p>
                      )}
                      {formStatus === "mailto" && (
                        <p className="font-mono text-xs sm:text-sm text-[#D6C7B2]">
                          {loc(ui.formMailtoNotice, language)}
                        </p>
                      )}
                      {formStatus === "error" && (
                        <p className="font-mono text-xs sm:text-sm text-red-400">
                          {loc(ui.formError, language)}
                        </p>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* STRUCTURED PRODUCTION FOOTER WITH INTEGRATED LEGAL MODALS */}
      <footer className="bg-[#09090B] text-[#F6F4EF]/75 py-16 px-5 sm:px-8 lg:px-14 border-t border-white/12 overflow-x-clip">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 sm:gap-12 pb-12 border-b border-white/12 text-base">
          <div className="col-span-2 md:col-span-1 space-y-4 min-w-0">
            <img
              src="/img/logo.webp"
              width={720}
              height={281}
              loading="lazy"
              alt={t("header.logoAlt")}
              className="h-8 w-auto"
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
          <div className="space-y-2.5 min-w-0">
            <div className="text-[#F6F4EF] uppercase tracking-[0.08em] sm:tracking-[0.14em] font-semibold text-xs sm:text-sm break-words">
              Portfolio
            </div>
            <a
              href="#work"
              onClick={(e) => scrollToSection(e, "work")}
              className="block hover:text-white py-0.5 break-words"
            >
              Bide+ &amp; {t("projects.title")}
            </a>
            <a
              href="#research"
              onClick={(e) => scrollToSection(e, "research")}
              className="block hover:text-white py-0.5 break-words"
            >
              {loc(ui.researchTitle, language)}
            </a>
            <a
              href={SITE_IDENTITY.papersArchivePath}
              className="block hover:text-[#D6C7B2] py-0.5 break-words"
            >
              <RichText text={loc(ui.researchArchiveCta, language)} />
            </a>
            <a
              href="#experience"
              onClick={(e) => scrollToSection(e, "experience")}
              className="block hover:text-white py-0.5 break-words"
            >
              {t("exp.title")}
            </a>
          </div>
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

        <div className="max-w-[1400px] mx-auto pt-7 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#F6F4EF]/55 text-center md:text-left">
          <span>
            {t("contact.footer.madeWith")} {SITE_IDENTITY.brandName}
          </span>
          <span>{t("contact.footer.copyright", { year: new Date().getFullYear().toString() })}</span>
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

      {/* LEGAL / PRIVACY / COOKIES MODAL */}
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

      {(activeProject || isCatalogOpen) && (
        <Suspense fallback={null}>
          <ProjectModal
            language={language}
            activeProject={activeProject}
            onCloseProject={() => setActiveProject(null)}
            onSelectProject={(p) => setActiveProject(p)}
            isCatalogOpen={isCatalogOpen}
            onCloseCatalog={() => setIsCatalogOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
}
