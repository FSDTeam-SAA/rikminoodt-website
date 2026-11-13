"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Sparkles, X, Check, Loader2, RefreshCw, Palette } from "lucide-react";
import type { BookCharacter } from "./types";

type EditImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentImageUrl?: string;
  pageNumber?: number;
  isCover?: boolean;
  title?: string;
  bookId?: string;
  pageText?: string;
  illustrationStyle?: string;
  characters?: BookCharacter[];
  onApplyImage: (newImageUrl: string) => void;
};

const SUGGESTIONS = [
  "Add warmer sunset lighting",
  "Make the background more magical",
  "Add smiling friendly animals",
  "More vibrant colorful details",
  "Softer fairytale atmosphere",
];

export default function EditImageModal({
  isOpen,
  onClose,
  currentImageUrl,
  pageNumber,
  isCover = false,
  title,
  bookId,
  pageText,
  illustrationStyle,
  characters,
  onApplyImage,
}: EditImageModalProps) {
  const [instruction, setInstruction] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setPreviewImage(null);
      setError("");
      setInstruction("");
      setIsLoading(false);
    }
  }, [isOpen, pageNumber, isCover]);

  if (!isOpen) return null;

  const handleRegenerate = async () => {
    if (!instruction.trim()) {
      setError(
        isCover
          ? "Please describe how you would like the cover illustration to look."
          : "Please describe what changes you want for this illustration."
      );
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ai/regenerate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: bookId || "book-editor",
          pageNumber: isCover ? 1 : (pageNumber || 1),
          text: isCover ? (title || "Storybook cover") : (pageText || ""),
          instruction: instruction.trim(),
          illustrationStyle: illustrationStyle || "Watercolor",
          characters: characters || [],
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to generate image with AI right now.");
      }

      setPreviewImage(result.imageUrl);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message || "Failed to generate image with AI. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (previewImage) {
      onApplyImage(previewImage);
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-xl sm:max-w-2xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden border border-[#F3A8B7]/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-[#FFF7F9] to-[#FFF0F4] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FDE6EC] to-[#FCD5E0] text-[#E3859A] shadow-xs">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-gray-900">
                {isCover
                  ? "Regenerate Cover with AI"
                  : `Regenerate Illustration (Page ${pageNumber ?? 1})`}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                {isCover
                  ? "Describe your ideal book cover and AI will generate a new illustration."
                  : "Describe the changes you want and AI will redraw this page illustration."}
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 sm:text-sm"
            >
              {error}
            </div>
          )}

          {/* Style indicator */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#FFF9FA] border border-[#FAD7E0] px-4 py-2 text-xs sm:text-sm text-[#704652]">
            <span className="flex items-center gap-1.5 font-medium">
              <Palette size={15} className="text-[#E3859A]" />
              <span>Art Style:</span>
              <strong className="text-gray-900 font-semibold">
                {illustrationStyle || "Watercolor"}
              </strong>
            </span>
            {characters && characters.length > 0 && (
              <span className="text-xs text-gray-500">
                Characters:{" "}
                {characters
                  .map((c) => c.name || "Hero")
                  .filter(Boolean)
                  .join(", ")}
              </span>
            )}
          </div>

          {/* Side-by-side Image Previews */}
          <div className="grid grid-cols-2 gap-4">
            {/* Current Image */}
            <div className="flex flex-col items-center">
              <span className="mb-1.5 text-xs font-semibold text-gray-600">
                Current {isCover ? "Cover" : "Illustration"}
              </span>
              <div className="relative aspect-[3/4] w-full max-w-[200px] overflow-hidden rounded-xl bg-[#FFF7F9] shadow-md border border-gray-200">
                {currentImageUrl ? (
                  <Image
                    src={currentImageUrl}
                    alt="Current illustration"
                    fill
                    unoptimized
                    className="object-contain p-2"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-xs text-gray-400">
                    No Image
                  </span>
                )}
              </div>
            </div>

            {/* New AI Generated Image */}
            <div className="flex flex-col items-center">
              <span className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-[#E3859A]">
                {previewImage ? (
                  <>
                    <Check size={14} className="text-emerald-500" />
                    <span className="text-emerald-600">New AI Image Ready</span>
                  </>
                ) : (
                  <span>New AI Generated Image</span>
                )}
              </span>
              <div
                className={`relative aspect-[3/4] w-full max-w-[200px] overflow-hidden rounded-xl shadow-md transition-all ${
                  previewImage
                    ? "border-2 border-emerald-500 bg-emerald-50/20"
                    : isLoading
                    ? "border-2 border-dashed border-[#E3859A] bg-[#FFF0F4]/40 animate-pulse"
                    : "border-2 border-dashed border-gray-200 bg-gray-50/70"
                }`}
              >
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt="New AI generated illustration"
                    fill
                    unoptimized
                    className="object-contain p-2"
                  />
                ) : isLoading ? (
                  <div className="flex h-full flex-col items-center justify-center p-3 text-center">
                    <Loader2 size={24} className="animate-spin text-[#E3859A]" />
                    <span className="mt-2 text-xs font-medium text-[#704652]">
                      Generating with AI…
                    </span>
                    <span className="mt-0.5 text-[10px] text-gray-400">
                      (~15-30s)
                    </span>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                    <Sparkles size={22} className="text-gray-300" />
                    <span className="mt-2 text-xs text-gray-400">
                      New illustration will appear here
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description / Prompt Textarea */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-800">
              {isCover
                ? "Describe what you want on the cover:"
                : "Describe the changes for the new illustration:"}
            </label>
            <textarea
              rows={3}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder={
                isCover
                  ? "e.g. A magical children's book cover with our main character discovering a glowing treasure chest under tall oak trees, joyful expression, fairytale look..."
                  : "e.g. Change the background to a sunset beach, add cute smiling animals, make the trees taller and greener..."
              }
              className="w-full resize-none rounded-xl border border-[#F3A8B7] p-3 text-sm text-gray-800 placeholder-gray-400 focus:border-[#E3859A] focus:outline-none focus:ring-2 focus:ring-[#E3859A]/20"
            />

            {/* Quick Suggestion Chips */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-medium text-gray-400 mr-1">
                Quick ideas:
              </span>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    setInstruction((prev) =>
                      prev ? `${prev.trim()}, ${s.toLowerCase()}` : s
                    )
                  }
                  className="rounded-lg border border-[#FAD7E0] bg-[#FFF9FA] px-2.5 py-1 text-[11px] font-medium text-[#704652] transition-colors hover:bg-[#FFEBF1] hover:border-[#F3A8B7]"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/80 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200/60 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => void handleRegenerate()}
              className="flex items-center gap-2 rounded-xl border border-[#E3859A] bg-white px-5 py-2.5 text-sm font-semibold text-[#E3859A] hover:bg-[#FFF0F2] disabled:opacity-50 transition-colors shadow-xs active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Generating…</span>
                </>
              ) : previewImage ? (
                <>
                  <RefreshCw size={15} />
                  <span>Regenerate Again</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>Generate with AI</span>
                </>
              )}
            </button>

            {previewImage && (
              <button
                type="button"
                onClick={handleApply}
                className="flex items-center gap-2 rounded-xl bg-[#E3859A] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#d67288] transition-colors active:scale-[0.99]"
              >
                <Check size={16} />
                <span>Apply to Book</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
