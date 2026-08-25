"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    setActiveIndex(index);
  }

  return (
    <div>
      {/* Mobile: swipeable carousel */}
      <div className="lg:hidden">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory border border-black"
        >
          {images.map((src, i) => (
            <div
              key={src}
              className="relative aspect-square w-full shrink-0 snap-center bg-surface-muted"
            >
              <Image
                src={src}
                alt={`${alt} — image ${i + 1}`}
                fill
                sizes="100vw"
                priority={i === 0}
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-3">
          {images.map((src, i) => (
            <span
              key={src}
              className={cn(
                "h-2 w-2 rounded-full border border-black",
                i === activeIndex ? "bg-black" : "bg-white"
              )}
            />
          ))}
        </div>
      </div>

      {/* Desktop: vertical stack */}
      <div className="hidden lg:flex lg:flex-col lg:gap-4">
        {images.map((src, i) => (
          <div
            key={src}
            className="relative aspect-square w-full bg-surface-muted border border-black"
          >
            <Image
              src={src}
              alt={`${alt} — image ${i + 1}`}
              fill
              sizes="50vw"
              priority={i === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
