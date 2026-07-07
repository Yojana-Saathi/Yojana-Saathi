"use client";
import { useState } from "react";
import Link from "next/link";

const steps = ["Account", "Profile", "Documents"];

export default function Register() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleNext = () => { if (step < steps.length - 1) setStep(step + 1); };
  const handleBack = () => { if (step > 0) setStep(step - 1); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < steps.length - 1) { handleNext(); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); window.location.href = "/dashboard"; }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-navy-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange-500 opacity-10 blur-3xl" />
        <Link href="/" className="flex items-center gap-2.5 z-10">
          <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8 2 4 8 4 12c0 2 1.5 4 3 5 1.5 1 4 2 5 4 1-2 3.5-3 5-4 1.5-1 3-3 3-5 0-4-4-10-8-10zm0 18c-1.5-2-4-3-5.5-4-1.5-1-2.5-2.5-2.5-4 0-3 3-8 8-8s8 5 8 8c0 1.5-1 3-2.5 4C16 17 13.5 18 12 20z" />
          </svg>
          <span className="text-white font-bold text-xl">Yojana Saarthi</span>
        </Link>
        <div className="z-10 space-y-6">
          <h2 className="text-4xl font-bold text-white leading-tight">Start your journey to unclaimed benefits.</h2>
          <p className="text-slate-300 leading-relaxed">Create a free account and let our AI engine find every government scheme you qualify for — in minutes.</p>
          <div className="space-y-3">
            {["No government login required", "100% free to use", "Data stays private — we never log profiles"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                </div>
                <span className="text-slate-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-slate-600 text-sm z-10">© 2024 Yojana Saarthi</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-lg">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i <= step ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                  {i < step ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg> : i + 1}
                </div>
                <span className={`text-sm font-medium ${i === step ? "text-navy-900" : "text-slate-400"}`}>{s}</span>
                {i < steps.length - 1 && <div className={`flex-1 h-0.5 rounded ${i < step ? "bg-orange-500" : "bg-slate-200"}`} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Step 0 – Account */}
            {step === 0 && (
              <>
                <div>
                  <h1 className="text-2xl font-bold text-navy-900 mb-1">Create your account</h1>
                  <p className="text-slate-500 text-sm mb-6">Enter your email and set a password.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-1.5">Full name</label>
                  <input required placeholder="e.g. Asha Devi" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 text-navy-900 placeholder-slate-400 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-1.5">Email address</label>
                  <input required type="email" placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 text-navy-900 placeholder-slate-400 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-1.5">Password</label>
                  <input required type="password" placeholder="At least 8 characters" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 text-navy-900 placeholder-slate-400 text-sm" />
                </div>
              </>
            )}

            {/* Step 1 – Profile */}
            {step === 1 && (
              <>
                <div>
                  <h1 className="text-2xl font-bold text-navy-900 mb-1">Your profile</h1>
                  <p className="text-slate-500 text-sm mb-6">This helps us match you to the right schemes. All fields are optional.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy-900 mb-1.5">Age</label>
                    <input type="number" placeholder="e.g. 34" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 text-navy-900 placeholder-slate-400 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy-900 mb-1.5">Gender</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 text-navy-900 text-sm">
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy-900 mb-1.5">State</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 text-navy-900 text-sm">
                      <option value="">Select State</option>
                      <option>Bihar</option>
                      <option>Maharashtra</option>
                      <option>Karnataka</option>
                      <option>Uttar Pradesh</option>
                      <option>Rajasthan</option>
                      <option>Tamil Nadu</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy-900 mb-1.5">Annual Income</label>
                    <input type="number" placeholder="In ₹" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 text-navy-900 placeholder-slate-400 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-1.5">Occupation</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 text-navy-900 text-sm">
                    <option value="">Select</option>
                    <option>Farmer</option>
                    <option>Daily Wage Worker</option>
                    <option>Self Employed</option>
                    <option>Salaried</option>
                    <option>Student</option>
                    <option>Unemployed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-1.5">Social Category</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["General", "OBC", "SC", "ST"].map((cat) => (
                      <label key={cat} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 hover:border-orange-300 cursor-pointer text-sm font-medium text-slate-700 has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50 has-[:checked]:text-orange-600 transition-all">
                        <input type="radio" name="category" value={cat} className="sr-only" />
                        {cat}
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 2 – Documents */}
            {step === 2 && (
              <>
                <div>
                  <h1 className="text-2xl font-bold text-navy-900 mb-1">Your documents</h1>
                  <p className="text-slate-500 text-sm mb-6">Tell us which IDs and certificates you have. This helps us identify missing documents.</p>
                </div>
                <div className="space-y-3">
                  {[
                    { id: "aadhaar", label: "Aadhaar Card", icon: "🪪" },
                    { id: "ration", label: "Ration Card (BPL)", icon: "🧾" },
                    { id: "income", label: "Income Certificate", icon: "📄" },
                    { id: "caste", label: "Caste Certificate", icon: "📋" },
                    { id: "land", label: "Land Records", icon: "🏞️" },
                    { id: "bank", label: "Bank Passbook", icon: "🏦" },
                  ].map((doc) => (
                    <label key={doc.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-orange-300 cursor-pointer has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50 transition-all">
                      <input type="checkbox" id={doc.id} className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                      <span className="text-xl">{doc.icon}</span>
                      <span className="text-sm font-medium text-navy-900">{doc.label}</span>
                    </label>
                  ))}
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-2">
              {step > 0 && (
                <button type="button" onClick={handleBack} className="flex-1 py-3 border border-slate-200 text-navy-900 font-semibold rounded-xl hover:bg-slate-50 transition-colors text-sm">
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-orange-500/25 disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
              >
                {loading && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                {step < steps.length - 1 ? "Continue" : "Create Account"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-500 hover:text-orange-600 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
