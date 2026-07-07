"use client";
import { useState } from "react";
import Link from "next/link";

const profileData = {
  name: "Asha Devi",
  email: "asha.devi@example.com",
  phone: "+91 98765 43210",
  age: 34,
  gender: "Female",
  state: "Bihar",
  district: "Patna",
  occupation: "Farmer",
  socialCategory: "OBC",
  annualIncome: "₹90,000",
  familySize: 5,
  landOwned: "1.5 acres",
  hasBPL: true,
  educationLevel: "Secondary (10th Pass)",
};

const activityLog = [
  { action: "Eligibility check run", time: "Today, 4:23 PM", icon: "🔍", color: "blue" },
  { action: "Ayushman Bharat draft generated", time: "Today, 4:25 PM", icon: "📝", color: "orange" },
  { action: "Aadhaar Card uploaded", time: "Yesterday, 10:12 AM", icon: "📤", color: "green" },
  { action: "Profile created", time: "2 days ago", icon: "✅", color: "green" },
];

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profileData.name);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link href="/dashboard" className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
          </Link>
          <h1 className="font-bold text-navy-900">My Profile</h1>
          <div className="ml-auto">
            <button
              onClick={() => setEditing(!editing)}
              className={`text-sm font-semibold px-4 py-1.5 rounded-full transition-colors ${editing ? "bg-green-500 text-white" : "bg-orange-50 text-orange-500 hover:bg-orange-100"}`}
            >
              {editing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Avatar Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col items-center text-center shadow-sm">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-orange-500/20 mb-4">
                AD
              </div>
              {editing ? (
                <input value={name} onChange={(e) => setName(e.target.value)} className="text-lg font-bold text-navy-900 text-center border-b border-orange-400 focus:outline-none w-full mb-1" />
              ) : (
                <h2 className="text-xl font-bold text-navy-900 mb-1">{name}</h2>
              )}
              <p className="text-slate-500 text-sm">{profileData.email}</p>
              <div className="mt-4 flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Profile Verified
              </div>
              <button className="mt-4 text-xs text-slate-400 hover:text-orange-500 transition-colors">Change photo</button>
            </div>

            {/* Eligibility Summary */}
            <div className="bg-navy-900 rounded-2xl p-5 text-white shadow-sm">
              <h3 className="font-bold text-sm mb-4 text-orange-300 uppercase tracking-wide">Eligibility Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Eligible Schemes</span>
                  <span className="font-bold text-orange-400">4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Total Value</span>
                  <span className="font-bold text-orange-400">₹11.6K+/yr</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Avg Match Score</span>
                  <span className="font-bold text-orange-400">88%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">Docs Uploaded</span>
                  <span className="font-bold text-orange-400">3 / 6</span>
                </div>
              </div>
              <Link href="/dashboard" className="mt-4 block text-center bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 rounded-full transition-colors">
                View Dashboard
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Details */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-bold text-navy-900 mb-5 pb-3 border-b border-slate-100">Personal Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: "Full Name", value: name, key: "name" },
                  { label: "Age", value: profileData.age.toString() },
                  { label: "Gender", value: profileData.gender },
                  { label: "State", value: profileData.state },
                  { label: "District", value: profileData.district },
                  { label: "Occupation", value: profileData.occupation },
                  { label: "Social Category", value: profileData.socialCategory },
                  { label: "Annual Income", value: profileData.annualIncome },
                  { label: "Family Size", value: profileData.familySize.toString() },
                  { label: "Land Owned", value: profileData.landOwned },
                  { label: "Education Level", value: profileData.educationLevel },
                  { label: "BPL Status", value: profileData.hasBPL ? "Yes – BPL Card Holder" : "No" },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{field.label}</label>
                    {editing ? (
                      <input
                        defaultValue={field.value}
                        className="mt-1 block w-full text-sm text-navy-900 font-medium border-b border-slate-200 focus:border-orange-400 focus:outline-none py-1 bg-transparent"
                      />
                    ) : (
                      <div className="mt-1 text-sm font-medium text-navy-900">{field.value}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-bold text-navy-900 mb-5 pb-3 border-b border-slate-100">Contact Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</label>
                  <div className="mt-1 text-sm font-medium text-navy-900">{profileData.email}</div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone</label>
                  <div className="mt-1 text-sm font-medium text-navy-900">{profileData.phone}</div>
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-bold text-navy-900 mb-5 pb-3 border-b border-slate-100">Recent Activity</h3>
              <div className="space-y-4">
                {activityLog.map((log, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="text-xl w-8 text-center">{log.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-navy-900">{log.action}</div>
                      <div className="text-xs text-slate-400">{log.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-sm">
              <h3 className="font-bold text-red-600 mb-3">Danger Zone</h3>
              <p className="text-sm text-slate-500 mb-4">Deleting your account will permanently remove all your data, documents, and eligibility history.</p>
              <button className="text-sm font-semibold text-red-500 hover:text-red-600 border border-red-200 hover:border-red-400 px-4 py-2 rounded-lg transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
