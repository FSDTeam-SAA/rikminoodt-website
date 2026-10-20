"use client";

import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

const digitalFeatures = [
  "Personalised child hero",
  "24-page digital story",
  "Downloadable PDF (high quality)",
  "1 illustration style",
  "Instant access",
];

const printFeatures = [
  "Personalised printed book",
  "Premium cover finish",
  "24 pages of magical illustrations",
  "1 child hero included",
  "Worldwide delivery",
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#FEFAF4] pb-20">
      {/* Hero Banner Section */}
      <section className="relative w-full overflow-hidden pb-12 pt-[120px] text-center sm:pb-16 sm:pt-[150px] lg:pt-[190px]">
        {/* Background Image Banner */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/cont_pri_img.png"
            alt="Hero background"
            fill
            priority
            className="object-cover object-top opacity-90"
          />
          {/* Subtle gradient overlay to smoothly transition to page background */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-[#FEFAF4]" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 mx-auto px-4">
          <h1 className="font-crimson text-4xl font-bold leading-tight text-[#1E1E1E] sm:text-5xl lg:text-[56px]">
            Pricing
          </h1>
          <p className="mx-auto mt-3 max-w-xl font-sans text-base text-[#333333] sm:text-lg">
            Simple pricing for magical personalized books .
          </p>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="container mx-auto mt-2 px-4 sm:mt-6">
        <div className="mx-auto grid max-w-[780px] grid-cols-1 items-stretch gap-6 sm:gap-8 md:grid-cols-2">
          {/* Digital Storybook Card */}
          <div className="flex flex-col justify-between rounded-[26px] border-2 border-[#9C81BE] bg-white p-6 shadow-[0_8px_30px_rgba(156,129,190,0.12)] transition-transform duration-200 hover:-translate-y-1 sm:p-8">
            <div>
              <div className="text-center">
                <h2 className="font-sans text-xl font-bold text-[#1E1E1E] sm:text-[22px]">
                  Digital Storybook
                </h2>
                <p className="mx-auto mt-1 max-w-[220px] font-sans text-xs leading-relaxed text-[#66605F]">
                  A magical story, ready to enjoy online or offline.
                </p>
                <div className="my-5 font-crimson text-3xl font-bold text-[#1E1E1E] sm:text-[38px]">
                  €8.99
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-3.5 pt-2">
                {digitalFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-xs text-[#443E42] sm:text-sm"
                  >
                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#F3EEF9] text-[#9C81BE]">
                      <Check size={11} strokeWidth={3} />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <div className="mt-8 pt-2">
              <Link
                href="/book-builder/choose-age"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#9C81BE] font-sans text-sm font-semibold text-white shadow-md transition hover:bg-[#896FA9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9C81BE]"
              >
                Choose Digital →
              </Link>
            </div>
          </div>

          {/* Printed Storybook Card */}
          <div className="relative flex flex-col justify-between rounded-[26px] border-2 border-[#F3A8B7] bg-[#FFFDFC] p-6 shadow-[0_8px_30px_rgba(232,141,160,0.15)] transition-transform duration-200 hover:-translate-y-1 sm:p-8">
            {/* Most Popular Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="inline-block rounded-full bg-[#E88DA0] px-4 py-1 font-sans text-xs font-semibold text-white shadow-sm">
                Most Popular
              </span>
            </div>

            <div>
              <div className="pt-1 text-center">
                <h2 className="font-sans text-xl font-bold text-[#1E1E1E] sm:text-[22px]">
                  Printed Storybook
                </h2>
                <p className="mx-auto mt-1 max-w-[220px] font-sans text-xs leading-relaxed text-[#66605F]">
                  A beautiful keepsake, delivered to your door.
                </p>
                <div className="my-5 font-crimson text-3xl font-bold text-[#1E1E1E] sm:text-[38px]">
                  €34.60
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-3.5 pt-2">
                {printFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-xs text-[#443E42] sm:text-sm"
                  >
                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#FDF0F3] text-[#E88DA0]">
                      <Check size={11} strokeWidth={3} />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <div className="mt-8 pt-2">
              <Link
                href="/story-books"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#E88DA0] font-sans text-sm font-semibold text-white shadow-md transition hover:bg-[#DD7893] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0]"
              >
                Choose Print →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}