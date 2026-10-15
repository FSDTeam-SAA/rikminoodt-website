import Link from "next/link";

const CtaCreateBook = () => {
  return (
    <section className="pb-14 sm:pb-16" aria-labelledby="create-story-heading">
      <div className="container mx-auto px-5 sm:px-8 lg:px-0">
        <div className="rounded-xl bg-gradient-to-r from-[#FFD9D2] via-[#FFE3ED] to-[#F8D8FB] px-5 py-8 text-center sm:px-10 sm:py-10">
          <h2 id="create-story-heading" className="font-crimson text-[clamp(1.75rem,3vw,2.25rem)] font-semibold leading-none text-[#514256]">
            Create a Story Made Just for Your Child
          </h2>
          <p className="mx-auto mt-3 max-w-2xl font-sans text-sm leading-relaxed text-[#695E66] sm:text-base">
            Turn your child&apos;s name, photo, and imagination into a magical personalised storybook they&apos;ll treasure for years.
          </p>
          <Link href="/book-builder/choose-age" className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-[#E88DA0] px-5 font-sans text-base font-medium text-white transition-colors duration-300 hover:bg-[#DF7894] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf] focus-visible:ring-offset-2">
            Create Your Book
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaCreateBook;
