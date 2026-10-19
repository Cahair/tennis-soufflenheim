"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "./gsap";

const FLAP_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789€✦";
const pick = () => FLAP_CHARS[Math.floor(Math.random() * FLAP_CHARS.length)];

/* ------------------------------------------------------------------ */
/*  Afficheur à palettes, façon tableau des départs d'une gare :      */
/*  chaque caractère tourne sur lui-même en faisant défiler des       */
/*  lettres au hasard avant de se fixer. Se joue à l'arrivée à        */
/*  l'écran, et rejoue au survol. Lecteurs d'écran : le texte entier  */
/*  (aria-label), sans les palettes.                                  */
/* ------------------------------------------------------------------ */
export default function SplitFlap({
  text,
  className = "",
  cell = "",
  delay = 0,
  tight = false,
}: {
  text: string;
  /** Lettres serrées, sans largeur fixe (titres longs). */
  tight?: boolean;
  className?: string;
  /** Classes de chaque palette (taille, couleurs). */
  cell?: string;
  delay?: number;
}) {
  const root = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const el = root.current!;
        const cells = Array.from(el.querySelectorAll<HTMLElement>("[data-char]"));
        const play = () => {
          const master = gsap.timeline({ delay });
          cells.forEach((c, i) => {
            const final = c.dataset.char!;
            if (final === " ") return;
            const tl = gsap.timeline();
            const n = 4 + Math.floor(Math.random() * 7);
            for (let k = 0; k < n; k++) {
              tl.call(() => {
                c.textContent = pick();
              }).fromTo(c, { rotationX: -88 }, { rotationX: 0, duration: 0.06, ease: "none" });
            }
            tl.call(() => {
              c.textContent = final;
            }).fromTo(c, { rotationX: -88 }, { rotationX: 0, duration: 0.25, ease: "back.out(3)" });
            master.add(tl, i * 0.045);
          });
          return master;
        };
        let running: gsap.core.Timeline | null = null;
        /* Déclenchement à l'arrivée à l'écran par IntersectionObserver et
           non par un ScrollTrigger `once` : un ScrollTrigger qui se
           supprime pendant le rafraîchissement des autres (nombreux
           afficheurs sur une page) faisait planter ScrollTrigger. */
        const io = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            io.disconnect();
            running = play();
          },
          { rootMargin: "0px 0px -8% 0px" }
        );
        io.observe(el);
        const onEnter = () => {
          if (running?.isActive()) return;
          running = play();
        };
        el.addEventListener("pointerenter", onEnter);
        return () => {
          io.disconnect();
          running?.kill();
          el.removeEventListener("pointerenter", onEnter);
          cells.forEach((c) => (c.textContent = c.dataset.char!));
        };
      });
    },
    { scope: root }
  );

  return (
    <span ref={root} className={`inline-flex flex-wrap gap-x-[0.35em] gap-y-[0.12em] [perspective:400px] ${className}`}>
      <span className="sr-only">{text}</span>
      {/* Un groupe insécable par mot : le retour à la ligne se fait
          entre les mots, jamais au milieu. */}
      {text.split(" ").map((word, w) => (
        <span key={w} aria-hidden="true" className={`inline-flex whitespace-nowrap ${tight ? "gap-0" : "gap-[0.08em]"}`}>
          {Array.from(word).map((ch, i) => (
            <span
              key={i}
              data-char={ch}
              className={`ix-flap relative inline-flex items-center justify-center rounded-[0.12em] ${
                tight ? "px-[0.02em]" : "min-w-[0.72em] px-[0.06em]"
              } ${cell}`}
            >
              {ch}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
