import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

/* Point d'entrée unique de GSAP pour la page d'accueil : les plugins
   sont enregistrés une fois, toutes les sections importent d'ici. */
gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };

/* Requêtes partagées par gsap.matchMedia() : avec la préférence de
   mouvement réduit, rien n'est animé (le rendu serveur reste tel quel). */
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  desktop: "(min-width: 64rem) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 63.99rem) and (prefers-reduced-motion: no-preference)",
  pointer: "(pointer: fine) and (prefers-reduced-motion: no-preference)",
};

const NBSP = "\u00a0";

/* Espace insécable avant « ? », « ! », « : », « ; », « » » et après
   « « » — évite qu'une ponctuation parte seule à la ligne dans les très
   grands titres alimentés par l'admin. */
export function frenchSpacing(text: string): string {
  return text
    .replace(/ ([?!:;»])/g, `${NBSP}$1`)
    .replace(/« /g, `«${NBSP}`);
}
