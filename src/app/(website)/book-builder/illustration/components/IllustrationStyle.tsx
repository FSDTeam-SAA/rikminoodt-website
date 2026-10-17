"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
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
  { label: "Princess & Princesses", image: "/images/story_2.png", color: "#DDEEFF" },
  { label: "Knights and dragons", image: "/images/story_3.png", color: "#FFDDE4" },
  { label: "Wizard School", image: "/images/story_4.png", color: "#D1ECD9" },
  { label: "The Magic Forest", image: "/images/story_5.png", color: "#CFE9DA" },
  { label: "Mermaids", image: "/images/story_6.png", color: "#FADDE1" },
  { label: "Gnomes", image: "/images/story_7.png", color: "#FFE5D4" },
  { label: "Fairies and Elves", image: "/images/story_8.png", color: "#DDEEFF" },
  { label: "Witches and Spells", image: "/images/story_9.png", color: "#D4EBDD" },
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

const illustrationStyles = [
  { label: "3d Animation", image: "/images/ill_1.png" },
  { label: "Water Colour", image: "/images/ill_2.png" },
  { label: "Geometric", image: "/images/ill_3.png" },
  { label: "Claymation", image: "/images/ill_4.png" },
  { label: "Sticker Art", image: "/images/ill_5.png" },
  { label: "Comic Book", image: "/images/ill_6.png" },
  { label: "Gouache", image: "/images/ill_7.png" },
  { label: "Soft Anime", image: "/images/ill_8.png" },
];

type Choice = { label: string; image: string; color: string };

function ChoiceChip({ choice, href, label }: { choice: Choice | undefined; href: string; label: string }) {
  if (!choice) {
    return (
      <Link href={href} className="rounded-full border border-dashed border-[#D8C8C2] px-3 py-2 text-sm text-[#856F77] transition hover:border-[#E88DA0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0]">
        Choose {label.toLowerCase()}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-label={`Edit ${label.toLowerCase()}: ${choice.label}`}
      className="group inline-flex h-10 items-center gap-2 rounded-full px-2 pr-3 font-sans text-base font-medium text-[#4B4650] transition hover:brightness-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0] focus-visible:ring-offset-2"
      style={{ backgroundColor: choice.color }}
    >
      <span className="relative size-6 overflow-hidden rounded-full bg-white/45">
        <Image src={choice.image} alt="" fill sizes="24px" className="object-contain object-bottom" />
      </span>
      <span>{choice.label}</span>
      <Pencil aria-hidden="true" size={14} strokeWidth={2.3} className="text-[#E5AF32] transition-transform group-hover:scale-110" />
    </Link>
  );
}

export default function IllustrationStyle() {
  const router = useRouter();
  const { selectedAge, selectedTheme, selectedStory, selectedMessage, selectedIllustration, setSelectedIllustration } = useBookBuilder();
  const [detailsStyle, setDetailsStyle] = useState<(typeof illustrationStyles)[number] | null>(null);
  const age = ages.find((item) => item.label === selectedAge);
  const theme = themes.find((item) => item.label === selectedTheme);
  const story = stories.find((item) => item.label === selectedStory);
  const message = messages.find((item) => item.label === selectedMessage);

  useEffect(() => {
    if (!detailsStyle) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDetailsStyle(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [detailsStyle]);

  return (
    <main className="min-h-screen bg-[#FEFAF4] px-4 pb-10 pt-[118px] sm:px-7 sm:pb-12 sm:pt-[136px] lg:px-[38px] lg:pb-20 lg:pt-[196px]">
      <section className="mx-auto max-w-[1280px]" aria-labelledby="illustration-heading">
        <h1 id="illustration-heading" className="font-crimson text-4xl font-normal leading-none text-[#1E1E1E] sm:text-[48px]">
          Create a Story as Unique as Your Child
        </h1>
        <p className="mt-5 max-w-[1120px] font-sans text-lg font-normal leading-[1.4] text-[#444444] sm:text-[24px]">
          Choose a theme, add their name and special details, and create a personalized eBook they&apos;ll love. Turn it into a beautiful hardcover keepsake to treasure forever.
        </p>

        <section className="mt-10 rounded-[19px] bg-[#FBF3EA] px-4 py-5 sm:px-5 sm:py-6 lg:px-10 lg:py-10" aria-labelledby="illustration-options-heading">
          <h2 id="illustration-options-heading" className="font-fredoka text-base font-normal leading-none text-[#E88DA0] sm:text-[20px] lg:text-[32px]">
            Build a Magical Story Just for Them
          </h2>
          <p className="mt-3 font-sans text-base font-normal leading-none text-[#444444] lg:mt-5 lg:text-[20px]">Your Choice</p>

          <div className="mt-3 flex flex-wrap gap-2 sm:gap-3">
            <ChoiceChip label="Age" choice={age} href="/book-builder/choose-age" />
            <ChoiceChip label="Theme" choice={theme} href="/book-builder/choose-theme" />
            <ChoiceChip label="Subject" choice={story} href="/book-builder/choose-story" />
            <ChoiceChip label="Message" choice={message} href="/book-builder/personalize" />
          </div>

          <h3 className="mt-7 font-sans text-lg font-semibold leading-none text-[#1E1E1E] lg:mt-10 lg:text-[28px]">
            Choose an illustration style
          </h3>

          <div className="mt-6 grid grid-cols-2 gap-3 min-[640px]:grid-cols-4 sm:gap-4" role="radiogroup" aria-label="Choose an illustration style">
            {illustrationStyles.map((style) => {
              const isSelected = selectedIllustration === style.label;

              return (
                <article
                  key={style.label}
                  className={`rounded-[10px] border-2 bg-white p-2 shadow-[0_4px_12px_rgba(65,75,95,0.08)] transition sm:p-3 ${
                    isSelected ? "border-[#F08BA1]" : "border-transparent hover:border-[#F4C2CE]"
                  }`}
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => { setSelectedIllustration(style.label); router.push("/book-builder/choose-font"); }}
                    className="block w-full rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0]"
                  >
                    <Image
                      src={style.image}
                      alt={`${style.label} illustration style`}
                      width={320}
                      height={320}
                      sizes="(max-width: 639px) 43vw, (max-width: 1023px) 22vw, 260px"
                      className="aspect-square w-full rounded-md object-cover"
                    />
                  </button>
                  <h4 className="mt-2 text-center font-sans text-base font-bold leading-tight text-[#414B5F] sm:mt-3 sm:text-[24px]">
                    {style.label}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setDetailsStyle(style)}
                    className="mt-2 flex h-8 w-full items-center justify-center rounded-lg border border-[#F3A8B7] font-sans text-sm font-medium text-[#EC8EA4] transition hover:bg-[#FFF3F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0] focus-visible:ring-offset-2 sm:mt-3 sm:h-9 sm:text-base"
                  >
                    View Details
                  </button>
                </article>
              );
            })}
          </div>

        </section>
      </section>

      {detailsStyle && (
        <div
          role="presentation"
          onMouseDown={() => setDetailsStyle(null)}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#251D24]/55 p-4 backdrop-blur-sm"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="illustration-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
            className="relative w-full max-w-[680px] rounded-2xl bg-[#FEFAF4] p-4 shadow-2xl sm:p-6"
          >
            <button
              type="button"
              onClick={() => setDetailsStyle(null)}
              aria-label="Close illustration details"
              className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white text-[#414B5F] shadow transition hover:bg-[#FFF0F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0] sm:right-4 sm:top-4"
            >
              <X aria-hidden="true" size={20} />
            </button>
            <h2 id="illustration-modal-title" className="pr-10 font-sans text-2xl font-bold text-[#414B5F] sm:text-[28px]">
              {detailsStyle.label}
            </h2>
            <div className="mt-4 overflow-hidden rounded-xl bg-white p-2 sm:p-3">
              <Image
                src={detailsStyle.image}
                alt={`${detailsStyle.label} illustration style preview`}
                width={760}
                height={760}
                sizes="(max-width: 680px) 88vw, 620px"
                className="h-auto w-full rounded-lg object-cover"
              />
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
