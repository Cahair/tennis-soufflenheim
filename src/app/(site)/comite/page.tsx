import type { Metadata } from "next";
import CommitteeIcon from "@/components/CommitteeIcon";
import PageHero from "@/components/PageHero";
import SectionHeader from "@/components/SectionHeader";
import TradingCard from "@/components/fx/TradingCard";
import CtaBand from "@/components/home/CtaBand";
import NightFx from "@/components/landing/NightFx";
import { getCommittee } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Le comité",
  description:
    "Bureau, commissions sportive, entretien, animation et sponsoring : découvrez les bénévoles qui font vivre le Tennis Padel Club Soufflenheim.",
  path: "/comite",
});

/* Les quatre commissions du club, dans l'ordre d'affichage du
   récapitulatif. Les membres sont déduits du champ `commissions`. */
const commissionsMeta = [
  {
    name: "Commission Sportive",
    icon: "trophy",
    text: "Tournois, championnats par équipes et animation de la vie sportive.",
  },
  {
    name: "Commission Entretien",
    icon: "wrench",
    text: "Courts, piste de padel, club house : des installations toujours impeccables.",
  },
  {
    name: "Commission Animation",
    icon: "spark",
    text: "Fêtes du club, soirées et moments de convivialité tout au long de l'année.",
  },
  {
    name: "Commission Sponsoring",
    icon: "handshake",
    text: "Le lien avec les partenaires et sponsors qui soutiennent le club.",
  },
];

/* ------------------------------------------------------------------ */
/*  Le comité en cartes à collectionner : pellicule holographique qui */
/*  suit la souris, carte rare pour le président, retournement au     */
/*  clic pour lire le contact. Les commissions en maillots d'équipe   */
/*  avec numéro géant.                                                */
/* ------------------------------------------------------------------ */
export default async function ComitePage() {
  const committee = await getCommittee();

  /* Le bureau d'un côté, les membres élus au titre d'une commission
     de l'autre — même découpage que l'organigramme du club. */
  const bureau = committee.filter((m) => !m.role.startsWith("Commission"));
  const commissionMembers = committee.filter((m) => m.role.startsWith("Commission"));

  return (
    <>
      <PageHero
        kicker="Le club"
        title="Le comité"
        text="Ils donnent de leur temps toute l'année pour que chacun n'ait plus qu'à penser à jouer : voici les bénévoles qui font tourner le club. Collectionnez-les tous !"
        echo="Équipe"
        effect="drop"
        tape={["Bénévoles", "Bureau", "Commissions", "Collection 2026", "Cartes rares", "Le club"]}
      />

      {/* Le bureau */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx glow="left" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker="Le bureau"
            title="Ceux qui tiennent la barre"
            text="Présidence, trésorerie, secrétariat : l'équipe qui pilote le club au quotidien. Cliquez sur une carte pour la retourner."
          />
          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {bureau.map((member, i) => (
              <div key={member.name} className={i % 3 === 1 ? "lg:mt-12" : ""}>
                <TradingCard member={member} index={i} total={committee.length} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Les commissions */}
      <section className="relative overflow-clip bg-night-950 py-28 text-white">
        <NightFx glow="right" beams floaters={[]} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker="Les commissions"
            title="Des équipes pour chaque mission"
            text="Sport, entretien, animation, sponsoring : chaque commission réunit des bénévoles du comité autour d'une mission précise."
          />
          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {commissionMembers.map((member, i) => (
              <TradingCard key={member.name} member={member} index={bureau.length + i} total={committee.length} />
            ))}
          </div>

          {/* Récapitulatif : qui siège où, en maillots d'équipe */}
          <div className="mt-28 grid gap-6 sm:grid-cols-2">
            {commissionsMeta.map((commission, i) => {
              const members = committee.filter((m) => m.commissions?.includes(commission.name));
              if (!members.length) return null;
              return (
                <div
                  key={commission.name}
                  data-tilt
                  className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-night-900 to-night-950 p-8 transition-colors duration-500 hover:border-rose-400/60"
                >
                  <span
                    aria-hidden="true"
                    className="display pointer-events-none absolute -right-4 -top-10 text-[11rem] leading-none text-white/[0.04] transition-colors duration-500 group-hover:text-rose-500/20"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-rose-400 to-ultra-500" />
                  <div className="relative flex items-center gap-4">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-500 text-night-950 shadow-[0_0_30px_rgba(234,51,111,0.6)] transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110">
                      <CommitteeIcon icon={commission.icon} />
                    </span>
                    <div>
                      <h3 className="display text-2xl text-white">{commission.name}</h3>
                      <p className="mt-1 text-sm text-white/65">{commission.text}</p>
                    </div>
                  </div>
                  <ul className="relative mt-6 flex flex-wrap gap-2">
                    {members.map((member) => (
                      <li
                        key={member.name}
                        className="rounded-full border border-rose-400/30 bg-rose-500/10 px-3.5 py-1.5 text-xs font-semibold text-rose-100"
                      >
                        {member.name}
                      </li>
                    ))}
                  </ul>
                  <div className="nfx-shine" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
