"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { API } from "@/lib/api";
import { Briefcase, Calendar, MessageSquare, CheckCircle, Clock, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Applications() {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!token) return;
      try {
        setLoadingApps(true);
        const apps = await API.get('/applications/me', token);
        setApplications(apps);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoadingApps(false);
      }
    };
    
    fetchApplications();
  }, [token]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-foreground/50 font-medium">Loading your applications...</div>
      </div>
    );
  }

  const getStatusIcon = (stage: string) => {
    const s = stage?.toLowerCase() || '';
    if (s.includes('rejected')) return <XCircle className="w-5 h-5 text-red-500" />;
    if (s.includes('offer') || s.includes('hired') || s.includes('accepted')) return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    if (s.includes('interview')) return <Calendar className="w-5 h-5 text-purple-500" />;
    if (s.includes('screening') || s.includes('review')) return <Briefcase className="w-5 h-5 text-blue-500" />;
    return <Clock className="w-5 h-5 text-amber-500" />; // Default / Applied
  };

  const getStatusColor = (stage: string) => {
    const s = stage?.toLowerCase() || '';
    if (s.includes('rejected')) return 'bg-red-500/10 text-red-600 border-red-200/50';
    if (s.includes('offer') || s.includes('hired') || s.includes('accepted')) return 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50';
    if (s.includes('interview')) return 'bg-purple-500/10 text-purple-600 border-purple-200/50';
    if (s.includes('screening') || s.includes('review')) return 'bg-blue-500/10 text-blue-600 border-blue-200/50';
    return 'bg-amber-500/10 text-amber-600 border-amber-200/50'; // Default / Applied
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-foreground/10 bg-background/50 backdrop-blur-md sticky top-16 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-foreground/50 hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Application Tracker</h1>
              <p className="text-foreground/60 mt-1 font-medium">Monitor your progress and next steps.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {loadingApps ? (
            <div className="py-20 text-center text-foreground/50">Loading your applications...</div>
          ) : applications.length > 0 ? (
            applications.map((app) => (
              <div key={app.id} className="border border-foreground/10 rounded-xl p-6 bg-background hover:border-foreground/30 transition-all hover:shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{app.job?.title || "General Application"}</h3>
                    <p className="text-foreground/70 font-medium mt-1">{app.job?.company || "Open Submission"}</p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full border text-sm font-bold flex items-center gap-2 ${getStatusColor(app.stage)}`}>
                    {getStatusIcon(app.stage)} {app.stage}
                  </div>
                </div>

                {app.stage?.toLowerCase().includes('interview') && (
                  <div className="mt-4 p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                    <h4 className="font-bold text-purple-700 flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4" /> Action Required: Book Interview
                    </h4>
                    <p className="text-sm text-foreground/70 mb-4">The hiring manager has requested an interview. Please select a time slot.</p>
                    <button className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors text-sm">
                      Select Time Slot
                    </button>
                  </div>
                )}

                <div className="mt-6 pt-5 border-t border-foreground/10 flex justify-between items-center">
                  <div className="text-sm font-medium text-foreground/50">
                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                  <button className="flex items-center gap-2 text-sm font-bold text-foreground/60 hover:text-foreground transition-colors">
                    <MessageSquare className="w-4 h-4" /> Message Manager
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 border border-foreground/10 border-dashed rounded-xl">
              <Briefcase className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground">No applications yet</h3>
              <p className="text-foreground/60 mt-2">When you apply for a job, you can track its status here.</p>
              <Link href="/dashboard" className="inline-block mt-6 px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary-hover transition-colors">
                Find Jobs
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
