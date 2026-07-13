"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const abEls = pageRef.current?.querySelectorAll(".ab-hero, .ab-section, .ab-step");
      if (abEls?.length) gsap.killTweensOf(abEls);
      const ctx = gsap.context(() => {
        gsap.fromTo(".ab-hero", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", clearProps: "all" });
        gsap.fromTo(".ab-section", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, delay: 0.2, ease: "power2.out", clearProps: "all" });
        gsap.fromTo(".ab-step", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.12, delay: 0.35, ease: "power2.out", clearProps: "all" });
      }, pageRef);
      return () => ctx.revert();
    } catch { return; }
  }, []);

  return (
    <div ref={pageRef} className="flex min-h-screen flex-col">
      <main className="flex-1 bg-gradient-to-b from-white to-warm-paper">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="ab-hero text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-signal-orange/20 to-signal-orange/5 ring-1 ring-signal-orange/20 shadow-sm">
              <img src="/assets/logo-bg.png" alt="YojanaSaathi" className="h-full w-full object-contain" loading="lazy" />
            </div>
            <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-ink-navy sm:text-4xl lg:text-5xl">
              About YojanaSaathi
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-blue sm:text-lg max-w-xl mx-auto">
              We built this because discovering what you&apos;re entitled to should not be the hardest part of accessing welfare.
            </p>
          </div>

          <div className="mt-14 space-y-10">
            <section className="ab-section">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-navy">The problem</h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-blue sm:text-base">
                <p>India runs hundreds of welfare schemes across central and state governments — pension support, health coverage, housing subsidies, education scholarships, agricultural assistance. Together they represent billions of rupees in unclaimed benefits each year.</p>
                <p>The barrier is not eligibility — it&apos;s <strong className="font-semibold text-ink-navy">discovery</strong>. Schemes are published across different ministry websites, in different formats, with different application windows. A farmer in Odisha may qualify for PM-KISAN, KALIA, Ayushman Bharat, and a state-specific housing scheme — but has no single place to check all of them at once.</p>
                <p>YojanaSaathi solves that: tell us about yourself once, and we match you against every scheme we have mapped, show you what you qualify for, what documents you need, and help you apply.</p>
              </div>
            </section>

            <section className="ab-section">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-navy">How it works</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-3">
                {[
                  { step: "1", title: "Create your profile", desc: "Enter basic details — age, income, state, occupation. Takes about 2 minutes." },
                  { step: "2", title: "We match you", desc: "Our deterministic rule engine checks every scheme against your profile. No AI black boxes — every result is auditable." },
                  { step: "3", title: "Apply with confidence", desc: "See what you qualify for, what documents you&apos;re missing, and get a pre-filled application draft for each scheme." },
                ].map((item) => (
                  <div key={item.step} className="ab-step rounded-xl border border-ink-navy/10 bg-white p-5 shadow-sm hover:shadow-md transition-all">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-signal-orange/20 to-signal-orange/5 text-sm font-bold text-signal-orange ring-1 ring-signal-orange/20">
                      {item.step}
                    </div>
                    <h3 className="mt-3 font-display text-lg font-semibold text-ink-navy">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-blue">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="ab-section">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-navy">Who built this</h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-blue sm:text-base">
                <p>YojanaSaathi is built by two independent developers as an open-source project under the{" "}
                  <a href="https://github.com/Yojana-Saathi" target="_blank" rel="noopener noreferrer" className="font-medium text-signal-orange underline underline-offset-2">Yojana-Saathi</a>{" "}
                  organization on GitHub. We are not a company, not a startup, and not affiliated with any government.</p>
                <p>Our backgrounds span civic tech, data engineering, and product design. We started this project because we believe that access to welfare information should not depend on which websites you know to visit or which officials you can ask.</p>
                <p>The entire codebase is open-source — you can inspect it, contribute to it, or fork it. We welcome contributions from developers, scheme experts, translators, and anyone who wants to help make welfare discovery easier.</p>
              </div>
            </section>

            <section className="ab-section rounded-xl border border-caution-amber/20 bg-gradient-to-br from-caution-amber/[0.04] to-transparent px-6 py-5">
              <h3 className="font-display text-lg font-semibold text-caution-amber">A note on independence</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-blue">
                YojanaSaathi is <strong>not</strong> a Government of India product. We are not funded by, affiliated with, or endorsed by any government entity. We do not represent any ministry or department. The scheme data we use is sourced from publicly available information published by the respective government authorities. Always verify eligibility and application procedures with the relevant department before applying.
              </p>
            </section>

            <div className="ab-section flex flex-col gap-3 sm:flex-row">
              <Button href="/register" size="lg">
                Check your eligibility
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Button>
              <Button href="/get-involved" variant="outline" size="lg">Get involved</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
