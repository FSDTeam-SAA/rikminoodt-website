"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type WheelEvent } from "react";
import { ArrowUpDown, Pencil, Sparkles } from "lucide-react";
import type { EditableBookPage } from "./types";

type StoryTabProps = { pages: EditableBookPage[]; onChange: (pageNumber: number, field: "text" | "title", value: string) => void };

export default function StoryTab({ pages, onChange }: StoryTabProps) {
  const editablePages = pages.filter((page) => page.kind !== "cover");
  const [selectedPageNumber, setSelectedPageNumber] = useState<number | null>(editablePages[0]?.pageNumber ?? null);
  const pageListRef = useRef<HTMLDivElement>(null);
  const selectedPage = editablePages.find((page) => page.pageNumber === selectedPageNumber) ?? editablePages[0];

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

  if (!selectedPage) return <div className="p-6 text-sm text-gray-500">There are no editable story pages in this book.</div>;

  return (
    <div className="flex flex-col gap-4 p-4 md:h-[560px] md:flex-row">
      <div ref={pageListRef} onWheelCapture={handlePageListWheel} className="flex w-full flex-row gap-2 overflow-x-auto overscroll-contain pb-2 md:w-32 md:flex-col md:gap-3 md:overflow-x-hidden md:overflow-y-auto md:overscroll-y-contain md:pr-2 md:pb-0">
        {editablePages.map((page) => {
          const isSelected = page.pageNumber === selectedPage.pageNumber;
          const label = page.kind === "welcome" ? "Preface" : page.kind === "finalMessage" ? "Final message" : `Page ${page.storyPageNumber ?? page.pageNumber}`;
          return <button key={page.pageNumber} type="button" aria-pressed={isSelected} onClick={() => setSelectedPageNumber(page.pageNumber)} className={`flex shrink-0 flex-col items-center gap-1 rounded-lg border p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3859A] ${isSelected ? "border-[#E3859A] bg-[#FFF0F2]" : "border-transparent hover:bg-gray-50"}`}>
            <div className="relative h-16 w-12 overflow-hidden rounded bg-[#FFF7F9] shadow-sm">{page.imageUrl ? <Image src={page.imageUrl} alt="" fill unoptimized sizes="48px" className="object-contain p-1" /> : <span className="flex h-full items-center justify-center text-[10px] text-gray-400">{page.pageNumber}</span>}</div>
            <span className="max-w-20 truncate text-xs font-medium text-gray-700">{label}</span>
          </button>;
        })}
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl bg-gray-50/50 p-4">
        <div className="relative mb-5 aspect-[3/4] w-full max-w-[240px] overflow-hidden rounded-md bg-[#FFF7F9] shadow-xl md:max-w-[260px]">{selectedPage.imageUrl ? <Image src={selectedPage.imageUrl} alt="Story illustration" fill unoptimized sizes="(min-width: 768px) 260px, 240px" className="object-contain p-4" /> : <div className="flex h-full items-center justify-center p-4 text-center text-sm text-gray-400">Story page {selectedPage.storyPageNumber ?? selectedPage.pageNumber}</div>}</div>
        <p className="mb-3 text-xs font-medium text-gray-500">Preview: Page {selectedPage.storyPageNumber ?? selectedPage.pageNumber}</p>
        <button type="button" className="flex items-center gap-2 rounded-xl bg-[#E3859A] px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#d67288]"><Pencil size={14} /><span>Edit Image</span></button>
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <input type="text" maxLength={200} value={selectedPage.title || ""} onChange={(event) => onChange(selectedPage.pageNumber, "title", event.target.value)} placeholder="Page title (optional)" className="w-full rounded-xl border border-[#F3A8B7] px-4 py-2.5 text-sm text-gray-500 focus:border-[#E3859A] focus:outline-none focus:ring-1 focus:ring-[#E3859A]" />
        <textarea value={selectedPage.text} onChange={(event) => onChange(selectedPage.pageNumber, "text", event.target.value)} className="h-56 w-full resize-none rounded-xl border border-[#F3A8B7] px-5 py-4 text-sm leading-relaxed text-gray-500 focus:border-[#E3859A] focus:outline-none focus:ring-1 focus:ring-[#E3859A] md:h-auto md:flex-1" />
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" className="flex items-center gap-2 rounded-xl border border-[#E3859A] bg-white px-4 py-2 text-sm font-medium text-[#E3859A] transition-colors hover:bg-[#FFF0F2]"><Sparkles size={14} /><span>Help with the text</span></button>
          <button type="button" className="flex items-center gap-2 rounded-xl border border-[#E3859A] bg-white px-4 py-2 text-sm font-medium text-[#E3859A] transition-colors hover:bg-[#FFF0F2]"><ArrowUpDown size={14} /><span>Page Order</span></button>
        </div>
      </div>
    </div>
  );
}
