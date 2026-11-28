const BOOK_LANGUAGE_FLAGS: Record<string, string> = {
  Dutch: "/images/flags/nl.svg",
  English: "/images/flags/en.png",
  French: "/images/flags/fr.svg",
};

export function getBookLanguageFlag(language?: string | null): string {
  return (language && BOOK_LANGUAGE_FLAGS[language]) || "/images/flag.png";
}
