"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { StatsBar } from "@/components/landing/stats-bar";
import { FAQ } from "@/components/landing/faq";
import { useAuth } from "@/hooks/useAuth";
import { getUserMatches, type EligibilityMatch } from "@/lib/api";

const quickActions = [
  { label: "View Dashboard", href: "/dashboard", icon: "layout" },
  { label: "Browse Schemes", href: "/schemes", icon: "search" },
  { label: "Upload Documents", href: "/documents", icon: "upload" },
  { label: "Edit Profile", href: "/profile", icon: "user" },
];

function SignedInHome() {
  const { session } = useAuth();
  const ref = useRef<HTMLDivElement>(null);
  const [matches, setMatches] = useState<EligibilityMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.access_token) return;
    getUserMatches(session.access_token)
      .then(setMatches)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session?.access_token]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      const gsap = (await import("gsap")).default;
      try {
        const siEls = ref.current?.querySelectorAll(".si-hero, .si-stat, .si-action, .si-scheme");
        if (siEls?.length) gsap.killTweensOf(siEls);
        const ctx = gsap.context(() => {
          gsap.fromTo(".si-hero", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", clearProps: "all" });
          gsap.fromTo(".si-stat", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.08, delay: 0.15, ease: "power2.out", clearProps: "all" });
          gsap.fromTo(".si-action", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, delay: 0.3, ease: "power2.out", clearProps: "all" });
          gsap.fromTo(".si-scheme", { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.35, stagger: 0.06, delay: 0.4, ease: "power2.out", clearProps: "all" });
        }, ref);
        cleanup = () => ctx.revert();
      } catch { return; }
    })();
    return () => { cleanup?.(); };
  }, [matches]);

  const total = matches.length;
  const applied = matches.filter((m) => m.application_status === "applied" || m.application_status === "approved").length;
  const approved = matches.filter((m) => m.application_status === "approved").length;
  const pendingDocs = matches.reduce((sum, m) => sum + m.missing_documents.length, 0);

  return (
    <div ref={ref} className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="si-hero flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-navy">
            Welcome back{loading ? "" : `, ${session?.user?.user_metadata?.full_name ?? "User"}`}
          </h1>
          <p className="mt-1 text-sm text-slate-blue">
            {loading ? "Loading your schemes…" : `You qualify for ${total} schemes across central and state governments.`}
          </p>
        </div>
        <Button href="/dashboard">Go to Dashboard</Button>
      </div>

      <div className="si-hero mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {([
          { label: "Schemes Found", value: total, color: "bg-signal-orange/10 text-signal-orange" },
          { label: "Applied", value: applied, color: "bg-caution-amber/10 text-caution-amber" },
          { label: "Approved", value: approved, color: "bg-verified-teal/10 text-verified-teal" },
          { label: "Pending Docs", value: pendingDocs, color: "bg-[#E8A63D]/10 text-[#E8A63D]" },
        ] as const).map((stat) => (
          <div key={stat.label} className="si-stat rounded-xl border border-ink-navy/10 bg-white p-4">
            <p className={`text-2xl font-bold font-display ${stat.color.split(" ")[1]}`}>{stat.value}</p>
            <p className="text-xs text-slate-blue-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-ink-navy">Quick actions</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="si-action flex items-center gap-3 rounded-xl border border-ink-navy/10 bg-white p-4 transition-all hover:border-ink-navy/20 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink-navy/5">
                  {a.icon === "layout" && <svg className="h-5 w-5 text-ink-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>}
                  {a.icon === "search" && <svg className="h-5 w-5 text-ink-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>}
                  {a.icon === "upload" && <svg className="h-5 w-5 text-ink-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>}
                  {a.icon === "user" && <svg className="h-5 w-5 text-ink-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
                </div>
                <span className="text-sm font-semibold text-ink-navy">{a.label}</span>
              </Link>
            ))}
          </div>

          <h2 className="mt-6 font-display text-lg font-semibold text-ink-navy">Your schemes</h2>
          <div className="mt-3 space-y-2">
            {loading ? (
              <p className="text-sm text-slate-blue-400">Loading…</p>
            ) : matches.length === 0 ? (
              <p className="text-sm text-slate-blue-400">Complete your profile to see matched schemes.</p>
            ) : (
              matches.slice(0, 5).map((m) => (
                <div key={m.scheme_id} className="si-scheme flex items-center justify-between rounded-xl border border-ink-navy/10 bg-white px-4 py-3">
                  <span className="text-sm font-medium text-ink-navy">{m.scheme_name}</span>
                  <span className={`text-xs font-medium ${m.match_score >= 0.7 ? "text-verified-teal" : m.match_score >= 0.4 ? "text-caution-amber" : "text-slate-blue-400"}`}>
                    {m.missing_documents.length > 0 ? `${m.missing_documents.length} doc(s) needed` : "Ready to apply"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-ink-navy/10 bg-white p-5">
            <h3 className="font-display text-base font-semibold text-ink-navy">Need help?</h3>
            <p className="mt-1 text-xs text-slate-blue">Ask our Scheme Q&A assistant about eligibility, documents, or deadlines.</p>
            <Button size="sm" variant="outline" href="/chat" className="mt-3">Ask a question</Button>
          </div>

          {pendingDocs > 0 && (
            <div className="rounded-xl bg-gradient-to-br from-signal-orange/[0.04] to-transparent border border-signal-orange/20 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-signal-orange/10">
                  <svg className="h-4 w-4 text-signal-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-navy">Upload missing documents</p>
                  <p className="mt-0.5 text-xs text-slate-blue">{pendingDocs} document(s) needed across your matched schemes.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { user, loading } = useAuth();
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (!loading) setIsSignedIn(!!user);
  }, [user, loading]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gradient-to-br from-[#0B1E3D] via-[#0F2645] to-[#142E4D]">
        <div className="w-[300px] max-w-full px-4 sm:w-[400px]">
          <video
            src="/assets/loader-ring.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {isSignedIn ? (
          <div className="bg-gradient-to-b from-white to-warm-paper min-h-full">
            <SignedInHome />
          </div>
        ) : (
          <>
            <Hero />
            <div className="-mt-8 pb-16 sm:-mt-12 sm:pb-20">
              <StatsBar />
            </div>
            <Features />
            <FAQ />
          </>
        )}
      </main>
    </div>
  );
}
