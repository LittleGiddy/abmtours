import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type Props = {
  slug: string;
  image: string;
  title: string;
  description: string;
};

const NewsCards = ({ slug, title, image, description }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <Link
        href={`/parks/${slug}`}
        className="block max-w-[250px] mx-auto group relative cursor-pointer"
      >
        {/* Image with Overlay */}
        <div className="aspect-square relative">
          <Image
            src={image}
            alt={title}
            width={250}
            height={250}
            className="w-full h-full object-cover rounded-lg"
          />

          {/* Overlay Description */}
          <div className="absolute inset-0 bg-opacity-80 flex items-end p-3 rounded-lg transition-opacity duration-300 group-hover:bg-opacity-60">
            <p className="text-white text-sm">
              {description.substring(0, 40)}...
            </p>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-all">
          {title}
        </h1>
      </Link>
    </motion.div>
  );
};

export default NewsCards;
