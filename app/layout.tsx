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

export const metadata: Metadata = {
  title: "Puzzle — Eyewear",
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
