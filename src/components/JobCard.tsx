"use client";

import { MapPin, Briefcase, Clock, Bookmark } from 'lucide-react';
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

  return (
    <div 
      className="group border border-foreground/10 rounded-xl p-6 transition-all hover:border-foreground/30 hover:shadow-md bg-background cursor-pointer"
      onClick={() => { if (id) router.push(`/job/${id}`); }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-foreground/70 font-medium mt-1">{company}</p>
        </div>
        <button 
          onClick={async (e) => {
            e.stopPropagation();
            if (id) {
              try {
                const token = localStorage.getItem('jobPortalToken');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/jobs/${id}/save`, {
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
          className={`p-2 rounded-full transition-colors ${saved ? 'bg-primary/10 text-primary' : 'text-foreground/30 hover:text-foreground/70 hover:bg-secondary'}`}
        >
          <Bookmark className="w-5 h-5" fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      
      <div className="mt-6 flex flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 bg-secondary px-3 py-1.5 rounded-md">
          <MapPin className="w-4 h-4" /> {location}
        </div>
        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 bg-secondary px-3 py-1.5 rounded-md">
          <Briefcase className="w-4 h-4" /> {type}
        </div>
        <div className="flex items-center gap-1.5 text-sm font-bold text-foreground bg-primary/10 px-3 py-1.5 rounded-md">
          {salary}
        </div>
      </div>
      
      <div className="mt-6 pt-5 border-t border-foreground/10 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground/50">
          <Clock className="w-4 h-4" /> {postedAt}
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (id) router.push(`/job/${id}`);
          }}
          className="text-sm font-bold text-background bg-foreground px-5 py-2.5 rounded-lg hover:bg-foreground/80 transition-colors shadow-sm"
        >
          View Job
        </button>
      </div>
    </div>
  );
}
