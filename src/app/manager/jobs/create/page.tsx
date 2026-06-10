"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { API } from "@/lib/api";
import { ArrowLeft, Plus, X, Save, Send } from "lucide-react";
import Link from "next/link";

export default function CreateJob() {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('id');

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
    status: "PUBLISHED",
    hiringSteps: ["Applied", "Screening", "Interview", "Offer"]
  });

  const [newStep, setNewStep] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'MANAGER')) {
      router.push("/manager-login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (jobId && token) {
      // Fetch existing job for editing
      const fetchJob = async () => {
        try {
          const jobs = await API.get('/manager/jobs', token);
          const job = jobs.find((j: any) => j.id === jobId);
          if (job) {
            setFormData({
              title: job.title,
              company: job.company,
              location: job.location,
              type: job.type,
              salary: job.salary || "",
              description: job.description || "",
              status: job.status,
              hiringSteps: job.hiringSteps || ["Applied", "Screening", "Interview", "Offer"]
            });
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchJob();
    }
  }, [jobId, token]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddStep = () => {
    if (newStep.trim() && !formData.hiringSteps.includes(newStep.trim())) {
      setFormData(prev => ({
        ...prev,
        hiringSteps: [...prev.hiringSteps, newStep.trim()]
      }));
      setNewStep("");
    }
  };

  const handleRemoveStep = (stepToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      hiringSteps: prev.hiringSteps.filter(step => step !== stepToRemove)
    }));
  };

  const handleSubmit = async (status: string) => {
    if (!token) return;
    setSubmitting(true);
    try {
      const dataToSubmit = { ...formData, status };
      
      if (jobId) {
        await API.post(`/manager/jobs/${jobId}?_method=PUT`, dataToSubmit, token); // Using POST as PUT fallback or implement PUT in API
      } else {
        await API.post('/manager/jobs', dataToSubmit, token);
      }
      
      router.push('/manager/dashboard');
    } catch (err) {
      console.error(err);
      alert("Failed to save job");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="border-b border-foreground/10 bg-background/50 backdrop-blur-md sticky top-16 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/manager/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-foreground/50 hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                {jobId ? 'Edit Job Listing' : 'Create New Job'}
              </h1>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => handleSubmit('DRAFT')}
                disabled={submitting}
                className="px-4 py-2 border border-foreground/20 text-foreground font-bold rounded-lg hover:bg-secondary transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save as Draft
              </button>
              <button 
                onClick={() => handleSubmit('PUBLISHED')}
                disabled={submitting}
                className="px-6 py-2 bg-foreground text-background font-bold rounded-lg hover:bg-foreground/90 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Publish Job
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Basic Info */}
        <div className="p-8 border border-foreground/10 rounded-xl bg-background shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-foreground mb-2">Job Title</label>
              <input 
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. Senior Product Designer"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Company Name</label>
              <input 
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. TechCorp Inc."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Location</label>
              <input 
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. Remote, San Francisco, CA"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Job Type</label>
              <select 
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Salary Range</label>
              <input 
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. $120k - $150k"
              />
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="p-8 border border-foreground/10 rounded-xl bg-background shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-6">Job Description & Requirements</h2>
          <div>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={8}
              className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y"
              placeholder="Describe the role, responsibilities, and requirements..."
            />
          </div>
        </div>

        {/* Hiring Pipeline */}
        <div className="p-8 border border-foreground/10 rounded-xl bg-background shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Hiring Pipeline Steps</h2>
              <p className="text-sm text-foreground/60 font-medium mt-1">Define the custom stages an applicant will go through.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            {formData.hiringSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground font-bold rounded-lg border border-foreground/10">
                <span className="text-foreground/50 mr-1">{index + 1}.</span> {step}
                {step !== 'Applied' && ( // Prevent removing the default first step
                  <button onClick={() => handleRemoveStep(step)} className="ml-2 text-foreground/40 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <input 
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddStep()}
              className="flex-1 px-4 py-3 border border-foreground/20 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Technical Assessment"
            />
            <button 
              onClick={handleAddStep}
              className="px-6 py-3 bg-foreground text-background font-bold rounded-lg hover:bg-foreground/90 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Add Step
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
