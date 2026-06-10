"use client";

import { Search, Briefcase, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <div className="relative bg-background overflow-hidden border-b border-foreground/10 pt-24 pb-32">
      {/* Very subtle dot pattern instead of blobs */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 text-foreground/80 font-semibold text-xs tracking-wide uppercase mb-8 border border-foreground/10"
        >
          <Zap className="w-3.5 h-3.5" /> A New Standard
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl font-semibold tracking-tight text-foreground sm:text-7xl leading-[1.1]"
        >
          Find work that <br className="hidden sm:block" />
          <span className="text-foreground/40 font-normal">matters.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg text-foreground/60 font-normal leading-relaxed"
        >
          A minimalist board for premium roles. No noise, no spam. Just direct connections between top-tier talent and innovative companies.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 w-full max-w-3xl"
        >
          <div className="flex flex-col sm:flex-row items-center border border-foreground/15 p-1.5 rounded-2xl bg-white shadow-sm focus-within:border-foreground/30 focus-within:ring-4 focus-within:ring-foreground/5 transition-all">
            <div className="flex-grow flex items-center pl-4 w-full sm:w-auto">
              <Search className="h-5 w-5 text-foreground/40" />
              <input
                type="text"
                className="w-full bg-transparent border-0 focus:ring-0 p-3 text-base outline-none text-foreground placeholder-foreground/40"
                placeholder="Job title or keyword"
              />
            </div>
            <div className="hidden sm:block h-6 w-px bg-foreground/10 mx-2"></div>
            <div className="flex-grow flex items-center pl-4 sm:pl-0 w-full sm:w-auto border-t sm:border-t-0 border-foreground/10 mt-2 sm:mt-0 pt-2 sm:pt-0">
              <Briefcase className="h-5 w-5 text-foreground/40" />
              <input
                type="text"
                className="w-full bg-transparent border-0 focus:ring-0 p-3 text-base outline-none text-foreground placeholder-foreground/40"
                placeholder="Location or remote"
              />
            </div>
            <button className="w-full sm:w-auto mt-2 sm:mt-0 bg-foreground text-background px-6 py-3 rounded-xl font-semibold hover:bg-foreground/90 transition-colors text-sm">
              Search
            </button>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-foreground/50">
            <span>Popular:</span>
            <button className="hover:text-foreground transition-colors">Frontend Developer</button>
            <span>&middot;</span>
            <button className="hover:text-foreground transition-colors">Product Designer</button>
            <span>&middot;</span>
            <button className="hover:text-foreground transition-colors">Remote</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
