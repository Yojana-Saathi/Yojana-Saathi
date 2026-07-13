"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function ChatFloatingButton() {
  const pathname = usePathname();
  if (pathname === "/chat" || pathname === "/login" || pathname === "/register") return null;

  return (
    <Link
      href="/chat"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-full shadow-lg shadow-orange-500/30 transition-all hover:scale-105 active:scale-95"
    >
      <span>Ask AI Saathi</span>
    </Link>
  );
}

export default ChatFloatingButton;
