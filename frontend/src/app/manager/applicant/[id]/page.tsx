"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { API } from "@/lib/api";
import { ArrowLeft, User as UserIcon, Calendar, MessageSquare, Star, Clock, FileText, Award, Code, Briefcase, Globe } from "lucide-react";
import Link from "next/link";
import AtsScoreCard from "@/components/AtsScoreCard";

export default function SingleApplicant() {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Schedule Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('10:00');
  const [scheduleDuration, setScheduleDuration] = useState('60'); // minutes

  const fetchApp = async () => {
    if (!token || !id) return;
    try {
      setLoading(true);
      const data = await API.get(`/manager/ats/${id}`, token);
      setApp(data);
    } catch (err) {
      console.error("Failed to fetch application:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'MANAGER')) {
      router.push("/manager-login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    fetchApp();
  }, [id, token]);

  const submitSchedule = async () => {
    if (!scheduleDate || !scheduleTime) {
      alert("Please select both a date and time.");
      return;
    }

    setActionLoading(true);
    try {
      const start = new Date(`${scheduleDate}T${scheduleTime}`);
      const end = new Date(start.getTime() + parseInt(scheduleDuration) * 60000);

      await API.post(`/manager/actions/${id}/schedule`, {
        startTime: start.toISOString(),
        endTime: end.toISOString()
      }, token || '');
      
      alert("Candidate scheduled for interview. Check backend console for the simulated email!");
      setShowScheduleModal(false);
      await fetchApp();
    } catch (err: any) {
      alert("Failed to schedule: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMessage = async () => {
    const msg = prompt("Enter the message you want to send to this candidate:");
    if (!msg) return;
    setActionLoading(true);
    try {
      await API.post(`/manager/actions/${id}/message`, { content: msg }, token || '');
      alert("Message sent and logged!");
      await fetchApp();
    } catch (err: any) {
      alert("Failed to send message: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAdvanceStage = async () => {
    const pipelineSteps = (app?.job?.hiringSteps as string[]) || ["Applied", "Screening", "Interview", "Offer"];
    const currentIndex = pipelineSteps.indexOf(app.stage);
    
    if (currentIndex === -1 || currentIndex === pipelineSteps.length - 1 || app.stage === 'Rejected') {
      return;
    }
    
    const newStage = pipelineSteps[currentIndex + 1];
    
    if (!confirm(`Are you sure you want to move the candidate to the ${newStage} stage? An email update will be sent.`)) {
      return;
    }

    setActionLoading(true);
    try {
      await API.post(`/manager/actions/${id}/stage`, { stage: newStage }, token || '');
      alert(`Stage updated to ${newStage} and email dispatched!`);
      await fetchApp();
    } catch (err: any) {
      alert("Failed to change stage: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm("Are you sure you want to reject this candidate? A rejection email will be sent immediately.")) return;
    
    setActionLoading(true);
    try {
      await API.post(`/manager/actions/${id}/reject`, {}, token || '');
      alert("Candidate rejected and email dispatched.");
      await fetchApp();
    } catch (err: any) {
      alert("Failed to reject candidate: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading || !user || !app) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-foreground/50 font-medium">Loading Applicant Profile...</div>
      </div>
    );
  }

  // Fallback hiring steps if job doesn't have them
  const pipelineSteps = (app.job?.hiringSteps as string[]) || ["Applied", "Screening", "Interview", "Offer"];

  return (
    <div className="min-h-screen bg-background pb-20 relative">
      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-background border border-foreground/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-[24px] font-black text-foreground mb-6">Schedule Interview</h2>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-[14px] font-bold text-foreground/60 mb-2">Select Date</label>
                <input 
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] font-bold text-foreground/60 mb-2">Time</label>
                  <input 
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-foreground/60 mb-2">Duration</label>
                  <select 
                    value={scheduleDuration}
                    onChange={(e) => setScheduleDuration(e.target.value)}
                    className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
                  >
                    <option value="30">30 Minutes</option>
                    <option value="45">45 Minutes</option>
                    <option value="60">1 Hour</option>
                    <option value="90">1.5 Hours</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="px-6 py-3 font-bold text-foreground/60 hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={submitSchedule}
                disabled={actionLoading}
                className="px-6 py-3 bg-foreground text-background font-bold rounded-xl hover:bg-foreground/90 transition-colors disabled:opacity-50 shadow-lg"
              >
                {actionLoading ? "Saving..." : "Confirm Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-foreground/10 bg-background/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/manager/ats/${app.jobId}`} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-foreground/50 hover:text-foreground mb-3 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to ATS Pipeline
          </Link>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 w-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center border border-foreground/10 shadow-sm flex-shrink-0">
                <UserIcon className="w-6 h-6 text-foreground/40" />
              </div>
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-[20px] font-black text-foreground tracking-tight leading-none">{app.user.name || "Applicant"}</h1>
                  <p className="text-foreground/60 font-medium text-[14px] leading-none">
                    {app.user.email} <span className="opacity-50 mx-1">•</span> Applied for <span className="font-bold text-foreground">{app.job?.title || "General Role"}</span>
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {app.user.portfolio?.socialLinks?.github && (
                    <a href={app.user.portfolio.socialLinks.github.startsWith('http') ? app.user.portfolio.socialLinks.github : `https://${app.user.portfolio.socialLinks.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-secondary hover:bg-secondary/80 transition-colors px-2 py-0.5 rounded border border-foreground/10 text-foreground text-[12px] font-medium">
                      <Code className="w-3 h-3" /> GitHub
                    </a>
                  )}
                  {app.user.portfolio?.socialLinks?.linkedin && (
                    <a href={app.user.portfolio.socialLinks.linkedin.startsWith('http') ? app.user.portfolio.socialLinks.linkedin : `https://${app.user.portfolio.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-secondary hover:bg-secondary/80 transition-colors px-2 py-0.5 rounded border border-foreground/20 text-foreground text-[12px] font-medium">
                      <Briefcase className="w-3 h-3" /> LinkedIn
                    </a>
                  )}
                  {app.user.portfolio?.socialLinks?.website && (
                    <a href={app.user.portfolio.socialLinks.website.startsWith('http') ? app.user.portfolio.socialLinks.website : `https://${app.user.portfolio.socialLinks.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-purple-50 hover:bg-purple-100 transition-colors px-2 py-0.5 rounded border border-purple-200 text-purple-700 text-[12px] font-medium">
                      <Globe className="w-3 h-3" /> Portfolio
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 w-full lg:w-auto mt-2 lg:mt-0">
              
              {/* Current Stage Indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/30 border border-foreground/10 rounded-md shadow-sm flex-grow sm:flex-grow-0 cursor-default">
                <span className="text-[12px] font-medium text-foreground/60 whitespace-nowrap">Stage:</span>
                <span className={`text-[12px] font-bold ${app.stage === 'Rejected' ? 'text-red-600' : 'text-foreground'}`}>
                  {app.stage}
                </span>
              </div>

              <div className="h-5 w-px bg-foreground/10 hidden lg:block mx-1"></div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {app.stage === 'Rejected' && (
                  <button 
                    onClick={async () => {
                      if (!confirm("Are you sure you want to restore this candidate to the Screening stage?")) return;
                      setActionLoading(true);
                      try {
                        await API.post(`/manager/actions/${id}/stage`, { stage: "Screening" }, token || '');
                        alert("Candidate restored to Screening stage.");
                        fetchApp();
                      } catch (err: any) {
                        alert("Failed to restore candidate: " + err.message);
                      } finally {
                        setActionLoading(false);
                      }
                    }}
                    disabled={actionLoading}
                    className="whitespace-nowrap flex-1 sm:flex-none px-3 py-1.5 bg-foreground text-background text-[12px] font-bold rounded-md hover:bg-foreground/90 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm"
                  >
                    Restore to Screening
                  </button>
                )}

                {app.stage !== 'Rejected' && pipelineSteps.indexOf(app.stage) !== -1 && pipelineSteps.indexOf(app.stage) < pipelineSteps.length - 1 && (
                  <button 
                    onClick={handleAdvanceStage}
                    disabled={actionLoading}
                    className="whitespace-nowrap flex-1 sm:flex-none px-3 py-1.5 bg-foreground text-background text-[12px] font-bold rounded-md hover:bg-foreground/90 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm"
                  >
                    Move to {pipelineSteps[pipelineSteps.indexOf(app.stage) + 1]}
                  </button>
                )}
                <button 
                  onClick={handleMessage}
                  disabled={actionLoading}
                  className="whitespace-nowrap flex-1 sm:flex-none px-3 py-1.5 bg-background border border-foreground/20 text-foreground text-[12px] font-medium rounded-md hover:bg-secondary transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-foreground/70" /> Message
                </button>

                {!['Offer', 'Hired', 'Rejected'].includes(app.stage) && (
                  <button 
                    onClick={() => setShowScheduleModal(true)}
                    disabled={actionLoading}
                    className="whitespace-nowrap flex-1 sm:flex-none px-3 py-1.5 bg-background border border-foreground/20 text-foreground text-[12px] font-medium rounded-md hover:bg-secondary transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm"
                  >
                    <Calendar className="w-3.5 h-3.5 text-foreground/70" /> Schedule
                  </button>
                )}

                {app.stage !== 'Rejected' && (
                  <button 
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="whitespace-nowrap flex-1 sm:flex-none px-3 py-1.5 bg-background border border-foreground/20 text-foreground text-[12px] font-medium rounded-md hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <div className="lg:col-span-2 space-y-8">
          
          {app.atsScore !== null && app.atsScore !== undefined && (
            <AtsScoreCard 
              score={app.atsScore} 
              matchedKeywords={app.matchedKeywords || []} 
              missingKeywords={app.missingKeywords || []} 
              suggestions={app.atsSuggestions || []} 
              isAutoRejected={app.atsScore < 40 && app.stage === 'Rejected'}
            />
          )}

          <div className="p-6 border border-foreground/10 rounded-xl bg-background shadow-sm">
            <h2 className="text-[20px] font-black text-foreground mb-8 flex items-center gap-3">
              <FileText className="w-5 h-5 text-foreground/60" /> Application Details
            </h2>
            
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-foreground/10 pb-8">
                <div className="bg-background p-5 rounded-lg border border-foreground/10 shadow-sm">
                  <div className="text-[12px] font-bold text-foreground/50 mb-1 uppercase tracking-wider">Phone Number</div>
                  <div className="text-foreground font-bold text-[16px]">{app.phone || 'Not provided'}</div>
                </div>
                <div className="bg-background p-5 rounded-lg border border-foreground/10 shadow-sm">
                  <div className="text-[12px] font-bold text-foreground/50 mb-1 uppercase tracking-wider">Experience</div>
                  <div className="text-foreground font-bold text-[16px]">{app.experience || 'Not provided'}</div>
                </div>
              </div>

              <div className="border-b border-foreground/10 pb-8">
                <div className="text-[12px] font-bold text-foreground/50 mb-4 uppercase tracking-wider">Top Skills</div>
                <div className="flex flex-wrap gap-2">
                  {app.skills ? (
                    app.skills.split(',').map((skill: string, idx: number) => (
                      <span key={idx} className="px-3 py-1.5 bg-secondary text-foreground font-medium text-[13px] rounded-md border border-foreground/10 shadow-sm">
                        {skill.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="text-foreground/50 font-medium text-[13px]">No skills provided</span>
                  )}
                </div>
              </div>

              <div>
                <div className="text-[12px] font-bold text-foreground/50 mb-4 uppercase tracking-wider">Cover Letter</div>
                <div className="p-5 bg-secondary/30 rounded-lg text-foreground text-[14px] leading-relaxed border border-foreground/10 shadow-sm">
                  {app.coverLetter || 'No cover letter provided.'}
                </div>
              </div>

              <div>
                <div className="text-[12px] font-bold text-foreground/50 mb-4 uppercase tracking-wider">Resume Document</div>
                {app.resumeUrl ? (
                  <a 
                    href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001'}${app.resumeUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-5 border border-foreground/10 rounded-lg bg-background shadow-sm hover:bg-secondary/50 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5 text-foreground/60" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground text-[16px]">View Attached Resume</div>
                      <div className="text-[13px] font-medium text-foreground/50 mt-1 flex items-center gap-2">
                        PDF/Doc format <span className="w-1 h-1 rounded-full bg-foreground/20"></span> Opens in new tab
                      </div>
                    </div>
                  </a>
                ) : (
                  <div className="p-8 border border-foreground/10 border-dashed rounded-lg bg-secondary/30 text-center">
                    <p className="text-foreground/60 font-medium text-[14px] mb-4">No resume uploaded by candidate.</p>
                    <button className="px-4 py-2 bg-background border border-foreground/20 text-foreground font-medium text-[13px] rounded-md shadow-sm hover:bg-secondary transition-colors">
                      Request Resume via Email
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Candidate Profile Details */}
          <div className="p-6 border border-foreground/10 rounded-xl bg-background shadow-sm">
            <h2 className="text-[20px] font-black text-foreground mb-8 flex items-center gap-3">
              <UserIcon className="w-5 h-5 text-foreground/60" /> Candidate Profile Details
            </h2>
            
            <div className="space-y-8">
              {app.user.locationPreference && (
                <div className="border-b border-foreground/10 pb-8">
                  <div className="text-[14px] font-bold text-foreground/50 mb-2 uppercase tracking-wider">Location Preference</div>
                  <div className="text-foreground font-bold text-[18px]">{app.user.locationPreference}</div>
                </div>
              )}

              <div className="border-b border-foreground/10 pb-8">
                <div className="text-[12px] font-bold text-foreground/50 mb-4 uppercase tracking-wider">Profile Skills</div>
                <div className="flex flex-wrap gap-2">
                  {app.user.skills && app.user.skills.length > 0 ? (
                    app.user.skills.map((skill: string, idx: number) => (
                      <span key={idx} className="px-3 py-1.5 bg-secondary text-foreground font-medium text-[13px] rounded-md border border-foreground/10 shadow-sm">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-foreground/50 font-medium text-[13px]">No profile skills provided</span>
                  )}
                </div>
              </div>

              <div className="border-b border-foreground/10 pb-8">
                <div className="text-[14px] font-bold text-foreground/50 mb-4 uppercase tracking-wider">Education Background</div>
                {app.user.education && app.user.education.length > 0 ? (
                  <div className="space-y-4">
                    {app.user.education.map((ed: any, idx: number) => (
                      <div key={idx} className="bg-secondary/30 p-5 rounded-xl border border-foreground/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="font-bold text-foreground text-[18px]">{ed.degree}</div>
                          <div className="text-foreground/70 font-medium">{ed.institution}</div>
                        </div>
                        <div className="text-foreground/50 font-bold bg-background px-4 py-2 rounded-lg border border-foreground/10 text-[14px]">
                          {ed.year}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-foreground/50 font-medium text-[14px]">No education details provided</span>
                )}
              </div>

              <div>
                <div className="text-[14px] font-bold text-foreground/50 mb-4 uppercase tracking-wider">Work Experience</div>
                {app.user.experience && app.user.experience.length > 0 ? (
                  <div className="space-y-4">
                    {app.user.experience.map((exp: any, idx: number) => (
                      <div key={idx} className="bg-secondary/30 p-5 rounded-xl border border-foreground/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="font-bold text-foreground text-[18px]">{exp.role}</div>
                          <div className="text-foreground/70 font-medium">{exp.company}</div>
                        </div>
                        <div className="text-foreground/50 font-bold bg-background px-4 py-2 rounded-lg border border-foreground/10 text-[14px]">
                          {exp.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-foreground/50 font-medium text-[14px]">No work experience provided</span>
                )}
              </div>

              <div>
                <div className="text-[14px] font-bold text-foreground/50 mb-4 uppercase tracking-wider">Portfolio Projects</div>
                {app.user.portfolio && app.user.portfolio.length > 0 ? (
                  <div className="space-y-4">
                    {app.user.portfolio.map((proj: any, idx: number) => (
                      <div key={idx} className="bg-secondary/30 p-5 rounded-xl border border-foreground/5 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-foreground text-[18px]">{proj.title}</div>
                          {proj.link && (
                            <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 text-[14px] font-bold">
                              View Project &rarr;
                            </a>
                          )}
                        </div>
                        <div className="text-foreground/70 font-medium text-[14px] mt-1">{proj.description}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-foreground/50 font-medium text-[14px]">No portfolio projects provided</span>
                )}
              </div>

              <div>
                <div className="text-[12px] font-bold text-foreground/50 mb-4 uppercase tracking-wider">Certificates</div>
                {app.user.certificates && app.user.certificates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {app.user.certificates.map((cert: any, idx: number) => (
                      <a 
                        key={idx}
                        href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001'}${cert.fileUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 border border-foreground/10 rounded-lg bg-background shadow-sm hover:bg-secondary/50 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Award className="w-5 h-5 text-foreground/60" />
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-bold text-foreground text-[14px] truncate">
                            {cert.originalName || `Certificate File ${idx + 1}`}
                          </div>
                          <div className="text-[12px] font-medium text-foreground/50 mt-1 flex items-center gap-2">
                            PDF/Doc <span className="w-1 h-1 rounded-full bg-foreground/20"></span> View Document
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <span className="text-foreground/50 font-medium text-[14px]">No certificates uploaded</span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 border border-foreground/10 rounded-xl bg-background shadow-sm">
            <h2 className="text-[20px] font-black text-foreground mb-6 flex items-center gap-3">
              <Star className="w-5 h-5 text-foreground/60" /> Manager Rating & Internal Notes
            </h2>
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} className="p-1 text-foreground/20 hover:text-amber-400 hover:scale-110 transition-all">
                  <Star className="w-8 h-8" fill={star <= (app.rating || 0) ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
            <textarea 
              rows={4}
              className="w-full px-5 py-4 border border-foreground/20 rounded-xl bg-secondary/30 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground resize-y font-medium"
              placeholder="Leave internal notes about this applicant..."
            />
            <button className="mt-4 px-6 py-2.5 bg-secondary text-foreground font-bold rounded-xl hover:bg-foreground/10 transition-colors border border-foreground/10 shadow-sm">
              Save Private Notes
            </button>
          </div>

        </div>

        {/* Sidebar: Activity Log */}
        <div className="space-y-8">
          
          <div className="p-6 border border-foreground/10 rounded-xl bg-background shadow-sm sticky top-32">
            <h2 className="text-[20px] font-black text-foreground mb-8 flex items-center gap-3">
              <Clock className="w-5 h-5 text-foreground/60" /> Timeline History
            </h2>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-[2px] before:bg-foreground/10">
              {app.activities?.length > 0 ? (
                app.activities.map((act: any) => (
                  <div key={act.id} className="relative pl-10">
                    <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full border-[4px] border-background bg-foreground shadow-sm" />
                    <div className="p-5 rounded-xl border border-foreground/10 bg-secondary/50 shadow-sm hover:border-foreground/30 transition-colors">
                      <div className="font-bold text-foreground text-[14px] leading-snug">{act.action}</div>
                      <time className="text-[12px] font-bold text-foreground/40 mt-2 block uppercase tracking-wider">
                        {new Date(act.createdAt).toLocaleString()}
                      </time>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-[14px] font-medium text-foreground/50 text-center py-4 relative z-10 bg-background">
                  No recent activity
                </div>
              )}
              
              {/* Initial Application Action */}
              <div className="relative pl-10">
                <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full border-[4px] border-background bg-foreground/20 shadow-sm" />
                <div className="p-5 rounded-xl border border-foreground/10 bg-secondary/50 shadow-sm opacity-80">
                  <div className="font-bold text-foreground text-[14px] leading-snug">Initial Application Received</div>
                  <time className="text-[12px] font-bold text-foreground/40 mt-2 block uppercase tracking-wider">
                    {new Date(app.createdAt).toLocaleString()}
                  </time>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
