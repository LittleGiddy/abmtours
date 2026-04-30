// app/Gallery/page.tsx (or components/Gallery.tsx)
"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";

interface GalleryImage {
  _id: string;
  url: string;
  alt: string;
  caption: string;
  category: string;
  order: number;
}

const categoryIcons: Record<string, string> = {
  safari: "🦁",
  beach: "🏖️",
  mountain: "⛰️",
  culture: "🎭",
};

const ITEMS_PER_PAGE = 6;

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch gallery");
        return res.json();
      })
      .then((data) => {
        // Ensure data is an array
        if (Array.isArray(data)) {
          setImages(data);
        } else {
          console.error("API did not return an array:", data);
          setImages([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load gallery. Please try again later.");
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    if (!Array.isArray(images)) return [];
    const cats = new Set(images.map((img) => img.category));
    return Array.from(cats);
  }, [images]);

  const filteredImages = useMemo(() => {
    if (!Array.isArray(images)) return [];
    if (activeTab === "all") return images;
    return images.filter((img) => img.category === activeTab);
  }, [images, activeTab]);

  const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE);
  const paginatedImages = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredImages.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredImages, currentPage]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">Loading gallery...</div>
    );
  }

  if (error) {
    return <div className="py-20 text-center text-red-500">{error}</div>;
  }

  if (images.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500">
        No gallery images yet. Check back soon!
      </div>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-amber-50/30">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-4 font-serif">
            Tanzania Through Our Lens
          </h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto mb-6 rounded-full" />
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A visual journey into the soul of Africa.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => handleTabChange("all")}
            className={`px-6 py-3 rounded-full text-base font-medium transition-all ${
              activeTab === "all"
                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg"
                : "bg-white/70 text-gray-700 hover:bg-amber-50"
            }`}
          >
            🌍 All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleTabChange(cat)}
              className={`px-6 py-3 rounded-full text-base font-medium transition-all ${
                activeTab === cat
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg"
                  : "bg-white/70 text-gray-700 hover:bg-amber-50"
              }`}
            >
              {categoryIcons[cat] || "📸"} {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {paginatedImages.map((img, idx) => (
              <motion.div
                key={img._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className="group relative rounded-2xl overflow-hidden shadow-md cursor-pointer"
                onClick={() => setSelectedImage(img)}
              >
                <div className="relative aspect-[4/3] bg-gray-200">
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Overlay with caption (visible on hover) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                    <h3 className="text-white text-xl font-bold drop-shadow-md">
                      {img.alt}
                    </h3>
                    {img.caption && (
                      <p className="text-white/90 text-sm mt-1 line-clamp-2">
                        {img.caption}
                      </p>
                    )}
                    <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold bg-amber-600 text-white rounded-full w-fit">
                      {categoryIcons[img.category]} {img.category}
                    </span>
                  </div>
                </div>
                {/* Caption also visible below image */}
                {img.caption && (
                  <div className="p-3 text-center text-sm text-gray-600 italic border-t border-gray-100">
                    {img.caption}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-full ${
                  currentPage === i + 1
                    ? "bg-amber-600 text-white"
                    : "bg-white border"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Lightbox Modal – high z-index */}
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
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="relative max-w-5xl w-full bg-white rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative aspect-video">
                  <Image
                    src={selectedImage.url}
                    alt={selectedImage.alt}
                    fill
                    className="object-contain"
                    sizes="90vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-2xl font-bold">{selectedImage.alt}</h3>
                  {selectedImage.caption && (
                    <p className="text-gray-600 mt-2 italic">
                      {selectedImage.caption}
                    </p>
                  )}
                  <span className="inline-block mt-3 px-3 py-1 text-sm bg-amber-100 text-amber-800 rounded-full">
                    {categoryIcons[selectedImage.category]} {selectedImage.category}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition"
                >
                  ✕
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}