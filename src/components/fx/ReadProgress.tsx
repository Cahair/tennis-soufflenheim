"use client";

import { useRef } from "react";
import { PadelBall } from "@/components/landing/NightFx";
import { gsap, MQ, useGSAP } from "./gsap";

/* Barre de lecture néon sous la navigation : une balle roule au bout
   du trait à mesure qu'on avance dans la page (articles, règlement). */
export default function ReadProgress() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(root);
        const st = { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.4 };
        gsap.fromTo(q(".rp-bar"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: st });
        gsap.fromTo(q(".rp-ball"), { left: "0%", rotate: 0 }, { left: "100%", rotate: 1440, ease: "none", scrollTrigger: { ...st } });
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-20 z-40 hidden h-[3px] motion-safe:block">
      <div className="rp-bar h-full origin-left bg-gradient-to-r from-rose-400 via-rose-500 to-ultra-500 shadow-[0_0_14px_rgba(234,51,111,0.9)]" />
      <div className="rp-ball absolute top-1/2 -ml-2.5 -mt-2.5 h-5 w-5">
        <PadelBall className="h-full w-full drop-shadow-[0_0_10px_rgba(234,51,111,0.9)]" />
      </div>
    </div>
  );
}
