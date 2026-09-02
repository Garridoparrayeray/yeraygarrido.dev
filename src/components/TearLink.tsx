import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

/**
 * TearLink — enlace que, al pulsarlo, "pasa la pagina" como un libro:
 * la pantalla negra se cierra desde su borde izquierdo (scaleX 1 -> 0,
 * transform-origin en el borde izquierdo, con un ligero skew para que
 * no se vea un simple achicamiento mecanico), con una sombra de pliegue
 * que se intensifica a mitad de camino, revelando el beige del
 * portfolio de fotografia por debajo -- y solo entonces navega de
 * verdad al destino.
 *
 * FIX real 1 (bug reportado: "desde el icono del Header, la animacion
 * solo se ve dentro del Header, no en toda la pantalla"): el overlay es
 * position:fixed, pero CUALQUIER ANCESTRO con transform/filter/
 * backdrop-filter/will-change:transform crea su PROPIO containing block
 * para descendientes fixed -- el Header lo tiene (backdrop-blur-md
 * cuando esta scrolled), asi que el overlay quedaba encajonado dentro
 * del propio Header en vez de cubrir el viewport. Portal a
 * document.body: el overlay escapa de la jerarquia normal del DOM (y de
 * cualquier containing block de un ancestro), sea cual sea el
 * componente donde se use TearLink.
 *
 * FIX real 2 (bug reportado: "hace un frame estatico y sigue para
 * adelante", ningun giro visible): un primer intento uso rotateY +
 * perspective (giro 3D real) -- tras corregir el nombre de propiedad de
 * GSAP (es rotationY, no rotateY) el problema seguia igual, asi que la
 * causa real no era solo el nombre. En vez de seguir depurando
 * transformaciones 3D (perspective/backface-visibility/rotationY son
 * bastante mas sensibles a como el motor de render/GPU del navegador
 * las compone, dificil de diagnosticar a ciegas sin ver el navegador en
 * vivo), se sustituyen por un efecto SOLO 2D con scaleX -- propiedad
 * basica de GSAP sin ninguna ambiguedad de nombre ni dependencia de
 * perspective/3D, mucho mas fiable.
 *
 * TODO en porcentajes/grados (nunca px fijos) -- responsive por
 * construccion, sin media queries.
 */

const DEST_BG = "#e8dfd0";

interface TearLinkProps {
  href: string;
  className?: string;
  ariaLabel: string;
  children: ReactNode;
}

export default function TearLink({ href, className, ariaLabel, children }: TearLinkProps) {
  const [isTearing, setIsTearing] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const creaseRef = useRef<HTMLDivElement>(null);

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
  // de mas abajo, si el visitante vuelve con el boton Atras del
  // navegador, la pagina puede restaurarse desde la bfcache congelada
  // en el ultimo frame antes de navegar. 'pageshow' con persisted:true
  // es el evento que distingue esa restauracion de una carga nueva.
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setIsTearing(false);
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // El overlay se monta condicionalmente en el JSX de abajo -- justo
  // tras setIsTearing(true), React todavia NO ha actualizado el DOM
  // (los cambios de estado no se aplican de forma sincrona dentro del
  // mismo handler), asi que las refs seguirian siendo null si la
  // animacion se lanzara ahi mismo. Dispararla aqui, en un effect que
  // depende de isTearing, garantiza que los elementos reales ya existen.
  useEffect(() => {
    if (!isTearing) return;

    gsap.set(pageRef.current, { transformOrigin: "0% 50%", scaleX: 1, skewY: 0 });
    gsap.set(creaseRef.current, { opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => { window.location.href = href; },
    });

    // La pagina se encoge horizontalmente desde su borde izquierdo
    // (scaleX 1 -> 0, transform-origin fijado ahi mismo) hasta
    // desaparecer del todo, revelando el beige de detras -- el skewY
    // acompañando rompe la sensacion de "achicamiento" puro y la
    // acerca mas a un cierre/pliegue real.
    tl.to(pageRef.current, { scaleX: 0, skewY: -4, duration: 1.1, ease: "power2.inOut" }, 0);

    // Sombra de pliegue: se intensifica mientras la "hoja" esta a medio
    // cerrar y se desvanece al llegar al final, como el pliegue real de
    // una pagina al doblarse.
    tl.to(creaseRef.current, { opacity: 0.55, duration: 0.5, ease: "power1.in" }, 0.15);
    tl.to(creaseRef.current, { opacity: 0, duration: 0.45, ease: "power1.out" }, 0.65);

    return () => { tl.kill(); };
  }, [isTearing, href]);

  return (
    <>
      <a href={href} onClick={handleClick} className={className} aria-label={ariaLabel}>
        {children}
      </a>

      {isTearing && createPortal(
        <div className="fixed inset-0 z-[999] pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0" style={{ backgroundColor: DEST_BG }} />

          <div
            ref={pageRef}
            className="absolute inset-0 bg-black"
            style={{
              // Ligero degradado de base: mas claro cerca de la bisagra
              // (izquierda) y mas oscuro hacia el borde libre (derecha)
              // -- insinua el volumen de una pagina real incluso antes
              // de que arranque el cierre.
              backgroundImage:
                "linear-gradient(90deg, rgba(255,255,255,0.06) 0%, transparent 20%, transparent 75%, rgba(0,0,0,0.45) 100%)",
            }}
          >
            <div
              ref={creaseRef}
              className="absolute inset-0"
              style={{ background: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.7) 55%, transparent 100%)" }}
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
