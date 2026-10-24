"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";

export function useBookBuilderTranslations() {
  const { t, language } = useLanguage();
  const bb = t.bookBuilder;

  const translateAge = (age?: string | null): string => {
    if (!age) return "";
    return bb?.ages?.[age as keyof typeof bb.ages] ?? age;
  };

  const translateTheme = (theme?: string | null): string => {
    if (!theme) return "";
    return bb?.themes?.[theme as keyof typeof bb.themes] ?? theme;
  };

  const translateMessage = (message?: string | null): string => {
    if (!message) return "";
    return bb?.messages?.[message as keyof typeof bb.messages] ?? message;
  };

  const translateIllustration = (illustration?: string | null): string => {
    if (!illustration) return "";
    return bb?.illustrations?.[illustration as keyof typeof bb.illustrations] ?? illustration;
  };

  const translateFont = (font?: string | null): string => {
    if (!font) return "";
    return bb?.fonts?.[font as keyof typeof bb.fonts] ?? font;
  };

  const translateLabel = (label: string): string => {
    return bb?.labels?.[label as keyof typeof bb.labels] ?? label;
  };

  return {
    t,
    language,
    bb,
    translateAge,
    translateTheme,
    translateMessage,
    translateIllustration,
    translateFont,
    translateLabel,
  };
}

