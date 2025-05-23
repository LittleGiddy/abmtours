// components/Gallery.tsx
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const galleryImages = [
  { id: 1, src: "/images/Wildlife.jpg", alt: "Wildlife Safari", category: "safari" },
  { id: 2, src: "/images/water.jpg", alt: "Zanzibar Beach", category: "beach" },
  { id: 3, src: "/images/Kilimanjaro2.jpg", alt: "Mount Kilimanjaro", category: "mountain" },
  { id: 4, src: "/images/Maasai.jpg", alt: "Maasai Culture", category: "culture" },
  { id: 5, src: "/images/water.jpg", alt: "Serengeti Sunset", category: "safari" },
  { id: 6, src: "/images/water.jpg", alt: "Pristine Waters", category: "beach" },
  { id: 7, src: "/images/water.jpg", alt: "Kilimanjaro Trek", category: "mountain" },
  { id: 8, src: "/images/Maasai.jpg", alt: "Traditional Dance", category: "culture" },
];

const Gallery = () => {
  const [activeImage, setActiveImage] = useState<number | null>(null);

  const handleImagePress = (id: number) => {
    setActiveImage(activeImage === id ? null : id);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-100 to-white">
      <div className="container mx-auto px-4">
        {/* Header with animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-4">Tanzania Through Our Lens</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore breathtaking moments from our adventures across Tanzania&apos;s most iconic landscapes.
          </p>
        </motion.div>

        {/* Interactive Filter Buttons */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {['all', 'safari', 'beach', 'mountain', 'culture'].map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 rounded-full bg-white shadow-md text-blue-950 capitalize transition-all"
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Masonry Grid Gallery */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {galleryImages.map((image) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="break-inside-avoid relative group overflow-hidden rounded-xl shadow-lg"
              onClick={() => handleImagePress(image.id)}
              onTouchStart={() => handleImagePress(image.id)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={600}
                height={400}
                className={`w-full h-auto transition-transform duration-500 ${
                  activeImage === image.id ? 'scale-110' : 'group-hover:scale-110'
                }`}
              />
              {/* Overlay Effect */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent ${
                activeImage === image.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              } transition-opacity duration-300 flex items-end p-6`}>
                <div className={`${
                  activeImage === image.id ? 'translate-y-0' : 'translate-y-4 group-hover:translate-y-0'
                } transition-transform duration-300`}>
                  <h3 className="text-white text-xl font-bold">{image.alt}</h3>
                  <span className="inline-block mt-1 px-3 py-1 text-xs font-semibold bg-blue-600 text-white rounded-full">
                    {image.category}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA with Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <button className="px-8 py-3 bg-blue-950 text-white rounded-full font-medium hover:bg-blue-800 transition-colors shadow-lg hover:shadow-xl">
            View More Memories
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Gallery;
