"use client";

import { useState } from 'react';
import { X, Upload, FileText, Send } from 'lucide-react';

interface ApplicationModalProps {
  jobId: string;
  jobTitle: string;
  company?: string;
  location?: string;
  type?: string;
  salary?: string;
  description?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ApplicationModal({ jobId, jobTitle, company, location, type, salary, description, onClose, onSuccess }: ApplicationModalProps) {
  const [phone, setPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('jobPortalToken');
      
      const formData = new FormData();
      formData.append('jobId', jobId);
      if (phone) formData.append('phone', phone);
      if (coverLetter) formData.append('coverLetter', coverLetter);
      if (resume) formData.append('resume', resume);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/applications`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        body: formData // Let browser set multipart/form-data boundary
      });

      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to submit application');
      }
    } catch (err) {
      setError('An error occurred while submitting your application.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-background border border-foreground/10 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header (Mobile Only or Global Close) */}
        <div className="px-6 py-4 border-b border-foreground/10 flex justify-between items-center bg-secondary/30 shrink-0">
          <div>
            <h2 className="text-[20px] font-bold text-foreground">{jobTitle}</h2>
            <p className="text-[14px] font-medium text-foreground/70 mt-1">{company}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-foreground/50 hover:text-foreground hover:bg-foreground/10 rounded-full transition-colors bg-background border border-foreground/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Split Content */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          
          {/* Left Side: Job Details */}
          <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto border-b md:border-b-0 md:border-r border-foreground/10 bg-secondary/10">
            <h3 className="text-[18px] font-bold text-foreground mb-4">Job Details</h3>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-secondary text-foreground text-[14px] font-medium rounded-md">{location}</span>
              <span className="px-3 py-1 bg-secondary text-foreground text-[14px] font-medium rounded-md">{type}</span>
              <span className="px-3 py-1 bg-primary/10 text-primary font-bold text-[14px] rounded-md">{salary}</span>
            </div>

            <div className="prose prose-sm md:prose-base prose-p:text-foreground/80 prose-headings:text-foreground prose-li:text-foreground/80 max-w-none">
              {description ? (
                <div className="whitespace-pre-wrap font-medium leading-relaxed">{description}</div>
              ) : (
                <p className="italic text-foreground/50">No description provided for this role.</p>
              )}
            </div>
          </div>

          {/* Right Side: Application Form */}
          <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto bg-background">
            <h3 className="text-[18px] font-bold text-foreground mb-6">Apply for this role</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[14px] font-bold text-foreground mb-2">Phone Number</label>
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
                <label className="block text-[14px] font-bold text-foreground mb-2">Cover Letter / Message</label>
                <textarea 
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-y"
                  placeholder="Why are you a great fit for this role?"
                />
              </div>

              <div>
                <label className="block text-[14px] font-bold text-foreground mb-2">Resume (PDF or Word)</label>
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
                  <div className={`w-full px-4 py-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${resume ? 'border-primary bg-primary/5' : 'border-foreground/20 bg-secondary/30 group-hover:bg-secondary group-hover:border-foreground/40'}`}>
                    {resume ? (
                      <>
                        <FileText className="w-8 h-8 text-primary mb-2" />
                        <span className="text-[14px] font-bold text-primary text-center px-4 truncate w-full">{resume.name}</span>
                        <span className="text-[12px] font-medium text-foreground/50 mt-1">{(resume.size / 1024 / 1024).toFixed(2)} MB</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-foreground/40 mb-2" />
                        <span className="text-[14px] font-bold text-foreground/70">Click to upload or drag & drop</span>
                        <span className="text-[12px] font-medium text-foreground/40 mt-1">PDF, DOC, DOCX up to 5MB</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 text-red-600 border border-red-500/20 rounded-lg text-[14px] font-bold">
                  {error}
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-secondary text-foreground font-bold rounded-lg hover:bg-foreground/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-3 px-4 bg-foreground text-background font-bold rounded-lg hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Submitting..." : (
                    <>Submit Application <Send className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
