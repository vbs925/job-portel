"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { API } from "@/lib/api";
import Image from "next/image";
import pointsAll from "@/assets/pointsall.svg";

const DOMAIN_FILTERS = ["All domains", "Technology", "Banking", "Healthcare", "Hospitality"];

export default function CurrentOpenings() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All domains");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await API.get("/jobs?limit=6");
        setJobs(data);
      } catch {
        // fallback to placeholder cards
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Placeholder cards when no jobs are loaded
  const placeholderJobs = Array.from({ length: 3 }).map((_, i) => ({
    id: `placeholder-${i}`,
    title: "Senior Software Engineer",
    company: "Infosys",
    location: "Bengaluru",
    workType: "On-site",
    experience: "4-5 YOE",
    description:
      "We are looking for a Senior Software Engineer to design, develop, and maintain scalable web applications.",
    placeholder: true,
  }));

  const displayJobs = (jobs.length > 0 ? jobs : placeholderJobs).slice(0, 3);

  return (
    <section className="current-openings-section">
      <div className="current-openings-card">

        {/* Section label */}
        <div className="section-label-wrapper">
          <Image src={pointsAll} alt="Points" className="w-auto h-2" />
          <span className="section-label-text">EXPLORE</span>
        </div>

        {/* Heading */}
        <h2 className="current-openings-title">Current Openings</h2>

        {/* Domain filter tabs */}
        <div className="current-openings-filters">
          {DOMAIN_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`current-openings-filter-btn ${activeFilter === filter ? "active" : ""}`}
            >
              {filter}
            </button>
          ))}
          <button className="current-openings-filter-more">20+ More</button>
        </div>

        {/* Job cards grid */}
        {loading ? (
          <div className="w-full text-center py-16 text-gray-400 text-[15px]">
            Loading openings...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full mt-2">
            {displayJobs.map((job: any, idx: number) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="job-card-item"
              >
                {/* Job title */}
                <h3 className="job-card-title">{job.title}</h3>

                {/* Company */}
                <p className="job-card-company">
                  {job.company}
                  <sup className="text-[10px] ml-0.5">®</sup>
                </p>

                {/* Tags row */}
                <div className="job-card-tags">
                  <span className="job-card-tag">
                    <svg className="w-3.5 h-3.5 opacity-50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location || "Bengaluru"} • {job.workType || job.type || "On-site"}
                  </span>
                  <span className="job-card-tag">{job.experience || "4-5 YOE"}</span>
                </div>

                {/* Description */}
                <p className="job-card-desc">{job.description}</p>

                {/* Apply button */}
                {job.placeholder ? (
                  <button className="job-card-apply-btn">Apply</button>
                ) : (
                  <Link href={`/jobs/${job.id}`} className="job-card-apply-btn block text-center">
                    Apply
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* View all roles button with dashed lines */}
        <div className="flex items-center gap-6 w-full mt-14 mb-4">
          <div className="flex-1 border-t border-dashed border-gray-300"></div>
          <Link href="/jobs" className="flex items-center gap-2.5 px-6 py-2.5 bg-white border border-gray-400 rounded-full text-[14px] font-semibold text-gray-900 hover:bg-gray-50 transition-colors shadow-sm" style={{ fontFamily: 'var(--font-sans)' }}>
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="3" y="8" width="18" height="12" rx="2" ry="2" />
              <path d="M16 8V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              <path d="M3 13h18" />
            </svg>
            See all open roles
          </Link>
          <div className="flex-1 border-t border-dashed border-gray-300"></div>
        </div>

      </div>
    </section>
  );
}
