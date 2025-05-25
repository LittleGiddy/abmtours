"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const northernCircuit = [
  {
    id: 1,
    title: "Quick Serengeti Migration Adventure",
    description: "Experience the Great Migration and abundant wildlife.",
    image: "/images/serengeti main.jpg",
    path: "/safaris/quickserengetimigrationadventure",
  },
  {
    id: 2,
    title: "Serengeti Romantic and Beach gateway",
    description: "From Wild Sunsets to Ocean Breeze",
    image: "/images/ngorongoro.jpg",
    path: "/safaris/serengeti-romantic-and-beach-gateway",
  },
  {
    id: 3,
    title: "Serengeti Highlight Safari",
    description: "Experience Nature’s Greatest Show on Earth",
    image: "/images/serengetirom.jpg",
    path: "/safaris/serengetihighlightsafari",
  },
];

const southernCircuit = [
  {
    id: 4,
    title: "Nyerere or Ruaha Quick gateway",
    description: "One of Africa’s largest protected areas with diverse wildlife.",
    image: "/images/NyerereMain.jpg",
    path: "/safaris/nyerere-or-ruaha-quick-gateway",
  },
  {
    id: 5,
    title: "Safari and Hiking Weekend gateway",
    description: "A remote paradise for safari lovers.",
    image: "/images/Tourists.jpg",
    path: "/safaris/safari-and-hiking-weekend-gateway",
  },
];

const beachVacation = [
  {
    id: 6,
    title: "Zanzibar and Mafia Beach Escape",
    description: "Relax on pristine beaches and explore rich Swahili culture.",
    image: "/images/zanzibar1.jpg",
    path: "/safaris/zanzibar-and-mafia-beach-escape",
  },
];

const fishingSafari = [
  {
    id: 7,
    title: "Fishing Safari",
    description: "Catch legendary Nile perch in remote Tanzanian waters.",
    image: "/images/fishing1.jpg",
    path: "/safaris/fishing",
  },
];

const ToursAndSafaris = () => {
  const sections = [
    { title: "Northern Circuit", data: northernCircuit },
    { title: "Southern Circuit", data: southernCircuit },
    { title: "Beach Vacation", data: beachVacation },
    { title: "Fishing", data: fishingSafari },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center text-white">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/images/HeroVideo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="relative z-10 px-6">
          <h1 className="text-4xl md:text-5xl font-bold">Explore Tanzania</h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            Discover the beauty of Tanzania, from the northern safari circuits to the serene beaches of Zanzibar.
          </p>
        </div>
      </section>

      {/* Destination Sections */}
      {sections.map((section, index) => (
        <div key={index} className="container mx-auto p-6">
          <h2 className="text-3xl font-bold text-center mb-6">{section.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.data.map((card) => (
              <motion.div
                key={card.id}
                className="card bg-white shadow-lg rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <figure className="relative w-full h-48">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={card.id === 1}
                  />
                </figure>
                <div className="p-4 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-700 mb-4">{card.description}</p>
                  </div>
                  <Link href={card.path}>
                    <button className="btn bg-blue-950 text-white hover:bg-blue-700 transition duration-300 px-3 py-1.5 rounded ">
                      View Safari
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          {index < sections.length - 1 && <div className="my-12 border-t border-gray-300"></div>}
        </div>
      ))}
    </div>
  );
};

export default ToursAndSafaris;
