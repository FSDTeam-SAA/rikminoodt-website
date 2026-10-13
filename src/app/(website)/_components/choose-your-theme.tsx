import Image from "next/image";
import Link from "next/link";

const themes = [
  { title: "Fairy Tales", image: "fairy_tales.png", color: "bg-[#ffe5d3]" },
  { title: "Adventure", image: "adventure.png", color: "bg-[#dceffc]" },
  { title: "Activities", image: "activities.png", color: "bg-[#fbdde1]" },
  { title: "Worlds", image: "worlds.png", color: "bg-[#d2e8db]" },
  { title: "Holidays", image: "holidays.png", color: "bg-[#d2e8db]" },
  { title: "Family", image: "family.png", color: "bg-[#fbdde1]" },
  { title: "Educational", image: "educational.png", color: "bg-[#ffe5d3]" },
  { title: "Feelings", image: "feelings.png", color: "bg-[#dceffc]" },
];

const ChooseYourTheme = () => {
  return (
    <section id="story-books" aria-labelledby="themes-heading" className="py-14 sm:py-16 lg:mb-32 lg:pb-[10px] lg:pt-14">
      <div className="container mx-auto px-5 sm:px-8 lg:max-w-[1248px] lg:px-0">
        <header className="text-center">
          <h2 id="themes-heading" className="font-crimson text-[48px] font-semibold leading-none text-[#1E1E1E]">
            Choose Your Theme
          </h2>
          <p className="mx-auto mt-2 max-w-3xl text-center text-[18px] font-normal leading-normal text-[#444444]">
            Choose a theme that matches your child&apos;s interests, imagination, and favorite adventures.
          </p>
        </header>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-10 sm:gap-6 lg:mt-12 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
          {themes.map((theme) => (
            <Link
              key={theme.title}
              href={`#${theme.title.toLowerCase().replaceAll(" ", "-")}`}
              className={`group flex min-h-[220px] flex-col items-center justify-between rounded-2xl px-3 pb-4 pt-4 text-center shadow-sm transition duration-200 hover:shadow-[0_10px_22px_rgba(103,75,92,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#987fc5] focus-visible:ring-offset-4 sm:min-h-[286px] sm:px-4 sm:pb-5 sm:pt-5 lg:h-[330px] lg:min-h-0 lg:rounded-2xl lg:p-4 ${theme.color}`}
            >
              <div className="relative flex flex-1 items-center justify-center self-stretch">
                <Image
                  src={`/images/choose_your-theme/${theme.image}`}
                  alt=""
                  width={260}
                  height={260}
                  sizes="(max-width: 639px) 42vw, (max-width: 1023px) 21vw, 205px"
                  className="max-h-[150px] w-auto max-w-full object-contain transition-transform duration-200 group-hover:scale-105 sm:max-h-[210px] lg:max-h-[238px]"
                />
              </div>
              <span className="mt-2 text-center font-sans text-lg font-semibold leading-none text-[#1E1E1E] sm:text-[26px] lg:text-[32px]">
                {theme.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChooseYourTheme;
