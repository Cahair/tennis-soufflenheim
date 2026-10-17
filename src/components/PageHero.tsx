import CourtLines from "./CourtLines";
import Reveal from "./Reveal";

export default function PageHero({
  kicker,
  title,
  text,
}: {
  kicker: string;
  title: string;
  text?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-night-950 pb-20 pt-40">
      <div className="brand-glow absolute inset-0" />
      <CourtLines className="absolute -right-24 -top-24 h-[30rem] w-auto rotate-12 text-white/[0.05]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <span className="kicker text-rose-400">{kicker}</span>
          <h1 className="display mt-4 max-w-3xl text-5xl text-white sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          {text ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
              {text}
            </p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
