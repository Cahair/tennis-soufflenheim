"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { BallMark } from "@/components/LogoMark";
import { gsap, useGSAP } from "./gsap";
import {
  getLenis,
  SPLASH_STORAGE_KEY,
  splashActive,
  startIntro,
} from "./intro";

const subscribe = () => () => {};
const getServerSnapshot = () => true;
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/* Le splash attend la photo du hero : il s'ouvre sur une image nette. */
function heroImageReady(): Promise<void> {
  const img = document.querySelector<HTMLImageElement>("[data-hero-media] img");
  if (!img || img.complete) return Promise.resolve();
  return new Promise((resolve) => {
    img.addEventListener("load", () => resolve(), { once: true });
    img.addEventListener("error", () => resolve(), { once: true });
  });
}

/* ------------------------------------------------------------------ */
/*  Écran d'ouverture — une fois par session, au premier chargement   */
/*  de l'accueil. La balle tombe et rebondit sur le filet, le         */
/*  compteur suit le chargement, puis la balle rejoint le logo de la  */
/*  navigation pendant que l'écran s'ouvre en deux sur le hero.       */
/*                                                                    */
/*  Rendu serveur : toujours présent dans le HTML, mais masqué en CSS */
/*  tant que le script du <head> n'a pas posé data-splash="on".       */
/* ------------------------------------------------------------------ */
export default function Splash({ baseline }: { baseline: string }) {
  const active = useSyncExternalStore(subscribe, splashActive, getServerSnapshot);
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      // Pendant l'hydratation, `active` vaut la valeur serveur : on se
      // fie à l'attribut réellement posé par le script inline.
      if (!splashActive() || !root.current || !contextSafe) return;
      const q = gsap.utils.selector(root);
      const [ball] = q(".splash-ball") as HTMLElement[];
      const [countEl] = q(".splash-count");
      const counter = { value: 0 };
      const render = () => {
        countEl.textContent = String(Math.round(counter.value)).padStart(3, "0");
      };

      const finish = () => {
        try {
          sessionStorage.setItem(SPLASH_STORAGE_KEY, "1");
        } catch {
          /* stockage indisponible : le splash rejouera, sans gravité */
        }
        const html = document.documentElement;
        html.dataset.splash = "done";
        html.style.overflow = "";
        getLenis()?.start();
        setDone(true);
      };

      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(q(".splash-line"), { scaleX: 0, duration: 1.2, ease: "expo.inOut" }, 0)
        .from(ball, { y: () => -window.innerHeight * 0.55, duration: 1.15, ease: "bounce.out" }, 0.05)
        .from(q(".splash-letter"), { yPercent: 110, duration: 1, stagger: 0.06 }, 0.35)
        .from(q(".splash-meta"), { autoAlpha: 0, y: 14, duration: 0.8, stagger: 0.1 }, 0.55)
        .to(counter, { value: 86, duration: 1.2, ease: "power2.out", onUpdate: render }, 0.15);
      // Les états de départ sont posés : on peut dévoiler le contenu.
      gsap.set(q("[data-splash-el]"), { visibility: "inherit" });

      const exit = contextSafe(() => {
        const tl = gsap.timeline({ onComplete: finish });
        tl.to(counter, { value: 100, duration: 0.35, ease: "power2.out", onUpdate: render })
          .to(q(".splash-letter"), { yPercent: -110, duration: 0.6, stagger: 0.04, ease: "expo.in" }, ">-0.05")
          .to(q(".splash-meta"), { autoAlpha: 0, y: -10, duration: 0.4 }, "<")
          .to(q(".splash-line"), { scaleX: 0, duration: 0.8, ease: "expo.inOut" }, "<0.1");

        // La balle rejoint celle du logo, dans la barre de navigation.
        const logo = document.querySelector<HTMLElement>("header [data-logo-ball]");
        const from = ball.getBoundingClientRect();
        const to = logo?.getBoundingClientRect();
        if (to && to.width > 0) {
          tl.to(
            ball,
            {
              x: to.left + to.width / 2 - (from.left + from.width / 2),
              y: to.top + to.height / 2 - (from.top + from.height / 2),
              scale: to.width / from.width,
              duration: 1,
              ease: "power3.inOut",
            },
            "<"
          );
        } else {
          tl.to(ball, { scale: 0, duration: 0.6, ease: "back.in(2)" }, "<");
        }

        tl.add(startIntro, "<0.3")
          .to(q(".splash-top"), { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "<")
          .to(q(".splash-bottom"), { yPercent: 100, duration: 1.1, ease: "expo.inOut" }, "<")
          .to(ball, { autoAlpha: 0, duration: 0.25 }, ">-0.25");
      });

      let cancelled = false;
      Promise.race([
        Promise.all([document.fonts.ready, heroImageReady(), wait(1300)]),
        wait(3000),
      ]).then(() => {
        if (!cancelled) exit();
      });
      return () => {
        cancelled = true;
      };
    },
    { scope: root, dependencies: [active] }
  );

  if (!active || done) return null;

  return (
    <div ref={root} className="splash fixed inset-0 z-[120]" aria-hidden="true">
      <div className="splash-top absolute inset-x-0 top-0 flex h-1/2 flex-col items-center justify-end bg-night-950 pb-[5.5rem] sm:pb-24">
        <p
          data-splash-el
          className="flex overflow-hidden font-display text-[clamp(4.5rem,17vw,11rem)] font-semibold uppercase leading-[0.88] tracking-tight text-white"
        >
          {"TPCS".split("").map((letter, i) => (
            <span key={i} className={`splash-letter inline-block ${i === 1 ? "text-rose-500" : ""}`}>
              {letter}
            </span>
          ))}
        </p>
      </div>

      <div className="splash-bottom absolute inset-x-0 bottom-0 h-1/2 bg-night-950">
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-5 pb-6 sm:px-10 sm:pb-9">
          <p
            data-splash-el
            className="splash-meta max-w-[15rem] text-[0.62rem] uppercase leading-relaxed tracking-[0.3em] text-white/50"
          >
            {baseline}
          </p>
          <p
            data-splash-el
            className="splash-meta splash-count font-display text-5xl font-light tabular-nums text-rose-500 sm:text-7xl"
          >
            000
          </p>
        </div>
      </div>

      {/* Le filet, puis la balle posée dessus */}
      <div data-splash-el className="splash-line absolute inset-x-0 top-1/2 h-px bg-rose-500/60" />
      <div
        data-splash-el
        className="splash-ball absolute left-[calc(50%-1.75rem)] top-[calc(50%-3.5rem)] h-14 w-14"
      >
        <BallMark className="h-full w-full" />
      </div>
    </div>
  );
}
