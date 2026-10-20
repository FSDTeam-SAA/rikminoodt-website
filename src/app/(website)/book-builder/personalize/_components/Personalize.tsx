"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { useBookBuilder } from "../../_components/BookBuilderProvider";
import { getStoryChoice } from "../../_components/subject-options";

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
      className="group inline-flex h-9 items-center gap-2 rounded-full px-2 pr-3 font-sans text-sm font-medium text-[#4B4650] transition hover:brightness-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0] focus-visible:ring-offset-2"
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

export default function Personalize() {
  const router = useRouter();
  const { selectedAge, selectedTheme, selectedStory, selectedMessage, setSelectedMessage } = useBookBuilder();
  const age = ages.find((item) => item.label === selectedAge);
  const theme = themes.find((item) => item.label === selectedTheme);
  const story = getStoryChoice(selectedStory, selectedTheme);

  return (
    <main className="min-h-screen bg-[#FEFAF4] px-4 pb-10 pt-[118px] sm:px-7 sm:pb-12 sm:pt-[136px] lg:px-[38px] lg:pb-20 lg:pt-[196px]">
      <section className="mx-auto max-w-[1280px]" aria-labelledby="personalize-heading">
        <h1 id="personalize-heading" className="font-crimson text-4xl font-normal leading-none text-[#1E1E1E] sm:text-[48px]">
          Create a Story as Unique as Your Child
        </h1>
        <p className="mt-5 max-w-[1120px] font-sans text-lg font-normal leading-[1.4] text-[#444444] sm:text-[24px]">
          Choose a theme, add their name and special details, and create a personalized eBook they&apos;ll love. Turn it into a beautiful hardcover keepsake to treasure forever.
        </p>

        <section className="mt-10 rounded-[19px] bg-[#FBF3EA] px-3 py-4 sm:px-5 sm:py-5 lg:px-10 lg:py-10" aria-labelledby="message-heading">
          <h2 id="message-heading" className="font-fredoka text-base font-normal leading-none text-[#E88DA0] sm:text-[20px] lg:text-[32px]">
            Build a Magical Story Just for Them
          </h2>
          <p className="mt-3 font-sans text-sm font-normal leading-none text-[#444444] sm:text-base lg:mt-5 lg:text-[20px]">Your Choice</p>

          <div className="mt-3 flex flex-wrap gap-2 sm:gap-3">
            <ChoiceChip label="Age" choice={age} href="/book-builder/choose-age" />
            <ChoiceChip label="Theme" choice={theme} href="/book-builder/choose-theme" />
            <ChoiceChip label="Subject" choice={story} href="/book-builder/choose-story" />
          </div>

          <h3 className="mt-6 font-sans text-base font-semibold leading-none text-[#1E1E1E] sm:text-lg lg:mt-8 lg:text-[28px]">
            Choose a central message
          </h3>

          <div className="mt-4 grid grid-cols-2 gap-3 min-[440px]:grid-cols-4 sm:mt-5 sm:gap-4" role="radiogroup" aria-label="Choose a central message">
            {messages.map((message) => {
              const isSelected = selectedMessage === message.label;

              return (
                <button
                  key={message.label}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => { setSelectedMessage(message.label); router.push("/book-builder/illustration"); }}
                  className={`group flex aspect-[0.79] flex-col overflow-hidden rounded-lg border-2 px-1 pt-1 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0] focus-visible:ring-offset-2 sm:rounded-[10px] sm:px-2 sm:pt-2 ${
                    isSelected ? "border-[#F08BA1]" : "border-transparent hover:border-[#F4C2CE]"
                  }`}
                  style={{ backgroundColor: message.color }}
                >
                  <span aria-hidden="true" className="flex min-h-0 flex-1 items-end justify-center overflow-hidden transition-transform duration-200 group-hover:scale-[1.03]">
                    <Image
                      src={message.image}
                      alt=""
                      width={220}
                      height={180}
                      sizes="(max-width: 439px) 44vw, (max-width: 639px) 24vw, (max-width: 1023px) 21vw, 260px"
                      className="h-full w-full object-contain object-bottom"
                    />
                  </span>
                  <span className="flex min-h-9 items-center justify-center px-1 pb-1 pt-1 font-sans text-xs font-medium leading-[1.15] text-[#1E1E1E] sm:min-h-11 sm:text-sm lg:text-base">
                    {message.label}
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
