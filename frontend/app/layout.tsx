import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

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
      className={`${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-sans text-navy-900 bg-white selection:bg-orange-500 selection:text-white min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
