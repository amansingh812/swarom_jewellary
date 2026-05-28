import type { Metadata, Viewport } from "next";
import { Playfair_Display, Montserrat, Great_Vibes } from "next/font/google";
import "./globals.css";

const serif = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Montserrat({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const script = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Swarom — Personalized 925 Silver Jewellery",
    template: "%s · Swarom",
  },
  description:
    "Personalized 925 sterling silver jewellery, handcrafted in Bengaluru. Made to order. Made to last.",
  metadataBase: new URL("https://swarom.in"),
  openGraph: {
    title: "Swarom — Personalized 925 Silver Jewellery",
    description:
      "Personalized 925 sterling silver jewellery, handcrafted in Bengaluru.",
    url: "https://swarom.in",
    siteName: "Swarom",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Swarom — Personalized 925 Silver Jewellery",
    description:
      "Personalized 925 sterling silver jewellery, handcrafted in Bengaluru.",
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#F6F1EA",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${script.variable}`}
    >
      <body className="swr-grain">{children}</body>
    </html>
  );
}
