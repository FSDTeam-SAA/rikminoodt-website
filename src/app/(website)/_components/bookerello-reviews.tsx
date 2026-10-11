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
    <section aria-labelledby="reviews-heading" className="bg-[#fff7ee] py-14 sm:py-16 lg:py-[76px]">
      <div className="container mx-auto px-5 sm:px-8 lg:px-0">
        <header className="text-center">
          <h2 id="reviews-heading" className="font-serif text-[clamp(2rem,3.6vw,2.45rem)] font-semibold leading-tight tracking-[-0.025em] text-[#292528]">
            Bookerello Reviews - Happy faces
          </h2>
          <p className="mx-auto mt-2 max-w-3xl text-xs leading-relaxed text-[#5c5559] sm:text-[13px]">
            Over 24,522 personalised stories created. Every book is a new adventure, a bigger smile and a memory to treasure forever.
          </p>
          <div className="mt-1.5 flex items-center justify-center gap-2" aria-label="Rated 4.8 out of 5 from 1,700 plus reviews">
            <span className="flex gap-1 text-[#f6aa16]" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={13} fill="currentColor" strokeWidth={0} />)}
            </span>
            <span className="text-[11px] text-[#607cb2]">4.8/5 from 1,700+ reviews</span>
          </div>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-9 lg:grid-cols-4 lg:gap-[17px]">
          {reviews.map((color, index) => (
            <article key={index} className={`relative overflow-hidden rounded-sm px-2.5 pb-4 pt-2.5 shadow-[0_1px_2px_rgba(92,76,84,0.08)] ${color}`}>
              <div className="relative overflow-hidden rounded-sm">
                <Image src="/images/book_reveiew.jpg" alt="A child enjoying a personalised storybook" width={512} height={288} className="h-auto w-full object-cover" />
                <span className="absolute bottom-1.5 right-1.5 rounded bg-white/95 px-2 py-1 text-[7px] font-bold leading-tight text-[#d74caa] shadow-sm">
                  Emma&apos;s<br />Magical Adventure
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <Image src="/images/book_customer.jpg" alt="Sarah Mitchell" width={24} height={24} className="size-5 rounded-full object-cover" />
                <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-[#3f3a3e]">Sarah Mitchell</span>
                <span className="flex shrink-0 gap-0.5 text-[#f6aa16]" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, starIndex) => <Star key={starIndex} size={8} fill="currentColor" strokeWidth={0} />)}
                </span>
              </div>
              <p className="ml-7 mt-0.5 text-[8px] text-[#23a174]">✓ Verified Customer</p>
              <p className="mt-1.5 text-[10px] leading-[1.35] text-[#4e4950]">
                “My daughter absolutely loves this book! She asks to read it every night before bed.”
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookerelloReviews;
