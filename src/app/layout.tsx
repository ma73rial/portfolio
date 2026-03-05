import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Cursor from "@/components/Cursor";
import OfflineManager from "@/components/OfflineManager";
import PageLoader from "@/components/PageLoader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Max Pezzullo — Systems Engineer",
  description:
    "I build high-performance systems to replace inefficient infrastructure. Distributed systems, zero-copy architectures, and sub-millisecond pipelines.",
  openGraph: {
    title: "Max Pezzullo — Systems Engineer",
    description: "I build high-performance systems to replace inefficient infrastructure.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} bg-navy-900 text-slate-200 antialiased`}
      >
        {/* Page loader — React-owned, dismissed on hydration */}
        <PageLoader />
        {/* Route transition loading bar */}
        <div id="route-loader" aria-hidden="true" />
        {/* Animated scan line */}
        <div className="scanline" aria-hidden />
        {/* CSS scroll-timeline progress bar */}
        <div className="scroll-progress" aria-hidden />
        {/* Custom cursor */}
        <Cursor />
        {/* Offline caching / PWA */}
        <OfflineManager />
        {/* Navigation */}
        <Nav />
        {/* Page content */}
        {children}
      </body>
    </html>
  );
}
