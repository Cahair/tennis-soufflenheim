"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { GalleryItem } from "@/lib/content-types";

/* Nombre de photos affichées initialement et ajoutées à chaque
   clic sur « Afficher plus » — multiple de 2 et 3 pour remplir
   les colonnes quel que soit l'écran. */
const PAGE_SIZE = 12;

export default function GalleryGrid({
  items,
  withFilter = false,
}: {
  items: GalleryItem[];
  withFilter?: boolean;
}) {
  const categories = useMemo(
    () => ["Tous", ...Array.from(new Set(items.map((i) => i.category)))],
    [items]
  );
  const [category, setCategory] = useState("Tous");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      category === "Tous"
        ? items
        : items.filter((i) => i.category === category),
    [items, category]
  );
  const visible = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount]
  );

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(
    () =>
      setLightbox((v) =>
        v === null ? v : (v - 1 + visible.length) % visible.length
      ),
    [visible.length]
  );
  const next = useCallback(
    () => setLightbox((v) => (v === null ? v : (v + 1) % visible.length)),
    [visible.length]
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
      {withFilter ? (
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCategory(cat);
                setVisibleCount(PAGE_SIZE);
                setLightbox(null);
              }}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                category === cat
                  ? "bg-night-800 text-white shadow-lg shadow-night-800/25"
                  : "border border-night-300 bg-white text-night-800 hover:border-night-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      ) : null}

      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {visible.map((item, i) => (
          <button
            key={item.alt}
            type="button"
            onClick={() => setLightbox(i)}
            className="group relative block w-full overflow-hidden rounded-2xl text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
          >
            <Image
              src={item.src}
              alt={item.alt}
              placeholder={item.src.blurDataURL ? "blur" : "empty"}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-night-950/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="absolute inset-x-0 bottom-0 flex translate-y-2 items-end justify-between gap-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="text-sm font-semibold text-white">
                {item.caption}
              </span>
              <span className="rounded-full bg-rose-500 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-night-950">
                {item.category}
              </span>
            </span>
          </button>
        ))}
      </div>

      {visible.length < filtered.length ? (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="btn btn-night"
          >
            Afficher plus de photos ({filtered.length - visible.length}{" "}
            restantes)
          </button>
        </div>
      ) : null}

      {lightbox !== null && visible[lightbox] ? (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-night-950/95 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={visible[lightbox].caption}
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
              src={visible[lightbox].src}
              alt={visible[lightbox].alt}
              className="max-h-[78vh] w-auto rounded-xl object-contain shadow-2xl"
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
              <p className="text-sm font-semibold">{visible[lightbox].caption}</p>
              <p className="mt-1 text-xs text-white/50">
                {lightbox + 1} / {visible.length}
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
