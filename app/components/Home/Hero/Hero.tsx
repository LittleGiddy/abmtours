'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const Hero = () => {
  const router = useRouter();

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/images/HeroVideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-70"></div>

      {/* Content */}
      <div className="relative z-10 text-white text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold"
        >
          ABM Tours and Safaris Ltd.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-4 text-lg md:text-xl"
        >
          Explore the Unknown with us.
        </motion.p>

        <motion.button
          onClick={() => router.push('/about')}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="px-8 py-2 mt-7 text-white text-base bg-amber-600 hover:bg-amber-700 rounded-lg cursor-pointer md:ml-4"
        >
          See more About Us
        </motion.button>
      </div>
    </div>
  );
};

export default Hero;
