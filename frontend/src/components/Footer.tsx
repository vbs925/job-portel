"use client";

import Link from 'next/link';
import { useState } from 'react';
import { API } from '@/lib/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      await API.post('/newsletter', { email });
      setStatus('success');
      setMessage('Thanks for subscribing to our portal! Stay tuned.');
      setEmail('');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setMessage(err.message || 'Failed to subscribe. Please try again.');
    }
  };

  return (
    <footer className="bg-[#0F766E] text-white pt-20 pb-10 mt-auto">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        {/* Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* 3 Columns for Links */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-[12px] font-bold tracking-[0.15em] uppercase mb-6 text-white">Job Seekers</h3>
              <ul className="space-y-4">
                <li><Link href="#" className="text-[14px] text-white hover:text-white/80 font-light">Browse Jobs</Link></li>
                <li><Link href="#" className="text-[14px] text-white hover:text-white/80 font-light">Create Profile</Link></li>
                <li><Link href="#" className="text-[14px] text-white hover:text-white/80 font-light">Career Resources</Link></li>
                <li><Link href="#" className="text-[14px] text-white hover:text-white/80 font-light">Salary Guide</Link></li>
                <li><Link href="#" className="text-[14px] text-white hover:text-white/80 font-light">Resume Tips</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[12px] font-bold tracking-[0.15em] uppercase mb-6 text-white">Employers</h3>
              <ul className="space-y-4">
                <li><Link href="#" className="text-[14px] text-white hover:text-white/80 font-light">Post a Job</Link></li>
                <li><Link href="#" className="text-[14px] text-white hover:text-white/80 font-light">Search Candidates</Link></li>
                <li><Link href="#" className="text-[14px] text-white hover:text-white/80 font-light">Pricing</Link></li>
                <li><Link href="#" className="text-[14px] text-white hover:text-white/80 font-light">Hiring Resources</Link></li>
                <li><Link href="#" className="text-[14px] text-white hover:text-white/80 font-light">Enterprise</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[12px] font-bold tracking-[0.15em] uppercase mb-6 text-white">Company</h3>
              <ul className="space-y-4">
                <li><Link href="#" className="text-[14px] text-white hover:text-white/80 font-light">About Us</Link></li>
                <li><Link href="#" className="text-[14px] text-white hover:text-white/80 font-light">Community</Link></li>
                <li><Link href="#" className="text-[14px] text-white hover:text-white/80 font-light">Blog</Link></li>
                <li><Link href="#" className="text-[14px] text-white hover:text-white/80 font-light">Careers</Link></li>
                <li><Link href="#" className="text-[14px] text-white hover:text-white/80 font-light">Contact</Link></li>
              </ul>
            </div>
          </div>

          {/* Subscribe Column */}
          <div className="lg:col-span-5 lg:pl-10">
            <h3 className="text-[12px] font-bold tracking-[0.15em] uppercase mb-6 text-white">Stay in the loop</h3>
            <p className="text-[14px] text-white mb-6 font-light">Get job alerts and career tips straight to your inbox.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="your@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading'}
                className="w-full bg-white/10 border border-white/20 rounded-full px-6 py-3 text-[14px] text-white placeholder-white/80 focus:outline-none focus:border-white transition-colors disabled:opacity-50" 
              />
              <button 
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-white text-black font-semibold rounded-full px-6 py-3 text-[15px] hover:bg-gray-100 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
              {message && (
                <p className={`text-[13px] mt-1 ${status === 'success' ? 'text-green-300' : 'text-red-300'}`}>
                  {message}
                </p>
              )}
            </form>
          </div>
          
        </div>

        {/* Middle Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 mb-20">
          <h2 className="text-[56px] md:text-[64px] font-medium leading-[1.1] tracking-tight" style={{ fontFamily: 'var(--font-heading), serif' }}>
            Helping<br />Hands
          </h2>
          <div className="max-w-xs mt-2 md:mt-0 pt-2">
            <p className="text-[14px] text-white font-light leading-relaxed mb-6">
              Whether you're starting out or starting over, we connect people to work that matters.
            </p>
            <div className="flex gap-4">
              {/* Icons */}
              <a href="#" className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/10 transition-colors group">
                {/* X Icon SVG */}
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-white/90 font-light">
          <p>&copy; 2026 HelpingHands. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
