"use client";
import { useState, useRef } from "react";
import Link from "next/link";

type DocStatus = "uploaded" | "missing" | "uploading";

type DocItem = {
  id: string;
  label: string;
  icon: string;
  status: DocStatus;
  fileName?: string;
  schemes: string[];
};

const initialDocs: DocItem[] = [
  { id: "aadhaar", label: "Aadhaar Card", icon: "🪪", status: "uploaded", fileName: "aadhaar_card.pdf", schemes: ["PM-KISAN", "Ayushman Bharat", "NSAP Pension"] },
  { id: "ration", label: "Ration Card (BPL)", icon: "🧾", status: "uploaded", fileName: "ration_card.jpg", schemes: ["PM-KISAN", "NSAP Pension"] },
  { id: "caste", label: "Caste Certificate", icon: "📋", status: "uploaded", fileName: "caste_cert.pdf", schemes: ["NSP Scholarship"] },
  { id: "income", label: "Income Certificate", icon: "📄", status: "missing", schemes: ["Ayushman Bharat", "NSP Scholarship", "PM-KISAN"] },
  { id: "land", label: "Land Records / Khasra", icon: "🏞️", status: "missing", schemes: ["PM-KISAN"] },
  { id: "bank", label: "Bank Passbook / Account", icon: "🏦", status: "missing", schemes: ["PM-KISAN", "NSAP Pension"] },
];

export default function Documents() {
  const [docs, setDocs] = useState<DocItem[]>(initialDocs);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);

  const uploaded = docs.filter((d) => d.status === "uploaded");
  const missing = docs.filter((d) => d.status === "missing");

  const handleUpload = (docId: string, file: File) => {
    setDocs((prev) =>
      prev.map((d) => d.id === docId ? { ...d, status: "uploading" } : d)
    );
    // Simulate upload delay
    setTimeout(() => {
      setDocs((prev) =>
        prev.map((d) =>
          d.id === docId ? { ...d, status: "uploaded", fileName: file.name } : d
        )
      );
    }, 1500);
  };

  const handleDrop = (e: React.DragEvent, docId: string) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(docId, file);
  };

  const triggerUpload = (docId: string) => {
    setActiveUploadId(docId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeUploadId) {
      handleUpload(activeUploadId, file);
      setActiveUploadId(null);
    }
    e.target.value = "";
  };

  const removeDoc = (docId: string) => {
    setDocs((prev) => prev.map((d) => d.id === docId ? { ...d, status: "missing", fileName: undefined } : d));
  };

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
            <p className="text-xs text-slate-500">{uploaded.length} uploaded · {missing.length} missing</p>
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
              <p className="text-orange-400 font-semibold text-sm">unlock {missing.length} more schemes</p>
            </div>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${(uploaded.length / docs.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-400">
            <span>{uploaded.length} uploaded</span>
            <span>{docs.length} total required</span>
          </div>
        </div>

        {/* Missing Docs */}
        {missing.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-xs font-bold">{missing.length}</span>
              Missing Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {docs.filter((d) => d.status === "missing" || d.status === "uploading").map((doc) => (
                <div
                  key={doc.id}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(doc.id); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={(e) => handleDrop(e, doc.id)}
                  className={`border-2 border-dashed rounded-2xl p-5 transition-all cursor-pointer group
                    ${dragOver === doc.id ? "border-orange-400 bg-orange-50" : "border-slate-200 bg-white hover:border-orange-300 hover:bg-orange-50/50"}
                  `}
                >
                  {doc.status === "uploading" ? (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center animate-pulse">
                        <svg className="w-6 h-6 text-orange-400 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      </div>
                      <div>
                        <div className="font-semibold text-navy-900 text-sm">Uploading…</div>
                        <div className="text-slate-400 text-xs">Processing your document</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{doc.icon}</div>
                        <div>
                          <div className="font-semibold text-navy-900 text-sm">{doc.label}</div>
                          <div className="text-slate-400 text-xs mt-0.5">Required for: {doc.schemes.slice(0, 2).join(", ")}{doc.schemes.length > 2 ? ` +${doc.schemes.length - 2}` : ""}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => triggerUpload(doc.id)}
                        className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors shadow-sm"
                      >
                        Upload
                      </button>
                    </div>
                  )}
                  {doc.status === "missing" && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                      Drag & drop or click Upload · PDF, JPG, PNG accepted
                    </div>
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
          <div className="space-y-3">
            {docs.filter((d) => d.status === "uploaded").map((doc) => (
              <div key={doc.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl">{doc.icon}</div>
                  <div>
                    <div className="font-semibold text-navy-900 text-sm">{doc.label}</div>
                    <div className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                      <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                      {doc.fileName} · Verified
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden sm:block text-xs text-slate-400">Unlocks {doc.schemes.length} scheme{doc.schemes.length > 1 ? "s" : ""}</span>
                  <button onClick={() => removeDoc(doc.id)} className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors group" title="Remove">
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
