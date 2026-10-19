"use client";

import { useRef } from "react";
import BallFx, { type FxApi } from "@/components/landing/BallFx";
import NightFx from "@/components/landing/NightFx";
import { gsap, MQ, SCRAMBLE_CHARS, SplitText, useGSAP } from "@/components/fx/gsap";

export type HeroEffect = "drop" | "scramble" | "neon" | "slam";

const DEFAULT_TAPE = ["Padel", "Soufflenheim", "Ça claque", "Tennis", "Padel", "Pickleball", "Depuis 1979"];

/* ------------------------------------------------------------------ */
/*  En-tête des pages intérieures, en « soirée padel » : décor de     */
/*  nuit (projecteurs, sol de piste, balles), mot géant en contour    */
/*  qui file au défilement et deux rubans croisés en X.               */
/*                                                                    */
/*  Le titre entre de quatre façons selon la page (`effect`) :        */
/*   - drop     : les lettres tombent du ciel et rebondissent ;       */
/*   - scramble : chaque lettre se brouille avant de se fixer ;       */
/*   - neon     : les mots s'allument en grésillant, comme une        */
/*                enseigne ;                                          */
/*   - slam     : le titre s'écrase sur l'écran (onde, étincelles,    */
/*                secousse).                                          */
/*  Au survol, chaque lettre s'écrase en gelée. Rien ne bouge en      */
/*  mouvement réduit ; le titre reste lisible sans JavaScript (filet  */
/*  de sécurité CSS .ph-title).                                       */
/* ------------------------------------------------------------------ */
export default function PageHero({
  kicker,
  title,
  text,
  echo,
  tape = DEFAULT_TAPE,
  effect = "drop",
}: {
  kicker: string;
  title: string;
  text?: string;
  /** Mot géant en contour derrière le titre. */
  echo?: string;
  tape?: string[];
  effect?: HeroEffect;
}) {
  const root = useRef<HTMLElement>(null);
  const fx = useRef<FxApi | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MQ.motion, () => {
        const section = root.current!;
        const [heading] = q(".ph-title") as HTMLElement[];
        const split = SplitText.create(heading, { type: "words,chars" });
        const chars = split.chars as HTMLElement[];
        heading.classList.add("ph-ready");

        const tl = gsap.timeline({ delay: 0.15 });
        if (effect === "drop") {
          tl.from(chars, {
            yPercent: () => -260 - Math.random() * 200,
            rotate: () => gsap.utils.random(-50, 50),
            autoAlpha: 0,
            duration: 1.3,
            ease: "bounce.out",
            stagger: { each: 0.025, from: "random" },
          });
        } else if (effect === "scramble") {
          chars.forEach((c) => {
            const final = c.textContent ?? "";
            tl.fromTo(
              c,
              { autoAlpha: 0 },
              {
                autoAlpha: 1,
                duration: 1 + Math.random() * 0.9,
                scrambleText: { text: final, chars: SCRAMBLE_CHARS, speed: 0.6 },
                ease: "none",
              },
              Math.random() * 0.5
            );
          });
          tl.fromTo(chars, { color: "#fc6898" }, { color: "#ffffff", duration: 0.8, stagger: 0.01 }, ">-0.4");
        } else if (effect === "neon") {
          (split.words as HTMLElement[]).forEach((w) => {
            tl.fromTo(
              w,
              { opacity: 0.05, textShadow: "0 0 0 rgba(234,51,111,0)" },
              {
                keyframes: {
                  opacity: [0.05, 1, 0.15, 0.9, 0.3, 1],
                  textShadow: [
                    "0 0 0px rgba(234,51,111,0)",
                    "0 0 40px rgba(234,51,111,1)",
                    "0 0 0px rgba(234,51,111,0)",
                    "0 0 30px rgba(234,51,111,0.9)",
                    "0 0 0px rgba(234,51,111,0)",
                    "0 0 22px rgba(234,51,111,0.65)",
                  ],
                },
                duration: 0.9,
                ease: "steps(6)",
              },
              Math.random() * 0.9
            );
          });
        } else {
          // slam : le titre arrive de très près, s'écrase, l'écran tremble.
          tl.from(heading, { scale: 3.2, autoAlpha: 0, filter: "blur(18px)", duration: 0.55, ease: "power4.in" })
            .add(() => {
              const r = heading.getBoundingClientRect();
              fx.current?.burst(r.left + r.width / 2, r.top + r.height / 2, 140, 15);
              const sr = (q(".ph-stage")[0] as HTMLElement).getBoundingClientRect();
              gsap.set(q(".ph-shock"), { left: r.left - sr.left + r.width / 2, top: r.top - sr.top + r.height / 2 });
              gsap.fromTo(q(".ph-shock"), { scale: 0, autoAlpha: 1 }, { scale: (i: number) => 10 + i * 7, autoAlpha: 0, duration: 1.1, stagger: 0.1, ease: "expo.out" });
            })
            .to(q(".ph-stage"), { keyframes: { x: [-16, 13, -8, 5, -2, 0], y: [8, -6, 4, -2, 1, 0] }, duration: 0.45, ease: "none" })
            .to(chars, { keyframes: { yPercent: [0, -22, 0] }, duration: 0.5, stagger: { each: 0.015, from: "center" }, ease: "power2.out" }, "<");
        }

        tl.from(q(".ph-fade"), { y: 26, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" }, 0.5)
          .from(q(".ph-tape"), { xPercent: (i: number) => (i ? 110 : -110), duration: 1.4, ease: "expo.out" }, 0.4);

        // Mot géant et rubans qui filent au défilement.
        gsap
          .timeline({ scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true } })
          .to(q(".ph-echo"), { xPercent: -18, ease: "none" }, 0)
          .to(q(".ph-copy"), { yPercent: -18, autoAlpha: 0.2, ease: "none" }, 0);

        const offs = (window.matchMedia(MQ.pointer).matches ? chars : []).map((el) => {
          const fn = () => {
            gsap.fromTo(el, { scaleX: 1.35, scaleY: 0.65 }, { scaleX: 1, scaleY: 1, duration: 0.9, ease: "elastic.out(1.2, 0.3)", overwrite: "auto" });
            const r = el.getBoundingClientRect();
            fx.current?.burst(r.left + r.width / 2, r.top + r.height * 0.2, 10, 6);
          };
          el.addEventListener("pointerenter", fn);
          return () => el.removeEventListener("pointerenter", fn);
        });

        return () => {
          offs.forEach((off) => off());
          split.revert();
          heading.classList.remove("ph-ready");
        };
      });
    },
    { scope: root }
  );

  const loop = [...tape, ...tape];

  return (
    <section
      ref={root}
      className="relative overflow-clip bg-night-950 pb-40 pt-36 text-white sm:pt-44 lg:pb-48"
    >
      <NightFx floor beams />
      <div className="ph-stage relative">
        {echo ? (
          <p
            aria-hidden="true"
            className="ph-echo hero-outline display pointer-events-none absolute -top-10 left-[-2vw] select-none whitespace-nowrap text-[clamp(8rem,24vw,22rem)] leading-none"
          >
            {echo} ✦ {echo}
          </p>
        ) : null}

        <div className="ph-copy relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="ph-fade inline-flex items-center gap-3 rounded-full border border-rose-400/40 bg-rose-500/10 px-4 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-rose-300 backdrop-blur-sm sm:text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
            </span>
            {kicker}
          </span>
          <h1 className="ph-title display mt-7 max-w-5xl text-[clamp(2.9rem,7.5vw,6.8rem)] leading-[0.92] text-white [text-shadow:0_0_40px_rgba(234,51,111,0.35)]">
            {title}
          </h1>
          {text ? (
            <p className="ph-fade mt-8 max-w-2xl text-lg leading-relaxed text-white/75">{text}</p>
          ) : null}
        </div>

        {[0, 1, 2].map((i) => (
          <div
            key={i}
            aria-hidden="true"
            className="ph-shock pointer-events-none invisible absolute left-1/3 top-1/2 z-20 -ml-8 -mt-8 h-16 w-16 rounded-full border-2 border-rose-300 shadow-[0_0_30px_rgba(234,51,111,0.8)]"
          />
        ))}
      </div>

      {/* Rubans croisés en X, comme sur l'accueil */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-[-5%] bottom-14 z-10 rotate-[3deg]">
        <div className="ph-tape overflow-hidden border-y border-rose-500/40 bg-night-900/90 py-2 backdrop-blur-sm">
          <div className="marquee-track marquee-reverse flex">
            {loop.map((t, i) => (
              <span key={i} className="hero-outline display flex items-center gap-6 pr-6 text-lg sm:text-2xl">
                {t}
                <span className="text-rose-500">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-[-5%] bottom-12 z-10 -rotate-[2deg]">
        <div className="ph-tape overflow-hidden bg-gradient-to-r from-rose-500 via-rose-600 to-ultra-500 py-2.5 shadow-[0_20px_50px_-15px_rgba(234,51,111,0.7)]">
          <div className="marquee-track flex">
            {loop.map((t, i) => (
              <span key={i} className="display flex items-center gap-6 pr-6 text-lg text-white sm:text-2xl">
                {t}
                <span className="text-night-950">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <BallFx apiRef={fx} />
    </section>
  );
}
