"use client";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What destinations do you offer tours to?",
    answer: "We offer tours to various destinations across Africa, including Kenya, Tanzania, South Africa, and more. Our packages include wildlife safaris, cultural tours, and beach getaways."
  },
  {
    question: "How can I book a safari?",
    answer: "You can book a safari directly through our website by filling and submitting the form, by contacting our customer support, or by visiting our office. We also offer customized itineraries to suit your preferences."
  },
  {
    question: "What is included in the safari packages?",
    answer: "Our safari packages typically include accommodation, meals, guided tours, park entry fees, and transportation. Additional activities can be arranged upon request."
  },
  {
    question: "Do you offer group discounts?",
    answer: "Yes, we offer discounts for group bookings. Contact us for special rates based on the group size and tour package."
  },
  {
    question: "What should I pack for a safari?",
    answer: "We recommend packing lightweight clothing, comfortable shoes, sunscreen, a hat, insect repellent, binoculars, and a camera to capture amazing wildlife moments."
  }
];

const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-3xl font-bold text-blue-950 text-center mb-6"
      >
        Frequently Asked Questions
      </motion.h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="border rounded-lg overflow-hidden"
          >
            <motion.button
              whileHover={{ backgroundColor: "#e5e7eb" }}
              className="w-full flex justify-between items-center p-6 bg-gray-200 text-left font-medium text-lg cursor-pointer"
              onClick={() => toggleAccordion(index)}
            >
              {faq.question}
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaChevronDown />
              </motion.div>
            </motion.button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-6 bg-white border-t text-gray-700 text-base">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FAQAccordion;
