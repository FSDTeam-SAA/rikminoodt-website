"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import BookReaderModal from "./BookReaderModal";
import InlineBookPreview from "./InlineBookPreview";
import OrderHardcopyModal from "./OrderHardcopyModal";
import StoryDetailsSkeleton from "./StoryDetailsSkeleton";
import {
  BookOpen,
  Download,
  Images,
  Loader2,
  Pencil,
  Printer,
} from "lucide-react";
import { getApiBaseUrl } from "@/config/api";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { getExploreStoryWelcomeText, getExploreStory } from "@/lib/explore-stories-data";
import { ILLUSTRATION_MAP, MESSAGE_MAP, THEME_MAP } from "../../book-builder/_components/api-mappers";
import { ALL_SUBJECTS, getLocalizedSubjectLabel } from "../../book-builder/_components/subject-options";
import { useBookBuilderTranslations } from "../../book-builder/_components/useBookBuilderTranslations";

const detailLabels = {
  en: { headingStory: "Story", headingBooks: "Personalised Children's Books", details: "Story Details", title: "Title", ages: "Ages", years: "years", characters: "Characters", theme: "Theme", subject: "Subject", message: "Message", illustration: "Illustration", language: "Language", creator: "Creator", story: "Story", read: "Read Story", download: "Download PDF", generating: "Generating PDF…", hardcopy: "Order Hardcopy", photos: "Photos used", characterPhoto: "Character photo", characterPhotos: "Character photos", artwork: "Story artwork", illustrationRole: "Story illustration" },
  nl: { headingStory: "Verhaal", headingBooks: "Gepersonaliseerde Kinderboeken", details: "Verhaaldetails", title: "Titel", ages: "Leeftijden", years: "jaar", characters: "Personages", theme: "Thema", subject: "Onderwerp", message: "Boodschap", illustration: "Illustratie", language: "Taal", creator: "Maker", story: "Verhaal", read: "Lees verhaal", download: "Download PDF", generating: "PDF wordt gemaakt…", hardcopy: "Bestel hardcover", photos: "Gebruikte foto's", characterPhoto: "Personagefoto", characterPhotos: "Personagefoto's", artwork: "Verhaalillustratie", illustrationRole: "Verhaalillustratie" },
  fr: { headingStory: "Histoire", headingBooks: "Livres Personnalisés pour Enfants", details: "Détails de l'histoire", title: "Titre", ages: "Âges", years: "ans", characters: "Personnages", theme: "Thème", subject: "Sujet", message: "Message", illustration: "Illustration", language: "Langue", creator: "Créateur", story: "Histoire", read: "Lire l'histoire", download: "Télécharger le PDF", generating: "Création du PDF…", hardcopy: "Commander un livre relié", photos: "Photos utilisées", characterPhoto: "Photo de personnage", characterPhotos: "Photos de personnages", artwork: "Illustration de l'histoire", illustrationRole: "Illustration de l'histoire" },
} as const;

const staticDetailsByLang = {
  nl: {
    title: "Lisa's Kampeeravontuur",
    cover: "/images/story1.png",
    details: [
      ["Leeftijden", "3 - 5 jaar"],
      ["Personages", "4"],
      ["Thema", "Avontuur"],
      ["Illustratie", "Collage"],
      ["Taal", "Nederlands"],
    ],
    description:
      "Wanneer Lisa met haar gezin op de camping aankomt, denkt ze dat het buitenleven saai zal zijn. Maar al snel volgt er een spannend avontuur! Ze ontdekt nieuwe vrienden en samen trekken ze door een magisch bos om de bosdieren te helpen beschermen. Ga mee met Lisa op haar hartverwarmende avontuur en ontdek de magie van vriendschap.",
    editBook: "Boek bewerken",
  },
  en: {
    title: "Lisa's Camping Adventure",
    cover: "/images/story1.png",
    details: [
      ["Ages", "3 - 5 years"],
      ["Characters", "4"],
      ["Theme", "Adventure"],
      ["Illustration", "Collage"],
      ["Language", "English"],
    ],
    description:
      "When Lisa arrives at the camping ground with her family, she thinks the outdoor life will be boring. But an exciting adventure soon follows! She discovers new friends and they walk across a magical forest, make a big difference in protecting the home of forest creatures. Join Lisa on her heartwarming adventure as she discovers the magic of friendship by being a great friend to the world.",
    editBook: "Edit Book",
  },
  fr: {
    title: "L'aventure de camping de Lisa",
    cover: "/images/story1.png",
    details: [
      ["Âges", "3 - 5 ans"],
      ["Personnages", "4"],
      ["Thème", "Aventure"],
      ["Illustration", "Collage"],
      ["Langue", "Français"],
    ],
    description:
      "Lorsque Lisa arrive au camping avec sa famille, elle pense que la vie en plein air sera ennuyeuse. Mais une aventure palpitante l'attend très vite ! Elle rencontre de nouveaux amis et ensemble, ils traversent une forêt magique.",
    editBook: "Modifier le livre",
  },
};

const photos = [
  {
    name: "Our little camper!",
    role: "Main character",
    image: "/images/profile.png",
  },
  {
    name: "Brave explorer!",
    role: "Friend",
    image: "/images/book_customer.jpg",
  },
  { name: "Best friend!", role: "Pet friend", image: "/images/story3.png" },
  {
    name: "Happy traveller!",
    role: "Family",
    image: "/images/book_reveiew.jpg",
  },
];

const getChoiceLabel = (value: string, map: Record<string, string>) =>
  Object.entries(map).find(([, apiValue]) => apiValue === value)?.[0] || value;

const ageChoiceLabels: Record<string, string> = {
  "0-2": "0-2 Years",
  "3-5": "3-5 Years",
  "3-9": "5-9 Years",
  "5-9": "5-9 Years",
  "10+": "10+ Years",
};

const bookLanguageKeys: Record<string, "English" | "Dutch" | "French"> = {
  ENGLISH: "English",
  English: "English",
  ENGELS: "English",
  DUTCH: "Dutch",
  Dutch: "Dutch",
  NEDERLANDS: "Dutch",
  Nederlands: "Dutch",
  FRENCH: "French",
  French: "French",
  FRANÇAIS: "French",
  Français: "French",
};

interface StoryCharacter {
  name?: string;
  animalName?: string;
  objectName?: string;
  type?: string;
  photoUrl?: string;
}

interface FetchedBookData {
  _id?: string;
  isShowcase?: boolean;
  status?: string;
  title?: string;
  titlePosition?: "Top" | "Middle" | "Bottom";
  font?: string;
  coverImageUrl?: string;
  pdfUrl?: string;
  ageCategory?: string;
  theme?: string;
  subject?: string;
  specialMessage?: string;
  creatorName?: string;
  illustrationStyle?: string;
  language?: string;
  foreword?: string;
  backCoverText?: string;
  characters?: StoryCharacter[];
  pages?: Array<{
    pageNumber?: number;
    text?: string;
    imageUrl?: string;
    illustrationUrl?: string;
    image?: string;
    alt?: string;
    kind?: string;
    title?: string;
    storyPageNumber?: number;
  }>;
}

const StoryDetails = ({ storyId }: { storyId: string }) => {
  const { data: session, status: sessionStatus } = useSession();
  const { language } = useLanguage();
  const {
    bb,
    translateAge,
    translateTheme,
    translateMessage,
    translateIllustration,
  } = useBookBuilderTranslations();
  const labels = detailLabels[language];
  const staticExploreStory = getExploreStory(storyId, language);
  const hasStaticExploreStory = Boolean(staticExploreStory);
  const staticExploreBook: FetchedBookData | null = staticExploreStory
    ? {
        isShowcase: true,
        title: staticExploreStory.title,
        coverImageUrl: staticExploreStory.coverImageUrl,
        ageCategory: staticExploreStory.ageCategory,
        theme: staticExploreStory.theme,
        subject: staticExploreStory.subject,
        specialMessage: staticExploreStory.specialMessage,
        creatorName: staticExploreStory.creatorName,
        illustrationStyle: staticExploreStory.illustrationStyle,
        language: language === "nl" ? "Dutch" : language === "fr" ? "French" : "English",
        foreword: getExploreStoryWelcomeText(language),
        backCoverText: staticExploreStory.finalText || staticExploreStory.specialMessage,
        pages: [
          { pageNumber: 1, kind: "cover", imageUrl: staticExploreStory.coverImageUrl, title: staticExploreStory.title },
          { pageNumber: 2, kind: "welcome", text: getExploreStoryWelcomeText(language) },
          ...staticExploreStory.storyPages.map((page, index) => ({ pageNumber: index + 3, kind: "story", imageUrl: page.image, text: page.text, storyPageNumber: index + 1 })),
          { pageNumber: staticExploreStory.storyPages.length + 3, kind: "finalMessage", text: staticExploreStory.finalText || staticExploreStory.specialMessage, title: staticExploreStory.title },
        ],
      }
    : null;
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [isHardcopyModalOpen, setIsHardcopyModalOpen] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [fetchedBook, setFetchedBook] = useState<FetchedBookData | null>(null);
  const isStaticStory = storyId === "max-sees-the-seasons" || storyId === "lisa-camping" || hasStaticExploreStory;
  const [loading, setLoading] = useState(!isStaticStory);
  const [notFound, setNotFound] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  useEffect(() => {
    if (!storyId || storyId === "max-sees-the-seasons" || storyId === "lisa-camping" || hasStaticExploreStory) return;
    if (sessionStatus === "loading") return;

    const loadBook = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const apiBase = getApiBaseUrl();
        const showcaseResponse = await fetch(`${apiBase}/books/showcase`, {
          cache: "no-store",
        });
        const showcaseJson = showcaseResponse.ok
          ? await showcaseResponse.json().catch(() => null)
          : null;
        const showcaseBooks = Array.isArray(showcaseJson?.data)
          ? showcaseJson.data
          : [];
        const showcaseBook = showcaseBooks.find(
          (book: FetchedBookData) => book._id === storyId,
        );

        if (showcaseBook) {
          setFetchedBook(showcaseBook);
          return;
        }

        const token = session?.user?.accessToken || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${apiBase}/books/${storyId}`, {
          headers,
          cache: "no-store",
        });
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const json = await res.json();
        if (json?.data) {
          setFetchedBook(json.data);
        } else {
          setNotFound(true);
        }
      } catch (e) {
        console.error("Error loading story details:", e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [storyId, sessionStatus, session?.user?.accessToken, hasStaticExploreStory]);

  const staticStory = staticDetailsByLang[language] || staticDetailsByLang.nl;
  const isMaxStory = storyId === "max-sees-the-seasons";
  const activeBook = staticExploreBook || fetchedBook;
  const cover = activeBook?.coverImageUrl || (isMaxStory ? "/images/exp_c_1.jpg" : staticStory.cover);
  const coverTitle = activeBook?.title || (isMaxStory ? (language === "nl" ? "Max ziet de seizoenen: Herfstavonturen" : "Max Sees the Seasons: Autumn Adventures") : staticStory.title);
  const localizeTheme = (value?: string) =>
    value ? translateTheme(getChoiceLabel(value, THEME_MAP)) : "";
  const localizeSubject = (value?: string) => {
    if (!value) return "";
    const subject = ALL_SUBJECTS.find((item) => item.value === value || item.label === value);
    return subject ? getLocalizedSubjectLabel(subject, language) : value.replace(/_/g, " ");
  };
  const localizeMessage = (value?: string) =>
    value ? translateMessage(getChoiceLabel(value, MESSAGE_MAP)) : "";
  const localizeIllustration = (value?: string) =>
    value ? translateIllustration(getChoiceLabel(value, ILLUSTRATION_MAP)) : "";
  const localizeBookLanguage = (value?: string) => {
    if (!value) return "";
    const key = bookLanguageKeys[value];
    return key ? bb?.bookLanguages?.[key] || key : value;
  };
  const activeDetails = activeBook
    ? [
        [labels.ages, translateAge(ageChoiceLabels[activeBook.ageCategory || "3-5"] || activeBook.ageCategory || "3-5")],
        [labels.characters, String(staticExploreStory?.characterCount || activeBook.characters?.length || 1)],
        [labels.theme, localizeTheme(activeBook.theme) || translateTheme("Adventure")],
        ...(activeBook.subject ? [[labels.subject, localizeSubject(activeBook.subject)]] : []),
        ...(activeBook.specialMessage ? [[labels.message, localizeMessage(activeBook.specialMessage)]] : []),
        [labels.illustration, localizeIllustration(activeBook.illustrationStyle) || translateIllustration("3d Animation")],
        [labels.language, localizeBookLanguage(activeBook.language) || localizeBookLanguage(language === "nl" ? "Dutch" : language === "fr" ? "French" : "English")],
        ...(activeBook.creatorName ? [[labels.creator, activeBook.creatorName]] : []),
      ]
    : staticStory.details;
  const activeDescription =
    staticExploreStory?.description ||
    activeBook?.foreword ||
    (activeBook?.pages && activeBook.pages.length > 0 ? activeBook.pages[0].text : "") ||
    staticStory.description;
  const usedPhotos = staticExploreStory
    ? staticExploreStory.photos.map((photo) => ({ name: photo.alt, role: labels.characterPhoto, image: photo.src }))
    : isMaxStory
    ? [
        { name: language === "nl" ? "Kind" : "Child", role: labels.characterPhoto, image: "/images/exp_u_1_1.png" },
        { name: language === "nl" ? "Grootmoeder" : "Grandmother", role: language === "nl" ? "Familie" : "Family", image: "/images/exp_u_1_2.jpg" },
      ]
    : activeBook?.characters && activeBook.characters.some((c: StoryCharacter) => c.photoUrl)
      ? activeBook.characters.map((c: StoryCharacter, i: number) => ({
          name: c.name || c.animalName || c.objectName || `${language === "nl" ? "Personage" : "Character"} ${i + 1}`,
          role: c.type ? c.type.charAt(0).toUpperCase() + c.type.slice(1).toLowerCase() : labels.characterPhoto,
          image: c.photoUrl || "/images/profile.png",
        }))
      : (language === "nl" ? [
          { name: "Onze kleine kampeerder!", role: "Hoofdpersonage", image: "/images/profile.png" },
          { name: "Dappere ontdekker!", role: "Vriend", image: "/images/book_customer.jpg" },
          { name: "Beste vriend!", role: "Huisdier", image: "/images/story3.png" },
          { name: "Vrolijke reiziger!", role: "Familie", image: "/images/book_reveiew.jpg" },
        ] : photos);

  const rawPages = activeBook?.pages && activeBook.pages.length > 0 ? activeBook.pages : [];
  const previewPages =
    rawPages.length > 0
      ? rawPages.map((p, idx) => ({
          pageNumber: p.pageNumber || idx + 1,
          image: p.imageUrl || p.illustrationUrl || p.image || (p.kind === "cover" ? cover : undefined),
          text: p.text || "",
          kind: p.kind,
          storyPageNumber: p.storyPageNumber,
        }))
      : [
          { pageNumber: 1, image: cover, text: "", kind: "cover" },
          { pageNumber: 2, image: "/images/story2.png", text: "", kind: "story" },
        ];

  const currentPreviewPage = previewPages[currentPageIndex] || previewPages[0];

  const handleDownloadPdf = async () => {
    if (downloadingPdf) return;
    setDownloadingPdf(true);
    setDownloadError("");
    try {
      const token = session?.user?.accessToken || localStorage.getItem("token");
      if (!token) throw new Error("Please sign in to download your book.");

      const response = await fetch(
        `${getApiBaseUrl()}/books/${encodeURIComponent(storyId)}/download?refresh=${Date.now()}`,
        { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
      );
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.message || "Unable to prepare your PDF download.");
      }

      const pdfBlob = await response.blob();
      const objectUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${coverTitle.replace(/[^a-zA-Z0-9_-]/g, "_") || "personalized-storybook"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      setDownloadError(err instanceof Error ? err.message : "Unable to prepare your PDF download.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleSampleBookDownload = async () => {
    if (!staticExploreStory || downloadingPdf) return;
    setDownloadingPdf(true);
    setDownloadError("");
    try {
      const response = await fetch(
        `${getApiBaseUrl()}/sample-books/${encodeURIComponent(storyId)}/download?language=${encodeURIComponent(language)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: staticExploreStory.title,
            creatorName: staticExploreStory.creatorName,
            foreword: getExploreStoryWelcomeText(language),
            finalText: staticExploreStory.finalText || staticExploreStory.specialMessage,
            storyPages: staticExploreStory.storyPages.map(({ text }) => ({ text })),
          }),
        },
      );
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.message || "Unable to prepare your sample PDF download.");
      }

      const pdfBlob = await response.blob();
      const objectUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${staticExploreStory.title.replace(/[^a-zA-Z0-9_-]/g, "_") || "sample-storybook"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("Failed to generate sample PDF:", err);
      setDownloadError(err instanceof Error ? err.message : "Unable to prepare your sample PDF download.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (!isStaticStory && (loading || !fetchedBook)) {
    if (notFound) {
      return (
        <main className="min-h-[60vh] bg-[#FEFAF4] px-4 py-20 text-center">
          <h1 className="font-crimson text-3xl font-bold text-[#1E1E1E]">Storybook Not Found</h1>
          <p className="mt-2 font-sans text-sm text-[#66605F]">The storybook you are looking for does not exist or has been removed.</p>
          <div className="mt-6">
            <Link
              href="/story-books"
              className="inline-flex rounded-xl bg-[#E88DA0] px-6 py-2.5 font-sans text-sm font-semibold text-white transition hover:bg-[#DD7893]"
            >
              Back to Storybooks
            </Link>
          </div>
        </main>
      );
    }
    return <StoryDetailsSkeleton />;
  }

  return (
    <>
      <section
        className="overflow-x-hidden pb-12 pt-7 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-14"
        aria-labelledby="story-details-heading"
      >
        <div className="container mx-auto px-3 sm:px-5 lg:px-0">
          <h1
            id="story-details-heading"
            className="text-balance text-center font-fredoka text-[30px] font-normal leading-[1.12] text-[#1E1E1E] min-[420px]:text-[34px] sm:text-[40px] lg:text-[48px] lg:leading-none"
          >
            <span className="text-[#9C81BE]">{labels.headingStory}</span>{" "}
            <span className="text-[#55AA82]">
              {labels.headingBooks}
            </span>
          </h1>

          <div className="relative mt-6 rounded-xl border border-[#FFAD79] bg-[#FFF9F3] p-3.5 sm:mt-8 sm:p-6 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-[minmax(400px,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-10">
                <div className="mx-auto w-full max-w-[280px] rounded-md bg-[#514256] p-1.5 shadow-[0_10px_20px_rgba(66,52,62,0.28)] sm:max-w-[340px] lg:max-w-[420px]">
                  <Image
                    src={cover}
                    alt={`Cover of ${coverTitle}`}
                    width={396}
                    height={512}
                    className="aspect-[0.76] w-full rounded-sm object-cover object-top"
                    priority
                    unoptimized
                  />
                </div>

                <div className="min-w-0 rounded-xl bg-white p-4 shadow-[0_4px_14px_rgba(92,76,84,0.08)] sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E9DFD6] pb-4">
                    <h2 className="flex items-center gap-2 font-sans text-lg font-semibold text-[#1E1E1E]">
                      <span className="relative h-6 w-5 overflow-hidden" aria-hidden="true">
                        <Image
                          src="/images/rikLogo-transparent.png"
                          alt=""
                          width={2170}
                          height={725}
                          className="absolute left-0 top-[-3px] h-auto w-[6.8rem] max-w-none"
                        />
                      </span>
                      {labels.details}
                    </h2>
                    {fetchedBook && !isStaticStory && fetchedBook.isShowcase !== true && (
                      <Link
                        href={`/setting/edit-book?book_id=${encodeURIComponent(storyId)}`}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#E88DA0] bg-white px-4 font-sans text-sm font-medium text-[#E88DA0] transition-colors hover:bg-[#FFF0F2]"
                      >
                        <Pencil size={16} aria-hidden="true" /> {staticStory.editBook}
                      </Link>
                    )}
                  </div>

                  <dl className="mt-3 divide-y divide-[#EEE6DE] font-sans text-sm">
                    <div className="grid grid-cols-1 gap-1 py-2 text-[#514A4E] min-[420px]:grid-cols-[100px_minmax(0,1fr)] min-[420px]:gap-3 sm:grid-cols-[105px_minmax(0,1fr)]">
                      <dt className="font-medium text-[#756E73]">{labels.title}</dt>
                      <dd className="break-words font-semibold text-[#302735]">{coverTitle}</dd>
                    </div>
                    {activeDetails.map(([label, value]) => (
                      <div
                        key={label}
                        className="grid grid-cols-1 gap-1 py-2 text-[#514A4E] min-[420px]:grid-cols-[100px_minmax(0,1fr)] min-[420px]:gap-3 sm:grid-cols-[105px_minmax(0,1fr)]"
                      >
                        <dt className="font-medium text-[#756E73]">{label}</dt>
                        <dd className="break-words">{value}</dd>
                      </div>
                    ))}
                    <div className="grid grid-cols-1 gap-1 py-2 text-[#514A4E] min-[420px]:grid-cols-[100px_minmax(0,1fr)] min-[420px]:gap-3 sm:grid-cols-[105px_minmax(0,1fr)]">
                      <dt className="font-medium text-[#756E73]">{labels.story}</dt>
                      <dd className="leading-relaxed">{activeDescription}</dd>
                    </div>
                  </dl>

                  <div className="mt-5 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:flex-wrap">
                    <button
                      type="button"
                      onClick={() => setIsReaderOpen(true)}
                      className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#55AA82] px-4 font-sans text-sm font-medium text-white transition-colors hover:bg-[#47936f] min-[480px]:h-10 min-[480px]:w-auto"
                    >
                      <BookOpen size={16} aria-hidden="true" /> {labels.read}
                    </button>
                    <button
                      type="button"
                      disabled={downloadingPdf}
                      onClick={staticExploreStory ? handleSampleBookDownload : handleDownloadPdf}
                      className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#9C81BE] px-4 font-sans text-sm font-medium text-white transition-colors hover:bg-[#8667AD] disabled:cursor-not-allowed disabled:opacity-60 min-[480px]:h-10 min-[480px]:w-auto"
                    >
                      {downloadingPdf ? (
                        <>
                          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                          <span>{labels.generating}</span>
                        </>
                      ) : (
                        <>
                          <Download size={16} aria-hidden="true" />
                          <span>{labels.download}</span>
                        </>
                      )}
                    </button>
                    {!isStaticStory && fetchedBook?.isShowcase !== true && (
                      <button
                        type="button"
                        onClick={() => setIsHardcopyModalOpen(true)}
                        className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#E88DA0] px-4 font-sans text-sm font-medium text-white transition-colors hover:bg-[#DF7894] min-[480px]:h-10 min-[480px]:w-auto"
                      >
                        <Printer size={16} aria-hidden="true" /> {labels.hardcopy}
                      </button>
                    )}
                  </div>
                  {downloadError && (
                    <p role="alert" className="mt-3 font-sans text-xs text-[#B74760]">
                      {downloadError}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-9 border-t border-[#F0E5D9] pt-6">
                <div className="flex flex-col items-start justify-between gap-1.5 px-1 min-[420px]:flex-row min-[420px]:items-center min-[420px]:gap-4">
                  <h2 className="inline-flex items-center gap-2 font-sans text-base font-semibold text-[#514256]">
                    <Images
                      size={16}
                      className="text-[#9C81BE]"
                      aria-hidden="true"
                    />{" "}
                    {labels.photos}
                  </h2>
                  <span className="font-sans text-xs text-[#8A8086]">
                    {usedPhotos.length} {usedPhotos.length === 1 ? labels.characterPhoto : labels.characterPhotos}
                  </span>
                </div>
                <div className="mt-5 grid w-full max-w-[1080px] grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:mt-6 sm:grid-cols-4 sm:gap-6">
                  {usedPhotos.map((photo, i) => (
                    <article
                      key={`${photo.name}-${i}`}
                      className="min-w-0 overflow-hidden rounded-xl border border-[#F0E5D9] bg-white shadow-[0_7px_16px_rgba(92,76,84,0.13)] transition-transform duration-300 hover:-translate-y-1"
                    >
                      <Image
                        src={photo.image}
                        alt={photo.name}
                        width={190}
                        height={190}
                        className="h-56 w-full bg-[#F8F4EF] object-contain object-center sm:h-64"
                        unoptimized
                      />
                      <div className="px-3 pb-3 pt-3 sm:px-4 sm:pb-4">
                        <p className="truncate text-center font-crimson text-sm font-semibold text-[#514256]">
                          {photo.name}
                        </p>
                        <p className="mt-1 truncate text-center font-sans text-xs text-[#8A8086]">
                          {photo.role}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>

          <InlineBookPreview
            title={coverTitle}
            titlePosition={activeBook?.titlePosition}
            creatorName={activeBook?.creatorName}
            font={activeBook?.font}
            pages={previewPages}
            coverImage={cover}
            welcomeText={activeBook?.foreword}
            finalText={activeBook?.backCoverText}
            onOpenFullScreen={(pageNumber) => {
              const nextPageIndex = previewPages.findIndex((page) => page.pageNumber === pageNumber);
              if (nextPageIndex >= 0) setCurrentPageIndex(nextPageIndex);
              setIsReaderOpen(true);
            }}
          />
        </div>
      </section>

      <BookReaderModal
        isOpen={isReaderOpen}
        onClose={() => setIsReaderOpen(false)}
        storyId={storyId}
        title={coverTitle}
        titlePosition={activeBook?.titlePosition}
        creatorName={activeBook?.creatorName}
        font={activeBook?.font}
        pages={activeBook?.pages}
        coverImage={cover}
        welcomeText={activeBook?.foreword}
        finalText={activeBook?.backCoverText}
        initialPageNumber={currentPreviewPage.pageNumber}
      />

      <OrderHardcopyModal
        isOpen={isHardcopyModalOpen}
        onClose={() => setIsHardcopyModalOpen(false)}
        bookId={storyId}
        bookTitle={coverTitle}
        coverImage={cover}
      />
    </>
  );
};

export default StoryDetails;
