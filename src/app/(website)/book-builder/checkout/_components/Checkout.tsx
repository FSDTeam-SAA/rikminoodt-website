"use client";

import Image from "next/image";
import {
  Check,
  CircleHelp,
  CreditCard,
  Loader2,
  Pencil,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import BookerelloReviews from "../../../_components/bookerello-reviews";
import { useBookBuilder } from "../../_components/BookBuilderProvider";
import GenerationStatusModal from "../../_components/GenerationStatusModal";
import { getApiBaseUrl } from "@/config/api";
import {
  mapAge,
  mapTheme,
  mapSubject,
  mapMessage,
  mapIllustration,
  mapFont,
} from "../../_components/api-mappers";

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

type Choice = { label: string; image: string; color: string };

function ChoiceChip({ choice }: { choice?: Choice }) {
  if (!choice) return null;
  return (
    <div
      className="inline-flex h-10 items-center gap-2 rounded-full px-2 pr-3 font-sans text-sm font-medium text-[#4B4650] shadow-[0_2px_2px_rgba(115,88,94,0.12)] sm:h-12 sm:text-xl"
      style={{ backgroundColor: choice.color }}
    >
      <span className="relative size-6 overflow-hidden rounded-full bg-white/45 sm:size-7">
        <Image
          src={choice.image}
          alt=""
          fill
          sizes="28px"
          className="object-contain object-bottom"
        />
      </span>
      <span>{choice.label}</span>
      <Pencil
        size={13}
        strokeWidth={2.5}
        className="text-[#E5AF32] sm:size-4"
      />
    </div>
  );
}

export default function Checkout() {
  const {
    selectedAge,
    selectedTheme,
    selectedStory,
    selectedMessage,
    selectedIllustration,
    selectedFont,
    selectedLanguage,
    selectedVariant,
    characters,
    creatorName,
    foreword,
    voiceBlob,
    userDetails,
    cardDetails,
    setCardDetails,
    currentBookId,
    setCurrentBookId,
  } = useBookBuilder();

  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdBookId, setCreatedBookId] = useState<string | null>(currentBookId);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const age = ages.find((item) => item.label === selectedAge);
  const theme = themes.find((item) => item.label === selectedTheme);
  const story = stories.find((item) => item.label === selectedStory);
  const message = messages.find((item) => item.label === selectedMessage);
  const font = fonts.find((item) => item.label === selectedFont);

  const handleCardholderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardDetails({ cardholderName: e.target.value });
    if (fieldErrors.cardholderName) {
      setFieldErrors((prev) => ({ ...prev, cardholderName: "" }));
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 19);
    const formatted = raw.match(/.{1,4}/g)?.join(" ") || raw;
    setCardDetails({ cardNumber: formatted });
    if (fieldErrors.cardNumber) {
      setFieldErrors((prev) => ({ ...prev, cardNumber: "" }));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardDetails({ expiryDate: raw });
    if (fieldErrors.expiryDate) {
      setFieldErrors((prev) => ({ ...prev, expiryDate: "" }));
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCardDetails({ cvv: raw });
    if (fieldErrors.cvv) {
      setFieldErrors((prev) => ({ ...prev, cvv: "" }));
    }
  };

  const handleContinueWithCard = async () => {
    setSubmitError("");
    const errors: { [key: string]: string } = {};

    const cardholder = cardDetails?.cardholderName?.trim() || "";
    const cardNumberClean = (cardDetails?.cardNumber || "").replace(/\D/g, "");
    const expiry = (cardDetails?.expiryDate || "").trim();
    const cvvClean = (cardDetails?.cvv || "").replace(/\D/g, "");

    if (!cardholder) {
      errors.cardholderName = "Please enter the cardholder name.";
    }

    if (!cardNumberClean || cardNumberClean.length < 13 || cardNumberClean.length > 19) {
      errors.cardNumber = "Please enter a valid card number.";
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      errors.expiryDate = "Enter expiry date as MM/YY.";
    } else {
      const [m] = expiry.split("/").map(Number);
      if (m < 1 || m > 12) {
        errors.expiryDate = "Enter a valid month (01-12).";
      }
    }

    if (!cvvClean || cvvClean.length < 3 || cvvClean.length > 4) {
      errors.cvv = "Enter 3 or 4 digits.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSubmitError("Please fill out all card fields correctly.");
      return;
    }
    setFieldErrors({});

    const existingToken =
      session?.user?.accessToken ||
      (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    // If guest user (not logged in), validate required user registration fields
    if (!existingToken) {
      const uEmail = userDetails?.email?.trim() || "";
      const uConfirm = userDetails?.confirmEmail?.trim() || "";
      const uPass = userDetails?.password?.trim() || "";
      const uName = userDetails?.name?.trim() || "";

      if (!uName) {
        setSubmitError("Please enter your name in the Personal Details step, or log in first.");
        return;
      }

      if (!uEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(uEmail)) {
        setSubmitError("Please enter a valid email address in the Personal Details step, or log in first.");
        return;
      }

      if (uEmail !== uConfirm) {
        setSubmitError("Email and confirm email do not match in Personal Details.");
        return;
      }

      if (!uPass || uPass.length < 8) {
        setSubmitError("Password must be at least 8 characters in Personal Details.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const apiBase = getApiBaseUrl();

      const mappedAge = mapAge(selectedAge);
      const mappedTheme = mapTheme(selectedTheme);
      const mappedSubject = mapSubject(selectedStory, mappedTheme);
      const mappedMessage = mapMessage(selectedMessage);
      const mappedIllustration = mapIllustration(selectedIllustration);
      const mappedFont = mapFont(selectedFont);

      // Map characters (guaranteeing non-empty array)
      const mappedCharacters = (characters && characters.length > 0
        ? characters
        : [
            {
              id: 1,
              type: "PERSON" as const,
              name: "Lily",
              gender: "GIRL" as const,
              age: 4,
              hobbies: "drawing",
              favoriteFood: "pizza",
            },
          ]
      ).map((c) => {
        if (c.type === "ANIMAL") {
          return {
            type: "ANIMAL",
            animalName: c.animalName || c.name || "Buddy",
            animalSpecies: c.animalSpecies || "dog",
          };
        }
        if (c.type === "OBJECT") {
          return {
            type: "OBJECT",
            objectName: c.objectName || c.name || "Magic Wand",
          };
        }
        return {
          type: "PERSON",
          name: c.name || "Lily",
          gender: c.gender || "GIRL",
          age: typeof c.age === "number" ? c.age : 4,
          hobbies: c.hobbies || undefined,
          favoriteFood: c.favoriteFood || undefined,
        };
      });

      const userPayload = !existingToken
        ? {
            name: userDetails?.name?.trim() || "Book Creator",
            country: userDetails?.country?.trim() || "United Kingdom",
            email: userDetails?.email?.trim() || "",
            confirmEmail:
              userDetails?.confirmEmail?.trim() || userDetails?.email?.trim() || "",
            password: userDetails?.password?.trim() || "",
          }
        : undefined;

      const bookDto: Record<string, unknown> = {
        ageCategory: mappedAge,
        theme: mappedTheme,
        subject: mappedSubject,
        specialMessage: mappedMessage,
        illustrationStyle: mappedIllustration,
        font: mappedFont,
        language: selectedLanguage || "English",
        regionalVariant: selectedVariant || "Standard (Brits Engls)",
        characters: mappedCharacters,
        creatorName: creatorName || "Mum & Dad",
      };

      if (userPayload) {
        bookDto.user = userPayload;
      }

      if (foreword && foreword.trim()) {
        bookDto.foreword = foreword.trim();
      }

      const formData = new FormData();
      formData.append("data", JSON.stringify(bookDto));

      // Handle photos: backend requires photos.length === characters.length if photos are passed
      const hasAnyPhoto = characters.some((c) => c.photo instanceof File);
      if (hasAnyPhoto) {
        const emptyPng = new Blob(
          [
            new Uint8Array([
              0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48,
              0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00,
              0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41, 0x54, 0x78,
              0x9c, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00,
              0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
            ]),
          ],
          { type: "image/png" }
        );
        mappedCharacters.forEach((_, idx) => {
          const charPhoto = characters[idx]?.photo;
          if (charPhoto instanceof File) {
            formData.append("characterPhotos", charPhoto);
          } else {
            formData.append("characterPhotos", emptyPng, `placeholder-${idx}.png`);
          }
        });
      }

      if (voiceBlob) {
        formData.append("voiceRecording", voiceBlob, "voice.webm");
      }

      const headers: Record<string, string> = {};
      if (existingToken) headers["Authorization"] = `Bearer ${existingToken}`;

      const response = await fetch(`${apiBase}/books`, {
        method: "POST",
        headers,
        body: formData,
      });

      const resJson = await response.json().catch(() => null);
      if (!response.ok) {
        const errorMsg =
          resJson?.message ||
          (Array.isArray(resJson?.errorSources)
            ? resJson.errorSources.map((e: { message?: string }) => e.message).join(", ")
            : "Failed to create book order.");
        throw new Error(errorMsg);
      }

      if (resJson?.data?.accessToken) {
        localStorage.setItem("token", resJson.data.accessToken);
      }
      if (resJson?.data?.refreshToken) {
        localStorage.setItem("refreshToken", resJson.data.refreshToken);
      }

      const createdBook = resJson?.data?.book;
      const checkout = resJson?.data?.checkout;

      if (createdBook?._id) {
        setCurrentBookId(createdBook._id);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("current_book_id", createdBook._id);
        }
        setCreatedBookId(createdBook._id);
        setCheckoutUrl(checkout?.checkoutUrl || null);
        setIsModalOpen(true);
      }
    } catch (err: unknown) {
      let message = "An error occurred while creating your book. Please try again.";
      if (err instanceof Error) {
        if (
          err.message.includes("Failed to fetch") ||
          err.message.includes("NetworkError") ||
          err.message.includes("Load failed")
        ) {
          message =
            "Unable to connect to the server. The backend may be waking up, please wait a moment and try again.";
        } else {
          message = err.message;
        }
      }
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative overflow-hidden bg-[#FEF6EC] px-4 pb-0 pt-[118px] sm:px-8 sm:pt-[136px] lg:px-16 lg:pt-[196px]">
      <Image
        src="/images/cloud.png"
        alt=""
        width={120}
        height={70}
        className="pointer-events-none absolute right-0 top-[88px] hidden opacity-70 lg:block"
      />
      <Image
        src="/images/cloud.png"
        alt=""
        width={90}
        height={60}
        className="pointer-events-none absolute -left-3 top-[315px] hidden rotate-180 opacity-50 lg:block"
      />
      <section
        className="relative mx-auto max-w-[1280px]"
        aria-labelledby="checkout-heading"
      >
        <h1
          id="checkout-heading"
          className="font-crimson text-[34px] font-semibold leading-none text-[#FC5A00] sm:text-[46px] lg:text-[58px]"
        >
          Put together your unique children&apos;s book
        </h1>
        <p className="mt-4 font-sans text-lg text-[#31445D] sm:text-2xl">
          Your choices
        </p>
        <div className="mt-4 flex max-w-[1110px] flex-wrap gap-3">
          <ChoiceChip choice={age} />
          <ChoiceChip choice={theme} />
          <ChoiceChip choice={story} />
          <ChoiceChip choice={message} />
          <ChoiceChip choice={font} />
          <ChoiceChip
            choice={
              selectedLanguage
                ? {
                    label: selectedLanguage,
                    image: "/images/flag.png",
                    color: "#FFFBDF",
                  }
                : undefined
            }
          />
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.05fr_.9fr] lg:gap-8">
          <div className="space-y-5">
            <article className="rounded-[16px] bg-white px-5 py-6 shadow-[0_2px_5px_rgba(80,66,73,0.1)] sm:px-7 sm:py-7">
              <div className="flex gap-4">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-[#FFC693] text-[#FC5A00]">
                  <Sparkles size={15} />
                </span>
                <div>
                  <h2 className="font-sans text-xl font-medium text-[#FC5A00] sm:text-2xl">
                    Your unique book creation
                  </h2>
                  <p className="mt-2 max-w-[530px] font-sans text-xs leading-[1.45] text-[#536278] sm:text-sm">
                    Hooray! We&apos;re creating a magical book for your little
                    one (4 years old). The story is about{" "}
                    {story?.label ?? "a magical adventure"} within the theme{" "}
                    {theme?.label ?? "Fairy Tales"}. Lovingly created by Papa en
                    Mama.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-[16px] bg-white px-5 py-6 shadow-[0_2px_5px_rgba(80,66,73,0.1)] sm:px-7 sm:py-7">
              <h2 className="font-sans text-xl font-medium text-[#FC5A00] sm:text-2xl">
                Now the magic begins
              </h2>
              <ol className="mt-5 space-y-5">
                {[
                  [
                    "1. Book is created",
                    "After payment, we immediately create your digital children’s book. It will be available within just 15 minutes and you will receive an email once it’s ready!",
                    CircleHelp,
                  ],
                  [
                    "2. Edit & Perfect",
                    "After creation you can easily adjust the book’s text and illustrations until the result is perfect.",
                    Pencil,
                  ],
                  [
                    "3. Share & Print",
                    "Happy with it? Share your digital book directly with family and friends or order a beautiful hardcover copy as a lasting keepsake.",
                    Sparkles,
                  ],
                ].map(([title, description, Icon]) => {
                  const StepIcon = Icon as typeof CircleHelp;
                  return (
                    <li key={title as string} className="flex gap-4">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#FFC693] text-[#FC5A00]">
                        <StepIcon size={14} />
                      </span>
                      <div>
                        <h3 className="font-sans text-xs font-medium text-[#31445D] sm:text-sm">
                          {title as string}
                        </h3>
                        <p className="mt-1 max-w-[460px] font-sans text-[11px] leading-[1.4] text-[#536278] sm:text-xs">
                          {description as string}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </article>
          </div>

          <div className="space-y-5">
            <article className="rounded-[16px] bg-white px-5 py-6 shadow-[0_2px_5px_rgba(80,66,73,0.1)] sm:px-7 sm:py-7">
              <h2 className="font-sans text-xl font-medium text-[#FC5A00] sm:text-2xl">
                Why this book?
              </h2>
              <ul className="mt-3 divide-y divide-[#F2DDCD]">
                {[
                  "A unique gift",
                  "26 pages of pure magic",
                  "232,140 books created so far",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 py-3 font-sans text-xs text-[#536278] sm:text-sm"
                  >
                    <Check
                      size={15}
                      className="rounded-full border border-[#18B56E] p-[2px] text-[#18B56E]"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-[16px] border-2 border-[#FF9568] bg-white px-5 py-6 text-center shadow-[0_2px_5px_rgba(80,66,73,0.08)] sm:px-7 sm:py-8">
              <h2 className="font-sans text-xl font-medium text-[#FC5A00] sm:text-2xl">
                Your book is almost ready!
              </h2>
              <p className="mt-2 font-sans text-2xl font-bold text-[#0BA04B] sm:text-3xl">
                €8.99
              </p>
              <div className="mt-6 space-y-3 text-left">
                <div
                  className="flex h-11 w-full items-center rounded-[10px] border border-[#FF9568] bg-[#FFF9F5] px-3.5 font-sans text-xs sm:text-sm font-medium text-[#31445D]"
                >
                  <span
                    className="mr-2.5 flex size-4 items-center justify-center rounded-full border border-[#FC5A00] bg-[#FC5A00] text-white"
                  >
                    <Check size={10} strokeWidth={3} />
                  </span>
                  Card
                  <span aria-label="Visa, Mastercard and American Express" className="ml-auto flex items-center gap-1.5 text-[9px] font-bold text-white">
                    <span className="rounded bg-[#405DAD] px-1.5 py-0.5 shadow-sm">VISA</span>
                    <span className="rounded bg-[#EF5350] px-1.5 py-0.5 shadow-sm">●●</span>
                    <span className="rounded bg-[#5695ED] px-1.5 py-0.5 shadow-sm">AMEX</span>
                  </span>
                </div>

                <div className="space-y-3.5 px-0.5 pt-1">
                  <div>
                    <label className="block font-sans text-xs sm:text-[13px] font-medium text-[#31445D]">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Cardholder Name"
                      value={cardDetails?.cardholderName || ""}
                      onChange={handleCardholderNameChange}
                      className={`mt-1.5 h-10 sm:h-11 w-full rounded-[8px] sm:rounded-[10px] border ${
                        fieldErrors.cardholderName ? "border-red-400 bg-red-50/20" : "border-[#F1ABBC] bg-[#FFFCFA]"
                      } px-3 font-sans text-xs sm:text-sm text-[#2A2A2A] outline-none placeholder:text-[#B9B4B7] focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/20 transition-all`}
                    />
                    {fieldErrors.cardholderName && (
                      <span className="mt-1 block font-sans text-[11px] text-[#B74760]">
                        {fieldErrors.cardholderName}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block font-sans text-xs sm:text-[13px] font-medium text-[#31445D]">
                      Card Number
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails?.cardNumber || ""}
                      onChange={handleCardNumberChange}
                      className={`mt-1.5 h-10 sm:h-11 w-full rounded-[8px] sm:rounded-[10px] border ${
                        fieldErrors.cardNumber ? "border-red-400 bg-red-50/20" : "border-[#F1ABBC] bg-[#FFFCFA]"
                      } px-3 font-sans text-xs sm:text-sm text-[#2A2A2A] tracking-wider outline-none placeholder:text-[#B9B4B7] focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/20 transition-all`}
                    />
                    {fieldErrors.cardNumber && (
                      <span className="mt-1 block font-sans text-[11px] text-[#B74760]">
                        {fieldErrors.cardNumber}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <div>
                      <label className="block font-sans text-xs sm:text-[13px] font-medium text-[#31445D]">
                        Expiry Date
                      </label>
                      <span className="relative mt-1.5 block">
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="MM/YY"
                          maxLength={5}
                          value={cardDetails?.expiryDate || ""}
                          onChange={handleExpiryChange}
                          className={`h-10 sm:h-11 w-full rounded-[8px] sm:rounded-[10px] border ${
                            fieldErrors.expiryDate ? "border-red-400 bg-red-50/20" : "border-[#F1ABBC] bg-[#FFFCFA]"
                          } pl-3 pr-8 font-sans text-xs sm:text-sm text-[#2A2A2A] tracking-wider outline-none placeholder:text-[#B9B4B7] focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/20 transition-all`}
                        />
                        <CreditCard
                          size={15}
                          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#876D7C]"
                        />
                      </span>
                      {fieldErrors.expiryDate && (
                        <span className="mt-1 block font-sans text-[11px] text-[#B74760]">
                          {fieldErrors.expiryDate}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block font-sans text-xs sm:text-[13px] font-medium text-[#31445D]">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        placeholder="123"
                        maxLength={4}
                        value={cardDetails?.cvv || ""}
                        onChange={handleCvvChange}
                        className={`mt-1.5 h-10 sm:h-11 w-full rounded-[8px] sm:rounded-[10px] border ${
                          fieldErrors.cvv ? "border-red-400 bg-red-50/20" : "border-[#F1ABBC] bg-[#FFFCFA]"
                        } px-3 font-sans text-xs sm:text-sm text-[#2A2A2A] tracking-wider outline-none placeholder:text-[#B9B4B7] focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/20 transition-all`}
                      />
                      {fieldErrors.cvv && (
                        <span className="mt-1 block font-sans text-[11px] text-[#B74760]">
                          {fieldErrors.cvv}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {submitError && (
                <div role="alert" className="mt-3.5 rounded-lg border border-[#F1ABBC] bg-[#FFF0F3] p-2.5 font-sans text-xs text-[#B74760]">
                  {submitError}
                </div>
              )}

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleContinueWithCard}
                className="mt-4 flex h-11 sm:h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#E88DA0] font-sans text-sm sm:text-base font-semibold text-white shadow-[0_4px_12px_rgba(232,141,160,0.25)] transition hover:bg-[#DD7893] active:scale-[0.99] disabled:opacity-60"
              >
                {isSubmitting && <Loader2 size={17} className="animate-spin" />}
                <span>{isSubmitting ? "Processing..." : "Continue with card"}</span>
              </button>

              <p className="mt-3 font-sans text-[11px] text-[#63758D]">
                This €8.99 counts towards your hardback.
              </p>
              <p className="mx-auto mt-2 max-w-[310px] font-sans text-[9px] leading-[1.45] text-[#8EA0B8]">
                By purchasing you agree to our privacy policy and conditions
                terms. Order with an obligation to pay. Made personally for you,
                so it cannot be returned.
              </p>

              <GenerationStatusModal
                isOpen={isModalOpen}
                bookId={createdBookId}
                checkoutUrl={checkoutUrl}
                onClose={() => setIsModalOpen(false)}
              />
            </article>
          </div>
        </div>
      </section>
      <div className="mt-14 bg-[#FEFAF4] px-0 pt-12 sm:mt-20">
        <BookerelloReviews />
      </div>
    </main>
  );
}
