import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Yojana Saarthi – Schemes Directory",
  description: "Browse and discover 4,700+ government welfare schemes across India.",
};

export default function Schemes() {
  return (
    <>
      {/* BEGIN: Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link className="flex items-center gap-3" href="/">
            <svg className="w-8 h-8 text-orange" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path>
            </svg>
            <span className="text-xl font-bold text-navy">Yojana Saarthi</span>
          </Link>
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600">
            <Link className="hover:text-navy transition-colors" href="/">Home</Link>
            <Link className="text-navy" href="/schemes">Schemes</Link>
            <a className="hover:text-navy transition-colors" href="#">Resources</a>
            <a className="hover:text-navy transition-colors" href="#">About</a>
          </nav>
          {/* CTA */}
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-600">
              <i className="fa-solid fa-bars text-xl"></i>
            </button>
            <a className="hidden sm:inline-flex items-center justify-center bg-orange hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-full transition-colors gap-2" href="#">
              Check Eligibility
              <i className="fa-solid fa-arrow-right text-sm"></i>
            </a>
          </div>
        </div>
      </header>
      {/* END: Header */}

      {/* BEGIN: Main Content */}
      <main className="flex-grow">
        {/* BEGIN: Hero Section */}
        <section className="bg-white relative overflow-hidden pt-16 pb-12 hero-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="w-full md:w-1/2 space-y-6">
              <p className="text-orange font-semibold tracking-wide text-sm uppercase">Find the right scheme for you</p>
              <h1 className="text-4xl md:text-5xl font-bold text-navy leading-tight">
                Explore Government <br /> Schemes
              </h1>
              <div className="relative max-w-2xl mt-8">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fa-solid fa-search text-slate-400 text-lg"></i>
                </div>
                <input className="block w-full pl-12 pr-4 py-4 rounded-xl border-slate-200 focus:ring-navy focus:border-navy shadow-sm text-base" placeholder="Search government schemes..." type="text" />
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center md:justify-end relative h-64 md:h-80">
              {/* The decorative shapes are handled by the hero-bg class */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-navy w-40 h-40 rounded-full flex items-center justify-center z-20">
                <i className="fa-solid fa-search text-white text-6xl"></i>
              </div>
            </div>
          </div>
        </section>
        {/* END: Hero Section */}

        {/* BEGIN: Categories Bar */}
        <section className="bg-white border-b border-slate-200 sticky top-20 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 overflow-x-auto hide-scrollbar flex items-center gap-3">
            <button className="flex-shrink-0 bg-navy text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium text-sm">
              <i className="fa-solid fa-table-cells-large"></i> All Categories
            </button>
            <button className="flex-shrink-0 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium text-sm transition-colors">
              <i className="fa-solid fa-graduation-cap text-orange"></i> Education
            </button>
            <button className="flex-shrink-0 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium text-sm transition-colors">
              <i className="fa-solid fa-heart-pulse text-red-500"></i> Healthcare
            </button>
            <button className="flex-shrink-0 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium text-sm transition-colors">
              <i className="fa-solid fa-briefcase text-purple-500"></i> Business
            </button>
            <button className="flex-shrink-0 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium text-sm transition-colors">
              <i className="fa-solid fa-leaf text-green-500"></i> Agriculture
            </button>
            <button className="flex-shrink-0 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium text-sm transition-colors">
              <i className="fa-solid fa-house text-blue-500"></i> Housing
            </button>
            <button className="flex-shrink-0 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium text-sm transition-colors">
              <i className="fa-solid fa-users text-yellow-500"></i> Social Welfare
            </button>
          </div>
        </section>
        {/* END: Categories Bar */}

        {/* BEGIN: Main Layout Directory */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
          {/* BEGIN: Sidebar Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-8 sticky top-40">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <i className="fa-solid fa-filter text-slate-400"></i>
                <h2 className="text-lg font-bold text-navy">Filter Results</h2>
              </div>

              {/* State Filter */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 font-semibold text-navy">
                  <i className="fa-solid fa-location-dot text-slate-400 text-sm"></i> State
                </label>
                <select className="mt-1 block w-full rounded-lg border-slate-200 py-2.5 pl-3 pr-10 text-base focus:border-navy focus:outline-none focus:ring-navy sm:text-sm">
                  <option>Select State</option>
                  <option>Maharashtra</option>
                  <option>Karnataka</option>
                  <option>Delhi</option>
                </select>
              </div>

              {/* Age Filter */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 font-semibold text-navy">
                  <i className="fa-regular fa-id-card text-slate-400 text-sm"></i> Age
                </label>
                <div className="relative pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500">0</span>
                    <span className="text-xs text-slate-500">100</span>
                  </div>
                  <input className="range-slider" max="100" min="0" type="range" defaultValue="25" />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-medium text-navy">25</span>
                    <span className="text-sm font-medium text-navy">60</span>
                  </div>
                </div>
              </div>

              {/* Income Bracket Filter */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 font-semibold text-navy">
                  <i className="fa-solid fa-wallet text-slate-400 text-sm"></i> Income Bracket
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3">
                    <input defaultChecked className="text-navy focus:ring-navy border-slate-300 w-4 h-4" name="income" type="radio" />
                    <span className="text-slate-600 text-sm">Up to ₹5,000</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input className="text-navy focus:ring-navy border-slate-300 w-4 h-4" name="income" type="radio" />
                    <span className="text-slate-600 text-sm">₹5,001 - ₹30,000</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input className="text-navy focus:ring-navy border-slate-300 w-4 h-4" name="income" type="radio" />
                    <span className="text-slate-600 text-sm">₹30,001 - ₹90,000</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input className="text-navy focus:ring-navy border-slate-300 w-4 h-4" name="income" type="radio" />
                    <span className="text-slate-600 text-sm">Unknown</span>
                  </label>
                </div>
              </div>

              <button className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-navy font-medium rounded-lg flex items-center justify-center gap-2 transition-colors">
                <i className="fa-solid fa-rotate-right"></i> Clear Filters
              </button>
            </div>
          </aside>
          {/* END: Sidebar Filters */}

          {/* BEGIN: Results Grid */}
          <div className="flex-grow">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <p className="text-slate-600">Showing <span className="font-bold text-navy">1-8</span> of <span className="font-bold text-navy">4,700+</span> schemes</p>
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-500 whitespace-nowrap" htmlFor="sort">Sort by:</label>
                <select className="block w-40 rounded-lg border-slate-200 py-1.5 pl-3 pr-10 text-sm focus:border-navy focus:outline-none focus:ring-navy" id="sort">
                  <option>Relevance</option>
                  <option>Newest</option>
                  <option>Popular</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-orange bg-opacity-20 flex items-center justify-center flex-shrink-0 text-orange">
                    <i className="fa-solid fa-graduation-cap text-xl"></i>
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-1 rounded-full bg-orange-50 text-orange text-xs font-semibold mb-2">Education</span>
                    <h3 className="text-lg font-bold text-navy leading-tight">National Scholarship Portal</h3>
                  </div>
                </div>
                <p className="text-slate-600 text-sm mb-6 flex-grow">Financial assistance for students from minority communities.</p>
                <a className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 mt-auto" href="#">
                  View Details <i className="fa-solid fa-arrow-right"></i>
                </a>
              </div>
              {/* Card 2 */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-orange bg-opacity-20 flex items-center justify-center flex-shrink-0 text-orange">
                    <i className="fa-solid fa-book-open text-xl"></i>
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-1 rounded-full bg-orange-50 text-orange text-xs font-semibold mb-2">Education</span>
                    <h3 className="text-lg font-bold text-navy leading-tight">National Scholarship Portal</h3>
                  </div>
                </div>
                <p className="text-slate-600 text-sm mb-6 flex-grow">Financial assistance for students from minority communities.</p>
                <a className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 mt-auto" href="#">
                  View Details <i className="fa-solid fa-arrow-right"></i>
                </a>
              </div>
              {/* Card 3 */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-600">
                    <i className="fa-solid fa-briefcase text-xl"></i>
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-2">Business</span>
                    <h3 className="text-lg font-bold text-navy leading-tight">National Healthcare Committee</h3>
                  </div>
                </div>
                <p className="text-slate-600 text-sm mb-6 flex-grow">Financial assistance for students from minority communities.</p>
                <a className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 mt-auto" href="#">
                  View Details <i className="fa-solid fa-arrow-right"></i>
                </a>
              </div>
              {/* Card 4 */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                    <i className="fa-solid fa-leaf text-xl"></i>
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold mb-2">Agriculture</span>
                    <h3 className="text-lg font-bold text-navy leading-tight">National Healthcare Secondary Portal</h3>
                  </div>
                </div>
                <p className="text-slate-600 text-sm mb-6 flex-grow">Financial assistance for students from minority communities.</p>
                <a className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 mt-auto" href="#">
                  View Details <i className="fa-solid fa-arrow-right"></i>
                </a>
              </div>
              {/* Card 5 */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                    <i className="fa-solid fa-seedling text-xl"></i>
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold mb-2">Agriculture</span>
                    <h3 className="text-lg font-bold text-navy leading-tight">National Fellowhin Scheme</h3>
                  </div>
                </div>
                <p className="text-slate-600 text-sm mb-6 flex-grow">Financial assistance for students from minority communities.</p>
                <a className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 mt-auto" href="#">
                  View Details <i className="fa-solid fa-arrow-right"></i>
                </a>
              </div>
              {/* Card 6 */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 text-yellow-600">
                    <i className="fa-solid fa-users text-xl"></i>
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-semibold mb-2">Social Welfare</span>
                    <h3 className="text-lg font-bold text-navy leading-tight">Government Housing Social Welfare</h3>
                  </div>
                </div>
                <p className="text-slate-600 text-sm mb-6 flex-grow">Financial assistance for students from minority communities.</p>
                <a className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 mt-auto" href="#">
                  View Details <i className="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                <a className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0" href="#">
                  <span className="sr-only">Previous</span>
                  <i className="fa-solid fa-chevron-left h-5 w-5 flex items-center justify-center"></i>
                </a>
                <a aria-current="page" className="relative z-10 inline-flex items-center bg-navy px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy" href="#">1</a>
                <a className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0" href="#">2</a>
                <a className="relative hidden items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 md:inline-flex" href="#">3</a>
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 focus:outline-offset-0">...</span>
                <a className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0" href="#">
                  <span className="sr-only">Next</span>
                  <i className="fa-solid fa-chevron-right h-5 w-5 flex items-center justify-center"></i>
                </a>
              </nav>
            </div>
          </div>
          {/* END: Results Grid */}
        </section>
        {/* END: Main Layout Directory */}
      </main>
      {/* END: Main Content */}

      {/* BEGIN: Footer */}
      <footer className="bg-navy text-slate-300 py-12 border-t-4 border-orange">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand Info */}
            <div className="space-y-4">
              <a className="flex items-center gap-3" href="#">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path>
                </svg>
                <span className="text-xl font-bold text-white">Yojana Saarthi</span>
              </a>
              <p className="text-sm leading-relaxed">
                Empowering citizens to discover and access the benefits they deserve.
              </p>
            </div>
            {/* Links Grid */}
            <div className="grid grid-cols-2 col-span-1 md:col-span-2 gap-8">
              <div>
                <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><a className="hover:text-white transition-colors" href="#">Schemes</a></li>
                  <li><a className="hover:text-white transition-colors" href="#">Eligibility</a></li>
                  <li><a className="hover:text-white transition-colors" href="#">Resources</a></li>
                  <li><a className="hover:text-white transition-colors" href="#">About</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li><a className="hover:text-white transition-colors" href="#">FAQs</a></li>
                  <li><a className="hover:text-white transition-colors" href="#">How It Works</a></li>
                  <li><a className="hover:text-white transition-colors" href="#">Grievance Redressal</a></li>
                  <li><a className="hover:text-white transition-colors" href="#">Help Center</a></li>
                </ul>
              </div>
            </div>
            {/* Contact & Newsletter */}
            <div className="space-y-6">
              <div>
                <h4 className="text-white font-semibold mb-4">Contact Info</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2"><i className="fa-regular fa-envelope"></i> info@yojanaSaarthi.gov.in</li>
                  <li className="flex items-center gap-2"><i className="fa-solid fa-phone"></i> +91 1800-123-4567</li>
                </ul>
                <div className="flex gap-4 mt-4">
                  <a className="w-8 h-8 rounded-full border border-slate-600 flex items-center justify-center hover:bg-slate-800 transition-colors" href="#"><i className="fa-brands fa-facebook-f text-sm"></i></a>
                  <a className="w-8 h-8 rounded-full border border-slate-600 flex items-center justify-center hover:bg-slate-800 transition-colors" href="#"><i className="fa-brands fa-twitter text-sm"></i></a>
                  <a className="w-8 h-8 rounded-full border border-slate-600 flex items-center justify-center hover:bg-slate-800 transition-colors" href="#"><i className="fa-brands fa-linkedin-in text-sm"></i></a>
                  <a className="w-8 h-8 rounded-full border border-slate-600 flex items-center justify-center hover:bg-slate-800 transition-colors" href="#"><i className="fa-brands fa-youtube text-sm"></i></a>
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Stay Updated</h4>
                <p className="text-xs mb-3">Subscribe to our newsletter for the latest updates and new schemes.</p>
                <form className="flex">
                  <input className="w-full px-3 py-2 rounded-l-md text-slate-900 text-sm focus:outline-none" placeholder="Enter your email" type="email" />
                  <button className="bg-orange hover:bg-orange-600 px-4 py-2 rounded-r-md text-white transition-colors" type="submit">
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-xs flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2024 Yojana Saarthi. All rights reserved.</p>
            <div className="flex gap-4">
              <a className="hover:text-white transition-colors" href="#">Privacy Policy</a>
              <span className="text-slate-600">|</span>
              <a className="hover:text-white transition-colors" href="#">Terms of Service</a>
              <span className="text-slate-600">|</span>
              <a className="hover:text-white transition-colors" href="#">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
      {/* END: Footer */}
    </>
  );
}
