'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image'; // ✅ Import the Next.js Image component

import ResponsiveNav from './Navbar/ResponsiveNav';
import Footer from './Home/Footer/Footer';
import ScrollToTop from './Helper/ScrollToTop';
import WhatsAppFloating from './Helper/WhatsAppFloating';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const [showSplash, setShowSplash] = useState(true);

  const hiddenRoutes = [
    '/admin',
    '/dashboard',
    '/admin/manage-destinations',
    '/auth/login',
  ];
  const isHidden = hiddenRoutes.some(route => pathname?.startsWith(route));

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="flex items-center justify-center h-screen bg-white text-black">
        <div className="text-center">
          <Image
            src="/ABM Logo-01.png"
            alt="ABM Logo"
            width={96} // equivalent to Tailwind w-24
            height={96} // equivalent to Tailwind h-24
            className="mx-auto mb-4 animate-bounce"
            priority
          />
          <p className="text-lg font-semibold">Loading ABM Tours and Safaris...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {!isHidden && <ResponsiveNav />}
      <main className="flex-grow">{children}</main>
      {!isHidden && <WhatsAppFloating />}
      {!isHidden && <ScrollToTop />}
      {!isHidden && <Footer />}
    </div>
  );
}
