"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useMotionValueEvent } from "framer-motion";
import Image from "next/image";
import transImg from "@/assets/trans.webp";
import workImg from "@/assets/work.webp";
import ghostingImg from "@/assets/ghosting.webp";
import pointsAll from "@/assets/pointsall.svg";

const features = [
  {
    title: "TRANSPARENCY",
    description:
      "Employers on our platform have to be transparent about job responsibilities, expectations, compensation ranges, benefits, work arrangements, and growth opportunities",
    image: transImg,
  },
  {
    title: "WORK SPEAKS",
    description:
      "Create a dynamic professional profile where you can showcase projects, portfolios and work samples that demonstrate your real capabilities and impact.",
    image: workImg,
  },
  {
    title: "NO GHOSTING",
    description:
      "No silence after an application or interview. We promote structured communication and status updates.",
    image: ghostingImg,
  },
];

export default function WhyUs() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Track the highest scroll progress to prevent the animation from reversing
  // so the cards never "disappear" once they have shown up.
  const maxProgress = useMotionValue(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > maxProgress.get()) {
      maxProgress.set(latest);
    }
  });

  // Calculate transforms for each card sequentially.
  // We span exactly from 0 to 1 so there are no "dead zones" where the scroll feels stuck.
  const opacity1 = useTransform(maxProgress, [0, 0.33], [0, 1]);
  const y1 = useTransform(maxProgress, [0, 0.33], [50, 0]);

  const opacity2 = useTransform(maxProgress, [0.33, 0.66], [0, 1]);
  const y2 = useTransform(maxProgress, [0.33, 0.66], [50, 0]);

  const opacity3 = useTransform(maxProgress, [0.66, 1], [0, 1]);
  const y3 = useTransform(maxProgress, [0.66, 1], [50, 0]);

  const transforms = [
    { opacity: opacity1, y: y1 },
    { opacity: opacity2, y: y2 },
    { opacity: opacity3, y: y3 },
  ];

  return (
    <section ref={containerRef} className="why-us-section relative h-[200vh] w-full mt-16 p-0! bg-[var(--background)]">
      {/* The sticky container pins the content to the screen while you scroll through the 200vh */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">

        <div className="max-w-7xl w-full mx-auto px-4 sm:px-5 lg:px-6">
          <div className="why-us-card w-full">

            <div className="section-label-wrapper">
              <Image src={pointsAll} alt="Points" className="w-auto h-2" />
              <span className="section-label-text">
                Our Promise
              </span>
            </div>

            <h2 className="section-title">
              Why do job search on our platform
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 w-full mt-10">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  style={{
                    opacity: transforms[idx].opacity,
                    y: transforms[idx].y,
                  }}
                  className="flex flex-col items-center gap-6"
                >
                  <div className="feature-img-box w-full">
                    {feature.image ? (
                      <div className="relative w-full h-full p-6 rounded-2xl overflow-hidden flex items-center justify-center bg-transparent">
                        <Image 
                          src={feature.image} 
                          alt={feature.title}
                          className="object-contain w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="feature-img-placeholder" />
                    )}
                  </div>

                  <div className="text-center px-2">
                    <h3 className="feature-title mb-3">
                      {feature.title}
                    </h3>
                    <p className="feature-desc text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
