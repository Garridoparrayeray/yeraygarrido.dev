import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const { language } = useLanguage();

  const texts = {
    es: {
      title: "Uso de Cookies ",
      desc: "Utilizo Cookies de forma anónima para entender cómo navegas por mi portfolio y mejorar la experiencia. Puedes leer más en mi ",
      link: "Política de Cookies.",
      accept: "Aceptar",
      reject: "Rechazar",
    },
    en: {
      title: "Cookie Policy",
      desc: "I use Cookies anonymously to understand how you navigate my portfolio and improve the experience. Read more in my ",
      link: "Cookie Policy.",
      accept: "Accept",
      reject: "Reject",
    },
    eu: {
      title: "Cookieen Erabilera",
      desc: "Erabiltzen dut Cookiak modu anonimoan erabiltzen dut nire portfolioan nola nabigatzen duzun ulertzeko. Irakurri gehiago nire ",
      link: "Cookie Politikan.",
      accept: "Onartu",
      reject: "Ezetsi",
    },
  };

  const t = texts[language as keyof typeof texts] || texts.es;

  useEffect(() => {
    const consentData = localStorage.getItem("clarity_consent_data");
    const now = new Date().getTime();
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
  }, []);

  const handleDecision = (decision: "accepted" | "rejected") => {
    setIsExiting(true);
    const data = { status: decision, timestamp: new Date().getTime() };
    localStorage.setItem("clarity_consent_data", JSON.stringify(data));

    if (decision === "accepted") {
      import("@microsoft/clarity").then((Clarity) => {
        Clarity.default.init("voxu774h3f");
      });
    }
    setTimeout(() => setIsVisible(false), 350);
  };

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes cookieSlideUp {
          from { opacity: 0; transform: translateY(100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cookieSlideDown {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(100%); }
        }
        .cookie-banner {
          animation: cookieSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .cookie-banner.exiting {
          animation: cookieSlideDown 0.35s cubic-bezier(0.4, 0, 1, 1) forwards;
        }
      `}</style>

      {/*
        El wrapper ocupa toda la pantalla pero con pointer-events-none,
        así el scroll y los clicks traspasan al contenido de debajo.
        Solo la tarjeta interior reactiva los eventos con pointer-events-auto.
      */}
      <div className="fixed inset-0 z-[999] pointer-events-none flex items-end justify-end">
        <div
          className={`cookie-banner pointer-events-auto w-full md:w-auto md:max-w-sm md:m-6 md:rounded-2xl ${isExiting ? "exiting" : ""}
            bg-[#0a0a0a] border-t border-white/10
            md:border md:border-white/10
            shadow-[0_-4px_40px_rgba(0,0,0,0.6)] md:shadow-2xl
          `}
        >
          {/* Línea de acento superior — solo desktop */}
          <div className="hidden md:block h-px bg-gradient-to-r from-white/0 via-white/30 to-white/0 rounded-t-2xl" />

          <div className="px-5 py-5 md:px-6 md:py-6 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-white/60"
                >
                  <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                  <path d="M8.5 8.5v.01M16 15.5v.01M12 12v.01" />
                </svg>
              </div>
              <h3 className="font-wide text-white text-sm font-bold uppercase tracking-widest leading-none">
                {t.title}
              </h3>
            </div>

            {/* Description and button*/}
            <p className="font-sans text-white/50 text-xs leading-relaxed">
              {t.desc}
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(new Event("open-cookies-modal"))
                }
                className="text-white/80 underline decoration-white/20 hover:text-white hover:decoration-white transition-colors cursor-pointer ml-1"
              >
                {t.link}
              </button>
            </p>

            {/* Botones */}
            <div className="flex gap-2.5">
              <button
                onClick={() => handleDecision("rejected")}
                className="flex-1 font-sans text-[10px] uppercase tracking-[0.15em] py-3 border border-white/15 text-white/50 hover:text-white hover:border-white/40 active:scale-95 transition-all duration-200 rounded-lg"
              >
                {t.reject}
              </button>
              <button
                onClick={() => handleDecision("accepted")}
                className="flex-1 font-sans text-[10px] uppercase tracking-[0.15em] py-3 bg-white text-black font-bold hover:bg-white/85 active:scale-95 transition-all duration-200 rounded-lg"
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
