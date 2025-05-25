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
    title: "Arrival and Welcome to Tanzania",
    activity: "Activity:  Relaxation | City Tour | Night Out",
    accommodation: "Accomodation: Mediterraneo Hotel & Restaurant (or similar)",
    details:
      "Upon your arrival in Dar es Salaam, our staff will warmly welcome you, assist with your luggage, and escort you to your hotel for check-in. In the evening, our tour guide will provide a detailed briefing about the next day’s journey. Enjoy a relaxing dinner and rest well in preparation for the exciting safari ahead.",
    image: "/images/Dar1.jpg",
  },
  {
    day: "Day 2",
    title: "Road trip to Nyerere National Park & Boat Safari",
    activity:
      "Activity: Private Walking | Boat Safari | Game Drive | Bird Watching | Fishing | Village Tour",
    accommodation: "Accomodation: Rufiji River Camp (or similar)",
    details:
      "Your adventure begins with a picturesque 4-hour drive from Dar es Salaam to Nyerere National Park. As you travel, you'll take in the charming sights of rural Tanzania, passing through vibrant villages and verdant landscapes. Upon arrival, unwind at your lodge with a refreshing cup of coffee. Later, we set out on an exciting boat safari, gliding through the park's waterways to encounter hippos, crocodiles, and a diverse array of waterbirds in their natural habitats. This unique blend of fishing and wildlife viewing promises an unforgettable and immersive experience.",
    image: "/images/CrocNyerere.jpg",
  },
  {
    day: "Day 3",
    title: "Morning and Afternoon Sport Fishing",
    activity: "Activity: Bird Watching | Fishing",
    accommodation: "Accomodation: Rufiji River Camp (or similar)",
    details:
      "Spend the entire day immersed in sport fishing on the legendary Rufiji River, celebrated for its abundant aquatic life. Guided by experienced professionals and equipped with top-notch gear, you’ll have the thrilling opportunity to reel in prized catches like tigerfish and catfish. Break for a delicious riverside lunch before continuing your adventure on the water. After an exhilarating day, return to your lodge to relax, enjoy a hearty dinner, and unwind by the warmth of the campfire under the starry sky.",
    image: "/images/Fishing2.jpg",
  },

  {
    day: "Day 4 & 5",
    title: "Full-Day Game Drive",
    activity: "Activity: Game Drives",
    accommodation: "Rufiji River Camp (or similar)",
    details:
      "Start your day with an early morning pickup from your hotel for your first thrilling safari drive. This journey will immerse you in the park's incredible biodiversity, where you’ll encounter majestic elephants, graceful giraffes, and an array of vibrant bird species. Midday, take a break to savor a bush lunch surrounded by nature before continuing deeper into the park’s vast wilderness. Keep an eye out for predators such as lions and wild dogs, as well as herbivores like zebras and buffalo. In the evening, unwind at your lodge, relish a delicious dinner, and soak in the tranquil ambiance of the African bush.",
    image: "/images/Fishing3.jpg",
  },

  {
    day: "Day 6",
    title: "Fly to Ruaha National Park",
    activity: "Activity: Fly to Ruaha National Park | Private Game Drive",
    accommodation: "Accomodation: Ruaha River Lodge (or similar)",
    details:
      "Begin your day with a scenic two-hour flight from Nyerere National Park to Ruaha National Park, offering stunning aerial views of Tanzania’s vast wilderness. Upon landing, you’ll be transferred to your lodge to settle in and refresh. After lunch, head out on an afternoon game drive to explore Ruaha’s rugged landscapes and abundant wildlife, including elephant herds, lions, and antelope species. Return to your lodge by sunset for a peaceful evening, soaking in the serenity of this remote haven.",
    image: "/images/Fishing4.jpg",
  },

  {
    day: "Day 7-8",
    title: "Full-Day Game Drive",
    activity: "Activity: Private Game Drives",
    accommodation: "Accomodation: Ruaha River Lodge (or similar)",
    details:
      "Spend the entire day exploring Ruaha National Park on a full-day game drive. This park is renowned for its vast elephant herds, large pride of lions, and scenic landscapes dotted with baobab trees. You’ll traverse the diverse habitats, ranging from rolling hills to open savannahs, encountering a rich array of wildlife.",
    image: "/images/Fishing5.jpg",
  },

  {
    day: "Day 9 & 10",
    title: "Sport Fishing (Tiger fish)",
    activity: "Activity: Sport Fishing (Tiger fish)",
    accommodation: "Accomodation: Ruaha River Lodge (or similar)",
    details:
      "Enjoy two days immersed in the exhilarating catch-and-release fishing experience for tigerfish, known for their sharp teeth, bold stripes, and tenacious fight, making them a prized catch among anglers.",

    details2:
      "These extraordinary fish are often found in shrinking ponds during the dry season, with the prime time for sport fishing beginning in October, as the dry season reaches its peak and water sources dwindle. Guided by our experienced tour guide and accompanied by an armed guard for your safety, you’ll spend your days reeling in these remarkable fish. Take breaks to enjoy a packed lunch and stay refreshed with water during short pauses throughout your adventure.e day begins with leisure time at your hotel, allowing you to enjoy the facilities and relax. At 4 PM, you’ll be transferred to the world-renowned Rock Restaurant, perched on a rock formation in the ocean near the Michamvi Peninsula. Dine on fresh seafood and other delicacies, all while surrounded by the stunning waters of the Indian Ocean. After your meal, you’ll return to your hotel for a restful night.",
    image: "/images/Fishing6.jpg",
  },

  {
    day: "Day 11",
    title: "Hot Air Balloon Safari & Village Walk",
    activity: "Activity: Hot Air Balloon | Village Tour",
    accommodation: "Accomodation: Ruaha River Lodge (or similar)",
    details:
      "Start your day with a breathtaking Hot Air Balloon safari, offering panoramic views of Ruaha National Park's vast landscapes and wildlife from above. After landing, immerse yourself in a guided walking safari, providing an intimate encounter with the park’s diverse flora and fauna. In the afternoon, visit a nearby village for a rich cultural exchange, where you’ll have the chance to learn about local traditions, customs, and daily life. Conclude your adventure-filled day by returning to your lodge to enjoy a delicious dinner and a peaceful night’s rest.",
    image: "/images/AirBalloon.jpg",
  },

  {
    day: "Day 12",
    title: "Flight to Dar Es Salaam",
    activity: "Activity: Fly back to Dar Es Salaam",
    accommodation: "Accomodation: N/A",
    details:
      "After breakfast, take a morning flight back to Dar es Salaam. Upon arrival, transfer to the airport for your onward journey. Alternatively, spend the evening exploring Dar es Salaam, enjoying the local cuisine and vibrant culture.",
    image: "/images/FishingLast.jpg",
  },
];

const Fishing: React.FC = () => {
  const [openDay, setOpenDay] = useState<number | null>(null);

  const toggleDay = (index: number) => {
    setOpenDay(openDay === index ? null : index);
  };

  return (
    <main className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center text-white">
        <Image
          src="/images/FishingMain.jpg"
          alt="Mikumi and Udzungwa"
          layout="fill"
          objectFit="cover"
          className="absolute z-0"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
        <div className="relative z-20 px-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            12 Days Tanzania Fishing & Safari Escape
          </h1>
        </div>
      </section>

      <main className="bg-white text-gray-900 px-6 py-12 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-orange-700">
          12 Days Tanzania Fishing & Safari Escape
        </h1>

        <div className="mb-4">
          <p>
            <strong>Destinations:</strong> Nyerere and Ruaha National Parks
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
            <span className="text-orange-700">11 Nights</span>
          </p>
        </div>

        <p className="mb-6">
          Discover the ultimate blend of adventure and relaxation with our
          12-day fishing and safari tour through two of Tanzania&apos;s most
          stunning parks, Nyerere National Park (formerly Selous Game Reserve)
          and Ruaha National Park.
        </p>

        <h2 className="text-xl font-bold mb-2 text-orange-700">Highlights:</h2>
        <ul className="list-disc list-inside mb-6">
          <li>
            Nyerere National Park: Experience thrilling game drives and tranquil
            fishing excursions on the mighty Rufiji River. Marvel at the
            abundance of wildlife, from lions and elephants to hippos and
            crocodiles, while soaking in the unspoiled wilderness.
          </li>
          <br></br>
          <li>
            Ruaha National Park: Explore Tanzania&apos;s largest national park,
            home to vast baobab landscapes, impressive predators, and a diverse
            birdlife population. Enjoy guided game drives and river fishing in
            this secluded paradise.
          </li>
        </ul>

        <h2 className="text-xl font-bold mb-2 text-orange-700">
          Fishing Opportunities In both Nyerere and Ruaha, anglers can expect to
          reel in exciting species such as:
        </h2>
        <ul className="list-disc list-inside mb-6">
          <li>
            Catfish: Found in the deep waters of the Rufiji and Ruaha rivers.
          </li>

          <li>
            Tiger Fish: Known for their strength and sharp teeth, these are a
            thrilling catch for sport fishers.
          </li>
          <li>
            Tilapia: A favorite among anglers for their abundance and taste.
          </li>
          <li>
            Yellowfish: A challenging species, adding to the adventure of
            fishing in these pristine rivers.
          </li>
        </ul>

        <h2 className="text-xl font-bold mb-2 text-orange-700">
          What&apos;s Included
        </h2>
        <ul className="list-disc list-inside mb-6">
          <li>Comfortable accommodations in scenic lodges or luxury tents.</li>

          <li>
            Guided fishing excursions on rivers teeming with freshwater species.
          </li>
          <li>
            Daily game drives offering unparalleled wildlife viewing
            opportunities.
          </li>
          <li>
            Internal flights and transfers for a seamless travel experience.
          </li>
          <li>Expert guides ensuring a safe and memorable journey.</li>
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
        <br></br>

        <section className="container mx-auto px-6">
          <div className="flex justify-start mb-12">
            <Image
              src="/images/RomanticSerengetiMap.jpg"
              alt="Weekend Safari"
              width={500} // ~w-64
              height={400} // ~h-40
              className="rounded"
            />
          </div>
        </section>
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
                      <p className="text-gray-700 mt-4 mb-4">{item.details}</p>
                      <p className="text-gray-700 mt-4 mb-4">{item.details2}</p>

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
      <section className="mb-12">
        <h3 className="text-lg font-semibold mb-2">
          Ruaha National Park Accommodations
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-start">
          <Image
            src="/images/Ikukaamp.jpg"
            alt="Ikuka Camp"
            width={300}
            height={200}
            className="rounded-lg"
          />
          <Image
            src="/images/MwagusiCamp.jpg"
            alt="MwagusiCamp"
            width={300}
            height={200}
            className="rounded-lg"
          />
          <Image
            src="/images/Kigelia.jpg"
            alt="Kigelia Camp"
            width={300}
            height={200}
            className="rounded-lg"
          />
          <Image
            src="/images/Mdonya.jpg"
            alt="Mdonya Camp "
            width={300}
            height={200}
            className="rounded-lg"
          />
        </div>
      </section>
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

export default Fishing;
