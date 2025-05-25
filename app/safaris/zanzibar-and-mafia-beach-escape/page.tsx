"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const itinerary = [
  {
    day: "6 Days Zanzibar Beach Vacation",
    title: "Arrival & Safari Game Drive",
    activity: "Activity:  Safari Dining | Visit Local Markets | Walking Safari",
    accommodation: "Accomodation: Manyara Secret Lodge (or similar)",
    details2: "Day 1: Arrive in Zanzibar",
    details3: "Day 2: Zanzibar",
    details:
      "When you arrive at Zanzibar Airport, you'll be met by a local representative who will assist you with your luggage and transfer you to the beachfront luxury hotel of your choice, where you will stay for five days. Here, you will be shown to your room and you will unpack your bags and make yourself at home, enjoy the view, and get ready for your dinner.",
    details4:
      "On the second day, you will continue to relax at your hotel, you will spend time at the swimming pool, getting spa treatment or you can sit under the beach chair enjoying the breeze and the ocean view.",
    details5: "Day 3: Stone Town Tour & Spice Tour",
    details6:
      "Today you will stretch your legs and visit Stone Town, a UNESCO World Heritage Site that exudes charm and cultural significance. You will wander through the maze-like alleys, marvel at the intricate architecture of old merchant houses, and soak in the vibrant atmosphere of the waterfront. From here, you will visit the Spice Plantations, where, led by a knowledgeable guide, you will go through lush plantations, you and immerse yourself in the scents and flavors of the island's renowned spices",

    details7: "Day 4 - 5: Relax at your hotel",
    details8:
      "Zanzibar is famous for its stunning beaches with powdery white sand and turquoise waters. Spend your days soaking up the sun, swimming, or engaging in water sports such as kiteboarding, windsurfing, and parasailing. You can also Immerse yourself in Zanzibar's vibrant culture by attending cultural performances, such as traditional Taarab music and Ngoma drum dances. Visit local villages, interact with residents, and sample delicious Swahili cuisine at street food markets and seaside restaurants.",

      details9: "Day 6: Depart (or transfer to Mafia Island)",
      details10:
        "Sadly, all good things end, and today after your breakfast you'll be driven to the airport to catch the flight to Dar Es Salaam, Kilimanjaro, or an International flight back home.",
    image: "/images/zanzibar1.jpg",
  },

  {
    day: "6 Days Zanzibar Beach Vacation",
    title: " Ngorongoro Highlands and Crater",
    activity:
      "Activity: Beach| Snorkeling | Sunset Dhow Cruise | History | Cultural Tours",
    accommodation: "Accomodation: N/A",

    details2: "Day 1: Arrive on Mafia Island",

    details:
      "You will be picked up from the airport in Mafia by our local representative, who will transfer you to the Butiama Lodge or any hotel of your choice. You will spend the first night at your hotel eating your dinner and enjoying the evening breeze.",
    details4:
      "Marine Park Snorkeling, Scuba Diving, Whale Shark Safari, Island Hopping, Fishing Trips, Kayaking and Canoeing, Cultural Tours, Sunset Cruises",
    details5: "Day 6: Departure",
    details6:
      "Today, having had breakfast, you will be transferred to the airstrip the short flight to Dar es Salaam, from here you will catch another flight to Serengeti, Zanzibar, or an international flight back home.",
    
    image: "/images/zanzibar2.jpg",
  },

];

const ZanzibarAndMafia: React.FC = () => {
  const [openDay, setOpenDay] = useState<number | null>(null);

  const toggleDay = (index: number) => {
    setOpenDay(openDay === index ? null : index);
  };

  return (
    <main className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center text-white">
        <Image
          src="/images/zanzibarmain.jpg"
          alt="Mikumi and Udzungwa"
          layout="fill"
          objectFit="cover"
          className="absolute z-0"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
        <div className="relative z-20 px-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            Zanzibar & Mafia Beach Escape
          </h1>
        </div>
      </section>

      <main className="bg-white text-gray-900 px-6 py-12 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-orange-700">
          Zanzibar & Mafia Beach Escape
        </h1>

        <div className="mb-4">
          <p>
            <strong>Destinations:</strong> Zanzibar & Mafia Islands
          </p>
          <p>
            <strong>Price:</strong>{" "}
            <a
              href="/ContactUs"
              className="inline-block text-blue-950 px-4 py-3 text-lg transition"
            >
              Contact Us{" "}
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-sm text-orange-600"
              />
            </a>
          </p>
          <p>
            <strong>Duration:</strong>{" "}
            <span className="text-orange-700">
              6 Nights Zanzibar/ 6 Nights Mafia
            </span>
          </p>
        </div>

        <p className="mb-6">
          Escape to the Indian Ocean island of Zanzibar, Mafia, or both for
          relaxation.
        </p>

        <ul className="list-disc list-inside mb-6">
          <li>
            These excursions are perfect safari add-on or stand-alone holiday
            vacation.
          </li>
          <li>
            We will book any hotel in Zanzibar for you from the list below or
            your list.
          </li>
          <li>
            We will also arrange any of the excursions that you wish while at
            the accommodation.
          </li>
        </ul>

        <h2 className="text-xl font-bold mb-2 text-orange-700">Highlights:</h2>
        <ul className="list-disc list-inside mb-6">
          <li>Explore and relax on the Island</li>
          <li>Enjoy magnificent ocean views</li>
          <li>Dine on fresh seafood</li>
          <li>Swim, snorkel, and dive</li>
          <li>Whale Shark Safari</li>
          <li>Visit the locals/Cultural Tours</li>
          <li>Local Sunset cruises</li>
        </ul>

        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-1 text-orange-700">
            Zanzibar Island
          </h3>
          <p>
            A vacation to Zanzibar offers a captivating blend of culture,
            history, and natural beauty. With its pristine beaches,
            crystal-clear waters, and vibrant coral reefs, it&apos;s a paradise
            for snorkeling, diving, and water sports enthusiasts.
          </p>
          <p className="mt-2">
            The island&apos;s rich Swahili culture and fascinating history,
            evident in Stone Town&apos;s narrow streets and ancient
            architecture, provide ample opportunities for exploration and
            discovery.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-1 text-orange-700">
            Mafia Island
          </h3>
          <p>
            A vacation to Mafia Island promises a serene and unspoiled tropical
            experience. With its secluded beaches, turquoise waters, and
            thriving coral reefs, it&apos;s a haven for nature lovers and marine
            enthusiasts.
          </p>
          <p className="mt-2">
            The island&apos;s laid-back atmosphere and pristine landscapes offer
            a peaceful retreat away from the crowds. Visitors can enjoy
            snorkeling, diving, and swimming in some of the most biodiverse
            waters in the world, home to an array of marine life including whale
            sharks, turtles, and colorful fish.
          </p>
          <p className="mt-2">
            Mafia Island&apos;s authentic charm, coupled with its eco-friendly
            resorts and conservation efforts, make it an ideal destination for
            those seeking relaxation and immersion in nature&apos;s wonders.
          </p>
        </div>
      </main>

      {/* Accordion Itinerary */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-6">
          <div className="space-y-4">
            {itinerary.map((item, index) => (
              <div key={index} className="bg-white rounded shadow">
                <button
                  onClick={() => toggleDay(index)}
                  className="w-full flex justify-between items-center px-6 py-4 text-left text-lg font-medium border-b hover:bg-gray-50"
                >
                  <span>
                    {item.day}: {item.title} <br />
                    <span className="text-sm font-normal">
                      {item.activity} <br /> {item.accommodation}
                    </span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      openDay === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openDay === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden px-6 pb-4"
                    >
                      <p>
                        <strong>
                          <p className="text-gray-800 mt-4 mb-4">
                            {item.details2}
                          </p>
                        </strong>
                      </p>
                      <p className="text-gray-700 mt-4 mb-4">{item.details}</p>
                      <p>
                        <strong>
                          <p className="text-gray-800 mt-4 mb-4">
                            {item.details3}
                          </p>
                        </strong>
                      </p>
                      <p className="text-orange-700 mt-4 mb-4">{item.details4}</p>
                      <p>
                        <strong>
                          <p className="text-gray-800 mt-4 mb-4">
                            {item.details5}
                          </p>
                        </strong>
                      </p>
                      <p className="text-gray-700 mt-4 mb-4">{item.details6}</p>
                      <p>
                        <strong>
                          <p className="text-gray-800 mt-4 mb-4">
                            {item.details7}
                          </p>
                        </strong>
                      </p>
                      <p className="text-gray-700 mt-4 mb-4">{item.details8}</p>

                      <div className="w-64 h-40">
                        <Image
                          src={item.image}
                          alt={`Day ${index + 1} image`}
                          width={256} // w-64 in Tailwind = 256px
                          height={160} // h-40 in Tailwind = 160px
                          className="rounded object-cover"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inclusions & Exclusions Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Trip Includes</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Meals and accommodations as per itinerary</li>
              <li>Shared and private game viewing activities on safari</li>
              <li>All park fees</li>
              <li>All transfers per the itinerary (private & shared)</li>
              <li>
                Flying Doctor medical insurance (including emergency evacuation)
              </li>
              <li>Experienced guide throughout the trip</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Trip Excludes</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>International flights & visa fees</li>
              <li>Personal insurance (medical, cancellation, and baggage)</li>
              <li>Tips and gratuities</li>
              <li>Any items of a personal nature</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Inquiry Button */}
      <section className="text-center py-12">
        <a
          href="/BookNow"
          className="inline-block bg-blue-950 text-white px-8 py-3 rounded-3xl text-lg hover:bg-blue-900 transition"
        >
          Click Here to Book
        </a>
      </section>
    </main>
  );
};

export default ZanzibarAndMafia;
