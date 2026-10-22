import { SUBJECT_OPTIONS } from "./subject-options";

type CharacterInput = {
  type: "PERSON" | "ANIMAL" | "OBJECT" | "Person" | "Animal" | "Object";
  name?: string;
  gender?: string;
  age?: number | string;
  animalName?: string;
  animalSpecies?: string;
  objectName?: string;
};

const validAges = new Set(["0-2 Years", "3-5 Years", "5-9 Years", "10+ Years", "Adult"]);
const validThemes = new Set(Object.keys(SUBJECT_OPTIONS));
const validMessages = new Set([
  "Friendship",
  "Courage",
  "Caring for nature",
  "Love",
  "Perseverance",
  "Sharing",
  "Honesty",
  "Respect",
]);
const validIllustrations = new Set([
  "3d Animation",
  "Water Colour",
  "Geometric",
  "Claymation",
  "Sticker Art",
  "Comic Book",
  "Gouache",
  "Soft Anime",
]);
const validFonts = new Set([
  "Storybook Classic",
  "Smooth Sands",
  "Bubbly Tales",
  "Candy Dreams",
  "Neon Nexus",
  "Cosy Curves",
  "School Script",
  "Adventure Book",
]);
const languageVariants: Record<string, readonly string[]> = {
  English: ["Standard (British English)", "Standard (American English)", "Australian English"],
  Dutch: ["Standard Dutch", "Belgian Dutch"],
  French: ["France French", "Canadian French"],
};

const isText = (value: string | undefined, min = 2, max = 100) => {
  const length = value?.trim().length ?? 0;
  return length >= min && length <= max;
};

export function getCharacterValidationError(character: CharacterInput) {
  if (character.type === "PERSON" || character.type === "Person") {
    const age = Number(character.age);
    if (!isText(character.name)) return "Enter a character name (2–100 characters).";
    if (!['BOY', 'GIRL', 'OTHER', 'Male', 'Female', 'Non-binary', 'Prefer not to say'].includes(character.gender ?? "")) {
      return "Select a valid gender.";
    }
    if (!Number.isInteger(age) || age < 0 || age > 120) return "Enter an age between 0 and 120.";
    return null;
  }

  if (character.type === "ANIMAL" || character.type === "Animal") {
    if (!isText(character.animalName)) return "Enter the animal name (2–100 characters).";
    if (!isText(character.animalSpecies)) return "Enter the animal species (2–100 characters).";
    return null;
  }

  return isText(character.objectName)
    ? null
    : "Enter the object name (2–100 characters).";
}

export function getBookChoicesValidationError(choices: {
  age: string | null;
  theme: string | null;
  story: string | null;
  message: string | null;
  illustration: string | null;
  font: string | null;
  language: string | null;
  variant: string | null;
}) {
  if (!choices.age || !validAges.has(choices.age)) return "Choose a valid age category.";
  if (!choices.theme || !validThemes.has(choices.theme)) return "Choose a valid theme.";
  const storyIsValid = SUBJECT_OPTIONS[choices.theme].some(
    (subject) => subject.value === choices.story || subject.label === choices.story,
  );
  if (!storyIsValid) return "Choose a subject that belongs to the selected theme.";
  if (!choices.message || !validMessages.has(choices.message)) return "Choose a central message.";
  if (!choices.illustration || !validIllustrations.has(choices.illustration)) return "Choose an illustration style.";
  if (!choices.font || !validFonts.has(choices.font)) return "Choose a font.";
  if (!choices.language || !languageVariants[choices.language]?.includes(choices.variant ?? "")) {
    return "Choose a valid book language and regional variant.";
  }
  return null;
}

export function getGuestDetailsValidationError(details: {
  name: string;
  country: string;
  email: string;
  confirmEmail: string;
  password: string;
}) {
  if (!isText(details.name)) return "Enter your full name (2–100 characters).";
  if (!isText(details.country)) return "Enter your country (2–100 characters).";
  const email = details.email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
  if (email !== details.confirmEmail.trim()) return "Emails do not match. Please verify your email address.";
  if (details.password.length < 8) return "Password must be at least 8 characters long.";
  return null;
}

export function isValidCreatorName(name: string) {
  return isText(name);
}
