"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { API } from "@/lib/api";
import { Search, MapPin, Briefcase, Bookmark, Building2 } from "lucide-react";
import JobCard from "@/components/JobCard";

export default function Dashboard() {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();
  
  // Tabs & Loading
  const [activeTab, setActiveTab] = useState<"discover" | "saved" | "suggested">("discover");
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [suggestedJobs, setSuggestedJobs] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLocationModes, setSelectedLocationModes] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];
  const LOCATION_MODES = ["Remote", "On-site", "Hybrid"];
  const CITIES = ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai"];

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!token) return;
      try {
        setLoadingJobs(true);
        
        // Build Query String
        const params = new URLSearchParams();
        if (debouncedSearch.trim()) params.append('search', debouncedSearch.trim());
        if (selectedTypes.length > 0) params.append('type', selectedTypes.join(','));
        if (selectedLocationModes.length > 0) params.append('mode', selectedLocationModes.join(','));
        if (selectedCities.length > 0) params.append('city', selectedCities.join(','));
        
        const allJobs = await API.get(`/jobs?${params.toString()}`);
        setJobs(allJobs);
        
        // Fetch saved jobs
        const saved = await API.get('/jobs/saved', token);
        setSavedJobs(saved);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoadingJobs(false);
      }
    };
    
    fetchJobs();
  }, [token, debouncedSearch, selectedTypes, selectedLocationModes, selectedCities]);

  useEffect(() => {
    if (activeTab === "suggested" && suggestedJobs.length === 0 && !loadingSuggestions && token) {
      const fetchSuggestions = async () => {
        try {
          setLoadingSuggestions(true);
          const data = await API.get('/jobs/suggested', token);
          setSuggestedJobs(data);
        } catch (err) {
          console.error("Failed to fetch suggestions", err);
        } finally {
          setLoadingSuggestions(false);
        }
      };
      fetchSuggestions();
    }
  }, [activeTab, token, suggestedJobs.length, loadingSuggestions]);

  // Handlers for Save Toggle
  const handleSaveToggle = (jobId: string, isSaved: boolean) => {
    if (isSaved) {
      const jobToAdd = jobs.find(j => j.id === jobId);
      if (jobToAdd && !savedJobs.some(sj => sj.id === jobId)) {
        setSavedJobs(prev => [jobToAdd, ...prev]);
      }
    } else {
      setSavedJobs(prev => prev.filter(sj => sj.id !== jobId));
    }
  };

  // Handlers for Filters
  const toggleArrayItem = (array: string[], setArray: (val: string[]) => void, item: string) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-foreground/50 font-medium">Loading your dashboard...</div>
      </div>
    );
  }

  const firstName = user.name?.split(" ")[0] || "there";

  const selectedJob = jobs.find(j => j.id === selectedJobId) || suggestedJobs.find(j => j.id === selectedJobId) || savedJobs.find(j => j.id === selectedJobId) || jobs[0] || null;

  return (
    <>
      <style>{`
        @keyframes db-slide-down  { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes db-slide-up    { from { opacity:0; transform:translateY(24px); }  to { opacity:1; transform:translateY(0); } }
        @keyframes db-fade-in     { from { opacity:0; }                               to { opacity:1; } }
        @keyframes db-shimmer     {
          0%   { background-position:-400px 0; }
          100% { background-position:400px 0; }
        }
        .db-hero  { animation: db-slide-down 0.55s cubic-bezier(.25,.46,.45,.94) both; }
        .db-tabs  { animation: db-slide-up   0.45s ease 0.1s both; }
        .db-body  { animation: db-fade-in    0.5s  ease 0.2s both; }
        .db-card-0 { animation: db-slide-up 0.4s ease 0.05s both; }
        .db-card-1 { animation: db-slide-up 0.4s ease 0.12s both; }
        .db-card-2 { animation: db-slide-up 0.4s ease 0.19s both; }
        .db-card-3 { animation: db-slide-up 0.4s ease 0.26s both; }
        .db-card-4 { animation: db-slide-up 0.4s ease 0.33s both; }
        .db-card-5 { animation: db-slide-up 0.4s ease 0.40s both; }
        .db-card-6 { animation: db-slide-up 0.4s ease 0.47s both; }
        .db-card-7 { animation: db-slide-up 0.4s ease 0.54s both; }
      `}</style>

      <div className={`min-h-screen relative transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"} overflow-hidden bg-transparent`}>

      {/* Hero Banner */}
      <div className="relative z-10 db-hero pt-8 pb-4">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-4">
          <div className="flex flex-col gap-2">
            <p className="text-slate-800 text-[14px] font-bold tracking-wider uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-800 animate-pulse"></span>
              Welcome back
            </p>
            <h1 className="text-[36px] sm:text-[48px] font-black text-slate-900 leading-tight">
              Hey, {firstName}!<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700">
                Let's find your next role.
              </span>
            </h1>
            <p className="text-slate-600 mt-2 font-medium max-w-lg">Browse curated opportunities or let AI match you with the perfect fit.</p>
          </div>
        </div>
      </div>
        
        {/* Tabs */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-4">
          <div className="db-tabs flex gap-6 border-b border-foreground/10 pt-8">
            <button 
              onClick={() => setActiveTab("discover")}
              className={`pb-3 font-bold text-[14px] transition-colors border-b-2 ${activeTab === "discover" ? "border-primary text-primary" : "border-transparent text-foreground/50 hover:text-foreground/80"}`}
            >
              Discover Roles
            </button>
            <button 
              onClick={() => setActiveTab("suggested")}
              className={`pb-3 font-bold text-[14px] transition-colors border-b-2 ${activeTab === "suggested" ? "border-primary text-primary" : "border-transparent text-foreground/50 hover:text-foreground/80"}`}
            >
              AI Suggestions ✨
            </button>
            <button 
              onClick={() => setActiveTab("saved")}
              className={`pb-3 font-bold text-[14px] transition-colors border-b-2 ${activeTab === "saved" ? "border-primary text-primary" : "border-transparent text-foreground/50 hover:text-foreground/80"}`}
            >
              Saved Jobs ({savedJobs.length})
            </button>
          </div>
        </div>

      <div className="db-body max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-4 py-4 flex flex-col lg:flex-row-reverse gap-8">
        
        {/* Main Content Area */}
        <div className="flex-1">
          {activeTab === "discover" && (
            <>
              {/* Search Bar */}
              <div className="relative mb-8 shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-foreground/40" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 border border-foreground/20 rounded-xl bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-[18px]"
                  placeholder="Search for job titles, companies, or keywords..."
                />
              </div>

              {/* Job Feed */}
              <div className="flex flex-col gap-4">
                {loadingJobs ? (
                  <div className="col-span-full py-12 text-center text-foreground/50">Loading jobs...</div>
                ) : jobs.length > 0 ? (
                  jobs.map((job, index) => (
                    <div key={job.id} className={`db-card-${Math.min(index, 7)}`}>
                      <JobCard 
                        id={job.id} 
                        {...job} 
                        isSaved={savedJobs.some(sj => sj.id === job.id)}
                        onSaveToggle={handleSaveToggle}
                        onSelect={(id) => setSelectedJobId(id)}
                        selected={selectedJobId ? selectedJobId === job.id : index === 0 && !selectedJobId}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-foreground/50">No jobs found matching your filters.</div>
                )}
              </div>
            </>
          )}

          {activeTab === "suggested" && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 shadow-sm">
                <span className="text-[24px]">✨</span>
                <div>
                  <h3 className="font-bold text-teal-900">AI Job Suggestions</h3>
                  <p className="text-[14px] text-slate-800">These roles were matched specifically to your skills, experience, and portfolio.</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                {loadingSuggestions ? (
                  <div className="col-span-full py-12 text-center text-foreground/50 font-medium animate-pulse">Analyzing your profile & finding the best matches...</div>
                ) : suggestedJobs.length > 0 ? (
                  suggestedJobs.map((job, index) => (
                    <div key={job.id} className={`db-card-${Math.min(index, 7)}`}>
                      <JobCard 
                        id={job.id} 
                        {...job} 
                        isSaved={savedJobs.some(sj => sj.id === job.id)}
                        onSaveToggle={handleSaveToggle}
                        onSelect={(id) => setSelectedJobId(id)}
                        selected={selectedJobId ? selectedJobId === job.id : index === 0 && !selectedJobId}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 border border-foreground/10 border-dashed rounded-xl">
                    <h3 className="text-[20px] font-bold text-foreground">No perfect matches yet</h3>
                    <p className="text-foreground/60 mt-2">Try updating your profile with more skills and projects.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {loadingJobs ? (
                <div className="col-span-full py-12 text-center text-foreground/50">Loading saved jobs...</div>
              ) : savedJobs.length > 0 ? (
                savedJobs.map((job, index) => (
                  <div key={job.id} className={`db-card-${Math.min(index, 7)}`}>
                    <JobCard 
                      id={job.id} 
                      {...job} 
                      isSaved={true}
                      onSaveToggle={handleSaveToggle}
                      onSelect={(id) => setSelectedJobId(id)}
                      selected={selectedJobId ? selectedJobId === job.id : index === 0 && !selectedJobId}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 border border-foreground/10 border-dashed rounded-xl">
                  <Bookmark className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                  <h3 className="text-[20px] font-bold text-foreground">No saved jobs yet</h3>
                  <p className="text-foreground/60 mt-2">Roles you bookmark will appear here for easy access.</p>
                  <button 
                    onClick={() => setActiveTab("discover")}
                    className="mt-6 bg-slate-900 text-white font-bold text-[14px] px-[24px] py-[12px] rounded-[12px] hover:bg-black transition-colors"
                  >
                    Explore Roles
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filter Sidebar */}
        {activeTab === "discover" && (
          <div className="w-80 hidden lg:block">
            <div className="bg-background border border-foreground/10 rounded-xl p-6 sticky top-24">
              <h3 className="font-bold text-[18px] text-foreground mb-6">Filter Options</h3>
              
              <div className="space-y-8">
                {/* Job Type */}
                <div>
                  <h4 className="text-[14px] font-bold text-foreground/70 mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Job Type
                  </h4>
                  <div className="space-y-2.5">
                    {JOB_TYPES.map(type => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={selectedTypes.includes(type)}
                          onChange={() => toggleArrayItem(selectedTypes, setSelectedTypes, type)}
                          className="rounded border-foreground/30 text-primary focus:ring-primary w-4 h-4 transition-colors" 
                        />
                        <span className="text-[14px] font-medium text-foreground/80 group-hover:text-foreground transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location Mode */}
                <div>
                  <h4 className="text-[14px] font-bold text-foreground/70 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Location Mode
                  </h4>
                  <div className="space-y-2.5">
                    {LOCATION_MODES.map(type => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={selectedLocationModes.includes(type)}
                          onChange={() => toggleArrayItem(selectedLocationModes, setSelectedLocationModes, type)}
                          className="rounded border-foreground/30 text-primary focus:ring-primary w-4 h-4 transition-colors" 
                        />
                        <span className="text-[14px] font-medium text-foreground/80 group-hover:text-foreground transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Cities */}
                <div>
                  <h4 className="text-[14px] font-bold text-foreground/70 mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> Indian Cities
                  </h4>
                  <div className="space-y-2.5">
                    {CITIES.map(city => (
                      <label key={city} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={selectedCities.includes(city)}
                          onChange={() => toggleArrayItem(selectedCities, setSelectedCities, city)}
                          className="rounded border-foreground/30 text-primary focus:ring-primary w-4 h-4 transition-colors" 
                        />
                        <span className="text-[14px] font-medium text-foreground/80 group-hover:text-foreground transition-colors">{city}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
}
