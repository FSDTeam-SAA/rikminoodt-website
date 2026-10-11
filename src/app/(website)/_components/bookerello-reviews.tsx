import Image from "next/image";
import { Star } from "lucide-react";

const reviews = [
  "bg-[#f8dfe0]",
  "bg-[#dceef3]",
  "bg-[#fff0c8]",
  "bg-[#e8ddf2]",
  "bg-[#fff0c8]",
  "bg-[#dceef3]",
  "bg-[#f8dfe0]",
  "bg-[#e2f1e4]",
];

const BookerelloReviews = () => {
  return (
    <section
      aria-labelledby="reviews-heading"
      className=" py-14 sm:py-16 lg:mb-32 lg:pb-[25px] lg:pt-0"
    >
      <div className="container mx-auto px-5 sm:px-8 lg:px-0">
        <header className="text-center">
          <h2
            id="reviews-heading"
            className="font-crimson text-[clamp(2.25rem,3.35vw,3rem)] font-semibold leading-[1.05] tracking-[-0.025em] text-[#292528]"
          >
            Bookerello Reviews - Happy faces
          </h2>
          <p className="mx-auto mt-2 max-w-4xl text-sm leading-relaxed text-[#5c5559] sm:text-base lg:text-lg">
            Over 24,522 personalised stories created. Every book is a new
            adventure, a bigger smile and a memory to treasure forever.
          </p>
          <div
            className="mt-2 flex items-center justify-center gap-2"
            aria-label="Rated 4.8 out of 5 from 1,700 plus reviews"
          >
            <span className="flex gap-1 text-[#f6aa16]" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={18}
                  fill="currentColor"
                  strokeWidth={0}
                />
              ))}
            </span>
            <span className="text-xs text-[#607cb2] lg:text-sm">
              4.8/5 from 1,700+ reviews
            </span>
          </div>
        </header>

        <div className="mx-auto mt-8 grid gap-5 sm:grid-cols-2 lg:mt-12 xl:grid-cols-4 xl:gap-x-3 xl:gap-y-8">
          {reviews.map((color, index) => (
            <article
              key={index}
              className={`relative overflow-hidden rounded-sm p-5 shadow-[0_1px_2px_rgba(92,76,84,0.08)]  sm:p-6 xl:h-[289px] xl:min-h-0 xl:px-[15px] xl:pb-4 xl:pt-[12px] ${index % 2 === 1 ? "xl:translate-y-5" : ""} ${color}`}
            >
              {/* after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-3 after:bg-[radial-gradient(circle_at_9px_0,#fbf3ea_0_8px,transparent_8.5px)] after:bg-[length:18px_12px] */}
              <div className="relative overflow-hidden rounded-sm">
                <Image
                  src="/images/book_reveiew.jpg"
                  alt="A child enjoying a personalised storybook"
                  width={510}
                  height={292}
                  className="aspect-[1.747] w-full object-cover xl:aspect-auto xl:h-[141px]"
                />
                <span className="absolute bottom-2 right-2 flex h-16 w-[182px] flex-col items-center justify-center rounded-2xl border border-[#efafda] bg-white/90 px-3 text-center shadow-sm xl:bottom-1 xl:right-1 xl:h-10 xl:w-[108px] xl:rounded-lg xl:px-1">
                  <strong className="text-base leading-tight text-[#ed3a98] xl:text-[9px]">
                    Emma&apos;s
                  </strong>
                  <strong className="mt-1 text-xs leading-tight text-[#7427d7] xl:mt-0.5 xl:text-[8px]">
                    Magical Adventure
                  </strong>
                </span>
              </div>

              <div className="mt-6 flex items-center gap-3 xl:mt-1 xl:gap-2">
                <Image
                  src="/images/book_customer.jpg"
                  alt="Sarah Mitchell"
                  width={56}
                  height={56}
                  className="size-11 rounded-full border-2 border-[#eb9bad] object-cover xl:size-7 xl:border-0"
                />
                <span className="min-w-0 flex-1 truncate text-[clamp(1.25rem,2.25vw,2rem)] font-medium leading-none text-[#262224] xl:text-base xl:text-[#3f3a3e]">
                  Sarah Mitchell
                </span>
                <span
                  className="flex shrink-0 gap-0.5 text-[#ffb30e] xl:text-[#f6aa16]"
                  aria-label="5 out of 5 stars"
                >
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      size={18}
                      fill="currentColor"
                      strokeWidth={0}
                      className="xl:size-3"
                    />
                  ))}
                </span>
              </div>
              <p className="ml-14 mt-1 text-base text-[#05a875] xl:ml-9 xl:mt-0.5 xl:text-xs xl:text-[#23a174]">
                ✓ Verified Customer
              </p>
              <p className="mt-5 text-[clamp(1.1rem,2.05vw,1.8rem)] leading-[1.35] text-[#31445d] xl:mt-2 xl:text-sm xl:text-[#4e4950]">
                “My daughter absolutely loves this book! She asks to read it
                every night before bed.”
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookerelloReviews;
