"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const itinerary = [
  {
    day: "Day 1 - 2",
    title: "Arrival & Safari Game Drive",
    activity: "Activity:  Safari Dining | Visit Local Markets | Walking Safari",
    accommodation: "Accomodation: Manyara Secret Lodge (or similar)",
    details2: "Arrival and Lake Manyara Transfer",
    details3: "Hotel Check-In",
    details:
      "Upon your arrival at the airport, your friendly driver-guide will welcome you and transfer you on a scenic three-hour drive to your luxury lodge near the beautiful Lake Manyara. Along the way, enjoy the stunning views of the Tanzanian landscape as you make your way to your lodge.",
    details4:
      "Upon arrival, you’ll check in and have some time to unwind and relax after your journey. In the afternoon, if time allows, you have the option of joining an evening Walking Safari. Accompanied by an armed guide, you'll walk through the park and along the lake shores, taking in the beauty of nature and stretching your legs after the long flight. After your walk, you’ll return to your lodge, where a delicious dinner awaits, followed by a peaceful night’s sleep in the heart of nature.",
    details5: "On Day 2",
    details6:
      "wake up early for a morning game drive in Lake Manyara National Park, a compact yet diverse wildlife haven. Known for its lush forests, vibrant birdlife, and stunning lake views, this park offers ample opportunities to spot wildlife. Watch for flamingos, pelicans, and storks along the shores, and if you’re fortunate, you might even catch a glimpse of the park's famous tree-climbing lions. After your morning adventure, return to your lodge for a hot, hearty lunch. You’ll have some time to relax by the pool or take in the scenic views before your next activity. In the afternoon, you can opt for another game drive, or choose from other exciting activities like a canopy walk, where you’ll stroll along suspended bridges for a bird’s-eye view of the lush forest, or enjoy canoeing on Lake Manyara, offering a unique perspective on the wildlife around the lake. As the day comes to an end, you’ll be transferred back to your lodge for a delicious dinner and a restful night’s sleep, reflecting on the incredible experiences of the day.",
    image: "/images/Day1Quick.jpg",
  },

  {
    day: "Day 3-4",
    title: " Ngorongoro Highlands and Crater",
    activity:
      "Activity: Guided Safari Driving | Visit Local Markets | Ngorongoro Crater",
    accommodation: "Accomodation: Manyara Secret Lodge (or similar)",

    details2: "Early Morning Game Drive",
    details3: "Cultural tour",
    details:
      "Start your day with a hearty breakfast before setting off on a scenic journey toward the Ngorongoro Conservation Area, a UNESCO World Heritage Site and one of Africa’s most breathtaking landscapes. Today’s adventure offers a perfect blend of wildlife encounters, cultural experiences, and historical discoveries, giving you a deeper appreciation of this remarkable region.",
    details4:
      "As you drive through the Ngorongoro Highlands, take in the stunning scenery of rolling grasslands and acacia-dotted plains, where you may spot elephants, zebras, wildebeests, and other wildlife roaming freely. Your journey includes a visit to a traditional Maasai village, where you’ll have the opportunity to interact with the Maasai people, learn about their rich customs, traditional way of life, and deep connection to the land. Witness their colorful attire, rhythmic dances, and ancient cattle-herding traditions that have been preserved for centuries.",
    details5: "Lunch at Olduvai Gorge & Museum - Afternoon",
    details6:
      "Stop at Olduvai Gorge, one of the world’s most important paleoanthropological sites, where some of the earliest human fossils were discovered. Here, you will enjoy a picnic lunch while exploring the site and its fascinating museum, which showcases artifacts that reveal the origins of early human life.",
    details7: "Afternoon Guided Game Drive",
    details8:
      "Afterward, continue your game drive through the diverse landscapes of the conservation area, taking in the stunning vistas and searching for more wildlife along the way. As the day draws to a close, arrive at your lodge for a relaxing evening, followed by a delicious dinner and an overnight stay, preparing for another exciting day ahead.",
    image: "/images/Day4Quick.jpg",
  },

  {
    day: "Day 5-6",
    title: " Serengeti National Park",
    activity:
      "Activity: Guided Safari Driving | Big 5 Safari | Hot Air Balloon Safari",
    accommodation: "Accomodation: Manyara Secret Lodge (or similar)",

    details3: "Group Breakfast",
    details:
      "Begin your day with an unforgettable hot air balloon safari, an experience that offers a breathtaking aerial perspective of the Serengeti at sunrise. You will be picked up from your lodge before dawn and transferred to the launch site, where you’ll watch the balloon being inflated as the sky begins to glow with the first light of day. Once airborne, you’ll float silently above the vast savannah, witnessing the golden plains come to life as animals roam freely below. From majestic elephants to prowling big cats and herds of wildebeest, the panoramic views are simply mesmerizing.",
    details4:
      "After an exhilarating two-hour flight, you’ll gently touch down and receive a special certificate to commemorate this once-in-a-lifetime adventure. To celebrate the experience, indulge in a sumptuous group breakfast served in the heart of the wilderness, with freshly brewed coffee, delicious pastries, and a variety of local and international delights.",
    details5: "Guided Game Drive - Morning & Afternoon",
    details6:
      "With your early morning adventure complete, set out for another morning game viewing in Central Serengeti, famously known as the “Big Cat Capital of Africa.” The Seronera region is a prime wildlife hotspot, teeming with a diverse array of animals. Here, you’ll have incredible opportunities to spot elephants, giraffes, impalas, buffaloes, zebras, and hippos as they navigate their natural habitat. Even after the Great Migration moves through, predators such as lions, leopards, and cheetahs remain in abundance, ensuring thrilling wildlife encounters throughout the year. As the sun begins to set over the Serengeti, return to your lodge for a well-deserved evening of relaxation. Enjoy a delightful dinner under the African sky, reminiscing about the day’s incredible moments before settling in for a peaceful overnight stay.",

    image: "/images/Day4Quick.jpg",
  },

  {
    day: "Day 7-9",
    title: " Zanzibar Beach",
    activity:
      "Activity: Relax on the Beach | Snorkeling & Diving | Discover Stone Town | Dolphin Watching",
    accommodation: "Accomodation: Sultan palace (or similar)",

    details3: "Day 8",
    details:
      "Say goodbye to the Serengeti as you catch a direct flight to Zanzibar Island. When you arrive at Zanzibar Airport, you'll be met by a local representative who will assist you with your luggage and transfer you to the beachfront luxury hotel you choose, where you will stay for the next five days. Here, you will be shown to your room and you will unpack your bags and make yourself at home, enjoy the view, and get ready for your dinner. ",
    details4:
      "On the second day in Zanzibar, you will continue to relax at your hotel, you will spend time at the swimming pool, getting spa treatment or you can sit under the beach chair enjoying the breeze and the ocean view.",
    details5: "Day 9",
    details7: "Stone Town City Tour",
    details8:
      "Explore the historic heart of Zanzibar, Stone Town, a fascinating UNESCO World Heritage Site known for its rich cultural heritage, vibrant markets, and stunning Swahili architecture. Wander through its narrow, winding alleys, where you’ll encounter intricately carved wooden doors, lively bazaars, and centuries-old buildings that tell the story of the island’s Arab, Persian, Indian, and European influences. Immerse yourself in the town’s unique charm as you visit iconic landmarks such as the House of Wonders, the Old Fort, and the former Slave Market. After a delightful lunch at a local restaurant, embark on an enchanting journey to Zanzibar’s famous Spice Plantations. Here, you’ll enjoy a guided tour through lush farms, learning about the origins and uses of exotic spices such as cloves, vanilla, nutmeg, and cinnamon, which have made Zanzibar the Spice Island of the world. Engage your senses by touching, smelling, and even tasting freshly picked spices. Conclude your tour with a hands-on cooking demonstration, where you’ll discover traditional Zanzibari cooking techniques and enjoy the flavors of the island’s rich culinary heritage. After your exciting day of exploration, you’ll be transferred to your luxurious beachfront hotel, where you can unwind and relax. Take in the stunning ocean views, enjoy a refreshing dip in the pool, or simply soak in the serenity of the island. In the evening, indulge in a delicious dinner by the beach, listening to the gentle waves as you reflect on the day’s incredible experiences.",
    details9: "Optional Activities:",
    details10: "-Cooking Class",
    details11: "-Snorkeling at Mnemba Island",
    details12: "-Private Sunset Cruise",

    image: "/images/Day9Quick.jpg",
  },

  {
    day: "Day 10",
    title: " Visit The Rock Hotel and Departure",
    activity: "Activity: Visit The Rock Hotel  and Departure",
    accommodation: "N/A",

    details2: "Hotel Check-Out and Visit The Rock Hotel",
    details3: "Final Shopping at Stone Town",
    details:
      "As your unforgettable Zanzibar adventure comes to an end, our driver will pick you up after you check out from your hotel, ensuring a smooth and comfortable transfer. Your first stop will be the iconic Rock Restaurant, one of Zanzibar’s most famous landmarks. Perched on a rock in the middle of the turquoise waters of the Indian Ocean, this unique dining spot offers breathtaking views and a memorable culinary experience. Here, you’ll have time to savor a delicious seafood lunch or enjoy a refreshing drink while soaking in the stunning scenery. Don’t forget to capture some beautiful photos of this one-of-a-kind location!",
    details4:
      "After your meal, you’ll head to Stone Town, where you’ll have some time to finalize your shopping. Stroll through the bustling markets and charming boutiques, picking up last-minute souvenirs such as handcrafted jewelry, colorful fabrics, spices, and local artwork—perfect keepsakes to remind you of your journey.",
    details5: "Lunch at Olduvai Gorge & Museum - Afternoon",
    details6:
      "Once you’ve completed your shopping, our driver will transfer you to Zanzibar International Airport for your international flight back home. As you depart, take a moment to reflect on the incredible experiences, breathtaking landscapes, and rich cultural encounters that made your trip to Zanzibar truly unforgettable.",
    details7: "Airport Drop-off",
    details8:
      "Afterward, continue your game drive through the diverse landscapes of the conservation area, taking in the stunning vistas and searching for more wildlife along the way. As the day draws to a close, arrive at your lodge for a relaxing evening, followed by a delicious dinner and an overnight stay, preparing for another exciting day ahead.",
    image: "/images/Day10Quick.jpg",
  },
];

const Serengetihighlightsafari: React.FC = () => {
  const [openDay, setOpenDay] = useState<number | null>(null);

  const toggleDay = (index: number) => {
    setOpenDay(openDay === index ? null : index);
  };

  return (
    <main className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center text-white">
        <Image
          src="/images/SerengetiRomanticMain.jpg"
          alt="Mikumi and Udzungwa"
          layout="fill"
          objectFit="cover"
          className="absolute z-0"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
        <div className="relative z-20 px-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            Serengeti Romantic and Beach gateway
          </h1>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <h1 className="mb-4">
          Experience adventure, luxury, and romance in Tanzania as you journey
          through Arusha, Lake Manyara, Ngorongoro, Serengeti, and Zanzibar.
          Explore Arusha’s culture before discovering Lake Manyara’s beauty.
          Witness the wildlife of the Serengeti and Ngorongoro Conservation
          Area, creating unforgettable safari moments. Then, unwind in
          Zanzibar’s tropical paradise, where white sand beaches and
          crystal-clear waters invite you to relax or explore vibrant marine
          life.
        </h1>
      </section>

      {/* Overview Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Medium Image */}
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
          <div>
            <h2 className="text-2xl font-semibold mb-4">Trip Overview</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Destinations:</strong> Arusha | Lake Manyara | Serengeti
                | Zanzibar
              </li>
              <li>
                <strong>Duration:</strong> 9 Nights
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
                      <p>
                        <strong>
                          <p className="text-gray-800 mt-4 mb-4">
                            {item.details3}
                          </p>
                        </strong>
                      </p>
                      <p className="text-gray-700 mt-4 mb-4">{item.details4}</p>
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
                      <p className="text-gray-700 mt-4 mb-4">
                        {item.details10}
                      </p>
                      <p className="text-gray-700 mt-4 mb-4">
                        {item.details11}
                      </p>
                      <p className="text-gray-700 mt-4 mb-4">
                        {item.details12}
                      </p>

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
              <li>All transfers per the itinerary (private & shared)</li>
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

export default Serengetihighlightsafari;
