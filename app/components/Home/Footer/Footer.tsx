import Link from "next/link";
import { FaFacebook, FaInstagram, FaTiktok, FaTwitter } from "react-icons/fa";
import Image from "next/image";
import { FaThreads } from 'react-icons/fa6'; // newer Font Awesome 6 additions


export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white py-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Logo & About */}
          <div className="text-left">
          <Link href="/" className="inline-block">
              <Image
                src="/ABM Logo-01.png"
                alt="ABM Tours and Safaris Ltd."
                width={380}
                height={380}
                priority
              />
            </Link>
            <h2 className="text-2xl font-bold">ABM Tours and Safaris</h2>
            <p className="mt-2 text-gray-400">Explore the Unknown with Us.</p>
            {/* LOGO */}
         
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/Tours & Safaris"
                  className="text-gray-400 hover:text-white"
                >
                  Tours & Safaris
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-semibold">Socials</h3>
            <div className="flex space-x-4 mt-3">
              <a
                href="https://www.facebook.com/share/1LcbDtj7tV/"
                className="text-gray-400 hover:text-white"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://x.com/AbmToursandSafarisLtd"
                className="text-gray-400 hover:text-white"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://instagram.com/abm_tours_andsafarisltd"
                className="text-gray-400 hover:text-white"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://tiktok.com/@abmtoursandsafarisltd"
                className="text-gray-400 hover:text-white"
              >
                <FaTiktok size={24} />
              </a>
              <a
                href="https://www.threads.net/abm_tours_andsafariltd"
                className="text-gray-400 hover:text-white"
              >
                <FaThreads size={24} />
                
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-gray-300 border-t border-gray-700 pt-4">
          &copy; {new Date().getFullYear()} ABM Tours and Safaris Ltd. All
          rights reserved.
        </div>
      </div>
    </footer>
  );
}
