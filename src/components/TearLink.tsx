import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import gsap from "gsap";

/**
 * TearLink — enlace que, al pulsarlo, "rasga" la pantalla en dos mitades
 * (arriba/abajo) que se separan revelando el beige del portfolio de
 * fotografia por debajo, y solo entonces navega de verdad al destino.
 * Pensado para el icono de fotografia del Header: la web actual es
 * fondo negro, la de destino es fondo beige -- el desgarro hace de
 * puente visual entre las dos en vez de un salto en seco.
 *
 * La linea de rotura (TEAR_EDGE) es FIJA, no aleatoria en cada render:
 * las dos mitades (arriba/abajo) tienen que encajar exactamente en el
 * mismo trazado irregular, generarla de nuevo cada vez las desalinearia.
 * Solo se anima transform (translate + rotate) en cada mitad, nunca el
 * propio clip-path -- mucho mas barato para el compositor que animar la
 * forma en si, y no hace falta ninguna libreria de morphing para un
 * clip-path que en realidad nunca cambia de forma, solo de posicion.
 */

const TEAR_EDGE: { x: number; y: number }[] = [
  { x: 0, y: 48 }, { x: 8, y: 53 }, { x: 16, y: 46 }, { x: 24, y: 55 },
  { x: 32, y: 44 }, { x: 40, y: 52 }, { x: 50, y: 47 }, { x: 60, y: 54 },
  { x: 68, y: 45 }, { x: 76, y: 53 }, { x: 84, y: 46 }, { x: 92, y: 51 },
  { x: 100, y: 48 },
];

function toPercentPoints(pts: { x: number; y: number }[]): string {
  return pts.map((p) => `${p.x}% ${p.y}%`).join(", ");
}

const TOP_CLIP = `polygon(0% 0%, 100% 0%, ${toPercentPoints([...TEAR_EDGE].reverse())}, 0% ${TEAR_EDGE[0].y}%)`;
const BOTTOM_CLIP = `polygon(${toPercentPoints(TEAR_EDGE)}, 100% 100%, 0% 100%)`;

// Beige del portfolio de fotografia (--paper alli) -- lo que queda
// "revelado" cuando las dos mitades negras se apartan.
const DEST_BG = "#e8dfd0";

interface TearLinkProps {
  href: string;
  className?: string;
  ariaLabel: string;
  children: ReactNode;
}

export default function TearLink({ href, className, ariaLabel, children }: TearLinkProps) {
  const [isTearing, setIsTearing] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: MouseEvent) => {
    // Click con modificador (abrir en pestana nueva, etc.) o boton
    // distinto al principal: se deja el comportamiento nativo del
    // navegador tal cual, sin desgarro -- el usuario pidio explicitamente
    // otra cosa (nueva pestana/ventana), no tiene sentido interceptarlo.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (isTearing) return;
    setIsTearing(true);

    const tl = gsap.timeline({
      onComplete: () => { window.location.href = href; },
    });
    tl.fromTo(
      topRef.current,
      { y: "0%", rotate: 0 },
      { y: "-105%", rotate: -2, duration: 0.7, ease: "power3.in" },
      0
    );
    tl.fromTo(
      bottomRef.current,
      { y: "0%", rotate: 0 },
      { y: "105%", rotate: 2, duration: 0.7, ease: "power3.in" },
      0
    );
  };

  return (
    <>
      <a href={href} onClick={handleClick} className={className} aria-label={ariaLabel}>
        {children}
      </a>

      {isTearing && (
        <div className="fixed inset-0 z-999 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0" style={{ backgroundColor: DEST_BG }} />
          <div ref={topRef} className="absolute inset-0 bg-black" style={{ clipPath: TOP_CLIP }} />
          <div ref={bottomRef} className="absolute inset-0 bg-black" style={{ clipPath: BOTTOM_CLIP }} />
        </div>
      )}
    </>
  );
}
