"use client";

import { motion } from "framer-motion";

const companies = [
  {
    name: "Google",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 mb-3 text-gray-500">
        <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
      </svg>
    ),
  },
  {
    name: "Apple",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 mb-3 text-gray-500">
        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
      </svg>
    ),
  },
  {
    name: "Windows",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 mb-3 text-gray-500">
        <path d="M2.5 11.5V2.5L11 1.5V11.5H2.5ZM12 1.5L21.5 0.5V11.5H12V1.5ZM2.5 12.5H11V22.5L2.5 21.5V12.5ZM12 12.5H21.5V23.5L12 22.5V12.5Z" />
      </svg>
    ),
  },
  {
    name: "Cisco",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-11 h-11 mb-2 text-gray-500">
        <path d="M1 12h2v4H1zm3-3h2v7H4zm3-3h2v10H7zm3-2h2v12h-2zm3 2h2v10h-2zm3 3h2v7h-2zm3 3h2v4h-2z" />
      </svg>
    ),
  },
  {
    name: "Atlassian",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-11 h-11 mb-2 text-gray-500">
        <path d="M11.97 2L2 12.02l9.97 10.03V2zM12.03 2v20.05l9.97-10.03L12.03 2z" />
      </svg>
    ),
  },
  {
    name: "Uber",
    icon: (
      <div className="text-[32px] font-bold tracking-tight mb-3 text-gray-500" style={{ fontFamily: 'var(--font-sans)' }}>
        Uber
      </div>
    ),
  },
  {
    name: "Swiggy",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 mb-3 text-gray-500">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
    ),
  },
  {
    name: "Infosys",
    icon: (
      <div className="text-[22px] font-semibold tracking-tight mb-3 text-gray-500" style={{ fontFamily: 'var(--font-sans)' }}>
        Infosys
      </div>
    ),
  },
];

export default function TrustedBy() {
  return (
    <section className="trusted-by-section">
      <div className="trusted-by-board">
        
        {/* Section label */}
        <div className="trusted-by-label-wrapper">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          </div>
          <span className="trusted-by-label-text">TRUSTED BY</span>
        </div>

        {/* Main heading */}
        <h2 className="trusted-by-title">
          Companies hiring here
        </h2>

        {/* Scrollable Cards — no gradient masks */}
        <div className="trusted-by-scroll-wrapper">
          <div className="trusted-by-scroll-content">
            {companies.map((company, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="trusted-by-card"
              >
                {company.icon}
                <div className="trusted-by-card-name">{company.name}</div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
