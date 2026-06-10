import Hero from "@/components/Hero";
import JobCard from "@/components/JobCard";
import Link from "next/link";

const FEATURED_JOBS = [
  {
    id: 1,
    title: "Senior Full Stack Engineer",
    company: "TechNova Solutions",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$140k - $180k",
    postedAt: "2 hours ago"
  },
  {
    id: 2,
    title: "Product Designer",
    company: "CreativeFlow",
    location: "Remote",
    type: "Contract",
    salary: "$80 - $110 / hr",
    postedAt: "5 hours ago"
  },
  {
    id: 3,
    title: "Marketing Manager",
    company: "GrowthX",
    location: "New York, NY",
    type: "Full-time",
    salary: "$90k - $120k",
    postedAt: "1 day ago"
  },
  {
    id: 4,
    title: "Data Scientist",
    company: "AI Dynamics",
    location: "Austin, TX (Hybrid)",
    type: "Full-time",
    salary: "$130k - $160k",
    postedAt: "2 days ago"
  }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      
      {/* Featured Jobs Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Featured Roles</h2>
            <p className="mt-2 text-foreground/60 text-lg">Opportunities curated for you.</p>
          </div>
          <Link href="/jobs" className="hidden sm:block text-foreground font-bold hover:underline decoration-2 underline-offset-4">
            View all &rarr;
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURED_JOBS.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
        
        <div className="mt-12 text-center sm:hidden">
          <Link href="/jobs" className="text-foreground font-bold hover:underline decoration-2 underline-offset-4">
            View all &rarr;
          </Link>
        </div>
      </section>

      {/* Hiring Promise Section */}
      <section className="border-t border-foreground/10 bg-secondary/50 py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-foreground">The way hiring should be.</h2>
          <p className="max-w-2xl mx-auto text-lg text-foreground/60 mb-16">
            We believe in transparency, fairness, and simplicity. No gimmicks, just direct connections between great talent and amazing companies.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            <div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Transparency</h3>
              <p className="text-foreground/60 leading-relaxed">Clear salary ranges and expectations upfront. No surprises during the interview process.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Fairness</h3>
              <p className="text-foreground/60 leading-relaxed">Equal opportunities for everyone. Objective skill-based matching to prevent bias.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Support</h3>
              <p className="text-foreground/60 leading-relaxed">Guidance and feedback throughout your journey. We are here to help you succeed.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
