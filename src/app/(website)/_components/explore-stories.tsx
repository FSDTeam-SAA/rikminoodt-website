"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CornerDownRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getApiBaseUrl } from "@/config/api";
import { useLanguage } from "@/components/providers/LanguageProvider";

const labels = {
  en: { photos: "Photos used", choices: "Story Choices", title: "Title", theme: "Theme", subject: "Subject", characters: "Number of characters", view: "View Example", viewAll: "View Examples", create: "Create Your Own Children's Book" },
  nl: { photos: "Gebruikte foto's", choices: "Verhaalkeuzes", title: "Titel", theme: "Thema", subject: "Onderwerp", characters: "Aantal personages", view: "Bekijk voorbeeld", viewAll: "Bekijk voorbeelden", create: "Maak je eigen kinderboek" },
  fr: { photos: "Photos utilisées", choices: "Choix de l'histoire", title: "Titre", theme: "Thème", subject: "Sujet", characters: "Nombre de personnages", view: "Voir l'exemple", viewAll: "Voir les exemples", create: "Créez votre livre pour enfants" },
};

type ShowcaseCharacter = { photoUrl?: string };
type ShowcaseBook = {
  _id: string;
  title?: string;
  coverImageUrl?: string;
  theme?: string;
  subject?: string;
  specialMessage?: string;
  characters?: ShowcaseCharacter[];
};

const cardColors = ["bg-[#FFF0D9]", "bg-[#F1EAF8]", "bg-[#E7F3EC]", "bg-[#FFF0F2]", "bg-[#EAF2F8]"];
const coverTextStyles = [
  { title: "font-crimson italic tracking-wide", subtitle: "font-sans uppercase tracking-[0.22em]" },
  { title: "font-sans uppercase tracking-[0.04em]", subtitle: "font-crimson italic tracking-wide" },
  { title: "font-crimson tracking-[0.02em]", subtitle: "font-sans uppercase tracking-[0.16em]" },
] as const;

const displayValue = (value?: string) => value ? value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "—";

const splitTitle = (title: string) => {
  const words = title.split(/\s+/).filter(Boolean);
  const halfway = Math.ceil(words.length / 2);
  return [words.slice(0, halfway).join(" "), words.slice(halfway).join(" ")];
};

const ExploreStories = ({ showAll = false, className = "" }: { showAll?: boolean; className?: string }) => {
  const { t, language } = useLanguage();
  const copy = labels[language];
  const [books, setBooks] = useState<ShowcaseBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const loadShowcaseBooks = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/books/showcase`, { signal: controller.signal, cache: "no-store" });
        const payload = await response.json().catch(() => null);
        if (!response.ok) throw new Error(payload?.message || "Unable to load showcase books");
        if (!controller.signal.aborted) {
          const data = payload?.data;
          setBooks(Array.isArray(data) ? data : data?.books ?? []);
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError" && !controller.signal.aborted) setBooks([]);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };
    void loadShowcaseBooks();
    return () => controller.abort();
  }, []);

  const visibleBooks = showAll ? books : books.slice(0, 3);

  return (
    <section id="examples" aria-labelledby="stories-heading" className={`bg-[#FBF3EA] pb-14 sm:pb-16 lg:pb-20 ${className || "pt-14 sm:pt-16 lg:pt-20"}`}>
      <div className="container mx-auto px-5 sm:px-8 lg:px-0">
        <header className="text-center">
          <h2 id="stories-heading" className="font-crimson text-[48px] font-semibold leading-none text-[#1E1E1E]">{t.exploreStories.title}</h2>
          <p className="mx-auto mt-2 max-w-3xl text-center font-sans text-[18px] font-normal leading-normal text-[#444444]">{t.exploreStories.subheading}</p>
        </header>
        {isLoading ? (
          <div className="mt-12 flex min-h-[260px] items-center justify-center" role="status"><Loader2 size={32} className="animate-spin text-[#E88DA0]" aria-hidden="true" /><span className="sr-only">Loading stories</span></div>
        ) : (
          <div className="mt-8 space-y-6 lg:mt-12 lg:space-y-8">
            {visibleBooks.map((book, index) => {
              const title = book.title || "A Magical Adventure";
              const titleLines = splitTitle(title);
              const coverTextStyle = coverTextStyles[index % coverTextStyles.length];
              const photos = book.characters?.filter((character) => character.photoUrl) ?? [];
              const photoCards = photos.length ? photos : [{ photoUrl: "/images/profile.png" }];
              return (
                <article key={book._id} className={`grid gap-5 rounded-[30px] p-5 sm:p-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-6 lg:p-10 ${cardColors[index % cardColors.length]}`}>
                  <div>
                    <div className="rounded-[20px] bg-[#FFE8D7] p-3">
                      <h3 className="border-b border-dashed border-[#DCC6B8] pb-2 font-sans text-base font-bold text-[#292929]">{copy.photos}</h3>
                      <div className={`mt-3 grid gap-2 ${photoCards.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                        {photoCards.map((photo, photoIndex) => <Image key={`${photo.photoUrl}-${photoIndex}`} src={photo.photoUrl || "/images/profile.png"} alt={`${title} photo reference ${photoIndex + 1}`} width={photoCards.length === 1 ? 1254 : 654} height={photoCards.length === 1 ? 1254 : 357} sizes="(max-width: 1023px) 40vw, 140px" className={`h-28 w-full rounded-xl border-2 border-[#DDBB9F] sm:h-32 lg:h-36 ${photoCards.length === 1 ? "bg-[#FFF8EF] object-contain p-1" : "object-cover"}`} />)}
                      </div>
                    </div>
                    <CornerDownRight aria-hidden="true" size={38} strokeWidth={1.8} className="ml-auto mr-3 mt-3 hidden text-[#FF782C] lg:block" />
                  </div>
                  <div className="mx-auto w-full max-w-[400px]">
                    <div className="relative isolate overflow-hidden rounded-sm shadow-[0_8px_16px_rgba(67,46,34,0.2)]">
                      <Image src={book.coverImageUrl || "/images/autumn-adventure-no-text.png"} alt={`${title} cover artwork`} width={382} height={512} sizes="(max-width: 1023px) 80vw, 400px" className="aspect-[3/4] w-full object-cover" />
                      <div className="absolute inset-x-4 top-5 px-2 text-center text-white [text-shadow:0_2px_5px_rgba(44,27,20,0.95),0_0_2px_rgba(44,27,20,0.9)] sm:inset-x-6 sm:top-7">
                        {index % coverTextStyles.length === 0 ? <><span className="sr-only">{title}</span><div aria-hidden="true" className="font-crimson text-[28px] font-bold leading-[0.8] tracking-wide sm:text-[38px]"><span className="block -rotate-[3deg] [-webkit-text-stroke:1.5px_#4A2D2A]">{titleLines[0]}</span>{titleLines[1] && <span className="mt-2 block rotate-[2deg] [-webkit-text-stroke:1.5px_#4A2D2A]">{titleLines[1]}</span>}</div></> : <p className={`[-webkit-text-stroke:1px_#4A2D2A] text-xl font-bold leading-[0.95] sm:text-3xl ${coverTextStyle.title}`}>{title}</p>}
                        <p className={`[-webkit-text-stroke:0.5px_#4A2D2A] mt-2 text-[10px] font-bold leading-tight sm:text-xs ${coverTextStyle.subtitle}`}>{displayValue(book.specialMessage || book.theme)}</p>
                      </div>
                      <div className="absolute inset-x-0 bottom-4 flex justify-center px-6 sm:bottom-6"><Image src="/images/logo.png" alt="Bookerello" width={128} height={37} className="h-auto w-24 drop-shadow-[0_2px_3px_rgba(255,255,255,0.85)] sm:w-28" /></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-[20px] bg-[#FFE8D7] p-6 font-sans text-[#292929]">
                      <h3 className="border-b border-dashed border-[#DCC6B8] pb-3 text-xl font-bold">{copy.choices}</h3>
                      <dl className="mt-3 space-y-2 text-base leading-relaxed">
                        <div><dt className="inline font-bold">{copy.title}: </dt><dd className="inline">{title}</dd></div>
                        <div><dt className="inline font-bold">{copy.theme}: </dt><dd className="inline">{displayValue(book.theme)}</dd></div>
                        <div><dt className="inline font-bold">{copy.subject}: </dt><dd className="inline">{displayValue(book.subject)}</dd></div>
                        <div><dt className="inline font-bold">{copy.characters}: </dt><dd className="inline">{book.characters?.length ?? 0}</dd></div>
                      </dl>
                    </div>
                    <Link href={`/story-books/book-details/${book._id}`} className="flex min-h-14 items-center gap-2 rounded-[20px] bg-[#FFE8D7] px-6 font-sans font-bold text-[#E65D00] transition-colors hover:bg-[#FFDDC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E65D00]">{copy.view} <ArrowRight aria-hidden="true" size={19} /></Link>
                    <Link href="/book-builder/choose-age" className="flex min-h-14 items-center gap-2 rounded-[20px] bg-[#FFE8D7] px-6 font-sans font-bold text-[#E65D00] transition-colors hover:bg-[#FFDDC4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E65D00]">{copy.create} <ArrowRight aria-hidden="true" size={19} /></Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
        {!showAll && books.length > 3 && <div className="mt-8 text-center lg:mt-10"><Link href="/examples" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#e88da0] px-7 font-sans text-lg font-semibold text-white transition-colors hover:bg-[#df7894] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf] focus-visible:ring-offset-2">{copy.viewAll} <ArrowRight aria-hidden="true" size={20} /></Link></div>}
      </div>
    </section>
  );
};

export default ExploreStories;
