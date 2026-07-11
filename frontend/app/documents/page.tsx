"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface UploadedDoc {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  status: "pending" | "verified" | "failed";
  extractedData?: Record<string, string>;
}

const documentTypes = [
  { id: "aadhaar", label: "Aadhaar Card", hint: "12-digit UID", icon: "card" },
  { id: "income", label: "Income Certificate", hint: "Below ₹3L or ₹8L annual", icon: "income" },
  { id: "caste", label: "Caste Certificate", hint: "SC/ST/OBC/EWS", icon: "caste" },
  { id: "ration", label: "Ration Card", hint: "BPL/APL", icon: "ration" },
  { id: "domicile", label: "Domicile Certificate", hint: "State residence proof", icon: "domicile" },
  { id: "disability", label: "Disability Certificate", hint: "40%+ disability", icon: "disability" },
];

const initialDocs: UploadedDoc[] = [
  { id: "1", name: "Aadhaar Card", type: "aadhaar", uploadedAt: "5 Jul 2026", status: "verified", extractedData: { Name: "Ravi Kumar", "Aadhaar No": "XXXX-XXXX-1234", DOB: "15/03/1995" } },
  { id: "2", name: "Ration Card", type: "ration", uploadedAt: "5 Jul 2026", status: "pending", extractedData: { "Card Type": "BPL", "Family Size": "4" } },
];

const docIcons: Record<string, React.ReactNode> = {
  card: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>,
  income: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  caste: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  ration: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M3 3h18v18H3V3z" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>,
  domicile: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><path d="M9 22V12h6v10" /></svg>,
  disability: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /><path d="M12 16h.01" /></svg>,
};

export default function DocumentsPage() {
  const [docs, setDocs] = useState(initialDocs);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const dcEls = pageRef.current?.querySelectorAll(".dc-hero, .dc-card");
      if (dcEls?.length) gsap.killTweensOf(dcEls);
      const ctx = gsap.context(() => {
        gsap.fromTo(".dc-hero", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", clearProps: "all" });
        gsap.fromTo(".dc-card", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, delay: 0.15, ease: "power2.out", clearProps: "all" });
      }, pageRef);
      return () => ctx.revert();
    } catch { return; }
  }, []);

  const uploadedCount = docs.length;
  const verifiedCount = docs.filter((d) => d.status === "verified").length;

  return (
    <div ref={pageRef} className="flex min-h-screen flex-col">
      <Navbar isSignedIn={true} />
      <main className="flex-1 bg-gradient-to-b from-white to-warm-paper">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="dc-hero">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-ink-navy sm:text-3xl">Document vault</h1>
            <p className="mt-1 text-sm text-slate-blue">Upload once. We&apos;ll use these to verify eligibility and pre-fill your applications.</p>
          </div>

          {/* Stats mini row */}
          <div className="dc-hero mt-6 grid grid-cols-3 gap-3">
            {[
              { label: "Uploaded", value: String(uploadedCount), color: "bg-verified-teal/10 text-verified-teal" },
              { label: "Verified", value: String(verifiedCount), color: "bg-signal-orange/10 text-signal-orange" },
              { label: "Completion", value: `${Math.round(uploadedCount / documentTypes.length * 100)}%`, color: "bg-ink-navy/5 text-ink-navy" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-ink-navy/10 bg-white p-4 text-center">
                <p className={`text-2xl font-bold font-display ${stat.color.split(" ")[1]}`}>{stat.value}</p>
                <p className="text-xs text-slate-blue-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Upload grid */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documentTypes.map((dt) => {
              const existing = docs.find((d) => d.type === dt.id);
              return (
                <div
                  key={dt.id}
                  className={cn(
                    "dc-card rounded-xl border-2 transition-all",
                    existing ? "border-verified-teal/30 bg-verified-teal/[0.02]" : "border-dashed border-ink-navy/15 bg-white hover:border-signal-orange/40 hover:bg-signal-orange/[0.02] hover:shadow-sm"
                  )}
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg",
                        existing ? "bg-verified-teal/10 text-verified-teal" : "bg-warm-paper text-slate-blue-400"
                      )}>
                        {docIcons[dt.icon] ?? docIcons.card}
                      </div>
                      {existing?.status === "verified" && (
                        <span className="flex items-center gap-1 text-xs font-medium text-verified-teal">
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          Verified
                        </span>
                      )}
                      {existing?.status === "pending" && (
                        <span className="text-xs font-medium text-caution-amber">Awaiting</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-semibold text-ink-navy">{dt.label}</p>
                    <p className="mt-0.5 text-xs text-slate-blue-400">{dt.hint}</p>
                    {!existing ? (
                      <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-ink-navy/10 bg-warm-paper/50 px-3 py-2 text-xs font-medium text-slate-blue transition-colors hover:border-signal-orange/30 hover:text-signal-orange">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 4v16m8-8H4" /></svg>
                        Upload
                        <input type="file" className="hidden" accept="image/*,.pdf" />
                      </label>
                    ) : (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-slate-blue-400">Uploaded {existing.uploadedAt}</span>
                        {existing.status === "pending" && (
                          <button onClick={() => setShowConfirm(existing.id)} className="text-xs font-semibold text-signal-orange hover:text-signal-orange-600 transition-colors">Confirm</button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* OCR confirmation */}
          {showConfirm && (
            <div className="dc-card mt-8 rounded-2xl border border-caution-amber/20 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-caution-amber/10 text-caution-amber">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold text-ink-navy">Confirm extracted information</h3>
                  <p className="mt-1 text-sm text-slate-blue">We read the document you uploaded. Please confirm the information below is correct.</p>
                  <div className="mt-4 rounded-xl border border-ink-navy/10 bg-warm-paper/50 p-4 space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-slate-blue-400">Name</span><span className="font-medium text-ink-navy">Ravi Kumar</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-blue-400">Aadhaar No</span><span className="font-mono font-medium text-ink-navy">XXXX-XXXX-1234</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-blue-400">Date of Birth</span><span className="font-medium text-ink-navy">15/03/1995</span></div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Button onClick={() => setShowConfirm(null)}>
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M5 13l4 4L19 7" /></svg>
                      Looks correct
                    </Button>
                    <Button variant="outline" onClick={() => setShowConfirm(null)}>Re-upload</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Uploaded list */}
          {docs.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-lg font-semibold text-ink-navy">Uploaded documents</h2>
              <div className="mt-3 space-y-2">
                {docs.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between rounded-xl border border-ink-navy/10 bg-white px-4 py-3 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", doc.status === "verified" ? "bg-verified-teal/10 text-verified-teal" : "bg-caution-amber/10 text-caution-amber")}>
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink-navy">{doc.name}</p>
                        <p className="text-xs text-slate-blue-400">Uploaded {doc.uploadedAt}</p>
                      </div>
                    </div>
                    <span className={cn("text-xs font-medium", doc.status === "verified" ? "text-verified-teal" : "text-caution-amber")}>
                      {doc.status === "verified" ? "Verified" : "Awaiting confirmation"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
