import React from "react";
import SectionHeading from "../../Helper/SectionHeading";
import WhyUsCard from "./WhyUsCard";

const WhyUs = () => {
  return (
    <div className=" pt-16 pb-24">
      {/* section heading */}
      <SectionHeading heading="Why Travel with ABM Tours and Safaris Ltd?" tagline="" />

      <div className="grid w-[80%] mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 items-center mt-20">
        {/* Top Three Icons */}
        <div>
          <WhyUsCard
            image="/images/Cultural.svg"
            title="Authentic cultural and safari experiences"
            description="Experience the rich culture and breathtaking wildlife of Tanzania through immersive safaris, traditional encounters, and ethical tourism that honors local heritage."
          />
        </div>
        <div>
          <WhyUsCard
            image="/images/handshake.svg"
            title="Strong partnerships for high-quality service"
            description="We collaborate with trusted partners to ensure top-quality services, offering seamless, reliable, and enriching travel experiences for every guest."
          />
        </div>
        <div>
          <WhyUsCard
            image="/images/Ecosystem.svg"
            title="Commitment to eco-tourism and sustainability"
            description="Dedicated to eco-friendly tourism, we promote sustainability by supporting conservation efforts and minimizing environmental impact on all tours."
          />
        </div>

        {/* Thin Separator Line */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <hr className="border-t border-gray-300 w-full mx-auto" />
        </div>

        {/* Bottom Three Icons */}
        <div>
          <WhyUsCard
            image="/images/affordable.svg"
            title="Affordable customized tour packages"
            description="Enjoy tailor-made tour packages designed to fit your budget, ensuring a personalized, unforgettable experience without compromising on quality."
          />
        </div>
        <div className="lg:col-span-1 flex justify-center">
          <WhyUsCard
            image="/images/Guides.svg"
            title="Passionate and knowledgeable guides"
            description="Our expert guides are passionate and knowledgeable, providing insightful, engaging, and enriching experiences that bring every journey to life."
          />
        </div>
        <div className="lg:col-span-1 flex justify-center">
          <WhyUsCard
            image="/images/safety.svg"
            title="Safety and customer satisfaction"
            description="We prioritize your safety and comfort, ensuring every journey is secure and stress-free with well-maintained vehicles and professional guides."
          />
        </div>
      </div>
    </div>
  );
};

export default WhyUs;
