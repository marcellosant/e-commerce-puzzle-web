"use client";

import Link from "next/link";
import { useEffect } from "react";
import { X } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { Button } from "@/components/ui/Button";
import { useCamera } from "@/components/tryon/useCamera";
import { TryOnScene } from "@/components/tryon/TryOnScene";

interface TryOnExperienceProps {
  productName: string;
  slug: string;
}

export function TryOnExperience({ productName, slug }: TryOnExperienceProps) {
  const { t } = useLocale();
  const { videoRef, status, start } = useCamera();
  const productHref = `/product/${slug}`;

  useEffect(() => {
    start();
  }, [start]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <video
        ref={videoRef}
        playsInline
        muted
        // Selfie views are mirrored: people expect to move left and see the
        // image move left. The 3D overlay will be mirrored to match.
        className="h-full w-full object-cover scale-x-[-1]"
      />

      <TryOnScene />

      <div className="absolute top-0 inset-x-0 flex items-center justify-between p-4">
        <p className="font-sans uppercase text-nav text-white drop-shadow">
          {t.tryOn.pageTitle(productName)}
        </p>
        <Link
          href={productHref}
          aria-label={t.tryOn.backToProduct}
          className="text-white drop-shadow"
        >
          <X size={24} />
        </Link>
      </div>

      {status !== "ready" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 px-6">
          <div className="max-w-sm text-center text-white">
            {status === "starting" && (
              <p className="font-serif text-body">{t.tryOn.starting}</p>
            )}

            {status === "denied" && (
              <>
                <h2 className="font-sans uppercase text-subtitle mb-3">
                  {t.tryOn.permissionTitle}
                </h2>
                <p className="font-serif text-body mb-6">
                  {t.tryOn.permissionBody}
                </p>
                <Button variant="secondary" size="md" onClick={start}>
                  {t.tryOn.retry}
                </Button>
              </>
            )}

            {(status === "unsupported" || status === "error") && (
              <>
                <h2 className="font-sans uppercase text-subtitle mb-3">
                  {t.tryOn.unsupportedTitle}
                </h2>
                <p className="font-serif text-body mb-6">
                  {t.tryOn.unsupportedBody}
                </p>
                <Link href={productHref}>
                  <Button variant="secondary" size="md">
                    {t.tryOn.backToProduct}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <p className="absolute bottom-0 inset-x-0 p-4 text-center font-serif text-sm text-white/70">
        {t.tryOn.privacy}
      </p>
    </div>
  );
}
