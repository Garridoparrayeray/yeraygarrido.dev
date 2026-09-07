import { useState, useEffect, type ReactNode, type MouseEvent, type CSSProperties } from "react";
import { createPortal } from "react-dom";

/**
 * TearLink — "rejilla de baldosas": al pulsar, la pantalla se cubre con
 * una rejilla de decenas de baldosas que vuelan en 3D (flip
 * rotateX/rotateY, como piezas de un mosaico cayendo en su sitio) en
 * una ola circular que EMANA del punto exacto donde se ha tocado -- y
 * SOLO ENTONCES navega de verdad al destino (portfolio de fotografia).
 * Cuando esa pagina de destino carga, hace la mitad inversa: aparece ya
 * cubierta y las baldosas vuelan hacia FUERA revelando la galeria (ver
 * entryTransition.js en la galeria), misma tecnica, ola desde el
 * centro.
 *
 * Tecnica adaptada de un recurso de rejilla de fragmentos con flip 3D
 * (grid de <div>, cada uno con su propio @keyframes con transform:
 * rotateX/rotateY + opacity, retrasado con animation-delay calculado
 * UNA vez por celda segun su distancia al origen) -- se sustituye el
 * "revelar una imagen a trozos" original por "cubrir/descubrir la
 * pantalla entera a trozos" con color solido, y se elige un unico
 * patron de ola (radial, distancia al punto de origen) en vez de los
 * ~14 patrones del recurso original.
 *
 * CADA BALDOSA ANIMA VIA SU PROPIO @keyframes CSS, CON animation-delay
 * FIJADO UNA VEZ (nunca por-frame) -- el navegador entero se encarga
 * del movimiento sin que ni un solo callback de JS corra durante la
 * animacion. Se sabe cuando ha terminado TODO por calculo (delay+
 * duracion maximos de la rejilla, deterministas), nunca escuchando
 * eventos de cada baldosa. Ver el porque de esta restriccion en el
 * historial mas abajo.
 *
 * Responsive gratis: la rejilla usa CSS Grid con columnas/filas 1fr
 * sobre un contenedor fixed inset-0 -- el tamaño de cada baldosa se
 * adapta solo al viewport real, sea cual sea.
 *
 * FIX "el out lo tiene que hacer nada mas cargar la pagina web, no
 * antes": el "descubrir" de llegada pasa en la pagina de DESTINO, nunca
 * aqui -- ver entryTransition.js en el repo de la galeria. Aqui SOLO se
 * cubre, nunca se descubre; el destino recibe ?enter=flash en la URL
 * para saber que tiene que arrancar ya cubierto y hacer su propio
 * descubrir.
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
 * bastante avanzado. Una animacion CSS (@keyframes, como esta) la
 * ejecuta el hilo de composicion (GPU) end-to-end, sin ni un callback
 * de JS durante el movimiento -- al margen de eso. Es la UNICA clase de
 * implementacion confirmada funcionando de verdad en dispositivo real.
 */

const COLS = 14;
const ROWS = 9;
const TILE_DURATION_MS = 550;
const DELAY_STEP_MS = 55;
const COLORS = ["#171614", "#8c8378"];

interface Tile {
  key: string;
  delay: number;
  color: string;
  keyframe: "tearTileInX" | "tearTileInY";
}

function buildTiles(originCol: number, originRow: number): Tile[] {
  const tiles: Tile[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const dist = Math.hypot(col - originCol, row - originRow);
      tiles.push({
        key: `${row}-${col}`,
        delay: dist * DELAY_STEP_MS,
        color: COLORS[(row + col) % 2],
        keyframe: (row + col) % 2 === 0 ? "tearTileInX" : "tearTileInY",
      });
    }
  }
  return tiles;
}

function maxDelay(tiles: Tile[]): number {
  return tiles.reduce((max, t) => Math.max(max, t.delay), 0);
}

interface TearLinkProps {
  href: string;
  className?: string;
  ariaLabel: string;
  children: ReactNode;
}

export default function TearLink({ href, className, ariaLabel, children }: TearLinkProps) {
  const [tiles, setTiles] = useState<Tile[] | null>(null);

  const handleClick = (e: MouseEvent) => {
    // Click con modificador (abrir en pestana nueva, etc.) o boton
    // distinto al principal: se deja el comportamiento nativo del
    // navegador tal cual, sin el efecto -- el usuario pidio explicitamente
    // otra cosa (nueva pestana/ventana), no tiene sentido interceptarlo.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (tiles) return;
    // Origen real del click/tap, convertido a coordenadas de rejilla --
    // la ola de baldosas emana de ahi, no del centro de la pantalla.
    const originCol = (e.clientX / window.innerWidth) * (COLS - 1);
    const originRow = (e.clientY / window.innerHeight) * (ROWS - 1);
    setTiles(buildTiles(originCol, originRow));
  };

  useEffect(() => {
    if (!tiles) return;

    const url = new URL(href);
    url.searchParams.set("enter", "flash");

    let navigated = false;
    const navigate = () => {
      if (navigated) return;
      navigated = true;
      window.location.href = url.toString();
    };

    // Deterministico: se sabe de antemano cuanto va a tardar la ultima
    // baldosa en terminar (delay maximo + duracion de cada una), asi
    // que un unico setTimeout basta -- no hace falta escuchar el evento
    // 'animationend' de 126 elementos.
    const timer = window.setTimeout(navigate, maxDelay(tiles) + TILE_DURATION_MS + 150);
    return () => window.clearTimeout(timer);
  }, [tiles, href]);

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setTiles(null);
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  return (
    <>
      <a href={href} onClick={handleClick} className={className} aria-label={ariaLabel}>
        {children}
      </a>

      {tiles && createPortal(
        <>
          <style>{`
            @keyframes tearTileInX {
              from { transform: perspective(900px) rotateX(90deg); opacity: 0; }
              to   { transform: perspective(900px) rotateX(0deg); opacity: 1; }
            }
            @keyframes tearTileInY {
              from { transform: perspective(900px) rotateY(90deg); opacity: 0; }
              to   { transform: perspective(900px) rotateY(0deg); opacity: 1; }
            }
          `}</style>
          <div
            className="fixed inset-0 z-[999] pointer-events-none grid"
            style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
            aria-hidden="true"
          >
            {tiles.map((tile) => (
              <div
                key={tile.key}
                style={{
                  backgroundColor: tile.color,
                  backfaceVisibility: "hidden",
                  animationName: tile.keyframe,
                  animationDuration: `${TILE_DURATION_MS}ms`,
                  animationDelay: `${tile.delay}ms`,
                  animationTimingFunction: "ease-out",
                  animationFillMode: "both",
                } as CSSProperties}
              />
            ))}
          </div>
        </>,
        document.body
      )}
    </>
  );
}
