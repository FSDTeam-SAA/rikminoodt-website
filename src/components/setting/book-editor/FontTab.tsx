import { useState } from "react";

export default function FontTab() {
  const [selectedFont, setSelectedFont] = useState("Storybook Classic");

  const fonts = [
    "Smooth Sands", "Bubbly Tales", "NEON NEXUS",
    "Cosy Curves", "Storybook Classic", "ADVENTURE BOOK",
    "School Script", "Soft Sand", "Fairy tale book"
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-sm font-medium text-gray-800 mb-1">Font</h2>
        <p className="text-xs text-gray-400 mb-4">Choose a font for your book.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fonts.map((font) => (
            <button
              key={font}
              onClick={() => setSelectedFont(font)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
                selectedFont === font
                  ? "border-[#E3859A] bg-[#FFF0F2] text-gray-800"
                  : "border-gray-200 bg-white text-gray-400 hover:bg-gray-50"
              }`}
            >
              <span className="text-sm">{font}</span>
              <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                selectedFont === font ? "border-[#E3859A]" : "border-gray-300"
              }`}>
                {selectedFont === font && <div className="w-1.5 h-1.5 rounded-full bg-[#E3859A]"></div>}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium text-gray-800 mb-1">Font Example</h2>
        <p className="text-xs text-gray-400 mb-3">See how your title and story look in this font.</p>
        
        <div className="bg-[#FAF6F2] rounded-xl p-6">
          <h3 className="text-xl font-serif text-gray-800 mb-3">Lisa&apos;s Campaign Adventure</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Dictum scelerisque turpis non mattis nisl nulla. 
            Ipsum rhoncus facilisis mattis cursus libero. Tellus non tristique posuere tristique ac. 
            Vitae tellus at amet iaculis eleifend viverra. Porta laoreet nunc iaculis risus a ut arcu scelerisque nisl.
          </p>
        </div>
      </div>
    </div>
  );
}
