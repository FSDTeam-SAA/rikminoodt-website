"use client";

import Image from "next/image";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  useLanguage,
  SUPPORTED_LANGUAGES,
} from "@/components/providers/LanguageProvider";

interface LanguageSwitcherProps {
  className?: string;
  isMobile?: boolean;
}

export default function LanguageSwitcher({ className = "", isMobile = false }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current =
    SUPPORTED_LANGUAGES.find((item) => item.code === language) ?? SUPPORTED_LANGUAGES[0];

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (isMobile) {
    return (
      <div className={`flex flex-col gap-1.5 py-1 ${className}`}>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#876d7c]">
          Language
        </span>
        <div className="flex gap-2">
          {SUPPORTED_LANGUAGES.map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => setLanguage(item.code)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-[#e88da0] text-white shadow-sm"
                    : "bg-white/70 text-[#5d5059] hover:bg-white"
                }`}
              >
                <div className="relative size-4 overflow-hidden rounded-full shrink-0 shadow-[0_0_1px_rgba(0,0,0,0.2)]">
                  <Image
                    src={item.flag}
                    alt=""
                    fill
                    sizes="16px"
                    className="object-cover"
                  />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-2.5 py-1.5 shadow-[0_2px_8px_rgba(74,63,82,0.06)] backdrop-blur transition-all duration-200 hover:border-[#e88da0]/40 hover:bg-white hover:shadow-[0_4px_12px_rgba(232,141,160,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#926daf]"
        aria-label={`Select language. Current: ${current.label}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="relative size-6 overflow-hidden rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.15)] shrink-0">
          <Image
            src={current.flag}
            alt={current.label}
            fill
            sizes="24px"
            priority
            className="object-cover"
          />
        </div>
        <span className="font-fredoka text-sm font-medium uppercase text-[#5a5358] transition-colors group-hover:text-[#e77f9a]">
          {current.code}
        </span>
        <ChevronDown
          size={14}
          className={`text-[#8c7e87] transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#e77f9a]" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Language selection"
          className="absolute right-0 top-full mt-2.5 z-[110] min-w-[170px] overflow-hidden rounded-2xl border border-[#F3A8B7]/60 bg-white/95 p-1.5 shadow-[0_10px_25px_rgba(74,63,82,0.15)] backdrop-blur-md animate-in fade-in-50 zoom-in-95 duration-150"
        >
          <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#9d8995]">
            Select Language
          </div>
          {SUPPORTED_LANGUAGES.map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setLanguage(item.code);
                  setIsOpen(false);
                }}
                className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-[#FFF0F3] text-[#e77f9a]"
                    : "text-[#5d5059] hover:bg-[#FBF3EA] hover:text-[#252025]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative size-5 overflow-hidden rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.1)] shrink-0">
                    <Image
                      src={item.flag}
                      alt=""
                      fill
                      sizes="20px"
                      className="object-cover"
                    />
                  </div>
                  <span>{item.label}</span>
                </div>
                {isSelected && (
                  <Check size={16} strokeWidth={2.4} className="text-[#e77f9a]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
