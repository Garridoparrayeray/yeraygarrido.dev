import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const languages = [
    { code: "en", label: "EN" },
    { code: "es", label: "ES" },
    { code: "eu", label: "EU" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 py-2 ${scrolled ? "bg-black/90 backdrop-blur-md border-b border-white/10" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="header-item font-wide font-bold text-xl tracking-widest uppercase text-white hover:opacity-70 transition-opacity cursor-pointer"
        >
          <img
            src="/img/logo.webp"
            alt={t("header.logoAlt")} 
            className="h-12 md:h-14 w-auto hover:scale-105 transition-transform object-contain"
          />
        </a>

        <div className="flex items-center gap-6 md:gap-8">
          <div className="hidden md:flex items-center gap-5">
            <a
              href="https://github.com/Garridoparrayeray"
              target="_blank"
              rel="noreferrer"
              className="header-item text-white/60 hover:text-white transition-colors"
              aria-label={t("header.githubAria")} 
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/yeray-garrido/"
              target="_blank"
              rel="noreferrer"
              className="header-item text-white/60 hover:text-white transition-colors"
              aria-label={t("header.linkedinAria")} 
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect width="4" height="12" x="2" y="9"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a
              href="mailto:garridoparrayeraytx@gmail.com"
              className="header-item text-white/60 hover:text-white transition-colors"
              aria-label={t("header.emailAria")} 
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
            </a>
          </div>

          <div className="hidden md:block header-item w-px h-6 bg-white/20"></div>

          {/* Selector de Idiomas */}
          <div className="relative header-item flex flex-col items-center">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              onBlur={() => setTimeout(() => setIsLangMenuOpen(false), 200)}
              aria-expanded={isLangMenuOpen}
              aria-haspopup="true"
              aria-label={t("header.switchLanguage")} // <--- TRADUCIDO
              className="flex items-center justify-center gap-1.5 font-sans text-xs tracking-widest uppercase font-bold px-4 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all duration-300 text-white min-w-[72px]"
            >
              <span>{language}</span>
              <svg
                className={`w-3 h-3 transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] ${isLangMenuOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Menú Desplegable */}
            <div
              className={`absolute top-full mt-2 w-full bg-black/90 backdrop-blur-md border border-white/10 rounded-md flex flex-col overflow-hidden origin-top transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                ${isLangMenuOpen ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"}`}
            >
              {languages.map((lang, index) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as any);
                    setIsLangMenuOpen(false);
                  }}
                  className={`font-sans text-xs tracking-widest uppercase font-bold py-3 w-full text-center transition-colors duration-200 
                    ${index !== languages.length - 1 ? "border-b border-white/10" : ""}
                    ${language === lang.code ? "bg-white text-black" : "text-white/60 hover:text-white hover:bg-white/10"}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
