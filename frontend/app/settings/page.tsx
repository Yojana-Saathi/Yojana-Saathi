"use client";
import { useState } from "react";
import Link from "next/link";

type ToggleSetting = { id: string; label: string; description: string; enabled: boolean };

export default function Settings() {
  const [notifications, setNotifications] = useState<ToggleSetting[]>([
    { id: "new_scheme", label: "New Scheme Alerts", description: "Get notified when a new scheme matches your profile.", enabled: true },
    { id: "doc_reminder", label: "Document Reminders", description: "Reminders to upload missing documents.", enabled: true },
    { id: "deadline", label: "Application Deadlines", description: "Alerts before scheme application deadlines.", enabled: false },
    { id: "newsletter", label: "Weekly Digest", description: "A weekly summary of your eligibility status.", enabled: false },
  ]);

  const [privacy, setPrivacy] = useState<ToggleSetting[]>([
    { id: "analytics", label: "Usage Analytics", description: "Help improve Yojana Saarthi with anonymised usage data.", enabled: true },
    { id: "profile_log", label: "Profile Logging", description: "Allow temporary logging of profile data for debugging. (Disabled by default for privacy.)", enabled: false },
  ]);

  const [lang, setLang] = useState("en");
  const [theme, setTheme] = useState("light");

  const toggle = (list: ToggleSetting[], setList: React.Dispatch<React.SetStateAction<ToggleSetting[]>>, id: string) => {
    setList(list.map((s) => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const ToggleRow = ({ item, onToggle }: { item: ToggleSetting; onToggle: () => void }) => (
    <div className="flex items-start justify-between py-4 border-b border-slate-100 last:border-0">
      <div className="pr-6">
        <div className="text-sm font-semibold text-navy-900">{item.label}</div>
        <div className="text-xs text-slate-400 mt-0.5">{item.description}</div>
      </div>
      <button
        onClick={onToggle}
        className={`flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${item.enabled ? "bg-orange-500" : "bg-slate-200"}`}
      >
        <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${item.enabled ? "translate-x-5.5" : "translate-x-0.5"}`} style={{ transform: item.enabled ? "translateX(22px)" : "translateX(2px)" }} />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link href="/dashboard" className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
          </Link>
          <h1 className="font-bold text-navy-900">Settings</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Appearance */}
        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h2 className="font-bold text-navy-900 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
            <span className="text-lg">🎨</span> Appearance
          </h2>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-navy-900 block mb-3">Theme</label>
              <div className="flex gap-3">
                {[
                  { value: "light", label: "Light", icon: "☀️" },
                  { value: "dark", label: "Dark", icon: "🌙" },
                  { value: "system", label: "System", icon: "💻" },
                ].map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm font-medium ${theme === t.value ? "border-orange-500 bg-orange-50 text-orange-600" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}
                  >
                    <span className="text-2xl">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-navy-900 block mb-3">Language</label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="te">తెలుగు (Telugu)</option>
              </select>
              <p className="text-xs text-slate-400 mt-2">Multilingual support is on the roadmap. Currently in English.</p>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h2 className="font-bold text-navy-900 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
            <span className="text-lg">🔔</span> Notifications
          </h2>
          {notifications.map((item) => (
            <ToggleRow key={item.id} item={item} onToggle={() => toggle(notifications, setNotifications, item.id)} />
          ))}
        </section>

        {/* Privacy */}
        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h2 className="font-bold text-navy-900 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
            <span className="text-lg">🔒</span> Privacy & Data
          </h2>
          {privacy.map((item) => (
            <ToggleRow key={item.id} item={item} onToggle={() => toggle(privacy, setPrivacy, item.id)} />
          ))}
          <div className="mt-4 p-4 bg-blue-50 rounded-xl">
            <p className="text-xs text-blue-700 font-semibold mb-1">Data Policy</p>
            <p className="text-xs text-blue-600">Your citizen profile is never stored server-side. All eligibility processing is stateless. We never share personal data with third parties.</p>
          </div>
        </section>

        {/* Account Actions */}
        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h2 className="font-bold text-navy-900 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
            <span className="text-lg">👤</span> Account
          </h2>
          <div className="space-y-3">
            <Link href="/profile" className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors">
              <span className="text-sm font-medium text-navy-900">Edit Profile</span>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
            </Link>
            <Link href="/documents" className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors">
              <span className="text-sm font-medium text-navy-900">Manage Documents</span>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
            </Link>
            <button className="flex items-center justify-between w-full py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors">
              <span className="text-sm font-medium text-navy-900">Change Password</span>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
            </button>
            <div className="border-t border-slate-100 pt-3">
              <button className="flex items-center gap-2 py-3 px-4 rounded-xl hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors w-full text-left">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </section>

        {/* App Info */}
        <div className="text-center py-4 text-xs text-slate-400 space-y-1">
          <p>Yojana Saarthi · v1.0.0</p>
          <p>An assistive discovery tool — not an official government service.</p>
          <div className="flex justify-center gap-3 mt-2">
            <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a>
            <span>·</span>
            <a href="#" className="hover:text-orange-500 transition-colors">Help</a>
          </div>
        </div>
      </main>
    </div>
  );
}
