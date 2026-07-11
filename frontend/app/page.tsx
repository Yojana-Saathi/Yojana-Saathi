"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "./lib/supabaseClient";

const popularSchemes = [
  {
    id: 1, category: "Agriculture", match: 99,
    name: "PM-KISAN Samman Nidhi", ministry: "Ministry of Agriculture & Farmers Welfare",
    desc: "Direct income support of Rs 6,000 per year to small and marginal farmer families.",
    benefit: "₹6,000/year",
  },
  {
    id: 2, category: "Health", match: 95,
    name: "Ayushman Bharat PM-JAY", ministry: "National Health Authority",
    desc: "Cashless hospitalization cover of up to Rs 5 lakh per family per year.",
    benefit: "Up to ₹5,00,000",
  },
  {
    id: 3, category: "Housing", match: 90,
    name: "PM Awas Yojana – Gramin", ministry: "Ministry of Rural Development",
    desc: "Financial assistance for construction of pucca house in rural areas.",
    benefit: "Up to ₹1,20,000",
  },
  {
    id: 4, category: "Education", match: 82,
    name: "National Means-cum-Merit Scholarship", ministry: "Department of School Education",
    desc: "Scholarship of Rs 12,000 per year for meritorious students from economically weaker sections.",
    benefit: "₹12,000/year",
  },
  {
    id: 5, category: "Women & Child", match: 88,
    name: "Pradhan Mantri Matru Vandana Yojana", ministry: "Ministry of Women & Child Development",
    desc: "Cash incentive of Rs 5,000 in three instalments to pregnant women and lactating mothers.",
    benefit: "₹5,000",
  },
  {
    id: 6, category: "Employment", match: 93,
    name: "MGNREGA", ministry: "Ministry of Rural Development",
    desc: "100 days of guaranteed wage employment in a financial year to every rural household.",
    benefit: "₹24,000/year",
  },
];

const CAT_STYLE: Record<string, string> = {
  Agriculture: "bg-green-100 text-green-700",
  Health: "bg-red-100 text-red-600",
  Housing: "bg-blue-100 text-blue-700",
  Education: "bg-purple-100 text-purple-700",
  "Women & Child": "bg-pink-100 text-pink-700",
  Employment: "bg-yellow-100 text-yellow-700",
};

const steps = [
  { icon: "👤", title: "Share your profile", desc: "Answer a few questions — age, income, state, occupation, and relevant documents." },
  { icon: "⚡", title: "AI scans schemes", desc: "Our AI eligibility engine scans 4,702+ central and state welfare schemes." },
  { icon: "🎯", title: "Get ranked results", desc: "Receive a personalised benefit value score showing your total eligible entitlements." },
  { icon: "📝", title: "Apply with drafts", desc: "One-click draft applications are pre-filled — you can submit to any scheme directly." },
];

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  async function handleCheckEligibility() {
    setChecking(true);
    const { data: { session } } = await supabase.auth.getSession();
    router.push(session ? "/dashboard" : "/login");
    setChecking(false);
  }

  return (
    <>
      {/* ════ NAVBAR ════ */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/logo.png" alt="logo" className="w-7 h-7" />
            <span className="font-bold text-[15px] text-[#1B2B4B] tracking-tight">YojanaSaathi</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium text-gray-500">
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How It Works</a>
            <Link href="/schemes" className="hover:text-gray-900 transition-colors">Schemes</Link>
            <a href="#privacy" className="hover:text-gray-900 transition-colors">For Citizens</a>
            <a href="#schemes" className="hover:text-gray-900 transition-colors">State Search</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden md:block text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors">Sign In</Link>
            <button
              onClick={handleCheckEligibility}
              disabled={checking}
              className="px-4 py-2 text-[13px] font-semibold text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20 disabled:opacity-70"
            >
              {checking ? "…" : "Get Started"}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ════ HERO ════ */}
        <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg,#f0f4ff 0%,#f6f8ff 35%,#fffaf5 70%,#fff7ef 100%)" }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-12 pb-0">
            {/* Breadcrumb badge */}
            <div className="flex items-center gap-1.5 mb-8 text-[10px] font-bold tracking-widest uppercase text-gray-400">
              <svg className="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-orange-500">AI-Powered</span>
              <span>•</span>
              <span>Open Source</span>
              <span>•</span>
              <span>For Every Citizen</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr_280px] gap-6 items-start">
              {/* LEFT */}
              <div className="py-4 space-y-5">
                <h1 className="text-5xl lg:text-[52px] font-extrabold leading-[1.07] text-[#1B2B4B]">
                  Unlock Your<br />Right to <span className="text-orange-500">Benefits</span>
                </h1>
                <p className="text-[15px] text-gray-500 leading-relaxed max-w-sm">
                  We scan <strong className="text-orange-500 font-bold">4,702+</strong> government schemes using advanced AI reasoning to find every benefit you are eligible for.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={handleCheckEligibility}
                    disabled={checking}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-orange-500 rounded-full hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-orange-400/40 disabled:opacity-70"
                  >
                    {checking ? "Checking…" : "Check Eligibility Now"}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                  <a href="#how-it-works" className="text-sm font-semibold text-[#1B2B4B] hover:text-orange-500 transition-colors">How It Works</a>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-3 pt-3">
                  {[
                    { val: "4,702+", label: "Government Schemes" },
                    { val: "28", label: "States & UTs Covered" },
                    { val: "95%+", label: "Match Accuracy" },
                    { val: "100%", label: "Private & Secure" },
                  ].map(({ val, label }) => (
                    <div key={label} className="flex items-center gap-2">
                      <p className="text-lg font-extrabold text-[#1B2B4B]">{val}</p>
                      <p className="text-[11px] text-gray-400 leading-tight">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CENTER — video/image background with floating cards */}
              <div className="relative flex items-end justify-center min-h-[460px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/Center-Ai-Code.png" alt="AI Engine"
                  className="w-full max-w-[480px] mx-auto select-none pointer-events-none"
                  style={{ filter: "drop-shadow(0 0 40px rgba(249,115,22,0.15))" }}
                />

                {/* AI Engine label */}
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-full px-3 py-1 shadow-sm whitespace-nowrap z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-orange-500 text-[10px] font-bold tracking-widest uppercase">AI Eligibility Engine</span>
                </div>

                {/* Floating: Your Profile */}
                <div className="absolute top-8 left-0 lg:-left-6 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-[155px] z-20"
                  style={{ animation: "float 4s ease-in-out infinite" }}>
                  <p className="text-[11px] font-bold text-gray-900 mb-3">Your Profile</p>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center mb-3 mx-auto">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>
                  {["Age", "Occupation", "State", "Income", "Category"].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-[11px] text-gray-400 mb-1.5">
                      <div className="w-2 h-2 rounded-full bg-gray-200 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>

                {/* Floating: Scanning */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-[205px] z-20"
                  style={{ animation: "float 5s ease-in-out infinite 1s" }}>
                  <p className="text-[11px] font-bold text-gray-900 mb-3">Scanning 4,702+ Schemes</p>
                  {[
                    { label: "Checking Eligibility Rules", done: true },
                    { label: "Verifying Documents",        done: true },
                    { label: "Matching Benefits",          done: false, active: true },
                    { label: "Finalizing Results",         done: false },
                  ].map(({ label, done, active }) => (
                    <div key={label} className="flex items-center gap-2 text-[11px] mb-2">
                      {done ? (
                        <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : active ? (
                        <svg className="w-3.5 h-3.5 text-orange-400 flex-shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-gray-200 flex-shrink-0" />
                      )}
                      <span className={active ? "text-orange-500 font-semibold" : done ? "text-gray-700" : "text-gray-300"}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT — Scheme cards */}
              <div className="py-4">
                <p className="text-[10px] font-bold tracking-widest uppercase text-orange-500 mb-3">Matching Schemes</p>
                <div className="space-y-2.5">
                  {[
                    { emoji: "🌾", bg: "bg-green-50", title: "PM-KISAN", sub: "Farmer Income Support", amount: "₹6,000 / year", ac: "text-green-600" },
                    { emoji: "🏥", bg: "bg-red-50",   title: "Ayushman Bharat", sub: "Health Coverage", amount: "Up to ₹5 Lakh", ac: "text-orange-500" },
                    { emoji: "🎓", bg: "bg-blue-50",  title: "National Scholarship", sub: "Education Support", amount: "Up to ₹75,000", ac: "text-orange-500" },
                    { emoji: "🏠", bg: "bg-orange-50",title: "PM Awas Yojana", sub: "Housing Assistance", amount: "Up to ₹1,20,000", ac: "text-orange-500" },
                  ].map((s) => (
                    <div key={s.title} className="flex items-start gap-2.5 bg-white rounded-xl shadow-sm border border-gray-100 px-3 py-2.5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center text-sm mt-0.5`}>{s.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-[12px] font-bold text-[#1B2B4B] truncate">{s.title}</p>
                          <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0 ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-[10px] text-gray-400">{s.sub}</p>
                        <p className={`text-[12px] font-bold mt-0.5 ${s.ac}`}>{s.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom wave */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/bottom-waves.png" alt="" aria-hidden className="w-full block select-none pointer-events-none -mt-1" />
        </section>

        {/* ════ FOUR STEPS ════ */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <p className="text-center text-[11px] font-bold tracking-widest uppercase text-orange-500 mb-3">How It Works</p>
            <h2 className="text-center text-3xl font-extrabold text-[#1B2B4B] mb-3">Four steps to your benefits</h2>
            <p className="text-center text-gray-400 text-sm mb-14 max-w-lg mx-auto">
              A free tool to unlock your benefits. Here is how it works in four simple steps.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((s, i) => (
                <div key={i} className="text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-2xl mx-auto">
                    {s.icon}
                  </div>
                  <h3 className="font-bold text-[#1B2B4B] text-[15px]">{s.title}</h3>
                  <p className="text-gray-400 text-[13px] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════ POPULAR SCHEMES ════ */}
        <section id="schemes" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <p className="text-[11px] font-bold tracking-widest uppercase text-orange-500 mb-2">Popular</p>
            <div className="flex items-end justify-between mb-2">
              <h2 className="text-3xl font-extrabold text-[#1B2B4B]">Popular schemes we track</h2>
              <Link href="/schemes" className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1">
                Browse all schemes
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <p className="text-gray-400 text-sm mb-10">More income support to health cover — explore the biggest programs at a glance.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {popularSchemes.map((s) => (
                <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${CAT_STYLE[s.category] ?? "bg-slate-100 text-slate-600"}`}>{s.category}</span>
                    <span className="text-[11px] text-gray-400 font-medium">{s.match}% match</span>
                  </div>
                  <h3 className="text-[14px] font-bold text-gray-900 mb-0.5">{s.name}</h3>
                  <p className="text-[11px] text-gray-400 mb-2">{s.ministry}</p>
                  <p className="text-[12px] text-gray-500 leading-relaxed">{s.desc}</p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                    <span className="text-orange-500 font-bold text-[15px]">{s.benefit}</span>
                    <Link href={`/scheme-details/${s.id}`} className="flex items-center gap-1 text-[12px] font-semibold text-gray-400 hover:text-[#1B2B4B] transition-colors">
                      View details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════ PRIVACY SECTION ════ */}
        <section id="privacy" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <p className="text-[11px] font-bold tracking-widest uppercase text-orange-500 mb-3">Privacy First</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-5">
                <h2 className="text-3xl font-extrabold text-[#1B2B4B] leading-snug">
                  Your data. Your<br />ownership. Always.
                </h2>
                <p className="text-gray-400 text-[14px] leading-relaxed max-w-sm">
                  We use AI to discover eligibility, not to profile you. Your data stays private on your device and in your vault.
                </p>
                <ul className="space-y-2.5">
                  {[
                    "Minimal data shared with third-parties",
                    "Documents stored with AES-256 Encryption",
                    "Delete your account and data anytime",
                    "Zero Profiling",
                  ].map((pt) => (
                    <li key={pt} className="flex items-center gap-3 text-[13px] text-gray-600">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Document vault preview */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-gray-900">Document Vault</p>
                  <span className="text-[11px] font-semibold text-green-600 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    Secured
                  </span>
                </div>
                {[
                  { name: "Aadhaar Card",      status: "verified" },
                  { name: "Caste Certificate", status: "verified" },
                  { name: "Ration Card",        status: "pending" },
                ].map((d) => (
                  <div key={d.name} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <span className="text-[12px] font-medium text-gray-700">{d.name}</span>
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${d.status === "verified" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-500"}`}>
                      {d.status === "verified" ? "Verified" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════ OPEN SOURCE (DARK) ════ */}
        <section className="py-20 bg-[#1B2B4B]">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
            <p className="text-[11px] font-bold tracking-widest uppercase text-orange-400 mb-4">Open Source</p>
            <h2 className="text-3xl font-extrabold text-white mb-4">Built in the open. Free for every citizen.</h2>
            <p className="text-slate-400 text-sm mb-8 max-w-xl mx-auto">
              YojanaSaathi is an open source project. Read the code, audit the data, contribute to the mission — it&apos;s built by citizens, for citizens.
            </p>
            <div className="flex items-center justify-center gap-4 mb-14">
              <a href="https://github.com" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-full border border-white/20 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                View on Github
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-full border border-white/20 transition-colors">
                ⭐ Star Repo
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { val: "119", label: "Contributors" },
                { val: "MIT", label: "License" },
                { val: "4.7k+", label: "GitHub Stars" },
                { val: "0", label: "Ad trackers" },
              ].map(({ val, label }) => (
                <div key={label}>
                  <p className="text-3xl font-extrabold text-white mb-1">{val}</p>
                  <p className="text-slate-500 text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════ FINAL CTA ════ */}
        <section className="py-20 bg-white text-center">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-[11px] font-bold tracking-widest uppercase text-orange-500 mb-4">Take what&apos;s yours</p>
            <h2 className="text-3xl font-extrabold text-[#1B2B4B] mb-4">Find what you are entitled to today.</h2>
            <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
              Free, private, and open source. Your real benefits journey starts here.
            </p>
            <button
              onClick={handleCheckEligibility}
              disabled={checking}
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-all shadow-lg shadow-orange-400/30 disabled:opacity-70"
            >
              {checking ? "Checking…" : "Check my Schemes"}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </section>
      </main>

      {/* ════ FOOTER ════ */}
      <footer className="bg-gray-50 border-t border-gray-100 pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-1 space-y-4">
              <Link href="/" className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/logo.png" alt="Logo" className="w-7 h-7" />
                <span className="font-bold text-[15px] text-[#1B2B4B]">YojanaSaathi</span>
              </Link>
              <p className="text-gray-400 text-[13px] leading-relaxed">
                An AI-powered tool for government welfare scheme discovery. Privacy-first, open-source.
              </p>
              <div className="flex items-center gap-3">
                {["twitter","github","instagram","linkedin"].map((s) => (
                  <a key={s} href="#" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="2" /></svg>
                  </a>
                ))}
              </div>
            </div>
            {[
              { title: "Product", links: ["How It Works", "Browse Schemes", "Document Vault", "Pricing"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Contact", "Contribute"] },
              { title: "Legal", links: ["Privacy", "Terms", "Security", "Disclaimer"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="font-bold text-[13px] text-gray-900 mb-4">{title}</h4>
                <ul className="space-y-2.5">
                  {links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-[13px] text-gray-400 hover:text-gray-700 transition-colors">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-gray-400">
            <p>© 2025 YojanaSaathi — An AI-powered tool for government welfare scheme discovery. Privacy-first, open-source.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
