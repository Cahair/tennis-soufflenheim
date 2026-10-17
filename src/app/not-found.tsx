import Link from "next/link";
import CourtLines from "@/components/CourtLines";

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-night-950 px-4 py-40">
      <div className="brand-glow absolute inset-0" />
      <CourtLines className="absolute -left-32 -top-32 h-[30rem] w-auto -rotate-12 text-white/[0.05]" />
      <CourtLines className="absolute -bottom-32 -right-32 h-[30rem] w-auto rotate-12 text-white/[0.05]" />
      <div className="relative text-center">
        <span className="kicker justify-center text-rose-400">Erreur 404</span>
        <h1 className="display brand-gradient-text mt-4 text-7xl sm:text-8xl">Out !</h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-white/65">
          Cette page est sortie des limites du court. Revenez au jeu, on remet
          la balle au centre.
        </p>
        <div className="mt-9">
          <Link href="/" className="btn btn-rose">
            Retour à l&rsquo;accueil
          </Link>
        </div>
      </div>
    </section>
  );
}
