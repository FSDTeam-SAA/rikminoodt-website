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

const validationMessages = {
  nl: {
    characterName: "Voer een naam in voor het personage (2–100 tekens).",
    gender: "Selecteer een geldig geslacht.",
    age: "Voer een leeftijd in tussen 0 en 120.",
    animalName: "Voer de naam van het dier in (2–100 tekens).",
    animalSpecies: "Voer de diersoort in (2–100 tekens).",
    objectName: "Voer de naam van het voorwerp in (2–100 tekens).",
  },
  en: {
    characterName: "Enter a character name (2–100 characters).",
    gender: "Select a valid gender.",
    age: "Enter an age between 0 and 120.",
    animalName: "Enter the animal name (2–100 characters).",
    animalSpecies: "Enter the animal species (2–100 characters).",
    objectName: "Enter the object name (2–100 characters).",
  },
  fr: {
    characterName: "Saisissez un nom de personnage (2–100 caractères).",
    gender: "Sélectionnez un genre valide.",
    age: "Saisissez un âge compris entre 0 et 120.",
    animalName: "Saisissez le nom de l'animal (2–100 caractères).",
    animalSpecies: "Saisissez l'espèce de l'animal (2–100 caractères).",
    objectName: "Saisissez le nom de l'objet (2–100 caractères).",
  },
};

export function getCharacterValidationError(
  character: CharacterInput,
  language: "en" | "nl" | "fr" = "nl",
) {
  const msgs = validationMessages[language] || validationMessages.nl;
  if (character.type === "PERSON" || character.type === "Person") {
    const age = Number(character.age);
    if (!isText(character.name)) return msgs.characterName;
    if (
      ![
        "BOY",
        "GIRL",
        "OTHER",
        "Male",
        "Female",
        "Non-binary",
        "Prefer not to say",
      ].includes(character.gender ?? "")
    ) {
      return msgs.gender;
    }
    if (!Number.isInteger(age) || age < 0 || age > 120) return msgs.age;
    return null;
  }

  if (character.type === "ANIMAL" || character.type === "Animal") {
    if (!isText(character.animalName)) return msgs.animalName;
    if (!isText(character.animalSpecies)) return msgs.animalSpecies;
    return null;
  }

  return isText(character.objectName) ? null : msgs.objectName;
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
