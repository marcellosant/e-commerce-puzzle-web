import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-sans uppercase text-nav bg-white border border-black px-2 py-1",
        className
      )}
    >
      {children}
    </span>
  );
}
