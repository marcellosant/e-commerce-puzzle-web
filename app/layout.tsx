import type { Metadata } from "next";
import { Archivo_Narrow, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { BottomNavBar } from "@/components/layout/BottomNavBar";
import { SkipLink } from "@/components/layout/SkipLink";

const archivoNarrow = Archivo_Narrow({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-archivo-narrow",
});

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-source-serif",
});

// Absolute base for OG/canonical URLs. Vercel injects VERCEL_URL per deployment;
// NEXT_PUBLIC_SITE_URL overrides it once a custom domain exists.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Puzzle — Eyewear",
    template: "%s — Puzzle",
  },
  description: "Minimalist editorial eyewear.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivoNarrow.variable} ${sourceSerif4.variable} h-full`}
    >
      <body
        className="min-h-full flex flex-col font-serif"
        suppressHydrationWarning
      >
        <Providers>
          <SkipLink />
          <Header />
          <main id="main-content" className="flex-1 pb-20 lg:pb-0">{children}</main>
          <BottomNavBar />
        </Providers>
      </body>
    </html>
  );
}
