"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { Sparkles, Upload, X, Check, Loader2, RefreshCw } from "lucide-react";
import type { BookCharacter } from "./types";

type EditImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentImageUrl?: string;
  pageNumber: number;
  bookId?: string;
  pageText?: string;
  illustrationStyle?: string;
  characters?: BookCharacter[];
  onApplyImage: (newImageUrl: string) => void;
};

export default function EditImageModal({
  isOpen,
  onClose,
  currentImageUrl,
  pageNumber,
  bookId,
  pageText,
  illustrationStyle,
  characters,
  onApplyImage,
}: EditImageModalProps) {
  const [instruction, setInstruction] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"ai" | "upload">("upload");
  const [error, setError] = useState("");

  // Reset state when modal opens or page changes
  useEffect(() => {
    if (isOpen) {
      setPreviewImage(null);
      setError("");
      setInstruction("");
      setIsUploading(false);
      setIsLoading(false);
      setUploadSuccess(false);
    }
  }, [isOpen, pageNumber]);

  if (!isOpen) return null;

  const handleRegenerate = async () => {
    if (!instruction.trim()) {
      setError("Please describe what changes you want for this illustration.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ai/regenerate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          pageNumber,
          text: pageText,
          instruction: instruction.trim(),
          illustrationStyle,
          characters,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to regenerate image right now.");
      }

      setPreviewImage(result.imageUrl);
      onApplyImage(result.imageUrl);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error?.message || "Failed to regenerate image with AI.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setIsUploading(true);
    setError("");
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Failed to upload image. Please try again.");
      }

      setPreviewImage(data.url);
      setUploadSuccess(true);
      // Immediately apply the new image to the page!
      onApplyImage(data.url);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error?.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleApply = () => {
    if (previewImage) {
      onApplyImage(previewImage);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative flex max-h-[90vh] w-full max-w-xl sm:max-w-2xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-[#FFF7F9] px-6 py-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-gray-900">
              Edit Illustration (Page {pageNumber})
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Upload a custom image or regenerate with AI by describing changes.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-xl p-2 text-gray-400 hover:bg-white hover:text-gray-600 transition-colors shadow-xs"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2 border-b-2 px-5 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === "upload"
                ? "border-[#E3859A] text-[#E3859A]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Upload size={16} />
            <span>Upload Image</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-2 border-b-2 px-5 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === "ai"
                ? "border-[#E3859A] text-[#E3859A]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Sparkles size={16} />
            <span>Regenerate with AI</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-100">
              {error}
            </div>
          )}

          {/* Image Preview Area */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-4">
            <div className="flex flex-col items-center">
              <span className="mb-1 text-[11px] font-medium text-gray-500">Current</span>
              <div className="relative h-32 w-24 overflow-hidden rounded-lg bg-white shadow-sm border border-gray-100">
                {currentImageUrl ? (
                  <Image src={currentImageUrl} alt="Current page" fill unoptimized className="object-contain p-1" />
                ) : (
                  <span className="flex h-full items-center justify-center text-xs text-gray-400">No Image</span>
                )}
              </div>
            </div>

            {previewImage && (
              <div className="flex flex-col items-center">
                <span className="mb-1 text-[11px] font-semibold text-[#E3859A]">New Image Applied ✓</span>
                <div className="relative h-32 w-24 overflow-hidden rounded-lg bg-white shadow-sm border-2 border-[#E3859A]">
                  <Image src={previewImage} alt="New illustration" fill unoptimized className="object-contain p-1" />
                </div>
              </div>
            )}
          </div>

          {activeTab === "upload" ? (
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Choose an image from your computer:
              </label>
              <input
                type="file"
                accept="image/*"
                disabled={isUploading}
                onChange={handleFileUpload}
                className="w-full text-sm text-gray-500 file:mr-4 file:rounded-xl file:border-0 file:bg-[#FFF0F2] file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-[#E3859A] hover:file:bg-[#ffe1e6] disabled:opacity-50 cursor-pointer"
              />
              {isUploading && (
                <div className="mt-3 flex items-center gap-2 text-sm font-medium text-[#E3859A]">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Uploading image to cloud…</span>
                </div>
              )}
              {uploadSuccess && (
                <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-600">
                  <Check size={16} />
                  <span>Image uploaded and applied to page!</span>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Describe the changes for the new illustration:
              </label>
              <textarea
                rows={3}
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="e.g. Change the background to a sunset, add friendly animals smiling, make the trees taller..."
                className="w-full resize-none rounded-xl border border-[#F3A8B7] p-3.5 text-sm text-gray-800 placeholder-gray-400 focus:border-[#E3859A] focus:outline-none focus:ring-2 focus:ring-[#E3859A]/20"
              />
              <p className="mt-1.5 text-xs text-gray-400">
                The AI will use your story text and style ({illustrationStyle || "Watercolor"}) to render the new picture.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/70 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200/60 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {activeTab === "ai" && (
              <button
                type="button"
                disabled={isLoading}
                onClick={() => void handleRegenerate()}
                className="flex items-center gap-2 rounded-xl border border-[#E3859A] bg-white px-5 py-2.5 text-sm font-semibold text-[#E3859A] hover:bg-[#FFF0F2] disabled:opacity-50 transition-colors shadow-xs"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Generating Illustration…</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    <span>Regenerate Image</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-2 rounded-xl bg-[#E3859A] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#d67288] transition-colors"
            >
              <Check size={16} />
              <span>{previewImage ? "Done & Keep Image" : "Close"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
