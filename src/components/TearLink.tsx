import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { createPortal } from "react-dom";

/**
 * TearLink — "diafragma de camara": al pulsar, un octogono (aspas de
 * diafragma, como el bokeh de un objetivo) gira y crece a toda
 * velocidad desde el punto exacto donde se ha tocado, CERRANDO el
 * obturador sobre la pantalla, con un flash blanco justo al terminar de
 * cubrir -- y SOLO ENTONCES navega de verdad al destino (portfolio de
 * fotografia). Cuando esa pagina de destino carga, hace la mitad
 * inversa: aparece ya cerrada y el obturador SE ABRE (ver
 * entryTransition.js en la galeria), continuando el mismo giro.
 *
 * clip-path fijo (octogono, nunca recalculado) + transform:
 * translate+rotate+scale por CSS transition -- el punto de origen (el
 * click/tap real) se calcula UNA vez y se usa para posicionar el centro
 * del octogono ahi, nunca recalculado cuadro a cuadro.
 *
 * Responsive gratis: el octogono mide 250vmax de lado (vmax = el mayor
 * de vw/vh), muy por encima de cualquier diagonal real de pantalla
 * posible, asi que cubre de sobra la esquina mas lejana desde cualquier
 * punto de origen, sea cual sea el tamaño/proporcion.
 *
 * FIX "el out lo tiene que hacer nada mas cargar la pagina web, no
 * antes": el retroceso (la apertura de llegada) pasa en la pagina de
 * DESTINO, nunca aqui -- ver entryTransition.js en el repo de la
 * galeria. Aqui SOLO se cierra, nunca se abre; el destino recibe
 * ?enter=flash en la URL para saber que tiene que arrancar ya cerrado y
 * hacer su propia apertura.
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
 * NO CONVERTIR ESTO EN UNA ANIMACION JS-POR-FRAME (requestAnimationFrame
 * o similar), aunque parezca mas suave o "de mas nivel" -- historial
 * largo y doloroso en este mismo componente: 3 intentos distintos
 * (gsap.timeline(), rAF con anclaje al primer tick, de nuevo tras
 * pedirlo explicitamente) fallaron en dispositivos reales, incluido un
 * iPhone 15 Pro Max (gama alta, NO es problema de potencia), sin que
 * ninguna prueba automatizada lo reprodujera nunca. Causa real: Safari
 * en iOS retrasa/agrupa el trabajo de JS (incluido rAF) alrededor de un
 * gesto tactil para no interferir con el scroll -- aunque el CALCULO
 * este bien anclado, lo que el usuario ve PINTADO puede ser un frame ya
 * bastante avanzado. Una transicion CSS de transform (como esta) la
 * ejecuta el hilo de composicion (GPU), al margen de eso. Es la UNICA
 * clase de implementacion confirmada funcionando de verdad en
 * dispositivo real.
 */

const EXPAND_MS = 1100; // duracion del cierre del diafragma
const FLASH_PEAK_MS = 120; // subida del flash (rapida, "disparo")
const FLASH_HOLD_MS = 120; // se mantiene un instante en el pico
const FLASH_FADE_MS = 350; // bajada del flash
const CLOSE_ROTATE_DEG = 40; // giro acumulado durante el cierre

// Octogono regular -- mismo "aspecto de diafragma/bokeh" reconocible en
// fotografia. Forma FIJA, nunca recalculada: todo el movimiento lo hace
// el transform (translate/rotate/scale) via transicion CSS.
const BLADE_CLIP_PATH =
  "polygon(35% 0%, 65% 0%, 100% 35%, 100% 65%, 65% 100%, 35% 100%, 0% 65%, 0% 35%)";

interface TearLinkProps {
  href: string;
  className?: string;
  ariaLabel: string;
  children: ReactNode;
}

export default function TearLink({ href, className, ariaLabel, children }: TearLinkProps) {
  const [isTearing, setIsTearing] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [flashPeak, setFlashPeak] = useState(false);
  const originRef = useRef({ x: "50%", y: "50%" });
  const navigatedRef = useRef(false);

  const navigate = () => {
    if (navigatedRef.current) return;
    navigatedRef.current = true;
    const url = new URL(href);
    url.searchParams.set("enter", "flash");
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
    // Origen real del click/tap -- el diafragma nace exactamente ahi,
    // no en el centro de la pantalla. clientX/Y ya son relativas al
    // viewport, igual que la referencia de position:fixed.
    originRef.current = { x: `${e.clientX}px`, y: `${e.clientY}px` };
    setIsTearing(true);
  };

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        navigatedRef.current = false;
        setIsClosed(false);
        setFlashPeak(false);
        setIsTearing(false);
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // El overlay se monta condicionalmente en el JSX de abajo, arrancando
  // en scale(0) (invisible). Necesita pintarse asi en un frame real
  // ANTES de pasar a scale(1) -- si no, el navegador puede fusionar
  // ambos estados en un solo frame y saltarse la transicion entera.
  // Doble rAF: el primero espera al frame donde ya se pinto el estado
  // inicial, el segundo dispara el cambio.
  useEffect(() => {
    if (!isTearing) return;

    let rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(() => setIsClosed(true));
    });

    // Red de seguridad: fuerza la navegacion pasado el tiempo maximo que
    // puede durar toda la secuencia (cierre + flash), por si algun
    // 'transitionend' no llegara a dispararse.
    const safetyTimer = window.setTimeout(navigate, EXPAND_MS + FLASH_PEAK_MS + FLASH_HOLD_MS + FLASH_FADE_MS + 700);

    return () => { cancelAnimationFrame(rafId); window.clearTimeout(safetyTimer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTearing, href]);

  const { x: ox, y: oy } = originRef.current;

  return (
    <>
      <a href={href} onClick={handleClick} className={className} aria-label={ariaLabel}>
        {children}
      </a>

      {isTearing && createPortal(
        <div className="fixed inset-0 z-[999] pointer-events-none" aria-hidden="true">
          {/* El diafragma -- degradado radial centrado en el mismo
              punto de origen, para que tambien parezca que el "brillo"
              emana de donde se ha tocado. */}
          <div
            onTransitionEnd={(e) => {
              if (e.propertyName !== "transform") return;
              // Diafragma cerrado del todo -- dispara el flash: sube
              // rapido (90ms), se mantiene un instante, baja (220ms), y
              // SOLO ENTONCES navega -- mismo patron de siempre (estado
              // + setTimeout, nada de rAF).
              setFlashPeak(true);
              window.setTimeout(() => setFlashPeak(false), FLASH_PEAK_MS + FLASH_HOLD_MS);
              window.setTimeout(navigate, FLASH_PEAK_MS + FLASH_HOLD_MS + FLASH_FADE_MS);
            }}
            style={{
              position: "fixed",
              left: ox,
              top: oy,
              width: "250vmax",
              height: "250vmax",
              background: `radial-gradient(circle at center, #8c8378 0%, #171614 75%)`,
              clipPath: BLADE_CLIP_PATH,
              transform: isClosed
                ? `translate(-50%, -50%) rotate(${CLOSE_ROTATE_DEG}deg) scale(1)`
                : `translate(-50%, -50%) rotate(0deg) scale(0)`,
              transition: `transform ${EXPAND_MS}ms cubic-bezier(.7,0,.3,1)`,
            }}
          />
          {/* Flash -- blanco, sube rapido tipo disparo de camara, baja
              mas suave. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#fff",
              opacity: flashPeak ? 1 : 0,
              transition: `opacity ${flashPeak ? FLASH_PEAK_MS : FLASH_FADE_MS}ms ease-out`,
            }}
          />
        </div>,
        document.body
      )}
    </>
  );
}
