"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Check } from "lucide-react";
import {
  useLanguage,
  SUPPORTED_LANGUAGES,
  LanguageCode,
} from "@/components/providers/LanguageProvider";

export default function LanguagePageSetting() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);

  // Currently active language object
  const currentLanguage =
    SUPPORTED_LANGUAGES.find((item) => item.code === language) ?? SUPPORTED_LANGUAGES[0];

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 font-crimson text-[24px] font-semibold text-[#1E1E1E]">
          {t.settings?.language || "Language"}
        </h1>
        <p className="font-sans text-base font-normal text-[#444444]">
          {t.settings?.languageSubtitle || "Choose your preferred language for the website."}
        </p>
      </div>

      {/* Select Field Container */}
      <div className="w-full">
        <label className="mb-2 block font-sans text-sm font-medium text-[#444444]">
          {t.settings?.language || "Language"}
        </label>

        {/* Selected Field Box (Clickable Trigger) */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-5 py-3.5 bg-white border border-[#F3A8B7] rounded-xl transition-all text-sm font-medium text-[#1E1E1E] focus:outline-none focus:ring-1 focus:ring-[#E88DA0]/30 hover:border-[#E88DA0]"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-3">
            <div className="relative size-5 overflow-hidden rounded-full shadow-sm shrink-0 border border-gray-100">
              <Image
                src={currentLanguage.flag}
                alt=""
                fill
                sizes="20px"
                className="object-cover"
              />
            </div>
            <span className="font-sans text-sm font-medium text-[#1E1E1E]">
              {currentLanguage.label}
              {currentLanguage.nativeLabel !== currentLanguage.label && (
                <span className="text-gray-400 font-normal"> ({currentLanguage.nativeLabel})</span>
              )}
            </span>
          </div>
          <ChevronDown
            size={18}
            className={`text-[#E88DA0] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* 3 Selectable Options */}
        {isOpen && (
          <div className="mt-2.5 flex flex-col gap-1 rounded-xl border border-[#F3A8B7]/40 bg-white p-1.5 shadow-sm">
            {SUPPORTED_LANGUAGES.map((item) => {
              const isSelected = language === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSelect(item.code)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                    isSelected
                      ? "bg-[#FFF0F2] text-[#E88DA0]"
                      : "text-[#444444] hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative size-5 overflow-hidden rounded-full shadow-sm shrink-0 border border-gray-100">
                      <Image
                        src={item.flag}
                        alt=""
                        fill
                        sizes="20px"
                        className="object-cover"
                      />
                    </div>
                    <span>{item.label}</span>
                    {item.nativeLabel !== item.label && (
                      <span className="text-xs text-gray-400">({item.nativeLabel})</span>
                    )}
                  </div>
                  {isSelected && (
                    <Check size={18} strokeWidth={2.4} className="text-[#E88DA0]" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
