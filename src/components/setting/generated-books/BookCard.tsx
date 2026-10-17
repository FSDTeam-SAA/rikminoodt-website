import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";

interface BookCardProps {
  title: string;
  imageSrc: string;
}

export default function BookCard({ title, imageSrc }: BookCardProps) {
  return (
    <div className="flex flex-col items-center group cursor-pointer">
      {/* Book Cover */}
      <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden shadow-lg group-hover:-translate-y-2 transition-transform duration-300 z-10">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Book shadow/lighting effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10 mix-blend-overlay"></div>
        <Link
          href="/setting/edit-book"
          aria-label={`Edit ${title}`}
          className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-white/95 text-[#E3859A] shadow-md transition hover:scale-105 hover:bg-[#E3859A] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3859A] focus-visible:ring-offset-2"
        >
          <Pencil size={16} aria-hidden="true" />
        </Link>
      </div>
      
      {/* Wooden Shelf Underneath */}
      <div className="w-[110%] h-3 bg-[#D29D59] rounded-b-md shadow-md mt-[-2px] border-t border-[#C08C4A] bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>
    </div>
  );
}
