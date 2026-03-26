"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Mail, Lock, ChevronLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      router.push("/admin");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-[#020617] flex flex-col items-center justify-center px-4 py-12 overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#f36f21]/10 blur-[120px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
      
      <div className="w-full max-w-[440px] z-10 transition-all duration-700 ease-out">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10 transition-all duration-500 transform hover:scale-[1.02]">
          <Link href="/" className="flex flex-col items-center group">
            <div className="text-[9px] font-bold tracking-[0.25em] text-slate-500 uppercase pb-1.5 transition-colors group-hover:text-slate-400">
              Trusted, Fair & Balanced Reporting
            </div>
            <div className="font-playfair font-black text-3xl sm:text-4xl leading-none tracking-tight">
              <span className="text-white">Palawan</span>
              <span className="text-[#f36f21]">Daily</span>
              <span className="text-[#f36f21] text-[12px] align-top ml-1 font-bold">TM</span>
            </div>
            <div className="flex items-center w-full gap-2 mt-2">
              <div className="h-[2px] bg-[#f36f21] grow min-w-[24px]" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.4em] text-slate-400 uppercase leading-none">
                News
              </span>
              <div className="h-[2px] bg-[#f36f21] grow min-w-[24px]" />
            </div>
          </Link>
          <div className="mt-8 flex items-center gap-4">
            <div className="h-[1px] w-10 bg-slate-800" />
            <p className="text-slate-400 text-[10px] font-black tracking-[0.3em] uppercase opacity-60">Admin Portal</p>
            <div className="h-[1px] w-10 bg-slate-800" />
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-12 border border-white/[0.08] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative overflow-hidden ring-1 ring-white/10 group">
          {/* Decorative glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#f36f21]/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-[#f36f21]/20 transition-colors duration-500" />
          
          <div className="relative">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Sign in</h2>
              <p className="text-slate-400 text-[15px] font-medium">Access your editorial dashboard</p>
            </div>

            {error && (
              <div
                role="alert"
                className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 rounded-2xl text-[14px] mb-8 flex items-start gap-3 transition-all duration-300 shadow-sm shadow-red-500/5"
              >
                <div className="h-5 w-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                </div>
                <span className="font-medium leading-tight">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="space-y-2.5">
                <label htmlFor="admin-email" className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Email Address
                </label>
                <div className="relative group/input">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-[#f36f21] transition-colors duration-300">
                    <Mail className="h-[18px] w-[18px]" />
                  </div>
                  <input
                    id="admin-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="admin@palawandaily.com"
                    required
                    autoComplete="email"
                    className="w-full h-14 pl-14 pr-5 bg-slate-950/40 border border-white/[0.08] rounded-[1.25rem] text-white placeholder-slate-600 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-[#f36f21]/20 focus:border-[#f36f21]/40 transition-all duration-300 group-hover/input:border-white/[0.15]"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label htmlFor="admin-password" className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Password
                </label>
                <div className="relative group/input">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-[#f36f21] transition-colors duration-300">
                    <Lock className="h-[18px] w-[18px]" />
                  </div>
                  <input
                    id="admin-password"
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full h-14 pl-14 pr-14 bg-slate-950/40 border border-white/[0.08] rounded-[1.25rem] text-white placeholder-slate-600 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-[#f36f21]/20 focus:border-[#f36f21]/40 transition-all duration-300 group-hover/input:border-white/[0.15]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    aria-label={showPass ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-white rounded-xl transition-all duration-300"
                  >
                    {showPass ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-15 mt-2 bg-gradient-to-r from-[#f36f21] to-[#ff8c42] hover:from-[#ff8c42] hover:to-[#f36f21] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[16px] rounded-[1.25rem] transition-all duration-500 shadow-[0_12px_24px_-8px_rgba(243,111,33,0.3)] hover:shadow-[0_16px_32px_-8px_rgba(243,111,33,0.4)] active:scale-[0.97] flex items-center justify-center gap-3 relative overflow-hidden group/btn"
              >
                {/* Shimmer effect on hover */}
                <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite] transition-all" />
                
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                <span className="relative z-10">{loading ? "Authenticating..." : "Sign in to Dashboard"}</span>
              </button>
            </form>

            <div className="mt-12 pt-10 border-t border-white/[0.05]">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1.5 w-1.5 rounded-full bg-[#f36f21] shadow-[0_0_8px_rgba(243,111,33,0.8)]" />
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.25em]">Development Access</p>
              </div>
              <div className="grid gap-3">
                {[
                  { label: "Super Admin", mail: "admin@palawandaily.com", pass: "admin123" },
                  { label: "Editor", mail: "editor@palawandaily.com", pass: "editor123" },
                ].map((cred, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] transition-colors hover:bg-white/[0.04]">
                    <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">{cred.label}</span>
                    <span className="text-slate-300 text-[11px] font-mono break-all">{cred.mail} / {cred.pass}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/" className="inline-flex items-center gap-2 group transition-all duration-300">
            <div className="p-2 rounded-full bg-slate-900 group-hover:bg-[#f36f21]/10 transition-colors">
              <ChevronLeft className="h-4 w-4 text-slate-500 group-hover:text-[#f36f21] transition-colors" />
            </div>
            <span className="text-[13px] text-slate-500 font-bold group-hover:text-white transition-colors">
              Return to Website
            </span>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
}
