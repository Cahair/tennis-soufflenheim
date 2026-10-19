"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { GalleryItem } from "@/lib/content-types";
import { ArrowRight } from "@/components/landing/Arrow";
import { gsap, MQ, useGSAP } from "./gsap";

/* ------------------------------------------------------------------ */
/*  Appel « envoyez vos photos » : un tas de polaroïds qui s'étalent  */
/*  en éventail à l'arrivée. Le bouton « Clic-clac » déclenche un     */
/*  flash plein écran et rebat les polaroïds.                         */
/* ------------------------------------------------------------------ */
export default function FlashCta({ photos }: { photos: GalleryItem[] }) {
  const root = useRef<HTMLDivElement>(null);
  const shots = photos.slice(0, 4);
  const fan = [-14, -5, 6, 15];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(root);
        gsap.from(q(".fc-pola"), {
          rotate: 0,
          x: 0,
          y: 120,
          autoAlpha: 0,
          duration: 1.2,
          stagger: 0.12,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });
      });
    },
    { scope: root }
  );

  const shoot = () => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const q = gsap.utils.selector(root.current);
    gsap.fromTo(q(".fc-flash"), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.9, ease: "power2.out" });
    gsap.to(q(".fc-pola"), {
      rotate: () => gsap.utils.random(-22, 22),
      x: () => gsap.utils.random(-50, 50),
      y: () => gsap.utils.random(-30, 30),
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
      stagger: 0.04,
    });
  };

  return (
    <div ref={root} className="relative grid items-center gap-16 lg:grid-cols-2">
      <div className="relative mx-auto h-[22rem] w-full max-w-md sm:h-[26rem]">
        {shots.map((p, i) => (
          <figure
            key={p.src.src}
            className="fc-pola absolute left-1/2 top-1/2 w-52 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-white p-2.5 pb-10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] sm:w-60"
            style={{ rotate: `${fan[i]}deg`, marginLeft: `${(i - 1.5) * 2.4}rem` }}
          >
            <div className="relative aspect-square overflow-hidden bg-night-200">
              <Image src={p.src} alt={p.alt} fill sizes="15rem" className="object-cover" />
            </div>
            <figcaption className="absolute inset-x-2 bottom-2.5 truncate text-center font-display text-sm text-night-900">
              {p.caption}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="text-center lg:text-left">
        <p className="kicker text-rose-300">Appel à photographes</p>
        <h2 className="display mt-5 text-[clamp(2.4rem,5vw,4.2rem)] text-white">Vous avez de belles photos du club&nbsp;?</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/70 lg:mx-0">
          Tournois, doubles entre amis, couchers de soleil sur les courts&nbsp;: envoyez-nous vos clichés,
          les plus beaux rejoindront la galerie.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4 lg:justify-start">
          <Link href="/contact" className="btn btn-rose">
            Envoyer mes photos
            <ArrowRight />
          </Link>
          <button type="button" onClick={shoot} className="btn btn-outline-light">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
            Clic-clac !
          </button>
        </div>
      </div>

      <div aria-hidden="true" className="fc-flash pointer-events-none invisible fixed inset-0 z-[90] bg-white" />
    </div>
  );
}
