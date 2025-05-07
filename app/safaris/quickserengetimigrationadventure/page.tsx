"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const itinerary = [
  {
    day: "Day 1",
    title: "Arrival & Safari Game Drive",
    activity:
      "Activity: Transfer to Ngorongoro | Safari Driving | Culture Visit",
    accommodation: "Accomodation: The Retreat Ngorongoro (or similar)",
    details:
      "Upon arrival at Kilimanjaro International Airport (JRO), you will be warmly welcomed by your professional safari guide, who will assist with your luggage and provide a brief introduction to the adventure ahead. From here, embark on a scenic drive to the Ngorongoro Conservation Area, a journey of approximately 4 to 5 hours through rolling highlands, Maasai villages, and lush landscapes.Upon reaching Ngorongoro, you will descend into the world-famous crater, a breathtaking volcanic caldera that is home to a remarkable concentration of wildlife. As you navigate the crater floor, you’ll have the opportunity to see large herds of zebras, wildebeests, and elephants, as well as the iconic Big Five—lions, leopards, elephants, buffalo, and the rare black rhino. You’ll enjoy a picnic lunch in the crater, surrounded by this natural wonder, before continuing your game drive through its diverse ecosystems of grasslands, forests, and soda lakes teeming with flamingos.Evening As the sun begins to set, ascend the crater walls and transfer to The Retreat at Ngorongoro, where you can unwind, enjoy a delicious dinner, and relax in the serene atmosphere of the African wilderness.",
    image: "/images/Day1Quick.jpg",
  },
  {
    day: "Day 2",
    title: "Serengeti National Park (Big Five Drive)",
    activity: "Activity: Safari Driving | Big-5 Safari | Wildebeest Migration",
    accommodation: "Accomodation: Nyota Luxury Camp (or similar)",
    details:
      "After an early breakfast, set off towards the vast plains of Serengeti National Park, a journey that takes you through the stunning landscapes of the Ngorongoro Conservation Area. Along the way, you may choose to visit a Maasai village, where you’ll have the opportunity to learn about their rich culture, traditional way of life, and vibrant dance ceremonies.Upon reaching Central Serengeti, you’ll stop for a picnic lunch in the heart of the savannah, surrounded by herds of antelopes, giraffes, and elephants. This region is renowned for its high density of big cats, and as you continue your afternoon game drive, keep your camera ready for majestic lions resting under acacia trees, elusive leopards draped over branches, and cheetahs scanning the plains for prey.As dusk falls, arrive at your luxurious Lodge, where you can relax, sip on sundowners, and enjoy a gourmet dinner while taking in the breathtaking Serengeti landscape.",
    image: "/images/Day2Quick.jpg",
  },
  {
    day: "Day 3",
    title: "Northern Serengeti & The Great Migration",
    activity: "Activity: Guided Safari Driving | Wildebeest Migration",
    accommodation: "Accomodation: Nyota Luxury Camp (or similar)",
    details:
      "Wake up early and begin your journey northward towards the Kogatende region of Serengeti, where the Great Migration is in full swing. As you traverse the endless golden plains, you’ll witness thousands of wildebeests and zebras moving in synchronized herds, a truly mesmerizing spectacle. Along the way, you’ll spot hyenas trailing the migration, vultures circling overhead, and large elephants crossing dry riverbeds.At midday, stop for a picnic lunch under the shade of an acacia tree, allowing you to take in the vast, open landscapes. The migration herds stretch as far as the eye can see, often accompanied by predators such as lions and cheetahs, making for thrilling game-viewing opportunities.By late afternoon, arrive at your Camp, a luxurious tented retreat offering an intimate safari experience in the heart of migration country. After a refreshing shower and a sunset drink, enjoy a delightful dinner before resting in the tranquility of the wilderness.",
    image: "/images/QuickDay3.jpg",
  },

  {
    day: "Day 4",
    title: "Migration Safari & Mara River Crossing",
    activity: "Activity: Guided Safari Driving | Wildebeest Migration",
    accommodation: "Accomodation: Nyota Luxury Camp (or similar)",
    details:
      "After breakfast, embark on a full-day game drive dedicated entirely to the Great Migration. The highlight of the day is witnessing the dramatic Mara River crossing, one of the most breathtaking and heart-pounding spectacles in nature. As thousands of wildebeests and zebras charge into the crocodile-infested waters, you’ll witness their sheer determination and survival instincts firsthand.Pause for a picnic lunch near the river, where you can continue to watch the herds braving the dangerous currents while crocodiles patiently wait for their chance. Alongside the migration, you’ll also have the opportunity to see lions, cheetahs, and leopards prowling nearby, looking for an opportunity to hunt.As the day winds down, return to your Camp, where you can relax around the campfire, listen to the distant roars of lions, and enjoy a well-earned dinner before settling in for the night.",
    image: "/images/QuickDay3.jpg",
  },

  {
    day: "Day 5",
    title: "Morning Game Drive & Flight to Arusha/KIA",
    activity: "Activity: Morning Game Drive & Flight to Arusha/KIA",
    accommodation: "Accomodation: N/A",
    details:
      "On your final morning in the Serengeti, set out on an early game drive, making the most of your last chance to observe the migration herds, big cats, and other incredible wildlife in the soft golden light of sunrise. Watch as elephants trek towards watering holes, hippos return to their rivers, and hyenas scavenge from the night’s kills.Around midday, enjoy a final picnic lunch in the bush, taking in the breathtaking scenery one last time. After lunch, you’ll be transferred to Kogatende Airstrip, where you will board a scenic bush flight back to Arusha or Kilimanjaro International Airport (KIA). Soaring over the Serengeti from above offers a stunning farewell to the landscapes and wildlife that made your journey unforgettable. Upon arrival in Arusha or KIA, our team will be there to assist you with any onward travel arrangements, ensuring a smooth departure.",
    image: "/images/QuickDay5.jpg",
  },
];

const Quickserengetimigrationadventure: React.FC = () => {
  const [openDay, setOpenDay] = useState<number | null>(null);

  const toggleDay = (index: number) => {
    setOpenDay(openDay === index ? null : index);
  };

  return (
    <main className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center text-white">
        <Image
          src="/images/MainQuick.jpg"
          alt="Mikumi and Udzungwa"
          layout="fill"
          objectFit="cover"
          className="absolute z-0"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
        <div className="relative z-20 px-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            Quick Serengeti Migration Adventure
          </h1>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <h1 className="mb-4">
          Experience the Great Wildebeest Migration on this 5-day safari through
          Ngorongoro Crater, Central Serengeti, and Northern Serengeti. Begin at
          Ngorongoro Crater, home to the Big Five and breathtaking landscapes,
          before heading to Central Serengeti, where large predator populations
          follow the migrating herds. Continue north to witness thousands of
          wildebeests and zebras as they traverse the plains, facing predators
          and crossing the Mara River, where crocodiles and strong currents
          create one of nature’s most dramatic spectacles. Stay in luxury lodges
          and tented camps, enjoying expert-guided game drives and stunning
          sunsets over the savannah.
        </h1>
      </section>

      {/* Overview Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Medium Image */}
          <section className="container mx-auto px-6">
            <div className="flex justify-start mb-12">
              <Image
                src="/images/Quickserengetimap.jpg"
                alt="Weekend Safari"
                width={500} // ~w-64
                height={400} // ~h-40
                className="rounded"
              />
            </div>
          </section>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Trip Overview</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Destinations:</strong> Arusha | Ngorongoro | Serengeti
              </li>
              <li>
                <strong>Duration:</strong> 2 Nights
              </li>
              <li>
                <strong>Price:</strong>
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
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Highlights</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Abundant Wildlife: Elephants, giraffes, zebras, lions, and more
              </li>
              <li>Birdwatching Paradise: Over 400 bird species in Mikumi</li>
              <li>Scenic Landscapes: Rolling hills, vast plains, and rivers</li>
              <li>Guided Safari Tours with knowledgeable local guides</li>
              <li>Cultural Encounters: Visit to a Masai village</li>
              <li>Night Safari experience</li>
              <li>Breathtaking Waterfalls in Udzungwa</li>
              <li>Tropical Rainforest Treks</li>
            </ul>
          </div>
        </div>
      </section>

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
                      <p className="text-gray-700 mt-4 mb-4">{item.details}</p>
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

export default Quickserengetimigrationadventure;
