"use client";

import { useEffect, useState } from "react";

export function TealBackground() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @keyframes gray-aurora {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(2%, -2%) scale(1.02); }
          66% { transform: translate(-1%, 3%) scale(0.98); }
        }
        .bg-aurora-gray { animation: gray-aurora 20s ease-in-out infinite; }
      `}</style>
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#fafafa]">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-slate-200/40 rounded-full blur-[100px] bg-aurora-gray"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gray-200/40 rounded-full blur-[100px] bg-aurora-gray" style={{ animationDelay: '-7s' }}></div>
        <div className="absolute top-[30%] left-[60%] w-[40%] h-[40%] bg-zinc-200/30 rounded-full blur-[100px] bg-aurora-gray" style={{ animationDelay: '-14s' }}></div>
      </div>
    </>
  );
}
