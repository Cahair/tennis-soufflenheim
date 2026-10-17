"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ClubEvent, NewsItem } from "@/lib/content-types";
import { isoFromFrenchDate } from "@/lib/format";
import { ArrowRight } from "./Arrow";
import { gsap, MQ, SplitText, useGSAP } from "./gsap";

/* ------------------------------------------------------------------ */
/*  La vie du club — actualités en lignes épurées (au survol, la      */
/*  photo de l'article suit le pointeur) et agenda en quatre colonnes.*/
/* ------------------------------------------------------------------ */
export default function ClubLife({
  news,
  events,
}: {
  news: NewsItem[];
  events: ClubEvent[];
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MQ.motion, () => {
        const [title] = q(".life-title");
        const split = SplitText.create(title, { type: "words", mask: "words" });
        gsap.from(split.words, {
          yPercent: 115,
          duration: 1.3,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: title, start: "top 82%" },
        });

        (q(".life-list") as HTMLElement[]).forEach((list) => {
          gsap.from(list.querySelectorAll(".life-rule"), {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.4,
            stagger: 0.1,
            ease: "expo.inOut",
            scrollTrigger: { trigger: list, start: "top 85%" },
          });
          gsap.from(list.querySelectorAll(".life-item"), {
            y: 30,
            autoAlpha: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: list, start: "top 85%" },
          });
        });
      });

      mm.add(`${MQ.pointer} and (min-width: 64rem)`, () => {
        const [preview] = q(".life-preview") as HTMLElement[];
        const [list] = q(".life-news") as HTMLElement[];
        const images = q(".life-preview-img") as HTMLElement[];
        const rows = q(".life-row") as HTMLElement[];
        if (!preview || !list) return;

        gsap.set(preview, { xPercent: -50, yPercent: -50, scale: 0.4 });
        const xTo = gsap.quickTo(preview, "x", { duration: 0.6, ease: "power3" });
        const yTo = gsap.quickTo(preview, "y", { duration: 0.6, ease: "power3" });
        const rTo = gsap.quickTo(preview, "rotation", { duration: 0.8, ease: "power3" });
        let lastX = 0;
        let settle: gsap.core.Tween | null = null;

        const onMove = (e: PointerEvent) => {
          xTo(e.clientX);
          yTo(e.clientY);
          rTo(gsap.utils.clamp(-10, 10, (e.clientX - lastX) * 0.5));
          lastX = e.clientX;
          settle?.kill();
          settle = gsap.delayedCall(0.12, () => rTo(0));
        };
        const show = (index: number) => {
          images.forEach((img, k) =>
            gsap.to(img, {
              autoAlpha: k === index ? 1 : 0,
              scale: k === index ? 1 : 1.15,
              duration: 0.55,
              ease: "power3.out",
              overwrite: true,
            })
          );
          gsap.to(preview, { scale: 1, autoAlpha: 1, duration: 0.5, ease: "power3.out", overwrite: "auto" });
        };
        const hide = () => {
          gsap.to(preview, { scale: 0.4, autoAlpha: 0, duration: 0.4, ease: "power3.in", overwrite: "auto" });
        };

        const enters = rows.map((row, i) => {
          const onEnter = (e: PointerEvent) => {
            if (!lastX) {
              gsap.set(preview, { x: e.clientX, y: e.clientY });
              lastX = e.clientX;
            }
            show(i);
          };
          row.addEventListener("pointerenter", onEnter);
          return onEnter;
        });
        list.addEventListener("pointermove", onMove);
        list.addEventListener("pointerleave", hide);
        return () => {
          rows.forEach((row, i) => row.removeEventListener("pointerenter", enters[i]));
          list.removeEventListener("pointermove", onMove);
          list.removeEventListener("pointerleave", hide);
        };
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="actualites"
      className="scroll-mt-20 bg-night-50 px-4 py-32 sm:px-6 lg:px-8 lg:py-48"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 className="life-title display text-[clamp(3.2rem,9vw,8.5rem)] leading-[0.88] text-night-950">
            La vie
            <br />
            du club
          </h2>
          <Link href="/actualites" className="link-arrow shrink-0 self-start text-night-900 md:self-auto">
            Toutes les actualités
            <ArrowRight />
          </Link>
        </div>

        {/* Actualités */}
        <div className="life-list life-news mt-16 lg:mt-24">
          <ul>
            {news.map((item) => (
              <li key={item.slug} className="life-row relative">
                <span className="life-rule absolute inset-x-0 top-0 h-px bg-night-950/15" />
                <Link
                  href={item.slug ? `/actualites/${item.slug}` : "/actualites"}
                  data-cursor="Lire"
                  className="life-item group grid grid-cols-[4.5rem_1fr] items-center gap-5 py-7 sm:grid-cols-[9rem_1fr_auto] sm:gap-8 lg:py-10"
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl sm:hidden">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      placeholder={item.image.blurDataURL ? "blur" : "empty"}
                      sizes="4.5rem"
                      className="object-cover"
                    />
                  </div>
                  <time dateTime={isoFromFrenchDate(item.date)} className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-rose-600 sm:block">
                    {item.date}
                  </time>
                  <div>
                    <time dateTime={isoFromFrenchDate(item.date)} className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-rose-600 sm:hidden">
                      {item.date}
                    </time>
                    <h3 className="font-display text-[1.45rem] font-light leading-tight text-night-950 transition-[translate] duration-500 group-hover:translate-x-3 sm:text-3xl lg:text-[2.6rem]">
                      {item.title}
                    </h3>
                  </div>
                  <span className="hidden rounded-full border border-night-950/20 px-3.5 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-night-950/70 transition-colors duration-300 group-hover:border-night-950 group-hover:bg-night-950 group-hover:text-night-50 sm:inline-flex">
                    {item.category}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <span className="life-rule block h-px bg-night-950/15" />
        </div>

        {/* Aperçu flottant (grand écran, souris) */}
        <div
          aria-hidden="true"
          className="life-preview pointer-events-none invisible fixed left-0 top-0 z-40 hidden aspect-[4/5] w-60 overflow-hidden rounded-2xl opacity-0 shadow-2xl shadow-night-950/30 lg:block"
        >
          {news.map((item) => (
            <div key={item.slug} className="life-preview-img absolute inset-0 opacity-0">
              <Image src={item.image} alt="" fill sizes="15rem" className="object-cover" />
            </div>
          ))}
        </div>

        {/* Agenda */}
        <div className="mt-28 lg:mt-40">
          <div className="flex items-end justify-between gap-6">
            <p className="kicker text-rose-600">Agenda</p>
            <Link href="/calendrier" className="link-arrow text-sm text-night-900">
              Tout le calendrier
              <ArrowRight />
            </Link>
          </div>
          <ol className="life-list mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {events.map((event) => (
              <li key={`${event.day}-${event.month}-${event.title}`} className="relative pt-6">
                <span className="life-rule absolute inset-x-0 top-0 h-px bg-night-950/15" />
                <div className="life-item">
                  <p className="flex items-baseline gap-3">
                    <span className="font-display text-7xl font-light leading-none text-night-950">
                      {event.day}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
                      {event.month}
                    </span>
                  </p>
                  <p className="mt-5 text-lg font-semibold leading-snug text-night-950">
                    {event.title}
                  </p>
                  <p className="mt-1.5 text-sm text-night-950/60">{event.meta}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
