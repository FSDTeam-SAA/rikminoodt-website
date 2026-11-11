"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { useBookBuilder } from "../../_components/BookBuilderProvider";
import { getStoryChoice } from "../../_components/subject-options";
import { useBookBuilderTranslations } from "../../_components/useBookBuilderTranslations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/components/providers/LanguageProvider";

const ages = [
  { label: "0-2 Years", image: "/images/age_1.png", color: "#FDE1CF" },
  { label: "3-5 Years", image: "/images/age_2.png", color: "#DDEEFF" },
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

const illustrations = [
  { label: "3d Animation", image: "/images/ill_1.png" },
  { label: "Water Colour", image: "/images/ill_2.png" },
  { label: "Geometric", image: "/images/ill_3.png" },
  { label: "Claymation", image: "/images/ill_4.png" },
  { label: "Sticker Art", image: "/images/ill_5.png" },
  { label: "Comic Book", image: "/images/ill_6.png" },
  { label: "Gouache", image: "/images/ill_7.png" },
  { label: "Soft Anime", image: "/images/ill_8.png" },
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

const variants: Record<string, string[]> = {
  Dutch: ["Standard Dutch", "Belgian Dutch"],
  English: ["Standard (British English)", "Standard (American English)", "Australian English"],
  French: ["France French", "Canadian French"],
};

const bookLanguageBySiteLanguage = {
  nl: "Dutch",
  en: "English",
  fr: "French",
} as const;

const variantLabels: Record<string, Record<string, Record<string, string>>> = {
  en: {
    Dutch: {
      "Standard Dutch": "Standard Dutch",
      "Belgian Dutch": "Belgian Dutch (Flemish)",
    },
    English: {
      "Standard (British English)": "Standard (British English)",
      "Standard (American English)": "Standard (American English)",
      "Australian English": "Australian English",
    },
    French: {
      "France French": "France French",
      "Canadian French": "Canadian French",
    },
  },
  nl: {
    Dutch: {
      "Standard Dutch": "Standaard Nederlands",
      "Belgian Dutch": "Belgisch Nederlands (Vlaams)",
    },
    English: {
      "Standard (British English)": "Standaard (Brits Engels)",
      "Standard (American English)": "Standaard (Amerikaans Engels)",
      "Australian English": "Australisch Engels",
    },
    French: {
      "France French": "Frans (Frankrijk)",
      "Canadian French": "Canadees Frans",
    },
  },
  fr: {
    Dutch: {
      "Standard Dutch": "Néerlandais standard",
      "Belgian Dutch": "Néerlandais de Belgique (Flamand)",
    },
    English: {
      "Standard (British English)": "Standard (Anglais britannique)",
      "Standard (American English)": "Standard (Anglais américain)",
      "Australian English": "Anglais australien",
    },
    French: {
      "France French": "Français de France",
      "Canadian French": "Français canadien",
    },
  },
};

type Choice = { label: string; image: string; color?: string };

function ChoiceChip({ choice, href, label, displayLabel, chooseLabel }: { choice: Choice | undefined; href: string; label: string; displayLabel?: string; chooseLabel: string }) {
  if (!choice) {
    return (
      <Link href={href} className="rounded-full border border-dashed border-[#D8C8C2] px-3 py-2 text-sm text-[#856F77] transition hover:border-[#E88DA0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0]">
        {chooseLabel} {label.toLowerCase()}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-label={`Edit ${label.toLowerCase()}: ${choice.label}`}
      className={`group inline-flex h-10 items-center gap-2 rounded-full px-2 pr-3 font-sans text-base font-medium transition hover:brightness-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0] focus-visible:ring-offset-2 ${choice.label === "Neon Nexus" ? "text-white" : "text-[#4B4650]"}`}
      style={{ backgroundColor: choice.color ?? "#FFFFFF" }}
    >
      <span className="relative size-6 overflow-hidden rounded-full bg-white/45">
        <Image src={choice.image} alt="" fill sizes="24px" className="object-contain object-bottom" />
      </span>
      <span>{displayLabel || choice.label}</span>
      <Pencil aria-hidden="true" size={14} strokeWidth={2.3} className="text-[#E5AF32] transition-transform group-hover:scale-110" />
    </Link>
  );
}

export default function Language() {
  const {
    selectedAge,
    selectedTheme,
    selectedStory,
    selectedMessage,
    selectedIllustration,
    selectedFont,
    selectedLanguage,
    setSelectedLanguage,
    selectedVariant,
    setSelectedVariant,
  } = useBookBuilder();

  const { bb, translateAge, translateTheme, translateMessage, translateIllustration, translateFont, translateLabel } = useBookBuilderTranslations();
  const { language: siteLanguage } = useLanguage();
  const defaultLanguage = bookLanguageBySiteLanguage[siteLanguage] || "Dutch";

  const prevSiteLanguageRef = useRef(siteLanguage);

  useEffect(() => {
    // If no language is selected yet, initialize with the current site language default
    if (!selectedLanguage) {
      setSelectedLanguage(defaultLanguage);
      setSelectedVariant(variants[defaultLanguage][0]);
      return;
    }

    // If site language changed, and current selectedLanguage matched the previous site default, update to new site default
    const prevSite = prevSiteLanguageRef.current;
    if (prevSite !== siteLanguage) {
      const prevDefault = bookLanguageBySiteLanguage[prevSite as keyof typeof bookLanguageBySiteLanguage];
      if (selectedLanguage === prevDefault) {
        setSelectedLanguage(defaultLanguage);
        setSelectedVariant(variants[defaultLanguage][0]);
      }
      prevSiteLanguageRef.current = siteLanguage;
    }
  }, [defaultLanguage, selectedLanguage, setSelectedLanguage, setSelectedVariant, siteLanguage]);

  const language = selectedLanguage && variants[selectedLanguage] ? selectedLanguage : defaultLanguage;
  const availableVariants = variants[language] || variants[defaultLanguage];
  const variant = selectedVariant && availableVariants.includes(selectedVariant) ? selectedVariant : availableVariants[0];

  const age = ages.find((item) => item.label === selectedAge);
  const theme = themes.find((item) => item.label === selectedTheme);
  const story = getStoryChoice(selectedStory, selectedTheme);
  const message = messages.find((item) => item.label === selectedMessage);
  const illustration = illustrations.find((item) => item.label === selectedIllustration);
  const font = fonts.find((item) => item.label === selectedFont);
  const chooseLabel = bb?.choose ?? "Choose";

  const getBookLanguageDisplay = (langKey: string) => {
    return bb?.bookLanguages?.[langKey as keyof typeof bb.bookLanguages] || langKey;
  };

  const getVariantDisplay = (langKey: string, variantKey: string) => {
    return variantLabels[siteLanguage]?.[langKey]?.[variantKey] || variantLabels.en[langKey]?.[variantKey] || variantKey;
  };

  const changeLanguage = (nextLanguage: string) => {
    setSelectedLanguage(nextLanguage);
    const nextVariants = variants[nextLanguage] || [];
    if (nextVariants.length > 0) {
      setSelectedVariant(nextVariants[0]);
    }
  };

  return (
    <main className="min-h-screen bg-[#FEFAF4] px-4 pb-10 pt-[118px] sm:px-7 sm:pb-12 sm:pt-[136px] lg:px-[38px] lg:pb-20 lg:pt-[196px]">
      <section className="mx-auto max-w-[1280px]" aria-labelledby="language-heading">
        <h1 id="language-heading" className="font-crimson text-4xl font-normal leading-none text-[#1E1E1E] sm:text-[48px]">
          {bb?.bannerTitle}
        </h1>
        <p className="mt-5 max-w-[1120px] font-sans text-lg font-normal leading-[1.4] text-[#444444] sm:text-[24px]">
          {bb?.bannerDesc}
        </p>

        <section className="mt-10 rounded-[19px] bg-[#FBF3EA] px-4 py-5 sm:px-5 sm:py-6 lg:px-10 lg:py-10" aria-labelledby="language-options-heading">
          <h2 id="language-options-heading" className="font-fredoka text-base font-normal leading-none text-[#E88DA0] sm:text-[20px] lg:text-[32px]">
            {bb?.buildStory}
          </h2>
          <p className="mt-3 font-sans text-base font-normal leading-none text-[#444444] lg:mt-5 lg:text-[20px]">{bb?.yourChoice}</p>

          <div className="mt-3 flex flex-wrap gap-2 sm:gap-3">
            <ChoiceChip label={translateLabel("Age")} displayLabel={translateAge(age?.label)} choice={age} href="/book-builder/choose-age" chooseLabel={chooseLabel} />
            <ChoiceChip label={translateLabel("Theme")} displayLabel={translateTheme(theme?.label)} choice={theme} href="/book-builder/choose-theme" chooseLabel={chooseLabel} />
            <ChoiceChip label={translateLabel("Subject")} choice={story} href="/book-builder/choose-story" chooseLabel={chooseLabel} />
            <ChoiceChip label={translateLabel("Message")} displayLabel={translateMessage(message?.label)} choice={message} href="/book-builder/personalize" chooseLabel={chooseLabel} />
            <ChoiceChip label={translateLabel("Illustration")} displayLabel={translateIllustration(illustration?.label)} choice={illustration} href="/book-builder/illustration" chooseLabel={chooseLabel} />
            <ChoiceChip label={translateLabel("Font")} displayLabel={translateFont(font?.label)} choice={font} href="/book-builder/choose-font" chooseLabel={chooseLabel} />
          </div>

          <h3 className="mt-8 font-sans text-lg font-semibold leading-none text-[#1E1E1E] lg:mt-10 lg:text-[28px]">
            {bb?.bookInfoTitle}
          </h3>
          <p className="mt-2 font-sans text-sm text-[#444444] sm:text-base">{bb?.bookInfoDescription}</p>

          <form className="mt-7 max-w-[1120px] rounded-xl border border-[#F3A8B7] bg-white/20 p-3 sm:p-5" onSubmit={(event) => event.preventDefault()}>
            <label className="block font-sans text-sm font-medium text-[#252025] sm:text-base" htmlFor="book-language">
              {bb?.bookLanguageLabel}
            </label>
            <Select
              value={language}
              onValueChange={(value) => {
                if (value) changeLanguage(value);
              }}
            >
              <SelectTrigger id="book-language" className="mt-3 h-11 w-full rounded-xl border-[#F3A8B7] bg-[#FFFCFA] px-4 font-sans text-sm text-[#4B4650] focus-visible:border-[#E88DA0] focus-visible:ring-[#E88DA0]/25 sm:text-base">
                <SelectValue placeholder={getBookLanguageDisplay(language)}>
                  {getBookLanguageDisplay(language)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="z-[100] border border-[#F3A8B7] bg-white text-[#4B4650] shadow-[0_10px_24px_rgba(91,69,78,0.16)]">
                {Object.keys(variants).map((languageOption) => (
                  <SelectItem
                    className="cursor-pointer py-2.5 text-sm sm:text-base text-[#4B4650] focus:bg-[#FFF3F5] focus:text-[#4B4650]"
                    key={languageOption}
                    value={languageOption}
                  >
                    {getBookLanguageDisplay(languageOption)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <label className="mt-6 block font-sans text-sm font-medium text-[#252025] sm:text-base" htmlFor="book-variant">
              {bb?.regionalVariantLabel}
            </label>
            <Select
              value={variant}
              onValueChange={(value) => {
                if (value) setSelectedVariant(value);
              }}
            >
              <SelectTrigger id="book-variant" className="mt-3 h-11 w-full rounded-xl border-[#F3A8B7] bg-[#FFFCFA] px-4 font-sans text-sm text-[#4B4650] focus-visible:border-[#E88DA0] focus-visible:ring-[#E88DA0]/25 sm:text-base">
                <SelectValue placeholder={getVariantDisplay(language, variant)}>
                  {getVariantDisplay(language, variant)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="z-[100] border border-[#F3A8B7] bg-white text-[#4B4650] shadow-[0_10px_24px_rgba(91,69,78,0.16)]">
                {availableVariants.map((variantOption) => (
                  <SelectItem
                    className="cursor-pointer py-2.5 text-sm sm:text-base text-[#4B4650] focus:bg-[#FFF3F5] focus:text-[#4B4650]"
                    key={variantOption}
                    value={variantOption}
                  >
                    {getVariantDisplay(language, variantOption)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mt-8 flex justify-center">
              <Link
                onClick={() => {
                  setSelectedLanguage(language);
                  setSelectedVariant(variant);
                }}
                href="/book-builder/InformationAboutCharacters"
                className="inline-flex h-11 items-center rounded-xl bg-[#E88DA0] px-8 font-sans text-sm sm:text-base font-semibold text-white shadow-[0_5px_12px_rgba(232,141,160,0.25)] transition hover:bg-[#DD7893] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0] focus-visible:ring-offset-2 active:scale-[0.99]"
              >
                {bb?.nextStep || "Next Step"}
              </Link>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}
