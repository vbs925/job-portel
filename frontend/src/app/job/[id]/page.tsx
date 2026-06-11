"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { API } from "@/lib/api";
import { MapPin, Briefcase, Clock, ChevronLeft, ArrowDown, ExternalLink } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { token, user, isLoading } = useAuth();
  
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    // Ensure the page always starts at the very top when navigating from another page
    window.scrollTo(0, 0);
    
    const t = setTimeout(() => setMounted(true), 50);
    
    // Add scroll listener for the dots
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      const sections = document.querySelectorAll('.scroll-section');
      
      sections.forEach((section: any, index) => {
        if (
          section.offsetTop <= scrollPosition &&
          section.offsetTop + section.offsetHeight > scrollPosition
        ) {
          setActiveSection(index);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const id = params.id as string;
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-transparent">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
        <div className="text-slate-400 font-medium tracking-wide animate-pulse">Loading Job Details...</div>
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

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  const scrollToNext = () => {
    window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
  };

  // Calculate total sections for the dot navigation
  const sectionsCount = 1 + (displayAboutCompany ? 1 : 0) + (displayDescription ? 1 : 0) + (displaySkills ? 1 : 0) + (displayResponsibilities ? 1 : 0) + (displayBenefits ? 1 : 0);

  return (
    <div className={`relative transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"} bg-transparent font-sans`}>
      <Navbar />

      {/* Floating Dot Navigation (Left side) */}
      <div className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col gap-3 z-40">
        {Array.from({ length: sectionsCount }).map((_, i) => (
          <div 
            key={i} 
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeSection === i ? 'bg-slate-700 scale-110' : 'bg-slate-300'}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="w-full">
        
        {/* Hero Section */}
        <div className="scroll-section min-h-screen flex flex-col items-center justify-center pt-24 px-4 relative z-10">
          <div className="absolute top-24 left-4 sm:left-12 flex w-full max-w-7xl mx-auto px-4 z-20">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors text-[14px] bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-4xl mx-auto flex flex-col items-center w-full mt-10"
          >
            <p className="text-slate-500 font-medium mb-3">Imagine yourself at {job.company} as:</p>
            
            <h1 className="text-[60px] sm:text-[72px] md:text-[5.5rem] font-medium tracking-tight mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-600 to-slate-900">
              {job.title}
            </h1>
            
            <p className="text-[18px] sm:text-[20px] text-slate-600 mb-10 max-w-3xl leading-relaxed">
              {displayDescription?.substring(0, 200)}...
              <br />
              <span className="text-[14px] text-slate-900 mt-2 inline-block">Source: Internal</span>
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-20">
              <div className="flex items-center gap-2 text-[14px] font-bold text-slate-700 bg-white border border-slate-200 px-5 py-2.5 rounded-full shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                <MapPin className="w-4 h-4 text-slate-400" /> {job.location}
              </div>
              <div className="flex items-center gap-2 text-[14px] font-bold text-slate-700 bg-white border border-slate-200 px-5 py-2.5 rounded-full shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                <Briefcase className="w-4 h-4 text-slate-400" /> {job.type}
              </div>
              <div className="flex items-center gap-2 text-[14px] font-bold text-slate-700 bg-white border border-slate-200 px-5 py-2.5 rounded-full shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                <Clock className="w-4 h-4 text-slate-400" /> {job.salary || "Competitive Salary"}
              </div>
            </div>
            
            <p className="text-[12px] text-slate-400 mb-6 max-w-md mx-auto">
              Salary information and role details are subject to change. This role represents a general outline of responsibilities.
            </p>
            
            <button 
              onClick={scrollToNext}
              className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-900 text-white flex items-center justify-center transition-colors shadow-lg shadow-slate-700/20"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
            
          </motion.div>
        </div>

          {/* Custom Scrollbar Styles */}
        <style dangerouslySetInnerHTML={{__html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 20px;
          }
        `}} />

        {/* Dynamic Content Sections - Sticky Stacking */}
        <div className="w-full relative z-10 pb-[20vh]">
          
          {/* About Company */}
          {displayAboutCompany && (
            <div className="sticky top-0 h-screen w-full flex items-center justify-center p-6 sm:p-12">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-5xl bg-white border border-slate-200/80 rounded-[3rem] p-10 sm:p-16 shadow-[0_20px_50px_rgb(0,0,0,0.1)] flex flex-col h-[75vh]"
              >
                <div className="text-center mb-8 shrink-0">
                  <span className="text-[36px] mb-4 block">🏢</span>
                  <h2 className="text-[24px] sm:text-[30px] font-medium text-slate-800">About {job.company}</h2>
                  <p className="text-[14px] text-slate-500 mt-2">Learn more about our mission and culture.</p>
                </div>
                <div className="overflow-y-auto pr-4 custom-scrollbar flex-1">
                  <p className="text-[18px] sm:text-[20px] text-slate-600 leading-relaxed whitespace-pre-wrap text-center max-w-3xl mx-auto">
                    {displayAboutCompany}
                  </p>
                </div>
              </motion.div>
            </div>
          )}

          {/* Full Role Description */}
          {displayDescription && (
            <div className="sticky top-0 h-screen w-full flex items-center justify-center p-6 sm:p-12">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-5xl bg-white border border-slate-200/80 rounded-[3rem] p-10 sm:p-16 shadow-[0_20px_50px_rgb(0,0,0,0.1)] flex flex-col h-[75vh]"
              >
                <div className="text-center mb-8 shrink-0">
                  <span className="text-[36px] mb-4 block">✨</span>
                  <h2 className="text-[24px] sm:text-[30px] font-medium text-slate-800">The Role</h2>
                  <p className="text-[14px] text-slate-500 mt-2">What you will be doing day-to-day.</p>
                </div>
                <div className="overflow-y-auto pr-4 custom-scrollbar flex-1">
                  <p className="text-[18px] sm:text-[20px] text-slate-600 leading-relaxed whitespace-pre-wrap text-center max-w-3xl mx-auto">
                    {displayDescription}
                  </p>
                </div>
              </motion.div>
            </div>
          )}

          {/* Skills Needed */}
          {displaySkills && (
            <div className="sticky top-0 h-screen w-full flex items-center justify-center p-6 sm:p-12">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-5xl bg-white border border-slate-200/80 rounded-[3rem] p-10 sm:p-16 shadow-[0_20px_50px_rgb(0,0,0,0.1)] flex flex-col h-[75vh]"
              >
                <div className="text-center mb-10 shrink-0">
                  <span className="text-[36px] mb-4 block">🎯</span>
                  <h2 className="text-[24px] sm:text-[30px] font-medium text-slate-800">What You'll Need</h2>
                  <p className="text-[14px] text-slate-500 mt-2">Core skills and qualifications for this role.</p>
                </div>
                <div className="overflow-y-auto pr-4 custom-scrollbar flex flex-wrap justify-center content-start gap-4 flex-1">
                  {displaySkills.split('\n').map((line: string, i: number) => {
                    if (!line.trim()) return null;
                    const cleanLine = line.replace(/^- /, '').replace(/^\* /, '');
                    return (
                      <span 
                        key={i}
                        className="bg-slate-50 border border-slate-200 px-6 py-3 rounded-full text-[16px] font-medium text-slate-700 shadow-sm h-fit"
                      >
                        {cleanLine}
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}

          {/* Key Responsibilities */}
          {displayResponsibilities && (
            <div className="sticky top-0 h-screen w-full flex items-center justify-center p-6 sm:p-12">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-5xl bg-white border border-slate-200/80 rounded-[3rem] p-10 sm:p-16 shadow-[0_20px_50px_rgb(0,0,0,0.1)] flex flex-col h-[75vh]"
              >
                <div className="text-center mb-10 shrink-0">
                  <span className="text-[36px] mb-4 block">💪</span>
                  <h2 className="text-[24px] sm:text-[30px] font-medium text-slate-800">Key Responsibilities</h2>
                  <p className="text-[14px] text-slate-500 mt-2">Your impact and key deliverables.</p>
                </div>
                <div className="overflow-y-auto pr-4 custom-scrollbar space-y-6 text-left max-w-3xl mx-auto w-full flex-1">
                  {displayResponsibilities.split('\n').map((line: string, i: number) => {
                    if (!line.trim()) return null;
                    const cleanLine = line.replace(/^- /, '').replace(/^\* /, '');
                    return (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-2.5" />
                        <p className="text-[18px] text-slate-600 leading-relaxed">
                          {cleanLine}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}

          {/* Perks & Benefits */}
          {displayBenefits && (
            <div className="sticky top-0 h-screen w-full flex items-center justify-center p-6 sm:p-12">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-5xl bg-white border border-slate-200/80 rounded-[3rem] p-10 sm:p-16 shadow-[0_20px_50px_rgb(0,0,0,0.1)] flex flex-col h-[75vh]"
              >
                <div className="text-center mb-10 shrink-0">
                  <span className="text-[36px] mb-4 block">🎁</span>
                  <h2 className="text-[24px] sm:text-[30px] font-medium text-slate-800">Perks & Benefits</h2>
                  <p className="text-[14px] text-slate-500 mt-2">What we offer to our team.</p>
                </div>
                <div className="overflow-y-auto pr-4 custom-scrollbar space-y-6 text-left max-w-3xl mx-auto w-full flex-1">
                  {displayBenefits.split('\n').map((line: string, i: number) => {
                    if (!line.trim()) return null;
                    const cleanLine = line.replace(/^- /, '').replace(/^\* /, '');
                    return (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-2.5" />
                        <span className="text-[18px] text-slate-600 leading-relaxed">{cleanLine}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}

          {/* Bottom Apply Section */}
          <div className="sticky top-0 h-screen w-full flex items-center justify-center p-6 sm:p-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-5xl bg-slate-50 border border-slate-200/60 rounded-[3rem] p-16 shadow-[0_20px_50px_rgb(15,23,42,0.1)] flex flex-col items-center justify-center h-[75vh]"
            >
              <h2 className="text-[36px] sm:text-[48px] font-medium text-slate-900 mb-6 text-center">Ready to join us?</h2>
              <p className="text-[18px] text-slate-700 mb-10 text-center max-w-xl">
                Take the next step in your career with {job.company}. We are reviewing applications on a rolling basis.
              </p>
              <button 
                onClick={() => router.push(`/job/${job.id}/apply`)}
                className="bg-slate-900 text-white font-medium px-12 py-5 rounded-full hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/30 text-[20px] flex items-center justify-center gap-3"
              >
                Apply for this role <ExternalLink className="w-6 h-6" />
              </button>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
