"use client";

import React from 'react'
import Link from 'next/link'
import Hero from './_components/hero'
import ChooseYourTheme from './_components/choose-your-theme'
import Faq from './_components/faq'
import ExploreStories from './_components/explore-stories'
import CreateMagicalBook from './_components/create-magical-book'
import MakeAPersonalisedBook from './_components/make-a-personalised-book'
import BookerelloReviews from './_components/bookerello-reviews'
import TurningLittleImaginations from './_components/turning-little-imaginations'
import { useLanguage } from '@/components/providers/LanguageProvider'

const HomePage = () => {
  const { t } = useLanguage();

  return (
    <main className="overflow-x-clip">
      <Hero/>
      <ChooseYourTheme />
      <TurningLittleImaginations/>
      <CreateMagicalBook/>
      <div className="relative z-10 py-14 text-center sm:py-16 lg:py-24">
        <Link
          href="/book-builder/choose-age"
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#E88DA0] px-8 font-sans text-lg font-semibold text-white shadow-[0_6px_16px_rgba(232,141,160,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#DD7893] hover:shadow-[0_9px_20px_rgba(232,141,160,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf] focus-visible:ring-offset-4 sm:h-14 sm:px-10 sm:text-xl"
        >
          {t.hero.createBookBtn}
        </Link>
      </div>
      <ExploreStories className="pt-0" />
      <MakeAPersonalisedBook/>
      <BookerelloReviews/>
      <Faq />
    </main>
  )
}

export default HomePage
