"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type BookBuilderContextValue = {
  selectedAge: string | null;
  setSelectedAge: (age: string) => void;
  selectedTheme: string | null;
  setSelectedTheme: (theme: string) => void;
  selectedStory: string | null;
  setSelectedStory: (story: string) => void;
  selectedMessage: string | null;
  setSelectedMessage: (message: string) => void;
  selectedIllustration: string | null;
  setSelectedIllustration: (illustration: string) => void;
  selectedFont: string | null;
  setSelectedFont: (font: string) => void;
  selectedLanguage: string | null;
  setSelectedLanguage: (language: string) => void;
};

const BookBuilderContext = createContext<BookBuilderContextValue | null>(null);
const storageKey = "book-builder-progress";

export function BookBuilderProvider({ children }: { children: ReactNode }) {
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [selectedIllustration, setSelectedIllustration] = useState<string | null>(null);
  const [selectedFont, setSelectedFont] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);

  useEffect(() => {
    const savedProgress = window.sessionStorage.getItem(storageKey);

    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress) as { selectedAge?: string; selectedTheme?: string; selectedStory?: string; selectedMessage?: string; selectedIllustration?: string; selectedFont?: string; selectedLanguage?: string };
        setSelectedAge(progress.selectedAge ?? null);
        setSelectedTheme(progress.selectedTheme ?? null);
        setSelectedStory(progress.selectedStory ?? null);
        setSelectedMessage(progress.selectedMessage ?? null);
        setSelectedIllustration(progress.selectedIllustration ?? null);
        setSelectedFont(progress.selectedFont ?? null);
        setSelectedLanguage(progress.selectedLanguage ?? null);
      } catch {
        window.sessionStorage.removeItem(storageKey);
      }
    }

    setHasLoadedProgress(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedProgress) return;

    window.sessionStorage.setItem(storageKey, JSON.stringify({ selectedAge, selectedTheme, selectedStory, selectedMessage, selectedIllustration, selectedFont, selectedLanguage }));
  }, [hasLoadedProgress, selectedAge, selectedTheme, selectedStory, selectedMessage, selectedIllustration, selectedFont, selectedLanguage]);

  return (
    <BookBuilderContext.Provider value={{ selectedAge, setSelectedAge, selectedTheme, setSelectedTheme, selectedStory, setSelectedStory, selectedMessage, setSelectedMessage, selectedIllustration, setSelectedIllustration, selectedFont, setSelectedFont, selectedLanguage, setSelectedLanguage }}>
      {children}
    </BookBuilderContext.Provider>
  );
}

export function useBookBuilder() {
  const context = useContext(BookBuilderContext);

  if (!context) {
    throw new Error("useBookBuilder must be used within BookBuilderProvider");
  }

  return context;
}
