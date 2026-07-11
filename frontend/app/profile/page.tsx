"use client";

import { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const tabs = ["Personal", "Location", "Economic", "Account"];

export default function ProfilePage() {
  const [tab, setTab] = useState(0);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar isSignedIn={true} />
      <main className="flex-1 bg-gradient-to-b from-white to-warm-paper">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
          {/* Header with avatar */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
            <div className="group relative">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-signal-orange/20 to-signal-orange/5 ring-2 ring-signal-orange/20">
                <span className="text-2xl font-bold text-signal-orange">RK</span>
              </div>
              <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-ink-navy text-white shadow-sm transition-transform hover:scale-105">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                  <path d="M17 3a2.85 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-ink-navy">Ravi Kumar</h1>
              <p className="mt-0.5 text-sm text-slate-blue">ravi@example.com</p>
              <p className="mt-1 text-xs text-slate-blue-400">Member since July 2026</p>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="mt-8 flex gap-1 rounded-lg bg-ink-navy/5 p-1">
            {tabs.map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(i)}
                className={cn(
                  "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all",
                  tab === i ? "bg-white text-ink-navy shadow-sm" : "text-slate-blue hover:text-ink-navy"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-5">
            {/* Personal tab */}
            {tab === 0 && (
              <div className="rounded-2xl border border-ink-navy/10 bg-white p-6 shadow-sm">
                <h2 className="font-display text-lg font-semibold text-ink-navy">Personal information</h2>
                <p className="mt-1 text-sm text-slate-blue">This data determines which schemes you qualify for.</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Input label="Full name" defaultValue="Ravi Kumar" />
                  <Input label="Date of birth" type="date" defaultValue="1995-03-15" />
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-ink-navy">Gender</label>
                    <select defaultValue="male" className="block w-full rounded-lg border-2 border-ink-navy/15 bg-white px-3.5 py-2.5 text-sm text-ink-navy focus:border-signal-orange focus:outline-none">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="transgender">Transgender</option>
                    </select>
                  </div>
                  <Input label="Phone number" type="tel" defaultValue="+91 98765 43210" />
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-ink-navy">Social category</label>
                    <select defaultValue="obc" className="block w-full rounded-lg border-2 border-ink-navy/15 bg-white px-3.5 py-2.5 text-sm text-ink-navy focus:border-signal-orange focus:outline-none">
                      <option value="general">General</option>
                      <option value="obc">OBC</option>
                      <option value="sc">SC</option>
                      <option value="st">ST</option>
                      <option value="ews">EWS</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-ink-navy">Marital status</label>
                    <select defaultValue="married" className="block w-full rounded-lg border-2 border-ink-navy/15 bg-white px-3.5 py-2.5 text-sm text-ink-navy focus:border-signal-orange focus:outline-none">
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="widowed">Widowed</option>
                      <option value="divorced">Divorced</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Location tab */}
            {tab === 1 && (
              <div className="rounded-2xl border border-ink-navy/10 bg-white p-6 shadow-sm">
                <h2 className="font-display text-lg font-semibold text-ink-navy">Location</h2>
                <p className="mt-1 text-sm text-slate-blue">State and district determine your state-specific scheme eligibility.</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-ink-navy">State</label>
                    <select defaultValue="odisha" className="block w-full rounded-lg border-2 border-ink-navy/15 bg-white px-3.5 py-2.5 text-sm text-ink-navy focus:border-signal-orange focus:outline-none">
                      <option value="odisha">Odisha</option>
                      <option value="mp">Madhya Pradesh</option>
                      <option value="up">Uttar Pradesh</option>
                      <option value="bihar">Bihar</option>
                      <option value="wb">West Bengal</option>
                      <option value="mh">Maharashtra</option>
                      <option value="ka">Karnataka</option>
                      <option value="tn">Tamil Nadu</option>
                    </select>
                  </div>
                  <Input label="District" defaultValue="Khordha" />
                  <Input label="City / Village" defaultValue="Bhubaneswar" />
                  <Input label="PIN code" defaultValue="751001" />
                  <div className="sm:col-span-2">
                    <Input label="Residential address" defaultValue="123, Unit-3, Kalinga Nagar" />
                  </div>
                </div>
              </div>
            )}

            {/* Economic tab */}
            {tab === 2 && (
              <div className="rounded-2xl border border-ink-navy/10 bg-white p-6 shadow-sm">
                <h2 className="font-display text-lg font-semibold text-ink-navy">Economic indicators</h2>
                <p className="mt-1 text-sm text-slate-blue">Used for means-tested scheme eligibility calculations.</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Input label="Annual household income (₹)" type="number" defaultValue="300000" hint="Total income from all sources" />
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-ink-navy">Occupation</label>
                    <select defaultValue="farmer" className="block w-full rounded-lg border-2 border-ink-navy/15 bg-white px-3.5 py-2.5 text-sm text-ink-navy focus:border-signal-orange focus:outline-none">
                      <option value="farmer">Farmer</option>
                      <option value="labourer">Agricultural labourer</option>
                      <option value="daily">Daily wage worker</option>
                      <option value="govt">Government employee</option>
                      <option value="private">Private sector</option>
                      <option value="self">Self-employed</option>
                      <option value="student">Student</option>
                      <option value="homemaker">Homemaker</option>
                      <option value="unemployed">Unemployed</option>
                      <option value="retired">Retired</option>
                    </select>
                  </div>
                  <Input label="Number of dependents" type="number" defaultValue="4" />
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-ink-navy">Housing type</label>
                    <select defaultValue="owned" className="block w-full rounded-lg border-2 border-ink-navy/15 bg-white px-3.5 py-2.5 text-sm text-ink-navy focus:border-signal-orange focus:outline-none">
                      <option value="owned">Owned house</option>
                      <option value="rented">Rented</option>
                      <option value="kutcha">Kutcha house</option>
                      <option value="homeless">Homeless</option>
                    </select>
                  </div>
                </div>
                <div className="mt-5 space-y-3 border-t border-ink-navy/10 pt-5">
                  <label className="flex items-center gap-3 rounded-lg bg-warm-paper/50 px-4 py-3">
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-ink-navy/20 text-signal-orange focus:ring-signal-orange" />
                    <span className="text-sm text-ink-navy">BPL (Below Poverty Line) ration card holder</span>
                  </label>
                  <label className="flex items-center gap-3 rounded-lg bg-warm-paper/50 px-4 py-3">
                    <input type="checkbox" className="h-4 w-4 rounded border-ink-navy/20 text-signal-orange focus:ring-signal-orange" />
                    <span className="text-sm text-ink-navy">Certified disability (40% or more)</span>
                  </label>
                </div>
              </div>
            )}

            {/* Account tab */}
            {tab === 3 && (
              <div className="space-y-5">
                <div className="rounded-2xl border border-ink-navy/10 bg-white p-6 shadow-sm">
                  <h2 className="font-display text-lg font-semibold text-ink-navy">Account security</h2>
                  <p className="mt-1 text-sm text-slate-blue">Manage your email and password.</p>
                  <div className="mt-5 space-y-4">
                    <Input label="Email" type="email" defaultValue="ravi@example.com" />
                    <div className="flex gap-3">
                      <Button size="sm">Update email</Button>
                      <Button variant="outline" size="sm">Change password</Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-ink-navy/10 bg-white p-6 shadow-sm">
                  <h2 className="font-display text-lg font-semibold text-ink-navy">Notifications</h2>
                  <p className="mt-1 text-sm text-slate-blue">Get notified when new schemes match your profile.</p>
                  <div className="mt-4 space-y-3">
                    {[
                      { label: "Email notifications", desc: "New matches, deadline reminders" },
                      { label: "SMS alerts", desc: "Critical deadline reminders only" },
                    ].map((item) => (
                      <label key={item.label} className="flex items-center justify-between rounded-lg bg-warm-paper/50 px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-ink-navy">{item.label}</p>
                          <p className="text-xs text-slate-blue-400">{item.desc}</p>
                        </div>
                        <div className="relative inline-flex h-6 w-10 cursor-pointer items-center rounded-full bg-signal-orange transition-colors">
                          <span className="inline-block h-4 w-4 translate-x-5 transform rounded-full bg-white shadow-sm transition-transform" />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-caution-amber/20 bg-white p-6 shadow-sm">
                  <h2 className="font-display text-lg font-semibold text-ink-navy">Danger zone</h2>
                  <p className="mt-1 text-sm text-slate-blue">Irreversible actions — proceed with caution.</p>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="border-caution-amber/30 text-caution-amber hover:bg-caution-amber/5">
                      Delete account
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Save bar */}
            <div className="sticky bottom-0 flex items-center justify-between rounded-2xl border border-ink-navy/10 bg-white/95 p-4 shadow-lg backdrop-blur-sm">
              <p className="text-xs text-slate-blue-400">Changes will re-run eligibility matching against all schemes.</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Cancel</Button>
                <Button size="sm">Save changes</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
