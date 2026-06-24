"use client";

import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: i * 0.15 },
  }),
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] selection:bg-foreground selection:text-background">

      {/* ── Hero Section ── */}
      <section className="relative w-full py-16 px-4 sm:px-5 lg:px-8 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-8">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 flex flex-col justify-center max-w-xl lg:pr-8"
          >
            {/* Section label */}
            <div className="section-label-wrapper mb-6">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
              </div>
              <span className="section-label-text ml-3 text-sm font-semibold tracking-wider text-gray-500">
                ABOUT US
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-[3.5rem] leading-[1.1] md:text-[4.5rem] font-medium text-gray-900 mb-8 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Helping Great <br className="hidden lg:block" />
              Talent Get Found
            </h1>

            {/* Description */}
            <p className="text-lg md:text-[1.15rem] text-gray-600 leading-relaxed max-w-[90%]">
              We help creative professionals find meaningful work through curated opportunities and AI-powered matching.
            </p>
          </motion.div>

          {/* Right Content - Illustration placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="flex-1 w-full flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-[600px] h-[440px] rounded-[2.5rem] border-2 border-dashed border-[#8ebaa3]/50 bg-[#f4f9f7]/30 flex items-center justify-center overflow-hidden">
              <span className="text-gray-400 text-sm font-medium">[Illustration Placeholder]</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── Mission & Vision Section ── */}
      <section className="w-full py-16 px-4 sm:px-5 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="section-label-wrapper mb-10"
          >
            <div className="flex items-center gap-1">
              <div className="section-label-dash" />
              <div className="section-label-dash" />
            </div>
            <span className="section-label-text ml-2">MISSION &amp; VISION</span>
          </motion.div>

          {/* Two cards side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Mission Card */}
            <motion.div
              custom={0}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="rounded-[2rem] p-8 flex flex-col gap-6 shadow-sm border border-gray-100"
              style={{ background: "linear-gradient(90deg, #FFF 0%, #F0F0F0 100%)" }}
            >
              {/* Card title */}
              <h2 className="text-[2.2rem] font-medium text-gray-900 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                Mission
              </h2>

              {/* Illustration box */}
              <div className="w-full h-64 rounded-2xl border border-dashed border-gray-300 bg-gray-50/60 flex items-center justify-center overflow-hidden">
                <span className="text-gray-400 text-sm">[Mission Illustration]</span>
              </div>

              {/* Sub-heading */}
              <h3 className="text-[1.25rem] font-semibold text-gray-900 leading-snug" style={{ fontFamily: "var(--font-heading)" }}>
                Connect people to work that matters
              </h3>

              {/* Description */}
              <p className="text-[0.95rem] text-gray-600 leading-relaxed">
                Our mission is to help creative professionals find meaningful work by providing a platform that is user-friendly and easy to access. We are committed to connecting job seekers with employers, using Agentic &amp; AI-powered tools to ensure the best matches.
              </p>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              custom={1}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="rounded-[2rem] p-8 flex flex-col gap-6 shadow-sm border border-gray-100"
              style={{ background: "linear-gradient(90deg, #FFF 0%, #F0F0F0 100%)" }}
            >
              {/* Card title */}
              <h2 className="text-[2.2rem] font-medium text-gray-900 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                Vision
              </h2>

              {/* Illustration box */}
              <div className="w-full h-64 rounded-2xl border border-dashed border-gray-300 bg-gray-50/60 flex items-center justify-center overflow-hidden">
                <span className="text-gray-400 text-sm">[Vision Illustration]</span>
              </div>

              {/* Sub-heading */}
              <h3 className="text-[1.25rem] font-semibold text-gray-900 leading-snug" style={{ fontFamily: "var(--font-heading)" }}>
                A world where talent always finds its home
              </h3>

              {/* Description */}
              <p className="text-[0.95rem] text-gray-600 leading-relaxed">
                We envision a job market where geography, background, and network don't limit opportunity — skill and drive are enough, and our platform makes that a reality.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Our Story / Timeline Section ── */}
      <section className="w-full py-16">
        <div
          className="w-full px-8 py-10 border-y border-gray-100 shadow-sm"
          style={{ background: "linear-gradient(90deg, #FFF 0%, #F0F0F0 100%)" }}
        >
          <div className="max-w-7xl mx-auto">

            {/* Section label */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="section-label-wrapper mb-6"
            >
              <div className="flex items-center gap-1">
                <div className="section-label-dash" />
                <div className="section-label-dash" />
              </div>
              <span className="section-label-text ml-2">WHERE WE&apos;VE BEEN</span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="text-[3rem] font-medium text-gray-900 mb-16 tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Our Story
            </motion.h2>

            {/* Timeline */}
            <div className="relative overflow-x-auto">
              <div className="min-w-[700px]">

                {/* ── Above-the-line content row ── */}
                <div className="grid grid-cols-5 mb-6">

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.0 }}
                    className="text-center px-3"
                  >
                    <p className="text-[0.82rem] font-bold text-gray-900 mb-1">Founded</p>
                    <p className="text-[0.78rem] text-gray-600 leading-relaxed text-center">
                      Helping Hands Whats App Group is the source of inspiration and idea that got germinated, where so many job aspirants shared their profiles seeking for a job.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="text-center px-3 flex items-end justify-center pb-2"
                  >
                    <p className="text-[1.05rem] font-bold text-gray-900">2021</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="text-center px-3"
                  >
                    <p className="text-[0.78rem] text-gray-600 leading-relaxed text-center">
                      Helping Hands Whats App Group is the source of inspiration and idea that got germinated, where so many job aspirants shared their profiles seeking for a job.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="text-center px-3 flex items-end justify-center pb-2"
                  >
                    <p className="text-[1.05rem] font-bold text-gray-900">2026</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="text-center px-3"
                  >
                    <p className="text-[0.78rem] text-gray-600 leading-relaxed text-center">
                      Helping Hands Whats App Group is the source of inspiration and idea that got germinated, where so many job aspirants shared their profiles seeking for a job.
                    </p>
                  </motion.div>

                </div>

                {/* ── Horizontal timeline line + circles ── */}
                <div className="relative grid grid-cols-5 items-center">
                  <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-300 -translate-y-1/2 z-0" />
                  {["01", "02", "03", "04", "05"].map((num, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.6 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="flex justify-center relative z-10"
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center text-[0.8rem] font-bold shadow-md">
                        {num}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* ── Below-the-line content row ── */}
                <div className="grid grid-cols-5 mt-6">

                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.0 }}
                    className="text-center px-3 flex items-start justify-center pt-2"
                  >
                    <p className="text-[1.05rem] font-bold text-gray-900">2020</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="text-center px-3"
                  >
                    <p className="text-[0.78rem] text-gray-600 leading-relaxed text-center">
                      Helping Hands Whats App Group is the source of inspiration and idea that got germinated, where so many job aspirants shared their profiles seeking for a job.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="text-center px-3 flex items-start justify-center pt-2"
                  >
                    <p className="text-[1.05rem] font-bold text-gray-900">2024</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="text-center px-3"
                  >
                    <p className="text-[0.78rem] text-gray-600 leading-relaxed text-center">
                      Helping Hands Whats App Group is the source of inspiration and idea that got germinated, where so many job aspirants shared their profiles seeking for a job.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="text-center px-3 flex items-start justify-center pt-2"
                  >
                    <p className="text-[1.05rem] font-bold text-gray-900">Present</p>
                  </motion.div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
