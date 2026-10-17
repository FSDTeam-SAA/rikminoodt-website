"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

const ExploreStories = () => {
  const { t } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);

  const stories = [
    {
      id: "lisas-camping-adventure",
      title: t.exploreStories.story1Title,
      description: t.exploreStories.story1Desc,
      image: "/images/story1.png",
    },
    {
      id: "bens-big-dream",
      title: t.exploreStories.story2Title,
      description: t.exploreStories.story2Desc,
      image: "/images/story2.png",
    },
    {
      id: "mias-magic-garden",
      title: t.exploreStories.story3Title,
      description: t.exploreStories.story3Desc,
      image: "/images/story3.png",
    },
  ];

  const scrollStories = (direction: "previous" | "next") => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.firstElementChild as HTMLElement | null;
    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
    const distance = card ? card.getBoundingClientRect().width + gap : 280;

    track.scrollBy({
      left: (direction === "next" ? 1 : -1) * distance,
      behavior: "smooth",
    });
  };

  return (
    <section id="examples" aria-labelledby="stories-heading" className=" py-14 sm:py-16 lg:mb-32 lg:py-0">
      <div className="container mx-auto px-5 sm:px-8 lg:px-0">
        <header className="text-center">
          <h2 id="stories-heading" className="font-crimson text-[48px] font-semibold leading-none text-[#1E1E1E]">
            {t.exploreStories.title}
          </h2>
          <p className="mx-auto mt-2 max-w-3xl text-center font-sans text-[18px] font-normal leading-normal text-[#444444]">
            {t.exploreStories.subheading}
          </p>
        </header>

        <div className="relative mt-8 lg:mt-12">
          <button type="button" aria-label={t.exploreStories.previousAria} aria-controls="story-cards" onClick={() => scrollStories("previous")} className="absolute left-3 top-[30%] z-10 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#d6d2d2] bg-white/95 text-[#7c7579] shadow-[0_2px_5px_rgba(78,64,72,0.18)] transition-colors duration-300 ease-out hover:bg-white hover:text-[#9c81be] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#987fc5] lg:left-[-25px] lg:top-[50.3%] lg:size-12">
            <ChevronLeft aria-hidden="true" size={23} strokeWidth={1.6} />
          </button>

          <div id="story-cards" ref={trackRef} className="grid snap-x snap-mandatory grid-flow-col auto-cols-[calc(100%_-_1.5rem)] gap-4 overflow-x-auto scroll-smooth scroll-px-1 px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:auto-cols-[minmax(280px,46%)] sm:gap-5 lg:grid-flow-row lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0">
            {stories.map((story) => (
              <Link key={story.id} href={`/story-books/book-details/${story.id}`} aria-label={`${t.exploreStories.viewDetails} ${story.title}`} className="block snap-start snap-always rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#987fc5] focus-visible:ring-offset-4">
              <article className="group relative flex min-h-[550px] cursor-pointer flex-col overflow-hidden rounded-xl border border-[#ef92aa] bg-white transition-colors duration-300 ease-out hover:border-[#9c81be] hover:bg-[#fffcfd] lg:h-[764px] lg:min-h-0">
                <div className="relative m-2 overflow-hidden">
                <Image
                  src={story.image}
                  alt={`Cover of ${story.title}`}
                  width={396}
                  height={512}
                  sizes="(max-width: 639px) 72vw, (max-width: 1023px) 42vw, 396px"
                  className="h-[320px] w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.025] sm:h-[380px] lg:h-[458px]"
                />
              </div>
              <div className="flex flex-1 flex-col px-3 pb-4 pt-2.5 lg:px-[18px] lg:pb-5 lg:pt-0">
                <h3 className="min-h-[80px] font-fredoka text-[40px] font-normal leading-none text-[#9C81BE]">{story.title}</h3>
                <div className="mt-5 grid grid-cols-2 gap-3 lg:mt-[29px] lg:gap-5">
                  <span className="flex h-14 cursor-pointer items-center justify-center rounded-xl bg-[#9c81be] px-2 text-center text-sm font-medium text-white lg:text-lg">{t.exploreStories.ageBadge}</span>
                  <span className="flex h-14 cursor-pointer items-center justify-center rounded-xl bg-[#e88da0] px-2 text-center text-sm font-medium text-white lg:text-lg">{t.exploreStories.adventureBadge}</span>
                </div>
                <p className="mt-5 text-base leading-[1.5] text-[#756e73] lg:mt-[29px] lg:text-2xl lg:leading-[1.375]">{story.description}</p>
              </div>
            </article>
            </Link>
          ))}
          </div>

          <button type="button" aria-label="Show next stories" aria-controls="story-cards" onClick={() => scrollStories("next")} className="absolute right-3 top-[30%] z-10 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#d6d2d2] bg-white/95 text-[#7c7579] shadow-[0_2px_5px_rgba(78,64,72,0.18)] transition-colors duration-300 ease-out hover:bg-white hover:text-[#9c81be] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#987fc5] lg:right-[-25px] lg:top-[50.3%] lg:size-12">
            <ChevronRight aria-hidden="true" size={23} strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExploreStories;
