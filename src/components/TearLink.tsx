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

    // Bisagra en el borde DERECHO (no izquierdo) -- "estas leyendo un
    // libro, no un manga": la pagina se cierra hacia la derecha, no
    // hacia la izquierda.
    gsap.set(pageRef.current, { transformOrigin: "100% 50%", scaleX: 1, scaleY: 1, skewY: 0, y: "0%" });
    gsap.set(creaseRef.current, { opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => { window.location.href = href; },
    });

    // "Mas alma" -- una mano de verdad no cierra un libro con un solo
    // movimiento mecanico uniforme. Cuatro capas independientes,
    // solapadas en el tiempo, cada una con su propio ritmo:

    // 1) Anticipacion: la pagina se "tensa" un instante antes de
    //    soltarse -- como coger la esquina y tirar un poco antes del
    //    golpe, principio clasico de animacion.
    tl.to(pageRef.current, { scaleX: 1.035, skewY: -3, duration: 0.16, ease: "power1.out" }, 0);

    // 2) Cierre principal: acelera hacia el cierre total (power2.in,
    //    como si la gravedad/el impulso tirase de ella hacia el final).
    tl.to(pageRef.current, { scaleX: 0, duration: 0.85, ease: "power2.in" }, 0.16);

    // 3) El giro en si describe un ARCO, no un angulo fijo: sube mas
    //    de lo necesario y se asienta un poco antes de que la pagina
    //    termine de desaparecer -- el papel "se comba" al girar en vez
    //    de inclinarse en linea recta.
    tl.to(pageRef.current, { skewY: 8, duration: 0.42, ease: "sine.inOut" }, 0.16);
    tl.to(pageRef.current, { skewY: 3, duration: 0.35, ease: "sine.inOut" }, 0.58);

    // 4) Ligero vuelo/flexion del papel: se eleva y se comprime un
    //    poco mientras gira, vuelve a su sitio al asentarse -- sin
    //    esto, escalar solo en X se ve demasiado plano/mecanico.
    tl.to(pageRef.current, { y: "-1.2%", scaleY: 0.985, duration: 0.5, ease: "sine.inOut" }, 0.16);
    tl.to(pageRef.current, { y: "0%", scaleY: 1, duration: 0.35, ease: "sine.inOut" }, 0.66);

    // Sombra de pliegue: se intensifica mientras la "hoja" esta a medio
    // cerrar (sincronizada con el pico del arco de FASE 3) y se
    // desvanece al llegar al final, como el pliegue real de una pagina
    // al doblarse.
    tl.to(creaseRef.current, { opacity: 0.6, duration: 0.38, ease: "power1.in" }, 0.16);
    tl.to(creaseRef.current, { opacity: 0, duration: 0.5, ease: "power1.out" }, 0.56);

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
              // (derecha) y mas oscuro hacia el borde libre (izquierda)
              // -- insinua el volumen de una pagina real incluso antes
              // de que arranque el cierre.
              backgroundImage:
                "linear-gradient(90deg, rgba(0,0,0,0.45) 0%, transparent 25%, transparent 80%, rgba(255,255,255,0.06) 100%)",
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
