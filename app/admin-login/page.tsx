'use client';

import Image from 'next/image';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "./login/action";
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaCompass, 
  FaSafari, 
  FaSun, 
  FaMountain, 
  FaTree, 
  FaShieldAlt,
  FaPaw,
  FaHippo,
  FaDog,
  FaCat,
  FaFish,
  FaDove,
  FaLeaf
} from 'react-icons/fa';
import {  MdLandscape, MdGrass} from 'react-icons/md';
import { GiAfrica } from 'react-icons/gi';

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(0);
  const router = useRouter();

  // Rotating background images
  const backgrounds = [
    "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2070",
    "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?q=80&w=2070",
    "https://images.unsplash.com/photo-1547471080-7cc2caa01f7e?q=80&w=2070",
    "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?q=80&w=2070",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundImage((prev) => (prev + 1) % backgrounds.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await loginAdmin({ email, password });

      if (res?.success) {
        // The server action will redirect, but just in case:
        router.push("/admin/Dashboard");
      } else {
        setError(res?.message || "Login failed");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110 transition-all duration-10000"
          style={{ 
            backgroundImage: `url(${backgrounds[backgroundImage]})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/70" />
      </div>

      {/* Animated Safari Animals in Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float-slow opacity-20">
          <FaPaw className="text-white text-8xl" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float-delay opacity-20">
          <FaCat className="text-white text-7xl" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float-fast opacity-15">
          <FaDog className="text-white text-6xl" />
        </div>
        <div className="absolute bottom-1/3 left-1/4 animate-float-slow opacity-10">
          <FaHippo className="text-white text-6xl" />
        </div>
        <div className="absolute top-1/2 left-1/3 animate-pulse-slow opacity-10">
          <FaFish className="text-white text-6xl" />
        </div>
        <div className="absolute top-1/4 right-1/5 animate-float-slow opacity-15">
          <FaDove className="text-white text-5xl" />
        </div>
        <div className="absolute bottom-1/4 left-1/5 animate-float-fast opacity-10">
          <MdLandscape className="text-white text-6xl" />
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float-slow text-amber-500/20">
        <FaSun className="text-6xl" />
      </div>
      <div className="absolute bottom-20 right-10 animate-float-delay text-amber-500/20">
        <FaMountain className="text-6xl" />
      </div>
      <div className="absolute top-1/2 left-5 animate-float-fast text-green-500/20">
        <FaTree className="text-5xl" />
      </div>
      <div className="absolute bottom-1/3 right-5 animate-float-slow text-orange-500/20">
        <FaCompass className="text-5xl" />
      </div>
      <div className="absolute top-1/3 left-1/3 animate-float-slow text-green-500/15">
        <MdGrass className="text-5xl" />
      </div>
      <div className="absolute bottom-1/2 right-1/4 animate-float-delay text-emerald-500/15">
        <FaLeaf className="text-4xl" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Animated Border Glow */}
        <div className="relative rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 p-[2px] animate-glow">
          <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
            
            {/* Logo Section */}
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative bg-white rounded-2xl p-4 shadow-xl transform group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/ABM Logo-01.png"
                    alt="ABM Tours"
                    width={140}
                    height={55}
                    priority
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Title Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 rounded-full px-4 py-1 mb-4">
                <FaShieldAlt className="text-amber-500 text-sm" />
                <span className="text-amber-500 text-xs font-semibold tracking-wide">ADMIN PORTAL</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-300 text-sm">
                Sign in to manage your safari adventures
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@abmtours.co.tz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-amber-500 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500 rounded-xl p-3 animate-shake">
                  <p className="text-red-300 text-sm text-center">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full group overflow-hidden rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 p-[2px] transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25"
              >
                <div className="relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 transition-all duration-300 group-hover:scale-[0.98]">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-white font-semibold">Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <FaCompass className="text-white group-hover:rotate-12 transition-transform duration-300" />
                      <span className="text-white font-semibold">Begin Your Journey</span>
                      <FaSafari className="text-white group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-xs flex items-center justify-center gap-2">
                <GiAfrica className="text-amber-500" />
                Secure Admin Access Only
                <GiAfrica className="text-amber-500" />
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Text */}
        <div className="text-center mt-8">
          <p className="text-white/40 text-sm tracking-wider">
            © 2024 ABM Tours & Safaris. All rights reserved.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(10px); }
        }
        
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.05); }
        }
        
        @keyframes glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float-delay 5s ease-in-out infinite 1s;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        
        .transition-all-10000 {
          transition: all 10s ease-in-out;
        }
      `}</style>
    </div>
  );
}