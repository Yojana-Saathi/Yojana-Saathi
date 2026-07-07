"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { fetchDraft } from "../lib/api-client";
import { GOV_ID_LABELS, type GovIdKey, type SchemeResult, SCHEME_CATEGORY_OPTIONS } from "../lib/api-types";

const getCategoryLabel = (cat: string) =>
  SCHEME_CATEGORY_OPTIONS.find(o => o.value === cat)?.label ?? cat;

function SchemeDetailsContent() {
  const params = useSearchParams();
  const schemeId = params.get("id") ?? "";
  const requestId = params.get("request_id") ?? "";

  // Try to get the scheme from the cached intake result
  const [scheme, setScheme] = useState<SchemeResult | null>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const [nextSteps, setNextSteps] = useState<string[]>([]);
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("intake_result");
    if (raw && schemeId) {
      try {
        const data = JSON.parse(raw);
        const found = data.eligible_schemes?.find((s: SchemeResult) => s.scheme_id === schemeId);
        if (found) setScheme(found);
      } catch { /* ignore */ }
    }
  }, [schemeId]);

  const handleGetDraft = async () => {
    if (!schemeId || !requestId) {
      setDraftError("No active session — please run the eligibility check first.");
      return;
    }
    setDraftLoading(true);
    setDraftError(null);
    try {
      const result = await fetchDraft(schemeId, requestId);
      setDraft(result.drafted_application_text);
      setNextSteps(result.next_steps ?? []);
    } catch (err) {
      setDraftError(err instanceof Error ? err.message : "Failed to generate draft.");
    } finally {
      setDraftLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm py-4">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <svg className="w-8 h-8 text-orange-500 group-hover:scale-105 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8 2 4 8 4 12c0 2 1.5 4 3 5 1.5 1 4 2 5 4 1-2 3.5-3 5-4 1.5-1 3-3 3-5 0-4-4-10-8-10zm0 18c-1.5-2-4-3-5.5-4-1.5-1-2.5-2.5-2.5-4 0-3 3-8 8-8s8 5 8 8c0 1.5-1 3-2.5 4C16 17 13.5 18 12 20z" />
            </svg>
            <span className="text-xl font-bold tracking-tight text-navy-900">Yojana Saarthi</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 font-medium text-gray-600 text-sm">
            <Link href="/schemes" className="hover:text-orange-500 transition-colors">Schemes</Link>
            <Link href="/dashboard" className="hover:text-orange-500 transition-colors">Dashboard</Link>
          </nav>
          <Link href="/register" className="hidden md:inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20">
            Check Eligibility
          </Link>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-white border-b border-gray-200">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-16">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-navy-800 font-semibold hover:text-orange-500 transition-colors mb-8 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
              Back to Dashboard
            </Link>

            {!scheme && (
              <div className="text-center py-16 text-slate-400">
                <div className="text-4xl mb-3">🔍</div>
                <p>Scheme not found. <Link href="/dashboard" className="text-orange-500 font-semibold">Go to dashboard</Link></p>
              </div>
            )}

            {scheme && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left: Details */}
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                      {getCategoryLabel(scheme.scheme_category)}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${scheme.eligibility_match_score >= 0.9 ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      {Math.round(scheme.eligibility_match_score * 100)}% Match · Rank #{scheme.priority_rank}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-navy-900 leading-tight mb-4">{scheme.scheme_name}</h1>
                  <p className="text-lg text-gray-600 mb-6">{scheme.benefit_summary}</p>

                  <div className="flex flex-wrap gap-4 mb-8">
                    <a href={scheme.application_url} target="_blank" rel="noopener noreferrer"
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-md shadow-orange-500/20 text-sm">
                      Apply on Official Portal ↗
                    </a>
                    <button
                      onClick={handleGetDraft}
                      disabled={draftLoading || !requestId}
                      className="bg-white border-2 border-navy-900 text-navy-900 hover:bg-navy-50 font-semibold py-3 px-8 rounded-full transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {draftLoading && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                      {draftLoading ? "Generating…" : "Get Application Draft"}
                    </button>
                  </div>

                  {/* Missing documents */}
                  {scheme.missing_documents.length > 0 && (
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-4">
                      <p className="text-sm font-semibold text-orange-700 mb-2">⚠️ Documents you&apos;re missing:</p>
                      <ul className="space-y-1">
                        {scheme.missing_documents.map((key) => (
                          <li key={key} className="text-sm text-orange-600 flex items-center gap-2">
                            <span>{GOV_ID_LABELS[key as GovIdKey]?.icon ?? "📄"}</span>
                            {GOV_ID_LABELS[key as GovIdKey]?.label ?? key}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {draftError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">{draftError}</div>
                  )}
                </div>

                {/* Right: Benefit Summary Card */}
                <div className="space-y-5">
                  <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 shadow-sm">
                    <h2 className="text-lg font-bold text-navy-900 mb-3 flex items-center gap-2">
                      <span>💰</span> Benefit Value
                    </h2>
                    <p className="text-3xl font-bold text-orange-500">{scheme.benefit_value_estimate}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <h2 className="text-lg font-bold text-navy-900 mb-3">Quick Info</h2>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between"><dt className="text-slate-500">Scheme ID</dt><dd className="font-mono text-navy-900 text-xs">{scheme.scheme_id}</dd></div>
                      <div className="flex justify-between"><dt className="text-slate-500">Category</dt><dd className="font-medium text-navy-900">{getCategoryLabel(scheme.scheme_category)}</dd></div>
                      <div className="flex justify-between"><dt className="text-slate-500">Missing docs</dt><dd className={`font-medium ${scheme.missing_documents.length === 0 ? "text-green-600" : "text-orange-500"}`}>{scheme.missing_documents.length === 0 ? "None ✓" : scheme.missing_documents.length}</dd></div>
                    </dl>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Draft Section */}
        {draft && (
          <section className="container mx-auto max-w-4xl px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold text-navy-900 mb-2">📝 Pre-filled Application Draft</h2>
            <p className="text-slate-500 text-sm mb-6">Generated by the Drafter agent from your profile. Review and edit before submitting.</p>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans leading-relaxed">{draft}</pre>
            </div>

            {nextSteps.length > 0 && (
              <div className="mt-8">
                <h3 className="font-bold text-navy-900 mb-4">Next Steps</h3>
                <ol className="space-y-3">
                  {nextSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                      <span className="text-sm text-slate-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <button
              onClick={() => navigator.clipboard.writeText(draft)}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
              Copy Draft
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

export default function SchemeDetails() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading scheme details…</div>}>
      <SchemeDetailsContent />
    </Suspense>
  );
}
