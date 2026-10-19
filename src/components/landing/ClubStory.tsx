"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { feteClub, terrasseClub } from "@/lib/images";
import type { HomeIntro, Stat } from "@/lib/content-types";
import { ArrowRight } from "./Arrow";
import NightFx from "./NightFx";
import { gsap, MQ, SplitText, useGSAP } from "./gsap";

/* ------------------------------------------------------------------ */
/*  Le club — une grande phrase qui s'allume mot à mot au défilement  */
/*  (chaque mot passe au néon rose avant de blanchir), un « Depuis    */
/*  1979 » géant qui file en fond, deux photos en cartes              */
/*  holographiques inclinables, les points forts et les chiffres clés */
/*  en cartes de verre.                                                */
/* ------------------------------------------------------------------ */
export default function ClubStory({
  intro,
  stats,
}: {
  intro: HomeIntro;
  stats: Stat[];
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(root);

        const [statement] = q(".story-statement");
        const split = SplitText.create(statement, { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.12, color: "#fc6898", textShadow: "0 0 0px rgba(234,51,111,0)" },
          {
            keyframes: {
              opacity: [0.12, 1, 1],
              color: ["#fc6898", "#fc6898", "#ffffff"],
              textShadow: [
                "0 0 0px rgba(234,51,111,0)",
                "0 0 28px rgba(234,51,111,0.95)",
                "0 0 0px rgba(234,51,111,0)",
              ],
            },
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: statement, start: "top 82%", end: "bottom 48%", scrub: true },
          }
        );

        // « Depuis 1979 » géant qui traverse la section au défilement.
        gsap.fromTo(
          q(".story-year"),
          { xPercent: 5 },
          {
            xPercent: -40,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          }
        );

        (q(".story-card") as HTMLElement[]).forEach((card, i) => {
          const photo = card.querySelector(".story-photo");
          const trigger = { trigger: card, start: "top 88%" };
          gsap.from(card, {
            rotate: i ? 16 : -16,
            yPercent: 25,
            scale: 0.85,
            autoAlpha: 0,
            duration: 1.8,
            ease: "expo.out",
            scrollTrigger: trigger,
          });
          gsap.fromTo(
            card.querySelector(".story-sheen"),
            { xPercent: -60 },
            { xPercent: 30, duration: 1.6, delay: 0.6, ease: "power2.inOut", scrollTrigger: trigger }
          );
          gsap.fromTo(
            card.querySelector(".story-photo-img"),
            { yPercent: -7 },
            {
              yPercent: 7,
              ease: "none",
              scrollTrigger: { trigger: photo, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        });

        const [points] = q(".story-points");
        gsap.from(q(".story-rule"), {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.4,
          stagger: 0.1,
          ease: "expo.inOut",
          scrollTrigger: { trigger: points, start: "top 85%" },
        });
        gsap.from(q(".story-point-text"), {
          x: -30,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: points, start: "top 85%" },
        });

        const [statsEl] = q(".story-stats");
        gsap.from(q(".story-stat"), {
          y: 80,
          rotate: (i: number) => (i % 2 ? 8 : -8),
          autoAlpha: 0,
          duration: 1.4,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: { trigger: statsEl, start: "top 88%" },
        });
        gsap.from(q(".story-num"), {
          textContent: 0,
          snap: { textContent: 1 },
          duration: 2.2,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: statsEl, start: "top 88%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="club"
      className="relative scroll-mt-20 overflow-clip bg-night-950 px-4 pb-32 pt-32 text-white sm:px-6 lg:px-8 lg:pb-48 lg:pt-48"
    >
      <NightFx floor />

      {/* « Depuis 1979 » géant, en contour, qui file en fond */}
      <p
        aria-hidden="true"
        className="story-year hero-outline display pointer-events-none absolute left-0 top-[36%] select-none whitespace-nowrap text-[clamp(9rem,26vw,24rem)] leading-none"
      >
        Depuis 1979 ✦ Depuis 1979
      </p>

      <div className="relative mx-auto max-w-6xl text-center">
        <p className="kicker kicker-center text-rose-300">
          Un club de village, une ambiance de famille
        </p>
        <p className="story-statement mt-10 font-display text-[clamp(1.85rem,4.4vw,4rem)] font-light leading-[1.14] text-white lg:mt-14">
          {intro.paragraph}
        </p>
      </div>

      <div className="relative mx-auto mt-28 grid max-w-7xl gap-12 lg:mt-44 lg:grid-cols-12 lg:gap-8">
        <div
          data-tilt
          className="story-card holo-frame relative self-start rounded-[2rem] p-[3px] shadow-[0_40px_90px_-30px_rgba(234,51,111,0.75)] lg:col-span-5 lg:-rotate-3"
        >
          <figure className="story-photo relative aspect-[4/5] overflow-hidden rounded-[calc(2rem-3px)]">
            <div className="story-photo-img absolute inset-x-0 -inset-y-[8%]">
              <Image
                src={terrasseClub}
                alt="Un joueur se détend sur un transat au bord des pistes de padel"
                fill
                placeholder="blur"
                sizes="(max-width: 1024px) 92vw, 40vw"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-rose-600/50 to-transparent" />
            <div className="story-sheen hero-sheen pointer-events-none absolute inset-y-0 -left-full w-[300%]" />
            <div className="nfx-shine" />
          </figure>
        </div>

        <div className="flex flex-col justify-end lg:col-span-6 lg:col-start-7">
          <div
            data-tilt
            className="story-card holo-frame relative rounded-[2rem] p-[3px] shadow-[0_40px_90px_-30px_rgba(138,43,226,0.75)] lg:rotate-2"
          >
            <figure className="story-photo relative aspect-[3/2] overflow-hidden rounded-[calc(2rem-3px)]">
              <div className="story-photo-img absolute inset-x-0 -inset-y-[8%]">
                <Image
                  src={feteClub}
                  alt="Des joueurs du club réunis au bord des pistes de padel"
                  fill
                  placeholder="blur"
                  sizes="(max-width: 1024px) 92vw, 48vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ultra-600/50 to-transparent" />
              <div className="story-sheen hero-sheen pointer-events-none absolute inset-y-0 -left-full w-[300%]" />
              <div className="nfx-shine" />
            </figure>
          </div>

          <ul className="story-points mt-14">
            {intro.points.map((point, i) => (
              <li key={point} className="group relative flex items-baseline gap-6 py-5">
                <span className="story-rule absolute inset-x-0 top-0 h-px bg-gradient-to-r from-rose-400/80 via-ultra-400/40 to-transparent" />
                <span className="story-point-text font-display text-sm text-rose-400 transition-transform duration-500 group-hover:scale-150">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="story-point-text text-base text-white/80 transition-colors duration-300 group-hover:text-white sm:text-lg">
                  {point}
                </span>
              </li>
            ))}
          </ul>

          <Link href="/le-club" className="link-arrow mt-10 self-start text-rose-300 hover:text-white">
            Découvrir notre histoire
            <ArrowRight />
          </Link>
        </div>
      </div>

      <dl className="story-stats relative mx-auto mt-28 grid max-w-7xl grid-cols-2 gap-4 sm:gap-6 lg:mt-44 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="story-stat group relative flex flex-col gap-3 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 pt-8 backdrop-blur-md transition-[border-color,box-shadow,translate] duration-500 hover:-translate-y-2 hover:border-rose-400/60 hover:shadow-[0_30px_70px_-30px_rgba(234,51,111,0.85)] sm:p-8"
          >
            <span className="absolute inset-x-5 top-0 h-[2px] bg-gradient-to-r from-rose-400 to-ultra-500 sm:inset-x-8" />
            <span
              aria-hidden="true"
              className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-500/25 blur-2xl transition-transform duration-700 group-hover:scale-[2.4]"
            />
            <dt className="relative text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/65 sm:text-[0.68rem]">
              {stat.label}
            </dt>
            <dd className="relative order-first font-display text-[clamp(2.8rem,6.5vw,6rem)] font-semibold leading-none">
              <span className="story-num brand-gradient-text">{stat.value}</span>
              <span className="text-rose-400">{stat.suffix}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
