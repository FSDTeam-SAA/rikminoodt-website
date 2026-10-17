"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import en from "@/locales/en.json";

export type LanguageCode = "en" | "nl" | "fr";

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English", flag: "/images/flags/en.png" },
  { code: "nl", label: "Dutch", nativeLabel: "Nederlands", flag: "/images/flags/nl.svg" },
  { code: "fr", label: "French", nativeLabel: "Français", flag: "/images/flags/fr.svg" },
];

export type Translations = typeof en;

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: Translations;
  isPending: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// In-memory cache for loaded dictionaries
const dictionaryCache: Partial<Record<LanguageCode, Translations>> = {
  en,
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [translations, setTranslations] = useState<Translations>(en);
  const [isPending, startTransition] = useTransition();

  // Load translations asynchronously or from cache
  const loadTranslations = async (targetLang: LanguageCode) => {
    if (targetLang === "en") {
      setTranslations(en);
      return;
    }

    if (dictionaryCache[targetLang]) {
      setTranslations(dictionaryCache[targetLang]!);
      return;
    }

    try {
      let loadedDict: Translations;
      if (targetLang === "nl") {
        const mod = await import("@/locales/nl.json");
        loadedDict = { ...en, ...mod.default };
      } else if (targetLang === "fr") {
        const mod = await import("@/locales/fr.json");
        loadedDict = { ...en, ...mod.default };
      } else {
        loadedDict = en;
      }

      dictionaryCache[targetLang] = loadedDict;
      setTranslations(loadedDict);
    } catch (error) {
      console.error(`Failed to load translation for ${targetLang}`, error);
      setTranslations(en);
    }
  };

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("boekerello_lang") as LanguageCode | null;
      if (savedLang && SUPPORTED_LANGUAGES.some((item) => item.code === savedLang)) {
        setLanguageState(savedLang);
        loadTranslations(savedLang);
        document.documentElement.lang = savedLang;
      } else {
        // Detect browser language if matches supported list
        const browserLang = navigator.language.slice(0, 2) as LanguageCode;
        if (SUPPORTED_LANGUAGES.some((item) => item.code === browserLang)) {
          setLanguageState(browserLang);
          loadTranslations(browserLang);
          document.documentElement.lang = browserLang;
        }
      }
    } catch {
      // ignore localStorage disabled
    }
  }, []);

  const setLanguage = (newLang: LanguageCode) => {
    if (newLang === language) return;

    startTransition(() => {
      setLanguageState(newLang);
      document.documentElement.lang = newLang;
      try {
        localStorage.setItem("boekerello_lang", newLang);
      } catch {
        // ignore
      }
      loadTranslations(newLang);
    });
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations, isPending }}>
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

