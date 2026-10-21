import Image from "next/image";
import Reveal from "@/components/Reveal";
import { halleLogo } from "@/lib/images";
import { getReservation, getSettings } from "@/lib/content";
import { telHref } from "@/lib/format";

export default async function ReservationBand() {
  const [site, reservation] = await Promise.all([getSettings(), getReservation()]);

  return (
    <section
      id="reservation"
      className="reservation-band relative isolate flex min-h-[100svh] scroll-mt-20 items-center overflow-hidden bg-night-950 py-16 text-white"
    >
      {/* Arrière-plan : photo d'un court, dérive Ken Burns, voile doré */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <Image
          src={halleLogo}
          alt=""
          fill
          placeholder="blur"
          sizes="100vw"
          className="animate-kenburns object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night-950/92 via-night-950/75 to-night-950/95" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(55rem 30rem at 50% 0%, rgba(234,51,111,0.18), transparent 60%)",
          }}
        />
      </div>

      {/* Filigrane typographique */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-6 hidden select-none justify-center lg:flex"
      >
        <span className="display text-stroke-rose text-[9rem] leading-none xl:text-[11rem]">
          TEN&rsquo;UP
        </span>
      </div>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6">
        <Reveal>
          <span className="kicker kicker-center text-[0.65rem] text-rose-400 sm:text-xs">
            Réservation
          </span>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="reservation-title display mt-5 text-4xl text-white sm:text-5xl lg:text-6xl">
            Votre court en{" "}
            <span className="animate-sheen bg-gradient-to-r from-rose-300 via-rose-500 to-rose-300 bg-clip-text text-transparent">
              2 minutes
            </span>
            , chrono
          </h2>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            {reservation.description} Choisissez votre créneau et venez jouer,
            7 jours sur 7.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-9 flex flex-col items-center gap-4">
            <a
              href={site.links.tenup}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-rose !px-10 !py-5 text-base sm:text-lg"
            >
              {reservation.cta}
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7m0 0H8m9 0v9" />
              </svg>
            </a>
            <span className="text-xs uppercase tracking-[0.16em] text-rose-300/90">
              {reservation.tag} · Gratuit · Confirmation immédiate
            </span>
          </div>
        </Reveal>

        <Reveal delay={400}>
          <p className="mt-9 text-sm text-white/50">
            Besoin d&rsquo;aide pour votre première réservation ? Appelez le club au{" "}
            <a href={telHref(site.phoneClub)} className="font-semibold text-rose-300 hover:underline">
              {site.phoneClub}
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
