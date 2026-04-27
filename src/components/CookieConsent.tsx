"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface Preferences {
  analytics: boolean;
  marketing: boolean;
}

const STORAGE_KEY = "hh_cookie_consent";

export function CookieConsent(): JSX.Element | null {
  const [visible, setVisible] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>({ analytics: false, marketing: false });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) setVisible(true);
  }, []);

  const save = (accepted: Preferences): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accepted));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-cream-300 bg-cream-50 p-6 shadow-floathover md:bottom-6 md:left-6 md:right-auto md:max-w-md md:rounded-2xl md:border"
    >
      <p className="font-sans text-sm text-ink">
        We use cookies to make this site work. Analytics and marketing cookies are optional.{" "}
        <Link href="/privacy" className="underline text-sage-700">
          Privacy policy
        </Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={prefs.analytics}
            onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.target.checked }))}
            className="accent-sage-700"
          />
          Analytics
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={prefs.marketing}
            onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.target.checked }))}
            className="accent-sage-700"
          />
          Marketing
        </label>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button size="sm" onClick={() => save(prefs)}>
          Save preferences
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => save({ analytics: true, marketing: true })}
        >
          Accept all
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => save({ analytics: false, marketing: false })}
        >
          Necessary only
        </Button>
      </div>
    </div>
  );
}
