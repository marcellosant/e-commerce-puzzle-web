"use client";

import { useLocale } from "@/context/LocaleContext";

export default function ProfilePage() {
  const { t } = useLocale();
  return (
    <div className="px-4 lg:px-8 py-10 lg:py-16">
      <h1 className="font-sans uppercase text-h1 mb-4">{t.profile.title}</h1>
      <p className="font-serif text-body text-text-secondary">
        {t.profile.comingSoon}
      </p>
    </div>
  );
}
