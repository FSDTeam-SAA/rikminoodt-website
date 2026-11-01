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
          <h2 id="create-book-heading" className="font-crimson text-[48px] font-semibold leading-none text-[#1E1E1E]">
            {t.createMagicalBook.title}
          </h2>
          <p className="mx-auto mt-2 max-w-4xl text-center font-sans text-[18px] font-normal leading-normal text-[#444444]">
            {t.createMagicalBook.subheading}
          </p>
        </header>

        <ol className="relative mt-9 grid gap-5 sm:grid-cols-3 sm:gap-8 lg:mx-2.5 lg:mt-[58px] lg:gap-12">
          {steps.map((step, index) => (
            <li key={step.title} className="h-full">
              <article className="group flex h-full min-h-[300px] flex-col items-center rounded-2xl bg-white px-5 pb-5 pt-5 text-center shadow-[0_3px_8px_rgba(92,76,84,0.18)] transition duration-200 hover:shadow-[0_9px_18px_rgba(92,76,84,0.18)] sm:px-4 lg:min-h-[415px] lg:px-6">
                <Image src={step.image} alt="" width={300} height={224} className="h-[180px] w-auto max-w-full object-contain transition-transform duration-200 group-hover:scale-105 sm:h-[190px] lg:h-[210px]" />
                <h3 className="mt-3 break-words text-center font-crimson text-[24px] font-semibold leading-none text-[#82330d]">{step.title}</h3>
                <p className="mt-2 max-w-[330px] break-words text-center font-sans text-[18px] font-normal leading-[1.35] text-[#595257]">{step.description}</p>
              </article>
              {index < steps.length - 1 && (
                <div className="flex h-10 items-center justify-center sm:hidden" aria-hidden="true">
                  <svg viewBox="0 0 48 64" className="h-9 w-10">
                    <path d="M9 5c0 24 11 39 25 47" fill="none" stroke="#F7B733" strokeLinecap="round" strokeWidth="6" />
                    <path d="m25 43 9 10-12 5" fill="none" stroke="#F7B733" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" />
                  </svg>
                </div>
              )}
            </li>
          ))}
          {["first", "second"].map((arrow, index) => (
            <svg
              key={arrow}
              viewBox="0 0 64 48"
              className={`pointer-events-none absolute top-[29%] z-10 hidden h-11 w-14 -translate-x-1/2 sm:block ${index === 0 ? "left-1/3" : "left-2/3"}`}
              aria-hidden="true"
            >
              <path d="M4 39C15 10 41 9 54 22" fill="none" stroke="#F7B733" strokeLinecap="round" strokeWidth="6" />
              <path d="m47 13 10 9-10 9" fill="none" stroke="#F7B733" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" />
            </svg>
          ))}
        </ol>

      </div>
    </section>
  );
};

export default CreateMagicalBook;
