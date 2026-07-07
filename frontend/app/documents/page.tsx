"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { GOV_ID_KEYS, GOV_ID_LABELS, type GovIdKey, type IntakeResponse } from "../lib/api-types";

type DocStatus = "uploaded" | "missing" | "uploading";

type DocItem = {
  key: GovIdKey;
  status: DocStatus;
  fileName?: string;
  /** scheme names that require this document (derived from intake result) */
  requiredFor: string[];
};

export default function Documents() {
  const [docs, setDocs] = useState<DocItem[]>(
    GOV_ID_KEYS.map((key) => ({ key, status: "missing", requiredFor: [] }))
  );
  const [dragOver, setDragOver] = useState<GovIdKey | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadKey, setActiveUploadKey] = useState<GovIdKey | null>(null);

  // Populate initial state from intake result
  useEffect(() => {
    const raw = sessionStorage.getItem("intake_result");
    if (!raw) return;
    try {
      const data = JSON.parse(raw) as IntakeResponse;
      setDocs(GOV_ID_KEYS.map((key) => {
        const requiredFor = data.eligible_schemes
          .filter(s => s.missing_documents.includes(key))
          .map(s => s.scheme_name);
        // If no scheme lists it as missing, assume it was provided
        const wasMissing = data.eligible_schemes.some(s => s.missing_documents.includes(key));
        return { key, status: wasMissing ? "missing" : "uploaded", requiredFor };
      }));
    } catch { /* ignore */ }
  }, []);

  const uploaded = docs.filter(d => d.status === "uploaded");
  const missing = docs.filter(d => d.status !== "uploaded");

  const handleUpload = (key: GovIdKey, file: File) => {
    setDocs(prev => prev.map(d => d.key === key ? { ...d, status: "uploading" } : d));
    setTimeout(() => {
      setDocs(prev => prev.map(d => d.key === key ? { ...d, status: "uploaded", fileName: file.name } : d));
    }, 1500);
  };

  const handleDrop = (e: React.DragEvent, key: GovIdKey) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(key, file);
  };

  const triggerUpload = (key: GovIdKey) => {
    setActiveUploadKey(key);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeUploadKey) { handleUpload(activeUploadKey, file); setActiveUploadKey(null); }
    e.target.value = "";
  };

  const removeDoc = (key: GovIdKey) =>
    setDocs(prev => prev.map(d => d.key === key ? { ...d, status: "missing", fileName: undefined } : d));

  return (
    <div className="min-h-screen bg-slate-50">
      <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFileChange} />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link href="/dashboard" className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
          </Link>
          <div>
            <h1 className="font-bold text-navy-900 text-sm">Document Vault</h1>
            <p className="text-xs text-slate-500">{uploaded.length} of {docs.length} uploaded · 4 documents tracked by eligibility engine</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Progress Banner */}
        <div className="bg-gradient-to-r from-navy-900 to-navy-800 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-orange-300 text-sm font-semibold mb-1">Document Completion</p>
              <p className="text-2xl font-bold">{Math.round((uploaded.length / docs.length) * 100)}%</p>
            </div>
            <div className="text-right">
              <p className="text-slate-300 text-sm">Upload remaining documents to</p>
              <p className="text-orange-400 font-semibold text-sm">improve your eligibility results</p>
            </div>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${(uploaded.length / docs.length) * 100}%` }} />
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-400">
            <span>{uploaded.length} uploaded</span>
            <span>{docs.length} tracked by eligibility engine</span>
          </div>
        </div>

        {/* Info note about doc scope */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700 flex items-start gap-2">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
          The eligibility engine tracks exactly these 4 documents: <strong className="ml-1">Aadhaar, Income Certificate, Caste Certificate, Ration Card</strong>. These are the only ones that affect your missing_documents list.
        </div>

        {/* Missing Docs */}
        {missing.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-xs font-bold">{missing.length}</span>
              Missing Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {missing.map((doc) => (
                <div
                  key={doc.key}
                  onDragOver={e => { e.preventDefault(); setDragOver(doc.key); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={e => handleDrop(e, doc.key)}
                  className={`border-2 border-dashed rounded-2xl p-5 transition-all cursor-pointer ${dragOver === doc.key ? "border-orange-400 bg-orange-50" : "border-slate-200 bg-white hover:border-orange-300 hover:bg-orange-50/50"}`}
                >
                  {doc.status === "uploading" ? (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center animate-pulse">
                        <svg className="w-6 h-6 text-orange-400 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      </div>
                      <div>
                        <div className="font-semibold text-navy-900 text-sm">Uploading…</div>
                        <div className="text-slate-400 text-xs">Processing {GOV_ID_LABELS[doc.key].label}</div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">{GOV_ID_LABELS[doc.key].icon}</div>
                          <div>
                            <div className="font-semibold text-navy-900 text-sm">{GOV_ID_LABELS[doc.key].label}</div>
                            {doc.requiredFor.length > 0 && (
                              <div className="text-slate-400 text-xs mt-0.5">
                                Needed for: {doc.requiredFor.slice(0, 2).join(", ")}{doc.requiredFor.length > 2 ? ` +${doc.requiredFor.length - 2}` : ""}
                              </div>
                            )}
                          </div>
                        </div>
                        <button onClick={() => triggerUpload(doc.key)}
                          className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors shadow-sm">
                          Upload
                        </button>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                        Drag & drop or click Upload · PDF, JPG, PNG
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Uploaded Docs */}
        <section>
          <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
            </span>
            Uploaded Documents
          </h2>
          {uploaded.length === 0 && <p className="text-slate-400 text-sm">No documents uploaded yet.</p>}
          <div className="space-y-3">
            {uploaded.map((doc) => (
              <div key={doc.key} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl">{GOV_ID_LABELS[doc.key].icon}</div>
                  <div>
                    <div className="font-semibold text-navy-900 text-sm">{GOV_ID_LABELS[doc.key].label}</div>
                    <div className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                      <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                      {doc.fileName ?? "Verified"} · Ready for applications
                    </div>
                  </div>
                </div>
                <button onClick={() => removeDoc(doc.key)} className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors group" title="Remove">
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
