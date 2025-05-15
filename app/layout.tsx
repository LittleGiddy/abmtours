import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ClientLayout from "./components/ClientLayout"; // Import the client component
import TidioScript from "./components/TidioScript";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ colorScheme: "light" }}>
      <body className={${font.className} antialiased flex flex-col min-h-screen bg-white text-black}>
        <script src="//code.tidio.co/ciwnugokeyrqyjbuytxq3obuxpsck58k.js" async></script>
        <ClientLayout>{children}</ClientLayout> {/* Use the client component here */}
      </body>
    </html>
  );
}
