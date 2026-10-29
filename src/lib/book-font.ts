export const BOOK_FONT_OPTIONS = [
  { value: "SMOOTH_SANDS", label: "Smooth Sands" },
  { value: "BUBBLY_TALES", label: "Bubbly Tales" },
  { value: "NEON_NEXUS", label: "NEON NEXUS" },
  { value: "COSY_CURVES", label: "Cosy Curves" },
  { value: "STORYBOOK_CLASSIC", label: "Storybook Classic" },
  { value: "ADVENTURE_BOOK", label: "ADVENTURE BOOK" },
  { value: "SCHOOL_SCRIPT", label: "School Script" },
  { value: "CANDY_DREAMS", label: "Candy Dreams" },
] as const;

const FONT_FAMILIES: Record<string, string> = {
  STORYBOOK_CLASSIC: '"Crimson Text", Georgia, serif',
  SMOOTH_SANDS: '"Nunito Sans", Arial, sans-serif',
  BUBBLY_TALES: '"Fredoka One", "Nunito Sans", sans-serif',
  CANDY_DREAMS: '"Fredoka One", cursive',
  NEON_NEXUS: 'Inter, "Courier New", monospace',
  COSY_CURVES: '"Crimson Text", Georgia, serif',
  SCHOOL_SCRIPT: '"Comic Sans MS", "Bradley Hand", cursive',
  ADVENTURE_BOOK: 'Georgia, "Times New Roman", serif',
};

export function getBookFontFamily(font?: string) {
  return FONT_FAMILIES[font || ""] || FONT_FAMILIES.STORYBOOK_CLASSIC;
}
