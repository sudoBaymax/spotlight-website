import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Spotlight | Speed-to-lead for real estate teams",
  description:
    "AI that answers your team's real estate leads in under 60 seconds, books qualified appointments, and writes them to your CRM.",
  metadataBase: new URL("https://spotlight.ai"),
  openGraph: {
    title: "Spotlight | Speed-to-lead for real estate teams",
    description:
      "AI that answers your team's real estate leads in under 60 seconds, books qualified appointments, and writes them to your CRM.",
    type: "website",
    siteName: "Spotlight",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
