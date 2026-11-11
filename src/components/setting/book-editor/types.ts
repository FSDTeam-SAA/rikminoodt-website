export type BookCharacter = {
  id?: string;
  _id?: string;
  name?: string;
  type?: string;
  age?: number;
  visualDescription?: string;
};

export type EditableBookPage = {
  pageNumber: number;
  storyPageNumber?: number;
  text: string;
  title?: string;
  imageUrl?: string;
  kind?: string;
};

export type EditableBook = {
  _id: string;
  title: string;
  titlePosition: "Top" | "Middle" | "Bottom";
  creatorName: string;
  backCoverText: string;
  foreword: string;
  font: string;
  coverImageUrl?: string;
  language?: string;
  theme?: string;
  subject?: string;
  illustrationStyle?: string;
  ageCategory?: string;
  characters?: BookCharacter[];
  pages: EditableBookPage[];
};
