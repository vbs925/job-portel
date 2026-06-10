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
  const [activeTab, setActiveTab] = useState<"discover" | "saved">("discover");
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);

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
        
        const allLocations = [...selectedLocationModes, ...selectedCities];
        if (allLocations.length > 0) params.append('location', allLocations.join(','));
        
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

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-foreground/50 font-medium">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Top Area */}
      <div className="pt-24 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Discover Opportunities</h1>
            <p className="text-foreground/60 mt-1 font-medium">Find and apply for your next great role.</p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-6 mt-8 border-b border-foreground/10">
          <button 
            onClick={() => setActiveTab("discover")}
            className={`pb-3 font-bold text-sm transition-colors border-b-2 ${activeTab === "discover" ? "border-primary text-primary" : "border-transparent text-foreground/50 hover:text-foreground/80"}`}
          >
            Discover Roles
          </button>
          <button 
            onClick={() => setActiveTab("saved")}
            className={`pb-3 font-bold text-sm transition-colors border-b-2 ${activeTab === "saved" ? "border-primary text-primary" : "border-transparent text-foreground/50 hover:text-foreground/80"}`}
          >
            Saved Jobs ({savedJobs.length})
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        
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
                  className="block w-full pl-11 pr-4 py-4 border border-foreground/20 rounded-xl bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-lg"
                  placeholder="Search for job titles, companies, or keywords..."
                />
              </div>

              {/* Job Feed */}
              <div className="space-y-4">
                {loadingJobs ? (
                  <div className="py-12 text-center text-foreground/50">Loading jobs...</div>
                ) : jobs.length > 0 ? (
                  jobs.map((job) => (
                    <JobCard 
                      key={job.id} 
                      id={job.id} 
                      {...job} 
                      isSaved={savedJobs.some(sj => sj.id === job.id)}
                      onSaveToggle={handleSaveToggle}
                    />
                  ))
                ) : (
                  <div className="py-12 text-center text-foreground/50">No jobs found matching your filters.</div>
                )}
              </div>
            </>
          )}

          {activeTab === "saved" && (
            <div className="space-y-4">
              {loadingJobs ? (
                <div className="py-12 text-center text-foreground/50">Loading saved jobs...</div>
              ) : savedJobs.length > 0 ? (
                savedJobs.map((job) => (
                  <JobCard 
                    key={job.id} 
                    id={job.id} 
                    {...job} 
                    isSaved={true}
                    onSaveToggle={handleSaveToggle}
                  />
                ))
              ) : (
                <div className="text-center py-20 border border-foreground/10 border-dashed rounded-xl">
                  <Bookmark className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground">No saved jobs yet</h3>
                  <p className="text-foreground/60 mt-2">Roles you bookmark will appear here for easy access.</p>
                  <button 
                    onClick={() => setActiveTab("discover")}
                    className="mt-6 px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary-hover transition-colors"
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
              <h3 className="font-bold text-lg text-foreground mb-6">Filter Options</h3>
              
              <div className="space-y-8">
                {/* Job Type */}
                <div>
                  <h4 className="text-sm font-bold text-foreground/70 mb-3 flex items-center gap-2">
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
                        <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location Mode */}
                <div>
                  <h4 className="text-sm font-bold text-foreground/70 mb-3 flex items-center gap-2">
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
                        <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Cities */}
                <div>
                  <h4 className="text-sm font-bold text-foreground/70 mb-3 flex items-center gap-2">
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
                        <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">{city}</span>
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
  );
}
