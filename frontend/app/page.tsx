"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "./lib/supabaseClient";

const profileFields = [
  { icon: "person", label: "Age" },
  { icon: "work", label: "Occupation" },
  { icon: "location_on", label: "State" },
  { icon: "payments", label: "Income" },
  { icon: "category", label: "Category" },
];

const scanSteps = [
  { label: "Checking Eligibility Rules", state: "done" },
  { label: "Verifying Documents", state: "done" },
  { label: "Matching Benefits", state: "active" },
  { label: "Finalizing Results", state: "pending" },
];

const matchingSchemes = [
  {
    icon: "agriculture",
    iconClass: "bg-green-50 text-green-600",
    title: "PM-KISAN",
    subtitle: "Farmer Income Support",
    amount: "\u20B96,000 / year",
    amountClass: "text-green-600",
  },
  {
    icon: "medical_services",
    iconClass: "bg-rose-50 text-rose-500",
    title: "Ayushman Bharat",
    subtitle: "Health Coverage",
    amount: "Up to \u20B95 Lakh",
    amountClass: "text-orange-500",
  },
  {
    icon: "school",
    iconClass: "bg-indigo-50 text-indigo-500",
    title: "National Scholarship",
    subtitle: "Education Support",
    amount: "Up to \u20B975,000",
    amountClass: "text-orange-500",
  },
  {
    icon: "home",
    iconClass: "bg-orange-50 text-orange-500",
    title: "PM Awas Yojana",
    subtitle: "Housing Assistance",
    amount: "Up to \u20B91,20,000",
    amountClass: "text-orange-500",
  },
];

const stats = [
  { icon: "description", value: "4,702+", label: "Government\nSchemes" },
  { icon: "groups", value: "28", label: "States & UTs\nCovered" },
  { icon: "check_circle", value: "95%+", label: "Match\nAccuracy" },
  { icon: "shield", value: "100%", label: "Private &\nSecure" },
];

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  async function handleCheckEligibility() {
    setChecking(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }

    setChecking(false);
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 py-3 shadow-sm backdrop-blur-md">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link className="group flex items-center gap-2" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/logo.png"
              alt="Yojana Saarthi Logo"
              width={34}
              height={34}
              className="transition-transform group-hover:scale-105"
            />
            <span className="text-xl font-bold tracking-tight text-[#1B2B4B]">Yojana Saarthi</span>
          </Link>

          <nav className="hidden items-center gap-8 font-medium text-gray-500 md:flex">
            <Link className="text-sm transition-colors hover:text-orange-500" href="/schemes">
              Schemes
            </Link>
            <Link className="text-sm transition-colors hover:text-orange-500" href="/dashboard">
              Eligibility
            </Link>
            <Link className="text-sm transition-colors hover:text-orange-500" href="/login">
              Sign In
            </Link>
            <Link className="text-sm transition-colors hover:text-orange-500" href="/register">
              Register
            </Link>
          </nav>

          <button
            onClick={handleCheckEligibility}
            disabled={checking}
            className="hidden items-center justify-center rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-colors hover:bg-orange-600 disabled:opacity-70 md:inline-flex"
          >
            {checking ? "Checking..." : "Check Eligibility"}
          </button>

          <button className="p-2 text-gray-600 md:hidden" aria-label="Open navigation">
            <span className="material-symbols-outlined text-[28px]">menu</span>
          </button>
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden bg-[#f7fbff]">
          <video
            className="absolute inset-0 -z-20 h-full w-full object-cover object-[55%_center]"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          >
            <source src="/media/loop.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white/92 via-white/58 to-white/76" />
          <div className="absolute inset-x-0 top-0 -z-10 h-44 bg-gradient-to-b from-white/80 to-transparent" />

          <div className="mx-auto grid min-h-[calc(100vh-65px)] w-full max-w-[1440px] grid-cols-1 items-center gap-9 px-5 pb-10 pt-9 sm:px-8 sm:pt-12 lg:px-12 xl:grid-cols-[minmax(0,0.92fr)_minmax(420px,0.72fr)] xl:gap-12 xl:pb-12 xl:pt-12 2xl:gap-16">
            <div className="relative z-20 flex flex-col justify-center">
              <div className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-orange-200 bg-white/75 px-3 py-1.5 shadow-sm backdrop-blur">
                <span className="material-symbols-outlined text-[17px] text-orange-500">verified_user</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange-500 sm:text-[11px] sm:tracking-[0.2em]">
                  AI-Powered <span className="mx-1">{"\u2022"}</span> Open Source{" "}
                  <span className="mx-1">{"\u2022"}</span> For Every Citizen
                </span>
              </div>

              <h1 className="mt-6 max-w-[760px] text-[44px] font-extrabold leading-[1.04] text-[#142447] sm:text-6xl lg:text-[78px] xl:mt-5 xl:text-[76px]">
                Unlock Your
                <br />
                Right to
                <br />
                <span className="text-orange-500">Benefits</span>
              </h1>

              <p className="mt-6 max-w-[520px] text-base leading-relaxed text-gray-600 sm:text-lg xl:mt-5">
                We scan <span className="font-bold text-orange-500">4,702+</span> government schemes using
                advanced AI reasoning to find every benefit you are eligible for.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4 xl:mt-7">
                <button
                  onClick={handleCheckEligibility}
                  disabled={checking}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-orange-400/30 transition-all hover:bg-orange-600 active:scale-95 disabled:opacity-70 sm:px-7 sm:py-3.5"
                >
                  {checking ? "Checking..." : "Check Eligibility Now"}
                  <span className="material-symbols-outlined text-[19px]">arrow_forward</span>
                </button>
                <a
                  href="#how-it-works"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-white/88 px-5 py-3 text-sm font-bold text-[#1B2B4B] shadow-sm ring-1 ring-gray-100 transition-colors hover:text-orange-500 sm:px-6 sm:py-3.5"
                >
                  How It Works
                </a>
              </div>

              <div className="mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:mt-11 sm:grid-cols-4 xl:mt-9">
                {stats.map((stat) => (
                  <div key={stat.value} className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <span className="material-symbols-outlined flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/90 text-[24px] text-[#1B2B4B] shadow-sm ring-1 ring-gray-100 sm:h-12 sm:w-12 sm:text-[25px]">
                      {stat.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xl font-extrabold leading-none text-[#142447] sm:text-2xl">
                        {stat.value}
                      </span>
                      <span className="mt-1 block whitespace-pre-line text-[12px] leading-tight text-gray-600">
                        {stat.label}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-10 flex justify-center xl:mt-0 xl:justify-end">
              <div className="w-full max-w-[520px] rounded-[26px] border border-white/80 bg-white/78 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-xl sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-500">
                      Eligibility Preview
                    </p>
                    <h2 className="mt-1 text-xl font-extrabold text-[#142447]">Find matches in minutes</h2>
                  </div>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600 ring-1 ring-green-100">
                    Live scan
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2.5">
                  {profileFields.map((field) => (
                    <div
                      key={field.label}
                      className="flex min-h-11 items-center gap-2 rounded-xl border border-gray-100 bg-white/82 px-3 text-xs font-semibold text-[#1B2B4B] shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[17px] text-orange-500">{field.icon}</span>
                      <span>{field.label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-2xl border border-gray-100 bg-white/74 p-4">
                    <p className="text-sm font-extrabold text-[#142447]">Scanning 4,702+ schemes</p>
                    <div className="mt-3 space-y-2.5">
                      {scanSteps.map((step) => (
                        <div key={step.label} className="flex items-center gap-3 text-xs font-semibold">
                          {step.state === "done" ? (
                            <span className="material-symbols-outlined filled text-[18px] text-green-500">
                              check_circle
                            </span>
                          ) : step.state === "active" ? (
                            <span className="h-[18px] w-[18px] rounded-full border-2 border-orange-400 border-t-transparent motion-safe:animate-spin" />
                          ) : (
                            <span className="h-[18px] w-[18px] rounded-full border border-gray-200" />
                          )}
                          <span
                            className={
                              step.state === "active"
                                ? "text-orange-500"
                                : step.state === "done"
                                  ? "text-gray-700"
                                  : "text-gray-400"
                            }
                          >
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-orange-500">
                      Matching Schemes
                    </p>
                    <div className="grid gap-2.5 2xl:grid-cols-2">
                      {matchingSchemes.map((scheme, index) => (
                        <div
                          key={scheme.title}
                          className={`flex min-h-[78px] items-center gap-3 rounded-2xl border border-gray-100 bg-white/84 px-3 py-2.5 shadow-sm ${
                            index > 1 ? "hidden sm:flex" : ""
                          }`}
                        >
                          <span
                            className={`material-symbols-outlined filled flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[23px] ${scheme.iconClass}`}
                          >
                            {scheme.icon}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[13px] font-extrabold leading-tight text-[#142447]">
                              {scheme.title}
                            </span>
                            <span className="mt-0.5 block truncate text-xs text-gray-500">{scheme.subtitle}</span>
                            <span className={`mt-1 block truncate text-[13px] font-extrabold ${scheme.amountClass}`}>
                              {scheme.amount}
                            </span>
                          </span>
                          <span className="material-symbols-outlined filled shrink-0 text-[20px] text-green-500">
                            check_circle
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-24" id="how-it-works">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-orange-500">The Real Challenge</h3>
                <h2 className="mb-6 text-4xl font-bold leading-tight text-[#1B2B4B]">
                  Why Finding the Right Scheme is So Hard
                </h2>
                <p className="text-lg leading-relaxed text-gray-600">
                  With 4,700+ schemes, complex rules, and endless paperwork, most eligible benefits go unclaimed.
                  It doesn&apos;t have to be this way.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  {
                    bg: "bg-red-50",
                    border: "border-red-100",
                    iconBg: "bg-red-100",
                    iconColor: "text-red-600",
                    icon: "warning",
                    title: "Too Much Information",
                    desc: "Sifting through bureaucratic pages to figure out if you qualify.",
                  },
                  {
                    bg: "bg-orange-50",
                    border: "border-orange-100",
                    iconBg: "bg-orange-100",
                    iconColor: "text-orange-500",
                    icon: "search",
                    title: "Irrelevant Results",
                    desc: "Search results returning hundreds of irrelevant schemes.",
                  },
                  {
                    bg: "bg-blue-50/50",
                    border: "border-blue-100",
                    iconBg: "bg-blue-100",
                    iconColor: "text-blue-600",
                    icon: "schedule",
                    title: "Wasted Time & Resources",
                    desc: "Applying blindly and hoping for the best.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className={`flex items-start rounded-2xl border p-6 transition-transform hover:-translate-y-1 ${item.bg} ${item.border}`}
                  >
                    <div
                      className={`mr-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${item.iconBg}`}
                    >
                      <span className={`material-symbols-outlined text-[27px] ${item.iconColor}`}>{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="mb-1 text-xl font-bold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-24">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col gap-16 lg:flex-row">
              <div className="lg:w-1/3">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-orange-500">Why Yojana Saarthi</h3>
                <h2 className="mb-6 text-4xl font-bold leading-tight text-[#1B2B4B]">
                  Clarity.
                  <br />
                  Accuracy.
                  <br />
                  Personalization.
                </h2>
                <p className="mb-6 leading-relaxed text-gray-600">
                  Yojana Saarthi cuts through the noise with AI-driven reasoning and personalized matching tailored
                  specifically for you.
                </p>
                <Link
                  className="group inline-flex items-center font-semibold text-[#1B2B4B] transition-colors hover:text-orange-500"
                  href="/schemes"
                >
                  Explore Schemes
                  <span className="material-symbols-outlined ml-2 text-[19px] transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:w-2/3">
                {[
                  {
                    bg: "bg-white",
                    icon: "precision_manufacturing",
                    title: "AI-Driven Accuracy",
                    desc: "Advanced AI understands complex eligibility rules and cross-verifies thousands of criteria.",
                  },
                  {
                    bg: "bg-blue-50",
                    icon: "person_search",
                    title: "Personalized for You",
                    desc: "Matches are tailored to your demographic, financial, and personal profile.",
                  },
                  {
                    bg: "bg-white",
                    icon: "fact_check",
                    title: "Transparent Reasoning",
                    desc: "Clear reasons for every match, so you always know why you are eligible.",
                  },
                ].map((item) => (
                  <div key={item.title}>
                    <div
                      className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-100 shadow-sm ${item.bg}`}
                    >
                      <span className="material-symbols-outlined text-[34px] text-[#1B2B4B]">{item.icon}</span>
                    </div>
                    <h4 className="mb-3 text-xl font-bold text-gray-900">{item.title}</h4>
                    <p className="text-sm leading-relaxed text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#1B2B4B] pb-8 pt-16 text-white">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-4">
            <div className="md:col-span-1">
              <Link className="mb-4 flex items-center gap-2" href="/">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/logo.png" alt="Yojana Saarthi Logo" width={28} height={28} />
                <span className="text-xl font-bold tracking-tight">Yojana Saarthi</span>
              </Link>
              <p className="text-sm leading-relaxed text-gray-400">
                An AI-powered eligibility initiative empowering every citizen to access the benefits they deserve.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-bold text-white">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link className="transition-colors hover:text-orange-500" href="/schemes">
                    Schemes
                  </Link>
                </li>
                <li>
                  <Link className="transition-colors hover:text-orange-500" href="/dashboard">
                    Eligibility Check
                  </Link>
                </li>
                <li>
                  <Link className="transition-colors hover:text-orange-500" href="/login">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link className="transition-colors hover:text-orange-500" href="/register">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-bold text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a className="transition-colors hover:text-orange-500" href="#">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a className="transition-colors hover:text-orange-500" href="#">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a className="transition-colors hover:text-orange-500" href="#">
                    Accessibility
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-bold text-white">Connect</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  info@yojanasaarthi.in
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  1800-123-4567
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-500">
            &copy; 2025 Yojana Saarthi. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
