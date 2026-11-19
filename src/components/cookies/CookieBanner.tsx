"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export const COOKIE_CONSENT_KEY = "boekerello_cookie_consent";
export const COOKIE_CONSENT_EVENT = "boekerello:cookie-consent";
export const OPEN_COOKIE_SETTINGS_EVENT = "boekerello:open-cookie-settings";

export type CookieConsentStatus = "accepted" | "declined";

/** Returns the visitor's saved choice, or null when they have not chosen yet. */
export function getCookieConsent(): CookieConsentStatus | null {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.status === "accepted" || parsed?.status === "declined" ? parsed.status : null;
  } catch {
    return null;
  }
}

const copy = {
  en: {
    title: "We use cookies!",
    before: "Boekerello uses functional, analytical, and marketing cookies 🍪. See our ",
    link: "privacy policy",
    after: " for details.",
    decline: "Decline",
    accept: "Accept",
  },
  nl: {
    title: "Wij gebruiken cookies!",
    before: "Boekerello gebruikt functionele, analytische en marketingcookies 🍪. Bekijk ons ",
    link: "privacybeleid",
    after: " voor meer informatie.",
    decline: "Weigeren",
    accept: "Accepteren",
  },
  fr: {
    title: "Nous utilisons des cookies !",
    before: "Boekerello utilise des cookies fonctionnels, analytiques et marketing 🍪. Consultez notre ",
    link: "politique de confidentialité",
    after: " pour plus de détails.",
    decline: "Refuser",
    accept: "Accepter",
  },
} as const;

export default function CookieBanner() {
  const { language } = useLanguage();
  const text = copy[language as keyof typeof copy] || copy.nl;
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (getCookieConsent() === null) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
  }, []);

  const choose = useCallback((status: CookieConsentStatus) => {
    try {
      localStorage.setItem(
        COOKIE_CONSENT_KEY,
        JSON.stringify({ status, timestamp: new Date().toISOString(), version: 1 }),
      );
    } catch {
      // Storage can be blocked; the choice then only lasts for this visit.
    }
    try {
      document.cookie = `${COOKIE_CONSENT_KEY}=${status}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    } catch {}
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: { status } }));
    setOpen(false);
  }, []);

  if (!mounted || !open) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={text.title}
      className="fixed bottom-3 left-3 right-3 z-[90] animate-[cookie-in_.35s_ease-out] sm:bottom-5 sm:left-5 sm:right-auto sm:w-[430px]"
    >
      <style>{`@keyframes cookie-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div className="relative overflow-hidden rounded-[26px] border border-[#FBC3DA] bg-white p-4 shadow-[0_12px_40px_rgba(236,72,153,0.18)] sm:p-5">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-12 h-32 w-44 rounded-full bg-[#FDF3DE]"
        />
        <div className="relative">
          <Image
            src="/images/rikLogo-transparent.png"
            alt="Boekerello"
            width={150}
            height={50}
            className="h-9 w-auto"
          />
          <div className="mt-1 flex items-center gap-3">
            <Image
              src="/images/cookie-illustration.png"
              alt=""
              width={328}
              height={265}
              className="h-auto w-[34%] shrink-0 self-center"
            />
            <div className="min-w-0 flex-1">
              <h2 className="font-sans text-[22px] font-extrabold leading-tight text-[#26104F] sm:text-2xl">
                {text.title}
              </h2>
              <p className="mt-1.5 font-sans text-[13px] leading-snug text-[#5B3F8A] sm:text-sm">
                {text.before}
                <Link
                  href="/privacy-policy"
                  className="font-bold text-[#E8307F] underline underline-offset-2 hover:text-[#C81F68]"
                >
                  {text.link}
                </Link>
                {text.after}
              </p>
              <div className="mt-3 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => choose("declined")}
                  className="flex-1 rounded-full border-2 border-[#F0408B] bg-white px-3 py-2 font-sans text-sm font-bold text-[#E8307F] transition hover:bg-[#FFF0F6]"
                >
                  {text.decline}
                </button>
                <button
                  type="button"
                  onClick={() => choose("accepted")}
                  className="flex-1 rounded-full bg-gradient-to-b from-[#FF5BA0] to-[#EC2F7F] px-3 py-2 font-sans text-sm font-bold text-white shadow-[0_4px_12px_rgba(236,47,127,0.35)] transition hover:brightness-105"
                >
                  {text.accept}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
