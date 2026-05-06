// app/tours-and-safaris/page.tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface Package {
  _id: string;
  title: string;
  slug: string;
  category: string;
  cardImage: string;
  shortDescription: string;
}

export default function ToursAndSafaris() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/packages");
      if (!res.ok) throw new Error("Failed to fetch packages");
      const data = await res.json();
      setPackages(data);
    } catch (err) {
      setError("Failed to load packages");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  const categories = ["Northern Circuit", "Southern Circuit", "Beach Vacation"];
  const groupedPackages = categories.map(category => ({
    title: category,
    data: packages.filter(pkg => pkg.category === category)
  })).filter(section => section.data.length > 0);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center text-center text-white">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover brightness-50"
        >
          <source src="/images/HeroVideo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
        <div className="relative z-10 px-6 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-light tracking-wide"
          >
            Explore Tanzania
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-px bg-white/60 mx-auto my-6"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-4 text-lg font-light text-white/90 max-w-2xl mx-auto"
          >
            Discover the beauty of Tanzania, from the northern safari circuits to the serene beaches of Zanzibar.
          </motion.p>
        </div>
      </section>

      {/* Destination Sections */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28">
        {groupedPackages.map((section, index) => (
          <motion.div 
            key={index} 
            className="mb-24 md:mb-32 last:mb-0"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide text-gray-800">
                {section.title}
              </h2>
              <div className="w-12 h-px bg-amber-600/40 mx-auto mt-4 mb-3" />
              <p className="text-sm uppercase tracking-wider text-gray-400 font-light">
                Curated Experiences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {section.data.map((card, cardIndex) => (
                <motion.div
                  key={card._id}
                  className="group relative bg-white overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: cardIndex * 0.1 }}
                >
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                    <Image
                      src={card.cardImage}
                      alt={card.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  </div>

                  <div className="pt-6 pb-0 px-0">
                    <h3 className="text-xl font-light tracking-wide text-gray-800 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm font-light text-gray-500 leading-relaxed mb-5">
                      {card.shortDescription}
                    </p>
                    
                    <Link 
                      href={`/safaris/${card.slug}`}
                      className="group/link inline-flex items-center gap-2 text-sm font-light tracking-wider text-gray-600 border-b border-gray-300 pb-0.5 hover:text-amber-700 hover:border-amber-700 transition-all duration-300"
                    >
                      <span>DISCOVER JOURNEY</span>
                      <svg 
                        className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {index < groupedPackages.length - 1 && (
              <div className="mt-20 md:mt-28 flex justify-center">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}