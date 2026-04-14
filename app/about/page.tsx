"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Award, 
  Users, 
  Shield, 
  Building2, 
  Globe, 
  Camera, 
  ChevronRight,
  Sparkles,
  Compass,
  Heart,
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  CheckCircle,
  Briefcase,
  Trophy,
  Leaf,
  Coffee,
  Sun,
  Mountain,
  Trees,
  Waves,
  Utensils,
  Hotel,
  Car,
  Ship
} from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section with Parallax */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="relative h-[80vh] flex items-center justify-center text-center text-white overflow-hidden"
      >
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transform scale-105"
          >
            <source src="/images/HeroVideo.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
        </div>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-6 max-w-5xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/20">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">Since 2023</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent">
            About Our Company
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed">
            Crafting Unforgettable Safari & Beach Experiences Across Tanzania and Zanzibar
          </p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </motion.section>

      {/* Company Overview */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={container}
        className="py-20 px-6 max-w-6xl mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div variants={item}>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 rounded-full px-4 py-2 mb-6">
              <Compass className="w-4 h-4" />
              <span className="text-sm font-semibold">Who We Are</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
              About{" "}
              <span className="bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">
                ABM Tours & Safaris
              </span>
            </h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              ABM Tours & Safaris Ltd is a Tanzanian-owned tour operator specializing in unforgettable 
              safari and beach experiences across Tanzania and Zanzibar. With decades of industry experience, 
              we design authentic journeys that combine wildlife adventures, cultural encounters, and luxury 
              travel experiences.
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              Our mission is to connect travelers with the natural beauty, wildlife, and rich cultures of 
              Tanzania through professionally organized and responsible tourism.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              From the iconic plains of Serengeti to the turquoise waters of Zanzibar, we create journeys 
              that leave lasting memories.
            </p>
          </motion.div>
          <motion.div
            variants={item}
            className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image
              src="/ABM Logo-01-01.png"
              alt="Tanzania Safari"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </motion.div>
        </div>
      </motion.section>

      {/* Our Story */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={container}
        className="py-20 px-6 bg-gradient-to-r from-blue-950 to-blue-900 text-white"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div variants={item} className="mb-12">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 mb-6">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Our Journey</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h2>
            <div className="w-24 h-1 bg-orange-600 mx-auto mb-8"></div>
          </motion.div>
          <motion.p variants={item} className="text-xl max-w-4xl mx-auto leading-relaxed">
            ABM Tours & Safaris was founded with a passion for showcasing the true beauty of Tanzania to the world. 
            What began as a local tourism initiative has grown into a trusted safari operator serving travelers from 
            across Europe, Asia, and the Americas.
          </motion.p>
          <motion.p variants={item} className="text-xl max-w-4xl mx-auto leading-relaxed mt-6">
            For more than three decades, we have built our reputation through personalized service, experienced guides, 
            and deep knowledge of Tanzania's national parks and coastal destinations.
          </motion.p>
          <motion.p variants={item} className="text-xl max-w-4xl mx-auto leading-relaxed mt-6 font-semibold">
            Today, ABM Tours & Safaris continues to expand while maintaining its core values: authenticity, reliability, 
            and unforgettable travel experiences.
          </motion.p>
        </div>
      </motion.section>

      {/* Services Grid */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={container}
        className="py-20 px-6 max-w-6xl mx-auto"
      >
        <motion.div variants={item} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 rounded-full px-4 py-2 mb-6">
            <Briefcase className="w-4 h-4" />
            <span className="text-sm font-semibold">What We Offer</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive travel services tailored to create your perfect African adventure
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Trees, title: "Wildlife Safaris", desc: "Experience Serengeti, Mikumi, Ngorongoro Crater, Tarangire & Lake Manyara", color: "from-green-600 to-emerald-600" },
            { icon: Waves, title: "Zanzibar Holidays", desc: "Relax on pristine beaches with curated resorts and island excursions", color: "from-blue-600 to-cyan-600" },
            { icon: Heart, title: "Luxury & Honeymoon", desc: "Tailor-made romantic journeys for couples and special occasions", color: "from-rose-600 to-pink-600" },
            { icon: Users, title: "Cultural Tours", desc: "Authentic experiences with local communities and heritage sites", color: "from-amber-600 to-orange-600" },
            { icon: Compass, title: "Private & Custom Safaris", desc: "Fully customized itineraries designed for your interests", color: "from-purple-600 to-indigo-600" },
            { icon: Mountain, title: "Kilimanjaro Trekking", desc: "Professional guided climbs to the roof of Africa", color: "from-slate-600 to-gray-600" },
          ].map((service, idx) => (
            <motion.div
              key={idx}
              variants={item}
              whileHover={{ y: -10 }}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
              <div className="p-8">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <service.icon className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
{/* Certifications & Memberships */}
<motion.section
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={container}
  className="py-20 px-6 bg-gray-50"
>
  <div className="max-w-6xl mx-auto">
    <motion.div variants={item} className="text-center mb-12">
      <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 rounded-full px-4 py-2 mb-6">
        <Building2 className="w-4 h-4" />
        <span className="text-sm font-semibold">Credentials</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Membership & Certifications</h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Fully compliant with Tanzanian tourism regulations and international industry standards
      </p>
    </motion.div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* BRELA */}
      <motion.div
        variants={item}
        whileHover={{ scale: 1.05 }}
        className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all group"
      >
        <div className="w-52 h-52 mx-auto mb-4 relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Image
            src="/images/Brela.jpg"
            alt="BRELA Logo"
            width={620}
            height={620}
            className="relative z-10 object-contain group-hover:scale-110 transition-transform"
          />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">BRELA</h3>
        <p className="text-gray-600 text-sm">Business Registration & Licensing Agency</p>
      </motion.div>

      {/* TTB - Tanzania Tourism Board */}
      <motion.div
        variants={item}
        whileHover={{ scale: 1.05 }}
        className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all group"
      >
        <div className="w-52 h-52 mx-auto mb-4 relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Image
            src="/images/Ttb.jpg"
            alt="Tanzania Tourism Board Logo"
            width={620}
            height={620}
            className="relative z-10 object-contain group-hover:scale-110 transition-transform"
          />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">TTB</h3>
        <p className="text-gray-600 text-sm">Tanzania Tourism Board</p>
      </motion.div>

      {/* TRA - Tanzania Revenue Authority */}
      <motion.div
        variants={item}
        whileHover={{ scale: 1.05 }}
        className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all group"
      >
        <div className="w-52 h-52 mx-auto mb-4 relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Image
            src="/images/TRA.jpg"
            alt="TRA Logo"
            width={620}
            height={620}
            className="relative z-10 object-contain group-hover:scale-110 transition-transform"
          />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">TRA</h3>
        <p className="text-gray-600 text-sm">Tanzania Revenue Authority</p>
      </motion.div>

      {/* Local Licensing */}
      <motion.div
        variants={item}
        whileHover={{ scale: 1.05 }}
        className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all group"
      >
        <div className="w-52 h-52 mx-auto mb-4 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Image
            src="/images/Tz.jpg"
            alt="License Logo"
            width={620}
            height={620}
            className="relative z-10 object-contain group-hover:scale-110 transition-transform"
          />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Local Licensing</h3>
        <p className="text-gray-600 text-sm">International tourism standards</p>
      </motion.div>
    </div>
  </div>
</motion.section>

      {/* Team Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={container}
        className="py-20 px-6 max-w-6xl mx-auto"
      >
        <motion.div variants={item} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 rounded-full px-4 py-2 mb-6">
            <Users className="w-4 h-4" />
            <span className="text-sm font-semibold">Our People</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Passionate experts dedicated to creating unforgettable travel experiences
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <motion.div
            variants={item}
            whileHover={{ y: -10 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden group"
          >
            <div className="relative h-80 overflow-hidden">
              <Image
                src="/images/Agness2.jpg"
                alt="Agness Mdee"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Agness Mdee</h3>
              <p className="text-blue-600 font-semibold mb-4">Founder & Travel Specialist</p>
              <p className="text-gray-600">Passionate about creating authentic cultural experiences and sustainable tourism.</p>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            whileHover={{ y: -10 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden group"
          >
            <div className="relative h-80 overflow-hidden">
              <Image
                src="/images/ossy.jpg"
                alt="Oscar Yesse"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Oscar Yesse</h3>
              <p className="text-blue-600 font-semibold mb-4">Managing Director</p>
              <p className="text-gray-600">Expert in luxury safaris and international tourism operations.</p>
            </div>
          </motion.div>
        </div>

        <motion.div variants={item} className="text-center">
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Our team consists of experienced professional safari guides, travel consultants, itinerary planners, 
            local destination experts, and operations specialists. With deep local knowledge and hospitality 
            experience, our team ensures every journey runs smoothly from arrival to departure.
          </p>
        </motion.div>
      </motion.section>

      {/* Safety & Partners */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={container}
        className="py-20 px-6 bg-gradient-to-r from-gray-900 to-blue-900 text-white"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div variants={item}>
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Your Safety Matters</span>
              </div>
              <h3 className="text-3xl font-bold mb-6">Safety Policy</h3>
              <ul className="space-y-3">
                {[
                  "Professionally trained safari guides",
                  "Regularly maintained safari vehicles",
                  "Compliance with national park regulations",
                  "24/7 travel support for our guests",
                  "Trusted accommodation and service partners",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={item}>
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">Our Network</span>
              </div>
              <h3 className="text-3xl font-bold mb-6">Our Partners</h3>
              <ul className="space-y-3">
                {[
                  "International travel agencies",
                  "Luxury lodges and safari camps",
                  "Zanzibar resorts and hotels",
                  "Local tourism communities",
                  "Travel professionals and influencers",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Project Portfolio with Gallery Button */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={container}
        className="py-20 px-6 max-w-6xl mx-auto"
      >
        <motion.div variants={item} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 rounded-full px-4 py-2 mb-6">
            <Camera className="w-4 h-4" />
            <span className="text-sm font-semibold">Our Work</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Project Portfolio</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover some of our most memorable safari and travel experiences
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[
            { icon: Trees, title: "Luxury Serengeti Migration Safaris", desc: "Witness the greatest wildlife spectacle on earth" },
            { icon: Waves, title: "Zanzibar Honeymoon Packages", desc: "Romantic escapes in paradise" },
            { icon: Mountain, title: "Kilimanjaro Climbing Expeditions", desc: "Conquer Africa's highest peak" },
            { icon: Star, title: "Private VIP Safari Experiences", desc: "Exclusive luxury adventures" },
            { icon: Users, title: "Group Tours & Corporate Travel", desc: "Seamless group experiences" },
            { icon: Heart, title: "Cultural Heritage Tours", desc: "Immersive local encounters" },
          ].map((project, idx) => (
            <motion.div
              key={idx}
              variants={item}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-100"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center mb-4">
                <project.icon className="w-6 h-6 text-blue-900" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h3>
              <p className="text-gray-600">{project.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div variants={item} className="text-center">
          <Link href="/Gallery">
            <button className="group bg-gradient-to-r from-blue-900 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-3">
              <Camera className="w-5 h-5" />
              View Our Gallery
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Awards & Recognition */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={container}
        className="py-20 px-6 bg-gradient-to-r from-amber-50 to-yellow-50"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div variants={item} className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 rounded-full px-4 py-2 mb-6">
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-semibold">Our Achievements</span>
          </motion.div>
          <motion.h2 variants={item} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Awards & Recognition
          </motion.h2>
          <motion.div variants={item} className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              { icon: Star, title: "Positive Reviews", desc: "Outstanding feedback from international travelers" },
              { icon: Award, title: "Industry Recognition", desc: "Long-standing reputation in Tanzanian tourism" },
              { icon: Globe, title: "Global Partnerships", desc: "Connected with travel agents worldwide" },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-md">
                <item.icon className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={container}
        className="py-20 px-6 bg-gradient-to-r from-blue-950 to-blue-900 text-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 variants={item} className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Adventure?
          </motion.h2>
          <motion.p variants={item} className="text-xl mb-8">
            Contact us today to begin planning your dream safari in Tanzania
          </motion.p>
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/BookNow">
              <button className="bg-white text-blue-900 px-8 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Book Your Safari
              </button>
            </Link>
            <Link href="/contact">
              <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300">
                Contact Us
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;