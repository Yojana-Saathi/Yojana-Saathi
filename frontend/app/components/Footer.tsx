import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white pt-12 pb-8 border-t-4 border-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <svg className="w-7 h-7 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8 2 4 8 4 12c0 2 1.5 4 3 5 1.5 1 4 2 5 4 1-2 3.5-3 5-4 1.5-1 3-3 3-5 0-4-4-10-8-10zm0 18c-1.5-2-4-3-5.5-4-1.5-1-2.5-2.5-2.5-4 0-3 3-8 8-8s8 5 8 8c0 1.5-1 3-2.5 4C16 17 13.5 18 12 20z" />
              </svg>
              <span className="font-bold text-lg text-white">Yojana Saarthi</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              An AI-assisted eligibility engine helping Indian citizens discover and access the government welfare they deserve.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {["Schemes", "Eligibility Check", "Resources", "About"].map((item) => (
                <li key={item}><a href="#" className="hover:text-orange-400 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/login" className="hover:text-orange-400 transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-orange-400 transition-colors">Register</Link></li>
              <li><Link href="/dashboard" className="hover:text-orange-400 transition-colors">Dashboard</Link></li>
              <li><Link href="/profile" className="hover:text-orange-400 transition-colors">My Profile</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                info@yojanasaarthi.gov.in
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                +91 1800-123-4567
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              {["facebook-f", "twitter", "linkedin-in", "youtube"].map((social) => (
                <a key={social} href="#" className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center hover:bg-slate-800 hover:border-slate-600 transition-colors">
                  <i className={`fa-brands fa-${social} text-xs text-slate-400`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2024 Yojana Saarthi. All rights reserved. An assistive tool — not an official government service.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-orange-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-orange-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-orange-400 transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
