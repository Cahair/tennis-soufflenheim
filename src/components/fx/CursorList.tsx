"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ImageRef } from "@/lib/content-types";
import { ArrowRight } from "@/components/landing/Arrow";
import { gsap, MQ, useGSAP } from "./gsap";

export type CursorItem = { href: string; label: string; sub?: string; image?: ImageRef; meta?: string };

/* ------------------------------------------------------------------ */
/*  Liste de liens en lettres géantes : au survol, la ligne se remplit */
/*  de rose, le mot glisse, et la photo du lien apparaît en carte     */
/*  inclinée qui colle au curseur (avec inertie et rotation selon la  */
/*  vitesse). Tactile ou mouvement réduit : simple liste.             */
/* ------------------------------------------------------------------ */
export default function CursorList({ items, compact = false }: { items: CursorItem[]; compact?: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.pointer, () => {
        const q = gsap.utils.selector(root);
        const [card] = q(".cl-card") as HTMLElement[];
        const imgs = q(".cl-img") as HTMLElement[];
        gsap.set(card, { scale: 0.6 });
        const xTo = gsap.quickTo(card, "x", { duration: 0.55, ease: "power3.out" });
        const yTo = gsap.quickTo(card, "y", { duration: 0.55, ease: "power3.out" });
        const rTo = gsap.quickTo(card, "rotation", { duration: 0.8, ease: "power3.out" });
        let lastX = 0;
        const onMove = (e: PointerEvent) => {
          const r = root.current!.getBoundingClientRect();
          xTo(e.clientX - r.left);
          yTo(e.clientY - r.top);
          rTo(gsap.utils.clamp(-18, 18, (e.clientX - lastX) * 0.6));
          lastX = e.clientX;
        };
        const rows = q(".cl-row") as HTMLElement[];
        const offs = rows.map((row, i) => {
          const enter = () => {
            gsap.to(card, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" });
            imgs.forEach((img, k) => gsap.to(img, { autoAlpha: k === i ? 1 : 0, scale: k === i ? 1 : 1.2, duration: 0.5 }));
          };
          row.addEventListener("pointerenter", enter);
          return () => row.removeEventListener("pointerenter", enter);
        });
        const leave = () => gsap.to(card, { autoAlpha: 0, scale: 0.6, duration: 0.35 });
        const el = root.current!;
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", leave);
        return () => {
          offs.forEach((off) => off());
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative">
      <ul className="border-t border-white/10">
        {items.map((item) => (
          <li key={item.href} className="border-b border-white/10">
            <Link
              href={item.href}
              className="cl-row group relative flex items-center justify-between gap-6 overflow-hidden py-7 sm:py-9"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-r from-rose-500 to-ultra-500 transition-transform duration-500 ease-[cubic-bezier(.65,0,.35,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100" />
              <span className="relative transition-transform duration-500 group-hover:translate-x-4">
                <span
                  className={`display block leading-[0.9] text-white ${
                    compact ? "text-[clamp(1.6rem,3.6vw,3.2rem)]" : "text-[clamp(2.6rem,8vw,6.5rem)]"
                  }`}
                >
                  {item.label}
                </span>
                {item.sub ? (
                  <span className="mt-2 block text-sm text-white/60 transition-colors group-hover:text-white">{item.sub}</span>
                ) : null}
              </span>
              <span className="relative flex shrink-0 items-center gap-4">
                {item.meta ? (
                  <span className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-rose-300 group-hover:text-night-950 sm:block">
                    {item.meta}
                  </span>
                ) : null}
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/25 text-white transition-all duration-500 group-hover:-rotate-45 group-hover:border-night-950 group-hover:bg-night-950">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Carte photo qui suit le curseur */}
      <div
        aria-hidden="true"
        className="cl-card pointer-events-none invisible absolute left-0 top-0 z-20 -ml-36 -mt-48 hidden h-96 w-72 overflow-hidden rounded-[1.5rem] border-[3px] border-rose-300 opacity-0 shadow-[0_40px_90px_-20px_rgba(234,51,111,0.8)] lg:block"
      >
        {items.map((item) =>
          item.image ? (
            <div key={item.href} className="cl-img absolute inset-0 opacity-0">
              <Image src={item.image} alt="" fill sizes="18rem" className="object-cover" />
            </div>
          ) : (
            <div key={item.href} className="cl-img absolute inset-0 bg-gradient-to-br from-rose-500 to-ultra-600 opacity-0" />
          )
        )}
      </div>
    </div>
  );
}
