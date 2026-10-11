'use client';

import React, { useEffect, useState } from 'react';
import SectionHeading from '../../Helper/SectionHeading';
import DestinationSlider from './DestinationSlider';
import { motion } from 'framer-motion';
import { DEFAULT_SECTIONS } from '@/lib/siteContent';

const Destinations = () => {
  const [content, setContent] = useState(DEFAULT_SECTIONS.destinations);

  useEffect(() => {
    fetch('/api/site-content?key=destinations')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.heading === 'string' && data.heading.trim()) {
          setContent({ heading: data.heading, tagline: data.tagline || '' });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="pt-20 pb-20">
      {/* Animated Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <SectionHeading heading={content.heading} tagline={content.tagline} />
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
