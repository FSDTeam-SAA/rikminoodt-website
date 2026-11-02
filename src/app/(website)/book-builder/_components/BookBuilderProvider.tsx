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
      window.sessionStorage.removeItem("book-builder-progress");
      window.sessionStorage.removeItem("current_book_id");
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    try {
      window.sessionStorage.removeItem("book-builder-progress");
    } catch {
      // ignore unavailable browser storage
    }

    const selectedThemeFromHome = new URLSearchParams(window.location.search).get("theme");
    if (selectedThemeFromHome && themeOptions.has(selectedThemeFromHome)) {
      setSelectedAge(defaultAge);
      setSelectedTheme(selectedThemeFromHome);
      setSelectedStory(null);
    }
  }, []);

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
