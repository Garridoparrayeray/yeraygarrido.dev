import React, { useEffect, Suspense, lazy } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LanguageProvider } from "./context/LanguageContext";

import InteractiveCanvas from "./components/InteractiveCanvas";
import Header from "./components/Header";
import Hero from "./components/Hero";

const Intro = lazy(() => import("./components/Intro"));
const Experience = lazy(() => import("./components/Experience"));
const Stack = lazy(() => import("./components/Stack"));
const Projects = lazy(() => import("./components/Projects"));
const Stats = lazy(() => import("./components/Stats"));
const ApiSection = lazy(() => import("./components/ApiSection"));
const Contact = lazy(() => import("./components/Contact"));

// CARGA DIFERIDA DE ANALÍTICAS
const Analytics = lazy(() => import("@vercel/analytics/react").then(m => ({ default: m.Analytics })));
const SpeedInsights = lazy(() => import("@vercel/speed-insights/react").then(m => ({ default: m.SpeedInsights })));

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export default function App() {
  const [loadRest, setLoadRest] = React.useState(false);

  useEffect(() => {
    if (loadRest) {
      import('@microsoft/clarity').then((Clarity) => {
        Clarity.default.init("voxu774h3f");
      });
    }
  }, [loadRest]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const rafFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(rafFn);
    gsap.ticker.lagSmoothing(0);

    const timer = setTimeout(() => setLoadRest(true), 2500);
    const handleInteraction = () => setLoadRest(true);

    window.addEventListener("scroll", handleInteraction, { once: true, passive: true });
    window.addEventListener("mousemove", handleInteraction, { once: true, passive: true });
    window.addEventListener("touchstart", handleInteraction, { once: true, passive: true });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafFn);
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

        {/* LO QUE VE LIGHTHOUSE Y EL USUARIO AL INSTANTE */}
        <InteractiveCanvas />
        <Header />
        <Hero />

        {/* LO QUE SE CARGA EN SEGUNDO PLANO CUANDO HAY INTERACCIÓN */}
        {loadRest && (
          <Suspense fallback={<div className="min-h-screen"></div>}>
            <Intro />
            <Experience />
            <Stack />
            <Projects />
            <Stats />
            <ApiSection />
            <Contact />
            
            <Analytics />
            <SpeedInsights />
          </Suspense>
        )}
      </main>
    </LanguageProvider>
  );
}