"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type WheelEvent } from "react";
import { ArrowUpDown, BookOpen, Heart, Pencil, Sparkles } from "lucide-react";
import type { BookCharacter, EditableBookPage } from "./types";
import { useLanguage } from "@/components/providers/LanguageProvider";
import TextAiHelpModal from "./TextAiHelpModal";
import EditImageModal from "./EditImageModal";
import PageOrderModal from "./PageOrderModal";

type StoryTabProps = {
  pages: EditableBookPage[];
  onChange: (pageNumber: number, field: "text" | "title", value: string) => void;
  onUpdateImage?: (pageNumber: number, imageUrl: string) => void;
  onReorderPages?: (newPages: EditableBookPage[]) => void;
  bookId?: string;
  language?: string;
  ageCategory?: string;
  theme?: string;
  illustrationStyle?: string;
  characters?: BookCharacter[];
};

export default function StoryTab({
  pages,
  onChange,
  onUpdateImage,
  onReorderPages,
  bookId,
  language,
  ageCategory,
  theme,
  illustrationStyle,
  characters,
}: StoryTabProps) {
  const { t } = useLanguage();
  const storyT = t.settings?.editBook?.story;
  const editablePages = pages.filter((page) => page.kind !== "cover");
  const [selectedPageNumber, setSelectedPageNumber] = useState<number | null>(editablePages[0]?.pageNumber ?? null);
  const pageListRef = useRef<HTMLDivElement>(null);
  const selectedPage = editablePages.find((page) => page.pageNumber === selectedPageNumber) ?? editablePages[0];

  // Modals state
  const [isAiHelpOpen, setIsAiHelpOpen] = useState(false);
  const [isEditImageOpen, setIsEditImageOpen] = useState(false);
  const [isPageOrderOpen, setIsPageOrderOpen] = useState(false);

  useEffect(() => {
    if (selectedPageNumber !== null && editablePages.some((page) => page.pageNumber === selectedPageNumber)) return;
    setSelectedPageNumber(editablePages[0]?.pageNumber ?? null);
  }, [editablePages, selectedPageNumber]);

  const handlePageListWheel = (event: WheelEvent<HTMLDivElement>) => {
    const pageList = pageListRef.current;
    if (!pageList || window.innerWidth < 768 || pageList.scrollHeight <= pageList.clientHeight) return;
    event.preventDefault();
    event.stopPropagation();
    pageList.scrollTop = Math.min(pageList.scrollHeight - pageList.clientHeight, Math.max(0, pageList.scrollTop + event.deltaY));
  };

  if (!selectedPage) {
    return (
      <div className="p-6 text-sm text-gray-500">
        {storyT?.noPages || "There are no editable story pages in this book."}
      </div>
    );
  }

  const isTextOnlyPage = selectedPage.kind === "welcome" || selectedPage.kind === "finalMessage";
  const storySpreads = editablePages.filter((page) => page.kind === "story");

  const handleApplyRewrittenText = (newText: string) => {
    onChange(selectedPage.pageNumber, "text", newText);
  };

  const handleApplyNewImage = (newImageUrl: string) => {
    if (onUpdateImage) {
      onUpdateImage(selectedPage.pageNumber, newImageUrl);
    }
  };

  const handleApplyPageOrder = (newOrderedPages: EditableBookPage[]) => {
    if (onReorderPages) {
      // Keep welcome page first, insert reordered story spreads, keep finalMessage last
      const welcome = editablePages.filter((p) => p.kind === "welcome");
      const finalMsg = editablePages.filter((p) => p.kind === "finalMessage");
      onReorderPages([...welcome, ...newOrderedPages, ...finalMsg]);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:h-[560px] md:flex-row">
      {/* Side thumbnails */}
      <div
        ref={pageListRef}
        onWheelCapture={handlePageListWheel}
        className="flex w-full flex-row gap-2 overflow-x-auto overscroll-contain pb-2 md:w-32 md:flex-col md:gap-3 md:overflow-x-hidden md:overflow-y-auto md:overscroll-y-contain md:pr-2 md:pb-0"
      >
        {editablePages.map((page) => {
          const isSelected = page.pageNumber === selectedPage.pageNumber;
          const isWelcome = page.kind === "welcome";
          const isFinal = page.kind === "finalMessage";
          const label = isWelcome
            ? (storyT?.preface || "Preface")
            : isFinal
            ? (storyT?.finalMessage || "Final message")
            : `${storyT?.page || "Page"} ${page.storyPageNumber ?? page.pageNumber}`;

          return (
            <button
              key={page.pageNumber}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedPageNumber(page.pageNumber)}
              className={`flex shrink-0 flex-col items-center gap-1 rounded-lg border p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3859A] ${
                isSelected ? "border-[#E3859A] bg-[#FFF0F2]" : "border-transparent hover:bg-gray-50"
              }`}
            >
              <div className="relative flex h-16 w-12 items-center justify-center overflow-hidden rounded bg-[#FFF7F9] shadow-sm">
                {page.imageUrl && !isWelcome && !isFinal ? (
                  <Image src={page.imageUrl} alt="" fill unoptimized sizes="48px" className="object-contain p-1" />
                ) : isWelcome ? (
                  <span className="flex flex-col items-center justify-center text-[10px] font-semibold text-[#E3859A]">
                    <BookOpen size={18} className="mb-0.5 text-[#E3859A]" />
                    <span>Intro</span>
                  </span>
                ) : isFinal ? (
                  <span className="flex flex-col items-center justify-center text-[10px] font-semibold text-[#E3859A]">
                    <Heart size={18} className="mb-0.5 text-[#E3859A]" />
                    <span>End</span>
                  </span>
                ) : (
                  <span className="flex h-full items-center justify-center text-[10px] text-gray-400">{page.pageNumber}</span>
                )}
              </div>
              <span className="max-w-20 truncate text-xs font-medium text-gray-700">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Main content area */}
      {isTextOnlyPage ? (
        // Text-only page layout (Preface or Final Message) - No image or edit image button
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 rounded-xl bg-gray-50/40 p-4 sm:p-6">
          <div className="border-b border-gray-200/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-[#FFF0F2] px-2.5 py-1 text-xs font-semibold text-[#E3859A]">
                {selectedPage.kind === "welcome"
                  ? (storyT?.preface || "Preface")
                  : (storyT?.finalMessage || "Final message")}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {selectedPage.kind === "welcome"
                ? "A personal message to the reader before the story begins."
                : "A concluding message thanking the reader on the back of the book."}
            </p>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <textarea
              value={selectedPage.text}
              onChange={(event) => onChange(selectedPage.pageNumber, "text", event.target.value)}
              placeholder={
                selectedPage.kind === "welcome"
                  ? "Write your personal preface message here..."
                  : "Write your final concluding message here..."
              }
              className="h-64 w-full resize-none rounded-xl border border-[#F3A8B7] bg-white px-5 py-4 text-sm leading-relaxed text-gray-700 focus:border-[#E3859A] focus:outline-none focus:ring-1 focus:ring-[#E3859A] md:h-auto md:flex-1"
            />
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAiHelpOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-[#E3859A] bg-white px-5 py-2 text-sm font-medium text-[#E3859A] transition-colors hover:bg-[#FFF0F2] shadow-xs active:scale-[0.99]"
            >
              <Sparkles size={14} />
              <span>{storyT?.helpButton || "Help with the text"}</span>
            </button>
          </div>
        </div>
      ) : (
        // Story page layout (with Illustration Preview, Edit Image button, and Text Area)
        <>
          <div className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl bg-gray-50/50 p-4">
            <div className="relative mb-5 aspect-[3/4] w-full max-w-[240px] overflow-hidden rounded-md bg-[#FFF7F9] shadow-xl md:max-w-[260px]">
              {selectedPage.imageUrl ? (
                <Image
                  src={selectedPage.imageUrl}
                  alt="Story illustration"
                  fill
                  unoptimized
                  sizes="(min-width: 768px) 260px, 240px"
                  className="object-contain p-4"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-4 text-center text-sm text-gray-400">
                  {storyT?.storyPage || "Story page"} {selectedPage.storyPageNumber ?? selectedPage.pageNumber}
                </div>
              )}
            </div>
            <p className="mb-3 text-xs font-medium text-gray-500">
              {storyT?.previewPage || "Preview: Page"} {selectedPage.storyPageNumber ?? selectedPage.pageNumber}
            </p>
            <button
              type="button"
              onClick={() => setIsEditImageOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-[#E3859A] px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#d67288] active:scale-[0.99]"
            >
              <Pencil size={14} />
              <span>{storyT?.editImage || "Edit Image"}</span>
            </button>
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
            <textarea
              value={selectedPage.text}
              onChange={(event) => onChange(selectedPage.pageNumber, "text", event.target.value)}
              placeholder="Write the story for this page..."
              className="h-56 w-full resize-none rounded-xl border border-[#F3A8B7] px-5 py-4 text-sm leading-relaxed text-gray-700 focus:border-[#E3859A] focus:outline-none focus:ring-1 focus:ring-[#E3859A] md:h-auto md:flex-1"
            />
            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAiHelpOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-[#E3859A] bg-white px-4 py-2 text-sm font-medium text-[#E3859A] transition-colors hover:bg-[#FFF0F2] shadow-xs active:scale-[0.99]"
              >
                <Sparkles size={14} />
                <span>{storyT?.helpButton || "Help with the text"}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPageOrderOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-[#E3859A] bg-white px-4 py-2 text-sm font-medium text-[#E3859A] transition-colors hover:bg-[#FFF0F2] shadow-xs active:scale-[0.99]"
              >
                <ArrowUpDown size={14} />
                <span>{storyT?.pageOrder || "Page Order"}</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      <TextAiHelpModal
        isOpen={isAiHelpOpen}
        onClose={() => setIsAiHelpOpen(false)}
        currentText={selectedPage.text}
        onApply={handleApplyRewrittenText}
        pageNumber={selectedPage.storyPageNumber ?? selectedPage.pageNumber}
        bookId={bookId}
        language={language}
        ageCategory={ageCategory}
        theme={theme}
        illustrationStyle={illustrationStyle}
        characters={characters}
        isPreface={selectedPage.kind === "welcome"}
      />

      <EditImageModal
        isOpen={isEditImageOpen}
        onClose={() => setIsEditImageOpen(false)}
        currentImageUrl={selectedPage.imageUrl}
        pageNumber={selectedPage.storyPageNumber ?? selectedPage.pageNumber}
        bookId={bookId}
        pageText={selectedPage.text}
        illustrationStyle={illustrationStyle}
        characters={characters}
        onApplyImage={handleApplyNewImage}
      />

      <PageOrderModal
        isOpen={isPageOrderOpen}
        onClose={() => setIsPageOrderOpen(false)}
        pages={storySpreads}
        onApplyOrder={handleApplyPageOrder}
      />
    </div>
  );
}
