"use client";

import { useRef } from "react";
import BallFx, { type FxApi } from "@/components/landing/BallFx";
import { PadelBall } from "@/components/landing/NightFx";
import { gsap, MQ, useGSAP } from "./gsap";

/* ------------------------------------------------------------------ */
/*  Les atouts, posés sur une piste de padel vue en perspective : les */
/*  lignes de la piste se tracent au défilement, puis chaque carte    */
/*  tombe du ciel comme une balle, rebondit sur la piste et lâche une */
/*  gerbe d'étincelles à l'impact. Survol : la balle de la carte      */
/*  tourne et la carte s'incline (via NightFx de la section).         */
/* ------------------------------------------------------------------ */
export default function CourtDrop({ items }: { items: { title: string; text: string }[] }) {
  const root = useRef<HTMLDivElement>(null);
  const fx = useRef<FxApi | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(root);
        gsap.from(q(".cd-court rect, .cd-court line"), {
          drawSVG: "0%",
          ease: "none",
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 30%", scrub: true },
        });
        (q(".cd-card") as HTMLElement[]).forEach((card, i) => {
          gsap.from(card, {
            y: () => -window.innerHeight * 0.7,
            rotate: i % 2 ? 14 : -14,
            autoAlpha: 0,
            duration: 1.4,
            delay: i * 0.18,
            ease: "bounce.out",
            scrollTrigger: { trigger: root.current, start: "top 60%" },
            onUpdate() {
              // bounce.out touche le sol à 1/2,75 de sa durée
              if (this.progress() > 0.36 && !card.dataset.hit) {
                card.dataset.hit = "1";
                const r = card.getBoundingClientRect();
                fx.current?.burst(r.left + r.width / 2, r.bottom, 50, 10);
              }
            },
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative pb-10 pt-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-[-10%] bottom-[-12%] top-[18%] [perspective:900px]">
        <svg
          viewBox="0 0 200 100"
          preserveAspectRatio="none"
          className="cd-court h-full w-full [transform:rotateX(60deg)] drop-shadow-[0_0_8px_rgba(234,51,111,0.9)]"
          fill="none"
          stroke="#fc6898"
          strokeWidth="0.6"
          vectorEffect="non-scaling-stroke"
        >
          <rect x="2" y="2" width="196" height="96" rx="1" />
          <line x1="100" y1="0" x2="100" y2="100" stroke="#a35cff" strokeWidth="1.2" />
          <line x1="31" y1="2" x2="31" y2="98" />
          <line x1="169" y1="2" x2="169" y2="98" />
          <line x1="31" y1="50" x2="169" y2="50" />
        </svg>
      </div>

      <div className="relative grid gap-6 md:grid-cols-3 md:gap-8">
        {items.map((h, i) => (
          <div
            key={h.title}
            data-tilt
            className={`cd-card holo-frame relative rounded-[1.75rem] p-[2px] shadow-[0_40px_80px_-30px_rgba(234,51,111,0.8)] ${i === 1 ? "md:mt-16" : ""}`}
          >
            <div className="group relative h-full overflow-hidden rounded-[calc(1.75rem-2px)] bg-night-950/90 p-8 backdrop-blur-md">
              <span aria-hidden="true" className="hero-outline display pointer-events-none absolute -right-2 -top-6 text-[7rem] leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span aria-hidden="true" className="block h-11 w-11 transition-transform duration-700 group-hover:rotate-[360deg]">
                <PadelBall className="h-full w-full drop-shadow-[0_0_14px_rgba(234,51,111,0.8)]" />
              </span>
              <h3 className="display relative mt-6 text-3xl text-white">{h.title}</h3>
              <p className="relative mt-3 leading-relaxed text-white/70">{h.text}</p>
              <div className="nfx-shine" />
            </div>
          </div>
        ))}
      </div>
      <BallFx apiRef={fx} />
    </div>
  );
}
