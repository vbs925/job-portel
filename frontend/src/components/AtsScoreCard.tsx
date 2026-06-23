import React, { useState } from 'react';
import { Target, CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AtsScoreCardProps {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  isAutoRejected?: boolean;
}

export default function AtsScoreCard({ score, matchedKeywords, missingKeywords, suggestions, isAutoRejected }: AtsScoreCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Determine score color
  let scoreColor = 'text-green-500';
  let bgColor = 'bg-green-500';
  if (score < 40) {
    scoreColor = 'text-red-500';
    bgColor = 'bg-red-500';
  } else if (score < 70) {
    scoreColor = 'text-yellow-500';
    bgColor = 'bg-yellow-500';
  }

  // Circular progress math
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="p-6 border border-foreground/10 rounded-xl bg-background shadow-sm relative overflow-hidden">
      {/* Background decoration */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-10 blur-2xl ${bgColor}`} />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        
        {/* Left Side: Circular Score & Title */}
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-foreground/10 stroke-current"
                strokeWidth="8"
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
              ></circle>
              <motion.circle
                className={`${scoreColor} stroke-current`}
                strokeWidth="8"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ strokeDasharray: circumference }}
              ></motion.circle>
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-2xl font-black ${scoreColor}`}>{score}</span>
              <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider">/ 100</span>
            </div>
          </div>

          <div>
            <h2 className="text-[20px] font-black text-foreground flex items-center gap-2">
              <Target className="w-5 h-5 text-foreground/60" /> ATS Compatibility Score
            </h2>
            <p className="text-[14px] font-medium text-foreground/60 mt-1 max-w-sm">
              Analyzed based on keywords, role relevance, and experience match with the job description.
            </p>
            {isAutoRejected && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 text-[12px] font-bold rounded-md border border-red-200">
                <AlertCircle className="w-3.5 h-3.5" /> Auto-Rejected due to low score
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Toggle Button */}
        <button 
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground text-[14px] font-bold rounded-lg hover:bg-secondary/80 transition-colors border border-foreground/10"
        >
          {expanded ? 'Hide Details' : 'View Details'} 
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-8 mt-6 border-t border-foreground/10 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Matched Keywords */}
              <div>
                <h3 className="text-[14px] font-bold text-foreground/50 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Matched Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {matchedKeywords?.length > 0 ? matchedKeywords.map((kw, i) => (
                    <span key={i} className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded text-[13px] font-medium shadow-sm">
                      {kw}
                    </span>
                  )) : <span className="text-[13px] text-foreground/50">No strong matches found.</span>}
                </div>
              </div>

              {/* Missing Keywords */}
              <div>
                <h3 className="text-[14px] font-bold text-foreground/50 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" /> Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {missingKeywords?.length > 0 ? missingKeywords.map((kw, i) => (
                    <span key={i} className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-[13px] font-medium shadow-sm">
                      {kw}
                    </span>
                  )) : <span className="text-[13px] text-foreground/50">None. Great job!</span>}
                </div>
              </div>

              {/* Suggestions */}
              <div className="md:col-span-2">
                <h3 className="text-[14px] font-bold text-foreground/50 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500" /> Actionable Insights
                </h3>
                {suggestions?.length > 0 ? (
                  <ul className="space-y-2">
                    {suggestions.map((sug, i) => (
                      <li key={i} className="text-[14px] font-medium text-foreground/70 bg-secondary/30 p-3 rounded-lg border border-foreground/5 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0" />
                        {sug}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[14px] font-medium text-foreground/50">No further suggestions.</p>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
