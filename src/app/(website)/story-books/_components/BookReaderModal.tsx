"use client";

import Image from "next/image";
import { forwardRef, useEffect, useRef, useState } from "react";
import HTMLFlipBook, { usePageFlip } from "@gullabs/react-flipbook";
import { ChevronLeft, ChevronRight, Minimize2, Minus, Plus } from "lucide-react";

type BookReaderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  storyId: string;
  title?: string;
  pages?: Array<{ pageNumber?: number; text?: string; imageUrl?: string; illustrationUrl?: string; image?: string; alt?: string }>;
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

const defaultBookPages = [
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

const BookReaderModal = ({ isOpen, onClose, storyId, title, pages }: BookReaderModalProps) => {
  const displayTitle = title || "Lisa's Camping Adventure";
  const activePages =
    pages && pages.length > 0
      ? pages.map((p, idx) => ({
          image: p.imageUrl || p.illustrationUrl || p.image || "/images/story1.png",
          alt: p.alt || `Illustration for page ${p.pageNumber || idx + 1}`,
          text: p.text || "",
        }))
      : defaultBookPages;
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
    goToPage,
    page,
  } = usePageFlip(0);

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

  const activeSpread = Math.floor(page / 2) + 1;

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
              {activePages.flatMap((bookPage, index) => [
                <ReaderPage key={`${index}-art`}>
                  <div className="relative h-full w-full bg-[#E8DDD1] p-2 sm:p-3">
                    <Image src={bookPage.image} alt={bookPage.alt} fill sizes="(max-width: 720px) 90vw, 45vw" className="object-contain" priority={index === 0} unoptimized />
                  </div>
                </ReaderPage>,
                <ReaderPage key={`${index}-text`}>
                  <div className="relative flex h-full w-full items-center justify-center bg-[#FFFEFC] px-8 py-10 text-center sm:px-14">
                    <span className="absolute right-6 top-5 text-2xl text-[#F1AD43]" aria-hidden="true">✦</span>
                    <p className="max-w-[300px] font-crimson text-xl font-semibold leading-relaxed text-[#302735] sm:text-2xl">
                      {bookPage.text}
                    </p>
                    <span className="absolute bottom-6 right-7 text-3xl text-[#CF9139]" aria-hidden="true">❧</span>
                  </div>
                </ReaderPage>,
              ])}
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
          {activePages.map((_, index) => {
            const spreadPage = index * 2;
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                type="button"
                aria-label={`Go to spread ${pageNumber}`}
                aria-current={activeSpread === pageNumber ? "page" : undefined}
                onClick={() => goToPage(spreadPage, "animate")}
                className={`flex size-9 cursor-pointer items-center justify-center rounded border font-sans text-sm font-medium transition-colors sm:size-10 ${activeSpread === pageNumber ? "border-[#E0A94C] bg-[#E0A94C] text-white" : "border-[#E8AA46] bg-white text-[#D89A38] hover:bg-[#FFF5E2]"}`}
              >
                {pageNumber}
              </button>
            );
          })}
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
