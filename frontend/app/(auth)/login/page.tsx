"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const result = await signIn(email, password);
    setBusy(false);
    if (result.error) {
      if (
        result.error.toLowerCase().includes("invalid login credentials") ||
        result.error.toLowerCase().includes("invalid_grant")
      ) {
        setError(
          "Invalid email or password. If you don't have an account yet, please click 'Create one' below."
        );
      } else {
        setError(result.error);
      }
    }
  }

  async function handleDemoLogin() {
    setError("");
    setBusy(true);
    const demoEmail = "demo.citizen@yojanasaathi.org";
    const demoPass = "YojanaDemo2026!";
    // Try signing in first
    const res = await signIn(demoEmail, demoPass);
    if (res.error) {
      // If demo account doesn't exist yet, sign up and then sign in
      await signUp(demoEmail, demoPass, "Demo Citizen");
      const retryRes = await signIn(demoEmail, demoPass);
      if (retryRes.error) {
        setError(retryRes.error);
      }
    }
    setBusy(false);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1">
        <div className="flex w-full flex-col lg:flex-row">
          {/* Brand panel */}
          <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-[#0B1E3D] via-[#0F2645] to-[#142E4D] lg:flex">
            <div className="pointer-events-none absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-signal-orange/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-verified-teal/10 blur-3xl" />
            <div className="relative px-12 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
                <img src="/assets/logo-bg.png" alt="YojanaSaathi" className="h-full w-full object-contain" loading="lazy" />
              </div>
              <h2 className="mt-6 font-display text-3xl font-semibold text-white">YojanaSaathi</h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/60">
                Find every government welfare scheme you qualify for. One profile, all schemes — from central to state.
              </p>
            </div>
          </div>

          {/* Form panel */}
          <div className="flex flex-1 items-center justify-center px-4 py-12">
            <div className="w-full max-w-sm">
              <div className="text-center lg:hidden">
                <div className="mx-auto flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink-navy/10">
                  <img src="/assets/logo-bg.png" alt="YojanaSaathi Logo" className="h-full w-full object-contain" loading="lazy" />
                </div>
                <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink-navy">Welcome back</h1>
                <p className="mt-1 text-sm text-slate-blue">Sign in to check your schemes</p>
              </div>

              <div className="hidden lg:block">
                <h1 className="font-display text-2xl font-semibold tracking-tight text-ink-navy">Welcome back</h1>
                <p className="mt-1 text-sm text-slate-blue">Sign in to check your schemes</p>
              </div>

              <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {error && (
                  <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 leading-relaxed">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Signing in…" : "Sign in"}
                </Button>
              </form>

              <div className="mt-4">
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-warm-paper px-2 text-gray-400 font-semibold">Or</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={busy}
                  className="w-full py-2.5 px-4 rounded-full border border-orange-200 bg-orange-50/60 hover:bg-orange-100 text-orange-600 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>⚡ Quick Demo Sign In (1-Click)</span>
                </button>
              </div>

              <p className="mt-8 text-center text-sm text-slate-blue">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-semibold text-signal-orange transition-colors hover:text-signal-orange-600">Create one</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
