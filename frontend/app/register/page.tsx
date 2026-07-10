"use client";
import { useState } from "react";
import Link from "next/link";
import {
  GENDER_OPTIONS,
  OCCUPATION_OPTIONS,
  SOCIAL_CATEGORY_OPTIONS,
  DISABILITY_STATUS_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  GOV_ID_KEYS,
  GOV_ID_LABELS,
  type CitizenProfile,
  type GovIdKey,
} from "../lib/api-types";
import { submitIntake } from "../lib/api-client";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh",
];

const steps = ["Account", "Profile", "Documents"];

type FormState = {
  // Account
  full_name: string;
  email: string;
  password: string;
  // Profile
  age: string;
  gender: string;
  state: string;
  district: string;
  annual_income: string;
  occupation: string;
  social_category: string;
  disability_status: string;
  family_size: string;
  has_bpl_card: boolean;
  land_owned_acres: string;
  education_level: string;
  // Documents
  gov_id_available: Record<GovIdKey, boolean>;
};

const initialForm: FormState = {
  full_name: "",
  email: "",
  password: "",
  age: "",
  gender: "",
  state: "",
  district: "",
  annual_income: "",
  occupation: "",
  social_category: "",
  disability_status: "none",
  family_size: "",
  has_bpl_card: false,
  land_owned_acres: "0",
  education_level: "",
  gov_id_available: { aadhaar: false, income_certificate: false, caste_certificate: false, ration_card: false },
};

export default function Register() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);

  const set = (key: keyof FormState, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setDoc = (key: GovIdKey, value: boolean) =>
    setForm((prev) => ({ ...prev, gov_id_available: { ...prev.gov_id_available, [key]: value } }));

  const handleNext = () => {
    setError(null);
    if (step < steps.length - 1) setStep(step + 1);
  };
  const handleBack = () => { setError(null); if (step > 0) setStep(step - 1); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < steps.length - 1) { handleNext(); return; }

    setLoading(true);
    setError(null);

    // Build the CitizenProfile payload matching the backend contract exactly
    const profile: CitizenProfile = {
      full_name: form.full_name.trim(),
      age: parseInt(form.age, 10),
      gender: form.gender as CitizenProfile["gender"],
      state: form.state.trim(),
      district: form.district.trim(),
      annual_income: parseFloat(form.annual_income) || 0,
      occupation: form.occupation as CitizenProfile["occupation"],
      social_category: form.social_category as CitizenProfile["social_category"],
      disability_status: (form.disability_status || "none") as CitizenProfile["disability_status"],
      family_size: parseInt(form.family_size, 10) || 1,
      has_bpl_card: form.has_bpl_card,
      land_owned_acres: parseFloat(form.land_owned_acres) || 0,
      education_level: form.education_level as CitizenProfile["education_level"],
      gov_id_available: form.gov_id_available,
    };

    if (!isSupabaseConfigured || !supabase) {
      setError("Database service is not available. Please try again later.");
      setLoading(false);
      return;
    }

    try {
      // 1. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.full_name }
        }
      });

      if (authError) throw new Error(authError.message);
      
      // Since email confirmation might have prevented an automatic session, 
      // the DB trigger confirms the email instantly. Now we explicitly sign in:
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (signInError) throw new Error(`Login Error: ${signInError.message}`);
      
      const user = signInData.user;
      if (!user) throw new Error("Failed to authenticate user after signup.");

      // 2. Insert into citizen_profiles
      const { error: dbError } = await supabase.from("citizen_profiles").upsert({
        id: user.id,
        full_name: profile.full_name,
        age: profile.age,
        gender: profile.gender,
        state: profile.state,
        district: profile.district,
        annual_income: profile.annual_income,
        occupation: profile.occupation,
        social_category: profile.social_category,
        disability_status: profile.disability_status,
        family_size: profile.family_size,
        has_bpl_card: profile.has_bpl_card,
        land_owned_acres: profile.land_owned_acres,
        education_level: profile.education_level,
        gov_id_available: profile.gov_id_available
      });

      if (dbError) throw new Error(`Database Error: ${dbError.message}`);

      // 3. Call backend API for eligibility
      const result = await submitIntake(profile);

      // 4. Insert into eligibility_history
      const { error: historyError } = await supabase.from("eligibility_history").insert({
        user_id: user.id,
        request_id: result.request_id,
        results: result
      });

      if (historyError) throw new Error(`History Error: ${historyError.message}`);

      window.location.href = "/dashboard";
    } catch (err: any) {
      const msg = err?.message || (typeof err === "string" ? err : JSON.stringify(err));
      setError(msg === "{}" ? "An unexpected error occurred during sign up." : msg);
      setLoading(false);
    }
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
          <p className="text-slate-300 leading-relaxed">Fill your profile once — our rule engine checks it against 20 real Indian welfare schemes.</p>
          <div className="space-y-3">
            {["No government login required", "100% free to use", "Data stays private — profiles are never stored"].map((item) => (
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
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-16 overflow-y-auto">
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

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ── Step 0: Account ── */}
            {step === 0 && (
              <>
                <div><h1 className="text-2xl font-bold text-navy-900 mb-1">Create your account</h1><p className="text-slate-500 text-sm mb-6">Your access credentials.</p></div>
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-1.5">Full name <span className="text-red-400">*</span></label>
                  <input required value={form.full_name} onChange={e => set("full_name", e.target.value)} placeholder="e.g. Asha Devi" className="field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-1.5">Email address <span className="text-red-400">*</span></label>
                  <input required type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" className="field" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-1.5">Password <span className="text-red-400">*</span></label>
                  <input required type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="At least 8 characters" minLength={8} className="field" />
                </div>
              </>
            )}

            {/* ── Step 1: Profile ── */}
            {step === 1 && (
              <>
                <div><h1 className="text-2xl font-bold text-navy-900 mb-1">Your citizen profile</h1><p className="text-slate-500 text-sm mb-6">Used by the eligibility engine — all fields matter for accurate matching.</p></div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy-900 mb-1.5">Age <span className="text-red-400">*</span></label>
                    <input required type="number" min={0} max={120} value={form.age} onChange={e => set("age", e.target.value)} placeholder="e.g. 34" className="field" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy-900 mb-1.5">Gender <span className="text-red-400">*</span></label>
                    <select required value={form.gender} onChange={e => set("gender", e.target.value)} className="field">
                      <option value="">Select</option>
                      {GENDER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy-900 mb-1.5">State <span className="text-red-400">*</span></label>
                    <select required value={form.state} onChange={e => set("state", e.target.value)} className="field">
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy-900 mb-1.5">District <span className="text-red-400">*</span></label>
                    <input required value={form.district} onChange={e => set("district", e.target.value)} placeholder="e.g. Patna" className="field" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy-900 mb-1.5">Annual Income (₹) <span className="text-red-400">*</span></label>
                    <input required type="number" min={0} value={form.annual_income} onChange={e => set("annual_income", e.target.value)} placeholder="e.g. 90000" className="field" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy-900 mb-1.5">Family Size <span className="text-red-400">*</span></label>
                    <input required type="number" min={1} max={50} value={form.family_size} onChange={e => set("family_size", e.target.value)} placeholder="e.g. 5" className="field" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-1.5">Occupation <span className="text-red-400">*</span></label>
                  <select required value={form.occupation} onChange={e => set("occupation", e.target.value)} className="field">
                    <option value="">Select</option>
                    {OCCUPATION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-1.5">Education Level <span className="text-red-400">*</span></label>
                  <select required value={form.education_level} onChange={e => set("education_level", e.target.value)} className="field">
                    <option value="">Select</option>
                    {EDUCATION_LEVEL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">Social Category <span className="text-red-400">*</span></label>
                  <div className="flex flex-wrap gap-2">
                    {SOCIAL_CATEGORY_OPTIONS.map(o => (
                      <button type="button" key={o.value} onClick={() => set("social_category", o.value)}
                        className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${form.social_category === o.value ? "border-orange-500 bg-orange-50 text-orange-600" : "border-slate-200 text-slate-600 hover:border-orange-300"}`}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-1.5">Disability Status</label>
                  <select value={form.disability_status} onChange={e => set("disability_status", e.target.value)} className="field">
                    {DISABILITY_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy-900 mb-1.5">Land Owned (acres)</label>
                    <input type="number" min={0} step="0.1" value={form.land_owned_acres} onChange={e => set("land_owned_acres", e.target.value)} placeholder="0" className="field" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <label className="flex items-center gap-3 cursor-pointer mt-4">
                      <input type="checkbox" checked={form.has_bpl_card} onChange={e => set("has_bpl_card", e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                      <span className="text-sm font-semibold text-navy-900">Has BPL Card</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* ── Step 2: Documents ── */}
            {step === 2 && (
              <>
                <div><h1 className="text-2xl font-bold text-navy-900 mb-1">Your documents</h1><p className="text-slate-500 text-sm mb-6">Select all government IDs you currently have. This determines your missing documents.</p></div>
                <div className="space-y-3">
                  {GOV_ID_KEYS.map((key) => (
                    <label key={key} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.gov_id_available[key] ? "border-orange-500 bg-orange-50" : "border-slate-200 hover:border-orange-300"}`}>
                      <input type="checkbox" checked={form.gov_id_available[key]} onChange={e => setDoc(key, e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                      <span className="text-xl">{GOV_ID_LABELS[key].icon}</span>
                      <span className="text-sm font-medium text-navy-900">{GOV_ID_LABELS[key].label}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-2">⚠️ Only these 4 documents are used for eligibility matching. More can be uploaded later in the Document Vault.</p>
              </>
            )}

            {/* Navigation */}
            <div className="flex gap-3 pt-2">
              {step > 0 && (
                <button type="button" onClick={handleBack} className="flex-1 py-3 border border-slate-200 text-navy-900 font-semibold rounded-xl hover:bg-slate-50 transition-colors text-sm">
                  Back
                </button>
              )}
              <button type="submit" disabled={loading}
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-orange-500/25 disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
                {loading && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                {loading ? "Checking eligibility…" : step < steps.length - 1 ? "Continue" : "Check My Eligibility"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-500 hover:text-orange-600 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .field {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          font-size: 0.875rem;
          color: #1B2B4B;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .field:focus {
          border-color: #F5842B;
          box-shadow: 0 0 0 3px rgba(245,132,43,0.15);
        }
      `}</style>
    </div>
  );
}
