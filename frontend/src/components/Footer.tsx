import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-background/50 backdrop-blur-md mt-auto">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block flex-shrink-0 flex items-center mb-4 gap-2">
              <img src="/logo.png" alt="Cortex Craft Logo" className="h-8 w-auto" />
              <span className="text-[20px] font-bold text-foreground tracking-tight hover:text-foreground transition-colors">
                Helping Hands
              </span>
            </Link>
            <p className="text-foreground/60 text-[14px] max-w-sm leading-relaxed mb-6">
              A premium job portal matching top talent with amazing companies. We prioritize transparency, speed, and quality.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-[14px] uppercase tracking-wider">Candidates</h3>
            <ul className="space-y-3">
              <li><Link href="/dashboard" className="text-foreground/60 hover:text-foreground text-[14px] transition-colors">Find Jobs</Link></li>
              <li><Link href="/applications" className="text-foreground/60 hover:text-foreground text-[14px] transition-colors">My Applications</Link></li>
              <li><Link href="/profile" className="text-foreground/60 hover:text-foreground text-[14px] transition-colors">Profile Setup</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-[14px] uppercase tracking-wider">Employers</h3>
            <ul className="space-y-3">
              <li><Link href="/manager-login" className="text-foreground/60 hover:text-foreground text-[14px] transition-colors">Post a Job</Link></li>
              <li><Link href="/manager-login" className="text-foreground/60 hover:text-foreground text-[14px] transition-colors">Applicant Tracking</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-foreground/50 text-[14px]">
            &copy; {new Date().getFullYear()} Helping Hands. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-foreground/50 hover:text-foreground transition-colors text-[14px]">Privacy Policy</Link>
            <Link href="#" className="text-foreground/50 hover:text-foreground transition-colors text-[14px]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
