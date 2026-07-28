import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/lib/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adea Lyric — One Platform, Every Connection",
  description: "Music industry operations platform for fans, labels, sync agents, booking agents, and writers. Stream, license, collaborate, and manage.",
  keywords: ["music", "sync licensing", "distribution", "royalty", "metadata", "DDEX", "fan club", "booking", "Adea Lyric"],
  authors: [{ name: "Adea Lyric" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Adea Lyric",
    description: "One platform, every connection — music industry operations",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adea Lyric",
    description: "Music industry operations platform",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
