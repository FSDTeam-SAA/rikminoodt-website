"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { useState } from "react";
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
      className="group inline-flex h-9 items-center gap-2 rounded-full px-2 pr-3 font-sans text-sm font-medium text-[#4B4650] transition hover:brightness-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0] focus-visible:ring-offset-2 sm:h-10 sm:text-base"
      style={{ backgroundColor: choice.color ?? "#FFFFFF" }}
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
        className="text-[#E5AF32]"
      />
    </Link>
  );
}

export default function SpecialEvents() {
  const {
    selectedAge,
    selectedTheme,
    selectedStory,
    selectedMessage,
    selectedIllustration,
    selectedFont,
    selectedLanguage,
  } = useBookBuilder();
  const [events, setEvents] = useState("");
  const age = ages.find((item) => item.label === selectedAge);
  const theme = themes.find((item) => item.label === selectedTheme);
  const story = stories.find((item) => item.label === selectedStory);
  const message = messages.find((item) => item.label === selectedMessage);
  const font = fonts.find((item) => item.label === selectedFont);
  const illustrationLabels = ["3d Animation", "Water Colour", "Geometric", "Claymation", "Sticker Art", "Comic Book", "Gouache", "Soft Anime"];
  const illustrationIndex = illustrationLabels.indexOf(selectedIllustration ?? "");
  const illustration = illustrationIndex >= 0 ? { label: illustrationLabels[illustrationIndex], image: `/images/ill_${illustrationIndex + 1}.png`, color: "#FFFFFF" } : undefined;

  return (
    <main className="min-h-screen bg-[#FEFAF4] px-4 pb-10 pt-[118px] sm:px-7 sm:pb-12 sm:pt-[136px] lg:px-[38px] lg:pb-20 lg:pt-[196px]">
      <section
        className="mx-auto max-w-[1280px]"
        aria-labelledby="special-events-heading"
      >
        <h1
          id="special-events-heading"
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
          aria-labelledby="special-events-options-heading"
        >
          <h2
            id="special-events-options-heading"
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
            Special events for the story
          </h3>
          <p className="mt-2 font-sans text-sm text-[#444444] sm:text-base">
            This is optional. Describe events you&apos;d like to see in the
            story.
          </p>

          <div className="mt-7 max-w-[1120px] rounded-[10px] border border-[#F3A8B7] bg-white/20 p-3 sm:p-5">
            <label
              className="block font-sans text-sm font-medium text-[#252025]"
              htmlFor="special-events"
            >
              Special events for the story
            </label>
            <textarea
              id="special-events"
              value={events}
              onChange={(event) => setEvents(event.target.value)}
              placeholder="e.g. birthday, holidays, favorite memories"
              className="mt-3 min-h-[150px] w-full resize-y rounded-[8px] border border-[#F4D7DD] bg-[#FFFCFA] px-3 py-3 font-sans text-sm text-[#4B4650] outline-none placeholder:text-[#B9B4B7] hover:border-[#EDC7D0] focus:border-[#E88DA0] focus:ring-2 focus:ring-[#E88DA0]/25 sm:min-h-[180px]"
            />
          </div>

          <div className="mt-7 flex justify-center">
            <Link
              href="/book-builder/checkout"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#E88DA0] px-7 font-sans text-sm font-semibold text-white shadow-[0_5px_12px_rgba(232,141,160,0.25)] transition hover:bg-[#DD7893] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0] focus-visible:ring-offset-2"
            >
              Next Step
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
