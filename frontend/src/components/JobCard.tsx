"use client";

import { Bookmark, Building2, MapPin, Clock, CircleDollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface JobCardProps {
  id?: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  postedAt: string;
  description?: string;
  isSaved?: boolean;
  onSaveToggle?: (id: string, isSaved: boolean) => void;
}

export default function JobCard({ id, title, company, location, type, salary, postedAt, description, isSaved: initialIsSaved = false, onSaveToggle }: JobCardProps) {
  const [saved, setSaved] = useState(initialIsSaved);
  const router = useRouter();

  useEffect(() => {
    setSaved(initialIsSaved);
  }, [initialIsSaved]);

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) {
      try {
        const token = localStorage.getItem('jobPortalToken');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api'}/jobs/${id}/save`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setSaved(data.isSaved);
        if (onSaveToggle) onSaveToggle(id, data.isSaved);
      } catch (err) {
        console.error(err);
      }
    } else {
      setSaved(!saved);
      if (onSaveToggle && id) onSaveToggle(id, !saved);
    }
  };

  return (
    <div 
      className="group relative flex flex-col p-6 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-all cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-1 h-full"
      onClick={() => { if (id) router.push(`/job/${id}`); }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 group-hover:scale-105 transition-transform">
            {company.charAt(0) ? <span className="font-bold text-[20px]">{company.charAt(0)}</span> : <Building2 className="w-6 h-6" />}
          </div>
          <div>
            <p className="text-[14px] font-semibold text-slate-500">{company}</p>
            <div className="flex items-center gap-1 mt-0.5 text-[12px] text-slate-400">
              <MapPin className="w-3 h-3" /> {location}
            </div>
          </div>
        </div>
        <button 
          onClick={handleSave}
          className={`p-2 rounded-xl transition-colors ${saved ? 'bg-slate-50 text-slate-900' : 'text-slate-300 hover:text-slate-900 hover:bg-slate-50'}`}
          aria-label={saved ? "Remove from saved" : "Save job"}
        >
          <Bookmark className="w-5 h-5" fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="mb-4 flex-grow">
        <h3 className="text-[18px] font-bold text-slate-900 group-hover:text-slate-900 transition-colors leading-tight mb-2 line-clamp-2">
          {title}
        </h3>
        {description ? (
          <p className="text-slate-500 text-[14px] line-clamp-3 leading-relaxed">
            {description}
          </p>
        ) : (
          <p className="text-slate-500 text-[14px] italic">
            Exciting opportunity at {company}. Click to view full details and apply.
          </p>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 mt-auto">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 text-[12px] font-semibold">
            <Clock className="w-3 h-3" /> {type}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 text-[12px] font-semibold">
            <CircleDollarSign className="w-3 h-3" /> {salary !== "Not specified" ? salary : "Competitive"}
          </span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-[12px] font-medium text-slate-400">Posted {postedAt}</span>
          <span className="text-[12px] font-bold text-slate-900 group-hover:underline">View details →</span>
        </div>
      </div>
    </div>
  );
}
