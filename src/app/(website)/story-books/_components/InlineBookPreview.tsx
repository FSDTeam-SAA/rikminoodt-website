"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import HTMLFlipBook, { usePageFlip } from "@gullabs/react-flipbook";
import { getBookFontFamily } from "@/lib/book-font";

type PreviewPage = {
  pageNumber: number;
  image?: string;
  text?: string;
  kind?: string;
  title?: string;
  storyPageNumber?: number;
};

type ReaderBookPage = {
  kind: "cover" | "welcome" | "storyImage" | "storyText" | "finalMessage";
  image: string;
  text: string;
  title?: string;
  storyIndex?: number;
  sourcePageNumber?: number;
};

type InlineBookPreviewProps = {
  title: string;
  titlePosition?: "Top" | "Middle" | "Bottom";
  creatorName?: string;
  font?: string;
  pages: PreviewPage[];
  coverImage: string;
  welcomeText?: string;
  finalText?: string;
  onOpenFullScreen: (pageNumber: number) => void;
};

const PAGE_RATIO = 397 / 459;

const BookLeaf = forwardRef<HTMLDivElement, { children: React.ReactNode }>(
  ({ children }, ref) => (
    <div ref={ref}>
      <div className="h-full w-full overflow-hidden bg-[#FFFCF8]">{children}</div>
    </div>
  ),
);

BookLeaf.displayName = "BookLeaf";

const InlineBookPreview = ({
  title,
  titlePosition,
  creatorName,
  font,
  pages,
  coverImage,
  welcomeText,
  finalText,
  onOpenFullScreen,
}: InlineBookPreviewProps) => {
  const coverTitlePosition = titlePosition === "Middle" ? "top-1/2 -translate-y-1/2" : titlePosition === "Bottom" ? "bottom-16" : "top-7";
  const bookFontFamily = getBookFontFamily(font);
  const readerPages = useMemo<ReaderBookPage[]>(() => {
    const hasSpecialPages = pages.some((bookPage) => bookPage.kind);
    const storyPages = (hasSpecialPages
      ? pages.filter((bookPage) => bookPage.kind === "story")
      : pages
    ).map((bookPage, index) => ({
      kind: "storyImage" as const,
      image: bookPage.image || "/images/story1.png",
      text: bookPage.text || "",
      storyIndex: index,
      sourcePageNumber: bookPage.pageNumber || bookPage.storyPageNumber || index + 1,
    }));
    const coverPage = pages.find((bookPage) => bookPage.kind === "cover");
    const welcomePage = pages.find((bookPage) => bookPage.kind === "welcome");
    const finalPage = pages.find((bookPage) => bookPage.kind === "finalMessage");

    return [
      {
        kind: "cover",
        image: coverPage?.image || coverImage || storyPages[0]?.image || "/images/story1.png",
        text: "",
        title: coverPage?.title || title,
        sourcePageNumber: hasSpecialPages ? (coverPage?.pageNumber || 1) : undefined,
      },
      {
        kind: "welcome",
        image: "",
        text: welcomePage?.text || welcomeText || `Welcome to ${title}. This magical adventure was created especially for you.`,
        sourcePageNumber: hasSpecialPages ? welcomePage?.pageNumber : undefined,
      },
      ...storyPages.flatMap((storyPage) => [
        storyPage,
        { ...storyPage, kind: "storyText" as const },
      ]),
      {
        kind: "finalMessage",
        image: "",
        text: finalPage?.text || finalText || "Thank you for sharing this magical adventure. May the story stay with you for years to come.",
        title: finalPage?.title || title,
        sourcePageNumber: hasSpecialPages ? finalPage?.pageNumber : undefined,
      },
    ];
  }, [coverImage, finalText, pages, title, welcomeText]);
  const stageRef = useRef<HTMLDivElement>(null);
  const [pageSize, setPageSize] = useState({ width: 360, height: 416 });
  const [isCompact, setIsCompact] = useState(false);
  const {
    ref,
    bookProps,
    canGoNext,
    canGoPrev,
    flipNext,
    flipPrev,
    page,
  } = usePageFlip(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const updatePageSize = () => {
      const { width, height } = stage.getBoundingClientRect();
      const compact = width < 720;
      const availableWidth = Math.max(width, 200);
      const availableHeight = Math.max(height, 340);
      const pageWidth = Math.floor(
        Math.min(
          compact ? availableWidth : availableWidth / 2,
          availableHeight * PAGE_RATIO,
        ),
      );

      setIsCompact(compact);
      setPageSize({ width: pageWidth, height: Math.floor(pageWidth / PAGE_RATIO) });
    };

    updatePageSize();
    const observer = new ResizeObserver(updatePageSize);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const openCurrentPageFullScreen = () => {
    onOpenFullScreen(readerPages[page]?.sourcePageNumber || pages[0]?.pageNumber || 1);
  };

  return (
    <section
      className="relative mt-10 h-[calc(100svh-78px)] w-full snap-start overflow-visible sm:mt-12 sm:h-[calc(100svh-88px)] lg:h-[calc(100svh-116px)]"
      aria-labelledby="read-book-heading"
    >
      <h2 id="read-book-heading" className="sr-only">Read the book</h2>

      <div ref={stageRef} className="relative flex h-full w-full items-center justify-center overflow-hidden">
        <div className="origin-center">
          <HTMLFlipBook
            ref={ref}
            {...bookProps}
            width={pageSize.width}
            height={pageSize.height}
            sizing="fixed"
            autoSize={false}
            usePortrait={isCompact}
            drawShadow
            maxShadowOpacity={0.6}
            flippingTime={900}
            allowTouchScroll={false}
            useKeyboard
            controls="none"
            lazyRadius={2}
            aria-label={`${title} inline book reader`}
          >
            {readerPages.map((bookPage, index) => (
              <BookLeaf key={`${bookPage.kind}-${bookPage.sourcePageNumber || index}-${index}`}>
                {bookPage.kind === "cover" ? (
                  <div className="relative h-full w-full overflow-hidden bg-[#302735]">
                    <Image
                      src={bookPage.image}
                      alt={`Cover of ${title}`}
                      fill
                      sizes="(max-width: 720px) 90vw, 45vw"
                      className="object-cover object-center"
                      priority
                      unoptimized
                    />
                    <div className="absolute inset-x-0 top-0 h-[35%] bg-gradient-to-b from-black/40 to-transparent" />
                    <h3 style={{ fontFamily: bookFontFamily }} className={`absolute inset-x-6 ${coverTitlePosition} text-center text-[clamp(1.5rem,4vw,2.65rem)] font-bold leading-tight text-white [text-shadow:0_2px_3px_rgba(31,25,28,0.8)]`}>
                      {bookPage.title}
                    </h3>
                    <Image src="/images/logo.png" alt="Boekerello" width={145} height={48} className="absolute bottom-6 left-1/2 h-auto w-28 -translate-x-1/2 drop-shadow-md sm:w-36" />
                  </div>
                ) : bookPage.kind === "storyImage" ? (
                  <div className="relative h-full w-full overflow-hidden bg-[#302735]">
                    <Image src={bookPage.image} alt={`Illustration for story page ${(bookPage.storyIndex || 0) + 1}`} fill sizes="(max-width: 720px) 90vw, 45vw" className="object-cover object-center" priority={index < 3} unoptimized />
                    <span className="absolute bottom-4 right-4 flex size-8 items-center justify-center rounded-full bg-white/90 font-crimson text-xs text-[#302735] shadow-sm">{(bookPage.storyIndex || 0) + 1}</span>
                  </div>
                ) : bookPage.kind === "storyText" ? (
                  <div className="relative flex h-full w-full items-center overflow-hidden bg-[#FFFCF8] px-[12%] py-10">
                    <span className="absolute -left-7 -top-7 size-24 rounded-full bg-[#DCE5DF]/70" aria-hidden="true" />
                    <span className="absolute -right-5 top-20 size-16 rounded-full bg-[#F8C0B1]/65" aria-hidden="true" />
                    <span className="absolute bottom-4 right-4 flex size-8 items-center justify-center rounded-full bg-white/90 font-crimson text-xs text-[#302735] shadow-sm">{(bookPage.storyIndex || 0) + 1}</span>
                    <div className="relative w-full">
                      {bookPage.text.split(/\n\s*\n/).filter(Boolean).map((paragraph, paragraphIndex) => (
                        <p key={paragraphIndex} style={{ fontFamily: bookFontFamily }} className={`mb-3 font-semibold leading-[1.48] text-[#302735] last:mb-0 ${bookPage.text.length > 900 ? "text-[clamp(0.8rem,1.15vw,1.05rem)]" : "text-[clamp(0.9rem,1.45vw,1.25rem)]"}`}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#FFFCF6] px-[13%] text-center">
                    <span className="absolute -left-10 -top-10 size-36 rounded-full bg-[#DCE5DF]" aria-hidden="true" />
                    <span className="absolute -right-8 -top-8 size-32 rounded-full bg-[#F8C0B1]" aria-hidden="true" />
                    <span className="absolute -bottom-10 -right-10 size-40 rounded-full bg-[#FFC38F]" aria-hidden="true" />
                    {bookPage.kind === "welcome" ? (
                      <>
                        <p style={{ fontFamily: bookFontFamily }} className="relative text-[clamp(0.9rem,2vw,1.45rem)] font-semibold leading-relaxed text-[#302735]">
                          {bookPage.text}
                        </p>
                        <div className="absolute bottom-[11%] left-[12%] text-left">
                          <p style={{ fontFamily: bookFontFamily }} className="text-[clamp(0.55rem,1.1vw,0.8rem)] text-[#302735]">This magical children&apos;s book belongs to:</p>
                          <span style={{ fontFamily: bookFontFamily }} className="mt-3 block border-b border-dashed border-[#514256] pb-1 text-[clamp(0.7rem,1.35vw,1rem)] font-semibold text-[#302735]">{creatorName || " "}</span>
                        </div>
                      </>
                    ) : (
                      <div className="relative">
                        <h3 style={{ fontFamily: bookFontFamily }} className="mb-5 text-[clamp(1.2rem,2.7vw,2rem)] font-bold text-[#302735]">{bookPage.title}</h3>
                        <p style={{ fontFamily: bookFontFamily }} className="text-[clamp(0.9rem,2vw,1.35rem)] font-semibold leading-relaxed text-[#302735]">{bookPage.text}</p>
                        <p className="mt-12 font-sans text-[clamp(0.5rem,1vw,0.7rem)] text-[#514256]">This book is created with:</p>
                        <Image src="/images/logo.png" alt="Boekerello" width={125} height={42} className="mx-auto mt-1 h-auto w-24 sm:w-28" />
                      </div>
                    )}
                  </div>
                )}
              </BookLeaf>
            ))}
          </HTMLFlipBook>
        </div>
      </div>
      <button
        type="button"
        aria-label="Previous page"
        disabled={!canGoPrev}
        onClick={() => flipPrev()}
        className="absolute left-1 top-1/2 z-20 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#E8AA46] bg-white text-[#D89A38] shadow-md transition-colors hover:bg-[#FFF5E2] disabled:cursor-not-allowed disabled:opacity-35 sm:-left-16 sm:size-12"
      >
        <ChevronLeft size={25} strokeWidth={2.5} aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Next page"
        disabled={!canGoNext}
        onClick={() => flipNext()}
        className="absolute right-1 top-1/2 z-20 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#E8AA46] bg-white text-[#D89A38] shadow-md transition-colors hover:bg-[#FFF5E2] disabled:cursor-not-allowed disabled:opacity-35 sm:-right-16 sm:size-12"
      >
        <ChevronRight size={25} strokeWidth={2.5} aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Open full-screen reader"
        onClick={openCurrentPageFullScreen}
        className="absolute right-2 top-2 z-20 flex size-9 cursor-pointer items-center justify-center rounded-full bg-white text-[#514256] shadow-sm transition-colors hover:bg-[#FFF5E2] sm:-right-14 sm:top-5"
      >
        <Maximize2 size={17} aria-hidden="true" />
      </button>
    </section>
  );
};

export default InlineBookPreview;
