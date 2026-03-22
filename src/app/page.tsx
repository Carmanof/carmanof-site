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

export default function HomePage() {
  return (
    <>
      <Hero />
      <VideoCaseBlock />
      <MainOffer />
      <OtherWorks />
      <AdditionalElements />
      <ProcessBlock />     
      <MoreExamplesBlock />      
      <TrustBlock />
      <Prices />
      <FAQ />
      <Contact />
      <Footer />
    </>
  );
}
