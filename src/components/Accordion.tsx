"use client";

import { useState } from "react";
import { PadelBall } from "@/components/landing/NightFx";

/* Questions/réponses sur fond de nuit : la question ouverte prend un
   cadre holographique, la balle roule pour ouvrir ou fermer, le
   numéro passe au néon. */
export default function Accordion({
  items,
  defaultOpen = 0,
}: {
  items: { q: string; a: string }[];
  defaultOpen?: number | null;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div
            key={item.q}
            className={`rounded-[1.4rem] p-px transition-shadow duration-500 ${
              open ? "holo-frame shadow-[0_30px_70px_-30px_rgba(234,51,111,0.8)]" : "bg-white/10 hover:bg-rose-400/40"
            }`}
          >
            <div className="overflow-hidden rounded-[calc(1.4rem-1px)] bg-night-950/95 backdrop-blur">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
                className="group flex w-full items-center gap-4 px-5 py-4 text-left sm:gap-6 sm:px-6 sm:py-5"
              >
                <span
                  aria-hidden="true"
                  className={`display w-8 shrink-0 text-lg transition-all duration-500 ${
                    open ? "hero-neon text-rose-400" : "text-white/30 group-hover:text-rose-300"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-semibold text-white">{item.q}</span>
                <span
                  aria-hidden="true"
                  className={`h-8 w-8 shrink-0 transition-transform duration-700 ease-[cubic-bezier(.34,1.56,.64,1)] ${
                    open ? "rotate-[540deg] scale-110" : "group-hover:rotate-90"
                  }`}
                >
                  <PadelBall className={`h-full w-full transition-[filter] ${open ? "drop-shadow-[0_0_12px_rgba(234,51,111,0.9)]" : "opacity-70 grayscale-[60%]"}`} />
                </span>
              </button>
              <div
                className={`grid transition-all duration-500 ease-out ${
                  open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="whitespace-pre-line px-5 pb-6 text-sm leading-relaxed text-white/70 sm:pl-[5.5rem] sm:pr-8 sm:text-base">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
