"use client";

import Image from "next/image";
import { useLanguage } from "@/components/providers/LanguageProvider";

const themeList = [
  { key: "fairyTales" as const, image: "fairy_tales.png", color: "bg-[#FFE6D6]" },
  { key: "adventure" as const, image: "adventure.png", color: "bg-[#E1F1FF]" },
  { key: "activities" as const, image: "activities.png", color: "bg-[#FADDE1]" },
  { key: "worlds" as const, image: "worlds.png", color: "bg-[#D7EDDE]" },
  { key: "holidays" as const, image: "holidays.png", color: "bg-[#D7EDDE]" },
  { key: "family" as const, image: "family.png", color: "bg-[#FADDE1]" },
  { key: "educational" as const, image: "educational.png", color: "bg-[#FFE9D9]" },
  { key: "feelings" as const, image: "feelings.png", color: "bg-[#E1F1FF]" },
];

const ChooseTheme = () => {
  const { t } = useLanguage();

  return (
    <section id="story-books" aria-labelledby="choose-theme-heading" className="pb-16 pt-2 sm:pb-20 lg:pb-24">
      <div className="container mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-0">
        <header className="text-center">
          <h2 id="choose-theme-heading" className="font-crimson text-[48px] font-semibold leading-none text-[#1E1E1E]">
            {t.chooseTheme.title}
          </h2>
          <p className="mx-auto mt-2 max-w-3xl font-sans text-[18px] font-normal leading-normal text-[#444444]">
            {t.chooseTheme.subheading}
          </p>
        </header>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:mt-10 lg:gap-5">
          {themeList.map((theme) => {
            const title = t.chooseTheme.themes[theme.key] ?? theme.key;
            return (
              <article key={theme.key} className={`group flex min-h-[174px] flex-col items-center justify-between rounded-xl px-3 pb-4 pt-3 text-center transition-colors duration-300 hover:brightness-[0.97] sm:min-h-[195px] sm:px-4 sm:pb-5 sm:pt-4 ${theme.color}`}>
                <Image
                  src={`/images/choose_your-theme/${theme.image}`}
                  alt=""
                  width={150}
                  height={132}
                  className="h-[118px] w-auto max-w-full object-contain transition-transform duration-300 ease-out group-hover:scale-105 sm:h-[132px]"
                />
                <h3 className="mt-2 font-sans text-lg font-semibold leading-none text-[#1E1E1E] sm:text-xl">
                  {title}
                </h3>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ChooseTheme;
