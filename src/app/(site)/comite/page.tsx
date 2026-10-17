import type { Metadata } from "next";
import Image from "next/image";
import CommitteeIcon from "@/components/CommitteeIcon";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import CtaBand from "@/components/home/CtaBand";
import { getCommittee } from "@/lib/content";
import type { CommitteeMember } from "@/lib/content-types";
import { telHref } from "@/lib/format";
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

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function MemberCard({ member, delay }: { member: CommitteeMember; delay: number }) {
  return (
    <Reveal delay={delay} className="h-full">
      <div className="card-lift flex h-full flex-col overflow-hidden rounded-3xl border border-night-200 bg-white">
        <div className="relative aspect-square overflow-hidden">
          {member.photo ? (
            <Image
              src={member.photo}
              alt={`Portrait de ${member.name}`}
              fill
              placeholder={member.photo.blurDataURL ? "blur" : "empty"}
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 bg-night-800">
              <span className="display text-6xl text-rose-400">
                {initials(member.name)}
              </span>
              <CommitteeIcon icon={member.icon} className="h-6 w-6 text-white/40" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col items-center p-6 text-center">
          <h3 className="display text-xl text-night-950">{member.name}</h3>
          <p className="mt-1 text-sm font-semibold text-night-950/70">{member.role}</p>
          {member.contact ? (
            <a
              href={telHref(member.contact)}
              className="mt-2 text-xs text-night-950/50 transition-colors hover:text-night-800"
            >
              {member.contact}
            </a>
          ) : null}
        </div>
      </div>
    </Reveal>
  );
}

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
        text="Ils donnent de leur temps toute l'année pour que chacun n'ait plus qu'à penser à jouer : voici les bénévoles qui font tourner le TPCS."
      />

      {/* Le bureau */}
      <section className="bg-night-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              kicker="Le bureau"
              title="Ceux qui tiennent la barre"
              text="Présidence, trésorerie, secrétariat : l'équipe qui pilote le club au quotidien et répond à toutes vos questions."
            />
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bureau.map((member, i) => (
              <MemberCard key={member.name} member={member} delay={(i % 3) * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* Les commissions */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              kicker="Les commissions"
              title="Des équipes pour chaque mission"
              text="Sport, entretien, animation, sponsoring : chaque commission réunit des bénévoles du comité autour d'une mission précise."
            />
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {commissionMembers.map((member, i) => (
              <MemberCard key={member.name} member={member} delay={(i % 3) * 100} />
            ))}
          </div>

          {/* Récapitulatif : qui siège où */}
          <div className="mt-20 grid gap-6 sm:grid-cols-2">
            {commissionsMeta.map((commission, i) => {
              const members = committee.filter((m) =>
                m.commissions?.includes(commission.name)
              );
              if (!members.length) return null;
              return (
                <Reveal key={commission.name} delay={(i % 2) * 100} className="h-full">
                  <div className="flex h-full flex-col rounded-3xl border border-night-200 bg-night-50 p-7">
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-night-800 text-rose-400">
                        <CommitteeIcon icon={commission.icon} />
                      </span>
                      <div>
                        <h3 className="display text-xl text-night-950">
                          {commission.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-night-950/55">
                          {commission.text}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {members.map((member) => (
                        <span
                          key={member.name}
                          className="rounded-full border border-night-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-night-800"
                        >
                          {member.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
