import React from "react";
import SectionHeading from "../../Helper/SectionHeading";
import WhyUsCard from "./WhyUsCard";

const WhyUs = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Full‑width savanna background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
        style={{ backgroundImage: "url('/images/overlay-texture.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/30 via-amber-900/20 to-white/60"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          heading="Why Travel with ABM Tours and Safaris Ltd?"
          className="text-white drop-shadow-lg"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-16">
          {/* All 6 cards as before */}
          <WhyUsCard image="/images/Cultural.svg" title="Authentic Cultural & Safari Experiences" description="Step into the rhythm of Tanzania – from Maasai villages to the roar of lions at dawn." />
          <WhyUsCard image="/images/handshake.svg" title="Strong Partnerships, Premium Service" description="We've curated the finest lodges, expert guides, and eco‑friendly transport." />
          <WhyUsCard image="/images/Ecosystem.svg" title="Eco‑Tourism & Sustainability" description="We tread lightly, leaving only footprints. Your adventure directly supports conservation." />
          


          <WhyUsCard image="/images/affordable.svg" title="Affordable, Tailor‑Made Packages" description="Luxury is personal. We design bespoke safaris that fit your dreams – and your budget." />
          <WhyUsCard image="/images/Guides.svg" title="Passionate, Expert Guides" description="Our guides are walking encyclopedias of the bush, master storytellers, and guardians of your safety." />
          <WhyUsCard image="/images/safety.svg" title="Safety & Total Satisfaction" description="From GPS‑tracked vehicles to 24/7 support, your peace of mind is our north star." />
        </div>
      </div>
    </section>
  );
};

export default WhyUs;