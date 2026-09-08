"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { HERO_SLIDES } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const ADVANCE_MS = 6000;

/**
 * The home hero, cycling through images behind a headline that stays put.
 *
 * Only the image changes: the copy reads as well over any of them, and
 * rewriting the headline per slide would mean inventing marketing that has to
 * be maintained in both languages for no gain.
 */
export function HeroCarousel() {
  const { t } = useLocale();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || HERO_SLIDES.length < 2) return;

    // Someone who has asked for less motion gets the first image and no
    // cycling, rather than a slower version of the same thing.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % HERO_SLIDES.length);
    }, ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [paused]);

  // Stop advancing while the tab is in the background: the images would
  // otherwise cycle unseen and land on an arbitrary one when it returns.
  useEffect(() => {
    function sync() {
      setPaused(document.hidden);
    }
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t.home.heroCarousel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="relative h-[70vh] min-h-[420px] w-full overflow-hidden border-b border-black"
    >
      {HERO_SLIDES.map((src, i) => (
        <Image
          key={src}
          src={src}
          // Decorative: the headline carries the meaning, and narrating a
          // background image would only add noise over it.
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          className={cn(
            "object-cover transition-opacity duration-1000 motion-reduce:transition-none",
            i === index ? "opacity-100" : "opacity-0"
          )}
        />
      ))}

      {/* Always-on scrim so the hero copy stays legible over any photo */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="relative z-10 flex h-full flex-col items-start justify-end gap-6 px-4 pb-12 lg:px-8 lg:pb-20">
        <h1 className="font-sans uppercase text-h1 text-white max-w-xl w-full">
          {t.home.heroTitle}
        </h1>
        <Link href="/collection">
          <Button variant="primary" size="md">
            {t.home.heroCta}
          </Button>
        </Link>

        {HERO_SLIDES.length > 1 && (
          <div className="flex gap-2">
            {HERO_SLIDES.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={t.home.heroSlide(i + 1)}
                aria-current={i === index}
                className={cn(
                  "h-2 w-8 border border-white transition-colors",
                  i === index ? "bg-white" : "bg-transparent"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
