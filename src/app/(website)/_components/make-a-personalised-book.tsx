"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const occasions = [
  { title: "Birthday", image: "/images/birthday.png", color: "bg-[#fbdce2]", textColor: "text-[#f27643]" },
  { title: "New Baby", image: "/images/new_baby.png", color: "bg-[#dcebfa]", textColor: "text-[#7c8d5a]" },
  { title: "Valentines day", image: "/images/valentines_day.png", color: "bg-[#fbf3c9]", textColor: "text-[#f0604f]" },
  { title: "Mothers day", image: "/images/mothers_day.png", color: "bg-[#e8d5fb]", textColor: "text-[#b55e43]" },
];

const MakeAPersonalisedBook = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollOccasions = (direction: "previous" | "next") => {
    const track = trackRef.current;
    if (!track) return;

    track.scrollBy({
      left: (direction === "next" ? 1 : -1) * Math.max(track.clientWidth * 0.8, 220),
      behavior: "smooth",
    });
  };

  return (
    <section id="occasions" aria-labelledby="occasions-heading" className="bg-[#fff7ee] py-14 sm:py-16 lg:py-[51px]">
      <div className="container mx-auto px-5 sm:px-8 lg:px-0">
        <header className="text-center">
          <h2 id="occasions-heading" className="font-serif text-[clamp(2rem,3.5vw,2.5rem)] font-semibold leading-tight tracking-[-0.025em] text-[#292528]">
            Make a personalised book for a specific Event
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-[#5c5559] sm:text-[13px]">
            Discover powerful features that make every story more personal, engaging and memorable for your child.
          </p>
        </header>

        <div className="relative mt-8 lg:mt-9">
          <button
            type="button"
            aria-label="Show previous occasions"
            aria-controls="occasion-cards"
            onClick={() => scrollOccasions("previous")}
            className="absolute left-[-22px] top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#d6d2d2] bg-white text-[#7c7579] shadow-[0_2px_5px_rgba(78,64,72,0.18)] transition hover:bg-[#f8f4f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#987fc5] lg:left-[-25px]"
          >
            <ChevronLeft aria-hidden="true" size={23} strokeWidth={1.6} />
          </button>

          <div
            id="occasion-cards"
            ref={trackRef}
            className="grid snap-x snap-mandatory grid-flow-col auto-cols-[minmax(190px,78%)] gap-4 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:auto-cols-[minmax(205px,45%)] sm:gap-[18px] lg:grid-flow-row lg:grid-cols-4 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {occasions.map((occasion) => (
              <Link
                key={occasion.title}
                href={`#${occasion.title.toLowerCase().replaceAll(" ", "-")}`}
                className={`group flex min-h-[218px] snap-start flex-col rounded-xl p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-[0_10px_22px_rgba(103,75,92,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#987fc5] focus-visible:ring-offset-3 lg:min-h-[222px] ${occasion.color}`}
              >
                <div className="flex flex-1 items-center justify-center rounded-lg bg-white/80 px-4 py-3">
                  <Image
                    src={occasion.image}
                    alt=""
                    width={180}
                    height={180}
                    sizes="(max-width: 639px) 60vw, (max-width: 1023px) 32vw, 160px"
                    className="max-h-[122px] w-auto max-w-full object-contain transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
                <span className={`pt-3 text-center font-poppins text-base font-semibold leading-none sm:text-[17px] ${occasion.textColor}`}>
                  {occasion.title}
                </span>
              </Link>
            ))}
          </div>

          <button
            type="button"
            aria-label="Show next occasions"
            aria-controls="occasion-cards"
            onClick={() => scrollOccasions("next")}
            className="absolute right-[-22px] top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#d6d2d2] bg-white text-[#7c7579] shadow-[0_2px_5px_rgba(78,64,72,0.18)] transition hover:bg-[#f8f4f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#987fc5] lg:right-[-25px]"
          >
            <ChevronRight aria-hidden="true" size={23} strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default MakeAPersonalisedBook;
