import Image from "next/image";

const themes = [
  { title: "Fairy Tales", image: "fairy_tales.png", color: "bg-[#FFE6D6]" },
  { title: "Adventure", image: "adventure.png", color: "bg-[#E1F1FF]" },
  { title: "Activities", image: "activities.png", color: "bg-[#FADDE1]" },
  { title: "Worlds", image: "worlds.png", color: "bg-[#D7EDDE]" },
  { title: "Holidays", image: "holidays.png", color: "bg-[#D7EDDE]" },
  { title: "Family", image: "family.png", color: "bg-[#FADDE1]" },
  { title: "Educational", image: "educational.png", color: "bg-[#FFE9D9]" },
  { title: "Feelings", image: "feelings.png", color: "bg-[#E1F1FF]" },
];

const ChooseTheme = () => {
  return (
    <section id="story-books" aria-labelledby="choose-theme-heading" className="pb-16 pt-2 sm:pb-20 lg:pb-24">
      <div className="container mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-0">
        <header className="text-center">
          <h2 id="choose-theme-heading" className="font-crimson text-[48px] font-semibold leading-none text-[#1E1E1E]">
            Choose Your Theme
          </h2>
          <p className="mx-auto mt-2 max-w-3xl font-sans text-[18px] font-normal leading-normal text-[#444444]">
            Choose a theme that matches your child&apos;s interests, imagination, and favourite adventures.
          </p>
        </header>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:mt-10 lg:gap-5">
          {themes.map((theme) => (
            <article key={theme.title} className={`group flex min-h-[174px] flex-col items-center justify-between rounded-xl px-3 pb-4 pt-3 text-center transition-colors duration-300 hover:brightness-[0.97] sm:min-h-[195px] sm:px-4 sm:pb-5 sm:pt-4 ${theme.color}`}>
              <Image
                src={`/images/choose_your-theme/${theme.image}`}
                alt=""
                width={150}
                height={132}
                className="h-[118px] w-auto max-w-full object-contain transition-transform duration-300 ease-out group-hover:scale-105 sm:h-[132px]"
              />
              <h3 className="mt-2 font-sans text-lg font-semibold leading-none text-[#1E1E1E] sm:text-xl">
                {theme.title}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChooseTheme;
