"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "./gsap";
import { getLenis, setLenis, splashActive } from "./intro";

const stripLenisClasses = () => {
  const root = document.documentElement;
  for (const name of Array.from(root.classList)) {
    if (name === "lenis" || name.startsWith("lenis-")) root.classList.remove(name);
  }
};

/* Élément visé par un fragment d'URL (null si absent ou mal encodé). */
const hashTarget = (hash: string) => {
  if (!hash) return null;
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
};

/* Position d'arrivée sur une ancre : le haut de la cible, moins sa
   scroll-margin. Si la cible contient un [data-anchor-focus] (le bouton
   de réservation) qui tomberait sous le pli, on descend juste assez pour
   le montrer en entier, avec un peu d'air dessous. */
const anchorTop = (target: HTMLElement) => {
  const y = window.scrollY;
  const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  const top = target.getBoundingClientRect().top + y - margin;
  const focus = target.querySelector("[data-anchor-focus]");
  if (!focus) return top;
  const vh = window.innerHeight;
  const bottom = focus.getBoundingClientRect().bottom + y + Math.max(32, vh * 0.08);
  return Math.max(top, bottom - vh);
};

/* Défilement lissé (Lenis) synchronisé avec ScrollTrigger, limité à la
   page d'accueil : il est détruit dès qu'on la quitte. */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | null = null;
    const tick = (time: number) => lenis?.raf(time * 1000);

    if (!reduce) {
      lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      // Le splash rouvrira le défilement à la fin de sa séquence.
      if (splashActive()) lenis.stop();
      setLenis(lenis);
    }

    const scrollToAnchor = (target: HTMLElement, duration: number) => {
      const top = anchorTop(target);
      if (lenis) lenis.scrollTo(top, { duration });
      else window.scrollTo({ top });
    };

    /* Ancres internes (#reservation, /#galerie…) : défilement doux,
       compensé par scroll-margin. Écoute en capture + preventDefault :
       le <Link> de Next renonce alors à sa navigation (il teste
       e.defaultPrevented) mais son onClick — fermeture du menu mobile —
       s'exécute toujours. */
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.target && link.target !== "_self") return;
      const url = new URL(link.href);
      if (
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        !url.hash
      ) {
        return;
      }
      const target = hashTarget(url.hash);
      if (!target) return;
      e.preventDefault();
      scrollToAnchor(target, 1.6);
    };
    document.addEventListener("click", onClick, true);

    /* Arrivée depuis une autre page sur /#reservation : Next a déjà placé
       la section en haut de l'écran (layout effect, joué avant celui-ci) ;
       on glisse ensuite jusqu'au bouton, mise en page stabilisée. */
    const arrival = hashTarget(window.location.hash);

    // Polices chargées en « swap » : le reflow décale les déclencheurs.
    let alive = true;
    document.fonts?.ready.then(() => {
      if (!alive) return;
      ScrollTrigger.refresh();
      if (arrival?.querySelector("[data-anchor-focus]")) scrollToAnchor(arrival, 1.2);
    });

    return () => {
      alive = false;
      document.removeEventListener("click", onClick, true);
      gsap.ticker.remove(tick);
      if (lenis) {
        /* Lenis 1.3 laisse en attente, après destroy(), son minuteur de
           fin de défilement natif (armé par le retour en haut de page de
           la navigation), qui réécrit sa classe sur <html>. On l'annule,
           avec un filet si ce champ interne venait à changer de nom. */
        clearTimeout(
          (lenis as unknown as { _resetVelocityTimeout?: ReturnType<typeof setTimeout> })
            ._resetVelocityTimeout
        );
        lenis.destroy();
        window.setTimeout(() => {
          if (!getLenis()) stripLenisClasses();
        }, 800);
      }
      setLenis(null);
    };
  }, []);

  return null;
}
