import type { Metadata } from "next";
import SportLanding from "@/components/SportLanding";
import { pageMetadata } from "@/lib/seo";
import { sportPages } from "@/lib/sports";

const sport = sportPages.pickleball;

export const metadata: Metadata = pageMetadata({
  title: sport.metaTitle,
  description: sport.metaDescription,
  path: "/pickleball",
});

export default function PickleballPage() {
  return <SportLanding sport={sport} />;
}
