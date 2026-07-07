import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "IT HUNKS | Websites, Mobile Apps & AI Solutions",
    template: "%s | IT HUNKS",
  },
  description:
    "IT HUNKS builds premium websites, scalable mobile apps, AI integrations, and search-ready digital experiences for growing businesses.",
  keywords: [
    "software development agency",
    "website development",
    "mobile app development",
    "AI integration",
    "UI UX design",
  ],
  authors: [{ name: "IT HUNKS" }],
  creator: "IT HUNKS",
  applicationName: "IT HUNKS",
  category: "technology",
  openGraph: {
    type: "website",
    siteName: "IT HUNKS",
    title: "IT HUNKS | Websites, Mobile Apps & AI Solutions",
    description:
      "Premium websites, scalable mobile apps, AI integrations, and search-ready digital experiences for growing businesses.",
  },
  twitter: {
    card: "summary_large_image",
    title: "IT HUNKS | Websites, Mobile Apps & AI Solutions",
    description: "Premium digital products engineered for business growth.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#050505]">
      <body className={`${inter.variable} ${space.variable}`}>
        {children}
      </body>
    </html>
  );
}
