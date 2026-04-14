'use client';

import React from "react";
import { FaStar, FaGoogle } from "react-icons/fa";
import { motion } from "framer-motion";
import GoogleReviews from "../../GoogleReviews";

const Review = () => {
  return (
    <div className="pt-20 pb-20 flex items-center justify-center flex-col bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950">
      <div className="w-[90%] max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What Our Customers Say
          </h1>
          <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
        </motion.div>

        <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Side - Stats & Review CTA */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">
                Why Travelers Love Us
              </h2>
              <p className="text-white/90 leading-relaxed mb-6">
                Our safari experiences are crafted with care, ensuring every guest 
                leaves with unforgettable memories of Tanzania's breathtaking wildlife 
                and landscapes.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center">
                    <FaStar className="text-yellow-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">4.9 Average Rating</p>
                    <p className="text-white/70 text-sm">Based on hundreds of reviews</p>
                  </div>
                </div>
                
                <button
                  onClick={() => window.open('https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID', '_blank')}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold cursor-pointer flex items-center justify-center gap-3"
                >
                  <FaGoogle className="text-xl" />
                  Write a Review on Google
                </button>
              </div>
            </div>

            {/* Optional: Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                <p className="text-2xl font-bold text-white">500+</p>
                <p className="text-white/70 text-sm">Happy Travelers</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                <p className="text-2xl font-bold text-white">98%</p>
                <p className="text-white/70 text-sm">Recommend Us</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Google Reviews Slider/List */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="overflow-hidden"
          >
            <GoogleReviews />
          </motion.div>
        </div>
      </div>

      {/* Add custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Review;