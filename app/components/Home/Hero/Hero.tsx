'use client';

import { useRouter } from 'next/navigation';

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
        <h1 className="text-4xl md:text-6xl font-bold">ABM Tours and Safaris Ltd.</h1>
        <p className="mt-4 text-lg md:text-xl">Explore the Unknown with us.</p>

        <button
          onClick={() => router.push('/about')}
          className="px-8 py-2 mt-7 text-white text-base bg-amber-600 hover:bg-amber-700 rounded-lg cursor-pointer md:ml-4"
        >
          See more About Us
        </button>
      </div>
    </div>
  );
};

export default Hero;
