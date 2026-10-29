"use client";

import { BOOK_FONT_OPTIONS, getBookFontFamily } from "@/lib/book-font";

type FontTabProps = { value: string; title: string; sampleText: string; onChange: (value: string) => void };

export default function FontTab({ value, title, sampleText, onChange }: FontTabProps) {
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="mb-1 text-sm font-medium text-gray-800">Font</h2>
        <p className="mb-4 text-xs text-gray-400">Choose a font for your book.</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {BOOK_FONT_OPTIONS.map((font) => (
            <button key={font.value} type="button" onClick={() => onChange(font.value)} className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-colors ${value === font.value ? "border-[#E3859A] bg-[#FFF0F2] text-gray-800" : "border-gray-200 bg-white text-gray-400 hover:bg-gray-50"}`}>
              <span className="text-sm" style={{ fontFamily: getBookFontFamily(font.value) }}>{font.label}</span>
              <span className={`flex size-3.5 items-center justify-center rounded-full border ${value === font.value ? "border-[#E3859A]" : "border-gray-300"}`}>{value === font.value && <span className="size-1.5 rounded-full bg-[#E3859A]" />}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h2 className="mb-1 text-sm font-medium text-gray-800">Font Example</h2>
        <p className="mb-3 text-xs text-gray-400">See how your title and story look in this font.</p>
        <div className="rounded-xl bg-[#FAF6F2] p-6">
          <h3 className="mb-3 text-xl text-gray-800" style={{ fontFamily: getBookFontFamily(value) }}>{title || "Your storybook"}</h3>
          <p className="text-sm leading-relaxed text-gray-600" style={{ fontFamily: getBookFontFamily(value) }}>{sampleText || "Your story will appear here."}</p>
        </div>
      </div>
    </div>
  );
}
