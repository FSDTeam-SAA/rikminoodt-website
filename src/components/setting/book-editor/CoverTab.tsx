"use client";

import Image from "next/image";
import { Pencil } from "lucide-react";
import type { ChangeEvent } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type CoverTabProps = {
  coverImageUrl?: string;
  coverPreviewUrl?: string;
  title: string;
  titlePosition: "Top" | "Middle" | "Bottom";
  creatorName: string;
  backCoverText: string;
  onCoverImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onChange: (field: "title" | "titlePosition" | "creatorName" | "backCoverText", value: string) => void;
};

export default function CoverTab({ coverImageUrl, coverPreviewUrl, title, titlePosition, creatorName, backCoverText, onCoverImageChange, onChange }: CoverTabProps) {
  const coverSrc = coverPreviewUrl || coverImageUrl;

  return (
    <div className="grid gap-6 p-4 sm:p-6 md:grid-cols-[minmax(220px,360px)_minmax(0,1fr)] md:gap-8">
      <div className="flex w-full flex-col items-center">
        <div className="relative mb-4 aspect-[3/4] w-full max-w-[320px] overflow-hidden rounded-md bg-[#FFF7F9] shadow-xl md:max-w-none">
          {coverSrc ? <Image src={coverSrc} alt="Book cover" fill unoptimized className="object-cover" /> : <div className="flex h-full items-center justify-center p-6 text-center font-serif text-xl text-[#8A6D76]">{title || "Your storybook"}</div>}
        </div>
        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#E3859A] px-6 py-2 text-sm font-medium text-[#E3859A] transition-colors hover:bg-[#FFF0F2]">
          <span>Edit Image</span><Pencil size={14} />
          <input type="file" accept="image/*" onChange={onCoverImageChange} className="sr-only" />
        </label>
      </div>

      <div className="min-w-0 space-y-4 rounded-2xl border border-[#F4DDD2] bg-[#FFFCFA] p-4 sm:p-5">
        <div>
          <label htmlFor="book-title" className="mb-1.5 block text-sm font-semibold text-[#514256]">Book title</label>
          <input id="book-title" type="text" maxLength={100} value={title} onChange={(event) => onChange("title", event.target.value)} placeholder="Enter your Book title" className="h-11 w-full rounded-xl border border-[#F3A8B7] bg-white px-4 text-sm text-[#514256] transition focus:border-[#E3859A] focus:outline-none focus:ring-2 focus:ring-[#E3859A]/20" />
        </div>
        <div>
          <label htmlFor="title-position" className="mb-1.5 block text-sm font-semibold text-[#514256]">Position of the title</label>
          <Select value={titlePosition} onValueChange={(value) => value && onChange("titlePosition", value)}>
            <SelectTrigger id="title-position" className="h-11 w-full rounded-xl border-[#F3A8B7] bg-white px-4 text-[#514256] focus-visible:border-[#E3859A] focus-visible:ring-[#E3859A]/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border border-[#F3A8B7] bg-white text-[#514256] shadow-[0_10px_24px_rgba(91,69,78,0.16)]">
              <SelectItem value="Top" className="cursor-pointer py-2 focus:bg-[#FFF3F5] focus:text-[#514256]">Top</SelectItem>
              <SelectItem value="Middle" className="cursor-pointer py-2 focus:bg-[#FFF3F5] focus:text-[#514256]">Middle</SelectItem>
              <SelectItem value="Bottom" className="cursor-pointer py-2 focus:bg-[#FFF3F5] focus:text-[#514256]">Bottom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="creator-name" className="mb-1.5 block text-sm font-semibold text-[#514256]">Author</label>
          <input id="creator-name" type="text" maxLength={100} value={creatorName} onChange={(event) => onChange("creatorName", event.target.value)} placeholder="Enter your full name" className="h-11 w-full rounded-xl border border-[#F3A8B7] bg-white px-4 text-sm text-[#514256] transition focus:border-[#E3859A] focus:outline-none focus:ring-2 focus:ring-[#E3859A]/20" />
        </div>
        <div>
          <label htmlFor="back-cover-text" className="mb-1.5 block text-sm font-semibold text-[#514256]">Text on the back</label>
          <p className="mb-2 text-xs text-gray-400">A short introduction that makes readers curious.</p>
          <textarea id="back-cover-text" rows={5} maxLength={500} value={backCoverText} onChange={(event) => onChange("backCoverText", event.target.value)} placeholder="Lorem ipsum dolor sit amet..." className="w-full resize-none rounded-xl border border-[#F3A8B7] bg-white px-4 py-3 text-sm text-[#514256] transition focus:border-[#E3859A] focus:outline-none focus:ring-2 focus:ring-[#E3859A]/20" />
        </div>
      </div>
    </div>
  );
}
