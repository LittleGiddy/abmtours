import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

type Props = {
  image: string;
  title: string;
  description: string;
};

const WhyUsCard = ({ image, title, description }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }} // triggers when 30% of card is in view
    >
      <Image
        src={image}
        width={90}
        height={90}
        alt="image"
        className="mx-auto"
      />
      <h1 className="mt-6 text-center text-gray-900 font-medium text-xl">
        {title}
      </h1>
      <p className="mt-2 text-center text-s font-medium text-gray-400">
        {description}
      </p>
    </motion.div>
  );
};

export default WhyUsCard;
