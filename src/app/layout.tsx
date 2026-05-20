import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Serif_Display, Lato } from "next/font/google";
import { IBM_Plex_Sans } from "next/font/google";
import { Header } from "@/components/layout/header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const landingDisplay = DM_Serif_Display({
  variable: "--font-landing-display",
  subsets: ["latin"],
  weight: ["400"],
});

const landingBody = Lato({
  variable: "--font-landing-body",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "SoilProve — Field-specific fertilizer prescriptions",
  description:
    "Transparent corn fertilizer prescriptions backed by USDA soil data, crop economics, and peer validation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${plexSans.variable} ${landingDisplay.variable} ${landingBody.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F4EFE4] text-[#123524]">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
