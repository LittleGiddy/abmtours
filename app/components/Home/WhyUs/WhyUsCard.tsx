"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

type Props = {
  image: string;
  title: string;
  description: string;
  className?: string;
};

const WhyUsCard = ({ image, title, description, className = "" }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
      className={`group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden ${className}`}
    >
     

      {/* Gold‑foil top line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-700/60 via-amber-500 to-amber-700/60"></div>

      <div className="relative z-10 p-6 flex flex-col items-center text-center">
        {/* Icon medallion */}
        <div className="relative mb-5">
          <div className="absolute inset-0 rounded-full bg-amber-200/30 blur-xl scale-75 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 to-white shadow-inner flex items-center justify-center border border-amber-300/40 group-hover:border-amber-500/60 transition-all">
            <Image
              src={image}
              alt={title}
              width={56}
              height={56}
              className="object-contain transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </div>

        <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 font-serif tracking-wide">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
          {description}
        </p>

        {/* Subtle compass / leaf accent (optional – keep or remove) */}
        <div className="mt-5 text-amber-600/60 text-lg group-hover:text-amber-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default WhyUsCard;