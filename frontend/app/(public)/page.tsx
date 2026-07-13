"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { StatsBar } from "@/components/landing/stats-bar";
import { FAQ } from "@/components/landing/faq";
import { useAuth } from "@/hooks/useAuth";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  // Show loader while auth state is resolving or redirect is pending
  if (!mounted || loading || user) {
    return (
      <div
        suppressHydrationWarning
        className="fixed inset-0 z-[60] flex items-center justify-center bg-gradient-to-br from-[#0B1E3D] via-[#0F2645] to-[#142E4D]"
      >
        <div suppressHydrationWarning className="w-[300px] max-w-full px-4 sm:w-[400px]">
          <video
            suppressHydrationWarning
            src="/assets/loader-ring.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full"
          />
        </div>
      </div>
    );
  }

  // Only render the marketing page for signed-out visitors
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Hero />
        <div className="-mt-8 pb-16 sm:-mt-12 sm:pb-20">
          <StatsBar />
        </div>
        <Features />
        <FAQ />
      </main>
    </div>
  );
}
