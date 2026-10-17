"use client";

import Image from "next/image";
import { useLanguage } from "@/components/providers/LanguageProvider";

const StoryMagical = () => {
  const { t } = useLanguage();

  const features = [
    { title: t.howItWorksPage.feat1Title, description: t.howItWorksPage.feat1Desc, image: "fairy_tales.png", color: "bg-[#FFF2E4]" },
    { title: t.howItWorksPage.feat2Title, description: t.howItWorksPage.feat2Desc, image: "family.png", color: "bg-[#EEF9FF]" },
    { title: t.howItWorksPage.feat3Title, description: t.howItWorksPage.feat3Desc, image: "worlds.png", color: "bg-[#F5F0FF]" },
    { title: t.howItWorksPage.feat4Title, description: t.howItWorksPage.feat4Desc, image: "feelings.png", color: "bg-[#F3FCEE]" },
    { title: t.howItWorksPage.feat5Title, description: t.howItWorksPage.feat5Desc, image: "activities.png", color: "bg-[#FFF1F3]" },
    { title: t.howItWorksPage.feat6Title, description: t.howItWorksPage.feat6Desc, image: "educational.png", color: "bg-[#FFF9ED]" },
  ];

  return (
    <section className="pb-16 sm:pb-20" aria-labelledby="story-magical-heading">
      <div className="container mx-auto px-5 sm:px-8 lg:px-0">
        <div className="rounded-2xl bg-white px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
          <header className="mx-auto max-w-3xl text-center">
            <h2 id="story-magical-heading" className="font-crimson text-[clamp(2rem,3.5vw,3rem)] font-semibold leading-none text-[#1E1E1E]">
              {t.howItWorksPage.featuresTitle}
            </h2>
            <p className="mt-3 font-sans text-[18px] leading-normal text-[#444444]">
              {t.howItWorksPage.featuresSubheading}
            </p>
          </header>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className={`flex min-h-[250px] flex-col items-center rounded-xl px-5 py-5 text-center ${feature.color}`}>
                <Image src={`/images/choose_your-theme/${feature.image}`} alt="" width={170} height={150} className="h-[132px] w-auto object-contain sm:h-[145px]" />
                <h3 className="mt-3 font-crimson text-xl font-semibold leading-none text-[#514256]">{feature.title}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-[#5C5559]">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoryMagical;
