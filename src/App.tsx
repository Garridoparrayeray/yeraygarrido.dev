import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import InteractiveCanvas from './components/InteractiveCanvas';
import Header from './components/Header';
import Hero from './components/Hero';
import Intro from './components/Intro';
import Stack from './components/Stack';
import Experience from './components/Experience';
import Stats from './components/Stats';
import ApiSection from './components/ApiSection';
import Projects from './components/Projects';
import Contact from './components/Contact';
import { LanguageProvider } from './context/LanguageContext';

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
        <div className="noise"></div>
        <div className="glow-bg"></div>
        <InteractiveCanvas />
        <Header />
        <Hero />
        <Intro />
        <Experience />
        <Stack />
        <Projects />
        <Stats />
        <ApiSection />
        <Contact />
      </main>
    </LanguageProvider>
  );
}
