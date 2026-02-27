import React, { useEffect, Suspense, lazy } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LanguageProvider } from "./context/LanguageContext";

// 1. IMPORTAMOS VERCEL ANALYTICS Y SPEED INSIGHTS
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import InteractiveCanvas from "./components/InteractiveCanvas";
import Header from "./components/Header";
import Hero from "./components/Hero";

// CARGA DIFERIDA
const Intro = lazy(() => import("./components/Intro"));
const Experience = lazy(() => import("./components/Experience"));
const Stack = lazy(() => import("./components/Stack"));
const Projects = lazy(() => import("./components/Projects"));
const Stats = lazy(() => import("./components/Stats"));
const ApiSection = lazy(() => import("./components/ApiSection"));
const Contact = lazy(() => import("./components/Contact"));

gsap.registerPlugin(ScrollTrigger);

// Evita que ScrollTrigger recalcule en cada resize de teclado móvil (reduce ticks)
ScrollTrigger.config({ ignoreMobileResize: true });

export default function App() {
  const [loadRest, setLoadRest] = React.useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    // Guardamos la referencia para poder eliminarla correctamente en cleanup
    const rafFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(rafFn);
    gsap.ticker.lagSmoothing(0);

    const timer = setTimeout(() => setLoadRest(true), 1500);
    const handleInteraction = () => setLoadRest(true);

    // Escuchamos el primer movimiento para cargar el resto de la web
    window.addEventListener("scroll", handleInteraction, {
      once: true,
      passive: true,
    });
    window.addEventListener("mousemove", handleInteraction, {
      once: true,
      passive: true,
    });
    window.addEventListener("touchstart", handleInteraction, {
      once: true,
      passive: true,
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafFn);

      // Limpiamos los eventos de carga diferida
      clearTimeout(timer);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  return (
    <LanguageProvider>
      <main className="relative min-h-screen selection:bg-accent selection:text-black">
        <div className="glow-bg"></div>

        {/* Secciones críticas que el usuario ve en el segundo 1 */}
        <InteractiveCanvas />
        <Header />
        <Hero />

        {loadRest && (
          <Suspense fallback={<div className="min-h-screen"></div>}>
            <Intro />
            <Experience />
            <Stack />
            <Projects />
            <Stats />
            <ApiSection />
            <Contact />
          </Suspense>
        )}

        <Analytics />
        <SpeedInsights />
      </main>
    </LanguageProvider>
  );
}
