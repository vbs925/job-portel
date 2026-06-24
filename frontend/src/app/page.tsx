"use client";

import { useEffect } from "react";
import Hero from "@/components/Hero";
import TrustedBy from "@/components/TrustedBy";
import WhyUs from "@/components/WhyUs";
import BetterHiring from "@/components/BetterHiring";
import CurrentOpenings from "@/components/CurrentOpenings";
import GetStarted from "@/components/GetStarted";
import Link from "next/link";
import { motion } from "framer-motion";
import { API } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === 'MANAGER') {
        router.push('/manager/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router]);


  if (isLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-foreground/50 font-medium">Redirecting...</div>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-foreground selection:text-background">
      <Hero />
      
      {/* Why Us — Figma "Our Promise" section */}
      <WhyUs />
      
      {/* Companies hiring here */}
      <TrustedBy />

      {/* Better Hiring — Employer section */}
      <BetterHiring />
      
      {/* Current Openings */}
      <CurrentOpenings />

      {/* Get Started */}
      <GetStarted />
    </div>
  );
}
