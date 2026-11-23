import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const { language } = useLanguage();

  const texts = {
    es: {
      title: "Uso de Cookies",
      desc: "Utilizo cookies analíticas de forma anónima para entender cómo navegas por el portfolio y mejorar la experiencia. Consulta la ",
      link: "Política de Cookies.",
      accept: "Aceptar",
      reject: "Rechazar",
    },
    en: {
      title: "Cookie Policy",
      desc: "I use anonymous analytical cookies to understand how you navigate this portfolio and improve the experience. Read the ",
      link: "Cookie Policy.",
      accept: "Accept",
      reject: "Reject",
    },
    eu: {
      title: "Cookieen Erabilera",
      desc: "Cookie analitikoak modu anonimoan erabiltzen ditut nire portfolioan nola nabigatzen duzun ulertzeko eta esperientzia hobetzeko. Irakurri gehiago nire ",
      link: "Cookie Politikan.",
      accept: "Onartu",
      reject: "Ezetsi",
    },
  };

  const t = texts[language as keyof typeof texts] || texts.es;

  useEffect(() => {
    try {
      const consentData = localStorage.getItem("clarity_consent_data");
      const now = Date.now();
      const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

      if (consentData) {
        const { status, timestamp } = JSON.parse(consentData);
        if (now - timestamp > THIRTY_DAYS) {
          localStorage.removeItem("clarity_consent_data");
          setIsVisible(true);
        } else if (status === "accepted") {
          import("@microsoft/clarity").then((Clarity) => {
            Clarity.default.init("voxu774h3f");
          });
        }
      } else {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const handleDecision = (decision: "accepted" | "rejected") => {
    setIsExiting(true);
    try {
      const data = { status: decision, timestamp: Date.now() };
      localStorage.setItem("clarity_consent_data", JSON.stringify(data));
    } catch {
      // ignore storage quota / private mode restrictions
    }

    if (decision === "accepted") {
      import("@microsoft/clarity").then((Clarity) => {
        Clarity.default.init("voxu774h3f");
      });
    }
    window.setTimeout(() => setIsVisible(false), 320);
  };

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes cookieSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cookieSlideDown {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(24px); }
        }
        .cookie-banner {
          animation: cookieSlideUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .cookie-banner.exiting {
          animation: cookieSlideDown 0.3s cubic-bezier(0.4, 0, 1, 1) forwards;
        }
      `}</style>

      <div className="fixed inset-0 z-[70] pointer-events-none flex items-end justify-end">
        <div
          role="dialog"
          aria-label={t.title}
          className={`cookie-banner pointer-events-auto w-full md:w-[390px] md:m-6 ${
            isExiting ? "exiting" : ""
          } bg-[#0C0C0F] text-[#F6F4EF] border-t md:border border-[#D6C7B2]/40`}
        >
          <div className="px-6 py-6 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/12">
              <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.14em] text-[#D6C7B2]">
                {t.title}
              </h3>
              <span className="font-mono text-xs text-[#F6F4EF]/50">GDPR</span>
            </div>

            <p className="font-sans text-[15px] text-[#F6F4EF]/80 leading-relaxed">
              {t.desc}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("open-cookies-modal"))}
                className="text-[#F6F4EF] underline underline-offset-4 decoration-[#D6C7B2]/60 hover:text-[#D6C7B2] transition-colors cursor-pointer"
              >
                {t.link}
              </button>
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => handleDecision("rejected")}
                className="font-mono text-sm uppercase tracking-[0.12em] min-h-[48px] border border-white/20 text-[#F6F4EF]/80 hover:text-[#F6F4EF] hover:border-white/45 transition-colors cursor-pointer"
              >
                {t.reject}
              </button>
              <button
                type="button"
                onClick={() => handleDecision("accepted")}
                className="font-mono text-sm uppercase tracking-[0.12em] min-h-[48px] bg-[#F6F4EF] text-[#09090B] font-bold hover:bg-[#D6C7B2] transition-colors cursor-pointer"
              >
                {t.accept}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
