"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import CommitteeIcon from "@/components/CommitteeIcon";
import { PadelBall } from "@/components/landing/NightFx";
import type { CommitteeMember } from "@/lib/content-types";
import { telHref } from "@/lib/format";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* ------------------------------------------------------------------ */
/*  Carte à collectionner d'un bénévole du comité : pellicule         */
/*  holographique irisée qui suit le pointeur (variables CSS), numéro */
/*  de série, « rareté » selon le rôle. Un clic (ou Entrée) retourne  */
/*  la carte : au dos, le rôle, les commissions et le contact.        */
/* ------------------------------------------------------------------ */
export default function TradingCard({
  member,
  index,
  total,
}: {
  member: CommitteeMember;
  index: number;
  total: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const rare = /président/i.test(member.role) && !/vice/i.test(member.role);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.style.setProperty("--rx", `${(0.5 - y) * 16}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 20}deg`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="ix-card group relative aspect-[5/7] w-full [perspective:1200px]"
    >
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={`${member.name}, ${member.role} — retourner la carte`}
        className="ix-card-tilt relative block h-full w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-400"
      >
        <span
          className={`ix-card-inner relative block h-full w-full transition-transform duration-700 ease-[cubic-bezier(.34,1.3,.64,1)] [transform-style:preserve-3d] ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* ---------- Recto ---------- */}
          <span className="holo-frame absolute inset-0 block rounded-[1.4rem] p-[3px] shadow-[0_40px_80px_-30px_rgba(234,51,111,0.85)] [backface-visibility:hidden]">
            <span className="relative flex h-full flex-col overflow-hidden rounded-[calc(1.4rem-3px)] bg-night-900">
              <span className="flex items-center justify-between px-4 pb-2 pt-3 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-rose-200">
                <span>Comité du club</span>
                <span>
                  {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
                </span>
              </span>
              <span className="relative mx-3 block flex-1 overflow-hidden rounded-xl bg-gradient-to-br from-ultra-800 via-night-900 to-rose-900">
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt=""
                    fill
                    placeholder={member.photo.blurDataURL ? "blur" : "empty"}
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full flex-col items-center justify-center gap-3">
                    <span className="display text-7xl text-white [text-shadow:0_0_30px_rgba(234,51,111,0.9)]">
                      {initials(member.name)}
                    </span>
                    <CommitteeIcon icon={member.icon} className="h-7 w-7 text-rose-300" />
                  </span>
                )}
                {rare ? (
                  <span className="absolute right-2 top-2 rounded-full bg-rose-500 px-2.5 py-1 text-[0.55rem] font-black uppercase tracking-[0.18em] text-night-950">
                    ★ Carte rare
                  </span>
                ) : null}
              </span>
              <span className="block px-4 pb-4 pt-3">
                <span className="display block truncate text-2xl leading-tight text-white">{member.name}</span>
                <span className="mt-0.5 block truncate text-xs font-semibold text-rose-300">{member.role}</span>
                <span className="mt-3 flex items-center justify-between text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/60">
                  <span>Bénévole ✦ 100 %</span>
                  <span className="text-rose-200 transition-colors group-hover:text-white">Retourner ↻</span>
                </span>
              </span>
              {/* Pellicule holographique */}
              <span aria-hidden="true" className="ix-foil pointer-events-none absolute inset-0" />
            </span>
          </span>

          {/* ---------- Verso ---------- */}
          <span className="absolute inset-0 block rounded-[1.4rem] bg-gradient-to-br from-rose-500 via-rose-600 to-ultra-600 p-[3px] [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="relative flex h-full flex-col items-center justify-center gap-4 overflow-hidden rounded-[calc(1.4rem-3px)] bg-night-950 p-6 text-center">
              <span className="booking-stripes absolute inset-0 opacity-40" />
              <PadelBall className="relative h-14 w-14 drop-shadow-[0_0_20px_rgba(234,51,111,0.9)]" />
              <span className="display relative text-2xl text-white">{member.name}</span>
              <span className="relative text-sm font-semibold text-rose-300">{member.role}</span>
              {member.commissions?.length ? (
                <span className="relative flex flex-wrap justify-center gap-1.5">
                  {member.commissions.map((c) => (
                    <span key={c} className="rounded-full border border-rose-400/40 px-2.5 py-1 text-[0.62rem] text-rose-100">
                      {c.replace("Commission ", "")}
                    </span>
                  ))}
                </span>
              ) : null}
              {member.contact ? (
                <span className="relative mt-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white">
                  {member.contact}
                </span>
              ) : (
                <span className="relative text-xs text-white/60">Joignable au club house</span>
              )}
            </span>
          </span>
        </span>
      </button>
      {/* Lien d'appel hors du bouton (pas d'élément interactif imbriqué) */}
      {member.contact && flipped ? (
        <a
          href={telHref(member.contact)}
          className="absolute inset-x-6 bottom-6 z-10 rounded-full bg-rose-500 py-2 text-center text-xs font-bold uppercase tracking-[0.16em] text-night-950"
        >
          Appeler
        </a>
      ) : null}
    </div>
  );
}
