"use client";

import { Search, MapPin, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import heroBg from '@/assets/herobg.png';

export default function Hero() {
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (role) params.set('q', role);
    if (location) params.set('location', location);
    router.push(`/jobs${params.toString() ? '?' + params.toString() : ''}`);
  };

  return (
    <div className="hero-section">
      {/* Background Image */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-15"
        aria-hidden="true"
      >
        <div className="relative w-[750px] max-w-[90vw] h-[750px] max-h-[90vh]">
          <Image
            src={heroBg}
            alt="Hero Background"
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>

      <div className="hero-content">
        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="hero-title"
        >
          Your next job is right here.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="hero-subtitle"
        >
          Whether you're starting out or starting over,<br />
          we've got jobs for you.
        </motion.p>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-10 w-full max-w-4xl"
        >
          <div className="hero-search-bar">
            {/* Role input */}
            <div className="hero-search-input-wrapper">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Search for a role"
                className="hero-search-input"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px bg-gray-200 my-3" />

            {/* Location input */}
            <div className="hero-search-input-wrapper border-t sm:border-t-0 border-gray-100">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="hero-search-input"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            {/* Search button */}
            <button
              onClick={handleSearch}
              className="hero-search-btn"
            >
              Search
            </button>
          </div>
        </motion.div>

        {/* See open roles CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="mt-6"
        >
          <a
            href="/jobs"
            className="hero-cta-btn"
          >
            <Briefcase className="w-4 h-4 text-gray-600" />
            See open roles
          </a>
        </motion.div>
      </div>
    </div>
  );
}
