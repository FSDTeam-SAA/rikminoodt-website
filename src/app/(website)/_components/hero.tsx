import Link from "next/link";

const Hero = () => {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-[100svh] overflow-hidden bg-[#f8eee8] bg-[url('/images/hero.png')] bg-cover bg-[position:62%_center] sm:bg-[position:60%_center] lg:h-screen lg:bg-center"
    >
      <div className="container relative mx-auto w-full pt-28 sm:pt-32 lg:px-0 lg:pt-[196px]">
        <div className="max-w-[577px]">
          <h1
            id="hero-heading"
            className="font-fredoka text-[clamp(2.5rem,4.45vw,4rem)] font-medium leading-[1.2]"
          >
            <span className="block text-[#e0a94c]">Their Imagination.</span>
            <span className="block text-[#e88da0]">Their Adventure.</span>
            <span className="block text-[#9c81be]">Their Story.</span>
          </h1>

          <p className="mt-6 max-w-[539px] text-base font-medium leading-[1.38] text-[#444] sm:text-lg">
            Create a one-of-a-kind storybook where your child becomes the main
            character in a world made just for them, fully personalised.
          </p>

          <Link
            href="#create-your-book"
            className="mt-6 inline-flex h-14 items-center justify-center rounded-2xl bg-[#e88da0] px-4 text-xl font-medium text-white shadow-[0_8px_18px_rgba(213,113,143,0.24)] transition hover:-translate-y-0.5 hover:bg-[#df7894] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf] focus-visible:ring-offset-2"
          >
            Create Your Book
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
