"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CharacterData = {
  id: number | string;
  type: "PERSON" | "ANIMAL" | "OBJECT";
  name?: string;
  gender?: "BOY" | "GIRL" | "OTHER";
  age?: number;
  hobbies?: string;
  favoriteFood?: string;
  animalName?: string;
  animalSpecies?: string;
  objectName?: string;
  photo?: File | null;
  photoPreview?: string;
  photoExpected?: boolean;
};

export type UserDetails = {
  name: string;
  country: string;
  email: string;
  confirmEmail: string;
  password: string;
};

export type CardDetails = {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
};

type BookBuilderContextValue = {
  selectedAge: string | null;
  setSelectedAge: (age: string) => void;
  selectedTheme: string | null;
  setSelectedTheme: (theme: string) => void;
  selectedStory: string | null;
  setSelectedStory: (story: string | null) => void;
  selectedMessage: string | null;
  setSelectedMessage: (message: string) => void;
  selectedIllustration: string | null;
  setSelectedIllustration: (illustration: string) => void;
  selectedFont: string | null;
  setSelectedFont: (font: string) => void;
  selectedLanguage: string | null;
  setSelectedLanguage: (language: string) => void;
  selectedVariant: string | null;
  setSelectedVariant: (variant: string) => void;

  characters: CharacterData[];
  setCharacters: React.Dispatch<React.SetStateAction<CharacterData[]>>;
  creatorName: string;
  setCreatorName: (name: string) => void;
  foreword: string;
  setForeword: (text: string) => void;
  forewordMode: "write" | "voice";
  setForewordMode: (mode: "write" | "voice") => void;
  voiceBlob: Blob | null;
  setVoiceBlob: (blob: Blob | null) => void;
  voiceExpected: boolean;
  specialEvents: string;
  setSpecialEvents: (events: string) => void;

  userDetails: UserDetails;
  setUserDetails: (details: Partial<UserDetails>) => void;
  cardDetails: CardDetails;
  setCardDetails: (details: Partial<CardDetails>) => void;

  currentBookId: string | null;
  setCurrentBookId: (id: string | null) => void;
  retryCount: number;
  setRetryCount: React.Dispatch<React.SetStateAction<number>>;
  resetBookBuilder: () => void;
};

const BookBuilderContext = createContext<BookBuilderContextValue | null>(null);
const storageKey = "book-builder-progress";
const defaultAge = "0-2 Years";
const themeOptions = new Set([
  "Fairy Tales",
  "Adventure",
  "Activities",
  "Worlds",
  "Holidays",
  "Family",
  "Educational",
  "Feelings",
]);

export function BookBuilderProvider({ children }: { children: ReactNode }) {
  const [selectedAge, setSelectedAge] = useState<string | null>(defaultAge);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [selectedIllustration, setSelectedIllustration] = useState<string | null>(null);
  const [selectedFont, setSelectedFont] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>("English");
  const [selectedVariant, setSelectedVariant] = useState<string | null>("Standard (Brits Engls)");

  const [characters, setCharacters] = useState<CharacterData[]>([
    {
      id: 1,
      type: "PERSON",
    },
  ]);
  const [creatorName, setCreatorName] = useState<string>("");
  const [foreword, setForeword] = useState<string>("");
  const [forewordMode, setForewordMode] = useState<"write" | "voice">("write");
  const [voiceBlob, setVoiceBlobState] = useState<Blob | null>(null);
  const [voiceExpected, setVoiceExpected] = useState(false);
  const setVoiceBlob = (blob: Blob | null) => { setVoiceBlobState(blob); setVoiceExpected(Boolean(blob)); };
  const [specialEvents, setSpecialEvents] = useState<string>("");

  const [userDetails, setUserDetailsState] = useState<UserDetails>({
    name: "",
    country: "",
    email: "",
    confirmEmail: "",
    password: "",
  });

  const [cardDetails, setCardDetailsState] = useState<CardDetails>({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [currentBookId, setCurrentBookId] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);

  const setUserDetails = (details: Partial<UserDetails>) => {
    setUserDetailsState((prev) => ({ ...prev, ...details }));
  };

  const setCardDetails = (details: Partial<CardDetails>) => {
    setCardDetailsState((prev) => ({ ...prev, ...details }));
  };

  const resetBookBuilder = () => {
    setSelectedAge(defaultAge);
    setSelectedTheme(null);
    setSelectedStory(null);
    setSelectedMessage(null);
    setSelectedIllustration(null);
    setSelectedFont(null);
    setSelectedLanguage("English");
    setSelectedVariant("Standard (Brits Engls)");
    setCharacters([
      {
        id: 1,
        type: "PERSON",
      },
    ]);
    setCreatorName("");
    setForeword("");
    setForewordMode("write");
    setVoiceBlob(null);
    setSpecialEvents("");
    setUserDetailsState({
      name: "",
      country: "",
      email: "",
      confirmEmail: "",
      password: "",
    });
    setCardDetailsState({
      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    });
    setCurrentBookId(null);
    setRetryCount(0);
    try {
      window.sessionStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    try {
      const savedProgress = window.sessionStorage.getItem(storageKey);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        if (progress.selectedAge) setSelectedAge(progress.selectedAge);
        if (progress.selectedTheme) setSelectedTheme(progress.selectedTheme);
        if (progress.selectedStory) setSelectedStory(progress.selectedStory);
        if (progress.selectedMessage) setSelectedMessage(progress.selectedMessage);
        if (progress.selectedIllustration) setSelectedIllustration(progress.selectedIllustration);
        if (progress.selectedFont) setSelectedFont(progress.selectedFont);
        if (progress.selectedLanguage) setSelectedLanguage(progress.selectedLanguage);
        if (progress.selectedVariant) setSelectedVariant(progress.selectedVariant);
        const isLegacySampleCharacter =
          Array.isArray(progress.characters) &&
          progress.characters.length === 1 &&
          progress.characters[0]?.name === "Lily" &&
          progress.characters[0]?.hobbies === "drawing";
        if (progress.characters && Array.isArray(progress.characters) && !isLegacySampleCharacter) {
          setCharacters(progress.characters);
        }
        if (progress.creatorName && progress.creatorName !== "Mum & Dad") setCreatorName(progress.creatorName);
        if (progress.foreword) setForeword(progress.foreword);
        if (progress.voiceExpected) setVoiceExpected(true);
        if (progress.forewordMode === "write" || progress.forewordMode === "voice") setForewordMode(progress.forewordMode);
        if (progress.specialEvents) setSpecialEvents(progress.specialEvents);
        if (progress.userDetails) {
          setUserDetailsState({
            ...progress.userDetails,
            country: progress.userDetails.country === "United Kingdom" ? "" : progress.userDetails.country,
          });
        }
        if (progress.currentBookId) setCurrentBookId(progress.currentBookId);
        if (typeof progress.retryCount === "number") setRetryCount(progress.retryCount);
      }

    } catch {
      window.sessionStorage.removeItem(storageKey);
    }

    const selectedThemeFromHome = new URLSearchParams(window.location.search).get("theme");
    if (selectedThemeFromHome && themeOptions.has(selectedThemeFromHome)) {
      setSelectedAge(defaultAge);
      setSelectedTheme(selectedThemeFromHome);
      setSelectedStory(null);
    }

    setHasLoadedProgress(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedProgress) return;
    try {
      const serializableCharacters = characters.map((c) => ({
        ...c,
        photoExpected: Boolean(c.photo || c.photoExpected),
        photo: undefined, // Files can't be JSON serialized
      }));

      window.sessionStorage.setItem(
        storageKey,
        JSON.stringify({
          selectedAge,
          selectedTheme,
          selectedStory,
          selectedMessage,
          selectedIllustration,
          selectedFont,
          selectedLanguage,
          selectedVariant,
          characters: serializableCharacters,
          creatorName,
          foreword,
          forewordMode,
          specialEvents,
          userDetails: { ...userDetails, password: "" },
          voiceExpected,
          currentBookId,
          retryCount,
        }),
      );
    } catch {
      // ignore quota errors
    }
  }, [
    hasLoadedProgress,
    selectedAge,
    selectedTheme,
    selectedStory,
    selectedMessage,
    selectedIllustration,
    selectedFont,
    selectedLanguage,
    selectedVariant,
    characters,
    voiceExpected,
    creatorName,
    foreword,
    forewordMode,
    specialEvents,
    userDetails,
    currentBookId,
    retryCount,
  ]);

  return (
    <BookBuilderContext.Provider
      value={{
        selectedAge,
        setSelectedAge,
        selectedTheme,
        setSelectedTheme,
        selectedStory,
        setSelectedStory,
        selectedMessage,
        setSelectedMessage,
        selectedIllustration,
        setSelectedIllustration,
        selectedFont,
        setSelectedFont,
        selectedLanguage,
        setSelectedLanguage,
        selectedVariant,
        setSelectedVariant,
        characters,
        setCharacters,
        creatorName,
        setCreatorName,
        foreword,
        setForeword,
        forewordMode,
        setForewordMode,
        voiceBlob,
        setVoiceBlob,
        voiceExpected,
        specialEvents,
        setSpecialEvents,
        userDetails,
        setUserDetails,
        cardDetails,
        setCardDetails,
        currentBookId,
        setCurrentBookId,
        retryCount,
        setRetryCount,
        resetBookBuilder,
      }}
    >
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
