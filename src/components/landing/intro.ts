import type Lenis from "lenis";

/* ------------------------------------------------------------------ */
/*  État partagé de la page d'accueil.                                */
/*                                                                    */
/*  Le script inline du <head> (app/layout.tsx) pose, avant le        */
/*  premier rendu, sur <html> :                                       */
/*   - data-splash="on"   → l'écran d'ouverture doit être joué ;      */
/*   - data-intro="pending" → le hero reste masqué jusqu'à son entrée.*/
/* ------------------------------------------------------------------ */

export const SPLASH_STORAGE_KEY = "tpcs-splash";
const INTRO_EVENT = "tpcs:intro";

let lenis: Lenis | null = null;
let introStarted = false;

export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};
export const getLenis = () => lenis;

/** Le splash est-il en cours sur ce chargement de page ? */
export function splashActive(): boolean {
  return (
    typeof document !== "undefined" &&
    document.documentElement.dataset.splash === "on"
  );
}

/** Appelé par le splash à l'instant où il s'ouvre sur le hero. */
export function startIntro() {
  introStarted = true;
  window.dispatchEvent(new Event(INTRO_EVENT));
}

/** Exécute `cb` dès que le hero peut jouer son entrée. */
export function onIntro(cb: () => void): () => void {
  if (introStarted || !splashActive()) {
    cb();
    return () => {};
  }
  window.addEventListener(INTRO_EVENT, cb, { once: true });
  return () => window.removeEventListener(INTRO_EVENT, cb);
}

/** Lève le masquage CSS du hero (data-intro="pending"). */
export function markIntroReady() {
  document.documentElement.dataset.intro = "ready";
}
