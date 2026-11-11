"use client";

import { useState } from "react";
import { Sparkles, X, Check, Loader2 } from "lucide-react";
import type { BookCharacter } from "./types";

type TextAiHelpModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentText: string;
  onApply: (newText: string) => void;
  pageNumber?: number;
  bookId?: string;
  language?: string;
  ageCategory?: string;
  theme?: string;
  illustrationStyle?: string;
  characters?: BookCharacter[];
  isPreface?: boolean;
};

export default function TextAiHelpModal({
  isOpen,
  onClose,
  currentText,
  onApply,
  pageNumber,
  bookId,
  language,
  ageCategory,
  theme,
  illustrationStyle,
  characters,
  isPreface = false,
}: TextAiHelpModalProps) {
  const [instruction, setInstruction] = useState("");
  const [suggestedText, setSuggestedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const presets = isPreface
    ? [
        "Warm & heartfelt dedication",
        "Encouraging words of love",
        "Short & sweet personal message",
      ]
    : [
        "More adventurous & exciting",
        "Gentle & soothing for bedtime",
        "Simple words for younger kids",
        "Poetic & playful rhyming",
      ];

  const handleGenerate = async (customInstruction?: string) => {
    setIsLoading(true);
    setError("");
    const activeInstruction = customInstruction || instruction;

    try {
      const response = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          pageNumber,
          text: currentText,
          instruction: activeInstruction || (isPreface ? "Make it a warm and touching personal dedication" : "Rewrite the text to be engaging and magical for children"),
          language,
          ageCategory,
          theme,
          illustrationStyle,
          characters,
          isPreface,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to rewrite text at this moment.");
      }

      setSuggestedText(result.text);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error?.message || "Failed to generate AI rewrite. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (suggestedText) {
      onApply(suggestedText);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl sm:max-w-3xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-[#FFF7F9] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E3859A]/15 text-[#E3859A]">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-gray-900">
                {isPreface ? "AI Preface Assistant" : `AI Story Help ${pageNumber ? `(Page ${pageNumber})` : ""}`}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {isPreface
                  ? "Craft a beautiful, heartwarming dedication message."
                  : "Polish, enrich, or rewrite your story text with AI."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-xl p-2 text-gray-400 hover:bg-white hover:text-gray-600 transition-colors shadow-xs"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="rounded-xl bg-red-50 p-3.5 text-sm text-red-600 border border-red-100">
              {error}
            </div>
          )}

          {/* Current text preview */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Current Text
            </label>
            <div className="max-h-36 overflow-y-auto rounded-xl border border-[#F4DDD2] bg-[#FFFAF8] p-4 text-sm sm:text-base leading-relaxed text-gray-700 whitespace-pre-line">
              {currentText || <span className="italic text-gray-400">No text written yet.</span>}
            </div>
          </div>

          {/* AI Guidance / Instructions */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              How would you like to improve it? (Optional)
            </label>
            <input
              type="text"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="e.g. Make it more exciting, add playful rhymes..."
              className="h-11 w-full rounded-xl border border-[#F3A8B7] px-4 text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:border-[#E3859A] focus:outline-none focus:ring-2 focus:ring-[#E3859A]/20"
            />
            {/* Quick preset chips */}
            <div className="mt-2.5 flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setInstruction(preset);
                    void handleGenerate(preset);
                  }}
                  className="rounded-full border border-[#F3A8B7] bg-[#FFF0F2] px-3.5 py-1.5 text-xs sm:text-sm font-medium text-[#d6657e] hover:bg-[#ffe1e6] hover:border-[#E3859A] transition-colors"
                >
                  ✨ {preset}
                </button>
              ))}
            </div>
          </div>

          {/* AI Output / Suggestion */}
          {suggestedText && (
            <div className="rounded-2xl border-2 border-[#F3A8B7] bg-[#FFF9FA] p-5 shadow-sm">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm font-bold text-[#E3859A]">
                  <Sparkles size={16} /> AI Suggestion
                </span>
                <span className="rounded-full border border-pink-200 bg-white px-2.5 py-0.5 text-xs font-medium text-[#E3859A]">
                  You can edit below before applying
                </span>
              </div>
              <textarea
                rows={5}
                value={suggestedText}
                onChange={(e) => setSuggestedText(e.target.value)}
                className="w-full resize-none rounded-xl border border-[#F3A8B7] bg-white p-4 font-serif text-sm sm:text-base leading-relaxed text-gray-800 focus:border-[#E3859A] focus:outline-none focus:ring-2 focus:ring-[#E3859A]/20"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/70 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200/60 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isLoading || !currentText.trim()}
              onClick={() => void handleGenerate()}
              className="flex items-center gap-2 rounded-xl border border-[#E3859A] bg-white px-5 py-2.5 text-sm font-semibold text-[#E3859A] hover:bg-[#FFF0F2] disabled:opacity-50 transition-colors shadow-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Rewriting with AI…</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>{suggestedText ? "Try Another Version" : "Rewrite with AI"}</span>
                </>
              )}
            </button>

            {suggestedText && (
              <button
                type="button"
                onClick={handleApply}
                className="flex items-center gap-2 rounded-xl bg-[#E3859A] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#d67288] transition-colors"
              >
                <Check size={16} />
                <span>Apply to {isPreface ? "Preface" : "Page"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
