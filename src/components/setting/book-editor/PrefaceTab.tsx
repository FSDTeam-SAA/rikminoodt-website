import { Sparkles } from "lucide-react";

export default function PrefaceTab() {
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-800">Preface</h2>
          <p className="text-xs text-gray-400 mt-1">A personal message to the reader, before the story begins.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#FFF0F2] text-[#E3859A] hover:bg-[#ffe1e6] px-4 py-2 rounded-xl transition-colors text-sm font-medium">
          <Sparkles size={16} />
          <span>Help me with preface</span>
        </button>
      </div>

      <div className="mt-4">
        <textarea
          rows={10}
          placeholder="Lorem ipsum dolor sit amet consectetur..."
          className="w-full border border-[#F3A8B7] rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-[#E3859A] focus:ring-1 focus:ring-[#E3859A] resize-none text-gray-500"
          defaultValue="Lorem ipsum dolor sit amet consectetur. Dictum scelerisque turpis non mattis nisl nulla. Ipsum rhoncus facilisis mattis cursus libero. Tellus non tristique posuere tristique ac. Vitae tellus at amet iaculis eleifend viverra. Porta laoreet nunc iaculis risus a ut arcu scelerisque nisl."
        ></textarea>
      </div>
    </div>
  );
}
