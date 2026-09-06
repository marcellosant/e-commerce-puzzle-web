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

// Absolute base for OG/canonical URLs, most stable source first.
// VERCEL_URL is deliberately last: it is the per-deployment hostname and
// changes on every push, which would make canonicals point at throwaway
// URLs. VERCEL_PROJECT_PRODUCTION_URL is the stable production domain.
// Set NEXT_PUBLIC_SITE_URL once a custom domain exists.
function resolveSiteUrl(): string {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;

  if (!candidate) return "http://localhost:3000";
  return candidate.startsWith("http") ? candidate : `https://${candidate}`;
}

const siteUrl = resolveSiteUrl();

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
