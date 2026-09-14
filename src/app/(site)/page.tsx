import type { Metadata } from "next";
import Booking from "@/components/landing/Booking";
import ClubLife from "@/components/landing/ClubLife";
import ClubStory from "@/components/landing/ClubStory";
import Cursor from "@/components/landing/Cursor";
import FinalCall from "@/components/landing/FinalCall";
import GalleryMosaic from "@/components/landing/GalleryMosaic";
import Hero from "@/components/landing/Hero";
import PadelReveal from "@/components/landing/PadelReveal";
import Partners from "@/components/landing/Partners";
import SmoothScroll from "@/components/landing/SmoothScroll";
import Splash from "@/components/landing/Splash";
import Sports from "@/components/landing/Sports";
import Voices from "@/components/landing/Voices";
import {
  getCtaBand,
  getDisciplines,
  getEvents,
  getGallery,
  getHomeIntro,
  getNews,
  getReservation,
  getSettings,
  getSponsors,
  getStats,
  getTestimonials,
} from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/* Page d'accueil : peu de texte, beaucoup d'air, l'essentiel mis en
   scène (animations GSAP + défilement lissé Lenis, tout désactivé en
   mouvement réduit). La FAQ complète vit sur la page Contact. */
export default async function Home() {
  const [
    site,
    intro,
    stats,
    disciplines,
    reservation,
    news,
    events,
    gallery,
    testimonials,
    sponsors,
    ctaBand,
  ] = await Promise.all([
    getSettings(),
    getHomeIntro(),
    getStats(),
    getDisciplines(),
    getReservation(),
    getNews(),
    getEvents(),
    getGallery(),
    getTestimonials(),
    getSponsors(),
    getCtaBand(),
  ]);

  return (
    <>
      <SmoothScroll />
      <Splash baseline={site.baseline} />
      <Cursor />
      <Hero />
      <ClubStory intro={intro} stats={stats} />
      <Sports disciplines={disciplines} />
      <PadelReveal />
      <Booking reservation={reservation} tenup={site.links.tenup} phone={site.phoneClub} />
      <ClubLife news={news.slice(0, 3)} events={events.slice(0, 4)} />
      <GalleryMosaic items={gallery.slice(0, 6)} />
      <Voices testimonials={testimonials} />
      <Partners sponsors={sponsors} />
      <FinalCall
        title={ctaBand.title}
        text={ctaBand.text}
        tenup={site.links.tenup}
        cta={reservation.cta}
      />
    </>
  );
}
