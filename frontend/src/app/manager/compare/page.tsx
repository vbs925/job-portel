"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { API } from "@/lib/api";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';

function CompareContent() {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const idsParam = searchParams.get("ids");
  const jobTitle = searchParams.get("jobTitle") || "Job Role";
  
  const [report, setReport] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'MANAGER')) {
      router.push("/manager-login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchComparison = async () => {
      if (!token || !idsParam) {
        if (!idsParam) setError("No candidates selected for comparison.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const applicantIds = idsParam.split(',');
        
        const response = await API.post('/ai/compare-candidates', {
          jobTitle,
          applicantIds
        }, token);

        setReport(response.report);
      } catch (err: any) {
        console.error("Failed to generate comparison:", err);
        setError(err.message || "Failed to generate comparison report.");
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [token, idsParam, jobTitle]);

  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="border-b border-foreground/10 bg-background/50 backdrop-blur-md sticky top-16 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-[14px] font-bold text-foreground/50 hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Candidates
          </button>
          <div>
            <h1 className="text-[30px] font-bold text-foreground tracking-tight flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-foreground" /> AI Candidate Comparison
            </h1>
            <p className="text-foreground/60 mt-1 font-medium">Comparing selected applicants for: <span className="font-bold text-foreground">{jobTitle}</span></p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-foreground/10"></div>
              <div className="absolute inset-0 rounded-full border-4 border-foreground border-t-transparent animate-spin"></div>
            </div>
            <div className="text-foreground/60 font-bold text-[18px] animate-pulse">Analyzing profiles & extracting insights...</div>
          </div>
        ) : error ? (
          <div className="p-6 border border-red-500/20 bg-red-500/5 rounded-xl text-center">
            <h3 className="text-red-600 font-bold text-[18px] mb-2">Error Generating Report</h3>
            <p className="text-red-500/80">{error}</p>
          </div>
        ) : (
          <div className="p-8 border border-foreground/10 rounded-xl bg-background shadow-sm prose prose-neutral max-w-none 
            prose-headings:font-bold prose-headings:text-foreground 
            prose-p:text-foreground/80 prose-li:text-foreground/80
            prose-strong:text-foreground prose-strong:font-bold
            prose-a:text-foreground hover:prose-a:text-foreground-hover
            prose-ul:list-disc prose-ol:list-decimal"
          >
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-pulse text-foreground/50 font-medium">Loading...</div></div>}>
      <CompareContent />
    </Suspense>
  );
}
