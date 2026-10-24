"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useBookBuilder } from "../../_components/BookBuilderProvider";
import { getStoryChoice } from "../../_components/subject-options";
import { useBookBuilderTranslations } from "../../_components/useBookBuilderTranslations";

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
  { label: "Storybook Classic", image: "/images/font_1.png", family: '"Crimson Text", Georgia, serif' },
  { label: "Smooth Sands", image: "/images/font_2.png", family: '"Nunito Sans", sans-serif' },
  { label: "Bubbly Tales", image: "/images/font_3.png", family: '"Fredoka One", cursive' },
  { label: "Candy Dreams", image: "/images/font_4.png", family: '"Comic Sans MS", "Comic Sans", cursive' },
  { label: "Neon Nexus", image: "/images/font_5.png", family: '"Arial Rounded MT Bold", "Nunito Sans", sans-serif' },
  { label: "Cosy Curves", image: "/images/font_6.png", family: '"Trebuchet MS", sans-serif' },
  { label: "School Script", image: "/images/font_7.png", family: '"Brush Script MT", cursive' },
  { label: "Adventure Book", image: "/images/font_8.png", family: 'Georgia, serif' },
];

type Choice = { label: string; image: string; color?: string };

function ChoiceChip({ choice, href, label, displayLabel }: { choice: Choice | undefined; href: string; label: string; displayLabel?: string }) {
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
      style={choice.color ? { backgroundColor: choice.color } : { backgroundColor: "#FFFFFF" }}
    >
      <span className="relative size-6 overflow-hidden rounded-full bg-white/45">
        <Image src={choice.image} alt="" fill sizes="24px" className="object-contain object-bottom" />
      </span>
      <span>{displayLabel || choice.label}</span>
      <Pencil aria-hidden="true" size={14} strokeWidth={2.3} className="text-[#E5AF32] transition-transform group-hover:scale-110" />
    </Link>
  );
}

export default function Choosefont() {
  const router = useRouter();
  const { selectedAge, selectedTheme, selectedStory, selectedMessage, selectedIllustration, selectedFont, setSelectedFont } = useBookBuilder();
  const { bb, translateAge, translateTheme, translateMessage, translateIllustration, translateFont } = useBookBuilderTranslations();
  const [previewFont, setPreviewFont] = useState<(typeof fonts)[number] | null>(null);
  const age = ages.find((item) => item.label === selectedAge);
  const theme = themes.find((item) => item.label === selectedTheme);
  const story = getStoryChoice(selectedStory, selectedTheme);
  const message = messages.find((item) => item.label === selectedMessage);
  const illustration = illustrations.find((item) => item.label === selectedIllustration);

  useEffect(() => {
    if (!previewFont) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreviewFont(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [previewFont]);

  return (
    <main className="min-h-screen bg-[#FEFAF4] px-4 pb-10 pt-[118px] sm:px-7 sm:pb-12 sm:pt-[136px] lg:px-[38px] lg:pb-20 lg:pt-[196px]">
      <section className="mx-auto max-w-[1280px]" aria-labelledby="choose-font-heading">
        <h1 id="choose-font-heading" className="font-crimson text-4xl font-normal leading-none text-[#1E1E1E] sm:text-[48px]">
          {bb?.bannerTitle}
        </h1>
        <p className="mt-5 max-w-[1120px] font-sans text-lg font-normal leading-[1.4] text-[#444444] sm:text-[24px]">
          {bb?.bannerDesc}
        </p>

        <section className="mt-10 rounded-[19px] bg-[#FBF3EA] px-4 py-5 sm:px-5 sm:py-6 lg:px-10 lg:py-10" aria-labelledby="font-options-heading">
          <h2 id="font-options-heading" className="font-fredoka text-base font-normal leading-none text-[#E88DA0] sm:text-[20px] lg:text-[32px]">
            {bb?.buildStory}
          </h2>
          <p className="mt-3 font-sans text-base font-normal leading-none text-[#444444] lg:mt-5 lg:text-[20px]">{bb?.yourChoice}</p>

          <div className="mt-3 flex flex-wrap gap-2 sm:gap-3">
            <ChoiceChip label="Age" displayLabel={translateAge(age?.label)} choice={age} href="/book-builder/choose-age" />
            <ChoiceChip label="Theme" displayLabel={translateTheme(theme?.label)} choice={theme} href="/book-builder/choose-theme" />
            <ChoiceChip label="Subject" choice={story} href="/book-builder/choose-story" />
            <ChoiceChip label="Message" displayLabel={translateMessage(message?.label)} choice={message} href="/book-builder/personalize" />
            <ChoiceChip label="Illustration" displayLabel={translateIllustration(illustration?.label)} choice={illustration} href="/book-builder/illustration" />
          </div>

          <h3 className="mt-7 font-sans text-lg font-semibold leading-none text-[#1E1E1E] lg:mt-10 lg:text-[28px]">
            {bb?.chooseFont}
          </h3>

          <div className="mt-6 grid grid-cols-2 gap-3 min-[640px]:grid-cols-4 sm:gap-4" role="radiogroup" aria-label="Choose a font">
            {fonts.map((font) => {
              const isSelected = selectedFont === font.label;

              return (
                <article
                  key={font.label}
                  className={`overflow-hidden rounded-2xl border-2 bg-white shadow-[0_4px_12px_rgba(65,75,95,0.08)] transition ${
                    isSelected ? "border-[#F08BA1]" : "border-transparent hover:border-[#F4C2CE]"
                  }`}
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => { setSelectedFont(font.label); router.push("/book-builder/language"); }}
                    className="block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0]"
                  >
                    <Image
                      src={font.image}
                      alt={`${translateFont(font.label)} font preview`}
                      width={296}
                      height={168}
                      sizes="(max-width: 639px) 43vw, (max-width: 1023px) 22vw, 260px"
                      className="h-auto w-full"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewFont(font);
                    }}
                    className="flex h-8 w-full items-center justify-center gap-0.5 border-t border-[#F7E7E8] font-sans text-xs font-medium text-[#EC8EA4] transition hover:bg-[#FFF3F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0] sm:h-9 sm:text-sm"
                  >
                    {bb?.viewExample || "View example"} <ChevronRight aria-hidden="true" size={14} />
                  </button>
                </article>
              );
            })}
          </div>

        </section>
      </section>

      {previewFont && (
        <div
          role="presentation"
          onMouseDown={() => setPreviewFont(null)}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#251D24]/55 p-4 backdrop-blur-sm"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="font-preview-title"
            onMouseDown={(event) => event.stopPropagation()}
            className="relative max-h-[90svh] w-full max-w-[820px] overflow-y-auto rounded-2xl bg-[#FEFAF4] p-5 shadow-2xl sm:p-7"
          >
            <button
              type="button"
              onClick={() => setPreviewFont(null)}
              aria-label="Close font example"
              className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white text-[#414B5F] shadow transition hover:bg-[#FFF0F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0] sm:right-4 sm:top-4"
            >
              <X aria-hidden="true" size={20} />
            </button>
            <h2 id="font-preview-title" className="pr-10 font-sans text-2xl font-bold text-[#414B5F] sm:text-[28px]">
              {translateFont(previewFont.label)}
            </h2>
            <div className="mt-4 overflow-hidden rounded-xl bg-white p-2 sm:p-3">
              <Image
                src={previewFont.image}
                alt={`${previewFont.label} font preview`}
                width={760}
                height={432}
                sizes="(max-width: 820px) 88vw, 760px"
                className="h-auto w-full rounded-lg"
              />
            </div>
            <p
              className={`mt-4 text-center text-[clamp(1.2rem,3vw,1.85rem)] leading-[1.25] text-[#414B5F] ${previewFont.label === "Neon Nexus" ? "font-bold text-[#0BDFE8] [text-shadow:0_0_10px_rgba(9,217,230,0.8)]" : ""}`}
              style={{ fontFamily: previewFont.family }}
            >
              Once upon a time, a magical adventure began.
            </p>
          </section>
        </div>
      )}
    </main>
  );
}
