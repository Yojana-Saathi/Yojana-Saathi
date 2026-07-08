import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yojana Saarthi – Find Every Scheme You Deserve",
  description: "AI-assisted eligibility engine that helps Indian citizens discover government welfare schemes they qualify for — with missing documents and application drafts.",
  keywords: ["government schemes", "welfare", "eligibility", "India", "scholarships", "PM-KISAN", "Ayushman Bharat"],
  icons: {
    icon: "/media/logo.png",
    shortcut: "/media/logo.png",
    apple: "/media/logo.png",
  },
  openGraph: {
    title: "Yojana Saarthi",
    description: "Unlock your right to government benefits.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="antialiased"
    >
      <head>
        {/* Font Awesome and Material Symbols removed — they loaded ~500KB of CSS/fonts on every page.
            Use inline SVGs (already in use throughout the app) or install @fortawesome/react-fontawesome if needed. */}
      </head>
      <body className="font-sans text-navy-900 bg-white selection:bg-orange-500 selection:text-white min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
