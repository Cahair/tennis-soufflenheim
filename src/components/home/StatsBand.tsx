import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import { getStats } from "@/lib/content";

export default async function StatsBand() {
  const stats = await getStats();
  return (
    <section id="stats" className="bg-rose-500">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat, i) => (
          <Reveal
            key={stat.label}
            delay={i * 100}
            className={`flex flex-col items-center gap-1 text-center ${
              i > 0 ? "lg:border-l lg:border-night-950/15" : ""
            }`}
          >
            <span className="display text-5xl text-night-950 sm:text-6xl">
              <CountUp value={stat.value} suffix={stat.suffix} />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-night-950/90">
              {stat.label}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
