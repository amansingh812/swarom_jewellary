import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Swarom — Personalized 925 Silver Jewellery",
  description:
    "Swarom is launching soon. Personalized 925 sterling silver jewellery, handcrafted in Bengaluru. Your story, made to last.",
  metadataBase: new URL("https://swarom.in"),
  openGraph: {
    title: "Swarom — Personalized 925 Silver Jewellery",
    description:
      "Personalized 925 sterling silver jewellery, handcrafted in Bengaluru. Launching soon.",
    url: "https://swarom.in",
    siteName: "Swarom",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Swarom — Personalized 925 Silver Jewellery",
    description:
      "Personalized 925 sterling silver jewellery, handcrafted in Bengaluru. Launching soon.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#F6F1EA",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="grain">{children}</body>
    </html>
  );
}
