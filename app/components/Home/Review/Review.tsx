'use client';

import React from "react";
import { FaStar, FaGoogle, FaShieldAlt, FaTrophy, FaLeaf, FaCompass } from "react-icons/fa";
import { motion } from "framer-motion";
import Reviews from "./ReviewSlider";

const Review = () => {
  const openGoogleReviewForm = (): void => {
    const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;
    const googleReviewUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;
    window.open(googleReviewUrl, '_blank');
  };

  return (
    <div className="relative pt-20 pb-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2070')",
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/75 via-blue-900/70 to-blue-950/95" />
        
        {/* Decorative Pattern Overlay */}
        <div className="absolute inset-0 opacity-8" style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.4\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          backgroundRepeat: 'repeat'
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 animate-float-slow text-amber-500/10">
          <FaCompass className="text-7xl" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float-delay text-amber-500/10">
          <FaLeaf className="text-6xl" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-pulse-slow text-white/5">
          <FaTrophy className="text-8xl" />
        </div>
      </div>

      <div className="relative z-10 w-[90%] max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm rounded-full px-4 py-1 mb-4 border border-amber-500/30">
            <FaStar className="text-amber-500 text-sm" />
            <span className="text-amber-500 text-xs font-semibold tracking-wide">GUEST EXPERIENCES</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Travelers Say</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Real stories from adventurers who explored Tanzania with us
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mt-6 rounded-full"></div>
        </motion.div>

        <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Stats & Review CTA */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Main Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                  <FaShieldAlt className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Why Travelers Love Us</h2>
                  <p className="text-white/60 text-sm">Excellence in every journey</p>
                </div>
              </div>
              
              <p className="text-white/90 leading-relaxed mb-6">
                Our safari experiences are crafted with care, ensuring every guest 
                leaves with unforgettable memories of Tanzania&apos;s breathtaking wildlife 
                and landscapes.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-amber-600/30 flex items-center justify-center">
                    <FaStar className="text-amber-500 text-lg" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">4.9 Average Rating</p>
                    <p className="text-white/60 text-sm">Based on 500+ authentic reviews</p>
                  </div>
                </div>
                
                <button
                  onClick={openGoogleReviewForm}
                  className="w-full px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold cursor-pointer flex items-center justify-center gap-3 group"
                >
                  <FaGoogle className="text-xl group-hover:scale-110 transition-transform" />
                  Write a Review on Google
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 text-center border border-white/10 hover:bg-white/10 transition-all duration-300">
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">500+</p>
                <p className="text-white/70 text-sm">Happy Travelers</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 text-center border border-white/10 hover:bg-white/10 transition-all duration-300">
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">98%</p>
                <p className="text-white/70 text-sm">Recommend Us</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 text-center border border-white/10 hover:bg-white/10 transition-all duration-300">
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">10+</p>
                <p className="text-white/70 text-sm">Years Experience</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 text-center border border-white/10 hover:bg-white/10 transition-all duration-300">
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">24/7</p>
                <p className="text-white/70 text-sm">Customer Support</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Reviews */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="overflow-hidden"
          >
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-1 border border-white/10">
              <Reviews />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.05; transform: scale(1); }
          50% { opacity: 0.1; transform: scale(1.05); }
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float-delay 5s ease-in-out infinite 1s;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }

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