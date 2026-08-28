import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import LenisProvider from "@/components/ui/LenisProvider";
import WebMCPProvider from "@/components/WebMCPProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: "Narciso III Javier | Portfolio",
  description: "Computer Science student specializing in scalable system architecture, containerization, and AI workflow automation. View projects, skills, and experience.",
  keywords: ["Narciso Javier", "Portfolio", "Computer Science", "Software Developer", "Full Stack", "Docker", "AI", "Python", "Go", "Next.js"],
  authors: [{ name: "Narciso III Javier" }],
  creator: "Narciso III Javier",
  metadataBase: new URL("https://narcisojavier.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://narcisojavier.vercel.app",
    siteName: "Narciso III Javier Portfolio",
    title: "Narciso III Javier | Portfolio",
    description: "Computer Science student specializing in scalable system architecture, containerization, and AI workflow automation.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Narciso III Javier - Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Narciso III Javier | Portfolio",
    description: "Computer Science student specializing in scalable system architecture, containerization, and AI workflow automation.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body className="min-h-full">
        <WebMCPProvider />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
