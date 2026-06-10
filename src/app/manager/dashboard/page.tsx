"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { API } from "@/lib/api";
import { Plus, Briefcase, Users, FileText, Copy, Edit, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function ManagerDashboard() {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== 'MANAGER') {
        router.push("/manager-login");
      }
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!token) return;
      try {
        setLoadingJobs(true);
        const data = await API.get('/manager/jobs', token);
        setJobs(data);
      } catch (err) {
        console.error("Failed to fetch manager jobs:", err);
      } finally {
        setLoadingJobs(false);
      }
    };
    
    fetchJobs();
  }, [token]);

  const handleDuplicate = async (id: string) => {
    if (!token) return;
    try {
      const data = await API.post(`/manager/jobs/${id}/duplicate`, {}, token);
      setJobs([data.job, ...jobs]);
    } catch (err) {
      alert("Failed to duplicate job");
    }
  };

  if (isLoading || !user || user.role !== 'MANAGER') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-foreground/50 font-medium">Loading Employer Portal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-foreground/10 bg-background/50 backdrop-blur-md sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Employer Dashboard</h1>
              <p className="text-foreground/60 mt-1 font-medium">Manage your job postings and applicants.</p>
            </div>
            <Link 
              href="/manager/jobs/create"
              className="px-6 py-2.5 bg-foreground text-background font-bold rounded-lg hover:bg-foreground/90 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Post New Job
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="p-6 border border-foreground/10 rounded-xl bg-background shadow-sm flex items-center gap-4 hover:border-primary/50 transition-colors">
            <div className="p-3 bg-secondary rounded-lg">
              <Briefcase className="w-6 h-6 text-foreground/70" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground/60">Active Listings</p>
              <p className="text-2xl font-bold text-foreground">{jobs.filter(j => j.status === 'PUBLISHED').length}</p>
            </div>
          </div>
          <div className="p-6 border border-foreground/10 rounded-xl bg-background shadow-sm flex items-center gap-4 hover:border-primary/50 transition-colors">
            <div className="p-3 bg-secondary rounded-lg">
              <Users className="w-6 h-6 text-foreground/70" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground/60">Active Applicants</p>
              <p className="text-2xl font-bold text-foreground">
                {jobs.reduce((acc, job) => acc + (job.applications?.filter((a: any) => !['Rejected', 'Offer', 'Hired'].includes(a.stage)).length || 0), 0)}
              </p>
            </div>
          </div>
          <div className="p-6 border border-foreground/10 rounded-xl bg-background shadow-sm flex items-center gap-4 hover:border-primary/50 transition-colors">
            <div className="p-3 bg-secondary rounded-lg">
              <FileText className="w-6 h-6 text-foreground/70" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground/60">Drafts</p>
              <p className="text-2xl font-bold text-foreground">{jobs.filter(j => j.status === 'DRAFT').length}</p>
            </div>
          </div>
          <div className="p-6 border border-foreground/10 rounded-xl bg-background shadow-sm flex items-center gap-4 bg-primary/5 border-primary/20">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary/80">Offers Extended</p>
              <p className="text-2xl font-bold text-primary">
                {jobs.reduce((acc, job) => acc + (job.applications?.filter((a: any) => a.stage === 'Offer' || a.stage === 'Hired').length || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <h2 className="text-xl font-bold text-foreground mb-6">Your Job Postings</h2>
        
        <div className="space-y-4">
          {loadingJobs ? (
            <div className="py-12 text-center text-foreground/50">Loading jobs...</div>
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} className="border border-foreground/10 rounded-xl p-6 bg-background hover:border-foreground/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-foreground">{job.title}</h3>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                      job.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-600' :
                      job.status === 'DRAFT' ? 'bg-amber-500/10 text-amber-600' :
                      'bg-foreground/10 text-foreground/60'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-medium text-foreground/60">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.type}</span>
                    <span>•</span>
                    <span>Created {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleDuplicate(job.id)}
                    className="p-2 text-foreground/50 hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                    title="Duplicate Job"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <Link 
                    href={`/manager/jobs/create?id=${job.id}`}
                    className="p-2 text-foreground/50 hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                    title="Edit Job"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <Link 
                    href={`/manager/ats/${job.id}`}
                    className="px-4 py-2 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" /> View Active Applicants ({job.applications?.filter((a: any) => !['Rejected', 'Offer', 'Hired'].includes(a.stage)).length || 0})
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 border border-foreground/10 border-dashed rounded-xl">
              <LayoutDashboard className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground">No jobs posted yet</h3>
              <p className="text-foreground/60 mt-2">Create your first job listing to start receiving applications.</p>
              <Link 
                href="/manager/jobs/create"
                className="inline-block mt-6 px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary-hover transition-colors"
              >
                Post a Job
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
