"use client";

import { Sparkles } from "lucide-react";

type PrefaceTabProps = { value: string; onChange: (value: string) => void };

export default function PrefaceTab({ value, onChange }: PrefaceTabProps) {
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-800">Preface</h2>
          <p className="mt-1 text-xs text-gray-400">A personal message to the reader, before the story begins.</p>
        </div>
        <button type="button" className="flex items-center gap-2 rounded-xl bg-[#FFF0F2] px-4 py-2 text-sm font-medium text-[#E3859A] transition-colors hover:bg-[#ffe1e6]">
          <Sparkles size={16} />
          <span>Help me with preface</span>
        </button>
      </div>
      <div className="mt-4">
        <textarea rows={10} maxLength={1000} value={value} onChange={(event) => onChange(event.target.value)} placeholder="Write a personal message for your reader..." className="w-full resize-none rounded-xl border border-[#F3A8B7] px-5 py-4 text-sm text-gray-500 focus:border-[#E3859A] focus:outline-none focus:ring-1 focus:ring-[#E3859A]" />
      </div>
    </div>
  );
}
