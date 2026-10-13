import Image from "next/image";

const steps = [
  {
    title: "Personalise the Characters",
    description:
      "Add your child's name, age and photo. You can also include siblings, family members, friends or pets in the story.",
    details: ["Enter your child's name", "Add their age", "Upload a clear photo", "Add siblings or family members", "Include friends and a favourite pet"],
    image: "/images/book1.png",
  },
  {
    title: "Create Their Adventure",
    description:
      "Choose the story theme, occasion and illustration style, then add personal details that match your child's interests.",
    details: ["Choose a story theme", "Select a special occasion", "Pick an illustration style", "Add your child's interests", "Include favourite activities"],
    image: "/images/book2.png",
  },
  {
    title: "Pay & Receive the Book",
    description:
      "Preview the story, select a digital or hardcover format, complete the payment and receive the personalised book.",
    details: ["Preview the complete story", "Choose digital or hardcover", "Confirm your book details", "Complete secure payment", "Receive your personalised book"],
    image: "/images/book3.png",
  },
];

const ThreeEasySteps = () => {
  return (
    <section className="py-14 sm:py-16 lg:py-20" aria-labelledby="easy-steps-heading">
      <div className="container mx-auto px-5 sm:px-8 lg:px-0">
        <header className="mx-auto max-w-4xl text-center">
          <h1 id="easy-steps-heading" className="font-crimson text-[clamp(2.25rem,4vw,3rem)] font-semibold leading-none text-[#1E1E1E]">
            Create Magical Book in 3 Easy Steps
          </h1>
          <p className="mt-3 font-sans text-[18px] leading-normal text-[#444444]">
            Bring your child&apos;s imagination to life by personalising the characters, creating their adventure, and receiving a storybook made just for them.
          </p>
        </header>

        <ol className="mt-9 space-y-4 sm:mt-12 sm:space-y-6">
          {steps.map((step, index) => {
            const imageFirst = index === 1;

            return (
              <li key={step.title} className="relative">
                <article className="relative z-10 grid overflow-hidden rounded-2xl bg-white px-5 py-7 shadow-[0_5px_18px_rgba(92,76,84,0.06)] sm:px-8 sm:py-8 md:grid-cols-2 md:items-center md:gap-10 lg:min-h-[260px] lg:px-12">
                  <div className={imageFirst ? "md:order-2" : ""}>
                    <h2 className="font-crimson text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-none text-[#82330D]">{step.title}</h2>
                    <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-[#514A4E] sm:text-base">{step.description}</p>
                    <ul className="mt-4 space-y-2 font-sans text-sm text-[#3F393D] sm:text-base">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex gap-2">
                          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-[#82330D]" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={`relative mt-7 flex min-h-[180px] items-center justify-center md:mt-0 ${imageFirst ? "md:order-1" : ""}`}>
                    <span aria-hidden="true" className="absolute size-[158px] rounded-full border-2 border-[#FF7A18] sm:size-[185px]" />
                    <Image src={step.image} alt="" width={272} height={224} className="relative z-10 h-auto max-h-[205px] w-auto max-w-full object-contain" />
                  </div>
                </article>
                {index === 0 && (
                  <Image
                    src="/images/cloud.png"
                    alt=""
                    width={154}
                    height={98}
                    className="pointer-events-none absolute -bottom-9 -right-18 z-20 h-auto w-[155px] sm:-bottom-12 sm:-right-20 sm:w-[205px]"
                  />
                )}
                {index === 1 && (
                  <Image
                    src="/images/parasut.png"
                    alt=""
                    width={1145}
                    height={1374}
                    className="pointer-events-none absolute -bottom-10 -left-8 z-20 h-auto w-[82px] sm:-bottom-12 sm:-left-12 sm:w-[110px] lg:w-[125px]"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default ThreeEasySteps;
