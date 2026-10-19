"use client";

import { useRef } from "react";
import Link from "next/link";
import BallFx, { SPARKS_ON_ROSE, type FxApi } from "@/components/landing/BallFx";
import Magnetic from "@/components/landing/Magnetic";
import { ArrowRight } from "@/components/landing/Arrow";
import { frenchSpacing, gsap, MQ, SplitText, useGSAP } from "./gsap";

/* ------------------------------------------------------------------ */
/*  Bandeau d'appel rose, la cassure de couleur des pages intérieures */
/*  (comme la réservation sur l'accueil) : rayures de piste qui       */
/*  défilent, mot géant en contour nuit qui traverse, titre qui fait  */
/*  la ola en continu, et chaque clic fait tomber une balle nuit.     */
/* ------------------------------------------------------------------ */
export default function PinkCall({ title, text }: { title: string; text: string }) {
  const root = useRef<HTMLElement>(null);
  const fx = useRef<FxApi | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(root);
        const section = root.current!;
        const split = SplitText.create(q(".pc-title"), { type: "words,chars" });
        gsap.from(split.chars, {
          yPercent: 100,
          scaleY: 0.2,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.03,
          ease: "back.out(2.5)",
          scrollTrigger: { trigger: section, start: "top 75%" },
          onComplete: () => {
            gsap
              .timeline({ repeat: -1, repeatDelay: 2.8 })
              .to(split.chars, { yPercent: -16, duration: 0.22, stagger: 0.04, ease: "power2.out" })
              .to(split.chars, { yPercent: 0, duration: 0.6, stagger: 0.04, ease: "bounce.out" }, 0.22);
          },
        });
        gsap.fromTo(q(".pc-ghost"), { xPercent: 0 }, { xPercent: -30, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true } });

        const onClick = (e: MouseEvent) => {
          if ((e.target as Element).closest("a, button")) return;
          fx.current?.ball(e.clientX, e.clientY);
        };
        section.addEventListener("click", onClick);
        return () => {
          section.removeEventListener("click", onClick);
          split.revert();
        };
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-clip bg-rose-500 py-28 sm:py-32">
      <div aria-hidden="true" className="booking-stripes pointer-events-none absolute inset-0" />
      <p
        aria-hidden="true"
        className="pc-ghost text-stroke-night display pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[clamp(9rem,30vw,26rem)] leading-none opacity-15"
      >
        On joue ? ✦ On joue ? ✦ On joue ?
      </p>
      <BallFx apiRef={fx} sparks={SPARKS_ON_ROSE} ball="night" className="z-0" />
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
        <h2 className="pc-title display text-[clamp(3rem,8vw,6.5rem)] leading-[0.9] text-night-950">
          {frenchSpacing(title)}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg font-medium text-night-950/90">{text}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Magnetic>
            <Link href="/#reservation" className="booking-cta-glow btn btn-night">
              Réserver un court
              <ArrowRight />
            </Link>
          </Magnetic>
          <Magnetic>
            <Link href="/contact" className="btn btn-outline-night">
              Nous contacter
            </Link>
          </Magnetic>
        </div>
        <p aria-hidden="true" className="mt-8 hidden text-xs font-bold uppercase tracking-[0.25em] text-night-950/90 lg:block">
          ✦ Cliquez dans le rose pour servir
        </p>
      </div>
    </section>
  );
}
