"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";

// ─── Animated counter hook ────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1.8, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ value, suffix, label, icon, delay }: { value: number; suffix: string; label: string; icon: string; delay: boolean }) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(value, 1.6, inView);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="ab-stat flex flex-col items-center gap-2 rounded-2xl border border-ink-navy/10 bg-white px-6 py-6 shadow-sm text-center">
      <span className="text-2xl">{icon}</span>
      <p className="font-display text-3xl font-bold text-ink-navy">
        {count.toLocaleString()}<span className="text-signal-orange">{suffix}</span>
      </p>
      <p className="text-xs font-medium text-slate-blue uppercase tracking-wide">{label}</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const ctx = gsap.context(() => {
        gsap.fromTo(".ab-hero",    { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", clearProps: "all" });
        gsap.fromTo(".ab-stat",   { opacity: 0, y: 20, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.1, delay: 0.25, ease: "power2.out", clearProps: "all" });
        gsap.fromTo(".ab-section",{ opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.12, delay: 0.35, ease: "power2.out", clearProps: "all" });
      }, pageRef);
      return () => ctx.revert();
    } catch { return; }
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-warm-paper">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0B1E3D] via-[#16365C] to-[#1E487A]">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-16 sm:px-6 sm:pt-20 lg:px-8">
          <div className="ab-hero flex flex-col items-center text-center gap-5">
            {/* Logo badge */}
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/20 shadow-lg backdrop-blur-sm">
              <img src="/assets/logo-bg.png" alt="YojanaSaathi" className="h-full w-full object-contain" loading="lazy" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-300 mb-3">Open Source · MIT License</p>
              <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                About <span className="text-orange-400">YojanaSaathi</span>
              </h1>
              <p className="mt-5 text-base leading-relaxed text-slate-300 max-w-2xl mx-auto sm:text-lg">
                India's welfare discovery platform — matching citizens to the government schemes they qualify for,
                completely free and open source.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
              <a
                href="https://github.com/Yojana-Saathi/Yojana-Saathi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:shadow-lg"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                View on GitHub
              </a>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-600 hover:shadow-orange-500/40"
              >
                Check my eligibility
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats strip ──────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-4 -mt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard value={4700}  suffix="+"  label="Schemes mapped"     icon="📋" delay={false} />
          <StatCard value={10}    suffix="+"  label="States covered"     icon="🗺️" delay={false} />
          <StatCard value={100}   suffix="%"  label="Open source"        icon="🔓" delay={false} />
          <StatCard value={0}     suffix="₹"  label="Cost to citizens"   icon="✅" delay={false} />
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">

        {/* What is it */}
        <section className="ab-section rounded-2xl border border-ink-navy/10 bg-white p-7 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal-orange/10">
              <svg className="h-5 w-5 text-signal-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>
            </div>
            <h2 className="font-display text-xl font-bold text-ink-navy">What is YojanaSaathi?</h2>
          </div>
          <div className="space-y-3 text-sm leading-relaxed text-slate-blue sm:text-base">
            <p>
              India runs hundreds of welfare schemes across central and state governments — pension support, health coverage,
              housing subsidies, education scholarships, agricultural assistance. Together they represent billions of rupees
              in <strong className="text-ink-navy">unclaimed benefits each year</strong>.
            </p>
            <p>
              The barrier isn't eligibility — it's <strong className="text-ink-navy">discovery</strong>. Schemes are scattered
              across different ministry websites, in different formats. A farmer in Odisha may qualify for PM-KISAN, KALIA,
              Ayushman Bharat, and a state housing scheme — but has no single place to find all of them.
            </p>
            <p>
              YojanaSaathi solves that: tell us about yourself once, and we instantly match you against every scheme we've
              mapped — showing you what you qualify for, what documents you need, and helping you apply.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="ab-section">
          <h2 className="font-display text-xl font-bold text-ink-navy mb-4">How it works</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { step: "01", icon: "✏️", title: "Fill your profile", desc: "Enter basic details — age, income, state, occupation. Takes about 2 minutes." },
              { step: "02", icon: "⚡", title: "We match you instantly", desc: "Our rule engine checks every scheme against your profile. No AI black boxes — fully auditable results." },
              { step: "03", icon: "📄", title: "Apply with confidence", desc: "See what you qualify for, which documents are missing, and get a pre-filled application draft." },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-ink-navy/10 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs font-bold text-signal-orange uppercase tracking-widest">{item.step}</span>
                </div>
                <h3 className="font-display text-base font-bold text-ink-navy mb-1">{item.title}</h3>
                <p className="text-sm text-slate-blue leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* GitHub Star CTA */}
        <section className="ab-section relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B1E3D] to-[#16365C] p-8 shadow-xl">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-orange-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-6 bottom-0 h-32 w-32 rounded-full bg-teal-400/10 blur-3xl" />
          <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-orange-300">Support us on GitHub</p>
              </div>
              <h3 className="font-display text-2xl font-bold text-white">Star our repository</h3>
              <p className="mt-2 text-sm text-slate-300 max-w-md">
                A GitHub star is the easiest way to help — it improves our visibility, signals that this project matters,
                and motivates us to keep building.
              </p>
            </div>
            <a
              href="https://github.com/Yojana-Saathi/Yojana-Saathi"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2.5 rounded-xl bg-yellow-400 px-6 py-3 text-sm font-bold text-yellow-900 shadow-lg shadow-yellow-400/20 transition-all hover:bg-yellow-300 hover:shadow-yellow-400/30 hover:-translate-y-0.5"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Star on GitHub
            </a>
          </div>
        </section>

        {/* Who built it */}
        <section className="ab-section rounded-2xl border border-ink-navy/10 bg-white p-7 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-verified-teal/10">
              <svg className="h-5 w-5 text-verified-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
            </div>
            <h2 className="font-display text-xl font-bold text-ink-navy">Who built this?</h2>
          </div>
          <div className="space-y-3 text-sm leading-relaxed text-slate-blue sm:text-base">
            <p>
              YojanaSaathi is built by two independent developers under the{" "}
              <a href="https://github.com/Yojana-Saathi" target="_blank" rel="noopener noreferrer" className="font-semibold text-signal-orange underline underline-offset-2">
                Yojana-Saathi
              </a>{" "}
              organization on GitHub. We are not a company, not a startup, and not affiliated with any government body.
            </p>
            <p>
              We started this because we believe access to welfare information should not depend on which websites you know
              to visit or which officials you can reach. The entire codebase is open-source — inspect it, contribute, or fork it.
            </p>
          </div>
        </section>

        {/* Contribute / Contact */}
        <section className="ab-section rounded-2xl border border-ink-navy/10 bg-white p-7 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal-orange/10">
              <svg className="h-5 w-5 text-signal-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            </div>
            <h2 className="font-display text-xl font-bold text-ink-navy">Contribute or get in touch</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: "🐛",
                title: "Report a bug",
                desc: "Found something broken? Open an issue on GitHub and we'll look into it.",
                href: "https://github.com/Yojana-Saathi/Yojana-Saathi/issues",
                label: "Open an issue →",
              },
              {
                icon: "💬",
                title: "Ask a question",
                desc: "Have ideas or need help? GitHub Discussions is the best place to reach us.",
                href: "https://github.com/Yojana-Saathi/Yojana-Saathi/discussions",
                label: "Start a discussion →",
              },
              {
                icon: "🛠️",
                title: "Contribute code",
                desc: "We welcome PRs — add schemes, fix bugs, improve the UI, or translate content.",
                href: "https://github.com/Yojana-Saathi/Yojana-Saathi/blob/main/CONTRIBUTING.md",
                label: "Read CONTRIBUTING.md →",
              },
              {
                icon: "🏷️",
                title: "Good first issues",
                desc: "New to the codebase? We tag beginner-friendly issues to help you get started.",
                href: "https://github.com/Yojana-Saathi/Yojana-Saathi/issues?q=label%3A%22good+first+issue%22",
                label: "Browse good first issues →",
              },
            ].map((item) => (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-2 rounded-xl border border-ink-navy/8 bg-warm-paper p-5 transition-all hover:border-signal-orange/30 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <h3 className="font-semibold text-sm text-ink-navy group-hover:text-signal-orange transition-colors">{item.title}</h3>
                </div>
                <p className="text-xs text-slate-blue leading-relaxed">{item.desc}</p>
                <span className="mt-auto text-xs font-semibold text-signal-orange">{item.label}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="ab-section rounded-xl border border-caution-amber/25 bg-gradient-to-br from-caution-amber/[0.05] to-transparent px-6 py-5">
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-caution-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
            <p className="text-xs leading-relaxed text-slate-blue">
              <strong className="text-caution-amber">Not a Government product.</strong>{" "}
              YojanaSaathi is not funded by, affiliated with, or endorsed by any government entity. Scheme data is sourced
              from publicly available government publications. Always verify eligibility and application procedures with the
              relevant department before applying.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
