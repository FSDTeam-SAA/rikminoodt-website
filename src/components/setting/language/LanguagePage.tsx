"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

export default function LanguagePageSetting() {
  // Dropdown open/close state
  const [isOpen, setIsOpen] = useState(true); // by default open rakhlam chobir moto dekhate
  // Selected language state
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const languages = ["English", "French", "Dutch"];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 h-full min-h-[500px]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-gray-800 mb-2">Language</h1>
        <p className="text-sm text-gray-500">
          Choose your preferred language for the website.
        </p>
      </div>

      {/* Custom Select / Dropdown */}
      <div className="max-w-3xl">
        {/* Dropdown Trigger Box */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-5 py-3.5 bg-white border border-[#F2C2CB] rounded-xl transition-colors text-sm text-gray-400 font-medium focus:outline-none"
        >
          <span>Language</span>
          {isOpen ? (
            <ChevronDown size={18} className="text-gray-400" />
          ) : (
            <ChevronRight size={18} className="text-gray-400" />
          )}
        </button>

        {/* Dropdown Options List */}
        {isOpen && (
          <div className="mt-2 flex flex-col gap-1">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`w-full text-left px-5 py-3.5 rounded-xl transition-colors text-sm font-medium ${
                  selectedLanguage === lang
                    ? "bg-[#FFF0F2] text-gray-800" // Selected obosthay pinkish background
                    : "bg-transparent text-gray-600 hover:bg-gray-50"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}