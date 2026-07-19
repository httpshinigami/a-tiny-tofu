import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/layout/Header";
import { PeekingFooter } from "@/components/layout/PeekingFooter";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "World of Tiny Tofu — Melbourne's cutest hidden gems",
    template: "%s | World of Tiny Tofu",
  },
  description:
    "Discover local artist markets, collectible shops, themed events, and whimsical experiences across Melbourne.",
  openGraph: {
    title: "World of Tiny Tofu",
    description:
      "Explore Melbourne's cutest hidden gems — markets, cafes, shops, and events.",
    locale: "en_AU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-surface font-body antialiased">
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <PeekingFooter />
        <SpeedInsights />
      </body>
    </html>
  );
}
