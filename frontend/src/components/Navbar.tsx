"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogOut, LayoutDashboard, Briefcase, User } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get('tab') || 'professional';

  // Scroll state — shrinks top gap once user scrolls
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Shared pill wrapper ──────────────────────────────────────────────────
  // Top margin animates from 28px → 10px as user scrolls
  const topPadding = scrolled ? 'pt-2' : 'pt-7';
  const pillPadding = scrolled ? 'px-10 py-4' : 'px-12 py-5';
  const shadowClass = scrolled
    ? 'shadow-lg border-gray-200/90'
    : 'shadow-md border-gray-200';

  // ── Unauthenticated navbar ───────────────────────────────────────────────
  if (!user) {
    return (
      <nav className={`navbar-wrapper ${topPadding}`}>
        <div className={`navbar-pill ${shadowClass} ${pillPadding}`}>
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="navbar-logo">
              Helping Hands
            </span>
          </Link>

          {/* Center nav links */}
          <div className="hidden md:flex items-center gap-20">
            {['Employers', 'Job Seekers', 'Community', 'About Us'].map((label) => (
              <Link
                key={label}
                href="#"
                className="navbar-link"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right CTA */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="navbar-btn-login"
            >
              Log in
            </Link>
            <Link
              href="/login"
              className="navbar-btn-signup"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // ── Authenticated navbar ─────────────────────────────────────────────────
  return (
    <nav className={`navbar-wrapper ${topPadding}`}>
      <div className={`navbar-pill ${shadowClass} ${pillPadding}`}>
        {/* Logo */}
        <Link
          href={user.role === 'MANAGER' ? '/manager/dashboard' : '/dashboard'}
          className="flex-shrink-0"
        >
          <span className="navbar-logo">
            Helping Hands
          </span>
        </Link>

        {/* Center links — profile tabs or nav links */}
        <div className="hidden md:flex items-center gap-12">
          {pathname === '/profile' ? (
            <>
              <Link
                href="/profile?tab=professional"
                className={`text-[15px] font-semibold transition-colors pb-0.5 border-b-2 ${currentTab === 'professional'
                  ? 'border-[#0F766E] text-[#0F766E]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
              >
                Profile Details
              </Link>
              <Link
                href="/profile?tab=settings"
                className={`text-[15px] font-semibold transition-colors pb-0.5 border-b-2 ${currentTab === 'settings'
                  ? 'border-[#0F766E] text-[#0F766E]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
              >
                Account Settings
              </Link>
            </>
          ) : user.role === 'APPLICANT' ? (
            <>
              <Link
                href="/dashboard"
                className={`text-[15px] transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg ${pathname === '/dashboard'
                  ? 'font-semibold text-[#0F766E] bg-teal-50'
                  : 'font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <Link
                href="/applications"
                className={`text-[15px] transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg ${pathname === '/applications'
                  ? 'font-semibold text-[#0F766E] bg-teal-50'
                  : 'font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <Briefcase className="w-4 h-4" /> My Applications
              </Link>
            </>
          ) : (
            <Link
              href="/manager/dashboard"
              className={`text-[15px] transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg ${pathname.startsWith('/manager')
                ? 'font-semibold text-[#0F766E] bg-teal-50'
                : 'font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Manager Dashboard
            </Link>
          )}
        </div>

        {/* Avatar dropdown */}
        <div className="relative group">
          <div className="w-10 h-10 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-bold text-[17px] cursor-pointer shadow-sm hover:ring-2 hover:ring-[#0F766E]/40 transition-all select-none">
            {(user.name || user.email || 'U')[0].toUpperCase()}
          </div>
          <div className="absolute right-0 top-full mt-3 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col overflow-hidden transform origin-top-right scale-95 group-hover:scale-100 z-50">
            <div className="px-4 py-3.5 border-b border-gray-100 bg-gray-50/60">
              <p className="text-[14px] font-bold text-gray-900 truncate">{user.name || 'User'}</p>
              <p className="text-[12px] text-gray-500 truncate">{user.email}</p>
            </div>
            <Link
              href="/profile"
              className="px-4 py-3 text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2.5"
            >
              <User className="w-4 h-4 text-gray-400" /> Profile Settings
            </Link>
            <button
              onClick={() => logout()}
              className="px-4 py-3 text-[14px] font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2.5 text-left w-full border-t border-gray-100"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
