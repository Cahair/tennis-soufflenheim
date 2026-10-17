"use client";

import { useState } from "react";

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
            className={`overflow-hidden rounded-2xl border bg-white transition-colors ${
              open ? "border-rose-400 shadow-lg shadow-rose-500/10" : "border-night-200"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
            >
              <span className="font-semibold text-night-950">{item.q}</span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                  open
                    ? "rotate-180 bg-rose-500 text-night-950"
                    : "bg-night-100 text-night-700"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="whitespace-pre-line px-5 pb-5 text-sm leading-relaxed text-night-950/70 sm:px-6 sm:text-base">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
