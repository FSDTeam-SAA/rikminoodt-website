"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Check,
  CircleHelp,
  CreditCard,
  Loader2,
  Pencil,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import BookerelloReviews from "../../../_components/bookerello-reviews";
import { useBookBuilder } from "../../_components/BookBuilderProvider";
import { getStoryChoice } from "../../_components/subject-options";
import { getApiBaseUrl } from "@/config/api";
import {
  mapAge,
  mapTheme,
  mapSubject,
  mapMessage,
  mapIllustration,
  mapFont,
  THEME_MAP, SUBJECT_MAP, THEME_SUBJECT_MAP, MESSAGE_MAP, ILLUSTRATION_MAP, FONT_MAP,
} from "../../_components/api-mappers";
import {
  getBookChoicesValidationError,
  getCharacterValidationError,
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
    forewordMode,
    voiceBlob,
    voiceExpected,
    userDetails,
    setCurrentBookId,
  } = useBookBuilder();

  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [savedBookId, setSavedBookId] = useState<string | null>(null);
  const [hasStoredToken, setHasStoredToken] = useState(false);

  useEffect(() => {
    setHasStoredToken(Boolean(localStorage.getItem("token")));
  }, []);

  const age = ages.find((item) => item.label === selectedAge);
  const theme = themes.find((item) => item.label === selectedTheme);
  const story = getStoryChoice(selectedStory, selectedTheme);
  const message = messages.find((item) => item.label === selectedMessage);
  const font = fonts.find((item) => item.label === selectedFont);
  const choicesValidationError = getBookChoicesValidationError({
    age: selectedAge,
    theme: selectedTheme,
    story: selectedStory,
    message: selectedMessage,
    illustration: selectedIllustration,
    font: selectedFont,
    language: selectedLanguage,
    variant: selectedVariant,
  });
  const invalidCharacterIndex = characters.findIndex((character) =>
    getCharacterValidationError(character),
  );
  const isAuthenticated = Boolean(session?.user?.accessToken || session?.user?.id || hasStoredToken);
  const guestDetailsError = isAuthenticated ? null : getGuestDetailsValidationError(userDetails);
  const checkoutValidationError =
    choicesValidationError ||
    (!isValidCreatorName(creatorName) ? "Enter the creator name in Personal Details." : null) ||
    (!characters.length ? "Add at least one character." : null) ||
    (invalidCharacterIndex >= 0
      ? `Character ${invalidCharacterIndex + 1}: ${getCharacterValidationError(characters[invalidCharacterIndex])}`
      : null) ||
    (characters.some((character) => character.photoExpected && !character.photo)
      ? "Please reselect your character photos after refreshing the page."
      : null) ||
    (forewordMode === "voice" && voiceExpected && !voiceBlob
      ? "Please record your voice message again after refreshing the page."
      : null) ||
    guestDetailsError;
  const canCheckout = Boolean(savedBookId) || !checkoutValidationError;

  const handleContinueWithCard = async () => {
    if (isSubmitting) return;
    setSubmitError("");

    if (checkoutValidationError && !savedBookId) {
      setSubmitError(checkoutValidationError);
      return;
    }

    setIsSubmitting(true);
    let bookSaved = false;
    try {
      const apiBase = getApiBaseUrl();
      let token = session?.user?.accessToken || localStorage.getItem("token");
      const retryBookId = savedBookId || (new URLSearchParams(window.location.search).get("retry") === "1" ? sessionStorage.getItem("current_book_id") : null);
      if (retryBookId) {
        if (!token) throw new Error("Please log in to resume payment for your saved book.");
        const retryResponse = await fetch(`${apiBase}/payments/generation/checkout`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ bookId: retryBookId }) });
        const retryResult = await retryResponse.json().catch(() => null);
        if (!retryResponse.ok || !retryResult?.data?.checkoutUrl) throw new Error(retryResult?.message || "Unable to restart checkout. Please try again.");
        const url = new URL(retryResult.data.checkoutUrl);
        if (url.protocol !== "https:" || url.hostname !== "checkout.stripe.com") throw new Error("Invalid payment address returned by the server.");
        window.location.assign(url.href);
        return;
      }
      const theme = selectedTheme && THEME_MAP[selectedTheme];
      const subject = selectedStory && (SUBJECT_MAP[selectedStory] || selectedStory);
      if (!selectedAge || !["0-2 Years", "3-5 Years", "5-9 Years", "10+ Years", "Adult"].includes(selectedAge) || !theme || !subject || !THEME_SUBJECT_MAP[theme]?.includes(subject) || !selectedMessage || !MESSAGE_MAP[selectedMessage] || !selectedIllustration || !ILLUSTRATION_MAP[selectedIllustration] || !selectedFont || !FONT_MAP[selectedFont] || !selectedLanguage) throw new Error("Please complete your story choices and select a subject that matches your theme.");
      const photos = characters.map((character) => character.photo);
      if (photos.some(Boolean) && photos.some((photo) => !(photo instanceof File))) throw new Error("Please add a photo for every character, or remove all photos. The server needs photos in character order.");
      if (characters.some((c) => c.photoExpected && !c.photo)) throw new Error("Please reselect your character photos after refreshing the page.");
      if (forewordMode === "voice" && voiceExpected && !voiceBlob) throw new Error("Please record your voice message again after refreshing the page.");
      const user = { name: userDetails.name.trim(), country: userDetails.country.trim(), email: userDetails.email.trim(), confirmEmail: userDetails.confirmEmail.trim(), password: userDetails.password };
      const hasUserDetails = Boolean(user.name && user.country && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email) && user.email === user.confirmEmail && user.password.length >= 8);
      if (token) {
        const authResponse = await fetch(`${apiBase}/user/me`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
        if (authResponse.status === 401) {
          if (localStorage.getItem("token") === token) localStorage.removeItem("token");
          token = null;
        } else if (!authResponse.ok) {
          throw new Error(authResponse.status === 403 ? "Your account cannot access this service. Please contact support." : "Unable to verify your sign-in. Please try again.");
        }
      }
      if (!token && !hasUserDetails) throw new Error("Your session has expired or you are not signed in. Please sign in again, or complete your name, country, matching email addresses and password in Personal Details.");
      const dto = {
        ageCategory: mapAge(selectedAge), theme: mapTheme(selectedTheme), subject: mapSubject(selectedStory, theme), specialMessage: mapMessage(selectedMessage), illustrationStyle: mapIllustration(selectedIllustration), font: mapFont(selectedFont), language: selectedLanguage,
        ...(selectedVariant ? { regionalVariant: selectedVariant } : {}),
        characters: characters.map((c) => c.type === "PERSON" ? { type: c.type, name: c.name?.trim(), gender: c.gender, age: c.age, ...(c.hobbies?.trim() ? { hobbies: c.hobbies.trim() } : {}), ...(c.favoriteFood?.trim() ? { favoriteFood: c.favoriteFood.trim() } : {}) } : c.type === "ANIMAL" ? { type: c.type, animalName: c.animalName?.trim(), animalSpecies: c.animalSpecies?.trim() } : { type: c.type, objectName: c.objectName?.trim() }),
        creatorName: creatorName.trim(), ...(foreword.trim() ? { foreword: foreword.trim() } : {}),
        ...(!token ? { user } : {}),
      };
      const form = new FormData();
      form.append("data", JSON.stringify(dto));
      photos.forEach((photo) => { if (photo instanceof File) form.append("characterPhotos", photo, photo.name); });
      if (forewordMode === "voice" && voiceBlob) form.append("voiceRecording", voiceBlob, voiceBlob.type.includes("mp4") ? "voice.m4a" : "voice.webm");
      let response = await fetch(`${apiBase}/books`, { method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {}, body: form });
      let result = await response.json().catch(() => null);
      if (!response.ok && result?.message === "User registration details are required for new/guest users.") {
        if (!token || !hasUserDetails) throw new Error("Your sign-in was not recognized. Please sign in again, or enter your name, country, email and password in Personal Details.");
        // The backend rejected this request before creating a book. Retry as a guest with the supplied details.
        form.set("data", JSON.stringify({ ...dto, user }));
        response = await fetch(`${apiBase}/books`, { method: "POST", body: form });
        result = await response.json().catch(() => null);
      }
      if (!response.ok) throw new Error(result?.message || "Unable to create your book order.");
      const bookId = result?.data?.book?._id;
      const accessToken = result?.data?.accessToken || token;
      if (!bookId || !accessToken) throw new Error("The server did not return your saved book details. Please contact support before trying again.");
      bookSaved = true;
      localStorage.setItem("token", accessToken);
      if (result.data.refreshToken) localStorage.setItem("refreshToken", result.data.refreshToken);
      setCurrentBookId(bookId);
      sessionStorage.setItem("current_book_id", bookId);
      setSavedBookId(bookId);
      const checkoutUrl = result.data.checkout?.checkoutUrl;
      if (!checkoutUrl) throw new Error("Your book was saved, but checkout could not be started. Please try again.");
      const url = new URL(checkoutUrl);
      if (url.protocol !== "https:" || url.hostname !== "checkout.stripe.com") throw new Error("The server returned an invalid payment address.");
      window.location.assign(url.href);
    } catch (err) {
      setSubmitError(err instanceof TypeError && !bookSaved ? "Could not confirm whether the book was saved. Please check your account or contact support before retrying." : err instanceof Error ? err.message : "Unable to start checkout.");
    } finally { setIsSubmitting(false); }
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
                    Your story is about{" "}
                    {story?.label ?? selectedStory?.toLowerCase().replaceAll("_", " ") ?? "a magical adventure"} within the theme{" "}
                    {theme?.label ?? "Fairy Tales"}. Created by {creatorName || "you"}.
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
              <div className="mt-6 rounded-2xl border border-[#f5dedf] bg-[#fff9f7] p-4">
                <Image src="/images/secure-card-payment.svg" alt="Secure card payment powered by Stripe" width={420} height={190} className="mx-auto h-auto w-full max-w-[340px]" />
                <div className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-[#514256]"><CreditCard size={18} aria-hidden="true" /> Secure card payment</div>
                <p className="mt-2 text-xs leading-relaxed text-[#73686d]">You&apos;ll enter your card details securely on Stripe&apos;s checkout page.</p>
              </div>
              {submitError && (
                <div role="alert" className="mt-3.5 rounded-lg border border-[#F1ABBC] bg-[#FFF0F3] p-2.5 font-sans text-xs text-[#B74760]">
                  {submitError}
                  {(submitError.includes("Personal Details") || submitError.includes("sign in")) && (
                    <Link href="/book-builder/personal-details" className="mt-2 block font-semibold underline">Go to Personal Details</Link>
                  )}
                </div>
              )}

              <button
                type="button"
                disabled={isSubmitting || !canCheckout}
                onClick={handleContinueWithCard}
                title={checkoutValidationError || undefined}
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
