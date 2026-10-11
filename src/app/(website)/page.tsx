import React from 'react'
import Hero from './_components/hero'
import ChooseYourTheme from './_components/choose-your-theme'
import Faq from './_components/faq'
import ExploreStories from './_components/explore-stories'
import CreateMagicalBook from './_components/create-magical-book'
import MakeAPersonalisedBook from './_components/make-a-personalised-book'
import BookerelloReviews from './_components/bookerello-reviews'
import TurningLittleImaginations from './_components/turning-little-imaginations'

const HomePage = () => {
  return (
    <main className="overflow-x-clip">
      <Hero/>
      <ChooseYourTheme />
      <TurningLittleImaginations/>
      <CreateMagicalBook/>
      <ExploreStories/>
      <MakeAPersonalisedBook/>
      <BookerelloReviews/>
      <Faq />
    </main>
  )
}

export default HomePage
