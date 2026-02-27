import React, { useEffect, Suspense, lazy } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LanguageProvider } from './context/LanguageContext';

// 1. IMPORTAMOS VERCEL ANALYTICS AQUÍ
import { Analytics } from '@vercel/analytics/react';

import InteractiveCanvas from './components/InteractiveCanvas';
import Header from './components/Header';
import Hero from './components/Hero';

//CARGA DIFERIDA 
const Intro = lazy(() => import('./components/Intro'));
const Experience = lazy(() => import('./components/Experience'));
const Stack = lazy(() => import('./components/Stack'));
const Projects = lazy(() => import('./components/Projects'));
const Stats = lazy(() => import('./components/Stats'));
const ApiSection = lazy(() => import('./components/ApiSection'));
const Contact = lazy(() => import('./components/Contact'));

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  return (
    <LanguageProvider>
      <main className="relative min-h-screen selection:bg-accent selection:text-black">
        {/* Fondo (sin el ruido que quitaste) */}
        <div className="glow-bg"></div>
        
        {/* Secciones críticas que el usuario ve en el segundo 1 */}
        <InteractiveCanvas />
        <Header />
        <Hero />
        
        {/* Secciones secundarias envueltas en Suspense */}
        <Suspense fallback={<div className="min-h-screen"></div>}>
          <Intro />
          <Experience />
          <Stack />
          <Projects />
          <Stats />
          <ApiSection />
          <Contact />
        </Suspense>

        <Analytics />
      </main>
    </LanguageProvider>
  );
}