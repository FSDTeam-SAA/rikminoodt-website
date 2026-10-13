import Image from "next/image";
import Link from "next/link";

const TurningLittleImaginations = () => {
  return (
    <section
      id="how-it-works"
      aria-labelledby="imaginations-heading"
      className="relative overflow-hidden pb-0 pt-12 md:pt-20 lg:mb-32 lg:pb-3 lg:pt-24"
    >
      <Image
        src="/images/cloud.png"
        alt=""
        width={154}
        height={98}
        className="pointer-events-none absolute left-0 top-5 z-10 h-auto w-[105px] sm:top-8 sm:w-[126px] lg:w-[154px]"
      />

      <div className="relative bg-[#FFE8EC99]">
        <Image
          src="/images/book.png"
          alt=""
          width={187}
          height={126}
          className="pointer-events-none absolute -bottom-3 -right-9 hidden h-auto w-[187px] lg:block"
        />

        <div className="container mx-auto grid items-center gap-8 px-5 py-12 sm:px-8 md:grid-cols-2 md:gap-10 md:py-14 lg:min-h-[588px] lg:grid-cols-[minmax(0,594px)_minmax(0,1fr)] lg:gap-9 lg:px-0 lg:py-10">
          <div className="flex justify-center md:justify-start">
            <Image
              src="/images/turning_little_image.png"
              alt="A child imagining a magical world emerging from an open book"
              width={582}
              height={508}
              sizes="(max-width: 767px) 90vw, (max-width: 1023px) 46vw, 594px"
              className="h-auto w-full max-w-[440px] md:max-w-[500px] lg:max-w-[594px]"
            />
          </div>

          <div className="relative z-10 pb-2 md:pb-0">
            <h2
              id="imaginations-heading"
              className="font-crimson text-[48px] font-semibold leading-none text-[#1E1E1E]"
            >
              Turning Little Imaginations into Unforgettable Stories
            </h2>
            <p className="mt-5 max-w-[650px] text-left font-sans text-[18px] font-normal leading-normal text-[#444444]">
              At Bookerello, we believe every child deserves to become the hero
              of their own adventure. Our platform helps families create
              personalised storybooks by choosing themes, adding multiple
              characters, celebrating special occasions and including meaningful
              personal details. Each book is thoughtfully created to make
              reading more exciting, personal and memorable.
            </p>
            <Link
              href="#how-it-works"
              className="mt-5 inline-flex h-14 items-center justify-center rounded-2xl bg-[#e88da0] px-4 font-sans text-xl font-medium text-white shadow-[0_8px_18px_rgba(213,113,143,0.24)] transition hover:bg-[#df7894] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fff0f1]"
            >
              Discover How It Works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TurningLittleImaginations;
