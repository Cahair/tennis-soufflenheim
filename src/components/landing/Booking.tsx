"use client";

import { useRef } from "react";
import type { ReservationInfo } from "@/lib/content-types";
import { telHref } from "@/lib/format";
import { ArrowUpRight } from "./Arrow";
import Magnetic from "./Magnetic";
import { gsap, MQ, SplitText, useGSAP } from "./gsap";

/* ------------------------------------------------------------------ */
/*  Réservation — le moment fort de la page : fond or, titre géant,   */
/*  trois étapes et un grand bouton rond aimanté vers Ten'up.         */
/* ------------------------------------------------------------------ */
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

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(root);
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
      <div className="mx-auto max-w-7xl">
        <p className="kicker text-night-950/90">Réservation · {reservation.tag}</p>

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
                className="booking-cta group relative flex h-52 w-52 items-center justify-center rounded-full bg-night-950 text-rose-400 shadow-2xl shadow-night-950/30 ring-0 ring-night-950/10 transition-[scale,box-shadow] duration-500 hover:scale-105 hover:ring-8 sm:h-60 sm:w-60"
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
