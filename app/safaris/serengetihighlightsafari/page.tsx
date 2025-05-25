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
    title: "Arrival and Lake Manyara Transfer",
    activity: "Activity:  Safari Dining | Visit Local Markets | Walking Safari",
    accommodation: "Accomodation: Manyara Secret Lodge (or similar)",
    details2: "Arrival and Lake Manyara Transfer",

    details:
      "Upon arrival at Kilimanjaro International Airport (JRO) or Dar Es Salaam International Airport, you will be warmly welcomed by your professional safari guide, who will assist with your luggage and provide a short briefing on your upcoming adventure. You will then be transferred to your luxurious lodge in Arusha, where you can unwind and refresh. Once settled, embark on an immersive tour of Arusha, offering a glimpse into local Tanzanian life before your safari begins. Explore vibrant markets, coffee plantations, and cultural landmarks, gaining insight into the country’s rich traditions. As the evening approaches, indulge in a delightful dinner with a backdrop of the savannah’s golden sunset, followed by a peaceful night’s rest at your lodge, ensuring you are well-rested for the adventure ahead.",
    image: "/images/Day1Quick.jpg",
  },

  {
    day: "Day 2",
    title: " Tarangire National Park",
    activity:
      "Game Drives | Baobab Tree Walk & Picnic Lunch | Birdwatching Safari",
    accommodation: "Accomodation: Acacia Farm Lodge (or similar)",
    details:
      "After a hearty breakfast, your guide will provide a safari briefing before setting off for Tarangire National Park, a hidden gem known for its massive elephant herds, ancient baobab trees, and abundant wildlife. As you enter the park, be prepared to see lions, leopards, cheetahs, giraffes, zebras, and large buffalo herds gathering near the Tarangire River, the park’s lifeline.",
    details4:
      "At midday, take a break for a scenic picnic lunch, surrounded by breathtaking views of the savannah, before continuing with your afternoon game drive. If you’re a bird lover, keep an eye out for some of the 550+ bird species, making Tarangire a paradise for birdwatching.",
    details6:
      "For those interested in cultural immersion, an optional visit to a Maasai or Barabaig village can be arranged. Engage with local tribes, learn about their customs, and experience their rich heritage firsthand.As the sun begins to set, return to your lodge for a delicious dinner and a restful overnight stay, preparing for the adventures ahead.",
    image: "/images/Tarangire.jpg",
  },

  {
    day: "Day 3 & 4",
    title: " Serengeti National Park",
    activity:
      "Activity: Guided Safari Driving | Big 5 Safari | Hot Air Balloon Safari",
    accommodation: "Accomodation: Nyota Luxury Lodge (or similar)",
    details:
      "After breakfast, embark on a scenic drive to Serengeti National Park, passing through the stunning landscapes of the Ngorongoro Conservation Area. Along the way, you may spot elephants, zebras, and antelopes roaming freely, offering a glimpse of the incredible wildlife to come.",
    details4:
      "Upon reaching Central Serengeti, the heart of Tanzania’s most famous national park, your adventure truly begins. The Seronera Valley, often referred to as the 'Big Cat Capital of Africa,' is home to a high concentration of lions, leopards, and cheetahs. Keep your camera ready for unforgettable sightings of predators stalking their prey, elephants wandering through the grasslands, and towering giraffes grazing on acacia trees.",
    details6:
      "Enjoy a picnic lunch in the wilderness, taking in the sights and sounds of the Serengeti before continuing your afternoon game drive, exploring diverse landscapes ranging from golden plains to rocky outcrops known as kopjes, where lions love to bask in the sun. As dusk falls, arrive at your lodge for a delightful dinner and a night under the starlit African sky.",

    details5: "Day 4",
    details8:
        "Wake up before dawn for a once-in-a-lifetime hot air balloon safari, offering a breathtaking aerial view of the Serengeti at sunrise. Watch as the vast plains come alive with wildlife, from elephants and giraffes to prowling big cats and migrating wildebeest. After gently landing, celebrate with a champagne breakfast in the heart of the wilderness.",

    details9: "Continue with a full-day game drive, exploring the Seronera region, famous for its resident predators and abundant wildlife. Spend the day tracking cheetahs sprinting across the plains, elephants bathing in watering holes, and herds of antelope gracefully moving through the grasslands. As the day comes to an end, return to your lodge for a delicious dinner and a relaxing night’s sleep, preparing for your next adventure.",

    image: "/images/Day4Highlight.jpg",
  },

  {
    day: "Day 5 & 6",
    title: " Ngorongoro Highlands and Crater",
    activity:
      "Activity: Guided Safari Driving | Visit Local Markets | Ngorongoro Crater",
    accommodation: "Marera Valley Lodge (or similar)",

    details:
      "After breakfast, depart for the Ngorongoro Highlands, a landscape of rolling green hills, Maasai villages, and breathtaking views. Along the way, stop for a cultural visit to a traditional Maasai village, where you can interact with the Maasai people, learn about their ancient customs, and witness their traditional dances and ceremonies.",
    details4:
      "If time allows, visit Olduvai Gorge, one of the most important paleoanthropological sites in the world, where some of the earliest human fossils were discovered. Enjoy a picnic lunch while learning about the fascinating history of early human civilization.",
      details1:
      "In the afternoon, continue your journey toward the Ngorongoro Conservation Area, arriving at your lodge for a relaxing evening, a gourmet dinner, and a peaceful overnight stay.",
    details5: "Day 6",
    details7: "Ngorongoro Crater – Guided Safari",
    details8:
      "Wake up early for a guided game drive in the Ngorongoro Crater, one of Africa’s most incredible wildlife destinations. Often called the Eighth Wonder of the World, the crater is home to over 25,000 animals, including the rare black rhino, lions, elephants, buffaloes, and hippos.",

    details9: "Descend into the crater for a full day of game viewing, enjoying a picnic lunch on the crater floor amidst breathtaking scenery. Keep an eye out for cheetahs hunting on the open plains, hyenas lurking nearby, and flocks of flamingos gathered around the soda lakes. After an unforgettable safari, ascend from the crater and head back to your lodge for a farewell dinner and a night of relaxation.",

    image: "/images/Day6Highlight.jpg",
  },

  {
    day: "Day 7",
    title: "  Lake Manyara & Departure",
    activity: "Activity: Game Drive | Visit Local Markets | Walking Safari",
    accommodation: "Manyara Secret Lodge (or similar)",

    details:
      "On your final day, visit Lake Manyara National Park, famous for its tree-climbing lions, diverse birdlife, and breathtaking lake views. Spot flamingos, pelicans, and hippos along the lake’s shores, and, if lucky, see lions lounging in acacia trees.",
    details4:
      "After a scenic picnic lunch, you will be transferred back to Arusha or Kilimanjaro International Airport, marking the end of an incredible safari adventure.",
    image: "/images/Day7Highlight.jpg",
  },
];

const SerengetiHighlightSafari: React.FC = () => {
  const [openDay, setOpenDay] = useState<number | null>(null);

  const toggleDay = (index: number) => {
    setOpenDay(openDay === index ? null : index);
  };

  return (
    <main className="bg-white text-gray-900">
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center text-white">
        <Image
          src="/images/SerengetiHighlightsMain.jpg"
          alt="Mikumi and Udzungwa"
          layout="fill"
          objectFit="cover"
          className="absolute z-0"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
        <div className="relative z-20 px-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            Serengeti Highlights Safari
          </h1>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <h1 className="mb-4">
          Embark on an unforgettable 7-day safari through Tanzania’s Northern
          Circuit, exploring the iconic Ngorongoro Crater, the vast Serengeti,
          and diverse wildlife reserves like Tarangire and Lake Manyara. This
          adventure offers thrilling game drives, breathtaking landscapes, rich
          cultural experiences, and a once-in-a-lifetime hot air balloon safari
          over the Serengeti.
        </h1>
      </section>

      {/* Overview Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Medium Image */}
          <section className="container mx-auto px-6">
            <div className="flex justify-start mb-12">
              <Image
                src="/images/SerengetiHighlightsMap.jpg"
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
                <strong>Destinations:</strong> Arusha | Tarangire | Serengeti |
                Ngorongoro | Lake Manyara
              </li>
              <li>
                <strong>Duration:</strong> 6 Nights
              </li>
              <li>
                <strong>Price: </strong>
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
                      <p className="text-gray-700 mt-4 mb-4">{item.details4}</p>
                      <p className="text-gray-700 mt-4 mb-4">{item.details1}</p>
                      <p>
                        <strong>
                          <p className="text-gray-800 mt-4 mb-4">
                            {item.details5}
                          </p>
                        </strong>
                      </p>
                      <p className="text-gray-700 mt-4 mb-4">{item.details6}</p>
                      <p className="text-gray-700 mt-4 mb-4">{item.details7}</p>
                      <p className="text-gray-700 mt-4 mb-4">{item.details8}</p>
                      <p className="text-gray-700 mt-4 mb-4">{item.details9}</p>
                      
                

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
              <li>Meals and Accommodations as per itinerary</li>
              <li>Private game viewing activity on Safari</li>
              <li>All Park Fees</li>
              <li>All Transfers per the itinerary (Private & Shared)</li>
              <li>
                Flying Doctor medical insurance (incl. emergency evacuation)
              </li>
              <li>Our guide will be with you all the time</li>
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

export default SerengetiHighlightSafari;
