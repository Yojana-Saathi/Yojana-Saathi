"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { searchSchemes, type Scheme } from "@/lib/api";

const categories = ["All", "Agriculture", "Housing", "Health", "Education", "Pension", "Women & Child"];

const categoryColors: Record<string, string> = {
  Agriculture: "bg-verified-teal/10 text-verified-teal border-verified-teal/20",
  Housing: "bg-signal-orange/10 text-signal-orange border-signal-orange/20",
  Health: "bg-caution-amber/10 text-caution-amber border-caution-amber/20",
  Education: "bg-[#E8A63D]/10 text-[#E8A63D] border-[#E8A63D]/20",
  Pension: "bg-ink-navy/10 text-ink-navy border-ink-navy/20",
  "Women & Child": "bg-[#E8A63D]/10 text-[#E8A63D] border-[#E8A63D]/20",
};

export default function SchemesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    searchSchemes()
      .then(setSchemes)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    try {
      const scEls = pageRef.current?.querySelectorAll(".sc-hero, .sc-filter, .sc-card");
      if (scEls?.length) gsap.killTweensOf(scEls);
      const ctx = gsap.context(() => {
        gsap.fromTo(".sc-hero", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", clearProps: "all" });
        gsap.fromTo(".sc-filter", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, delay: 0.15, ease: "power2.out", clearProps: "all" });
        gsap.fromTo(".sc-card", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, delay: 0.25, ease: "power2.out", clearProps: "all" });
      }, pageRef);
      return () => ctx.revert();
    } catch { return; }
  }, [schemes]);

  const filtered = schemes.filter((s) => {
    const matchSearch = !search || s.scheme_name.toLowerCase().includes(search.toLowerCase()) || s.benefit_summary.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || s.scheme_category === category;
    return matchSearch && matchCat;
  });

  return (
    <div ref={pageRef} className="flex min-h-screen flex-col">
      <Navbar />
      <main className="relative flex-1 overflow-hidden bg-gradient-to-b from-white to-warm-paper">
        <img
          src="/labour2.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-0"
          style={{ right: "-2%", height: "500px", opacity: "0.15" }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="sc-hero text-center">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-navy sm:text-4xl">Browse schemes</h1>
            <p className="mt-2 text-base text-slate-blue">
              {loading ? "Loading…" : `${schemes.length} schemes mapped by the YojanaSaathi community`}
            </p>
          </div>

          <div className="sc-filter mx-auto mt-8 max-w-xl">
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search schemes by name, category, or state..."
                className="w-full rounded-xl border-2 border-ink-navy/10 bg-white py-3 pl-11 pr-4 text-sm text-ink-navy placeholder:text-slate-blue-300 focus:border-signal-orange focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="sc-filter mt-6 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all",
                  cat === category ? "bg-ink-navy text-white shadow-sm" : "bg-white text-slate-blue hover:bg-ink-navy/5 hover:text-ink-navy border border-ink-navy/10"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="mt-12 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-navy/10 border-t-signal-orange mx-auto" />
            </div>
          ) : filtered.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((s) => (
                <Link
                  key={s.scheme_id}
                  href={`/schemes/${s.scheme_id}`}
                  className={cn(
                    "sc-card group rounded-xl border border-ink-navy/10 bg-white p-5 transition-all hover:border-ink-navy/20 hover:shadow-md"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span className={cn("rounded-md border px-2 py-0.5 text-xs font-medium", categoryColors[s.scheme_category] || "bg-ink-navy/10 text-ink-navy")}>
                      {s.scheme_category}
                    </span>
                    <span className="text-xs text-slate-blue-400">{s.issuing_authority}</span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold text-ink-navy group-hover:text-signal-orange transition-colors">{s.scheme_name}</h3>
                  <p className="mt-1 text-sm text-slate-blue">{s.benefit_summary}</p>
                  <p className="mt-2 text-xs font-medium text-verified-teal">{s.benefit_value_estimate}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="sc-card mt-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-navy/5">
                <svg className="h-7 w-7 text-slate-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              </div>
              <p className="mt-4 text-sm font-medium text-ink-navy">No schemes found</p>
              <p className="text-sm text-slate-blue-400">Try adjusting your search or filter.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
