"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "./gsap";

/* Curseur compagnon (souris uniquement) : un point doré qui suit le
   pointeur, grossit sur les liens et affiche une étiquette sur les
   éléments marqués data-cursor="Voir"… Le curseur natif est conservé. */
export default function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const disc = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = root.current;
    const bg = disc.current;
    const text = label.current;
    if (!el || !bg || !text) return;

    const mm = gsap.matchMedia();
    mm.add(MQ.pointer, () => {
      gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0.14 });
      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
      let visible = false;
      let mode = "idle";

      const setMode = (next: "idle" | "link" | "label", value = "") => {
        if (next === mode && next !== "label") return;
        mode = next;
        text.textContent = value;
        gsap.to(el, {
          scale: next === "label" ? 1 : next === "link" ? 0.42 : 0.14,
          duration: 0.5,
          ease: "power3.out",
          overwrite: "auto",
        });
        gsap.to(bg, { opacity: next === "link" ? 0.45 : 1, duration: 0.3 });
        gsap.to(text, { autoAlpha: next === "label" ? 1 : 0, duration: 0.25 });
      };

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        if (!visible) {
          visible = true;
          gsap.set(el, { x: e.clientX, y: e.clientY });
          gsap.to(el, { autoAlpha: 1, duration: 0.3 });
        }
        xTo(e.clientX);
        yTo(e.clientY);
      };
      const onOver = (e: PointerEvent) => {
        const target = e.target instanceof Element ? e.target : null;
        const labelled = target?.closest("[data-cursor]");
        if (labelled) setMode("label", labelled.getAttribute("data-cursor") ?? "");
        else if (target?.closest("a, button, [role='button']")) setMode("link");
        else setMode("idle");
      };
      const onLeave = () => {
        visible = false;
        gsap.to(el, { autoAlpha: 0, duration: 0.3 });
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerover", onOver, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      return () => {
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerover", onOver);
        document.documentElement.removeEventListener("pointerleave", onLeave);
      };
    });
  });

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none invisible fixed left-0 top-0 z-[90] flex h-24 w-24 items-center justify-center opacity-0"
    >
      <span ref={disc} className="absolute inset-0 rounded-full bg-rose-400" />
      <span
        ref={label}
        className="invisible relative text-[0.68rem] font-bold uppercase tracking-[0.2em] text-night-950 opacity-0"
      />
    </div>
  );
}
