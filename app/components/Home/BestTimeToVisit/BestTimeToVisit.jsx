"use client";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaUmbrellaBeach, FaMountain, FaTree } from "react-icons/fa";

const BestTimeToVisit = () => {
  const destinations = [
    {
      title: "National Parks",
      icon: <FaTree className="text-amber-500 text-2xl" />,
      description: "Witness the Great Migration and the Big Five in their prime",
      details: [
        { 
          period: "Best Time: June – October (Dry Season)", 
          summary: "Peak game viewing & Great Migration crossing",
          color: "text-amber-800"
        },
        { 
          period: "Wet Season: November – May", 
          summary: "Lush landscapes, calving season, birdwatching paradise",
          color: "text-gray-700"
        },
        { 
          period: "Avoid: March – May", 
          summary: "Heavy rains in some areas",
          color: "text-gray-500"
        },
      ],
    },
    {
      title: "Zanzibar & The Coast",
      icon: <FaUmbrellaBeach className="text-amber-500 text-2xl" />,
      description: "Turquoise waters and powder‑white beaches",
      details: [
        { 
          period: "Best Time: June – October", 
          summary: "Cool, dry, perfect for beach relaxation",
          color: "text-amber-800"
        },
        { 
          period: "Alternative: December – February", 
          summary: "Warm & sunny, ideal for diving & snorkeling",
          color: "text-gray-700"
        },
        { 
          period: "Avoid: March – May", 
          summary: "Heavy rains can limit beach activities",
          color: "text-gray-500"
        },
      ],
    },
    {
      title: "Mount Kilimanjaro",
      icon: <FaMountain className="text-amber-500 text-2xl" />,
      description: "Roof of Africa – conquer the summit",
      details: [
        { 
          period: "Best Time: January – March & June – October", 
          summary: "Clear skies & ideal trekking conditions",
          color: "text-amber-800"
        },
        { 
          period: "Avoid: April – May", 
          summary: "Heavy rains make trails slippery & difficult",
          color: "text-gray-500"
        },
      ],
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={container}
      className="relative py-24 overflow-hidden bg-gradient-to-br from-white via-amber-50/30 to-white"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="safari" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#b45309" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#safari)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div variants={cardVariants} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-amber-100/50 backdrop-blur-sm rounded-full px-4 py-1.5 border border-amber-200 mb-4">
            <FaCalendarAlt className="text-amber-600 text-sm" />
            <span className="text-amber-800 text-xs font-semibold tracking-wide">PLAN YOUR SAFARI</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-4">
            Best Time to Visit Tanzania
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full mb-5" />
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Timing your journey with nature&apos;s rhythm unlocks the most memorable experiences
          </p>
        </motion.div>

        {/* Cards grid - three columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100"
            >
              {/* Card header with icon and title */}
              <div className="relative p-6 pb-4 bg-gradient-to-br from-blue-50 to-white">
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition">
                  <div className="text-7xl font-serif text-amber-800">“</div>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="mb-3">{dest.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-800 tracking-tight">{dest.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{dest.description}</p>
                  </div>
                </div>
                <div className="mt-4 h-0.5 w-12 bg-amber-400 rounded-full group-hover:w-20 transition-all duration-500" />
              </div>

              {/* Details list */}
              <div className="p-6 space-y-4">
                {dest.details.map((detail, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="shrink-0 mt-0.5">
                      {detail.color.includes("amber") ? (
                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-300 mt-2" />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${detail.color}`}>{detail.period}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{detail.summary}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Decorative bottom border */}
              <div className="h-1 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Trust tip */}
        <motion.div variants={cardVariants} className="text-center mt-12">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
  <span className="inline-block w-1 h-1 rounded-full bg-amber-400" />
  Explore our Tours and Safaris by clicking{" "}
  <a
    href="/tours-and-safaris"
    className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 font-semibold underline underline-offset-2 transition-all duration-200"
  >
    Here
    <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </a>
  <span className="inline-block w-1 h-1 rounded-full bg-amber-400" />
</p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default BestTimeToVisit;