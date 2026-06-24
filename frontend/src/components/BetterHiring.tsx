"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "VERIFIED CANDIDATES",
    description:
      "Hire with greater confidence through verified candidate profiles that help provide a more reliable view of each applicant's professional background and capabilities.",
  },
  {
    title: "INTELLIGENT CANDIDATE SCREENING",
    description:
      "Save time with automated filtering that identifies candidates based on skills, experience, qualifications, and role requirements, helping you focus on the most relevant talent.",
  },
  {
    title: "RESPONSIBLE AI MATCHING",
    description:
      "Our AI assists your hiring decisions by highlighting suitable candidates while maintaining transparency and fairness, without any hidden decisions.",
  },
];

export default function BetterHiring() {
  return (
    <section className="better-hiring-section">
      <div className="better-hiring-card">

        {/* Section label */}
        <div className="section-label-wrapper">
          <div className="flex items-center gap-1">
            <div className="section-label-dash" />
            <div className="section-label-dash" />
          </div>
          <span className="section-label-text">BETTER HIRING</span>
        </div>

        {/* Main heading */}
        <h2 className="better-hiring-title">
          Why hire through our platform
        </h2>

        {/* Illustration boxes row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mb-0">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="better-hiring-img-box"
            >
              {/* Empty illustration placeholder */}
              <div className="better-hiring-img-placeholder" />
            </motion.div>
          ))}
        </div>

        {/* Text row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mt-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 + idx * 0.1 }}
              className="text-center px-3 pt-3"
            >
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
