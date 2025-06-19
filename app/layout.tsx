import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LoadingModal } from "./components/main/LoadingModal";
import Providers from "./components/Privy";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rust Undead | Know Solana Through Battle",
  description:
    "Master Solana fundamentals by forging undead warriors and battling other learners. Knowledge feeds your warriors, wisdom wins battles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#2a2a2a] text-gray-100 min-h-screen`}
      >
        <Providers>
          <LoadingModal />
          {children}
        </Providers>
      </body>
    </html>
  );
}
