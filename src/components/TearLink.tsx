import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

/**
 * TearLink — enlace que, al pulsarlo, "pasa la pagina" como un libro:
 * la pantalla negra gira en 3D sobre una bisagra en el borde izquierdo
 * (perspective + rotateY), con una sombra de pliegue que se intensifica
 * a mitad de giro, revelando el beige del portfolio de fotografia por
 * debajo -- y solo entonces navega de verdad al destino.
 *
 * FIX real (bug reportado: "desde el icono del Header, la animacion
 * solo se ve dentro del Header, no en toda la pantalla"): el overlay es
 * position:fixed, pero CUALQUIER ANCESTRO con transform/filter/
 * backdrop-filter/will-change:transform crea su PROPIO containing block
 * para descendientes fixed -- el Header lo tiene (backdrop-blur-md
 * cuando esta scrolled), asi que el overlay quedaba encajonado dentro
 * del propio Header en vez de cubrir el viewport. El Hero tenia el
 * mismo problema de fondo (containerRef recibe will-change:transform
 * para el parallax de scroll) pero no se notaba porque esa seccion ya
 * ocupa el viewport entero. Portal a document.body: el overlay escapa
 * de la jerarquia normal del DOM (y de cualquier containing block de un
 * ancestro), sea cual sea el componente donde se use TearLink.
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

    // FIX "hace un frame estatico y sigue para adelante" (no se veia
    // NINGUN giro): 'rotateY' no es el nombre real de la propiedad
    // especial de GSAP para rotacion 3D -- es 'rotationY'. Con
    // 'rotateY', GSAP no la reconoce como transformacion y no aplica
    // nada (el navegador tampoco entiende 'rotateY' como propiedad CSS
    // suelta), asi que el elemento se quedaba tal cual, quieto, hasta
    // que el timeline terminaba igualmente y navegaba. transformOrigin
    // tambien se fija AQUI via GSAP (no solo en el style inline del
    // JSX) -- GSAP gestiona transform-origin internamente junto al
    // transform, fijarlo solo por CSS corre el riesgo de que lo
    // sobreescriba a su valor por defecto (centro) en el primer set().
    gsap.set(pageRef.current, { transformOrigin: "0% 50%", rotationY: 0, force3D: true });
    gsap.set(creaseRef.current, { opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => { window.location.href = href; },
    });

    // La pagina gira sobre su borde izquierdo hasta quedar de canto
    // (justo pasado 90deg, backface-visibility:hidden la hace
    // desaparecer ahi, revelando el beige de detras) -- un unico
    // movimiento continuo, mas pausado que un corte, como una mano
    // pasando una hoja de verdad.
    tl.to(pageRef.current, { rotationY: -100, duration: 1.1, ease: "power2.inOut" }, 0);

    // Sombra de pliegue: se intensifica mientras la "hoja" esta a medio
    // girar (maximo relieve/sombra cuando esta mas de canto) y se
    // desvanece al acercarse al final, como el pliegue real de una
    // pagina al doblarse.
    tl.to(creaseRef.current, { opacity: 0.6, duration: 0.5, ease: "power1.in" }, 0.15);
    tl.to(creaseRef.current, { opacity: 0, duration: 0.45, ease: "power1.out" }, 0.65);

    return () => { tl.kill(); };
  }, [isTearing, href]);

  return (
    <>
      <a href={href} onClick={handleClick} className={className} aria-label={ariaLabel}>
        {children}
      </a>

      {isTearing && createPortal(
        <div
          className="fixed inset-0 z-[999] pointer-events-none"
          style={{ perspective: "1800px" }}
          aria-hidden="true"
        >
          <div className="absolute inset-0" style={{ backgroundColor: DEST_BG }} />

          <div
            ref={pageRef}
            className="absolute inset-0 bg-black"
            style={{
              // transformOrigin se fija por GSAP (ver el useEffect), no
              // aqui -- evita que GSAP lo sobreescriba al primer set().
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              // Ligero degradado de base: mas claro cerca de la bisagra
              // (izquierda) y mas oscuro hacia el borde libre (derecha)
              // -- insinua el volumen de una pagina real incluso antes
              // de que arranque el giro.
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
