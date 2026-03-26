import Hero from "@/components/Hero/Hero";
import MainOffer from "@/components/MainOffer/MainOffer";
import OtherWorks from "@/components/OtherWorks/OtherWorks";
import AdditionalElements from "@/components/AdditionalElements/AdditionalElements";
import VideoCaseBlock from "@/components/VideoCaseBlock/VideoCaseBlock";
import MoreExamplesBlock from "@/components/MoreExamplesBlock/MoreExamplesBlock";
import ProcessBlock from "@/components/ProcessBlock/ProcessBlock";
import TrustBlock from "@/components/TrustBlock/TrustBlock";
import Prices from "@/components/Prices/Prices";
import FAQ from "@/components/FAQ/FAQ";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";

import {
  getHomeVideoCases,
  getPhotoCases,
  getSiteSettings,
  type PhotoCase,
  type SiteSettings,
  type VideoCase,
} from "@/sanity/lib/fetchers";

/**
 * Fallback revalidation для главной страницы.
 * Даже если webhook не сработает — страница обновится сама.
 *
 * Важно:
 * - не заменяет tag-based revalidation
 * - работает как страховка
 */
export const revalidate = 120;

export default async function HomePage() {
  let settings: SiteSettings = null;
  let videoCases: VideoCase[] = [];
  let photoCases: PhotoCase[] = [];

  try {
    [settings, videoCases, photoCases] = await Promise.all([
      getSiteSettings(),
      getHomeVideoCases(),
      getPhotoCases(),
    ]);
  } catch (error) {
    console.error("HomePage error:", error);
  }

  const hasPhotoCases = photoCases.length > 0;

  return (
    <>
      <Hero />
      <VideoCaseBlock videoCases={videoCases} />
      <MainOffer />
      <OtherWorks hasPhotoCases={hasPhotoCases} />
      <AdditionalElements />
      <ProcessBlock />
      <MoreExamplesBlock />
      <TrustBlock />
      <Prices />
      <FAQ />
      <Contact settings={settings} />
      <Footer />
    </>
  );
}
