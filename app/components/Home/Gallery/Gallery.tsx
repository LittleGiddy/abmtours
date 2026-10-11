// components/Home/Gallery/Gallery.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import { Globe, PawPrint, Waves, Mountain, Landmark, Camera, X } from "lucide-react";
import { DEFAULT_SECTIONS } from "@/lib/siteContent";

interface GalleryImage {
  _id: string;
  url: string;
  alt: string;
  caption: string;
  category: string;
  order: number;
}

const categoryIcons: Record<string, LucideIcon> = {
  safari: PawPrint,
  beach: Waves,
  mountain: Mountain,
  culture: Landmark,
};

const CatIcon = ({ cat, className }: { cat: string; className?: string }) => {
  const Icon = categoryIcons[cat] || Camera;
  return <Icon className={className} />;
};

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [content, setContent] = useState(DEFAULT_SECTIONS.gallery);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch gallery");
        return res.json();
      })
      .then((data) => {
        setImages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("/api/site-content?key=gallery")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.heading === "string" && data.heading.trim()) {
          setContent({ heading: data.heading, tagline: data.tagline || "" });
        }
      })
      .catch(() => {});
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(images.map((img) => img.category).filter(Boolean));
    return Array.from(cats);
  }, [images]);

  const filteredImages = useMemo(() => {
    if (activeTab === "all") return images;
    return images.filter((img) => img.category === activeTab);
  }, [images, activeTab]);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-100 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-blue-950 mb-4">
            {content.heading}
          </h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto mb-4 rounded-full" />
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            {content.tagline}
          </p>
        </motion.div>

        {loading ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="break-inside-avoid rounded-xl bg-gray-200 animate-pulse"
                style={{ height: 220 + (i % 3) * 60 }}
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500 py-12">
            Could not load gallery. Please try again later.
          </p>
        ) : images.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            No gallery images yet. Check back soon!
          </p>
        ) : (
          <>
            {/* Category filters */}
            {categories.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex flex-wrap justify-center gap-2 md:gap-4 mb-10 md:mb-12"
              >
                {["all", ...categories].map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(category)}
                    className={`px-5 md:px-6 py-2 rounded-full text-sm capitalize transition-all flex items-center gap-1.5 ${
                      activeTab === category
                        ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg font-medium"
                        : "bg-white shadow-md text-blue-950 hover:bg-amber-50"
                    }`}
                  >
                    {category === "all" ? (
                      <Globe className="w-4 h-4" />
                    ) : (
                      <CatIcon cat={category} className="w-4 h-4" />
                    )}
                    {category}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Masonry grid */}
            <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
            >
              {filteredImages.map((image) => (
                <motion.div
                  key={image._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedImage(image)}
                  className="break-inside-avoid relative group overflow-hidden rounded-xl shadow-lg cursor-pointer"
                >
                  <div className="relative w-full aspect-[4/3] bg-gray-200">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="w-full h-auto transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 w-full">
                      <h3 className="text-white text-lg md:text-xl font-bold drop-shadow-md">
                        {image.alt}
                      </h3>
                      {image.caption && (
                        <p className="text-white/80 text-xs md:text-sm mt-1 line-clamp-2">
                          {image.caption}
                        </p>
                      )}
                      {image.category && (
                        <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 text-xs font-semibold bg-amber-600 text-white rounded-full">
                          <CatIcon cat={image.category} className="w-3.5 h-3.5" />
                          {image.category}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12 md:mt-16"
            >
              <a
                href="/Gallery"
                className="inline-block px-8 py-3 bg-amber-600 text-white rounded-full font-medium hover:bg-amber-700 transition-colors shadow-lg hover:shadow-xl"
              >
                View Full Gallery
              </a>
            </motion.div>
          </>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="relative max-w-5xl w-full bg-white rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video bg-gray-100">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.alt}
                  fill
                  className="object-contain"
                  sizes="90vw"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg md:text-2xl font-bold">{selectedImage.alt}</h3>
                {selectedImage.caption && (
                  <p className="text-gray-600 mt-2 italic text-sm md:text-base">
                    {selectedImage.caption}
                  </p>
                )}
                {selectedImage.category && (
                  <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 text-sm bg-amber-100 text-amber-800 rounded-full">
                    <CatIcon cat={selectedImage.category} className="w-4 h-4" />
                    {selectedImage.category}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;