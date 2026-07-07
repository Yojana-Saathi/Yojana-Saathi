import Head from "next/head";

export default function SchemeDetails() {
  return (
    <>
      <Head>
        <title>Yojana Saarthi - Scheme Details</title>
      </Head>
      {/* TopNavBar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm py-4">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl flex items-center justify-between">
          {/* Logo */}
          <a className="flex items-center gap-2 group" href="/">
            <svg className="w-8 h-8 text-orange-500 group-hover:scale-105 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8 2 4 8 4 12c0 2 1.5 4 3 5 1.5 1 4 2 5 4 1-2 3.5-3 5-4 1.5-1 3-3 3-5 0-4-4-10-8-10zm0 18c-1.5-2-4-3-5.5-4-1.5-1-2.5-2.5-2.5-4 0-3 3-8 8-8s8 5 8 8c0 1.5-1 3-2.5 4C16 17 13.5 18 12 20z"></path>
              <circle cx="12" cy="11" fill="#1B2B4B" r="2"></circle>
            </svg>
            <span className="text-xl font-bold tracking-tight text-navy-900">Yojana Saarthi</span>
          </a>
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-gray-600">
            <a className="hover:text-orange-500 transition-colors" href="/schemes">Schemes</a>
            <a className="hover:text-orange-500 transition-colors" href="#">Eligibility</a>
            <a className="hover:text-orange-500 transition-colors" href="#">Resources</a>
            <a className="hover:text-orange-500 transition-colors" href="#">About</a>
          </nav>
          {/* CTA */}
          <a className="hidden md:inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20" href="#">
            Check Eligibility
          </a>
          {/* Mobile Menu Button (Hidden on Desktop) */}
          <button className="md:hidden p-2 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
          </button>
        </div>
      </header>

      <main className="flex-grow">
        {/* Split Hero Section */}
        <section className="bg-white border-b border-gray-200">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Details */}
              <div>
                <a className="inline-flex items-center gap-2 text-navy-800 font-semibold hover:text-orange-500 transition-colors mb-8" href="/schemes">
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Back to Schemes
                </a>
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Education</span>
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    <span className="material-symbols-outlined text-base filled">check_circle</span>
                    95% Match
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight mb-4">
                  National Scholarship Portal (NSP) Pre-Matric
                </h1>
                <p className="text-lg text-gray-600 flex items-center gap-2 mb-8">
                  <span className="material-symbols-outlined text-gray-400">account_balance</span>
                  Ministry of Minority Affairs, Government of India
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-md shadow-orange-500/20">
                    Apply Now
                  </button>
                  <button className="bg-white border-2 border-navy-900 text-navy-900 hover:bg-navy-50 font-semibold py-3 px-8 rounded-full transition-colors">
                    Save for Later
                  </button>
                </div>
              </div>
              {/* Right: Hero Image */}
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="Student studying with laptop" className="w-full h-auto object-cover max-h-[500px]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHV2xY4t2BUEXmM2ojE65mYqozI2jaqKHWpfjFO9xJbQ0K_pYbF92zsC6GOhzxt7b2QvwpmHir-hOl3H9Hyak3EV8gHRPcYupv-bTjMzTE92MRjcewm6ATf-tbKFjX_DENj8dThJKZec8uGPN4Kc7FcU55iforFudSyjD7zyvz9y7tvqbLGIqFmctn73MhDt7ewqYSk868_iCVbXE0JnPkriHP1Unk68AR5D_vqe2HLWenjj2BUcudte9u5iPutHP3O8sKdxgccg" />
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Benefit Summary */}
            <div className="bg-orange-50 rounded-2xl p-8 border border-orange-100 shadow-sm">
              <h2 className="text-2xl font-bold text-navy-900 mb-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-orange-500 text-3xl">payments</span>
                Benefit Summary
              </h2>
              <p className="text-lg text-gray-800 leading-relaxed">
                Eligible students receive financial assistance up to <strong className="text-navy-900">₹10,000 per annum</strong> to cover admission fees, tuition fees, and maintenance allowances for classes 1 to 10.
              </p>
            </div>
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-navy-900 mb-4 border-b border-gray-200 pb-2">About the Scheme</h2>
              <div className="prose prose-lg text-gray-700 max-w-none">
                <p>The Pre-Matric Scholarship Scheme aims to encourage parents from minority communities to send their school-going children to school, lighten their financial burden on school education, and sustain their efforts to...</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
