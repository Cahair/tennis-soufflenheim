"use client";

import { useRef } from "react";
import type { ReservationInfo } from "@/lib/content-types";
import { telHref } from "@/lib/format";
import { ArrowUpRight } from "./Arrow";
import BallFx, { SPARKS_ON_ROSE, type FxApi } from "./BallFx";
import Magnetic from "./Magnetic";
import { gsap, MQ, ScrollTrigger, SplitText, useGSAP } from "./gsap";

/* ------------------------------------------------------------------ */
/*  Réservation — le moment fort de la page : fond rose, titre géant, */
/*  trois étapes et un grand bouton rond aimanté vers Ten'up.         */
/*                                                                    */
/*  La folie, au service du clic : à l'arrivée, une balle rebondit de */
/*  mot en mot sur le titre puis plonge dans le bouton, pendant qu'un */
/*  chrono file jusqu'à 02:00. Le bouton crépite au survol et         */
/*  explose en confettis au clic ; un clic ailleurs lance une balle.  */
/*  En fond : rayures de piste qui défilent, halos violet et blanc,   */
/*  un « 02:00 » géant en contour qui glisse au défilement.           */
/* ------------------------------------------------------------------ */

/* Balle nuit à coutures roses : lisible sur le fond rose. */
function NightBall({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill="var(--color-night-950)" />
      <path d="M7 4.5 C 16 12, 16 28, 7 35.5" stroke="var(--color-rose-400)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M33 4.5 C 24 12, 24 28, 33 35.5" stroke="var(--color-rose-400)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

const centerOf = (el: Element) => {
  const r = el.getBoundingClientRect();
  return [r.left + r.width / 2, r.top + r.height / 2] as const;
};
export default function Booking({
  reservation,
  tenup,
  phone,
}: {
  reservation: ReservationInfo;
  tenup: string;
  phone: string;
}) {
  const root = useRef<HTMLElement>(null);
  const fx = useRef<FxApi | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(root);
        const section = root.current!;
        const [title] = q(".booking-title");
        const split = SplitText.create(title, {
          type: "words",
          mask: "words",
          ignore: ".booking-scribble",
        });
        gsap.from(split.words, {
          yPercent: 115,
          duration: 1.3,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: title, start: "top 80%" },
        });
        gsap.from(q(".booking-scribble path"), {
          drawSVG: "0%",
          duration: 1.2,
          delay: 0.7,
          ease: "power2.inOut",
          scrollTrigger: { trigger: title, start: "top 80%" },
        });

        gsap.fromTo(
          q(".booking-giant"),
          { xPercent: 12, rotate: -4 },
          {
            xPercent: -18,
            rotate: 3,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
        gsap.to(q(".booking-halo-a"), { xPercent: 20, yPercent: 15, scale: 1.25, duration: 7, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.to(q(".booking-halo-b"), { xPercent: -15, yPercent: -10, scale: 0.85, duration: 9, ease: "sine.inOut", yoyo: true, repeat: -1 });

        const [steps] = q(".booking-steps");
        gsap.from(q(".booking-rule"), {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.3,
          stagger: 0.12,
          ease: "expo.inOut",
          scrollTrigger: { trigger: steps, start: "top 88%" },
        });
        gsap.from(q(".booking-step-body"), {
          y: 26,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: steps, start: "top 88%" },
        });

        const [cta] = q(".booking-cta");
        gsap.from(cta, {
          scale: 0.3,
          rotation: -120,
          autoAlpha: 0,
          duration: 1.6,
          ease: "expo.out",
          scrollTrigger: { trigger: cta, start: "top 92%" },
        });

        // Chrono : de 00:00 à 02:00 en deux secondes, puis « ding ».
        const [chrono] = q(".booking-chrono") as HTMLElement[];
        const clock = { s: 0 };
        const renderClock = () => {
          const total = Math.round(clock.s);
          const mins = String(Math.floor(total / 60)).padStart(2, "0");
          const secs = String(total % 60).padStart(2, "0");
          chrono.textContent = mins + ":" + secs;
        };
        gsap.fromTo(
          clock,
          { s: 0 },
          {
            s: 120,
            duration: 2.2,
            delay: 0.4,
            ease: "power1.in",
            onStart: renderClock,
            onUpdate: renderClock,
            onComplete: () => {
              gsap.fromTo(chrono, { scale: 1.5, rotate: -8 }, { scale: 1, rotate: 0, duration: 0.9, ease: "elastic.out(1.2, 0.35)" });
              fx.current?.burst(...centerOf(chrono), 50, 10);
            },
            scrollTrigger: { trigger: title, start: "top 75%" },
          }
        );

        // Le rallye : la balle saute de mot en mot, puis plonge dans le
        // bouton, qui encaisse et crépite.
        renderClock();
        const [ball] = q(".booking-ball") as HTMLElement[];
        const rally = () => {
          const sr = section.getBoundingClientRect();
          const local = (el: Element, dy = 0) => {
            const r = el.getBoundingClientRect();
            return { x: r.left + r.width / 2 - sr.left, y: r.top - sr.top + dy };
          };
          const half = ball.offsetWidth / 2;
          const hops = split.words.map((w) => ({ el: w as HTMLElement, ...local(w, -half) }));
          const target = local(cta, cta.offsetHeight / 2);
          let from = { x: hops[0].x - 160, y: hops[0].y - 260 };

          const tl = gsap.timeline({ onComplete: () => void gsap.set(ball, { autoAlpha: 0 }) });
          tl.set(ball, { x: from.x, y: from.y, autoAlpha: 1, scale: 1, rotate: 0 });
          let t = 0;
          const hop = (to: { x: number; y: number }, d: number, onLand: () => void) => {
            const peak = Math.min(from.y, to.y) - 110;
            tl.to(ball, { x: to.x, rotate: "+=200", duration: d, ease: "none" }, t)
              .to(ball, { y: peak, duration: d / 2, ease: "power2.out" }, t)
              .to(ball, { y: to.y, duration: d / 2, ease: "power2.in" }, t + d / 2)
              .call(onLand, [], t + d);
            from = to;
            t += d;
          };
          for (const h of hops) {
            hop(h, 0.42, () => {
              gsap.fromTo(
                h.el,
                { scaleY: 0.8, scaleX: 1.08, transformOrigin: "50% 100%" },
                { scaleY: 1, scaleX: 1, duration: 0.7, ease: "elastic.out(1.2, 0.35)" }
              );
              fx.current?.burst(h.x + sr.left, h.y + half + sr.top, 12, 6);
            });
          }
          hop(target, 0.7, () => {
            fx.current?.burst(...centerOf(cta), 110, 15);
            gsap.fromTo(cta, { scale: 1.18 }, { scale: 1, duration: 1.1, ease: "elastic.out(1.2, 0.3)" });
          });
          tl.to(ball, { scale: 0, duration: 0.15, ease: "power2.in" }, t - 0.1);
        };
        ScrollTrigger.create({
          trigger: title,
          start: "top 65%",
          once: true,
          onEnter: () => void gsap.delayedCall(1.1, rally),
        });

        // Bouton : crépite au survol, explose au clic.
        const onCtaEnter = () => fx.current?.burst(...centerOf(cta), 30, 9);
        const onCtaClick = () => {
          const [x, y] = centerOf(cta);
          fx.current?.burst(x, y, 140, 16);
          for (let i = 0; i < 5; i++) fx.current?.ball(x, y);
        };
        cta.addEventListener("pointerenter", onCtaEnter);
        cta.addEventListener("click", onCtaClick);

        // Un clic ailleurs dans la section lance une balle.
        const onClick = (e: MouseEvent) => {
          if ((e.target as Element).closest("a, button")) return;
          fx.current?.ball(e.clientX, e.clientY);
        };
        section.addEventListener("click", onClick);

        return () => {
          cta.removeEventListener("pointerenter", onCtaEnter);
          cta.removeEventListener("click", onCtaClick);
          section.removeEventListener("click", onClick);
        };
      });
    },
    { scope: root }
  );

  const ringText = `${reservation.cta} ✦ 7j/7 ✦ `;

  return (
    <section
      ref={root}
      id="reservation"
      className="relative scroll-mt-20 overflow-clip bg-rose-500 px-4 py-28 text-night-950 sm:px-6 lg:px-8 lg:py-40"
    >
      {/* Décor : rayures qui défilent, halos, chrono géant */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="booking-stripes absolute inset-0" />
        <div className="booking-halo-a absolute -left-[15%] -top-[25%] h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(138,43,226,0.32)_0%,rgba(138,43,226,0)_60%)]" />
        <div className="booking-halo-b absolute -bottom-[30%] -right-[10%] h-[55vmax] w-[55vmax] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0)_60%)]" />
        <span className="booking-giant display text-stroke-night absolute left-[2%] top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[clamp(14rem,40vw,40rem)] leading-none opacity-[0.13]">
          02:00
        </span>
        <div className="grain absolute inset-0" />
      </div>
      <BallFx apiRef={fx} sparks={SPARKS_ON_ROSE} ball="night" className="z-20" />
      {/* La balle du rallye (positionnée par GSAP, invisible au repos) */}
      <div
        aria-hidden="true"
        className="booking-ball pointer-events-none invisible absolute left-0 top-0 z-30 -ml-6 -mt-6 h-12 w-12 drop-shadow-[0_12px_18px_rgba(10,6,16,0.35)]"
      >
        <NightBall className="h-full w-full" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-6">
          <p className="kicker text-night-950/90">Réservation · {reservation.tag}</p>
          {/* Chrono décoratif : file jusqu'à 02:00 à l'arrivée */}
          <p
            aria-hidden="true"
            className="flex shrink-0 items-center gap-2 rounded-full bg-night-950 px-4 py-2 font-display text-xl tabular-nums text-rose-300 shadow-lg shadow-night-950/25 sm:text-2xl"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="12" cy="13" r="8" />
              <path d="M12 9v4l2.5 2M9.5 2.5h5" />
            </svg>
            <span className="booking-chrono inline-block">02:00</span>
          </p>
        </div>

        {/* Titre et bouton ensemble : côte à côte dès lg (le bouton, rond
            comme un chrono, se loge à côté du dernier mot), empilés en
            dessous. Un lien vers #reservation montre ainsi les deux. */}
        <div className="mt-8 flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <h2 className="booking-title display text-[clamp(3.1rem,10.5vw,10.5rem)] leading-[0.88]">
            Votre court
            <br />
            en{" "}
            {/* nowrap : la virgule ne part jamais seule en début de ligne */}
            <span className="whitespace-nowrap">
              <span className="relative inline-block">
                2 minutes
                <svg
                  aria-hidden="true"
                  viewBox="0 0 300 24"
                  className="booking-scribble pointer-events-none absolute -bottom-[0.2em] left-0 h-auto w-full overflow-visible"
                >
                  <path
                    d="M3 16 C 70 5, 150 4, 297 11"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              ,
            </span>{" "}
            chrono
          </h2>

          {/* data-anchor-focus : un lien vers #reservation s'arrête de sorte
              que ce bloc soit entièrement visible (voir SmoothScroll). */}
          <div data-anchor-focus className="flex shrink-0 flex-col items-center gap-6">
            <Magnetic strength={0.22}>
              <a
                href={tenup}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${reservation.cta} (nouvel onglet)`}
                data-umami-event="reservation-tenup"
                data-umami-event-emplacement="bloc-reservation"
                className="booking-cta booking-cta-glow group relative flex h-52 w-52 items-center justify-center rounded-full bg-night-950 text-rose-400 shadow-2xl shadow-night-950/30 ring-0 ring-night-950/10 transition-[scale,box-shadow] duration-500 hover:scale-105 hover:ring-8 sm:h-60 sm:w-60"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 200 200"
                  className="spin-text absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)]"
                >
                  <defs>
                    <path
                      id="booking-ring"
                      d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0"
                    />
                  </defs>
                  <text className="fill-current font-display text-[17px] font-medium uppercase">
                    <textPath href="#booking-ring" textLength="502" lengthAdjust="spacing">
                      {ringText + ringText}
                    </textPath>
                  </text>
                </svg>
                {/* Pastille centrale : c’est elle qui dit « ceci est un bouton » */}
                <span className="relative flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-full bg-night-50 text-night-950 shadow-lg shadow-night-950/25 transition-transform duration-500 group-hover:scale-110 sm:h-28 sm:w-28">
                  <ArrowUpRight className="h-6 w-6 transition-transform duration-500 group-hover:rotate-45 sm:h-7 sm:w-7" />
                  <span className="text-[0.58rem] font-bold uppercase tracking-[0.16em] sm:text-[0.64rem]">
                    Réserver
                  </span>
                </span>
              </a>
            </Magnetic>
            <p className="max-w-60 text-balance text-center text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-night-950/90">
              {reservation.tag} · Gratuit · Confirmation immédiate
            </p>
          </div>
        </div>

        <div className="mt-16 lg:mt-24 lg:grid lg:grid-cols-12 lg:gap-10">
          <p className="max-w-xl text-lg leading-relaxed text-night-950/90 lg:col-span-4">
            {reservation.description}{" "}
            Choisissez votre créneau et venez jouer, 7&nbsp;jours sur&nbsp;7.
          </p>
          {reservation.steps.length > 0 ? (
            <ol className="booking-steps mt-12 grid gap-8 sm:grid-cols-3 lg:col-span-7 lg:col-start-6 lg:mt-0">
              {reservation.steps.map((step, i) => (
                <li key={step} className="relative pt-6">
                  <span className="booking-rule absolute inset-x-0 top-0 h-px bg-night-950/25" />
                  <div className="booking-step-body">
                    <span className="font-display text-4xl font-light">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-3 text-sm leading-relaxed text-night-950/90">{step}</p>
                  </div>
                </li>
              ))}
            </ol>
          ) : null}
        </div>

        <p className="mt-20 text-sm text-night-950/90">
          Besoin d&rsquo;aide pour votre première réservation&nbsp;? Appelez le club au{" "}
          <a
            href={telHref(phone)}
            className="font-bold underline decoration-night-950/30 underline-offset-4 transition-colors hover:decoration-night-950"
          >
            {phone}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
