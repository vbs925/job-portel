"use client";

import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { API } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ApplicantLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      const response = await API.post('/auth/applicant/login', {
        email,
        password
      });
      
      // Save to AuthContext
      login(response.user, response.token);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      setMessage("Error connecting to the backend. Make sure it is running!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md border border-foreground/10 p-8 rounded-xl bg-background shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-[30px] font-bold text-foreground tracking-tight">Welcome back</h1>
          <p className="text-foreground/60 mt-2 font-medium">Sign in to continue your job search</p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-[14px] font-bold text-foreground mb-1.5" htmlFor="email">
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
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[14px] font-bold text-foreground" htmlFor="password">
                Password
              </label>
              <Link href="/forgot-password" className="text-[14px] font-semibold text-primary hover:text-primary-hover transition-colors">
                Forgot password?
              </Link>
            </div>
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
              />
            </div>
          </div>

          {message && (
            <div className="text-[14px] font-medium p-3 rounded-lg bg-secondary text-foreground text-center">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-[14px] font-bold text-background bg-foreground hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground transition-all gap-2 disabled:opacity-50"
          >
            {loading ? "Connecting..." : "Sign In"} <ArrowRight className="w-4 h-4" />
          </button>
        </form>



        <p className="mt-8 text-center text-[14px] text-foreground/60 font-medium">
          Don't have an account?{" "}
          <Link href="/register" className="font-bold text-primary hover:text-primary-hover transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
