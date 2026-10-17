"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBookBuilder } from "../../_components/BookBuilderProvider";

const ageGroups = [
  { label: "0-2 Years", image: "/images/age_1.png", color: "#FDE1CF" },
  { label: "3-5 Years", image: "/images/age_2.png", color: "#E3F3FC" },
  { label: "5-9 Years", image: "/images/age_3.png", color: "#FADDE0" },
  { label: "10+ Years", image: "/images/age_4.png", color: "#D7EEE1" },
  { label: "Adult", image: "/images/age_5.png", color: "#E2D7F3" },
];

export default function ChooseAgeCategory() {
  const router = useRouter();
  const { selectedAge, setSelectedAge } = useBookBuilder();

  return (
    <main className="min-h-screen bg-[#FEFAF4] px-4 pb-10 pt-[118px] sm:px-7 sm:pb-12 sm:pt-[136px] lg:px-[38px] lg:pb-20 lg:pt-[196px]">
      <section className="mx-auto max-w-[1280px]" aria-labelledby="create-story-heading">
        <h1
          id="create-story-heading"
          className="font-crimson text-4xl font-normal leading-none text-[#1E1E1E] sm:text-[48px]"
        >
          Create a Story as Unique as Your Child
        </h1>
        <p className="mt-5 max-w-[1120px] font-sans text-lg font-normal leading-[1.4] text-[#444444] sm:text-[24px]">
          Choose a theme, add their name and special details, and create a personalized eBook they&apos;ll love. Turn it into a beautiful hardcover keepsake to treasure forever.
        </p>

        <section className="mt-10 rounded-[19px] bg-[#FBF3EA] px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10" aria-labelledby="age-category-heading">
          <h2 id="age-category-heading" className="font-fredoka text-[26px] font-normal leading-none text-[#E88DA0] sm:text-[32px]">
            Build a Magical Story Just for Them
          </h2>
          <p className="mt-6 font-sans text-[26px] font-semibold leading-none text-[#1E1E1E] sm:text-[32px]">
            Choose the age category
          </p>

          <div className="mt-8 grid grid-cols-1 justify-items-center gap-4 min-[520px]:grid-cols-2 lg:grid-cols-5 lg:gap-4" role="radiogroup" aria-label="Choose the child age category">
            {ageGroups.map((age) => {
              const isSelected = selectedAge === age.label;

              return (
                <button
                  key={age.label}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => { setSelectedAge(age.label); router.push("/book-builder/choose-theme"); }}
                  className={`group flex h-[290px] w-full max-w-[230px] flex-col justify-between overflow-hidden rounded-[10px] border-2 pt-3 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E88DA0] focus-visible:ring-offset-2 lg:w-[230px] ${
                    isSelected ? "border-[#E88DA0]" : "border-transparent hover:border-[#F4C2CE]"
                  }`}
                  style={{ backgroundColor: age.color }}
                >
                  <span aria-hidden="true" className="flex min-h-0 flex-1 items-end justify-center overflow-hidden px-2 transition-transform duration-200 group-hover:scale-[1.03]">
                    <Image
                      src={age.image}
                      alt=""
                      width={230}
                      height={230}
                      sizes="230px"
                      className="h-[218px] w-[214px] object-contain object-bottom"
                    />
                  </span>
                  <span className="pb-4 font-sans text-[28px] font-semibold leading-none text-[#1E1E1E] sm:text-[32px]">{age.label}</span>
                </button>
              );
            })}
          </div>

        </section>
      </section>
    </main>
  );
}
