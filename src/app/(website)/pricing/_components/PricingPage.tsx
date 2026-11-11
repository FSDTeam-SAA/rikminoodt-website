"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Crown } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function PricingPage() {
  const { t } = useLanguage();
  const pricing = t.pricing || {
    title: "Pricing",
    subheading: "Simple pricing for magical personalized books.",
    digitalTitle: "Digital Storybook",
    digitalDesc: "A magical story, ready to enjoy online or offline.",
    digitalPrice: "€8.99",
    digitalBtn: "Choose Digital",
    mostPopular: "Most Popular",
    printedTitle: "Printed Storybook",
    printedDesc: "A beautiful keepsake, delivered to your door.",
    printedPrice: "€34.60",
    printedBtn: "Choose Print",
    digitalFeatures: [
      "Personalised child hero",
      "24-page digital story",
      "Downloadable PDF (high quality)",
      "1 illustration style",
      "Instant access",
    ],
    printFeatures: [
      "Personalised printed book",
      "Premium cover finish",
      "24 pages of magical illustrations",
      "1 child hero included",
      "Worldwide delivery",
    ],
  };

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* Hero Banner Section */}
      <section className="relative flex h-[50svh] min-h-[360px] w-full items-center justify-center overflow-hidden pt-16 text-center sm:min-h-[420px] sm:pt-20 lg:min-h-[460px]">
        {/* Background Image Banner */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/cont_pri_img.png"
            alt="Hero background"
            fill
            priority
            className="object-cover object-center opacity-70"
          />
          {/* Subtle gradient overlay to smoothly transition to page background */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/70" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 mx-auto px-4">
          <h1 className="font-crimson text-[40px] font-bold leading-none text-[#1E1E1E] sm:text-[48px] lg:text-[54px]">
            {pricing.title}
          </h1>
          <p className="mx-auto mt-3 max-w-xl font-sans text-base text-[#3F3A3E] sm:text-[18px]">
            {pricing.subheading}
          </p>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="relative container mx-auto mt-6 px-4 pb-16 sm:mt-8">
        {/* Decorative background accents */}
        <div className="pointer-events-none absolute -bottom-6 -left-8 size-72 rounded-full bg-[#E8DBFA]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-6 -right-8 size-72 rounded-full bg-[#FCD8E2]/35 blur-3xl" />

        {/* Floating star on left */}
        <div className="pointer-events-none absolute -left-2 top-1/4 hidden lg:block xl:-left-6">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="#FBBF24" className="drop-shadow-[0_2px_6px_rgba(251,191,36,0.5)]">
            <path d="M12 2l2.8 6.6 7.2.6-5.4 4.8 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.2-.6L12 2z" />
          </svg>
        </div>

        {/* Floating dashed path and star on right */}
        <div className="pointer-events-none absolute -right-2 top-1/4 hidden lg:block xl:-right-6">
          <svg width="100" height="90" viewBox="0 0 100 90" fill="none" className="opacity-75">
            <path d="M10 80 Q 55 10, 95 30" stroke="#7DD3FC" strokeWidth="2.5" strokeDasharray="4 4" />
            <polygon points="95,22 97.5,29 105,29 99,33.5 101,41 95,36 89,41 91,33.5 85,29 92.5,29" fill="#FBBF24" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto grid max-w-[880px] grid-cols-1 items-stretch gap-6 md:grid-cols-2 md:gap-7">
          {/* Digital Storybook Card */}
          <div className="flex flex-col justify-between rounded-[28px] border-2 border-[#D8C7F8] bg-white p-6 shadow-[0_12px_32px_rgba(45,30,80,0.06)] transition-all duration-200 hover:-translate-y-1 sm:p-7">
            <div>
              {/* Header with image on the left */}
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="relative size-20 shrink-0 sm:size-24">
                  <Image
                    src="/images/pricing_digital.png"
                    alt={pricing.digitalTitle}
                    fill
                    sizes="100px"
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-fredoka text-xl font-bold tracking-tight text-[#161233] sm:text-[22px]">
                    {pricing.digitalTitle}
                  </h2>
                  <p className="mt-1 font-sans text-xs font-medium leading-snug text-[#524B60] sm:text-[13px]">
                    {pricing.digitalDesc}
                  </p>
                  <div className="mt-2.5 inline-flex items-center justify-center rounded-full bg-[#EAE3F9] px-5 py-1.5 font-fredoka text-xl font-bold text-[#2C1870] sm:text-[22px]">
                    {pricing.digitalPrice}
                  </div>
                </div>
              </div>

              {/* Features List */}
              <ul className="mt-6 space-y-2.5 sm:mt-7 sm:space-y-3">
                {pricing.digitalFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 font-sans text-xs font-medium text-[#2E283B] sm:text-[13px]"
                  >
                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#EAE3F9] text-[#5233A5] sm:size-[18px]">
                      <Check size={11} strokeWidth={3.5} />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <div className="mt-7 pt-1 sm:mt-8">
              <Link
                href="/book-builder/choose-age"
                className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-[#5233A5] font-sans text-sm font-bold text-white shadow-[0_6px_18px_rgba(82,51,165,0.28)] transition-all duration-200 hover:bg-[#43268D] hover:shadow-[0_8px_22px_rgba(82,51,165,0.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5233A5] sm:h-12 sm:text-base"
              >
                <span>{pricing.digitalBtn}</span>
                <ArrowRight size={17} strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          {/* Printed Storybook Card */}
          <div className="relative flex flex-col justify-between rounded-[28px] border-2 border-[#FDC4D3] bg-white p-6 shadow-[0_12px_32px_rgba(230,27,91,0.06)] transition-all duration-200 hover:-translate-y-1 sm:p-7">
            {/* Most Popular Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#FACC15] px-4 py-1 font-sans text-xs font-bold text-[#2A1E00] shadow-[0_2px_8px_rgba(250,204,21,0.35)]">
                <Crown size={13} className="fill-[#2A1E00] text-[#2A1E00]" />
                <span>{pricing.mostPopular}</span>
              </span>
            </div>

            <div>
              {/* Header with image on the left */}
              <div className="flex items-center gap-3.5 sm:gap-4 pt-1 sm:pt-0">
                <div className="relative size-20 shrink-0 sm:size-24">
                  <Image
                    src="/images/pricing_printed.png"
                    alt={pricing.printedTitle}
                    fill
                    sizes="100px"
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-fredoka text-xl font-bold tracking-tight text-[#161233] sm:text-[22px]">
                    {pricing.printedTitle}
                  </h2>
                  <p className="mt-1 font-sans text-xs font-medium leading-snug text-[#524B60] sm:text-[13px]">
                    {pricing.printedDesc}
                  </p>
                  <div className="mt-2.5 inline-flex items-center justify-center rounded-full bg-[#FFE3EC] px-5 py-1.5 font-fredoka text-xl font-bold text-[#E5195B] sm:text-[22px]">
                    {pricing.printedPrice}
                  </div>
                </div>
              </div>

              {/* Features List */}
              <ul className="mt-6 space-y-2.5 sm:mt-7 sm:space-y-3">
                {pricing.printFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 font-sans text-xs font-medium text-[#2E283B] sm:text-[13px]"
                  >
                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#FFE3EC] text-[#E5195B] sm:size-[18px]">
                      <Check size={11} strokeWidth={3.5} />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <div className="mt-7 pt-1 sm:mt-8">
              <Link
                href="/book-builder/choose-age"
                className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-[#E5195B] font-sans text-sm font-bold text-white shadow-[0_6px_18px_rgba(229,25,91,0.28)] transition-all duration-200 hover:bg-[#CF114E] hover:shadow-[0_8px_22px_rgba(229,25,91,0.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5195B] sm:h-12 sm:text-base"
              >
                <span>{pricing.printedBtn}</span>
                <ArrowRight size={17} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
