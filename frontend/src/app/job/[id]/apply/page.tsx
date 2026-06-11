"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Upload, FileText, Send, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { API } from '@/lib/api';

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token, isLoading } = useAuth();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('jobId', job.id);
      if (phone) formData.append('phone', phone);
      if (skills) formData.append('skills', skills);
      if (experience) formData.append('experience', experience);
      if (coverLetter) formData.append('coverLetter', coverLetter);
      if (resume) formData.append('resume', resume);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/applications`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to submit application');
      }
    } catch (err) {
      setError('An error occurred while submitting your application.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !job || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-foreground/50 font-medium">Loading Application Form...</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-32 text-center">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-[36px] font-black text-foreground mb-4">Application Submitted!</h1>
          <p className="text-[18px] text-foreground/70 mb-8 max-w-lg mx-auto">
            Thank you for applying to the <strong>{job.title}</strong> role. We have received your resume and details. 
            <br/><br/>
            An automated confirmation email has been sent to <strong>{user.email}</strong>.
          </p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-foreground text-background font-bold px-8 py-3.5 rounded-xl hover:bg-foreground/90 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-foreground/60 hover:text-foreground font-medium mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Job Details
        </button>

        <div className="mb-10">
          <h1 className="text-[30px] font-black text-foreground tracking-tight mb-2">
            Submit Your Application
          </h1>
          <p className="text-foreground/70 font-medium text-[18px]">
            Applying for <strong>{job.title}</strong> at {job.company}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-background border border-foreground/10 rounded-2xl p-8 sm:p-10 shadow-sm space-y-8">
          
          {/* Personal Info Readonly */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[14px] font-bold text-foreground/50 mb-2">Full Name</label>
              <input 
                type="text"
                value={user.name || ''}
                readOnly
                className="w-full px-4 py-3 border border-foreground/10 rounded-lg bg-secondary/30 text-foreground/70 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-[14px] font-bold text-foreground/50 mb-2">Email Address</label>
              <input 
                type="email"
                value={user.email || ''}
                readOnly
                className="w-full px-4 py-3 border border-foreground/10 rounded-lg bg-secondary/30 text-foreground/70 cursor-not-allowed"
              />
            </div>
          </div>

          <hr className="border-foreground/10" />

          {/* Contact & Professional Info */}
          <div className="space-y-6">
            <div>
              <label className="block text-[14px] font-bold text-foreground mb-2">Phone Number <span className="text-red-500">*</span></label>
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="+91 98765 43210"
                required
              />
            </div>

            <div>
              <label className="block text-[14px] font-bold text-foreground mb-2">Top Skills <span className="text-red-500">*</span></label>
              <input 
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="e.g. React, Node.js, TypeScript, SQL"
                required
              />
              <p className="text-[12px] text-foreground/50 mt-1 font-medium">Comma separated list of your best skills.</p>
            </div>

            <div>
              <label className="block text-[14px] font-bold text-foreground mb-2">Years of Experience (Optional)</label>
              <input 
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="e.g. 4 years"
              />
            </div>
          </div>

          <hr className="border-foreground/10" />

          {/* Documents */}
          <div className="space-y-6">
            <div>
              <label className="block text-[14px] font-bold text-foreground mb-2">Resume Document <span className="text-red-500">*</span></label>
              <div className="relative group cursor-pointer">
                <input 
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setResume(e.target.files[0]);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  required
                />
                <div className={`w-full px-4 py-10 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${resume ? 'border-primary bg-primary/5' : 'border-foreground/20 bg-secondary/30 group-hover:bg-secondary group-hover:border-foreground/40'}`}>
                  {resume ? (
                    <>
                      <FileText className="w-10 h-10 text-primary mb-3" />
                      <span className="text-[14px] font-bold text-primary text-center px-4 truncate w-full max-w-xs">{resume.name}</span>
                      <span className="text-[12px] font-medium text-foreground/50 mt-1">{(resume.size / 1024 / 1024).toFixed(2)} MB</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-foreground/40 mb-3 group-hover:text-primary/50 transition-colors" />
                      <span className="text-[16px] font-bold text-foreground/70">Click to upload or drag & drop</span>
                      <span className="text-[14px] font-medium text-foreground/40 mt-1">PDF, DOC, DOCX up to 5MB</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[14px] font-bold text-foreground mb-2">Cover Letter (Optional)</label>
              <textarea 
                rows={5}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-y"
                placeholder="Why are you a great fit for this role?"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 text-red-600 border border-red-500/20 rounded-xl text-[14px] font-bold">
              {error}
            </div>
          )}

          <div className="pt-6">
            <button 
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-foreground text-background font-bold text-[18px] rounded-xl hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
            >
              {submitting ? "Submitting Application..." : (
                <>Submit Application <Send className="w-5 h-5" /></>
              )}
            </button>
            <p className="text-center text-[12px] font-medium text-foreground/40 mt-4">
              By submitting, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}
