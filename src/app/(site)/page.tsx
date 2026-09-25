import { About } from "@/components/sections/About";
import { Comparison } from "@/components/sections/Comparison";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { OurPromise } from "@/components/sections/OurPromise";
import { Pillars } from "@/components/sections/Pillars";
import { Pricing } from "@/components/sections/Pricing";
import { Services } from "@/components/sections/Services";
import { SimulatorSection } from "@/components/sections/SimulatorSection";
import { TransparencyTeaser } from "@/components/sections/TransparencyTeaser";
import { WelcomeBox } from "@/components/sections/WelcomeBox";
import { JsonLd, homeJsonLd } from "@/lib/structured-data";

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <Hero />
      <OurPromise />
      <Comparison />
      <Journey />
      <Services />
      <Pricing />
      <SimulatorSection />
      <WelcomeBox />
      <Pillars />
      <About />
      <TransparencyTeaser />
      <Faq />
      <Contact />
    </>
  );
}
