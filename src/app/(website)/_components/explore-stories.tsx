"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CornerDownRight } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

const labels = {
  en: {
    photos: "Photos used",
    choices: "Story Choices",
    title: "Title",
    theme: "Theme",
    subject: "Subject",
    characters: "Number of characters",
    seasons: "Seasons",
    autumn: "Autumn adventures",
    view: "View Example",
    viewAll: "View Examples",
    create: "Create Your Own Children's Book",
    child: "Child playing with building blocks",
    grandmother: "Grandmother in a garden",
  },
  nl: {
    photos: "Gebruikte foto's",
    choices: "Verhaalkeuzes",
    title: "Titel",
    theme: "Thema",
    subject: "Onderwerp",
    characters: "Aantal personages",
    seasons: "Seizoenen",
    autumn: "Herfstavonturen",
    view: "Bekijk voorbeeld",
    viewAll: "Bekijk voorbeelden",
    create: "Maak je eigen kinderboek",
    child: "Kind speelt met blokken",
    grandmother: "Oma in een tuin",
  },
  fr: {
    photos: "Photos utilisées",
    choices: "Choix de l'histoire",
    title: "Titre",
    theme: "Thème",
    subject: "Sujet",
    characters: "Nombre de personnages",
    seasons: "Saisons",
    autumn: "Aventures d'automne",
    view: "Voir l'exemple",
    viewAll: "Voir les exemples",
    create: "Créez votre livre pour enfants",
    child: "Enfant jouant avec des cubes",
    grandmother: "Grand-mère dans un jardin",
  },
};

const cardColors = ["bg-[#FFF0D9]", "bg-[#F1EAF8]", "bg-[#E7F3EC]", "bg-[#FFF0F2]", "bg-[#EAF2F8]"];

const ExploreStories = ({ showAll = false }: { showAll?: boolean }) => {
  const { t, language } = useLanguage();
  const copy = labels[language];
  const title = "Max Sees the Seasons: Autumn Adventures";

  return (
    <section id="examples" aria-labelledby="stories-heading" className="bg-[#FBF3EA] pb-6 pt-14 sm:pt-16 lg:mb-16 lg:py-0">
      <div className="container mx-auto px-5 sm:px-8 lg:px-0">
        <header className="text-center">
          <h2 id="stories-heading" className="font-crimson text-[48px] font-semibold leading-none text-[#1E1E1E]">
            {t.exploreStories.title}
          </h2>
          <p className="mx-auto mt-2 max-w-3xl text-center font-sans text-[18px] font-normal leading-normal text-[#444444]">
            {t.exploreStories.subheading}
          </p>
        </header>

        <div className="mt-8 space-y-6 lg:mt-12 lg:space-y-8">
          {cardColors.slice(0, showAll ? 5 : 3).map((color) => (
            <article key={color} className={`grid gap-5 rounded-[30px] p-5 sm:p-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-6 lg:p-10 ${color}`}>
              <div>
                <div className="rounded-[20px] bg-[#FFE8D7] p-3">
                  <h3 className="border-b border-dashed border-[#DCC6B8] pb-2 font-sans text-base font-bold text-[#292929]">{copy.photos}</h3>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Image src="/images/exp_u_1_1.png" alt={copy.child} width={654} height={357} sizes="(max-width: 1023px) 40vw, 140px" className="aspect-square w-full rounded-xl border-2 border-[#DDBB9F] object-cover" />
                    <Image src="/images/exp_u_1_2.jpg" alt={copy.grandmother} width={328} height={179} sizes="(max-width: 1023px) 40vw, 140px" className="aspect-square w-full rounded-xl border-2 border-[#DDBB9F] object-cover" />
                  </div>
                </div>
                <CornerDownRight aria-hidden="true" size={38} strokeWidth={1.8} className="ml-auto mr-3 mt-3 hidden text-[#FF782C] lg:block" />
              </div>

              <div className="mx-auto w-full max-w-[400px] rounded-[20px] bg-[#FFE8D7] p-4">
                <Image src="/images/exp_c_1.jpg" alt={`Cover: ${title}`} width={382} height={512} sizes="(max-width: 1023px) 80vw, 400px" className="h-auto w-full rounded-sm shadow-[0_8px_16px_rgba(67,46,34,0.2)]" />
              </div>

              <div className="space-y-3">
                <div className="rounded-[20px] bg-[#FFE8D7] p-6 font-sans text-[#292929]">
                  <h3 className="border-b border-dashed border-[#DCC6B8] pb-3 text-xl font-bold">{copy.choices}</h3>
                  <dl className="mt-3 space-y-2 text-base leading-relaxed">
                    <div><dt className="inline font-bold">{copy.title}: </dt><dd className="inline">{title}</dd></div>
                    <div><dt className="inline font-bold">{copy.theme}: </dt><dd className="inline">{copy.seasons}</dd></div>
                    <div><dt className="inline font-bold">{copy.subject}: </dt><dd className="inline">{copy.autumn}</dd></div>
                    <div><dt className="inline font-bold">{copy.characters}: </dt><dd className="inline">2</dd></div>
                  </dl>
                </div>
                <Link href="/story-books/book-details/max-sees-the-seasons" className="flex min-h-14 items-center gap-2 rounded-[20px] bg-[#FFE8D7] px-6 font-sans font-bold text-[#E65D00] transition-colors hover:bg-[#FFDDC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E65D00]">
                  {copy.view} <ArrowRight aria-hidden="true" size={19} />
                </Link>
                <Link href="/book-builder/choose-age" className="flex min-h-14 items-center gap-2 rounded-[20px] bg-[#FFE8D7] px-6 font-sans font-bold text-[#E65D00] transition-colors hover:bg-[#FFDDC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E65D00]">
                  {copy.create} <ArrowRight aria-hidden="true" size={19} />
                </Link>
              </div>
            </article>
          ))}
        </div>
        {!showAll && (
          <div className="mt-8 text-center lg:mt-10">
            <Link href="/examples" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#e88da0] px-7 font-sans text-lg font-semibold text-white transition-colors hover:bg-[#df7894] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf] focus-visible:ring-offset-2">
              {copy.viewAll} <ArrowRight aria-hidden="true" size={20} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ExploreStories;
