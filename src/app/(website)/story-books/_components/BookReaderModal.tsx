"use client";

import Image from "next/image";
import { forwardRef, useEffect, useRef, useState } from "react";
import HTMLFlipBook, { usePageFlip } from "@gullabs/react-flipbook";
import { ChevronLeft, ChevronRight, Minimize2, Minus, Plus } from "lucide-react";

type RawBookPage = {
  pageNumber?: number;
  text?: string;
  imageUrl?: string;
  illustrationUrl?: string;
  image?: string;
  alt?: string;
  kind?: string;
  title?: string;
  storyPageNumber?: number;
};

type BookReaderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  storyId: string;
  title?: string;
  coverImage?: string;
  welcomeText?: string;
  finalText?: string;
  pages?: RawBookPage[];
  initialPageNumber?: number;
};

type PageProps = {
  children: React.ReactNode;
};

const PAGE_RATIO = 397 / 459;

const ReaderPage = forwardRef<HTMLDivElement, PageProps>(({ children }, ref) => (
  <div ref={ref}>
    <div className="h-full w-full overflow-hidden bg-[#FFFEFC]">{children}</div>
  </div>
));

ReaderPage.displayName = "ReaderPage";

const defaultStoryPages: RawBookPage[] = [
  {
    image: "/images/story1.png",
    alt: "Noah exploring the ocean with friendly sea animals",
    text: "The ocean sparkled softly as Noah and his new friends swam through the colourful coral reef. Every splash brought a new discovery, and Noah knew this was only the beginning of a magical adventure.",
  },
  {
    image: "/images/story2.png",
    alt: "A page from Noah's magical ocean adventure",
    text: "With a brave little smile, Noah followed the dolphins toward a secret cove. There, the friends found a treasure more wonderful than gold: helping every creature feel safe and happy at home.",
  },
];

type ReaderBookPage = {
  kind: "cover" | "welcome" | "storyImage" | "storyText" | "finalMessage";
  image: string;
  alt: string;
  text: string;
  title?: string;
  storyIndex?: number;
  sourcePageNumber?: number;
};

const BookReaderModal = ({
  isOpen,
  onClose,
  storyId,
  title,
  coverImage,
  welcomeText,
  finalText,
  pages,
  initialPageNumber,
}: BookReaderModalProps) => {
  const displayTitle = title || "Lisa's Camping Adventure";
  const suppliedPages = pages || [];
  const hasSpecialPages = suppliedPages.some((page) => page.kind);
  const storyPages = (hasSpecialPages
    ? suppliedPages.filter((page) => page.kind === "story")
    : suppliedPages.length > 0
      ? suppliedPages
      : defaultStoryPages
  ).map((page, index) => ({
    kind: "storyImage" as const,
    image: page.imageUrl || page.illustrationUrl || page.image || "/images/story1.png",
    alt: page.alt || `Illustration for story page ${page.storyPageNumber || page.pageNumber || index + 1}`,
    text: page.text || "",
    storyIndex: index,
    sourcePageNumber: page.pageNumber || page.storyPageNumber || index + 1,
  }));
  const coverPage = suppliedPages.find((page) => page.kind === "cover");
  const welcomePage = suppliedPages.find((page) => page.kind === "welcome");
  const finalPage = suppliedPages.find((page) => page.kind === "finalMessage");
  const activePages: ReaderBookPage[] = [
    {
      kind: "cover",
      image: coverPage?.imageUrl || coverPage?.illustrationUrl || coverPage?.image || coverImage || storyPages[0]?.image || "/images/story1.png",
      alt: `Cover of ${displayTitle}`,
      text: "",
      title: coverPage?.title || displayTitle,
      sourcePageNumber: hasSpecialPages ? (coverPage?.pageNumber || 1) : undefined,
    },
    {
      kind: "welcome",
      image: "",
      alt: "",
      text: welcomePage?.text || welcomeText || `Welcome to ${displayTitle}. This magical adventure was created especially for you.`,
      sourcePageNumber: hasSpecialPages ? welcomePage?.pageNumber : undefined,
    },
    ...storyPages.flatMap((storyPage) => [
      storyPage,
      {
        ...storyPage,
        kind: "storyText" as const,
      },
    ]),
    {
      kind: "finalMessage",
      image: "",
      alt: "",
      text: finalPage?.text || finalText || "Thank you for sharing this magical adventure. May the story stay with you for years to come.",
      title: finalPage?.title || displayTitle,
      sourcePageNumber: hasSpecialPages ? finalPage?.pageNumber : undefined,
    },
  ];
  const initialReaderPage = Math.max(
    0,
    activePages.findIndex((bookPage) => bookPage.sourcePageNumber === initialPageNumber),
  );
  const stageRef = useRef<HTMLDivElement>(null);
  const [pageSize, setPageSize] = useState({ width: 360, height: 416 });
  const [isCompact, setIsCompact] = useState(false);
  const [zoom, setZoom] = useState(1);
  const {
    ref,
    bookProps,
    canGoNext,
    canGoPrev,
    flipNext,
    flipPrev,
    page,
  } = usePageFlip(initialReaderPage);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !isOpen) return;

    const updatePageSize = () => {
      const { width, height } = stage.getBoundingClientRect();
      const compact = width < 720;
      const availableWidth = Math.max(width - 32, 240);
      const availableHeight = Math.max(height - 132, 300);
      const pageWidth = Math.floor(
        Math.min(compact ? availableWidth : availableWidth / 2, availableHeight * PAGE_RATIO),
      );

      setIsCompact(compact);
      setPageSize({
        width: pageWidth,
        height: Math.floor(pageWidth / PAGE_RATIO),
      });
    };

    updatePageSize();
    const observer = new ResizeObserver(updatePageSize);
    observer.observe(stage);

    return () => observer.disconnect();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setZoom(1);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#1E1E1E]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-reader-title"
    >
      <div className="relative h-full w-full overflow-hidden bg-[#FFF8F0]">
        <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between border-b border-[#EADFD4] bg-[#FFF8F0]/95 px-4 py-3 backdrop-blur-sm sm:px-6">
          <p id="book-reader-title" className="font-crimson text-lg font-semibold text-[#514256] sm:text-xl">
            {displayTitle}
          </p>
          <span className="font-sans text-sm text-[#8A8086]">Book reader</span>
        </header>

        <div ref={stageRef} className="absolute inset-0 flex items-center justify-center overflow-hidden px-4 py-[68px] sm:px-7 sm:py-[80px]">
          <div className="origin-center transition-transform duration-200" style={{ transform: `scale(${zoom})` }}>
            <HTMLFlipBook
              ref={ref}
              {...bookProps}
              width={pageSize.width}
              height={pageSize.height}
              sizing="fixed"
              autoSize={false}
              usePortrait={isCompact}
              drawShadow
              maxShadowOpacity={0.65}
              flippingTime={950}
              allowTouchScroll={false}
              useKeyboard
              controls="none"
              lazyRadius={2}
              aria-label={`${displayTitle} book reader`}
            >
              {activePages.map((bookPage, index) => (
                <ReaderPage key={`${bookPage.kind}-${index}`}>
                  {bookPage.kind === "cover" ? (
                    <div className="relative h-full w-full overflow-hidden bg-[#302735]">
                      <Image src={bookPage.image} alt={bookPage.alt} fill sizes="(max-width: 720px) 90vw, 45vw" className="object-cover" priority unoptimized />
                      <div className="absolute inset-x-0 top-0 h-[35%] bg-gradient-to-b from-black/40 to-transparent" />
                      <h2 className="absolute inset-x-6 top-7 text-center font-crimson text-[clamp(1.5rem,4vw,2.65rem)] font-bold leading-tight text-white [text-shadow:0_2px_3px_rgba(31,25,28,0.8)]">
                        {bookPage.title}
                      </h2>
                      <Image src="/images/logo.png" alt="Bookerello" width={145} height={48} className="absolute bottom-6 left-1/2 h-auto w-28 -translate-x-1/2 drop-shadow-md sm:w-36" />
                    </div>
                  ) : bookPage.kind === "storyImage" ? (
                    <div className="relative h-full w-full overflow-hidden bg-[#302735]">
                      <Image
                        src={bookPage.image}
                        alt={bookPage.alt}
                        fill
                        sizes="(max-width: 720px) 90vw, 45vw"
                        className="object-cover object-center"
                        unoptimized
                      />
                      <span className="absolute bottom-4 right-4 flex size-8 items-center justify-center rounded-full bg-white/90 font-crimson text-xs text-[#302735] shadow-sm">
                        {(bookPage.storyIndex || 0) + 1}
                      </span>
                    </div>
                  ) : bookPage.kind === "storyText" ? (
                    <div className="relative flex h-full w-full items-center overflow-hidden bg-[#FFFCF8] px-[12%] py-10">
                      <span className="absolute -left-7 -top-7 size-24 rounded-full bg-[#DCE5DF]/70" aria-hidden="true" />
                      <span className="absolute -right-5 top-20 size-16 rounded-full bg-[#F8C0B1]/65" aria-hidden="true" />
                      <span className="absolute bottom-4 right-4 flex size-8 items-center justify-center rounded-full bg-white/90 font-crimson text-xs text-[#302735] shadow-sm">
                        {(bookPage.storyIndex || 0) + 1}
                      </span>
                      <div className="relative w-full">
                        {bookPage.text.split(/\n\s*\n/).filter(Boolean).map((paragraph, paragraphIndex) => (
                          <p key={paragraphIndex} className="mb-4 font-crimson text-[clamp(0.82rem,1.75vw,1.25rem)] font-semibold leading-[1.62] text-[#302735] last:mb-0">
                            {paragraph}
                          </p>
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
                          <p className="relative font-crimson text-[clamp(0.9rem,2vw,1.45rem)] font-semibold leading-relaxed text-[#302735]">
                            {bookPage.text}
                          </p>
                          <div className="absolute bottom-[11%] left-[12%] rounded-[45%] bg-white/95 px-5 py-4 text-left shadow-sm">
                            <p className="font-sans text-[clamp(0.55rem,1.1vw,0.8rem)] text-[#302735]">This magical children&apos;s book belongs to:</p>
                            <span className="mt-3 block border-b border-dashed border-[#514256]" aria-label="Space for the reader's name or signature" />
                          </div>
                        </>
                      ) : (
                        <div className="relative">
                          <h2 className="mb-5 font-crimson text-[clamp(1.2rem,2.7vw,2rem)] font-bold text-[#302735]">{bookPage.title}</h2>
                          <p className="font-crimson text-[clamp(0.9rem,2vw,1.35rem)] font-semibold leading-relaxed text-[#302735]">{bookPage.text}</p>
                          <p className="mt-12 font-sans text-[clamp(0.5rem,1vw,0.7rem)] text-[#514256]">This book is created with:</p>
                          <Image src="/images/logo.png" alt="Bookerello" width={125} height={42} className="mx-auto mt-1 h-auto w-24 sm:w-28" />
                        </div>
                      )}
                    </div>
                  )}
                </ReaderPage>
              ))}
            </HTMLFlipBook>
          </div>
        </div>

        <nav className="absolute inset-x-0 bottom-0 z-30 flex flex-wrap items-center justify-center gap-1.5 border-t border-[#EADFD4] bg-[#FFF8F0]/95 px-4 py-4 backdrop-blur-sm sm:gap-2 sm:py-5" aria-label={`Page navigation for story ${storyId}`}>
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => setZoom((value) => Math.min(value + 0.05, 1.1))}
            className="flex size-9 cursor-pointer items-center justify-center rounded border border-[#E8AA46] bg-white text-[#D89A38] transition-colors hover:bg-[#FFF5E2] sm:size-10"
          >
            <Plus size={17} strokeWidth={2.5} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => setZoom((value) => Math.max(value - 0.05, 0.85))}
            className="flex size-9 cursor-pointer items-center justify-center rounded border border-[#E8AA46] bg-white text-[#D89A38] transition-colors hover:bg-[#FFF5E2] sm:size-10"
          >
            <Minus size={17} strokeWidth={2.5} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Previous pages"
            disabled={!canGoPrev}
            onClick={() => flipPrev()}
            className="flex size-9 cursor-pointer items-center justify-center rounded border border-[#E8AA46] bg-white text-[#D89A38] transition-colors hover:bg-[#FFF5E2] disabled:cursor-not-allowed disabled:opacity-35 sm:size-10"
          >
            <ChevronLeft size={21} strokeWidth={2.5} aria-hidden="true" />
          </button>
          <span className="min-w-14 text-center font-sans text-sm font-medium text-[#514256]" aria-live="polite">
            {page + 1} / {activePages.length}
          </span>
          <button
            type="button"
            aria-label="Next pages"
            disabled={!canGoNext}
            onClick={() => flipNext()}
            className="flex size-9 cursor-pointer items-center justify-center rounded border border-[#E8AA46] bg-white text-[#D89A38] transition-colors hover:bg-[#FFF5E2] disabled:cursor-not-allowed disabled:opacity-35 sm:size-10"
          >
            <ChevronRight size={21} strokeWidth={2.5} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Close full screen reader"
            onClick={onClose}
            className="flex size-9 cursor-pointer items-center justify-center rounded border border-[#E8AA46] bg-white text-[#D89A38] transition-colors hover:bg-[#FFF5E2] sm:size-10"
          >
            <Minimize2 size={17} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default BookReaderModal;
