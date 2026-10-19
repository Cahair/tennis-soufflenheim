"use client";

import { useRef, useState } from "react";
import type { Testimonial } from "@/lib/content-types";
import { gsap, MQ, ScrollTrigger, SplitText, useGSAP } from "./gsap";
import NightFx from "./NightFx";

const SLIDE_SECONDS = 7;

/* ------------------------------------------------------------------ */
/*  Témoignages — une seule citation à la fois, en grand. Rotation    */
/*  automatique (barre de progression), suspendue hors écran, au      */
/*  survol et au focus ; désactivée en mouvement réduit. Décor de     */
/*  nuit, guillemets géants en dégradé qui basculent à chaque         */
/*  changement de citation.                                           */
/* ------------------------------------------------------------------ */
export default function Voices({ testimonials }: { testimonials: Testimonial[] }) {
  const root = useRef<HTMLElement>(null);
  const firstRun = useRef(true);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const section = root.current;
        const q = gsap.utils.selector(root);
        const [quote] = q(`.voice[data-index="${active}"] .voice-quote`);
        if (!section || !quote) return;

        // Première apparition : au défilement ; ensuite, à chaque changement.
        const entrance = firstRun.current
          ? { scrollTrigger: { trigger: section, start: "top 75%" } }
          : {};
        firstRun.current = false;

        const split = SplitText.create(quote, { type: "words", mask: "words" });
        gsap.from(split.words, { yPercent: 110, duration: 1.1, stagger: 0.022, ease: "expo.out", ...entrance });
        gsap.fromTo(
          q(".voice-mark"),
          { scale: 0.4, rotate: -35, autoAlpha: 0 },
          { scale: 1, rotate: 0, autoAlpha: 1, duration: 1.4, ease: "elastic.out(1, 0.45)", ...entrance }
        );
        gsap.from(q(`.voice[data-index="${active}"] .voice-author`), {
          y: 16,
          autoAlpha: 0,
          duration: 0.9,
          delay: 0.35,
          ease: "power3.out",
          ...entrance,
        });

        if (testimonials.length < 2) return;
        const [fill] = q(`.voice-bar[data-index="${active}"] .voice-bar-fill`);
        const progress = gsap.fromTo(
          fill,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: SLIDE_SECONDS,
            ease: "none",
            paused: true,
            onComplete: () => setActive((a) => (a + 1) % testimonials.length),
          }
        );
        let visible = false;
        let held = false;
        const sync = () => {
          if (visible && !held) progress.play();
          else progress.pause();
        };
        const st = ScrollTrigger.create({
          trigger: section,
          start: "top 80%",
          end: "bottom 20%",
          onToggle: (self) => {
            visible = self.isActive;
            sync();
          },
        });
        visible = st.isActive;
        sync();

        const hold = () => {
          held = true;
          sync();
        };
        const release = () => {
          held = false;
          sync();
        };
        section.addEventListener("pointerenter", hold);
        section.addEventListener("pointerleave", release);
        section.addEventListener("focusin", hold);
        section.addEventListener("focusout", release);
        return () => {
          section.removeEventListener("pointerenter", hold);
          section.removeEventListener("pointerleave", release);
          section.removeEventListener("focusin", hold);
          section.removeEventListener("focusout", release);
        };
      });
    },
    { scope: root, dependencies: [active], revertOnUpdate: true }
  );

  if (testimonials.length === 0) return null;

  return (
    <section
      ref={root}
      aria-label="Témoignages de membres"
      className="relative overflow-clip bg-night-950 px-4 py-32 text-white sm:px-6 lg:px-8 lg:py-48"
    >
      <NightFx glow="right" />
      <div className="relative mx-auto max-w-5xl text-center">
        <p className="kicker kicker-center text-rose-300">Ils en parlent</p>

        {/* Guillemets géants en dégradé */}
        <span
          aria-hidden="true"
          className="voice-mark brand-gradient-text pointer-events-none absolute -top-24 left-1/2 block -translate-x-1/2 select-none font-display text-[16rem] leading-none opacity-25 sm:-top-32 sm:text-[22rem]"
        >
          “
        </span>

        <div className="relative mt-12 grid">
          {testimonials.map((t, i) => (
            <figure
              key={`${t.name}-${i}`}
              data-index={i}
              className={`voice col-start-1 row-start-1 transition-[opacity,visibility] duration-700 ${
                i === active ? "visible opacity-100" : "invisible opacity-0"
              }`}
            >
              <blockquote className="voice-quote font-display text-[clamp(1.7rem,3.6vw,3.1rem)] font-light leading-[1.18] text-white">
                «&nbsp;{t.quote}&nbsp;»
              </blockquote>
              <figcaption className="voice-author mt-10 flex flex-col items-center gap-1">
                <span className="font-semibold text-rose-300">{t.name}</span>
                <span className="text-sm text-white/60">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {testimonials.length > 1 ? (
          <div className="relative mt-12 flex justify-center gap-3">
            {testimonials.map((t, i) => (
              <button
                key={`${t.name}-${i}`}
                type="button"
                data-index={i}
                onClick={() => setActive(i)}
                aria-label={`Témoignage de ${t.name}`}
                aria-current={i === active ? "true" : undefined}
                className="voice-bar relative h-8 w-14"
              >
                <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/15">
                  <span
                    className={`voice-bar-fill absolute inset-0 origin-left bg-gradient-to-r from-rose-400 to-ultra-400 ${
                      i > active ? "scale-x-0" : ""
                    }`}
                  />
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
