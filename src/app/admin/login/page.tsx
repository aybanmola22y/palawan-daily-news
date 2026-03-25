"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";

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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px]">
        {/* Logo - matches header/footer */}
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="flex flex-col items-center">
            <div className="text-[7px] font-medium tracking-[0.15em] text-slate-500 uppercase pb-0.5">
              Trusted, Fair & Balanced Reporting
            </div>
            <div className="font-playfair font-black text-2xl sm:text-3xl leading-none tracking-tight">
              <span className="text-white">Palawan</span>
              <span className="text-[#f36f21]">Daily</span>
              <span className="text-[#f36f21] text-[10px] align-top ml-0.5 font-bold">TM</span>
            </div>
            <div className="flex items-center w-full gap-1 mt-0.5">
              <div className="h-[2px] bg-[#f36f21] grow min-w-[12px]" />
              <span className="text-[7px] sm:text-[8px] font-bold tracking-[0.2em] text-slate-400 uppercase leading-none">
                News
              </span>
              <div className="h-[2px] bg-[#f36f21] grow min-w-[12px]" />
            </div>
          </Link>
          <p className="mt-4 text-slate-500 text-sm font-medium tracking-wider uppercase">Admin sign in</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800/80 shadow-2xl shadow-black/20">
          <h2 className="text-lg font-semibold text-white mb-6">Sign in to dashboard</h2>

          {error && (
            <div
              role="alert"
              className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm mb-5"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-slate-300 mb-2">
                Email address
              </label>
              <input
                id="admin-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@palawandaily.com"
                required
                autoComplete="email"
                className="w-full h-11 px-4 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#f36f21]/50 focus:border-[#f36f21] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full h-11 px-4 pr-11 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#f36f21]/50 focus:border-[#f36f21] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 rounded transition-colors"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#f36f21] hover:bg-[#e0651e] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800">
            <p className="text-xs text-slate-500 font-medium mb-3">Demo credentials</p>
            <div className="rounded-xl bg-slate-800/60 p-4 space-y-2.5 text-xs text-slate-400">
              <p>
                <span className="text-slate-300 font-medium">Super Admin</span> admin@palawandaily.com / admin123
              </p>
              <p>
                <span className="text-slate-300 font-medium">Editor</span> editor@palawandaily.com / editor123
              </p>
              <p>
                <span className="text-slate-300 font-medium">Writer</span> writer@palawandaily.com / writer123
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-400 transition-colors">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
