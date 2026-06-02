import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { PeekingFooter } from "@/components/layout/PeekingFooter";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "a tiny tofu — Cute art events & shops in Melbourne",
    template: "%s | a tiny tofu",
  },
  description:
    "Discover cute art events and kawaii shops in Melbourne. Browse events by month, explore the map, and find Monchhichi, desserts, brunch, and Smiskis.",
  openGraph: {
    title: "a tiny tofu",
    description: "Cute art events and shops across Melbourne.",
    locale: "en_AU",
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
      className={`${fredoka.variable} ${nunito.variable} h-full`}
    >
      <body className="flex min-h-full flex-col font-body antialiased">
        <Header />
        <main className="flex flex-1 flex-col px-4 pb-8">{children}</main>
        <PeekingFooter />
      </body>
    </html>
  );
}
