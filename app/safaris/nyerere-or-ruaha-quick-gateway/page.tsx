"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkedAlt,
  FaBinoculars,
  FaHiking,
  FaWater,
  FaFish,
  FaCamera,
  FaUsers,
  FaCalendarAlt,
  FaPlane,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

export default function NyerereRuahaPage() {
  const [showMoreOption1, setShowMoreOption1] = useState(false);
  const [showMoreOption2, setShowMoreOption2] = useState(false);

  const highlights = [
    "Unforgettable wildlife encounters",
    "Boat and walking safaris in Nyerere",
    "Remote and less crowded Ruaha National Park",
    "Cultural village tours",
  ];

  const quickInfo = [
    { icon: FaMapMarkedAlt, label: "Destinations", value: "Nyerere and/or Ruaha" },
    { icon: FaBinoculars, label: "Activities", value: "Game Drives, Walking Safaris, Boat Safaris, etc." },
    { icon: FaCalendarAlt, label: "Best Time", value: "June – October (Dry Season)" },
    { icon: FaPlane, label: "Arrival", value: "Shared/private air transfer from Dar es Salaam or Zanzibar" },
  ];

  const nyerereAccommodations = [
    { src: "/images/Manze.jpg", alt: "Manze Camp" },
    { src: "/images/RufijiCamp.jpg", alt: "Rufiji River Camp" },
    { src: "/images/Kulinda.jpg", alt: "Kulinda Camp" },
    { src: "/images/NyeereCamp.jpg", alt: "Nyerere Camp" },
  ];

  const ruahaAccommodations = [
    { src: "/images/Ikukaamp.jpg", alt: "Ikuka Camp" },
    { src: "/images/MwagusiCamp.jpg", alt: "Mwagusi Camp" },
    { src: "/images/Kigelia.jpg", alt: "Kigelia Camp" },
    { src: "/images/Mdonya.jpg", alt: "Mdonya Camp" },
  ];

  return (
    <main className="bg-white text-gray-800 font-sans">
      {/* Hero Section with Parallax */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/NyererePark.jpg"
            alt="Nyerere National Park safari"
            fill
            className="object-cover scale-105 transition-transform duration-10000"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/40" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-amber-500/20 backdrop-blur-sm text-amber-200 text-sm font-semibold mb-4 border border-amber-400/30">
              Quick Gateway
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
              Nyerere <span className="text-amber-400">&</span> Ruaha
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              Explore Tanzania’s wild southern parks – untamed, vast and unforgettable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Wrapper */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        {/* Overview & Highlights Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-3 text-amber-600 text-sm font-semibold tracking-wider">OVERVIEW</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              A Quick Gateway to the Wild
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              This tour gives you a chance to explore two of Tanzania’s most breathtaking national parks, 
              Nyerere and Ruaha. Each location offers a unique blend of wildlife, landscapes, and unforgettable 
              safari experiences.
            </p>
            <p className="text-gray-600 leading-relaxed">
              From boat safaris along the Rufiji River to walking adventures among baobabs, this quick gateway 
              packs Africa’s raw beauty into a short but intense itinerary.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaBinoculars className="text-amber-600" /> Highlights
            </h3>
            <ul className="space-y-3">
              {highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Quick Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-10">Quick Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickInfo.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md p-5 text-center border border-gray-100 transition-all hover:shadow-lg">
                <div className="w-12 h-12 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-3">
                  <item.icon className="text-amber-600 text-xl" />
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
                <p className="font-semibold text-gray-800 text-sm mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Option 1 – Nyerere National Park */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="text-center mb-8">
            <span className="text-amber-600 text-sm font-semibold">PACKAGE</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Option 1</h2>
            <div className="w-20 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mt-2" />
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left content */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800">3 Nights Nyerere National Park</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Private Walking</span>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Boat Safari</span>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Game Drive</span>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Bird Watching</span>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Fishing</span>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Village Tour</span>
              </div>

              <div className="prose prose-gray text-gray-600">
                <p>
                  Once you arrive at Nyerere National Park airstrip, you will meet our guide who will transfer you 
                  to the lodge/camp. For the next three days, you will discuss with your assigned tour guide any 
                  activities that are planned that day.
                </p>
                <p>
                  Your tour guide may mention going on a game drive, which is usually the highlight of a safari. 
                  Game drives are the quintessential African adventure and allow you to see a wide variety of wildlife 
                  from the comfort of your pop-top roof or open-sided 4WD 4×4 vehicle.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {showMoreOption1 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3 text-gray-600"
                  >
                    <p>
                      Your guide will introduce you to the various African wildlife spotted during your game drive 
                      and share his/her knowledge of the wildlife and their habitats with you. A huge variety of 
                      wildlife can be seen, such as elephants, giraffes, impalas, lions, zebras, wildebeest, hippos, 
                      warthogs, wild dogs, leopards, and waterbuck.
                    </p>
                    <p>
                      Nyerere National Park is one of the very few places in Africa where it is possible to view 
                      wildlife from the water. Boat Safari is a two to three‑hour long boat ride along the Rufiji River, 
                      preferably in the morning or in the afternoon. Here you will see Hippos, Crocodiles, and plentiful 
                      diverse bird species. Monkeys (Blue Monkeys, Savannah Baboons, and Black and White Colobus Monkeys) 
                      are often spotted in the trees along the banks of the river. The boat will stop off on a sandbank 
                      where you can stretch your legs and enjoy a cool drink.
                    </p>
                    <p>
                      Walking safaris are a fantastic way to get close to nature and learn more about the smaller species 
                      and the bush itself. You will get an opportunity to learn about the things you missed from a vehicle 
                      or boat. You will be accompanied by our tour guide and an armed ranger for this two to three hours 
                      tour.
                    </p>
                    <p>
                      Other activities include Birdwatching and Fishing. All meals and local wines will be provided. You 
                      will have all‑inclusive accommodation with three meals daily.
                    </p>
                    <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                      <h4 className="font-bold text-gray-800 mb-2">Sample Itinerary:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>Day 1 – Arrival, get your coffee/tea, then do an evening Game Drive.</li>
                        <li>Day 2 – All day private Game Drive with a picnic lunch.</li>
                        <li>Day 3 – Morning shared Boat Safari then Private Game Drive in the afternoon.</li>
                        <li>Day 4 – Shared air transfer back to Dar Es Salaam or Zanzibar.</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setShowMoreOption1(!showMoreOption1)}
                className="flex items-center gap-1 text-amber-600 font-semibold hover:text-amber-700 transition mt-2"
              >
                {showMoreOption1 ? (
                  <>Show less <FaChevronUp className="w-3 h-3" /></>
                ) : (
                  <>Read more <FaChevronDown className="w-3 h-3" /></>
                )}
              </button>
            </div>

            {/* Right image */}
            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/Nyerere2.jpg"
                alt="Buffalo at Nyerere"
                fill
                className="object-cover hover:scale-105 transition duration-500"
              />
            </div>
          </div>

          {/* Accommodation grid */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaWater className="text-amber-600" /> Nyerere National Park Accommodations
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {nyerereAccommodations.map((acc, idx) => (
                <div key={idx} className="relative h-40 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition">
                  <Image
                    src={acc.src}
                    alt={acc.alt}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">{acc.alt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Option 2 – Ruaha National Park */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-24"
        >
          <div className="text-center mb-8">
            <span className="text-amber-600 text-sm font-semibold">PACKAGE</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Option 2</h2>
            <div className="w-20 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mt-2" />
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800">3 Nights in Ruaha National Park</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Game Drives</span>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Walking Safari</span>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Cultural Experience</span>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Photography</span>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Birdwatching</span>
              </div>

              <div className="prose prose-gray text-gray-600">
                <p>
                  Arrive at Ruaha via shared or private charter where your guide will meet you for transfer to your lodge.
                  Ruaha offers dramatic landscapes and is known for its large elephant and predator populations.
                </p>
                <p>
                  Your days will include morning and afternoon game drives through baobab‑studded wilderness and along the
                  Great Ruaha River.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {showMoreOption2 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3 text-gray-600"
                  >
                    <p>
                      Walking safaris will give you an intimate experience with the bush, guided by an expert and a park ranger.
                      Cultural visits to nearby villages are included where you’ll learn about local traditions and lifestyle.
                    </p>
                    <p>
                      Meals are served at the lodge, offering scenic views and often visited by wildlife like elephants and kudu.
                    </p>
                    <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                      <h4 className="font-bold text-gray-800 mb-2">Sample Itinerary:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>Day 1 – Arrival and sunset Game Drive</li>
                        <li>Day 2 – Full day Game Drive with picnic lunch</li>
                        <li>Day 3 – Walking Safari in the morning, Cultural Visit in the afternoon</li>
                        <li>Day 4 – Final Game Drive and air transfer back</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setShowMoreOption2(!showMoreOption2)}
                className="flex items-center gap-1 text-amber-600 font-semibold hover:text-amber-700 transition mt-2"
              >
                {showMoreOption2 ? (
                  <>Show less <FaChevronUp className="w-3 h-3" /></>
                ) : (
                  <>Read more <FaChevronDown className="w-3 h-3" /></>
                )}
              </button>
            </div>

            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/RuahaLast.jpg"
                alt="Ruaha National Park landscape"
                fill
                className="object-cover hover:scale-105 transition duration-500"
              />
            </div>
          </div>

          {/* Accommodation grid */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaCamera className="text-amber-600" /> Ruaha National Park Accommodations
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ruahaAccommodations.map((acc, idx) => (
                <div key={idx} className="relative h-40 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition">
                  <Image
                    src={acc.src}
                    alt={acc.alt}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">{acc.alt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Call To Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-10 shadow-lg border border-amber-200"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Ready for an unforgettable journey?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Contact us now to customise your Nyerere or Ruaha quick gateway.
          </p>
          <a
            href="/ContactUs"
            className="inline-block bg-blue-950 hover:bg-blue-800 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-all hover:shadow-lg"
          >
            Inquire Now
          </a>
        </motion.div>
      </div>
    </main>
  );
}