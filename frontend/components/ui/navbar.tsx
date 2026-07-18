"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = user?.user_metadata?.full_name
    ? (user.user_metadata.full_name as string)
        .split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "U";

  async function handleSignOut() {
    setMenuOpen(false);
    await signOut();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/assets/logo-bg.png" alt="YojanaSaathi" className="w-8 h-8 object-contain" />
          <span className="font-extrabold text-[17px] text-[#1B2B4B] tracking-tight">YojanaSaathi</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-[13.5px] font-medium text-gray-600">
          <Link href="/#how-it-works" className="hover:text-orange-500 transition-colors">How It Works</Link>
          <Link href="/schemes" className="hover:text-orange-500 transition-colors">Browse Schemes</Link>
          <Link href="/documents" className="hover:text-orange-500 transition-colors">Document Vault</Link>
          <Link href="/chat" className="hover:text-orange-500 transition-colors">AI Assistant</Link>
          <Link href="/test-agents" className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold transition-all border border-indigo-100 shadow-2xs">
            <span>🧪 Agent Lab</span>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-8 w-8 rounded-full bg-gray-100 animate-pulse" />
          ) : user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full px-3 py-1.5 bg-orange-50 border border-orange-100 hover:bg-orange-100 transition-all"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-[11px] font-bold text-white">
                  {initials}
                </span>
                <span className="hidden sm:block text-sm font-semibold text-[#1B2B4B] max-w-[120px] truncate">
                  {user.user_metadata?.full_name ?? user.email}
                </span>
                <svg className="h-3.5 w-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg border border-gray-100 py-1 z-50">
                  <div className="px-4 py-2.5 border-b border-gray-100">
                    <p className="text-xs font-semibold text-[#1B2B4B] truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/test-agents"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 transition-colors"
                  >
                    🧪 Agent Lab
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100 mt-1"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-block px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#1B2B4B] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-orange-500 rounded-full hover:bg-orange-600 active:scale-95 transition-all shadow-md shadow-orange-500/20"
              >
                Check Eligibility
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
