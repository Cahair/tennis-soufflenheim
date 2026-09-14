"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { padelCourt } from "@/lib/images";
import { ArrowRight } from "./Arrow";
import Magnetic from "./Magnetic";
import { gsap, MQ, SplitText, useGSAP } from "./gsap";
import { markIntroReady, onIntro } from "./intro";

/* ------------------------------------------------------------------ */
/*  Hero — un visuel plein écran, un titre, deux actions.             */
/*  Entrée : zoom arrière de la photo et titre qui monte mot à mot,   */
/*  déclenchés à l'ouverture du splash. Au défilement, le visuel se   */
/*  détache en carte arrondie sur le fond crème.                      */
/*  Les éléments data-intro-hide sont masqués en CSS jusqu'à l'entrée */
/*  (data-intro="pending"), pour éviter tout flash avant hydratation. */
/* ------------------------------------------------------------------ */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, (ctx) => {
        const q = gsap.utils.selector(root);

        gsap
          .timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          })
          .fromTo(
            q(".hero-frame"),
            { clipPath: "inset(0% 0% 0% 0% round 0rem)" },
            { clipPath: "inset(0% 2.5% 10% 2.5% round 2.5rem)", ease: "none" },
            0
          )
          .to(q(".hero-parallax"), { yPercent: 18, ease: "none" }, 0)
          .to(q(".hero-content"), { yPercent: -30, autoAlpha: 0, ease: "none" }, 0)
          .to(q(".hero-cue"), { autoAlpha: 0, ease: "none", duration: 0.25 }, 0);

        // Méthode nommée : ctx.add(nom, fn) renvoie une fonction appelable
        // plus tard, dont les animations restent rattachées au contexte.
        let alive = true;
        const play = ctx.add("play", () => {
          if (!alive) return;
          const title = SplitText.create(q(".hero-title"), { type: "words", mask: "words" });
          gsap
            .timeline({ defaults: { ease: "expo.out" } })
            .fromTo(q(".hero-zoom"), { scale: 1.3 }, { scale: 1, duration: 2.6 }, 0)
            .fromTo(q(".hero-shade"), { opacity: 0.75 }, { opacity: 0, duration: 2.2 }, 0)
            .from(title.words, { yPercent: 115, duration: 1.4, stagger: 0.09 }, 0.15)
            .from(q(".hero-fade"), { y: 26, autoAlpha: 0, duration: 1.1, stagger: 0.12, ease: "power3.out" }, 0.55);
          // États de départ posés : on retire le masquage CSS.
          markIntroReady();
        });

        const stop = onIntro(() => {
          if (document.fonts.status === "loaded") play();
          else document.fonts.ready.then(() => play());
        });
        return () => {
          alive = false;
          stop();
        };
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="top"
      aria-label="Accueil"
      className="relative h-[100svh] min-h-[38rem] bg-cream-50"
    >
      <div className="hero-frame absolute inset-0 overflow-hidden bg-pine-950">
        <div className="hero-parallax absolute inset-0">
          <div data-hero-media className="hero-zoom absolute inset-0">
            <Image
              src={padelCourt}
              alt=""
              fill
              preload
              placeholder="blur"
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-pine-950/75 via-pine-950/35 to-pine-950/85" />
        <div className="hero-shade absolute inset-0 bg-pine-950 opacity-0" />
        <div className="grain absolute inset-0" />
      </div>

      <div className="hero-content relative z-10 flex h-full flex-col items-center justify-center px-4 pb-16 pt-28 text-center sm:px-6">
        <p
          data-intro-hide
          className="hero-fade text-[0.65rem] font-semibold uppercase tracking-[0.38em] text-gold-300 sm:text-xs"
        >
          Soufflenheim · Alsace du Nord
        </p>
        <h1
          data-intro-hide
          className="hero-title display mt-6 text-[clamp(3.1rem,12.5vw,10.5rem)] leading-[0.9] text-white"
        >
          Tennis, padel
          <br />
          <span className="text-gold-400">&amp; pickleball</span>
        </h1>
        <p
          data-intro-hide
          className="hero-fade mt-6 font-display text-xl font-light text-white/85 sm:mt-8 sm:text-3xl"
        >
          comme à la maison, depuis 1979.
        </p>
        <div
          data-intro-hide
          className="hero-fade mt-10 flex flex-col items-center gap-3 sm:mt-12 sm:flex-row sm:gap-4"
        >
          <Magnetic>
            <a href="#reservation" className="btn btn-gold">
              Réserver un court
              <ArrowRight />
            </a>
          </Magnetic>
          <Magnetic>
            <Link href="/le-club" className="btn btn-outline-light">
              Découvrir le club
            </Link>
          </Magnetic>
        </div>
      </div>

      <div className="hero-cue absolute inset-x-0 bottom-6 z-10 flex justify-center">
        <a
          href="#club"
          data-intro-hide
          className="hero-fade flex flex-col items-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.35em] text-white/60 transition-colors hover:text-gold-300"
        >
          Défiler
          <span className="relative block h-12 w-px overflow-hidden bg-white/20">
            <span className="scroll-cue-line absolute inset-x-0 top-0 h-1/2 bg-gold-400" />
          </span>
        </a>
      </div>
    </section>
  );
}
