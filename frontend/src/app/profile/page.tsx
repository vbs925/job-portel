"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { API } from "@/lib/api";
import { 
  User, Lock, Trash2, Plus, X, GraduationCap, Briefcase, MapPin, 
  Code, Save, Award, FileText, ChevronDown, Globe
} from "lucide-react";
import Link from "next/link";

function ProfileContent() {
  const { user, isLoading, token, logout, updateUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams?.get('tab') || 'professional';
  
  // Profile State
  const [name, setName] = useState("");
  const [locationPreference, setLocationPreference] = useState("");
  const [education, setEducation] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [newSkill, setNewSkill] = useState("");
  
  // Social Links
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [website, setWebsite] = useState("");
  
  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Status State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const data = await API.get('/profile/me', token);
        setName(data.name || "");
        setLocationPreference(data.locationPreference || "");
        setEducation(Array.isArray(data.education) ? data.education : []);
        setExperience(Array.isArray(data.experience) ? data.experience : []);
        setSkills(Array.isArray(data.skills) ? data.skills : []);
        setCertificates(Array.isArray(data.certificates) ? data.certificates : []);
        setPortfolio(Array.isArray(data.portfolioProjects) ? data.portfolioProjects : []);
        
        setLinkedin(data.socialLinks?.linkedin || "");
        setGithub(data.socialLinks?.github || "");
        setWebsite(data.socialLinks?.website || "");
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleSaveProfile = async () => {
    if (!token) return;
    setSaving(true);
    try {
      await API.put('/profile/me', {
        name,
        locationPreference,
        education,
        experience,
        skills,
        certificates,
        portfolioProjects: portfolio,
        socialLinks: { linkedin, github, website }
      }, token);
      
      if (name) {
        updateUser({ name });
      }
      
      showMessage("Profile updated successfully!", "success");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      showMessage(err.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return showMessage("New passwords do not match", "error");
    }
    if (!token) return;
    setSaving(true);
    try {
      await API.put('/profile/me/password', {
        currentPassword,
        newPassword
      }, token);
      showMessage("Password changed successfully!", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      showMessage(err.message || "Failed to change password", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!token) return;
    setSaving(true);
    try {
      await API.delete('/profile/me', {}, token);
      logout();
      router.push("/");
    } catch (err: any) {
      showMessage(err.message || "Failed to delete account", "error");
      setSaving(false);
      setShowDeleteConfirm(false);
    }
  };

  // Dynamic Handlers
  const addEducation = () => setEducation([...education, { degree: "", institution: "", year: "" }]);
  const updateEducation = (index: number, field: string, value: string) => {
    const newEd = [...education];
    newEd[index][field] = value;
    setEducation(newEd);
  };
  const removeEducation = (index: number) => setEducation(education.filter((_, i) => i !== index));

  const addExperience = () => setExperience([...experience, { role: "", company: "", duration: "" }]);
  const updateExperience = (index: number, field: string, value: string) => {
    const newExp = [...experience];
    newExp[index][field] = value;
    setExperience(newExp);
  };
  const removeExperience = (index: number) => setExperience(experience.filter((_, i) => i !== index));

  const addPortfolio = () => setPortfolio([...portfolio, { title: "", description: "", link: "" }]);
  const updatePortfolio = (index: number, field: string, value: string) => {
    const newPort = [...portfolio];
    newPort[index][field] = value;
    setPortfolio(newPort);
  };
  const removePortfolio = (index: number) => setPortfolio(portfolio.filter((_, i) => i !== index));

  const removeCertificate = (index: number) => setCertificates(certificates.filter((_, i) => i !== index));

  const handleCertificateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const originalName = file.name;
    const formData = new FormData();
    formData.append('certificate', file);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/me/certificates/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      
      setCertificates([...certificates, { fileUrl: data.fileUrl, originalName }]);
      showMessage("Certificate uploaded successfully!", "success");
    } catch (err: any) {
      showMessage(err.message || "Failed to upload certificate", "error");
    }
    e.target.value = '';
  };

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };
  const removeSkill = (skillToRemove: string) => setSkills(skills.filter(s => s !== skillToRemove));

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-pulse font-bold text-foreground/50">Loading profile...</div></div>;
  }

  const isManager = user.role === 'MANAGER';

  return (
    <div className="min-h-screen bg-background pb-20 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-[28px] font-black text-foreground tracking-tight">
            {activeTab === 'settings' ? 'Account Settings' : 'Profile Details'}
          </h1>
          {activeTab === "professional" && (
            <button 
              onClick={handleSaveProfile}
              disabled={saving}
              className="px-6 py-2.5 bg-foreground text-background font-bold rounded-lg hover:bg-foreground/90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" /> {saving ? "Saving..." : "Save Profile"}
            </button>
          )}
        </div>

        {message.text && (
          <div className={`p-4 mb-6 rounded-lg font-medium text-[14px] flex items-center justify-between ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-200' : 'bg-red-500/10 text-red-600 border border-red-200'}`}>
            {message.text}
            <button onClick={() => setMessage({ text: "", type: "" })}><X className="w-4 h-4" /></button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-foreground/50">Loading your information...</div>
        ) : (
          <>
            {/* Details Tab */}
            {activeTab === "professional" && (
              <div className="space-y-8 animate-in fade-in">
                
                {/* Basic Info */}
                <div className="bg-background border border-foreground/10 rounded-xl p-6 shadow-sm">
                  <h3 className="text-[18px] font-bold flex items-center gap-2 mb-4"><User className="w-5 h-5 text-foreground" /> Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[14px] font-bold text-foreground/70 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="w-full p-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-foreground focus:outline-none" 
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-[14px] font-bold text-foreground/70 mb-2">Location {isManager ? "" : "Preference"}</label>
                      <div className="relative">
                        <MapPin className="w-5 h-5 text-foreground/40 absolute left-3 top-3.5 pointer-events-none" />
                        <select 
                          value={locationPreference} 
                          onChange={(e) => setLocationPreference(e.target.value)} 
                          className="w-full pl-10 pr-10 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-foreground focus:outline-none appearance-none cursor-pointer" 
                        >
                          <option value="" disabled>Select Location</option>
                          <option value="Remote">Remote</option>
                          <option value="Bangalore">Bangalore</option>
                          <option value="Mumbai">Mumbai</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Hyderabad">Hyderabad</option>
                          <option value="Pune">Pune</option>
                          <option value="Chennai">Chennai</option>
                          <option value="Kolkata">Kolkata</option>
                          <option value="Ahmedabad">Ahmedabad</option>
                        </select>
                        <ChevronDown className="w-5 h-5 text-foreground/40 absolute right-3 top-3.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-background border border-foreground/10 rounded-xl p-6 shadow-sm">
                  <h3 className="text-[18px] font-bold flex items-center gap-2 mb-6"><Globe className="w-5 h-5 text-foreground/60" /> Digital Footprint</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[14px] font-bold text-foreground/70 mb-2 flex items-center gap-2"><Briefcase className="w-4 h-4" /> LinkedIn URL</label>
                      <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="w-full p-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-foreground focus:outline-none" placeholder="linkedin.com/in/username" />
                    </div>
                    <div>
                      <label className="block text-[14px] font-bold text-foreground/70 mb-2 flex items-center gap-2"><Code className="w-4 h-4" /> GitHub URL</label>
                      <input type="text" value={github} onChange={(e) => setGithub(e.target.value)} className="w-full p-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-foreground focus:outline-none" placeholder="github.com/username" />
                    </div>
                    <div>
                      <label className="block text-[14px] font-bold text-foreground/70 mb-2 flex items-center gap-2"><Globe className="w-4 h-4" /> Portfolio Website</label>
                      <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full p-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-foreground focus:outline-none" placeholder="yourwebsite.com" />
                    </div>
                  </div>
                </div>

                {/* Candidate Only Sections */}
                {!isManager && (
                  <>
                    {/* Education */}
                    <div className="bg-background border border-foreground/10 rounded-xl p-6 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[18px] font-bold flex items-center gap-2"><GraduationCap className="w-5 h-5 text-foreground/60" /> Education Background</h3>
                        <button onClick={addEducation} className="text-[13px] font-medium text-foreground hover:bg-secondary flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-md border border-foreground/20 shadow-sm transition-colors">
                          <Plus className="w-3.5 h-3.5" /> Add Education
                        </button>
                      </div>
                      
                      {education.length === 0 ? (
                        <p className="text-foreground/50 text-[14px] italic">No education added yet.</p>
                      ) : (
                        <div className="space-y-4">
                          {education.map((ed, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-4 p-4 border border-foreground/10 rounded-lg bg-foreground/5 relative group">
                              <button onClick={() => removeEducation(index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"><X className="w-3 h-3" /></button>
                              <div className="flex-1">
                                <input type="text" placeholder="Degree / Certificate (e.g. B.S. Computer Science)" value={ed.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} className="w-full p-2.5 text-[14px] border border-foreground/20 rounded-md bg-background" />
                              </div>
                              <div className="flex-1">
                                <input type="text" placeholder="Institution" value={ed.institution} onChange={(e) => updateEducation(index, 'institution', e.target.value)} className="w-full p-2.5 text-[14px] border border-foreground/20 rounded-md bg-background" />
                              </div>
                              <div className="w-full md:w-32">
                                <input type="text" placeholder="Year" value={ed.year} onChange={(e) => updateEducation(index, 'year', e.target.value)} className="w-full p-2.5 text-[14px] border border-foreground/20 rounded-md bg-background" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Experience */}
                    <div className="bg-background border border-foreground/10 rounded-xl p-6 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[18px] font-bold flex items-center gap-2"><Briefcase className="w-5 h-5 text-foreground/60" /> Work Experience <span className="text-[12px] font-normal text-foreground/40 ml-2">(Optional)</span></h3>
                        <button onClick={addExperience} className="text-[13px] font-medium text-foreground hover:bg-secondary flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-md border border-foreground/20 shadow-sm transition-colors">
                          <Plus className="w-3.5 h-3.5" /> Add Experience
                        </button>
                      </div>
                      
                      {experience.length === 0 ? (
                        <p className="text-foreground/50 text-[14px] italic">No work experience added yet.</p>
                      ) : (
                        <div className="space-y-4">
                          {experience.map((exp, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-4 p-4 border border-foreground/10 rounded-lg bg-foreground/5 relative group">
                              <button onClick={() => removeExperience(index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"><X className="w-3 h-3" /></button>
                              <div className="flex-1">
                                <input type="text" placeholder="Job Title / Role" value={exp.role} onChange={(e) => updateExperience(index, 'role', e.target.value)} className="w-full p-2.5 text-[14px] border border-foreground/20 rounded-md bg-background" />
                              </div>
                              <div className="flex-1">
                                <input type="text" placeholder="Company Name" value={exp.company} onChange={(e) => updateExperience(index, 'company', e.target.value)} className="w-full p-2.5 text-[14px] border border-foreground/20 rounded-md bg-background" />
                              </div>
                              <div className="w-full md:w-40">
                                <input type="text" placeholder="Duration (e.g. 2020-2023)" value={exp.duration} onChange={(e) => updateExperience(index, 'duration', e.target.value)} className="w-full p-2.5 text-[14px] border border-foreground/20 rounded-md bg-background" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Certificates */}
                    <div className="bg-background border border-foreground/10 rounded-xl p-6 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[18px] font-bold flex items-center gap-2"><Award className="w-5 h-5 text-foreground/60" /> Certificates</h3>
                        <div>
                          <input type="file" id="cert-upload" className="hidden" onChange={handleCertificateUpload} accept=".pdf,.doc,.docx" />
                          <label htmlFor="cert-upload" className="cursor-pointer text-[13px] font-medium text-foreground hover:bg-secondary flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-md border border-foreground/20 shadow-sm transition-colors">
                            <Plus className="w-3.5 h-3.5" /> Upload Certificate
                          </label>
                        </div>
                      </div>
                      
                      {certificates.length === 0 ? (
                        <p className="text-foreground/50 text-[14px] italic">No certificates uploaded yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {certificates.map((cert, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border border-foreground/10 rounded-lg bg-secondary/30 group">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <FileText className="w-5 h-5 text-foreground/60 flex-shrink-0" />
                                <a href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001'}${cert.fileUrl}`} target="_blank" rel="noopener noreferrer" className="text-[14px] font-bold text-foreground hover:text-foreground transition-colors truncate">
                                  {cert.originalName || `Certificate ${index + 1}`}
                                </a>
                              </div>
                              <button type="button" onClick={() => removeCertificate(index)} className="p-1.5 text-foreground/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Portfolio */}
                    <div className="bg-background border border-foreground/10 rounded-xl p-6 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-[18px] font-bold flex items-center gap-2"><Briefcase className="w-5 h-5 text-foreground/60" /> Portfolio Projects <span className="text-[12px] font-normal text-foreground/40 ml-2">(Optional)</span></h3>
                        <button onClick={addPortfolio} className="text-[13px] font-medium text-foreground hover:bg-secondary flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-md border border-foreground/20 shadow-sm transition-colors">
                          <Plus className="w-3.5 h-3.5" /> Add Project
                        </button>
                      </div>
                      
                      {portfolio.length === 0 ? (
                        <p className="text-foreground/50 text-[14px] italic">No portfolio projects added yet.</p>
                      ) : (
                        <div className="space-y-4">
                          {portfolio.map((proj, index) => (
                            <div key={index} className="flex flex-col gap-3 p-4 border border-foreground/10 rounded-lg bg-foreground/5 relative group">
                              <button onClick={() => removePortfolio(index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"><X className="w-3 h-3" /></button>
                              <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                  <input type="text" placeholder="Project Title" value={proj.title} onChange={(e) => updatePortfolio(index, 'title', e.target.value)} className="w-full p-2.5 text-[14px] border border-foreground/20 rounded-md bg-background" />
                                </div>
                                <div className="flex-1">
                                  <input type="text" placeholder="Link (URL)" value={proj.link} onChange={(e) => updatePortfolio(index, 'link', e.target.value)} className="w-full p-2.5 text-[14px] border border-foreground/20 rounded-md bg-background" />
                                </div>
                              </div>
                              <div>
                                <textarea placeholder="Short description" value={proj.description} onChange={(e) => updatePortfolio(index, 'description', e.target.value)} className="w-full p-2.5 text-[14px] border border-foreground/20 rounded-md bg-background" rows={2} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    <div className="bg-background border border-foreground/10 rounded-xl p-6 shadow-sm">
                      <h3 className="text-[18px] font-bold flex items-center gap-2 mb-4"><Code className="w-5 h-5 text-foreground/60" /> Skills</h3>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {skills.map((skill, index) => (
                          <span key={index} className="px-3 py-1.5 bg-foreground/10 text-foreground font-medium rounded-full text-[14px] flex items-center gap-2">
                            {skill}
                            <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                          </span>
                        ))}
                        {skills.length === 0 && <p className="text-foreground/50 text-[14px] italic w-full">Add your skills below.</p>}
                      </div>

                      <form onSubmit={addSkill} className="flex gap-2">
                        <input 
                          type="text" 
                          value={newSkill} 
                          onChange={(e) => setNewSkill(e.target.value)} 
                          placeholder="Type a skill and press Enter..." 
                          className="flex-1 p-2.5 text-[14px] border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-foreground focus:outline-none"
                        />
                        <button type="submit" className="px-4 py-2.5 bg-secondary text-foreground font-bold rounded-lg hover:bg-foreground/10 transition-colors">Add</button>
                      </form>
                    </div>
                  </>
                )}

              </div>
            )}

            {/* Account Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-8 animate-in fade-in">
                
                {/* Change Password */}
                <div className="bg-background border border-foreground/10 rounded-xl p-6 shadow-sm">
                  <h3 className="text-[18px] font-bold flex items-center gap-2 mb-6"><Lock className="w-5 h-5 text-foreground/70" /> Change Password</h3>
                  <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-[14px] font-bold text-foreground/70 mb-2">Current Password</label>
                      <input type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full p-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-foreground focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[14px] font-bold text-foreground/70 mb-2">New Password</label>
                      <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-foreground focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[14px] font-bold text-foreground/70 mb-2">Confirm New Password</label>
                      <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-foreground focus:outline-none" />
                    </div>
                    <button disabled={saving} type="submit" className="px-6 py-2.5 bg-foreground text-background font-bold rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50">
                      Update Password
                    </button>
                  </form>
                </div>

                {/* Delete Account */}
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 shadow-sm">
                  <h3 className="text-[18px] font-bold flex items-center gap-2 mb-2 text-red-600"><Trash2 className="w-5 h-5" /> Danger Zone</h3>
                  <p className="text-foreground/70 text-[14px] mb-6">Permanently delete your account and all associated data, including your job applications. This action cannot be undone.</p>
                  
                  {!showDeleteConfirm ? (
                    <button onClick={() => setShowDeleteConfirm(true)} className="px-6 py-2.5 bg-red-100 text-red-600 font-bold rounded-lg hover:bg-red-200 transition-colors border border-red-200">
                      Delete Account
                    </button>
                  ) : (
                    <div className="p-4 bg-red-100 border border-red-300 rounded-lg inline-block">
                      <p className="font-bold text-red-800 mb-4">Are you absolutely sure?</p>
                      <div className="flex gap-4">
                        <button onClick={handleDeleteAccount} disabled={saving} className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
                          {saving ? "Deleting..." : "Yes, Delete Everything"}
                        </button>
                        <button onClick={() => setShowDeleteConfirm(false)} disabled={saving} className="px-6 py-2 bg-white text-foreground font-bold rounded-lg hover:bg-foreground/5 transition-colors border border-foreground/20">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-pulse font-bold text-foreground/50">Loading profile...</div></div>}>
      <ProfileContent />
    </Suspense>
  );
}
