import Image from "next/image";
import Link from "next/link";

const TurningLittleImaginations = () => {
  return (
    <section aria-labelledby="imaginations-heading" className="relative overflow-hidden bg-[#fff7ee] pb-0 pt-16 sm:pt-20 lg:pt-[92px]">
      <Image
        src="/images/cloud.png"
        alt=""
        width={154}
        height={98}
        className="pointer-events-none absolute left-0 top-6 z-10 h-auto w-[105px] sm:top-9 sm:w-[126px]"
      />

      <div className="relative bg-[#fff0f1]">
        <Image
          src="/images/book.png"
          alt=""
          width={187}
          height={126}
          className="pointer-events-none absolute -bottom-3 -right-9 hidden h-auto w-[150px] lg:block"
        />

        <div className="container mx-auto grid items-center gap-8 px-5 py-12 sm:px-8 md:grid-cols-2 md:gap-10 md:py-14 lg:min-h-[418px] lg:px-0 lg:py-10">
          <div className="flex justify-center md:justify-start">
            <Image
              src="/images/turning_little_image.png"
              alt="A child imagining a magical world emerging from an open book"
              width={582}
              height={508}
              sizes="(max-width: 767px) 90vw, (max-width: 1023px) 46vw, 470px"
              className="h-auto w-full max-w-[440px] md:max-w-[465px]"
            />
          </div>

          <div className="relative z-10 pb-2 md:pb-0">
            <h2 id="imaginations-heading" className="font-poppins text-[clamp(1.8rem,3.1vw,2.35rem)] font-bold leading-[1.28] tracking-[-0.035em] text-[#514256]">
              Turning Little Imaginations into Unforgettable Stories
            </h2>
            <p className="mt-5 max-w-[455px] text-[13px] leading-[1.38] text-[#695e66] sm:text-sm">
              At Bookerello, we believe every child deserves to become the hero of their own adventure. Our platform helps families create personalised storybooks by choosing themes, adding multiple characters, celebrating special occasions and including meaningful personal details. Each book is thoughtfully created to make reading more exciting, personal and memorable.
            </p>
            <Link
              href="#how-it-works"
              className="mt-5 inline-flex min-h-10 items-center justify-center rounded-xl bg-[#e88da5] px-4 py-2 text-sm font-medium text-white shadow-[0_6px_14px_rgba(213,113,143,0.2)] transition hover:-translate-y-0.5 hover:bg-[#df7894] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fff0f1]"
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
