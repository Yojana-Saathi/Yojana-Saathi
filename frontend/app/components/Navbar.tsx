"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/schemes", label: "Schemes" },
  { href: "/dashboard", label: "Eligibility" },
  { href: "#resources", label: "Resources" },
  { href: "#about", label: "About" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <Image src="/media/logo.png" alt="Yojana Saarthi Logo" width={36} height={36} className="group-hover:scale-105 transition-transform" />
          <span className="text-lg font-bold tracking-tight text-navy-900 hidden sm:block">Yojana Saarthi</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 font-medium text-gray-600 text-sm">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-orange-500 transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-navy-900 hover:text-orange-500 transition-colors">Sign In</Link>
          <Link href="/register" className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20">
            Get Started
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 text-sm font-semibold text-navy-900 rounded-lg hover:bg-slate-50 transition-colors text-center">
              Sign In
            </Link>
            <Link href="/register" onClick={() => setMenuOpen(false)} className="block py-2.5 text-sm font-semibold text-white bg-orange-500 rounded-full text-center hover:bg-orange-600 transition-colors">
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
