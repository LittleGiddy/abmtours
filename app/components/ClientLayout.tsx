"use client"; // Ensure this runs as a client component

import { usePathname } from "next/navigation";
import ResponsiveNav from "./Navbar/ResponsiveNav";
import Footer from "./Home/Footer/Footer";
import ScrollToTop from "./Helper/ScrollToTop";
import WhatsAppFloating from "./Helper/WhatsAppFloating";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // List of routes where Navbar & Footer should be hidden
  const hiddenRoutes = ["/admin", "/dashboard", "admin/manage-destinations", "/auth/login"];
  
  // Check if the current path starts with any of the hidden routes
  const isHidden = hiddenRoutes.some(route => pathname.startsWith(route));

  return (
    <div className="flex flex-col min-h-screen">
      {!isHidden && <ResponsiveNav />}

      {/* Main content */}
      <main className="flex-grow">{children}</main>

      {!isHidden && <WhatsAppFloating />}
      {!isHidden && <ScrollToTop />}
      {!isHidden && <Footer />}
    </div>
  );
}
