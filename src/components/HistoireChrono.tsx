"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import type { HistoireChapitre } from "@/lib/content-types";

/* ------------------------------------------------------------------ */
/*  Frise chronologique de l'histoire du club : un chapitre par       */
/*  époque, avec un carrousel de photos d'archives et une lightbox    */
/*  commune pour feuilleter toute l'histoire au clavier.              */
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
        className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1"
      >
        {chapitre.photos.map((photo, i) => (
          <button
            key={photo.src.src}
            type="button"
            onClick={() => onOpen(i)}
            className="group relative shrink-0 snap-start overflow-hidden rounded-xl border border-night-200 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
            aria-label={`Agrandir : ${photo.alt}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              placeholder={photo.src.blurDataURL ? "blur" : "empty"}
              sizes="(max-width: 640px) 65vw, 340px"
              className="h-44 w-auto cursor-zoom-in object-cover transition-transform duration-500 group-hover:scale-105 sm:h-56"
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
          className="absolute -left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-night-200 bg-white text-night-800 shadow-lg transition-all hover:bg-night-800 hover:text-white md:flex"
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
          className="absolute -right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-night-200 bg-white text-night-800 shadow-lg transition-all hover:bg-night-800 hover:text-white md:flex"
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

  return (
    <div>
      <div className="space-y-0">
        {chapitres.map((chapitre, i) => (
          <Reveal key={chapitre.period}>
            <article className="relative flex gap-5 pb-14 last:pb-0 sm:gap-7">
              {i < chapitres.length - 1 ? (
                <span className="absolute left-[2.15rem] top-[4.6rem] bottom-0 hidden w-0.5 bg-night-300 sm:block" />
              ) : null}
              <span className="display z-10 hidden h-[4.3rem] w-[4.3rem] shrink-0 items-center justify-center rounded-2xl bg-night-800 px-1 text-center text-sm leading-tight text-rose-400 shadow-lg shadow-night-800/25 sm:flex">
                {chapitre.period}
              </span>
              <div className="min-w-0 flex-1 pt-1">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="display rounded-lg bg-night-800 px-2.5 py-1.5 text-sm text-rose-400 sm:hidden">
                    {chapitre.period}
                  </span>
                  <h3 className="text-lg font-bold text-night-950 sm:text-xl">
                    {chapitre.title}
                  </h3>
                  {chapitre.photos.length > 1 ? (
                    <span className="rounded-full border border-night-300 bg-white px-3 py-1 text-xs font-semibold text-night-800/80">
                      {chapitre.photos.length} photos
                    </span>
                  ) : null}
                </div>
                <div className="mt-3 max-w-3xl space-y-3">
                  {chapitre.paragraphs.map((p) => (
                    <p key={p.slice(0, 40)} className="text-sm leading-relaxed text-night-950/70">
                      {p}
                    </p>
                  ))}
                </div>
                <ChapterCarousel
                  chapitre={chapitre}
                  onOpen={(photoIndex) => setLightbox(offsets[i] + photoIndex)}
                />
              </div>
            </article>
          </Reveal>
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
