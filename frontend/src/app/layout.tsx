import type { Metadata } from "next";
import { Petrona, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { TealBackground } from "@/components/TealBackground";

const petrona = Petrona({
  variable: "--font-petrona",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Job Portal | Find Your Dream Role",
  description: "A premium job portal matching top talent with amazing companies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${petrona.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-foreground relative z-0">
        <TealBackground />
        <AuthProvider>
          <Navbar />
          <main className="flex-grow pt-24">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
