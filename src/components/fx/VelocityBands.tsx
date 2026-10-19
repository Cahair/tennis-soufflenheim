"use client";

import { Fragment, useRef } from "react";
import { PadelBall } from "@/components/landing/NightFx";
import { gsap, MQ, ScrollTrigger, useGSAP } from "./gsap";

/* ------------------------------------------------------------------ */
/*  Deux rubans croisés en X qui défilent en sens inverse : plus on   */
/*  fait défiler vite, plus ils s'emballent et se penchent, puis ils  */
/*  retombent à leur allure de croisière. Immobiles en mouvement      */
/*  réduit.                                                           */
/* ------------------------------------------------------------------ */
export default function VelocityBands({ top, bottom }: { top: string[]; bottom: string[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(root);
        const a = gsap.fromTo(q(".vb-track-a"), { xPercent: 0 }, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
        const b = gsap.fromTo(q(".vb-track-b"), { xPercent: -50 }, { xPercent: 0, duration: 24, ease: "none", repeat: -1 });
        const skews = q(".vb-skew");

        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate(self) {
            const v = self.getVelocity();
            const boost = gsap.utils.clamp(1, 10, 1 + Math.abs(v) / 250);
            [a, b].forEach((t) => gsap.fromTo(t, { timeScale: boost }, { timeScale: 1, duration: 1.4, ease: "power2.out", overwrite: true }));
            gsap.to(skews, { skewX: gsap.utils.clamp(-18, 18, v / -120), duration: 0.25, overwrite: true });
            gsap.to(skews, { skewX: 0, duration: 0.9, delay: 0.25, ease: "elastic.out(1, 0.4)" });
          },
        });
      });
    },
    { scope: root }
  );

  const row = (words: string[], outline: boolean) =>
    [0, 1].map((copy) => (
      <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1 || undefined}>
        {words.map((w) => (
          <Fragment key={w}>
            <span className={`display px-6 text-[clamp(2.4rem,6vw,5.5rem)] leading-none ${outline ? "hero-outline" : ""}`}>{w}</span>
            <PadelBall className="h-[clamp(1.6rem,3vw,2.6rem)] w-[clamp(1.6rem,3vw,2.6rem)] shrink-0" />
          </Fragment>
        ))}
      </div>
    ));

  return (
    <div ref={root} className="relative overflow-clip bg-night-950 py-24 lg:py-32">
      <div className="relative -mx-[5%] -rotate-[4deg]">
        <div className="vb-skew bg-rose-500 py-4 text-night-950 shadow-[0_0_80px_-10px_rgba(234,51,111,0.9)]">
          <div className="vb-track-a flex w-max">{row(top, false)}</div>
        </div>
      </div>
      <div className="relative -mx-[5%] -mt-14 rotate-[3deg] lg:-mt-20">
        <div className="vb-skew border-y border-rose-400/40 bg-night-900/90 py-4 text-rose-300 backdrop-blur-sm">
          <div className="vb-track-b flex w-max">{row(bottom, true)}</div>
        </div>
      </div>
    </div>
  );
}
