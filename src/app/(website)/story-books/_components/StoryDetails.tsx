"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import BookReaderModal from "./BookReaderModal";
import OrderHardcopyModal from "./OrderHardcopyModal";
import StoryDetailsSkeleton from "./StoryDetailsSkeleton";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
  Images,
  Loader2,
  Maximize2,
  Minus,
  Plus,
  Printer,
} from "lucide-react";
import { getApiBaseUrl } from "@/config/api";

const story = {
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

interface StoryCharacter {
  name?: string;
  animalName?: string;
  objectName?: string;
  type?: string;
  photoUrl?: string;
}

interface FetchedBookData {
  _id?: string;
  title?: string;
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
  characters?: StoryCharacter[];
  pages?: Array<{
    pageNumber?: number;
    text?: string;
    imageUrl?: string;
    illustrationUrl?: string;
    image?: string;
    alt?: string;
  }>;
}

const StoryDetails = ({ storyId }: { storyId: string }) => {
  const { data: session, status: sessionStatus } = useSession();
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [isHardcopyModalOpen, setIsHardcopyModalOpen] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [fetchedBook, setFetchedBook] = useState<FetchedBookData | null>(null);
  const isStaticStory = storyId === "max-sees-the-seasons" || storyId === "lisa-camping";
  const [loading, setLoading] = useState(!isStaticStory);
  const [notFound, setNotFound] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [previewZoom, setPreviewZoom] = useState(1);

  useEffect(() => {
    if (!storyId || storyId === "max-sees-the-seasons" || storyId === "lisa-camping") return;
    if (sessionStatus === "loading") return;

    const loadBook = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const apiBase = getApiBaseUrl();
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
  }, [storyId, sessionStatus, session?.user?.accessToken]);

  const isMaxStory = storyId === "max-sees-the-seasons";
  const cover = fetchedBook?.coverImageUrl || (isMaxStory ? "/images/exp_c_1.jpg" : story.cover);
  const coverTitle = fetchedBook?.title || (isMaxStory ? "Max Sees the Seasons: Autumn Adventures" : story.title);
  const activeDetails = fetchedBook
    ? [
        ["Ages", `${fetchedBook.ageCategory || "3-5"} years`],
        ["Characters", String(fetchedBook.characters?.length || 1)],
        ["Theme", fetchedBook.theme ? String(fetchedBook.theme).replace(/_/g, " ") : "Adventure"],
        ...(fetchedBook.subject ? [["Subject", String(fetchedBook.subject).replace(/_/g, " ")]] : []),
        ...(fetchedBook.specialMessage ? [["Message", String(fetchedBook.specialMessage).replace(/_/g, " ")]] : []),
        ["Illustration", fetchedBook.illustrationStyle ? String(fetchedBook.illustrationStyle).replace(/_/g, " ") : "Animation 3D"],
        ["Language", fetchedBook.language || "English"],
        ...(fetchedBook.creatorName ? [["Creator", fetchedBook.creatorName]] : []),
      ]
    : story.details;
  const activeDescription =
    fetchedBook?.foreword ||
    (fetchedBook?.pages && fetchedBook.pages.length > 0 ? fetchedBook.pages[0].text : "") ||
    story.description;
  const usedPhotos = isMaxStory
    ? [
        { name: "Child", role: "Main character", image: "/images/exp_u_1_1.png" },
        { name: "Grandmother", role: "Family", image: "/images/exp_u_1_2.jpg" },
      ]
    : fetchedBook?.characters && fetchedBook.characters.some((c: StoryCharacter) => c.photoUrl)
      ? fetchedBook.characters.map((c: StoryCharacter, i: number) => ({
          name: c.name || c.animalName || c.objectName || `Character ${i + 1}`,
          role: c.type ? c.type.charAt(0).toUpperCase() + c.type.slice(1).toLowerCase() : "Character",
          image: c.photoUrl || "/images/profile.png",
        }))
      : photos;

  const rawPages = fetchedBook?.pages && fetchedBook.pages.length > 0 ? fetchedBook.pages : [];
  const previewPages =
    rawPages.length > 0
      ? rawPages.map((p, idx) => ({
          pageNumber: p.pageNumber || idx + 1,
          image: p.imageUrl || p.illustrationUrl || p.image || cover,
          text: p.text || "",
        }))
      : [
          { pageNumber: 1, image: cover, text: "" },
          { pageNumber: 2, image: "/images/story2.png", text: "" },
        ];

  const currentPreviewPage = previewPages[currentPageIndex] || previewPages[0];

  const handleDownloadPdf = async () => {
    if (downloadingPdf) return;
    setDownloadingPdf(true);
    setDownloadError("");
    try {
      const token = session?.user?.accessToken || localStorage.getItem("token");
      if (!token) throw new Error("Please sign in to download your book.");

      const response = await fetch(`${getApiBaseUrl()}/books/${storyId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
        className="pb-12 pt-7 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-14"
        aria-labelledby="story-details-heading"
      >
        <div className="container mx-auto max-w-[1080px] px-4 sm:px-8 lg:px-0">
          <h1
            id="story-details-heading"
            className="text-balance text-center font-fredoka text-[30px] font-normal leading-[1.12] text-[#1E1E1E] min-[420px]:text-[34px] sm:text-[40px] lg:text-[48px] lg:leading-none"
          >
            <span className="text-[#9C81BE]">Story</span>{" "}
            <span className="text-[#55AA82]">
              Personalised Children&apos;s Books
            </span>
          </h1>

          <div className="relative mt-6 rounded-xl border border-[#FFAD79] bg-[#FFF9F3] p-3.5 sm:mt-8 sm:p-6 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-[minmax(230px,0.76fr)_minmax(0,1.24fr)] lg:items-start lg:gap-10">
                <div className="mx-auto w-full max-w-[240px] rounded-md bg-[#514256] p-1.5 shadow-[0_10px_20px_rgba(66,52,62,0.28)] sm:max-w-[290px]">
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
                      <BookOpen
                        size={19}
                        className="text-[#F27643]"
                        aria-hidden="true"
                      />
                      Story Details
                    </h2>
                  </div>

                  <dl className="mt-3 divide-y divide-[#EEE6DE] font-sans text-sm">
                    <div className="grid grid-cols-1 gap-1 py-2 text-[#514A4E] min-[420px]:grid-cols-[100px_minmax(0,1fr)] min-[420px]:gap-3 sm:grid-cols-[105px_minmax(0,1fr)]">
                      <dt className="font-medium text-[#756E73]">Title</dt>
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
                      <dt className="font-medium text-[#756E73]">Story</dt>
                      <dd className="leading-relaxed">{activeDescription}</dd>
                    </div>
                  </dl>

                  <div className="mt-5 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:flex-wrap">
                    <button
                      type="button"
                      onClick={() => setIsReaderOpen(true)}
                      className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#55AA82] px-4 font-sans text-sm font-medium text-white transition-colors hover:bg-[#47936f] min-[480px]:h-10 min-[480px]:w-auto"
                    >
                      <BookOpen size={16} aria-hidden="true" /> Read Story
                    </button>
                    <button
                      type="button"
                      disabled={downloadingPdf}
                      onClick={handleDownloadPdf}
                      className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#9C81BE] px-4 font-sans text-sm font-medium text-white transition-colors hover:bg-[#8667AD] disabled:cursor-not-allowed disabled:opacity-60 min-[480px]:h-10 min-[480px]:w-auto"
                    >
                      {downloadingPdf ? (
                        <>
                          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                          <span>Generating PDF…</span>
                        </>
                      ) : (
                        <>
                          <Download size={16} aria-hidden="true" />
                          <span>Download PDF</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsHardcopyModalOpen(true)}
                      className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#E88DA0] px-4 font-sans text-sm font-medium text-white transition-colors hover:bg-[#DF7894] min-[480px]:h-10 min-[480px]:w-auto"
                    >
                      <Printer size={16} aria-hidden="true" /> Order Hardcopy
                    </button>
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
                    Photos used
                  </h2>
                  <span className="font-sans text-xs text-[#8A8086]">
                    {usedPhotos.length} {usedPhotos.length === 1 ? "Character photo" : "Character photos"}
                  </span>
                </div>
                <div className="mx-auto mt-5 grid max-w-[880px] grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-4 sm:gap-6">
                  {usedPhotos.map((photo, i) => (
                    <article
                      key={`${photo.name}-${i}`}
                      className="min-w-0 overflow-hidden rounded-xl border border-[#F0E5D9] bg-white p-2.5 shadow-[0_7px_16px_rgba(92,76,84,0.13)] transition-transform duration-300 hover:-translate-y-1 sm:p-3"
                    >
                      <Image
                        src={photo.image}
                        alt={photo.name}
                        width={190}
                        height={190}
                        className="aspect-square w-full rounded-lg object-cover object-center"
                        unoptimized
                      />
                      <p className="mt-3 truncate text-center font-crimson text-sm font-semibold text-[#514256]">
                        {photo.name}
                      </p>
                      <p className="mt-1 truncate text-center font-sans text-xs text-[#8A8086]">
                        {photo.role}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>

          <section
            className="mt-6 rounded-xl bg-[#FFFCF9] px-3.5 py-7 text-center shadow-[0_4px_14px_rgba(92,76,84,0.05)] sm:mt-8 sm:px-8 sm:py-10"
            aria-labelledby="read-book-heading"
          >
            <h2
              id="read-book-heading"
              className="font-fredoka text-[32px] font-normal leading-none sm:text-[40px] lg:text-[48px]"
            >
              <span className="text-[#55A7CF]">Read</span>{" "}
              <span className="text-[#E0A94C]">the book</span>
            </h2>

            <div
              onClick={() => setIsReaderOpen(true)}
              className="group relative mx-auto mt-6 w-full max-w-[300px] cursor-pointer overflow-hidden rounded-md bg-[#514256] p-1.5 shadow-[0_12px_24px_rgba(66,52,62,0.28)] transition-transform duration-200 hover:scale-[1.02]"
              title="Click to open interactive book reader"
            >
              <div className="overflow-hidden rounded-sm">
                <Image
                  src={currentPreviewPage.image}
                  alt={`Page ${currentPreviewPage.pageNumber} of ${coverTitle}`}
                  width={396}
                  height={512}
                  className="aspect-[0.76] w-full rounded-sm object-cover object-top transition-transform duration-200"
                  style={{ transform: `scale(${previewZoom})` }}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/30 opacity-0 backdrop-blur-[1px] transition-opacity duration-200 group-hover:opacity-100">
                <span className="flex items-center gap-2 rounded-full bg-[#E0A94C] px-4 py-2 font-sans text-xs font-semibold text-white shadow-md">
                  <BookOpen size={16} /> Open Flipbook Reader
                </span>
              </div>
            </div>

            {currentPreviewPage.text && (
              <p className="mx-auto mt-4 max-w-[550px] px-4 font-crimson text-base italic leading-relaxed text-[#514256] sm:text-lg">
                &ldquo;{currentPreviewPage.text}&rdquo;
              </p>
            )}

            <div
              className="mt-6 flex flex-wrap justify-center gap-2 sm:mt-7 sm:gap-3"
              aria-label={`Page navigation for story ${storyId}`}
            >
              <button
                type="button"
                aria-label="Zoom in"
                onClick={() => setPreviewZoom((z) => Math.min(Number((z + 0.1).toFixed(1)), 1.4))}
                className="flex size-11 cursor-pointer items-center justify-center rounded-md border border-[#E8AA46] bg-white text-[#D89A38] shadow-sm transition-colors hover:bg-[#FFF5E2] sm:size-12"
              >
                <Plus size={20} strokeWidth={2.5} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Zoom out"
                onClick={() => setPreviewZoom((z) => Math.max(Number((z - 0.1).toFixed(1)), 0.8))}
                className="flex size-11 cursor-pointer items-center justify-center rounded-md border border-[#E8AA46] bg-white text-[#D89A38] shadow-sm transition-colors hover:bg-[#FFF5E2] sm:size-12"
              >
                <Minus size={20} strokeWidth={2.5} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Previous page"
                disabled={currentPageIndex === 0}
                onClick={() => setCurrentPageIndex((p) => Math.max(0, p - 1))}
                className="flex size-11 cursor-pointer items-center justify-center rounded-md border border-[#E8AA46] bg-white text-[#D89A38] shadow-sm transition-colors hover:bg-[#FFF5E2] disabled:cursor-not-allowed disabled:opacity-40 sm:size-12"
              >
                <ChevronLeft size={25} strokeWidth={2.5} aria-hidden="true" />
              </button>
              {previewPages.map((p, idx) => (
                <button
                  key={p.pageNumber}
                  type="button"
                  aria-label={`Go to page ${p.pageNumber}`}
                  onClick={() => setCurrentPageIndex(idx)}
                  className={`flex size-11 cursor-pointer items-center justify-center rounded-md border font-sans text-lg font-medium shadow-sm transition-colors sm:size-12 ${
                    currentPageIndex === idx
                      ? "border-[#E0A94C] bg-[#E0A94C] text-white"
                      : "border-[#E8AA46] bg-white text-[#D89A38] hover:bg-[#FFF5E2]"
                  }`}
                >
                  {p.pageNumber}
                </button>
              ))}
              <button
                type="button"
                aria-label="Next page"
                disabled={currentPageIndex === previewPages.length - 1}
                onClick={() => setCurrentPageIndex((p) => Math.min(previewPages.length - 1, p + 1))}
                className="flex size-11 cursor-pointer items-center justify-center rounded-md border border-[#E8AA46] bg-white text-[#D89A38] shadow-sm transition-colors hover:bg-[#FFF5E2] disabled:cursor-not-allowed disabled:opacity-40 sm:size-12"
              >
                <ChevronRight size={25} strokeWidth={2.5} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="View full screen"
                onClick={() => setIsReaderOpen(true)}
                className="flex size-11 cursor-pointer items-center justify-center rounded-md border border-[#E8AA46] bg-white text-[#D89A38] shadow-sm transition-colors hover:bg-[#FFF5E2] sm:size-12"
              >
                <Maximize2 size={21} strokeWidth={2.5} aria-hidden="true" />
              </button>
            </div>
          </section>
        </div>
      </section>

      <BookReaderModal
        isOpen={isReaderOpen}
        onClose={() => setIsReaderOpen(false)}
        storyId={storyId}
        title={coverTitle}
        pages={fetchedBook?.pages}
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
