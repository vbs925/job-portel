"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { API } from "@/lib/api";
import { Plus, Briefcase, Users, FileText, Copy, Edit, LayoutDashboard, Search, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ManagerDashboard() {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');

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

  const handleDuplicate = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!token) return;
    try {
      const data = await API.post(`/manager/jobs/${id}/duplicate`, {}, token);
      setJobs([data.job, ...jobs]);
    } catch (err) {
      alert("Failed to duplicate job");
    }
  };

  const handlePublish = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!token) return;
    try {
      await API.put(`/manager/jobs/${id}`, { status: 'PUBLISHED' }, token);
      setJobs(jobs.map(j => j.id === id ? { ...j, status: 'PUBLISHED' } : j));
    } catch (err) {
      alert("Failed to publish job");
    }
  };

  if (isLoading || !user || user.role !== 'MANAGER') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-slate-400 font-medium tracking-wide">Loading Workspace...</div>
      </div>
    );
  }

  const activeJobs = jobs.filter(j => j.status === 'PUBLISHED').length;
  const draftJobs = jobs.filter(j => j.status === 'DRAFT').length;
  const activeApplicants = jobs.reduce((acc, job) => acc + (job.applications?.filter((a: any) => !['Rejected', 'Offer', 'Hired'].includes(a.stage)).length || 0), 0);
  const offersExtended = jobs.reduce((acc, job) => acc + (job.applications?.filter((a: any) => a.stage === 'Offer' || a.stage === 'Hired').length || 0), 0);

  const displayedJobs = statusFilter === 'ALL' ? jobs.filter(j => j.status !== 'DRAFT') : jobs.filter(j => j.status === statusFilter);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-bold text-slate-900 tracking-tight">Workspace Overview</h1>
            <p className="text-slate-500 mt-1 font-medium text-[15px]">Manage your active listings and talent pipeline.</p>
          </div>
          <Link 
            href="/manager/jobs/create"
            className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 shadow-md shadow-primary/20 w-fit"
          >
            <Plus className="w-5 h-5" /> Post New Job
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <button 
            onClick={() => setStatusFilter(statusFilter === 'PUBLISHED' ? 'ALL' : 'PUBLISHED')}
            className={`p-6 bg-white border rounded-2xl shadow-sm flex items-center gap-5 hover:shadow-md hover:-translate-y-1 transition-all text-left ${statusFilter === 'PUBLISHED' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'}`}
          >
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
              <Briefcase className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wide">Active Listings</p>
              <p className="text-[28px] font-bold text-slate-900 leading-none mt-1">{activeJobs}</p>
            </div>
          </button>
          
          <Link href="/manager/applicants?filter=active" className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-5 hover:shadow-md hover:border-emerald-200 hover:-translate-y-1 transition-all group">
            <div className="p-4 bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors rounded-xl">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wide group-hover:text-emerald-700 transition-colors">Active Applicants</p>
              <p className="text-[28px] font-bold text-slate-900 leading-none mt-1">{activeApplicants}</p>
            </div>
          </Link>

          <button 
            onClick={() => setStatusFilter(statusFilter === 'DRAFT' ? 'ALL' : 'DRAFT')}
            className={`p-6 bg-white border rounded-2xl shadow-sm flex items-center gap-5 hover:shadow-md hover:-translate-y-1 transition-all text-left ${statusFilter === 'DRAFT' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200'}`}
          >
            <div className="p-4 bg-amber-50 text-amber-600 rounded-xl">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wide">Drafts</p>
              <p className="text-[28px] font-bold text-slate-900 leading-none mt-1">{draftJobs}</p>
            </div>
          </button>

          <Link href="/manager/applicants?filter=offers" className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-5 hover:shadow-md hover:border-violet-200 hover:-translate-y-1 transition-all group">
            <div className="p-4 bg-violet-50 text-violet-600 group-hover:bg-violet-100 transition-colors rounded-xl">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wide group-hover:text-violet-700 transition-colors">Offers Extended</p>
              <p className="text-[28px] font-bold text-slate-900 leading-none mt-1">{offersExtended}</p>
            </div>
          </Link>
        </div>

        {/* Job Listings Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">
            {statusFilter === 'ALL' ? 'All Job Postings' : statusFilter === 'PUBLISHED' ? 'Active Listings' : 'Drafts'}
          </h2>
          {statusFilter !== 'ALL' && (
            <button 
              onClick={() => setStatusFilter('ALL')}
              className="text-[14px] text-primary font-medium hover:underline"
            >
              Clear Filter
            </button>
          )}
        </div>
        
        {/* Job Listings List */}
        <div className="space-y-4">
          {loadingJobs ? (
            <div className="py-20 flex justify-center">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : displayedJobs.length > 0 ? (
            displayedJobs.map((job, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                key={job.id} 
                onClick={() => router.push(`/job/${job.id}`)}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group cursor-pointer"
              >
                {/* Left side details */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-[20px] font-bold text-slate-900 group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <span className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold rounded-lg ${
                      job.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' :
                      job.status === 'DRAFT' ? 'bg-slate-100 text-slate-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[14px] font-medium text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      {job.type}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" />
                      Created {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-3 shrink-0">
                  {job.status === 'DRAFT' && (
                    <button 
                      onClick={(e) => handlePublish(e, job.id)}
                      className="px-4 py-2 bg-emerald-100 text-emerald-700 font-bold rounded-xl hover:bg-emerald-200 transition-colors shadow-sm"
                      title="Publish Listing"
                    >
                      Publish
                    </button>
                  )}
                  <button 
                    onClick={(e) => handleDuplicate(e, job.id)}
                    className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors tooltip-trigger"
                    title="Duplicate Listing"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/manager/jobs/create?id=${job.id}`);
                    }}
                    className="p-2.5 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-xl transition-colors"
                    title="Edit Listing"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/manager/applicants?jobId=${job.id}`);
                    }}
                    className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-colors flex items-center gap-2 ml-2 shadow-sm"
                  >
                    <Users className="w-4 h-4" /> 
                    <span>Applicants ({job.applications?.filter((a: any) => !['Rejected', 'Offer', 'Hired'].includes(a.stage)).length || 0})</span>
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white border border-slate-200 border-dashed rounded-3xl py-24 text-center flex flex-col items-center shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <LayoutDashboard className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-[24px] font-bold text-slate-900 mb-2">
                {statusFilter === 'ALL' ? 'Your workspace is empty' : 'No jobs found for this filter'}
              </h3>
              <p className="text-slate-500 text-[16px] max-w-md mx-auto mb-8">
                {statusFilter === 'ALL' 
                  ? 'Get started by creating your first job listing to start receiving applications from top talent.'
                  : 'Try clearing the active filters or creating a new job posting.'}
              </p>
              {statusFilter === 'ALL' ? (
                <Link 
                  href="/manager/jobs/create"
                  className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all flex items-center gap-2 shadow-md shadow-primary/20"
                >
                  <Plus className="w-5 h-5" /> Post Your First Job
                </Link>
              ) : (
                <button 
                  onClick={() => setStatusFilter('ALL')}
                  className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
