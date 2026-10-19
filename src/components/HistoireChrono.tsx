"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { PadelBall } from "@/components/landing/NightFx";
import { gsap, MQ, useGSAP } from "@/components/fx/gsap";
import type { HistoireChapitre } from "@/lib/content-types";

/* ------------------------------------------------------------------ */
/*  Frise chronologique de l'histoire du club : un chapitre par       */
/*  époque, avec un carrousel de photos d'archives et une lightbox    */
/*  commune pour feuilleter toute l'histoire au clavier. Version     */
/*  nuit : la ligne du temps se remplit de néon au défilement, une    */
/*  balle roule à sa pointe, chaque époque s'allume à son passage et  */
/*  les photos arrivent en polaroïds de travers.                      */
/* ------------------------------------------------------------------ */

function ChapterCarousel({
  chapitre,
  onOpen,
}: {
  chapitre: HistoireChapitre;
  onOpen: (index: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateArrows]);

  const scroll = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: "smooth" });
  };

  return (
    <div className="group/strip relative mt-6">
      <div
        ref={trackRef}
        onScroll={updateArrows}
        className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 py-5"
      >
        {chapitre.photos.map((photo, i) => (
          <button
            key={photo.src.src}
            type="button"
            onClick={() => onOpen(i)}
            className="hc-photo group relative shrink-0 snap-start overflow-hidden rounded-md bg-white p-1.5 pb-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] transition-transform duration-500 odd:rotate-[-2deg] even:rotate-[2deg] hover:z-10 hover:rotate-0 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
            aria-label={`Agrandir : ${photo.alt}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              placeholder={photo.src.blurDataURL ? "blur" : "empty"}
              sizes="(max-width: 640px) 65vw, 340px"
              className="h-44 w-auto cursor-zoom-in object-cover sm:h-56"
            />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night-950/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="pointer-events-none absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-night-900 opacity-0 shadow transition-opacity duration-300 group-hover:opacity-100">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.35-4.35M11 8v6M8 11h6" />
              </svg>
            </span>
          </button>
        ))}
      </div>

      {canPrev ? (
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="Photos précédentes"
          className="absolute -left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-rose-400/50 bg-night-950/90 text-white shadow-[0_0_25px_rgba(234,51,111,0.5)] backdrop-blur transition-all hover:bg-rose-500 hover:text-night-950 md:flex"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      ) : null}
      {canNext ? (
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="Photos suivantes"
          className="absolute -right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-rose-400/50 bg-night-950/90 text-white shadow-[0_0_25px_rgba(234,51,111,0.5)] backdrop-blur transition-all hover:bg-rose-500 hover:text-night-950 md:flex"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 6 6 6-6 6" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}

export default function HistoireChrono({
  chapitres,
}: {
  chapitres: HistoireChapitre[];
}) {
  /* Toutes les photos à plat, pour naviguer dans la lightbox
     d'un bout à l'autre de l'histoire. */
  const flat = useMemo(
    () =>
      chapitres.flatMap((c) =>
        c.photos.map((photo) => ({ ...photo, period: c.period }))
      ),
    [chapitres]
  );
  const offsets = useMemo(() => {
    const out: number[] = [];
    let acc = 0;
    for (const c of chapitres) {
      out.push(acc);
      acc += c.photos.length;
    }
    return out;
  }, [chapitres]);

  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(
    () =>
      setLightbox((v) => (v === null ? v : (v - 1 + flat.length) % flat.length)),
    [flat.length]
  );
  const next = useCallback(
    () => setLightbox((v) => (v === null ? v : (v + 1) % flat.length)),
    [flat.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, close, prev, next]);

  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(root);
        const line = { trigger: q(".hc-track")[0], start: "top 60%", end: "bottom 60%", scrub: 0.5 };
        gsap.fromTo(q(".hc-fill"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: line });
        gsap.fromTo(q(".hc-ball"), { top: "0%", rotate: 0 }, { top: "100%", rotate: 1080, ease: "none", scrollTrigger: { ...line } });
        (q(".hc-chapter") as HTMLElement[]).forEach((ch) => {
          const trigger = { trigger: ch, start: "top 62%", toggleActions: "play none none reverse" };
          gsap.fromTo(
            ch.querySelector(".hc-period"),
            { color: "rgba(255,255,255,0.25)", textShadow: "0 0 0 rgba(234,51,111,0)", scale: 0.85 },
            { color: "#fc6898", textShadow: "0 0 30px rgba(234,51,111,0.9)", scale: 1, duration: 0.6, ease: "back.out(2)", scrollTrigger: trigger }
          );
          gsap.from(ch.querySelectorAll(".hc-fade"), { x: 40, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: ch, start: "top 80%" } });
          gsap.from(ch.querySelectorAll(".hc-photo"), { y: 80, rotate: () => gsap.utils.random(-25, 25), autoAlpha: 0, duration: 1, stagger: 0.07, ease: "back.out(1.5)", scrollTrigger: { trigger: ch, start: "top 70%" } });
        });
      });
    },
    { scope: root }
  );

  return (
    <div ref={root}>
      <div className="hc-track relative">
        {/* Ligne du temps : fond, remplissage néon et balle qui roule */}
        <div aria-hidden="true" className="absolute bottom-0 left-[0.9rem] top-0 w-[3px] rounded-full bg-white/10 sm:left-[2.4rem]">
          <div className="hc-fill absolute inset-0 origin-top rounded-full bg-gradient-to-b from-rose-400 via-rose-500 to-ultra-500 shadow-[0_0_18px_rgba(234,51,111,0.9)]" />
          <div className="hc-ball absolute left-1/2 top-0 -ml-3.5 -mt-3.5 h-7 w-7">
            <PadelBall className="h-full w-full drop-shadow-[0_0_14px_rgba(234,51,111,0.9)]" />
          </div>
        </div>
        {chapitres.map((chapitre, i) => (
          <article key={chapitre.period} className="hc-chapter relative pb-24 pl-10 last:pb-0 sm:pl-24">
            <span aria-hidden="true" className="absolute left-[0.45rem] top-3 h-4 w-4 rounded-full border-2 border-rose-400 bg-night-950 sm:left-[1.95rem]" />
            <p className="hc-period display origin-left text-[clamp(2.8rem,7vw,5.5rem)] leading-none text-white/25">
              {chapitre.period}
            </p>
            <div className="hc-fade mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <h3 className="display text-2xl text-white sm:text-3xl">{chapitre.title}</h3>
              {chapitre.photos.length > 1 ? (
                <span className="rounded-full border border-rose-400/40 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-200">
                  {chapitre.photos.length} photos
                </span>
              ) : null}
            </div>
            <div className="mt-4 max-w-3xl space-y-3">
              {chapitre.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="hc-fade text-base leading-relaxed text-white/70">
                  {p}
                </p>
              ))}
            </div>
            <ChapterCarousel
              chapitre={chapitre}
              onOpen={(photoIndex) => setLightbox(offsets[i] + photoIndex)}
            />
          </article>
        ))}
      </div>

      {lightbox !== null && flat[lightbox] ? (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-night-950/95 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={flat[lightbox].alt}
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Fermer"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <div
            className="flex max-h-[82vh] items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={flat[lightbox].src}
              alt={flat[lightbox].alt}
              className="max-h-[74vh] w-auto rounded-xl object-contain shadow-2xl"
            />
          </div>

          <div
            className="mt-5 flex items-center gap-6 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={prev}
              aria-label="Photo précédente"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <div className="text-center">
              <p className="text-sm font-semibold">{flat[lightbox].period}</p>
              <p className="mt-1 text-xs text-white/50">
                {lightbox + 1} / {flat.length}
              </p>
            </div>
            <button
              type="button"
              onClick={next}
              aria-label="Photo suivante"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
