"use client";

import { Bookmark } from 'lucide-react';
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

export default function JobCard({ id, title, company, location, type, salary, postedAt, isSaved: initialIsSaved = false, onSaveToggle }: JobCardProps) {
  const [saved, setSaved] = useState(initialIsSaved);
  const router = useRouter();

  useEffect(() => {
    setSaved(initialIsSaved);
  }, [initialIsSaved]);

  return (
    <div 
      className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white border border-foreground/5 rounded-xl hover:border-foreground/15 transition-all cursor-pointer shadow-sm hover:shadow-md"
      onClick={() => { if (id) router.push(`/job/${id}`); }}
    >
      <div className="flex-grow pr-4">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-base font-semibold text-foreground group-hover:text-black transition-colors">
            {title}
          </h3>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/60 text-xs font-medium">
            {type}
          </span>
        </div>
        <p className="text-foreground/60 text-sm font-medium">
          {company} <span className="mx-1.5 text-foreground/20">&bull;</span> {location}
        </p>
      </div>

      <div className="flex items-center justify-between mt-4 sm:mt-0 sm:pl-4 sm:border-l border-foreground/5 sm:w-48 shrink-0">
        <div className="flex flex-col sm:items-end">
          <span className="text-sm font-medium text-foreground/80">{salary !== "Not specified" ? salary : "Competitive"}</span>
          <span className="text-xs text-foreground/40 mt-0.5">{postedAt}</span>
        </div>
        
        <button 
          onClick={async (e) => {
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
          }}
          className={`ml-4 p-2 rounded-lg transition-colors ${saved ? 'bg-foreground/5 text-foreground' : 'text-foreground/20 hover:text-foreground hover:bg-foreground/5'}`}
          aria-label={saved ? "Remove from saved" : "Save job"}
        >
          <Bookmark className="w-4 h-4" fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
}
