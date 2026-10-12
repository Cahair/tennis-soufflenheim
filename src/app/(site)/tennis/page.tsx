import type { Metadata } from "next";
import SportLanding from "@/components/SportLanding";
import { pageMetadata } from "@/lib/seo";
import { sportPages } from "@/lib/sports";

const sport = sportPages.tennis;

export const metadata: Metadata = pageMetadata({
  title: sport.metaTitle,
  description: sport.metaDescription,
  path: "/tennis",
});

export default function TennisPage() {
  return <SportLanding sport={sport} />;
}
