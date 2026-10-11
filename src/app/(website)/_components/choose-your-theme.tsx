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
    <section id="story-books" aria-labelledby="themes-heading" className="bg-[#fff7ee] py-14 sm:py-16 lg:py-10 xl:py-11">
      <div className="container mx-auto px-5 sm:px-8 lg:px-0">
        <header className="text-center">
          <h2 id="themes-heading" className="font-serif text-[clamp(2rem,3.5vw,2.5rem)] font-semibold leading-tight tracking-[-0.025em] text-[#292528]">
            Choose Your Theme
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-[#5c5559] sm:text-[13px]">
            Choose a theme that matches your child&apos;s interests, imagination, and favorite adventures.
          </p>
        </header>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-9 sm:gap-[18px] lg:grid-cols-4">
          {themes.map((theme) => (
            <Link
              key={theme.title}
              href={`#${theme.title.toLowerCase().replaceAll(" ", "-")}`}
              className={`group flex aspect-[0.89] min-h-[178px] flex-col items-center justify-between rounded-xl px-3 pb-4 pt-4 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-[0_10px_22px_rgba(103,75,92,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#987fc5] focus-visible:ring-offset-4 sm:rounded-[11px] sm:px-4 sm:pb-3 sm:pt-4 ${theme.color}`}
            >
              <div className="relative flex flex-1 items-center justify-center self-stretch">
                <Image
                  src={`/images/choose_your-theme/${theme.image}`}
                  alt=""
                  width={260}
                  height={260}
                  sizes="(max-width: 639px) 42vw, (max-width: 1023px) 21vw, 205px"
                  className="max-h-[118px] w-auto max-w-full object-contain transition-transform duration-200 group-hover:scale-105 sm:max-h-[142px] lg:max-h-[154px]"
                />
              </div>
              <span className="mt-2 font-poppins text-lg font-medium leading-none text-[#252226] sm:text-[22px]">
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
