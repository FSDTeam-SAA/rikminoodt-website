"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import CoverTab from "@/components/setting/book-editor/CoverTab";
import PrefaceTab from "@/components/setting/book-editor/PrefaceTab";
import StoryTab from "@/components/setting/book-editor/StoryTab";
import FontTab from "@/components/setting/book-editor/FontTab";

type Tab = "cover" | "preface" | "story" | "font";

export default function BookEditorPage() {
  const [activeTab, setActiveTab] = useState<Tab>("cover");

  const tabs: { id: Tab; label: string }[] = [
    { id: "cover", label: "Cover" },
    { id: "preface", label: "Preface" },
    { id: "story", label: "Story" },
    { id: "font", label: "Font" },
  ];

  return (
    <div className="min-h-screen bg-[#FCF8F5] px-4 py-6 pb-12 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        
        {/* Main Editor Card */}
        <div className="relative rounded-2xl bg-white p-4 shadow-sm sm:p-6">
          
          {/* Header & Back Button */}
          <div className="mb-6 relative z-10">
            <Link href="/setting/generated-books" className="inline-flex items-center gap-2 text-gray-800 hover:text-gray-600 mb-1">
              <ChevronLeft size={20} />
              <span className="font-serif text-xl">Back to your book</span>
            </Link>
            <p className="text-sm text-gray-500 ml-7">Edit your generated storybooks.</p>
          </div>

          {/* Decorative Cloud (Optional/Positioned absolute) */}
          <div className="absolute top-6 right-10 opacity-60">
            {/* Chobir moto cloud er image jodi thake tahole ekhane add korte paren */}
            <div className="w-20 h-10 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full blur-xl"></div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 flex flex-wrap gap-2.5 sm:gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-colors sm:px-8 ${
                  activeTab === tab.id
                    ? "bg-[#E3859A] text-white shadow-sm"
                    : "bg-white border border-[#E3859A] text-[#E3859A] hover:bg-[#FFF0F2]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Content Area with Orange Border */}
          <div className="border border-[#F0A976] rounded-xl overflow-hidden bg-white">
            {activeTab === "cover" && <CoverTab />}
            {activeTab === "preface" && <PrefaceTab />}
            {activeTab === "story" && <StoryTab />}
            {activeTab === "font" && <FontTab />}
          </div>
        </div>

        {/* Save Button (Outside Card) */}
        <div className="flex justify-center mt-8">
          <button className="bg-[#E3859A] hover:bg-[#d67288] text-white px-10 py-3 rounded-xl transition-colors font-medium text-sm shadow-md">
            Save and View Book
          </button>
        </div>

      </div>
    </div>
  );
}
