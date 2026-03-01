import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false); // Para la animación de salida
  const { language } = useLanguage();

  const texts = {
    es: {
      title: "Uso de Cookies ",
      desc: "Utilizo Microsoft Clarity de forma anónima para entender cómo navegas por mi portfolio y mejorar la experiencia. Puedes leer más en mi ",
      link: "Política de Cookies.",
      accept: "Aceptar",
      reject: "Rechazar"
    },
    en: {
      title: "Cookie Policy",
      desc: "I use Microsoft Clarity anonymously to understand how you navigate my portfolio and improve the experience. Read more in my ",
      link: "Cookie Policy.",
      accept: "Accept",
      reject: "Reject"
    },
    eu: {
      title: "Cookieen Erabilera",
      desc: "Microsoft Clarity modu anonimoan erabiltzen dut nire portfolioan nola nabigatzen duzun ulertzeko. Irakurri gehiago nire ",
      link: "Cookie Politikan.",
      accept: "Onartu",
      reject: "Ezetsi"
    }
  };

  const t = texts[language as keyof typeof texts] || texts.es;

  useEffect(() => {
    const consentData = localStorage.getItem("clarity_consent_data");
    const now = new Date().getTime();
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000; // 30 días en milisegundos

    if (consentData) {
      const { status, timestamp } = JSON.parse(consentData);

      // Comprobamos si ha caducado (más de 30 días)
      if (now - timestamp > THIRTY_DAYS) {
        localStorage.removeItem("clarity_consent_data");
        setIsVisible(true);
      } else if (status === "accepted") {
        // Aún es válido y aceptó
        import("@microsoft/clarity").then((Clarity) => {
          Clarity.default.init("voxu774h3f");
        });
      }
    } else {
      // No hay datos, lo mostramos
      setIsVisible(true);
    }
  }, []);

  const handleDecision = (decision: "accepted" | "rejected") => {
    // Iniciamos la animación de salida
    setIsExiting(true);

    // Guardamos la decisión y la fecha exacta
    const data = {
      status: decision,
      timestamp: new Date().getTime(),
    };
    localStorage.setItem("clarity_consent_data", JSON.stringify(data));

    if (decision === "accepted") {
      import("@microsoft/clarity").then((Clarity) => {
        Clarity.default.init("voxu774h3f");
      });
    }

    // Esperamos a que termine la animación de salida (300ms) para desmontar el componente
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed bottom-6 right-6 z-999 max-w-sm p-6 bg-[#0a0a0a]/90 border border-white/10 rounded-2xl shadow-2xl flex flex-col gap-4 transition-all duration-300 ease-out transform ${
        isExiting ? "opacity-0 translate-y-8 scale-95" : "opacity-100 translate-y-0 scale-100"
      }`}
      style={{
        // Un pequeño hack inline para que la entrada sea animada desde que se monta en el DOM
        animation: isExiting ? "none" : "slideInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards"
      }}
    >
      <h3 className="font-wide text-white text-lg font-bold flex items-center gap-2">
        {t.title}
      </h3>
      <p className="font-sans text-white/60 text-sm leading-relaxed">
        {t.desc}
        <a href="/legal" className="text-white/90 underline decoration-white/30 hover:decoration-white transition-colors">
          {t.link}
        </a>
      </p>
      <div className="flex gap-3 mt-2">
        <button
          onClick={() => handleDecision("rejected")}
          className="flex-1 font-sans text-xs uppercase tracking-widest py-3 border border-white/20 text-white/70 hover:text-white hover:bg-white/10 transition-colors rounded-lg"
        >
          {t.reject}
        </button>
        <button
          onClick={() => handleDecision("accepted")}
          className="flex-1 font-sans text-xs uppercase tracking-widest py-3 bg-white text-black hover:bg-white/75 font-bold transition-all rounded-lg "
        >
          {t.accept}
        </button>
      </div>

      <style>{`
        @keyframes slideInUp {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}