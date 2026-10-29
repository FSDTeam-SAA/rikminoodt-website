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
  pages: EditableBookPage[];
};
