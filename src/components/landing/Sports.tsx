"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Discipline } from "@/lib/content-types";
import { ArrowRight, ArrowUpRight } from "./Arrow";
import { gsap, MQ, SplitText, useGSAP } from "./gsap";
import { getLenis } from "./intro";

/* ------------------------------------------------------------------ */
/*  Nos sports — sur grand écran, la section s'épingle et les trois   */
/*  disciplines défilent à l'horizontale (parallaxe dans les photos). */
/*  Sur mobile, simple pile verticale avec dévoilements.              */
/* ------------------------------------------------------------------ */
export default function Sports({ disciplines }: { disciplines: Discipline[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MQ.motion, () => {
        const [title] = q(".sports-title");
        const split = SplitText.create(title, { type: "words", mask: "words" });
        gsap.from(split.words, {
          yPercent: 115,
          duration: 1.3,
          stagger: 0.07,
          ease: "expo.out",
          scrollTrigger: { trigger: title, start: "top 80%" },
        });
      });

      mm.add(MQ.desktop, () => {
        const section = root.current;
        const [track] = q(".sports-track") as HTMLElement[];
        if (!section || !track) return;
        const distance = () => Math.max(track.scrollWidth - window.innerWidth, 0);

        const scroller = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.fromTo(
          q(".sports-progress"),
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${distance()}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );

        (q(".sport-panel") as HTMLElement[]).forEach((panel) => {
          const along = {
            trigger: panel,
            containerAnimation: scroller,
            start: "left right",
            end: "right left",
            scrub: true,
          };
          gsap.fromTo(
            panel.querySelector(".sport-img"),
            { xPercent: -9 },
            { xPercent: 9, ease: "none", scrollTrigger: along }
          );
          gsap.fromTo(
            panel.querySelector(".sport-name"),
            { xPercent: 22 },
            { xPercent: -10, ease: "none", scrollTrigger: { ...along } }
          );
          gsap.fromTo(
            panel.querySelector(".sport-media"),
            { clipPath: "inset(14% 14% 14% 14% round 2rem)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 2rem)",
              ease: "none",
              scrollTrigger: { ...along, end: "center 60%" },
            }
          );
        });

        /* Clavier : un lien de panneau hors champ ramène le défilement
           vertical à la hauteur qui affiche ce panneau. */
        const onFocus = (e: FocusEvent) => {
          const panel = (e.target as Element | null)?.closest?.(".sport-panel");
          const st = scroller.scrollTrigger;
          if (!(panel instanceof HTMLElement) || !st || distance() === 0) return;
          const ratio = gsap.utils.clamp(0, 1, (panel.offsetLeft - window.innerWidth * 0.08) / distance());
          const y = st.start + (st.end - st.start) * ratio;
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(y, { immediate: true });
          else window.scrollTo(0, y);
        };
        section.addEventListener("focusin", onFocus);
        return () => section.removeEventListener("focusin", onFocus);
      });

      mm.add(MQ.mobile, () => {
        (q(".sport-panel") as HTMLElement[]).forEach((panel) => {
          gsap.fromTo(
            panel.querySelector(".sport-media"),
            { clipPath: "inset(100% 0% 0% 0% round 1.5rem)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 1.5rem)",
              duration: 1.5,
              ease: "expo.out",
              scrollTrigger: { trigger: panel, start: "top 85%" },
            }
          );
          gsap.from(panel.querySelectorAll(".sport-fade"), {
            y: 28,
            autoAlpha: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: panel.querySelector(".sport-body"), start: "top 85%" },
          });
        });
      });
    },
    { scope: root }
  );

  const total = String(disciplines.length).padStart(2, "0");

  return (
    <section
      ref={root}
      id="disciplines"
      /* Défilement horizontal réservé à motion-safe : en mouvement réduit,
         les disciplines s'empilent (sinon, hors champ et inaccessibles). */
      className="relative scroll-mt-20 bg-cream-50 pb-28 lg:motion-safe:h-[100svh] lg:motion-safe:overflow-clip lg:motion-safe:pb-0"
    >
      <div className="sports-track flex flex-col gap-24 px-4 sm:px-6 lg:mx-auto lg:max-w-7xl lg:px-8 lg:motion-safe:mx-0 lg:motion-safe:h-full lg:motion-safe:w-max lg:motion-safe:max-w-none lg:motion-safe:flex-row lg:motion-safe:items-center lg:motion-safe:gap-[7vw] lg:motion-safe:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:motion-safe:pr-[10vw]">
        <header className="lg:w-[30rem] lg:shrink-0">
          <p className="kicker text-clay-500">Nos sports</p>
          <h2 className="sports-title display mt-6 text-[clamp(2.8rem,4.4vw,4.4rem)] text-pine-950">
            Trois façons de faire vibrer la raquette
          </h2>
          <p className="mt-10 hidden items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-pine-950/45 lg:motion-safe:flex">
            Continuez de défiler
            <ArrowRight />
          </p>
        </header>

        {disciplines.map((d, i) => {
          const external = d.cta.href.startsWith("http");
          return (
            <article
              key={d.name}
              className="sport-panel flex flex-col gap-8 lg:w-[min(66rem,78vw)] lg:shrink-0 lg:flex-row lg:items-center lg:gap-14"
            >
              <div className="sport-media relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] bg-pine-100 lg:h-[66svh] lg:w-auto lg:shrink-0 lg:rounded-[2rem]">
                <div className="sport-img absolute inset-y-0 -inset-x-[14%]">
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    placeholder={d.image.blurDataURL ? "blur" : "empty"}
                    sizes="(max-width: 1024px) 92vw, 40vw"
                    className="object-cover"
                  />
                </div>
                <span className="absolute left-5 top-5 rounded-full bg-cream-50/90 px-3.5 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-pine-950 backdrop-blur">
                  {d.badge}
                </span>
              </div>

              <div className="sport-body lg:max-w-[26rem]">
                <p className="sport-fade font-display text-sm tracking-widest text-clay-500">
                  {String(i + 1).padStart(2, "0")} / {total}
                </p>
                <h3 className="sport-name sport-fade display mt-3 text-[clamp(3.6rem,9vw,8.5rem)] leading-[0.85] text-pine-950">
                  {d.name}
                </h3>
                <p className="sport-fade mt-6 text-base leading-relaxed text-pine-950/70 lg:text-lg">
                  {d.description}
                </p>
                {d.features.length > 0 ? (
                  <ul className="sport-fade mt-6 flex flex-wrap gap-2">
                    {d.features.map((f) => (
                      <li
                        key={f}
                        className="rounded-full border border-pine-950/15 px-3.5 py-1.5 text-xs text-pine-950/70"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <Link
                  href={d.cta.href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="sport-fade link-arrow mt-8 text-pine-900"
                >
                  {d.cta.label}
                  {external ? <ArrowUpRight /> : <ArrowRight />}
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-10 hidden px-8 lg:motion-safe:block">
        <div className="mx-auto h-px max-w-7xl bg-pine-950/10">
          <div className="sports-progress h-full origin-left bg-pine-950" />
        </div>
      </div>
    </section>
  );
}
