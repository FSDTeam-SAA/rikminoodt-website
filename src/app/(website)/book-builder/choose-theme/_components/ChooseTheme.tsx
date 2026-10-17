"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { useBookBuilder } from "../../_components/BookBuilderProvider";

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

export default function ChooseTheme() {
  const router = useRouter();
  const { selectedAge, selectedTheme, setSelectedTheme } = useBookBuilder();
  const ageOptions = ["0-2 Years", "3-5 Years", "5-9 Years", "10+ Years", "Adult"];
  const ageIndex = ageOptions.indexOf(selectedAge ?? "");

  return (
    <main className="min-h-screen bg-[#FEFAF4] px-4 pb-10 pt-[118px] sm:px-7 sm:pb-12 sm:pt-[136px] lg:px-[38px] lg:pb-20 lg:pt-[196px]">
      <section className="mx-auto max-w-[1280px]" aria-labelledby="create-story-heading">
        <h1 id="create-story-heading" className="font-crimson text-4xl font-normal leading-none text-[#1E1E1E] sm:text-[48px]">
          Create a Story as Unique as Your Child
        </h1>
        <p className="mt-5 max-w-[1120px] font-sans text-lg font-normal leading-[1.4] text-[#444444] sm:text-[24px]">
          Choose a theme, add their name and special details, and create a personalized eBook they&apos;ll love. Turn it into a beautiful hardcover keepsake to treasure forever.
        </p>

        <section className="mt-10 rounded-[19px] bg-[#FBF3EA] px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10" aria-labelledby="theme-category-heading">
          <h2 id="theme-category-heading" className="font-fredoka text-[26px] font-normal leading-none text-[#E88DA0] sm:text-[32px]">
            Build a Magical Story Just for Them
          </h2>

          {selectedAge && ageIndex >= 0 && (
            <div className="mt-4">
              <p className="font-sans text-lg font-normal leading-none text-[#444444] sm:text-[20px]">Your Choice</p>
              <Link href="/book-builder/choose-age" className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-[#DDEEFF] py-1 pl-2 pr-4 font-sans text-lg font-semibold leading-none text-[#4B4650] sm:h-[42px] sm:text-[20px]">
                <span className="relative size-7 overflow-hidden rounded-full bg-white/30">
                  <Image src={`/images/age_${ageIndex + 1}.png`} alt="" fill sizes="28px" className="object-contain object-bottom" />
                </span>
                <span>{selectedAge}</span>
                <Pencil aria-hidden="true" size={16} className="text-[#F5C63E]" />
              </Link>
            </div>
          )}

          <h3 className="mt-8 font-sans text-[24px] font-semibold leading-none text-[#1E1E1E] sm:text-[28px]">
            Choose the theme
          </h3>

          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4" role="radiogroup" aria-label="Choose the story theme">
            {themes.map((theme) => {
              const isSelected = selectedTheme === theme.label;

              return (
                <button
                  key={theme.label}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => { setSelectedTheme(theme.label); router.push("/book-builder/choose-story"); }}
                  className={`group flex aspect-[0.89] flex-col overflow-hidden rounded-[10px] border-2 pt-3 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0] focus-visible:ring-offset-2 ${
                    isSelected ? "border-[#EF8BA3]" : "border-transparent hover:border-[#F5C1CE]"
                  }`}
                  style={{ backgroundColor: theme.color }}
                >
                  <span aria-hidden="true" className="flex min-h-0 flex-1 items-end justify-center overflow-hidden px-3 transition-transform duration-200 group-hover:scale-[1.03]">
                    <Image
                      src={theme.image}
                      alt=""
                      width={240}
                      height={220}
                      sizes="(max-width: 639px) 42vw, (max-width: 1023px) 22vw, 280px"
                      className="h-full w-full object-contain object-bottom"
                    />
                  </span>
                  <span className="px-2 pb-4 pt-2 font-sans text-base font-semibold leading-none text-[#1E1E1E] sm:text-[20px]">
                    {theme.label}
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
