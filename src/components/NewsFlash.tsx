"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NewsItem } from "@/lib/content-types";
import FitImage from "./FitImage";
import { ArrowRight } from "./landing/Arrow";
import { gsap, MQ, useGSAP } from "./landing/gsap";
import { getLenis, onIntro } from "./landing/intro";

const STORAGE_PREFIX = "tpcs-flash:";
const DELAY = 1800; // ms après l'arrivée (ou la fin du splash sur l'accueil)

function alreadySeen(slug: string): boolean {
  try {
    return localStorage.getItem(STORAGE_PREFIX + slug) === "1";
  } catch {
    return false;
  }
}

function markSeen(slug: string) {
  try {
    localStorage.setItem(STORAGE_PREFIX + slug, "1");
  } catch {
    /* stockage bloqué : le pop-up reviendra, tant pis */
  }
}

/* ------------------------------------------------------------------ */
/*  Pop-up d'actualité — l'article coché « pop-up » dans l'admin      */
/*  surgit du fond de l'hyperespace (le décor de l'ancienne galerie   */
/*  de l'accueil) : traits de lumière rose → violet, carte au cadre   */
/*  néon qui fonce vers la caméra puis s'arrête, et pivote sous la    */
/*  souris. Affiché une fois par visiteur et par article ; jamais sur */
/*  la page de l'article lui-même. Mouvement réduit : apparition nette.*/
/* ------------------------------------------------------------------ */
export default function NewsFlash({ item }: { item: NewsItem | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const href = item?.slug ? `/actualites/${item.slug}` : "/actualites";
  const onNewsPage = pathname === "/actualites";

  useEffect(() => {
    if (!item || pathname === href || pathname.startsWith("/admin")) return;
    // Sur la page Actualités, l'annonce revient à chaque passage, même déjà vue.
    if (!onNewsPage && alreadySeen(item.slug || item.title)) return;
    let timer: number | undefined;
    const off = onIntro(() => {
      timer = window.setTimeout(() => setOpen(true), DELAY);
    });
    return () => {
      off();
      window.clearTimeout(timer);
    };
    // Une tentative par chargement, plus une à chaque arrivée sur Actualités.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, onNewsPage]);

  const close = useCallback(() => {
    if (item) markSeen(item.slug || item.title);
    setOpen(false);
  }, [item]);

  if (!item || !open) return null;
  return createPortal(<Flash item={item} href={href} onClose={close} />, document.body);
}

function Flash({ item, href, onClose }: { item: NewsItem; href: string; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const leaving = useRef(false);

  // Sortie : la carte file vers la caméra et disparaît (comme les photos
  // de la galerie), puis le décor s'éteint.
  const leave = useCallback(() => {
    if (leaving.current) return;
    leaving.current = true;
    const el = root.current;
    if (!el || !window.matchMedia(MQ.motion).matches) return onClose();
    const q = gsap.utils.selector(el);
    gsap
      .timeline({ onComplete: onClose })
      .to(q(".nf-card"), { z: 900, autoAlpha: 0, duration: 0.55, ease: "power2.in" })
      .to(q(".nf-streaks"), { scale: 2.6, rotate: 25, autoAlpha: 0, duration: 0.6, ease: "power2.in" }, 0)
      .to(q(".nf-backdrop, .nf-grain"), { autoAlpha: 0, duration: 0.4 }, 0.2);
  }, [onClose]);

  // Page figée, focus dans la fenêtre, Échap pour fermer, Tab qui boucle.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") leave();
      if (e.key !== "Tab" || !root.current) return;
      const focusables = root.current.querySelectorAll<HTMLElement>("a[href], button");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenis?.start();
      previous?.focus?.({ preventScroll: true });
    };
  }, [leave]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MQ.motion, () => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(q(".nf-backdrop, .nf-grain"), { autoAlpha: 0, duration: 0.5, ease: "power1.out" })
          .from(q(".nf-streaks"), { scale: 0.5, rotate: -30, autoAlpha: 0, duration: 1.6 }, 0)
          .from(q(".nf-card"), { z: -2600, x: "-8vw", y: "-6vh", rotation: -7, autoAlpha: 0, duration: 1.4 }, 0.1)
          .from(q(".nf-reveal"), { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.07, ease: "power3.out" }, 0.75);

        // Le tunnel continue de tourner lentement derrière la carte.
        gsap.to(q(".nf-streaks-spin"), { rotate: 360, duration: 90, ease: "none", repeat: -1 });
      });

      // Souris : la carte pivote, comme la scène de l'ancienne galerie.
      mm.add(MQ.pointer, () => {
        const [card] = q(".nf-card") as HTMLElement[];
        const el = root.current;
        if (!card || !el) return;
        const rx = gsap.quickTo(card, "rotationX", { duration: 1, ease: "power3.out" });
        const ry = gsap.quickTo(card, "rotationY", { duration: 1, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          rx((e.clientY / window.innerHeight - 0.5) * -8);
          ry((e.clientX / window.innerWidth - 0.5) * 12);
        };
        el.addEventListener("pointermove", onMove);
        return () => el.removeEventListener("pointermove", onMove);
      });
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-labelledby="news-flash-title"
      aria-describedby="news-flash-text"
      className="fixed inset-0 z-[110] overflow-hidden"
    >
      <div className="nf-backdrop absolute inset-0 bg-night-950/90 backdrop-blur-sm" onClick={leave} />
      <div className="brand-glow nf-backdrop pointer-events-none absolute inset-0" />
      {/* Traits de lumière de l'hyperespace, vides au centre */}
      <div
        aria-hidden="true"
        className="nf-streaks pointer-events-none absolute left-1/2 top-1/2 h-[160vmax] w-[160vmax] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="nf-streaks-spin absolute inset-0 bg-[repeating-conic-gradient(from_0deg_at_50%_50%,color-mix(in_srgb,var(--color-rose-400)_32%,transparent)_0deg_0.5deg,transparent_0.5deg_7deg,color-mix(in_srgb,var(--color-ultra-400)_28%,transparent)_7deg_7.4deg,transparent_7.4deg_13deg)] [mask-image:radial-gradient(circle,transparent_9%,#000_22%,transparent_62%)]" />
      </div>
      <div className="nf-grain grain absolute inset-0" />

      {/* Carte : défile si l'écran est trop bas */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-y-auto p-4 [perspective:1100px] sm:p-8">
        <div className="nf-card pointer-events-auto relative my-auto w-full max-w-[52rem] rounded-[1.6rem] bg-[linear-gradient(140deg,var(--color-rose-400),var(--color-ultra-500))] p-[3px] shadow-[0_0_80px_-10px_var(--color-rose-500)] will-change-transform">
          <div className="grid overflow-hidden rounded-[calc(1.6rem-3px)] bg-night-950 sm:grid-cols-[0.85fr_1.15fr]">
            <div className="relative h-44 overflow-hidden sm:h-auto sm:min-h-[26rem]">
              <FitImage image={item.image} alt="" sizes="(min-width: 40rem) 22rem, 100vw" />
              <span className="absolute inset-0 bg-gradient-to-t from-night-950/80 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:via-transparent sm:to-night-950/60" />
              <span className="absolute bottom-4 left-4 rounded-full bg-rose-500 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-night-950">
                {item.category}
              </span>
            </div>

            <div className="flex flex-col justify-center px-6 pb-7 pt-6 sm:px-10 sm:py-12">
              <p className="nf-reveal kicker text-rose-400">À ne pas manquer</p>
              <h2
                id="news-flash-title"
                className="nf-reveal display mt-5 text-[clamp(1.9rem,4.2vw,3rem)] leading-[0.95] text-white"
              >
                {item.title}
              </h2>
              <p id="news-flash-text" className="nf-reveal mt-5 text-[0.95rem] leading-relaxed text-white/75">
                {item.excerpt}
              </p>
              <div className="nf-reveal mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link href={href} onClick={onClose} className="btn btn-rose">
                  Découvrir
                  <ArrowRight />
                </Link>
                <button
                  type="button"
                  onClick={leave}
                  className="text-sm font-semibold text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-400"
                >
                  Plus tard
                </button>
              </div>
            </div>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={leave}
            aria-label="Fermer l'annonce"
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-night-950/70 text-white backdrop-blur transition-colors hover:bg-rose-500 hover:text-night-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
