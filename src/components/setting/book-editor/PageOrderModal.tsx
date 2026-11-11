"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Check, X, GripVertical } from "lucide-react";
import type { EditableBookPage } from "./types";

type PageOrderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  pages: EditableBookPage[];
  onApplyOrder: (newPages: EditableBookPage[]) => void;
};

export default function PageOrderModal({
  isOpen,
  onClose,
  pages,
  onApplyOrder,
}: PageOrderModalProps) {
  // Only reorder story spreads (keep welcome/preface and finalMessage locked if needed, or reorder all editable)
  const [orderedPages, setOrderedPages] = useState<EditableBookPage[]>(() => [...pages]);

  if (!isOpen) return null;

  const movePage = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= orderedPages.length) return;

    const updated = [...orderedPages];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    // Re-assign storyPageNumber sequentially to reflect the new order
    const reassigned = updated.map((p, idx) => ({
      ...p,
      storyPageNumber: p.kind === "story" ? idx + 1 : p.storyPageNumber,
    }));

    setOrderedPages(reassigned);
  };

  const handleApply = () => {
    onApplyOrder(orderedPages);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-[#FFF7F9] px-6 py-4">
          <div>
            <h3 className="font-sans text-base font-semibold text-gray-900">
              Reorder Pages
            </h3>
            <p className="text-xs text-gray-500">
              Use the up and down arrows to rearrange the story sequence.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* List of Pages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2.5">
          {orderedPages.map((page, index) => {
            const isFirst = index === 0;
            const isLast = index === orderedPages.length - 1;

            return (
              <div
                key={`${page.pageNumber}-${index}`}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 shadow-xs hover:border-[#F3A8B7] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="text-gray-400">
                    <GripVertical size={16} />
                  </div>

                  <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-md bg-[#FFF7F9] border border-gray-100">
                    {page.imageUrl ? (
                      <Image
                        src={page.imageUrl}
                        alt=""
                        fill
                        unoptimized
                        className="object-contain p-0.5"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center text-[10px] text-gray-400">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-[#FFF0F2] px-2 py-0.5 text-[10px] font-semibold text-[#E3859A]">
                        Spread {index + 1}
                      </span>
                      {page.title && (
                        <span className="truncate text-xs font-semibold text-gray-800">
                          {page.title}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-gray-500 max-w-xs mt-0.5">
                      {page.text || "Empty page"}
                    </p>
                  </div>
                </div>

                {/* Move buttons */}
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    type="button"
                    disabled={isFirst}
                    onClick={() => movePage(index, "up")}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-[#FFF0F2] hover:text-[#E3859A] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-colors"
                    title="Move up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    disabled={isLast}
                    onClick={() => movePage(index, "down")}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-[#FFF0F2] hover:text-[#E3859A] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-colors"
                    title="Move down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex items-center gap-1.5 rounded-xl bg-[#E3859A] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#d67288] transition-colors"
          >
            <Check size={14} />
            <span>Apply Page Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}
