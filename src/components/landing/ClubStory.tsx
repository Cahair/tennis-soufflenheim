"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { feteClub, terrasseClub } from "@/lib/images";
import type { HomeIntro, Stat } from "@/lib/content-types";
import { ArrowRight } from "./Arrow";
import { gsap, MQ, SplitText, useGSAP } from "./gsap";

/* ------------------------------------------------------------------ */
/*  Le club — une grande phrase qui s'allume mot à mot au défilement, */
/*  deux photos en parallaxe, les points forts et les chiffres clés.  */
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
          { opacity: 0.13 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: statement, start: "top 82%", end: "bottom 48%", scrub: true },
          }
        );

        (q(".story-photo") as HTMLElement[]).forEach((photo) => {
          gsap.fromTo(
            photo,
            { clipPath: "inset(100% 0% 0% 0% round 2rem)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 2rem)",
              duration: 1.6,
              ease: "expo.out",
              scrollTrigger: { trigger: photo, start: "top 88%" },
            }
          );
          gsap.fromTo(
            photo.querySelector(".story-photo-img"),
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
          y: 24,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: points, start: "top 85%" },
        });

        const [statsEl] = q(".story-stats");
        gsap.from(q(".story-stat-rule"), {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.4,
          stagger: 0.12,
          ease: "expo.inOut",
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
      className="scroll-mt-20 bg-cream-50 px-4 pb-32 pt-32 sm:px-6 lg:px-8 lg:pb-48 lg:pt-48"
    >
      <div className="mx-auto max-w-6xl text-center">
        <p className="kicker kicker-center text-clay-500">
          Un club de village, une ambiance de famille
        </p>
        <p className="story-statement mt-10 font-display text-[clamp(1.85rem,4.4vw,4rem)] font-light leading-[1.14] text-pine-950 lg:mt-14">
          {intro.paragraph}
        </p>
      </div>

      <div className="mx-auto mt-28 grid max-w-7xl gap-12 lg:mt-44 lg:grid-cols-12 lg:gap-8">
        <figure className="story-photo relative aspect-[4/5] overflow-hidden rounded-[2rem] lg:col-span-5">
          <div className="story-photo-img absolute inset-x-0 -inset-y-[8%]">
            <Image
              src={terrasseClub}
              alt="La terrasse fleurie du club house, face à la piste de padel"
              fill
              placeholder="blur"
              sizes="(max-width: 1024px) 92vw, 40vw"
              className="object-cover"
            />
          </div>
        </figure>

        <div className="flex flex-col justify-end lg:col-span-6 lg:col-start-7">
          <figure className="story-photo relative aspect-[3/2] overflow-hidden rounded-[2rem]">
            <div className="story-photo-img absolute inset-x-0 -inset-y-[8%]">
              <Image
                src={feteClub}
                alt="La fête du club sur l'espace vert"
                fill
                placeholder="blur"
                sizes="(max-width: 1024px) 92vw, 48vw"
                className="object-cover"
              />
            </div>
          </figure>

          <ul className="story-points mt-14">
            {intro.points.map((point, i) => (
              <li key={point} className="relative flex items-baseline gap-6 py-5">
                <span className="story-rule absolute inset-x-0 top-0 h-px bg-pine-950/15" />
                <span className="story-point-text font-display text-sm text-clay-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="story-point-text text-base text-pine-950/80 sm:text-lg">
                  {point}
                </span>
              </li>
            ))}
          </ul>

          <Link href="/le-club" className="link-arrow mt-10 self-start text-pine-900">
            Découvrir notre histoire
            <ArrowRight />
          </Link>
        </div>
      </div>

      <dl className="story-stats mx-auto mt-28 grid max-w-7xl grid-cols-2 gap-x-6 gap-y-14 lg:mt-44 lg:grid-cols-4 lg:gap-x-8">
        {stats.map((stat) => (
          <div key={stat.label} className="relative flex flex-col gap-3 pt-6">
            <span className="story-stat-rule absolute inset-x-0 top-0 h-px bg-pine-950/15" />
            <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-pine-950/55">
              {stat.label}
            </dt>
            <dd className="order-first font-display text-[clamp(3.4rem,7.5vw,6.8rem)] font-light leading-none text-pine-950">
              <span className="story-num">{stat.value}</span>
              <span className="text-gold-500">{stat.suffix}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
