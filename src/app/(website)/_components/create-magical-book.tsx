import Image from "next/image";

const steps = [
  {
    image: "/images/book1.png",
    title: "Personalise the Characters",
    description: "Add your child’s name, age and photo. You can also include siblings, family members, friends or pets in the story.",
  },
  {
    image: "/images/book2.png",
    title: "Create Their Adventure",
    description: "Choose the story theme, occasion and illustration style, then add personal details that match your child’s interests.",
  },
  {
    image: "/images/book3.png",
    title: "Pay & Receive the Book",
    description: "Preview the story, select a digital or hardcover format, complete the payment and receive the personalised book.",
  },
];

const CreateMagicalBook = () => {
  return (
    <section id="create-your-book" aria-labelledby="create-book-heading" className=" py-14 sm:py-16 lg:mb-32 lg:pb-[10px] lg:pt-0">
      <div className="container mx-auto px-5 sm:px-8 lg:px-0">
        <header className="text-center">
          <h2 id="create-book-heading" className="font-crimson text-[clamp(2.25rem,3.35vw,3rem)] font-semibold leading-[1.05] tracking-[-0.025em] text-[#292528]">
            Create Magical Book in 3 Easy Steps
          </h2>
          <p className="mx-auto mt-2 max-w-4xl text-sm leading-relaxed text-[#5c5559] sm:text-base lg:text-lg">
            Bring your child&apos;s imagination to life by personalising the characters, creating their adventure, and receiving a storybook made just for them.
          </p>
        </header>

        <ol className="mt-9 grid gap-5 sm:grid-cols-3 sm:gap-8 lg:mx-2.5 lg:mt-[58px] lg:gap-12">
          {steps.map((step) => (
            <li key={step.title}>
              <article className="group flex h-full min-h-[300px] flex-col items-center rounded-2xl bg-white px-5 pb-5 pt-5 text-center shadow-[0_3px_8px_rgba(92,76,84,0.18)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_9px_18px_rgba(92,76,84,0.18)] sm:px-4 lg:h-[402px] lg:min-h-0 lg:px-6">
                <Image src={step.image} alt="" width={300} height={224} className="h-[180px] w-auto max-w-full object-contain transition-transform duration-200 group-hover:scale-105 sm:h-[190px] lg:h-[224px]" />
                <h3 className="mt-3 font-crimson text-xl font-semibold leading-tight text-[#82330d] lg:text-2xl">{step.title}</h3>
                <p className="mt-2 max-w-[330px] text-sm leading-[1.36] text-[#595257] lg:text-base">{step.description}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default CreateMagicalBook;
