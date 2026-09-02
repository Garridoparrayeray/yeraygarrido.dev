import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

/**
 * TearLink — enlace que, al pulsarlo, cubre la pantalla con una cortina
 * liquida de dos capas (SVG, borde ondulado animado via GSAP) que sube
 * desde abajo, en los colores de las dos paginas (tinta -> beige), y
 * solo entonces navega de verdad al destino.
 *
 * Tecnica: "Shape overlays" de Blake Bowen
 * (https://codepen.io/osublake/pen/BYwgBg) -- 2 <path> SVG cuyo borde se
 * genera interpolando NUM_POINTS puntos de control con curvas bezier
 * cubicas (ver renderPaths()); cada punto anima a su propio ritmo
 * (delay aleatorio) para que el borde no suba en linea recta sino como
 * una ola irregular, y los dos paths llevan ademas un desfase entre si
 * (DELAY_PER_PATH) para el efecto de capas. Adaptado a un solo sentido
 * (cubrir y navegar, no un toggle abrir/cerrar reutilizable) y
 * disparado desde el click del link, no desde un listener propio del
 * overlay.
 *
 * FIX real (bug ya corregido en un intento anterior con otro efecto,
 * mismo problema de fondo aqui): portal a document.body -- cualquier
 * ancestro con transform/filter/backdrop-filter/will-change:transform
 * (el Header lo tiene via backdrop-blur-md cuando esta scrolled) crea
 * su propio containing block para descendientes fixed, asi que sin
 * portal el overlay podia quedar encajonado dentro de un ancestro en
 * vez de cubrir el viewport entero.
 *
 * FIX "si vas hacia atras se queda asi": 'pageshow' con persisted:true
 * resetea el overlay (y los puntos de control) si la pagina se
 * restaura desde la bfcache tras pulsar Atras en el navegador.
 */

const NUM_POINTS = 10;
const NUM_PATHS = 2;
const DELAY_POINTS_MAX = 0.3;
const DELAY_PER_PATH = 0.25;
const DURATION = 0.9;

function freshPoints(): number[][] {
  return Array.from({ length: NUM_PATHS }, () => Array(NUM_POINTS).fill(0));
}

interface TearLinkProps {
  href: string;
  className?: string;
  ariaLabel: string;
  children: ReactNode;
}

export default function TearLink({ href, className, ariaLabel, children }: TearLinkProps) {
  const [isTearing, setIsTearing] = useState(false);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const pointsRef = useRef<number[][]>(freshPoints());

  const handleClick = (e: MouseEvent) => {
    // Click con modificador (abrir en pestana nueva, etc.) o boton
    // distinto al principal: se deja el comportamiento nativo del
    // navegador tal cual, sin el efecto -- el usuario pidio explicitamente
    // otra cosa (nueva pestana/ventana), no tiene sentido interceptarlo.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (isTearing) return;
    setIsTearing(true);
  };

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        pointsRef.current = freshPoints();
        setIsTearing(false);
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // El overlay se monta condicionalmente en el JSX de abajo -- justo
  // tras setIsTearing(true), React todavia NO ha actualizado el DOM,
  // asi que las refs de los <path> seguirian siendo null si la
  // animacion se lanzara ahi mismo. Dispararla aqui, en un effect que
  // depende de isTearing, garantiza que los elementos reales ya existen.
  useEffect(() => {
    if (!isTearing) return;

    // Construye el atributo 'd' de cada path a partir de sus puntos de
    // control actuales -- cada punto representa cuanto ha "crecido"
    // hacia arriba desde el borde inferior (0 = nada, 100 = pantalla
    // entera cubierta); la coordenada Y real de la ola es 100-punto.
    const renderPaths = () => {
      for (let i = 0; i < NUM_PATHS; i++) {
        const path = pathRefs.current[i];
        const points = pointsRef.current[i];
        if (!path) continue;

        let d = `M 0 100 V ${100 - points[0]} C`;
        for (let j = 0; j < NUM_POINTS - 1; j++) {
          const p = ((j + 1) / (NUM_POINTS - 1)) * 100;
          const cp = p - (100 / (NUM_POINTS - 1)) / 2;
          d += ` ${cp} ${100 - points[j]} ${cp} ${100 - points[j + 1]} ${p} ${100 - points[j + 1]}`;
        }
        d += ` V 100 H 0`;
        path.setAttribute("d", d);
      }
    };

    const tl = gsap.timeline({
      onUpdate: renderPaths,
      onComplete: () => { window.location.href = href; },
      defaults: { ease: "power2.inOut", duration: DURATION },
    });

    // Un retraso aleatorio por punto (compartido entre los dos paths,
    // para que la ola de ambos se corresponda) es lo que rompe la linea
    // recta y la convierte en una ola irregular.
    const pointsDelay: number[] = [];
    for (let j = 0; j < NUM_POINTS; j++) pointsDelay[j] = Math.random() * DELAY_POINTS_MAX;

    for (let i = 0; i < NUM_PATHS; i++) {
      const points = pointsRef.current[i];
      const pathDelay = DELAY_PER_PATH * i; // el segundo path va detras del primero, efecto de capas
      for (let j = 0; j < NUM_POINTS; j++) {
        tl.to(points, { [j]: 100 }, pointsDelay[j] + pathDelay);
      }
    }

    return () => { tl.kill(); };
  }, [isTearing, href]);

  return (
    <>
      <a href={href} onClick={handleClick} className={className} aria-label={ariaLabel}>
        {children}
      </a>

      {isTearing && createPortal(
        <svg
          className="fixed inset-0 z-[999] pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            {/* Colores de las dos paginas: tinta casi negra (esta web)
                hacia el beige del portfolio de fotografia (destino),
                en dos capas ligeramente desfasadas entre si. */}
            <linearGradient id="tearGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#171614" />
              <stop offset="100%" stopColor="#8c8378" />
            </linearGradient>
            <linearGradient id="tearGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8c8378" />
              <stop offset="100%" stopColor="#e8dfd0" />
            </linearGradient>
          </defs>
          <path ref={(el) => { pathRefs.current[0] = el; }} fill="url(#tearGradient2)" />
          <path ref={(el) => { pathRefs.current[1] = el; }} fill="url(#tearGradient1)" />
        </svg>,
        document.body
      )}
    </>
  );
}
