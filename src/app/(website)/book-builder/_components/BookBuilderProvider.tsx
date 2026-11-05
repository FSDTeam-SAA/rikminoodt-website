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
const defaultAge: string | null = null;
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
const progressStorageKey = "book-builder-progress";

type BuilderProgress = Pick<
  BookBuilderContextValue,
  | "selectedAge"
  | "selectedTheme"
  | "selectedStory"
  | "selectedMessage"
  | "selectedIllustration"
  | "selectedFont"
  | "selectedLanguage"
  | "selectedVariant"
>;

const isNullableString = (value: unknown): value is string | null =>
  typeof value === "string" || value === null;

function getStoredProgress(): BuilderProgress | null {
  try {
    const rawProgress = window.sessionStorage.getItem(progressStorageKey);
    if (!rawProgress) return null;

    const progress = JSON.parse(rawProgress) as Record<string, unknown>;
    const keys: Array<keyof BuilderProgress> = [
      "selectedAge",
      "selectedTheme",
      "selectedStory",
      "selectedMessage",
      "selectedIllustration",
      "selectedFont",
      "selectedLanguage",
      "selectedVariant",
    ];

    if (!keys.every((key) => isNullableString(progress[key]))) return null;
    return progress as BuilderProgress;
  } catch {
    return null;
  }
}

export function BookBuilderProvider({ children }: { children: ReactNode }) {
  const [selectedAge, setSelectedAge] = useState<string | null>(defaultAge);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [selectedIllustration, setSelectedIllustration] = useState<string | null>(null);
  const [selectedFont, setSelectedFont] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>("Dutch");
  const [selectedVariant, setSelectedVariant] = useState<string | null>("Standard Dutch");

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
  const [hasRestoredProgress, setHasRestoredProgress] = useState(false);

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
    setSelectedLanguage("Dutch");
    setSelectedVariant("Standard Dutch");
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
      window.sessionStorage.removeItem(progressStorageKey);
      window.sessionStorage.removeItem("current_book_id");
      window.sessionStorage.removeItem("retry_book_id");
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    // A saved wizard state is only valid when a user explicitly returns to
    // edit/retry the same book. A normal new-book visit must start blank.
    const isRetryFlow =
      window.location.pathname === "/book-builder/InformationAboutCharacters" &&
      Boolean(window.sessionStorage.getItem("retry_book_id"));
    const storedProgress = isRetryFlow ? getStoredProgress() : null;
    if (storedProgress) {
      setSelectedAge(storedProgress.selectedAge);
      setSelectedTheme(storedProgress.selectedTheme);
      setSelectedStory(storedProgress.selectedStory);
      setSelectedMessage(storedProgress.selectedMessage);
      setSelectedIllustration(storedProgress.selectedIllustration);
      setSelectedFont(storedProgress.selectedFont);
      setSelectedLanguage(storedProgress.selectedLanguage);
      setSelectedVariant(storedProgress.selectedVariant);
    } else if (!isRetryFlow) {
      try {
        window.sessionStorage.removeItem(progressStorageKey);
      } catch {
        // ignore unavailable browser storage
      }
    }

    const selectedThemeFromHome = new URLSearchParams(window.location.search).get("theme");
    if (selectedThemeFromHome && themeOptions.has(selectedThemeFromHome)) {
      setSelectedAge(defaultAge);
      setSelectedTheme(selectedThemeFromHome);
      setSelectedStory(null);
    }
    setHasRestoredProgress(true);
  }, []);

  useEffect(() => {
    if (!hasRestoredProgress) return;

    try {
      const progress: BuilderProgress = {
        selectedAge,
        selectedTheme,
        selectedStory,
        selectedMessage,
        selectedIllustration,
        selectedFont,
        selectedLanguage,
        selectedVariant,
      };
      window.sessionStorage.setItem(progressStorageKey, JSON.stringify(progress));
    } catch {
      // ignore unavailable browser storage
    }
  }, [
    hasRestoredProgress,
    selectedAge,
    selectedTheme,
    selectedStory,
    selectedMessage,
    selectedIllustration,
    selectedFont,
    selectedLanguage,
    selectedVariant,
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
