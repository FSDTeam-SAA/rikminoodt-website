"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BookOpen } from "lucide-react";

interface BookCardProps {
  id?: string;
  title: string;
  imageSrc?: string;
  status: string;
}

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  PENDING_PAYMENT: "Awaiting payment",
  SUBMITTED: "Submitted",
  GENERATING: "Generating",
  COMPLETED: "Completed",
  FAILED: "Generation failed",
};

export default function BookCard({ id, title, imageSrc, status }: BookCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const card = (
    <article className="group flex min-w-0 flex-col items-center transition-transform duration-200 hover:-translate-y-1">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-[#f9edf0] shadow-lg transition-shadow duration-200 group-hover:shadow-xl">
        {imageSrc && !imageFailed ? (
          <Image
            src={imageSrc}
            alt={`Cover of ${title}`}
            fill
            unoptimized
            onError={() => setImageFailed(true)}
            className="object-cover"
            sizes="(max-width: 767px) 45vw, (max-width: 1199px) 30vw, 20vw"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center text-[#a66b7e]">
            <BookOpen size={36} aria-hidden="true" />
            <span className="font-crimson text-lg font-semibold">{title}</span>
          </div>
        )}
      </div>
      <div aria-hidden="true" className="-mt-0.5 h-3 w-[105%] rounded-b-md border-t border-[#C08C4A] bg-[#D29D59] shadow-md" />
      <h2 className="mt-3 w-full break-words text-center text-sm font-semibold text-[#514256] transition-colors group-hover:text-[#E3859A]">
        {title}
      </h2>
      <p className="mt-1 text-center text-xs text-[#81717a]">
        {statusLabels[status] ?? status.toLowerCase().replaceAll("_", " ")}
      </p>
    </article>
  );

  if (id) {
    return (
      <Link href={`/story-books/book-details/${id}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3859A] rounded-md">
        {card}
      </Link>
    );
  }

  return card;
}
