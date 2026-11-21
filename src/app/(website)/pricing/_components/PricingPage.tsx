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
      <section className="relative w-full overflow-hidden pb-2 pt-40 text-center sm:pt-[200px] lg:pt-[220px]">
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

        {/* Soft clouds in the bottom corners */}
        <svg className="pointer-events-none absolute -bottom-4 left-0 hidden w-56 md:block lg:w-72" viewBox="0 0 300 120" fill="none" aria-hidden="true">
          <path d="M0 120V86c0-18 14-32 32-32 4 0 8 1 11 2 6-22 26-38 50-38 26 0 48 18 53 42 4-2 9-3 14-3 20 0 36 16 36 36v27H0z" fill="#E6DAFB" opacity="0.75" />
        </svg>
        <svg className="pointer-events-none absolute -bottom-4 right-0 hidden w-56 md:block lg:w-72" viewBox="0 0 300 120" fill="none" aria-hidden="true">
          <path d="M300 120V86c0-18-14-32-32-32-4 0-8 1-11 2-6-22-26-38-50-38-26 0-48 18-53 42-4-2-9-3-14-3-20 0-36 16-36 36v27h196z" fill="#FDE9A9" opacity="0.8" />
          <path d="M300 120v-20c0-12-10-22-22-22-3 0-5 0-8 1-4-14-17-24-33-24-17 0-31 12-34 28-3-1-6-2-9-2-14 0-24 11-24 25v14h130z" fill="#FFD3E0" opacity="0.7" />
        </svg>

        {/* Stars - left side (big + small, as in the reference) */}
        <div className="pointer-events-none absolute left-[5%] top-[22%] hidden lg:block">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="#FBBF24" className="drop-shadow-[0_2px_6px_rgba(251,191,36,0.5)]">
            <path d="M12 2l2.8 6.6 7.2.6-5.4 4.8 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.2-.6L12 2z" />
          </svg>
        </div>
        <div className="pointer-events-none absolute left-[9%] top-[42%] hidden lg:block">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#FBBF24" className="drop-shadow-[0_2px_4px_rgba(251,191,36,0.45)]">
            <path d="M12 2l2.8 6.6 7.2.6-5.4 4.8 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.2-.6L12 2z" />
          </svg>
        </div>

        {/* Stars + dashed path - right side */}
        <div className="pointer-events-none absolute right-[7%] top-[16%] hidden lg:block">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#FBBF24" className="drop-shadow-[0_2px_4px_rgba(251,191,36,0.45)]">
            <path d="M12 2l2.8 6.6 7.2.6-5.4 4.8 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.2-.6L12 2z" />
          </svg>
        </div>
        <div className="pointer-events-none absolute right-[3%] top-[26%] hidden lg:block">
          <svg width="110" height="100" viewBox="0 0 110 100" fill="none" className="opacity-80">
            <path d="M12 92 Q 28 26, 104 20" stroke="#7DD3FC" strokeWidth="2" strokeDasharray="3 4" strokeLinecap="round" />
            <polygon points="10,86 11.8,90.4 16.5,90.6 12.8,93.5 14,98 10,95.4 6,98 7.2,93.5 3.5,90.6 8.2,90.4" fill="#FBBF24" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto grid max-w-[880px] grid-cols-1 items-stretch gap-6 md:grid-cols-2 md:gap-7">
          {/* Digital Storybook Card */}
          <div className="flex flex-col justify-between rounded-[28px] border border-[#E4D8FB] bg-[linear-gradient(160deg,#F6F1FF_0%,#FFFFFF_65%)] p-6 shadow-[0_12px_32px_rgba(45,30,80,0.08)] transition-all duration-200 hover:-translate-y-1 sm:p-7">
            <div>
              {/* Header with image on the left */}
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="relative size-24 shrink-0 sm:size-28">
                  <Image
                    src="/images/pricing_digital.png"
                    alt={pricing.digitalTitle}
                    fill
                    sizes="112px"
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
          <div className="relative flex flex-col justify-between rounded-[28px] border border-[#FFD3E0] bg-[linear-gradient(160deg,#FFF0F5_0%,#FFFFFF_65%)] p-6 shadow-[0_12px_32px_rgba(230,27,91,0.08)] transition-all duration-200 hover:-translate-y-1 sm:p-7">
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
                <div className="relative size-24 shrink-0 sm:size-28">
                  <Image
                    src="/images/pricing_printed.png"
                    alt={pricing.printedTitle}
                    fill
                    sizes="112px"
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
