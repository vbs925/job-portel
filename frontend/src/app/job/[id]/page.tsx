"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { API } from "@/lib/api";
import { MapPin, Briefcase, Clock, ChevronLeft } from "lucide-react";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { token, user, isLoading } = useAuth();
  
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const id = params.id as string;
        // In a real app, we'd have a GET /jobs/:id endpoint.
        // For now, we fetch all jobs and find the right one
        const allJobs = await API.get('/jobs');
        const found = allJobs.find((j: any) => j.id === id);
        if (found) {
          setJob(found);
        } else {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Failed to fetch job", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [params.id, router]);

  if (loading || !job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-foreground/50 font-medium">Loading Job Details...</div>
      </div>
    );
  }

  // Fallback for legacy jobs
  const isLegacyJob = !job.aboutCompany && !job.keyResponsibilities && !job.skillsNeeded && !job.benefits;
  const legacySections = isLegacyJob ? (job.description?.split('\n\n**') || []) : [];
  
  const displayAboutCompany = job.aboutCompany;
  const displayDescription = isLegacyJob ? legacySections[0] : job.description;
  const displayResponsibilities = isLegacyJob 
    ? legacySections.find((s: string) => s.toLowerCase().includes('responsibilities:**'))?.replace('Responsibilities:**\n', '') || ''
    : job.keyResponsibilities;
  const displaySkills = isLegacyJob
    ? legacySections.find((s: string) => s.toLowerCase().includes('requirements:**'))?.replace('Requirements:**\n', '') || ''
    : job.skillsNeeded;
  const displayBenefits = job.benefits;

  return (
    <div className="min-h-screen bg-background pb-20">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-foreground/60 hover:text-foreground font-medium mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        {/* Job Header */}
        <div className="bg-secondary/20 border border-foreground/10 rounded-2xl p-8 mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-2">
            {job.title}
          </h1>
          <p className="text-lg font-medium text-foreground/70 mb-6">{job.company}</p>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 bg-background border border-foreground/10 px-4 py-2 rounded-lg shadow-sm">
              <MapPin className="w-4 h-4 text-primary" /> {job.location}
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 bg-background border border-foreground/10 px-4 py-2 rounded-lg shadow-sm">
              <Briefcase className="w-4 h-4 text-primary" /> {job.type}
            </div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-primary bg-primary/10 border border-primary/20 px-4 py-2 rounded-lg">
              {job.salary}
            </div>
          </div>
        </div>

        {/* Job Content */}
        <div className="bg-background border border-foreground/10 rounded-2xl p-8 sm:p-12 mb-8 shadow-sm">
          
          {displayAboutCompany && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4">About the Company</h2>
              <div className="text-foreground/80 font-medium leading-relaxed whitespace-pre-wrap">
                {displayAboutCompany}
              </div>
            </div>
          )}

          {displayDescription && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4">About the Job</h2>
              <div className="text-foreground/80 font-medium leading-relaxed whitespace-pre-wrap">
                {displayDescription}
              </div>
            </div>
          )}

          {displayResponsibilities && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4">Key Responsibilities</h2>
              <div className="text-foreground/80 font-medium leading-relaxed whitespace-pre-wrap">
                {displayResponsibilities}
              </div>
            </div>
          )}

          {displaySkills && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4">Required Skills & Experience</h2>
              <div className="text-foreground/80 font-medium leading-relaxed whitespace-pre-wrap">
                {displaySkills}
              </div>
            </div>
          )}

          {displayBenefits && (
            <div className="mb-12">
              <h2 className="text-xl font-bold text-foreground mb-4">Why Join Us</h2>
              <div className="text-foreground/80 font-medium leading-relaxed whitespace-pre-wrap">
                {displayBenefits}
              </div>
            </div>
          )}

          {/* Apply Action */}
          <div className="border-t border-foreground/10 pt-8 flex items-center justify-between">
            <div>
              <p className="font-bold text-foreground">Ready to join us?</p>
              <p className="text-sm text-foreground/60 mt-1">Make sure you have your resume ready.</p>
            </div>
            <button 
              onClick={() => router.push(`/job/${job.id}/apply`)}
              className="bg-foreground text-background font-bold px-8 py-3.5 rounded-xl hover:bg-foreground/90 transition-colors shadow-lg transform hover:-translate-y-0.5"
            >
              Apply Now
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
