"use client";

import Image from "next/image";
import { useLanguage } from "@/components/providers/LanguageProvider";

const ThreeEasySteps = () => {
  const { t } = useLanguage();

  const steps = [
    {
      title: t.createMagicalBook.step1Title,
      description: t.createMagicalBook.step1Desc,
      details: t.howItWorksPage.step1Details,
      image: "/images/book1.png",
    },
    {
      title: t.createMagicalBook.step2Title,
      description: t.createMagicalBook.step2Desc,
      details: t.howItWorksPage.step2Details,
      image: "/images/book2.png",
    },
    {
      title: t.createMagicalBook.step3Title,
      description: t.createMagicalBook.step3Desc,
      details: t.howItWorksPage.step3Details,
      image: "/images/book3.png",
    },
  ];

  return (
    <section className="py-14 sm:py-16 lg:py-20" aria-labelledby="easy-steps-heading">
      <div className="container mx-auto px-5 sm:px-8 lg:px-0">
        <header className="mx-auto max-w-4xl text-center">
          <h1 id="easy-steps-heading" className="font-crimson text-[clamp(2.25rem,4vw,3rem)] font-semibold leading-none text-[#1E1E1E]">
            {t.howItWorksPage.title}
          </h1>
          <p className="mt-3 font-sans text-[18px] leading-normal text-[#444444]">
            {t.howItWorksPage.subheading}
          </p>
        </header>

        <ol className="mt-9 space-y-4 sm:mt-12 sm:space-y-6">
          {steps.map((step, index) => {
            const imageFirst = index === 1;

            return (
              <li key={step.title} className="relative">
                <article className="relative z-10 grid overflow-hidden rounded-2xl bg-white px-5 py-7 shadow-[0_5px_18px_rgba(92,76,84,0.06)] sm:px-8 sm:py-8 md:grid-cols-2 md:items-center md:gap-10 lg:min-h-[260px] lg:px-12">
                  <div className={imageFirst ? "md:order-2" : ""}>
                    <h2 className="font-crimson text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-none text-[#82330D]">{step.title}</h2>
                    <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-[#514A4E] sm:text-base">{step.description}</p>
                    <ul className="mt-4 space-y-2 font-sans text-sm text-[#3F393D] sm:text-base">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex gap-2">
                          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-[#82330D]" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={`relative mt-7 flex min-h-[180px] items-center justify-center md:mt-0 ${imageFirst ? "md:order-1" : ""}`}>
                    <span aria-hidden="true" className="absolute size-[158px] rounded-full border-2 border-[#FF7A18] sm:size-[185px]" />
                    <Image src={step.image} alt="" width={272} height={224} className="relative z-10 h-auto max-h-[205px] w-auto max-w-full object-contain" />
                  </div>
                </article>
                {index === 0 && (
                  <Image
                    src="/images/cloud.png"
                    alt=""
                    width={154}
                    height={98}
                    className="pointer-events-none absolute -bottom-9 -right-18 z-20 h-auto w-[155px] sm:-bottom-12 sm:-right-20 sm:w-[205px]"
                  />
                )}
                {index === 1 && (
                  <Image
                    src="/images/parasut.png"
                    alt=""
                    width={1145}
                    height={1374}
                    className="pointer-events-none absolute -bottom-10 -left-8 z-20 h-auto w-[82px] sm:-bottom-12 sm:-left-12 sm:w-[110px] lg:w-[125px]"
                  />
                )}
              </li>
            );
          })}
        </ol>

      </div>
    </section>
  );
};

export default ThreeEasySteps;
