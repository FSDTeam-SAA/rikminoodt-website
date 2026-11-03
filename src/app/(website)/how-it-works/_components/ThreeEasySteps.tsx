"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/components/providers/LanguageProvider";

const ThreeEasySteps = () => {
  const { t } = useLanguage();

  const steps = [
    {
      title: t.createMagicalBook.step1Title,
      description: t.createMagicalBook.step1Desc,
      details: t.howItWorksPage.step1Details,
      image: "/images/stap_1.png",
    },
    {
      title: t.createMagicalBook.step2Title,
      description: t.createMagicalBook.step2Desc,
      details: t.howItWorksPage.step2Details,
      image: "/images/stap_2.png",
    },
    {
      title: t.createMagicalBook.step3Title,
      description: t.createMagicalBook.step3Desc,
      details: t.howItWorksPage.step3Details,
      image: "/images/stap_3.png",
    },
  ];

  return (
    <section className="py-14 sm:py-16 lg:py-20" aria-labelledby="easy-steps-heading">
      <div className="container mx-auto px-5 sm:px-8 lg:px-0">
        <header className="mx-auto max-w-4xl text-center">
          <h1 id="easy-steps-heading" className="font-crimson text-[clamp(2.25rem,4vw,3rem)] font-semibold leading-tight text-[#1E1E1E]">
            {t.howItWorksPage.title}
          </h1>
          <p className="mt-3 font-sans text-[17px] sm:text-[18px] leading-normal text-[#444444]">
            {t.howItWorksPage.subheading}
          </p>
        </header>

        <ol className="mt-10 sm:mt-12 space-y-7 sm:space-y-8 md:space-y-9 lg:space-y-10">
          {steps.map((step, index) => {
            const imageFirst = index === 1;

            return (
              <li key={step.title} className="relative">
                <article className="relative z-10 grid overflow-visible rounded-[26px] sm:rounded-[32px] bg-white px-6 py-7 shadow-[0_6px_30px_rgba(110,80,60,0.06)] border border-[#F3ECE4]/80 sm:px-9 sm:py-8 md:grid-cols-2 md:items-center md:gap-8 lg:gap-14 lg:px-12 lg:py-10">
                  {/* Text Column */}
                  <div className={imageFirst ? "md:order-2" : "md:order-1"}>
                    <h2 className="font-crimson text-2xl sm:text-3xl lg:text-[32px] font-semibold leading-tight text-[#7A3611]">
                      {step.title}
                    </h2>
                    <p className="mt-2.5 max-w-xl font-sans text-[14.5px] sm:text-[15.5px] leading-relaxed text-[#554F54]">
                      {step.description}
                    </p>
                    <ul className="mt-4 space-y-2 font-sans text-[14px] sm:text-[15px] text-[#443E42]">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-2.5">
                          <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-[#7A3611]" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Image & Badge Column */}
                  <div className={`relative mt-6 flex min-h-[200px] sm:min-h-[230px] lg:min-h-[250px] items-center justify-center md:mt-0 ${imageFirst ? "md:order-1" : "md:order-2"}`}>
                    {/* Step Number Badge 1 + Star */}
                    {index === 0 && (
                      <div className="absolute -top-2 right-2 sm:right-6 lg:right-8 z-20 flex flex-col items-center gap-1">
                        <span className="size-11 sm:size-12 lg:size-13 rounded-full bg-[#F5A623] text-white font-sans font-bold text-lg sm:text-xl lg:text-2xl flex items-center justify-center shadow-[0_3px_10px_rgba(245,166,35,0.35)] select-none">
                          1
                        </span>
                        {/* Golden star under badge 1 */}
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#F5A623] fill-current drop-shadow-sm" aria-hidden="true">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                    )}

                    {/* Step Number Badge 2 + Accent rays */}
                    {index === 1 && (
                      <div className="absolute -top-2 left-2 sm:left-6 lg:left-8 z-20 flex items-center gap-1.5">
                        <span className="size-11 sm:size-12 lg:size-13 rounded-full bg-[#F5A623] text-white font-sans font-bold text-lg sm:text-xl lg:text-2xl flex items-center justify-center shadow-[0_3px_10px_rgba(245,166,35,0.35)] select-none">
                          2
                        </span>
                        {/* Accent rays */}
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#F5A623]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                          <path d="M4 12 L1 12" />
                          <path d="M6 6 L3 3" />
                          <path d="M12 4 L12 1" />
                        </svg>
                      </div>
                    )}

                    {/* Step Number Badge 3 + Accent rays */}
                    {index === 2 && (
                      <div className="absolute -top-2 right-2 sm:right-6 lg:right-8 z-20 flex items-center gap-1.5">
                        <span className="size-11 sm:size-12 lg:size-13 rounded-full bg-[#F5A623] text-white font-sans font-bold text-lg sm:text-xl lg:text-2xl flex items-center justify-center shadow-[0_3px_10px_rgba(245,166,35,0.35)] select-none">
                          3
                        </span>
                        {/* Accent rays */}
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#F5A623]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                          <path d="M20 12 L23 12" />
                          <path d="M18 6 L21 3" />
                          <path d="M12 4 L12 1" />
                        </svg>
                      </div>
                    )}

                    {/* In Card 3: Accent rays pointing towards book */}
                    {index === 2 && (
                      <div className="absolute -left-2 sm:left-2 bottom-6 z-20 hidden sm:block pointer-events-none">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#F5A623]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                          <path d="M4 4 L8 8" />
                          <path d="M2 12 L8 12" />
                          <path d="M4 20 L8 16" />
                        </svg>
                      </div>
                    )}

                    <Image
                      src={step.image}
                      alt={step.title}
                      width={380}
                      height={280}
                      className="relative z-10 h-auto max-h-[200px] sm:max-h-[225px] lg:max-h-[250px] w-auto max-w-full object-contain"
                      priority={index === 0}
                    />
                  </div>
                </article>

                {/* Cloud decoration on Card 1 */}
                {index === 0 && (
                  <Image
                    src="/images/cloud.png"
                    alt=""
                    width={180}
                    height={110}
                    className="pointer-events-none absolute -bottom-5 -right-5 z-20 h-auto w-[110px] sm:-bottom-7 sm:-right-7 sm:w-[150px] lg:-bottom-9 lg:-right-9 lg:w-[180px]"
                  />
                )}

                {/* Parachute / Hot Air Balloon decoration on Card 2 */}
                {index === 1 && (
                  <Image
                    src="/images/parasut.png"
                    alt=""
                    width={1145}
                    height={1374}
                    className="pointer-events-none absolute -left-4 sm:-left-7 lg:-left-11 top-1/2 -translate-y-1/2 z-20 h-auto w-[70px] sm:w-[90px] lg:w-[110px]"
                  />
                )}

                {/* Sweeps from Card 1 down towards the Card 2 laptop */}
                {index === 0 && (
                  <div
                    className="pointer-events-none absolute -bottom-12 left-[33%] z-30 hidden w-[205px] md:block lg:w-[240px]"
                    aria-hidden="true"
                  >
                    <Image
                      src="/images/how-it-works-arrow-left.png"
                      alt=""
                      width={1726}
                      height={911}
                      className="h-auto w-full"
                    />
                  </div>
                )}

                {/* Sweeps from Card 2 down towards the Card 3 book */}
                {index === 1 && (
                  <div
                    className="pointer-events-none absolute -bottom-10 left-[37%] z-30 hidden w-[180px] md:block lg:w-[215px]"
                    aria-hidden="true"
                  >
                    <Image
                      src="/images/how-it-works-arrow-right.png"
                      alt=""
                      width={1450}
                      height={1085}
                      className="h-auto w-full"
                    />
                  </div>
                )}

                {/* Mobile Downward Curved Arrow between cards */}
                {index < steps.length - 1 && (
                  <div className="flex h-12 items-center justify-center md:hidden my-2.5" aria-hidden="true">
                    <svg viewBox="0 0 40 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-11 w-8">
                      <path
                        d="M 12 6 C 6 22, 10 36, 25 44"
                        stroke="#F5A623"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 28 52 L 28 38 L 22 43 L 16 40 Z"
                        fill="#F5A623"
                      />
                    </svg>
                  </div>
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
