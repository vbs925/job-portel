"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import lastImg from "@/assets/lastimg.png";
import pointsAll from "@/assets/pointsall.svg";

export default function GetStarted() {
  return (
    <section className="get-started-section">
      <div className="get-started-card">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col pr-0 lg:pr-8"
          >
            {/* Section label */}
            <div className="section-label-wrapper">
              <Image src={pointsAll} alt="Points" className="w-auto h-2" />
              <span className="section-label-text ml-2">GET STARTED</span>
            </div>

            {/* Main heading */}
            <h2 className="get-started-title">
              Set up your profile and let the right jobs find you.
            </h2>

            {/* Description */}
            <p className="get-started-desc">
              Tell us about your skills, experience, and what you're looking for. We'll match you to roles that fit you best.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Link href="/login" className="get-started-btn-primary">
                Create My Profile
              </Link>
              <button className="get-started-btn-secondary">
                See how it works
              </button>
            </div>

            {/* Subtext */}
            <p className="get-started-subtext">
              Join 12,000+ job seekers already getting matched
            </p>
          </motion.div>

          {/* Right Content - Illustration Box */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full flex justify-end"
          >
            <div className="get-started-img-box bg-white">
              <Image 
                src={lastImg} 
                alt="Get Started Illustration"
                className="object-contain w-full h-full"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
