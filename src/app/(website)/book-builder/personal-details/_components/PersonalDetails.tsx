"use client";

import Image from "next/image";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useBookBuilder } from "../../_components/BookBuilderProvider";
import { getStoryChoice } from "../../_components/subject-options";
import { useBookBuilderTranslations } from "../../_components/useBookBuilderTranslations";
import {
  getGuestDetailsValidationError,
  isValidCreatorName,
} from "../../_components/validation";

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

const EMPTY_USER_DETAILS = {
  name: "",
  country: "",
  email: "",
  confirmEmail: "",
  password: "",
};

type Choice = { label: string; image: string; color: string };

function ChoiceChip({ choice, displayLabel }: { choice?: Choice; displayLabel?: string }) {
  if (!choice) return null;

  return (
    <div
      className="inline-flex h-7 items-center gap-1.5 rounded-full px-2 pr-2.5 font-sans text-[10px] font-medium text-[#4B4650] sm:h-9 sm:gap-2 sm:px-2 sm:pr-3 sm:text-sm"
      style={{ backgroundColor: choice.color }}
    >
      <span className="relative size-4 overflow-hidden rounded-full bg-white/45 sm:size-6">
        <Image src={choice.image} alt="" fill sizes="24px" className="object-contain object-bottom" />
      </span>
      <span>{displayLabel || choice.label}</span>
      <Pencil aria-hidden="true" size={11} strokeWidth={2.5} className="text-[#E5AF32] sm:size-[13px]" />
    </div>
  );
}

function FormField({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-sans text-sm font-medium text-[#252025]">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={onChange}
        className="h-8 w-full rounded-[5px] border border-[#F3A8B7] bg-[#FFFCFA] px-2.5 font-sans text-[10px] text-[#4B4650] outline-none placeholder:text-[#B9B4B7] focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/20 sm:h-9 sm:text-xs"
      />
    </label>
  );
}

export default function PersonalDetails() {
  const router = useRouter();
  const {
    selectedAge,
    selectedTheme,
    selectedStory,
    selectedMessage,
    selectedIllustration,
    selectedFont,
    selectedLanguage,
    setCreatorName,
    setUserDetails,
  } = useBookBuilder();
  const { bb, translateAge, translateTheme, translateMessage, translateIllustration, translateFont } = useBookBuilderTranslations();

  const { data: session, status: sessionStatus } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Form fields deliberately start empty on every visit. Builder state still
  // powers the "Your Choice" summary, but it must never prefill user-entered
  // information in this form.
  const [localCreatorName, setLocalCreatorName] = useState("");
  const [localUser, setLocalUser] = useState(EMPTY_USER_DETAILS);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsLoggedIn(sessionStatus === "authenticated" || Boolean(session) || Boolean(token));
  }, [sessionStatus, session]);

  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!isValidCreatorName(localCreatorName)) {
      setErrorMessage("Enter the creator name (2–100 characters).");
      return;
    }

    if (!isLoggedIn) {
      const guestDetailsError = getGuestDetailsValidationError(localUser);
      if (guestDetailsError) {
        setErrorMessage(guestDetailsError);
        return;
      }
    }

    setCreatorName(localCreatorName.trim());
    if (!isLoggedIn) {
      setUserDetails({
        name: localUser.name.trim(),
        country: localUser.country.trim(),
        email: localUser.email.trim(),
        confirmEmail: localUser.confirmEmail.trim(),
        password: localUser.password,
      });
    }
    router.push("/book-builder/checkout");
  };

  const age = ages.find((item) => item.label === selectedAge);
  const theme = themes.find((item) => item.label === selectedTheme);
  const story = getStoryChoice(selectedStory, selectedTheme);
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

  return (
    <main className="min-h-screen bg-[#FEFAF4] px-3 pb-8 pt-[102px] sm:px-7 sm:pb-12 sm:pt-[136px] lg:px-[38px] lg:pt-[196px]">
      <section className="mx-auto max-w-[1280px]" aria-labelledby="personal-details-heading">
        <h1 id="personal-details-heading" className="font-crimson text-[22px] leading-none text-[#1E1E1E] sm:text-4xl lg:text-[48px]">
          {bb?.bannerTitle}
        </h1>
        <p className="mt-3 max-w-[1120px] font-sans text-[10px] leading-[1.4] text-[#444444] sm:mt-5 sm:text-lg lg:text-[24px]">
          {bb?.bannerDesc}
        </p>

        <section className="mt-5 w-full rounded-[18px] bg-[#FBF3EA] p-3 sm:mt-10 sm:p-6 lg:p-10" aria-labelledby="builder-summary-heading">
          <h2 id="builder-summary-heading" className="font-fredoka text-sm leading-none text-[#E88DA0] sm:text-xl lg:text-[32px]">
            {bb?.buildStory}
          </h2>
          <p className="mt-3 font-sans text-xs text-[#444444] sm:text-base lg:mt-5 lg:text-[20px]">{bb?.yourChoice}</p>
          <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-3">
            <ChoiceChip choice={age} displayLabel={translateAge(age?.label)} />
            <ChoiceChip choice={theme} displayLabel={translateTheme(theme?.label)} />
            <ChoiceChip choice={story} />
            <ChoiceChip choice={message} displayLabel={translateMessage(message?.label)} />
            <ChoiceChip choice={illustration} displayLabel={translateIllustration(illustration?.label)} />
            <ChoiceChip choice={font} displayLabel={translateFont(font?.label)} />
            <ChoiceChip
              choice={
                selectedLanguage
                  ? { label: selectedLanguage, image: "/images/flag.png", color: "#FFFBDF" }
                  : undefined
              }
            />
          </div>

          <div className="mt-6 sm:mt-9">
            <h3 className="font-sans text-sm font-semibold text-[#1E1E1E] sm:text-lg lg:text-[28px]">
              {bb?.yourPersonalDetails || "Your personal details"}
            </h3>
            <p className="mt-1 font-sans text-[10px] text-[#66605F] sm:text-sm">
              {bb?.creatorSubtitle || "Give the book a unique and personal touch by including the creator of the book."}
            </p>
          </div>

          <div className="mt-3 rounded-[7px] border border-[#F3A8B7] bg-white/20 p-2 sm:mt-5 sm:p-4">
            <FormField
              label={bb?.creatorLabel || "Creator of the book"}
              placeholder={bb?.creatorPlaceholder || "Enter the author’s name"}
              value={localCreatorName}
              onChange={(e) => setLocalCreatorName(e.target.value)}
            />
          </div>

          {!isLoggedIn && (
            <>
              <div className="mt-5 sm:mt-7">
                <h3 className="font-sans text-sm font-semibold text-[#1E1E1E] sm:text-lg lg:text-[28px]">
                  {bb?.yourDetails || "Your details"}
                </h3>
                <p className="mt-1 font-sans text-[10px] text-[#66605F] sm:text-sm">
                  {bb?.yourDetailsSubtitle || "Fill in your details to create an account and save your book."}
                </p>
              </div>
              <div className="mt-3 space-y-4 rounded-[7px] border border-[#F3A8B7] bg-white/20 p-2 sm:mt-5 sm:space-y-5 sm:p-4">
                <FormField
                  label={bb?.name || "Name"}
                  placeholder={bb?.namePlaceholder || "Enter your full name"}
                  value={localUser.name}
                  onChange={(e) => setLocalUser((prev) => ({ ...prev, name: e.target.value }))}
                />
                <FormField
                  label={bb?.country || "Country"}
                  placeholder={bb?.countryPlaceholder || "United Kingdom"}
                  value={localUser.country}
                  onChange={(e) => setLocalUser((prev) => ({ ...prev, country: e.target.value }))}
                />
                <FormField
                  label={bb?.email || "Email"}
                  placeholder={bb?.emailPlaceholder || "you123@gmail.com"}
                  type="email"
                  value={localUser.email}
                  onChange={(e) => setLocalUser((prev) => ({ ...prev, email: e.target.value }))}
                />
                <FormField
                  label={bb?.confirmEmail || "Confirm email"}
                  placeholder={bb?.emailPlaceholder || "you123@gmail.com"}
                  type="email"
                  value={localUser.confirmEmail}
                  onChange={(e) => setLocalUser((prev) => ({ ...prev, confirmEmail: e.target.value }))}
                />
                <FormField
                  label={bb?.password || "Password (min 8 letters)"}
                  placeholder={bb?.passwordPlaceholder || "Choose strong password"}
                  type="password"
                  value={localUser.password}
                  onChange={(e) => setLocalUser((prev) => ({ ...prev, password: e.target.value }))}
                />
              </div>
            </>
          )}

          {errorMessage && (
            <p role="alert" className="mt-3 font-sans text-xs text-[#B74760]">{errorMessage}</p>
          )}

          <p className="mt-3 rounded-[5px] bg-[#FFF1C6] px-2 py-2 font-sans text-[8px] leading-[1.3] text-[#B78631] sm:mt-5 sm:text-[10px]">
            {bb?.pricingNotice || "ⓘ Almost there. Your digital book costs €8.99. If you also order a hardcover book later, this amount is deducted from it."}
          </p>
          <div className="mt-4 flex justify-center sm:mt-6">
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex h-8 items-center rounded-xl bg-[#E88DA0] px-5 font-sans text-[10px] font-semibold text-white shadow-[0_4px_10px_rgba(232,141,160,0.22)] transition hover:bg-[#DD7893] sm:h-10 sm:px-7 sm:text-sm"
            >
              {bb?.nextStep || "Next Step"}
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}

