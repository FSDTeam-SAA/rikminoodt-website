"use client";

import Image from "next/image";
import { useLanguage } from "@/components/providers/LanguageProvider";

const CreateMagicalBook = () => {
  const { t } = useLanguage();

  const steps = [
    {
      image: "/images/book1.png",
      title: t.createMagicalBook.step1Title,
      description: t.createMagicalBook.step1Desc,
    },
    {
      image: "/images/book2.png",
      title: t.createMagicalBook.step2Title,
      description: t.createMagicalBook.step2Desc,
    },
    {
      image: "/images/book3.png",
      title: t.createMagicalBook.step3Title,
      description: t.createMagicalBook.step3Desc,
    },
  ];

  return (
    <section id="create-your-book" aria-labelledby="create-book-heading" className=" py-14 sm:py-16 lg:mb-32 lg:pb-[10px] lg:pt-0">
      <div className="container mx-auto px-5 sm:px-8 lg:px-0">
        <header className="text-center">
          <h2 id="create-book-heading" className="font-crimson text-[48px] font-semibold leading-none text-[#1E1E1E]">
            {t.createMagicalBook.title}
          </h2>
          <p className="mx-auto mt-2 max-w-4xl text-center font-sans text-[18px] font-normal leading-normal text-[#444444]">
            {t.createMagicalBook.subheading}
          </p>
        </header>

        <ol className="mt-9 grid gap-5 sm:grid-cols-3 sm:gap-8 lg:mx-2.5 lg:mt-[58px] lg:gap-12">
          {steps.map((step) => (
            <li key={step.title}>
              <article className="group flex h-full min-h-[300px] flex-col items-center rounded-2xl bg-white px-5 pb-5 pt-5 text-center shadow-[0_3px_8px_rgba(92,76,84,0.18)] transition duration-200 hover:shadow-[0_9px_18px_rgba(92,76,84,0.18)] sm:px-4 lg:h-[402px] lg:min-h-0 lg:px-6">
                <Image src={step.image} alt="" width={300} height={224} className="h-[180px] w-auto max-w-full object-contain transition-transform duration-200 group-hover:scale-105 sm:h-[190px] lg:h-[224px]" />
                <h3 className="mt-3 text-center font-crimson text-[24px] font-semibold leading-none text-[#82330d]">{step.title}</h3>
                <p className="mt-2 max-w-[330px] text-center font-sans text-[18px] font-normal leading-[1.35] text-[#595257]">{step.description}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default CreateMagicalBook;
