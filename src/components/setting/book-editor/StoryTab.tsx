"use client";

import Image from "next/image";
import { useRef, useState, type WheelEvent } from "react";
import { ArrowUpDown, Pencil, Sparkles } from "lucide-react";

const storyPages = [
  { id: "page-1", label: "Page 1", image: "/images/story_1.png", alt: "Unicorn story illustration" },
  { id: "page-2", label: "Page 2", image: "/images/story_2.png", alt: "Children's story illustration" },
  { id: "page-3", label: "Page 3", image: "/images/story_3.png", alt: "Children's story illustration" },
  { id: "page-4", label: "Page 4", image: "/images/story_4.png", alt: "Children's story illustration" },
  { id: "page-5", label: "Page 5", image: "/images/story_5.png", alt: "Children's story illustration" },
  { id: "page-6", label: "Page 6", image: "/images/story_6.png", alt: "Children's story illustration" },
  { id: "page-7", label: "Page 7", image: "/images/story_7.png", alt: "Children's story illustration" },
  { id: "page-8", label: "Page 8", image: "/images/story_8.png", alt: "Children's story illustration" },
  { id: "page-9", label: "Page 9", image: "/images/story_9.png", alt: "Children's story illustration" },
  { id: "page-10", label: "Page 10", image: "/images/story_10.png", alt: "Children's story illustration" },
];

export default function StoryTab() {
  const [selectedPageId, setSelectedPageId] = useState(storyPages[0].id);
  const pageListRef = useRef<HTMLDivElement>(null);
  const selectedPage = storyPages.find((page) => page.id === selectedPageId) ?? storyPages[0];

  const handlePageListWheel = (event: WheelEvent<HTMLDivElement>) => {
    const pageList = pageListRef.current;

    if (!pageList || window.innerWidth < 768 || pageList.scrollHeight <= pageList.clientHeight) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const maxScrollTop = pageList.scrollHeight - pageList.clientHeight;
    pageList.scrollTop = Math.min(
      maxScrollTop,
      Math.max(0, pageList.scrollTop + event.deltaY),
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:h-[560px] md:flex-row">
      <div
        ref={pageListRef}
        onWheelCapture={handlePageListWheel}
        className="flex w-full flex-row gap-2 overflow-x-auto overscroll-contain pb-2 md:w-32 md:flex-col md:gap-3 md:overflow-x-hidden md:overflow-y-auto md:overscroll-y-contain md:pr-2 md:pb-0"
      >
        {storyPages.map((page) => {
          const isSelected = page.id === selectedPageId;

          return (
            <button
              key={page.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedPageId(page.id)}
              className={`flex shrink-0 flex-col items-center gap-1 rounded-lg border p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3859A] ${
                isSelected
                  ? "border-[#E3859A] bg-[#FFF0F2]"
                  : "border-transparent hover:bg-gray-50"
              }`}
            >
              <div className="relative h-16 w-12 overflow-hidden rounded bg-[#FFF7F9] shadow-sm">
                <Image src={page.image} alt="" fill sizes="48px" className="object-contain p-1" />
              </div>
              <span className="text-xs font-medium text-gray-700">{page.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl bg-gray-50/50 p-4">
        <div className="relative mb-5 w-full max-w-[240px] aspect-[3/4] overflow-hidden rounded-md bg-[#FFF7F9] shadow-xl md:max-w-[260px]">
          <Image
            key={selectedPage.id}
            src={selectedPage.image}
            alt={selectedPage.alt}
            fill
            sizes="(min-width: 768px) 260px, 240px"
            className="object-contain p-4"
          />
        </div>
        <p className="mb-3 text-xs font-medium text-gray-500">Preview: {selectedPage.label}</p>
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl bg-[#E3859A] px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#d67288]"
        >
          <Pencil size={14} />
          <span>Edit Image</span>
        </button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <textarea
          className="h-56 w-full resize-none rounded-xl border border-[#F3A8B7] px-5 py-4 text-sm leading-relaxed text-gray-500 focus:border-[#E3859A] focus:outline-none focus:ring-1 focus:ring-[#E3859A] md:h-auto md:flex-1"
          defaultValue="Lorem ipsum dolor sit amet consectetur. Commodo tortor blandit sit bibendum commodo adipiscing blandit at..."
        />

        <div className="mt-4 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-[#E3859A] bg-white px-4 py-2 text-sm font-medium text-[#E3859A] transition-colors hover:bg-[#FFF0F2]"
          >
            <Sparkles size={14} />
            <span>Help with the text</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-[#E3859A] bg-white px-4 py-2 text-sm font-medium text-[#E3859A] transition-colors hover:bg-[#FFF0F2]"
          >
            <ArrowUpDown size={14} />
            <span>Page Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}
