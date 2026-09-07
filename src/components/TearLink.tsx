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
 * un SVG con el borde ondulado FIJO (curvas bezier generadas una vez al
 * arrancar con la MISMA formula que antes, ver randomWavePath() --
 * pero calculada una unica vez, no recalculada cuadro a cuadro) que se
 * desplaza con transform + transition CSS -- eso lo ejecuta el hilo de
 * composicion del navegador, no JavaScript, y no puede depender de
 * cuantos frames de rAF lleguen a ejecutarse ni de cuando llega el
 * primero. Se pierde el matiz de que cada punto crezca de forma
 * independiente en el tiempo (eso SI necesitaria JS por-frame), pero se
 * conserva el aspecto de ola liquida con curvas suaves en vez de picos
 * angulares -- pedido explicitamente tras el fix: "quiero la otra
 * animacion pero con ese fix".
 */

const NUM_POINTS = 10;
const JITTER_MAX = 20; // % de variacion del borde superior ondulado (0 = recto)
const DURATION_MS = 900;
const LAYER_DELAY_MS = 250; // desfase de la 2a capa, efecto de profundidad

// p/cp de cada segmento solo dependen de NUM_POINTS (constante) -- igual
// que en la version animada anterior, precalculados una sola vez.
const SEGMENTS = Array.from({ length: NUM_POINTS - 1 }, (_, j) => {
  const p = ((j + 1) / (NUM_POINTS - 1)) * 100;
  const cp = p - (100 / (NUM_POINTS - 1)) / 2;
  return { p, cp };
});

// Misma interpolacion con curvas bezier cubicas que usaba renderPaths()
// en la version animada (tecnica "shape overlays" de Blake Bowen), pero
// llamada UNA sola vez con puntos de control aleatorios fijos, no en
// cada frame -- de ahi que ya no pueda depender del framerate real del
// dispositivo para verse bien.
//
// FIX "sale desde abajo del todo pero no sube correctamente": la
// version animada usaba 100-punto porque cada punto CRECIA de 0 a 100
// con el tiempo (0=nada cubierto, 100=todo cubierto). Esta forma es
// ESTATICA -- no crece, solo se desplaza entera con translateY -- asi
// que tiene que nacer ya "completa": el borde ondulado (punto, 0..
// JITTER_MAX) cerca del BORDE SUPERIOR, y la forma rellena hasta abajo
// del todo (V 100). Con el 100-punto de la version animada, la forma
// solo llegaba a cubrir el JITTER_MAX% inferior de la pantalla como
// mucho -- el resto (la mayoria de la pantalla) se quedaba transparente
// pasase lo que pasase con la posicion.
function randomWavePath(): string {
  const rawPoints = Array.from({ length: NUM_POINTS }, () => Math.random() * JITTER_MAX);

  // FIX "proporcion o forma rara": sin suavizar, dos puntos VECINOS
  // podian sacar un valor muy distinto entre si (ej. 0 y JITTER_MAX) y
  // la curva entre ambos se veia como un pico brusco y desproporcionado
  // en vez de una ola organica -- mismo problema y mismo arreglo que ya
  // se aplico a los retrasos de la version animada. Media movil de 3
  // (con los vecinos existentes en los extremos): la forma sigue siendo
  // irregular, pero correlada entre puntos contiguos.
  const points = rawPoints.map((point, j) => {
    const prev = rawPoints[j - 1] ?? point;
    const next = rawPoints[j + 1] ?? point;
    return (prev + point + next) / 3;
  });

  let d = `M 0 100 V ${points[0]} C`;
  for (let j = 0; j < NUM_POINTS - 1; j++) {
    const { p, cp } = SEGMENTS[j];
    d += ` ${cp} ${points[j]} ${cp} ${points[j + 1]} ${p} ${points[j + 1]}`;
  }
  d += ` V 100 H 0`;
  return d;
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
  const wavePaths = useRef<[string, string]>(["", ""]);
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
    wavePaths.current = [randomWavePath(), randomWavePath()];
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
              dos capas ligeramente desfasadas entre si. viewBox +
              preserveAspectRatio:none hace que el path (en coordenadas
              0-100) se estire para llenar el viewport real, sea cual
              sea su tamaño -- por eso el SVG en vez de clip-path con
              pixeles absolutos. */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              transform: isCovering ? "translateY(0%)" : "translateY(100%)",
              transition: `transform ${DURATION_MS}ms cubic-bezier(.65,0,.35,1)`,
            }}
          >
            <defs>
              <linearGradient id="tearGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8c8378" />
                <stop offset="100%" stopColor="#e8dfd0" />
              </linearGradient>
            </defs>
            <path d={wavePaths.current[0]} fill="url(#tearGradient2)" />
          </svg>
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            onTransitionEnd={(e) => {
              if (e.propertyName === "transform") navigate();
            }}
            style={{
              transform: isCovering ? "translateY(0%)" : "translateY(100%)",
              transition: `transform ${DURATION_MS}ms cubic-bezier(.65,0,.35,1) ${LAYER_DELAY_MS}ms`,
            }}
          >
            <defs>
              <linearGradient id="tearGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#171614" />
                <stop offset="100%" stopColor="#8c8378" />
              </linearGradient>
            </defs>
            <path d={wavePaths.current[1]} fill="url(#tearGradient1)" />
          </svg>
        </div>,
        document.body
      )}
    </>
  );
}
