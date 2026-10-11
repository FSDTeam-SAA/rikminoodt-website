"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const stories = [
  {
    title: "Lisa’s Camping Adventure",
    description: "A heartwarming adventure in nature.",
    image: "/images/story1.png",
  },
  {
    title: "Ben's Big Dream",
    description: "A heartwarming magical Children's Book",
    image: "/images/story2.png",
  },
  {
    title: "Mia's Magic Garden",
    description: "A Magical Children's Book",
    image: "/images/story3.png",
  },
];

const ExploreStories = () => {
  const trackRef = useRef<HTMLDivElement>(null);

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
          <h2 id="stories-heading" className="font-crimson text-[clamp(2.25rem,3.35vw,3rem)] font-semibold leading-[1.05] tracking-[-0.025em] text-[#292528]">
            Explore Stories
          </h2>
          <p className="mx-auto mt-2 max-w-3xl text-sm leading-relaxed text-[#5c5559] sm:text-base lg:text-lg">
            Discover magical adventures, exciting themes, and heartwarming stories created to make every child the hero.
          </p>
        </header>

        <div className="relative mt-8 lg:mt-12">
          <button type="button" aria-label="Show previous stories" aria-controls="story-cards" onClick={() => scrollStories("previous")} className="absolute left-3 top-[30%] z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#d6d2d2] bg-white/95 text-[#7c7579] shadow-[0_2px_5px_rgba(78,64,72,0.18)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#987fc5] lg:left-[-25px] lg:top-[50.3%] lg:size-12">
            <ChevronLeft aria-hidden="true" size={23} strokeWidth={1.6} />
          </button>

          <div id="story-cards" ref={trackRef} className="grid snap-x snap-mandatory grid-flow-col auto-cols-[calc(100%_-_1.5rem)] gap-4 overflow-x-auto scroll-smooth scroll-px-1 px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:auto-cols-[minmax(280px,46%)] sm:gap-5 lg:grid-flow-row lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0">
            {stories.map((story) => (
              <article key={story.title} className="group relative flex min-h-[550px] snap-start snap-always flex-col overflow-hidden rounded-lg border border-[#ef92aa] bg-white transition duration-200 hover:-translate-y-1 hover:shadow-[0_10px_22px_rgba(103,75,92,0.14)] lg:h-[764px] lg:min-h-0">
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
                <h3 className="font-fredoka text-[clamp(1.55rem,2.4vw,2rem)] font-medium leading-[1.18] text-[#9c81be] lg:text-4xl lg:leading-[1.3333]">{story.title}</h3>
                <div className="mt-5 grid grid-cols-2 gap-3 lg:mt-[29px] lg:gap-5">
                  <span className="flex h-14 items-center justify-center rounded-xl bg-[#9c81be] px-2 text-center text-sm font-medium text-white lg:text-lg">Ages 3-4</span>
                  <span className="flex h-14 items-center justify-center rounded-xl bg-[#e88da0] px-2 text-center text-sm font-medium text-white lg:text-lg">Adventure</span>
                </div>
                <p className="mt-5 text-base leading-[1.5] text-[#756e73] lg:mt-[29px] lg:text-2xl lg:leading-[1.375]">{story.description}</p>
              </div>
            </article>
          ))}
          </div>

          <button type="button" aria-label="Show next stories" aria-controls="story-cards" onClick={() => scrollStories("next")} className="absolute right-3 top-[30%] z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#d6d2d2] bg-white/95 text-[#7c7579] shadow-[0_2px_5px_rgba(78,64,72,0.18)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#987fc5] lg:right-[-25px] lg:top-[50.3%] lg:size-12">
            <ChevronRight aria-hidden="true" size={23} strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExploreStories;
