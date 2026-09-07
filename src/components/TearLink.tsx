import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { createPortal } from "react-dom";

/**
 * TearLink — enlace que, al pulsarlo, cubre la pantalla con dos capas
 * de borde irregular (mismos colores/idea que el "shape overlays" de
 * Blake Bowen que se uso antes) que suben desde abajo hasta cubrir del
 * todo, y SOLO ENTONCES navega de verdad al destino.
 *
 * FIX "el out lo tiene que hacer nada mas cargar la pagina web, no
 * antes": el retroceso (el "descubrir") pasa en la pagina de DESTINO,
 * nunca aqui -- ver entryTransition.js en el repo de la galeria. Aqui
 * SOLO se cubre, nunca se retrocede; el destino recibe ?enter=wave en
 * la URL para saber que tiene que arrancar ya cubierto.
 *
 * FIX real (bug ya corregido en un intento anterior con otro efecto,
 * mismo problema de fondo aqui): portal a document.body -- cualquier
 * ancestro con transform/filter/backdrop-filter/will-change:transform
 * crea su propio containing block para descendientes fixed, asi que
 * sin portal el overlay podia quedar encajonado dentro de un ancestro
 * en vez de cubrir el viewport entero.
 *
 * FIX "si vas hacia atras se queda asi": 'pageshow' con persisted:true
 * resetea el overlay si la pagina se restaura desde la bfcache tras
 * pulsar Atras en el navegador.
 *
 * FIX "aparece a medio cubrir / plana sin ola / se congela a medio
 * camino, distinto cada vez": version anterior animaba a mano, cuadro a
 * cuadro (primero via gsap.timeline(), luego via requestAnimationFrame
 * propio), 10 puntos de control por capa recalculando el 'd' de un
 * SVG en cada frame. En dispositivos reales el resultado era
 * inconsistente de formas distintas segun el dispositivo (confirmado
 * que NINGUNA prueba automatizada -- movil, escritorio, dos motores de
 * renderizado, CPU limitada a una sexta parte -- lograba reproducir lo
 * que se veia en capturas reales), señal de que el problema de fondo
 * era depender de JS por-frame en absoluto, no un bug puntual
 * concreto. Se elimina esa clase entera de fallo: la cortina es ahora
 * dos <div> con clip-path FIJO (forma irregular generada una vez al
 * arrancar, no recalculada) que se desplazan con transform + transition
 * CSS -- eso lo ejecuta el hilo de composicion del navegador, no
 * JavaScript, y no puede depender de cuantos frames de rAF lleguen a
 * ejecutarse ni de cuando llega el primero.
 */

const NUM_POINTS = 8;
const JITTER_MAX = 12; // % de variacion del borde superior irregular (0 = recto)
const DURATION_MS = 900;
const LAYER_DELAY_MS = 250; // desfase de la 2a capa, efecto de profundidad

function randomClipPath(): string {
  const points: string[] = [];
  for (let i = 0; i < NUM_POINTS; i++) {
    const x = (i / (NUM_POINTS - 1)) * 100;
    const y = Math.random() * JITTER_MAX;
    points.push(`${x}% ${y}%`);
  }
  return `polygon(${points.join(", ")}, 100% 100%, 0% 100%)`;
}

interface TearLinkProps {
  href: string;
  className?: string;
  ariaLabel: string;
  children: ReactNode;
}

export default function TearLink({ href, className, ariaLabel, children }: TearLinkProps) {
  const [isTearing, setIsTearing] = useState(false);
  const [isCovering, setIsCovering] = useState(false);
  const clipPaths = useRef<[string, string]>(["", ""]);
  const navigatedRef = useRef(false);

  const navigate = () => {
    if (navigatedRef.current) return;
    navigatedRef.current = true;
    const url = new URL(href);
    url.searchParams.set("enter", "wave");
    window.location.href = url.toString();
  };

  const handleClick = (e: MouseEvent) => {
    // Click con modificador (abrir en pestana nueva, etc.) o boton
    // distinto al principal: se deja el comportamiento nativo del
    // navegador tal cual, sin el efecto -- el usuario pidio explicitamente
    // otra cosa (nueva pestana/ventana), no tiene sentido interceptarlo.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (isTearing) return;
    clipPaths.current = [randomClipPath(), randomClipPath()];
    setIsTearing(true);
  };

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        navigatedRef.current = false;
        setIsCovering(false);
        setIsTearing(false);
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // El overlay se monta condicionalmente en el JSX de abajo, arrancando
  // en transform:translateY(100%) (fuera de pantalla). Necesita pintarse
  // asi en un frame real ANTES de pasar a translateY(0) -- si no, el
  // navegador puede fusionar ambos estados en un solo frame y saltarse
  // la transicion entera. Doble rAF: el primero espera al frame donde ya
  // se pinto el estado inicial, el segundo dispara el cambio.
  useEffect(() => {
    if (!isTearing) return;

    let rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(() => setIsCovering(true));
    });

    // Red de seguridad: fuerza la navegacion pasado el tiempo maximo que
    // puede durar la transicion (con margen), por si 'transitionend' no
    // llegara a dispararse por algun motivo.
    const safetyTimer = window.setTimeout(navigate, DURATION_MS + LAYER_DELAY_MS + 600);

    return () => { cancelAnimationFrame(rafId); window.clearTimeout(safetyTimer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTearing, href]);

  return (
    <>
      <a href={href} onClick={handleClick} className={className} aria-label={ariaLabel}>
        {children}
      </a>

      {isTearing && createPortal(
        <div className="fixed inset-0 z-[999] pointer-events-none" aria-hidden="true">
          {/* Colores de las dos paginas: tinta casi negra (esta web)
              hacia el beige del portfolio de fotografia (destino), en
              dos capas ligeramente desfasadas entre si. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, #8c8378 0%, #e8dfd0 100%)",
              clipPath: clipPaths.current[0],
              transform: isCovering ? "translateY(0%)" : "translateY(100%)",
              transition: `transform ${DURATION_MS}ms cubic-bezier(.65,0,.35,1)`,
            }}
          />
          <div
            onTransitionEnd={(e) => {
              if (e.propertyName === "transform") navigate();
            }}
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, #171614 0%, #8c8378 100%)",
              clipPath: clipPaths.current[1],
              transform: isCovering ? "translateY(0%)" : "translateY(100%)",
              transition: `transform ${DURATION_MS}ms cubic-bezier(.65,0,.35,1) ${LAYER_DELAY_MS}ms`,
            }}
          />
        </div>,
        document.body
      )}
    </>
  );
}
