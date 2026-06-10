"use client";

import Link from "next/link";
import { Mail, Lock, ArrowRight, User } from "lucide-react";
import { useState } from "react";
import { API } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ApplicantRegister() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      const response = await API.post('/auth/applicant/register', {
        name,
        email,
        password
      });
      
      // Save to AuthContext
      login(response.user, response.token);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      setMessage(error.message || "Error connecting to the backend to create account.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md border border-foreground/10 p-8 rounded-xl bg-background shadow-sm mt-8 mb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Create an Account</h1>
          <p className="text-foreground/60 mt-2 font-medium">Join us and find your dream job</p>
        </div>

        <form className="space-y-5" onSubmit={handleRegister}>
          
          <div>
            <label className="block text-sm font-bold text-foreground mb-1.5" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-foreground/40" />
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-foreground/20 rounded-lg bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-1.5" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-foreground/40" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-foreground/20 rounded-lg bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-foreground/40" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-foreground/20 rounded-lg bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <p className="mt-1.5 text-xs text-foreground/50 font-medium">Must be at least 6 characters long</p>
          </div>

          {message && (
            <div className={`text-sm font-medium p-3 rounded-lg text-center ${message.includes('Success') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-secondary text-foreground'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-background bg-foreground hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground transition-all gap-2 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-foreground/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-foreground/50 font-medium">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="flex justify-center items-center py-2.5 px-4 border border-foreground/20 rounded-lg hover:bg-secondary transition-colors font-bold text-foreground">
              Google
            </button>
            <button className="flex justify-center items-center py-2.5 px-4 border border-foreground/20 rounded-lg hover:bg-secondary transition-colors font-bold text-foreground">
              GitHub
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-foreground/60 font-medium">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-primary hover:text-primary-hover transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
