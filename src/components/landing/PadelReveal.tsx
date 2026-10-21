"use client";

import { useRef } from "react";
import Image from "next/image";
import { halleLogo } from "@/lib/images";
import { ArrowRight } from "./Arrow";
import Magnetic from "./Magnetic";
import NightFx from "./NightFx";
import { gsap, MQ, ScrollTrigger, SplitText, useGSAP } from "./gsap";

const VIDEO_URL = "https://www.youtube.com/watch?v=Ds8nB-zO1pQ";

const atouts = ["100 % couvert", "Éclairage LED", "365 jours par an"];
const backItems = ["Vibora", "Bandeja", "Smash", "Chiquita", "Bajada", "Par 3"];
const marqueeItems = [
  "Padel",
  "Nouveau au club",
  "100 % couvert",
  "Toute l'année",
  "Jour & nuit",
];

/* Pastille « Pluie ? On joue ! » — texte circulaire tourné au défilement */
function RainBadge() {
  return (
    <div
      aria-hidden="true"
      className="padel-badge absolute right-[5%] top-[13%] z-20 hidden h-36 w-36 lg:block xl:h-40 xl:w-40"
    >
      <svg viewBox="0 0 200 200" className="padel-badge-ring h-full w-full">
        <defs>
          <path
            id="padel-badge-circle"
            d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
          />
        </defs>
        <circle cx="100" cy="100" r="99" className="fill-rose-400" />
        <text className="fill-night-950 font-display text-[21px] font-semibold uppercase">
          <textPath href="#padel-badge-circle" textLength="464" lengthAdjust="spacing">
            {"Pluie ? On joue ! ✦ Pluie ? On joue ! ✦ "}
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-night-950">
        <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12a10 10 0 0 0-20 0Z" />
          <path d="M12 12v7a2 2 0 0 0 4 0" />
          <path d="M12 2v1" />
        </svg>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Le padel couvert — sur grand écran, la scène s'épingle : la photo */
/*  grandit d'une carte jusqu'au plein écran, le titre apparaît. Un   */
/*  ruban défilant réagit à la vitesse du défilement (sens et         */
/*  inclinaison), croisé en X avec un second ruban en contour. Avant  */
/*  l'ouverture, la carte flotte dans le décor de nuit du hero        */
/*  (projecteurs, sol de piste, balles). La vidéo du club s'ouvre sur */
/*  YouTube, à la demande.                                            */
/* ------------------------------------------------------------------ */
export default function PadelReveal() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      const [stage] = q(".padel-stage");

      mm.add(MQ.desktop, () => {
        const split = SplitText.create(q(".padel-title"), { type: "words", mask: "words" });
        gsap
          .timeline({
            scrollTrigger: {
              trigger: stage,
              start: "top top",
              end: "+=150%",
              pin: true,
              scrub: 1,
              anticipatePin: 1,
            },
          })
          .fromTo(
            q(".padel-frame"),
            { clipPath: "inset(22% 31% 22% 31% round 2rem)" },
            { clipPath: "inset(0% 0% 0% 0% round 0rem)", ease: "power2.inOut", duration: 1 },
            0
          )
          .fromTo(q(".padel-zoom"), { scale: 1.4 }, { scale: 1, ease: "power2.inOut", duration: 1 }, 0)
          .fromTo(q(".padel-ghost"), { scale: 1 }, { scale: 1.5, autoAlpha: 0, ease: "power2.in", duration: 0.7 }, 0)
          .fromTo(q(".padel-frame-glow"), { autoAlpha: 1 }, { autoAlpha: 0, ease: "power2.in", duration: 0.8 }, 0)
          .from(split.words, { yPercent: 115, stagger: 0.05, duration: 0.45, ease: "power3.out" }, 0.6)
          .from(q(".padel-fade"), { y: 30, autoAlpha: 0, stagger: 0.06, duration: 0.4, ease: "power2.out" }, 0.75)
          .to({}, { duration: 0.35 });

        gsap.to(q(".padel-badge-ring"), {
          rotation: 540,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      mm.add(MQ.mobile, () => {
        const split = SplitText.create(q(".padel-title"), { type: "words", mask: "words" });
        const along = { trigger: stage, start: "top bottom", end: "top top", scrub: true };
        gsap.fromTo(
          q(".padel-frame"),
          { clipPath: "inset(7% 5% 7% 5% round 1.5rem)" },
          { clipPath: "inset(0% 0% 0% 0% round 0rem)", ease: "none", scrollTrigger: along }
        );
        gsap.fromTo(q(".padel-zoom"), { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { ...along } });
        gsap.from(split.words, {
          yPercent: 115,
          duration: 1.2,
          stagger: 0.06,
          ease: "expo.out",
          scrollTrigger: { trigger: stage, start: "top 40%" },
        });
        gsap.from(q(".padel-fade"), {
          y: 24,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: stage, start: "top 30%" },
        });
      });

      // Ruban : boucle infinie accélérée, inversée et inclinée par le scroll.
      mm.add(MQ.motion, () => {
        const [band] = q(".padel-marquee");
        const [track] = q(".padel-marquee-track");
        gsap.fromTo(q(".padel-back-track"), { xPercent: -50 }, { xPercent: 0, ease: "none", duration: 36, repeat: -1 });
        const loop = gsap.to(track, { xPercent: -50, ease: "none", duration: 28, repeat: -1 });
        loop.totalTime(loop.duration() * 200); // marge pour la lecture à rebours
        const skewTo = gsap.quickTo(track, "skewX", { duration: 0.5, ease: "power3" });
        let settle: gsap.core.Tween | null = null;
        ScrollTrigger.create({
          trigger: band,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const velocity = self.getVelocity();
            const direction = self.direction;
            gsap.to(loop, {
              timeScale: direction * gsap.utils.clamp(1, 6, 1 + Math.abs(velocity) / 350),
              duration: 0.25,
              overwrite: true,
              onComplete: () => {
                gsap.to(loop, { timeScale: direction, duration: 1.2, overwrite: true });
              },
            });
            skewTo(gsap.utils.clamp(-9, 9, velocity / -260));
            settle?.kill();
            settle = gsap.delayedCall(0.14, () => skewTo(0));
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="nouveau-padel" className="relative scroll-mt-20 bg-night-950">
      <div className="padel-stage relative h-[100svh] min-h-[40rem] overflow-clip">
        <NightFx floor beams fx={false} />
        {/* Halo autour de la carte fermée, éteint à l'ouverture */}
        <div
          aria-hidden="true"
          className="padel-frame-glow pointer-events-none absolute left-1/2 top-1/2 hidden h-[70%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-[3rem] bg-gradient-to-br from-rose-500/60 to-ultra-500/60 blur-3xl lg:block"
        />
        {/* Filigrane visible autour de la carte, avant l'ouverture */}
        <div
          aria-hidden="true"
          className="padel-ghost pointer-events-none absolute inset-0 hidden select-none items-center justify-center lg:flex"
        >
          <span className="display hero-outline text-[26vw] leading-none">Padel</span>
        </div>

        <div className="padel-frame absolute inset-0 overflow-hidden bg-night-950">
          <div className="padel-zoom absolute inset-0">
            <Image
              src={halleLogo}
              alt=""
              fill
              placeholder="blur"
              sizes="100vw"
              className="animate-kenburns object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-night-950/80 via-night-950/45 to-night-950/85" />
          <div className="grain absolute inset-0" />
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white sm:px-6">
          <p className="padel-fade kicker kicker-center text-[0.65rem] text-rose-400 sm:text-xs">
            Nouveau au club
          </p>
          <h2 className="padel-title display mt-6 text-[clamp(2.8rem,8.5vw,8rem)] leading-[0.92]">
            Le padel est arrivé…
            <br />
            {/* SplitText coupe aussi sur l'espace insécable : nowrap garde
                « couvert ! » d'un seul tenant */}
            <span className="text-rose-400">
              et il est <span className="whitespace-nowrap">couvert&nbsp;!</span>
            </span>
          </h2>
          <p className="padel-fade mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            Une piste SLAMCOURT dernière génération, à l&apos;abri&nbsp;: ici, la
            pluie n&apos;annule jamais un match.
          </p>
          <ul className="mt-9 flex flex-wrap justify-center gap-x-9 gap-y-3">
            {atouts.map((a) => (
              <li
                key={a}
                className="padel-fade flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-white/85"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                {a}
              </li>
            ))}
          </ul>
          <div className="padel-fade mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <Magnetic>
              <a href="#reservation" className="btn btn-rose">
                Réserver la piste
                <ArrowRight />
              </a>
            </Magnetic>
            <a
              href={VIDEO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-light"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5-11-6.5z" />
              </svg>
              Voir la vidéo du club
            </a>
          </div>
        </div>

        <RainBadge />
      </div>

      {/* Deux rubans croisés en X, comme dans le hero */}
      <div className="padel-marquee relative overflow-hidden bg-night-950 py-16 sm:py-20">
        <div aria-hidden="true" className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 rotate-[3deg] border-y border-rose-500/40 bg-night-900 py-3">
          <div className="padel-back-track flex w-max">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {[...backItems, ...backItems].map((t, i) => (
                  <span key={i} className="hero-outline display flex items-center gap-8 pr-8 text-3xl sm:text-5xl">
                    {t}
                    <span className="text-rose-500">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="relative -mx-[5%] -rotate-[2deg] bg-gradient-to-r from-rose-500 via-rose-600 to-ultra-500 py-4 shadow-[0_20px_60px_-15px_rgba(234,51,111,0.8)] sm:py-5">
        <div className="padel-marquee-track flex w-max items-center">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
              className="flex items-center gap-10 pr-10"
            >
              {marqueeItems.map((item, i) => (
                <span key={item} className="flex items-center gap-10">
                  <span
                    className={`display whitespace-nowrap text-4xl sm:text-6xl ${
                      i % 2 === 0 ? "text-white" : "text-night-950"
                    }`}
                  >
                    {item}
                  </span>
                  <span className="text-xl text-night-950">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
