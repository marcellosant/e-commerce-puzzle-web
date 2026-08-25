"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

export function SearchBox() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { t } = useLocale();

  function submit() {
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/collection?q=${encodeURIComponent(trimmed)}`);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t.search.label}
        className="shrink-0"
      >
        <Search size={18} />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 shrink-0">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder={t.search.placeholder}
        aria-label={t.search.label}
        autoFocus
        className="border border-black px-2 py-1 font-serif text-body bg-white focus:outline-none focus:ring-1 focus:ring-black w-40"
      />
      <button
        type="button"
        onClick={() => {
          setQuery("");
          setOpen(false);
        }}
        aria-label={t.search.label}
      >
        <X size={18} />
      </button>
    </div>
  );
}
