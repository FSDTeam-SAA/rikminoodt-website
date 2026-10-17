import Image from "next/image";
import { Pencil } from "lucide-react";

export default function CoverTab() {
  return (
    <div className="grid gap-6 p-4 sm:p-6 md:grid-cols-[minmax(220px,360px)_minmax(0,1fr)] md:gap-8">
      {/* Left Column: Book Image */}
      <div className="flex w-full flex-col items-center">
        <div className="relative mb-4 w-full max-w-[320px] aspect-[3/4] overflow-hidden rounded-md shadow-xl md:max-w-none">
          <Image
            src="https://images.unsplash.com/photo-1551009175-8a68da93d5f9?q=80&w=600&auto=format&fit=crop" // Replace with actual image
            alt="Book Cover"
            fill
            className="object-cover"
          />
        </div>
        <button className="flex items-center gap-2 border border-[#E3859A] text-[#E3859A] hover:bg-[#FFF0F2] px-6 py-2 rounded-xl transition-colors text-sm font-medium">
          <span>Edit Image</span>
          <Pencil size={14} />
        </button>
      </div>

      {/* Right Column: Form Fields */}
      <div className="min-w-0 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1.5">Book title</label>
          <input
            type="text"
            placeholder="Enter your Book title"
            className="w-full border border-[#F3A8B7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E3859A] focus:ring-1 focus:ring-[#E3859A]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1.5">Position of the title</label>
          <input
            type="text"
            placeholder="Middle"
            className="w-full border border-[#F3A8B7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E3859A] focus:ring-1 focus:ring-[#E3859A]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1.5">Author</label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full border border-[#F3A8B7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#E3859A] focus:ring-1 focus:ring-[#E3859A]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1.5">Text on the back</label>
          <p className="text-xs text-gray-400 mb-2">A short introduction that makes readers curious.</p>
          <textarea
            rows={5}
            placeholder="Lorem ipsum dolor sit amet..."
            className="w-full border border-[#F3A8B7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E3859A] focus:ring-1 focus:ring-[#E3859A] resize-none text-gray-500"
          ></textarea>
        </div>
      </div>
    </div>
  );
}
