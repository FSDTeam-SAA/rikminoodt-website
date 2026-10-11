import Link from "next/link";

const Hero = () => {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-[600px] items-center overflow-hidden bg-[#f8eee8] bg-[url('/images/hero.png')] bg-cover bg-[position:62%_center] sm:min-h-[650px] sm:bg-[position:60%_center] lg:min-h-0 lg:h-[57.3vw] lg:max-h-[825px] lg:bg-center"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,249,246,0.97)_0%,rgba(255,248,245,0.87)_33%,rgba(255,248,245,0.18)_60%,rgba(255,248,245,0)_78%)] sm:bg-[linear-gradient(90deg,rgba(255,249,246,0.9)_0%,rgba(255,248,245,0.74)_36%,rgba(255,248,245,0.12)_63%,rgba(255,248,245,0)_82%)] lg:bg-[linear-gradient(90deg,rgba(255,250,247,0.55)_0%,rgba(255,250,247,0.2)_38%,rgba(255,250,247,0)_62%)]"
      />

      <div className="container mx-auto w-full pt-28 sm:pt-32 lg:pt-0">
        <div className="max-w-[600px]">
          <h1
            id="hero-heading"
            className="font-poppins text-[clamp(2.5rem,4.5vw,3.75rem)] font-bold leading-[1.2] tracking-[-0.045em]"
          >
            <span className="block text-[#e4ad3c]">Their Imagination.</span>
            <span className="block text-[#ed91a7]">Their Adventure.</span>
            <span className="block text-[#987fc5]">Their Story.</span>
          </h1>

          <p className="mt-5 max-w-[470px] text-sm leading-relaxed text-[#463c43] sm:text-[15px]">
            Create a one-of-a-kind storybook where your child becomes the main
            character in a world made just for them, fully personalised.
          </p>

          <Link
            href="#create-your-book"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#eb8fa6] px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_18px_rgba(213,113,143,0.24)] transition hover:-translate-y-0.5 hover:bg-[#df7894] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf] focus-visible:ring-offset-2"
          >
            Create Your Book
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
