"use client";

import { useRef, useState } from "react";
import BallFx, { type FxApi } from "@/components/landing/BallFx";

/* « Lu et approuvé » : une grande case à cocher. Cochée, elle lâche un
   feu d'artifice d'étincelles et une pluie de balles sur la section. */
export default function ApproveCheck() {
  const [checked, setChecked] = useState(false);
  const fx = useRef<FxApi | null>(null);
  const box = useRef<HTMLButtonElement>(null);

  const toggle = () => {
    const next = !checked;
    setChecked(next);
    if (!next || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = box.current!.getBoundingClientRect();
    fx.current?.burst(r.left + r.width / 2, r.top + r.height / 2, 180, 18);
    fx.current?.rain(window.innerWidth < 640 ? 8 : 14);
  };

  return (
    <>
      <BallFx apiRef={fx} className="z-0" />
      <button
        ref={box}
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={toggle}
        className="group relative z-10 mx-auto flex items-center gap-5 rounded-full border border-white/20 bg-white/5 py-3 pl-3 pr-8 text-left backdrop-blur transition-colors hover:border-rose-400"
      >
        <span
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 ${
            checked ? "rotate-[360deg] border-rose-400 bg-rose-500 shadow-[0_0_30px_rgba(234,51,111,0.9)]" : "border-white/40 group-hover:border-rose-300"
          }`}
        >
          <svg viewBox="0 0 24 24" className={`h-7 w-7 text-night-950 transition-all duration-300 ${checked ? "scale-100 opacity-100" : "scale-0 opacity-0"}`} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 13 4 4L19 7" />
          </svg>
        </span>
        <span>
          <span className="display block text-2xl text-white">{checked ? "Bienvenue au club !" : "Lu et approuvé"}</span>
          <span className="block text-xs text-white/60">{checked ? "Il ne reste qu'à vous inscrire" : "Cochez pour signer (symboliquement)"}</span>
        </span>
      </button>
    </>
  );
}
