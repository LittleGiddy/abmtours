"use client";
import Image from "next/image";
import { motion } from "framer-motion";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="relative h-[60vh] flex items-center justify-center text-center text-white"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/images/HeroVideo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold">About Our Company</h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-4 text-lg md:text-xl max-w-2xl mx-auto"
          >
            We are dedicated to innovation and excellence, striving to create
            meaningful solutions for our clients and communities.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Company Background Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={container}
        className="py-16 px-6 max-w-5xl mx-auto text-center"
      >
        <motion.h2 variants={item} className="text-3xl font-semibold">
          Our Story
        </motion.h2>
        <motion.p
          variants={item}
          className="mt-4 text-lg text-gray-700"
        >
          ABM Tours and Safaris Ltd was officially registered on June 16, 2023,
          under BRELA with registration number 545389. The company was founded
          to promote domestic and international tourism while preserving and
          showcasing Tanzania&apos;s rich cultural heritage.
        </motion.p>
      </motion.section>

      {/* New Sections (Membership, Services, Team, etc.) */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={container}
        className="py-16 px-6 max-w-5xl mx-auto text-left"
      >
        {/* Membership and Certification */}
        <motion.div variants={item} className="mb-12">
          <h2 className="text-3xl text-blue-950 font-semibold text-center mb-6">
            Membership &amp; Certification
          </h2>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
            <li>Registered with BRELA (Business Registrations and Licensing Agency)</li>
            <li>In partnership with Tanzamerica Safaris for logistical support</li>
          </ul>
        </motion.div>

        {/* Our Services */}
        <motion.div variants={item} className="mb-12">
          <h2 className="text-3xl text-blue-950 font-semibold text-center mb-6">
            Our Services
          </h2>
          <p className="mb-4 text-lg text-gray-700">
            ABM Tours and Safaris Ltd offers a variety of tourism services, including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
            <li>Safari and Adventure Tours – Serengeti, Ngorongoro, Tarangire, Selous, and more</li>
            <li>Tour Planning &amp; Consultation – Custom-made travel packages tailored for local and international tourists</li>
            <li>Historical and Heritage Tours – Visits to Bagamoyo, Zanzibar, Kilwa, and other UNESCO heritage sites</li>
            <li>Eco-Tourism and Sustainable Travel – Promoting responsible tourism to conserve nature and support local communities</li>
            <li>Research &amp; Documentation – Studies on African cultures, traditions, and indigenous heritage</li>
            <li>Cultural Tourism – Engaging experiences with Tanzania&apos;s 120+ ethnic groups, including traditional music, food, language, and attire</li>
          </ul>
        </motion.div>

        {/* Our Team */}
        <motion.div variants={item} className="mb-12">
          <h2 className="text-3xl text-blue-950 font-semibold text-center mb-6">
            Our Team
          </h2>
          <p className="text-lg text-gray-700">
            Our team comprises dedicated professionals passionate about tourism, culture, and customer service. We work with certified tour guides, cultural experts, and local communities to deliver authentic and memorable experiences.
          </p>
        </motion.div>

        {/* Safety Policy */}
        <motion.div variants={item} className="mb-12">
          <h2 className="text-3xl text-blue-950 font-semibold text-center mb-6">
            Safety Policy
          </h2>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
            <li>Partnering with certified tour operators for safe transportation and accommodation</li>
            <li>Providing trained guides and first aid kits for all tours</li>
            <li>Ensuring compliance with Tanzania&apos;s tourism safety regulations</li>
          </ul>
        </motion.div>

        {/* Our Partners */}
        <motion.div variants={item} className="mb-12">
          <h2 className="text-3xl text-blue-950 font-semibold text-center mb-6">
            Our Partners
          </h2>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
            <li>Tanzamerica Safaris – Supporting with vehicles, tour guides, and logistics</li>
            <li>Local hotels, lodges, and eco-resorts</li>
            <li>Cultural institutions and local artisans</li>
          </ul>
        </motion.div>

        {/* Our Clients */}
        <motion.div variants={item} className="mb-12">
          <h2 className="text-3xl text-blue-950 font-semibold text-center mb-6">
            Our Clients
          </h2>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
            <li>Local and international tourists</li>
            <li>Cultural enthusiasts and researchers</li>
            <li>Students and educational institutions</li>
            <li>Corporate and private groups</li>
          </ul>
        </motion.div>

        {/* Projects Portfolio */}
        <motion.div variants={item} className="mb-12">
          <h2 className="text-3xl text-blue-950 font-semibold text-center mb-6">
            Projects Portfolio
          </h2>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
            <li>Community-based tourism initiatives</li>
            <li>Cultural preservation programs</li>
            <li>Social media campaigns for tourism awareness</li>
          </ul>
        </motion.div>

        {/* Our Awards & Recognition */}
        <motion.div variants={item}>
          <h2 className="text-3xl text-blue-950 font-semibold text-center mb-6">
            Our Awards &amp; Recognition
          </h2>
          <p className="text-lg text-gray-700">
            As a young company, we are actively working towards earning industry certifications and awards for our commitment to excellence in tourism and cultural heritage.
          </p>
        </motion.div>
      </motion.section>

      {/* Founders Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={container}
        className="py-16 bg-gray-50 px-6"
      >
        <motion.div variants={item} className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl text-blue-950 font-semibold">
            Meet the Founders
          </h2>
          <motion.div
            variants={container}
            className="mt-12 grid md:grid-cols-2 gap-8"
          >
            <motion.div
              variants={item}
              whileHover={{ y: -10 }}
              className="bg-white p-6 rounded-lg shadow-lg text-center"
            >
              <Image
                src="/images/Agness2.jpg"
                alt="Agness Mdee - CTO"
                width={250}
                height={250}
                className="rounded-full mx-auto"
              />
              <h3 className="mt-4 text-xl font-bold">Agness Mdee</h3>
              <p className="text-gray-600">Founder</p>
            </motion.div>

            <motion.div
              variants={item}
              whileHover={{ y: -10 }}
              className="bg-white p-6 rounded-lg shadow-lg text-center"
            >
              <Image
                src="/images/ossy.jpg"
                alt="Oscar Yesse - CEO"
                width={250}
                height={250}
                className="rounded-full mx-auto"
              />
              <h3 className="mt-4 text-blue-950 text-xl font-bold">
                Oscar Yesse
              </h3>
              <p className="text-gray-600">Managing Director</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default About;
