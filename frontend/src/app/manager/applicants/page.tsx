"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { API } from "@/lib/api";
import { ArrowLeft, User as UserIcon, CheckSquare } from "lucide-react";
import Link from "next/link";

function ApplicantsContent() {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") || "all";
  const jobId = searchParams.get("jobId");

  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  const toggleSelection = (appId: string) => {
    setSelectedCandidates(prev => 
      prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]
    );
  };

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'MANAGER')) {
      router.push("/manager-login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchApplicants = async () => {
      if (!token) return;
      try {
        setLoading(true);
        // If jobId is provided, pass it to the backend to get apps only for that job
        const endpoint = jobId ? `/manager/ats?jobId=${jobId}` : '/manager/ats';
        const data = await API.get(endpoint, token);
        let filtered = data;
        if (filter === 'active') {
          filtered = data.filter((a: any) => !['Rejected', 'Offer', 'Hired'].includes(a.stage));
        } else if (filter === 'offers') {
          filtered = data.filter((a: any) => ['Offer', 'Hired'].includes(a.stage));
        }
        setApps(filtered);
      } catch (err) {
        console.error("Failed to fetch applicants:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplicants();
  }, [token, filter, jobId]);

  if (isLoading || !user || user.role !== 'MANAGER') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-foreground/50 font-medium">Loading Applicants...</div>
      </div>
    );
  }

  const title = jobId ? 'Candidates for Job' : filter === 'active' ? 'Active Applicants' : filter === 'offers' ? 'Offers Extended' : 'All Applicants';

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="border-b border-foreground/10 bg-background/50 backdrop-blur-md sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/manager/dashboard" className="inline-flex items-center gap-2 text-[14px] font-bold text-foreground/50 hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-[30px] font-bold text-foreground tracking-tight">{title}</h1>
              <p className="text-foreground/60 mt-1 font-medium">Review and manage candidate profiles.</p>
            </div>
            {jobId && (
              <Link 
                href={`/manager/ats/${jobId}`}
                className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2 shadow-sm"
              >
                Go to Pipeline View
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-12 text-center text-foreground/50 animate-pulse font-medium">Loading applicants...</div>
          ) : apps.length === 0 ? (
            <div className="col-span-full py-12 text-center text-foreground/50 font-bold border border-foreground/10 border-dashed rounded-xl">
              No applicants found in this category.
            </div>
          ) : (
            apps.map(app => (
              <div 
                key={app.id} 
                className={`relative p-6 border rounded-xl bg-background shadow-sm transition-colors flex flex-col gap-4 ${selectedCandidates.includes(app.id) ? 'border-primary ring-2 ring-primary/20' : 'border-foreground/10 hover:border-primary/30'}`}
              >
                <button 
                  onClick={() => toggleSelection(app.id)}
                  className={`absolute top-4 right-4 z-10 transition-colors ${selectedCandidates.includes(app.id) ? 'text-primary' : 'text-foreground/20 hover:text-primary/60'}`}
                >
                  <CheckSquare className="w-6 h-6" fill={selectedCandidates.includes(app.id) ? "currentColor" : "none"} />
                </button>

                <div className="flex justify-between items-start">
                  <div className="pr-12">
                    <h4 className="font-bold text-[20px] text-foreground truncate">{app.user.name || "Applicant"}</h4>
                    <div className="text-[14px] text-foreground/60 flex items-center gap-2 font-medium mt-1 truncate">
                       <UserIcon className="w-4 h-4 flex-shrink-0" /> <span className="truncate">{app.user.email}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-foreground/5">
                  <div className="text-[14px]">
                    <span className="font-bold text-foreground/50 text-[12px] uppercase tracking-wider">Applied For</span>
                    <div className="font-bold text-foreground mt-1 truncate">{app.job?.title}</div>
                  </div>
                  <div className="text-[14px]">
                    <span className="font-bold text-foreground/50 text-[12px] uppercase tracking-wider">Current Stage</span>
                    <div className="font-bold text-primary mt-1">{app.stage}</div>
                  </div>
                </div>

                <div className="mt-2 space-y-1.5 p-4 bg-secondary/50 rounded-lg border border-foreground/5 flex-1">
                  {app.user.locationPreference && (
                    <div className="text-[14px] text-foreground/70 truncate"><span className="font-bold text-foreground/50 uppercase text-[12px] mr-2">Location</span> {app.user.locationPreference}</div>
                  )}
                  {app.user.experience && app.user.experience.length > 0 && (
                    <div className="text-[14px] text-foreground/70 truncate"><span className="font-bold text-foreground/50 uppercase text-[12px] mr-2">Experience</span> {app.user.experience[0].role} at {app.user.experience[0].company}</div>
                  )}
                  {app.user.skills && app.user.skills.length > 0 && (
                    <div className="text-[14px] text-foreground/70 truncate"><span className="font-bold text-foreground/50 uppercase text-[12px] mr-2">Skills</span> {Array.isArray(app.user.skills) ? app.user.skills.join(', ') : app.user.skills}</div>
                  )}
                  {(!app.user.locationPreference && (!app.user.experience || app.user.experience.length === 0) && (!app.user.skills || app.user.skills.length === 0)) && (
                     <div className="text-[14px] text-foreground/50 italic">No profile details provided.</div>
                  )}
                </div>

                <div className="pt-2 border-t border-foreground/5">
                  <Link 
                    href={`/manager/applicant/${app.id}`}
                    className="w-full text-center block px-4 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary-hover transition-colors text-[14px] shadow-sm"
                  >
                    View Full Profile
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedCandidates.length > 1 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-foreground text-background px-6 py-4 rounded-full shadow-xl border border-foreground/10 flex items-center gap-6 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="font-bold">
            <span className="text-primary">{selectedCandidates.length}</span> Candidates Selected
          </div>
          <Link 
            href={`/manager/compare?ids=${selectedCandidates.join(',')}&jobTitle=${encodeURIComponent(apps[0]?.job?.title || 'Job Role')}`}
            className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary-hover transition-colors shadow-sm"
          >
            Compare Candidates
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ApplicantsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-pulse text-foreground/50 font-medium">Loading...</div></div>}>
      <ApplicantsContent />
    </Suspense>
  );
}
