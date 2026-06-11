"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { API } from "@/lib/api";
import { Check, ArrowRight, ArrowLeft, Plus, X, Sparkles, MapPin, Building2, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

// ─── Static data ──────────────────────────────────────────────────────────────
const ROLE_OPTIONS = [
  { value: "Software Engineering", icon: "💻" },
  { value: "Design & Creative", icon: "🎨" },
  { value: "Data & Analytics", icon: "📊" },
  { value: "Marketing & Growth", icon: "📣" },
  { value: "Business & Management", icon: "💼" },
  { value: "Finance & Accounting", icon: "🏦" },
  { value: "Sales & Customer Success", icon: "🤝" },
  { value: "Research & Science", icon: "🔬" },
  { value: "Operations & Logistics", icon: "🏗️" },
  { value: "Healthcare & Medicine", icon: "🏥" },
  { value: "Education & Training", icon: "📚" },
  { value: "Legal & Compliance", icon: "⚖️" },
];

const EXPERIENCE_OPTIONS = [
  { value: "Fresher",  label: "Student / Fresher", subtitle: "0–1 years", icon: "🌱", color: "#10b981" },
  { value: "Junior",  label: "Junior",             subtitle: "1–3 years", icon: "🚀", color: "#3b82f6" },
  { value: "Mid",     label: "Mid-level",          subtitle: "3–6 years", icon: "⚡", color: "#8b5cf6" },
  { value: "Senior",  label: "Senior",             subtitle: "6+ years",  icon: "🏆", color: "#f59e0b" },
];

const WORK_PREF_OPTIONS = [
  { value: "Remote",    subtitle: "Work from anywhere",   icon: "🏠", color: "#06b6d4" },
  { value: "In-office", subtitle: "I love the office",    icon: "🏢", color: "#8b5cf6" },
  { value: "Hybrid",    subtitle: "Best of both worlds",  icon: "🔄", color: "#ec4899" },
  { value: "Flexible",  subtitle: "Open to anything",     icon: "💡", color: "#f59e0b" },
];

const SKILLS_BY_ROLE: Record<string, string[]> = {
  "Software Engineering":     ["JavaScript","TypeScript","Python","React","Node.js","SQL","Git","Docker","AWS","REST APIs","GraphQL","Next.js","Go","Java","Kubernetes","Redis"],
  "Design & Creative":        ["Figma","Adobe XD","Sketch","Illustrator","Photoshop","UI Design","UX Research","Prototyping","Wireframing","Motion Design","Branding","Design Systems","After Effects"],
  "Data & Analytics":         ["Python","SQL","Excel","Power BI","Tableau","Machine Learning","Statistics","R","Pandas","NumPy","Data Visualization","Spark","dbt","Looker"],
  "Marketing & Growth":       ["SEO","SEM","Google Analytics","Content Marketing","Email Marketing","Social Media","A/B Testing","Copywriting","HubSpot","Salesforce","Growth Hacking","Meta Ads","LinkedIn Ads"],
  "Business & Management":    ["Project Management","Strategy","OKRs","Agile","Scrum","Stakeholder Management","Excel","PowerPoint","Business Analysis","Leadership","JIRA","Notion","Risk Management"],
  "Finance & Accounting":     ["Excel","Financial Modeling","Accounting","SAP","Budgeting","Forecasting","Taxation","Audit","Bloomberg","GAAP","Tally","QuickBooks"],
  "Sales & Customer Success": ["CRM","Salesforce","Negotiation","Account Management","HubSpot","Customer Onboarding","Pipeline Management","B2B Sales","Upselling","Cold Calling","Demo Skills"],
  "Research & Science":       ["Research Methods","Data Analysis","Academic Writing","Python","SPSS","Literature Review","Statistical Analysis","Grant Writing","R"],
  "Operations & Logistics":   ["Supply Chain","ERP","SAP","Lean Management","Six Sigma","Inventory Management","Excel","Process Improvement","Logistics"],
  "Healthcare & Medicine":    ["Patient Care","Clinical Research","Electronic Health Records","Medical Coding","Pharmacology","HIPAA","First Aid","Lab Work"],
  "Education & Training":     ["Curriculum Design","eLearning","LMS","Instructional Design","Public Speaking","Mentoring","Google Classroom","Zoom"],
  "Legal & Compliance":       ["Contract Law","Compliance","Legal Research","Due Diligence","Regulatory Affairs","Litigation","Risk Management","GDPR"],
};

const INTEREST_OPTIONS = [
  { value: "Reading", icon: "📚" }, { value: "Gaming", icon: "🎮" },
  { value: "Sports", icon: "⚽" }, { value: "Music", icon: "🎵" },
  { value: "Travel", icon: "✈️" }, { value: "Cooking", icon: "🍳" },
  { value: "Art & Drawing", icon: "🎨" }, { value: "Photography", icon: "📷" },
  { value: "Fitness", icon: "💪" }, { value: "Writing", icon: "✍️" },
  { value: "Movies & TV", icon: "🎬" }, { value: "Volunteering", icon: "🤝" },
  { value: "Podcasts", icon: "🎙️" }, { value: "Coding side projects", icon: "🛠️" },
  { value: "Meditation", icon: "🧘" }, { value: "Dancing", icon: "💃" },
];

const TOTAL_STEPS = 5;

// ─── Framer Motion variants ───────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] as [number,number,number,number] } },
  exit:   (dir: number) => ({ x: dir > 0 ? -100 : 100, opacity: 0, transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as [number,number,number,number] } }),
};

const staggerFadeUp = (i: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.045, duration: 0.35, ease: "easeOut" as const },
});

interface Job { id: string; title: string; company: string; location: string; type: string; salary?: string; description?: string; }

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [role, setRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [showCustomRole, setShowCustomRole] = useState(false);
  const [experience, setExperience] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [workPref, setWorkPref] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [matchedJobs, setMatchedJobs] = useState<Job[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [pendingAdvance, setPendingAdvance] = useState(false);

  useEffect(() => { if (!isLoading && !user) router.push("/register"); }, [user, isLoading, router]);

  const goNext = useCallback(() => { setDir(1); setStep(s => Math.min(s + 1, TOTAL_STEPS - 1)); }, []);
  const goBack = useCallback(() => { setDir(-1); setStep(s => Math.max(s - 1, 0)); }, []);

  const selectAndAdvance = (setter: (v: string) => void, value: string) => {
    setter(value);
    setPendingAdvance(true);
  };

  useEffect(() => {
    if (!pendingAdvance) return;
    const t = setTimeout(() => { setPendingAdvance(false); goNext(); }, 420);
    return () => clearTimeout(t);
  }, [pendingAdvance, goNext]);

  const toggleSkill    = (s: string) => setSelectedSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const addCustomSkill = () => { const t = customSkill.trim(); if (t && !selectedSkills.includes(t)) setSelectedSkills(p => [...p, t]); setCustomSkill(""); };
  const toggleInterest = (v: string) => setSelectedInterests(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);

  const handleComplete = async () => {
    setIsSaving(true);
    const finalRole = customRole.trim() || role;
    const extractedData = { targetRole: finalRole, experienceLevel: experience, skills: selectedSkills, locationPreference: workPref, interests: selectedInterests, background: `${experience} level ${finalRole} professional seeking ${workPref} opportunities` };
    try {
      const result = await API.post("/onboarding/complete", { extractedData }, token!);
      setMatchedJobs(result.matchedJobs || []);
    } catch { setMatchedJobs([]); }
    finally { setIsSaving(false); setIsDone(true); }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-slate-800 border-t-slate-900 border-slate-200 animate-spin" />
      </div>
    );
  }

  const suggestedSkills = SKILLS_BY_ROLE[role] || SKILLS_BY_ROLE["Software Engineering"];

  // ─── Step renders ─────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      // ── Step 0: Role ──────────────────────────────────────────────────────
      case 0: return (
        <div>
          <div className="mb-8">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Step 1 of 5</p>
            <h2 className="text-[30px] sm:text-[36px] font-black text-slate-900 leading-tight">
              What field are<br />you targeting?
            </h2>
            <p className="text-slate-400 mt-2 text-[14px] font-medium">Pick the one that best describes your career path</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
            {ROLE_OPTIONS.map((opt, i) => {
              const active = role === opt.value;
              return (
                <motion.button key={opt.value} {...staggerFadeUp(i)}
                  onClick={() => selectAndAdvance(setRole, opt.value)}
                  whileTap={{ scale: 0.94 }}
                  className={`relative group flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 text-center transition-all duration-200 select-none cursor-pointer ${
                    active
                      ? "border-slate-800 bg-slate-50 shadow-lg shadow-slate-100"
                      : "border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50/50 hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-100/50"
                  }`}
                >
                  {active && (
                    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      className="absolute top-2 right-2 w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center shadow-md shadow-slate-300">
                      <Check className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                  <span className="text-[24px] group-hover:scale-110 transition-transform duration-200">{opt.icon}</span>
                  <span className={`text-[12px] font-bold leading-snug ${active ? "text-slate-800" : "text-slate-600"}`}>{opt.value}</span>
                </motion.button>
              );
            })}
          </div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
            {!showCustomRole ? (
              <button onClick={() => setShowCustomRole(true)}
                className="w-full flex items-center justify-center gap-2 px-[24px] py-[12px] border border-dashed border-slate-300 rounded-[12px] text-slate-500 hover:border-slate-400 hover:text-slate-700 text-[14px] font-bold transition-all">
                <Plus className="w-4 h-4" /> Something else…
              </button>
            ) : (
              <div className="flex gap-2">
                <input autoFocus value={customRole} onChange={e => setCustomRole(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && customRole.trim()) { setRole("custom"); goNext(); } }}
                  placeholder="Type your field…"
                  className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-2xl text-[14px] font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400/30 placeholder:text-slate-300" />
                <button onClick={() => { if (customRole.trim()) { setRole("custom"); goNext(); } }}
                  className="bg-slate-900 text-white font-bold text-[14px] px-[24px] py-[12px] rounded-[12px] hover:bg-black transition-colors flex items-center gap-1.5">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      );

      // ── Step 1: Experience ────────────────────────────────────────────────
      case 1: return (
        <div>
          <div className="mb-8">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Step 2 of 5</p>
            <h2 className="text-[30px] sm:text-[36px] font-black text-slate-900 leading-tight">
              How much experience<br />do you have?
            </h2>
            <p className="text-slate-400 mt-2 text-[14px] font-medium">We'll match you with roles at the right level</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {EXPERIENCE_OPTIONS.map((opt, i) => {
              const active = experience === opt.value;
              return (
                <motion.button key={opt.value} {...staggerFadeUp(i)}
                  onClick={() => selectAndAdvance(setExperience, opt.value)}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex flex-col items-start gap-1.5 p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer select-none overflow-hidden ${
                    active ? "border-transparent shadow-xl" : "border-slate-100 bg-white hover:border-slate-200 hover:-translate-y-0.5 hover:shadow-lg"
                  }`}
                  style={active ? { background: `linear-gradient(135deg, ${opt.color}15 0%, ${opt.color}25 100%)`, borderColor: `${opt.color}60` } : {}}
                >
                  {active && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: opt.color }}>
                      <Check className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                  <span className="text-[30px]">{opt.icon}</span>
                  <span className="text-[16px] font-bold text-slate-800">{opt.label}</span>
                  <span className="text-[12px] font-semibold text-slate-400">{opt.subtitle}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      );

      // ── Step 2: Skills ────────────────────────────────────────────────────
      case 2: return (
        <div>
          <div className="mb-7">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Step 3 of 5</p>
            <h2 className="text-[30px] sm:text-[36px] font-black text-slate-900 leading-tight">What are your<br />key skills?</h2>
            <p className="text-slate-400 mt-2 text-[14px] font-medium">Tap to select — pick as many as you want</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {suggestedSkills.map((skill, i) => {
              const active = selectedSkills.includes(skill);
              return (
                <motion.button key={skill} {...staggerFadeUp(i)}
                  onClick={() => toggleSkill(skill)} whileTap={{ scale: 0.92 }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[14px] font-semibold border-2 transition-all duration-150 select-none ${
                    active
                      ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-300/30"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50/50"
                  }`}>
                  {active && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}><Check className="w-3 h-3" /></motion.span>}
                  {skill}
                </motion.button>
              );
            })}
          </div>

          <div className="flex gap-2 mb-4">
            <input value={customSkill} onChange={e => setCustomSkill(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addCustomSkill()}
              placeholder="Add a skill not listed…"
              className="flex-1 text-[14px] px-4 py-2.5 border-2 border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400/30 focus:border-slate-400 placeholder:text-slate-300" />
            <button onClick={addCustomSkill}
              className="bg-white text-slate-800 border border-slate-200 font-bold text-[14px] px-[24px] py-[12px] rounded-[12px] hover:bg-slate-50 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[12px] text-slate-400 font-medium">
              {selectedSkills.length > 0 ? `${selectedSkills.length} skill${selectedSkills.length !== 1 ? "s" : ""} selected` : "Select at least one skill"}
            </span>
            <button onClick={goNext} disabled={selectedSkills.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-slate-300/30">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      );

      // ── Step 3: Work Preference ───────────────────────────────────────────
      case 3: return (
        <div>
          <div className="mb-8">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Step 4 of 5</p>
            <h2 className="text-[30px] sm:text-[36px] font-black text-slate-900 leading-tight">How do you prefer<br />to work?</h2>
            <p className="text-slate-400 mt-2 text-[14px] font-medium">Choose your ideal work setup</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {WORK_PREF_OPTIONS.map((opt, i) => {
              const active = workPref === opt.value;
              return (
                <motion.button key={opt.value} {...staggerFadeUp(i)}
                  onClick={() => selectAndAdvance(setWorkPref, opt.value)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-start gap-1.5 p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer select-none ${
                    active ? "border-transparent shadow-xl" : "border-slate-100 bg-white hover:border-slate-200 hover:-translate-y-0.5 hover:shadow-lg"
                  }`}
                  style={active ? { background: `linear-gradient(135deg, ${opt.color}15 0%, ${opt.color}22 100%)`, borderColor: `${opt.color}60` } : {}}
                >
                  <span className="text-[30px]">{opt.icon}</span>
                  <span className="text-[16px] font-bold text-slate-800">{opt.value}</span>
                  <span className="text-[12px] font-semibold text-slate-400">{opt.subtitle}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      );

      // ── Step 4: Interests ─────────────────────────────────────────────────
      case 4: return (
        <div>
          <div className="mb-7">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Step 5 of 5</p>
            <h2 className="text-[30px] sm:text-[36px] font-black text-slate-900 leading-tight">What do you love<br />outside work?</h2>
            <p className="text-slate-400 mt-2 text-[14px] font-medium">Helps match you with great team cultures — pick a few!</p>
          </div>
          <div className="flex flex-wrap gap-2.5 mb-8">
            {INTEREST_OPTIONS.map((opt, i) => {
              const active = selectedInterests.includes(opt.value);
              return (
                <motion.button key={opt.value} {...staggerFadeUp(i)}
                  onClick={() => toggleInterest(opt.value)} whileTap={{ scale: 0.92 }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full border-2 text-[14px] font-semibold transition-all duration-150 select-none ${
                    active
                      ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-300/25"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50/50"
                  }`}>
                  <span>{opt.icon}</span> {opt.value}
                </motion.button>
              );
            })}
          </div>
          <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            onClick={handleComplete}
            className="w-full flex items-center justify-center gap-2.5 py-[16px] rounded-[12px] font-bold text-[16px] text-white hover:-translate-y-0.5 transition-all bg-slate-900 hover:bg-black"
            style={{ background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 50%, #10b981 100%)" }}>
            <Sparkles className="w-5 h-5" /> Find my matches
          </motion.button>
        </div>
      );

      default: return null;
    }
  };

  // ─── Saving loader ────────────────────────────────────────────────────────
  if (isSaving) {
    return (
      <>
        <style>{`
          @keyframes spin-slow { to { transform: rotate(360deg); } }
          @keyframes ping-slow { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.4); opacity: 0; } }
          .spin-slow { animation: spin-slow 2s linear infinite; }
          .ping-slow { animation: ping-slow 1.5s ease-in-out infinite; }
        `}</style>
        <div className="min-h-screen flex flex-col items-center justify-center gap-6" className="min-h-screen flex flex-col items-center justify-center gap-6 bg-transparent">
          <div className="relative">
            <div className="ping-slow absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, rgba(20,184,166,0.4) 0%, transparent 70%)", width: "80px", height: "80px" }} />
            <div className="spin-slow w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0f766e, #14b8a6, #10b981)" }}>
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-[20px] font-black text-slate-900 mb-1">Finding your perfect matches…</h2>
            <p className="text-slate-400 text-[14px]">AI is scanning all open roles for you</p>
          </div>
          <div className="flex gap-1.5">
            {[0,1,2,3,4].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-500"
                style={{ animation: `ping-slow 1.2s ease-in-out ${i * 0.15}s infinite` }} />
            ))}
          </div>
        </div>
      </>
    );
  }

  // ─── Completion screen ────────────────────────────────────────────────────
  if (isDone) {
    return (
      <>
        <style>{`
          @keyframes ob-fadein  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
          @keyframes ob-popin   { 0% { opacity:0; transform:scale(0.5); } 70% { transform:scale(1.1); } 100% { opacity:1; transform:scale(1); } }
          @keyframes ob-slideup { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
          .ob-hero   { animation: ob-fadein  0.5s ease both; }
          .ob-icon   { animation: ob-popin   0.5s cubic-bezier(.34,1.56,.64,1) 0.1s both; }
          .ob-title  { animation: ob-slideup 0.45s ease 0.15s both; }
          .ob-sub    { animation: ob-slideup 0.45s ease 0.25s both; }
          .ob-card-0 { animation: ob-slideup 0.4s ease 0.1s both; }
          .ob-card-1 { animation: ob-slideup 0.4s ease 0.2s both; }
          .ob-card-2 { animation: ob-slideup 0.4s ease 0.3s both; }
          .ob-card-3 { animation: ob-slideup 0.4s ease 0.4s both; }
          .ob-cta    { animation: ob-fadein  0.5s ease 0.5s both; }
          @keyframes aurora-blob {
            0%,100% { transform:translate(0,0) scale(1); }
            33%     { transform:translate(3%,-3%) scale(1.06); }
            66%     { transform:translate(-2%,2%) scale(0.96); }
          }
          .aurora-1 { animation: aurora-blob 14s ease-in-out infinite; }
          .aurora-2 { animation: aurora-blob 18s ease-in-out 4s infinite reverse; }
          .aurora-3 { animation: aurora-blob 22s ease-in-out 8s infinite; }
        `}</style>
        <div className="min-h-screen relative flex flex-col items-center justify-start pt-12 pb-20 px-4 overflow-hidden" className="min-h-screen relative flex flex-col items-center justify-start pt-12 pb-20 px-4 overflow-hidden bg-transparent">
          {/* Aurora background */}
                              
          <div className="relative z-10 w-full max-w-3xl">
            <div className="ob-hero text-center mb-10">
              <div className="ob-icon inline-flex items-center justify-center w-20 h-20 rounded-full mb-5" style={{ background: "linear-gradient(135deg, #0f766e, #14b8a6, #10b981)", boxShadow: "0 0 60px rgba(124,58,237,0.5)" }}>
                <Sparkles className="w-9 h-9 text-white" />
              </div>
              <h1 className="ob-title text-[30px] sm:text-[48px] font-black text-slate-900 mb-3">You&apos;re all set! 🎉</h1>
              <p className="ob-sub text-slate-400 max-w-md mx-auto text-[16px]">
                {matchedJobs.length > 0
                  ? `We found ${matchedJobs.length} roles that match your profile perfectly.`
                  : "Your profile is saved. New jobs matching your skills are added daily!"}
              </p>
            </div>

            {matchedJobs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {matchedJobs.map((job, i) => (
                  <div key={job.id} className={`ob-card-${Math.min(i, 3)}`}>
                    <Link href={`/job/${job.id}`} className="group block bg-white border border-slate-200 shadow-md shadow-slate-200/50 backdrop-blur-sm rounded-2xl p-5 hover:border-slate-300 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 group-hover:text-slate-900 transition-colors truncate">{job.title}</h3>
                          <div className="flex items-center gap-1.5 text-slate-400 text-[14px] mt-0.5">
                            <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{job.company}</span>
                          </div>
                        </div>
                        <span className="flex-shrink-0 text-[12px] font-semibold px-2.5 py-1 bg-slate-800/20 text-slate-400 rounded-full border border-slate-800/30">{job.type}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[12px] text-slate-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                        {job.salary && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.salary}</span>}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-10 text-center py-16 border border-dashed border-slate-200 rounded-2xl text-slate-500 font-medium">
                No open roles yet — check back soon!
              </div>
            )}

            <div className="ob-cta flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard"
                className="inline-flex items-center justify-center gap-2 font-bold text-[16px] text-white px-[32px] py-[16px] rounded-[12px] shadow-2xl hover:-translate-y-0.5 transition-all bg-slate-900 hover:bg-black"
                style={{ background: "linear-gradient(135deg, #0f766e, #14b8a6, #10b981)" }}>
                Browse all jobs <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/profile"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all">
                Edit your profile
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ─── Main wizard ──────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
                  25%     { transform:translate(4%,-5%) scale(1.08); }
          50%     { transform:translate(8%,2%) scale(1.05); }
          75%     { transform:translate(-2%,6%) scale(0.97); }
        }
                  33%     { transform:translate(-5%,4%) scale(1.06); }
          66%     { transform:translate(3%,-3%) scale(0.94); }
        }
                  50%     { transform:translate(5%,7%) scale(1.1); }
        }
        @keyframes float-card {
          0%,100% { transform:translateY(0); }
          50%     { transform:translateY(-4px); }
        }
        @keyframes grid-fade-in {
          from { opacity:0; } to { opacity:1; }
        }
                                .card-float    { animation: float-card 6s ease-in-out infinite; }
        .dot-grid { animation: grid-fade-in 1s ease 0.3s both; }
      `}</style>

      {/* ── Full-screen dark aurora background ── */}
      

      {/* ── Layout ── */}
      <div className="relative min-h-screen flex flex-col z-10">

        {/* Header */}
        <header className="flex items-center justify-between px-5 py-5 max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg shadow-slate-500/30 bg-gradient-to-br from-slate-800 to-slate-700">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-[14px] font-black text-slate-900">Profile Setup</span>
          </div>

          {/* Progress pills */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <motion.div key={i}
                animate={{ width: i === step ? 28 : 8, opacity: i <= step ? 1 : 0.3 }}
                transition={{ duration: 0.35 }}
                className="h-2 rounded-full"
                style={{ background: i <= step ? "linear-gradient(90deg, #14b8a6, #10b981)" : "rgba(0,0,0,0.1)" }}
              />
            ))}
          </div>

          <Link href="/dashboard" className="text-[12px] text-slate-500 hover:text-slate-800 font-semibold transition-colors">
            Skip →
          </Link>
        </header>

        {/* Main */}
        <div className="flex-1 flex flex-col justify-center px-4 py-6">
          <div className="max-w-2xl mx-auto w-full">

            {/* Back button */}
            <AnimatePresence>
              {step > 0 && (
                <motion.button key="back" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  onClick={goBack}
                  className="flex items-center gap-1.5 text-[14px] text-slate-500 hover:text-slate-800 font-semibold mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </motion.button>
              )}
            </AnimatePresence>

            {/* Card */}
            <div className="card-float">
              <div className="relative rounded-3xl overflow-hidden" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)" }}>
                {/* Top gradient strip */}
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, #14b8a6, #10b981, #06b6d4)" }} />
                {/* Card body */}
                <div className="bg-white p-7 sm:p-10">
                  <div className="relative overflow-hidden">
                    <AnimatePresence mode="wait" custom={dir}>
                      <motion.div key={step} custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit">
                        {renderStep()}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Step counter */}
            <p className="text-center text-[12px] text-slate-600 font-medium mt-5">
              {step + 1} / {TOTAL_STEPS} — {["Choose your field", "Experience level", "Your skills", "Work preference", "Interests"][step]}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
