"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { getUserMatches, listDocuments, type EligibilityMatch, type UserDocument } from "@/lib/api";

export default function DashboardPage() {
  const { session } = useAuth();
  const pageRef = useRef<HTMLDivElement>(null);
  const [matches, setMatches] = useState<EligibilityMatch[]>([]);
  const [docs, setDocs] = useState<UserDocument[]>([]);
  const [tab, setTab] = useState<"schemes" | "documents">("schemes");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.access_token) return;
    Promise.all([
      getUserMatches(session.access_token),
      listDocuments(session.access_token),
    ])
      .then(([m, d]) => { setMatches(m); setDocs(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session?.access_token]);

  useEffect(() => {
    try {
      const els = pageRef.current?.querySelectorAll(".db-hero, .db-stat, .db-card, .db-item");
      if (els?.length) gsap.killTweensOf(els);
      const ctx = gsap.context(() => {
        gsap.fromTo(".db-hero", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", clearProps: "all" });
        gsap.fromTo(".db-stat", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.08, delay: 0.15, ease: "power2.out", clearProps: "all" });
        gsap.fromTo(".db-card", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, delay: 0.25, ease: "power2.out", clearProps: "all" });
      }, pageRef);
      return () => ctx.revert();
    } catch { return; }
  }, [matches]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar isSignedIn={true} />
        <main className="flex flex-1 items-center justify-center bg-gradient-to-b from-white to-warm-paper">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-navy/10 border-t-signal-orange" />
        </main>
        <Footer />
      </div>
    );
  }

  const totalMatches = matches.length;
  const readyCount = matches.filter((m) => m.missing_documents.length === 0).length;
  const pendingCount = matches.filter((m) => m.missing_documents.length > 0).length;
  const verifiedDocs = docs.filter((d) => d.verification_status === "verified").length;

  return (
    <div ref={pageRef} className="flex min-h-screen flex-col">
      <Navbar isSignedIn={true} />
      <main className="flex-1 bg-gradient-to-b from-white to-warm-paper">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="db-hero flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight text-ink-navy sm:text-3xl">Dashboard</h1>
              <p className="mt-1 text-sm text-slate-blue">{totalMatches} schemes matched to your profile</p>
            </div>
            <div className="flex gap-2">
              <Button href="/profile" variant="outline" size="sm">Edit profile</Button>
              <Button href="/documents" size="sm">Upload documents</Button>
            </div>
          </div>

          {/* Stats row */}
          <div className="db-hero mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Schemes Found", value: totalMatches, color: "bg-signal-orange/10 text-signal-orange" },
              { label: "Ready to Apply", value: readyCount, color: "bg-verified-teal/10 text-verified-teal" },
              { label: "Need Documents", value: pendingCount, color: "bg-caution-amber/10 text-caution-amber" },
              { label: "Docs Verified", value: `${verifiedDocs}/${docs.length}`, color: "bg-ink-navy/5 text-ink-navy" },
            ].map((stat) => (
              <div key={stat.label} className="db-stat rounded-xl border border-ink-navy/10 bg-white p-4 text-center sm:text-left">
                <p className={`text-2xl font-bold font-display ${stat.color.split(" ")[1]}`}>{stat.value}</p>
                <p className="text-xs text-slate-blue-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="db-hero mt-6 flex gap-1 rounded-lg bg-ink-navy/5 p-1">
            {(["schemes", "documents"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all capitalize",
                  tab === t ? "bg-white text-ink-navy shadow-sm" : "text-slate-blue hover:text-ink-navy"
                )}
              >
                {t === "schemes" ? `Matched schemes (${totalMatches})` : `Document library (${docs.length})`}
              </button>
            ))}
          </div>

          {tab === "schemes" && (
            <div className="mt-5 space-y-3">
              {totalMatches === 0 ? (
                <div className="db-card rounded-xl border border-ink-navy/10 bg-white p-8 text-center">
                  <p className="text-sm font-medium text-ink-navy">No scheme matches yet</p>
                  <p className="text-sm text-slate-blue-400 mt-1">Complete your profile to see which schemes you qualify for.</p>
                  <Button href="/profile" size="sm" className="mt-4">Complete profile</Button>
                </div>
              ) : (
                matches.map((m) => (
                  <div key={m.scheme_id} className="db-card rounded-xl border border-ink-navy/10 bg-white transition-all hover:shadow-sm">
                    <button
                      onClick={() => setExpanded(expanded === m.scheme_id ? null : m.scheme_id)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold font-display",
                          m.match_score >= 0.7 ? "bg-verified-teal/10 text-verified-teal" : m.match_score >= 0.4 ? "bg-caution-amber/10 text-caution-amber" : "bg-ink-navy/5 text-slate-blue"
                        )}>
                          {Math.round(m.match_score * 100)}%
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-ink-navy">{m.scheme_name}</p>
                          <p className="text-xs text-slate-blue-400">{m.issuing_authority} · {m.scheme_category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "text-xs font-medium",
                          m.missing_documents.length === 0 ? "text-verified-teal" : "text-caution-amber"
                        )}>
                          {m.missing_documents.length === 0 ? "Ready" : `${m.missing_documents.length} doc(s) needed`}
                        </span>
                        <svg className={cn("h-5 w-5 text-slate-blue-400 transition-transform", expanded === m.scheme_id && "rotate-180")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 9l6 6 6-6" /></svg>
                      </div>
                    </button>

                    {expanded === m.scheme_id && (
                      <div className="border-t border-ink-navy/10 px-5 py-4">
                        <p className="text-sm text-slate-blue">{m.benefit_summary}</p>

                        {m.missing_documents.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-semibold text-caution-amber mb-2">Missing documents</p>
                            <div className="flex flex-wrap gap-2">
                              {m.missing_documents.map((doc) => (
                                <span key={doc} className="rounded-md bg-caution-amber/10 px-2.5 py-1 text-xs font-medium text-caution-amber">{doc}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-4 flex gap-2">
                          <Button size="sm" variant="outline" href={m.application_url} target="_blank" rel="noopener noreferrer">View scheme</Button>
                          {m.missing_documents.length === 0 && (
                            <Button size="sm">Mark as applied</Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "documents" && (
            <div className="mt-5 space-y-2">
              {docs.length === 0 ? (
                <div className="db-card rounded-xl border border-ink-navy/10 bg-white p-8 text-center">
                  <p className="text-sm font-medium text-ink-navy">No documents uploaded</p>
                  <p className="text-sm text-slate-blue-400 mt-1">Upload your documents to help us verify your eligibility.</p>
                  <Button href="/documents" size="sm" className="mt-4">Upload documents</Button>
                </div>
              ) : (
                docs.map((doc) => (
                  <div key={doc.id} className="db-card flex items-center justify-between rounded-xl border border-ink-navy/10 bg-white px-4 py-3 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        doc.verification_status === "verified" ? "bg-verified-teal/10 text-verified-teal" : "bg-caution-amber/10 text-caution-amber"
                      )}>
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink-navy capitalize">{doc.doc_type.replace(/_/g, " ")}</p>
                        <p className="text-xs text-slate-blue-400">{new Date(doc.uploaded_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={cn("text-xs font-medium", doc.verification_status === "verified" ? "text-verified-teal" : "text-caution-amber")}>
                      {doc.verification_status === "verified" ? "Verified" : doc.verification_status === "rejected" ? "Rejected" : "Pending"}
                    </span>
                  </div>
                ))
              )}

              <div className="db-card rounded-xl border border-ink-navy/10 bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-ink-navy">Document verification progress</p>
                    <p className="text-xs text-slate-blue-400 mt-0.5">{verifiedDocs} of {docs.length} verified</p>
                  </div>
                  <span className="text-lg font-bold font-display text-ink-navy">
                    {docs.length > 0 ? Math.round((verifiedDocs / docs.length) * 100) : 0}%
                  </span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink-navy/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-signal-orange to-verified-teal transition-all"
                    style={{ width: `${docs.length > 0 ? (verifiedDocs / docs.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Missing docs summary */}
          {matches.length > 0 && (
            <div className="db-card mt-6 rounded-xl border border-ink-navy/10 bg-white p-5">
              <h3 className="font-display text-base font-semibold text-ink-navy">Missing documents across all schemes</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {Array.from(new Set(matches.flatMap((m) => m.missing_documents))).map((doc) => (
                  <span key={doc} className="rounded-md bg-caution-amber/10 px-3 py-1.5 text-xs font-medium text-caution-amber capitalize">{doc.replace(/_/g, " ")}</span>
                ))}
                {matches.every((m) => m.missing_documents.length === 0) && (
                  <span className="text-sm text-verified-teal">All documents ready to apply!</span>
                )}
              </div>
            </div>
          )}

          {/* Quick tips */}
          <div className="db-card mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-ink-navy/10 bg-white p-5">
              <h3 className="font-display text-sm font-semibold text-ink-navy">Tip</h3>
              <p className="mt-1 text-xs text-slate-blue">Upload your income certificate — it&apos;s required for most means-tested schemes.</p>
            </div>
            <div className="rounded-xl border border-ink-navy/10 bg-white p-5">
              <h3 className="font-display text-sm font-semibold text-ink-navy">Keep your profile updated</h3>
              <p className="mt-1 text-xs text-slate-blue">Scheme rules change. An up-to-date profile ensures accurate matching.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
