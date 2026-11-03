"use client";

import Image from "next/image";
import { useLanguage } from "@/components/providers/LanguageProvider";

const CreateMagicalBook = () => {
  const { t } = useLanguage();

  const steps = [
    {
      image: "/images/stap_1.png",
      title: t.createMagicalBook.step1Title,
      description: t.createMagicalBook.step1Desc,
    },
    {
      image: "/images/stap_2.png",
      title: t.createMagicalBook.step2Title,
      description: t.createMagicalBook.step2Desc,
    },
    {
      image: "/images/stap_3.png",
      title: t.createMagicalBook.step3Title,
      description: t.createMagicalBook.step3Desc,
    },
  ];

  return (
    <section id="create-your-book" aria-labelledby="create-book-heading" className="pt-14 pb-0 sm:pt-16 sm:pb-0 lg:pt-0 lg:pb-0 lg:mb-0">
      <div className="container mx-auto px-5 sm:px-8 lg:px-0">
        <header className="text-center">
          <h2 id="create-book-heading" className="font-crimson text-[38px] sm:text-[44px] lg:text-[48px] font-semibold leading-tight text-[#1E1E1E]">
            {t.createMagicalBook.title}
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-center font-sans text-[16px] sm:text-[18px] font-normal leading-relaxed text-[#444444]">
            {t.createMagicalBook.subheading}
          </p>
        </header>

        <ol className="relative mt-10 grid gap-6 sm:grid-cols-3 sm:gap-6 md:gap-8 lg:mt-[58px] lg:gap-12">
          {steps.map((step, index) => (
            <li key={step.title} className="relative h-full">
              <article className="group flex h-full min-h-[360px] flex-col items-center justify-between rounded-[28px] sm:rounded-[32px] bg-white px-6 pt-7 pb-4 text-center shadow-[0_4px_24px_rgba(110,80,60,0.06)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(110,80,60,0.1)] border border-[#F3ECE4]/80 sm:px-5 sm:pt-8 sm:pb-5 lg:min-h-[440px] lg:px-7 lg:pt-9 lg:pb-5">
                <div className="flex w-full items-center justify-center">
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={300}
                    height={224}
                    className="h-[175px] w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105 sm:h-[185px] lg:h-[210px]"
                    priority={index === 0}
                  />
                </div>

                <div className="flex flex-1 flex-col items-center justify-center">
                  <h3 className="mt-5 font-crimson text-[22px] sm:text-[23px] lg:text-[25px] font-semibold leading-tight text-[#7A3611] break-words text-center">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 max-w-[320px] font-sans text-[14.5px] sm:text-[15.5px] font-normal leading-[1.55] text-[#554F54] break-words text-center">
                    {step.description}
                  </p>
                </div>

                {/* Numbered badge circle */}
                <div className="mt-4 flex items-center justify-center sm:mt-5">
                  <span className="size-8 sm:size-9 rounded-full bg-[#F5A623] text-white font-sans font-bold text-sm sm:text-base flex items-center justify-center shadow-[0_2px_8px_rgba(245,166,35,0.35)] select-none">
                    {index + 1}
                  </span>
                </div>
              </article>

              {/* Mobile connector to the next step */}
              {index < steps.length - 1 && (
                <div className="my-2 flex h-12 items-center justify-center sm:hidden" aria-hidden="true">
                  <Image
                    src="/images/arrwo.svg"
                    alt=""
                    width={100}
                    height={60}
                    className="h-11 w-16 rotate-90 object-contain"
                  />
                </div>
              )}

              {/* Curved connector to the next card */}
              {index < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-1 sm:-top-2 lg:-top-3 xl:-top-4 z-20 hidden sm:block w-16 md:w-20 lg:w-24 xl:w-28 left-[calc(100%+0.75rem)] md:left-[calc(100%+1rem)] lg:left-[calc(100%+1.5rem)] -translate-x-1/2"
                >
                  <Image
                    src="/images/arrwo.svg"
                    alt=""
                    width={100}
                    height={60}
                    className="h-auto w-full rotate-[5deg]"
                  />
                </div>
              )}
            </li>
          ))}
        </ol>

      </div>
    </section>
  );
};

export default CreateMagicalBook;
