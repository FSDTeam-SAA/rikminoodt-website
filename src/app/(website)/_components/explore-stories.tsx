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

    track.scrollBy({
      left: (direction === "next" ? 1 : -1) * Math.max(track.clientWidth * 0.82, 280),
      behavior: "smooth",
    });
  };

  return (
    <section id="examples" aria-labelledby="stories-heading" className="bg-[#fff7ee] py-14 sm:py-16 lg:py-[48px]">
      <div className="container mx-auto px-5 sm:px-8 lg:px-0">
        <header className="text-center">
          <h2 id="stories-heading" className="font-serif text-[clamp(2rem,3.6vw,2.5rem)] font-semibold leading-tight tracking-[-0.025em] text-[#292528]">
            Explore Stories
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-[#5c5559] sm:text-[13px]">
            Discover magical adventures, exciting themes, and heartwarming stories created to make every child the hero.
          </p>
        </header>

        <div className="relative mt-8 lg:mt-9">
          <button type="button" aria-label="Show previous stories" aria-controls="story-cards" onClick={() => scrollStories("previous")} className="absolute left-[-25px] top-[48%] z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#d6d2d2] bg-white text-[#7c7579] shadow-[0_2px_5px_rgba(78,64,72,0.18)] transition hover:bg-[#f8f4f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#987fc5]">
            <ChevronLeft aria-hidden="true" size={23} strokeWidth={1.6} />
          </button>

          <div id="story-cards" ref={trackRef} className="grid snap-x snap-mandatory grid-flow-col auto-cols-[minmax(250px,82%)] gap-4 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:auto-cols-[minmax(280px,46%)] sm:gap-[15px] lg:grid-flow-row lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0">
            {stories.map((story, index) => (
              <article key={story.title} className="group relative flex min-h-[500px] snap-start flex-col overflow-hidden rounded-md border border-[#ef92aa] bg-white transition duration-200 hover:-translate-y-1 hover:shadow-[0_10px_22px_rgba(103,75,92,0.14)] lg:min-h-[543px]">
                <div className="relative mx-1 mt-1 overflow-hidden">
                <Image
                  src={story.image}
                  alt={`Cover of ${story.title}`}
                  width={396}
                  height={512}
                  sizes="(max-width: 639px) 72vw, (max-width: 1023px) 42vw, 285px"
                  className="h-[285px] w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.025] sm:h-[310px] lg:h-[328px]"
                />
                {index === 0 && <span className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-full bg-[#f27b38] text-sm font-bold text-white shadow-sm">R</span>}
              </div>
              <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
                <h3 className="font-poppins text-[clamp(1.35rem,2.4vw,1.75rem)] font-bold leading-[1.18] tracking-[-0.035em] text-[#987fc5]">{story.title}</h3>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <span className="rounded-xl bg-[#9d86c6] px-2 py-2 text-center text-sm font-medium text-white">Ages 3-4</span>
                  <span className="rounded-xl bg-[#e789a0] px-2 py-2 text-center text-sm font-medium text-white">Adventure</span>
                </div>
                <p className="mt-5 text-base leading-[1.5] text-[#756e73]">{story.description}</p>
              </div>
            </article>
          ))}
          </div>

          <button type="button" aria-label="Show next stories" aria-controls="story-cards" onClick={() => scrollStories("next")} className="absolute right-[-25px] top-[48%] z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#d6d2d2] bg-white text-[#7c7579] shadow-[0_2px_5px_rgba(78,64,72,0.18)] transition hover:bg-[#f8f4f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#987fc5]">
            <ChevronRight aria-hidden="true" size={23} strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ExploreStories;
