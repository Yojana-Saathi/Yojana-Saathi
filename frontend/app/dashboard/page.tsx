"use client";
import Link from "next/link";
import { useState } from "react";

const eligibleSchemes = [
  {
    id: "pm-kisan-001",
    name: "PM-KISAN Samman Nidhi",
    category: "Agriculture",
    categoryColor: "green",
    benefit: "₹6,000/year",
    score: 97,
    status: "eligible",
    missingDocs: [],
    icon: "🌾",
  },
  {
    id: "ayushman-001",
    name: "Ayushman Bharat – PMJAY",
    category: "Healthcare",
    categoryColor: "red",
    benefit: "₹5 lakh/year",
    score: 91,
    status: "eligible",
    missingDocs: ["income_certificate"],
    icon: "🏥",
  },
  {
    id: "nsap-001",
    name: "NSAP Old Age Pension",
    category: "Social Welfare",
    categoryColor: "yellow",
    benefit: "₹200-500/month",
    score: 85,
    status: "eligible",
    missingDocs: ["aadhaar"],
    icon: "👴",
  },
  {
    id: "nsp-001",
    name: "National Scholarship Portal (Pre-Matric)",
    category: "Education",
    categoryColor: "purple",
    benefit: "₹10,000/year",
    score: 78,
    status: "partial",
    missingDocs: ["income_certificate", "caste_certificate"],
    icon: "🎓",
  },
];

const docMissing = ["Income Certificate", "Caste Certificate", "Aadhaar Card"];

const stats = [
  { label: "Eligible Schemes", value: "4", icon: "✅", trend: "+2 new", positive: true },
  { label: "Total Benefit Value", value: "₹11.6K+", icon: "💰", trend: "Per year", positive: true },
  { label: "Missing Documents", value: "3", icon: "📄", trend: "Upload to unlock more", positive: false },
  { label: "Match Score", value: "88%", icon: "🎯", trend: "Avg across schemes", positive: true },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"schemes" | "docs">("schemes");

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
            {/* Notification Bell */}
            <button className="relative w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
            </button>
            {/* Avatar */}
            <Link href="/profile" className="w-9 h-9 rounded-full bg-navy-900 flex items-center justify-center text-white font-bold text-sm">
              AD
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-navy-900 to-navy-800 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-64 opacity-10">
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full"><circle cx="150" cy="50" r="80" fill="#F5842B" /><circle cx="50" cy="150" r="60" fill="#F5842B" /></svg>
          </div>
          <div className="relative z-10">
            <p className="text-orange-300 font-semibold text-sm uppercase tracking-wide mb-2">Welcome back</p>
            <h1 className="text-2xl lg:text-3xl font-bold mb-3">Asha Devi</h1>
            <p className="text-slate-300 text-sm lg:text-base max-w-xl">
              You qualify for <span className="text-orange-400 font-bold">4 schemes</span> worth up to <span className="text-orange-400 font-bold">₹11,600/year</span> in benefits. Upload 3 missing documents to unlock more.
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <Link href="/chat" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors shadow-md shadow-orange-500/30">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                Ask AI Assistant
              </Link>
              <Link href="/documents" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors border border-white/20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                Upload Documents
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-2xl mb-3">{s.icon}</div>
              <div className="text-2xl font-bold text-navy-900 mb-1">{s.value}</div>
              <div className="text-slate-500 text-xs mb-2">{s.label}</div>
              <div className={`text-xs font-semibold ${s.positive ? "text-green-600" : "text-orange-500"}`}>{s.trend}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div>
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit mb-6">
            <button
              onClick={() => setActiveTab("schemes")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "schemes" ? "bg-white text-navy-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Eligible Schemes
            </button>
            <button
              onClick={() => setActiveTab("docs")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "docs" ? "bg-white text-navy-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Missing Documents
              <span className="ml-1.5 bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">{docMissing.length}</span>
            </button>
          </div>

          {/* Schemes Tab */}
          {activeTab === "schemes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {eligibleSchemes.map((scheme) => (
                <Link
                  key={scheme.id}
                  href={`/scheme-details?id=${scheme.id}`}
                  className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{scheme.icon}</div>
                      <div>
                        <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-1 ${
                          scheme.categoryColor === "green" ? "bg-green-100 text-green-700" :
                          scheme.categoryColor === "red" ? "bg-red-100 text-red-700" :
                          scheme.categoryColor === "yellow" ? "bg-yellow-100 text-yellow-700" :
                          "bg-purple-100 text-purple-700"
                        }`}>{scheme.category}</span>
                        <h3 className="font-bold text-navy-900 text-sm leading-tight">{scheme.name}</h3>
                      </div>
                    </div>
                    {/* Score ring */}
                    <div className="flex-shrink-0 text-right">
                      <div className={`text-lg font-bold ${scheme.score >= 90 ? "text-green-600" : scheme.score >= 75 ? "text-orange-500" : "text-slate-500"}`}>{scheme.score}%</div>
                      <div className="text-xs text-slate-400">match</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-500 font-bold text-sm">{scheme.benefit}</span>
                    {scheme.missingDocs.length > 0 ? (
                      <span className="text-xs bg-orange-50 text-orange-600 font-medium px-2.5 py-1 rounded-full">
                        {scheme.missingDocs.length} doc{scheme.missingDocs.length > 1 ? "s" : ""} missing
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
              <p className="text-slate-500 text-sm">Upload these documents to increase your eligibility score and unlock more schemes.</p>
              {docMissing.map((doc) => (
                <div key={doc} className="bg-white rounded-2xl border border-dashed border-orange-200 p-5 flex items-center justify-between group hover:border-orange-400 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                    </div>
                    <div>
                      <div className="font-semibold text-navy-900 text-sm">{doc}</div>
                      <div className="text-slate-400 text-xs">Required for 2-3 schemes</div>
                    </div>
                  </div>
                  <Link href="/documents" className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors">
                    Upload
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
