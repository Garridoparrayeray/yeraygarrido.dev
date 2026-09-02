import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import gsap from "gsap";

/**
 * TearLink — enlace que, al pulsarlo, hace un "corte" al estilo anime:
 * un tajo lateral cruza la pantalla, seguido de flash de impacto +
 * rafaga de lineas de velocidad, y ENTONCES la pantalla negra se hace
 * pedazos en una cuadricula de fragmentos que salen despedidos
 * (arrancando por la fila de abajo, en cascada hacia arriba) -- como si
 * el propio tajo fuera lo que la rompe. Revela el beige del portfolio
 * de fotografia por debajo, y solo entonces navega de verdad al destino.
 *
 * TODO en porcentajes (posicion/tamano de cada fragmento, translate,
 * clip-path de las lineas de velocidad) a proposito -- responsive por
 * construccion, sin media queries ni calculos de tamano de viewport: el
 * mismo efecto funciona igual de movil a escritorio.
 *
 * Los fragmentos son rectangulos simples que EN REPOSO encajan sin
 * huecos (una cuadricula normal, indistinguible de una pantalla negra
 * solida) -- ninguna geometria irregular que tenga que casar borde con
 * borde entre vecinos. El aspecto "roto"/anguloso lo da la propia
 * animacion (rotacion + salida en direcciones distintas por fragmento),
 * no la forma de cada pieza -- mismo principio que un efecto de cristal
 * roto tipico: piezas rectangulares, la fisica de la rotura la hace el
 * movimiento, no el recorte.
 */

const COLS = 5;
const ROWS = 4;

interface Shard {
  col: number;
  row: number;
  left: number;
  top: number;
  width: number;
  height: number;
  flyXPercent: number;
  flyYPercent: number;
  rotate: number;
}

// Calculados UNA vez (no en cada render): posicion/tamano de celda fijos
// por construccion (cuadricula regular), y un vector de salida por
// fragmento derivado de su posicion relativa al centro -- los de la
// izquierda salen hacia la izquierda, los de arriba hacia arriba, etc,
// con algo de variacion para que no se vea todo perfectamente simetrico.
const SHARDS: Shard[] = Array.from({ length: COLS * ROWS }, (_, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const dx = ((col + 0.5) / COLS - 0.5) * 2; // -1..1, distancia al centro en X
  const dy = ((row + 0.5) / ROWS - 0.5) * 2; // -1..1, distancia al centro en Y
  const jitter = ((col * 7 + row * 13) % 10) / 10 - 0.5; // -0.5..0.5, determinista (no Math.random en cada carga)

  return {
    col,
    row,
    left: (col / COLS) * 100,
    top: (row / ROWS) * 100,
    width: 100 / COLS,
    height: 100 / ROWS,
    flyXPercent: dx * 220 + jitter * 60,
    // Ademas de alejarse del centro en Y, TODOS suben en conjunto
    // (-160 extra) -- el impulso general del corte es hacia arriba,
    // coherente con que arranca en la fila de abajo.
    flyYPercent: dy * 160 - 160,
    rotate: dx * 35 + jitter * 40,
  };
});

// Beige del portfolio de fotografia (--paper alli) -- lo que queda
// revelado segun los fragmentos negros salen despedidos.
const DEST_BG = "#e8dfd0";

interface TearLinkProps {
  href: string;
  className?: string;
  ariaLabel: string;
  children: ReactNode;
}

export default function TearLink({ href, className, ariaLabel, children }: TearLinkProps) {
  const [isTearing, setIsTearing] = useState(false);
  const shardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const flashRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const slashRef = useRef<HTMLDivElement>(null);

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

  // FIX "si vas hacia atras se queda asi": tras el window.location.href
  // de la FASE 3, el navegador puede restaurar esta pagina desde la
  // bfcache (cache de "atras/adelante") al pulsar Atras -- literalmente
  // congelada en el ULTIMO frame antes de navegar (todo lo negro ya
  // volado, solo el beige de fondo cubriendo la pantalla), porque
  // isTearing nunca se puso a false. 'pageshow' con persisted:true es
  // el evento que dispara exactamente en ese caso (restauracion desde
  // bfcache, a diferencia de una carga nueva normal) -- se resetea el
  // estado para que la pagina vuelva a verse normal.
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setIsTearing(false);
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // El overlay (fragmentos, flash, rafaga) se monta condicionalmente en
  // el JSX de abajo -- justo tras setIsTearing(true), React todavia NO
  // ha actualizado el DOM (los cambios de estado no se aplican de forma
  // sincrona dentro del mismo handler), asi que las refs seguirian
  // siendo null si la animacion se lanzara ahi mismo. Dispararla aqui,
  // en un effect que depende de isTearing, garantiza que los elementos
  // reales ya existen en el DOM.
  useEffect(() => {
    if (!isTearing) return;

    const tl = gsap.timeline({
      onComplete: () => { window.location.href = href; },
    });

    // FASE 1 — El tajo: una banda diagonal brillante cruza la pantalla
    // de lado a lado, rapido. La diagonal la da el angulo del propio
    // gradiente (linear-gradient(105deg...)), NO un transform:rotate()
    // -- asi el barrido es un simple translate lateral en left/xPercent,
    // sin ambiguedad de en que eje se mueve un elemento ya rotado.
    // Duraciones ~1.5x mas largas que el primer intento -- "me ha
    // gustado, mucho" pero pedido explicitamente mas largo. Mismas
    // proporciones relativas entre fases, solo estiradas.
    tl.set(slashRef.current, { left: "-60%", opacity: 1 });
    tl.to(slashRef.current, { left: "140%", duration: 0.36, ease: "power2.in" }, 0);
    tl.to(slashRef.current, { opacity: 0, duration: 0.15, ease: "none" }, 0.33);

    // FASE 2 — Impacto: justo cuando el tajo termina de cruzar, flash
    // blanco + rafaga de lineas de velocidad (conic-gradient), un golpe
    // muy corto -- el "frame de impacto" tipico de un corte de anime,
    // como si el tajo fuera lo que dispara la rotura de la FASE 3.
    tl.set([flashRef.current, burstRef.current], { opacity: 0 }, 0);
    tl.set(burstRef.current, { scale: 0.3 }, 0);
    tl.to(flashRef.current, { opacity: 1, duration: 0.09, ease: "none" }, 0.3);
    tl.to(burstRef.current, { opacity: 0.9, scale: 1.6, duration: 0.27, ease: "power1.out" }, 0.3);
    tl.to(flashRef.current, { opacity: 0, duration: 0.24, ease: "power1.in" }, 0.39);
    tl.to(burstRef.current, { opacity: 0, duration: 0.52, ease: "power1.in" }, 0.52);

    // FASE 3 — Estallido: cada fragmento sale despedido segun su propio
    // vector (SHARDS), en cascada arrancando por la fila de abajo
    // (grid + from:"end" con axis:"y" en un grid COLS x ROWS: la ultima
    // fila -- la de abajo -- empieza primero) -- justo detras del tajo,
    // como si lo que lo hubiera partido.
    tl.to(
      shardRefs.current,
      {
        xPercent: (i) => SHARDS[i].flyXPercent,
        yPercent: (i) => SHARDS[i].flyYPercent,
        rotate: (i) => SHARDS[i].rotate,
        opacity: 0,
        duration: 1.1,
        ease: "power2.in",
        stagger: {
          each: 0.042,
          grid: [ROWS, COLS],
          from: "end",
          axis: "y",
        },
      },
      0.36
    );

    return () => { tl.kill(); };
  }, [isTearing, href]);

  return (
    <>
      <a href={href} onClick={handleClick} className={className} aria-label={ariaLabel}>
        {children}
      </a>

      {isTearing && (
        // FIX: 'z-999' no es sintaxis valida de Tailwind (hace falta
        // z-[999] para un valor arbitrario) -- sin corchetes no genera
        // NINGUN CSS, asi que el overlay se quedaba con z-index:auto,
        // por debajo del Header (z-50) en vez de tapar toda la pantalla.
        <div className="fixed inset-0 z-[999] pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0" style={{ backgroundColor: DEST_BG }} />

          {SHARDS.map((s, i) => (
            <div
              key={i}
              ref={(el) => { shardRefs.current[i] = el; }}
              className="absolute bg-black"
              style={{ left: `${s.left}%`, top: `${s.top}%`, width: `${s.width}%`, height: `${s.height}%` }}
            />
          ))}

          <div
            ref={slashRef}
            className="absolute inset-y-[-20%] w-[45%]"
            style={{
              background:
                "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.95) 48%, rgba(255,255,255,0.95) 52%, transparent 70%)",
              filter: "drop-shadow(0 0 24px rgba(255,255,255,0.85))",
            }}
          />

          <div
            ref={burstRef}
            className="absolute top-1/2 left-1/2 w-[140vmax] h-[140vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.9) 0deg 1.5deg, transparent 1.5deg 9deg)",
              mixBlendMode: "screen",
            }}
          />

          <div ref={flashRef} className="absolute inset-0 bg-white" />
        </div>
      )}
    </>
  );
}
