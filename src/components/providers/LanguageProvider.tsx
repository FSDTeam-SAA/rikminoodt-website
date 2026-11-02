"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import en from "@/locales/en.json";
import nl from "@/locales/nl.json";
import fr from "@/locales/fr.json";

export type LanguageCode = "en" | "nl" | "fr";

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "nl", label: "Nederlands", nativeLabel: "Nederlands", flag: "/images/flags/nl.svg" },
  { code: "en", label: "English", nativeLabel: "English", flag: "/images/flags/en.png" },
  { code: "fr", label: "French", nativeLabel: "Français", flag: "/images/flags/fr.svg" },
];

export type Translations = typeof en;

const dictionaries: Record<LanguageCode, Translations> = {
  nl: { ...en, ...(nl as unknown as Partial<Translations>) },
  en,
  fr: { ...en, ...(fr as unknown as Partial<Translations>) },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: Translations;
  isPending: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getInitialLanguage(): LanguageCode {
  if (typeof window === "undefined") return "nl";
  try {
    const savedLang = localStorage.getItem("boekerello_lang") as LanguageCode | null;
    if (savedLang && SUPPORTED_LANGUAGES.some((item) => item.code === savedLang)) {
      return savedLang;
    }
    const cookieMatch = document.cookie.match(/(?:^|; )boekerello_lang=([^;]*)/);
    if (cookieMatch) {
      const cookieLang = cookieMatch[1] as LanguageCode;
      if (SUPPORTED_LANGUAGES.some((item) => item.code === cookieLang)) {
        return cookieLang;
      }
    }
    // Dutch is the primary default language for this site
  } catch {
    // fallback
  }
  return "nl";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("nl");
  const [translations, setTranslations] = useState<Translations>(dictionaries.nl);

  useEffect(() => {
    const initialLang = getInitialLanguage();
    if (initialLang !== "nl") {
      setLanguageState(initialLang);
      setTranslations(dictionaries[initialLang] || dictionaries.nl);
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = initialLang;
    }
  }, []);

  const setLanguage = (newLang: LanguageCode) => {
    if (!SUPPORTED_LANGUAGES.some((item) => item.code === newLang)) return;
    setLanguageState(newLang);
    setTranslations(dictionaries[newLang] || dictionaries.nl);
    if (typeof document !== "undefined") {
      document.documentElement.lang = newLang;
      try {
        localStorage.setItem("boekerello_lang", newLang);
        document.cookie = `boekerello_lang=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
      } catch {
        // ignore
      }
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations, isPending: false }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
