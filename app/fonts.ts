import { Cormorant_Garamond, Inter, Vazirmatn } from "next/font/google";

// Sophisticated serif for oversized editorial headings.
export const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif-var",
  display: "swap",
});

// Clean sans-serif for body and interface text.
export const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans-var",
  display: "swap",
});

// Beautiful, readable Persian typeface for Farsi.
export const farsi = Vazirmatn({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-farsi-var",
  display: "swap",
});
