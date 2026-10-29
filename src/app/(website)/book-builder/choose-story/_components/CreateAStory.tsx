"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { useBookBuilder } from "../../_components/BookBuilderProvider";
import { SUBJECT_OPTIONS } from "../../_components/subject-options";
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

type Choice = {
  label: string;
  image: string;
  color: string;
};

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
      className="group inline-flex h-9 items-center gap-2 rounded-full px-2 pr-3 font-sans text-sm font-medium text-[#4B4650] transition hover:brightness-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0] focus-visible:ring-offset-2"
      style={{ backgroundColor: choice.color }}
    >
      <span className="relative size-6 overflow-hidden rounded-full bg-white/45">
        <Image src={choice.image} alt="" fill sizes="24px" className="object-contain object-bottom" />
      </span>
      <span>{displayLabel || choice.label}</span>
      <Pencil aria-hidden="true" size={14} strokeWidth={2.3} className="text-[#E5AF32] transition-transform group-hover:scale-110" />
    </Link>
  );
}

export default function CreateAStory() {
  const router = useRouter();
  const { selectedAge, selectedTheme, selectedStory, setSelectedStory } = useBookBuilder();
  const { bb, translateAge, translateTheme } = useBookBuilderTranslations();
  const age = ages.find((item) => item.label === selectedAge);
  const theme = themes.find((item) => item.label === selectedTheme);
  const availableSubjects = selectedTheme ? SUBJECT_OPTIONS[selectedTheme] ?? [] : [];

  return (
    <main className="min-h-screen bg-[#FEFAF4] px-4 pb-10 pt-[118px] sm:px-7 sm:pb-12 sm:pt-[136px] lg:px-[38px] lg:pb-20 lg:pt-[196px]">
      <section className="mx-auto max-w-[1280px]" aria-labelledby="create-story-heading">
        <h1 id="create-story-heading" className="font-crimson text-4xl font-normal leading-none text-[#1E1E1E] sm:text-[48px]">
          {bb?.bannerTitle}
        </h1>
        <p className="mt-5 max-w-[1120px] font-sans text-lg font-normal leading-[1.4] text-[#444444] sm:text-[24px]">
          {bb?.bannerDesc}
        </p>

        <section className="mt-10 rounded-[19px] bg-[#FBF3EA] px-3 py-4 sm:px-5 sm:py-5 lg:px-10 lg:py-10" aria-labelledby="story-details-heading">
          <h2 id="story-details-heading" className="font-fredoka text-base font-normal leading-none text-[#E88DA0] sm:text-[20px] lg:text-[32px]">
            {bb?.buildStory}
          </h2>
          <p className="mt-3 font-sans text-sm font-normal leading-none text-[#444444] sm:text-base lg:mt-5 lg:text-[20px]">{bb?.yourChoice}</p>

          <div className="mt-3 flex flex-wrap gap-2 sm:gap-3">
            <ChoiceChip label="Age" displayLabel={translateAge(age?.label)} choice={age} href="/book-builder/choose-age" />
            <ChoiceChip label="Theme" displayLabel={translateTheme(theme?.label)} choice={theme} href="/book-builder/choose-theme" />
          </div>

          <h3 className="mt-6 font-sans text-base font-semibold leading-none text-[#1E1E1E] sm:text-lg lg:mt-8 lg:text-[28px]">
            {bb?.chooseSubject || "Choose a subject"}
          </h3>

          <div className="mt-4 grid grid-cols-2 gap-3 min-[440px]:grid-cols-4 sm:mt-5 sm:gap-4" role="radiogroup" aria-label="Choose a story subject">
            {availableSubjects.map((subject) => {
              const isSelected =
                selectedStory === subject.value ||
                selectedStory === subject.label ||
                selectedStory?.toLowerCase() === subject.value.toLowerCase() ||
                selectedStory?.toLowerCase() === subject.label.toLowerCase();

              return (
                <button
                  key={subject.label}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => { setSelectedStory(subject.value); router.push("/book-builder/personalize"); }}
                  className={`group flex aspect-[0.79] flex-col overflow-hidden rounded-lg border-2 px-1 pt-1 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0] focus-visible:ring-offset-2 sm:rounded-[10px] sm:px-2 sm:pt-2 ${
                    isSelected ? "border-[#F08BA1]" : "border-transparent hover:border-[#F4C2CE]"
                  }`}
                  style={{ backgroundColor: subject.color }}
                >
                  <span aria-hidden="true" className="flex min-h-0 flex-1 items-end justify-center overflow-hidden transition-transform duration-200 group-hover:scale-[1.03]">
                    <Image
                      src={subject.image}
                      alt=""
                      width={220}
                      height={180}
                      sizes="(max-width: 439px) 44vw, (max-width: 639px) 24vw, (max-width: 1023px) 21vw, 260px"
                      className="h-full w-full object-contain object-bottom"
                    />
                  </span>
                  <span className="px-2 pb-4 pt-2 font-sans text-base font-semibold leading-none text-[#1E1E1E] sm:text-[20px]">
                    {subject.label}
                  </span>
                </button>
              );
            })}
          </div>

        </section>
      </section>
    </main>
  );
}
