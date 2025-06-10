import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";
import TidioScript from "./components/TidioScript/TidioScript";
import AdSenseScript from "./components/AdSenseScript"; // ✅ import

const font = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ABM Tours and Safaris Ltd",
  description: "Explore the Unknown with Us",
  icons: {
    icon: "/ABMTRANS-01.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ colorScheme: "light" }}>
      <body className={`${font.className} antialiased flex flex-col min-h-screen bg-white text-black`}>
        <TidioScript />
        <AdSenseScript /> {/* ✅ Inserts AdSense script */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
