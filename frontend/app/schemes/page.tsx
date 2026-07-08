"use client";
import { useState } from "react";
import Link from "next/link";

const categories = [
  { id: "all", label: "All Categories", icon: "⊞" },
  { id: "education", label: "Education", icon: "🎓" },
  { id: "health", label: "Healthcare", icon: "❤️" },
  { id: "business", label: "Business", icon: "💼" },
  { id: "agriculture", label: "Agriculture", icon: "🌿" },
  { id: "housing", label: "Housing", icon: "🏠" },
  { id: "welfare", label: "Social Welfare", icon: "👥" },
];

const schemes = [
  {
    id: "nsp-001",
    category: "Education",
    categoryColor: "text-orange-500",
    iconBg: "bg-orange-100",
    icon: "🎓",
    name: "National Scholarship Portal",
    description: "Financial assistance for students from minority communities pursuing higher education.",
    link: "#",
    linkColor: "text-orange-500 hover:text-orange-600",
  },
  {
    id: "nsp-002",
    category: "Education",
    categoryColor: "text-orange-500",
    iconBg: "bg-orange-100",
    icon: "📖",
    name: "National Scholarship Portal",
    description: "Financial assistance for students from minority communities pursuing higher education.",
    link: "#",
    linkColor: "text-orange-500 hover:text-orange-600",
  },
  {
    id: "nhc-003",
    category: "Business",
    categoryColor: "text-purple-500",
    iconBg: "bg-purple-100",
    icon: "💼",
    name: "National Healthcare Committee",
    description: "Financial assistance for students from minority communities pursuing higher education.",
    link: "#",
    linkColor: "text-purple-500 hover:text-purple-600",
  },
  {
    id: "agr-004",
    category: "Agriculture",
    categoryColor: "text-green-600",
    iconBg: "bg-green-100",
    icon: "🌿",
    name: "National Healthcare Seemnary Portal",
    description: "Financial assistance for rural farming communities across Maharashtra.",
    link: "#",
    linkColor: "text-green-600 hover:text-green-700",
  },
  {
    id: "hou-005",
    category: "Housing",
    categoryColor: "text-blue-500",
    iconBg: "bg-blue-100",
    icon: "🏠",
    name: "Government Housing Scheme",
    description: "Affordable housing solutions for economically weaker sections under PMAY.",
    link: "#",
    linkColor: "text-blue-500 hover:text-blue-600",
  },
  {
    id: "sw-006",
    category: "Social Welfare",
    categoryColor: "text-yellow-600",
    iconBg: "bg-yellow-100",
    icon: "👥",
    name: "Ayushman Bharat Yojana",
    description: "Health cover of ₹5 lakh per family per year for secondary and tertiary care.",
    link: "#",
    linkColor: "text-yellow-600 hover:text-yellow-700",
  },
];

export default function Schemes() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/logo.png" alt="Yojana Saarthi" width={32} height={32} />
            <span className="font-bold text-navy-900 text-lg">Yojana Saarthi</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-navy-900 transition-colors">Home</Link>
            <Link href="/schemes" className="text-orange-500 font-semibold">Schemes</Link>
            <Link href="/dashboard" className="hover:text-navy-900 transition-colors">Eligibility</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-navy-900 transition-colors">Sign In</Link>
            <Link href="/register" className="text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-full transition-colors">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white pt-14 pb-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 space-y-6">
            <p className="text-orange-500 font-bold tracking-widest text-xs uppercase">Find the right scheme for you</p>
            <h1 className="text-4xl md:text-5xl font-bold text-navy-900 leading-tight">
              Explore Government<br />
              <span className="text-orange-500">Schemes</span>
            </h1>
            <p className="text-slate-500 text-base leading-relaxed max-w-md">
              Search and discover 1000+ government schemes tailored to your needs.
            </p>
            {/* Search Bar */}
            <div className="flex items-center gap-0 max-w-lg">
              <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-l-xl px-4 py-3.5 shadow-sm focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-400/20 transition-all">
                <svg className="w-4 h-4 text-slate-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <input
                  type="text"
                  placeholder="Search government schemes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-sm text-navy-900 placeholder-slate-400 focus:outline-none"
                />
              </div>
              <button className="bg-navy-900 hover:bg-navy-800 text-white px-5 py-3.5 rounded-r-xl transition-colors flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Graphic — full SVG scene */}
          <div className="w-full lg:w-1/2 relative h-80 lg:h-[420px] flex-shrink-0">
            <svg viewBox="0 0 560 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">

              {/* ── Organic wave blob background ── */}
              <path d="M 540 10 C 560 60 565 140 540 210 C 515 285 460 340 390 375 C 320 408 230 415 170 390 C 110 365 90 310 120 260 C 150 210 215 195 240 150 C 265 105 240 50 285 25 C 330 0 400 -10 450 5 Z" fill="#FEF0E6"/>

              {/* ── Wave decoration (bottom-right) ── */}
              <path d="M 360 390 Q 390 375 420 390 Q 450 405 480 390 Q 510 375 540 390" stroke="#E8C9A8" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M 370 405 Q 400 390 430 405 Q 460 420 490 405" stroke="#E8C9A8" strokeWidth="2" strokeLinecap="round" fill="none"/>

              {/* ── Dotted concentric arcs around search circle (center ~330,200) ── */}
              <circle cx="330" cy="200" r="80"  stroke="#D9BFA8" strokeWidth="1.5" strokeDasharray="5 8" fill="none"/>
              <circle cx="330" cy="200" r="138" stroke="#D9BFA8" strokeWidth="1.2" strokeDasharray="4 10" fill="none"/>
              <circle cx="330" cy="200" r="196" stroke="#D9BFA8" strokeWidth="1"   strokeDasharray="3 12" fill="none"/>

              {/* ── Central large search circle ── */}
              <circle cx="330" cy="200" r="62" fill="#1B2B4B"/>
              {/* Search icon */}
              <circle cx="323" cy="192" r="20" stroke="white" strokeWidth="5" fill="none"/>
              <line x1="338" y1="207" x2="352" y2="221" stroke="white" strokeWidth="5" strokeLinecap="round"/>

              {/* ── Flat SVG category icons ── */}

              {/* Education — orange graduation cap — top center */}
              <g transform="translate(300, 60)">
                <rect width="48" height="48" rx="12" fill="#FEF0E6"/>
                <polygon points="24,10 40,19 24,28 8,19" fill="#F5842B"/>
                <path d="M16 23 L16 33 Q24 38 32 33 L32 23" fill="#F5842B"/>
                <rect x="38" y="18" width="3" height="10" rx="1.5" fill="#F5842B"/>
              </g>

              {/* Housing — blue house — top right */}
              <g transform="translate(440, 80)">
                <rect width="44" height="44" rx="11" fill="#EFF6FF"/>
                <polygon points="22,8 38,20 38,36 6,36 6,20" fill="#3B82F6"/>
                <polygon points="22,8 6,20 38,20" fill="#60A5FA"/>
                <rect x="17" y="26" width="10" height="10" rx="2" fill="white"/>
              </g>

              {/* Business — purple briefcase — far right */}
              <g transform="translate(490, 170)">
                <rect width="44" height="44" rx="11" fill="#F5F3FF"/>
                <rect x="9" y="18" width="26" height="18" rx="3" fill="#7C3AED"/>
                <rect x="16" y="14" width="12" height="6" rx="2" fill="#7C3AED"/>
                <line x1="9" y1="26" x2="35" y2="26" stroke="#C4B5FD" strokeWidth="2"/>
                <line x1="22" y1="18" x2="22" y2="36" stroke="#C4B5FD" strokeWidth="2"/>
              </g>

              {/* Healthcare — red heart — left */}
              <g transform="translate(148, 180)">
                <rect width="44" height="44" rx="11" fill="#FFF1F2"/>
                <path d="M22 34 C22 34 8 25 8 16 C8 11 12 8 16 8 C19 8 22 11 22 11 C22 11 25 8 28 8 C32 8 36 11 36 16 C36 25 22 34 22 34Z" fill="#F43F5E"/>
              </g>

              {/* Social Welfare — people — right */}
              <g transform="translate(482, 270)">
                <rect width="44" height="44" rx="11" fill="#FFFBEB"/>
                <circle cx="15" cy="16" r="6" fill="#F59E0B"/>
                <path d="M5 38 Q5 27 15 27 Q25 27 25 38" fill="#F59E0B"/>
                <circle cx="29" cy="16" r="6" fill="#FBBF24"/>
                <path d="M19 38 Q19 27 29 27 Q39 27 39 38" fill="#FBBF24"/>
              </g>

              {/* Agriculture — leaf — bottom */}
              <g transform="translate(280, 330)">
                <rect width="44" height="44" rx="11" fill="#F0FDF4"/>
                <path d="M22 36 C22 36 22 22 22 18 C22 12 14 8 10 10 C8 18 12 28 22 36Z" fill="#22C55E"/>
                <path d="M22 36 C22 36 22 22 22 18 C22 12 30 8 34 10 C36 18 32 28 22 36Z" fill="#16A34A"/>
              </g>

            </svg>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="border-y border-slate-100 bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-2 w-max">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                  activeCategory === cat.id
                    ? "bg-navy-900 text-white border-navy-900 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:text-orange-500"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">

          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-7 sticky top-36">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
                <h2 className="font-bold text-navy-900">Filter Results</h2>
              </div>

              {/* State */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-navy-900">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                  State
                </label>
                <select className="w-full text-sm border border-slate-200 rounded-lg py-2.5 pl-3 pr-8 text-slate-600 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none bg-white">
                  <option>Select State</option>
                  <option>Maharashtra</option>
                  <option>Karnataka</option>
                  <option>Delhi</option>
                  <option>Bihar</option>
                  <option>Uttar Pradesh</option>
                </select>
              </div>

              {/* Age */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-navy-900">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                  Age
                </label>
                <input type="range" min="0" max="100" defaultValue="25" className="range-slider w-full" />
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                  <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
                </div>
              </div>

              {/* Income Bracket */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-navy-900">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                  Income Bracket
                </label>
                <div className="space-y-2">
                  {["Up to ₹5,000", "₹5,001 – ₹30,000", "₹30,001 – ₹90,000", "Unknown"].map((opt, i) => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                      <input type="radio" name="income" defaultChecked={i === 0} className="w-4 h-4 accent-navy-900" />
                      <span className="text-sm text-slate-600 group-hover:text-navy-900 transition-colors">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="w-full py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-grow">
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-600 text-sm">
                Showing <span className="font-bold text-navy-900">1–8</span> of <span className="font-bold text-navy-900">1,200+</span> schemes
              </p>
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500 whitespace-nowrap">Sort by:</label>
                <select className="text-sm border border-slate-200 rounded-lg py-1.5 pl-3 pr-8 text-slate-600 focus:border-orange-400 focus:outline-none bg-white">
                  <option>Relevance</option>
                  <option>Newest</option>
                  <option>Popular</option>
                </select>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {schemes.map((scheme) => (
                <div key={scheme.id} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col gap-3">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full ${scheme.iconBg} flex items-center justify-center text-xl flex-shrink-0`}>
                      {scheme.icon}
                    </div>
                    <div className="min-w-0">
                      <span className={`text-xs font-bold ${scheme.categoryColor}`}>{scheme.category}</span>
                      <h3 className="font-bold text-navy-900 text-sm leading-snug mt-0.5">{scheme.name}</h3>
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">{scheme.description}</p>
                  <Link href={scheme.link} className={`text-xs font-semibold ${scheme.linkColor} flex items-center gap-1 mt-auto transition-colors`}>
                    View Details
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-10 flex justify-center">
              <nav className="flex items-center gap-1">
                <button className="w-9 h-9 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                </button>
                {[1, 2, 3].map((p) => (
                  <button key={p} className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${p === 1 ? "bg-navy-900 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{p}</button>
                ))}
                <span className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm">…</span>
                <button className="w-9 h-9 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
