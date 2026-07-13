"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/media/logo.png" alt="Logo" className="w-7 h-7" />
              <span className="font-bold text-[16px] text-[#1B2B4B]">YojanaSaathi</span>
            </Link>
            <p className="text-gray-400 text-[13px] leading-relaxed">
              An AI-powered tool for government welfare scheme discovery. Privacy-first, open-source for every citizen.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[13px] text-gray-900 mb-4">Platform</h4>
            <ul className="space-y-2.5 text-[13px] text-gray-400">
              <li><Link href="/schemes" className="hover:text-gray-700 transition-colors">Browse Schemes</Link></li>
              <li><Link href="/documents" className="hover:text-gray-700 transition-colors">Document Vault</Link></li>
              <li><Link href="/chat" className="hover:text-gray-700 transition-colors">AI Assistant</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[13px] text-gray-900 mb-4">Citizens</h4>
            <ul className="space-y-2.5 text-[13px] text-gray-400">
              <li><Link href="/register" className="hover:text-gray-700 transition-colors">Eligibility Check</Link></li>
              <li><Link href="/login" className="hover:text-gray-700 transition-colors">Sign In</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-gray-700 transition-colors">How It Works</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[13px] text-gray-900 mb-4">Open Source</h4>
            <ul className="space-y-2.5 text-[13px] text-gray-400">
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-gray-700 transition-colors">GitHub Repository</a></li>
              <li><Link href="/privacy" className="hover:text-gray-700 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-gray-700 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400">
          <p>© 2026 YojanaSaathi. Built for citizens.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
