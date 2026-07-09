"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "./lib/supabaseClient";

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  async function handleCheckEligibility() {
    setChecking(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
    setChecking(false);
  }


  return (
    <>
      {/* BEGIN: Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm py-4">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl flex items-center justify-between">
          {/* Logo */}
          <Link className="flex items-center gap-2 group" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/logo.png" alt="Yojana Saarthi Logo" width={36} height={36} className="group-hover:scale-105 transition-transform" />
            <span className="text-xl font-bold tracking-tight text-navy-900">Yojana Saarthi</span>
          </Link>
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-gray-600">
            <Link className="hover:text-orange-500 transition-colors" href="/schemes">Schemes</Link>
            <Link className="hover:text-orange-500 transition-colors" href="/dashboard">Eligibility</Link>
            <Link className="hover:text-orange-500 transition-colors" href="/login">Sign In</Link>
            <Link className="hover:text-orange-500 transition-colors" href="/register">Register</Link>
          </nav>
          {/* CTA */}
          <button
            onClick={handleCheckEligibility}
            disabled={checking}
            className="hidden md:inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20 disabled:opacity-70"
          >
            {checking ? "Checking..." : "Check Eligibility"}
          </button>
          {/* Mobile Menu Button (Hidden on Desktop) */}
          <button className="md:hidden p-2 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          </button>
        </div>
      </header>
      {/* END: Header */}

      <main>
        {/* BEGIN: Hero Section */}
        <section className="relative pt-16 pb-24 overflow-hidden bg-navy-50">
          <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Hero Content */}
              <div className="max-w-xl">
                <h1 className="text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
                  <span className="text-navy-900 block">Unlock Your</span>
                  <span className="text-orange-500 block">Right</span>
                  <span className="text-navy-900 block">to Benefits</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Navigate the complexity of government schemes with confidence. Yojana Saarthi, advanced eligibility reasoning—ensuring you never miss out on what you deserve.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleCheckEligibility}
                    disabled={checking}
                    className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 group disabled:opacity-70"
                  >
                    {checking ? "Checking..." : "Check Eligibility Now"}
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  </button>
                  <a className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-navy-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors" href="#">
                    How It Works
                  </a>
                </div>
              </div>
              {/* Hero Graphic */}
              <div className="relative w-full h-[500px] flex items-center justify-center">
                {/* Simplified CSS representation of the graphic */}
                <div className="absolute inset-0 dotted-path opacity-20"></div>
                {/* Central Lotus (CSS Drawing Placeholder) */}
                <div className="relative z-10 w-64 h-64">
                  <svg className="w-full h-full text-navy-900 drop-shadow-xl" fill="currentColor" viewBox="0 0 100 100">
                    {/* Petals */}
                    <path d="M50 10 C30 30, 20 60, 50 80 C80 60, 70 30, 50 10" fill="#F5842B"></path>
                    <path d="M50 80 C20 70, 10 40, 30 20 C40 40, 45 60, 50 80" fill="#1B2B4B"></path>
                    <path d="M50 80 C80 70, 90 40, 70 20 C60 40, 55 60, 50 80" fill="#1B2B4B"></path>
                    {/* Connecting nodes */}
                    <circle cx="50" cy="50" fill="#fff" r="4"></circle>
                    <circle cx="40" cy="65" fill="#fff" r="3"></circle>
                    <circle cx="60" cy="65" fill="#fff" r="3"></circle>
                    <line stroke="#fff" strokeWidth="1.5" x1="50" x2="40" y1="50" y2="65"></line>
                    <line stroke="#fff" strokeWidth="1.5" x1="50" x2="60" y1="50" y2="65"></line>
                  </svg>
                </div>
                {/* Floating Icons */}
                <div className="absolute top-10 left-10 p-3 bg-white rounded-xl shadow-lg border border-gray-100 animate-bounce" style={{ animationDuration: '3s' }}>
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </div>
                <div className="absolute top-4 right-20 p-3 bg-white rounded-xl shadow-lg border border-gray-100 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </div>
                <div className="absolute bottom-20 left-4 p-3 bg-white rounded-xl shadow-lg border border-gray-100 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </div>
                <div className="absolute bottom-10 right-10 p-3 bg-white rounded-xl shadow-lg border border-gray-100 animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}>
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END: Hero Section */}
        {/* BEGIN: Pain Points Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Text */}
              <div>
                <h3 className="text-orange-500 font-bold uppercase tracking-wider text-sm mb-3">The Real Challenge</h3>
                <h2 className="text-4xl font-bold text-navy-900 mb-6 leading-tight">Why Finding the Right Scheme is So Hard</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  With 4,700+ schemes, complex rules, and endless paperwork, most eligible benefits go unclaimed. It doesn&apos;t have to be this way.
                </p>
              </div>
              {/* Right Cards */}
              <div className="space-y-4">
                {/* Card 1 */}
                <div className="flex items-start p-6 bg-red-50/50 rounded-2xl shadow-soft border border-red-100 transition-transform hover:-translate-y-1">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-5">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Too Much Information</h4>
                    <p className="text-gray-600">Sifting through bureaucratic overwhelming pages to figure if you qualify.</p>
                  </div>
                </div>
                {/* Card 2 */}
                <div className="flex items-start p-6 bg-orange-50 rounded-2xl shadow-soft border border-orange-100 transition-transform hover:-translate-y-1">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-5">
                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Irrelevant Results</h4>
                    <p className="text-gray-600">Search results returning hundreds of irrelevant meant results.</p>
                  </div>
                </div>
                {/* Card 3 */}
                <div className="flex items-start p-6 bg-blue-50/50 rounded-2xl shadow-soft border border-blue-100 transition-transform hover:-translate-y-1">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-5">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Wasted Time &amp; Resources</h4>
                    <p className="text-gray-600">Applying blindly and hoping for the best, wasting time and resources.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END: Pain Points Section */}
        {/* BEGIN: Value Prop Section */}
        <section className="py-24 bg-navy-50">
          <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-16">
              {/* Left Header */}
              <div className="lg:w-1/3">
                <h3 className="text-orange-500 font-bold uppercase tracking-wider text-sm mb-3">Value Prop</h3>
                <h2 className="text-4xl font-bold text-navy-900 mb-6 leading-tight">Clarity.<br/>Accuracy.<br/>Personalization.</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Yojana Saarthi cuts through the noise with AI-driven reasoning and personalized matching tailored specifically for you.
                </p>
                <a className="inline-flex items-center text-navy-900 font-semibold hover:text-orange-500 transition-colors group" href="#">
                  See how it works
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </a>
              </div>
              {/* Right Grid */}
              <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Item 1 */}
                <div>
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 border border-gray-100">
                    <svg className="w-8 h-8 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path></svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">AI-Driven Accuracy</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">Advanced AI understands complex eligibility rules and cross-verifies thousands of criteria.</p>
                </div>
                {/* Item 2 */}
                <div>
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl shadow-sm flex items-center justify-center mb-6 border border-blue-100">
                    <svg className="w-8 h-8 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path></svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Personalized for You</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">Matches are tailored to your demographic, financial, and personal profile.</p>
                </div>
                {/* Item 3 */}
                <div>
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 border border-gray-100">
                    <svg className="w-8 h-8 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path></svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Transparent Reasoning</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">Clear reasons for every match—so you always know why you&apos;re eligible.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END: Value Prop Section */}
        {/* BEGIN: Stats Bar */}
        <section className="bg-navy-900 py-12">
          <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
              {/* Stat 1 */}
              <div className="flex items-center gap-4 px-4">
                <svg className="w-10 h-10 text-orange-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path></svg>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">4,700+</div>
                  <div className="text-orange-100 text-sm">Government Schemes Analyzed</div>
                </div>
              </div>
              {/* Stat 2 */}
              <div className="flex items-center gap-4 px-4">
                <svg className="w-10 h-10 text-orange-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path></svg>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">10L+</div>
                  <div className="text-orange-100 text-sm">Profiles Evaluated</div>
                </div>
              </div>
              {/* Stat 3 */}
              <div className="flex items-center gap-4 px-4">
                <svg className="w-10 h-10 text-orange-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path></svg>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">95%</div>
                  <div className="text-orange-100 text-sm">Match Accuracy</div>
                </div>
              </div>
              {/* Stat 4 */}
              <div className="flex items-center gap-4 px-4">
                <svg className="w-10 h-10 text-orange-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path></svg>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">100%</div>
                  <div className="text-orange-100 text-sm">Data Privacy Guaranteed</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END: Stats Bar */}
      </main>

      {/* BEGIN: Footer */}
      <footer className="bg-navy-900 text-white pt-16 pb-8 border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Col */}
            <div className="md:col-span-1">
              <Link className="flex items-center gap-2 mb-4" href="/">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/logo.png" alt="Yojana Saarthi Logo" width={28} height={28} />
                <span className="text-xl font-bold tracking-tight">Yojana Saarthi</span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed">
                An official native eligibility initiative empowering citizens to access the benefits they deserve.
              </p>
            </div>
            {/* Links Col */}
            <div>
              <h4 className="font-bold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link className="hover:text-orange-500 transition-colors" href="/schemes">Schemes</Link></li>
                <li><Link className="hover:text-orange-500 transition-colors" href="/dashboard">Eligibility Check</Link></li>
                <li><Link className="hover:text-orange-500 transition-colors" href="/login">Sign In</Link></li>
                <li><Link className="hover:text-orange-500 transition-colors" href="/register">Register</Link></li>
              </ul>
            </div>
            {/* Legal Col */}
            <div>
              <h4 className="font-bold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a className="hover:text-orange-500 transition-colors" href="#">Privacy Policy</a></li>
                <li><a className="hover:text-orange-500 transition-colors" href="#">Terms of Service</a></li>
                <li><a className="hover:text-orange-500 transition-colors" href="#">Accessibility</a></li>
                <li><a className="hover:text-orange-500 transition-colors" href="#">Sitemap</a></li>
              </ul>
            </div>
            {/* Connect Col */}
            <div>
              <h4 className="font-bold mb-4 text-white">Connect</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  info@yojanaSaarthi.gov.in
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                  +91 1800-123-4567
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-500">
            © 2034 Yojana Saarthi. All rights reserved.
          </div>
        </div>
      </footer>
      {/* END: Footer */}
    </>
  );
}
