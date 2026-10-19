import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { gsap } from "@/components/landing/gsap";

/* Pages intérieures : mêmes plugins que l'accueil, plus le brouillage
   de texte (titres « scramble », tableaux à palettes). */
gsap.registerPlugin(ScrambleTextPlugin);

export { gsap, MQ, ScrollTrigger, SplitText, useGSAP, frenchSpacing } from "@/components/landing/gsap";

/* Caractères tirés au sort pendant les brouillages. */
export const SCRAMBLE_CHARS = "PADEL0123456789✦#%&SMASH";
