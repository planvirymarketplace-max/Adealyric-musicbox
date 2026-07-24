import type { Metadata } from "next";
import { Fraunces, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "500", "700", "900"],
  opticalSize: "auto",
});

const interTight = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Adea Lyric — Sound of West Philly",
  description:
    "Adea Lyric — soul artist from West Philadelphia. Raw, unapologetic, defining her own sound since 2017.",
  keywords: ["Adea Lyric", "West Philly", "Neo-Soul", "Music", "R&B", "Philly"],
  authors: [{ name: "Adea Lyric" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Adea Lyric — Sound of West Philly",
    description: "Raw, soulful, unapologetic. The official home of Adea Lyric.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adea Lyric — Sound of West Philly",
    description: "She isn't chasing a sound. She is the sound.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body
        className={`${fraunces.variable} ${interTight.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
