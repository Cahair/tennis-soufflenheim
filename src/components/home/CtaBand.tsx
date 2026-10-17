import Link from "next/link";
import CourtLines from "@/components/CourtLines";
import Reveal from "@/components/Reveal";
import { getCtaBand } from "@/lib/content";

export default async function CtaBand() {
  const { title, text } = await getCtaBand();
  return (
    <section className="relative overflow-hidden bg-rose-500 py-20">
      <CourtLines className="absolute -right-32 -top-24 h-[26rem] w-auto rotate-12 text-night-950/10" />
      <CourtLines className="absolute -bottom-32 -left-32 h-[24rem] w-auto -rotate-6 text-night-950/10" />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="display text-5xl text-night-950 sm:text-6xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-night-950/90">
            {text}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link href="/#reservation" className="btn btn-night">
              Réserver un court
            </Link>
            <Link href="/contact" className="btn btn-outline-night">
              Nous contacter
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
