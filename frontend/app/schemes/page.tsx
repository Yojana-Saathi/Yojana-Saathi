"use client";
import { useState } from "react";
import Link from "next/link";
import Sidebar from "../components/Sidebar";

const CATEGORIES = ["All", "Agriculture", "Health", "Housing", "Education", "Women & Child", "Employment"];

const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  Agriculture: { bg: "bg-green-100",  text: "text-green-700" },
  Health:      { bg: "bg-red-100",    text: "text-red-600" },
  Housing:     { bg: "bg-blue-100",   text: "text-blue-700" },
  Education:   { bg: "bg-purple-100", text: "text-purple-700" },
  "Women & Child": { bg: "bg-pink-100", text: "text-pink-700" },
  Employment:  { bg: "bg-yellow-100", text: "text-yellow-700" },
  Other:       { bg: "bg-slate-100",  text: "text-slate-600" },
};

const schemes = [
  {
    id: 1,
    category: "Agriculture",
    match: 99,
    name: "PM-KISAN Samman Nidhi",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    description: "Direct income support of Rs 6,000 per year to small and marginal farmer families.",
    benefit: "₹6,000/year",
  },
  {
    id: 2,
    category: "Health",
    match: 95,
    name: "Ayushman Bharat PM-JAY",
    ministry: "National Health Authority",
    description: "Cashless hospitalization cover of up to Rs 5 lakh per family per year.",
    benefit: "Up to ₹5,00,000",
  },
  {
    id: 3,
    category: "Housing",
    match: 90,
    name: "PM Awas Yojana – Gramin",
    ministry: "Ministry of Rural Development",
    description: "Financial assistance for construction of pucca house in rural areas.",
    benefit: "Up to ₹1,20,000",
  },
  {
    id: 4,
    category: "Education",
    match: 82,
    name: "National Means-cum-Merit Scholarship",
    ministry: "Department of School Education",
    description: "Scholarship of Rs 12,000 per year for meritorious students from economically weaker sections.",
    benefit: "₹12,000/year",
  },
  {
    id: 5,
    category: "Women & Child",
    match: 88,
    name: "Pradhan Mantri Matru Vandana Yojana",
    ministry: "Ministry of Women & Child Development",
    description: "Cash incentive of Rs 5,000 in three instalments to pregnant women and lactating mothers.",
    benefit: "₹5,000",
  },
  {
    id: 6,
    category: "Employment",
    match: 93,
    name: "MGNREGA",
    ministry: "Ministry of Rural Development",
    description: "100 days of guaranteed wage employment in a financial year to every rural household.",
    benefit: "₹24,000/year",
  },
];

export default function SchemesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = schemes.filter((s) => {
    const matchesCat = activeCategory === "All" || s.category === activeCategory;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main */}
      <div className="flex-1 ml-56">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search schemes, documents…"
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 text-gray-700 placeholder-gray-300"
            />
          </div>

          {/* Right: bell + avatar */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">AD</div>
              <div className="hidden sm:block">
                <p className="text-[12px] font-semibold text-gray-800 leading-none">Asha Devi</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Patna, Bihar</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-0.5">Browse schemes</h1>
          <p className="text-gray-400 text-sm mb-6">4,702+ Indian welfare schemes, all in one catalog.</p>

          {/* Search bar */}
          <div className="relative mb-5">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search PM-KISAN, scholarship, pension…"
              className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 text-gray-700 placeholder-gray-300"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-2 flex-wrap mb-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-[#1B2B4B] text-white"
                    : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Scheme grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((scheme) => {
              const style = CATEGORY_STYLES[scheme.category] ?? CATEGORY_STYLES.Other;
              return (
                <div key={scheme.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${style.bg} ${style.text}`}>
                      {scheme.category}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-400">{scheme.match}% match</span>
                  </div>
                  <h3 className="text-[14px] font-bold text-gray-900 mb-1 leading-snug">{scheme.name}</h3>
                  <p className="text-[11px] text-gray-400 mb-2">{scheme.ministry}</p>
                  <p className="text-[12px] text-gray-500 leading-relaxed flex-1">{scheme.description}</p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                    <span className="text-orange-500 font-bold text-[15px]">{scheme.benefit}</span>
                    <Link href={`/scheme-details/${scheme.id}`}
                      className="flex items-center gap-1 text-[12px] font-semibold text-gray-500 hover:text-[#1B2B4B] transition-colors">
                      View details
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="font-medium">No schemes found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
