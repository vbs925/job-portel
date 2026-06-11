import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build Your Profile | Job Portal",
  description: "Let Aria, your AI career guide, help you build your profile and find your dream job.",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No navbar, no extra padding — full-screen immersive chat experience
  return <>{children}</>;
}
