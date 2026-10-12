import type { Metadata } from "next";
import SportLanding from "@/components/SportLanding";
import { pageMetadata } from "@/lib/seo";
import { sportPages } from "@/lib/sports";

const sport = sportPages.padel;

export const metadata: Metadata = pageMetadata({
  title: sport.metaTitle,
  description: sport.metaDescription,
  path: "/padel",
});

export default function PadelPage() {
  return <SportLanding sport={sport} />;
}
