"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import JobCard from "@/components/JobCard";
import Link from "next/link";
import { motion } from "framer-motion";
import { API } from "@/lib/api";

export default function Home() {
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await API.get('/jobs');
        setFeaturedJobs(jobs.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch featured jobs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-foreground selection:text-background">
      <Hero />
      
      {/* Featured Jobs Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 border-b border-foreground/5 pb-6">
          <div>
            <h2 className="text-[24px] font-semibold text-foreground tracking-tight">Featured Opportunities</h2>
            <p className="mt-2 text-foreground/50 text-[14px] font-medium">Curated roles from top engineering and design teams.</p>
          </div>
          <Link href="/jobs" className="mt-4 sm:mt-0 text-foreground/60 hover:text-foreground text-[14px] font-medium transition-colors">
            View all jobs &rarr;
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="text-center text-foreground/40 py-12 font-medium animate-pulse text-[14px]">
              Loading featured roles...
            </div>
          ) : featuredJobs.map((job, index) => (
            <motion.div 
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <JobCard 
                id={job.id}
                title={job.title}
                company={job.company}
                location={job.location}
                type={job.type}
                salary={job.salary || "Not specified"}
                postedAt={new Date(job.createdAt).toLocaleDateString()}
                description={job.description}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Hiring Promise Section - Minimalist Redesign */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full border-t border-foreground/5">
        <div className="mb-16">
          <h2 className="text-[24px] font-semibold text-foreground tracking-tight mb-4">Why we built this.</h2>
          <p className="max-w-2xl text-[18px] text-foreground/60 font-normal leading-relaxed">
            The hiring market is broken. We wanted to create a platform that respects both the candidate's time and the company's needs. A clean interface, transparent salaries, and zero spam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-foreground/5 pt-12">
          {[
            {
              title: "Absolute Clarity",
              desc: "Salary ranges and equity expectations are required upfront. No wasted interviews."
            },
            {
              title: "Signal over Noise",
              desc: "We strictly vet companies and roles. You only see high-quality, relevant opportunities."
            },
            {
              title: "Direct Connection",
              desc: "Apply directly to hiring managers. Bypass the traditional resume black hole."
            }
          ].map((feature, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="text-[12px] font-mono text-foreground/40 mb-4">0{idx + 1}</div>
              <h3 className="text-[16px] font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-foreground/60 text-[14px] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
