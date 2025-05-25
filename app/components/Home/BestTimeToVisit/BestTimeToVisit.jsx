"use client";
import { motion } from "framer-motion";

const BestTimeToVisit = () => {
  const destinations = [
    {
      title: "National Parks",
      color: "text-gray-900",
      details: [
        { text: "Best Time: June – October (Dry Season) → Best for game viewing & Great Migration" },
        { text: "Wet Season: November – May → Lush landscapes, fewer tourists, great for calving season & birdwatching" },
        { text: "Avoid: March – May (Heavy rains in some areas)", color: "text-gray-900" },
      ],
    },
    {
      title: "Zanzibar & The Coast",
      color: "text-gray-900",
      details: [
        { text: "Best Time: June – October → Cool, dry, perfect for beach relaxation" },
        { text: "Alternative: December – February → Warm & sunny, great for diving & snorkeling" },
        { text: "Avoid: March – May (Heavy rains can limit beach activities)", color: "text-gray-900" },
      ],
    },
    {
      title: "Mount Kilimanjaro",
      color: "text-gray-900",
      details: [
        { text: "Best Time: January – March & June – October → Clear skies & ideal trekking conditions" },
        { text: "Avoid: April – May (Heavy rains make trails slippery & difficult)", color: "text-gray-900" },
      ],
    },
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={container}
      className="pt-20 pb-20 flex items-center justify-center flex-col bg-gray-300"
    >
      <div className="w-[80%] mx-auto grid items-center grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Text content */}
        {destinations.map((destination, index) => (
          <motion.div 
            key={index} 
            variants={item}
            className="mb-6"
          >
            <motion.h2 
              className={`text-lg font-bold ${destination.color}`}
              whileHover={{ scale: 1.02 }}
            >
              {destination.title}
            </motion.h2>
            <motion.ul className="list-disc list-inside text-gray-900">
              {destination.details.map((detail, idx) => (
                <motion.li 
                  key={idx} 
                  className={detail.color || ""}
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                >
                  {detail.text}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default BestTimeToVisit;
