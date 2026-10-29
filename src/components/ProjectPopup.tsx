import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function ProjectPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const { language } = useLanguage();

  const texts = {
    es: {
      badge: "ÚLTIMO LANZAMIENTO",
      title: "Bide+ · Movilidad Euskadi",
      tagline: "Horarios, avisos y tiempo real de Bizkaibus, Metro Bilbao, Euskotren y Renfe en una sola PWA con estimación GPS propia.",
      pill: "Algoritmo propio · Error < 1.5 min",
      cta: "Probar Bide+",
      close: "Cerrar",
    },
    en: {
      badge: "LATEST RELEASE",
      title: "Bide+ · Euskadi Mobility",
      tagline: "Real-time schedules and alerts for Bizkaibus, Metro Bilbao, Euskotren, and Renfe Cercanías in one PWA.",
      pill: "Custom GPS algorithm · Error < 1.5 min",
      cta: "Try Bide+",
      close: "Close",
    },
    eu: {
      badge: "AZKEN PROIEKTUA",
      title: "Bide+ · Euskadiko Mugikortasuna",
      tagline: "Bizkaibus, Metro Bilbao, Euskotren eta Renfe ordutegiak, abisuak eta denbora erreala PWA bakar batean.",
      pill: "GPS algoritmo propioa · Errorea < 1.5 min",
      cta: "Probatu Bide+",
      close: "Itxi",
    },
  };

  const t = texts[language as keyof typeof texts] || texts.es;

  useEffect(() => {
    const closed = sessionStorage.getItem("bideplus_popup_dismissed");
    if (closed) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    sessionStorage.setItem("bideplus_popup_dismissed", "1");
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <aside
      role="dialog"
      aria-label={t.title}
      className={`fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-50 transition-all duration-300 ease-out ${
        isExiting ? "opacity-0 translate-y-4 scale-95" : "opacity-100 translate-y-0 scale-100"
      }`}
    >
      <div className="relative bg-[#0d0d0d] border border-white/20 shadow-2xl overflow-hidden p-4 sm:p-5">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/0 via-emerald-400 to-emerald-500/0" />

        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-emerald-400 font-semibold uppercase">
              {t.badge}
            </span>
          </div>

          <button
            onClick={handleClose}
            aria-label={t.close}
            className="text-white/50 hover:text-white p-1 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <h3 className="font-sans font-bold text-white text-base sm:text-lg tracking-tight mb-1">
          {t.title}
        </h3>

        <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-3">
          {t.tagline}
        </p>

        <div className="inline-block bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] font-mono text-white/80 mb-3.5">
          {t.pill}
        </div>

        <div className="flex items-center gap-2.5 pt-1">
          <a
            href="https://bideplus.vercel.app/?utm_source=yeraygarrido_dev&utm_medium=portfolio_popup&utm_campaign=beta"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-white text-black hover:bg-emerald-400 hover:text-black font-sans font-bold text-xs uppercase tracking-wider py-2.5 px-4 text-center transition-colors flex items-center justify-center gap-2 group"
          >
            <span>{t.cta}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" className="transition-transform group-hover:translate-x-1">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </aside>
  );
}

