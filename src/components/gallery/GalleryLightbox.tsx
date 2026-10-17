"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { GalleryItem } from "@/lib/content-types";

/* Lightbox haute définition de la sphère : l'image pleine taille n'est
   montée (donc chargée) qu'à l'ouverture. Portalée sur document.body
   pour échapper à tout ancêtre transformé (position: fixed). */
export default function GalleryLightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => previous?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onPrev, onNext]);

  const item = items[index];
  if (!item) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-night-950/95 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={item.caption}
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
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
          src={item.src}
          alt={item.alt}
          placeholder={item.src.blurDataURL ? "blur" : "empty"}
          className="max-h-[78vh] w-auto rounded-xl object-contain shadow-2xl"
        />
      </div>

      <div
        className="mt-5 flex items-center gap-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onPrev}
          aria-label="Photo précédente"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white/10"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold">{item.caption}</p>
          <p className="mt-1 text-xs text-white/50">
            {index + 1} / {items.length}
          </p>
        </div>
        <button
          type="button"
          onClick={onNext}
          aria-label="Photo suivante"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white/10"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 6 6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>,
    document.body
  );
}
