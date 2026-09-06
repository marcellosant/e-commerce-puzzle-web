import type { Metadata } from "next";
import { NotFoundView } from "@/components/layout/NotFoundView";

// Kept as a server component purely so it can export metadata; the visible
// half lives in NotFoundView, which needs the locale from client context.
export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return <NotFoundView />;
}
