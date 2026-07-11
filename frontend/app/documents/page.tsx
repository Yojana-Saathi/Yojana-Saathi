"use client";
import { useState, useRef } from "react";
import Sidebar from "../components/Sidebar";

type DocStatus = "verified" | "pending" | "uploading";

type DocItem = {
  id: number;
  name: string;
  uploaded: string;
  ocr: number;
  status: DocStatus;
};

const DOCUMENT_TYPES = [
  "Aadhaar Card",
  "PAN Card",
  "Ration Card",
  "Caste Certificate",
  "Income Certificate",
  "Domicile Certificate",
  "Bank Passbook",
  "Voter ID",
];

const initialDocs: DocItem[] = [
  { id: 1, name: "Aadhaar Card",      uploaded: "14/6/2025", ocr: 98, status: "verified" },
  { id: 2, name: "Caste Certificate", uploaded: "14/6/2025", ocr: 94, status: "verified" },
  { id: 3, name: "Ration Card",       uploaded: "2/7/2025",  ocr: 87, status: "pending" },
];

export default function DocumentVault() {
  const [docs, setDocs] = useState<DocItem[]>(initialDocs);
  const [docType, setDocType] = useState(DOCUMENT_TYPES[0]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) simulateUpload(file.name);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) simulateUpload(file.name);
  }

  function simulateUpload(fileName: string) {
    setUploading(true);
    setTimeout(() => {
      setDocs((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: docType,
          uploaded: new Date().toLocaleDateString("en-GB"),
          ocr: Math.floor(Math.random() * 10) + 88,
          status: "pending",
        },
      ]);
      setUploading(false);
    }, 1800);
    console.log("Uploading:", fileName);
  }

  function deleteDoc(id: number) {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  }

  const statusBadge = (status: DocStatus) => {
    if (status === "verified")
      return (
        <span className="flex items-center gap-1 text-[11px] font-semibold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Verified
        </span>
      );
    return (
      <span className="flex items-center gap-1 text-[11px] font-semibold text-orange-500 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">
        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Pending review
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main */}
      <div className="flex-1 ml-56">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input placeholder="Search schemes, documents…"
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400/30 text-gray-700 placeholder-gray-300" />
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">AD</div>
              <div className="hidden sm:block">
                <p className="text-[12px] font-semibold text-gray-800 leading-none">Asha Devi</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Patna, Bihar</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-0.5">Document vault</h1>
          <p className="text-gray-400 text-sm mb-8">Encrypted, private, and yours. Uploads never leave your account.</p>

          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
            {/* ── LEFT: Upload form ── */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Add a document</p>
                  <p className="text-[11px] text-gray-400">Private bucket • S3cs signed URLs</p>
                </div>
              </div>

              {/* Doc type */}
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Document type</label>
              <div className="relative mb-4">
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 appearance-none pr-8"
                >
                  {DOCUMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Drop zone */}
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  dragOver ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/30"
                }`}
              >
                {uploading ? (
                  <svg className="w-8 h-8 text-orange-400 animate-spin mb-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-orange-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                )}
                <p className="text-sm font-semibold text-gray-700">{uploading ? "Uploading…" : "Click to upload"}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">JPG, PNG or PDF up to 10 MB</p>
                <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={handleFileChange} />
              </div>

              {/* How it works */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-[11px] font-semibold text-gray-500 mb-1">How it works</p>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  OCR extracts key fields and shows you a preview to confirm. Only after your confirmation do we update your profile.
                </p>
              </div>
            </div>

            {/* ── RIGHT: Document list ── */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-900">Your documents ({docs.length})</h2>
                <span className="text-[11px] font-semibold text-green-600 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  All secure
                </span>
              </div>

              <div className="space-y-2.5">
                {docs.map((doc) => (
                  <div key={doc.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3.5 flex items-center gap-4 hover:shadow-sm transition-shadow">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{doc.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Uploaded {doc.uploaded} • OCR confidence {doc.ocr}%
                      </p>
                    </div>
                    {/* Status */}
                    <div className="flex-shrink-0">{statusBadge(doc.status)}</div>
                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button className="p-1.5 rounded-lg text-gray-300 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button onClick={() => deleteDoc(doc.id)} className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}

                {docs.length === 0 && (
                  <div className="text-center py-16 text-gray-400">
                    <svg className="w-10 h-10 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm font-medium">No documents yet</p>
                    <p className="text-xs mt-1">Upload your first document to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
