"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import TextAiHelpModal from "./TextAiHelpModal";
import type { BookCharacter } from "./types";

type PrefaceTabProps = {
  value: string;
  onChange: (value: string) => void;
  bookId?: string;
  language?: string;
  ageCategory?: string;
  theme?: string;
  characters?: BookCharacter[];
};

export default function PrefaceTab({
  value,
  onChange,
  bookId,
  language,
  ageCategory,
  theme,
  characters,
}: PrefaceTabProps) {
  const { t } = useLanguage();
  const prefaceT = t.settings?.editBook?.preface;
  const [isAiHelpOpen, setIsAiHelpOpen] = useState(false);

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-800">{prefaceT?.title || "Preface"}</h2>
          <p className="mt-1 text-xs text-gray-400">
            {prefaceT?.subtitle || "A personal message to the reader, before the story begins."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAiHelpOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#FFF0F2] px-4 py-2 text-sm font-medium text-[#E3859A] transition-colors hover:bg-[#ffe1e6] active:scale-[0.99] shadow-xs"
        >
          <Sparkles size={16} />
          <span>{prefaceT?.helpButton || "Help me with preface"}</span>
        </button>
      </div>
      <div className="mt-4">
        <textarea
          rows={10}
          maxLength={1000}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={prefaceT?.placeholder || "Write a personal message for your reader..."}
          className="w-full resize-none rounded-xl border border-[#F3A8B7] px-5 py-4 text-sm text-gray-700 leading-relaxed focus:border-[#E3859A] focus:outline-none focus:ring-1 focus:ring-[#E3859A]"
        />
      </div>

      <TextAiHelpModal
        isOpen={isAiHelpOpen}
        onClose={() => setIsAiHelpOpen(false)}
        currentText={value}
        onApply={(newText) => onChange(newText)}
        bookId={bookId}
        language={language}
        ageCategory={ageCategory}
        theme={theme}
        characters={characters}
        isPreface={true}
      />
    </div>
  );
}
