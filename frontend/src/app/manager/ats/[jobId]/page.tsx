"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { API } from "@/lib/api";
import { ArrowLeft, User as UserIcon, Calendar, MessageSquare, GripVertical, CheckSquare } from "lucide-react";
import Link from "next/link";

export default function ATSKanbanBoard() {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();
  const { jobId } = useParams();
  
  const [job, setJob] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'MANAGER')) {
      router.push("/manager-login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchATSData = async () => {
      if (!token || !jobId) return;
      try {
        setLoading(true);
        // Fetch apps for this specific job
        const apps = await API.get(`/manager/ats?jobId=${jobId}`, token);
        setApplications(apps);
        
        // Extract job details from the first app (or fetch job directly if needed)
        if (apps.length > 0) {
          setJob(apps[0].job);
        } else {
          // If no apps, fetch job directly to get the pipeline steps
          const jobs = await API.get('/manager/jobs', token);
          const currentJob = jobs.find((j: any) => j.id === jobId);
          setJob(currentJob);
        }
      } catch (err) {
        console.error("Failed to fetch ATS data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchATSData();
  }, [jobId, token]);

  const handleDragStart = (e: any, appId: string) => {
    setDraggedAppId(appId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const handleDrop = async (e: any, newStage: string) => {
    e.preventDefault();
    if (!draggedAppId || !token) return;

    // Optimistically update UI
    setApplications(apps => 
      apps.map(app => app.id === draggedAppId ? { ...app, stage: newStage } : app)
    );
    setDraggedAppId(null);

    // Update backend
    try {
      await API.post(`/manager/ats/${draggedAppId}/stage?_method=PUT`, { stage: newStage }, token);
    } catch (err) {
      console.error("Failed to update stage:", err);
      // Revert if needed in a real app
    }
  };

  const handleSelectApp = (id: string) => {
    setSelectedApps(prev => 
      prev.includes(id) ? prev.filter(appId => appId !== id) : [...prev, id]
    );
  };

  const handleBulkMove = async (newStage: string) => {
    if (selectedApps.length === 0 || !token) return;
    
    // Optimistically update
    setApplications(apps => 
      apps.map(app => selectedApps.includes(app.id) ? { ...app, stage: newStage } : app)
    );

    try {
      await API.post(`/manager/ats/bulk-stage?_method=PUT`, { 
        applicationIds: selectedApps, 
        stage: newStage 
      }, token);
      setSelectedApps([]); // clear selection
    } catch (err) {
      console.error("Failed bulk update:", err);
    }
  };

  if (isLoading || !user || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-foreground/50 font-medium">Loading Applicant Pipeline...</div>
      </div>
    );
  }

  const pipelineSteps = job.hiringSteps || ["Applied", "Screening", "Interview", "Offer"];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b border-foreground/10 bg-background/50 backdrop-blur-md sticky top-16 z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/manager/dashboard" className="inline-flex items-center gap-2 text-[14px] font-bold text-foreground/50 hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-[30px] font-bold text-foreground tracking-tight">{job.title}</h1>
              <p className="text-foreground/60 mt-1 font-medium">Applicant Tracking Pipeline</p>
            </div>
            {selectedApps.length > 0 && (
              <div className="flex items-center gap-4 bg-secondary px-6 py-2 rounded-lg border border-foreground/10">
                <span className="font-bold text-[14px] text-foreground">{selectedApps.length} Selected</span>
                <span className="text-foreground/30">|</span>
                <span className="text-[14px] font-bold text-foreground/60 mr-2">Move to:</span>
                <select 
                  onChange={(e) => {
                    if(e.target.value) handleBulkMove(e.target.value);
                    e.target.value = ""; // reset
                  }}
                  className="px-3 py-1.5 rounded-md border border-foreground/20 text-[14px] font-bold bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Stage...</option>
                  {pipelineSteps.map((step: string) => (
                    <option key={step} value={step}>{step}</option>
                  ))}
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-8">
        <div className="flex gap-6 min-w-max pb-8 h-full">
          {pipelineSteps.map((step: string) => {
            const appsInStage = applications.filter(app => app.stage === step);
            
            return (
              <div 
                key={step} 
                className="w-80 flex flex-col bg-foreground/5 rounded-xl border border-foreground/10 h-[calc(100vh-250px)]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, step)}
              >
                <div className="p-4 flex justify-between items-center border-b border-foreground/10 bg-background/50 rounded-t-xl">
                  <h3 className="font-bold text-foreground">{step}</h3>
                  <span className="px-2.5 py-1 bg-secondary text-foreground text-[12px] font-bold rounded-full border border-foreground/10">
                    {appsInStage.length}
                  </span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {appsInStage.map(app => (
                    <div 
                      key={app.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, app.id)}
                      className={`p-4 bg-background border rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:border-foreground/30 transition-colors group relative ${selectedApps.includes(app.id) ? 'border-primary ring-1 ring-primary' : 'border-foreground/10'}`}
                    >
                      <button 
                        onClick={() => handleSelectApp(app.id)}
                        className={`absolute top-4 right-4 ${selectedApps.includes(app.id) ? 'text-primary' : 'text-foreground/20 opacity-0 group-hover:opacity-100 hover:text-foreground'}`}
                      >
                        <CheckSquare className="w-5 h-5" fill={selectedApps.includes(app.id) ? "currentColor" : "none"} />
                      </button>
                      
                      <div className="flex items-center gap-2 mb-3 pr-8">
                        <GripVertical className="w-4 h-4 text-foreground/20" />
                        <h4 className="font-bold text-foreground truncate">{app.user.name || "Applicant"}</h4>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <div className="text-[14px] text-foreground/60 font-medium truncate flex items-center gap-2">
                          <UserIcon className="w-4 h-4 flex-shrink-0" /> <span className="truncate">{app.user.email}</span>
                        </div>

                        {/* Candidate Profile Snippet */}
                        <div className="mt-1 space-y-1 p-2 bg-secondary/50 rounded-md border border-foreground/5">
                          {app.user.locationPreference && (
                            <div className="text-[12px] text-foreground/70 truncate"><span className="font-bold">Loc:</span> {app.user.locationPreference}</div>
                          )}
                          {app.user.experience && app.user.experience.length > 0 && (
                            <div className="text-[12px] text-foreground/70 truncate"><span className="font-bold">Exp:</span> {app.user.experience[0].role} at {app.user.experience[0].company}</div>
                          )}
                          {app.user.skills && app.user.skills.length > 0 && (
                            <div className="text-[12px] text-foreground/70 truncate"><span className="font-bold">Skills:</span> {Array.isArray(app.user.skills) ? app.user.skills.slice(0, 3).join(', ') + (app.user.skills.length > 3 ? '...' : '') : app.user.skills}</div>
                          )}
                        </div>

                        <div className="flex justify-between items-center mt-2 pt-3 border-t border-foreground/5">
                          <span className="text-[12px] font-bold text-foreground/40">{new Date(app.createdAt).toLocaleDateString()}</span>
                          <Link 
                            href={`/manager/applicant/${app.id}`}
                            className="text-[12px] font-bold text-primary hover:text-primary-hover bg-primary/10 px-3 py-1 rounded-md"
                          >
                            View Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          
          {/* Rejected Column */}
          <div 
            className="w-80 flex flex-col bg-red-500/5 rounded-xl border border-red-500/10 h-[calc(100vh-250px)]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'Rejected')}
          >
            <div className="p-4 flex justify-between items-center border-b border-red-500/10 bg-background/50 rounded-t-xl">
              <h3 className="font-bold text-red-700">Rejected</h3>
              <span className="px-2.5 py-1 bg-red-500/10 text-red-700 text-[12px] font-bold rounded-full border border-red-500/20">
                {applications.filter(app => app.stage === 'Rejected').length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {applications.filter(app => app.stage === 'Rejected').map(app => (
                <div 
                  key={app.id} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, app.id)}
                  className={`p-4 bg-background border border-red-500/20 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:border-red-500/40 transition-colors group relative ${selectedApps.includes(app.id) ? 'ring-1 ring-red-500' : ''}`}
                >
                  <button 
                    onClick={() => handleSelectApp(app.id)}
                    className={`absolute top-4 right-4 ${selectedApps.includes(app.id) ? 'text-red-500' : 'text-foreground/20 opacity-0 group-hover:opacity-100 hover:text-red-500'}`}
                  >
                    <CheckSquare className="w-5 h-5" fill={selectedApps.includes(app.id) ? "currentColor" : "none"} />
                  </button>
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="font-bold text-foreground truncate">{app.user.name || "Applicant"}</h4>
                  </div>
                  <div className="text-[14px] text-foreground/60 font-medium truncate flex items-center gap-2 mb-2">
                    <UserIcon className="w-4 h-4 flex-shrink-0" /> <span className="truncate">{app.user.email}</span>
                  </div>
                  
                  {/* Candidate Profile Snippet */}
                  <div className="mt-1 space-y-1 p-2 bg-secondary/50 rounded-md border border-foreground/5">
                    {app.user.locationPreference && (
                      <div className="text-[12px] text-foreground/70 truncate"><span className="font-bold">Loc:</span> {app.user.locationPreference}</div>
                    )}
                    {app.user.experience && app.user.experience.length > 0 && (
                      <div className="text-[12px] text-foreground/70 truncate"><span className="font-bold">Exp:</span> {app.user.experience[0].role} at {app.user.experience[0].company}</div>
                    )}
                    {app.user.skills && app.user.skills.length > 0 && (
                      <div className="text-[12px] text-foreground/70 truncate"><span className="font-bold">Skills:</span> {Array.isArray(app.user.skills) ? app.user.skills.slice(0, 3).join(', ') + (app.user.skills.length > 3 ? '...' : '') : app.user.skills}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
