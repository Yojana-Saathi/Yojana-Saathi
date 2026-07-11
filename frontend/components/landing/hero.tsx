"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { HeroPanel } from "@/components/landing/hero-panel";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq.matches) return;

      const heroEls = sectionRef.current?.querySelectorAll(".hero-badge, .hero-headline, .hero-subtitle, .hero-cta, .hero-trust");
      if (heroEls?.length) gsap.killTweensOf(heroEls);
      const ctx = gsap.context(() => {
        gsap.fromTo(".hero-badge", { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", clearProps: "all" });
        gsap.fromTo(".hero-headline", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.15, ease: "power2.out", clearProps: "all" });
        gsap.fromTo(".hero-subtitle", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.35, ease: "power2.out", clearProps: "all" });
        gsap.fromTo(".hero-cta", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.5, ease: "power2.out", clearProps: "all", stagger: 0.1 });
        gsap.fromTo(".hero-trust", { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.7, ease: "power2.out", clearProps: "all" });
      }, sectionRef);
      return () => ctx.revert();
    } catch { return; }
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Background ornament — subtle lotus geometry */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] opacity-[0.03]">
        <svg viewBox="0 0 500 500" fill="none" aria-hidden="true">
          <circle cx="250" cy="250" r="200" stroke="#0B1E3D" strokeWidth="2" />
          <circle cx="250" cy="250" r="160" stroke="#0B1E3D" strokeWidth="1.5" strokeDasharray="8 8" />
          <circle cx="250" cy="250" r="240" stroke="#0B1E3D" strokeWidth="1" strokeDasharray="4 12" />
          <path d="M250 50 Q 300 150 250 250 Q 200 150 250 50Z" fill="#F2641A" opacity="0.3" />
          <path d="M250 450 Q 300 350 250 250 Q 200 350 250 450Z" fill="#F2641A" opacity="0.3" />
          <path d="M50 250 Q 150 200 250 250 Q 150 300 50 250Z" fill="#F2641A" opacity="0.3" />
          <path d="M450 250 Q 350 200 250 250 Q 350 300 450 250Z" fill="#F2641A" opacity="0.3" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — text */}
          <div className="flex flex-col justify-center">
            <div className="hero-badge mb-4 inline-flex items-center gap-1.5 rounded-full border border-signal-orange/20 bg-signal-orange/5 px-3 py-1 text-xs font-medium text-signal-orange">
              <span className="h-1.5 w-1.5 rounded-full bg-signal-orange" />
              Open-source civic tech
            </div>

            <h1 className="hero-headline font-display text-4xl font-semibold leading-[1.15] tracking-tight text-ink-navy sm:text-5xl lg:text-6xl">
              Thousands of schemes.
              <br />
              <span className="text-signal-orange">Billions unclaimed.</span>
            </h1>

            <p className="hero-subtitle mt-4 max-w-lg text-base leading-relaxed text-slate-blue sm:text-lg">
              India runs over a thousand welfare schemes across central and state governments.
              Discovery is the barrier — not eligibility. Tell us about yourself once.
              We&apos;ll find every scheme you qualify for.
            </p>

            <div className="hero-cta mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/register" size="lg">
                Find your schemes
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Button>
              <Button href="/schemes" variant="outline" size="lg">
                Browse all schemes
              </Button>
            </div>

            <div className="hero-trust mt-6 flex items-center gap-4 text-xs text-slate-blue-400">
              <span className="flex items-center gap-1">
                <svg className="h-3.5 w-3.5 text-verified-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                No LLM — deterministic
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-3.5 w-3.5 text-verified-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Your data stays private
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-3.5 w-3.5 text-verified-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Open source
              </span>
            </div>
          </div>

          {/* Right — premium eligibility panel */}
          <div className="flex items-center">
            <HeroPanel />
          </div>
        </div>
      </div>
    </section>
  );
}
