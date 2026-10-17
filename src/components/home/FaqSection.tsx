import Link from "next/link";
import Accordion from "@/components/Accordion";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { getFaqs } from "@/lib/content";

export default async function FaqSection() {
  const faqs = await getFaqs();
  const shown = faqs.slice(0, 5);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: shown.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
  return (
    <section id="faq" className="scroll-mt-20 bg-night-50 py-24">
      <JsonLd data={faqJsonLd} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            kicker="FAQ"
            title="Les questions qu'on nous pose"
          />
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-12">
            <Accordion items={shown} />
          </div>
        </Reveal>
        <Reveal delay={180}>
          <p className="mt-8 text-center text-sm text-night-950/60">
            Une autre question ?{" "}
            <Link href="/contact" className="font-bold text-rose-600 hover:underline">
              Écrivez-nous
            </Link>{" "}
            — la FAQ complète se trouve sur la page contact.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
