"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { type IntakeResponse, type SchemeResult, GOV_ID_LABELS, type GovIdKey, SCHEME_CATEGORY_OPTIONS } from "../lib/api-types";

/** Map backend scheme_category to a display colour */
const CATEGORY_COLOURS: Record<string, string> = {
  agriculture: "green",
  health: "red",
  pension: "yellow",
  education: "purple",
  housing: "blue",
  disability: "pink",
  women_child: "rose",
  other: "slate",
};

const CATEGORY_ICONS: Record<string, string> = {
  agriculture: "🌾",
  health: "🏥",
  pension: "👴",
  education: "🎓",
  housing: "🏠",
  disability: "♿",
  women_child: "👩",
  other: "📋",
};

const BADGE = (cat: string) => {
  const colour = CATEGORY_COLOURS[cat] ?? "slate";
  const map: Record<string, string> = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    yellow: "bg-yellow-100 text-yellow-700",
    purple: "bg-purple-100 text-purple-700",
    blue: "bg-blue-100 text-blue-700",
    pink: "bg-pink-100 text-pink-700",
    rose: "bg-rose-100 text-rose-700",
    slate: "bg-slate-100 text-slate-600",
  };
  return map[colour] ?? map.slate;
};

const getCategoryLabel = (cat: string) =>
  SCHEME_CATEGORY_OPTIONS.find(o => o.value === cat)?.label ?? cat;

export default function Dashboard() {
  const [data, setData] = useState<IntakeResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"schemes" | "docs">("schemes");

  useEffect(() => {
    // Load intake result from sessionStorage (set by register page after POST /api/intake)
    const raw = sessionStorage.getItem("intake_result");
    if (raw) {
      try { setData(JSON.parse(raw) as IntakeResponse); } catch { /* ignore */ }
    }
  }, []);

  // Collect all unique missing documents across eligible schemes
  const allMissingDocs = data
    ? [...new Set(data.eligible_schemes.flatMap(s => s.missing_documents))] as GovIdKey[]
    : [];

  // Total estimated value is just listed from the first scheme (backend doesn't sum)
  const totalSchemes = data?.total_eligible_count ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg className="w-7 h-7 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8 2 4 8 4 12c0 2 1.5 4 3 5 1.5 1 4 2 5 4 1-2 3.5-3 5-4 1.5-1 3-3 3-5 0-4-4-10-8-10zm0 18c-1.5-2-4-3-5.5-4-1.5-1-2.5-2.5-2.5-4 0-3 3-8 8-8s8 5 8 8c0 1.5-1 3-2.5 4C16 17 13.5 18 12 20z" />
            </svg>
            <span className="font-bold text-navy-900 text-lg">Yojana Saarthi</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/dashboard" className="text-orange-500 font-semibold">Dashboard</Link>
            <Link href="/schemes" className="hover:text-navy-900 transition-colors">Schemes</Link>
            <Link href="/chat" className="hover:text-navy-900 transition-colors">AI Assistant</Link>
            <Link href="/documents" className="hover:text-navy-900 transition-colors">Documents</Link>
          </nav>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>
              {allMissingDocs.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />}
            </button>
            <Link href="/profile" className="w-9 h-9 rounded-full bg-navy-900 flex items-center justify-center text-white font-bold text-sm">AD</Link>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* No data state */}
        {!data && (
          <div className="bg-white rounded-2xl border border-dashed border-orange-200 p-12 flex flex-col items-center text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-navy-900 mb-2">No eligibility check yet</h2>
            <p className="text-slate-500 text-sm max-w-sm mb-6">Fill in your citizen profile to see which government schemes you qualify for.</p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors shadow-md shadow-orange-500/30">
              Start Eligibility Check
            </Link>
          </div>
        )}

        {data && (
          <>
            {/* Processing status banner */}
            {data.processing_status === "partial_success" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-3 text-sm text-yellow-700 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                AI language polish was unavailable — showing deterministic results. Eligibility is unaffected.
              </div>
            )}

            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-navy-900 to-navy-800 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-64 opacity-10">
                <svg viewBox="0 0 200 200" fill="none" className="w-full h-full"><circle cx="150" cy="50" r="80" fill="#F5842B" /><circle cx="50" cy="150" r="60" fill="#F5842B" /></svg>
              </div>
              <div className="relative z-10">
                <p className="text-orange-300 font-semibold text-sm uppercase tracking-wide mb-2">Eligibility Results</p>
                <h1 className="text-2xl lg:text-3xl font-bold mb-3">
                  {totalSchemes === 0
                    ? "No schemes matched your profile"
                    : <>You qualify for <span className="text-orange-400">{totalSchemes} scheme{totalSchemes > 1 ? "s" : ""}</span></>
                  }
                </h1>
                <p className="text-slate-300 text-sm max-w-xl">
                  {totalSchemes === 0
                    ? "Try updating your profile or uploading more documents — criteria may vary."
                    : `Upload ${allMissingDocs.length} missing document${allMissingDocs.length !== 1 ? "s" : ""} to maximise your application success rate.`
                  }
                </p>
                <div className="flex flex-wrap gap-3 mt-5">
                  <Link href="/chat" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors shadow-md shadow-orange-500/30">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                    Ask AI Assistant
                  </Link>
                  <Link href="/documents" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors border border-white/20">
                    Upload Documents
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Eligible Schemes", value: totalSchemes.toString(), icon: "✅", trend: "Matched to your profile", positive: true },
                { label: "Top Priority", value: data.eligible_schemes[0]?.scheme_name?.split(" ").slice(0,2).join(" ") ?? "–", icon: "🥇", trend: data.eligible_schemes[0]?.benefit_value_estimate ?? "", positive: true },
                { label: "Missing Docs", value: allMissingDocs.length.toString(), icon: "📄", trend: allMissingDocs.length === 0 ? "All documents present!" : "Upload to unlock more", positive: allMissingDocs.length === 0 },
                { label: "Avg Match Score", value: data.eligible_schemes.length > 0 ? `${Math.round((data.eligible_schemes.reduce((s, r) => s + r.eligibility_match_score, 0) / data.eligible_schemes.length) * 100)}%` : "–", icon: "🎯", trend: "Across eligible schemes", positive: true },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-3">{s.icon}</div>
                  <div className="text-xl font-bold text-navy-900 mb-1 truncate">{s.value}</div>
                  <div className="text-slate-500 text-xs mb-2">{s.label}</div>
                  <div className={`text-xs font-semibold ${s.positive ? "text-green-600" : "text-orange-500"}`}>{s.trend}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div>
              <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit mb-6">
                <button onClick={() => setActiveTab("schemes")} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "schemes" ? "bg-white text-navy-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                  Eligible Schemes ({totalSchemes})
                </button>
                <button onClick={() => setActiveTab("docs")} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "docs" ? "bg-white text-navy-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                  Missing Documents
                  {allMissingDocs.length > 0 && <span className="ml-1.5 bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">{allMissingDocs.length}</span>}
                </button>
              </div>

              {/* Schemes Tab */}
              {activeTab === "schemes" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {data.eligible_schemes.length === 0 && (
                    <div className="col-span-2 text-center py-12 text-slate-400">No eligible schemes found for your profile.</div>
                  )}
                  {data.eligible_schemes.map((scheme: SchemeResult) => (
                    <Link key={scheme.scheme_id} href={`/scheme-details?id=${scheme.scheme_id}&request_id=${data.request_id}`}
                      className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{CATEGORY_ICONS[scheme.scheme_category] ?? "📋"}</div>
                          <div>
                            <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-1 ${BADGE(scheme.scheme_category)}`}>
                              {getCategoryLabel(scheme.scheme_category)}
                            </span>
                            <h3 className="font-bold text-navy-900 text-sm leading-tight">{scheme.scheme_name}</h3>
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <div className={`text-lg font-bold ${scheme.eligibility_match_score >= 0.9 ? "text-green-600" : scheme.eligibility_match_score >= 0.75 ? "text-orange-500" : "text-slate-500"}`}>
                            {Math.round(scheme.eligibility_match_score * 100)}%
                          </div>
                          <div className="text-xs text-slate-400">match · rank #{scheme.priority_rank}</div>
                        </div>
                      </div>
                      <p className="text-slate-500 text-xs mb-3 line-clamp-2">{scheme.benefit_summary}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-orange-500 font-bold text-sm">{scheme.benefit_value_estimate}</span>
                        {scheme.missing_documents.length > 0 ? (
                          <span className="text-xs bg-orange-50 text-orange-600 font-medium px-2.5 py-1 rounded-full">
                            {scheme.missing_documents.length} doc{scheme.missing_documents.length > 1 ? "s" : ""} missing
                          </span>
                        ) : (
                          <span className="text-xs bg-green-50 text-green-600 font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            Ready to apply
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Docs Tab */}
              {activeTab === "docs" && (
                <div className="space-y-4">
                  {allMissingDocs.length === 0 ? (
                    <div className="text-center py-12 text-green-600 font-semibold">🎉 You have all required documents!</div>
                  ) : (
                    <>
                      <p className="text-slate-500 text-sm">Upload these documents to maximise your eligibility and reduce missing doc counts.</p>
                      {allMissingDocs.map((key) => (
                        <div key={key} className="bg-white rounded-2xl border border-dashed border-orange-200 p-5 flex items-center justify-between hover:border-orange-400 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-xl">{GOV_ID_LABELS[key].icon}</div>
                            <div>
                              <div className="font-semibold text-navy-900 text-sm">{GOV_ID_LABELS[key].label}</div>
                              <div className="text-slate-400 text-xs">
                                Required for {data.eligible_schemes.filter(s => s.missing_documents.includes(key)).length} scheme(s)
                              </div>
                            </div>
                          </div>
                          <Link href="/documents" className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors">Upload</Link>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
