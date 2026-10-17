"use client";

import Image from "next/image";
import {
  Check,
  ChevronDown,
  CircleHelp,
  CreditCard,
  Pencil,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import BookerelloReviews from "../../../_components/bookerello-reviews";
import { useBookBuilder } from "../../_components/BookBuilderProvider";

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

const paymentMethods = ["Card", "Apple Pay", "PayPal", "Google Pay"] as const;

export default function Checkout() {
  const {
    selectedAge,
    selectedTheme,
    selectedStory,
    selectedMessage,
    selectedFont,
    selectedLanguage,
  } = useBookBuilder();
  const [paymentMethod, setPaymentMethod] =
    useState<(typeof paymentMethods)[number]>("Card");
  const [cardExpanded, setCardExpanded] = useState(false);
  const age = ages.find((item) => item.label === selectedAge);
  const theme = themes.find((item) => item.label === selectedTheme);
  const story = stories.find((item) => item.label === selectedStory);
  const message = messages.find((item) => item.label === selectedMessage);
  const font = fonts.find((item) => item.label === selectedFont);

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
              <div className="mt-6 space-y-2 text-left">
                <button
                  type="button"
                  onClick={() => { setPaymentMethod("Card"); setCardExpanded(true); }}
                  aria-expanded={cardExpanded}
                  className={`flex h-9 w-full items-center rounded-[9px] border px-3 font-sans text-xs transition ${paymentMethod === "Card" ? "border-[#FF9568] bg-[#FFF9F5] text-[#31445D]" : "border-[#E6E6E6] text-[#536278] hover:border-[#F4B69E]"}`}
                >
                  <span
                    className={`mr-2 flex size-3.5 items-center justify-center rounded-full border ${paymentMethod === "Card" ? "border-[#FC5A00] bg-[#FC5A00] text-white" : "border-[#C9D1DB]"}`}
                  >
                    {paymentMethod === "Card" && (
                      <Check size={9} strokeWidth={3} />
                    )}
                  </span>
                  Card
                  <span aria-label="Visa, Mastercard and American Express" className="ml-auto flex items-center gap-1 text-[8px] font-bold text-white">
                    <span className="rounded-sm bg-[#405DAD] px-1 py-0.5">VISA</span>
                    <span className="rounded-sm bg-[#EF5350] px-1 py-0.5">●●</span>
                    <span className="rounded-sm bg-[#5695ED] px-1 py-0.5">AMEX</span>
                  </span>
                </button>
                {paymentMethod === "Card" && cardExpanded && (
                  <div className="space-y-2.5 px-1 pt-1">
                    <label className="block font-sans text-[10px] text-[#31445D]">
                      Cardholder Name
                      <input
                        placeholder="Enter Cardholder Name"
                        className="mt-1 h-8 w-full rounded-[6px] border border-[#F1ABBC] bg-[#FFFCFA] px-2.5 font-sans text-[9px] outline-none placeholder:text-[#B9B4B7] focus:border-[#E88DA0]"
                      />
                    </label>
                    <label className="block font-sans text-[10px] text-[#31445D]">
                      Card Number
                      <input
                        inputMode="numeric"
                        placeholder="123 1233 123 123"
                        className="mt-1 h-8 w-full rounded-[6px] border border-[#F1ABBC] bg-[#FFFCFA] px-2.5 font-sans text-[9px] outline-none placeholder:text-[#B9B4B7] focus:border-[#E88DA0]"
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block font-sans text-[10px] text-[#31445D]">
                        Expiry Date
                        <span className="relative mt-1 block">
                          <input
                            placeholder="--/--"
                            className="h-8 w-full rounded-[6px] border border-[#F1ABBC] bg-[#FFFCFA] px-2.5 font-sans text-[9px] outline-none placeholder:text-[#B9B4B7] focus:border-[#E88DA0]"
                          />
                          <CreditCard
                            size={11}
                            className="absolute right-2 top-2 text-[#4B4650]"
                          />
                        </span>
                      </label>
                      <label className="block font-sans text-[10px] text-[#31445D]">
                        CVV / CVC
                        <input
                          placeholder="Enter CVV"
                          className="mt-1 h-8 w-full rounded-[6px] border border-[#F1ABBC] bg-[#FFFCFA] px-2.5 font-sans text-[9px] outline-none placeholder:text-[#B9B4B7] focus:border-[#E88DA0]"
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCardExpanded(false)}
                      className="flex w-full items-center justify-center gap-1 pt-1 font-sans text-[10px] text-[#63758D]"
                    >
                      Other payment methods{" "}
                      <ChevronDown
                        size={11}
                        className="transition"
                      />
                    </button>
                  </div>
                )}
                {!cardExpanded &&
                  paymentMethods
                    .filter((method) => method !== "Card")
                    .map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => { setPaymentMethod(method); setCardExpanded(false); }}
                        className={`flex h-9 w-full items-center rounded-[9px] border px-3 font-sans text-xs transition ${paymentMethod === method ? "border-[#FF9568] bg-[#FFF9F5] text-[#31445D]" : "border-[#E6E6E6] text-[#536278] hover:border-[#F4B69E]"}`}
                      >
                        <span
                          className={`mr-2 flex size-3.5 items-center justify-center rounded-full border ${paymentMethod === method ? "border-[#FC5A00] bg-[#FC5A00] text-white" : "border-[#C9D1DB]"}`}
                        >
                          {paymentMethod === method && (
                            <Check size={9} strokeWidth={3} />
                          )}
                        </span>
                        {method}
                        <span className="ml-auto text-[9px] font-semibold text-[#405DAD]">
                          {method === "Apple Pay"
                            ? "Pay"
                            : method === "PayPal"
                              ? "P"
                              : "G Pay"}
                        </span>
                      </button>
                    ))}
              </div>
              <button
                type="button"
                className="mt-3 h-10 w-full rounded-[9px] bg-[#E88DA0] font-sans text-sm font-medium text-white transition hover:bg-[#DD7893]"
              >
                Continue with {paymentMethod.toLowerCase()}
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
