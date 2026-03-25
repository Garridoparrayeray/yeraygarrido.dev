import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../context/LanguageContext";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();

  // Fija el estado inicial de GSAP ANTES del primer paint para evitar flash
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const letters = titleRef.current?.querySelectorAll(".char") || [];
      gsap.set(letters, { y: "120%", rotate: 10, opacity: 0 });
      gsap.set(textWrapperRef.current, { opacity: 0, y: 30 });
      if (buttonsRef.current?.children) {
        gsap.set(Array.from(buttonsRef.current.children), { y: 30, opacity: 0 });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    let ctx: gsap.Context;

    document.fonts.ready.then(() => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline();

        const letters = titleRef.current?.querySelectorAll(".char") || [];
        tl.to(letters, {
          y: "0%",
          rotate: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.03,
          ease: "power4.out",
          delay: 0.2,
        });

        tl.to(
          textWrapperRef.current,
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
          "-=0.8",
        );

        tl.to(
          buttonsRef.current?.children || [],
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" },
          "-=0.6",
        );

        // Promovemos el contenedor a capa GPU propia ANTES de que empiece
        // el parallax. Sin esto, el scale en el padre fuerza recalcular el
        // clip de cada overflow-hidden hijo letra por letra al revertir el
        // scroll, causando los ticks visibles al subir.
        gsap.set(containerRef.current, { willChange: "transform, opacity" });

        gsap.to(containerRef.current, {
          yPercent: 20,
          scale: 0.95,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        });

        // ScrollTrigger.refresh() fuerza mediciones de layout (reflow) de todos
        // los triggers registrados. Moverlo a un doble RAF lo saca completamente
        // del hilo principal del primer frame, eliminando el forced reflow de 124ms.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
          });
        });

      }, containerRef);
    });

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="min-h-svh flex flex-col justify-between px-4 md:px-12 pt-24 pb-8 relative z-10 origin-top"
      style={{
        background: 'radial-gradient(circle at 50% 120%, rgba(255,255,255,0.06) 0%, transparent 60%), linear-gradient(to bottom, transparent 0%, #000 100%)',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <h1
          ref={titleRef}
          className="font-wide text-[12vw] md:text-[8vw] font-bold leading-[1] text-white tracking-tighter select-none flex flex-col md:flex-row justify-center items-center py-4 md:gap-[3vw]"
        >
          <span className="sr-only">YERAY GARRIDO</span>
          <div aria-hidden="true" className="flex flex-col md:flex-row justify-center items-center md:gap-[3vw]">
            <div className="flex overflow-hidden pb-2 md:pb-4" style={{transform: "translateZ(0)", willChange: "transform"}}>
              {"YERAY".split("").map((char, i) => (
                <span key={`first-${i}`} className="char inline-block">{char}</span>
              ))}
            </div>
            <div className="flex overflow-hidden pb-2 md:pb-4" style={{transform: "translateZ(0)", willChange: "transform"}}>
              {"GARRIDO".split("").map((char, i) => (
                <span key={`last-${i}`} className="char inline-block">{char}</span>
              ))}
            </div>
          </div>
        </h1>

        <div ref={textWrapperRef} className="mt-6 flex flex-col items-center">
          <h2 className="font-sans text-lg md:text-2xl font-light tracking-[0.3em] uppercase text-white/80 text-center px-4">
            {t("hero.role")}
          </h2>
          <p className="mt-4 font-sans text-[10px] md:text-xs tracking-[0.2em] text-white/40 uppercase">
            {t("hero.portfolio", { year: new Date().getFullYear().toString() })}
          </p>
        </div>
      </div>

      <div className="mt-auto pt-8 pb-8 flex flex-col items-center w-full max-w-md mx-auto">
        <div ref={buttonsRef} className="flex flex-col w-full gap-3">
          <a
            href={`/CV_YerayGarrido_${language}.pdf`}
            download={`CV_YerayGarrido_${language.toUpperCase()}.pdf`}
            className="flex w-full group"
            aria-label={t("hero.downloadCv")}
          >
            <div className="bg-white border border-white w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shrink-0 group-hover:bg-black transition-colors duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black group-hover:text-white transition-colors duration-300">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
            <div className="bg-black border border-white flex-1 flex items-center justify-center font-sans font-bold text-white text-sm md:text-lg tracking-widest uppercase group-hover:bg-white group-hover:text-black transition-colors duration-300">
              {t("hero.downloadCv")}
            </div>
          </a>

          <a
            href="https://github.com/Garridoparrayeray"
            target="_blank"
            rel="noreferrer"
            className="flex w-full group"
            aria-label={t("hero.githubProfile")}
          >
            <div className="bg-black border border-white w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:text-black transition-colors duration-300">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
              </svg>
            </div>
            <div className="bg-black border border-white flex-1 flex items-center justify-center font-sans font-bold text-white text-sm md:text-lg tracking-widest uppercase group-hover:bg-white group-hover:text-black transition-colors duration-300">
              {t("hero.githubProfile")}
            </div>
          </a>
        </div>

        <div className="mt-12 animate-bounce opacity-50">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        </div>
      </div>
    </section>
  );
}
