"use client";

import { useActionState, useRef } from "react";
import BallFx, { type FxApi } from "@/components/landing/BallFx";
import { submitContact, type ContactState } from "@/lib/contact-actions";

const inputClass =
  "w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-all focus:border-rose-400 focus:bg-white/[0.07] focus:shadow-[0_0_30px_-5px_rgba(234,51,111,0.6)] [&>option]:bg-night-900";

export default function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(
    submitContact,
    {}
  );
  const fx = useRef<FxApi | null>(null);

  /* Envoi : le bouton « smashe » le message (gerbe d'étincelles et
     balle lancée vers le haut), hors mouvement réduit. */
  const smash = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const form = e.currentTarget.form;
    if (form && !form.checkValidity()) return;
    const r = e.currentTarget.getBoundingClientRect();
    fx.current?.burst(r.left + r.width / 2, r.top + r.height / 2, 90, 14);
    fx.current?.ball(r.left + r.width / 2, r.top, 6, -22);
  };

  if (state.ok) {
    return (
      <div className="holo-frame flex h-full min-h-96 rounded-[2rem] p-[2px] shadow-[0_40px_90px_-30px_rgba(234,51,111,0.8)]">
      <div className="flex w-full flex-col items-center justify-center rounded-[calc(2rem-2px)] bg-night-950 p-10 text-center">
        <span className="flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-rose-500 text-night-950 shadow-[0_0_40px_rgba(234,51,111,0.8)]">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 13 4 4L19 7" />
          </svg>
        </span>
        <h3 className="display mt-6 text-4xl text-white">Balle de match&nbsp;!</h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
          Message envoyé&nbsp;: merci, nous revenons vers vous très vite.
        </p>
      </div>
      </div>
    );
  }

  return (
    <form
      action={action}
      className="relative rounded-[2rem] border border-white/10 bg-night-950/80 p-6 text-white shadow-[0_40px_90px_-40px_rgba(138,43,226,0.8)] backdrop-blur-md sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold">
            Nom
          </label>
          <input id="name" name="name" required placeholder="Votre nom" className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="vous@exemple.fr"
            className={inputClass}
          />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="subject" className="mb-1.5 block text-sm font-semibold">
          Sujet
        </label>
        <select id="subject" name="subject" className={inputClass} defaultValue="Adhésion & tarifs">
          <option>Adhésion & tarifs</option>
          <option>École de tennis</option>
          <option>Réservation padel</option>
          <option>Découverte pickleball</option>
          <option>Partenariat / sponsoring</option>
          <option>Autre demande</option>
        </select>
      </div>
      <div className="mt-4">
        <label htmlFor="message" className="mb-1.5 block text-sm font-semibold">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Bonjour, je souhaiterais…"
          className={`${inputClass} resize-none`}
        />
      </div>
      {/* Champ piège anti-robots : invisible pour les visiteurs. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Site web</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {state.error ? (
        <p className="mt-4 rounded-xl bg-rose-500/15 px-4 py-2.5 text-sm font-semibold text-rose-300" role="alert">
          {state.error}
        </p>
      ) : null}
      <button type="submit" disabled={pending} onClick={smash} className="btn btn-rose mt-6 w-full disabled:opacity-60">
        {pending ? "Envoi en cours…" : "Envoyer le message"}
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14m0 0-6-6m6 6-6 6" />
        </svg>
      </button>
      <p className="mt-4 text-center text-xs text-white/50">
        Vos coordonnées ne servent qu&rsquo;à vous répondre — elles ne sont jamais
        partagées.
      </p>
      <BallFx apiRef={fx} className="z-30 rounded-[2rem]" />
    </form>
  );
}
