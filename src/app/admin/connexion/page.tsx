"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/lib/admin/actions";
import Link from "next/link";
import LogoMark from "@/components/LogoMark";

export default function ConnexionPage() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    loginAction,
    {}
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-night-950 px-4">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-sm">
        <div className="flex justify-center">
          <LogoMark />
        </div>
        <h1 className="display mt-6 text-center text-2xl text-white">
          Administration du site
        </h1>
        <p className="mt-2 text-center text-sm text-white/60">
          Espace réservé aux bénévoles du club.
        </p>
        <form action={action} className="mt-8">
          <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-white/80">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition-all focus:border-rose-400 focus:ring-4 focus:ring-rose-500/20"
          />
          {state.error ? (
            <p className="mt-3 rounded-xl bg-rose-600/15 px-4 py-2.5 text-sm text-rose-300" role="alert">
              {state.error}
            </p>
          ) : null}
          <button type="submit" disabled={pending} className="btn btn-rose mt-6 w-full disabled:opacity-60">
            {pending ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
      <Link href="/" className="mt-8 text-sm text-white/50 hover:text-rose-300">
        ← Retour au site
      </Link>
    </div>
  );
}
