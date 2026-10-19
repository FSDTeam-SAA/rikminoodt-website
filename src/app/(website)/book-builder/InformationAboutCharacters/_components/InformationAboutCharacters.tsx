"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, PawPrint, Pencil, Trash2, Upload, UserRound } from "lucide-react";
import { useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBookBuilder, type CharacterData } from "../../_components/BookBuilderProvider";

const ages = [
  { label: "0-2 Years", image: "/images/age_1.png", color: "#FDE1CF" },
  { label: "3-5 Years", image: "/images/age_2.png", color: "#E3F3FC" },
  { label: "5-9 Years", image: "/images/age_3.png", color: "#FADDE0" },
  { label: "10+ Years", image: "/images/age_4.png", color: "#D7EEE1" },
  { label: "Adult", image: "/images/age_5.png", color: "#E2D7F3" },
];

const themes = [
  { label: "Fairy Tales", image: "/images/theme_1.png", color: "#FFE5D4" },
  { label: "Adventure", image: "/images/theme_2.png", color: "#DDEEFF" },
  { label: "Activities", image: "/images/theme_3.png", color: "#FFDDE2" },
  { label: "Worlds", image: "/images/theme_4.png", color: "#D2EBD9" },
  { label: "Holidays", image: "/images/theme_5.png", color: "#D2E8D8" },
  { label: "Family", image: "/images/theme_6.png", color: "#FFDFE4" },
  { label: "Educational", image: "/images/theme_7.png", color: "#FFE5D4" },
  { label: "Feelings", image: "/images/theme_8.png", color: "#DDEEFF" },
];

const stories = [
  { label: "Unicorns", image: "/images/story_1.png", color: "#FFE5D6" },
  {
    label: "Princess & Princesses",
    image: "/images/story_2.png",
    color: "#DDEEFF",
  },
  {
    label: "Knights and dragons",
    image: "/images/story_3.png",
    color: "#FFDDE4",
  },
  { label: "Wizard School", image: "/images/story_4.png", color: "#D1ECD9" },
  { label: "The Magic Forest", image: "/images/story_5.png", color: "#CFE9DA" },
  { label: "Mermaids", image: "/images/story_6.png", color: "#FADDE1" },
  { label: "Gnomes", image: "/images/story_7.png", color: "#FFE5D4" },
  {
    label: "Fairies and Elves",
    image: "/images/story_8.png",
    color: "#DDEEFF",
  },
  {
    label: "Witches and Spells",
    image: "/images/story_9.png",
    color: "#D4EBDD",
  },
  { label: "Giants", image: "/images/story_10.png", color: "#F8DCE3" },
];

const messages = [
  { label: "Friendship", image: "/images/per_1.png", color: "#FFE5D6" },
  { label: "Courage", image: "/images/per_2.png", color: "#DDEEEF" },
  { label: "Caring for nature", image: "/images/per_3.png", color: "#FFDDE4" },
  { label: "Love", image: "/images/per_4.png", color: "#E6DAF1" },
  { label: "Perseverance", image: "/images/per_5.png", color: "#FFF0D3" },
  { label: "Sharing", image: "/images/per_6.png", color: "#FCE2E7" },
  { label: "Honesty", image: "/images/per_7.png", color: "#DCEDE7" },
  { label: "Respect", image: "/images/per_8.png", color: "#FFDCD4" },
];

const fonts = [
  { label: "Storybook Classic", image: "/images/font_1.png", color: "#FFF6DE" },
  { label: "Smooth Sands", image: "/images/font_2.png", color: "#DDEEFF" },
  { label: "Bubbly Tales", image: "/images/font_3.png", color: "#F9DDE8" },
  { label: "Candy Dreams", image: "/images/font_4.png", color: "#F4D8FC" },
  { label: "Neon Nexus", image: "/images/font_5.png", color: "#202044" },
  { label: "Cosy Curves", image: "/images/font_6.png", color: "#FFEAE4" },
  { label: "School Script", image: "/images/font_7.png", color: "#F8F7F0" },
  { label: "Adventure Book", image: "/images/font_8.png", color: "#F0D39F" },
];

type Choice = { label: string; image: string; color?: string };

function ChoiceChip({
  choice,
  href,
  label,
}: {
  choice: Choice | undefined;
  href: string;
  label: string;
}) {
  if (!choice) {
    return (
      <Link
        href={href}
        className="rounded-full border border-dashed border-[#D8C8C2] px-3 py-2 text-sm text-[#856F77]"
      >
        Choose {label.toLowerCase()}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-label={`Edit ${label.toLowerCase()}: ${choice.label}`}
      className="group inline-flex h-9 items-center gap-2 rounded-full px-2 pr-3 font-sans text-sm font-medium text-[#4B4650] transition hover:brightness-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0] focus-visible:ring-offset-2"
      style={{ backgroundColor: choice.color }}
    >
      <span className="relative size-6 overflow-hidden rounded-full bg-white/45">
        <Image
          src={choice.image}
          alt=""
          fill
          sizes="24px"
          className="object-contain object-bottom"
        />
      </span>
      <span>{choice.label}</span>
      <Pencil
        aria-hidden="true"
        size={14}
        strokeWidth={2.3}
        className="text-[#E5AF32] transition-transform group-hover:scale-110"
      />
    </Link>
  );
}

type CharacterType = "Person" | "Animal" | "Object";

const characterTypes = [
  { label: "Person" as const, icon: UserRound },
  { label: "Animal" as const, icon: PawPrint },
  { label: "Object" as const, icon: Box },
];

type AdditionalCharState = {
  id: number;
  type: CharacterType;
  name: string;
  gender: string;
  age: string;
  hobbies: string;
  food: string;
  animalName: string;
  animalSpecies: string;
  objectName: string;
  photo: File | null;
  photoName: string;
};

function AddedCharacterForm({
  number,
  character,
  canAdd,
  onAdd,
  onRemove,
  onChange,
}: {
  number: number;
  character: AdditionalCharState;
  canAdd: boolean;
  onAdd: (type: CharacterType) => void;
  onRemove: () => void;
  onChange: (updated: Partial<AdditionalCharState>) => void;
}) {
  const fieldId = `character-${number}`;

  return (
    <>
      <div className="mt-7 flex max-w-[1120px] items-center justify-between gap-3">
        <h4 className="font-sans text-base font-semibold text-[#1E1E1E] sm:text-lg">
          Character {number}
        </h4>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove character ${number}`}
          className="inline-flex size-9 items-center justify-center rounded-lg text-[#E88DA0] transition hover:bg-[#FFF3F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0]"
        >
          <Trash2 aria-hidden="true" size={19} />
        </button>
      </div>
      <form
        className="mt-3 max-w-[1120px] rounded-[10px] border border-[#F3A8B7] bg-white/20 p-3 sm:p-5"
        onSubmit={(event) => event.preventDefault()}
      >
        <fieldset>
          <legend className="font-sans text-sm font-medium text-[#252025]">
            Choose the type of character
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {characterTypes.map((characterType) => {
              const Icon = characterType.icon;
              const isSelected = character.type === characterType.label;
              return (
                <button
                  key={characterType.label}
                  type="button"
                  onClick={() => onChange({ type: characterType.label })}
                  className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 font-sans text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0] ${
                    isSelected
                      ? "border-[#F3A8B7] bg-[#F5B0BE] text-white"
                      : "border-[#F6C9D2] bg-white text-[#E88DA0] hover:bg-[#FFF3F5]"
                  }`}
                >
                  <Icon aria-hidden="true" size={16} />
                  {characterType.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        {character.type === "Person" ? (
          <>
            <label
              className="mt-5 block font-sans text-sm font-medium text-[#252025]"
              htmlFor={`${fieldId}-name`}
            >
              Character Name
            </label>
            <input
              id={`${fieldId}-name`}
              value={character.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Enter the character's name"
              className="mt-2 h-10 w-full rounded-[8px] border border-[#F3A8B7] bg-[#FFFCFA] px-3 font-sans text-sm text-[#4B4650] outline-none placeholder:text-[#B9B4B7] focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/25"
            />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  className="block font-sans text-sm font-medium text-[#252025]"
                  htmlFor={`${fieldId}-gender`}
                >
                  Gender
                </label>
                <Select
                  value={character.gender}
                  onValueChange={(val) => onChange({ gender: val ?? "" })}
                >
                  <SelectTrigger
                    id={`${fieldId}-gender`}
                    className="mt-2 h-10 w-full rounded-[8px] border-[#F3A8B7] bg-[#FFFCFA] px-3 font-sans text-sm text-[#4B4650] focus-visible:border-[#E88DA0] focus-visible:ring-[#E88DA0]/25"
                  >
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="z-[100] border border-[#F3A8B7] bg-white text-[#4B4650] shadow-[0_10px_24px_rgba(91,69,78,0.16)]">
                    <SelectItem
                      className="cursor-pointer py-2 text-[#4B4650] focus:bg-[#FFF3F5]"
                      value="Female"
                    >
                      Female
                    </SelectItem>
                    <SelectItem
                      className="cursor-pointer py-2 text-[#4B4650] focus:bg-[#FFF3F5]"
                      value="Male"
                    >
                      Male
                    </SelectItem>
                    <SelectItem
                      className="cursor-pointer py-2 text-[#4B4650] focus:bg-[#FFF3F5]"
                      value="Non-binary"
                    >
                      Non-binary
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  className="block font-sans text-sm font-medium text-[#252025]"
                  htmlFor={`${fieldId}-age`}
                >
                  Age
                </label>
                <input
                  id={`${fieldId}-age`}
                  inputMode="numeric"
                  value={character.age}
                  onChange={(e) => onChange({ age: e.target.value })}
                  placeholder="e.g. 5"
                  className="mt-2 h-10 w-full rounded-[8px] border border-[#F3A8B7] bg-[#FFFCFA] px-3 font-sans text-sm text-[#4B4650] outline-none placeholder:text-[#B9B4B7] focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/25"
                />
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  className="block font-sans text-sm font-medium text-[#252025]"
                  htmlFor={`${fieldId}-hobbies`}
                >
                  Hobbies/ Interests <span className="font-normal">(optional)</span>
                </label>
                <input
                  id={`${fieldId}-hobbies`}
                  value={character.hobbies}
                  onChange={(e) => onChange({ hobbies: e.target.value })}
                  placeholder="e.g. drawing, cycling"
                  className="mt-2 h-10 w-full rounded-[8px] border border-[#F3A8B7] bg-[#FFFCFA] px-3 font-sans text-sm text-[#4B4650] outline-none placeholder:text-[#B9B4B7] focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/25"
                />
              </div>
              <div>
                <label
                  className="block font-sans text-sm font-medium text-[#252025]"
                  htmlFor={`${fieldId}-food`}
                >
                  Favorite food <span className="font-normal">(optional)</span>
                </label>
                <input
                  id={`${fieldId}-food`}
                  value={character.food}
                  onChange={(e) => onChange({ food: e.target.value })}
                  placeholder="e.g. pizza, ice-cream"
                  className="mt-2 h-10 w-full rounded-[8px] border border-[#F3A8B7] bg-[#FFFCFA] px-3 font-sans text-sm text-[#4B4650] outline-none placeholder:text-[#B9B4B7] focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/25"
                />
              </div>
            </div>
          </>
        ) : character.type === "Animal" ? (
          <>
            <label
              className="mt-5 block font-sans text-sm font-medium text-[#252025]"
              htmlFor={`${fieldId}-name`}
            >
              Animal Name
            </label>
            <input
              id={`${fieldId}-name`}
              value={character.animalName}
              onChange={(e) => onChange({ animalName: e.target.value })}
              placeholder="Enter the animal name"
              className="mt-2 h-10 w-full rounded-[8px] border border-[#F3A8B7] bg-[#FFFCFA] px-3 font-sans text-sm text-[#4B4650] outline-none placeholder:text-[#B9B4B7] focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/25"
            />
            <label
              className="mt-4 block font-sans text-sm font-medium text-[#252025]"
              htmlFor={`${fieldId}-species`}
            >
              Animal species
            </label>
            <input
              id={`${fieldId}-species`}
              value={character.animalSpecies}
              onChange={(e) => onChange({ animalSpecies: e.target.value })}
              placeholder="e.g. dog, cat, fish"
              className="mt-2 h-10 w-full rounded-[8px] border border-[#F3A8B7] bg-[#FFFCFA] px-3 font-sans text-sm text-[#4B4650] outline-none placeholder:text-[#B9B4B7] focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/25"
            />
          </>
        ) : (
          <>
            <label
              className="mt-5 block font-sans text-sm font-medium text-[#252025]"
              htmlFor={`${fieldId}-name`}
            >
              Name of object
            </label>
            <input
              id={`${fieldId}-name`}
              value={character.objectName}
              onChange={(e) => onChange({ objectName: e.target.value })}
              placeholder={"E.g. “Car”"}
              className="mt-2 h-10 w-full rounded-[8px] border border-[#F3A8B7] bg-[#FFFCFA] px-3 font-sans text-sm text-[#4B4650] outline-none placeholder:text-[#B9B4B7] focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/25"
            />
          </>
        )}

        <label className="mt-4 flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-[#F4CDD5] bg-white/20 px-4 text-center transition hover:bg-white/45 focus-within:ring-2 focus-within:ring-[#E88DA0]">
          <Upload
            aria-hidden="true"
            size={26}
            strokeWidth={1.5}
            className="text-[#B8B4B6]"
          />
          <span className="mt-2 font-sans text-sm text-[#B8B4B6]">
            {character.photoName || "Add a photo as a basis for the illustrations"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0] || null;
              onChange({
                photo: file,
                photoName: file?.name || "",
              });
            }}
          />
        </label>
        {canAdd && (
          <button
            type="button"
            onClick={() => onAdd(character.type)}
            className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-[7px] border border-[#F3A8B7] bg-white px-3 font-sans text-xs text-[#E88DA0] transition hover:bg-[#FFF3F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0]"
          >
            <UserRound aria-hidden="true" size={13} /> Add Character (max 4)
          </button>
        )}
      </form>
    </>
  );
}

export default function InformationAboutCharacters() {
  const router = useRouter();
  const {
    selectedAge,
    selectedTheme,
    selectedStory,
    selectedMessage,
    selectedIllustration,
    selectedFont,
    selectedLanguage,
    characters: storedCharacters,
    setCharacters,
  } = useBookBuilder();

  // Character 1 state
  const [characterType, setCharacterType] = useState<CharacterType>("Person");
  const [name, setName] = useState(storedCharacters[0]?.name || "Lily");
  const [gender, setGender] = useState<string | null>(
    storedCharacters[0]?.gender === "BOY"
      ? "Male"
      : storedCharacters[0]?.gender === "GIRL"
        ? "Female"
        : "Female"
  );
  const [ageValue, setAgeValue] = useState(
    storedCharacters[0]?.age ? String(storedCharacters[0].age) : "4"
  );
  const [hobbies, setHobbies] = useState(storedCharacters[0]?.hobbies || "");
  const [food, setFood] = useState(storedCharacters[0]?.favoriteFood || "");
  const [animalName, setAnimalName] = useState(storedCharacters[0]?.animalName || "");
  const [animalSpecies, setAnimalSpecies] = useState(
    storedCharacters[0]?.animalSpecies || ""
  );
  const [objectName, setObjectName] = useState(storedCharacters[0]?.objectName || "");
  const [photoFile, setPhotoFile] = useState<File | null>(storedCharacters[0]?.photo || null);
  const [photoName, setPhotoName] = useState(storedCharacters[0]?.photo?.name || "");

  const [additionalCharacters, setAdditionalCharacters] = useState<AdditionalCharState[]>([]);
  const nextCharacterId = useRef(2);

  const age = ages.find((item) => item.label === selectedAge);
  const theme = themes.find((item) => item.label === selectedTheme);
  const story = stories.find((item) => item.label === selectedStory);
  const message = messages.find((item) => item.label === selectedMessage);
  const font = fonts.find((item) => item.label === selectedFont);
  const illustrationLabels = [
    "3d Animation",
    "Water Colour",
    "Geometric",
    "Claymation",
    "Sticker Art",
    "Comic Book",
    "Gouache",
    "Soft Anime",
  ];
  const illustrationIndex = illustrationLabels.indexOf(selectedIllustration ?? "");
  const illustration =
    illustrationIndex >= 0
      ? {
          label: illustrationLabels[illustrationIndex],
          image: `/images/ill_${illustrationIndex + 1}.png`,
          color: "#FFFFFF",
        }
      : undefined;

  const addCharacter = (type: CharacterType) => {
    const id = nextCharacterId.current++;
    setAdditionalCharacters((chars) =>
      chars.length >= 3
        ? chars
        : [
            ...chars,
            {
              id,
              type,
              name: "",
              gender: "Female",
              age: "4",
              hobbies: "",
              food: "",
              animalName: "",
              animalSpecies: "",
              objectName: "",
              photo: null,
              photoName: "",
            },
          ]
    );
  };

  const updateAdditionalCharacter = (
    id: number,
    updated: Partial<AdditionalCharState>
  ) => {
    setAdditionalCharacters((chars) =>
      chars.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
  };

  const handleNextStep = () => {
    const char1Gender =
      gender === "Male" ? "BOY" : gender === "Female" ? "GIRL" : "OTHER";

    const mapped: CharacterData[] = [
      {
        id: 1,
        type: (characterType === "Person"
          ? "PERSON"
          : characterType === "Animal"
            ? "ANIMAL"
            : "OBJECT") as "PERSON" | "ANIMAL" | "OBJECT",
        name: name || "Lily",
        gender: char1Gender,
        age: parseInt(ageValue, 10) || 4,
        hobbies: hobbies || undefined,
        favoriteFood: food || undefined,
        animalName: animalName || undefined,
        animalSpecies: animalSpecies || undefined,
        objectName: objectName || undefined,
        photo: photoFile,
      },
      ...additionalCharacters.map((c, i): CharacterData => {
        const cGender: "BOY" | "GIRL" | "OTHER" =
          c.gender === "Male" ? "BOY" : c.gender === "Female" ? "GIRL" : "OTHER";
        return {
          id: c.id,
          type: (c.type === "Person"
            ? "PERSON"
            : c.type === "Animal"
              ? "ANIMAL"
              : "OBJECT") as "PERSON" | "ANIMAL" | "OBJECT",
          name: c.name || `Character ${i + 2}`,
          gender: cGender,
          age: parseInt(c.age, 10) || 4,
          hobbies: c.hobbies || undefined,
          favoriteFood: c.food || undefined,
          animalName: c.animalName || undefined,
          animalSpecies: c.animalSpecies || undefined,
          objectName: c.objectName || undefined,
          photo: c.photo,
        };
      }),
    ];

    setCharacters(mapped);
    router.push("/book-builder/personal-details");
  };

  return (
    <main className="min-h-screen bg-[#FEFAF4] px-4 pb-10 pt-[118px] sm:px-7 sm:pb-12 sm:pt-[136px] lg:px-[38px] lg:pb-20 lg:pt-[196px]">
      <section
        className="mx-auto max-w-[1280px]"
        aria-labelledby="character-heading"
      >
        <h1
          id="character-heading"
          className="font-crimson text-4xl font-normal leading-none text-[#1E1E1E] sm:text-[48px]"
        >
          Create a Story as Unique as Your Child
        </h1>
        <p className="mt-5 max-w-[1120px] font-sans text-lg font-normal leading-[1.4] text-[#444444] sm:text-[24px]">
          Choose a theme, add their name and special details, and create a
          personalized eBook they&apos;ll love. Turn it into a beautiful
          hardcover keepsake to treasure forever.
        </p>

        <section
          className="mt-10 rounded-[19px] bg-[#FBF3EA] px-3 py-4 sm:px-5 sm:py-6 lg:px-10 lg:py-10"
          aria-labelledby="character-options-heading"
        >
          <h2
            id="character-options-heading"
            className="font-fredoka text-base font-normal leading-none text-[#E88DA0] sm:text-[20px] lg:text-[32px]"
          >
            Build a Magical Story Just for Them
          </h2>
          <p className="mt-3 font-sans text-sm font-normal leading-none text-[#444444] sm:text-base lg:mt-5 lg:text-[20px]">
            Your Choice
          </p>

          <div className="mt-3 flex flex-wrap gap-2 sm:gap-3">
            <ChoiceChip
              label="Age"
              choice={age}
              href="/book-builder/choose-age"
            />
            <ChoiceChip
              label="Theme"
              choice={theme}
              href="/book-builder/choose-theme"
            />
            <ChoiceChip
              label="Subject"
              choice={story}
              href="/book-builder/choose-story"
            />
            <ChoiceChip
              label="Message"
              choice={message}
              href="/book-builder/personalize"
            />
            <ChoiceChip
              label="Illustration"
              choice={illustration}
              href="/book-builder/illustration"
            />
            <ChoiceChip
              label="Font"
              choice={font}
              href="/book-builder/choose-font"
            />
            <ChoiceChip
              label="Language"
              choice={
                selectedLanguage
                  ? {
                      label: selectedLanguage,
                      image: "/images/flag.png",
                      color: "#FFFBDF",
                    }
                  : undefined
              }
              href="/book-builder/language"
            />
          </div>

          <h3 className="mt-8 font-sans text-lg font-semibold leading-none text-[#1E1E1E] lg:mt-10 lg:text-[28px]">
            Information about the Characters
          </h3>
          <p className="mt-2 font-sans text-sm text-[#444444] sm:text-base">
            Add one or more characters for your story. These can be people,
            animals or objects.
          </p>
          <h4 className="mt-7 font-sans text-base font-semibold text-[#1E1E1E] sm:text-lg">
            Character 1
          </h4>

          <form
            className="mt-3 max-w-[1120px] rounded-[10px] border border-[#F3A8B7] bg-white/20 p-3 sm:p-5"
            onSubmit={(event) => event.preventDefault()}
          >
            <fieldset>
              <legend className="font-sans text-sm font-medium text-[#252025]">
                Choose the type of character
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {characterTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = characterType === type.label;
                  return (
                    <button
                      key={type.label}
                      type="button"
                      onClick={() => setCharacterType(type.label)}
                      className={`inline-flex h-10 items-center gap-2 rounded-xl border px-4 font-sans text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0] ${
                        isSelected
                          ? "border-[#F3A8B7] bg-[#F5B0BE] text-white"
                          : "border-[#F6C9D2] bg-white text-[#E88DA0] hover:bg-[#FFF3F5]"
                      }`}
                    >
                      <Icon aria-hidden="true" size={16} />
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {characterType === "Person" ? (
              <>
                <label
                  className="mt-5 block font-sans text-sm font-medium text-[#252025]"
                  htmlFor="character-name"
                >
                  Main Character
                </label>
                <input
                  id="character-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter the character's name"
                  className="mt-2 h-10 w-full rounded-[8px] border border-[#F3A8B7] bg-[#FFFCFA] px-3 font-sans text-sm text-[#4B4650] outline-none placeholder:text-[#B9B4B7] focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/25"
                />

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      className="block font-sans text-sm font-medium text-[#252025]"
                      htmlFor="character-gender"
                    >
                      Gender
                    </label>
                    <Select
                      value={gender}
                      onValueChange={(val) => setGender(val)}
                    >
                      <SelectTrigger
                        id="character-gender"
                        className="mt-2 h-10 w-full rounded-[8px] border-[#F3A8B7] bg-[#FFFCFA] px-3 font-sans text-sm text-[#4B4650] focus-visible:border-[#E88DA0] focus-visible:ring-[#E88DA0]/25"
                      >
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="z-[100] border border-[#F3A8B7] bg-white text-[#4B4650] shadow-[0_10px_24px_rgba(91,69,78,0.16)]">
                        <SelectItem
                          className="cursor-pointer py-2 text-[#4B4650] focus:bg-[#FFF3F5] focus:text-[#4B4650]"
                          value="Female"
                        >
                          Female
                        </SelectItem>
                        <SelectItem
                          className="cursor-pointer py-2 text-[#4B4650] focus:bg-[#FFF3F5] focus:text-[#4B4650]"
                          value="Male"
                        >
                          Male
                        </SelectItem>
                        <SelectItem
                          className="cursor-pointer py-2 text-[#4B4650] focus:bg-[#FFF3F5] focus:text-[#4B4650]"
                          value="Non-binary"
                        >
                          Non-binary
                        </SelectItem>
                        <SelectItem
                          className="cursor-pointer py-2 text-[#4B4650] focus:bg-[#FFF3F5] focus:text-[#4B4650]"
                          value="Prefer not to say"
                        >
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label
                      className="block font-sans text-sm font-medium text-[#252025]"
                      htmlFor="character-age"
                    >
                      Age
                    </label>
                    <input
                      id="character-age"
                      inputMode="numeric"
                      value={ageValue}
                      onChange={(e) => setAgeValue(e.target.value)}
                      placeholder="e.g. 5"
                      className="mt-2 h-10 w-full rounded-[8px] border border-[#F3A8B7] bg-[#FFFCFA] px-3 font-sans text-sm text-[#4B4650] outline-none placeholder:text-[#B9B4B7] focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/25"
                    />
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      className="block font-sans text-sm font-medium text-[#252025]"
                      htmlFor="character-hobbies"
                    >
                      Hobbies/ Interests{" "}
                      <span className="font-normal">(optional)</span>
                    </label>
                    <input
                      id="character-hobbies"
                      value={hobbies}
                      onChange={(e) => setHobbies(e.target.value)}
                      placeholder="e.g. drawing, cycling"
                      className="mt-2 h-10 w-full rounded-[8px] border border-[#F3A8B7] bg-[#FFFCFA] px-3 font-sans text-sm text-[#4B4650] outline-none placeholder:text-[#B9B4B7] focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/25"
                    />
                  </div>
                  <div>
                    <label
                      className="block font-sans text-sm font-medium text-[#252025]"
                      htmlFor="character-food"
                    >
                      Favorite food{" "}
                      <span className="font-normal">(optional)</span>
                    </label>
                    <input
                      id="character-food"
                      value={food}
                      onChange={(e) => setFood(e.target.value)}
                      placeholder="e.g. pizza, ice-cream"
                      className="mt-2 h-10 w-full rounded-[8px] border border-[#F3A8B7] bg-[#FFFCFA] px-3 font-sans text-sm text-[#4B4650] outline-none placeholder:text-[#B9B4B7] focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/25"
                    />
                  </div>
                </div>
              </>
            ) : characterType === "Animal" ? (
              <>
                <label
                  className="mt-5 block font-sans text-sm font-medium text-[#252025]"
                  htmlFor="animal-name"
                >
                  Animal Name
                </label>
                <input
                  id="animal-name"
                  value={animalName}
                  onChange={(e) => setAnimalName(e.target.value)}
                  placeholder="Enter the animal name"
                  className="mt-2 h-10 w-full rounded-[8px] border border-[#F3A8B7] bg-[#FFFCFA] px-3 font-sans text-sm text-[#4B4650] outline-none placeholder:text-[#B9B4B7] focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/25"
                />
                <label
                  className="mt-4 block font-sans text-sm font-medium text-[#252025]"
                  htmlFor="animal-species"
                >
                  Animal species
                </label>
                <input
                  id="animal-species"
                  value={animalSpecies}
                  onChange={(e) => setAnimalSpecies(e.target.value)}
                  placeholder="e.g. dog, cat, fish"
                  className="mt-2 h-10 w-full rounded-[8px] border border-[#F3A8B7] bg-[#FFFCFA] px-3 font-sans text-sm text-[#4B4650] outline-none placeholder:text-[#B9B4B7] focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/25"
                />
              </>
            ) : (
              <>
                <label
                  className="mt-5 block font-sans text-sm font-medium text-[#252025]"
                  htmlFor="object-name"
                >
                  Name of object
                </label>
                <input
                  id="object-name"
                  value={objectName}
                  onChange={(e) => setObjectName(e.target.value)}
                  placeholder={"E.g. “Car”"}
                  className="mt-2 h-10 w-full rounded-[8px] border border-[#F3A8B7] bg-[#FFFCFA] px-3 font-sans text-sm text-[#4B4650] outline-none placeholder:text-[#B9B4B7] focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/25"
                />
              </>
            )}

            <label className="mt-4 flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-[#F4CDD5] bg-white/20 px-4 text-center transition hover:bg-white/45 focus-within:ring-2 focus-within:ring-[#E88DA0]">
              <Upload
                aria-hidden="true"
                size={26}
                strokeWidth={1.5}
                className="text-[#B8B4B6]"
              />
              <span className="mt-2 font-sans text-sm text-[#B8B4B6]">
                {photoName || "Add a photo as a basis for the illustrations"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  setPhotoFile(file);
                  setPhotoName(file?.name || "");
                }}
              />
            </label>

            {additionalCharacters.length < 3 && (
              <button
                type="button"
                onClick={() => addCharacter(characterType)}
                className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-[7px] border border-[#F3A8B7] bg-white px-3 font-sans text-xs text-[#E88DA0] transition hover:bg-[#FFF3F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0]"
              >
                <UserRound aria-hidden="true" size={13} /> Add Character (max 4)
              </button>
            )}
          </form>

          {additionalCharacters.map((character, index) => (
            <AddedCharacterForm
              key={character.id}
              number={index + 2}
              character={character}
              canAdd={
                index === additionalCharacters.length - 1 &&
                additionalCharacters.length < 3
              }
              onAdd={addCharacter}
              onRemove={() =>
                setAdditionalCharacters((chars) =>
                  chars.filter((item) => item.id !== character.id)
                )
              }
              onChange={(updated) =>
                updateAdditionalCharacter(character.id, updated)
              }
            />
          ))}

          <div className="mt-7 flex justify-center">
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex h-10 items-center rounded-xl bg-[#E88DA0] px-7 font-sans text-sm font-semibold text-white shadow-[0_5px_12px_rgba(232,141,160,0.25)] transition hover:bg-[#DD7893] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0] focus-visible:ring-offset-2"
            >
              Next Step
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}
