"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function FinalCreateBookButton() {
  const { t } = useLanguage();

  return (
    <section className="pb-16 text-center sm:pb-20" aria-label={t.howItWorksPage.ctaBtn}>
      <div className="container mx-auto px-5 sm:px-8 lg:px-0">
        <Link
          href="/book-builder/choose-age"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-[#E88DA0] px-7 font-sans text-base font-semibold text-white shadow-[0_5px_12px_rgba(232,141,160,0.25)] transition-colors duration-300 hover:bg-[#DF7894] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf] focus-visible:ring-offset-2"
        >
          {t.howItWorksPage.ctaBtn}
        </Link>
      </div>
    </section>
  );
}
