"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogOut, LayoutDashboard, Briefcase, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/50 backdrop-blur-md border-b border-foreground/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href={user ? (user.role === 'MANAGER' ? '/manager/dashboard' : '/dashboard') : '/'} className="flex-shrink-0 flex items-center">
              <img src="/logo.png" alt="TechCorp Careers Logo" className="h-8 w-auto mr-2" />
              <span className="text-[20px] font-bold text-foreground tracking-tight hover:text-primary transition-colors">
                TechCorp Careers
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="text-[14px] font-medium text-foreground/60 hover:text-foreground transition-colors"
                >
                  Candidate Login
                </Link>
                <Link
                  href="/manager-login"
                  className="text-[14px] font-medium bg-foreground text-background hover:bg-foreground/90 px-4 py-2 rounded-md transition-colors"
                >
                  Employer Login
                </Link>
              </>
            ) : (
              <>
                {user.role === 'APPLICANT' ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-[14px] font-medium text-foreground/60 hover:text-foreground transition-colors flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link
                      href="/applications"
                      className="text-[14px] font-bold text-foreground bg-secondary hover:bg-foreground/5 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Briefcase className="w-4 h-4" /> My Applications
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/manager/dashboard"
                    className="text-[14px] font-medium text-foreground/60 hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Manager Dashboard
                  </Link>
                )}

                {/* Avatar Dropdown */}
                <div className="relative group ml-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-[18px] cursor-pointer shadow-sm hover:ring-2 hover:ring-primary/50 transition-all">
                    {(user.name || user.email || "U")[0].toUpperCase()}
                  </div>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-foreground/10 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col overflow-hidden transform origin-top-right scale-95 group-hover:scale-100 z-50">
                    <div className="px-4 py-3 border-b border-foreground/5 bg-secondary/50">
                      <p className="text-[14px] font-bold text-foreground truncate">{user.name || "User"}</p>
                      <p className="text-[12px] text-foreground/50 truncate">{user.email}</p>
                    </div>
                    <Link href="/profile" className="px-4 py-3 text-[14px] font-medium hover:bg-foreground/5 transition-colors flex items-center gap-2">
                      <User className="w-4 h-4 text-foreground/70" /> Profile Settings
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="px-4 py-3 text-[14px] font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2 text-left w-full border-t border-foreground/5"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
