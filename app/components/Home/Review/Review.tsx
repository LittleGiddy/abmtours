'use client';

import React from "react";
import { FaStar } from "react-icons/fa";
import ReviewSlider from "./ReviewSlider";
import { motion } from "framer-motion";

const Review = () => {
  return (
    <div className="pt-20 pb-20 flex items-center justify-center flex-col bg-blue-950">
      <div className="w-[80%] mx-auto grid items-center grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Animated Text Content */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h1 className="text-2xl font-semibold text-white">
            What Do our Customers say about Us?
          </h1>
          <p className="mt-6 text-white">
            Our safari was an unforgettable adventure! The guides were
            knowledgeable, friendly, and made every moment special. We saw
            breathtaking wildlife and stunning landscapes. Highly recommend this
            team for anyone seeking an authentic safari experience!
          </p>

          {/* Ratings */}
          <div className="mt-6 flex items-center space-x-6">
            <div>
              <p className="text-2xl font-bold text-white">4.88</p>
              <p className="text-white mb-2">Overall Rating</p>
              <div className="flex items-center">
                <FaStar className="text-amber-600" />
                <FaStar className="text-amber-600" />
                <FaStar className="text-amber-600" />
                <FaStar className="text-amber-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Animated Review Slider */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.3 }}
          className="overflow-hidden"
        >
          <ReviewSlider />
        </motion.div>
      </div>
    </div>
  );
};

export default Review;
