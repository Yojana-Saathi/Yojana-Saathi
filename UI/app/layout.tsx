import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yojana Sentinel - Desktop Landing Page",
  description: "Unlock Your Right to Benefits",
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
    >
      <body className="font-sans text-navy-900 bg-white selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
