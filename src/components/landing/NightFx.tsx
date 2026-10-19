"use client";

import { useId, useRef } from "react";
import BallFx, { type FxApi } from "./BallFx";
import { gsap, MQ, useGSAP } from "./gsap";

/* Balle de padel aux couleurs du logo (rose, couture blanche). */
export function PadelBall({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ffb3d4" />
          <stop offset="45%" stopColor="var(--color-rose-500)" />
          <stop offset="100%" stopColor="var(--color-ultra-600)" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="19" fill={`url(#${id})`} />
      <path d="M7 4.5 C 16 12, 16 28, 7 35.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M33 4.5 C 24 12, 24 28, 33 35.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export type Floater = { left: string; top: string; size: string; depth: number; blur?: boolean };

/* Jeu de balles par défaut, réparti sur toute la hauteur d'une section. */
export const FLOATERS: Floater[] = [
  { left: "4%", top: "18%", size: "2.2rem", depth: -120, blur: true },
  { left: "90%", top: "10%", size: "1.4rem", depth: 160 },
  { left: "78%", top: "46%", size: "2.8rem", depth: -90, blur: true },
  { left: "12%", top: "72%", size: "1.1rem", depth: 200 },
  { left: "52%", top: "88%", size: "1.8rem", depth: -150, blur: true },
  { left: "36%", top: "6%", size: "0.9rem", depth: 110 },
];

/* ------------------------------------------------------------------ */
/*  Décor « soirée padel », décliné du hero pour toutes les sections  */
/*  sombres de l'accueil : halos rose et violet qui respirent, sol de */
/*  piste en perspective, projecteurs qui balaient, balles qui        */
/*  flottent (et filent en parallaxe au défilement), halo qui suit la */
/*  souris, grain. Avec `fx`, un clic dans la section lance une balle */
/*  qui rebondit et les éléments [data-tilt] s'inclinent en 3D.       */
/*                                                                    */
/*  À placer en premier enfant d'une section `relative`. Les bords    */
/*  haut et bas sont fondus : deux sections sombres se raccordent     */
/*  sans couture. Rien ne bouge en mouvement réduit.                  */
/* ------------------------------------------------------------------ */
export default function NightFx({
  floor = false,
  beams = false,
  floaters = FLOATERS,
  glow = "left",
  fx = true,
}: {
  floor?: boolean;
  beams?: boolean;
  floaters?: Floater[];
  /** Côté du halo rose (le violet prend l'autre). */
  glow?: "left" | "right";
  fx?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const fxApi = useRef<FxApi | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MQ.motion, () => {
        const layer = root.current!;
        const section = layer.parentElement!;

        gsap.to(q(".nfx-glow-a"), { xPercent: 14, yPercent: -10, scale: 1.2, duration: 8, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.to(q(".nfx-glow-b"), { xPercent: -12, yPercent: 12, scale: 0.85, duration: 10, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.fromTo(q(".nfx-floor"), { backgroundPositionY: "0px" }, { backgroundPositionY: "80px", duration: 2.4, ease: "none", repeat: -1 });
        gsap.fromTo(q(".nfx-beam-l"), { rotate: -26 }, { rotate: 12, duration: 7, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.fromTo(q(".nfx-beam-r"), { rotate: 24 }, { rotate: -14, duration: 8, ease: "sine.inOut", yoyo: true, repeat: -1 });

        (q(".nfx-floater") as HTMLElement[]).forEach((el) => {
          gsap.to(el, {
            x: "random(-35, 35)",
            y: "random(-45, 45)",
            rotate: "random(-220, 220)",
            duration: "random(3, 6)",
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            repeatRefresh: true,
          });
        });
        // Parallaxe au défilement : chaque balle file à sa vitesse.
        (q("[data-scroll-depth]") as HTMLElement[]).forEach((el) => {
          const depth = Number(el.dataset.scrollDepth);
          gsap.fromTo(
            el,
            { y: -depth },
            { y: depth, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true } }
          );
        });
        // Les balles gonflent en entrant dans l'écran.
        gsap.from(q(".nfx-floater"), {
          scale: 0,
          duration: 1.2,
          stagger: 0.08,
          ease: "back.out(3)",
          scrollTrigger: { trigger: section, start: "top 80%" },
        });

        if (!fx) return;
        const onClick = (e: MouseEvent) => {
          if ((e.target as Element).closest("a, button, input, textarea, select, label, iframe")) return;
          fxApi.current?.ball(e.clientX, e.clientY);
        };
        section.addEventListener("click", onClick);
        return () => section.removeEventListener("click", onClick);
      });

      // Souris : halo qui suit le curseur, cartes [data-tilt] en 3D.
      mm.add(MQ.pointer, () => {
        const layer = root.current!;
        const section = layer.parentElement!;
        const [spot] = q(".nfx-spot") as HTMLElement[];
        const spx = gsap.quickTo(spot, "x", { duration: 0.6, ease: "power3.out" });
        const spy = gsap.quickTo(spot, "y", { duration: 0.6, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          const r = layer.getBoundingClientRect();
          spx(e.clientX - r.left);
          spy(e.clientY - r.top);
        };
        const onEnter = () => gsap.to(spot, { autoAlpha: 1, duration: 0.6 });
        const onLeave = () => gsap.to(spot, { autoAlpha: 0, duration: 0.6 });
        section.addEventListener("pointermove", onMove);
        section.addEventListener("pointerenter", onEnter);
        section.addEventListener("pointerleave", onLeave);

        const offs = fx
          ? Array.from(section.querySelectorAll<HTMLElement>("[data-tilt]")).map((card) => {
              gsap.set(card, { transformPerspective: 900 });
              const rx = gsap.quickTo(card, "rotationX", { duration: 0.8, ease: "power3.out" });
              const ry = gsap.quickTo(card, "rotationY", { duration: 0.8, ease: "power3.out" });
              const shine = card.querySelector<HTMLElement>(".nfx-shine");
              const move = (e: PointerEvent) => {
                const r = card.getBoundingClientRect();
                const nx = (e.clientX - r.left) / r.width - 0.5;
                const ny = (e.clientY - r.top) / r.height - 0.5;
                rx(ny * -12);
                ry(nx * 14);
                if (shine) gsap.to(shine, { "--shine-x": `${(nx + 0.5) * 100}%`, "--shine-y": `${(ny + 0.5) * 100}%`, autoAlpha: 1, duration: 0.4 });
              };
              const leave = () => {
                rx(0);
                ry(0);
                if (shine) gsap.to(shine, { autoAlpha: 0, duration: 0.6 });
              };
              card.addEventListener("pointermove", move);
              card.addEventListener("pointerleave", leave);
              return () => {
                card.removeEventListener("pointermove", move);
                card.removeEventListener("pointerleave", leave);
              };
            })
          : [];

        return () => {
          section.removeEventListener("pointermove", onMove);
          section.removeEventListener("pointerenter", onEnter);
          section.removeEventListener("pointerleave", onLeave);
          offs.forEach((off) => off());
        };
      });
    },
    { scope: root }
  );

  const rose = glow === "left" ? "-left-[20%] top-[-10%]" : "-right-[20%] top-[-10%]";
  const violet = glow === "left" ? "-right-[25%] bottom-[-20%]" : "-left-[25%] bottom-[-20%]";

  return (
    <>
      <div
        ref={root}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_10%,#000_90%,transparent)]"
      >
        <div className={`nfx-glow-a absolute h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle,rgba(234,51,111,0.42)_0%,rgba(234,51,111,0)_62%)] ${rose}`} />
        <div className={`nfx-glow-b absolute h-[75vmax] w-[75vmax] rounded-full bg-[radial-gradient(circle,rgba(138,43,226,0.42)_0%,rgba(138,43,226,0)_62%)] ${violet}`} />

        {beams ? (
          <>
            <div className="hero-beam nfx-beam-l absolute -top-[8%] left-[10%] h-[125%] w-[34vw] origin-top" />
            <div className="hero-beam hero-beam-r nfx-beam-r absolute -top-[8%] right-[6%] h-[125%] w-[30vw] origin-top" />
          </>
        ) : null}

        {floor ? (
          <div className="absolute inset-x-0 bottom-0 h-[50%] [perspective:600px]">
            <div className="hero-floor nfx-floor absolute inset-x-[-50%] bottom-[-20%] top-0 origin-bottom [transform:rotateX(62deg)]" />
          </div>
        ) : null}

        {floaters.map((f, i) => (
          <div
            key={i}
            data-scroll-depth={f.depth}
            className="absolute"
            style={{ left: f.left, top: f.top, width: f.size, height: f.size }}
          >
            <div className={`nfx-floater h-full w-full ${f.blur ? "opacity-70 blur-[2px]" : "opacity-90"}`}>
              <PadelBall className="h-full w-full drop-shadow-[0_8px_20px_rgba(234,51,111,0.55)]" />
            </div>
          </div>
        ))}

        <div className="nfx-spot invisible absolute left-0 top-0 -ml-[22rem] -mt-[22rem] h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(circle,rgba(252,104,152,0.2)_0%,rgba(163,92,255,0.08)_40%,transparent_65%)] mix-blend-screen" />
        <div className="grain absolute inset-0" />
      </div>
      {fx ? <BallFx apiRef={fxApi} className="z-30" /> : null}
    </>
  );
}
