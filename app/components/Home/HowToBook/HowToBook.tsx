import React from "react";

const HowToBook = () => {
  const steps = [
    {
      title: "1. Explore & Choose",
      details: [
        {
          text: "Browse our range of safari destinations and packages to find your ideal adventure.",
        },
        {
          text: "Use filters or get in touch for help customizing your experience.",
        },
      ],
    },
    {
      title: "2. Contact Us",
      details: [
        {
          text: "Reach out via email, phone, our contact form or Booking Form to confirm availability and get a personalized quote.",
        },
        {
          text: "Our travel specialists will answer all your questions and finalize your itinerary.",
        },
      ],
    },
    {
      title: "3. Secure Your Booking",
      details: [
        {
          text: "Once you’re happy with your itinerary, we’ll send a booking confirmation with payment instructions.",
        },
        {
          text: "We accept various payment options, and a deposit is typically required to secure your trip.",
        },
      ],
    },
    {
      title: "4. Prepare for Your Trip",
      details: [
        {
          text: "We’ll provide all the necessary travel info, packing tips, visa guidance, and more before departure.",
        },
        {
          text: "You’ll be fully supported before and during your adventure with us.",
        },
      ],
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-950 mb-12">
          How to Book a Tour
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold text-amber-700 mb-4">
                {step.title}
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {step.details.map((detail, idx) => (
                  <li key={idx}>{detail.text}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToBook;
