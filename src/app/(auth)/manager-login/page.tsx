"use client";

import Link from "next/link";
import { Building, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { API } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ManagerLogin() {
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
      const response = await API.post('/auth/manager/login', {
        email,
        password
      });
      
      login(response.user, response.token);
      router.push('/manager/dashboard');
    } catch (error) {
      setMessage("Invalid credentials or server error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md border border-foreground/10 p-8 rounded-xl bg-background shadow-sm">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-secondary text-foreground rounded-xl flex items-center justify-center mb-4">
            <Building className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Employer Portal</h1>
          <p className="text-foreground/60 mt-2 font-medium">Sign in to manage your job postings</p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-bold text-foreground mb-1.5" htmlFor="work-email">
              Work Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building className="h-5 w-5 text-foreground/40" />
              </div>
              <input
                id="work-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-foreground/20 rounded-lg bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="admin@company.com"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-bold text-foreground" htmlFor="password">
                Password
              </label>
              <Link href="/employer-forgot-password" className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
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
            <div className="text-sm font-medium p-3 rounded-lg bg-secondary text-foreground text-center">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-background bg-foreground hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground transition-all gap-2 disabled:opacity-50"
          >
            {loading ? "Connecting..." : "Access Dashboard"} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-foreground/60 font-medium">
          Want to hire with us?{" "}
          <Link href="/contact-sales" className="font-bold text-primary hover:text-primary-hover transition-colors underline decoration-primary/30 underline-offset-2">
            Contact Sales
          </Link>
        </p>
      </div>
    </div>
  );
}
