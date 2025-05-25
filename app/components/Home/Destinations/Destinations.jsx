'use client';

import React from 'react';
import SectionHeading from '../../Helper/SectionHeading';
import DestinationSlider from './DestinationSlider';
import { motion } from 'framer-motion';

const Destinations = () => {
  return (
    <div className="pt-20 pb-20">
      {/* Animated Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <SectionHeading
          heading="A Visual Journey Through the Heart of Our Tours and Safaris"
          tagline="Explore the wild through our lens, moments from unforgettable tours and safaris."
        />
      </motion.div>

      {/* Slider with Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.3 }}
        className="mt-14 w-[80%] mx-auto"
      >
        <DestinationSlider />
      </motion.div>
    </div>
  );
};

export default Destinations;
