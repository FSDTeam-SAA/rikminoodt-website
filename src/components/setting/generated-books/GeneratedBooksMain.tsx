import { Plus } from "lucide-react";
import BookCard from "./BookCard";

export default function GeneratedBooksMain() {
  // Demo data for the books (Apni ekhane apnar ashol API data use korben)
  const books = [
    { id: 1, title: "Noah and the Ocean Friends", imageSrc: "/images/booksCover.png" },
    { id: 2, title: "Mia's Magic Garden", imageSrc: "/images/booksCover.png" },
    { id: 3, title: "Ben's Big Dream", imageSrc: "/images/booksCover.png" },
    { id: 4, title: "Noah and the Ocean Friends", imageSrc: "/images/booksCover.png" },
    { id: 5, title: "Ben's Big Dream", imageSrc: "/images/booksCover.png" },
    { id: 6, title: "Noah and the Ocean Friends", imageSrc: "/images/booksCover.png" },
    { id: 7, title: "Mia's Magic Garden", imageSrc: "/images/booksCover.png" },
    { id: 8, title: "Ben's Big Dream", imageSrc: "/images/booksCover.png" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif text-gray-800 mb-2">Generated Books</h1>
          <p className="text-sm text-gray-500">
            View all your generated storybooks.
          </p>
        </div>
        
        {/* Create Book Button */}
        <button className="flex items-center gap-2 bg-[#E3859A] hover:bg-[#d67288] text-white px-6 py-2.5 rounded-xl transition-colors font-medium text-sm shadow-sm">
          <span>Create Book</span>
          <Plus size={18} />
        </button>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10 mt-6">
        {books.map((book) => (
          <BookCard
            key={book.id} 
            title={book.title} 
            imageSrc={book.imageSrc} // Apnar backend theke asha ashol cover URL ekhane diben
          />
        ))}
      </div>
    </div>
  );
}