// app/safaris/[slug]/page.tsx (with animations)
"use client";
import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { FiMapPin, FiChevronDown, FiChevronUp, FiUsers, FiClock, FiCompass } from "react-icons/fi";

// ---------- Types ----------
interface PriceTier {
  minPax: number;
  maxPax: number;
  pricePerPerson: number;
}

interface ItineraryBlock {
  time: string;
  description: string;
  activities?: string[];
}

interface ItineraryDay {
  day: number;
  title: string;
  blocks: ItineraryBlock[];
  meals?: string[];
  overnight?: string;
}

interface Accommodation {
  title: string;
  description: string;
  images: string[];
}

interface TourOption {
  optionTitle: string;
  description: string;
  activities: string;
  itineraryDays: ItineraryDay[];
  mainImage: string;
  accommodation: Accommodation;
  priceType: "fixed" | "tiered" | "contact";
  priceAmount: number | null;
  priceTiers?: PriceTier[];
  showMoreContent?: string;
}

interface PackageData {
  _id: string;
  title: string;
  slug: string;
  heroImage: string;
  mapImage?: string;
  overview: string;
  highlights: string[];
  arrivalText: string;
  quickInfo: string[];
  options: TourOption[];
  includedList?: string[];
  excludedList?: string[];
}

// Raw API response types (to avoid 'any')
interface RawItineraryDay {
  day: number;
  title: string;
  description?: string;
  activities?: string[];
  meals?: string | string[];
  overnight?: string;
  blocks?: ItineraryBlock[];
}

interface RawOption {
  optionTitle: string;
  description: string;
  activities: string;
  itineraryDays: RawItineraryDay[];
  mainImage: string;
  accommodation: Accommodation;
  priceType: "fixed" | "tiered" | "contact";
  priceAmount: number | null;
  priceTiers?: PriceTier[];
  showMoreContent?: string;
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

export default function SafariDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [packageData, setPackageData] = useState<PackageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeOption, setActiveOption] = useState(0);
  const [openDayIndex, setOpenDayIndex] = useState<number | null>(0);
  const [selectedTier, setSelectedTier] = useState<PriceTier | null>(null);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await fetch(`/api/packages?slug=${slug}`);
        if (!res.ok) throw new Error("Failed to fetch package");
        const data = await res.json();

        if (!data || !data.options) {
          setError("Package not found or has no options.");
          setLoading(false);
          return;
        }

        const normalizedOptions = (data.options as RawOption[]).map((opt) => {
          let itineraryDays: ItineraryDay[] = opt.itineraryDays || [];
          if (itineraryDays.length > 0 && !itineraryDays[0].blocks) {
            itineraryDays = itineraryDays.map((day: RawItineraryDay) => ({
              day: day.day,
              title: day.title || "",
              blocks: [{ time: "Full day", description: day.description || "", activities: day.activities || [] }],
              meals: day.meals ? (Array.isArray(day.meals) ? day.meals : [day.meals]) : undefined,
              overnight: day.overnight || "",
            }));
          }
          return {
            ...opt,
            itineraryDays,
            accommodation: opt.accommodation || { title: "", description: "", images: [] },
            showMoreContent: opt.showMoreContent || "",
            priceType: opt.priceType || "fixed",
            priceAmount: opt.priceAmount ?? null,
            priceTiers: opt.priceTiers || [],
          };
        });

        setPackageData({ ...data, options: normalizedOptions });
        setActiveOption(0);
        setOpenDayIndex(0);

        const firstOpt = normalizedOptions[0];
        if (firstOpt.priceType === "tiered" && firstOpt.priceTiers?.length) {
          setSelectedTier(firstOpt.priceTiers[0]);
        }
      } catch (err) {
        console.error(err);
        setError("Could not load safari details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [slug]);

  const toggleDay = (idx: number) => setOpenDayIndex(openDayIndex === idx ? null : idx);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-gray-600 dark:text-gray-300"
        >
          Loading safari details...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-300">Safari not found</div>
      </div>
    );
  }

  const currentOption = packageData.options[activeOption];
  const itineraryDays = currentOption?.itineraryDays || [];
  const accommodation = currentOption?.accommodation || { title: "", description: "", images: [] };
  const priceTiers = currentOption?.priceTiers || [];
  const isTiered = currentOption?.priceType === "tiered" && priceTiers.length > 0;
  const isFixed = currentOption?.priceType === "fixed" && currentOption.priceAmount;
  const showContact = currentOption?.priceType === "contact" || (!isFixed && !isTiered);

  const durationMatch = packageData.title.match(/(\d+)[-\s]*[Dd]ay/);
  const duration = durationMatch ? `${durationMatch[1]} days` : "Multi-day";

  const handleTierSelect = (tier: PriceTier) => {
    setSelectedTier(tier);
  };

  const formatPriceRange = (tiers: PriceTier[]) => {
    if (!tiers.length) return null;
    const prices = tiers.map(t => t.pricePerPerson);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return `$${min.toLocaleString()}`;
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  return (
    <main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-x-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative h-[70vh] md:h-[75vh] flex items-center justify-center text-center text-white overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image
            src={packageData.heroImage}
            alt={packageData.title}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 z-10"></div>
        <div className="relative z-20 px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider bg-white/10 backdrop-blur-md rounded-full border border-white/20"
          >
            Luxury Safari Experience
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-2xl"
          >
            {packageData.title}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 flex flex-wrap justify-center gap-3 text-sm"
          >
            <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full flex items-center gap-2">
              <FiClock className="w-4 h-4" /> {duration}
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full flex items-center gap-2">
              <FiCompass className="w-4 h-4" /> 4x4 Safari Jeep
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full flex items-center gap-2">
              🌿 Best season: June-Oct
            </span>
          </motion.div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-sm text-gray-500 dark:text-gray-400"
        >
          <Link href="/" className="hover:text-orange-600 transition">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/tours-and-safaris" className="hover:text-orange-600 transition">Tours & Safaris</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 dark:text-gray-300">{packageData.title}</span>
        </motion.div>

        {/* Overview & Highlights */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-2 gap-10 md:gap-16 mb-16"
        >
          <motion.div variants={fadeInLeft} className="bg-gray-50 dark:bg-gray-800/50 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-orange-600 dark:text-orange-400 flex items-center gap-2">
              <span className="w-1 h-8 bg-orange-600 rounded-full"></span> Overview
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{packageData.overview}</p>
          </motion.div>
          <motion.div variants={fadeInRight} className="bg-gray-50 dark:bg-gray-800/50 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-orange-600 dark:text-orange-400 flex items-center gap-2">
              <span className="w-1 h-8 bg-orange-600 rounded-full"></span> Highlights
            </h2>
            <ul className="space-y-2">
              {(packageData.highlights || []).map((h, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                >
                  <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                  <span>{h}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Map Section */}
        {packageData.mapImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-orange-600 dark:text-orange-400 flex items-center gap-3">
              <FiMapPin className="w-7 h-7" /> Safari Map
            </h2>
            <div className="relative h-80 md:h-96 w-full rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
              <Image src={packageData.mapImage} alt="Safari Map" fill className="object-contain bg-gray-100 dark:bg-gray-800" />
            </div>
          </motion.div>
        )}

        {/* Options Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-orange-600 dark:text-orange-400">Choose Your Package</h2>
          <div className="flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-700">
            {packageData.options.map((opt, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActiveOption(idx);
                  setOpenDayIndex(0);
                  const newOpt = packageData.options[idx];
                  if (newOpt.priceType === "tiered" && newOpt.priceTiers?.length) {
                    setSelectedTier(newOpt.priceTiers[0]);
                  }
                }}
                className={`px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px ${
                  activeOption === idx
                    ? "border-orange-600 text-orange-600 dark:border-orange-400 dark:text-orange-400"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400"
                }`}
              >
                {opt.optionTitle}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid lg:grid-cols-3 gap-10"
        >
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-12">
            <motion.div variants={fadeInUp} className="bg-white dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 md:p-8">
              <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">{currentOption.optionTitle}</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{currentOption.description}</p>
              {currentOption.activities && (
                <div className="mt-5 bg-amber-50 dark:bg-amber-900/30 p-4 rounded-xl border-l-4 border-amber-500">
                  <span className="font-semibold text-amber-800 dark:text-amber-300">Activities: </span>
                  <span className="text-gray-700 dark:text-gray-200">{currentOption.activities}</span>
                </div>
              )}
            </motion.div>

            {/* Itinerary Accordion */}
            <motion.div variants={fadeInUp}>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-orange-600 dark:text-orange-400 flex items-center gap-2">
                <span className="text-3xl">🗓️</span> Detailed Itinerary
              </h3>
              <div className="space-y-4">
                {itineraryDays.length > 0 ? (
                  itineraryDays.map((day, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm transition-all hover:shadow-md"
                    >
                      <button
                        onClick={() => toggleDay(idx)}
                        className="w-full flex justify-between items-center p-5 bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
                      >
                        <span className="font-bold text-lg flex items-center gap-2">
                          <span className="bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 w-8 h-8 rounded-full flex items-center justify-center text-sm">Day {day.day}</span>
                          <span>{day.title}</span>
                        </span>
                        {openDayIndex === idx ? <FiChevronUp className="text-gray-500" /> : <FiChevronDown className="text-gray-500" />}
                      </button>
                      <AnimatePresence>
                        {openDayIndex === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="p-5 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                          >
                            {day.blocks.map((block, bIdx) => (
                              <div key={bIdx} className="mb-5 last:mb-0">
                                <h4 className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                                  <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                                  <span>{block.time}</span>
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300 mt-2 ml-4">{block.description}</p>
                                {block.activities && block.activities.length > 0 && (
                                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 ml-4">
                                    <span className="font-medium">Activities:</span> {block.activities.join(", ")}
                                  </div>
                                )}
                              </div>
                            ))}
                            {day.meals && day.meals.length > 0 && (
                              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 border-t pt-3 flex gap-2">
                                <span className="font-medium">🍽️ Meals:</span> <span>{day.meals.join(", ")}</span>
                              </div>
                            )}
                            {day.overnight && (
                              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex gap-2">
                                <span className="font-medium">🏨 Overnight:</span> <span>{day.overnight}</span>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-gray-500 dark:text-gray-400 italic p-6 bg-gray-50 dark:bg-gray-800/30 rounded-xl text-center">
                    Detailed itinerary coming soon.
                  </div>
                )}
              </div>
            </motion.div>

            {/* Accommodation Gallery */}
            {accommodation.images.length > 0 && (
              <motion.div variants={fadeInUp}>
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-orange-600 dark:text-orange-400 flex items-center gap-2">
                  <span className="text-3xl">🏨</span> Accommodation
                </h3>
                {accommodation.title && <h4 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{accommodation.title}</h4>}
                {accommodation.description && <p className="text-gray-600 dark:text-gray-400 mb-6">{accommodation.description}</p>}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {accommodation.images.map((img, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.03 }}
                      className="relative h-44 rounded-xl overflow-hidden shadow-md group cursor-pointer"
                    >
                      <Image src={img} alt={`Accommodation ${i}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Inclusions / Exclusions */}
            {(packageData.includedList?.length || packageData.excludedList?.length) && (
              <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-800/30 p-6 md:p-8 rounded-2xl">
                {packageData.includedList && packageData.includedList.length > 0 && (
                  <div>
                    <h4 className="font-bold text-green-700 dark:text-green-400 text-lg mb-3 flex items-center gap-2">✓ Included</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      {packageData.includedList.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                )}
                {packageData.excludedList && packageData.excludedList.length > 0 && (
                  <div>
                    <h4 className="font-bold text-red-700 dark:text-red-400 text-lg mb-3 flex items-center gap-2">✗ Excluded</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      {packageData.excludedList.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {/* Extra Content */}
            {currentOption.showMoreContent && (
              <motion.div variants={fadeInUp} className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-xl italic text-gray-600 dark:text-gray-400 border-l-4 border-orange-400">
                {currentOption.showMoreContent}
              </motion.div>
            )}
          </div>

          {/* Sticky Price Card */}
          <div className="lg:sticky lg:top-8 self-start">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6 space-y-5">
                <div className="text-center">
                  {isTiered && priceTiers.length > 0 && (
                    <>
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="text-3xl font-bold text-green-600 dark:text-green-400"
                      >
                        {formatPriceRange(priceTiers)} USD
                      </motion.div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">per person (depending on group size)</div>
                      <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">*Excludes flights & visas</div>
                    </>
                  )}
                  {isFixed && (
                    <>
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-4xl font-bold text-green-600 dark:text-green-400"
                      >
                        ${currentOption.priceAmount!.toLocaleString()} USD
                      </motion.div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">per person sharing</div>
                      <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">*Excludes flights & visas</div>
                    </>
                  )}
                  {showContact && (
                    <div className="text-2xl font-semibold text-orange-600 dark:text-orange-400">Custom Price</div>
                  )}
                </div>

                {isTiered && priceTiers.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <label className="block font-semibold mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <FiUsers /> Group size
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {priceTiers.map((tier, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleTierSelect(tier)}
                          className={`p-2 text-sm rounded-lg border transition-all duration-200 ${
                            selectedTier === tier
                              ? "bg-orange-600 text-white border-orange-600 shadow-md"
                              : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-500"
                          }`}
                        >
                          {tier.minPax}-{tier.maxPax} pax: ${tier.pricePerPerson}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href={`/BookNow?package=${packageData.slug}`}
                    className="block w-full text-center bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    {isFixed || isTiered ? "Book Now" : "Request Quote"}
                  </Link>
                </motion.div>

                <div className="text-center">
                  <Link href="/ContactUs" className="inline-block text-center border border-gray-300 dark:border-gray-600 py-2.5 px-4 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    Send Inquiry
                  </Link>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                  Professional guide • 4x4 vehicle • Meals as indicated
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center text-sm text-gray-600 dark:text-gray-400"
            >
              <p className="font-medium">Need help choosing?</p>
              <Link href="/ContactUs" className="text-orange-600 dark:text-orange-400 hover:underline mt-1 inline-block">
                Talk to a safari expert →
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-8 md:p-12 shadow-xl">
            <motion.h3
              initial={{ scale: 0.95 }}
              whileInView={{ scale: 1 }}
              className="text-2xl md:text-3xl font-bold text-white mb-3"
            >
              Ready for an unforgettable adventure?
            </motion.h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">Let us customise your safari experience to match your dreams.</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Link href="/ContactUs" className="inline-block bg-white text-orange-700 py-3 px-8 rounded-full text-lg font-semibold hover:shadow-lg transition">
                Get a Custom Quote
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}