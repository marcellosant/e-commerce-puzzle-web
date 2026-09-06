"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useLocale } from "@/context/LocaleContext";
import { Button } from "@/components/ui/Button";

/**
 * Entry point for the virtual try-on, shown on the product page.
 *
 * Desktop gets a QR code rather than a webcam button: phone front cameras are
 * far better placed for this, and it keeps the heavy try-on bundle off the
 * product page entirely. Which half shows is decided by CSS breakpoints, the
 * same convention the rest of the app uses — sniffing the user agent would
 * differ between server and client render and break hydration.
 */
export function TryOnEntry({ slug }: { slug: string }) {
  const { t } = useLocale();
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const href = `/product/${slug}/try-on`;

  useEffect(() => {
    // Built from the live origin so the code points wherever the visitor
    // already is — production, a preview deployment, or a dev tunnel — instead
    // of a build-time constant that would go stale.
    const url = `${window.location.origin}${href}`;
    QRCode.toDataURL(url, {
      width: 320,
      margin: 1,
      color: { dark: "#000000", light: "#ffffff" },
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [href]);

  return (
    <div className="border border-black p-6">
      {/* Mobile: the camera is right here, so go straight in. */}
      <div className="lg:hidden">
        <Link href={href} className="block">
          <Button variant="secondary" size="full">
            {t.tryOn.button}
          </Button>
        </Link>
        <p className="font-serif text-body text-text-secondary mt-3">
          {t.tryOn.privacy}
        </p>
      </div>

      {/* Desktop: hand it off to the phone. */}
      <div className="hidden lg:flex lg:gap-6 lg:items-center">
        <div className="h-32 w-32 shrink-0 border border-black bg-white">
          {qrDataUrl && (
            /* eslint-disable-next-line @next/next/no-img-element --
               a generated data URL, nothing for next/image to optimise */
            <img
              src={qrDataUrl}
              alt={t.tryOn.scanHint}
              className="h-full w-full"
            />
          )}
        </div>
        <div>
          <h3 className="font-sans uppercase text-nav mb-2">{t.tryOn.scanTitle}</h3>
          <p className="font-serif text-body mb-2">{t.tryOn.scanHint}</p>
          <p className="font-serif text-body text-text-secondary">
            {t.tryOn.privacy}
          </p>
        </div>
      </div>
    </div>
  );
}
