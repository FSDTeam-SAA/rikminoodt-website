"use client";

import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
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
      <section className="relative flex h-[58svh] min-h-[400px] w-full items-center justify-center overflow-hidden pt-16 text-center sm:min-h-[470px] sm:pt-20 lg:min-h-[520px]">
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
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/65" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 mx-auto px-4">
          <h1 className="font-crimson text-[38px] font-bold leading-none text-[#1E1E1E] sm:text-[44px] lg:text-[50px]">
            {pricing.title}
          </h1>
          <p className="mx-auto mt-3 max-w-xl font-sans text-base text-[#3F3A3E] sm:text-[18px]">
            {pricing.subheading}
          </p>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="container mx-auto mt-7 px-4 sm:mt-8">
        <div className="mx-auto grid max-w-[760px] grid-cols-1 items-stretch gap-6 sm:grid-cols-2 sm:gap-5">
          {/* Digital Storybook Card */}
          <div className="flex flex-col justify-between rounded-[20px] border border-[#9C81BE] bg-[#FCFAFF] p-6 shadow-[0_8px_20px_rgba(156,129,190,0.1)] transition-transform duration-200 hover:-translate-y-1 sm:p-7">
            <div>
              <div className="text-center">
                <h2 className="font-sans text-xl font-bold text-[#1E1E1E] sm:text-xl">
                  {pricing.digitalTitle}
                </h2>
                <p className="mx-auto mt-1.5 max-w-[250px] font-sans text-xs leading-[1.4] text-[#69718B]">
                  {pricing.digitalDesc}
                </p>
                <div className="my-5 font-crimson text-[32px] font-bold text-[#1E1E1E] sm:text-[34px]">
                  {pricing.digitalPrice}
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-2.5 pt-1">
                {pricing.digitalFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 text-xs leading-tight text-[#443E42]"
                  >
                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#F3EEF9] text-[#9C81BE]">
                      <Check size={10} strokeWidth={3} />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <div className="mt-9 pt-1">
              <Link
                href="/book-builder/choose-age"
                className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#9C81BE] font-sans text-xs font-semibold text-white shadow-sm transition hover:bg-[#896FA9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C81BE]"
              >
                {pricing.digitalBtn} →
              </Link>
            </div>
          </div>

          {/* Printed Storybook Card */}
          <div className="relative flex flex-col justify-between rounded-[20px] border border-[#F3A8B7] bg-[#FFF8FA] p-6 shadow-[0_8px_20px_rgba(232,141,160,0.12)] transition-transform duration-200 hover:-translate-y-1 sm:p-7">
            {/* Most Popular Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-block whitespace-nowrap rounded-full bg-[#E88DA0] px-3.5 py-1 font-sans text-[10px] font-semibold text-white shadow-sm">
                {pricing.mostPopular}
              </span>
            </div>

            <div>
              <div className="pt-1 text-center">
                <h2 className="font-sans text-xl font-bold text-[#1E1E1E] sm:text-xl">
                  {pricing.printedTitle}
                </h2>
                <p className="mx-auto mt-1.5 max-w-[250px] font-sans text-xs leading-[1.4] text-[#69718B]">
                  {pricing.printedDesc}
                </p>
                <div className="my-5 font-crimson text-[32px] font-bold text-[#1E1E1E] sm:text-[34px]">
                  {pricing.printedPrice}
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-2.5 pt-1">
                {pricing.printFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 text-xs leading-tight text-[#443E42]"
                  >
                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#FDF0F3] text-[#E88DA0]">
                      <Check size={10} strokeWidth={3} />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <div className="mt-9 pt-1">
              <Link
                href="/book-builder/choose-age"
                className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#E88DA0] font-sans text-xs font-semibold text-white shadow-sm transition hover:bg-[#DD7893] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0]"
              >
                {pricing.printedBtn} →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
